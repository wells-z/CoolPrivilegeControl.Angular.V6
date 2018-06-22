import { Component, OnInit, Inject } from '@angular/core';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogInfo } from '../../../models/common/dialog-info';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  DialogInfo: DialogInfo;

  // @Output() click: EventEmitter<boolean> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data != null) {
      this.DialogInfo = new DialogInfo(data.OptResp);
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
