import React, { useEffect, useState } from "react";

function AttendanceGrid({ attendanceList }) {
  const [rowData, setRowData] = useState();
  useEffect(() => {
    const userList = getUniqueRecord();
    setRowData(userList);
    console.log(userList);
  }, [attendanceList]);
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
  return <div></div>;
}

export default AttendanceGrid;
