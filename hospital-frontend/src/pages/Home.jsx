import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import React from "react";
const specializations = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'General Physician'
]

const steps = [
  { num: '01', title: 'Create Account',  desc: 'Register as a patient in under 2 minutes' },
  { num: '02', title: 'Find a Doctor',   desc: 'Browse by specialization or search by name' },
  { num: '03', title: 'Book a Slot',     desc: 'Pick your preferred date and time slot' },
  { num: '04', title: 'Get Treated',     desc: 'Visit the doctor and get the care you need' },
]

export default function Home() {
  const { user } = useAuth()
  const dashboardLink = user ? `/${user.role}/dashboard` : null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 text-center">
          <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🏥 Hospital Appointment System
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Your Health, <br />
            <span className="text-accent-400">Our Priority</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-10">
            Book appointments with top doctors instantly. No waiting lines,
            no phone calls — just seamless healthcare at your fingertips.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {dashboardLink ? (
              <Link to={dashboardLink} className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all">
                  Get Started Free
                </Link>
                <Link to="/login" className="border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-14">
            {[['500+','Doctors'],['10k+','Patients'],['50+','Specializations']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="font-display text-3xl font-bold text-white">{n}</p>
                <p className="text-primary-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-center text-slate-800 mb-8">
          Browse by Specialization
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specializations.map(s => (
            <Link
              key={s}
              to={`/patient/doctors?specialization=${s}`}
              className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <span className="text-xl">🩺</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-tight">{s}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-center text-slate-800 mb-12">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(step => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-white text-lg">{step.num}</span>
                </div>
                <h3 className="font-display font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-primary-100 mb-8">
            Join thousands of patients who trust MediCare for their healthcare needs.
          </p>
          <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2024 MediCare Hospital System. Built with ❤️ for better healthcare.</p>
      </footer>
    </div>
  )
}