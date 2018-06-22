import { BasicSortableVm } from "./common/basic-sortable-vm";
import { SelectedFuncDetail } from "./relativevm/selected-func-detail";
import { SelectedOrgDetailAccRole } from "./relativevm/selected-org-detail-acc-role";

export class OrgDetailVm extends BasicSortableVm {
    OrgDKey:string;
    
    AccessPrivilegeTypeShort: number;

    SelectedFuncDetailList: SelectedFuncDetail[];

    SelectedOrgDetailAccRoleList: SelectedOrgDetailAccRole[];
}
