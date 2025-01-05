import { WebGLError, WebGLErrorType } from "@/errors/WebGLError";

export const initializeWebGL = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    vertexShaderSource: string,
    fragmentShaderSource: string
) => {

    const canvas = canvasRef.current;
    if (!canvas) {
        console.error('<canvas/> ref is null.')
        return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
        throw new WebGLError(WebGLErrorType.NotSupported);
    }

    // Compile shaders
    //TODO: null check on createShader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    //TODO: null check on createShader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Link shaders to program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Define triangle vertices
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ]);

    // Create buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Link vertex data to shader
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Clear canvas and draw
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
