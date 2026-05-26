import {
  useEffect,
  useState,
} from "react";

import { getAllDoctors } from "../../api/doctorAPI";

import DoctorCard from "../../components/DoctorCard";

import Spinner from "../../components/Spinner";

const FindDoctors = () => {
  const [doctors, setDoctors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data =
          await getAllDoctors();

        setDoctors(
          data.doctors || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>Find Doctors</h1>

      <div className="doctor-grid">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
          />
        ))}
      </div>
    </div>
  );
};

export default FindDoctors;