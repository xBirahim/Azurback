interface CreateAppErrorProps {
    message: string;
    code: number;
    isOperational?: boolean;
    cause?: any;
}

/**
 * Represents an application-specific error.
 * Extends the built-in `Error` class to include additional properties.
 */
export class AppError extends Error {
    /**
     * The HTTP status code associated with the error.
     */
    public readonly statusCode: number;

    /**
     * Indicates whether the error is operational (i.e., expected) or not.
     */
    public readonly isOperational: boolean;

    /**
     * Creates an instance of `AppError`.
     *
     * @param message - The error message.
     * @param statusCode - The HTTP status code.
     * @param isOperational - Indicates if the error is operational. Defaults to `true`.
     */
    constructor(message: string, statusCode: number, isOperational: boolean = true, cause?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.cause = cause;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const isAppError = (error: unknown): error is AppError => {
    return error instanceof AppError;
};

export const createError = (props: CreateAppErrorProps): AppError => {
    return new AppError(props.message, props.code, props.isOperational, props.cause);
};
