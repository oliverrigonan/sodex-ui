import { Component, OnInit } from '@angular/core';
import { CheckBalanceService } from './check-balance.service';
import { ToastrService } from 'ngx-toastr';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.css']
})
export class CheckBalanceComponent implements OnInit {
  constructor(
    private checkBalanceService: CheckBalanceService,
    private toastr: ToastrService,
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
  ) { }

  public getCardSubscription: any;

  public card: any = {
    Id: 0,
    CardNumber: "",
    FullName: "",
    Address: "",
    Email: "",
    ContactNumber: "",
    UserId: 0,
    Balance: 0,
    Particulars: "",
    Status: ""
  };

  public getUserFormsSubscription: any;

  public btnLoadCardDetailsOnclick(): void {
    if (this.card.CardNumber != "") {
      this.checkBalanceService.getCardDetails(this.card.CardNumber);
      this.getCardSubscription = this.checkBalanceService.getCardObservable.subscribe(
        data => {
          if (data != null) {
            this.card.CardNumber = data.CardNumber;
            this.card.FullName = data.FullName;
            this.card.Address = data.Address;
            this.card.Email = data.Email;
            this.card.ContactNumber = data.ContactNumber;
            this.card.UserId = data.UserId;
            this.card.Balance = data.Balance;
            this.card.Particulars = data.Particulars;
            this.card.Status = data.Status;

            this.toastr.success("Card details successfully loaded.");
          } else {
            this.toastr.error("No card details for this card number.");

            this.card.CardNumber = this.card.CardNumber;
            this.card.FullName = "";
            this.card.Address = "";
            this.card.Email = "";
            this.card.ContactNumber = "";
            this.card.UserId = 0;
            this.card.Balance = 0;
            this.card.Particulars = "";
            this.card.Status = "";
          }

          if (this.getCardSubscription != null) this.getCardSubscription.unsubscribe();
        }
      );
    } else {
      this.toastr.error("Please provide a card number.");
    }
  }

  ngOnInit() {
    this.softwareUserFormsService.getCurrentForm("TransactionCheckBalance");
    this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
      data => {
        if (data != null) {
          
        } else {
          this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
        }

        if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.getCardSubscription != null) this.getCardSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
