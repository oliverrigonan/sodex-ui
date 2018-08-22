import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { UsersService } from './users.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  public showUserDetailTab: Boolean = false;

  public detailTabs = [];
  public selectedTab = new FormControl(0);

  public isUserFieldDisabled: Boolean = false;

  public user: any = {
    Id: 0,
    FullName: "",
    Address: "",
    Email: "",
    ContactNumber: "",
    UserName: "",
    Password: "",
    ConfirmPassword: ""
  };

  public userIndex: number = 0;
  public listUsers: any = [{
    TabNumber: 0,
    Id: 0,
    Username: "",
    FullName: "",
    Address: "",
    Email: "",
    ContactNumber: "",
    MotherCardNumber: "",
    MotherCardBalance: "",
    Status: "",
  }];

  public getUsersSubscription: any;
  public registerUserSubscription: any;
  public updateUserSubscription: any;

  public usersData: ObservableArray = new ObservableArray();
  public usersCollectionView: CollectionView = new CollectionView(this.usersData);
  public usersNumberOfPageIndex: number = 15;

  @ViewChild('userFlexGrid') userFlexGrid: WjFlexGrid;

  public isProgressBarHidden = false;
  public newUserModalRef: BsModalRef;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public createCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";

      if (i == 0) {
        rows = 15;
        rowsString = "15 Rows";
      } else if (i == 1) {
        rows = 50;
        rowsString = "50 Rows";
      } else if (i == 2) {
        rows = 100;
        rowsString = "100 Rows";
      } else if (i == 3) {
        rows = 150;
        rowsString = "150 Rows";
      } else {
        rows = 200;
        rowsString = "200 Rows";
      }

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.usersNumberOfPageIndex = selectedValue;

    this.usersCollectionView.pageSize = this.usersNumberOfPageIndex;
    this.usersCollectionView.refresh();
    this.userFlexGrid.refresh();
  }

  public getUsersData(): void {
    this.usersData = new ObservableArray();
    this.usersCollectionView = new CollectionView(this.usersData);
    this.usersCollectionView.pageSize = 15;
    this.usersCollectionView.trackChanges = true;
    this.usersCollectionView.refresh();
    this.userFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.usersService.getUsers();
    this.getUsersSubscription = this.usersService.getUsersObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.usersData = data;
          this.usersCollectionView = new CollectionView(this.usersData);
          this.usersCollectionView.pageSize = this.usersNumberOfPageIndex;
          this.usersCollectionView.trackChanges = true;
          this.usersCollectionView.refresh();
          this.userFlexGrid.refresh();
        }

        this.isProgressBarHidden = true;
      }
    );
  }

  public btnOpenUser(): void {
    let currentUser = this.usersCollectionView.currentItem;

    this.detailTabs.push(currentUser.Username);
    this.selectedTab.setValue(this.detailTabs.length);

    this.listUsers.push({
      TabNumber: this.selectedTab.value,
      Id: currentUser.Id,
      Username: currentUser.Username,
      FullName: currentUser.FullName,
      Address: currentUser.Address,
      Email: currentUser.Email,
      ContactNumber: currentUser.ContactNumber,
      MotherCardNumber: currentUser.MotherCardNumber,
      MotherCardBalance: currentUser.MotherCardBalance,
      Status: currentUser.Status
    });

    this.userIndex = this.listUsers.length - 1;

    setTimeout(() => {
      this.isUserFieldDisabled = true;

      let btnUpdateUser: Element = document.getElementById("btnUpdateUser");
      btnUpdateUser.setAttribute("disabled", "disabled");
    }, 100);
  }

  public removeUserTab(index: number): void {
    if ((this.detailTabs.length - 1) == index) {
      let currentUserIndex = this.listUsers.indexOf(this.listUsers.filter(card => card.TabNumber === this.selectedTab.value)[0]);
      this.listUsers.splice(currentUserIndex, 1);

      currentUserIndex--;
      this.userIndex = currentUserIndex;
    } else {
      let currentUserIndex = this.listUsers.indexOf(this.listUsers.filter(card => card.TabNumber === this.selectedTab.value)[0]);
      this.listUsers.splice(currentUserIndex, 1);

      let tabNumber = this.selectedTab.value;
      for (let i = currentUserIndex; i < this.listUsers.length; i++) {
        this.listUsers[i].TabNumber = tabNumber;
        tabNumber++;
      }

      this.userIndex = this.listUsers.indexOf(this.listUsers[currentUserIndex]);
    }

    this.detailTabs.splice(index, 1);
  }

  public onUserTabClick(event: MatTabChangeEvent): void {
    if (event.index > 0) {
      let currentUserIndex = this.listUsers.indexOf(this.listUsers.filter(card => card.TabNumber === this.selectedTab.value)[0]);
      this.userIndex = currentUserIndex;
    } else {
      if (event.index == 0) {
        this.usersCollectionView.refresh();
        this.userFlexGrid.refresh();
      }
    }
  }

  public btnRegisterNewUserOnclick(template: TemplateRef<any>): void {
    this.newUserModalRef = this.modalService.show(template, { class: "" });
  }

  public btnRegisterUserOnclick(): void {
    let btnRegisterUser: Element = document.getElementById("btnRegisterUser");
    btnRegisterUser.innerHTML = "<i class='fa fa-key fa-fw'></i> Registering...";
    btnRegisterUser.setAttribute("disabled", "disabled");

    let btnCloseNewRegisterUserModal: Element = document.getElementById("btnCloseNewRegisterUserModal");
    btnCloseNewRegisterUserModal.setAttribute("disabled", "disabled");

    let objUser: any = {
      Id: this.user.Id,
      FullName: this.user.FullName,
      Address: this.user.Address,
      Email: this.user.Email,
      ContactNumber: this.user.ContactNumber,
      UserName: this.user.UserName,
      Password: this.user.Password,
      ConfirmPassword: this.user.ConfirmPassword,
    };

    this.usersService.register(objUser);
    this.registerUserSubscription = this.usersService.registerUserObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success('Save Successful!');

          setTimeout(() => {
            btnRegisterUser.innerHTML = "<i class='fa fa-key fa-fw'></i> Register";
            btnRegisterUser.removeAttribute("disabled");
            btnCloseNewRegisterUserModal.removeAttribute("disabled");
          }, 500);

          this.getUsersData();

          this.newUserModalRef.hide();
        } else if (data[0] == "failed") {
          this.toastr.error(data[1]);

          btnRegisterUser.innerHTML = "<i class='fa fa-key fa-fw'></i> Register";
          btnRegisterUser.removeAttribute("disabled");
          btnCloseNewRegisterUserModal.removeAttribute("disabled");
        }

        if (this.registerUserSubscription != null) this.registerUserSubscription.unsubscribe();
      }
    );
  }

  public btnEditUser(): void {
    this.isUserFieldDisabled = false;

    let btnUpdateUser: Element = document.getElementById("btnUpdateUser");
    btnUpdateUser.removeAttribute("disabled");

    let btnEditUser: Element = document.getElementById("btnEditUser");
    btnEditUser.setAttribute("disabled", "disabled");
  }

  public btnUpdateUser(): void {
    if (this.listUsers.length > 0) {
      this.isUserFieldDisabled = true;

      let objUser: any = {
        Id: this.listUsers[this.userIndex].Id,
        FullName: this.listUsers[this.userIndex].FullName,
        Address: this.listUsers[this.userIndex].Address,
        Email: this.listUsers[this.userIndex].Email,
        ContactNumber: this.listUsers[this.userIndex].ContactNumber,
        MotherCardNumber: this.listUsers[this.userIndex].MotherCardNumber,
        Status: this.listUsers[this.userIndex].Status
      };

      let btnUpdateUser: Element = document.getElementById("btnUpdateUser");
      btnUpdateUser.innerHTML = "<i class='fa fa-check fa-fw'></i> Updating...";
      btnUpdateUser.setAttribute("disabled", "disabled");

      let btnEditUser: Element = document.getElementById("btnEditUser");
      btnEditUser.setAttribute("disabled", "disabled");

      let btnCloseUser: Element = document.getElementById("btnCloseUser");
      btnCloseUser.setAttribute("disabled", "disabled");

      this.usersService.updateUser(objUser);
      this.updateUserSubscription = this.usersService.updateUserObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success('Update Successful!');

            this.isUserFieldDisabled = true;

            btnUpdateUser.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
            btnUpdateUser.setAttribute("disabled", "disabled");
            btnEditUser.removeAttribute("disabled");
            btnCloseUser.removeAttribute("disabled");

            this.getUsersData();
          } else if (data[0] == "failed") {
            this.toastr.error(data[1]);

            this.isUserFieldDisabled = false;

            btnUpdateUser.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
            btnUpdateUser.removeAttribute("disabled");
            btnCloseUser.removeAttribute("disabled");
          }

          if (this.updateUserSubscription != null) this.updateUserSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.getUsersData();
  }

  ngOnDestroy() {
    if (this.getUsersSubscription != null) this.getUsersSubscription.unsubscribe();
    if (this.registerUserSubscription != null) this.registerUserSubscription.unsubscribe();
    if (this.updateUserSubscription != null) this.updateUserSubscription.unsubscribe();
  }
}
