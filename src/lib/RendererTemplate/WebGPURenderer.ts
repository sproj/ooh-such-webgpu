import { WebGPUError, WebGPUErrorType } from "@/errors/WebGPUError";
import RendererTemplate from "@/lib/RendererTemplate/RendererTemplate";
import { PreparePipelineInput } from "./PreparePipelineInput";
import { SceneDefinition } from "../SceneDefinition";

class WebGPURenderer extends RendererTemplate {
    protected canvas: HTMLCanvasElement | null = null;
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    private pipeline: GPURenderPipeline | null = null;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
        super(canvasRef);
        if (!navigator.gpu) {
            throw new WebGPUError(WebGPUErrorType.NotSupported)
        }

        this.setCanvas(canvasRef);
    }

    setCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
        const canvas = canvasRef.current;
        if (!canvas) {
            throw new WebGPUError(WebGPUErrorType.NoCanvas)
        }
        this.canvas = canvas;
    }

    async initializeEnvironment(): Promise<void> {

        if (!this.canvas) {
            throw new WebGPUError(WebGPUErrorType.NoCanvas)
        }

        const adapter = await navigator.gpu.requestAdapter()
            .then(a => { if (!a) { throw new WebGPUError(WebGPUErrorType.NoAdapter) } else { return a } })
            .catch(e => { throw new WebGPUError(WebGPUErrorType.NoAdapter, e) })

        const device = await adapter.requestDevice();
        if (!device) {
            throw new WebGPUError(WebGPUErrorType.NoDevice);
        }
        this.device = device;

        const context = this.canvas.getContext('webgpu')
        if (!context) {
            throw new WebGPUError(WebGPUErrorType.NoContext);
        } else {
            this.context = context;
        }
    }

    async render(scene: SceneDefinition): Promise<void> {
        await this.preparePipeline({
            shaderCode: scene.shaderCode
        });
        await this.draw(scene);
    }

    async preparePipeline(input: PreparePipelineInput): Promise<void> {
        if (!input.shaderCode) {
            throw new WebGPUError(WebGPUErrorType.InvalidShaderSource)
        }

        if (!this.device) {
            throw new Error('`device` must be initialized. Call `initializeEnvironment` before calling `preparePipeline`');
        }
        if (!this.context) {
            throw new Error('`context` must be initialized. Call `initializeEnvironment` before calling `preparePipeline`');
        }
        const shaderModule = this.device.createShaderModule({ code: input.shaderCode });

        const format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format,
            alphaMode: 'opaque'
        });

        this.pipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: { module: shaderModule, entryPoint: 'vertex_main' },
            fragment: {
                module: shaderModule,
                entryPoint: 'fragment_main',
                targets: [{ format }]
            },
            primitive: { topology: 'triangle-list' },
        })
    }

    async draw(scene: SceneDefinition): Promise<void> {
        if (!this.device) {
            throw new Error('Device must be initialized. Call `initializeEnvironment` before calling `draw`');
        }
        if (!this.context) {
            throw new Error('`context` must be initialized. Call `initializeEnvironment` before calling `draw`');
        }
        if (!this.pipeline) {
            throw new Error('`pipeline` must be initialized. Call `preparePipeline` before calling `draw`');
        }

        const commandEncoder = this.device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: scene.clearColor || { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        });

        renderPass.setPipeline(this.pipeline);
        renderPass.draw(3);
        renderPass.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }
}

export default WebGPURenderer;
