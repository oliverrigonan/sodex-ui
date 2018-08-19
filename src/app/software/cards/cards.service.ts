import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { AppSettings } from './../../app.settings';
import { Subject, Observable } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';
import { CardModel } from './card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(
    private router: Router,
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

  public saveCardSource = new Subject<number>();
  public saveCardObservable = this.saveCardSource.asObservable();

  public updateCardSource = new Subject<number>();
  public updateCardObservable = this.updateCardSource.asObservable();

  public deleteCardSource = new Subject<number>();
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
              Balance: results[i].Balance,
              UserId: results[i].UserId,
              FullName: results[i].FullName,
              Email: results[i].Email,
              Address: results[i].Address,
              ContactNumber: results[i].ContactNumber,
              Particulars: results[i].Particulars,
              Status: results[i].Status
            });
          }
        }

        this.getCardsSource.next(cardsObservableArray);
      }
    );
  }

  public saveCard(objCard: CardModel): void {
    this.http.post(this.defaultAPIURLHost + "/api/cards/add", JSON.stringify(objCard), this.options).subscribe(
      response => {
        this.saveCardSource.next(200);
      },
      error => {
        if (error.status == 404) {
          this.saveCardSource.next(404);
        } else if (error.status == 400) {
          this.saveCardSource.next(400);
        } else if (error.status == 500) {
          this.saveCardSource.next(500);
        }
      }
    )
  }

  public updateCard(objCard: CardModel): void {
    let id = objCard.Id;

    this.http.put(this.defaultAPIURLHost + "/api/cards/update/" + id, JSON.stringify(objCard), this.options).subscribe(
      response => {
        this.updateCardSource.next(200);
      },
      error => {
        if (error.status == 404) {
          this.updateCardSource.next(404);
        } else if (error.status == 400) {
          this.updateCardSource.next(400);
        } else if (error.status == 500) {
          this.updateCardSource.next(500);
        }
      }
    )
  }

  public deleteCard(id: number): void {
    this.http.delete(this.defaultAPIURLHost + "/api/cards/delete/" + id, this.options).subscribe(
      response => {
        this.deleteCardSource.next(200);
      },
      error => {
        if (error.status == 404) {
          this.deleteCardSource.next(404);
        } else if (error.status == 400) {
          this.deleteCardSource.next(400);
        } else if (error.status == 500) {
          this.deleteCardSource.next(500);
        }
      }
    )
  }
}