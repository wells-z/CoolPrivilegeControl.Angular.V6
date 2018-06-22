import { ResponseStatus } from './response-status';

export class OperationResponse {
    RecordCount: number;
    CoolJWToken: string;
    ResponseStatus: ResponseStatus;
    Inst: any = {};

    constructor(recordCount: number, coolJWToken: string, responseStatus: ResponseStatus) {
        this.RecordCount = recordCount;
        this.CoolJWToken = coolJWToken;
        this.ResponseStatus = responseStatus;
    }
}