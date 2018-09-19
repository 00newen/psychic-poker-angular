import { Component, OnInit } from '@angular/core';
import { Deck } from '../models/deck';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private deck: Deck;

  public lines: string[] = [];
  public numberOfHands: number = 15;
  public showBestHand: boolean = false;

  constructor() { }

  ngOnInit() {
    this.deck = new Deck();

    console.log('deck:', this.deck);
    this.deck.shuffleDeck();

    this.getHands();
  }

  public getHands() {
    // first reset the lines array
    this.lines = [];

    // then ask for lines from deck and feed them to the lines array
    for (let i = 0; i < this.numberOfHands; i++) {
      this.lines.push(this.deck.getLine());
    }
  }

  public redealGame(event: Event) {
    console.log('change!', this.numberOfHands, event);
    this.getHands();
  }

}
