import Card, { Suit, Value } from "../../src/modules/Card";
import Hand from "../../src/modules/Hand";

export const SUIT_MAPPER: { [key: string]: Suit } = {
  s: 'spades',
  h: 'hearts',
  c: 'clubs',
  d: 'diamonds',
};

export default ((values: string) => {
  const cards = values.split(' ').map((str) => {
    const value = parseInt(str.slice(0, -1)) as Value;
    const suit = SUIT_MAPPER[str.slice(-1)];
    
    return new Card({ value, suit })
  });
  
  return new Hand({ cards });
});