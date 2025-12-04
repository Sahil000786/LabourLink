import axiosClient from "./axiosClient";

export const getConversations = async () => {
  const res = await axiosClient.get("/chat/conversations");
  return res.data;
};

export const getMessagesForApplication = async (applicationId) => {
  const res = await axiosClient.get(`/chat/${applicationId}`);
  return res.data; // { application, messages }
};

export const sendMessageToApplication = async (applicationId, message) => {
  const res = await axiosClient.post(`/chat/${applicationId}`, { message });
  return res.data;
};
