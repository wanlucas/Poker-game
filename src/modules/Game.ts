import Player from "./Player";
import Round from "./Round";

export interface IGame {
  initialBankroll?: number;
  smallBlind?: number;
}

export interface IAction {
  action: 'call' | 'raise' | 'check' | 'fold';
  value?: number;
}

export default class Game {
  public round: Round | null;
  public players: Player[];
  public initialBankroll: number;
  public smallBlind: number;

  constructor({ initialBankroll, smallBlind }: IGame) {
    this.players = [];
    this.round = null;
    this.initialBankroll = initialBankroll || 100;
    this.smallBlind = smallBlind || 5;
  }

  public addPlayer({ name, id }: { name: string; id: string }) {
    this.players.push(new Player({ name, id, bankroll: this.initialBankroll }));
  }

  public removePlayer(id: string) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  public start() {
    if (this.players.length < 2) {
      throw new Error("Not enough players to start a game");
    }

    this.round = new Round({
      players: this.players,
      smallBlind: this.smallBlind,
    });
  }

  public action(playerId: string, { action, value }: IAction) {
    if (!this.round) {
      throw new Error("Game not started");
    }

    if (action === "raise" && !value) {
      throw new Error("Invalid raise");
    }

    if (this.round.currentStage.currentPlayer.id !== playerId) {
      throw new Error("Not your turn");
    }

    switch (action) {
      case "check":
        this.round.currentStage.check();
        break;
      case "raise":
        this.round.currentStage.raise(value!);
        break;
      case "call":
        this.round.currentStage.call();
        break;
      case "fold":
        this.round.currentStage.fold();
        break;
      default:
        throw new Error("Invalid action");
    }
  }

  private nextDealer() {
    this.players.push(this.players.shift()!);
  }

  private nextRound() {
    this.nextDealer();
    this.round = new Round({
      players: this.players,
      smallBlind: this.smallBlind,
    });
  }
}
