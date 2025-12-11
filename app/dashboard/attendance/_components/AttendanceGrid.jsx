"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import moment from "moment";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

const pagination = true;
const paginationPageSize = 500;
const paginationPageSizeSelector = [25, 50, 100];

function AttendanceGrid({ attendanceList = [], selectedMonth }) {
  const [rowData, setRowData] = useState([]);

  // ---- days in selected month ----
  const daysArray = useMemo(() => {
    if (!selectedMonth) return [];

    const m = moment(selectedMonth);
    const year = m.year(); // number
    const monthIndex = m.month(); // 0–11

    const numDays = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [selectedMonth]);

  // ---- columns: StudentId, Name, 1..N ----
  const colDefs = useMemo(
    () => [
      { field: "studentId", headerName: "Student Id" },
      { field: "name", headerName: "Name", filter: true },
      ...daysArray.map((day) => ({
        field: day.toString(),
        headerName: day.toString(),
        width: 50,
        editable: true,
        cellDataType: "boolean",
      })),
    ],
    [daysArray]
  );

  // ---- check if student is present on given day in selectedMonth ----
  const isPresent = (stId, day) => {
    if (!selectedMonth) return false;

    return attendanceList.some((item) => {
      if (!item.date) return false; // skip nulls from left join

      return (
        Number(item.studentId) === Number(stId) &&
        Number(item.day) === Number(day) &&
        moment(item.date).isSame(selectedMonth, "month") // only same month
      );
    });
  };

  // ---- build one row per student ----
  const getRows = () => {
    const byStudent = new Map(); // id -> { studentId, name }

    attendanceList.forEach((rec) => {
      const sid = rec.studentId;
      if (!sid) return;

      if (!byStudent.has(sid)) {
        byStudent.set(sid, {
          studentId: sid,
          name: rec.name,
        });
      }
    });

    // Map -> array + attach day booleans
    const rows = Array.from(byStudent.values());
    return rows.map((row) => {
      const r = { ...row };
      daysArray.forEach((day) => {
        r[day] = isPresent(row.studentId, day);
      });
      return r;
    });
  };

  // recompute grid data when list or month changes
  useEffect(() => {
    if (!attendanceList || !selectedMonth) {
      setRowData([]);
      return;
    }
    setRowData(getRows());
  }, [attendanceList, selectedMonth, daysArray]);

  // ---- save on edit ----
  const onMarkAttendace = (dayField, studentId, newValue) => {
    const day = parseInt(dayField, 10);
    if (Number.isNaN(day) || !selectedMonth) return;

    // robust boolean parsing
    const present =
      newValue === true ||
      newValue === "true" ||
      newValue === 1 ||
      newValue === "1";

    const date = moment(selectedMonth).date(day).format("YYYY-MM-DD");

    if (present) {
      const data = { day, studentId, present, date };
      GlobalApi.MarkAttendance(data)
        .then((res) => {
          console.log(res);
          toast(`Student id: ${studentId} marked as present`);
        })
        .catch((err) => {
          console.error(err);
          toast("Failed to mark present");
        });
    } else {
      GlobalApi.MarkAbsent(studentId, day, date)
        .then((res) => {
          console.log(res);
          toast(`Student id: ${studentId} marked as absent`);
        })
        .catch((err) => {
          console.error(err);
          toast("Failed to mark absent");
        });
    }
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        onCellValueChanged={(e) =>
          onMarkAttendace(e.colDef.field, e.data.studentId, e.newValue)
        }
      />
    </div>
  );
}

export default AttendanceGrid;
