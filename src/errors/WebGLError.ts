export enum WebGLErrorType {
    NotSupported = 'WebGLNotSupported',
    InvalidShaderSource = 'InvalidShaderSource',
    NoCanvas = 'NoCanvasProvided',
}
export class WebGLError extends Error {
    type: WebGLErrorType;

    static warnMessage(type: WebGLErrorType) {
        console.warn(this.messages[type])
    }

    private static messages: Record<WebGLErrorType, string> = {
        [WebGLErrorType.NotSupported]: 'WebGL is not supported in this browser',
        [WebGLErrorType.InvalidShaderSource]: 'WebGL requires at least one vertex and one fragment shader',
        [WebGLErrorType.NoCanvas]: 'Provided canvas is null or undefined',
    };

    constructor(errorType: WebGLErrorType) {
        super(WebGLError.messages[errorType]);
        this.type = errorType;
        this.name = 'WebGLError'
    }
}