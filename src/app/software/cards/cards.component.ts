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

  public showCardListTab: Boolean = true;
  public showCardDetailTab: Boolean = false;

  public tabId: number = 1;
  public tabs = [{
    tabId: this.tabId,
    tabName: "Card List"
  }];
  public selected = new FormControl(0);

  public cardIndex: number = 0;
  public newCard: CardModel;
  public listCards: CardModel[] = [{
    Id: 0,
    TabId: 1,
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
    this.tabId += 1;

    if (isAdd) {
      this.tabs.push({
        tabId: this.tabId,
        tabName: "New Card"
      });
    } else {
      this.tabs.push({
        tabId: this.tabId,
        tabName: "Card Detail"
      });
    }

    this.selected.setValue(this.tabs.length - 1);

    this.showCardListTab = false;
    this.showCardDetailTab = true;

    if(isAdd) {
      this.newCard = {
        Id: 0,
        TabId: this.tabId,
        CardNumber: "",
        Balance: 0,
        Particulars: ""
      };
    } else {
      let currentSelectedCard = this.cardsCollectionView.currentItem;

      this.newCard = {
        Id: currentSelectedCard.Id,
        TabId: this.tabId,
        CardNumber: currentSelectedCard.CardNumber,
        Balance: currentSelectedCard.Balance,
        Particulars: currentSelectedCard.Particulars
      };
    }

    this.listCards.push(this.newCard);
  }

  public removeCardTab(index: number): void {
    this.tabs.splice(index, 1);

    if (this.tabs.length == index) {
      index--;
    }

    if (this.tabs.length > 1) {
      this.currentTab(index);
    }
  }

  public currentTab(index: number): void {
    let tabId = this.tabs[index].tabId;
    let currentCardIndex = this.listCards.indexOf(this.listCards.filter(card => card.TabId === tabId)[0]);
    this.cardIndex = currentCardIndex;
  }

  public onCardTabClick(event: MatTabChangeEvent): void {
    if (event.index == 0) {
      setTimeout(() => {
        this.showCardListTab = true;
        this.showCardDetailTab = false;
      }, 200);
    } else {
      setTimeout(() => {
        this.showCardListTab = false;
        this.showCardDetailTab = true;

        this.currentTab(event.index);
      }, 200);
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
