import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HostListener } from "@angular/core";
import { Location } from '@angular/common';
// import { MatIconRegistry } from '@angular/material';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

import { Error } from './models/common/error';
import { OperationResponse } from './models/common/operation-response';
import { ResponseStatus } from './models/common/response-status';
import { MenuItem } from "./models/common/menu-item";
// import { DialogComponent } from './components/common/dialog/dialog.component';

import { AccPrivilegeWorg } from "./models/relativevm/acc-privilege-worg";

import { LoadingDialogService } from './services/loading-dialog.service';
import { MsgDialogService } from './services/msg-dialog.service';
import { FuncMgtService } from './services/func-mgt.service';
import { RoutingHistoryService } from './services/routing-history.service';
import { LoginService } from './services/login.service';


@Component({
  selector: 'app-cool-privilege-control',
  templateUrl: './cool-privilege-control.component.html',
  styleUrls: ['./cool-privilege-control.component.css'],
  animations: [
    trigger('subMenuState', [
      state('*', style({ display: 'none', opacity: 0 })),
      state('false', style({ display: 'none', opacity: 0 })),
      state('true', style({ transform: 'translateY(0)', opacity: 1, display: 'block' })),
      transition('* => true', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(300, style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition('* => false', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate(300, style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class CoolPrivilegeControlComponent implements OnInit {

  @LocalStorage()
  public LangPack: any;

  @LocalStorage()
  public AuthKey: string;

  @LocalStorage()
  public LangKey: string;

  screenHeight: number;
  screenWidth: number;

  sideMenuMode: string;

  loginName: string;

  PrivilegeWOrgList: AccPrivilegeWorg[] = [];

  isShowDashBoard: boolean = true;

  showOutlet: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 600) {
      this.sideMenuMode = "over";
    }
    else {
      this.sideMenuMode = "push";
      this.openMenu = true;
    }
  }

  public openMenu: boolean = false;

  public menuItems: MenuItem[] = [];

  public isSignout: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router, public dialog: MatDialog, private location: Location, public loginSer: LoginService, public funcMgtSer: FuncMgtService, public msgDialogService: MsgDialogService, public loadingDialogSer: LoadingDialogService, public routingHistorySer: RoutingHistoryService) {
    this.onResize();
  }

  genMenu(langKey: string) {
    if (this.AuthKey != null && this.AuthKey != "") {
      this.funcMgtSer.getMenuItemList(langKey).subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              // this.menuItems = (Observable.of(resp.Inst));
              resp.Inst.forEach(func => {
                let tempMenuItem = new MenuItem(func.MenuItemIcon, func.MenuItemUrl, func.MenuItemName, func.MenuItemPath, func.SubMenuItems);
                this.menuItems.push(tempMenuItem);
              });
            }
            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.msgDialogService.OpenDialog(resp);
          }
        },
        err => {
          let responseStatus = new ResponseStatus();
          responseStatus.ErrorCode = "01";
          responseStatus.Message = err.message;

          let optResp = new OperationResponse(null, '', responseStatus);

          this.msgDialogService.OpenDialog(optResp);
        }
      );
    }
  }

  onActivate(event: any) {
    this.isShowDashBoard = false;
  }

  onDeactivate(event: any) {
    this.isShowDashBoard = true;
    this.getAccRightList();
  }

  //Get Access Right Info
  getAccRightList() {
    if (this.AuthKey != null && this.AuthKey != "") {
      this.loginSer.getLoginInfo().subscribe(
        resp => {
          if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {
            if (resp.Inst != null) {
              this.loginName = resp.Inst.LoginName;
              this.PrivilegeWOrgList = resp.Inst.PrivilegeWOrgList;
            }
            this.loadingDialogSer.refreshAuthKey(resp);
          }
          else if (resp != null) {
            this.msgDialogService.OpenDialog(resp);
          }
        },
        err => {
          this.msgDialogService.OpenFailureDialog(err);
        }
      );
    }
  }

  //Initialize
  ngOnInit() {
    this.isShowDashBoard = true;

    this.routingHistorySer.loadRouting();

    this.loadingDialogSer.onLangChangeEvent.subscribe(langPack => {
      this.LangPack = langPack;
      this.genMenu(this.LangKey);
    });

    let strPath = this.location.path();

    if (strPath != "/CoolPrivilegeControl/" + this.LangKey) {
      this.isShowDashBoard = false;
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has("LangKey")) {
        let langKey = params.get("LangKey");
        if (langKey != null && this.LangKey != langKey) {
          this.loadingDialogSer.GetLangRes(langKey);
        }
        else {
          this.genMenu(this.LangKey);
        }
        this.LangKey = langKey;
      }
      else {
        this.router.navigate(["/CoolPrivilegeControl", "en"]);
      }
    }
    );

    this.openMenu = false;

    // let menusTest = {
    //   "Inst": [
    //     {
    //       "MenuItemIcon": "",
    //       "MenuItemName": "AccessManage",
    //       "MenuItemPath": "9",
    //       "SubMenuItems": [
    //         {
    //           "MenuItemIcon": "",
    //           "MenuItemName": "FManage",
    //           "MenuItemPath": "9-1",
    //           "SubMenuItems": null
    //         },
    //         {
    //           "MenuItemIcon": "",
    //           "MenuItemName": "FTManage",
    //           "MenuItemPath": "9-2",
    //           "SubMenuItems": null
    //         },
    //         {
    //           "MenuItemIcon": "",
    //           "MenuItemName": "LUserManage",
    //           "MenuItemPath": "9-3",
    //           "SubMenuItems": [{
    //             "MenuItemIcon": "",
    //             "MenuItemName": "LUserManage 1.1 ",
    //             "MenuItemPath": "9-3-1",
    //             "SubMenuItems": [{
    //               "MenuItemIcon": "",
    //               "MenuItemName": "LUserManage 1.1.1 ",
    //               "MenuItemPath": "9-3-1-1",
    //               "SubMenuItems": null
    //             },
    //             {
    //               "MenuItemIcon": "",
    //               "MenuItemName": "LUserManage 1.1.2",
    //               "MenuItemPath": "9-3-1-2",
    //               "SubMenuItems": null
    //             }]
    //           },
    //           {
    //             "MenuItemIcon": "",
    //             "MenuItemName": "LUserManage 1.2",
    //             "MenuItemPath": "9-3-2",
    //             "SubMenuItems": null
    //           }]
    //         },
    //         {
    //           "MenuItemIcon": "",
    //           "MenuItemName": "Authentication",
    //           "MenuItemPath": "9-10",
    //           "SubMenuItems": null
    //         }
    //       ]
    //     }
    //   ],
    //   "ResponseStatus": {
    //     "ErrorCode": "00"
    //   }
    // };
    // menusTest.Inst.forEach(func => {
    //   let tempMenuItem = new MenuItem(func.MenuItemIcon, func.MenuItemName, func.MenuItemPath, func.SubMenuItems);
    //   // tempMenuItem.MenuItemName = func.MenuItemName;
    //   // tempMenuItem.MenuItemPath = func.MenuItemPath;
    //   // tempMenuItem.MenuItemIcon = func.MenuItemIcon;
    //   // tempMenuItem.SubMenuItems = func.SubMenuItems;
    //   this.menuItems.push(tempMenuItem);
    // });

    this.msgDialogService.onClosedEvent.subscribe(optResp => {
      if (this.isSignout) {
        if (optResp != null && optResp.ResponseStatus != null && optResp.ResponseStatus.ErrorCode == "00") {
          window.location.href = window.location.href.substr(0, window.location.href.indexOf("CoolPrivilegeControl")) + "login/" + this.LangKey;
        }
        this.isSignout = false;
      }
    });

    this.getAccRightList();
  }

  menuItemClick(menuItem: MenuItem) {
    // console.log(menuItem.MenuItemPath);
    this.router.navigate(["/CoolPrivilegeControl", this.LangKey, menuItem.MenuItemUrl]);
  }

  //#region [ Event -- Sign out ]
  OnSignout() {
    this.loadingDialogSer.OpenLoadingDialog();
    this.loginSer.logout().subscribe(
      resp => {
        if (resp != null && resp.ResponseStatus != null && resp.ResponseStatus.ErrorCode == "00") {

          this.AuthKey = "";

          resp.ResponseStatus.Message = this.LangPack.hasOwnProperty('I003') ? this.LangPack['I003'] : 'You have successfully logged out!';

          this.isSignout = true;
          this.msgDialogService.OpenDialog(resp);
        }
        else if (resp != null) {
          this.msgDialogService.OpenDialog(resp);
        }
        this.loadingDialogSer.CloseLoadingDialog();
      },
      err => {
        this.msgDialogService.OpenFailureDialog(err);
        this.loadingDialogSer.CloseLoadingDialog();
      }
    );
  }
  //#endregion

}
