import { Component, OnInit, Inject } from '@angular/core';
import { 
  // MatDialog, 
  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { 
  LocalStorage, 
  // SessionStorage 
} from 'ngx-webstorage';

// import { OperationResponse } from '../../models/common/operation-response';
import { AuditLogVm } from '../../../models/audit-log-vm';

@Component({
  selector: 'app-audit-log-detail',
  templateUrl: './audit-log-detail.component.html',
  styleUrls: ['./audit-log-detail.component.css']
})
export class AuditLogDetailComponent implements OnInit {

  @LocalStorage()
  LangPack: any;

  @LocalStorage()
  AuthKey: string;

  @LocalStorage()
  public LangKey: string;

  auditLogVM: AuditLogVm;

  // @Output() click: EventEmitter<boolean> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AuditLogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data != null) {
      this.auditLogVM = data.AuditLogVM;
    }
  }

  onOKClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
