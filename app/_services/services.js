// app/_services/services.js
export const getUniqueRecord = (attendanceList = []) => {
  const uniqueRecord = [];
  const existingUser = new Set();

  attendanceList.forEach((rec) => {
    if (!existingUser.has(rec.studentId)) {
      existingUser.add(rec.studentId);
      uniqueRecord.push(rec);
    }
  });

  return uniqueRecord;
};
