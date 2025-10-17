import { Card } from "@/components/ui/card";

const StatCard = ({ label, value, unit, status = "ok" }) => {
  const statusColors = {
    ok: "text-[hsl(146_64%_52%)]",
    warn: "text-[hsl(38_97%_55%)]",
    danger: "text-[hsl(2_85%_58%)]",
  };

  return (
    <Card
      className="p-4 bg-[hsl(214_24%_12%)] hover:bg-[hsl(214_20%_15%)] border-border transition-colors"
      data-testid="stat-card"
    >
      <div className="space-y-2">
        <div className="text-xs text-[hsl(210_10%_75%)]">{label}</div>
        <div
          className={`text-2xl font-semibold font-[Space_Grotesk] tabular-nums ${statusColors[status]}`}
          data-testid="stat-value"
        >
          {value} <span className="text-sm">{unit}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
