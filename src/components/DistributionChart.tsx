"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { DivisionRow } from "@/types";

interface DistributionChartProps {
  data: DivisionRow[]; // department-level data
}

const BUCKETS = [
  { label: "0–25%", color: "#dc2626", min: 0, max: 25 },
  { label: "26–50%", color: "#f97316", min: 26, max: 50 },
  { label: "51–75%", color: "#999", min: 51, max: 75 },
  { label: "76–100%", color: "#1a1a1a", min: 76, max: 101 },
];

export default function DistributionChart({ data }: DistributionChartProps) {
  const meaningful = data.filter((r) => r.total >= 2);
  if (!meaningful.length) return null;

  const bucketData = BUCKETS.map((b) => ({
    ...b,
    count: meaningful.filter((r) => r.pctCurr >= b.min && r.pctCurr < b.max).length,
  }));

  const pcts = meaningful.map((r) => r.pctCurr);
  const avg = pcts.reduce((s, v) => s + v, 0) / pcts.length;
  const sorted = [...pcts].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const std = Math.sqrt(pcts.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / pcts.length);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        Số đơn vị: <strong>{payload[0]?.value}</strong>
      </div>
    );
  };

  return (
    <div className="section">
      <div className="section-title">Phân Bố Tỷ Lệ Nhắn Tin Theo Đơn Vị</div>
      <div className="section-msg">
        Phân bố của {meaningful.length} đơn vị · Median: <strong>{median.toFixed(1)}%</strong> · TB: <strong>{avg.toFixed(1)}%</strong>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 20, alignItems: "start" }}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={bucketData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#666" }} />
            <YAxis tick={{ fontSize: 10, fill: "#888" }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" maxBarSize={70} radius={[3, 3, 0, 0]}
              label={{ position: "top", formatter: (v: any) => v > 0 ? v : "", style: { fontSize: 11, fill: "#333", fontWeight: 600 } }}>
              {bucketData.map((b, i) => (
                <Cell key={i} fill={b.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stats */}
        <div style={{ padding: "16px 0", fontSize: "0.8rem", lineHeight: 2 }}>
          <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#aaa", marginBottom: 8 }}>Thống kê</div>
          <div>Trung bình: <strong>{avg.toFixed(1)}%</strong></div>
          <div>Median: <strong>{median.toFixed(1)}%</strong></div>
          <div>Cao nhất: <strong>{Math.max(...pcts).toFixed(1)}%</strong></div>
          <div>Thấp nhất: <strong>{Math.min(...pcts).toFixed(1)}%</strong></div>
          <div>Std Dev: <strong>{std.toFixed(1)}%</strong></div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #eee" }}>
            <span style={{ color: "#16a34a" }}>≥75%:</span> <strong>{pcts.filter((p) => p >= 75).length}</strong> đơn vị
          </div>
          <div>
            <span style={{ color: "#dc2626" }}>&lt;50%:</span> <strong>{pcts.filter((p) => p < 50).length}</strong> đơn vị
          </div>
        </div>
      </div>
    </div>
  );
}
