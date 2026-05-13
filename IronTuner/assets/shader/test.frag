precision mediump float;

out vec4 FragColor;

uniform float u_time;
uniform float u_rmsL;
uniform float u_rmsR;
uniform vec2 u_res;

uniform float u_freqCount;
uniform float u_freqs[32];

void main() {
    vec2 uv = gl_FragCoord.xy / u_res.xy;

    // V-shape geometry configuration
    float slant =  0.15; //0.35;      // Tilt angle of the bars
    float spacing = 0.15; //0.15;    // Bottom separation from the center

    // Dynamic thickness: grows wider as UV.y increases
    float baseThickness = 0.12; //0.03;
    float thickness = baseThickness + (uv.y * 0.06);

    // Center-aligned X coordinate
    float centerX = uv.x - 0.5;

    // Distance calculation to the V-shaped axes
    float distL = abs(centerX + (uv.y * slant) + spacing);
    float distR = abs(centerX - (uv.y * slant) - spacing);

    // Anti-aliased side edges for the tapering bars
    float edgeSmooth = 0.005;
    float maskL = smoothstep(thickness, thickness - edgeSmooth, distL);
    float maskR = smoothstep(thickness, thickness - edgeSmooth, distR);

    // LED Grid
    float ledCount = 50.0; //30
    float ledPattern = fract(uv.y * ledCount);
    float ledGap = 0.15;
    float ledGrid = smoothstep(ledGap, ledGap + 0.05, ledPattern);

    // Discrete height steps matching the LED grid positions
    float steppedY = floor(uv.y * ledCount) / ledCount;
    float heightL = step(steppedY, u_rmsL);
    float heightR = step(steppedY, u_rmsR);

    // Combine geometry, LED grid, and audio height limits
    float finalL = maskL * heightL * ledGrid;
    float finalR = maskR * heightR * ledGrid;
    float totalMask = clamp(finalL + finalR, 0.0, 1.0);

    // Color gradient definitions
    vec3 colorGreen  = vec3(0.0, 1.0, 0.2);
    vec3 colorYellow = vec3(1.0, 1.0, 0.0);
    vec3 colorRed    = vec3(1.0, 0.0, 0.0);

    // Vertical color interpolation based on the discrete LED position
     vec3 gradient = mix(colorGreen, colorYellow, smoothstep(0.0, 0.6, steppedY));
     gradient = mix(gradient, colorRed, smoothstep(0.6, 1.0, steppedY));



    // Dark background tint
    vec3 background = vec3(0.05, 0.05, 0.08);

    // Output final composition
    vec3 finalColor = mix(background, gradient, totalMask);
    FragColor = vec4(finalColor, 1.0);
}
