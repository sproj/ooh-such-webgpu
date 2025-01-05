export enum WebGLErrorType {
    NotSupported = 'WebGLNotSupported',
}
export class WebGLError extends Error {
    type: WebGLErrorType;

    static warnMessage(type: WebGLErrorType) {
        console.warn(this.messages[type])
    }

    private static messages: Record<WebGLErrorType, string> = {
        [WebGLErrorType.NotSupported]: 'WebGL is not supported in this browser',
    };

    constructor(errorType: WebGLErrorType) {
        super(WebGLError.messages[errorType]);
        this.type = errorType;
        this.name = 'WebGLError'
    }
}