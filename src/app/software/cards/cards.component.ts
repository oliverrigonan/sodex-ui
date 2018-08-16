import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  public showCardListTab: Boolean = true;
  public showCardDetailTab: Boolean = false;

  constructor() { }

  tabs = ['Card List'];
  selected = new FormControl(0);

  public newCardTab(isAdd: Boolean): void {
    if (isAdd) {
      this.tabs.push('New Card');
    } else {
      this.tabs.push('Card Detail');
    }

    this.selected.setValue(this.tabs.length - 1);

    this.showCardListTab = false;
    this.showCardDetailTab = true;
  }

  public removeCardTab(index: number): void {
    this.tabs.splice(index, 1);
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
      }, 200);
    }
  }

  ngOnInit() {
    
  }
}
