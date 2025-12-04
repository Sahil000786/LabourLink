import axiosClient from "./axiosClient";

export const registerUser = async (payload) => {
  // payload: { name, email, phone, password, role }
  const res = await axiosClient.post("/auth/register", payload);
  return res.data;
};

export const loginUser = async ({ email, password }) => {
  const res = await axiosClient.post("/auth/login", { email, password });
  return res.data;
};
