import {
  useEffect,
  useState,
} from "react";

import { getMyAppointments } from "../../api/appointmentAPI";

import Spinner from "../../components/Spinner";

const PatientDashboard = () => {
  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
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

    fetchAppointments();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>Patient Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>
            {appointments.length}
          </h2>

          <p>My Appointments</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;