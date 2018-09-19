export class Card {
  private label: string;
  private value: number;
  private suit: string;
  private valueName: string;
  private suitName: string;

  constructor(label: string, value: number, valueName: string = '', suitName: string = '') {
    this.label = label;
    this.value = value;
    this.suit = this.label.split('')[1];
    this.valueName = valueName;
    this.suitName = suitName;
  }

  /**
   * Returns the label of the card
   * @returns {string}
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Returns the value of the card
   * @returns {number}
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * Returns the suit of the card
   * @returns {string}
   */
  public getSuit(): string {
    return this.suit;
  }

  /**
   * Retunrs the value name. String representation of the value.
   * @returns {string}
   */
  public getValueName(): string {
    return this.valueName;
  }

  /**
   * Returns the suit name.
   * @returns {string}
   */
  public getSuitName(): string {
    return this.suitName;
  }
}
