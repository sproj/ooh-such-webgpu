import React, { createContext, useContext, useRef, useState } from 'react';
import WebGPURenderer from '@/lib/ThreeDPRenderer/WebGPURenderer';
import WebGLRenderer from '@/lib/ThreeDPRenderer/WebGLRenderer';
import { WebGLError } from '@/errors/WebGLError';
import { WebGPUError } from '@/errors/WebGPUError';

enum RendererType {
    WebGPU,
    WebGL,
}

interface RendererContextValue {
    rendererType: RendererType | null;
    draw: (params: {
        vertexShaderSources?: string[];
        fragmentShaderSources?: string[];
        shaderCode?: string;
    }) => Promise<void>;
}

const RendererContext = createContext<RendererContextValue | undefined>(undefined);

export const RendererProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rendererType, setRendererType] = useState<RendererType | null>(null);
    const rendererRef = useRef<WebGPURenderer | WebGLRenderer | null>(null);

    const initializeRenderer = async () => {
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

    const draw = async (params: {
        vertexShaderSources?: string[];
        fragmentShaderSources?: string[];
        shaderCode?: string;
    }) => {
        if (!rendererRef.current) {
            throw new Error('Renderer has not been initialized');
        }

        if (rendererType === RendererType.WebGPU && params.shaderCode) {
            await (rendererRef.current as WebGPURenderer).preparePipeline({ shaderCode: params.shaderCode });
            await rendererRef.current.draw();
        } else if (rendererType === RendererType.WebGL && params.vertexShaderSources && params.fragmentShaderSources) {
            await (rendererRef.current as WebGLRenderer).preparePipeline({
                vertexShaderSources: params.vertexShaderSources,
                fragmentShaderSources: params.fragmentShaderSources,
            });
            await rendererRef.current.draw();
        } else {
            throw new Error('Invalid parameters for the current renderer');
        }
    };

    React.useEffect(() => {
        initializeRenderer();
    }, []);

    return (
        <RendererContext.Provider value={{ rendererType, draw }}>
            <div style={{ position: 'relative' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
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
