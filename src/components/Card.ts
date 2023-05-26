export type Value =  'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds';

export interface ICard {
  value: Value;
  suit: Suit;
}

export default class Card {
  public value: ICard['value'];
  public suit: ICard['suit'];
  
  static cardOptions: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10','J', 'Q', 'K']
  static suitOptions: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

  constructor({ value, suit }: ICard) {
    if (!Card.cardOptions.includes(value)) {
      throw new Error('Invalid card value')
    }

    if (!Card.suitOptions.includes(suit)) {
      throw new Error('Invalid card suit')
    }

    this.value = value;
    this.suit = suit;
  }
}