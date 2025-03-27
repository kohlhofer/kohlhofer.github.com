precision mediump float;

// Input uniforms
uniform float u_time;
uniform float u_seed;
uniform vec2 u_resolution;
varying vec2 v_uv;

#define PI 3.14159265359

// Simplex noise helper functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

// Seeded simplex noise implementation
float snoise(vec2 v) {
    // Add seed to input coordinates for variation between refreshes
    v += vec2(u_seed * 123.456, u_seed * 789.012);
    
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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

// Fractal Brownian Motion for smooth noise layers
float fbm(vec2 position, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.5;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        value += amplitude * (snoise(position * frequency) * 0.5 + 0.5);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

// Color palette for pastel gradient
vec3 soapBubbleColor(float t) {
    // Pastel color definitions
    vec3 pink = vec3(1.0, 0.41, 0.71);     // FF69B4
    vec3 peach = vec3(1.0, 0.71, 0.71);    // FFB6B6
    vec3 lightBlue = vec3(0.53, 0.81, 0.92); // 87CEEB
    vec3 lightYellow = vec3(0.98, 0.98, 0.70);  // Softer yellow
    vec3 mintGreen = vec3(0.60, 1.0, 0.60);   // 98FF98
    
    // Color blending parameters
    float blendSpeed = 3.0;
    vec3 color = vec3(0.0);
    float totalInfluence = 0.0;
    
    // Smooth color blending with overlap
    for(int i = 0; i < 5; i++) {
        float dist = abs(float(i) - mod(t * blendSpeed, 5.0));
        dist = min(dist, 5.0 - dist); // Wrap around for seamless transitions
        float influence = smoothstep(1.5, 0.0, dist);
        totalInfluence += influence;
        
        // Add weighted color contributions
        if(i == 0) color += peach * influence;
        else if(i == 1) color += pink * influence;
        else if(i == 2) color += lightBlue * influence;
        else if(i == 3) color += lightYellow * influence;
        else color += mintGreen * influence;
    }
    
    return color / (totalInfluence + 0.0001);
}

void main() {
    // Setup coordinate system
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // Ripple effect configuration - use seed to randomize position
    vec2 rippleCenter = vec2(
        (0.2 + fract(u_seed * 789.123) * 0.6) * aspect,  // x: 20-80% of width
        0.2 + fract(u_seed * 456.789) * 0.6              // y: 20-80% of height
    );
    float rippleDistance = length(uv - rippleCenter);
    
    // Ripple distortion parameters
    float rippleFrequency = 40.0;
    float rippleSpeed = 0.5;
    float rippleAmplitude = 0.3;
    float distortionStrength = 0.6;
    
    // Calculate ripple distortion
    vec2 distortionDirection = uv - rippleCenter;
    float rippleWave = sin(rippleDistance * rippleFrequency - u_time * rippleSpeed) * rippleAmplitude + 0.5;
    float rippleFalloff = smoothstep(0.7, 0.5, rippleDistance);
    vec2 distortedUV = uv + distortionDirection * rippleWave * rippleFalloff * distortionStrength;
    
    // Animated noise layers
    float timeScale = 0.2;
    float time = u_time * timeScale;
    
    // Layer 1: Slow base movement
    vec2 layer1Pos = distortedUV * 0.3 + vec2(time * 0.4, time * 0.04);
    float noise1 = fbm(layer1Pos, 4);
    
    // Layer 2: Medium speed middle layer
    vec2 layer2Pos = distortedUV * 0.4 + vec2(time * -0.4, time * 0.08);
    float noise2 = fbm(layer2Pos, 5);
    
    // Layer 3: Fast top layer
    vec2 layer3Pos = distortedUV * -0.8 + vec2(time * 0.4, time * -0.002);
    float noise3 = fbm(layer3Pos, 3);
    
    // Combine noise layers with weights
    float combinedNoise = noise1 * 0.1 + noise2 * 0.3 + noise3 * 0.7;
    combinedNoise = smoothstep(0.3, 0.7, combinedNoise);
    
    // Generate base color
    float colorVariation = fbm(uv * 0.2, 3);
    vec3 color = soapBubbleColor(combinedNoise * 0.6 + colorVariation * 0.3);
    
    // Color adjustments and effects
    vec3 baseColor = vec3(0.85);
    color = mix(baseColor, color, 0.85);
    
    // Add glow around ripple center
    float glowStrength = 0.08;
    float glow = smoothstep(1.0, 0.0, rippleDistance) * glowStrength;
    color += vec3(1.0, 1.0, 0.98) * glow;
    
    // Ensure minimum brightness
    vec3 minBrightness = vec3(0.5);
    color = max(color, minBrightness);
    
    // Add subtle vignette
    float vignetteDistance = length(v_uv - 0.5) * 2.0;
    float vignette = smoothstep(1.4, 0.4, vignetteDistance);
    color *= mix(0.98, 1.0, vignette);
    
    gl_FragColor = vec4(color, 1.0);
} 