import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from './reports.service';
import { ToastrService } from 'ngx-toastr';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
  ) { }

  public cardNumber: string;
  public dateStartValue = new Date();
  public dateEndValue = new Date();

  public getLedgersSubscription: any;

  public ledgersData: ObservableArray = new ObservableArray();
  public ledgersCollectionView: CollectionView = new CollectionView(this.ledgersData);
  public ledgersNumberOfPageIndex: number = 15;

  public isProgressBarHidden = true;

  @ViewChild('ledgersFlexGrid') ledgersFlexGrid: WjFlexGrid;

  public totalDebitAmount: number = 0;
  public totalCreditAmount: number = 0;
  public totalBalanceAmount: number = 0;

  public isBtnGenerateDisabled: Boolean = true;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public createCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";

      if (i == 0) {
        rows = 15;
        rowsString = "15 Rows";
      } else if (i == 1) {
        rows = 50;
        rowsString = "50 Rows";
      } else if (i == 2) {
        rows = 100;
        rowsString = "100 Rows";
      } else if (i == 3) {
        rows = 150;
        rowsString = "150 Rows";
      } else {
        rows = 200;
        rowsString = "200 Rows";
      }

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.ledgersNumberOfPageIndex = selectedValue;

    this.ledgersCollectionView.pageSize = this.ledgersNumberOfPageIndex;
    this.ledgersCollectionView.refresh();
    this.ledgersFlexGrid.refresh();
  }

  public getCardsData(): void {
    this.isBtnGenerateDisabled = true;

    this.totalDebitAmount = 0;
    this.totalCreditAmount = 0;
    this.totalBalanceAmount = 0;

    let startDate = ('0' + (this.dateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateStartValue.getDate()).slice(-2) + '-' + this.dateStartValue.getFullYear();
    let endDate = ('0' + (this.dateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateEndValue.getDate()).slice(-2) + '-' + this.dateEndValue.getFullYear();

    this.reportsService.getLedgers(this.cardNumber, startDate, endDate);
    this.getLedgersSubscription = this.reportsService.getLedgerObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.ledgersData = data;
          this.ledgersCollectionView = new CollectionView(this.ledgersData);
          this.ledgersCollectionView.pageSize = this.ledgersNumberOfPageIndex;
          this.ledgersCollectionView.trackChanges = true;
          this.ledgersCollectionView.refresh();
          this.ledgersFlexGrid.refresh();

          for (let p = 1; p <= this.ledgersCollectionView.pageCount; p++) {
            for (let i = 0; i < this.ledgersCollectionView.items.length; i++) {
              this.totalDebitAmount += this.ledgersCollectionView.items[i].DebitAmount;
              this.totalCreditAmount += this.ledgersCollectionView.items[i].CreditAmount;
              this.totalBalanceAmount += this.ledgersCollectionView.items[i].BalanceAmount;
            }

            if (p == this.ledgersCollectionView.pageCount) {
              this.ledgersCollectionView.moveToFirstPage();
            } else {
              this.ledgersCollectionView.moveToNextPage();
            }
          }

          this.toastr.success("Generate Successful!");
        } else {
          this.toastr.error("No data!");
        }

        this.isProgressBarHidden = true;
        this.isBtnGenerateDisabled = false;

        let btnGenerate: Element = document.getElementById("btnGenerate");
        btnGenerate.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generate";
        btnGenerate.removeAttribute("disabled");

        if (this.getLedgersSubscription != null) this.getLedgersSubscription.unsubscribe();
      }
    );
  }

  public btnGenerateLedgerOnclick() {
    if (this.cardNumber != "") {
      let btnGenerate: Element = document.getElementById("btnGenerate");
      btnGenerate.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generating...";
      btnGenerate.setAttribute("disabled", "disabled");

      this.isProgressBarHidden = false;

      this.ledgersData = new ObservableArray();
      this.ledgersCollectionView = new CollectionView(this.ledgersData);
      this.ledgersCollectionView.pageSize = 15;
      this.ledgersCollectionView.trackChanges = true;
      this.ledgersCollectionView.refresh();
      this.ledgersFlexGrid.refresh();

      this.getCardsData();
    } else {
      this.toastr.error("Please provide a card number.");
    }
  }

  public onCardNumberKeyPress(event: any) {
    if (this.cardNumber != "") {
      this.isBtnGenerateDisabled = false;
    } else {
      this.isBtnGenerateDisabled = true;
    }
  }

  public btnExportLedgerOnclick(): void {
    let data: any[] = [{
      Date: "Date",
      Particulars: "Particulars",
      DebitAmount: "Debit",
      CreditAmount: "Credit",
      BalanceAmount: "Balance"
    }];

    if (this.ledgersCollectionView.items.length > 0) {
      for (let p = 1; p <= this.ledgersCollectionView.pageCount; p++) {
        for (let i = 0; i < this.ledgersCollectionView.items.length; i++) {
          data.push({
            Date: this.ledgersCollectionView.items[i].LedgerDateTime,
            Particulars: this.ledgersCollectionView.items[i].Particulars,
            DebitAmount: this.ledgersCollectionView.items[i].DebitAmount,
            CreditAmount: this.ledgersCollectionView.items[i].CreditAmount,
            BalanceAmount: this.ledgersCollectionView.items[i].BalanceAmount,
          });
        }

        if (p == this.ledgersCollectionView.pageCount) {
          this.ledgersCollectionView.moveToFirstPage();
        } else {
          this.ledgersCollectionView.moveToNextPage();
        }
      }
    }

    let cardNumber = this.cardNumber;
    let startDate = ('0' + (this.dateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateStartValue.getDate()).slice(-2) + '-' + this.dateStartValue.getFullYear();
    let endDate = ('0' + (this.dateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateEndValue.getDate()).slice(-2) + '-' + this.dateEndValue.getFullYear();

    new Angular5Csv(data, cardNumber + '_From(' + startDate + ")_To(" + endDate + ")");
  }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("ReportLedger");
      this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;
          } else {
            this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
          }

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
        }
      );
    }, 1000);
  }

  ngOnDestroy() {
    if (this.getLedgersSubscription != null) this.getLedgersSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
