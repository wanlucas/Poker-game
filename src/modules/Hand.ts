import Card, { Value } from "./Card";
import assert from "assert";

export enum Ranking {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

export interface IHand {
  cards: Card[];
}

export default class Hand {
  public cards: Card[];
  public hand: Card[];
  public ranking: Ranking;

  constructor({ cards }: IHand) {
    assert(cards.length === 7, "Cards must have 7 elements");

    this.cards = this.sortByPair(cards);
    this.ranking = Ranking.HighCard;
    this.hand = [];
    this.evaluate();
  }

  private sortByPair(cards: Card[]) {
    const rankOccurrences = new Array(13).fill(0);

    cards.forEach((card) => rankOccurrences[card.value - 2]++);

    return cards.sort((a, b) => (
      rankOccurrences[b.value - 2] - rankOccurrences[a.value - 2] ||
      b.value - a.value
    ));
  }

  private sortByValue(cards: Card[]) {
    return cards.sort((a, b) => b.value - a.value);
  }

  private getRankAt(index: number) {
    return this.cards[index].value;
  }

  private lastOccurrenceOfRank(value: Value) {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      if (this.cards[i].value === value) return i;
    }

    return -1;
  }

  private getStraight(cards: Card[]) {
    assert(cards.length >= 5);

    const treatedCards = this.sortByValue(cards.reduce((acc, card) => {
      if (card.value === 14) acc.push(new Card({ value: 1, suit: card.suit }));
      return acc.concat(card);
    }, [] as Card[]));

    let straight = [treatedCards[0]];

    for (let i = 1; i < treatedCards.length; i++) {
      const prevRank = straight[straight.length - 1].value;
      const currentCard = treatedCards[i];
      const currentRank = currentCard.value;

      if (prevRank === currentRank) continue;
      if (prevRank === currentRank + 1) straight.push(currentCard);
      else if (straight.length < 5) straight = [currentCard];
    }

    if (straight.length >= 5) {
      return straight.slice(0, 5).reduce((acc, card) => {
        if (card.value === 1) return acc.concat(new Card({ value: 14, suit: card.suit }));
        return acc.concat(card);
      }, [] as Card[]);
    }
  }

  private getFlush(cards: Card[] = this.cards) {
    const cardsBySuit: { [key: string]: Card[] } = {};

    cards.forEach((card) => {
      if (!cardsBySuit[card.suit]) cardsBySuit[card.suit] = [];
      cardsBySuit[card.suit].push(card);
    });

    const flush = Object.values(cardsBySuit).find((suit) => suit.length >= 5);

    flush && this.sortByValue(flush);

    return flush;
  }

  private checkStraights() {
    const flush = this.getFlush();

    let ranking: Ranking;
    let hand: Card[];

    if (flush) {
      const straight = this.getStraight(flush);

      if (straight) {
        if (straight[0].value === 14) {
          ranking = Ranking.RoyalFlush;
        } else ranking = Ranking.StraightFlush;

         hand = straight;
      } else {
        ranking = Ranking.Flush;
        hand = flush;
      }
    } else {
      const straight = this.getStraight(this.cards);

      if (straight) {
        ranking = Ranking.Straight;
        hand = straight;
      } else {
        ranking = Ranking.HighCard;
        hand = this.cards;
      }
    }

    return { ranking, hand: hand.slice(0, 5) };
  }

  private checkPairs() {
    const firstRank = this.getRankAt(0);
    const lastOccurrence = this.lastOccurrenceOfRank(firstRank);

    let ranking = Ranking.HighCard;

    if (lastOccurrence === 3) {
      ranking = Ranking.FourOfAKind;
    } else if (lastOccurrence === 2) {
      if (this.getRankAt(3) === this.getRankAt(4)) {
        ranking = Ranking.FullHouse;
      } else ranking = Ranking.ThreeOfAKind;
    } else if (lastOccurrence === 1) {
      if (this.getRankAt(2) === this.getRankAt(3)) {
        ranking = Ranking.TwoPair;
      } else ranking = Ranking.Pair;
    }

    return { ranking, hand: this.cards.slice(0, 5) };
  }

  private evaluate() {
    const pairRank = this.checkPairs();
    const straightRank = this.checkStraights();
    const higher = straightRank.ranking > pairRank.ranking ? straightRank : pairRank;

    this.ranking = higher.ranking;
    this.hand = higher.hand;
  }

  public toString() {
    return this.hand.map(({ suit, value }) => `${value}${suit[0]}`).join(' ');
  }
}
