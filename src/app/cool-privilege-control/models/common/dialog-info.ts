import { OperationResponse } from './operation-response';
import { Error } from './error';

export class DialogInfo {
    DialogTitle: string;
    DialogMsg: string;
    IsFailed: boolean;
    DetailMsgs: Error[];

    constructor(public opt: OperationResponse) {
        if (opt != null && opt.ResponseStatus != null) {
            if (opt.ResponseStatus.ErrorCode == "00") {
                this.DialogTitle = "Information";
                this.DialogMsg = opt.ResponseStatus.Message;
                this.IsFailed = false;
            }
            else {
                this.DialogTitle = "Error Information";
                this.DialogMsg = opt.ResponseStatus.Message;
                this.IsFailed = true;

                if (opt.ResponseStatus.Errors != null) {
                    this.DetailMsgs = opt.ResponseStatus.Errors;
                }
            }
        }
    }
}
