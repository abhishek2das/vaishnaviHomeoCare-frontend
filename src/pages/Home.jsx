import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Phone, Shield, Award, Users, Heart, Star, ChevronLeft, ChevronRight, Quote, CheckCircle, Activity, Leaf, Stethoscope, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { services } from '../data/mockData'
import StarRating from '../components/common/StarRating'
import OnlineChip from '../components/common/OnlineChip'
import { API_ENDPOINTS } from '../api/endpoints'
import hero_image from '../assets/hero_image.webp'
import about_us_image from '../assets/about_us_home.avif'
import whychooseusimage1 from '../assets/whychooseusimage1.webp'
import whychooseusimage2 from '../assets/whychooseusimage2.webp'
import whychooseusimage3 from '../assets/whychooseusimage3.webp'

const stats = [
  { value: '10+', label: 'Years of Excellence', icon: Award },
  { value: '500+', label: 'Patients Treated', icon: Users },
  { value: '15+', label: 'Expert Doctors', icon: Heart },
  { value: '25+', label: 'Specializations', icon: Shield },
]

const iconMap = {
  Heart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Sparkles: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Activity: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Bone: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  Brain: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Zap: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Droplets: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1M5.636 5.636l.707.707M17.657 17.657l.707.707M3 12h1m16 0h1M5.636 18.364l.707-.707M17.657 6.343l.707-.707" /></svg>,
  Ribbon: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Wind: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
}

function ServiceIcon({ name, colorClass }) {
  const IconComponent = iconMap[name]
  return IconComponent ? (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
      <IconComponent />
    </div>
  ) : null
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [statsData, setStatsData] = useState([])
  const [testimonialsData, setTestimonialsData] = useState([])
  const [awardsData, setAwardsData] = useState([])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.STATS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch statistics')

        const data = await res.json()
        const statsArray = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []
        const mappedStats = statsArray.map((item, index) => ({
          id: item.id ?? `${item.label ?? item.key ?? index}`,
          label: item.label ?? item.key ?? 'Metric',
          value: item.value ?? '',
          icon: [Award, Users, Heart, Shield][index % 4],
        }))

        if (mappedStats.length > 0) setStatsData(mappedStats)
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    const loadTestimonials = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.TESTIMONIALS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch testimonials')

        const data = await res.json()
        const testimonialsArray = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []

        if (testimonialsArray.length > 0) {
          setTestimonialsData(testimonialsArray)
          setActiveTestimonial(0)
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      }
    }

    const loadAwards = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.AWARDS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch awards')

        const data = await res.json()
        setAwardsData(data.content);
        
      } catch (error) {
        console.error('Failed to load awards:', error)
      }
    }

    loadStats()
    loadTestimonials()
    loadAwards()
  }, [])

  useEffect(() => {
    if (testimonialsData.length > 0) {
      const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonialsData.length), 5000)
      return () => clearInterval(timer)
    }
  }, [testimonialsData])

  // SEO CONFIGURATIONS AND METADATA  
  const seoTitle = 'Vaishnavi Homeo Care Clinic — Trusted Homeopathic Care in Raipur'
  const seoDescription = 'Vaishnavi Homeo Care Clinic offers personalized homeopathic treatment for migraines, gynecological concerns, piles and more. Book online or in-clinic consultations with experienced practitioners.'
  const seoKeywords = 'homeopathy clinic, homeopathic treatment, homeopathic doctor, migraines treatment, gynecological homeopathy, piles treatment, Vaishnavi Homeo Care, Raipur homeopathy, online consultation, natural remedies'
  const seoUrl = typeof window !== 'undefined' ? window.location.href : ''
  const seoImage = hero_image

  return (
    <div>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={seoUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:image" content={seoImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "MedicalClinic",
                "name": "Vaishnavi Homeo Care",
                "description": "${seoDescription}",
                "url": "${seoUrl}",
                "logo": "${seoImage}",
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
                  }
              },
              {
                "@type": "WebSite",
                "url": "${seoUrl}",
                "name": "Vaishnavi Homeo Care",
                "description": "${seoDescription}"
              }
            ]
          }`}
        </script>
      </Helmet>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-50/60 to-transparent" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-100/50 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <OnlineChip to="/appointment" text="Online & In-Clinic Treatment Available" /> <br />
              <div className="section-label mt-6">
                Your Trusted Homeopathy Doctor in Raipur 
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-display font-bold text-neutral-900 leading-tight mb-6"
              style={{lineHeight : '56px'}}> 
                Best Homeopathy Clinic in Raipur –   {' '}
                <span className="text-gradient-blue">Personalized & Holistic</span>{' '}
                Healthcare.
              </h1>
              <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
                Specialized homeopathic care for migraines, gynecological concerns, and piles. Our individualized treatment approach focuses on permanent cure, restoring balance, and enhancing overall health through safe and holistic remedies.
              </p>
              <div className="flex flex-wrap gap-4 mb-10 items-center">
                <Link to="/appointment" className="btn-primary text-base py-3.5 px-7">
                  <CalendarDays size={18} /> Book Appointment
                </Link>
                
                {/* <a href="tel:+911145670000" className="btn-secondary text-base py-3.5 px-7">
                  <Phone size={18} /> Emergency: 24/7
                </a> */}
              </div>
              {/* <div className="flex flex-wrap gap-5">
                {['NABH Accredited', 'ISO 9001:2015', 'JCI Certified'].map(badge => (
                  <div key={badge} className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle size={16} className="text-teal-500" /> {badge}
                  </div>
                ))}
              </div> */}
            </div>
            {/* Hero Visual */}
            <div className="relative lg:flex justify-center hidden">
              <div className="relative w-full max-w-md">
                <div className="wavy-circle mx-auto" style={{ '--s': '580px' }}>
                  <img src={hero_image} alt="Doctor consultation" className="shadow-strong" />
                </div>
                {/* Floating cards */}
                <div className="absolute -left-12 top-1/4 bg-white rounded-2xl shadow-strong p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Users size={18} className="text-teal-600" />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-800">500+</div>
                      <div className="text-xs text-neutral-500">Happy Patients</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-40 bottom-1/4 bg-white rounded-2xl shadow-strong p-4 animate-float animate-delay-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Star size={18} className="text-primary-600 fill-primary-600" />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-800">4.9 / 5.0</div>
                      <div className="text-xs text-neutral-500">Patient Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      {statsData.length > 0 && (
      <section className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className={statsData.length <= 2 ? "flex flex-wrap justify-center gap-8" : "grid grid-cols-2 lg:grid-cols-4 gap-8"}>
            {statsData.map(({ value, label, icon: Icon }) => (
              <div key={label} className={`text-center ${statsData.length <= 2 ? 'w-full sm:w-56' : ''}`}>
                <div className="flex justify-center mb-2">
                  <Icon size={28} className="text-teal-300" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-primary-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* SERVICES */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Our Expertise</div>
            <h2 className="section-title mb-4">Comprehensive Homeopathic Services</h2>
            <p className="section-subtitle mx-auto text-center">
              From prevention to treatment, our expert practitioners deliver exceptional holistic care across all major specializations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.slice(0, 8).map((service, i) => (
              <div key={service.id}
                className="card p-6 group cursor-pointer hover:-translate-y-1 transition-all duration-300 border"
                style={{ animationDelay: `${i * 50}ms` }}>
                <ServiceIcon name={service.icon}
                  colorClass={service.color === 'blue' ? 'bg-primary-100 text-primary-600' : 'bg-teal-100 text-teal-600'} />
                <h3 className="font-display font-semibold text-neutral-800 mt-4 mb-2 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-6">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary">View All Services <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src={about_us_image}
                alt="About Vaishnavi Homeo Care Clinic" className="rounded-3xl shadow-strong w-full object-cover" style={{ height: '440px' }} />
              <div className="absolute -bottom-6 -right-6 bg-primary-600 rounded-2xl p-6 shadow-strong hidden md:block">
                <div className="text-center text-white">
                  <div className="text-4xl font-display font-bold mb-1">14+</div>
                  <div className="text-sm text-primary-200 font-medium">Years of Excellence</div>
                </div>
              </div>
            </div>
            <div>
              <div className="section-label">About Vaishnavi Homeo Care Clinic</div>
              <h2 className="section-title mb-5">Your Trusted Healthcare Partner</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                At <b>Vaishnavi Homeo Care</b>, we provide personalized and holistic homeopathic treatment that focuses on addressing the root cause of health conditions. Our goal is to help patients achieve long-term wellness through safe, natural, and effective remedies.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                We offer specialized care for <b> migraines, gynecological disorders, piles, thyroid problems, PCOS, allergies, skin conditions, and hair loss, </b> with treatment plans tailored to each individual's needs. Our holistic approach aims to restore balance, strengthen immunity, and promote lasting health without harmful side effects.
              </p>
              <p className='text-neutral-600 leading-relaxed mb-3'> 
                As a trusted <b> Homeopathy Clinic in Raipur </b>, we are committed to delivering compassionate care and effective homeopathic solutions for individuals and families seeking natural healing.
              </p>
              <div className="grid grid-cols-2 gap-5 mb-8">
                {[
                  { label: 'Natural Healing', sub: 'Constitutional remedies' },
                  { label: 'Holistic Care Specialists', sub: 'Homeopathic consultants' },
                  { label: '2 Clinics', sub: 'Across Raipur' },
                  { label: 'Online Consults', sub: 'Always available' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                    <CheckCircle size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-800 text-sm">{item.label}</div>
                      <div className="text-xs text-neutral-500">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary">Learn More About Us <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Images Layout */}
            <div className="relative h-[600px] w-full hidden md:block">
              {/* Top Right */}
              <div className="absolute top-0 right-0 w-[70%] h-[55%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10">
                <img src={whychooseusimage1} alt="Why Choose Us 1" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              {/* Middle Left */}
              <div className="absolute top-[20%] left-0 w-[60%] h-[50%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20">
                <img src={whychooseusimage2} alt="Why Choose Us 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              {/* Bottom Right */}
              <div className="absolute bottom-0 right-[15%] w-[50%] h-[45%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-30">
                <img src={whychooseusimage3} alt="Why Choose Us 3" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>

            {/* Right side: Text and Grid */}
            <div>
              <div className="section-label mb-4">Why Choose Us</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">Why Choose Vaishnavi Homeo Care?</h2>
              <p className="text-neutral-500 text-lg mb-10 leading-relaxed max-w-xl">
                Your Trusted Partner in Holistic Health. With Expertise in Homeopathy, We're Here to Guide You Towards Lasting Wellness and Vitality.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { title: 'Experienced Doctor', desc: 'Benefit from the expertise of highly qualified homeopathy doctors in Raipur, ensuring accurate diagnosis and effective care.', icon: Award },
                  { title: 'Personalized Care', desc: 'Receive custom-tailored treatment plans designed specifically for your unique health profile, symptoms, and medical history.', icon: Users },
                  { title: 'Natural Healing', desc: "Embrace a safe, side-effect-free, and natural healing approach that works in harmony with your body's vital forces.", icon: Leaf },
                  { title: 'Chronic Diseases', desc: 'Find lasting relief and effective management strategies for stubborn chronic conditions that have resisted other treatments.', icon: Activity },
                  { title: 'Root Cause', desc: 'We focus on identifying and treating the underlying root cause of your ailments, rather than just suppressing surface symptoms.', icon: Sparkles },
                  { title: 'Holistic Solutions', desc: 'Experience comprehensive healthcare that nurtures your physical, mental, and emotional well-being for complete harmony.', icon: Heart },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100 group-hover:bg-teal-100 transition-colors">
                      <item.icon size={24} className="text-teal-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-neutral-800 font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3" title={item.desc}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCTORS HIGHLIGHT */}
      {false && (
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="section-label">Meet Our Experts</div>
              <h2 className="section-title">World-Class Medical Team</h2>
            </div>
            <Link to="/about" className="text-primary-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm">
              View Our Team <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map(doctor => (
              <div key={doctor.id} className="card group hover:-translate-y-1 transition-all duration-300 text-center p-6">
                <div className="relative inline-block mb-4">
                  <img src={doctor.image} alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto shadow-soft ring-4 ring-white" />
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${doctor.available ? 'bg-teal-400' : 'bg-neutral-300'}`} />
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">{doctor.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-1">{doctor.specialization}</p>
                <p className="text-xs text-neutral-400 mb-4">{doctor.experience} Experience</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <StarRating rating={doctor.rating} size={13} />
                  <span className="text-xs text-neutral-500 ml-1">{doctor.rating}</span>
                </div>
                <Link to="/appointment" className="btn-primary text-xs py-2 px-4 w-full justify-center">Book Consultation</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* TESTIMONIALS */}
      {testimonialsData.length > 0 && (
      <section className="py-20 bg-gradient-to-br from-primary-700 to-teal-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center text-teal-300">Patient Stories</div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">What Our Patients Say</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {(() => {
              const testimonial = testimonialsData[activeTestimonial]
              const reviewerName = testimonial.patientName ?? testimonial.patientName ?? 'Patient'
              const reviewText = testimonial.review ?? testimonial.text ?? ''
              const reviewDate = testimonial.date ? new Date(testimonial.date).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric'
              }) : ''
              const avatarInitial = (testimonial.patientName ?? reviewText ?? 'P')[0]?.toUpperCase() || 'P'

              return (
                <>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
                    <Quote size={48} className="text-white/20 mb-6" />
                    <p className="text-lg text-white/90 leading-relaxed mb-8 italic font-light">
                      "{reviewText}"
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                        {avatarInitial}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{reviewerName}</div>
                        {reviewDate && <div className="text-sm text-white/70">{reviewDate}</div>}
                      </div>
                      <div className="flex items-center gap-1">
                        <StarRating rating={testimonial.rating ?? 0} size={16} />
                      </div>
                    </div>
                  </div>
                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button onClick={() => setActiveTestimonial(p => (p - 1 + testimonialsData.length) % testimonialsData.length)}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex gap-2">
                      {testimonialsData.map((_, i) => (
                        <button key={i} onClick={() => setActiveTestimonial(i)}
                          className={`transition-all duration-300 rounded-full ${i === activeTestimonial ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40'}`} />
                      ))}
                    </div>
                    <button onClick={() => setActiveTestimonial(p => (p + 1) % testimonialsData.length)}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </section>
      )}

      {/* AWARDS PREVIEW */}
      {awardsData.length > 0 && (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Recognition</div>
            <h2 className="section-title">Awards & Accreditations</h2>
          </div>
          <div className={awardsData.length <= 2 ? 'flex flex-wrap justify-center gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {awardsData.slice(0, 3).map(award => (
                <div key={award.id} className={`card p-6 border border-amber-100 hover:border-amber-300 transition-all group ${awardsData.length <= 2 ? 'w-full sm:w-[320px]' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award size={22} className="text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs text-amber-600 font-semibold mb-1">{award.year}</div>
                      <h3 className="font-display font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">{award.name}</h3>
                      <p className="text-xs text-neutral-500">{award.description}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/awards" className="btn-secondary">View All Awards <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-primary-600 to-teal-600 rounded-3xl p-12 shadow-strong">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Your Health Can't Wait
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Book an appointment with our specialists today and take the first step towards better health.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-soft hover:shadow-medium active:scale-95">
                <CalendarDays size={18} /> Book Appointment
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all border border-white/30">
                <Phone size={18} /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
