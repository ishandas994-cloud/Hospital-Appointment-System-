import API from "./axios";

// Book Appointment
export const bookAppointment = async (appointmentData) => {
  const response = await API.post(
    "/appointment/book",
    appointmentData
  );

  return response.data;
};

// Get My Appointments
export const getMyAppointments = async () => {
  const response = await API.get("/appointment/my");
  return response.data;
};

// Cancel Appointment
export const cancelAppointment = async (appointmentId) => {
  const response = await API.put(
    `/appointment/cancel/${appointmentId}`
  );

  return response.data;
};

// Complete Appointment
export const completeAppointment = async (appointmentId) => {
  const response = await API.put(
    `/appointment/complete/${appointmentId}`
  );

  return response.data;
};