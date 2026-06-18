"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendPoint } from "@/types";

interface CumulativeChartProps {
  data: TrendPoint[];
  totalHc: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      Đã nhắn tin: <strong>{payload[0]?.value?.toLocaleString("vi-VN")}</strong>
    </div>
  );
};

export default function CumulativeChart({ data, totalHc }: CumulativeChartProps) {
  return (
    <div className="section">
      <div className="section-title">Tăng Trưởng Tích Lũy</div>
      <div className="section-msg">Số lượng nhắn tin qua từng kỳ báo cáo</div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} angle={-35} textAnchor="end" height={55} />
          <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => v.toLocaleString("vi-VN")} />
          <Tooltip content={<CustomTooltip />} />
          {totalHc > 0 && (
            <ReferenceLine y={totalHc} stroke="#999" strokeDasharray="4 2"
              label={{ value: `HC: ${totalHc.toLocaleString("vi-VN")}`, position: "right", style: { fontSize: 9, fill: "#999" } }} />
          )}
          <Area
            type="monotone"
            dataKey="active"
            stroke="#1a1a1a"
            strokeWidth={2}
            fill="url(#areaGrad)"
            dot={{ fill: "#1a1a1a", r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
