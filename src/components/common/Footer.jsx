import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowRight } from 'lucide-react'
import image from '../../assets/site_logo_v2.webp'
const quickLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Our Services', path: '/services' },
  { label: 'Awards', path: '/awards' },
  { label: 'Patient FAQ', path: '/faq' },
  { label: 'Blog', path: '/press' },
]

const socials = [
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61589584573491' },

  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/vaishnavihomeocarer/' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/channel/UCBjZIsKVo17OktrbJwzj_xA' },

]

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-64 brightness-0 invert flex items-center justify-center">
                <img src={image} alt="Medicare Clinic Logo" />
              </div>

            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              Providing world-class homeopathic care with compassion and innovation since 2008. Your health is our highest priority.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} target='_blank'
                  className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="ml-0 md:ml-12 lg:ml-24">
            <h4 className="font-display font-semibold text-white mb-5 text-base">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-neutral-400 hover:text-teal-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-base">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-400">C-302, Wallfort Woods,<br />Vidhan sabha road,<br />Raipur – 492001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-teal-400 flex-shrink-0" />
                <div>
                  <a href="tel:+911145678900" className="text-sm text-neutral-400 hover:text-teal-400 transition-colors block">+91 81038 28005</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-teal-400 flex-shrink-0" />
                <a href="mailto:dr.prachijha15@gmail.com" className="text-sm text-neutral-400 hover:text-teal-400 transition-colors">
                  dr.prachijha15@gmail.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">© 2026 Vaishnavi Homeo Care. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
