import { useState } from 'react'
import { CalendarDays, CheckCircle, User, Phone, MessageSquare, Loader } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { API_ENDPOINTS } from '../api/endpoints'
import { Helmet } from 'react-helmet-async'
import hero_image from '../assets/hero_image.webp'

const initialForm = {
  name: '', mobile: '', date: '', message: '',
}

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      {/* Form field */}
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
    if (!form.name.trim()) {
      e.name = 'Please enter your full name'
    } else if (form.name.trim().length < 2) {
      e.name = 'Full name must be at least 2 characters'
    } else if (!/^[A-Za-z ]+$/.test(form.name.trim())) {
      e.name = 'Name can only contain letters and spaces'
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      e.mobile = 'Please enter a valid 10-digit Indian mobile number'
    }

    if (!form.date) {
      e.date = 'Please choose a preferred date'
    } else {
      const selected = new Date(form.date)
      const today = new Date(); today.setHours(0, 0, 0, 0)
      if (selected < today) e.date = 'Please select a future date'
    }

    if (form.message && form.message.trim().length > 0 && form.message.trim().length < 10) {
      e.message = 'Please enter at least 10 characters for your message'
    }

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        patientName: form.name.trim(),
        phone: form.mobile,
        appointmentDate: new Date(form.date).toISOString(),
        status: 'Pending',
        ...(form.message.trim() ? { message: form.message.trim() } : {}),
      }

      const res = await fetch(API_ENDPOINTS.APPOINTMENTS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Failed to submit appointment request')
      }

      setSubmitted(true)
    } catch (error) {
      console.error(error)
      setErrors({ submit: error.message || 'Unable to create appointment request' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  // Min date = today
  const today = new Date().toISOString().split('T')[0]

  const seoTitle = 'Book Appointment — Vaishnavi Homeo Care Clinic'
  const seoDescription = 'Schedule an online or in-clinic appointment with experienced homeopathic practitioners at Vaishnavi Homeo Care Clinic. Fast confirmation and flexible scheduling.'
  const seoKeywords = 'book appointment homeopathy, homeopathic appointment, online consultation, Vaishnavi Homeo Care appointment'
  const seoUrl = typeof window !== 'undefined' ? window.location.href : ''
  const seoImage = hero_image

  if (submitted) {
    return (
      <div>
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="keywords" content={seoKeywords} />
          <link rel="canonical" href={seoUrl} />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:url" content={seoUrl} />
          <meta property="og:image" content={seoImage} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={seoImage} />
          <script type="application/ld+json">
            {`{
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              "name": "Vaishnavi Homeo Care",
              "description": "${seoDescription}",
              "url": "${seoUrl}",
              "telephone": "+918103828005",
              "openingHours": ["Mo-Thu 11:00-13:30", "Fri 11:00-13:00"],
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 21.292918468904922,
                "longitude": 81.71982356729511
              }
            }`}
          </script>
        </Helmet>
        <PageHero title="Book an Appointment" breadcrumbs={[{ label: 'Book Appointment' }]} />
        <section className="py-24 bg-white">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
              <CheckCircle size={48} className="text-teal-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">Appointment Requested!</h2>
            <p className="text-neutral-500 leading-relaxed mb-3">
              Thank you, <span className="font-semibold text-neutral-700">{form.name}</span>! Your appointment request has been received.
            </p>
            <p className="text-neutral-500 text-sm mb-8">
              Our team will call you on <span className="font-semibold">{form.mobile}</span> within 2 hours to confirm your appointment on <span className="font-semibold">{form.date}</span>.
            </p>
            <div className="bg-neutral-50 rounded-2xl p-5 mb-8 text-left space-y-2">
              <h4 className="font-semibold text-neutral-700 text-sm mb-3">Appointment Summary</h4>
              {[
                { label: 'Name', value: form.name },
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
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={seoUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:image" content={seoImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            "name": "Vaishnavi Homeo Care",
            "description": "${seoDescription}",
            "url": "${seoUrl}",
            "telephone": "+918103828005",
            "openingHours": ["Mo-Thu 11:00-13:30", "Fri 11:00-13:00"],
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 21.292918468904922,
              "longitude": 81.71982356729511
            }
          }`}
        </script>
      </Helmet>
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

                  <FormField label="Preferred Date" icon={CalendarDays} error={errors.date}>
                    <input
                      type="date" min={today}
                      value={form.date} onChange={e => handleChange('date', e.target.value)}
                      className={`input-field pl-11 ${errors.date ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                      aria-label="Preferred appointment date"
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
                        className={`input-field pl-11 resize-none ${errors.message ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                        aria-label="Message or symptoms"
                      />
                    </div>
                    {errors.message && <p className="mt-1.5 text-sm text-rose-500">• {errors.message}</p>}
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-rose-500 mb-2">{errors.submit}</p>
                  )}
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
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

             

              <div className="card p-6">
                <h3 className="font-display font-bold text-neutral-800 mb-4">Timings</h3>
                <div className="space-y-2.5">
                  {[
                    { day: 'Monday – Thursday', time: '11:00 AM – 1:30 PM', location: 'Wallfort Woods' },
                    { day: 'Friday', time: '11:00 AM – 1:00 PM', location: 'Kripa Day Care' },
                   
                  ].map(s => (
                    <>
                      <div key={s.day} className="flex justify-between items-center text-sm">
                        <span className="text-neutral-600">{s.day}</span>
                        <span className="font-semibold text-neutral-800">{s.time}</span>
                      </div>
                      <span className="text-sm text-teal-600">{s.location}</span>
                    </>
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
