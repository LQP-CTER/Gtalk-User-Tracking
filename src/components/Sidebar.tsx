"use client";
import { Employee } from "@/types";
import { getUniqueValues } from "@/lib/dataUtils";

interface SidebarProps {
  allDates: string[];
  employees: Employee[];
  selectedDate: string;
  selectedDivisions: string[];
  selectedDepartments: string[];
  selectedSections: string[];
  selectedTeams: string[];
  onDateChange: (d: string) => void;
  onDivisionsChange: (v: string[]) => void;
  onDepartmentsChange: (v: string[]) => void;
  onSectionsChange: (v: string[]) => void;
  onTeamsChange: (v: string[]) => void;
  onReload: () => void;
  loading: boolean;
}

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  if (options.length === 0) return <div style={{ fontSize: "0.72rem", color: "#aaa", padding: "6px" }}>{placeholder || "Không có dữ liệu"}</div>;

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]);
  };
  const allSelected = selected.length === 0;

  return (
    <div className="sidebar-multiselect">
      {options.map((opt) => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={opt}>
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function Sidebar({
  allDates, employees,
  selectedDate, selectedDivisions, selectedDepartments, selectedSections, selectedTeams,
  onDateChange, onDivisionsChange, onDepartmentsChange, onSectionsChange, onTeamsChange,
  onReload, loading,
}: SidebarProps) {

  // Cascading filter options
  const filteredByDiv = selectedDivisions.length
    ? employees.filter((e) => selectedDivisions.includes(e.division_name))
    : employees;
  const filteredByDept = selectedDepartments.length
    ? filteredByDiv.filter((e) => selectedDepartments.includes(e.department_name))
    : filteredByDiv;

  const divisionOptions = getUniqueValues(employees, "division_name");
  const departmentOptions = getUniqueValues(filteredByDiv, "department_name");
  const sectionOptions = getUniqueValues(filteredByDept, "section_name");
  const teamOptions = getUniqueValues(
    selectedSections.length ? filteredByDept.filter((e) => selectedSections.includes(e.section_name)) : filteredByDept,
    "team_name"
  );

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="app-title">📊 GTalk Messaging</div>
        <div className="app-sub">Adoption Report · IBCS</div>
      </div>

      <div className="sidebar-body">
        {/* Reload */}
        <button className="sidebar-reload-btn" onClick={onReload} disabled={loading}>
          {loading ? "⏳ Đang tải..." : "🔄 Reload Data"}
        </button>

        {/* Date selector */}
        <div className="sidebar-label">Ngày Báo Cáo</div>
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        >
          {allDates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Division */}
        <div className="sidebar-label">Khối (Division)</div>
        <MultiSelect options={divisionOptions} selected={selectedDivisions} onChange={onDivisionsChange} />

        {/* Department */}
        <div className="sidebar-label">Phòng Ban (Dept)</div>
        <MultiSelect options={departmentOptions} selected={selectedDepartments} onChange={onDepartmentsChange} />

        {/* Section */}
        <div className="sidebar-label">Bộ Phận (Section)</div>
        <MultiSelect options={sectionOptions} selected={selectedSections} onChange={onSectionsChange} />

        {/* Team */}
        <div className="sidebar-label">Team</div>
        <MultiSelect options={teamOptions} selected={selectedTeams} onChange={onTeamsChange} />
      </div>

      {/* Legend */}
      <div className="sidebar-legend">
        <strong style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ký hiệu IBCS</strong>
        <div className="legend-row"><span className="legend-swatch leg-ac" /> Hiện tại (AC)</div>
        <div className="legend-row"><span className="legend-swatch leg-py" /> Kỳ trước (PY)</div>
        <div className="legend-row"><span className="legend-swatch leg-pos" /> Tăng (Δ+)</div>
        <div className="legend-row"><span className="legend-swatch leg-neg" /> Giảm (Δ−)</div>
      </div>
    </aside>
  );
}
