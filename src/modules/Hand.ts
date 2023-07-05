import Card, { Suit, Value } from "./Card";
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

    return [...cards].sort((a, b) => (
      rankOccurrences[b.value - 2] - rankOccurrences[a.value - 2] ||
      b.value - a.value
    ));
  }

  private sortByValue(cards: Card[]) {
    return [...cards].sort((a, b) => b.value - a.value);
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

  private treatHand(cards: Card[]) {
    return cards.slice(0, 5).reduce((acc, card) => {
      if (card.value === 1) {
        return [...acc, new Card({ value: 14, suit: card.suit })];
      } else return [...acc, card];
    }, [] as Card[]);
  }

  private getStraight(cards: Card[]) {
    assert(cards.length >= 5);

    const sortedCards = this.sortByValue(
      cards.reduce((acc, card) => {
        if (card.value === 14) {
          return [...acc, new Card({ value: 1, suit: card.suit }), card];
        } else return [...acc, card];
      }, [] as Card[])
    );

    let straight = [sortedCards[0]];

    for (let i = 1; i < sortedCards.length; i++) {
      const prevRank = straight[straight.length - 1].value;
      const currentCard = sortedCards[i];
      const currentRank = currentCard.value;

      if (prevRank === currentRank) continue;

      if (prevRank === currentRank + 1) straight.push(currentCard);
      else if (straight.length < 5) straight = [currentCard];
    }

    if (straight.length >= 5) return this.treatHand(straight);
    return null;
  }

  public checkStraightFlush() {
    const cardsBySuit: { [key: string]: Card[] } = {};

    let ranking: Ranking;

    this.cards.forEach((card) => {
      if (!cardsBySuit[card.suit]) cardsBySuit[card.suit] = [];
      cardsBySuit[card.suit].push(card);
    });

    const flushSuit = Object.values(cardsBySuit).find((suit) => suit.length >= 5)

    if (flushSuit) {
      const straight = this.getStraight(flushSuit);

      if (straight) {
        if (straight[1].value === 13) {
          ranking = Ranking.RoyalFlush;
        } else ranking = Ranking.StraightFlush;

        return { ranking, hand: this.treatHand(straight) };
      } else ranking = Ranking.Flush;

      return { ranking, hand: this.treatHand(flushSuit.sort((a, b) => b.value - a.value)) };
    } else {
      const straight = this.getStraight(this.cards);

      if (straight) {
        ranking = Ranking.Straight;
        return { ranking, hand: this.treatHand(straight) };
      }
    }

    return { ranking: Ranking.HighCard, hand: this.treatHand(this.cards) };
  }

  public checkPairs() {
    const firstRank = this.getRankAt(0);
    const firstRankLastOcc = this.lastOccurrenceOfRank(firstRank);

    let ranking = Ranking.HighCard;

    if (firstRankLastOcc === 3) {
      ranking = Ranking.FourOfAKind;
    } else if (firstRankLastOcc === 2) {
      if (this.getRankAt(3) === this.getRankAt(4)) {
        ranking = Ranking.FullHouse;
      } else ranking = Ranking.ThreeOfAKind;
    } else if (firstRankLastOcc === 1) {
      if (this.getRankAt(2) === this.getRankAt(3)) {
        ranking = Ranking.TwoPair;
      } else ranking = Ranking.Pair;
    }

    return { ranking, hand: this.treatHand(this.cards) };
  }

  public evaluate() {
    const pairRank = this.checkPairs();
    const straightFlushRank = this.checkStraightFlush();

    if (straightFlushRank.ranking > pairRank.ranking) {
      this.ranking = straightFlushRank.ranking;
      this.hand = straightFlushRank.hand;
    } else {
      this.ranking = pairRank.ranking;
      this.hand = pairRank.hand;
    }
  }

  public toString() {
    return this.hand.map(({ suit, value }) => `${value}${suit[0]}`).join(' ');
  }
}
