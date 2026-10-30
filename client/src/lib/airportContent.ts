// What makes each "Nottingham to <airport>" page different. Prices come from
// shared/airportFares.ts (the tariff card). Everything else sticks to claims
// the rest of the site already makes (fixed price at booking, 30 minutes'
// waiting included, we meet you in arrivals, flight tracking, 24/7) and to
// plain facts about the airports. Journey times are rough, normal-traffic
// guides, worded as such.

export type AirportCard = { title: string; text: string };
export type AirportFaq = { q: string; a: string };

export type AirportContent = {
  slug: string; // e.g. "nottingham-to-heathrow-airport"
  fareKey: string; // matches AIRPORT_FARES[].airport
  name: string; // e.g. "Heathrow Airport"
  short: string; // e.g. "Heathrow"
  journeyTime: string;
  terminals?: string;
  intro: string[];
  planningHeading: string;
  planning: AirportCard[];
  faqs: AirportFaq[]; // airport-specific, shown before the shared ones
};

export const AIRPORT_PAGES: Record<string, AirportContent> = {
  heathrow: {
    slug: "nottingham-to-heathrow-airport",
    fareKey: "Heathrow Airport",
    name: "Heathrow Airport",
    short: "Heathrow",
    journeyTime: "Around 2 to 2½ hours in normal traffic",
    terminals: "Terminals 2, 3, 4 and 5",
    intro: [
      "Cloud Cars runs pre-booked taxi transfers from Nottingham to Heathrow Airport, from your door to the terminal, with your fare fixed when you book. It is one of the longest airport journeys we do from Nottingham, so having the car, the driver and the pickup time settled in advance takes a lot of stress out of the day.",
      "Tell us your terminal and flight number when you book. For departures we agree a pickup time that leaves a sensible margin for motorway traffic. For arrivals we track your flight and meet you, so a delay does not leave you waiting.",
    ],
    planningHeading: "Planning your Heathrow transfer",
    planning: [
      {
        title: "Leave plenty of time",
        text: "Motorway traffic on the way to Heathrow can change quickly. We agree your pickup time with a margin built in, so you are not racing to check-in.",
      },
      {
        title: "Early flights and late arrivals",
        text: "We operate 24 hours a day, so very early departures and late-night arrivals can be booked in advance.",
      },
      {
        title: "Luggage and groups",
        text: "Travelling with family, extra cases or sports equipment? Ask for a larger vehicle when you book.",
      },
      {
        title: "Business travel",
        text: "Heathrow is a popular choice for business trips. Companies with a Cloud Cars account get all their journeys on one invoice.",
        },
    ],
    faqs: [
      {
        q: "Which Heathrow terminals do you serve?",
        a: "All of them: Terminals 2, 3, 4 and 5. Give us your terminal and flight number when you book and we will arrange the right pickup or drop-off.",
      },
      {
        q: "How long does it take to get from Nottingham to Heathrow?",
        a: "Allow around 2 to 2½ hours in normal traffic. Roadworks and congestion on the motorways can add to that, so we agree a pickup time with a margin for your flight.",
      },
      {
        q: "Can you collect me from Heathrow when I land?",
        a: "Yes. You can book your outward and return journeys together. Give us your return flight number and we track the flight, meet you in arrivals and include 30 minutes' waiting on every airport pickup.",
      },
    ],
  },

  birmingham: {
    slug: "nottingham-to-birmingham-airport",
    fareKey: "Birmingham Airport",
    name: "Birmingham Airport",
    short: "Birmingham",
    journeyTime: "Around 1 hour to 1 hour 15 minutes in normal traffic",
    intro: [
      "Cloud Cars provides pre-booked taxi transfers from Nottingham to Birmingham Airport, with your fare fixed at booking and a professional driver who knows the route. The airport is in Solihull, next to the NEC and Birmingham International station, which makes it a popular choice for both holidays and business travel.",
      "Give us your airline and flight number when you book. For departures we agree a pickup time that suits your check-in, and for arrivals we track your flight and meet you, so a late landing does not leave you waiting.",
    ],
    planningHeading: "Planning your Birmingham Airport transfer",
    planning: [
      {
        title: "Door-to-terminal",
        text: "No parking, no changing trains and no carrying luggage across platforms. We collect you from your address and take you straight to the airport.",
      },
      {
        title: "Early and late flights",
        text: "We operate 24 hours a day, so early-morning departures and late-night arrivals can be booked in advance.",
      },
      {
        title: "Groups and luggage",
        text: "Travelling as a family or with extra bags? Ask for a larger vehicle when you book.",
      },
      {
        title: "Business and events",
        text: "Birmingham Airport is close to the NEC, so we are often booked for business trips and events. Companies with a Cloud Cars account get one invoice for all their journeys.",
      },
    ],
    faqs: [
      {
        q: "How long does it take to get from Nottingham to Birmingham Airport?",
        a: "Allow around 1 hour to 1 hour 15 minutes in normal traffic. Busy periods on the motorways can add to that, so we agree a pickup time with a margin for your flight.",
      },
      {
        q: "Can you collect me from Birmingham Airport when I land?",
        a: "Yes. You can book your outward and return journeys together. Give us your return flight number and we track the flight, meet you in arrivals and include 30 minutes' waiting on every airport pickup.",
      },
      {
        q: "Can you take me to the NEC as well?",
        a: "The NEC is next to the airport. Tell us your destination when you book and we will confirm the price before you travel.",
      },
    ],
  },

  manchester: {
    slug: "nottingham-to-manchester-airport",
    fareKey: "Manchester Airport",
    name: "Manchester Airport",
    short: "Manchester",
    journeyTime: "Around 1½ to 2 hours in normal traffic",
    terminals: "Terminals 1, 2 and 3",
    intro: [
      "Cloud Cars runs pre-booked taxi transfers from Nottingham to Manchester Airport, with your fare fixed when you book. It is a long cross-country journey, so a booked car and driver, and a pickup time agreed in advance, is far easier than a train change or a long-stay car park.",
      "Tell us your terminal and flight number when you book. For departures we agree a pickup time that leaves a sensible margin for traffic. For arrivals we track your flight and meet you, so a delay does not leave you waiting.",
    ],
    planningHeading: "Planning your Manchester Airport transfer",
    planning: [
      {
        title: "Leave plenty of time",
        text: "Cross-country traffic can change quickly. We agree your pickup time with a margin built in, so you reach check-in without rushing.",
      },
      {
        title: "Early flights and late arrivals",
        text: "We operate 24 hours a day, so very early departures and late-night arrivals can be booked in advance.",
      },
      {
        title: "Luggage and groups",
        text: "Travelling with family or extra bags? Ask for a larger vehicle when you book.",
      },
      {
        title: "Business travel",
        text: "Companies with a Cloud Cars account get all their journeys, including airport runs, on one invoice.",
      },
    ],
    faqs: [
      {
        q: "Which Manchester Airport terminals do you serve?",
        a: "All of them: Terminals 1, 2 and 3. Give us your terminal and flight number when you book and we will arrange the right pickup or drop-off.",
      },
      {
        q: "How long does it take to get from Nottingham to Manchester Airport?",
        a: "Allow around 1½ to 2 hours in normal traffic. Roadworks and congestion can add to that, so we agree a pickup time with a margin for your flight.",
      },
      {
        q: "Can you collect me from Manchester Airport when I land?",
        a: "Yes. You can book your outward and return journeys together. Give us your return flight number and we track the flight, meet you in arrivals and include 30 minutes' waiting on every airport pickup.",
      },
    ],
  },
};

export const AIRPORT_ORDER = ["heathrow", "birmingham", "manchester"] as const;
