"use client";
import { Metrics } from "@/types";
import { fmtNumber, fmtPct, fmtDelta } from "@/lib/dataUtils";

interface KpiCardsProps {
  curr: Metrics;
  prev: Metrics;
  first: Metrics;
  selectedDate: string;
  prevDate: string | null;
}

export default function KpiCards({ curr, prev, first, selectedDate, prevDate }: KpiCardsProps) {
  const deltaActive = curr.activeCount - prev.activeCount;
  const deltaPct = curr.pct - prev.pct;
  const cumulativeGrowth = curr.pct - first.pct;

  const dActive = fmtDelta(deltaActive);
  const dPct = fmtDelta(deltaPct, true);

  return (
    <div className="kpi-grid">
      {/* Total HC */}
      <div className="kpi-card">
        <div className="kpi-label">Tổng Nhân Sự</div>
        <div className="kpi-value">{fmtNumber(curr.totalHc)}</div>
        <div className="kpi-sub">Tổng headcount trong biên chế</div>
      </div>

      {/* Active */}
      <div className="kpi-card green">
        <div className="kpi-label">Đã Nhắn Tin</div>
        <div className="kpi-value">{fmtNumber(curr.activeCount)}</div>
        <div className="kpi-sub">
          Có nhắn tin trên Gtalk ·{" "}
          <span className={dActive.cls}>{dActive.text}</span>{" "}
          {prevDate ? `so với ${prevDate}` : ""}
        </div>
      </div>

      {/* Not yet */}
      <div className="kpi-card red">
        <div className="kpi-label">Chưa Nhắn Tin</div>
        <div className="kpi-value">{fmtNumber(curr.inactiveCount)}</div>
        <div className="kpi-sub">Chưa nhắn tin trên Gtalk ngày {selectedDate}</div>
      </div>

      {/* % */}
      <div className="kpi-card blue">
        <div className="kpi-label">Tỷ Lệ Nhắn Tin</div>
        <div className="kpi-value">{fmtPct(curr.pct)}</div>
        <div className="kpi-sub">
          Kỳ trước:{" "}
          <span className={dPct.cls}>{dPct.text}</span>
          {" "} · Tích lũy:{" "}
          <span className={cumulativeGrowth >= 0 ? "pos" : "neg"}>
            {cumulativeGrowth >= 0 ? "+" : ""}{cumulativeGrowth.toFixed(1)}pp
          </span>
        </div>
      </div>
    </div>
  );
}
