import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private appSettings: AppSettings,
    private http: Http
  ) { }

  public defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;

  public loginSource = new Subject<Boolean>();
  public loginObservable = this.loginSource.asObservable();

  public login(username: string, password: string): void {
    let url = this.defaultAPIHostURL + '/token';
    let body = "username=" + username + "&password=" + password + "&grant_type=password";
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers })

    this.http.post(url, body, options).subscribe(
      response => {
        localStorage.setItem('access_token', response.json().access_token);
        localStorage.setItem('expires_in', response.json().expires_in);
        localStorage.setItem('token_type', response.json().token_type);
        localStorage.setItem('username', response.json().userName);

        this.loginSource.next(true);
      },
      error => {
        this.loginSource.next(false);
      }
    )
  }
}
