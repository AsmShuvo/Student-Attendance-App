"use client"

import GradeSelect from "@/app/_component/GradeSelect";
import MonthSelection from "@/app/_component/MonthSelection";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGrade, setSelectedGrade] = useState();
  const onSearchHandler = () => {
    console.log(selectedMonth, selectedGrade);
  };
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Attendance</h2>
      {/* Search Option */}
      <div className="flex gap-4 p-4 my-5 border shadow-md rounded-lg">
        <div className="flex gap-2 items-center">
          <label>Select Month</label>
          <MonthSelection selectedMonth={(val) => setSelectedMonth(val)} />
        </div>
        <div className="flex gap-2 items-center">
          <label>Select Month</label>
          <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
        </div>
        <Button onClick={() => onSearchHandler()}>Search</Button>
      </div>

      {/* Student Attendance Grid */}
    </div>
  );
}

export default Attendance;
