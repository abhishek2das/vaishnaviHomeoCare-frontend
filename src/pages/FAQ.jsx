import { useState, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonText } from '../components/common/LoadingSkeleton'
import { faqs as fallbackFaqs } from '../data/mockData'
import { API_ENDPOINTS } from '../api/endpoints'

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`border-2 rounded-2xl transition-all duration-200 overflow-hidden ${isOpen ? 'border-primary-200 shadow-soft' : 'border-neutral-100 hover:border-primary-100'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className={`font-semibold text-sm md:text-base leading-snug transition-colors ${isOpen ? 'text-primary-700' : 'text-neutral-800'}`}>
          {question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-primary-100 text-primary-600 rotate-180' : 'bg-neutral-100 text-neutral-500'}`}>
          <ChevronDown size={16} />
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <div className="w-full h-px bg-primary-100 mb-4" />
          <p className="text-neutral-600 leading-relaxed text-sm md:text-base">{answer}</p>
        </div>
      )}
    </div>
  )
}

const normalizeFaqItem = (item, category = '') => {
  if (!item) return null
  if ('question' in item && 'answer' in item) {
    return {
      id: item.id ?? `${category}-${item.question}`,
      question: item.question,
      answer: item.answer,
      category: item.category ?? category
    }
  }
  if ('q' in item && 'a' in item) {
    return {
      id: item.id ?? `${category}-${item.q}`,
      question: item.q,
      answer: item.a,
      category: item.category ?? category
    }
  }
  return null
}

const flattenFallbackFaqs = (source) => {
  if (!Array.isArray(source)) return []
  return source.flatMap(group => {
    if (!Array.isArray(group.questions)) return []
    return group.questions
      .map(item => normalizeFaqItem(item, group.category))
      .filter(Boolean)
  })
}

export default function FAQ() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState({})

  useEffect(() => {
    let mounted = true

    const loadFaqs = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_ENDPOINTS.FAQS.GET_ALL)
        if (!res.ok) throw new Error('Failed to fetch FAQs')
        const json = await res.json()
        const items = Array.isArray(json)
          ? json.map(item => normalizeFaqItem(item)).filter(Boolean)
          : Array.isArray(json.content)
            ? json.content.map(item => normalizeFaqItem(item)).filter(Boolean)
            : []
        if (mounted) setData(items)
      } catch (err) {
        console.error('FAQ load error:', err)
        if (mounted) setData(flattenFallbackFaqs(fallbackFaqs))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadFaqs()
    return () => { mounted = false }
  }, [])

  const filteredFaqs = data.filter(faq => {
    if (!search) return true
    const query = search.toLowerCase()
    return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
  })

  const toggle = key => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div>
      <PageHero
        title="Patient FAQ"
        subtitle="Find quick answers to your questions about appointments, services, billing, and more."
        breadcrumbs={[{ label: 'Patient FAQ' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative mb-8">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-12 text-base py-4"
              aria-label="Search FAQs"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-2 border-neutral-100 rounded-2xl p-6">
                  <SkeletonText lines={2} />
                </div>
              ))}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle size={40} className="mx-auto text-neutral-300 mb-4" />
              <h3 className="font-display font-semibold text-neutral-600 mb-2">No FAQs found</h3>
              <p className="text-neutral-400 text-sm">Try a different search term or check back later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={!!openItems[faq.id]}
                  onToggle={() => toggle(faq.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-14 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-3xl p-8 text-center">
            <h3 className="font-display font-bold text-neutral-800 text-xl mb-2">Still Have Questions?</h3>
            <p className="text-neutral-500 mb-6 text-sm">Our patient support team is available to assist you Monday–Saturday, 8AM–8PM.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+911145678900" className="btn-primary text-sm py-2.5 px-6">Call Us Now</a>
              <a href="mailto:support@medicare-clinic.com" className="btn-secondary text-sm py-2.5 px-6">Email Support</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
