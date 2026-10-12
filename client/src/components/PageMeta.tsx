import { Helmet } from "react-helmet-async";
import { SITE_URL, getPageMeta } from "@shared/pageMeta";

// Titles and descriptions live in shared/pageMeta.ts, so the server and the
// browser always show the same ones.
export default function PageMeta({
  path,
  noindex = false,
}: {
  path: string;
  noindex?: boolean;
}) {
  const meta = getPageMeta(path);

  return (
    <Helmet>
      {meta ? <title>{meta.title}</title> : null}
      {meta ? <meta name="description" content={meta.description} /> : null}
      <link rel="canonical" href={`${SITE_URL}${path}`} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
    </Helmet>
  );
}
