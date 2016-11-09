precision highp float;

uniform vec2 viewportDimensions;
// uniform vec4 bounds; // minI, maxI, minR, maxR

uniform float minI;
uniform float maxI;
uniform float minR;
uniform float maxR;

void main() {
    // [0, 1000]
    // [-2.0, 2.0]
    vec2 c = vec2(
        gl_FragCoord.x * (maxR - minR) / viewportDimensions.x + minR,
        gl_FragCoord.y * (maxI - minI) / viewportDimensions.y + minI
    );

    // Mandelbrot formula
    vec2 z = c;
    float iterations = 0.0;
    float maxIterations = 200.0;
    const int imaxIterations = 200;

    for(int i = 0; i < imaxIterations; i++) {
        float t = 2.0 * z.x * z.y + c.y;
        z.x = z.x * z.x - z.y * z.y + c.x;
        z.y = t;

        if(z.x * z.x + z.y * z.y > 4.0) {
            break;
        }

        iterations += 1.0;
    }

    if(iterations < maxIterations) {
        discard;
    }
    else {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
}