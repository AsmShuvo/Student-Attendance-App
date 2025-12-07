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
  const [selectedGrade, setSelectedGrade] = useState();
  const [attendanceList, setAttendanceList] = useState();
  const onSearchHandler = () => {
    // console.log(selectedMonth, selectedGrade);
    const month = moment(selectedMonth).startOf("month").format("YYYY-MM-DD");

    // console.log("Month ", month);
    // console.log("Selected month ", selectedMonth);
    // console.log("Grade ", selectedGrade);

    // GlobalApi.GetAttendaceList(selectedGrade, month).then((res) => {
    //   console.log("fetched students: ", res.data);
    //   // extract month & year from selected month
    //   const selectedMonthNum = moment(selectedMonth).month(); // 0-11
    //   const selectedYear = moment(selectedMonth).year();
    //   console.log("Extracted data: ", selectedMonthNum + " " + selectedYear);
    //   // filter selected months from data
    //   const filtered = data.filter((item) => {
    //     if (!item.date) return false; // ignore nulls
    //     const date = moment(item.date); // parse date from DB

    //     return (
    //       date.month() === selectedMonthNum && date.year() === selectedYear
    //     );
    //   });
    // });
    GlobalApi.GetAttendaceList(selectedGrade, month).then((res) => {
      const filtered = res.data.filter((d) => {
        if (!d.date) return true; // include students with no attendance
        return moment(d.date).isSame(selectedMonth, "month");
      });
      // console.log("Filtered students:", filtered);
      setAttendanceList(filtered);
    });
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
      <AttendanceGrid attendanceList={attendanceList} />
    </div>
  );
}

export default Attendance;
