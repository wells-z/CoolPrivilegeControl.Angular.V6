import { Component, OnInit, Inject } from '@angular/core';
import { 
  // MatDialog, 
  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { 
  LocalStorage, 
  // SessionStorage 
} from 'ngx-webstorage';

// import { OperationResponse } from '../../models/common/operation-response';
import { AuthorVm } from '../../../models/author-vm';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.css']
})
export class AuthorDetailComponent implements OnInit {

  @LocalStorage()
  LangPack: any;

  @LocalStorage()
  AuthKey: string;

  @LocalStorage()
  public LangKey: string;

  authorVM: AuthorVm;

  // @Output() click: EventEmitter<boolean> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AuthorDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data != null) {
      this.authorVM = data.AuthorVM;
    }
  }

  onOKClick(): void {
    this.dialogRef.close();
    // this.loadingDialogSer.isFailureDialogOpened = false;

    // this.click.emit(false);
  }

  ngOnInit() {
  }

}
