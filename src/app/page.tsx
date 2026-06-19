"use client";
import { useState, useMemo } from "react";
import { useGtalkData } from "@/hooks/useGtalkData";
import {
  computeMetrics, buildTrendData, buildDivisionData, buildDrillData,
  applyFilters, fmtNumber, fmtPct,
} from "@/lib/dataUtils";
import type { DrillLevel } from "@/lib/dataUtils";

import Sidebar from "@/components/Sidebar";
import KpiCards from "@/components/KpiCards";
import TrendChart from "@/components/TrendChart";
import DivisionChart from "@/components/DivisionChart";

import DrillDownTable from "@/components/DrillDownTable";

export default function DashboardPage() {
  const { employees, activeByDate, allDates, loading, error, reload } = useGtalkData();

  // ─── Filter state ─────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [drillLevel, setDrillLevel] = useState<DrillLevel>("division_name");

  // Default to last date once loaded
  const effectiveDate = selectedDate || (allDates.length ? allDates[allDates.length - 1] : "");
  const currIdx = allDates.indexOf(effectiveDate);
  const prevDate = currIdx > 0 ? allDates[currIdx - 1] : null;
  const firstDate = allDates[0] ?? null;

  // ─── Filtered employees ───────────────────────────────────────────────────
  const filteredEmployees = useMemo(
    () => applyFilters(employees, { divisions: selectedDivisions, departments: selectedDepartments, sections: selectedSections, teams: selectedTeams }),
    [employees, selectedDivisions, selectedDepartments, selectedSections, selectedTeams]
  );

  // ─── Metrics ──────────────────────────────────────────────────────────────
  const currMetrics = useMemo(() => computeMetrics(effectiveDate, filteredEmployees, activeByDate), [effectiveDate, filteredEmployees, activeByDate]);
  const prevMetrics = useMemo(() => computeMetrics(prevDate, filteredEmployees, activeByDate), [prevDate, filteredEmployees, activeByDate]);
  const firstMetrics = useMemo(() => computeMetrics(firstDate, filteredEmployees, activeByDate), [firstDate, filteredEmployees, activeByDate]);

  // ─── Trend ────────────────────────────────────────────────────────────────
  const trendData = useMemo(() => buildTrendData(allDates, filteredEmployees, activeByDate), [allDates, filteredEmployees, activeByDate]);

  // ─── Division breakdown ───────────────────────────────────────────────────
  const divisionData = useMemo(
    () => buildDivisionData(filteredEmployees, effectiveDate, prevDate, activeByDate, "division_name"),
    [filteredEmployees, effectiveDate, prevDate, activeByDate]
  );

  // ─── Drill-down ───────────────────────────────────────────────────────────
  const drillData = useMemo(
    () => buildDrillData(filteredEmployees, effectiveDate, prevDate, activeByDate, drillLevel),
    [filteredEmployees, effectiveDate, prevDate, activeByDate, drillLevel]
  );



  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="layout">
      <div className="main">
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Đang tải dữ liệu từ Google Sheets…</p>
          <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Vui lòng đảm bảo Google Sheet đã được share "Anyone with link"</p>
        </div>
      </div>
    </div>
  );

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="layout">
      <div className="main">
        <div className="content">
          <div className="error-box">
            <p><strong>Không thể tải dữ liệu</strong></p>
            <p>{error}</p>
            <p style={{ marginTop: 10 }}>
              Hướng dẫn: Mở Google Sheet → <strong>Chia sẻ</strong> → Chọn{" "}
              <strong>"Bất kỳ ai có đường liên kết"</strong> → <strong>Người xem</strong>
            </p>
            <button className="sidebar-reload-btn" style={{ marginTop: 14, maxWidth: 200 }} onClick={reload}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const now = new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="layout">
      <Sidebar
        allDates={allDates}
        employees={employees}
        selectedDate={effectiveDate}
        selectedDivisions={selectedDivisions}
        selectedDepartments={selectedDepartments}
        selectedSections={selectedSections}
        selectedTeams={selectedTeams}
        onDateChange={setSelectedDate}
        onDivisionsChange={setSelectedDivisions}
        onDepartmentsChange={setSelectedDepartments}
        onSectionsChange={setSelectedSections}
        onTeamsChange={setSelectedTeams}
        onReload={reload}
        loading={loading}
      />

      <div className="main">
        {/* Header */}
        <header className="report-header">
          <div>
            <h1>Daily Active User - DAU</h1>
            <div className="header-sub">
              Báo cáo tỷ lệ Active User · Ngày:{" "}
              <strong>{effectiveDate}</strong> · Đã active:{" "}
              <strong>{fmtNumber(currMetrics.activeCount)}/{fmtNumber(currMetrics.totalHc)}</strong> ·
              Tỷ lệ: <strong>{fmtPct(currMetrics.pct)}</strong>
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Cập nhật: {now}</div>
        </header>

        {/* Content */}
        <div className="content">
          {/* 1. KPI Cards */}
          <KpiCards
            curr={currMetrics}
            prev={prevMetrics}
            first={firstMetrics}
            selectedDate={effectiveDate}
            prevDate={prevDate}
          />

          {/* 2. Trend */}
          <TrendChart data={trendData} />

          {/* 3. Division */}
          <DivisionChart data={divisionData} selectedDate={effectiveDate} prevDate={prevDate} />

          {/* 4. Drill-down table */}
          <DrillDownTable
            data={drillData}
            level={drillLevel}
            onLevelChange={(l) => setDrillLevel(l as DrillLevel)}
          />

          {/* Footer */}
          <div className="report-footer">
            Data source: <b>[DAU] User Tracking</b> · Developed by <b>EX Team</b> · {now}
          </div>
        </div>
      </div>
    </div>
  );
}
