"use client";

import { getUniqueRecord } from "@/app/_services/services";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  TrendingUp,
  CalendarCheck2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#ef4444"]; // present, absent
const MONTH_SHORT = moment.monthsShort();

function StatusList({ attendanceList = [], selectedMonth }) {
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(() => moment().year());

  // unique students, based on grade
  const uniqueStudents = useMemo(
    () => getUniqueRecord(attendanceList),
    [attendanceList]
  );

  // years available in attendance data
  const availableYears = useMemo(() => {
    const years = new Set();
    attendanceList.forEach((row) => {
      if (row.date) {
        years.add(moment(row.date).year());
      }
    });
    const arr = Array.from(years).sort();
    return arr.length ? arr : [selectedYear];
  }, [attendanceList, selectedYear]);

  // when month changes, default year to that month’s year
  useEffect(() => {
    if (selectedMonth) {
      const yearFromMonth = moment(selectedMonth).year();
      setSelectedYear(yearFromMonth);
    }
  }, [selectedMonth]);

  // compute monthly + yearly stats
  useEffect(() => {
    if (!attendanceList.length) {
      setMonthlyStats(null);
      setYearlyData([]);
      return;
    }

    const studentCount = uniqueStudents.length || 0;

    // ----- Monthly stats (only if month selected) -----
    if (selectedMonth) {
      const mCurrent = moment(selectedMonth).startOf("month");
      const mPrev = mCurrent.clone().subtract(1, "month");

      const computeMonthStats = (monthMoment) => {
        const daysInMonth = monthMoment.daysInMonth();

        const presentRows = attendanceList.filter(
          (row) =>
            row.present === true &&
            row.date &&
            moment(row.date).isSame(monthMoment, "month")
        );

        const presentCount = presentRows.length;
        const possible = studentCount * daysInMonth;
        const percentage = possible ? (presentCount / possible) * 100 : 0;

        return {
          presentCount,
          percentage,
        };
      };

      const current = computeMonthStats(mCurrent);
      const previous = computeMonthStats(mPrev);

      setMonthlyStats({
        studentCount,
        current,
        previous,
        monthLabel: mCurrent.format("MMMM YYYY"),
        prevLabel: mPrev.format("MMMM YYYY"),
      });
    } else {
      setMonthlyStats(null);
    }

    // ----- Yearly stats for bar chart -----
    const year = selectedYear || moment().year();
    const yearData = [];

    for (let m = 0; m < 12; m++) {
      const monthMoment = moment().year(year).month(m).startOf("month");
      const daysInMonth = monthMoment.daysInMonth();

      const rowsThisMonth = attendanceList.filter(
        (row) =>
          row.date && moment(row.date).isSame(monthMoment, "month")
      );

      const presentRows = rowsThisMonth.filter((r) => r.present === true);
      const presentCount = presentRows.length;

      const totalPossible = studentCount * daysInMonth;
      const absentCount = Math.max(0, totalPossible - presentCount);

      yearData.push({
        month: MONTH_SHORT[m], // "Jan", "Feb", ...
        present: presentCount,
        absent: absentCount,
      });
    }

    setYearlyData(yearData);
  }, [attendanceList, selectedMonth, selectedYear, uniqueStudents]);

  // ---------- UI STARTS HERE ----------

  const monthlySection =
    selectedMonth && monthlyStats ? (
      (() => {
        const { studentCount, current, previous, monthLabel } = monthlyStats;

        const percentDelta = current.percentage - previous.percentage;
        const PercentIcon =
          percentDelta >= 0 ? ArrowUpRight : ArrowDownRight;
        const deltaColor =
          percentDelta >= 0
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-rose-500 dark:text-rose-400";

        return (
          <>
            {/* Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Card 1: Total students */}
              <div className="rounded-2xl bg-violet-100/80 dark:bg-violet-900/40 px-5 py-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-violet-800 dark:text-violet-100">
                    Students
                  </span>
                  <Users className="w-5 h-5 text-violet-700 dark:text-violet-200" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">{studentCount}</p>
                  <p className="text-xs text-violet-900 dark:text-violet-100 mt-1">
                    Total students in selected grade
                  </p>
                </div>
              </div>

              {/* Card 2: Attendance % */}
              <div className="rounded-2xl bg-violet-100/80 dark:bg-violet-900/40 px-5 py-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-violet-800 dark:text-violet-100">
                    Attendance Rate
                  </span>
                  <TrendingUp className="w-5 h-5 text-violet-700 dark:text-violet-200" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-semibold">
                    {current.percentage.toFixed(1)}%
                  </p>
                  <div className={`flex items-center text-xs ${deltaColor}`}>
                    <PercentIcon className="w-3 h-3 mr-1" />
                    {Math.abs(percentDelta).toFixed(1)}%
                  </div>
                </div>
                <p className="mt-2 text-xs text-violet-900 dark:text-violet-100/80">
                  Compared with previous month
                </p>
              </div>

              {/* Card 3: Total presence */}
              <div className="rounded-2xl bg-violet-100/80 dark:bg-violet-900/40 px-5 py-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-violet-800 dark:text-violet-100">
                    Total Presence
                  </span>
                  <CalendarCheck2 className="w-5 h-5 text-violet-700 dark:text-violet-200" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">
                    {current.presentCount}
                  </p>
                  <p className="text-xs text-violet-900 dark:text-violet-100 mt-1">
                    Present entries in {monthLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* Pie chart */}
            <div className="w-full bg-white/80 dark:bg-slate-900/40 rounded-2xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Attendance Breakdown — {monthLabel}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Present",
                          value: current.percentage,
                        },
                        {
                          name: "Absent",
                          value: 100 - current.percentage,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {PIE_COLORS.map((color, idx) => (
                        <Cell key={idx} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        );
      })()
    ) : (
      <div className="w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Select a month and grade to see monthly attendance analytics.
      </div>
    );

  // yearly section is always at the bottom
  const yearlySection = (
    <div className="w-full bg-white/80 dark:bg-slate-900/40 rounded-2xl shadow-sm p-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold">
          Yearly Attendance Overview
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Year:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm bg-transparent dark:bg-slate-900"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {yearlyData && yearlyData.length ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" name="Present" fill="#22c55e" />
              <Bar dataKey="absent" name="Absent" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No attendance data available for {selectedYear}.
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {monthlySection}
      {yearlySection}
    </div>
  );
}

export default StatusList;
