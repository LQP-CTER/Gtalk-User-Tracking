"use client";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendPoint } from "@/types";

interface TrendChartProps {
  data: TrendPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.dataKey === "pct" ? `${p.value.toFixed(1)}%` : p.value.toLocaleString("vi-VN")}</strong>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ data }: TrendChartProps) {
  if (!data.length) return null;

  const msg = data.length >= 2
    ? `Tỷ lệ nhắn tin: ${data[0].pct.toFixed(1)}% → ${data[data.length - 1].pct.toFixed(1)}% (+${(data[data.length - 1].pct - data[0].pct).toFixed(1)}pp) trong ${data.length} kỳ`
    : "";

  return (
    <div className="section">
      <div className="section-title">Xu Hướng Nhắn Tin Theo Thời Gian</div>
      {msg && <div className="section-msg">{msg}</div>}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 10, right: 60, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#888" }}
            angle={-40}
            textAnchor="end"
            height={55}
          />
          {/* Left Y: new users */}
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: "#888" }}
            tickFormatter={(v) => v.toLocaleString("vi-VN")}
            label={{ value: "User mới", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 10, fill: "#aaa" } }}
          />
          {/* Right Y: % */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#888" }}
            tickFormatter={(v) => `${v}%`}
            label={{ value: "% Nhắn tin", angle: 90, position: "insideRight", offset: 10, style: { fontSize: 10, fill: "#aaa" } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }}
            iconType="square"
          />
          <Bar
            yAxisId="left"
            dataKey="newUsers"
            name="User mới"
            fill="#cccccc"
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="right"
            dataKey="pct"
            name="% Nhắn tin"
            type="monotone"
            stroke="#1a1a1a"
            strokeWidth={2.5}
            dot={{ fill: "#1a1a1a", r: 4 }}
            activeDot={{ r: 6 }}
            label={{
              position: "top",
              formatter: (v: any) => `${v.toFixed(1)}%`,
              style: { fontSize: 9, fill: "#333" },
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
