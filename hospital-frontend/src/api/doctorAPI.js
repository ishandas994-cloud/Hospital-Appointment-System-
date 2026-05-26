import API from "./axios";

// Get All Doctors
export const getAllDoctors = async () => {
  const response = await API.get("/doctor");
  return response.data;
};

// Get Single Doctor
export const getDoctorById = async (doctorId) => {
  const response = await API.get(`/doctor/${doctorId}`);
  return response.data;
};

// Get Doctor Slots
export const getDoctorSlots = async (doctorId) => {
  const response = await API.get(`/doctor/${doctorId}/slots`);
  return response.data;
};

// Update Doctor Profile
export const updateDoctorProfile = async (data) => {
  const response = await API.put("/doctor/profile", data);
  return response.data;
};