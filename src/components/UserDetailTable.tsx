import React, { useMemo, useState } from "react";
import { Employee } from "@/types";
import { fmtNumber } from "@/lib/dataUtils";

interface UserDetailTableProps {
  employees: Employee[];
  activeSet: Set<number>;
  date: string;
}

export default function UserDetailTable({ employees, activeSet, date }: UserDetailTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const activeEmployees = useMemo(() => {
    const active = employees.filter((e) => activeSet.has(e.employee_id));
    if (!searchTerm) return active;
    
    const lowerSearch = searchTerm.toLowerCase();
    return active.filter((e) => 
      e.employee_name.toLowerCase().includes(lowerSearch) ||
      e.employee_id.toString().includes(lowerSearch) ||
      e.department_name.toLowerCase().includes(lowerSearch) ||
      e.section_name.toLowerCase().includes(lowerSearch)
    );
  }, [employees, activeSet, searchTerm]);

  return (
    <div className="chart-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          Danh sách chi tiết User Active (Ngày {date})
        </div>
        <div>
          <input
            type="text"
            className="modern-search-input"
            placeholder="Tìm theo ID, Tên, Phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="section-msg">
        Tổng số: <strong>{fmtNumber(activeEmployees.length)}</strong> user active 
        {searchTerm && " (trong kết quả tìm kiếm)"}
      </div>

      <div className="modern-table-wrap">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Job Title</th>
              <th>Section</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {activeEmployees.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Không tìm thấy user nào phù hợp.
                </td>
              </tr>
            ) : (
              activeEmployees.map((e) => {
                // Get initials for avatar (e.g. "Nguyen Van A" -> "A")
                const parts = e.employee_name.trim().split(" ");
                const initial = parts.length > 0 ? parts[parts.length - 1][0].toUpperCase() : "U";

                return (
                  <tr key={e.employee_id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-avatar">{initial}</div>
                        <div className="user-info">
                          <span className="user-name">{e.employee_name}</span>
                          <span className="user-id">#{e.employee_id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{e.jobtitle_name_vn || e.jobtitle_name || "-"}</td>
                    <td>{e.section_name}</td>
                    <td>{e.department_name}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
