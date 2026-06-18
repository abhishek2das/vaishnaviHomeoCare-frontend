import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone, Clock, MapPin, Heart } from 'lucide-react'
import image from '../../assets/site_logo_v2.webp'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blog' },
  {
    label: 'Media',
    children: [
      { label: 'Awards', path: '/awards', hidden: true },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'Photo Gallery', path: '/gallery' },
      { label: 'Video Gallery', path: '/videos' },
      { label: 'Patient Progress', path: '/patient-feedback' },
    ]
  },
  { label: 'Patient FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsOpen(false); setActiveDropdown(null) }, [location])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-700 text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Clock size={12} /> Mon-Thu: 11:00 AM – 1:30PM (Wallfort Woods) | Fri: 5:30 PM – 6:30 PM (Kripa Day Care)</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} /> C-302, Wallfort Woods, Vidhan sabha road, Raipur</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+911145678900" className="flex items-center gap-1.5 hover:text-teal-200 transition-colors">
              <Phone size={12} /> Dr. Prachi Jha: +91 81038 28005
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 
        ${scrolled ? 'm-2 top-2' : ''}`}>
        <div className={`max-w-7xl py-4  rounded-full border-2  bg-white/60  backdrop-blur-md mx-auto px-4 flex items-center justify-between
          ${scrolled ? 'shadow-lg' : ''}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-48 flex items-center justify-center">
              <img src={image} alt="Medicare Clinic Logo" className="w-full h-auto" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.filter(item => !item.hidden).map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${activeDropdown === item.label ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}
                    aria-expanded={activeDropdown === item.label} aria-haspopup="true">
                    {item.label} <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link to={item.path} className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 block
                    ${location.pathname === item.path ? 'text-primary-700 font-bold bg-primary-100' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}>
                    {item.label}
                  </Link>
                )}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-strong border-2 border-neutral-100 py-2 animate-fade-in z-50">
                    {item.children.filter(child => !child.hidden).map(child => (
                      <Link key={child.path} to={child.path}
                        className="block px-4 py-2.5 text-sm text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/appointment" className="btn-primary text-sm py-2.5 px-5">Book Appointment</Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu" aria-expanded={isOpen}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-100 shadow-medium animate-slide-up">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.filter(item => !item.hidden).map(item => (
                <div key={item.label}>
                  {item.children ? (
                    <div>
                      <button onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        {item.label} <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 border-l-2 border-primary-100 pl-3 mt-1 space-y-1">
                          {item.children.filter(child => !child.hidden).map(child => (
                            <Link key={child.path} to={child.path}
                              className="block px-3 py-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={item.path}
                      className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'}`}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                <Link to="/enquiry" className="btn-secondary text-sm py-2.5 text-center">Enquiry</Link>
                <Link to="/appointment" className="btn-primary text-sm py-2.5 text-center">Book Appointment</Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
