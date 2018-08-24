import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckBalanceService {
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

  public getCardSource = new Subject<any>();
  public getCardObservable = this.getCardSource.asObservable();

  public getCardDetails(cardNumber: string): void {
    let cardDetail = {
      Id: 0,
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
    this.http.get(this.defaultAPIURLHost + "/api/cards/detail/" + cardNumber, this.options).subscribe(
      response => {
        var results = response.json();
        if (results != null) {
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
}
