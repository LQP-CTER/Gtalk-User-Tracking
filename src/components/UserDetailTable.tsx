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
            placeholder="Tìm theo ID, Tên, Phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(15, 23, 42, 0.13)",
              fontSize: "0.85rem",
              width: "250px",
              fontFamily: "'Inter', sans-serif"
            }}
          />
        </div>
      </div>
      
      <div className="section-msg">
        Tổng số: <strong>{fmtNumber(activeEmployees.length)}</strong> user active 
        {searchTerm && " (trong kết quả tìm kiếm)"}
      </div>

      <div style={{ overflowX: "auto", maxHeight: "600px" }}>
        <table className="data-table">
          <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
            <tr>
              <th>ID Nhân viên</th>
              <th>Họ và Tên</th>
              <th>Job Title</th>
              <th>Section</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {activeEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  Không tìm thấy user nào
                </td>
              </tr>
            ) : (
              activeEmployees.map((e) => (
                <tr key={e.employee_id}>
                  <td>{e.employee_id}</td>
                  <td style={{ fontWeight: 500 }}>{e.employee_name}</td>
                  <td>{e.jobtitle_name_vn || e.jobtitle_name || "-"}</td>
                  <td>{e.section_name}</td>
                  <td>{e.department_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
