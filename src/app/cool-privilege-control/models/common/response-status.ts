import { Error } from './error';

export class ResponseStatus {
    ErrorCode:string;
    Message:string;
    Errors:Error[];
}
