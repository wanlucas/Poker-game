export type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds';

export interface ICard {
  value: Value;
  suit: Suit;
}

export default class Card {
  public value: ICard['value'];
  public suit: ICard['suit'];
  
  static cardOptions: Value[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  static suitOptions: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

  constructor({ value, suit }: ICard) {
    if (!Card.cardOptions.includes(value) && value !== 1) {
      throw new Error('Invalid card value')
    }

    if (!Card.suitOptions.includes(suit)) {
      throw new Error('Invalid card suit')
    }

    this.value = value;
    this.suit = suit;
  }
}