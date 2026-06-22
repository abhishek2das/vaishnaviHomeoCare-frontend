import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import hero_image from '../assets/hero_image.webp'
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare, Loader, CheckCircle } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { API_ENDPOINTS } from '../api/endpoints'

const contactDetails = [
  {
    icon: Phone, title: 'Phone Numbers',
    items: [
      { label: 'Dr. Prachi Jha', value: '+91 81038 28005' },
   
    ]
  },
  {
    icon: Mail, title: 'Email Addresses',
    items: [
      { label: 'General', value: 'dr.prachijha15@gmail.com' },
    ]
  },
  {
    icon: MapPin, title: 'Main Clinic',
    items: [
      { label: 'Address', value: 'C-302, Wallfort Woods, Vidhan sabha road, Raipur' },
    ]
  },
  {
    icon: Clock, title: 'Working Hours',
    items: [
      { label: 'Monday – Thursday', value: '11:00 AM – 1:30 PM', location: 'Wallfort Woods' },
      { label: 'Friday', value:  '5:30 PM – 6:30 PM', location: 'Kripa Day Care' },
      
    ]
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e = {}
    const name = form.name.trim()
    const email = form.email.trim()
    const subject = form.subject.trim()
    const message = form.message.trim()

    if (!name) {
      e.name = 'Name is required'
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      e.name = 'Name can only include letters and spaces'
    } else if (/\s{2,}/.test(name)) {
      e.name = 'Name should not contain consecutive spaces'
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      e.mobile = 'Enter a valid 10-digit mobile number'
    }

    if (!email) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email'
    }

    if (!subject) {
      e.subject = 'Subject is required'
    }

    if (!message) {
      e.message = 'Message is required'
    } else if (message.length < 10) {
      e.message = 'Message must be at least 10 characters'
    }

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setSubmissionError('')

    const payload = {
      name: form.name.trim(),
      mobile: form.mobile,
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    }

    try {
      const response = await fetch(API_ENDPOINTS.CONTACTS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      setSent(true)
    } catch (error) {
      setSubmissionError('Unable to send your message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n })
    if (submissionError) setSubmissionError('')
  }

  return (
    <div>
      <Helmet>
        <title>Contact Vaishnavi Homeo Care — Get In Touch</title>
        <meta name="description" content="Contact Vaishnavi Homeo Care Clinic for appointments, queries, and support. Reach us by phone, email or via the contact form." />
        <meta name="keywords" content="contact vaishnavi homeo care, homeopathy clinic contact, call homeopathy clinic, appointment contact" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Vaishnavi Homeo Care — Get In Touch" />
        <meta property="og:description" content="Contact Vaishnavi Homeo Care Clinic for appointments, queries, and support. Reach us by phone, email or via the contact form." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={hero_image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Vaishnavi Homeo Care — Get In Touch" />
        <meta name="twitter:description" content="Contact Vaishnavi Homeo Care Clinic for appointments, queries, and support. Reach us by phone, email or via the contact form." />
        <meta name="twitter:image" content={hero_image} />
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            "name": "Vaishnavi Homeo Care",
            "description": "Contact Vaishnavi Homeo Care Clinic for appointments, queries, and support.",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "telephone": "+918103828005",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "C-302, Wallfort Woods, Vidhan sabha road",
              "addressLocality": "Raipur",
              "addressRegion": "Chhattisgarh",
              "postalCode": "492001",
              "addressCountry": "IN"
            },
            "openingHours": ["Mo-Thu 11:00-13:30", "Fri 11:00-13:00"],
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 21.292918468904922,
              "longitude": 81.71982356729511
            }
          })}
        </script>
      </Helmet>
      <PageHero
        title="Contact Us"
        subtitle="We're here to help. Reach out to us through any channel that works best for you."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      {/* Contact Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactDetails.map(({ icon: Icon, title, items }) => (
              <div key={title} className="card p-6 hover:-translate-y-1 transition-all border">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-neutral-800 mb-3 text-base">{title}</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.label}>
                      <div className="text-xs text-neutral-400 mb-0.5">{item.label}</div>
                      <div className="text-sm text-neutral-700 font-medium leading-snug">{item.value}</div>
                      {item.location && <div className="text-xs text-primary-600 font-semibold">{item.location}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Map */}
            <div>
              <h2 className="section-title mb-6">Find Us</h2>
              <div className="rounded-3xl overflow-hidden shadow-medium" style={{ height: '420px' }}>
                <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2346.8110906506718!2d81.71982356729511!3d21.292918468904922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28e86e93c2a6f7%3A0x2ee493fc63f08d54!2sWallfort%20Woods!5e1!3m2!1sen!2sin!4v1781172372583!5m2!1sen!2sin"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
/>
              </div>
              
            </div>

            {/* Contact Form */}
            <div >
              <h2 className="section-title mb-6">Send a Message</h2>
              {sent ? (
                <div className="card p-10 text-center h-fit">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-teal-600" />
                  </div>
                  <h3 className="font-display font-bold text-neutral-800 mb-2">Message Sent!</h3>
                  <p className="text-neutral-500 text-sm mb-6">We'll get back to you within 24 hours on <span className="font-semibold">{form.email}</span>.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', mobile: '', email: '', subject: '', message: '' }); setSubmissionError('') }}
                    className="btn-secondary text-sm">Send Another</button>
                </div>
              ) : (
                <div className="card p-7 border">
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Name <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input type="text" placeholder="Your name" value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className={`input-field pl-10 ${errors.name ? 'border-rose-400' : ''}`} />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Mobile <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input type="tel" placeholder="10-digit number" value={form.mobile}
                            onChange={e => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className={`input-field pl-10 ${errors.mobile ? 'border-rose-400' : ''}`} />
                        </div>
                        {errors.mobile && <p className="mt-1 text-xs text-rose-500">{errors.mobile}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="email" placeholder="you@example.com" value={form.email}
                          onChange={e => handleChange('email', e.target.value)}
                          className={`input-field pl-10 ${errors.email ? 'border-rose-400' : ''}`} />
                      </div>
                      {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Subject <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="How can we help?" value={form.subject}
                        onChange={e => handleChange('subject', e.target.value)}
                        className={`input-field ${errors.subject ? 'border-rose-400' : ''}`} />
                      {errors.subject && <p className="mt-1 text-xs text-rose-500">{errors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Message <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <MessageSquare size={15} className="absolute left-3.5 top-4 text-neutral-400" />
                        <textarea rows={5} placeholder="Your message..." value={form.message}
                          onChange={e => handleChange('message', e.target.value)}
                          className={`input-field pl-10 resize-none ${errors.message ? 'border-rose-400' : ''}`} />
                      </div>
                      {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
                    </div>

                    {submissionError && <p className="mt-1 text-xs text-rose-500">{submissionError}</p>}
                    <button type="submit" disabled={loading}
                      className="w-full btn-primary justify-center py-3.5 disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? <><Loader size={17} className="animate-spin" /> Sending...</> : <><Send size={17} /> Send Message</>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
