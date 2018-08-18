import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { CardModel } from './card.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  constructor() { }

  public showCardListTab: Boolean = true;
  public showCardDetailTab: Boolean = false;

  public previousTabIndex = 0;
  public tabId: number = 1;
  public tabs = [{
    tabId: this.tabId,
    tabName: "Card List"
  }];
  public selected = new FormControl(0);

  public newCard: CardModel;
  public listCards: CardModel[] = [{
    Id: 0,
    TabId: 1,
    CardNumber: "",
    Balance: 0,
    Particulars: ""
  }];

  public currentCardIndex = 0;
  public currentCard: CardModel = {
    Id: 0,
    TabId: 0,
    CardNumber: "",
    Balance: 0,
    Particulars: ""
  };

  public newCardTab(isAdd: Boolean): void {
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

    this.newCard = {
      Id: 0,
      TabId: this.tabId,
      CardNumber: "",
      Balance: 0,
      Particulars: ""
    };

    this.listCards.push(this.newCard);

    this.currentCard = {
      Id: 0,
      TabId: 0,
      CardNumber: "",
      Balance: 0,
      Particulars: ""
    };
  }

  public removeCardTab(index: number): void {
    this.tabs.splice(index, 1);

    if (this.previousTabIndex == index) {
      index--;
    }

    if (this.previousTabIndex > 1) {
      this.currentTab(index);
    }

    this.previousTabIndex = index;
  }

  public currentTab(index: number): void {
    let tabId = this.tabs[index].tabId;
    let currentCardIndex =  this.listCards.indexOf(this.listCards.filter(card => card.TabId === tabId)[0]);
    this.currentCardIndex = currentCardIndex;
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

  ngOnInit() {

  }
}
