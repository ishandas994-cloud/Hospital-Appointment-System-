import { Link } from 'react-router-dom'
import { StarIcon, BriefcaseIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid'

export default function DoctorCard({ doctor }) {
  const { _id, user, specialization, experience, consultationFee, rating, totalReviews } = doctor

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-primary-700">
              {user?.name?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-slate-800 truncate">
            Dr. {user?.name}
          </h3>
          <p className="text-sm text-primary-600 font-medium">{specialization}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <BriefcaseIcon className="w-3.5 h-3.5" />
              {experience} yrs exp
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-500">
              <StarIcon className="w-3.5 h-3.5" />
              {rating?.toFixed(1) || '0.0'} ({totalReviews || 0})
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <CurrencyDollarIcon className="w-3.5 h-3.5" />
              ₹{consultationFee}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Link
          to={`/patient/book/${_id}`}
          className="btn-primary text-sm py-2 w-full text-center block"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  )
}