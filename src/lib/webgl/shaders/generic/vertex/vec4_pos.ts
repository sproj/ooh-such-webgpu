// vec4 position in, vec4 out
export const vec4position_shader_source = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
  }
`;