import { BasicSortableVm } from "./common/basic-sortable-vm";
import { SelectedRole } from "./relativevm/selected-role";
import { SelectedLuserOrg } from "./relativevm/selected-luser-org";
import { SelectedFuncDetail } from "./relativevm/selected-func-detail";

export class LuserVm extends BasicSortableVm {
    LoginName: string;
    Password: string;
    AccessPrivilegeTypeShort: number;
    Status: number;

    SelectedRoleList: SelectedRole[];

    SelectedLUserOrgList: SelectedLuserOrg[];

    SelectedFuncDetailList: SelectedFuncDetail[];
}
