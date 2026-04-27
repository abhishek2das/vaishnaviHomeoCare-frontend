import { useState } from 'react'
import { MessageSquare, User, Phone, Mail, CheckCircle, Loader, Star } from 'lucide-react'
import PageHero from '../components/common/PageHero'

const types = ['General Enquiry', 'Feedback', 'Complaint', 'Suggestion', 'Homeopathic Query', 'Insurance Query']

export default function Enquiry() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', type: '', rating: 0, message: '', terms: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.type) e.type = 'Please select enquiry type'
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  if (submitted) {
    return (
      <div>
        <PageHero title="Enquiry / Feedback" breadcrumbs={[{ label: 'Enquiry' }]} />
        <section className="py-24 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-3">Thank You, {form.name}!</h2>
            <p className="text-neutral-500 leading-relaxed mb-8">
              Your {form.type.toLowerCase()} has been received. We will respond to you within 24 working hours via your provided contact details.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSubmitted(false); setForm({ name: '', mobile: '', email: '', type: '', rating: 0, message: '', terms: false }) }} className="btn-secondary text-sm">Submit Another</button>
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
        title="Enquiry & Feedback"
        subtitle="Share your thoughts, ask a question, or send us your feedback. We value every response."
        breadcrumbs={[{ label: 'Enquiry' }]}
      />

      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Sidebar */}
            <div className="space-y-5">
              {[
                { icon: MessageSquare, label: 'General Enquiry', desc: 'Ask us anything about services, doctors, or facilities.' },
                { icon: Star, label: 'Share Feedback', desc: 'Rate your experience and help us improve.' },
                { icon: Phone, label: 'Quick Contact', desc: 'For urgent matters, call +91-11-4567-8900.' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="card p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 text-sm mb-1">{label}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <div className="card p-8">
                <h2 className="font-display font-bold text-neutral-800 text-xl mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" placeholder="Your name" value={form.name}
                          onChange={e => handleChange('name', e.target.value)}
                          className={`input-field pl-10 ${errors.name ? 'border-rose-400' : ''}`} />
                      </div>
                      {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Mobile <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="tel" placeholder="10-digit number" value={form.mobile}
                          onChange={e => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className={`input-field pl-10 ${errors.mobile ? 'border-rose-400' : ''}`} />
                      </div>
                      {errors.mobile && <p className="mt-1 text-xs text-rose-500">{errors.mobile}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email <span className="text-neutral-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input type="email" placeholder="you@example.com" value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                        className={`input-field pl-10 ${errors.email ? 'border-rose-400' : ''}`} />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Enquiry Type <span className="text-rose-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t => (
                        <button type="button" key={t} onClick={() => handleChange('type', t)}
                          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${form.type === t ? 'bg-primary-600 text-white shadow-soft' : 'bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-600'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.type && <p className="mt-1 text-xs text-rose-500">{errors.type}</p>}
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Your Rating <span className="text-neutral-400 font-normal">(Optional)</span></label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button type="button" key={star}
                          onClick={() => handleChange('rating', star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`Rate ${star} stars`}
                          className="p-0.5 transition-transform hover:scale-110">
                          <Star size={28} className={`transition-colors ${(hoverRating || form.rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 fill-neutral-200'}`} />
                        </button>
                      ))}
                      {form.rating > 0 && (
                        <span className="ml-2 text-sm text-neutral-500 self-center">
                          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Message <span className="text-rose-500">*</span></label>
                    <textarea rows={5} placeholder="Write your message here..." value={form.message}
                      onChange={e => handleChange('message', e.target.value)}
                      className={`input-field resize-none ${errors.message ? 'border-rose-400' : ''}`} />
                    <div className="flex justify-between mt-1">
                      {errors.message ? <p className="text-xs text-rose-500">{errors.message}</p> : <span />}
                      <span className="text-xs text-neutral-400">{form.message.length} chars</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? <><Loader size={18} className="animate-spin" /> Sending...</> : <><MessageSquare size={18} /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
