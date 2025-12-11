// export const getUniqueRecord = ({attendanceList}) => { 
//   const uniqueRecord = [];
//   const existingUser = new Set();
//   attendanceList?.forEach((rec) => {
//     if (!existingUser.has(rec.studentId)) {
//       existingUser.add(rec.studentId);
//       uniqueRecord.push(rec);
//     }
//   });
//   console.log("filtered students: ", uniqueRecord);
//   return uniqueRecord;
// };



export const getUniqueRecord = (attendanceList = []) => {
  const uniqueRecord = [];
  const existingUser = new Set();

  attendanceList.forEach((rec) => {
    if (!existingUser.has(rec.studentId)) {
      existingUser.add(rec.studentId);
      uniqueRecord.push(rec);
    }
  });

  console.log("filtered students: ", uniqueRecord);
  return uniqueRecord;
};
