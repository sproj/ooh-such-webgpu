import { useEffect } from "react";
import { useRenderer } from "../RendererContext";
import { ThreeDCanvasProps } from "./SceneRenderer";

const WebGPUCanvas: React.FC<ThreeDCanvasProps> = ({ scene }) => {
    const { rendererRef } = useRenderer();
    const renderer = rendererRef.current;

    useEffect(() => {
        if (renderer) {
            renderer.preparePipeline({ shaderCode: scene.shaderCode })
            renderer.draw()
        }
    }, [scene, renderer]);

    return <canvas />
}

export default WebGPUCanvas