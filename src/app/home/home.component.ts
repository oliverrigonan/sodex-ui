import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  public currentUser = "Login";
  public isUserLoggedIn = false;

  public logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');
    
    this.currentUser = "Login";;
    this.isUserLoggedIn = false;
    
    location.reload();
  }

  ngOnInit() {
    if (localStorage.getItem("access_token") != null) {
      this.currentUser = localStorage.getItem("username");
      this.isUserLoggedIn = true;
    }
  }
}
