declare class CustomError extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export default CustomError;
