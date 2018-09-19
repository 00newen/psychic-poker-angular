import {Card} from './card';

export class Deck {
  public cards: Card[] = [];

  private shuffleTimes: number = 3; // in case once doesn't seem random enough
  private handSize: number = 10; // number of cards used every time we deal a hand
  private discardUsedCards: boolean = false; // in case we want to simulate a decreasing deck

  constructor() {
    this.getFreshDeck();
  }

  /**
   * resets the cards array to a freshly generated and ordered deck.
   */
  public getFreshDeck() {
    // console.log("Generating fresh deck");
    const newDeck: Card[] = [];

    suitsList.forEach(function (suit) {
      valuesList.forEach(function (value) {
        const card: Card = new Card(value.key + suit.key, value.value);
        newDeck.push(card);
      });
    });
    this.cards = [];
    this.cards = newDeck;
  }

  /**
   * shuffles the deck a number of times defined by shuffleTimes parameter
   */
  public shuffleDeck() {

    for (let r = 0; r < this.shuffleTimes; r++) {
      this.cards = this.shuffleCards(this.cards);
      const newCards: Card[] = this.cards;
    }
    // this.printDeck();
  }

  /**
   * We randomly remove cards from the cards array and place them in a new array.
   * We do this until the initial array is empty.
   * @param cards
   * @returns {Card[]}
   */
  private shuffleCards(cards: Card[]): Card[] {
    const shuffledCards: Card[] = [];
    let card: Card;
    for (const i = 0; i < cards.length; i) {
      card = cards.splice(this.getRandomNum(cards.length), 1)[0];
      shuffledCards.push(card);
    }
    return shuffledCards;
  }

  /**
   * returns a string with the sequence of 5 cards dealt and the 5 first cards left at the top of the deck
   * @returns {string}
   */
  public getLine(): string {
    // TODO: implement the spychic hand in a service so we can call it from here.
    // check if we have enough cards in the deck for a full hand
    if (this.cards.length < this.handSize) {
      this.getFreshDeck();
      this.shuffleDeck();
    }
    let inputLine: string = '';
    const cardsLeft: Card[] = this.cards.slice();

    let card: Card;
    // first 5 cards, the players hand is given randomly
    for (let i = 0; i < 5; i++) {
      if (inputLine !== '') {
        inputLine += ' ';
      }
      card = cardsLeft.splice(this.getRandomNum(cardsLeft.length), 1)[0];
      inputLine += card.getLabel();
    }
    // the second set of cards is taken from the top of the deck in order
    for (let i = 0; i < 5; i++) {
      inputLine += ' ';
      // asuming that 0 is the top of the deck
      card = cardsLeft.splice(0, 1)[0];
      inputLine += card.getLabel();
    }

    // resuffle the deck so the hands dealt seem more random. otherwise the 5 deck cards don't change much from line to line
    this.shuffleDeck();

    return inputLine;
  }

  /**
   * returns a random integer number between 0 and the max number supplied
   * @param max
   * @returns {number}
   */
  private getRandomNum(max): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Prints the full deck in the console, meant for debugging purposes.
   */
  public printDeck() {
    let inputLine: string = '';
    for (let i = 0; i < this.cards.length; i++) {
      if (inputLine !== '') {
        inputLine += ' ';
      }
      inputLine += this.cards[i].getLabel();
    }
    console.log('printing deck:', this.cards.length, inputLine);
  }
}

export class CardValue {
  public key: string = '';
  public value: number = 0;
  public name: string = '';
}

export class Suit {
  public key: string = '';
  public name: string = '';
}

/**
 * List of possible values in the deck. Their key/label and their value.
 */
export const valuesList: CardValue[] = [
  { key: '2', value: 1, name: 'Two' },
  { key: '3', value: 2, name: 'Three' },
  { key: '4', value: 3, name: 'Four' },
  { key: '5', value: 4, name: 'Five' },
  { key: '6', value: 5, name: 'Six' },
  { key: '7', value: 6, name: 'Seven' },
  { key: '8', value: 7, name: 'Eight' },
  { key: '9', value: 8, name: 'Nine' },
  { key: 'T', value: 9, name: 'Ten' },
  { key: 'J', value: 10, name: 'Jack' },
  { key: 'Q', value: 11, name: 'Queen' },
  { key: 'K', value: 12, name: 'King' },
  { key: 'A', value: 13, name: 'Ace' },
];

/**
 * List of possible suits in the deck. Their key/label and their name.
 */
export const suitsList: Suit[] = [
  { key: 'S', name: 'Spades' },
  { key: 'H', name: 'Hearts' },
  { key: 'D', name: 'Diamonds' },
  { key: 'C', name: 'Clubs' },
];
