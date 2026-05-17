precision mediump float;

out vec4 FragColor;

uniform float u_time;
uniform float u_rmsL;
uniform float u_rmsR;
uniform vec2 u_res;

uniform float u_freqCount;
uniform float u_freqs[32];


vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - vec3(K.w));
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


// ---------------------- HORIZONTAL BARS VERY SIMPLE -----------------------

const float BAR_WIDTH = 0.4;
const float BAR_HEIGHT = 0.04;
const float BAR_GAP = 0.01;
const float LED_COUNT = 30.0;
const float LED_GAP = 0.15;

void main() {
    vec2 uv = gl_FragCoord.xy / u_res;

    float rms = (u_rmsL + u_rmsR) * 0.5;
    vec3 finalColor = vec3(0.0);
    //...........
    float backHue = fract(u_time * 0.05);
    finalColor = hsv2rgb(vec3(backHue, 0.7, 0.3 + rms * 0.3  ));
    //...........

    if ( rms == 0.0 )
    {
        // no signal ;)
        float noise = fract(sin(dot(uv, vec2(fract(u_time) + 0.10, 66.6))) *  43758.5453   );
        finalColor += noise * 0.2;
    } else  {
        float startX = (1.0 - BAR_WIDTH) * 0.5;
        float endX = startX + BAR_WIDTH;

        float centerY = 0.1;
        float bottomBarL = centerY + (BAR_GAP * 0.5);
        float topBarL = bottomBarL + BAR_HEIGHT;
        float topBarR = centerY - (BAR_GAP * 0.5);
        float bottomBarR = topBarR - BAR_HEIGHT;


        if (uv.x >= startX && uv.x <= endX) {

            float progressX = (uv.x - startX) / BAR_WIDTH;
            float ledIndex = floor(progressX * LED_COUNT) / LED_COUNT;
            float ledFract = fract(progressX * LED_COUNT) ;

            if (ledFract > LED_GAP) {

                vec3 ledColor = vec3(0.0);
                if (ledIndex < 0.6) {
                    ledColor = vec3(0.0, 0.8, 0.0);
                } else if (ledIndex < 0.85) {
                    ledColor = vec3(0.8, 0.8, 0.0);
                } else {
                    ledColor = vec3(0.8, 0.0, 0.0);
                }

                if (uv.y >= bottomBarL && uv.y <= topBarL) {
                    if (ledIndex <= u_rmsL) {
                        finalColor = ledColor, finalColor;
                    } else {
                        finalColor = ledColor * 0.2;
                    }
                }

                if (uv.y >= bottomBarR && uv.y <= topBarR) {
                    if (ledIndex <= u_rmsR) {
                        finalColor = ledColor;
                    } else {
                        finalColor = ledColor * 0.2;
                    }
                }
            }
        }
    }


    //...........
    float vignette = distance(uv, vec2(0.5));
    float edgeStart =  0.7; // 0.7;
//     float edgeEnd = clamp(0.4 + (rms * 0.2), 0.0, 0.75);
    float edgeEnd = clamp(0.2 + (u_freqs[0] * 0.2), 0.0, 0.75);
    finalColor *= smoothstep(edgeStart, edgeEnd, vignette);

    //...........
    FragColor = vec4(finalColor, 1.0);


}


// // Converts Hue, Saturation, Value to RGB
// vec3 hsv2rgb(vec3 c) {
//     vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//     vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//     return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }
//
// void main() {
//     vec2 uv = gl_FragCoord.xy / u_res.xy;
//
//
//     float backHue = fract(u_time * 0.05);
//     vec3 background = hsv2rgb(vec3(backHue, 0.5, 0.2 ));
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
//     float ledCount = 30.0; //30
//     float ledPattern = fract(uv.y * ledCount) ;
//     float ledGap = 0.15; //0.15;
//     float ledGrid = smoothstep(ledGap, ledGap + 0.05, ledPattern);
//
//     // Discrete height steps matching the LED grid positions
//     float steppedY = floor(uv.y * ledCount) / ledCount * 0.5;
//     float heightL = step(steppedY, u_rmsL);
//     float heightR = step(steppedY, u_rmsR);
//
//     float finalL = maskL * heightL * ledGrid;
//     float finalR = maskR * heightR * ledGrid;
//     float activeMask = clamp(finalL + finalR, 0.4, 1.0); //0.4 background gradient
//
//     float fullBarL = maskL * ledGrid;
//     float fullBarR = maskR * ledGrid;
//     float totalBarMask = clamp(fullBarL + fullBarR, 0.0, 1.0);
//
//     float offMask = clamp(totalBarMask - activeMask, 0.0, 1.0);
//
//     // Color gradient definitions
//     vec3 colorGreen  = vec3(0.0, 1.0, 0.0);
//     vec3 colorYellow = vec3(1.0, 1.0, 0.0);
//     vec3 colorRed    = vec3(1.0, 0.0, 0.0);
//
//     // Vertical color interpolation based on the discrete LED position
//     vec3 gradient = mix(colorGreen, colorYellow, smoothstep(0.0, 0.6, steppedY));
//     gradient = mix(gradient, colorRed, smoothstep(0.6, 1.0, steppedY));
//
//     vec3 offColor = vec3(0.05, 0.05, 0.05);
//
//     vec3 finalColor = mix(background, offColor, offMask);
//     finalColor = mix(finalColor, gradient, activeMask);
//
//     FragColor = vec4(finalColor, 1.0);
// }


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
