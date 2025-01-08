import { SceneDefinition } from "@/lib/SceneDefinition";
import { flat_red_fragment_source } from "@/lib/webgl/shaders/generic/fragment/flat_red";
import { vec4position_shader_source } from "@/lib/webgl/shaders/generic/vertex/vec4_pos";
import { flatRedTriangleShaderCode } from "@/lib/webgpu/shaders/flatRedTriangle";

export const FlatTriangleScene: SceneDefinition = {
    vertices: new Float32Array([
        0.0, 1.0, 0.0,   // top
        -1.0, -1.0, 0.0, // left
        1.0, -1.0, 0.0,  // right
    ]),
    shaderCode: flatRedTriangleShaderCode,
    vertexShaderSources: [vec4position_shader_source],
    fragmentShaderSources: [flat_red_fragment_source],
    name: "Flat red triangle"

}