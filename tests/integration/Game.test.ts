import Game from "../../src/modules/Game";

describe("Testes da clase game", () => {
  const initialBankroll = 200;
  const smallBlind = 5;
  const game = new Game({ initialBankroll, smallBlind });
  const playerA = { name: "Nita", id: "1" };
  const playerB = { name: "Wan", id: "2" };
  const playerC = { name: "Davio", id: "3" };
  const state = {
    pot: 0,
    playerABet: 0,
    playerBBet: 0,
    playerABankroll: initialBankroll,
    playerBBankroll: initialBankroll,
  }

  test("Não deve iniciar um jogo com menos de 2 jogadores", () => {
    expect(() => game.start()).toThrow();
  });

  test("Deve adicionar jogadores ao jogo", () => {
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    game.addPlayer(playerC);

    expect(game.players.length).toBe(3);
    expect(game.players[0].name).toBe(playerA.name);
    expect(game.players[1].name).toBe(playerB.name);
    expect(game.players[2].name).toBe(playerC.name);
  });

  test("Deve remover jogadores do jogo", () => {
    game.removePlayer(playerC.id);

    expect(game.players.length).toBe(2);
    expect(game.players[2]).toBeUndefined();
  });

  test("Deve distribuir a banca corretamente", () => {
    expect(game.players[0].bankroll).toBe(state.playerABankroll);
    expect(game.players[1].bankroll).toBe(state.playerBBankroll);
  });

  test("Deve distribuir as cartas corretamente", () => {
    game.start();

    expect(game.players[0].hand.length).toBe(2);
    expect(game.players[1].hand.length).toBe(2);
    expect(game.round!.deck.size).toBe(48);
  });

  test("Deve ser apostado o small blind e big blind corretamente", () => { 
    expect(game.players[0].bankroll).toBe(initialBankroll - smallBlind);
    expect(game.players[0].currentBet).toBe(smallBlind);
    expect(game.players[1].bankroll).toBe(initialBankroll - smallBlind * 2);
    expect(game.players[1].currentBet).toBe(smallBlind * 2);

    state.pot += smallBlind * 3;
    state.playerABet = smallBlind;
    state.playerABankroll -= smallBlind;
    state.playerBBet = smallBlind * 2;
    state.playerBBankroll -= smallBlind * 2;
  });

  test("Deve falhar ao realizar ação fora do turno", () => {
    expect(() => game.action(playerB.id, { action: "call" })).toThrow();
  });
 
  test("Deve ser possível dar call", () => {
    game.action(playerA.id, { action: 'call' });
    expect(game.players[0].bankroll).toBe(initialBankroll - smallBlind * 2);
  
    state.pot += smallBlind;
    state.playerABankroll -= smallBlind;
    state.playerABet += smallBlind;
  });

  test("Deve acomular as apostas de todos os players no pot ao terminar um estágio", () => {
    expect(game.players[0].currentBet).toBe(0);
    expect(game.players[1].currentBet).toBe(0);
    expect(game.round!.pot).toBe(state.pot);
  });

  test("Deve adicionar três cartas à mesa no estágio Flop", () => {
    expect(game.round!.community).toHaveLength(3);
  });

  test("Deve ser possível dar check caso não hajam apostas", () => {    
    expect(() => game.action(playerA.id, { action: 'check' })).not.toThrow();
    expect(() => game.action(playerB.id, { action: 'check' })).not.toThrow();
  });

  test("Deve adicionar uma carta à mesa no estágio Turn", () => {
    expect(game.round!.community).toHaveLength(4);
  });

  test("Deve falhar ao dar fold sem apostas em jogo", () => {
    expect(() => game.action(playerA.id, { action: 'fold' })).toThrow();
  });

  test("Deve ser possível dar raise para qualquer valor caso não hajam apostas em jogo", () => {
    expect(() => game.action(playerA.id, { action: 'raise', value: 30 })).not.toThrow();
    state.pot += 30;
    state.playerABet += 30;
    state.playerABankroll -= 30;
  });

  test("Deve falhar ao dar raise para um valor menor que o dobro da aposta em jogo", () => {
    expect(() => game.action(playerB.id, { action: 'raise', value : 40 })).toThrow();
  });

  test("Deve ser possível dobrar a aposta", () => {
    expect(() => game.action(playerB.id, { action: 'raise', value: 60 })).not.toThrow();
    state.pot += 60;
    state.playerBBet += 60;
    state.playerBBankroll -= 60;
  });

  test("Deve ser possível dar call em uma aposta dobrada", () => {
    expect(() => game.action(playerA.id, { action: 'call' })).not.toThrow();
    state.pot += 30;
    state.playerABet += 30;
    state.playerABankroll -= 30;
  });

  test("Deve adicionar a última carta à mesa no estágio River", () => {
    expect(game.round?.community).toHaveLength(5);
  });

  test("Deve ser possível dar fold caso hajam apostas na mesa", () => {
    game.action(playerA.id, { action: 'raise', value: 60 });
    expect(() => game.action(playerB.id, { action: 'fold' })).not.toThrow();

    state.pot += 60;
    state.playerABet += 60;
    state.playerABankroll -= 60;
  });

  test("O jogador vendendor deve receber o pot", () => {
    expect(game.players[1].bankroll).toBe(initialBankroll + state.pot - state.playerABet);
    state.pot = 0;
    state.playerABet = 0;
  });

  test("O jogador perdedor deve perder suas apostas", () => {
    expect(game.players[0].bankroll).toBe(initialBankroll - state.playerBBet);
    state.playerBBet = 0;
  });

  test("Os jogadores devem ficar sem cartas e se reagrupar em final do round", () => {
    expect(game.players[0].hand.length).toBe(0);
    expect(game.players[1].hand.length).toBe(0);
    expect(game.players[0].name).toBe("Wan");
    expect(game.players[1].name).toBe("Nita");
  });

  test("Os jogadores devem receber novas cartas ao iniciar um novo round", () => {
    game.start();
    
    expect(game.players[0].hand.length).toBe(2);
    expect(game.players[1].hand.length).toBe(2);
  });

  test("O jogador pode dar all-in", () => {
    game.action(playerB.id, { action: 'raise', value: state.playerBBankroll });

    expect(game.players[0].bankroll).toBe(0);
    expect(game.players[0].currentBet).toBe(state.playerBBankroll);

    state.playerBBet += state.playerBBankroll;
    state.playerBBankroll = 0;
  });
});