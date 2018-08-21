import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { Subject } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(
    private http: Http,
    private appSettings: AppSettings
  ) { }

  public headers = new Headers({
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json'
  });
  public options = new RequestOptions({ headers: this.headers });
  private defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public getLedgerSource = new Subject<ObservableArray>();
  public getLedgerObservable = this.getLedgerSource.asObservable();

  public getLedgers(cardNumber: string, dateStart: string, dateEnd: string): void {
    let ledgersObservableArray = new ObservableArray();
    this.getLedgerSource.next(ledgersObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/ledger/list/" + cardNumber + "/" + dateStart + "/" + dateEnd, this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            let ledgerDate = new Date(results[i].LedgerDateTime);
            let ledgerDateTime = ('0' + (ledgerDate.getMonth() + 1)).slice(-2) + '-' + ('0' + ledgerDate.getDate()).slice(-2) + '-' + ledgerDate.getFullYear();

            let balanceAmount = results[i].DebitAmount - results[i].CreditAmount;

            ledgersObservableArray.push({
              Id: results[i].Id,
              CardId: results[i].CardId,
              CardNumber: results[i].CardNumber,
              LedgerDateTime: ledgerDateTime,
              DebitAmount: results[i].DebitAmount,
              DebitAmountDisplay: results[i].DebitAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              CreditAmount: results[i].CreditAmount,
              CreditAmountDisplay: results[i].CreditAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              Particulars: results[i].Particulars,
              BalanceAmount: balanceAmount,
              BalanceAmountDisplay: balanceAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            });
          }
        }

        this.getLedgerSource.next(ledgersObservableArray);
      }
    );
  }
}
