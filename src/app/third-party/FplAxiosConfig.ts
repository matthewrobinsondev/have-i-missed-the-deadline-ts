import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://fantasy.premierleague.com/api/",
});

export default axiosInstance;