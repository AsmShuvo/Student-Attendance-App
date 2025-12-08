// "use client";

// import React, { useEffect, useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
// import moment from "moment";
// import GlobalApi from "@/app/_services/GlobalApi";
// import { toast } from "sonner";

// ModuleRegistry.registerModules([AllCommunityModule]);

// const pagination = true;
// const paginationPageSize = 500;
// const paginationPageSizeSelector = [25, 50, 100];

// function AttendanceGrid({ attendanceList, selectedMonth }) {
//   const [rowData, setRowData] = useState();
//   const [colDefs, setColDefs] = useState([
//     { field: "studentId" },
//     { field: "name", filter: true },
//   ]);
//   const daysInMo = (year, month) => new Date(year, month + 1, 0).getDate();
//   const numbOfDays = daysInMo(
//     moment(selectedMonth).format("yyyy"),
//     moment(selectedMonth).format("MM")
//   );

//   const daysArray = Array.from({ length: numbOfDays }, (_, i) => i + 1);
//   useEffect(() => {
//     if (attendanceList) {
//       const userList = getUniqueRecord();
//       setRowData(userList);
//       // console.log(userList);

//       daysArray.forEach((date) => {
//         // add column for this date
//         setColDefs((prevData) => [
//           ...prevData,
//           { field: date.toString(), width: 50, editable: true },
//         ]);

//         // fill each row's value for this date
//         userList.forEach((obj) => {
//           obj[date] = isPresent(obj.studentId, date); // <- removed extra ")"
//         });
//       });
//     }
//   }, [attendanceList]);

//   // use to check if user present or not

//   const isPresent = (stId, day) => {
//     const res = attendanceList.find(
//       (item) => item.day == day && item.studentId == stId
//     );
//     return res ? true : false;
//   };

//   const getUniqueRecord = () => {
//     // get distinc user list
//     const uniqueRecord = [];
//     const existingUser = new Set();
//     attendanceList?.forEach((rec) => {
//       if (!existingUser.has(rec.studentId)) {
//         existingUser.add(rec.studentId);
//         uniqueRecord.push(rec);
//       }
//     });
//     console.log("filtered students: ", uniqueRecord);
//     return uniqueRecord;
//   };

//   // used to mark student attendance
//   const onMarkAttendace = (day, studentId, isPresent) => {
//     const date = moment(selectedMonth).format("YYYY-MM-DD");

//     if (isPresent) {
//       const data = {
//         day: day,
//         studentId: studentId,
//         present: isPresent,
//         date: date,
//       };
//       GlobalApi.MarkAttendance(data).then((res) => {
//         console.log(res);
//         toast("Student id: " + studentId + " Marked as present");
//       });
//     } else {
//       GlobalApi.MarkAbsent(studentId, day, date).then((res) => {
//         toast("Student id: " + studentId + " Marked as absent");
//       });
//     }
//   };

//   // console.log(daysArray);

//   return (
//     <div>
//       <div style={{ height: 500 }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={colDefs}
//           pagination={pagination}
//           paginationPageSize={paginationPageSize}
//           paginationPageSizeSelector={paginationPageSizeSelector}
//           onCellValueChanged={(e) =>
//             onMarkAttendace(e.colDef.field, e.data.studentId, e.newValue)
//           }
//         />
//       </div>
//     </div>
//   );
// }

// export default AttendanceGrid;

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
      if (!byStudent.has(rec.studentId)) {
        byStudent.set(rec.studentId, {
          studentId: rec.studentId,
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

    const present = !!newValue;
    const date = moment(selectedMonth).date(day).format("YYYY-MM-DD");

    if (present) {
      const data = { day, studentId, present, date };
      GlobalApi.MarkAttendance(data).then((res) => {
        console.log(res);
        toast(`Student id: ${studentId} marked as present`);
      });
    } else {
      GlobalApi.MarkAbsent(studentId, day, date).then((res) => {
        console.log(res);
        toast(`Student id: ${studentId} marked as absent`);
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
