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

export default { GetAllGrades, CreateNewStudent, GetAllStudents };
