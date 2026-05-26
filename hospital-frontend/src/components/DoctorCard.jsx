import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <img
        src={
          doctor?.image ||
          "https://via.placeholder.com/150"
        }
        alt={doctor?.name}
      />

      <h3>{doctor?.name}</h3>

      <p>{doctor?.specialization}</p>

      <p>{doctor?.experience} Years Experience</p>

      <Link to={`/patient/book/${doctor?._id}`}>
        <button>Book Appointment</button>
      </Link>
    </div>
  );
};

export default DoctorCard;