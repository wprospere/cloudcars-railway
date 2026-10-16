// Fixed airport fares, one way from inside the Nottingham ring road, in pounds.
// These match the Cloud Cars tariff card. Everyday bookings carry no VAT on the
// fare (Cloud Cars books as the driver's agent); business accounts pay the same
// fare with VAT added on the invoice. Airport parking is added at cost.

export type AirportFare = {
  airport: string;
  standard: number;
  xl: number;
  executive: number;
};

export const AIRPORT_FARES: AirportFare[] = [
  { airport: "East Midlands Airport", standard: 45, xl: 55, executive: 80 },
  { airport: "Birmingham Airport", standard: 100, xl: 120, executive: 135 },
  { airport: "Manchester Airport", standard: 160, xl: 190, executive: 235 },
  { airport: "Heathrow Airport", standard: 215, xl: 255, executive: 290 },
];

/** "From £45" */
export function fromPrice(pounds: number) {
  return `From £${Number.isInteger(pounds) ? pounds : pounds.toFixed(2)}`;
}

export const EMA_FROM = fromPrice(AIRPORT_FARES[0].standard);
