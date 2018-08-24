import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { CardsService } from './cards.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  constructor(
    private cardsService: CardsService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
  ) { }

  public detailTabs = [];
  public selectedTab = new FormControl(0);

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

  public cardIndex: number = 0;
  public listCards: any = [{
    TabNumber: 0,
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
  }];

  public isCardFieldDisabled: Boolean = false;

  public getCardsSubscription: any;
  public saveCardSubscription: any;
  public updateCardSubscription: any;
  public deleteCardSubscription: any;

  public cardsData: ObservableArray = new ObservableArray();
  public cardsCollectionView: CollectionView = new CollectionView(this.cardsData);
  public cardsNumberOfPageIndex: number = 15;

  public deleteCardModalRef: BsModalRef;
  public newCardModalRef: BsModalRef;
  public isProgressBarHidden = false;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  @ViewChild('cardsFlexGrid') cardsFlexGrid: WjFlexGrid;

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
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.cardsNumberOfPageIndex = selectedValue;

    this.cardsCollectionView.pageSize = this.cardsNumberOfPageIndex;
    this.cardsCollectionView.refresh();
    this.cardsFlexGrid.refresh();
  }

  public getCardsData(): void {
    this.cardsData = new ObservableArray();
    this.cardsCollectionView = new CollectionView(this.cardsData);
    this.cardsCollectionView.pageSize = 15;
    this.cardsCollectionView.trackChanges = true;
    this.cardsCollectionView.refresh();
    this.cardsFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.cardsService.getCards();
    this.getCardsSubscription = this.cardsService.getCardsObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.cardsData = data;
          this.cardsCollectionView = new CollectionView(this.cardsData);
          this.cardsCollectionView.pageSize = this.cardsNumberOfPageIndex;
          this.cardsCollectionView.trackChanges = true;
          this.cardsCollectionView.refresh();
          this.cardsFlexGrid.refresh();
        }

        this.isProgressBarHidden = true;
      }
    );
  }

  public btnNewCardOnclick(template: TemplateRef<any>): void {
    this.card.CardNumber = "";
    this.card.FullName = "";
    this.card.Address = "";
    this.card.Email = "";
    this.card.ContactNumber = "";
    this.card.Balance = 0;
    this.card.Status = "Enable";

    this.newCardModalRef = this.modalService.show(template, { class: "" });
  }

  public btnSaveCardOnclick(): void {
    let btnSaveCard: Element = document.getElementById("btnSaveCard");
    btnSaveCard.innerHTML = "<i class='fa fa-save fa-fw'></i> Saving...";
    btnSaveCard.setAttribute("disabled", "disabled");

    let btnCloseNewCardModal: Element = document.getElementById("btnCloseNewCardModal");
    btnCloseNewCardModal.setAttribute("disabled", "disabled");

    let objCard: any = {
      Id: this.card.Id,
      CardNumber: this.card.CardNumber,
      FullName: this.card.FullName,
      Address: this.card.Address,
      Email: this.card.Email,
      ContactNumber: this.card.ContactNumber,
      UserId: this.card.UserId,
      Balance: this.card.Balance,
      Particulars: this.card.Particulars,
      Status: this.card.Status
    };

    this.cardsService.saveCard(objCard);
    this.saveCardSubscription = this.cardsService.saveCardObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success('Save Successful!');

          setTimeout(() => {
            btnSaveCard.innerHTML = "<i class='fa fa-save fa-fw'></i> Save";
            btnSaveCard.removeAttribute("disabled");
            btnCloseNewCardModal.removeAttribute("disabled");
          }, 500);

          this.getCardsData();

          this.newCardModalRef.hide();
        } else if (data[0] == "failed") {
          this.toastr.error(data[1]);

          btnSaveCard.innerHTML = "<i class='fa fa-save fa-fw'></i> Save";
          btnSaveCard.removeAttribute("disabled");
          btnCloseNewCardModal.removeAttribute("disabled");
        }

        if (this.saveCardSubscription != null) this.saveCardSubscription.unsubscribe();
      }
    );
  }

  public btnOpenCard(): void {
    let currentCard = this.cardsCollectionView.currentItem;

    this.detailTabs.push(currentCard.CardNumber);
    this.selectedTab.setValue(this.detailTabs.length);

    this.listCards.push({
      TabNumber: this.selectedTab.value,
      Id: currentCard.Id,
      CardNumber: currentCard.CardNumber,
      FullName: currentCard.FullName,
      Address: currentCard.Address,
      Email: currentCard.Email,
      ContactNumber: currentCard.ContactNumber,
      UserId: currentCard.UserId,
      Balance: currentCard.Balance,
      Particulars: currentCard.Particulars,
      Status: currentCard.Status
    });

    this.cardIndex = this.listCards.length - 1;

    setTimeout(() => {
      this.isCardFieldDisabled = true;

      let btnUpdateCard: Element = document.getElementById("btnUpdateCard");
      btnUpdateCard.setAttribute("disabled", "disabled");
    }, 100);
  }

  public btnEditCard(): void {
    this.isCardFieldDisabled = false;

    let btnUpdateCard: Element = document.getElementById("btnUpdateCard");
    btnUpdateCard.removeAttribute("disabled");

    let btnEditCard: Element = document.getElementById("btnEditCard");
    btnEditCard.setAttribute("disabled", "disabled");
  }

  public btnUpdateCard(): void {
    if (this.listCards.length > 0) {
      this.isCardFieldDisabled = true;

      let objCard: any = {
        TabNumber: this.listCards[this.cardIndex].TabNumber,
        Id: this.listCards[this.cardIndex].Id,
        CardNumber: this.listCards[this.cardIndex].CardNumber,
        FullName: this.listCards[this.cardIndex].FullName,
        Address: this.listCards[this.cardIndex].Address,
        Email: this.listCards[this.cardIndex].Email,
        ContactNumber: this.listCards[this.cardIndex].ContactNumber,
        UserId: this.listCards[this.cardIndex].UserId,
        Balance: this.listCards[this.cardIndex].Balance,
        Particulars: this.listCards[this.cardIndex].Particulars,
        Status: this.listCards[this.cardIndex].Status
      };

      let btnUpdateCard: Element = document.getElementById("btnUpdateCard");
      btnUpdateCard.innerHTML = "<i class='fa fa-check fa-fw'></i> Updating...";
      btnUpdateCard.setAttribute("disabled", "disabled");

      let btnEditCard: Element = document.getElementById("btnEditCard");
      btnEditCard.setAttribute("disabled", "disabled");

      let btnCloseCard: Element = document.getElementById("btnCloseCard");
      btnCloseCard.setAttribute("disabled", "disabled");

      this.cardsService.updateCard(objCard);
      this.updateCardSubscription = this.cardsService.updateCardObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success('Update Successful!');

            this.isCardFieldDisabled = true;

            btnUpdateCard.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
            btnUpdateCard.setAttribute("disabled", "disabled");
            btnEditCard.removeAttribute("disabled");
            btnCloseCard.removeAttribute("disabled");

            this.getCardsData();
          } else if (data[0] == "failed") {
            this.toastr.error(data[1]);

            this.isCardFieldDisabled = false;

            btnUpdateCard.innerHTML = "<i class='fa fa-check fa-fw'></i> Update";
            btnUpdateCard.removeAttribute("disabled");
            btnCloseCard.removeAttribute("disabled");
          }

          if (this.updateCardSubscription != null) this.updateCardSubscription.unsubscribe();
        }
      );
    }
  }

  public removeCardTab(index: number): void {
    if ((this.detailTabs.length - 1) == index) {
      let currentCardIndex = this.listCards.indexOf(this.listCards.filter(card => card.TabNumber === this.selectedTab.value)[0]);
      this.listCards.splice(currentCardIndex, 1);

      currentCardIndex--;
      this.cardIndex = currentCardIndex;
    } else {
      let currentCardIndex = this.listCards.indexOf(this.listCards.filter(card => card.TabNumber === this.selectedTab.value)[0]);
      this.listCards.splice(currentCardIndex, 1);

      let tabNumber = this.selectedTab.value;
      for (let i = currentCardIndex; i < this.listCards.length; i++) {
        this.listCards[i].TabNumber = tabNumber;
        tabNumber++;
      }

      this.cardIndex = this.listCards.indexOf(this.listCards[currentCardIndex]);
    }

    this.detailTabs.splice(index, 1);
  }

  public onCardTabClick(event: MatTabChangeEvent): void {
    if (event.index > 0) {
      let currentCardIndex = this.listCards.indexOf(this.listCards.filter(card => card.TabNumber === this.selectedTab.value)[0]);
      this.cardIndex = currentCardIndex;
    } else {
      if (event.index == 0) {
        this.cardsCollectionView.refresh();
        this.cardsFlexGrid.refresh();
      }
    }
  }

  public btnDeleteCardOnclick(template: TemplateRef<any>): void {
    this.deleteCardModalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  public btnConfirmDeleteCardOnclick(): void {
    let btnConfirmDeleteCard: Element = document.getElementById("btnConfirmDeleteCard");
    btnConfirmDeleteCard.innerHTML = "<i class='fa fa-trash fa-fw'></i> Deleting...";
    btnConfirmDeleteCard.setAttribute("disabled", "disabled");

    let btnConfirmDeleteCardCloseModal: Element = document.getElementById("btnConfirmDeleteCardCloseModal");
    btnConfirmDeleteCardCloseModal.setAttribute("disabled", "disabled");

    let currentCard = this.cardsCollectionView.currentItem;
    let listCards = this.listCards.filter(card => card.Id === currentCard.Id);
    if (listCards.length > 0) {
      this.toastr.error('This card cannot be deleted because it is currently open in a tab. Please close it before proceeding.');

      btnConfirmDeleteCard.removeAttribute("disabled");
      btnConfirmDeleteCard.innerHTML = "<i class='fa fa-trash fa-fw'></i> Delete";
      btnConfirmDeleteCardCloseModal.removeAttribute("disabled");
    } else {
      this.cardsService.deleteCard(currentCard.Id);
      this.deleteCardSubscription = this.cardsService.deleteCardObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success('Delete Successful!');

            setTimeout(() => {
              btnConfirmDeleteCard.innerHTML = "<i class='fa fa-trash fa-fw'></i> Delete";
              btnConfirmDeleteCard.removeAttribute("disabled");
              btnConfirmDeleteCardCloseModal.removeAttribute("disabled");
            }, 500);

            this.getCardsData();

            this.deleteCardModalRef.hide();
          } else if (data[0] == "failed") {
            this.toastr.error(data[1]);

            btnConfirmDeleteCard.innerHTML = "<i class='fa fa-trash fa-fw'></i> Delete";
            btnConfirmDeleteCard.removeAttribute("disabled");
            btnConfirmDeleteCardCloseModal.removeAttribute("disabled");
          }

          if (this.deleteCardSubscription != null) this.deleteCardSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("SetupCard");
      this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;
            this.getCardsData();
          } else {
            this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
          }

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
        }
      );
    }, 1000);
  }

  ngOnDestroy() {
    if (this.getCardsSubscription != null) this.getCardsSubscription.unsubscribe();
    if (this.saveCardSubscription != null) this.saveCardSubscription.unsubscribe();
    if (this.updateCardSubscription != null) this.updateCardSubscription.unsubscribe();
    if (this.deleteCardSubscription != null) this.deleteCardSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
