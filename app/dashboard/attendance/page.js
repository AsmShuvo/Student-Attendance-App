"use client";

import GradeSelect from "@/app/_component/GradeSelect";
import MonthSelection from "@/app/_component/MonthSelection";
import GlobalApi from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useState } from "react";
import AttendanceGrid from "./_components/AttendanceGrid";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGrade, setSelectedGrade] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);

  const onSearchHandler = async () => {
    if (!selectedMonth || !selectedGrade) {
      alert("Please select both month and grade");
      return;
    }

    const month = moment(selectedMonth).startOf("month").format("YYYY-MM-DD");

    const res = await GlobalApi.GetAttendaceList(selectedGrade, month);

    // Should only return students from selected grade
    setAttendanceList(res.data || []);
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Attendance</h2>

      {/* Search Filters */}
      <div className="flex gap-4 p-4 my-5 border shadow-md rounded-lg">

        <div className="flex gap-2 items-center">
          <label className="text-black">Select Month</label>
          <MonthSelection selectedMonth={setSelectedMonth} />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-black">Select Grade</label>
          <GradeSelect selectedGrade={setSelectedGrade} />
        </div>

        <Button onClick={onSearchHandler}>Search</Button>
      </div>

      {/* Show grid ONLY after grade+month selected */}
      {selectedGrade && selectedMonth ? (
        <AttendanceGrid
          attendanceList={attendanceList}
          selectedMonth={selectedMonth}
        />
      ) : (
        <p className="text-gray-400">Select month & grade to load students.</p>
      )}
    </div>
  );
}

export default Attendance;
