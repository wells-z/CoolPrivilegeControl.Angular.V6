import { SelectedFuncDetail } from './relativevm/selected-func-detail'
import { AccPrivilegeWorg } from './relativevm/acc-privilege-worg'

export class LoginUserVm {
    LoginName: string;
    LoginPwd: string;
    LanguageKey: string;
    PrivilegeList: AccPrivilegeWorg[];
    SelectedFuncDetailList: SelectedFuncDetail[];
}
