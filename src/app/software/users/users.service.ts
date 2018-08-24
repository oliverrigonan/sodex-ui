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

  public getUserFormsSource = new Subject<ObservableArray>();
  public getUserFormsObservable = this.getUserFormsSource.asObservable();

  public getFormsSource = new Subject<ObservableArray>();
  public getFormsObservable = this.getFormsSource.asObservable();

  public saveUserFormSource = new Subject<string[]>();
  public saveUserFormObservable = this.saveUserFormSource.asObservable();

  public updateUserFormSource = new Subject<string[]>();
  public updateUserFormObservable = this.updateUserFormSource.asObservable();

  public deleteUserFormSource = new Subject<string[]>();
  public deleteUserFormObservable = this.deleteUserFormSource.asObservable();

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
        let errorResults: string[] = ["failed"];

        let fullnameErrors = error.json().ModelState["model.FullName"];
        if (fullnameErrors.length > 0) {
          for (let i = 0; i < fullnameErrors.length; i++) {
            errorResults.push(fullnameErrors[i]);
          }
        }
        
        let addressErrors = error.json().ModelState["model.Address"];
        if (addressErrors.length > 0) {
          for (let i = 0; i < addressErrors.length; i++) {
            errorResults.push(addressErrors[i]);
          }
        }

        let contactNumberErrors = error.json().ModelState["model.ContactNumber"];
        if (contactNumberErrors.length > 0) {
          for (let i = 0; i < contactNumberErrors.length; i++) {
            errorResults.push(contactNumberErrors[i]);
          }
        }

        let emailErrors = error.json().ModelState["model.Email"];
        if (emailErrors.length > 0) {
          for (let i = 0; i < emailErrors.length; i++) {
            errorResults.push(emailErrors[i]);
          }
        }

        let passwordErrors = error.json().ModelState["model.Password"];
        if (passwordErrors.length > 0) {
          for (let i = 0; i < passwordErrors.length; i++) {
            errorResults.push(passwordErrors[i]);
          }
        }
        
        let usernameErrors = error.json().ModelState["model.UserName"];
        if (usernameErrors.length > 0) {
          for (let i = 0; i < usernameErrors.length; i++) {
            errorResults.push(usernameErrors[i]);
          }
        }

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

  public getUserForms(userId: number): void {
    let userFormsObservableArray = new ObservableArray();
    this.getUserFormsSource.next(userFormsObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/userForm/list/" + userId, this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            userFormsObservableArray.push({
              Id: results[i].Id,
              UserId: results[i].UserId,
              FormId: results[i].FormId,
              Form: results[i].Form,
              Particulars: results[i].Particulars,
              CanAdd: results[i].CanAdd,
              CanEdit: results[i].CanEdit,
              CanUpdate: results[i].CanUpdate,
              CanDelete: results[i].CanDelete
            });
          }
        }

        this.getUserFormsSource.next(userFormsObservableArray);
      }
    );
  }

  public getForms(): void {
    let formsObservableArray = new ObservableArray();
    this.getFormsSource.next(formsObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/userForm/forms/list", this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            formsObservableArray.push({
              Id: results[i].Id,
              Form: results[i].Form,
              Particulars: results[i].Particulars
            });
          }
        }

        this.getFormsSource.next(formsObservableArray);
      }
    );
  }

  public saveUserForm(objUserForm: any): void {
    this.http.post(this.defaultAPIURLHost + "/api/userForm/add", JSON.stringify(objUserForm), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveUserFormSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.saveUserFormSource.next(errorResults);
      }
    )
  }

  public updateUserForm(objUserForm: any): void {
    let id = objUserForm.Id;

    this.http.put(this.defaultAPIURLHost + "/api/userForm/update/" + id, JSON.stringify(objUserForm), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.updateUserFormSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.updateUserFormSource.next(errorResults);
      }
    )
  }

  public deleteUserForm(id: number): void {
    this.http.delete(this.defaultAPIURLHost + "/api/userForm/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteUserFormSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.deleteUserFormSource.next(errorResults);
      }
    )
  }
}
