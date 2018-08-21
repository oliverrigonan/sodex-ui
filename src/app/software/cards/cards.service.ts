import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { Subject } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
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

  public getCardsSource = new Subject<ObservableArray>();
  public getCardsObservable = this.getCardsSource.asObservable();

  public saveCardSource = new Subject<string[]>();
  public saveCardObservable = this.saveCardSource.asObservable();

  public updateCardSource = new Subject<string[]>();
  public updateCardObservable = this.updateCardSource.asObservable();

  public deleteCardSource = new Subject<string[]>();
  public deleteCardObservable = this.deleteCardSource.asObservable();

  public getCards(): void {
    let cardsObservableArray = new ObservableArray();
    this.getCardsSource.next(cardsObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/cards/list", this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            cardsObservableArray.push({
              Id: results[i].Id,
              CardNumber: results[i].CardNumber,
              FullName: results[i].FullName,
              Address: results[i].Address,
              Email: results[i].Email,
              ContactNumber: results[i].ContactNumber,
              UserId: results[i].UserId,
              Balance: results[i].Balance,
              BalanceDisplay: results[i].Balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              Particulars: results[i].Particulars,
              Status: results[i].Status
            });
          }
        }

        this.getCardsSource.next(cardsObservableArray);
      }
    );
  }

  public saveCard(objCard: any): void {
    this.http.post(this.defaultAPIURLHost + "/api/cards/add", JSON.stringify(objCard), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveCardSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.saveCardSource.next(errorResults);
      }
    )
  }

  public updateCard(objCard: any): void {
    let id = objCard.Id;

    this.http.put(this.defaultAPIURLHost + "/api/cards/update/" + id, JSON.stringify(objCard), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.updateCardSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.updateCardSource.next(errorResults);
      }
    )
  }

  public deleteCard(id: number): void {
    this.http.delete(this.defaultAPIURLHost + "/api/cards/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteCardSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.deleteCardSource.next(errorResults);
      }
    )
  }
}