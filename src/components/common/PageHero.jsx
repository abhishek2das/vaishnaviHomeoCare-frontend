import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function PageHero({ title, subtitle, breadcrumbs = [] }) {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-teal-800 py-16 md:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '30px 30px'}} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-primary-200 mb-5" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home size={14} /> Home
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-primary-400" />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-white transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-primary-100 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
