const { default: axios } = require("axios");

const GetAllGrades = () => {
  return axios.get("/api/grade");
};

const CreateNewStudent = (data) => {
  return axios.post("/api/student", data);
};

const GetAllStudents = () => {
  return axios.get("/api/student");
};

const DeleteStudentRecord = (id) => {
  return axios.delete(`/api/student?id=` + id);
};

const GetAttendaceList = (grade, month) => {
  console.log("i got: ", grade);
  console.log("i got: ", month);
  return axios.get(`/api/attendance?grade=` + grade + `&month=` + month);
};

const MarkAttendance = (data) => {
  return axios.post("/api/attendance", data);
};

const MarkAbsent = (studentId, day, date) => {
  return axios.delete(
    `/api/attendance?studentId=` + studentId + `&day=` + day + `&date=` + date
  );
};

export default {
  GetAllGrades,
  CreateNewStudent,
  GetAllStudents,
  DeleteStudentRecord,
  GetAttendaceList,
  MarkAttendance,
  MarkAbsent,
};
