import axios from "axios";

const path = process.env.REACT_APP_SERVER_URL;

export const loginUser = (email, password) => {
  return axios.post(`${path}/users/login`, { email, password });
};

export const signupUser = (email, password, name) => {
  return axios.post(`${path}/users/signup`, { email, password, name });
};
