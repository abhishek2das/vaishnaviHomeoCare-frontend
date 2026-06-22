import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import hero_image from '../assets/hero_image.webp'
import { Link } from 'react-router-dom'
import { Target, Eye, ArrowRight, MapPin, CheckCircle } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { API_ENDPOINTS } from '../api/endpoints'
import doctor_img from '../assets/doctor_image.webp'

const locations = [
  { name: 'Medicare Main Clinic', address: 'C-302, Wallfort Woods, Vidhan sabha road, Raipur', beds: 300, type: 'Main Branch' },
]

export default function About() {
  const [description, setDescription] = useState(
    'Founded in 2008 by Dr. Prachi Jha, Medicare Clinic began as a small wellness center with a singular mission: to provide affordable, world-class holistic healthcare to every individual, regardless of their background.'
  )
  const [vision, setVision] = useState(
    'To be the most trusted and innovative healthcare institution in India, setting benchmarks in clinical outcomes, patient experience, and medical education that inspire healthcare systems worldwide.'
  )
  const [mission, setMission] = useState(
    'To deliver compassionate, accessible, and evidence-based healthcare that improves lives. We commit to continuous innovation, dignifying every patient interaction, and developing future medical leaders.'
  )
  const [stats, setStats] = useState([])
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.ABOUT)
        if (!res.ok) throw new Error('Unable to fetch about content')

        const data = await res.json()
        if (data.description) setDescription(data.description)
        if (data.vision) setVision(data.vision)
        if (data.mission) setMission(data.mission)
      } catch (error) {
        console.error('Failed to load about content:', error)
      }
    }

    const loadStats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.STATS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch statistics')

        const data = await res.json()
        const statsData = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []
        const mappedStats = statsData.map((item, index) => ({
          id: item.id ?? `${item.label ?? item.key ?? index}`,
          label: item.label ?? item.key ?? 'Metric',
          value: item.value ?? '',
        }))

        if (mappedStats.length > 0) setStats(mappedStats)
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    const loadDoctors = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.DOCTORS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch doctors')

        const data = await res.json()
        const doctorsData = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []
        const mappedDoctors = doctorsData.map((item, index) => ({
          id: item.id ?? `${item.name ?? item.specialist ?? index}`,
          name: item.name ?? 'Doctor',
          specialist: item.specialist ?? item.role ?? '',
          description: item.shortDescription ?? item.description ?? '',
          image: item.imgUrl ?? item.image ?? '',
        }))

        if (mappedDoctors.length > 0) setDoctors(mappedDoctors)
      } catch (error) {
        console.error('Failed to load doctors:', error)
      }
    }

    loadAbout()
    loadStats()
    loadDoctors()
  }, [])

  const displayDoctors = doctors
  const seoTitle = 'About Vaishnavi Homeo Care — Trusted Homeopathy Clinic in Raipur'
  const seoDescription = description
  const seoKeywords = 'about vaishnavi homeo care, homeopathy clinic, homeopathic clinic raipur, holistic care, Dr. Prachi Jha'
  const seoUrl = typeof window !== 'undefined' ? window.location.href : ''
  const seoImage = hero_image

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
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            "name": "Vaishnavi Homeo Care",
            "description": seoDescription,
            "url": seoUrl,
            "logo": seoImage,
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
      
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-teal-800 py-16 md:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '30px 30px'}} />
      </div>
      
       <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
              About Vaishnavi Homeo Care
            </h1>
              <p className="text-lg text-primary-100 max-w-5xl leading-relaxed">
               <b className='text-xl'> Trusted Homeopathy Clinic in Raipur for Holistic Healing & Lasting Wellness</b> <br />
    At Vaishnavi Homeo Care, we believe that true healing goes beyond treating symptoms—it involves understanding and addressing the root cause of illness. As a trusted Homeopathy Clinic in Raipur, we provide personalized and holistic homeopathic treatment designed to restore balance, strengthen immunity, and improve overall well-being.
    Our approach combines the principles of classical homeopathy with compassionate patient care, helping individuals achieve long-term health naturally and safely. We specialize in treating a wide range of acute and chronic conditions, including migraine, piles, gynecological disorders, thyroid problems, PCOS, allergies, skin diseases, hair fall, digestive disorders, and lifestyle-related health concerns.
              </p>
        
       </div>
      
      </section>
      
        
{/*       
      <PageHero
        title=""
        subtitle=""
        breadcrumbs={[{ label: 'About Us' }]}
      /> */}

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="section-title mb-5">A Legacy of Compassionate Homeopathic Care</h2>
              {/* Dynamic content */}
              <p className="text-neutral-500 leading-relaxed mb-5">{description}</p>
              <Link to="/appointment" className="btn-primary">Book a Consultation <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://etimg.etb2bimg.com/photo/101841354.cms" alt="Clinic lobby" className="rounded-2xl object-cover w-full h-48 shadow-soft" />
              <img src="https://shmch-chapra.org/wp-content/uploads/2025/09/homeo.jpg" alt="Doctors" className="rounded-2xl object-cover w-full h-48 shadow-soft mt-6" />
              <img src="https://cns-payload-prod-01-content.global.ssl.fastly.net/payload-media/Naturopathy.webp" alt="Equipment" className="rounded-2xl object-cover w-full h-48 shadow-soft -mt-6" />
              <img src="https://images.unsplash.com/photo-1638988562241-0e40dffe16ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Patient care" className="rounded-2xl object-cover w-full h-48 shadow-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Our Guiding Principles</div>
            <h2 className="section-title">Vision, Mission & Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card p-8 border-t-4 border-primary-500 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye size={28} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">Our Vision</h3>
              <p className="text-neutral-500 leading-relaxed">{vision}</p>
            </div>
            <div className="card p-8 border-t-4 border-teal-500 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} className="text-teal-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">Our Mission</h3>
              <p className="text-neutral-500 leading-relaxed">{mission}</p>
            </div>
          </div>
          {/* Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Patient First', desc: 'Every treatment plan is designed with the patient\'s health, comfort, and long-term well-being as our highest priority.', color: 'bg-primary-100 text-primary-600' },
              { label: 'Integrity', desc: 'We maintain transparency, ethical medical practices, and honest guidance in every patient interaction.', color: 'bg-teal-100 text-teal-600' },
              { label: 'Holistic Healing', desc: 'We focus on treating the whole person—mind, body, and overall health—not just the disease.', color: 'bg-amber-100 text-amber-600' },
              { label: 'Excellence', desc: 'We strive to deliver the highest standards of homeopathic care through continuous learning, innovation, and clinical expertise.', color: 'bg-rose-100 text-rose-600' },
            ].map(val => (
              <div key={val.label} className="card p-6 text-center hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${val.color}`}>
                  <CheckCircle size={22} />
                </div>
                <h4 className="font-display font-semibold text-neutral-800 mb-2">{val.label}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Stats */}
      {stats.length > 0 && (
      <section className="py-20 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Our Network at a Glance</h2>
          </div>
          <div className={stats.length <= 2 ? "flex flex-wrap justify-center gap-8 mb-16" : "grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"}>
            {stats.map((stat) => (
              <div key={stat.id} className={`text-center ${stats.length <= 2 ? 'w-full sm:w-56' : ''}`}>
                <div className="text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-100 font-semibold mb-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {locations.map(loc => (
              <div key={loc.name} className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={18} className="text-teal-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-teal-300 font-semibold mb-0.5">{loc.type}</div>
                    <h4 className="text-white font-semibold">{loc.name}</h4>
                  </div>
                </div>
                <p className="text-primary-200 text-sm mb-3">{loc.address}</p>
                <div className="text-white text-sm"><span className="font-bold text-lg">{loc.beds}</span> beds</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      

{/* Meet Our Expert Section */}
<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">

    {/* Eyebrow */}
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-base font-medium tracking-widest uppercase text-gray-400 whitespace-nowrap">
        Meet Our Expert
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>

    {/* Two-column grid */}
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-16 items-start">

      {/* LEFT — Photo */}
      <div className="relative">
        <div className="rounded-[20px] overflow-hidden aspect-[4/5] bg-teal-50 max-h-[500px] lg:max-h-none">
          <img
            src={doctor_img}
            alt="Dr. Prachi Jha — Homeopathy Doctor at Vaishnavi Homeo Care, Raipur"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Experience badge */}
        <div className="absolute bottom-5 left-5 bg-white border border-gray-200 rounded-xl p-2.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-teal-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 leading-tight">Clinical experience</p>
            <p className="text-sm font-medium text-gray-800 leading-tight">14+ years</p>
          </div>
        </div>
      </div>

      {/* RIGHT — Info */}
      <div className="pt-0 lg:pt-2">
        <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-800 leading-tight mb-1.5">
          Dr. Prachi Jha
        </h2>
        <p className="text-sm font-medium text-teal-700 mb-5">
          Homeopathy Doctor in Raipur | Migraine, Gynecological & Piles Treatment Expert
        </p>

        <div className="h-px bg-gray-100 mb-5" />

        <p className="text-[15px] text-neutral-600 leading-relaxed mb-7">
        With 14+ years of clinical experience, Dr. Prachi Jha has successfully treated patients suffering from chronic and recurring health conditions through individualized homeopathic care. Her expertise includes:
        </p>

        {/* Specialties */}
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-3">
          Areas of Specialization
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            Migraine
          </span>
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            Piles & Digestive Disorders
          </span>
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            PCOS & Gynecological Problems
          </span>
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            Thyroid Disorders
          </span>
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            Allergies & Sinusitis
          </span>
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            Skin Diseases
          </span>
          <span className="inline-flex items-center bg-teal-50 text-teal-900 text-[13px] font-medium px-3 py-1.5 rounded-full">
            Hair Loss & Hair Fall
          </span>
        </div>
        
        <p className="text-[15px] text-neutral-600 leading-relaxed mb-7">
          Her patient-focused approach, deep understanding of homeopathic medicine, and commitment to holistic healing have made her a trusted name among patients seeking effective and natural healthcare solutions in Raipur.
Whether you are looking for the Best Homeopathy Clinic in Raipur, an experienced Homeopathy Doctor in Raipur, or personalized treatment for chronic health conditions, Vaishnavi Homeo Care is dedicated to helping you achieve lasting health and wellness through the power of homeopathy.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/appointment"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Book a Consultation
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>

  </div>
</section>

      {/* Team */}
      {doctors && doctors.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="section-label justify-center">Our Team</div>
              <h2 className="section-title">Meet Our Doctors</h2>
            </div>
            <div className={`grid gap-8 ${doctors.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : doctors.length === 2 ? 'sm:grid-cols-2 max-w-4xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {doctors.map(doctor => (
                <div key={doctor.id} className="card overflow-hidden hover:-translate-y-1 transition-all bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md">
                  <div className="aspect-[3/2] bg-neutral-100 overflow-hidden relative">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                        <span className="text-neutral-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-display font-bold text-neutral-800 mb-1">{doctor.name}</h3>
                    <p className="text-sm font-medium text-teal-600 mb-3">{doctor.specialist}</p>
                    <p className="text-neutral-500 text-sm leading-relaxed">{doctor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
