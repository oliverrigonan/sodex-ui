import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {
  public ToolbarTitle: String = "";
  @ViewChild('drawer') drawer: MatDrawer;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      let toolBarImage: Element = document.getElementById("toolBarImage");
      if (router.url == "/software") {
        this.ToolbarTitle = "Dashboard";
        toolBarImage.setAttribute("src", "../../assets/images/icons/home.png");
      } else if (router.url == "/software/profile") {
        this.ToolbarTitle = "Profile";
        toolBarImage.setAttribute("src", "../../assets/images/icons/profile.png");
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
      } else {
        this.ToolbarTitle = "Sodex";
        toolBarImage.setAttribute("src", "../../assets/images/icons/home.png");
      }
    });
  }

  public openDrawer(): void {
    this.drawer.toggle();
  }

  ngOnInit() {
    this.openDrawer();
  }

}
