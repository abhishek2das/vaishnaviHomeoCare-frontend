import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { services } from '../data/mockData'

const iconComponents = {
  Heart: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Sparkles: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Activity: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Bone: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  Brain: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Zap: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Droplets: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M5.636 5.636l.707.707M17.657 17.657l.707.707M3 12h1m16 0h1M5.636 18.364l.707-.707M17.657 6.343l.707-.707" /></svg>,
  Ribbon: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Wind: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  Plus: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>,
}

export default function Services() {
  return (
    <div>
      <PageHero
        title="Our Homeopathic Services"
        subtitle="Comprehensive care across 25+ specializations with expert homeopathic practitioners and state-of-the-art holistic evaluation."
        breadcrumbs={[{ label: 'Services' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Specialized Care</div>
            <h2 className="section-title mb-4">What We Treat</h2>
            <p className="section-subtitle mx-auto text-center">
              Our multidisciplinary teams collaborate to deliver the best possible outcomes for your unique health needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service) => {
              const IconComp = iconComponents[service.icon]
              const isBlue = service.color === 'blue'
              return (
                <div key={service.id} className="card p-7 group hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors
                    ${isBlue ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white' : 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'}`}>
                    {IconComp && <IconComp />}
                  </div>
                  <h3 className="text-xl font-display font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed mb-5 text-sm">{service.description}</p>
                  <Link to="/appointment"
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3
                      ${isBlue ? 'text-primary-600 hover:text-primary-700' : 'text-teal-600 hover:text-teal-700'}`}>
                    Book Consultation <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Services */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Why Medicare Clinic</div>
              <h2 className="section-title mb-6">Excellence Across Every Specialization</h2>
              <div className="space-y-5">
                {[
                  { title: 'Advanced Diagnostics', desc: 'Latest imaging and pathology labs for accurate, fast diagnosis.' },
                  { title: 'Multidisciplinary Approach', desc: 'Teams of specialists collaborate on complex cases for holistic care.' },
                  { title: 'Evidence-Based Protocols', desc: 'Treatment protocols aligned with the latest international guidelines.' },
                  { title: 'Minimal Wait Times', desc: 'Streamlined appointment system to reduce patient waiting.' },
                  { title: 'Transparent Billing', desc: 'Clear, itemized billing with no hidden charges and insurance support.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-800 mb-0.5">{item.title}</div>
                      <p className="text-sm text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=500&fit=crop"
                alt="Clinic environment" className="rounded-3xl shadow-strong w-full object-cover" style={{ height: '440px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Get the Right Care?</h2>
          <p className="text-primary-100 mb-8">Our specialists are ready to help. Book a consultation today and receive personalized, expert care.</p>
          <Link to="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-soft hover:shadow-medium">
            Book Appointment <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
