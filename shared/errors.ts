export class CustomError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}