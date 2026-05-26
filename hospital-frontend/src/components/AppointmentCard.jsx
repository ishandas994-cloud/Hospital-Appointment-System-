const AppointmentCard = ({
  appointment,
  onCancel,
}) => {
  return (
    <div className="appointment-card">
      <h3>
        Dr. {appointment?.doctor?.name}
      </h3>

      <p>
        Patient: {appointment?.patient?.name}
      </p>

      <p>Date: {appointment?.date}</p>

      <p>Time: {appointment?.time}</p>

      <p>Status: {appointment?.status}</p>

      {appointment?.status !== "cancelled" && (
        <button
          onClick={() =>
            onCancel(appointment?._id)
          }
        >
          Cancel Appointment
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;