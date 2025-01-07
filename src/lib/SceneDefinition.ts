interface SceneDefinition {
    vertices: Float32Array;
    indices: Uint16Array;
    shaderCode: string;              // WebGPU
    vertexShaderSources: string[];   // WebGL
    fragmentShaderSources: string[]; // WebGL
}