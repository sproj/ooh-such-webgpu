"use client"

import React, { createContext, useContext, useRef, useState } from 'react';
import WebGPURenderer from '@/lib/RendererTemplate/WebGPURenderer';
import WebGLRenderer from '@/lib/RendererTemplate/WebGLRenderer';
import { SceneDefinition } from '@/lib/SceneDefinition';

export enum RendererType {
    WebGPU,
    WebGL,
}

export interface RendererContextValue {
    rendererType: RendererType | null;
    rendererRef: React.RefObject<WebGPURenderer | WebGLRenderer | null>,
    initializeRenderer(canvasRef: React.RefObject<HTMLCanvasElement | null>): Promise<void>,
    draw: (scene: SceneDefinition) => Promise<void>;
}

const RendererContext = createContext<RendererContextValue | undefined>(undefined);

export const RendererProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rendererType, setRendererType] = useState<RendererType | null>(null);
    const rendererRef = useRef<WebGPURenderer | WebGLRenderer | null>(null);

    const initializeRenderer = async (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
        try {
            const webGPURenderer = new WebGPURenderer(canvasRef);
            await webGPURenderer.initializeEnvironment();
            rendererRef.current = webGPURenderer;
            setRendererType(RendererType.WebGPU);
        } catch (e) {
            console.warn('WebGPU failed, falling back to WebGL', e);
            try {
                const webGLRenderer = new WebGLRenderer(canvasRef);
                await webGLRenderer.initializeEnvironment();
                rendererRef.current = webGLRenderer;
                setRendererType(RendererType.WebGL);
            } catch (e) {
                console.error('WebGL failed', e);
                setRendererType(null);
            }
        }
    };

    const draw = async (scene: SceneDefinition) => {
        if (!rendererRef.current) {
            throw new Error('Renderer has not been initialized. You must call `initializeRenderer` to have something to `draw`.');
        }

        await rendererRef.current.render(scene)
    };

    return (
        <RendererContext.Provider value={{ initializeRenderer, draw, rendererType, rendererRef }}>
            <div style={{ position: 'relative' }}>
                {children}
            </div>
        </RendererContext.Provider>
    );
};

export const useRenderer = () => {
    const context = useContext(RendererContext);
    if (!context) {
        throw new Error('useRenderer must be used within a RendererProvider');
    }
    return context;
};
