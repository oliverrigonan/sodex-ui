import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { Subject } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  public getUsersSource = new Subject<ObservableArray>();
  public getUsersObservable = this.getUsersSource.asObservable();

  public registerUserSource = new Subject<string[]>();
  public registerUserObservable = this.registerUserSource.asObservable();

  public updateUserSource = new Subject<string[]>();
  public updateUserObservable = this.updateUserSource.asObservable();

  public getUsers(): void {
    let usersObservableArray = new ObservableArray();
    this.getUsersSource.next(usersObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/user/list", this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            usersObservableArray.push({
              Id: results[i].Id,
              AspNetUserId: results[i].AspNetUserId,
              Username: results[i].Username,
              UserTypeId: results[i].UserTypeId,
              FullName: results[i].FullName,
              Address: results[i].Address,
              Email: results[i].Email,
              ContactNumber: results[i].ContactNumber,
              MotherCardNumber: results[i].MotherCardNumber,
              MotherCardBalance: results[i].MotherCardBalance,
              Status: results[i].Status
            });
          }
        }

        this.getUsersSource.next(usersObservableArray);
      }
    );
  }

  public register(user: any): void {
    this.http.post(this.defaultAPIURLHost + "/api/account/register", JSON.stringify(user), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.registerUserSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.registerUserSource.next(errorResults);
      }
    )
  }

  public updateUser(objUser: any): void {
    let id = objUser.Id;

    this.http.put(this.defaultAPIURLHost + "/api/user/update/" + id, JSON.stringify(objUser), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.updateUserSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.updateUserSource.next(errorResults);
      }
    )
  }
}
