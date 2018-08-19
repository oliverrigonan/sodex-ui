import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { CardModel } from './card.model';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { CardsService } from './cards.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  constructor(
    private cardsService: CardsService,
    private modalService: BsModalService
  ) { }

  public detailTabs = [];
  public selectedTab = new FormControl(0);

  public cardIndex: number = 0;
  public listCards: CardModel[] = [{
    TabNumber: 0,
    Id: 0,
    CardNumber: "",
    Balance: 0,
    Particulars: ""
  }];

  public isFieldDisabled: Boolean = false;

  public cardsSubscription: any;
  public cardsData: ObservableArray = new ObservableArray();
  public cardsCollectionView: CollectionView = new CollectionView(this.cardsData);
  public cardsNumberOfPageIndex: number = 15;

  public modalRef: BsModalRef;
  public isProgressBarHidden = false;

  public btnDetailCard(isAdd: Boolean): void {
    if (isAdd) {
      this.detailTabs.push("New Card");
    } else {
      this.detailTabs.push("Card Detail");
    }

    this.selectedTab.setValue(this.detailTabs.length);

    if (isAdd) {
      this.listCards.push({
        TabNumber: this.selectedTab.value,
        Id: 0,
        CardNumber: "",
        Balance: 0,
        Particulars: ""
      });
    } else {
      let currentCard = this.cardsCollectionView.currentItem;

      this.listCards.push({
        TabNumber: this.selectedTab.value,
        Id: currentCard.Id,
        CardNumber: currentCard.CardNumber,
        Balance: 0,
        Particulars: ""
      });
    }

    this.cardIndex = this.listCards.length - 1;
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
    }
  }

  public getCardsData(): void {
    this.cardsData = new ObservableArray();
    this.cardsCollectionView = new CollectionView(this.cardsData);
    this.cardsCollectionView.pageSize = 15;
    this.cardsCollectionView.trackChanges = true;

    this.isProgressBarHidden = false;

    this.cardsService.listCards();
    this.cardsSubscription = this.cardsService.cardsObservable.subscribe(
      data => {
        if (data != null) {
          this.cardsData = data;
          this.cardsCollectionView = new CollectionView(this.cardsData);
          this.cardsCollectionView.pageSize = 15;
          this.cardsCollectionView.trackChanges = true;
        }

        this.isProgressBarHidden = true;
      }
    );
  }

  public btnDeleteCardClick(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  ngOnInit() {
    this.getCardsData();
  }
}
