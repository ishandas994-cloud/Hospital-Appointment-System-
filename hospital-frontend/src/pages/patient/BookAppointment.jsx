import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getDoctorById,
  getDoctorSlots,
} from "../../api/doctorAPI";

import { bookAppointment } from "../../api/appointmentAPI";

import Spinner from "../../components/Spinner";

const BookAppointment = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [doctor, setDoctor] =
    useState(null);

  const [slots, setSlots] =
    useState([]);

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorData =
          await getDoctorById(id);

        const slotsData =
          await getDoctorSlots(id);

        setDoctor(
          doctorData.doctor
        );

        setSlots(
          slotsData.slots || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking =
    async () => {
      if (!selectedSlot) {
        return alert(
          "Please select a slot"
        );
      }

      try {
        await bookAppointment({
          doctorId: id,
          slot: selectedSlot,
        });

        alert(
          "Appointment Booked"
        );

        navigate(
          "/patient/appointments"
        );
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Booking Failed"
        );
      }
    };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>Book Appointment</h1>

      <div className="book-card">
        <h2>
          Dr. {doctor?.name}
        </h2>

        <p>
          {
            doctor?.specialization
          }
        </p>

        <h3>Select Slot</h3>

        <div className="slots-grid">
          {slots.map((slot) => (
            <button
              key={slot._id}
              className={
                selectedSlot ===
                slot.time
                  ? "active-slot"
                  : ""
              }
              onClick={() =>
                setSelectedSlot(
                  slot.time
                )
              }
            >
              {slot.time}
            </button>
          ))}
        </div>

        <button
          className="book-btn"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;