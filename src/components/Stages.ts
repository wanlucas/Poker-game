import Card from "./Card";
import Deck from "./Deck";
import Player from "./Player";

export interface IStageInit {
  players: Player[];
  deck: Deck;
  onStageEnd: () => void;
  onDeal: () => void,
  smallBlind: number;
}

export interface IStage {
  players: Player[];
  deck: Deck;
  onStageEnd: () => void;
}

export interface IPreFlop extends IStage {
  smallBlind: number;
}

export interface IFlop extends IStage {
  onDeal: () => void,
}

export abstract class Stage {
  protected players: Player[];
  protected deck: Deck;
  protected currentPlayerI: number;
  protected lastPlayerToPlayI: number;
  protected biggestBet: number;
  protected onStageEnd: () => void;

  get currentPlayer() {
    return this.players[this.currentPlayerI];
  }

  get lastPlayerI() {
    if (this.currentPlayerI === 0) {
      return this.players.length - 1;
    }
    
    return this.currentPlayerI - 1;
  }

  get lastPlayer() { 
    return this.players[this.lastPlayerI];
  }

  get nextPlayerI() {
    return (this.currentPlayerI + 1) % this.players.length;
  }

  get nextPlayer() {
    return this.players[this.nextPlayerI];
  }

  constructor({ players, deck, onStageEnd }: IStage) {
    this.onStageEnd = onStageEnd;
    this.deck = deck;
    this.players = players;
    this.currentPlayerI = 0;
    this.lastPlayerToPlayI = players.length - 1;
    this.biggestBet = 0;
  }

  protected next() {
    if (this.currentPlayerI === this.lastPlayerToPlayI) this.onStageEnd();
    else this.currentPlayerI = this.nextPlayerI;
  }

  public check() {
    if (this.currentPlayer.currentBet !== this.biggestBet) {
      throw new Error("Invalid check");
    }

    this.next();
  }

  public fold() {
    if (this.currentPlayer.currentBet === this.biggestBet) {
      throw new Error("Invalid fold");
    }
  }

  public call() {
    const valueToCall = this.biggestBet - this.currentPlayer.currentBet;
  
    this.currentPlayer.bet(valueToCall);
    this.next();
  }

  public raise(value: number) {
    const minValueToRaise = this.biggestBet * 2;
    const valueToRaise = value - this.currentPlayer.currentBet;

    if (value <= 0 || value < minValueToRaise) {
      throw new Error("Invalid raise");
    }

    if (this.currentPlayer.bankroll < valueToRaise) {
      throw new Error("Not enough money to raise");
    }

    this.biggestBet = value;
    this.lastPlayerToPlayI = this.lastPlayerI;
    this.currentPlayer.bet(value);
    this.next();
  }

  public abstract start(): void;
}

export class PreFlop extends Stage {
  private smallBlind: number;

  constructor({ players, deck, smallBlind, onStageEnd }: IPreFlop) {
    super({ players, deck, onStageEnd });
    this.smallBlind = smallBlind;
  }

  public start() {
    for (let i = 0; i < 2; i++) {
      this.players.forEach((player) => {
        const card = this.deck.pick();
        if (card) player.addCard(card);
      });
    }

    this.raise(this.smallBlind);
    this.raise(this.smallBlind * 2);
  }
}

export class Flop extends Stage {
  private onDeal: () => void;

  constructor({ deck, players, onStageEnd, onDeal }: IFlop) {
    super({ deck, players, onStageEnd });
    this.onDeal = onDeal;
  }

  public start() {
    for (let i = 0; i < 3; i++) this.onDeal();
  }
}

export default class Stages {
  static make({ players, deck, smallBlind, onStageEnd, onDeal }: IStageInit) {
    return [
      new PreFlop({ players, deck, smallBlind, onStageEnd }),
      new Flop({ players, deck, onStageEnd, onDeal }),
    ];
  }
}
