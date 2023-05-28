import Card from "./Card";
import Deck from "./Deck";
import Player from "./Player";
import Stages, { Stage } from "./Stages";

export interface IRound {
  smallBlind: number;
  players: Player[];
}

export default class Round {
  private stages: Stage[];
  public players: Player[];
  public deck: Deck;
  public pot: number;
  public community: Card[];

  get currentStage() {
    return this.stages[0];
  }

  constructor({ players, smallBlind }: IRound) {
    this.deck = new Deck();
    this.players = players;
    this.pot = 0;
    this.community = [];
    this.stages = Stages.make({
      players,
      smallBlind,
      deck: this.deck,
      onDeal: this.deal.bind(this),
      onStageEnd: this.nextStage.bind(this),
    });

    this.currentStage.start();
  }

  private deal() {
    this.community.push(this.deck.pick());  
  }

  private verifyWinner() {
    // calculate hands - soon
    return this.players[0];
  }

  private showdown() {
    const winner = this.verifyWinner();

    winner.receive(this.pot);
    this.pot = 0;
  }

  private nextStage() {
    this.players.forEach((player) => {
      this.pot += player.pay();
    });

    this.stages.shift();
    
    if (this.currentStage) {
      this.currentStage.start();
    } else this.showdown(); 
  }
}
