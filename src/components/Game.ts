import Deck from "./Deck";
import Player from "./Player";

export default class Game {
  private deck: Deck;
  public players: Player[];
  public pot: number;

  constructor() {
    this.deck = new Deck();
    this.players = [];
    this.pot = 0;
  }

  public addPlayer(player: Player) {
    this.players.push(player);
  }

  public removePlayer(id: string) {
    this.players = this.players.filter((player) => player.id !== id);
  }
}