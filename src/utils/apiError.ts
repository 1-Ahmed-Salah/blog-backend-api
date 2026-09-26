export class ApiError extends Error {

    public statusCode: number;
    public status: 'fail' | 'error';
    public isOperational: boolean;

    public constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail' : 'error';
        this.isOperational = true
    }
}
