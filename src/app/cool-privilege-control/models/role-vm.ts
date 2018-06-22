import { BasicSortableVm } from "./common/basic-sortable-vm";
import { SelectedFuncDetail } from "./relativevm/selected-func-detail";

export class RoleVm extends BasicSortableVm {
    RoleKey: string;
    SelectedFuncDetailList: SelectedFuncDetail[];
}