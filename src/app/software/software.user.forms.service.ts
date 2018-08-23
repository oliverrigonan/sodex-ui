import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../app.settings';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoftwareUserFormsService {
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

  public getCurrentUserFormSource = new Subject<any>();
  public getCurrentUserFormsObservable = this.getCurrentUserFormSource.asObservable();

  public getCurrentForm(form: string): void {
    let userForm = {
      Id: 0,
      UserId: 0,
      FormId: 0,
      Form: "",
      Particulars: "",
      CanAdd: false,
      CanEdit: false,
      CanUpdate: false,
      CanDelete: false
    }

    this.getCurrentUserFormSource.next(userForm);
    this.http.get(this.defaultAPIURLHost + "/api/userForm/current/form/" + form, this.options).subscribe(
      response => {
        var result = response.json();
        if (result != null) {
          userForm = {
            Id: result.Id,
            UserId: result.UserId,
            FormId: result.FormId,
            Form: result.Form,
            Particulars: result.Particulars,
            CanAdd: result.CanAdd,
            CanEdit: result.CanEdit,
            CanUpdate: result.CanUpdate,
            CanDelete: result.CanDelete
          }

          this.getCurrentUserFormSource.next(userForm);
        } else {
          this.getCurrentUserFormSource.next(null)
        }
      }
    );
  }
}
