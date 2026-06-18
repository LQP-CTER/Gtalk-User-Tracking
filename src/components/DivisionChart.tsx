"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from "recharts";
import { DivisionRow } from "@/types";

interface DivisionChartProps {
  data: DivisionRow[];
  selectedDate: string;
  prevDate: string | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #ddd", padding: "10px 14px", fontSize: "0.78rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value.toFixed(1)}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function DivisionChart({ data, selectedDate, prevDate }: DivisionChartProps) {
  if (!data.length) return null;

  // Sort ascending for horizontal bar (highest at top)
  const sorted = [...data].sort((a, b) => a.pctCurr - b.pctCurr);

  const top = data[0];
  const bottom = data[data.length - 1];
  const msg = `Cao nhất: ${top?.name} (${top?.pctCurr.toFixed(1)}%) · Thấp nhất: ${bottom?.name} (${bottom?.pctCurr.toFixed(1)}%)`;

  return (
    <div className="section">
      <div className="section-title">Phân Tích Theo Khối (Division)</div>
      <div className="section-msg">{msg}</div>
      <div className="grid-3-2" style={{ alignItems: "start" }}>
        {/* Chart */}
        <div>
          <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 52)}>
            <BarChart
              layout="vertical"
              data={sorted}
              margin={{ top: 5, right: 70, bottom: 5, left: 160 }}
            >
              <CartesianGrid horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#555" }} width={155} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "0.74rem" }} iconType="square" />
              {prevDate && (
                <Bar dataKey="pctPrev" name={`Kỳ trước (${prevDate})`} fill="#cccccc" maxBarSize={12} radius={[0, 2, 2, 0]} />
              )}
              <Bar dataKey="pctCurr" name={`Hiện tại (${selectedDate})`} fill="#1a1a1a" maxBarSize={12} radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="ibcs-table-wrap">
          <table className="ibcs-table">
            <thead>
              <tr>
                <th>Khối</th>
                <th className="num">HC</th>
                <th className="num">Nhắn tin</th>
                <th className="num">%</th>
                <th className="num">Δ%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.name}>
                  <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.name}>{r.name}</td>
                  <td className="num">{r.total.toLocaleString("vi-VN")}</td>
                  <td className="num">{r.activeCurr.toLocaleString("vi-VN")}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{r.pctCurr.toFixed(1)}%</td>
                  <td className={`num ${r.deltaPct > 0 ? "pos" : r.deltaPct < 0 ? "neg" : "neutral"}`}>
                    {r.deltaPct > 0 ? "+" : ""}{r.deltaPct.toFixed(1)}pp
                  </td>
                </tr>
              ))}
              {/* Total row */}
              {(() => {
                const t = data.reduce((acc, r) => ({
                  total: acc.total + r.total,
                  activeCurr: acc.activeCurr + r.activeCurr,
                  activePrev: acc.activePrev + r.activePrev,
                }), { total: 0, activeCurr: 0, activePrev: 0 });
                const pct = t.total > 0 ? (t.activeCurr / t.total) * 100 : 0;
                const pctP = t.total > 0 ? (t.activePrev / t.total) * 100 : 0;
                const d = pct - pctP;
                return (
                  <tr className="total-row">
                    <td><strong>TỔNG</strong></td>
                    <td className="num">{t.total.toLocaleString("vi-VN")}</td>
                    <td className="num">{t.activeCurr.toLocaleString("vi-VN")}</td>
                    <td className="num" style={{ fontWeight: 700 }}>{pct.toFixed(1)}%</td>
                    <td className={`num ${d > 0 ? "pos" : d < 0 ? "neg" : "neutral"}`}>
                      {d > 0 ? "+" : ""}{d.toFixed(1)}pp
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
