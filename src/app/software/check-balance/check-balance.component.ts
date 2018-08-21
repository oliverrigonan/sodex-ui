import { Component, OnInit } from '@angular/core';
import { CheckBalanceService } from './check-balance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.css']
})
export class CheckBalanceComponent implements OnInit {
  constructor(
    private checkBalanceService: CheckBalanceService,
    private toastr: ToastrService
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

  }

  ngOnDestroy() {
    if (this.getCardSubscription != null) this.getCardSubscription.unsubscribe();
  }
}
