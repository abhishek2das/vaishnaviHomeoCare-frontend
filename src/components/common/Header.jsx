import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone, Clock, MapPin, Heart } from 'lucide-react'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  {
    label: 'Media',
    children: [
      { label: 'Awards', path: '/awards' },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'Press Release', path: '/press' },
      { label: 'Photo Gallery', path: '/gallery' },
      { label: 'Video Gallery', path: '/videos' },
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
            <span className="flex items-center gap-1.5"><Clock size={12} /> Mon–Sat: 8AM–8PM | Sun: 9AM–5PM</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} /> 42, Healthcare Avenue, New Delhi – 110001</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+911145678900" className="flex items-center gap-1.5 hover:text-teal-200 transition-colors">
              <Phone size={12} /> Emergency: +91-11-4567-8900
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-medium py-2' : 'bg-white/95 backdrop-blur-sm py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-500 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow-blue transition-all duration-300">
              <Heart size={20} className="text-white" fill="white" />
            </div>
            <div>
              <div className="font-display font-bold text-xl text-neutral-800 leading-tight">Medicare</div>
              <div className="text-xs text-teal-600 font-medium tracking-wider">CLINIC</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
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
                    ${location.pathname === item.path ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}>
                    {item.label}
                  </Link>
                )}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-strong border border-neutral-100 py-2 animate-fade-in z-50">
                    {item.children.map(child => (
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
            <Link to="/enquiry" className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors">Enquiry</Link>
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
              {navItems.map(item => (
                <div key={item.label}>
                  {item.children ? (
                    <div>
                      <button onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        {item.label} <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 border-l-2 border-primary-100 pl-3 mt-1 space-y-1">
                          {item.children.map(child => (
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
