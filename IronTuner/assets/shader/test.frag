precision mediump float;

out vec4 FragColor;

uniform float u_time;
uniform float u_rmsL;
uniform float u_rmsR;
uniform vec2 u_res;

uniform float u_freqCount;
uniform float u_freqs[32];

// Converts Hue, Saturation, Value to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_res.xy;

    float heightpercent = 1.00; // height

    float backHue = fract(u_time * 0.05);
    vec3 background = hsv2rgb(vec3(backHue, 0.5, 0.2 ));

    // V-shape geometry configuration
    float slant =  0.26; //0.35;      // Tilt angle of the bars
    float spacing = 0.10; //0.15;    // Bottom separation from the center

    // Dynamic thickness: grows wider as UV.y increases
    float baseThickness = 0.10; //0.03;
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

    float heightLimit = step(uv.y, heightpercent);
    maskL *= heightLimit;
    maskR *= heightLimit;


    // LED Grid
    float ledCount = 30.0; //30
    float ledPattern = fract(uv.y * ledCount) ;
    float ledGap = 0.35; //0.15;
    float ledGrid = smoothstep(ledGap, ledGap + 0.05, ledPattern);

    // Discrete height steps matching the LED grid positions
    float steppedY = floor(uv.y * ledCount) / ledCount;
    float scaledY = steppedY / heightpercent;

    float heightL = step(scaledY, u_rmsL);
    float heightR = step(scaledY, u_rmsR);

    float finalL = maskL * heightL * ledGrid;
    float finalR = maskR * heightR * ledGrid;
    float activeMask = clamp(finalL + finalR, 0.4, 1.0); //0.4 background gradient

    float fullBarL = maskL * ledGrid;
    float fullBarR = maskR * ledGrid;
    float totalBarMask = clamp(fullBarL + fullBarR, 0.0, 1.0);

    float offMask = clamp(totalBarMask - activeMask, 0.0, 1.0);

    // Color gradient definitions
    vec3 colorGreen  = vec3(0.0, 1.0, 0.0);
    vec3 colorYellow = vec3(1.0, 1.0, 0.0);
    vec3 colorRed    = vec3(1.0, 0.0, 0.0);

    // Vertical color interpolation based on the discrete LED position
    vec3 gradient = mix(colorGreen, colorYellow, smoothstep(0.0, 0.6, steppedY));
    gradient = mix(gradient, colorRed, smoothstep(0.6, 1.0, steppedY));

    // 4. Farbe für die ausgeschalteten Segmente (Dunkelgrau/Transluzent)
    vec3 offColor = vec3(0.05, 0.05, 0.05);

    // Output final composition: Zuerst Hintergrund, dann "Aus"-Balken, dann aktive LEDs
    vec3 finalColor = mix(background, offColor, offMask);
    finalColor = mix(finalColor, gradient, activeMask);

    FragColor = vec4(finalColor, 1.0);
}


// precision mediump float;
//
// out vec4 FragColor;
//
// uniform float u_time;
// uniform float u_rmsL;
// uniform float u_rmsR;
// uniform vec2 u_res;
//
// uniform float u_freqCount;
// uniform float u_freqs[32];
//
// // Converts Hue, Saturation, Value to RGB
// vec3 hsv2rgb(vec3 c) {
//     vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//     vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//     return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }
//
//
// void main() {
//     vec2 uv = gl_FragCoord.xy / u_res.xy;
//
//     float backHue = fract(u_time * 0.05);
//     vec3 background = hsv2rgb(vec3(backHue, 0.5, 0.2 ));
//
//
//
//     // V-shape geometry configuration
//     float slant =  0.26; //0.35;      // Tilt angle of the bars
//     float spacing = 0.10; //0.15;    // Bottom separation from the center
//
//     // Dynamic thickness: grows wider as UV.y increases
//     float baseThickness = 0.10; //0.03;
//     float thickness = baseThickness + (uv.y * 0.06);
//
//     // Center-aligned X coordinate
//     float centerX = uv.x - 0.5;
//
//     // Distance calculation to the V-shaped axes
//     float distL = abs(centerX + (uv.y * slant) + spacing);
//     float distR = abs(centerX - (uv.y * slant) - spacing);
//
//     // Anti-aliased side edges for the tapering bars
//     float edgeSmooth = 0.005;
//     float maskL = smoothstep(thickness, thickness - edgeSmooth, distL);
//     float maskR = smoothstep(thickness, thickness - edgeSmooth, distR);
//
//     // LED Grid
//     float ledCount = 20.0; //30
//     float ledPattern = fract(uv.y * ledCount);
//     float ledGap = 0.35; //0.15;
//     float ledGrid = smoothstep(ledGap, ledGap + 0.05, ledPattern);
//
//     // Discrete height steps matching the LED grid positions
//     float steppedY = floor(uv.y * ledCount) / ledCount;
//     float heightL = step(steppedY, u_rmsL);
//     float heightR = step(steppedY, u_rmsR);
//
//     // Combine geometry, LED grid, and audio height limits
//     float finalL = maskL * heightL * ledGrid;
//     float finalR = maskR * heightR * ledGrid;
//     float totalMask = clamp(finalL + finalR, 0.0, 1.0);
//
//     // Color gradient definitions
//     vec3 colorGreen  = vec3(0.0, 1.0, 0.0);
//     vec3 colorYellow = vec3(1.0, 1.0, 0.0);
//     vec3 colorRed    = vec3(1.0, 0.0, 0.0);
//
//     // Vertical color interpolation based on the discrete LED position
//      vec3 gradient = mix(colorGreen, colorYellow, smoothstep(0.0, 0.6, steppedY));
//      gradient = mix(gradient, colorRed, smoothstep(0.6, 1.0, steppedY));
//
//
//     // Output final composition
//     vec3 finalColor = mix(background, gradient, totalMask);
//     FragColor = vec4(finalColor, 1.0);
// }
