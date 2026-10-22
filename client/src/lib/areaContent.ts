// What makes each local area page different. Kept to plain, checkable facts
// about the places (landmarks, stations, venues) and to claims the rest of the
// site already makes: fixed fare at booking, DBS-checked licensed drivers,
// pre-booked, available 24/7. No journey times or area prices are quoted here.

export type AreaJourney = {
  title: string;
  text: string;
  href?: string;
  hrefLabel?: string;
};

export type AreaFaq = { q: string; a: string };

export type AreaContent = {
  area: string;
  slug: string; // e.g. "taxi-beeston"
  intro: string[];
  journeysHeading: string;
  journeys: AreaJourney[];
  nearby: string[]; // area names with their own page
  faqs: AreaFaq[]; // area-specific questions, shown before the shared ones
};

export const AREAS: Record<string, AreaContent> = {
  Beeston: {
    area: "Beeston",
    slug: "taxi-beeston",
    intro: [
      "Beeston sits just south-west of Nottingham city centre, with a busy town centre, its own railway station and the University of Nottingham's University Park campus close by. Cloud Cars runs pre-booked taxis from Beeston for everyday journeys, airport runs and business travel.",
      "Your fare is fixed when you book, so you know what you will pay before you set off. Our drivers are DBS-checked and licensed, and we are available around the clock, whether it is an early train from Beeston station or a late return from the city.",
    ],
    journeysHeading: "Popular journeys from Beeston",
    journeys: [
      {
        title: "Beeston railway station",
        text: "Early trains and late arrivals. Book ahead and your driver will be there for your departure time.",
        href: "/train-airport-transfer-policy",
        hrefLabel: "How early to book for trains and flights",
      },
      {
        title: "University of Nottingham and the QMC",
        text: "Lifts to and from University Park and the Queen's Medical Centre for students, staff, patients and visitors.",
      },
      {
        title: "East Midlands Airport",
        text: "A fixed-fare run to the airport, with flight tracking for arrivals when you give us your flight number.",
        href: "/nottingham-to-east-midlands-airport",
        hrefLabel: "Nottingham to East Midlands Airport",
      },
      {
        title: "Nottingham city centre",
        text: "Evenings out, shopping, appointments and onward rail connections from Nottingham station.",
      },
      {
        title: "Chilwell and Attenborough",
        text: "Short local hops around the Beeston and Chilwell side of the Trent, booked in advance or on the day.",
      },
    ],
    nearby: ["Wollaton", "West Bridgford"],
    faqs: [
      {
        q: "Can I book a taxi from Beeston station?",
        a: "Yes. Pre-book your pickup and tell us your train time. If you are travelling to a station, our Train & Airport Transfer Policy explains how early we recommend leaving.",
      },
      {
        q: "Do you take people to the University of Nottingham and the QMC?",
        a: "Yes. We run journeys to University Park and the Queen's Medical Centre from Beeston and across Nottingham. Book in advance for appointments and arrivals so your driver is ready on time.",
      },
    ],
  },

  "West Bridgford": {
    area: "West Bridgford",
    slug: "taxi-west-bridgford",
    intro: [
      "West Bridgford sits across the River Trent from Nottingham city centre and is home to Trent Bridge cricket ground and the City Ground. Cloud Cars runs pre-booked taxis from West Bridgford for everyday journeys, airport transfers and business travel.",
      "Your fare is fixed when you book, so you know what you will pay before you set off. Match days and big events around Trent Bridge and the City Ground get busy, so we recommend booking your return journey in advance.",
    ],
    journeysHeading: "Popular journeys from West Bridgford",
    journeys: [
      {
        title: "Nottingham city centre and station",
        text: "Across the river for work, shopping, evenings out and rail connections from Nottingham station.",
      },
      {
        title: "Trent Bridge and the City Ground",
        text: "Cricket, football and events. Pre-book your trip home so you are not waiting when the crowds leave.",
      },
      {
        title: "East Midlands Airport",
        text: "A fixed-fare transfer, with flight tracking for arrivals when you give us your flight number.",
        href: "/nottingham-to-east-midlands-airport",
        hrefLabel: "Nottingham to East Midlands Airport",
      },
      {
        title: "Birmingham, Manchester and Heathrow",
        text: "Longer airport journeys with a fixed fare agreed at booking and airport fees built in.",
        href: "/airport-transfers-nottingham",
        hrefLabel: "Airport transfers from Nottingham",
      },
      {
        title: "Hospitals and appointments",
        text: "Lifts to Nottingham's hospitals, including the Queen's Medical Centre, booked in advance.",
      },
    ],
    nearby: ["Edwalton", "Beeston", "Wollaton"],
    faqs: [
      {
        q: "Can I book a taxi for a match or event at Trent Bridge or the City Ground?",
        a: "Yes. Pre-book your outward and return journeys, because roads and pickup points are busy before and after games. Give us a time that allows for the crowds.",
      },
      {
        q: "Do you cover all of West Bridgford?",
        a: "Yes. We pick up across West Bridgford, including neighbouring Edwalton, and take you anywhere in Nottingham and beyond.",
      },
    ],
  },

  Wollaton: {
    area: "Wollaton",
    slug: "taxi-wollaton",
    intro: [
      "Wollaton is a leafy suburb west of Nottingham city centre, best known for Wollaton Hall and Deer Park. Cloud Cars runs pre-booked taxis from Wollaton for everyday journeys, airport transfers and business travel.",
      "Your fare is fixed when you book, so you know what you will pay before you set off. Our drivers are DBS-checked and licensed, and we are available around the clock for early starts and late returns.",
    ],
    journeysHeading: "Popular journeys from Wollaton",
    journeys: [
      {
        title: "Wollaton Hall and Deer Park",
        text: "Days out and events at the Hall and the park. Book your return in advance for busy weekends.",
      },
      {
        title: "Beeston station",
        text: "A short run to Beeston railway station for rail connections. Book ahead for early trains.",
        href: "/train-airport-transfer-policy",
        hrefLabel: "How early to book for trains and flights",
      },
      {
        title: "University of Nottingham and the QMC",
        text: "University Park and the Queen's Medical Centre, for students, staff, patients and visitors.",
      },
      {
        title: "East Midlands Airport",
        text: "A fixed-fare transfer with flight tracking for arrivals when you give us your flight number.",
        href: "/nottingham-to-east-midlands-airport",
        hrefLabel: "Nottingham to East Midlands Airport",
      },
      {
        title: "Nottingham city centre",
        text: "Shopping, appointments, evenings out and connections from Nottingham station.",
      },
    ],
    nearby: ["Beeston", "West Bridgford"],
    faqs: [
      {
        q: "Can you collect from Wollaton Hall and Deer Park?",
        a: "Yes. Pre-book a pickup from the Hall or the park and tell us exactly where to meet your driver. For busy weekends and events, booking your return in advance is best.",
      },
      {
        q: "Do you cover Wollaton Village and the surrounding roads?",
        a: "Yes. We pick up right across Wollaton and take you anywhere in Nottingham and beyond.",
      },
    ],
  },

  Edwalton: {
    area: "Edwalton",
    slug: "taxi-edwalton",
    intro: [
      "Edwalton is a residential village on the southern edge of West Bridgford, in the Rushcliffe area. Cloud Cars runs pre-booked taxis from Edwalton for everyday journeys, airport transfers and business travel.",
      "Your fare is fixed when you book, so you know what you will pay before you set off. We are available around the clock, so an early flight or a late return home is no problem.",
    ],
    journeysHeading: "Popular journeys from Edwalton",
    journeys: [
      {
        title: "West Bridgford and Trent Bridge",
        text: "Local trips into West Bridgford, and to Trent Bridge for cricket and events. Book your return in advance on busy days.",
      },
      {
        title: "Nottingham city centre and station",
        text: "Work, shopping, appointments and rail connections from Nottingham station.",
      },
      {
        title: "East Midlands Airport",
        text: "A fixed-fare transfer, with flight tracking for arrivals when you give us your flight number.",
        href: "/nottingham-to-east-midlands-airport",
        hrefLabel: "Nottingham to East Midlands Airport",
      },
      {
        title: "Birmingham, Manchester and Heathrow",
        text: "Longer airport journeys with a fixed fare agreed at booking and airport fees built in.",
        href: "/airport-transfers-nottingham",
        hrefLabel: "Airport transfers from Nottingham",
      },
      {
        title: "Local venues",
        text: "Golf clubs, restaurants and evenings out around Edwalton and West Bridgford, booked in advance.",
      },
    ],
    nearby: ["West Bridgford", "Wollaton", "Beeston"],
    faqs: [
      {
        q: "Do you cover Edwalton as well as West Bridgford?",
        a: "Yes. We pick up in Edwalton and across West Bridgford, and take you anywhere in Nottingham and beyond.",
      },
      {
        q: "Can I book an early-morning airport taxi from Edwalton?",
        a: "Yes. We run 24 hours a day, so early flights are fine. Pre-book the evening before, or as far ahead as you like, and your fixed fare is confirmed when you book.",
      },
    ],
  },
};

/** FAQs shown on every area page, with the area name filled in. */
export function sharedAreaFaqs(area: string, emaFrom: string): AreaFaq[] {
  return [
    {
      q: `Can I book a taxi in ${area} in advance?`,
      a: `Yes. Book online, through the app or by phone on 0115 8 244 244. Your fixed fare is confirmed at the time of booking, before you travel.`,
    },
    {
      q: `How much is a taxi from ${area} to East Midlands Airport?`,
      a: `Our East Midlands Airport fares start ${emaFrom.toLowerCase()}. Enter your ${area} pickup when you book to see your fixed fare, with airport fees built in.`,
    },
  ];
}
