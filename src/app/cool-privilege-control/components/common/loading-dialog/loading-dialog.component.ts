import { Component, OnInit } from '@angular/core';
import { LoadingDialogService } from '../../../services/loading-dialog.service';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent implements OnInit {

  isShow: boolean;

  constructor(public loadingDialogSer: LoadingDialogService) { }

  ngOnInit() {
    this.loadingDialogSer.onToggerEvent.subscribe(isOpen => {
      this.isShow = isOpen;
    });
  }
  
}
