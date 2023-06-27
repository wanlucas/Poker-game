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
  public currentBet: number;
  public id: string;

  constructor({ name, bankroll, id }: IPlayer) {
    this.hand = [];
    this.name = name;
    this.id = id;
    this.bankroll = bankroll;
    this.currentBet = 0;
  }

  public addCard(card: Card) {
    this.hand.push(card);
  }

  public clearHand() {
    this.hand = [];
  }

  public bet(amount: number) {
    const totalbet = Math.min(amount, this.bankroll);

    this.bankroll -= totalbet;
    this.currentBet += totalbet;
  }

  public pay() {
    const total = this.currentBet;
    this.currentBet = 0;
    
    return total;
  }

  public receive(amount: number) {
    this.bankroll += amount;
    this.currentBet = 0;
  }
}