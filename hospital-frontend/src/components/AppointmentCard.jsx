import { format } from 'date-fns'

const statusClass = {
  pending:   'badge-pending',
  confirmed: 'badge-confirmed',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
}

export default function AppointmentCard({ appointment, onCancel, onComplete, showDoctor = true }) {
  const { _id, status, reason, slot, doctor, patient } = appointment

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">

          {/* Show doctor name for patient view */}
          {showDoctor && doctor?.user && (
            <p className="font-semibold text-slate-800">Dr. {doctor.user.name}</p>
          )}

          {/* Show patient name for doctor view */}
          {!showDoctor && patient?.user && (
            <p className="font-semibold text-slate-800">{patient.user.name}</p>
          )}

          <p className="text-sm text-primary-600 mt-0.5">{doctor?.specialization}</p>

          {slot && (
            <p className="text-sm text-slate-500 mt-1">
              📅 {format(new Date(slot.date), 'dd MMM yyyy')} &nbsp;
              🕐 {slot.startTime} – {slot.endTime}
            </p>
          )}

          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            <span className="font-medium">Reason:</span> {reason}
          </p>
        </div>

        <span className={statusClass[status] || 'badge-pending'}>
          {status}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {status === 'confirmed' && onCancel && (
          <button
            onClick={() => onCancel(_id)}
            className="btn-danger text-sm py-1.5 px-4"
          >
            Cancel
          </button>
        )}
        {status === 'confirmed' && onComplete && (
          <button
            onClick={() => onComplete(_id)}
            className="btn-primary text-sm py-1.5 px-4"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  )
}