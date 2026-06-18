"use client";
import { useState } from "react";
import { DrillRow } from "@/types";

interface DrillDownTableProps {
  data: DrillRow[];
  level: string;
  onLevelChange: (l: string) => void;
}

const LEVELS = [
  { key: "division_name", label: "Khối (Division)" },
  { key: "department_name", label: "Phòng Ban" },
  { key: "section_name", label: "Bộ Phận" },
  { key: "team_name", label: "Team" },
];

export default function DrillDownTable({ data, level, onLevelChange }: DrillDownTableProps) {
  // Totals
  const totals = data.reduce(
    (acc, r) => ({
      total: acc.total + r.total,
      activeC: acc.activeC + r.activeC,
      activeP: acc.activeP + r.activeP,
      inactive: acc.inactive + r.inactive,
    }),
    { total: 0, activeC: 0, activeP: 0, inactive: 0 }
  );
  const tPct = totals.total > 0 ? (totals.activeC / totals.total) * 100 : 0;
  const tPctP = totals.total > 0 ? (totals.activeP / totals.total) * 100 : 0;
  const tDeltaPct = tPct - tPctP;
  const tDeltaAbs = totals.activeC - totals.activeP;

  return (
    <div className="section">
      <div className="section-title">Chi Tiết Phân Bổ (Drill-Down)</div>
      <div className="drill-selector">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            className={`drill-btn ${level === l.key ? "active" : ""}`}
            onClick={() => onLevelChange(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="section-msg">Không có dữ liệu cho bộ lọc hiện tại.</div>
      ) : (
        <div className="ibcs-table-wrap">
          <table className="ibcs-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}>#</th>
                <th>{LEVELS.find((l) => l.key === level)?.label}</th>
                <th className="num">HC</th>
                <th className="num">Nhắn tin</th>
                <th className="num">Chưa</th>
                <th className="num">% AC</th>
                <th style={{ minWidth: 80 }}></th>
                <th className="num">% PY</th>
                <th className="num">Δ%</th>
                <th className="num">Δ Abs</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => {
                const deltaClass = r.deltaPct > 0 ? "pos" : r.deltaPct < 0 ? "neg" : "neutral";
                const sign = r.deltaPct > 0 ? "+" : "";
                return (
                  <tr key={r.name}>
                    <td className="num" style={{ color: "#bbb", fontSize: "0.7rem" }}>{r.rank}</td>
                    <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.name}>{r.name}</td>
                    <td className="num">{r.total.toLocaleString("vi-VN")}</td>
                    <td className="num">{r.activeC.toLocaleString("vi-VN")}</td>
                    <td className="num" style={{ color: "#888" }}>{r.inactive.toLocaleString("vi-VN")}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.pctC.toFixed(1)}%</td>
                    <td>
                      <div className="mini-bar-bg">
                        <div className="mini-bar-fill" style={{ width: `${Math.min(r.pctC, 100)}%` }} />
                      </div>
                    </td>
                    <td className="num" style={{ color: "#888" }}>{r.pctP.toFixed(1)}%</td>
                    <td className={`num ${deltaClass}`}>{sign}{r.deltaPct.toFixed(1)}pp</td>
                    <td className={`num ${deltaClass}`}>{sign}{r.deltaAbs.toLocaleString("vi-VN")}</td>
                  </tr>
                );
              })}
              {/* Total row */}
              <tr className="total-row">
                <td></td>
                <td><strong>TỔNG CỘNG</strong></td>
                <td className="num">{totals.total.toLocaleString("vi-VN")}</td>
                <td className="num">{totals.activeC.toLocaleString("vi-VN")}</td>
                <td className="num" style={{ color: "#888" }}>{totals.inactive.toLocaleString("vi-VN")}</td>
                <td className="num" style={{ fontWeight: 700 }}>{tPct.toFixed(1)}%</td>
                <td></td>
                <td className="num" style={{ color: "#888" }}>{tPctP.toFixed(1)}%</td>
                <td className={`num ${tDeltaPct > 0 ? "pos" : tDeltaPct < 0 ? "neg" : "neutral"}`}>
                  {tDeltaPct > 0 ? "+" : ""}{tDeltaPct.toFixed(1)}pp
                </td>
                <td className={`num ${tDeltaAbs > 0 ? "pos" : tDeltaAbs < 0 ? "neg" : "neutral"}`}>
                  {tDeltaAbs > 0 ? "+" : ""}{tDeltaAbs.toLocaleString("vi-VN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
