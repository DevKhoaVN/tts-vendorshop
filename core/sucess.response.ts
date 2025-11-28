import { statusCode, reasonStatusCode } from "./constant/status";
import {Response} from 'express'

interface successResponseParams{
    message?: string,
    status?: number,
    metadata?: Record<string, string>
}

interface responseParams{
    message?: string,
    metadata?: Record<string,any>
}

export class SuccessResponse {

    message: string;
    status: number;
    metadata: Record<string, string>

    constructor({ message, status = statusCode.OK,metadata = {} }: successResponseParams) {
        this.message = message || 'OK';
        this.status = status;
        this.metadata = metadata;
    }

    send(res: Response, headers: Record<string, string>= {}): Response {
        return res.status(this.status).json(this);
    }
}


export class OK extends SuccessResponse {
    constructor({ message, metadata }: responseParams) {
        super({ message, status: statusCode.OK, metadata });
    }
}

export class CREATED extends SuccessResponse {
    constructor({ message, metadata }:responseParams) {
        super({ message, status: statusCode.CREATED, metadata });
    }
}


