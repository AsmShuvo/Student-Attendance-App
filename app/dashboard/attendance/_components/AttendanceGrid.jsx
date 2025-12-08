"use client";

import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import moment from "moment";

ModuleRegistry.registerModules([AllCommunityModule]);

function AttendanceGrid({ attendanceList, selectedMonth }) {
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    { field: "studentId" },
    { field: "name" },
  ]);
  const daysInMo = (year, month) => new Date(year, month + 1, 0).getDate();
  const numbOfDays = daysInMo(
    moment(selectedMonth).format("yyyy"),
    moment(selectedMonth).format("MM")
  );

  const daysArray = Array.from({ length: numbOfDays }, (_, i) => i + 1);
  useEffect(() => {
    if (attendanceList) {
      const userList = getUniqueRecord();
      setRowData(userList);
      // console.log(userList);

      daysArray.forEach((date) => {
        // add column for this date
        setColDefs((prevData) => [
          ...prevData,
          { field: date.toString(), width: 50, editable: true },
        ]);

        // fill each row's value for this date
        userList.forEach((obj) => {
          obj[date] = isPresent(obj.studentId, date); // <- removed extra ")"
        });
      });
    }
  }, [attendanceList]);

  const isPresent = (stId, day) => {
    const res = attendanceList.find(
      (item) => item.day == day && item.studentId == stId
    );
    return res ? true : false;
  };

  const getUniqueRecord = () => {
    // get distinc user list
    const uniqueRecord = [];
    const existingUser = new Set();
    attendanceList?.forEach((rec) => {
      if (!existingUser.has(rec.studentId)) {
        existingUser.add(rec.studentId);
        uniqueRecord.push(rec);
      }
    });
    console.log("filtered students: ", uniqueRecord);
    return uniqueRecord;
  };

  console.log(daysArray);

  return (
    <div>
      <div style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
}

export default AttendanceGrid;
