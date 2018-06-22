import { BasicSortableVm } from "./common/basic-sortable-vm";
import { SelectedFuncType } from "./relativevm/selected-func-type";

export class FuncVm extends BasicSortableVm {
    FuncPath: string;
    FuncKey: string;
    FuncName: string;
    Status: number;
    Url: string;
    SelectedFucTypeList: SelectedFuncType[];
}
