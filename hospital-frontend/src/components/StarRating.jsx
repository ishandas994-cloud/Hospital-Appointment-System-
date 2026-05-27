import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`transition-transform ${
            !readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          }`}
        >
          {star <= (hover || value)
            ? <StarIcon    className="w-6 h-6 text-amber-400" />
            : <StarOutline className="w-6 h-6 text-slate-300" />
          }
        </button>
      ))}
    </div>
  )
}