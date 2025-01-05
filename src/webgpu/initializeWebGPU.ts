import { WebGPUErrorType } from "@/errors/WebGPUError";
import { WebGPUError } from "@/errors/WebGPUError";
import { RGB } from "@/utils/rgb";

export const initializeWebGPU = async (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    shaderCode: string,
    clearValue: RGB
) => {
    if (!navigator.gpu) {
        throw new WebGPUError(WebGPUErrorType.NotSupported)
    }


    const canvas = canvasRef.current;
    if (!canvas) {
        return;
    }

    // get gpu adapter and device
    const adapter = await navigator.gpu.requestAdapter()
        .then(a => { if (!a) { throw new WebGPUError(WebGPUErrorType.NoAdapter) } else { return a } })
        .catch(e => { throw new WebGPUError(WebGPUErrorType.NoAdapter, e) })

    const device = await adapter.requestDevice();
    if (!device) {
        throw new WebGPUError(WebGPUErrorType.NoDevice);
    }

    // configure canvas content
    const context = canvas.getContext('webgpu');
    if (!context) {
        throw new WebGPUError(WebGPUErrorType.NoContext);
    }

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format,
        alphaMode: 'opaque'
    });

    const shaderModule = device.createShaderModule({ code: shaderCode });

    // render pipeline
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main'
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format }]
        },
        primitive: {
            topology: 'triangle-list'
        }
    });

    // create CommandEncoder and RenderPass
    const commendEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commendEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: textureView,
                clearValue,
                loadOp: 'clear',
                storeOp: 'store'
            }
        ]
    });

    renderPass.setPipeline(pipeline);
    renderPass.draw(3);
    renderPass.end();

    // submit commands
    const commandBuffer = commendEncoder.finish();
    device.queue.submit([commandBuffer]);
};
