import { RGB } from "@/utils/rgb";

export const initializeWebGPU = async (
    canvasRef:  React.RefObject<HTMLCanvasElement | null>,
    shaderCode: string,
    clearValue: RGB 
) => {
    if (!navigator.gpu) {
        console.error('WebGPU not supported on this browser.');
        return;
    }


    const canvas = canvasRef.current;
    if (!canvas) {
        return;
    }

    // get gpu adapter and device
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.error('WebGPu: Failed to get GPU adapter.');
        return;
    }

    const device = await adapter.requestDevice();

    // configure canvas content
    const context = canvas.getContext('webgpu') as GPUCanvasContext;
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
