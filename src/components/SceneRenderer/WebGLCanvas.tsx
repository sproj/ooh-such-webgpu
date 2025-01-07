import { useEffect } from "react";
import { useRenderer } from "../RendererContext";
import { ThreeDCanvasProps } from "./SceneRenderer";

const WebGLCanvas: React.FC<ThreeDCanvasProps> = ({ scene }) => {
    const { rendererRef } = useRenderer();
    const renderer = rendererRef.current;

    useEffect(() => {
        if (renderer) {
            renderer.preparePipeline({
                vertexShaderSources: scene.vertexShaderSources,
                fragmentShaderSources: scene.fragmentShaderSources
            });
            renderer.draw();
        }
    }, [scene, renderer]);

    return <canvas />
}

export default WebGLCanvas