import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from './reports.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(
    private reportsService: ReportsService,
    private toastr: ToastrService
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
          this.ledgersCollectionView.pageSize = 15;
          this.ledgersCollectionView.trackChanges = true;
          this.ledgersCollectionView.refresh();
          this.ledgersFlexGrid.refresh();

          for (let i = 0; i < this.ledgersCollectionView.items.length; i++) {
            this.totalDebitAmount += this.ledgersCollectionView.items[i].DebitAmount;
            this.totalCreditAmount += this.ledgersCollectionView.items[i].CreditAmount;
            this.totalBalanceAmount += this.ledgersCollectionView.items[i].BalanceAmount;
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

  ngOnInit() {
    if (this.getLedgersSubscription != null) this.getLedgersSubscription.unsubscribe();
  }
}
