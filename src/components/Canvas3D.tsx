'use client';

import { WebGLError } from '@/errors/WebGLError';
import { WebGPUError } from '@/errors/WebGPUError';
import { rgbBlack } from '@/utils/rgb';
import { initializeWebGL } from '@/webgl/initializeWebGL';
import { flat_red_fragment_source } from '@/webgl/shaders/generic/fragment/flat_red';
import { vec4position_shader_source } from '@/webgl/shaders/generic/vertex/vec4_pos';
import { initializeWebGPU } from '@/webgpu/initializeWebGPU';
import { flatRedTriangleShaderCode } from '@/webgpu/shaders/flatRedTriangle';
import { useEffect, useRef, useState } from 'react';

enum CanvasMode {
    WebGPU,
    WebGL,
    Busted
}

const Canvas3D = () => {
    const [canvasMode, setCanvasMode] = useState<CanvasMode | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const initCanvas = async () => {
            try {
                await initializeWebGPU(canvasRef, flatRedTriangleShaderCode, rgbBlack);
                setCanvasMode(CanvasMode.WebGPU);
            } catch (e) {
                if (e instanceof WebGPUError) {
                    console.warn(e.message);
                    console.info("Falling back to WebGL from WebGPU");
                } else {
                    console.error('Unexpected error on initializing WebGPU:', e);
                }
            }

            if (canvasMode == CanvasMode.WebGPU) {
                return;
            }

            try {
                await initializeWebGL(canvasRef, vec4position_shader_source, flat_red_fragment_source);
                setCanvasMode(CanvasMode.WebGL);

            } catch (e) {
                if (e instanceof WebGLError) {
                    WebGLError.warnMessage(e.type);
                } else {
                    console.error('Unknown error on initializing WebGL: ', e);
                    // setCanvasMode(CanvasMode.Busted);
                }
            }
        }
        initCanvas();
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
                {canvasMode === CanvasMode.WebGPU && <p>Running on WebGPU</p>}
                {canvasMode === CanvasMode.WebGL && <p>Running on WebGL</p>}
                {canvasMode === CanvasMode.Busted && <p>Failed to initialize WebGPU and WebGL</p>}
            </div>
        </div>
    )
}

export default Canvas3D;