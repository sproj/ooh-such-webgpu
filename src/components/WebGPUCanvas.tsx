'use client';

import { rgbBlack } from '@/utils/rgb';
import { initializeWebGPU } from '@/webgpu/initializeWebGPU';
import { flatRedTriangleShaderCode } from '@/webgpu/shaders/flatRedTriangle';
import React, { useEffect, useRef } from 'react';

const WebGPUCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        initializeWebGPU(canvasRef, flatRedTriangleShaderCode, rgbBlack);
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default WebGPUCanvas;