import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {
  constructor(
    private router: Router
  ) {
    router.events.subscribe((val) => {
      let toolBarImage: Element = document.getElementById("toolBarImage");
      if (router.url == "/software") {
        this.ToolbarTitle = "Dashboard";
        toolBarImage.setAttribute("src", "../../assets/images/icons/home.png");
      } else if (router.url == "/software/profile") {
        this.ToolbarTitle = "Profile";
        toolBarImage.setAttribute("src", "../../assets/images/icons/store.png");
      } else if (router.url == "/software/transfer") {
        this.ToolbarTitle = "Transfer";
        toolBarImage.setAttribute("src", "../../assets/images/icons/transfer.png");
      } else if (router.url == "/software/reports") {
        this.ToolbarTitle = "Reports";
        toolBarImage.setAttribute("src", "../../assets/images/icons/reports.png");
      } else if (router.url == "/software/cards") {
        this.ToolbarTitle = "Cards";
        toolBarImage.setAttribute("src", "../../assets/images/icons/cards.png");
      } else if (router.url == "/software/users") {
        this.ToolbarTitle = "Users";
        toolBarImage.setAttribute("src", "../../assets/images/icons/users.png");
      } else if (router.url == "/software/checkbalance") {
        this.ToolbarTitle = "Check Balance";
        toolBarImage.setAttribute("src", "../../assets/images/icons/check-balance.png");
      } else if (router.url == "/software/forbidden") {
        this.ToolbarTitle = "Forbidden";
        toolBarImage.setAttribute("src", "../../assets/images/icons/forbidden.png");
      } else {
        this.ToolbarTitle = "Sodex";
      }
    });
  }

  public ToolbarTitle: String = "";
  @ViewChild('drawer') drawer: MatDrawer;

  public currentUser = "Login";
  public isUserLoggedIn = false;

  public openDrawer(): void {
    this.drawer.toggle();
  }

  public logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');

    this.currentUser = "Login";;
    this.isUserLoggedIn = false;

    this.router.navigate(["/login"]);
  }

  ngOnInit() {
    this.openDrawer();

    if (localStorage.getItem("access_token") != null) {
      this.currentUser = localStorage.getItem("username");
      this.isUserLoggedIn = true;
    }
  }
}
