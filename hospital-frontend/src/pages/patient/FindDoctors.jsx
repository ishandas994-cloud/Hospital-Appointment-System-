import React from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllDoctorsAPI } from '../../api/doctorAPI.js'
import Navbar from '../../components/Navbar.jsx'
import DoctorCard from '../../components/DoctorCard.jsx'
import Spinner from '../../components/Spinner.jsx'

const specializations = [
  'All','General Physician','Cardiologist','Dermatologist',
  'Neurologist','Orthopedic','Pediatrician','Gynecologist',
  'Psychiatrist','ENT Specialist'
]

export default function FindDoctors() {
  const [doctors,  setDoctors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [searchParams]          = useSearchParams()
  const [spec, setSpec]         = useState(searchParams.get('specialization') || 'All')

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const params = {}
      if (spec && spec !== 'All') params.specialization = spec
      if (search) params.search = search
      const res = await getAllDoctorsAPI(params)
      setDoctors(res.data.doctors || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDoctors() }, [spec])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDoctors()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Find Doctors
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by doctor name..."
            className="input flex-1"
          />
          <button type="submit" className="btn-primary px-6">
            Search
          </button>
        </form>

        {/* Specialization filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {specializations.map(s => (
            <button
              key={s}
              onClick={() => setSpec(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                spec === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? <Spinner /> : doctors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500">No doctors found. Try a different search.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">{doctors.length} doctor(s) found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}