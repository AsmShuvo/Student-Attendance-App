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

    GlobalApi.GetAttendaceList(
      selectedGrade,
      moment(selectedMonth).format("YYYY-MM-DD")
    ).then((res) => {
      setAttendanceList(res.data);
    });
  }, [selectedMonth, selectedGrade]);

  // Used to get student attendace for given month & date

  const getStudentAttendance = () => {
    GlobalApi.GetAttendaceList(
      selectedGrade,
      moment(selectedMonth).format("YYYY-MM-DD")
    ).then((res) => {
      // console.log(res);
      setAttendanceList(res.data);
    });
  };

  return (
    <div className="p-10 flex items-center justify-between">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <div className="flex items-center gap-4">
        <MonthSelection selectedMonth={setSelectedMonth} />
        <GradeSelect selectedGrade={setSelectedGrade} />
      </div>
      <StatusList attendanceList={attendanceList} />
    </div>
  );
}

export default Dashboard;
