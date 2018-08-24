import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { UsersService } from './users.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

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
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
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
    UserFormsList: new ObservableArray()
  }];

  public getUsersSubscription: any;
  public registerUserSubscription: any;
  public updateUserSubscription: any;

  public usersData: ObservableArray = new ObservableArray();
  public usersCollectionView: CollectionView = new CollectionView(this.usersData);
  public usersNumberOfPageIndex: number = 15;

  @ViewChild('userFlexGrid') userFlexGrid: WjFlexGrid;
  @ViewChild('userFormFlexGrid') userFormFlexGrid: WjFlexGrid;

  public isProgressBarHidden = false;
  public newUserModalRef: BsModalRef;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public cboUserFormShowNumberOfRows: ObservableArray = new ObservableArray();

  public getUserFormSubscription: any;

  public userFormData: ObservableArray = new ObservableArray();
  public userFormCollectionView: CollectionView = new CollectionView(this.usersData);
  public userFormNumberOfPageIndex: number = 15;

  public isUserFormProgressBarHidden = false;
  public newUserFormModalRef: BsModalRef;
  public deleteUserFormModalRef: BsModalRef;

  public formData: ObservableArray = new ObservableArray();
  public getFormsSubscription: any;
  public saveUserFormSubscription: any;
  public updateUserFormSubscription: any;
  public deleteUserFormSubscription: any;

  public userForm: any = {
    Id: 0,
    UserId: 0,
    FormId: 0,
    CanAdd: false,
    CanEdit: false,
    CanUpdate: false,
    CanDelete: false,
  }

  public isBtnUserFormButtonsDisabled: Boolean = true;

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

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

      this.cboUserFormShowNumberOfRows.push({
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

      this.getUserForms();
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

      this.userFormData = this.listUsers[this.userIndex].UserFormsList;
      this.userFormCollectionView = new CollectionView(this.userFormData);
      this.userFormCollectionView.pageSize = this.userFormNumberOfPageIndex;
      this.userFormCollectionView.trackChanges = true;
      this.userFormCollectionView.refresh();
      this.userFormFlexGrid.refresh();
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

    this.isBtnUserFormButtonsDisabled = false;
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

            this.isBtnUserFormButtonsDisabled = true;
          } else if (data[0] == "failed") {
            this.toastr.error(data[1]);

            this.isUserFieldDisabled = false;

            btnUpdateUser.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
            btnUpdateUser.removeAttribute("disabled");
            btnCloseUser.removeAttribute("disabled");

            this.isBtnUserFormButtonsDisabled = false;
          }

          if (this.updateUserSubscription != null) this.updateUserSubscription.unsubscribe();
        }
      );
    }
  }

  public cboUserFormShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.userFormNumberOfPageIndex = selectedValue;

    this.userFormCollectionView.pageSize = this.userFormNumberOfPageIndex;
    this.userFormCollectionView.refresh();
    this.userFormFlexGrid.refresh();
  }

  public getUserForms(): void {
    this.userFormData = new ObservableArray();
    this.userFormCollectionView = new CollectionView(this.userFormData);
    this.userFormCollectionView.pageSize = 15;
    this.userFormCollectionView.trackChanges = true;
    this.userFormCollectionView.refresh();
    this.userFormFlexGrid.refresh();

    this.isUserFormProgressBarHidden = false;

    this.usersService.getUserForms(this.listUsers[this.userIndex].Id);
    this.getUserFormSubscription = this.usersService.getUserFormsObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.userFormData = data;
          this.userFormCollectionView = new CollectionView(this.userFormData);
          this.userFormCollectionView.pageSize = this.userFormNumberOfPageIndex;
          this.userFormCollectionView.trackChanges = true;
          this.userFormCollectionView.refresh();
          this.userFormFlexGrid.refresh();

          this.listUsers[this.userIndex].UserFormsList = data;
        }

        this.isUserFormProgressBarHidden = true;

        if (this.getUserFormSubscription != null) this.getUserFormSubscription.unsubscribe();
      }
    );
  }

  public getForms(id: number) {
    this.usersService.getForms();
    this.getFormsSubscription = this.usersService.getFormsObservable.subscribe(
      data => {
        let formsObservableArray = new ObservableArray();

        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; i++) {
            formsObservableArray.push({
              Id: data[i].Id,
              Form: data[i].Form,
              Particulars: data[i].Particulars,
            });
          }
        }

        this.formData = formsObservableArray;

        if (this.getFormsSubscription != null) this.getFormsSubscription.unsubscribe();
      }
    );
  }

  public btnAddUserFormOnclick(template: TemplateRef<any>): void {
    this.newUserFormModalRef = this.modalService.show(template, { class: "" });
    this.getForms(0);

    this.userForm.Id = 0;
    this.userForm.UserId = this.listUsers[this.userIndex].Id;
    this.userForm.FormId = 0;
    this.userForm.CanAdd = false;
    this.userForm.CanEdit = false;
    this.userForm.CanUpdate = false;
    this.userForm.CanDelete = false;
  }

  public btnEditUserFormOnclick(template: TemplateRef<any>): void {
    this.newUserFormModalRef = this.modalService.show(template, { class: "" });

    let currentUserForm = this.userFormCollectionView.currentItem;
    this.getForms(currentUserForm.Id);

    this.userForm.Id = currentUserForm.Id;
    this.userForm.UserId = this.listUsers[this.userIndex].Id;
    this.userForm.FormId = currentUserForm.FormId;
    this.userForm.CanAdd = currentUserForm.CanAdd;
    this.userForm.CanEdit = currentUserForm.CanEdit;
    this.userForm.CanUpdate = currentUserForm.CanUpdate;
    this.userForm.CanDelete = currentUserForm.CanDelete;
  }

  public btnSaveUserFormOnclick(): void {
    let objUserForm: any = {
      Id: this.userForm.Id,
      FormId: this.userForm.FormId,
      UserId: this.userForm.UserId,
      CanAdd: this.userForm.CanAdd,
      CanEdit: this.userForm.CanEdit,
      CanUpdate: this.userForm.CanUpdate,
      CanDelete: this.userForm.CanDelete
    };

    if (this.userForm.Id == 0) {
      let btnSaveUserForm: Element = document.getElementById("btnSaveUserForm");
      btnSaveUserForm.innerHTML = "<i class='fa fa-save fa-fw'></i> Saving...";
      btnSaveUserForm.setAttribute("disabled", "disabled");

      let btnCloseUserFormModal: Element = document.getElementById("btnCloseUserFormModal");
      btnCloseUserFormModal.setAttribute("disabled", "disabled");

      this.usersService.saveUserForm(objUserForm);
      this.saveUserFormSubscription = this.usersService.saveUserFormObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success('Save Successful!');

            setTimeout(() => {
              btnSaveUserForm.innerHTML = "<i class='fa fa-save fa-fw'></i> Save";
              btnSaveUserForm.removeAttribute("disabled");
              btnCloseUserFormModal.removeAttribute("disabled");
            }, 500);

            this.getUserForms();

            this.newUserFormModalRef.hide();
          } else if (data[0] == "failed") {
            this.toastr.error(data[1]);

            btnSaveUserForm.innerHTML = "<i class='fa fa-save fa-fw'></i> Save";
            btnSaveUserForm.removeAttribute("disabled");
            btnCloseUserFormModal.removeAttribute("disabled");
          }

          if (this.saveUserFormSubscription != null) this.saveUserFormSubscription.unsubscribe();
        }
      );
    } else {
      let btnSaveUserForm: Element = document.getElementById("btnSaveUserForm");
      btnSaveUserForm.innerHTML = "<i class='fa fa-save fa-fw'></i> Saving...";
      btnSaveUserForm.setAttribute("disabled", "disabled");

      let btnCloseUserFormModal: Element = document.getElementById("btnCloseUserFormModal");
      btnCloseUserFormModal.setAttribute("disabled", "disabled");

      this.usersService.updateUserForm(objUserForm);
      this.updateUserFormSubscription = this.usersService.updateUserFormObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success('Update Successful!');

            setTimeout(() => {
              btnSaveUserForm.innerHTML = "<i class='fa fa-save fa-fw'></i> Save";
              btnSaveUserForm.removeAttribute("disabled");
              btnCloseUserFormModal.removeAttribute("disabled");
            }, 500);

            this.getUserForms();

            this.newUserFormModalRef.hide();
          } else if (data[0] == "failed") {
            this.toastr.error(data[1]);

            btnSaveUserForm.innerHTML = "<i class='fa fa-save fa-fw'></i> Save";
            btnSaveUserForm.removeAttribute("disabled");
            btnCloseUserFormModal.removeAttribute("disabled");
          }

          if (this.updateUserFormSubscription != null) this.updateUserFormSubscription.unsubscribe();
        }
      );
    }
  }

  public btnDeleteUserFormOnclick(template: TemplateRef<any>): void {
    this.deleteUserFormModalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  public btnConfirmDeleteUserFormOnclick(): void {
    let btnConfirmDeleteUserForm: Element = document.getElementById("btnConfirmDeleteUserForm");
    btnConfirmDeleteUserForm.innerHTML = "<i class='fa fa-trash fa-fw'></i> Deleting...";
    btnConfirmDeleteUserForm.setAttribute("disabled", "disabled");

    let btnConfirmDeleteUserFormCloseModal: Element = document.getElementById("btnConfirmDeleteUserFormCloseModal");
    btnConfirmDeleteUserFormCloseModal.setAttribute("disabled", "disabled");

    let currentUserForm = this.userFormCollectionView.currentItem;

    this.usersService.deleteUserForm(currentUserForm.Id);
    this.deleteUserFormSubscription = this.usersService.deleteUserFormObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success('Delete Successful!');

          setTimeout(() => {
            btnConfirmDeleteUserForm.innerHTML = "<i class='fa fa-trash fa-fw'></i> Delete";
            btnConfirmDeleteUserForm.removeAttribute("disabled");
            btnConfirmDeleteUserFormCloseModal.removeAttribute("disabled");
          }, 500);

          this.getUserForms();

          this.deleteUserFormModalRef.hide();
        } else if (data[0] == "failed") {
          this.toastr.error(data[1]);

          btnConfirmDeleteUserForm.innerHTML = "<i class='fa fa-trash fa-fw'></i> Delete";
          btnConfirmDeleteUserForm.removeAttribute("disabled");
          btnConfirmDeleteUserFormCloseModal.removeAttribute("disabled");
        }

        if (this.deleteUserFormSubscription != null) this.deleteUserFormSubscription.unsubscribe();
      }
    );
  }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("AdminUser");
      this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;

            this.getUsersData();
          } else {
            this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
          }

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
        }
      );
    }, 1000);
  }

  ngOnDestroy() {
    if (this.getUsersSubscription != null) this.getUsersSubscription.unsubscribe();
    if (this.registerUserSubscription != null) this.registerUserSubscription.unsubscribe();
    if (this.updateUserSubscription != null) this.updateUserSubscription.unsubscribe();

    if (this.getUserFormSubscription != null) this.getUserFormSubscription.unsubscribe();
    if (this.getFormsSubscription != null) this.getFormsSubscription.unsubscribe();
    if (this.saveUserFormSubscription != null) this.saveUserFormSubscription.unsubscribe();
    if (this.updateUserFormSubscription != null) this.updateUserFormSubscription.unsubscribe();
    if (this.deleteUserFormSubscription != null) this.deleteUserFormSubscription.unsubscribe();

    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
