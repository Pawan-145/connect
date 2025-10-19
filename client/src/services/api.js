import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // your Node backend
});

export const fetchImages = () => API.get("/images");
export const uploadImage = (formData) => API.post("/upload", formData);
export const deleteImage = (id) => API.delete(`/delete/${id}`);
export const pinImage = (id) => API.post(`/pin/${id}`);
export const commentImage = (id, comment) => API.post(`/comment/${id}`, { comment });
