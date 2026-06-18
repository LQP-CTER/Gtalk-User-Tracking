"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { DivisionRow } from "@/types";

interface TopBottomChartProps {
  data: DivisionRow[]; // already sorted desc by pctCurr
}

export default function TopBottomChart({ data }: TopBottomChartProps) {
  if (data.length < 2) return (
    <div className="section">
      <div className="section-title">Top & Bottom Performers</div>
      <div className="section-msg">Cần ít nhất 2 khối để so sánh</div>
    </div>
  );

  const top5 = data.slice(0, Math.min(5, Math.ceil(data.length / 2)));
  const bottom5 = data.slice(Math.max(0, data.length - Math.min(5, Math.floor(data.length / 2))));
  const topNames = new Set(top5.map((r) => r.name));

  // Combine: bottom first (ascending), then top (ascending)
  const combined = [
    ...bottom5.filter((r) => !topNames.has(r.name)).sort((a, b) => a.pctCurr - b.pctCurr),
    ...top5.sort((a, b) => a.pctCurr - b.pctCurr),
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const isTop = topNames.has(label);
    return (
      <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <span style={{ color: isTop ? "#1a1a1a" : "#888" }}>
          {isTop ? "⭐ Top" : "⚠ Bottom"}: <strong>{payload[0].value.toFixed(1)}%</strong>
        </span>
      </div>
    );
  };

  return (
    <div className="section">
      <div className="section-title">Top & Bottom Performers</div>
      <div className="section-msg">Top {top5.length} và Bottom {bottom5.filter((r) => !topNames.has(r.name)).length} khối theo tỷ lệ nhắn tin</div>
      <ResponsiveContainer width="100%" height={Math.max(260, combined.length * 44)}>
        <BarChart
          layout="vertical"
          data={combined}
          margin={{ top: 5, right: 70, bottom: 5, left: 160 }}
        >
          <CartesianGrid horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#555" }} width={155} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="pctCurr" maxBarSize={14} radius={[0, 2, 2, 0]}
            label={{ position: "right", formatter: (v: any) => `${v.toFixed(1)}%`, style: { fontSize: 9, fill: "#333" } }}>
            {combined.map((r, i) => (
              <Cell key={i} fill={topNames.has(r.name) ? "#1a1a1a" : "#cccccc"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
