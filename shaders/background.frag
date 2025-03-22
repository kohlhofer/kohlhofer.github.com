precision mediump float;

uniform float u_time;
uniform float u_seed;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 v_uv;

#define PI 3.14159265359

// Simplex noise function with seed
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    // Add seed to input coordinates
    v += vec2(u_seed * 123.456, u_seed * 789.012);
    
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// FBM (Fractal Brownian Motion)
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        value += amplitude * (snoise(p * frequency) * 0.5 + 0.5);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

// Pastel color palette
vec3 soapBubbleColor(float t) {
    // Define our pastel colors with slightly adjusted yellow
    vec3 pink = vec3(1.0, 0.41, 0.71);     // FF69B4
    vec3 peach = vec3(1.0, 0.71, 0.71);    // FFB6B6
    vec3 lightBlue = vec3(0.53, 0.81, 0.92); // 87CEEB
    vec3 lightYellow = vec3(0.98, 0.98, 0.70);  // Softer yellow
    vec3 mintGreen = vec3(0.60, 1.0, 0.60);   // 98FF98
    
    // Smoother transition using sine wave
    float index = t * 3.0; // Slower color transitions
    
    // Choose colors based on index with overlap
    vec3 color = vec3(0.0);
    float totalInfluence = 0.0;
    
    // Add influence from each color with overlap
    for(int i = 0; i < 5; i++) {
        float dist = abs(float(i) - mod(t * 3.0, 5.0));
        dist = min(dist, 5.0 - dist); // Consider wrapping
        float influence = smoothstep(1.5, 0.0, dist);
        totalInfluence += influence;
        
        if(i == 0) color += pink * influence;
        else if(i == 1) color += peach * influence;
        else if(i == 2) color += lightBlue * influence;
        else if(i == 3) color += lightYellow * influence;
        else color += mintGreen * influence;
    }
    
    // Normalize the color
    return color / (totalInfluence + 0.0001);
}

void main() {
    // Adjust for aspect ratio
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // Mouse influence - creates a subtle warping effect
    vec2 mousePos = u_mouse;
    mousePos.x *= aspect;
    float mouseDistance = length(uv - mousePos);
    float mouseFactor = smoothstep(0.5, 0.0, mouseDistance) * 0.3;
    
    // Create multiple layers of soft, moving shapes
    float time = u_time * 0.1;
    
    // Layer 1 - slow moving base
    vec2 p1 = uv * 0.3 + vec2(time * 0.1, time * 0.08);
    float noise1 = fbm(p1, 4);
    
    // Layer 2 - medium speed middle layer
    vec2 p2 = uv * 0.4 + vec2(time * -0.15, time * 0.12);
    float noise2 = fbm(p2, 5);
    
    // Layer 3 - faster top layer
    vec2 p3 = uv * 0.7 + vec2(time * 0.2, time * -0.18);
    float noise3 = fbm(p3, 3);
    
    // Mouse influence on the noise
    p1 += mouseFactor * sin(uv * 5.0 + time);
    noise1 = mix(noise1, fbm(p1, 4), mouseFactor);
    
    // Combine the layers with different weights
    float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // Soften the noise and keep it in a higher range for a warm glow
    combinedNoise = smoothstep(0.3, 0.7, combinedNoise);
    
    // Create color variation based on position and time with smoother noise
    float colorVar = fbm(uv * 0.2 + time * 0.03, 3);
    
    // Apply pastel colors with smoother transition
    vec3 color = soapBubbleColor(combinedNoise * 0.6 + colorVar * 0.3 + time * 0.03);
    
    // Lighter base for mixing but not too white
    vec3 baseColor = vec3(0.85, 0.85, 0.85);
    color = mix(baseColor, color, 0.85);
    
    // Add a more diffused glow based on mouse position
    float glow = smoothstep(1.0, 0.0, mouseDistance) * 0.08;
    color += vec3(1.0, 1.0, 0.98) * glow;
    
    // Ensure minimum brightness while preserving color
    vec3 minColor = vec3(0.5, 0.5, 0.5);
    color = max(color, minColor);
    
    // Apply a softer vignette for pastel effect
    float vignette = smoothstep(1.4, 0.4, length(v_uv - 0.5) * 2.0);
    color *= mix(0.98, 1.0, vignette);
    
    gl_FragColor = vec4(color, 1.0);
} 