import Card from "./Card";

export interface IPlayer {
  id: string;
  name: string;
  bankroll: number;
}

export default class Player {
  public hand: Card[];
  public name: string;
  public bankroll: number;
  public id: string;

  constructor({ name, bankroll, id }: IPlayer) {
    this.hand = [];
    this.name = name;
    this.bankroll = bankroll;
    this.id = id;
  }

  public addCard(card: Card) {
    this.hand.push(card);
  }

  public bet(amount: number) {
    this.bankroll = Math.max(0, this.bankroll - amount);
    return amount;
  }

}