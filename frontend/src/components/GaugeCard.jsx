import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

const GaugeCard = ({ label, value = 0, max = 8000, unit = "RPM" }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const data = [{ name: label, value: pct, fill: "hsl(186 100% 53%)" }];

  return (
    <div
      className="p-4 rounded-2xl bg-[hsl(214_24%_12%)] border border-border"
      data-testid="gauge-card"
    >
      <div className="text-xs text-[hsl(210_10%_75%)]">{label}</div>
      <div className="flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            barSize={10}
            data={data}
            startAngle={220}
            endAngle={-40}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background clockWise dataKey="value" cornerRadius="50%" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div
        className="text-3xl font-semibold tracking-tight font-[Space_Grotesk] tabular-nums text-center"
        aria-live="polite"
        data-testid="gauge-value"
      >
        {value.toLocaleString()}{" "}
        <span className="text-xs text-[hsl(210_10%_75%)]">{unit}</span>
      </div>
    </div>
  );
};

export default GaugeCard;
