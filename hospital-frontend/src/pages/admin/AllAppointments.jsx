import {
  useEffect,
  useState,
} from "react";

import { getAllAppointments } from "../../api/adminAPI";

import Spinner from "../../components/Spinner";

const AllAppointments = () => {
  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchAppointments =
      async () => {
        try {
          const data =
            await getAllAppointments();

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
      <h1>All Appointments</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(
              (appointment) => (
                <tr
                  key={appointment._id}
                >
                  <td>
                    {
                      appointment.doctor
                        ?.name
                    }
                  </td>

                  <td>
                    {
                      appointment.patient
                        ?.name
                    }
                  </td>

                  <td>
                    {appointment.date}
                  </td>

                  <td>
                    {appointment.time}
                  </td>

                  <td>
                    {appointment.status}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointments;