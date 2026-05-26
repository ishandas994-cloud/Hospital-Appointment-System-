import {
  useEffect,
  useState,
} from "react";

import {
  cancelAppointment,
  getMyAppointments,
} from "../../api/appointmentAPI";

import AppointmentCard from "../../components/AppointmentCard";

import Spinner from "../../components/Spinner";

const MyAppointments = () => {
  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchAppointments =
    async () => {
      try {
        const data =
          await getMyAppointments();

        setAppointments(
          data.appointments || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel =
    async (id) => {
      try {
        await cancelAppointment(id);

        fetchAppointments();
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>My Appointments</h1>

      {appointments.map(
        (appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={
              appointment
            }
            onCancel={
              handleCancel
            }
          />
        )
      )}
    </div>
  );
};

export default MyAppointments;