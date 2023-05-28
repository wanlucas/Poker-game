import Card, { Suit, Value } from "./Card";

export default class Deck {
  private cards: Card[];

  constructor() {
    this.cards = [];
    this.generate();
  }

  get size() {
    return this.cards.length;
  }

  private generate() {
    const options: Card[] = [];

    Card.suitOptions.forEach((suit: Suit) => {
      Card.cardOptions.forEach((value: Value) => {
        options.push(new Card({ value, suit }));
      });
    });

    while(options.length) {
      const randomIndex = Math.floor(Math.random() * options.length);
      const card = options.splice(randomIndex, 1)[0];

      this.cards.push(card);
    }
  }

  public pick(): Card {
    return this.cards.pop()!;
  }
}