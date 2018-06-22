import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';

import { LoginService } from './cool-privilege-control/services/login.service';
import { Error } from './cool-privilege-control/models/common/error';
import { OperationResponse } from './cool-privilege-control/models/common/operation-response';
import { ResponseStatus } from './cool-privilege-control/models/common/response-status';
import { DialogComponent } from './cool-privilege-control/components/common/dialog/dialog.component';
import { LoadingDialogComponent } from './cool-privilege-control/components/common/loading-dialog/loading-dialog.component';
import { LoadingDialogService } from './cool-privilege-control/services/loading-dialog.service';
import { PrivilegeComponent } from './cool-privilege-control/components/common/privilege/privilege.component';
import { PrivilegeService } from './cool-privilege-control/services/privilege.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lazy loading feature modules';

  constructor(public dialog: MatDialog, public _router:Router, public loadingDialogSer: LoadingDialogService, public loginSer: LoginService) {

  }

  ngOnInit() {
  }
}
