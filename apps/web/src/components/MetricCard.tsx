type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "gold" | "blue" | "slate" | "red";
};

export function MetricCard({ label, value, detail, tone = "gold" }: MetricCardProps) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
