import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paging-bar',
  templateUrl: './paging-bar.component.html',
  styleUrls: ['./paging-bar.component.css']
})
export class PagingBarComponent implements OnInit, OnChanges {
  @Input() totalcount: number;
  @Input() pagesize: number;
  @Input() pageindex: number;
  @Input() displaypagecount: number;
  @Input() langPackage: any;
  @Output() PageChange = new EventEmitter<number>();

  pagingBarInfo: any;

  pageIndexInfo: string;

  recordInfo: string;

  pageList: number[] = [];

  loadComponent() {
    let pageInfo = this.GetPageList(this.totalcount, this.pagesize, this.pageindex, this.displaypagecount);

    this.pagingBarInfo = {
      totalcount: this.totalcount,
      pagesize: this.pagesize,
      pageindex: this.pageindex,
      Caption: {
        First: "First",
        Prev: "Prev",
        Next: "Next",
        Last: "Last"
      },
      Items: []
    }

    if (this.langPackage != null) {
      if (this.langPackage.hasOwnProperty("First")) {
        this.pagingBarInfo.Caption.First = this.langPackage.First;
      }

      if (this.langPackage.hasOwnProperty("Prev")) {
        this.pagingBarInfo.Caption.Prev = this.langPackage.Prev;
      }

      if (this.langPackage.hasOwnProperty("Next")) {
        this.pagingBarInfo.Caption.Next = this.langPackage.Next;
      }

      if (this.langPackage.hasOwnProperty("Last")) {
        this.pagingBarInfo.Caption.Last = this.langPackage.Last;
      }
    }


    if (this.totalcount > 0) {
      //First Page
      let itemFirst = {
        PageIndex: 1,
        Name: this.pagingBarInfo.Caption.First,
        IsFirst: true,
        Disabled: this.pageindex == 1
      };
      this.pagingBarInfo.Items.push(itemFirst);

      //Previous Page And Next Page And Normal Page
      for (var i = 0; i < pageInfo.Pages.length; ++i) {
        if (i == 0) {
          let item = {
            PageIndex: pageInfo.Pages[i],
            Name: this.pagingBarInfo.Caption.Prev,
            IsPre: true,
            Disabled: this.pageindex == 1
          };
          this.pagingBarInfo.Items.push(item);
        }
        else if (i == pageInfo.Pages.length - 1) {
          let item = {
            PageIndex: pageInfo.Pages[i],
            Name: this.pagingBarInfo.Caption.Next,
            IsNext: true,
            Disabled: this.pageindex == pageInfo.TotalPage
          };
          this.pagingBarInfo.Items.push(item);
        }
        else {
          let item = {
            PageIndex: pageInfo.Pages[i],
            Name: pageInfo.Pages[i],
            IsCurrPage: pageInfo.Pages[i] == this.pageindex,
            IsPages: true
          };
          this.pagingBarInfo.Items.push(item);
        }
      }

      //Last Page
      let itemLast = {
        PageIndex: pageInfo.TotalPage,
        Name: this.pagingBarInfo.Caption.Last,
        IsLast: true,
        Disabled: this.pageindex == pageInfo.TotalPage
      };
      this.pagingBarInfo.Items.push(itemLast);

      this.pageList = [];
      for (let i = 0; i < pageInfo.TotalPage; ++i) {
        this.pageList.push((i + 1));
      }
    }

    //#region [ Page Info. ]
    if (this.langPackage != null && this.langPackage.hasOwnProperty("Page")) {
      this.pageIndexInfo = this.langPackage.Page + ": " + this.pagingBarInfo.pageindex + " / " + this.GetPageCount(this.pagingBarInfo.totalcount, this.pagingBarInfo.pagesize);
    }
    else {
      this.pageIndexInfo = "Page: " + this.pagingBarInfo.pageindex + " / " + this.GetPageCount(this.pagingBarInfo.totalcount, this.pagingBarInfo.pagesize);
    }
    //#endregion

    let currentPageStartIndex = (this.pagingBarInfo.pageindex - 1) * this.pagingBarInfo.pagesize == 0 ? 1 : (this.pagingBarInfo.pageindex - 1) * this.pagingBarInfo.pagesize;
    let currentPageEndIndex = (this.pagingBarInfo.pageindex) * this.pagingBarInfo.pagesize > this.pagingBarInfo.totalcount ? this.pagingBarInfo.totalcount : (this.pagingBarInfo.pageindex) * this.pagingBarInfo.pagesize;
    let totalRecord = this.pagingBarInfo.totalcount;
    //#region [ Record Info. ]
    if (this.langPackage != null && this.langPackage.hasOwnProperty("To") && this.langPackage.hasOwnProperty("of")) {
      this.recordInfo = currentPageStartIndex + " " + this.langPackage.To + " " + currentPageEndIndex + " " + this.langPackage.of + " " + totalRecord;
    }
    else {
      this.recordInfo = currentPageStartIndex + " to " + currentPageEndIndex + " of " + totalRecord;
    }
    //#endregion
  }

  PagingBtnOnClick(PGIndex: number) {
    this.PageChange.emit(PGIndex);
  }

  GetPageList(int_TotalRecord: number, int_PageSize: number, int_CurrentPage: number, int_DisplayPageCount: number) {
    let PageNums = [];

    let TotalPage = 0;

    if (int_TotalRecord > 0) {
      TotalPage = this.GetPageCount(int_TotalRecord, int_PageSize);

      if (int_DisplayPageCount > TotalPage) {
        int_DisplayPageCount = TotalPage;
      }

      let temp1 = parseInt(((int_DisplayPageCount - 1) / 2).toString());
      let temp2 = (int_DisplayPageCount - 1) - temp1;

      let leftCount = 0;
      let rightCount = 0;

      for (let i = 0; i < temp1; ++i) {
        if (int_CurrentPage - temp1 + i < 1) {
          rightCount++;
        }
        else {
          leftCount++;
        }
      }

      for (let i = 0; i < temp2; ++i) {
        if (int_CurrentPage + temp2 - i > TotalPage) {
          leftCount++;
        }
        else {
          rightCount++;
        }
      }

      for (let i = leftCount; i > 0; --i) {
        PageNums.push(int_CurrentPage - i);
      }

      PageNums.push(int_CurrentPage);

      for (let i = 1; i <= rightCount; ++i) {
        PageNums.push(int_CurrentPage + i);
      }


      //Previous
      if (int_CurrentPage - 1 != 0) {
        PageNums.splice(0, 0, int_CurrentPage - 1);
        //ret.Insert(0, int_CurrentPage - 1);
      }
      else {
        PageNums.splice(0, 0, int_CurrentPage);
        //ret.Insert(0, int_CurrentPage);
      }

      //Next
      if (int_CurrentPage + 1 > TotalPage) {
        PageNums.push(int_CurrentPage);
        //ret.Add(int_CurrentPage);
      }
      else {
        PageNums.push(int_CurrentPage + 1);
        //ret.Add(int_CurrentPage + 1);
      }
    }
    return {
      Pages: PageNums,
      TotalPage: TotalPage
    }
  }

  GetPageCount(int_TotalRecord: number, int_PageSize: number) {
    var pageCount = int_TotalRecord % int_PageSize > 0 ? parseInt((int_TotalRecord / int_PageSize).toString()) + 1 : parseInt((int_TotalRecord / int_PageSize).toString());
    // for (let i = 0; i < pageCount; ++i) {
    //   this.pageList.push((i + 1).toString());
    // }
    return pageCount;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (this.totalcount != null && this.pagesize != null && this.pageindex != null && this.displaypagecount != null)
      this.loadComponent();
  }
}
