import {
  useEffect,
  useState,
} from "react";

import {
  approveDoctor,
  getAllDoctorsAdmin,
} from "../../api/adminAPI";

import Spinner from "../../components/Spinner";

const ManageDoctors = () => {
  const [doctors, setDoctors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchDoctors = async () => {
    try {
      const data =
        await getAllDoctorsAdmin();

      setDoctors(data.doctors || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (
    doctorId
  ) => {
    try {
      await approveDoctor(doctorId);

      fetchDoctors();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>Manage Doctors</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>

                <td>
                  {doctor.specialization}
                </td>

                <td>
                  {doctor.isApproved
                    ? "Approved"
                    : "Pending"}
                </td>

                <td>
                  {!doctor.isApproved && (
                    <button
                      onClick={() =>
                        handleApprove(
                          doctor._id
                        )
                      }
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDoctors;