"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import MonthSelection from "../_component/MonthSelection";
import GradeSelect from "../_component/GradeSelect";
import GlobalApi from "../_services/GlobalApi";
import moment from "moment";
import StatusList from "./_components/StatusList";

function Dashboard() {
  const { setTheme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    if (!selectedMonth || !selectedGrade) return;

    const dateForApi = moment(selectedMonth).format("YYYY-MM-DD");

    GlobalApi.GetAttendaceList(selectedGrade, dateForApi)
      .then((res) => {
        // API returns all attendance for this grade (all dates)
        setAttendanceList(res.data || []);
      })
      .catch((err) => {
        console.error("Error loading attendance", err);
        setAttendanceList([]);
      });
  }, [selectedMonth, selectedGrade]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header + filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Attendance Analytics
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View monthly and yearly attendance performance for each grade.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MonthSelection selectedMonth={setSelectedMonth} />
            <GradeSelect selectedGrade={setSelectedGrade} />
          </div>
        </div>

        {/* Analytics (monthly + yearly) */}
        <StatusList
          attendanceList={attendanceList}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
}

export default Dashboard;
