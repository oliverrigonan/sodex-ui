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

  public cardsSource = new Subject<ObservableArray>();
  public cardsObservable = this.cardsSource.asObservable();

  public cardsSavedSource = new Subject<number>();
  public cardsSavedObservable = this.cardsSavedSource.asObservable();

  public cardsDeletedSource = new Subject<number>();
  public cardsDeletedbservable = this.cardsDeletedSource.asObservable();

  public listCards(): void {
    let cardsObservableArray = new ObservableArray();
    this.cardsSource.next(cardsObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/cards/list", this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            cardsObservableArray.push({
              Id: results[i].Id,
              CardNumber: results[i].CardNumber,
              Balance: results[i].Balance,
              Particulars: results[i].Particulars
            });
          }

          this.cardsSource.next(cardsObservableArray);
        }
      }
    );
  }

  public saveCard(objCard: CardModel): void {
    if (objCard.Id == 0) {
      this.http.post(this.defaultAPIURLHost + "/api/cards/add", JSON.stringify(objCard), this.options).subscribe(
        response => {
          this.cardsSavedSource.next(200);
        },
        error => {
          if (error.status == 404) {
            this.cardsSavedSource.next(404);
          } else if (error.status == 400) {
            this.cardsSavedSource.next(400);
          } else if (error.status == 500) {
            this.cardsSavedSource.next(500);
          }
        }
      )
    } else {
      let id = objCard.Id;
      this.http.put(this.defaultAPIURLHost + "/api/cards/update/" + id, JSON.stringify(objCard), this.options).subscribe(
        response => {
          this.cardsSavedSource.next(200);
        },
        error => {
          if (error.status == 404) {
            this.cardsSavedSource.next(404);
          } else if (error.status == 400) {
            this.cardsSavedSource.next(400);
          } else if (error.status == 500) {
            this.cardsSavedSource.next(500);
          }
        }
      )
    }
  }

  public deleteCard(id: number): void {
    this.http.delete(this.defaultAPIURLHost + "/api/cards/delete/" + id, this.options).subscribe(
      response => {
        this.cardsDeletedSource.next(200);
      },
      error => {
        if (error.status == 404) {
          this.cardsDeletedSource.next(404);
        } else if (error.status == 400) {
          this.cardsDeletedSource.next(400);
        } else if (error.status == 500) {
          this.cardsDeletedSource.next(500);
        }
      }
    )
  }
}