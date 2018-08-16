import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public showUserListTab: Boolean = true;
  public showUserDetailTab: Boolean = false;

  constructor() { }

  tabs = ['User List'];
  selected = new FormControl(0);

  public newUserTab(isAdd: Boolean): void {
    if (isAdd) {
      this.tabs.push('New User');
    } else {
      this.tabs.push('User Detail');
    }

    this.selected.setValue(this.tabs.length - 1);

    this.showUserListTab = false;
    this.showUserDetailTab = true;
  }

  public removeUserTab(index: number): void {
    this.tabs.splice(index, 1);
  }

  public onUserTabClick(event: MatTabChangeEvent): void {
    if (event.index == 0) {
      setTimeout(() => {
        this.showUserListTab = true;
        this.showUserDetailTab = false;
      }, 200);
    } else {
      setTimeout(() => {
        this.showUserListTab = false;
        this.showUserDetailTab = true;
      }, 200);
    }
  }

  ngOnInit() {
  }

}
