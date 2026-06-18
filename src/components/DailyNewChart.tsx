"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { TrendPoint } from "@/types";

interface DailyNewChartProps {
  data: TrendPoint[];
}

export default function DailyNewChart({ data }: DailyNewChartProps) {
  if (data.length < 2) return null;
  const daily = data.slice(1); // skip first (no prev)
  const avg = daily.reduce((s, d) => s + d.newUsers, 0) / daily.length;
  const max = daily.reduce((m, d) => d.newUsers > m.newUsers ? d : m, daily[0]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const v = payload[0]?.value;
    return (
      <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        User mới: <strong>{v?.toLocaleString("vi-VN")}</strong>
        {v >= avg && <span style={{ color: "#16a34a", marginLeft: 8 }}>▲ trên TB</span>}
      </div>
    );
  };

  return (
    <div className="section">
      <div className="section-title">User Mới Theo Kỳ (Daily Net Additions)</div>
      <div className="section-msg">
        Trung bình: <strong>{Math.round(avg).toLocaleString("vi-VN")}</strong> user mới/kỳ ·
        Cao nhất: <strong>{max.newUsers.toLocaleString("vi-VN")}</strong> user ({max.date})
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={daily} margin={{ top: 20, right: 20, bottom: 40, left: 10 }}>
          <CartesianGrid strokeDasharray="" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} angle={-35} textAnchor="end" height={55} />
          <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => v.toLocaleString("vi-VN")} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg} stroke="#2563eb" strokeDasharray="5 3" strokeWidth={1.5}
            label={{ value: `TB: ${Math.round(avg)}`, position: "right", style: { fontSize: 9, fill: "#2563eb" } }} />
          <Bar dataKey="newUsers" maxBarSize={45} radius={[2, 2, 0, 0]}
            label={{ position: "top", formatter: (v: number) => v > 0 ? v.toLocaleString("vi-VN") : "", style: { fontSize: 9, fill: "#333" } }}>
            {daily.map((d, i) => (
              <Cell key={i} fill={d.newUsers >= avg ? "#1a1a1a" : "#cccccc"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
