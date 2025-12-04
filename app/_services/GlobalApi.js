const { default: axios } = require("axios");

const GetAllGrades = () => {
  return axios.get("/api/grade");
};

const CreateNewStudent = (data) => {
  return axios.post("/api/student", data);
};

export default { GetAllGrades, CreateNewStudent };
