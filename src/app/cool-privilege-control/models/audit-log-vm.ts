import { BasicSortableVm } from "./common/basic-sortable-vm";
import { LuserVm } from "./luser-vm";

export class AuditLogVm extends BasicSortableVm {
    LUserID:string;
    TableName:string;
    EventType:string;
    OriginalValue:string;
    NewValue:string;
    RecordKey:string;
    CreateDate?:Date;
    CreatedBy:string;
    LoginName:string;
    DateFrom?:Date;
    DateTo?:Date;
    LUserInst: LuserVm;
}
