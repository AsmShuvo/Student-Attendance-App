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
  return axios.delete(`/api/student?id=`+id);
};

export default { GetAllGrades, CreateNewStudent, GetAllStudents, DeleteStudentRecord };
