import { RendererType, useRenderer } from "../RendererContext";
import WebGLCanvas from "./WebGLCanvas";
import WebGPUCanvas from "./WebGPUCanvas";

export interface ThreeDCanvasProps {
    scene: SceneDefinition
}

const SceneRenderer = ({ scene }: { scene: SceneDefinition }) => {
    const { rendererType } = useRenderer();

    return rendererType === RendererType.WebGPU ? (
        <WebGPUCanvas scene={scene} />
    ) : rendererType === RendererType.WebGL ? (
        <WebGLCanvas scene={scene} />
    ) : (
        <p>Renderer not available</p>
    );
};

export default SceneRenderer
