import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { API_ENDPOINTS } from '../api/endpoints'
import image from  '../assets/about_image.png'
export default function Services() {
  const [serviceList, setServiceList] = useState([])

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SERVICES.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch services')

        const data = await res.json()
        const servicesData = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []

        if (servicesData.length > 0) {
          setServiceList(servicesData.map((item) => ({
            id: item.id,
            title: item.serviceName ?? item.title,
            description: item.description,
            image: item.imageUrl,
          })))
        }
      } catch (error) {
        console.error('Failed to load services:', error)
      }
    }

    loadServices()
  }, [])

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
          {serviceList.length > 0 && (
            <div className={serviceList.length <= 2 ? "flex flex-wrap justify-center gap-7" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"}>
              {serviceList.map((service) => (
                <div key={service.id} className={`card overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${serviceList.length <= 2 ? 'w-full sm:w-96' : ''}`}>
                <div className="h-52 overflow-hidden">
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1517638851339-4aab2aaaa97b?q=80&w=900&auto=format&fit=crop'}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-display font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 leading-relaxed mb-5 text-sm">{service.description}</p>
                  <Link to="/appointment"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-all group-hover:gap-3">
                    Book Consultation <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us for Services */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Why Vaishnavi Homeo Care Clinic</div>
              <h2 className="section-title mb-6">Excellence Across Every Specialization</h2>
              <div className="space-y-5">
                {[
  {
    title: "Women's Health Care",
    desc: "Comprehensive homeopathic treatment for PCOD, menstrual disorders, fibroids, leucorrhoea, and infertility with a personalized approach."
  },
  {
    title: "Migraine Treatment",
    desc: "Safe and effective homeopathic solutions to help manage chronic migraines and recurring headaches naturally."
  },
  {
    title: "Digestive & Anorectal Care",
    desc: "Specialized treatment for piles, fistula, constipation, gas, and other digestive concerns without invasive procedures."
  },
  {
    title: "Joint & Spine Care",
    desc: "Holistic management of joint pain, arthritis-related discomfort, and disc prolapse to improve mobility and quality of life."
  },
  {
    title: "Skin & Hair Care",
    desc: "Personalized remedies for psoriasis, allergies, hair fall, and leucoderma to promote healthier skin and hair."
  },
  {
    title: "Respiratory Care",
    desc: "Natural treatment options for asthma, sinusitis, chronic cough, recurrent colds, and other respiratory conditions."
  }
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
              <img src={image}
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
