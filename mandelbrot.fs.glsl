precision highp float;

uniform vec2 viewportDimensions;
uniform vec4 bounds; // minI, maxI, minR, maxR

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

    float quotient = (iterations / maxIterations);
    float fraction = mod(quotient, 1.0) * (maxIterations / 100.0);
    gl_FragColor = vec4(fraction, fraction, fraction, 1.0);
}