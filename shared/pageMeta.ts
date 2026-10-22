// The title and description of every public page, in one place.
// The server writes these into the HTML it sends (so link previews and crawlers
// that don't run scripts see the right page), and <PageMeta> uses the same
// entries in the browser.

import { EMA_FROM } from "./airportFares";

export const SITE_URL = "https://cloudcarsltd.com";

export type PageMetaEntry = { title: string; description: string };

const areaPage = (area: string, description: string): PageMetaEntry => ({
  title: `Taxi ${area} | Local & Airport Transfers | Cloud Cars`,
  description,
});

export const PAGE_META: Record<string, PageMetaEntry> = {
  "/": {
    title: "Taxi Nottingham | Airport & Corporate Travel | Cloud Cars",
    description:
      "Reliable taxi services in Nottingham from Cloud Cars: airport transfers, executive cars, corporate travel, courier services and pre-booked journeys.",
  },
  "/taxi-nottingham": {
    title: "Taxi Nottingham | 24/7 Local Taxi Service | Cloud Cars",
    description:
      "Book a reliable taxi in Nottingham with Cloud Cars. Local journeys, airport transfers and pre-booked travel with professional drivers and clean vehicles.",
  },
  "/airport-transfers-nottingham": {
    title: "Airport Transfers Nottingham | Fixed Fares | Cloud Cars",
    description:
      "Book reliable airport transfers from Nottingham with Cloud Cars. Fixed quotes to East Midlands, Birmingham, Manchester and Heathrow. 24/7 pre-booked service.",
  },
  "/east-midlands-airport-taxi": {
    title: "East Midlands Airport Taxi | Cloud Cars Nottingham",
    description:
      "Taxi to East Midlands Airport from Nottingham with Cloud Cars. Reliable transfers, fixed prices and professional drivers for early and late flights.",
  },
  "/nottingham-to-east-midlands-airport": {
    title: `Nottingham to East Midlands Airport | ${EMA_FROM} | Cloud Cars`,
    description:
      `Taxi from Nottingham to East Midlands Airport ${EMA_FROM.toLowerCase()}. Reliable 24/7 airport transfers covering Beeston, West Bridgford, Wollaton and Edwalton with Cloud Cars.`,
  },
  "/executive-car-nottingham": {
    title: "Executive Car Service Nottingham | Cloud Cars",
    description:
      "Book an executive car in Nottingham with Cloud Cars. Premium vehicles for business travel, airport transfers and client collections with professional drivers.",
  },
  "/7-seater-taxi-nottingham": {
    title: "7 Seater Taxi Nottingham | Group & Family | Cloud Cars",
    description:
      "Book a 7 seater taxi in Nottingham with Cloud Cars. Ideal for airport transfers, family travel, group bookings, business teams and journeys with extra luggage.",
  },
  "/courier-services-nottingham": {
    title: "Courier Services Nottingham | Same Day Delivery | Cloud Cars",
    description:
      "Reliable same-day courier and parcel delivery in Nottingham with Cloud Cars. Business documents, hospital runs and urgent local deliveries.",
  },
  "/corporate-transport-nottingham": {
    title: "Corporate Transport Nottingham | Cloud Cars",
    description:
      "Dependable corporate transport in Nottingham for staff travel, airport runs and business accounts. Professional drivers and one clear invoice from Cloud Cars.",
  },
  "/taxi-beeston": areaPage(
    "Beeston",
    "Pre-booked taxis from Beeston with Cloud Cars. Fixed fares for the station, University of Nottingham, the QMC and East Midlands Airport. Available 24/7."
  ),
  "/taxi-west-bridgford": areaPage(
    "West Bridgford",
    "Pre-booked taxis from West Bridgford with Cloud Cars. Fixed fares to the city centre, Trent Bridge, East Midlands Airport and beyond. Available 24/7."
  ),
  "/taxi-wollaton": areaPage(
    "Wollaton",
    "Pre-booked taxis from Wollaton with Cloud Cars. Fixed fares for Wollaton Hall, Beeston station, the city centre and East Midlands Airport. Available 24/7."
  ),
  "/taxi-edwalton": areaPage(
    "Edwalton",
    "Pre-booked taxis from Edwalton with Cloud Cars. Fixed fares to West Bridgford, Nottingham, East Midlands Airport and beyond. Available 24/7."
  ),
  "/drive-for-cloud-cars": {
    title: "Drive for Cloud Cars | Private Hire Jobs in Nottingham",
    description:
      "Join Nottingham's local private hire company. Weekly pay, flexible hours and regular airport, corporate and school work. Apply to drive with Cloud Cars today.",
  },
  "/partner-with-cloud-cars": {
    title: "Partner with Cloud Cars | Owner Drivers & Small Fleets",
    description:
      "Run your own car or a small fleet? Partner with Cloud Cars for regular airport, corporate and local work through our booking platform. Apply today.",
  },
  "/faqs": {
    title: "Taxi FAQs | Cloud Cars Nottingham",
    description:
      "Answers to common questions about booking a Cloud Cars taxi in Nottingham: airport transfers, waiting time, cancellations, payment and business accounts.",
  },
  "/terms": {
    title: "Terms & Conditions | Cloud Cars",
    description:
      "Read the Cloud Cars terms and conditions covering account and non-account bookings, waiting time, cancellations, pricing and liability.",
  },
  "/privacy": {
    title: "Privacy Policy | Cloud Cars",
    description:
      "How Cloud Cars collects, uses, stores and protects your personal data, where it is held, how long we keep it and your rights.",
  },
  "/cookies": {
    title: "Cookie Policy | Cloud Cars",
    description:
      "How cloudcarsltd.com uses cookies, which ones are optional, and how to change your cookie choices at any time.",
  },
  "/train-airport-transfer-policy": {
    title: "Train & Airport Transfer Policy | Cloud Cars",
    description:
      "How early to book your Cloud Cars pickup for train and flight departures, and our policy on missed connections.",
  },
};

export function normalisePagePath(p: string) {
  const trimmed = p.length > 1 ? p.replace(/\/+$/, "") : p;
  return trimmed || "/";
}

export function getPageMeta(path: string): PageMetaEntry | undefined {
  return PAGE_META[normalisePagePath(path)];
}
