precision mediump float;

out vec4 FragColor;

uniform float u_time;
uniform float u_rmsL;
uniform float u_rmsR;
uniform vec2 u_res;

uniform float u_freqCount;
uniform float u_freqs[32];

#ifdef GL_ES
const bool  IS_GLES   = true;
#else
const bool  IS_GLES   = false;
#endif

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - vec3(K.w));
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



void main() {
    vec2 uv = gl_FragCoord.xy / u_res;

    float rms = (u_rmsL + u_rmsR) * 0.5;
    vec3 finalColor = vec3(0.0);
    //...........
    float backHue = fract(u_time * 0.05);
    finalColor = hsv2rgb(vec3(backHue, 0.7, 0.3 + rms * 0.3  ));
    //...........

    if ( rms == 0.0 && !IS_GLES)
    {
        // no signal ;)
        float noise = fract(sin(dot(uv, vec2(fract(u_time) + 0.10, 66.6))) *  43758.5453   );
        finalColor += noise * 0.2;
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
