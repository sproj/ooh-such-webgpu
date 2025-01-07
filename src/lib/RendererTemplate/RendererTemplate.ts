import { PreparePipelineInput } from "./PreparePipelineInput";

abstract class RendererTemplate {
    protected canvas: HTMLCanvasElement;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
        if (!canvasRef.current) {
            throw new Error('Canvas reference is invalid or not initialized.');
        }
        this.canvas = canvasRef.current;
    }
    abstract initializeEnvironment(): Promise<void>;
    abstract preparePipeline(input: PreparePipelineInput): Promise<void>;
    abstract draw(): Promise<void>;

    // async render(canvasRef: React.RefObject<HTMLCanvasElement | null>): Promise<void> {
    //     await this.initializeEnvironment(canvasRef);
    //     await this.preparePipeline(shaderCode: string[]);
    //     return await this.draw();
    // }
}

export default RendererTemplate;
