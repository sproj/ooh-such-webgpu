"use client"
import { useEffect, useRef } from "react";
import { useRenderer } from "@/components/RendererContext";
import { SceneDefinition } from "@/lib/SceneDefinition";

export interface ThreeDCanvasProps {
    scene: SceneDefinition
}

const SceneRenderer = ({ scene }: { scene: SceneDefinition }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { initializeRenderer, draw, rendererType } = useRenderer();

    useEffect(() => {
        const renderScene = async () => {
            await initializeRenderer(canvasRef);
            await draw(scene);
        }
        renderScene()
    }, [scene, rendererType]);
    return (
        <canvas ref={canvasRef} />
    )
};

export default SceneRenderer
