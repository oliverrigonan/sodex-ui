import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {
  public ToolbarTitle: String = "";
  public ToolBarImage = document.getElementById("ToolBarImage") as HTMLImageElement;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (router.url == "/software") {
        this.ToolbarTitle = "Main Menu";
      } else if (router.url == "/software/profile") {
        this.ToolbarTitle = "Profile";
      } else if (router.url == "/software/transfer") {
        this.ToolbarTitle = "Transfer";
      } else if (router.url == "/software/reports") {
        this.ToolbarTitle = "Reports";
      } else if (router.url == "/software/cards") {
        this.ToolbarTitle = "Cards";
      } else if (router.url == "/software/users") {
        this.ToolbarTitle = "Users";
      } else if (router.url == "/software/checkbalance") {
        this.ToolbarTitle = "Check Balance";
      } else {
        this.ToolbarTitle = "Sodex";
      }
    });
  }

  ngOnInit() {
  }

}
