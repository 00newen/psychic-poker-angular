import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../models/card';
import { CardValue, suitsList, valuesList } from '../models/deck';

@Component({
  selector: 'app-psychic-hand',
  templateUrl: './psychic-hand.component.html',
  styleUrls: ['./psychic-hand.component.css']
})
export class PsychicHandComponent implements OnInit {
  @Input() cardsLine: string;
  @Input() showBestHand: string;

  public allCards: string = '';
  public hand: string = '';
  public deck: string = '';
  public bestHand: string = '';
  public winningHand: string = '';

  private cards: Card[] = [];
  private handCards: Card[] = [];
  private deckCards: Card[] = [];
  private winningHandCards: Card[] = [];

  private foundStraight: Card[] = [];

  constructor() { }

  ngOnInit() {
    // console.log('start line',this.cardsLine);

    this.allCards = this.cardsLine.split(' ').splice(0, 10).join(' ');
    this.hand = this.cardsLine.split(' ').splice(0, 5).join(' ');
    this.deck = this.cardsLine.split(' ').splice(5, 5).join(' ');
    this.bestHand = 'TBD';

    this.cards = this.makeCardsFromString(this.allCards);
    this.handCards = this.cards.slice(0, 5);
    this.deckCards = this.cards.slice(5, 10);

    this.processHand();

    console.log('input line:  ', this.allCards);
    console.log('output line: ', this.hand, 'Deck:', this.deck, 'Best Hand:', this.bestHand);
  }

  private makeCardsFromString(cardLabels: string): Card[] {
    const cards: string[] = cardLabels.split(' ');
    const cardsArray: Card[] = [];

    cards.forEach(function(cardLabel) {
      const value: number = valuesList.filter(card => card.key === cardLabel.split('')[0])[0].value;
      const valueName: string = valuesList.filter(card => card.key === cardLabel.split('')[0])[0].name;
      const suitName: string = suitsList.filter(card => card.key === cardLabel.split('')[1])[0].name;
      cardsArray.push(new Card(cardLabel, value, valueName, suitName));
    });

    return cardsArray;
  }

  private processHand() {
    console.log(' - - - - - - - - - - - - - - - - - - ');
    let winCards: any;
    let winCards2: any;

    // find straight flush
    winCards = this.findStraight();
    if (winCards) {
      if (this.checkStraightPossible(winCards)) {
        this.foundStraight = winCards.slice();

        // we already have 5 cards in order, so we only need check they all have the same suit
        winCards2 = winCards.filter(card => card.getSuit() === winCards[0].getSuit());
        if (winCards2.length === 5) {
          // we found a straight flush!
          this.bestHand = 'A ' + winCards[0].getValueName() + ' Hight Straight Flush';
          return;
        }
      }
    }

    // find 4 of a kind
    winCards = this.findSimilar(4);
    if (winCards) {
      const handIsPossible = this.checkSimilarHandIsPossible(winCards[0].getValue(), 4);
      if (handIsPossible === true) {
        this.bestHand = 'Four of a kind ' + winCards[0].getValueName();
        return;
      }
    }

    // find full house
    winCards = this.findSimilar(3);
    if (winCards) {
      // now check if we can also find a pair
      winCards2 = this.findSimilar(2, winCards[0].getValue());
      if (winCards2) {
        const handIsPossible = this.checkDoubleSimilarHandIsPossible(winCards[0].getValue(), 3, winCards2[0].getValue(), 2);
        if (handIsPossible === true) {
          this.bestHand = 'Full house ' + winCards[0].getValueName() + ' over ' + winCards2[0].getValueName();
          return;
        }
      }
    }

    // find flush
    winCards = this.findSimilarSuit(5);
    if (winCards) {
      const handIsPossible = this.checkSimilarSuitHandIsPossible(winCards[0].getSuit(), 5);
      if (handIsPossible === true) {
        winCards.sort(function (a, b) {
          return b.getValue() - a.getValue();
        });
        this.bestHand = 'A ' + winCards[0].getValueName() + ' High Flush ';
        return;
      }
    }

    // find straight
    if (this.foundStraight.length > 0) {
      this.foundStraight.sort(function (a, b) {
        return b.getValue() - a.getValue();
      });
      this.bestHand = 'A ' + this.foundStraight[0].getValueName() + ' Hight Straight ';
      return;
    }

    // find 3 of a kind
    winCards = this.findSimilar(3);
    if (winCards) {
      const handIsPossible = this.checkSimilarHandIsPossible(winCards[0].getValue(), 3);
      if (handIsPossible === true) {
        // now check if we can also find a pair
        this.bestHand = 'Three of a kind, ' + winCards[0].getValueName();
        return;
      }
    }

    // find 2 pairs
    winCards = this.findSimilar(2);
    if (winCards) {
      winCards2 = this.findSimilar(2, winCards[0].getValue());
      if (winCards2) {
        const handIsPossible = this.checkDoubleSimilarHandIsPossible(winCards[0].getValue(), 2, winCards2[0].getValue(), 2);
        if (handIsPossible === true) {
          const highCard = (winCards[0].getValue() > winCards2[0].getValue()) ? winCards[0] : winCards2[0];
          const lowCard = (winCards[0].getValue() < winCards2[0].getValue()) ? winCards[0] : winCards2[0];
          this.bestHand = 'Two pair, ' + highCard.getValueName() + ' and ' + lowCard.getValueName();
          return;
        }
      }
    }

    // find a pair
    winCards = this.findSimilar(2);
    if (winCards) {
      const handIsPossible = this.checkSimilarHandIsPossible(winCards[0].getValue(), 2);
      if (handIsPossible === true) {
        this.bestHand = 'Two of a kind, ' + winCards[0].getValueName();
        return;
      }
    }

    // find highest card
    this.findHighestCard();
  }

  /**
   * Iterate through the ordered cards array to find sequence of cards
   * @returns {any}
   */
  private findStraight(): any {
    const orderedCards: Card[] = this.sortCardsByValue(this.cards.slice());
    // Check if there's an ACE. If so then add a dummy ace below 2 so that we can find the 5 high straight
    // cards have been ordered so we can just get the first one, which is the one of highest value
    const aceCard: Card = orderedCards[0];
    if (aceCard.getValue() === 13) {
      // ACE found. add a dummy ace with value 0 to array.
      orderedCards.push(new Card(aceCard.getLabel(), 0));
      console.log('orderedCards:', orderedCards);
    }
    let sequence: Card[] = [];
    orderedCards.forEach(card => {
      // search the prev card for a sequential order
      if (sequence.length !== 0) {
        const lastValue: number = sequence[sequence.length - 1].getValue();
        const currentCardValue: number = card.getValue();
        if (lastValue === currentCardValue) {
          // numbers are the same, ignore this one
        } else if (lastValue === currentCardValue + 1) {
          // sequence found, add card to sequence array
          sequence.push(card);

          // check if we are completing the sequence of 5
          if (sequence.length === 5) {
            return sequence;
          }
        } else {
          // Current card is not in sequence, so chain is broken. Reset sequence array and start it again from current card
          sequence = [];
          sequence.push(card);
        }
      } else {
        // first card in the array will be added to the sequence to start
        sequence.push(card);
      }
    });

    if (sequence.length === 5) {
      return sequence;
    } else {
      return null;
    }
  }

  /**
   * Search the array for a number of cards of the same value. The number of cards to find is defined by the group parameter
   * we can use the filterValue to search an array a second time. This is intended for finding a second group of cards
   * of different value than the first so we can search for 2 pairs or full house
   * If found, we return an array with the cards. If not found we return null
   *
   * @param group         an array of cards to search in
   * @param filterValue   we ignore this value in the search
   * @returns {any}
   */
  private findSimilar(group: number, filterValue: number = 0): any {
    let similar: any;
    this.cards.some(card => {
      if (filterValue !== card.getValue()) {
        similar = this.cards.filter(filterCard => card.getValue() === filterCard.getValue());
        if (similar.length >= group) {
          return similar;
        }
      }
    });
    if (similar.length === group) {
      return similar;
    } else {
      return null;
    }
  }

  /**
   * Search the array for a number of cards with the same suit. The number of cards to find is defined by the group parameter
   * If found, we return an array with the cards. If not found we return null
   *
   * @returns {any}
   */
  private findSimilarSuit(group: number): any {
    let similar: any;
    this.cards.some(card => {
      similar = this.cards.filter(filterCard => card.getSuit() === filterCard.getSuit());
      if (similar.length === group) {
        return similar;
      }
    });
    if (similar.length === group) {
      return similar;
    } else {
      return null;
    }
  }

  /**
   *
   */
  private checkStraightPossible(cards: Card[]): boolean {
    const cardsFromHand: Card[] = [];

    cards.forEach(card => {
      const cardFound: Card = this.handCards.filter(filteredCard => filteredCard === card)[0];

      if (cardFound) {
        cardsFromHand.push(cardFound);
      }
    });

    if (cardsFromHand.length >= 5) {
      // all cards are in hand cards
      this.handCards = this.sortCardsByValue(this.handCards);
      this.winningHand = this.createStringOfCardLabels(this.handCards);
      return true;
    }
    if (cardsFromHand.length === 0) {
      // all cards are in deck cards
      this.deckCards = this.sortCardsByValue(this.deckCards);
      this.winningHand = this.createStringOfCardLabels(this.deckCards);
      return true;
    }

    const freeCards: number = 5 - cardsFromHand.length;
    const reachableCards: Card[] = this.deckCards.slice(0, freeCards);
    const cardsFromDeck: Card[] = [];

    cards.forEach(card => {
      const cardFound: Card = reachableCards.filter(filteredCard => filteredCard === card)[0];

      if (cardFound) {
        cardsFromDeck.push(cardFound);
      }
    });

    if (cardsFromHand.length + cardsFromDeck.length === 5) {
      // all cards are reachable!
      this.winningHandCards = cardsFromHand.slice().concat(cardsFromDeck);
      this.winningHandCards = this.sortCardsByValue(this.winningHandCards);
      this.winningHand = this.createStringOfCardLabels(this.winningHandCards);
      return true;
    }

    return false;
  }

  /**
   * Check hand cards, check deck cards and check if deck cards are reachable when swapping not needed cards
   * @param value     the value of card we are looking to get
   * @param minCards  the minimum number of cards we need to have after swapping if/when necessary
   * @returns {boolean}
   */
  private checkSimilarHandIsPossible(value: number, minCards: number): boolean {
    // first check if all cards are in hand cards. if so, done!
    const cards: Card[] = this.handCards.filter(filterCard => filterCard.getValue() === value);
    if (cards.length >= minCards) {
      // found them in hand cards! hand is possible
      const winHand: Card[] = cards.concat(this.handCards.filter(card => card.getValue() !== value));
      this.winningHand = this.createStringOfCardLabels(winHand);
      return true;
    }
    // then check if all cards are in deck cards. if so, done!
    // We just check if there were no cards found in the hand cards, because we know that Cards were found
    // in all the cards then we can assume that the cards are in the deck cards
    if (cards.length === 0) {
      const winHand: Card[] = this.deckCards.filter(filterCard => filterCard.getValue() === value)
                              .concat(this.deckCards.filter(card => card.getValue() !== value));
      this.winningHand = this.createStringOfCardLabels(winHand);
      return true;
    }

    // if still here, then check missing cards are swappable for the non necessary cards in hand cards
    const freeCards: number = 5 - cards.length;  // this would be the amount of cards we can swap
    const reachableCards: Card[] = this.deckCards.slice(0, freeCards);
    const fromDeck: Card[] = reachableCards.filter(filterCard => filterCard.getValue() === value);

    if (cards.length + fromDeck.length === minCards) {
      // Yes! we can reach the cards we need from the deck cards by swapping the free cards
      const winHand: Card[] = this.cards.filter(card => card.getValue() === value).
                              concat(reachableCards.filter(card => card.getValue() !== value));
      this.winningHand = this.createStringOfCardLabels(winHand);
      return true;
    }

    // alas, we can't get a hold of all the cards
    return false;
  }

  /**
   * Check hand cards, check deck cards and check if deck cards are reachable when swapping not needed cards
   * @param value     the value of card we are looking to get
   * @param minCards  the minimum number of cards we need to have after swapping if/when necessary
   * @returns {boolean}
   */
  private checkDoubleSimilarHandIsPossible(value1: number, minCards1: number, value2: number, minCards2: number): boolean {
    // first check if all cards are in hand cards. if so, done!
    const cards1: Card[] = this.handCards.filter(filterCard => filterCard.getValue() === value1);
    const cards2: Card[] = this.handCards.filter(filterCard => filterCard.getValue() === value2);
    if (cards1.length + cards2.length >= minCards1 + minCards2) {
      // found them in hand cards! hand is possible
      this.handCards = this.sortCardsByValue(this.handCards);
      this.winningHand = this.createStringOfCardLabels(this.handCards);
      return true;
    }
    // then check if all cards are in deck cards. if so, done!
    // We just check if there were no cards found in the hand cards, because we know that Cards were found
    // in all the cards then we can assume that the cards are in the deck cards
    if (cards1.length + cards2.length === 0) {
      this.deckCards = this.sortCardsByValue(this.deckCards);
      this.winningHand = this.createStringOfCardLabels(this.deckCards);
      return true;
    }

    // if still here, then check missing cards are swappable for the non necessary cards in hand cards
    const freeCards: number = 5 - (cards1.length + cards2.length);  // this would be the amount of cards we can swap
    const reachableCards: Card[] = this.deckCards.slice(0, freeCards);
    const fromDeck1: Card[] = reachableCards.filter(filterCard => filterCard.getValue() === value1);
    const fromDeck2: Card[] = reachableCards.filter(filterCard => filterCard.getValue() === value2);

    if (cards1.length + cards2.length + fromDeck1.length + fromDeck2.length >= minCards1 + minCards2) {
      // Yes! we can reach the cards we need from the deck cards by swapping the free cards
      const winHand: Card[] = this.handCards
            .filter(card => card.getValue() === value1)
            .concat(this.deckCards.filter(card => card.getValue() === value1))
            .concat(this.handCards.filter(card => card.getValue() === value2))
            .concat(this.deckCards.filter(card => card.getValue() === value2));

      // add extra card in case we only have 4 in winHand array
      if (winHand.length === 4) {
        const extraCard: Card = this.cards.find(card => {
          return card.getValue() !== value1 && card.getValue() !== value2;
        });
        winHand.push(extraCard);

      }
      this.winningHand = this.createStringOfCardLabels(winHand);
      return true;
    }

    // alas, we can't get a hold of all the cards
    return false;
  }

  /**
   * Check hand cards, check deck cards and check if deck cards are reachable when swapping not needed cards
   * @param value     the value of card we are looking to get
   * @param minCards  the minimum number of cards we need to have after swapping if/when necessary
   * @returns {boolean}
   */
  private checkSimilarSuitHandIsPossible(suit: string, minCards: number): boolean {
    // first check if all cards are in hand cards. if so, done!
    const cards: Card[] = this.handCards.filter(filterCard => filterCard.getSuit() === suit);
    if (cards.length === minCards) {
      // found them in hand cards! hand is possible
      this.handCards = this.sortCardsByValue(this.handCards);
      this.winningHand = this.createStringOfCardLabels(this.handCards);
      return true;
    }
    // then check if all cards are in deck cards. if so, done!
    // We just check if there were no cards found in the hand cards, because we know that Cards were found
    // in all the cards then we can assume that the cards are in the deck cards
    if (cards.length === 0) {
      this.deckCards = this.sortCardsByValue(this.deckCards);
      this.winningHand = this.createStringOfCardLabels(this.deckCards);
      return true;
    }

    // if still here, then check missing cards are swappable for the non necessary cards in hand cards
    const freeCards: number = 5 - cards.length;  // this would be the amount of cards we can swap
    const reachableCards: Card[] = this.deckCards.slice(0, freeCards);
    const fromDeck: Card[] = reachableCards.filter(filterCard => filterCard.getSuit() === suit);

    if (cards.length + fromDeck.length === minCards) {
      // Yes! we can reach the cards we need from the deck cards by swapping the free cards
      this.winningHandCards = cards.concat(fromDeck);
      this.winningHandCards = this.sortCardsByValue(this.winningHandCards);
      this.winningHand = this.createStringOfCardLabels(this.winningHandCards);
      return true;
    }

    // alas, we can't get a hold of all the cards
    return false;
  }

  /**
   * Easiest of all the checks. We can easily check which card has the highest because we only need one so
   * we can discard all 5 cards to get even the last card of the 5 in the deck.
   * We order the array by value and simply check the first one.
   */
  private findHighestCard() {
    this.cards = this.sortCardsByValue(this.cards);

    const highestCard: Card = this.cards.slice(0, 1)[0];

    this.bestHand = 'High Card ' + highestCard.getValueName() + ' of ' + highestCard.getSuitName();

    // we create the best hand for highest card here as it's only one card and the others don't really matter
    this.winningHandCards.push(highestCard);
    this.winningHand = this.createStringOfCardLabels(this.winningHandCards);
  }

  /**
   * feed an array of Card objects and returns a string of the labels of each card separated by a space
   * @param winCards
   */
  private createStringOfCardLabels(winCards: Card[]) {
    let winHand: string = '';
    winCards.forEach(card => {
      winHand += card.getLabel() + ' ';
    });
    return winHand;
  }

  /**
   * sorts the supplied array by value and returns the ordered array
   * @param cards
   * @returns {Card[]}
   */
  private sortCardsByValue(cards: Card[]): Card[] {
    cards.sort(function (a, b) {
      return b.getValue() - a.getValue();
    });
    return cards;
  }

}
