"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { DivisionRow } from "@/types";

interface WaterfallChartProps {
  data: DivisionRow[];
  selectedDate: string;
  prevDate: string | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      <span style={{ color: v >= 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
        {v >= 0 ? "+" : ""}{v?.toLocaleString("vi-VN")} user
      </span>
    </div>
  );
};

export default function WaterfallChart({ data, selectedDate, prevDate }: WaterfallChartProps) {
  const changed = data.filter((r) => r.deltaAbs !== 0).sort((a, b) => b.deltaAbs - a.deltaAbs);
  if (!changed.length || !prevDate) return (
    <div className="section">
      <div className="section-title">Waterfall: Thay Đổi Số Lượng Nhắn Tin</div>
      <div className="section-msg" style={{ textAlign: "center", padding: "30px 0" }}>Chưa có kỳ trước để so sánh</div>
    </div>
  );

  const totalDelta = changed.reduce((s, r) => s + r.deltaAbs, 0);

  return (
    <div className="section">
      <div className="section-title">Waterfall: Thay Đổi Số Lượng Nhắn Tin</div>
      <div className="section-msg">
        Tổng thay đổi: <strong style={{ color: totalDelta >= 0 ? "#16a34a" : "#dc2626" }}>
          {totalDelta >= 0 ? "+" : ""}{totalDelta.toLocaleString("vi-VN")} user
        </strong> từ {prevDate} → {selectedDate}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={changed} margin={{ top: 20, right: 20, bottom: 50, left: 10 }}>
          <CartesianGrid strokeDasharray="" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9, fill: "#666" }}
            angle={-35}
            textAnchor="end"
            height={65}
            tickFormatter={(v) => v.length > 18 ? v.slice(0, 18) + "…" : v}
          />
          <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => v.toLocaleString("vi-VN")} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#999" strokeWidth={1} />
          <Bar dataKey="deltaAbs" maxBarSize={45} radius={[2, 2, 0, 0]}
            label={{ position: "top", formatter: (v: any) => `${v > 0 ? "+" : ""}${v}`, style: { fontSize: 9, fill: "#333" } }}>
            {changed.map((r, i) => (
              <Cell key={i} fill={r.deltaAbs >= 0 ? "#16a34a" : "#dc2626"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
