import { BasicSortableVm } from "./common/basic-sortable-vm";
import { FuncVm } from "./func-vm";
import { FuncTypeVm } from "./func-type-vm";
import { LuserVm } from "./luser-vm";

export class AuthorVm extends BasicSortableVm {
    LUserID: string;
    AuthorDT?: Date;
    FuncID: string;
    FuncTypeID: string;
    FuncInst: FuncVm;
    FuncTypeInst: FuncTypeVm;
    LUserInst: LuserVm;
    DateFrom?: Date;
    DateTo?: Date;
    IsApproved?: Boolean;
}
