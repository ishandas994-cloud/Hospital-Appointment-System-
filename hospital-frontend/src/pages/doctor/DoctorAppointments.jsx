import {
  useEffect,
  useState,
} from "react";

import {
  completeAppointment,
  getMyAppointments,
} from "../../api/appointmentAPI";

import Spinner from "../../components/Spinner";

const DoctorAppointments = () => {
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

  const handleComplete =
    async (id) => {
      try {
        await completeAppointment(
          id
        );

        fetchAppointments();
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>
        Doctor Appointments
      </h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
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
                      appointment
                        ?.patient
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
                    {
                      appointment.status
                    }
                  </td>

                  <td>
                    {appointment.status !==
                      "completed" && (
                      <button
                        onClick={() =>
                          handleComplete(
                            appointment._id
                          )
                        }
                      >
                        Complete
                      </button>
                    )}
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

export default DoctorAppointments;