import { CheckCircle } from 'lucide-react'
import PageHero from '../../components/common/PageHero'

const sections = [
  {
    title: 'Emergency & Trauma Center',
    description: 'Our Level-I Trauma Center operates 24/7 with rapid-response teams, 20 emergency beds, 4 trauma bays, and direct integration with ICU and OT for seamless critical care.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=700&h=450&fit=crop',
    features: ['20 emergency beds', '4 dedicated trauma bays', 'On-call specialists round the clock', 'GPS-linked ambulance dispatch', 'Helipad for air evacuation'],
  },
  {
    title: 'Advanced Diagnostic Imaging',
    description: 'Equipped with 3T MRI, 256-slice CT Scanner, PET-CT, Digital Mammography, and Doppler Ultrasound, our diagnostics deliver precise results in the shortest time.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&h=450&fit=crop',
    features: ['3T MRI Scanner', '256-slice CT Scanner', 'PET-CT for oncology', 'Digital X-Ray & Fluoroscopy', 'AI-assisted image analysis'],
    reverse: true,
  },
  {
    title: 'Modular Operating Theatres',
    description: 'Our 12 fully-modular laminar airflow OTs are equipped for open surgery, laparoscopic procedures, robotic surgery, and neuro-spine surgeries to the highest international standards.',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=700&h=450&fit=crop',
    features: ['12 fully-equipped OTs', 'Da Vinci Robotic Surgery System', 'Laminar airflow & HEPA filtration', 'Integrated endoscopy suite', 'Real-time intraoperative imaging'],
  },
  {
    title: 'Intensive Care Units',
    description: 'Separate ICUs for cardiac, neuro, surgical, neonatal, and pediatric patients — each staffed by dedicated intensivists and nurses maintaining a 1:1 nurse-to-patient ratio.',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=700&h=450&fit=crop',
    features: ['80 ICU beds across 5 specialties', '1:1 nurse-to-patient ratio', 'Remote ICU monitoring (eICU)', 'Bedside ABG & POC testing', 'Non-invasive ventilation support'],
    reverse: true,
  },
]

export default function Infrastructure() {
  return (
    <div>
      <PageHero
        title="Our Infrastructure"
        subtitle="World-class facilities built to support the most complex medical care with uncompromising safety standards."
        breadcrumbs={[{ label: 'Hospital', path: '/hospital/infrastructure' }, { label: 'Infrastructure' }]}
      />

      {/* Overview Stats */}
      <section className="py-12 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Inpatient Beds' },
              { value: '12', label: 'Operating Theatres' },
              { value: '80', label: 'ICU Beds' },
              { value: '300,000 sq.ft.', label: 'Built-up Area' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-display font-bold text-white mb-1">{s.value}</div>
                <div className="text-primary-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {sections.map((sec, i) => (
            <div key={sec.title} className={`grid lg:grid-cols-2 gap-14 items-center ${sec.reverse ? 'lg:grid-flow-dense' : ''}`}>
              <div className={sec.reverse ? 'lg:col-start-2' : ''}>
                <div className="section-label">{`0${i + 1} / Infrastructure`}</div>
                <h2 className="section-title mb-5">{sec.title}</h2>
                <p className="text-neutral-500 leading-relaxed mb-7">{sec.description}</p>
                <ul className="space-y-3">
                  {sec.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-neutral-700">
                      <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={sec.reverse ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <img src={sec.image} alt={sec.title}
                  className="rounded-3xl shadow-strong w-full object-cover"
                  style={{ height: '380px' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
