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

  public bet(amount: number) {
    const currentBankroll = this.bankroll;

    if (amount > currentBankroll) {
      this.currentBet = currentBankroll;
      this.bankroll = 0;
    } else {
      this.bankroll -= amount;
      this.currentBet += amount;
    }
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