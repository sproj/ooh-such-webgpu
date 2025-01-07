import { SceneDefinition } from "../SceneDefinition";
import { PreparePipelineInput } from "./PreparePipelineInput";

abstract class RendererTemplate {
    protected canvas: HTMLCanvasElement | null;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
        if (!canvasRef.current) {
            throw new Error('Canvas reference is invalid or not initialized.');
        }
        this.canvas = canvasRef.current;
    }
    abstract initializeEnvironment(): Promise<void>;
    abstract preparePipeline(input: PreparePipelineInput): Promise<void>;
    abstract draw(scene: SceneDefinition): Promise<void>;
    abstract setCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>): void
    abstract render(scene: SceneDefinition): Promise<void>;
}

export default RendererTemplate;
