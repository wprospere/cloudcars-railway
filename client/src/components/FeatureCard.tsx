export default function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">

      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-muted-foreground">
        {text}
      </p>

    </div>
  );
}