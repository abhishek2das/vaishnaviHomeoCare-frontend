import { useState } from 'react'
import { CalendarDays, CheckCircle, User, Phone, Mail, MapPin, MessageSquare, ChevronDown, Loader } from 'lucide-react'
import PageHero from '../components/common/PageHero'

const departments = [
  'Select Department',
  'Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology',
  'Dermatology', 'Endocrinology / Diabetes', 'Psychiatry / Mental Health',
  'Gynecology & Obstetrics', 'Oncology', 'Pediatrics',
  'Pulmonology', 'Nephrology', 'Ophthalmology', 'ENT',
  'General Medicine', 'Emergency', 'Other',
]

const initialForm = {
  name: '', mobile: '', email: '', address: '',
  department: '', date: '', message: '', terms: false,
}

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="relative">
        {Icon && <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />}
        {children}
      </div>
      {error && <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1"><span>•</span> {error}</p>}
    </div>
  )
}

export default function BookAppointment() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name (min 2 characters)'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Please enter a valid 10-digit Indian mobile number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.department || form.department === 'Select Department') e.department = 'Please select a department'
    if (!form.date) e.date = 'Please choose a preferred date'
    else {
      const selected = new Date(form.date)
      const today = new Date(); today.setHours(0, 0, 0, 0)
      if (selected < today) e.date = 'Please select a future date'
    }
    if (!form.terms) e.terms = 'Please accept the terms to proceed'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setSubmitted(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  // Min date = today
  const today = new Date().toISOString().split('T')[0]

  if (submitted) {
    return (
      <div>
        <PageHero title="Book an Appointment" breadcrumbs={[{ label: 'Book Appointment' }]} />
        <section className="py-24 bg-white">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
              <CheckCircle size={48} className="text-teal-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">Appointment Requested!</h2>
            <p className="text-neutral-500 leading-relaxed mb-3">
              Thank you, <span className="font-semibold text-neutral-700">{form.name}</span>! Your appointment request for <span className="font-semibold text-primary-600">{form.department}</span> has been received.
            </p>
            <p className="text-neutral-500 text-sm mb-8">
              Our team will call you on <span className="font-semibold">{form.mobile}</span> within 2 hours to confirm your appointment on <span className="font-semibold">{form.date}</span>.
            </p>
            <div className="bg-neutral-50 rounded-2xl p-5 mb-8 text-left space-y-2">
              <h4 className="font-semibold text-neutral-700 text-sm mb-3">Appointment Summary</h4>
              {[
                { label: 'Name', value: form.name },
                { label: 'Department', value: form.department },
                { label: 'Preferred Date', value: form.date },
                { label: 'Contact', value: form.mobile },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="font-medium text-neutral-800">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSubmitted(false); setForm(initialForm) }}
                className="btn-secondary text-sm"
              >
                Book Another
              </button>
              <a href="/" className="btn-primary text-sm">Return Home</a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        title="Book an Appointment"
        subtitle="Schedule a consultation with our specialist doctors at your convenience."
        breadcrumbs={[{ label: 'Book Appointment' }]}
      />

      <section className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <CalendarDays size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-neutral-800">Appointment Details</h2>
                    <p className="text-sm text-neutral-500">Fill in the form below and we'll confirm your slot</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField label="Full Name" icon={User} error={errors.name}>
                      <input
                        type="text" placeholder="e.g. Priya Sharma"
                        value={form.name} onChange={e => handleChange('name', e.target.value)}
                        className={`input-field pl-11 ${errors.name ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                        aria-label="Full name" autoComplete="name"
                      />
                    </FormField>
                    <FormField label="Mobile Number" icon={Phone} error={errors.mobile}>
                      <input
                        type="tel" placeholder="10-digit mobile number"
                        value={form.mobile} onChange={e => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`input-field pl-11 ${errors.mobile ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                        aria-label="Mobile number" autoComplete="tel"
                      />
                    </FormField>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField label="Email Address" icon={Mail} error={errors.email}>
                      <input
                        type="email" placeholder="you@example.com"
                        value={form.email} onChange={e => handleChange('email', e.target.value)}
                        className={`input-field pl-11 ${errors.email ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                        aria-label="Email address" autoComplete="email"
                      />
                    </FormField>
                    <FormField label="Preferred Date" icon={CalendarDays} error={errors.date}>
                      <input
                        type="date" min={today}
                        value={form.date} onChange={e => handleChange('date', e.target.value)}
                        className={`input-field pl-11 ${errors.date ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                        aria-label="Preferred appointment date"
                      />
                    </FormField>
                  </div>

                  <FormField label="Department" icon={ChevronDown} error={errors.department}>
                    <select
                      value={form.department} onChange={e => handleChange('department', e.target.value)}
                      className={`input-field pl-11 appearance-none cursor-pointer ${errors.department ? 'border-rose-400' : ''}`}
                      aria-label="Select department"
                    >
                      {departments.map(d => <option key={d} value={d === 'Select Department' ? '' : d}>{d}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Address" icon={MapPin} error={errors.address}>
                    <input
                      type="text" placeholder="Your complete address"
                      value={form.address} onChange={e => handleChange('address', e.target.value)}
                      className={`input-field pl-11 ${errors.address ? 'border-rose-400' : ''}`}
                      aria-label="Address" autoComplete="street-address"
                    />
                  </FormField>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Message / Symptoms <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <MessageSquare size={17} className="absolute left-4 top-4 text-neutral-400" />
                      <textarea
                        rows={4} placeholder="Briefly describe your symptoms or reason for visit..."
                        value={form.message} onChange={e => handleChange('message', e.target.value)}
                        className="input-field pl-11 resize-none"
                        aria-label="Message or symptoms"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox" checked={form.terms}
                        onChange={e => handleChange('terms', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-400"
                      />
                      <span className="text-sm text-neutral-600 leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a>{' '}
                        and{' '}
                        <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
                        I consent to Medicare Clinic contacting me for appointment-related communications.
                      </span>
                    </label>
                    {errors.terms && <p className="mt-1.5 text-sm text-rose-500">• {errors.terms}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary justify-center py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      <><CalendarDays size={18} /> Confirm Appointment</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-5">
              <div className="card p-6">
                <h3 className="font-display font-bold text-neutral-800 mb-4">Why Book With Us?</h3>
                <div className="space-y-3">
                  {[
                    'Confirmation call within 2 hours',
                    'No advance payment required',
                    'Easy rescheduling up to 24 hrs prior',
                    '120+ specialist doctors available',
                    'Zero waiting time with pre-booked slots',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-primary-600 border-0">
                <h4 className="font-display font-bold text-white mb-2">Emergency?</h4>
                <p className="text-primary-100 text-sm mb-4">For medical emergencies, please call our 24/7 helpline immediately.</p>
                <a href="tel:+911145670000" className="flex items-center gap-2 text-white font-bold text-lg hover:text-primary-100 transition-colors">
                  <Phone size={20} /> +91-11-4567-0000
                </a>
              </div>

              <div className="card p-6">
                <h3 className="font-display font-bold text-neutral-800 mb-4">OPD Timings</h3>
                <div className="space-y-2.5">
                  {[
                    { day: 'Monday – Friday', time: '8:00 AM – 8:00 PM' },
                    { day: 'Saturday', time: '8:00 AM – 6:00 PM' },
                    { day: 'Sunday', time: '9:00 AM – 5:00 PM' },
                    { day: 'Emergency', time: '24 Hours / 7 Days' },
                  ].map(s => (
                    <div key={s.day} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">{s.day}</span>
                      <span className="font-semibold text-neutral-800">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
