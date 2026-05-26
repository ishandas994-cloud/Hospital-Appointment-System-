import API from "./axios";

// Admin Dashboard
export const getDashboardData = async () => {
  const response = await API.get("/admin/dashboard");
  return response.data;
};

// Get All Users
export const getAllUsers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

// Get All Doctors
export const getAllDoctorsAdmin = async () => {
  const response = await API.get("/admin/doctors");
  return response.data;
};

// Approve Doctor
export const approveDoctor = async (doctorId) => {
  const response = await API.put(
    `/admin/approve-doctor/${doctorId}`
  );

  return response.data;
};

// Get All Appointments
export const getAllAppointments = async () => {
  const response = await API.get("/admin/appointments");
  return response.data;
};