type StatusPillProps = {
  children: string;
  tone?: "ready" | "active" | "warning" | "danger" | "neutral";
};

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}

