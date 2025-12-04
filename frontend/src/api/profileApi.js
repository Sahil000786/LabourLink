import axiosClient from "./axiosClient";

export const getMyProfile = async () => {
  const response = await axiosClient.get("/profile/me");
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await axiosClient.put("/profile/me", data);
  return response.data;
};
