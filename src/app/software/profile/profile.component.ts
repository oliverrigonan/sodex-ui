import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService,
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
  ) { }

  public getProfileSubscription: any;
  public updateProfileSubscription: any;

  public profile: any = {
    Id: 0,
    FullName: "",
    Address: "",
    Email: "",
    ContactNumber: "",
    MotherCardNumber: "",
    MotherCardBalance: 0
  };

  public isProfileDisabled: Boolean = true;

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public getProfileData(): void {
    let btnUpdateProfile: Element = document.getElementById("btnUpdateProfile");
    btnUpdateProfile.setAttribute("disabled", "disabled");

    this.profileService.getProfile();
    this.getProfileSubscription = this.profileService.getProfileObservable.subscribe(
      data => {
        this.profile.FullName = data.FullName;
        this.profile.Address = data.Address;
        this.profile.Email = data.Email;
        this.profile.ContactNumber = data.ContactNumber;
        this.profile.MotherCardNumber = data.MotherCardNumber;
        this.profile.MotherCardBalance = data.MotherCardBalance;
      }
    );
  }

  public btnUpdateProfileOnclick(): void {
    let btnUpdateProfile: Element = document.getElementById("btnUpdateProfile");
    btnUpdateProfile.innerHTML = "<i class='fa fa-check fa-fw'></i> Updating...";
    btnUpdateProfile.setAttribute("disabled", "disabled");

    let btnEditProfile: Element = document.getElementById("btnEditProfile");
    btnEditProfile.setAttribute("disabled", "disabled");

    let btnCloseProfile: Element = document.getElementById("btnCloseProfile");
    btnCloseProfile.setAttribute("disabled", "disabled");

    this.profileService.updateProfile(this.profile);
    this.updateProfileSubscription = this.profileService.updateProfileObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success('Update Successful!');

          this.isProfileDisabled = true;

          btnUpdateProfile.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
          btnUpdateProfile.setAttribute("disabled", "disabled");
          btnEditProfile.removeAttribute("disabled");
          btnCloseProfile.removeAttribute("disabled");
        } else if (data[0] == "failed") {
          this.toastr.error(data[1]);

          this.isProfileDisabled = false;

          btnUpdateProfile.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
          btnUpdateProfile.removeAttribute("disabled");
          btnCloseProfile.removeAttribute("disabled");
        }

        if (this.updateProfileSubscription != null) this.updateProfileSubscription.unsubscribe();
      }
    );
  }

  public btnEditProfileOnclick(): void {
    this.isProfileDisabled = false;

    let btnEditProfile: Element = document.getElementById("btnEditProfile");
    btnEditProfile.setAttribute("disabled", "disabled");

    let btnUpdateProfile: Element = document.getElementById("btnUpdateProfile");
    btnUpdateProfile.removeAttribute("disabled");

    let btnCloseProfile: Element = document.getElementById("btnCloseProfile");
    btnCloseProfile.removeAttribute("disabled");
  }

  ngOnInit() {
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("SetupProfile");
      this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;
            this.getProfileData();
          } else {
            this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
          }

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
        }
      );
    }, 1000)
  }

  ngOnDestroy() {
    if (this.getProfileSubscription != null) this.getProfileSubscription.unsubscribe();
    if (this.updateProfileSubscription != null) this.updateProfileSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
