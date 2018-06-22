import { BasicSortableVm } from "./common/basic-sortable-vm";
import { LuserOrgVm } from "./relativevm/luser-org-vm";

export class OrgVm extends BasicSortableVm {
    OrgPath: string;
    OrgKey: string;
    Status: number;
    OrgLevls: number;

    LUserOrgInsts: LuserOrgVm[];
}
