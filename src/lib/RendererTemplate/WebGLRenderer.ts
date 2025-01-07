import { WebGLError, WebGLErrorType } from "@/errors/WebGLError";
import RendererTemplate from "@/lib/RendererTemplate/RendererTemplate";
import { PreparePipelineInput } from "./PreparePipelineInput";
import { SceneDefinition } from "../SceneDefinition";
import { rgbBlack } from "@/utils/rgb";

class WebGlRenderer extends RendererTemplate {
    protected canvas: HTMLCanvasElement | null = null;
    private gl: WebGLRenderingContext | null = null;
    private program: WebGLProgram | null = null;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
        super(canvasRef);
        const canvas = canvasRef.current;
        if (!canvas) {
            throw new WebGLError(WebGLErrorType.NoCanvas)
        }
        this.setCanvas(canvasRef);
    }

    setCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
        const canvas = canvasRef.current;
        if (!canvas) {
            throw new WebGLError(WebGLErrorType.NoCanvas)
        }
        this.canvas = canvas;
    }

    async initializeEnvironment(): Promise<void> {
        if (!this.canvas) {
            throw new WebGLError(WebGLErrorType.NoCanvas)
        }

        const gl = this.canvas.getContext('webgl');
        if (!gl) {
            throw new WebGLError(WebGLErrorType.NotSupported);
        }

        this.gl = gl;
    }

    async render(scene: SceneDefinition): Promise<void> {
        await this.preparePipeline({
            vertexShaderSources: scene.vertexShaderSources,
            fragmentShaderSources: scene.fragmentShaderSources,
        });
        await this.draw(scene);
    }

    private async preparePipeline(input: PreparePipelineInput): Promise<void> {
        if (!input.vertexShaderSources?.length || !input.fragmentShaderSources?.length) {
            throw new WebGLError(WebGLErrorType.InvalidShaderSource)
        }

        if (!this.gl) {
            throw new Error('gl must be initialized. Call `initializeEnvironment` before calling `preparePipeline`');
        }

        const vertexShaderSource = await this.loadShaderSources(input.vertexShaderSources);
        const fragmentShaderSource = await this.loadShaderSources(input.fragmentShaderSources)

        // Compile shaders
        //TODO: null check on createShader
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER) as WebGLShader;
        this.gl.shaderSource(vertexShader, vertexShaderSource);
        this.gl.compileShader(vertexShader);

        //TODO: null check on createShader
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER) as WebGLShader;
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);
        this.gl.compileShader(fragmentShader);

        // Link shaders to program
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        this.gl.useProgram(program);

        this.program = program;
    }


    private async draw(scene: SceneDefinition): Promise<void> {
        const vertices = scene.vertices;

        if (!this.gl) {
            throw new Error('gl must be initialized. Call `initializeEnvironment` before calling `draw`');
        }
        if (!this.program) {
            throw new Error('program must be initialized. Call `preparePipeline` before calling `draw`');
        }

        // Create buffer
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        // Link vertex data to shader
        const a_Position = this.gl.getAttribLocation(this.program, 'a_Position');
        this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(a_Position);

        // Clear canvas and draw
        const { r, g, b, a} = scene.clearColor || rgbBlack;
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    private async loadShaderSources(shaderSources: string[]): Promise<string> {
        return shaderSources.join('\n');
    }
}

export default WebGlRenderer;
