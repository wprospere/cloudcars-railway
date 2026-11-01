// Past Professional Driver QSi Awards. Every entry comes from Professional
// Driver's own "Roll of Honour" (prodrivermags.com/qsi-awards/qsi-results-2019/),
// which lists Cloud Cars, Nottingham for each of these. The 2013 awards are
// also reported at meetinnottingham.co.uk/great-success-of-cloud-cars-ltd/.
//
// These are text-only badges on purpose. The official QSi logo belongs to
// Professional Driver, so it is not used here without their permission, and
// the logo they host today is branded "2027", not the artwork of these awards.
// Do not add medals, logos, sponsors or further awards without a source.

type Medal = "Silver" | "Bronze";

type Award = { medal: Medal; category: string };

// Word joiners and a no-break space keep "(1–80 vehicles)" together on phones.
const PRIVATE_HIRE = "Private Hire Company of the Year (1⁠–⁠80 vehicles)";
const ENVIRONMENTAL = "Environmental Award";

const awardsByYear: { year: number; awards: Award[] }[] = [
  {
    year: 2013,
    awards: [
      { medal: "Silver", category: PRIVATE_HIRE },
      { medal: "Bronze", category: ENVIRONMENTAL },
    ],
  },
  {
    year: 2016,
    awards: [
      { medal: "Bronze", category: PRIVATE_HIRE },
      { medal: "Bronze", category: ENVIRONMENTAL },
    ],
  },
  {
    year: 2017,
    awards: [{ medal: "Bronze", category: ENVIRONMENTAL }],
  },
];

const medalStyles: Record<Medal, string> = {
  Silver: "bg-[#eceff3] text-[#4b5563] ring-[#c9cfd8]",
  Bronze: "bg-[#f6ece2] text-[#8a5226] ring-[#e1c3a5]",
};

const numberWords: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
};

export default function Awards() {
  const total = awardsByYear.reduce((n, y) => n + y.awards.length, 0);

  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      className="section-light bg-background py-20 lg:py-28"
    >
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Past awards
          </span>

          <h2
            id="awards-heading"
            className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Industry recognition,{" "}
            <span className="text-gradient-green whitespace-nowrap font-['Playfair_Display',serif] italic">
              2013 to 2017
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Between 2013 and 2017 Cloud Cars won {numberWords[total] ?? total}{" "}
            medals at the
            Professional Driver QSi Awards, the awards for Quality, Service and
            Innovation in the private hire, taxi and chauffeur industry. These
            are past results, not current awards.
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {awardsByYear.map(({ year, awards }) => (
            <li
              key={year}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 flex items-baseline justify-between gap-3 border-b border-border pb-4">
                <span className="text-4xl font-bold text-foreground">
                  {year}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Past award{awards.length > 1 ? "s" : ""}
                </span>
              </div>

              <ul className="space-y-4">
                {awards.map((award) => (
                  <li key={award.category} className="flex flex-col gap-2">
                    <span
                      className={`w-fit rounded-md px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${medalStyles[award.medal]}`}
                    >
                      {award.medal}
                    </span>
                    <span className="font-medium leading-snug text-foreground">
                      {award.category}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
          Results as published by Professional Driver magazine, which runs the
          QSi Awards. Shown here as a record of past results only. Sources:{" "}
          <a
            href="https://www.prodrivermags.com/qsi-awards/qsi-results-2019/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            QSi Awards roll of honour
          </a>{" "}
          and{" "}
          <a
            href="https://meetinnottingham.co.uk/great-success-of-cloud-cars-ltd/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Meet in Nottingham (2013 awards)
          </a>
          .
        </p>
      </div>
    </section>
  );
}
