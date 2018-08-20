import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { TransferModel } from './transfer.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
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

  public getMotherCardBalanceSource = new Subject<number>();
  public getMotherCardBalancedObservable = this.getMotherCardBalanceSource.asObservable();

  public getCardSource = new Subject<TransferModel>();
  public getCardObservable = this.getCardSource.asObservable();

  public transferAmountSource = new Subject<string[]>();
  public transferAmountObservable = this.transferAmountSource.asObservable();

  public getMotherCardBalance(): void {
    this.getMotherCardBalanceSource.next(0);
    this.http.get(this.defaultAPIURLHost + "/api/transfer/motherCardBalance", this.options).subscribe(
      response => {
        var results = response.json();
        if (results != null) {
          this.getMotherCardBalanceSource.next(results);
        } else {
          this.getMotherCardBalanceSource.next(null);
        }
      }
    );
  }

  public getCardDetails(cardNumber: string): void {
    let cardDetail: TransferModel = {
      Id: 0,
      CardNumber: "",
      FullName: "",
      Address: "",
      Email: "",
      ContactNumber: "",
      UserId: 0,
      Balance: 0,
      Particulars: "",
      Status: ""
    };

    this.getCardSource.next(cardDetail);
    this.http.get(this.defaultAPIURLHost + "/api/transfer/detail/card/" + cardNumber, this.options).subscribe(
      response => {
        var results = response.json();
        if (results != null) {
          cardDetail.CardNumber = results.CardNumber;
          cardDetail.FullName = results.FullName;
          cardDetail.Address = results.Address;
          cardDetail.Email = results.Email;
          cardDetail.ContactNumber = results.ContactNumber;
          cardDetail.UserId = results.UserId;
          cardDetail.Balance = results.Balance;
          cardDetail.Particulars = results.Particulars;
          cardDetail.Status = results.Status;

          this.getCardSource.next(cardDetail);
        } else {
          this.getCardSource.next(null);
        }
      }
    );
  }

  public transferAmount(cardNumber: string, amount: number): void {
    let transferData = {
      DestinationCardNumber: cardNumber,
      Amount: amount
    }

    this.http.put(this.defaultAPIURLHost + "/api/transfer/transferAmount", JSON.stringify(transferData), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.transferAmountSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.transferAmountSource.next(errorResults);
      }
    )
  }
}
