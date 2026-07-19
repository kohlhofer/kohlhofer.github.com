#!/usr/bin/env node
// Google Search Console CLI. Zero dependencies — Node's built-in fetch and crypto.
//
// Authenticates as a service account, so there's no browser consent, no consent
// screen, and no refresh token to expire. The key lives in ~/.config/nsct-gsc/key.json,
// deliberately outside this repo so a stray `git add` can't publish it.
//
//   node scripts/gsc.mjs email                   service account address to grant in GSC
//   node scripts/gsc.mjs sites                   list properties it can see
//   node scripts/gsc.mjs query [flags]           search analytics
//
// Query flags: --dim query|page|country|device|date|searchAppearance (repeatable
// as a comma list), --days N, --start/--end YYYY-MM-DD, --limit N, --site URL,
// --json.

import { createSign } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const KEY_PATH = join(homedir(), '.config', 'nsct-gsc', 'key.json')
// Full scope rather than .readonly — the API's only meaningful writes are
// sitemap submit/delete and adding properties. Everything else in Search
// Console (indexing requests, removals, disavow, users) is UI-only at any scope.
const SCOPE = 'https://www.googleapis.com/auth/webmasters'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const API = 'https://searchconsole.googleapis.com/webmasters/v3'
const API_V1 = 'https://searchconsole.googleapis.com/v1'

const b64url = (input) => Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

function die(msg) {
  console.error(msg)
  process.exit(1)
}

async function readKey() {
  let raw
  try {
    raw = await readFile(KEY_PATH, 'utf8')
  } catch {
    die(
      `No service account key at ${KEY_PATH}\n\n` +
        `In Google Cloud Console: IAM & Admin > Service Accounts > Create service\n` +
        `account, then Keys > Add key > JSON. Save the download to that path.`
    )
  }
  const key = JSON.parse(raw)
  if (!key.client_email || !key.private_key) die(`${KEY_PATH} is not a service account key (no client_email/private_key).`)
  return key
}

// Self-signed JWT exchanged for an access token. Tokens last an hour and each
// CLI run is short, so we mint one per process rather than caching to disk.
let cachedToken
async function accessToken() {
  if (cachedToken) return cachedToken
  const key = await readKey()
  const now = Math.floor(Date.now() / 1000)
  const claims = { iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }
  const signingInput = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify(claims))}`
  const signature = createSign('RSA-SHA256').update(signingInput).sign(key.private_key)
  const assertion = `${signingInput}.${b64url(signature)}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  })
  const tok = await res.json()
  if (!res.ok) die(`Token request failed: ${JSON.stringify(tok)}`)
  cachedToken = tok.access_token
  return cachedToken
}

async function request(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json', ...init.headers },
  })
  // Sitemap PUT/DELETE answer 204 with an empty body.
  const body = await res.json().catch(() => ({}))
  if (!res.ok) die(`API ${res.status}: ${JSON.stringify(body.error ?? body)}`)
  return body
}

const api = (path, init) => request(`${API}${path}`, init)
const apiV1 = (path, init) => request(`${API_V1}${path}`, init)

const listSites = () => api('/sites').then((r) => r.siteEntry ?? [])

// Precedence: --site flag, GSC_SITE env, a .gsc-site file next to the script's
// repo root, then the sole property if there's exactly one. The file is what
// makes this drop-in per repo once the account can see several properties.
async function resolveSite(flag) {
  const explicit = flag ?? process.env.GSC_SITE
  if (explicit) return explicit

  const pinned = await readFile(new URL('../.gsc-site', import.meta.url), 'utf8').catch(() => null)
  if (pinned?.trim()) return pinned.trim()

  const owned = (await listSites()).filter((s) => s.permissionLevel !== 'siteUnverifiedUser')
  if (owned.length === 1) return owned[0].siteUrl
  if (owned.length) die(`Multiple properties — pass --site:\n${owned.map((s) => `  ${s.siteUrl}`).join('\n')}`)
  const { client_email } = await readKey()
  die(
    `No properties visible to this service account.\n\n` +
      `In Search Console: Settings > Users and permissions > Add user\n` +
      `  ${client_email}   (Full permission)`
  )
}

const isoDay = (offsetDays) => new Date(Date.now() - offsetDays * 86_400_000).toISOString().slice(0, 10)

function parseArgs(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const [k, inline] = a.slice(2).split('=')
      const next = argv[i + 1]
      if (inline !== undefined) out[k] = inline
      else if (next && !next.startsWith('--')) out[k] = argv[++i]
      else out[k] = true
    } else out._.push(a)
  }
  return out
}

async function query(args) {
  const site = await resolveSite(args.site)
  const dims = String(args.dim ?? 'query').split(',').map((d) => d.trim()).filter(Boolean)
  // GSC data lags ~2-3 days, so an "ending today" window reads as a false drop.
  const end = args.end ?? isoDay(3)
  const start = args.start ?? isoDay(3 + Number(args.days ?? 28))
  const rowLimit = Number(args.limit ?? 25)

  const body = await api(`/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: 'POST',
    body: JSON.stringify({ startDate: start, endDate: end, dimensions: dims, rowLimit }),
  })
  const rows = body.rows ?? []

  if (args.json) {
    console.log(JSON.stringify({ site, start, end, dimensions: dims, rows }, null, 2))
    return
  }

  console.log(`\n${site}   ${start} → ${end}   (${dims.join(' × ')})\n`)
  if (!rows.length) {
    console.log('No rows. New or low-traffic properties often return nothing for short windows.\n')
    return
  }

  const label = (r) => r.keys.join('  ·  ')
  const width = Math.min(Math.max(...rows.map((r) => label(r).length), 10), 70)
  const totals = rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }), { clicks: 0, impressions: 0 })

  console.log(`${''.padEnd(width)}  ${'clicks'.padStart(7)} ${'impr'.padStart(8)} ${'ctr'.padStart(7)} ${'pos'.padStart(6)}`)
  for (const r of rows) {
    const name = label(r)
    const cell = name.length > width ? name.slice(0, width - 1) + '…' : name.padEnd(width)
    console.log(
      `${cell}  ${String(r.clicks).padStart(7)} ${String(r.impressions).padStart(8)} ` +
        `${(r.ctr * 100).toFixed(1).padStart(6)}% ${r.position.toFixed(1).padStart(6)}`
    )
  }
  console.log(`\n${rows.length} rows · ${totals.clicks} clicks · ${totals.impressions} impressions\n`)
}

async function sitemaps(args) {
  const site = await resolveSite(args.site)
  const list = (await api(`/sites/${encodeURIComponent(site)}/sitemaps`)).sitemap ?? []
  if (!list.length) return console.log(`\nNo sitemaps submitted for ${site}\n`)
  console.log(`\n${site}\n`)
  for (const s of list) {
    const counts = (s.contents ?? []).map((c) => `${c.submitted} ${c.type}`).join(', ')
    console.log(
      `${s.path}\n  submitted ${s.lastSubmitted?.slice(0, 10) ?? '—'}  ` +
        `downloaded ${s.lastDownloaded?.slice(0, 10) ?? 'never'}  ` +
        `errors ${s.errors ?? 0}  warnings ${s.warnings ?? 0}${counts ? `  (${counts})` : ''}${s.isPending ? '  [pending]' : ''}`
    )
  }
  console.log()
}

async function submitSitemap(args) {
  const feed = args._[1]
  if (!feed) die('Usage: node scripts/gsc.mjs submit-sitemap <sitemap-url>')
  const site = await resolveSite(args.site)
  await api(`/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(feed)}`, { method: 'PUT' })
  console.log(`Submitted ${feed} to ${site}`)
}

async function deleteSitemap(args) {
  const feed = args._[1]
  if (!feed) die('Usage: node scripts/gsc.mjs delete-sitemap <sitemap-url>')
  const site = await resolveSite(args.site)
  await api(`/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(feed)}`, { method: 'DELETE' })
  console.log(`Deleted ${feed} from ${site}`)
}

// URL Inspection is the API's most useful read: why a given page is or isn't
// indexed. Quota is 2000/day, 600/min.
async function inspect(args) {
  const url = args._[1]
  if (!url) die('Usage: node scripts/gsc.mjs inspect <page-url>')
  const site = await resolveSite(args.site)
  const body = await apiV1('/urlInspection/index:inspect', {
    method: 'POST',
    body: JSON.stringify({ inspectionUrl: url, siteUrl: site }),
  })
  if (args.json) return console.log(JSON.stringify(body, null, 2))

  const r = body.inspectionResult ?? {}
  const i = r.indexStatusResult ?? {}
  console.log(`\n${url}\n`)
  console.log(`  verdict         ${i.verdict ?? '—'}`)
  console.log(`  coverage        ${i.coverageState ?? '—'}`)
  console.log(`  robots.txt      ${i.robotsTxtState ?? '—'}`)
  console.log(`  indexing        ${i.indexingState ?? '—'}`)
  console.log(`  last crawled    ${i.lastCrawlTime?.slice(0, 10) ?? 'never'}`)
  console.log(`  google canonical${' '}${i.googleCanonical ?? '—'}`)
  console.log(`  user canonical  ${i.userCanonical ?? '—'}`)
  if (i.sitemap?.length) console.log(`  in sitemap      ${i.sitemap.join(', ')}`)
  if (r.mobileUsabilityResult?.verdict) console.log(`  mobile          ${r.mobileUsabilityResult.verdict}`)
  if (r.richResultsResult?.verdict) console.log(`  rich results    ${r.richResultsResult.verdict}`)
  console.log()
}

const args = parseArgs(process.argv.slice(2))
switch (args._[0]) {
  case 'email':
    console.log((await readKey()).client_email)
    break
  case 'sites': {
    const sites = await listSites()
    if (!sites.length) {
      const { client_email } = await readKey()
      console.log(`No properties yet.\n\nIn Search Console: Settings > Users and permissions > Add user\n  ${client_email}   (Full permission)\n`)
      break
    }
    for (const s of sites) console.log(`${s.permissionLevel.padEnd(16)} ${s.siteUrl}`)
    break
  }
  case 'query':
    await query(args)
    break
  case 'sitemaps':
    await sitemaps(args)
    break
  case 'submit-sitemap':
    await submitSitemap(args)
    break
  case 'delete-sitemap':
    await deleteSitemap(args)
    break
  case 'inspect':
    await inspect(args)
    break
  default:
    console.log(
      `Usage:\n` +
        `  node scripts/gsc.mjs email                       service account address to grant in GSC\n` +
        `  node scripts/gsc.mjs sites                       list properties it can see\n` +
        `  node scripts/gsc.mjs query [flags]               search analytics\n` +
        `  node scripts/gsc.mjs inspect <page-url>          why a page is or isn't indexed\n` +
        `  node scripts/gsc.mjs sitemaps                    list submitted sitemaps\n` +
        `  node scripts/gsc.mjs submit-sitemap <url>        submit a sitemap\n` +
        `  node scripts/gsc.mjs delete-sitemap <url>        remove a sitemap\n\n` +
        `Query flags:\n` +
        `  --dim query|page|country|device|date   dimension(s), comma-separated (default: query)\n` +
        `  --days N                               window length, default 28\n` +
        `  --start / --end YYYY-MM-DD             explicit range (overrides --days)\n` +
        `  --limit N                              rows, default 25\n` +
        `  --site URL                             property, if the account has several\n` +
        `  --json                                 raw JSON instead of a table\n`
    )
}
