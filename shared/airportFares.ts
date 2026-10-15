// Fixed airport fares, one way from central Nottingham, in pounds EXCLUDING VAT.
// These are the same fares as the business account rate card; the website
// shows them with VAT added, because prices shown to the public must include it.

export const VAT_RATE = 0.2;

export type AirportFare = {
  airport: string;
  standard: number;
  xl: number;
  executive: number;
};

export const AIRPORT_FARES: AirportFare[] = [
  { airport: "East Midlands Airport", standard: 45, xl: 55, executive: 80 },
  { airport: "Birmingham Airport", standard: 125, xl: 150, executive: 195 },
  { airport: "Manchester Airport", standard: 185, xl: 215, executive: 260 },
  { airport: "Heathrow Airport", standard: 245, xl: 285, executive: 320 },
];

export function withVat(exVat: number) {
  return Math.round(exVat * (1 + VAT_RATE) * 100) / 100;
}

/** "From £54" — the public, VAT-inclusive price. */
export function fromPrice(exVat: number) {
  const inc = withVat(exVat);
  return `From £${Number.isInteger(inc) ? inc : inc.toFixed(2)}`;
}

export const EMA_FROM = fromPrice(AIRPORT_FARES[0].standard);
