import Hand, { Ranking } from "../../src/modules/Hand";
import generateHand from "../helpers/generateHand";

describe("Hand", () => {
  describe("Verificação de pares", () => {
    test('Deve retornar carta alta', () => {
      const highCardCases = [
        ['14s 2d 5h 8c 9s 3s 12c', '14s 12c 9s 8c 5h'],
        ['4s 2d 5h 7c 10s 11s 13s', '13s 11s 10s 7c 5h'],
        ['7s 2d 5h 8c 4s 11s 10c', '11s 10c 8c 7s 5h'],
      ];

      highCardCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);

        expect(hand.ranking).toBe(Ranking.HighCard);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar um par", () => {
      const onePairCases = [
        ['5h 7c 10s 14s 14d 11s 13s', '14s 14d 13s 11s 10s'],
        ['10d 10s 13s 14s 2d 5h 7c', '10d 10s 14s 13s 7c'],
        ['10s 11h 11s 14s 2d 5h 7c', '11h 11s 14s 10s 7c'],
      ];
  
      onePairCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);

        expect(hand.ranking).toBe(Ranking.Pair);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar dois pares", () => {
      const twoPairCases = [
        ['14s 14d 5h 5c 10s 11s 13s', '14s 14d 5h 5c 13s'],
        ['14s 2d 5h 5c 10d 10s 13s', '10d 10s 5h 5c 14s'],
        ['14s 2d 11d 11s 2h 5c 10s', '11d 11s 2d 2h 14s'],
      ];
  
      twoPairCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);

        expect(hand.ranking).toBe(Ranking.TwoPair);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar uma trinca", () => {
      const threeOfAKindCases = [
        ['14s 14d 14h 5c 10s 11s 13s', '14s 14d 14h 13s 11s'],
        ['14s 2d 2h 5c 2s 10s 13s', '2d 2h 2s 14s 13s'],
        ['14s 2d 5h 5c 5s 11s 10s', '5h 5c 5s 14s 11s'],
      ];
  
      threeOfAKindCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.ThreeOfAKind);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar uma quadra", () => {
      const fourOfAKindCases = [
        ['14s 14d 14h 14c 5s 11s 9s', '14s 14d 14h 14c 11s'],
        ['14s 2d 2h 2c 2s 12s 5s', '2d 2h 2c 2s 14s'],
        ['14s 2d 5c 5d 5s 10s 5h', '5c 5d 5s 5h 14s'],
      ];
  
      fourOfAKindCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.FourOfAKind);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar um full house", () => {
      const fullHouseCases = [
        ['5c 5s 14s 14d 14h 11s 9s', '14s 14d 14h 5c 5s'],
        ['2c 5s 14s 2d 2h 12s 5d', '2c 2d 2h 5s 5d'],
        ['5c 5s 5d 14s 2d 10s 10h', '5c 5s 5d 10s 10h'],
      ];
  
      fullHouseCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.FullHouse);
        expect(hand.toString()).toBe(expected);
      });
    });
  });

  describe("Verificação de sequência e flush", () => {
    test("Deve retornar um flush", () => {
      const flushCases = [
        ['2s 5s 14s 14d 14h 11s 9s', '14s 11s 9s 5s 2s'],
        ['2c 5s 14s 2d 2s 12s 6s', '14s 12s 6s 5s 2s'],
        ['5c 5s 6s 14s 2s 10s 10h', '14s 10s 6s 5s 2s'],
      ];
  
      flushCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.Flush);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar um straight", () => {
      const straightCases = [
        ['14s 2d 3d 4s 5c 11c 9h', '5c 4s 3d 2d 14s'],
        ['14c 13s 12s 7s 7d 10c 11h', '14c 13s 12s 11h 10c'],
        ['8c 7s 9d 10d 11s 12c 6s', '12c 11s 10d 9d 8c'],
      ];
  
      straightCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.Straight);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar um straight flush", () => {
      const straightFlushCases = [
        ['14s 2s 3s 4s 5s 2c 3h', '5s 4s 3s 2s 14s'],
        ['5c 14h 9c 12c 13c 10c 11c', '13c 12c 11c 10c 9c'],
        ['5h 5c 14c 2c 3c 4c 5s', '5c 4c 3c 2c 14c'],
      ];
  
      straightFlushCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.StraightFlush);
        expect(hand.toString()).toBe(expected);
      });
    });

    test("Deve retornar um royal flush", () => {
      const royalFlushCases = [
        ['14s 13s 12s 11s 10s 12h 11h', '14s 13s 12s 11s 10s'],
        ['14c 14d 10c 11c 12c 13c 14h', '14c 13c 12c 11c 10c'],
        ['14h 6c 9c 12h 13h 10h 11h', '14h 13h 12h 11h 10h'],
      ];
  
      royalFlushCases.forEach(([cards, expected]) => {
        const hand = generateHand(cards);
  
        expect(hand.ranking).toBe(Ranking.RoyalFlush);
        expect(hand.toString()).toBe(expected);
      });
    });
  });
});