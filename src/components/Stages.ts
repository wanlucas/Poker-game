import Deck from "./Deck";
import Player from "./Player";

export interface IStage {
  players: Player[];
  deck: Deck;
  onStageEnd: () => void;
}

export interface IStageInit extends IStage {
  smallBlind: number;
}

export interface IPreFlop extends IStage {
  smallBlind: number;
}

export abstract class Stage {
  protected players: Player[];
  protected deck: Deck;
  protected currentPlayerI: number;
  protected biggestBet: number;
  protected onStageEnd: () => void;

  get currentPlayer() {
    return this.players[this.currentPlayerI];
  }

  get lastPlayer() {
    return this.players[this.currentPlayerI - 1];
  }

  get nextPlayer() {
    return this.players[this.currentPlayerI + 1];
  }

  constructor({ players, deck, onStageEnd }: IStage) {
    this.deck = deck;
    this.players = players;
    this.onStageEnd = onStageEnd;
    this.currentPlayerI = 0;
    this.biggestBet = 0;
  }

  protected next() {
    this.currentPlayerI = (this.currentPlayerI + 1) % this.players.length;
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

  private deal() {
    for (let i = 0; i < 2; i++) {
      this.players.forEach((player) => {
        const card = this.deck.pick();
        if (card) player.addCard(card);
      });
    }
  }

  public start() {
    this.deal();
    this.raise(this.smallBlind);
    this.raise(this.smallBlind * 2);
  }
}

export default class Stages {
  static make({ players, deck, smallBlind, onStageEnd }: IStageInit) {
    return [new PreFlop({ players, deck, smallBlind, onStageEnd })];
  }
}
