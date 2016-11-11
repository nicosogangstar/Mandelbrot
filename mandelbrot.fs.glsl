precision highp float;

uniform vec2 viewportDimensions;
uniform vec4 bounds; // minI, maxI, minR, maxR

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float interpolate(float v0, float v1, float t) {
    return (1.0 - t) * v0 + t * v1;
}

void main() {
    // [-2.0, 2.0]
    vec2 c = vec2(
        gl_FragCoord.x * (bounds.w - bounds.z) / viewportDimensions.x + bounds.z,
        gl_FragCoord.y * (bounds.y - bounds.x) / viewportDimensions.y + bounds.x
    );

    // Mandelbrot formula
    vec2 z = c;
    float iterations = 0.0;
    float maxIterations = 500.0;
    const int imaxIterations = 500;

    for(int i = 0; i < imaxIterations; i++) {
        float t = 2.0 * z.x * z.y + c.y;
        z.x = z.x * z.x - z.y * z.y + c.x;
        z.y = t;

        if(z.x * z.x + z.y * z.y > 4.0) {
            break;
        }

        iterations += 1.0;
    }

    if (iterations < maxIterations) {
        float hsq = z.x*z.x + z.y*z.y;
        float log_zn = log(hsq) / 2.0;
        float nu = log(log_zn / log(2.0)) / log(2.0);

        iterations = iterations + 1.0 - nu;
    }

    if(iterations == maxIterations) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else {
        float color1 = floor(iterations) / maxIterations;
        float color2 = (floor(iterations) + 1.0) / maxIterations;
        gl_FragColor = vec4(hsv2rgb(vec3(interpolate(color1, color2, mod(iterations, 1.0)), 1.0, 1.0)), 1.0);
    }
}