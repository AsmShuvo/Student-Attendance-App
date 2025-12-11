// "use client";

// import { getUniqueRecord } from "@/app/_services/services";
// import moment from "moment";
// import { useEffect, useState } from "react";

// function StatusList({ attendanceList }) {
//   const [totalStudent, setTotalStudent] = useState(0);
//   const [presentPercentage, setpresentPercentage] = useState(0);

//   useEffect(() => {
//     if (attendanceList) {
//       const totalst = getUniqueRecord(attendanceList);
//       setTotalStudent(totalStudent);
//       const today = moment().format("D");
//       const PresentPerc =
//         (attendanceList.length / (totalStudent.length * Number(today))) * 100;

//       console.log("%: ", PresentPerc);
//     }
//   });

//   return <div>StatusList</div>;
// }

// export default StatusList;

"use client";

import { getUniqueRecord } from "@/app/_services/services";
import moment from "moment";
import { useEffect, useState } from "react";

function StatusList({ attendanceList = [] }) {
  const [totalStudent, setTotalStudent] = useState(0);
  const [presentPercentage, setPresentPercentage] = useState(0);

  useEffect(() => {
    if (!attendanceList.length) {
      setTotalStudent(0);
      setPresentPercentage(0);
      return;
    }

    // unique students
    const uniqueStudents = getUniqueRecord(attendanceList);
    const totalStudentsCount = uniqueStudents.length;
    setTotalStudent(totalStudentsCount);

    const today = Number(moment().format("D")); // day of month

    if (!totalStudentsCount || !today) {
      setPresentPercentage(0);
      return;
    }

    // if each row in attendanceList = one "present" mark,
    // this approximates overall presence ratio
    const presentPerc =
      (attendanceList.length / (totalStudentsCount * today)) * 100;

    setPresentPercentage(presentPerc);
    console.log("%: ", presentPerc);
  }, [attendanceList]);

  return (
    <div>
      <p>Total students: {totalStudent}</p>
      <p>Present % (approx): {presentPercentage.toFixed(2)}%</p>
    </div>
  );
}

export default StatusList;
