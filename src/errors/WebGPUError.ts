export enum WebGPUErrorType {
    NotSupported = 'WebGPUNotSupported',
    NoAdapter = 'WebGPUNoAdapter',
    NoDevice = 'WebGPUNoDevice',
    NoContext = 'WebGPUNoContext',
    NoCanvas = 'NoCanvasProvided',
    InvalidShaderSource = 'InvalidShaderSource',
    Unknown = 'WebGPUUnknown',
}

export class WebGPUError extends Error {
    type: WebGPUErrorType;

    private static messages: Record<WebGPUErrorType, string> = {
        [WebGPUErrorType.NotSupported]: 'WebGPU is not supported in this browser',
        [WebGPUErrorType.NoAdapter]: 'Failed to get GPU adapter',
        [WebGPUErrorType.NoDevice]: 'Failed to get GPU device',
        [WebGPUErrorType.NoContext]: 'Failed to get WebGPU context',
        [WebGPUErrorType.NoCanvas]: 'Provided canvas is null or undefined',
        [WebGPUErrorType.InvalidShaderSource]: 'WebGPU requires a combined shaderCode for the pipeline',
        [WebGPUErrorType.Unknown]: 'An unknown WebGPU error occurred',
    };

    constructor(type: WebGPUErrorType, originalError?: Error) {
        const message = WebGPUError.messages[type];
        const fullMessage = originalError
            ? `${message}::(${originalError.message})`
            : message;

        super(fullMessage);
        this.type = type;
        this.name = 'WebGPUError';
    }
}

