import { Link } from 'react-router-dom'

export default function OnlineChip({ to = '/appointment', text = 'Online Treatment Available' }) {
  return (
    <Link to={to} className="animated_chip inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-green-600/20 text-black border border-white/10 shadow-sm hover:scale-105 transform transition-all border-green-600/40">
      <span className="text-sm font-medium">{text}</span>
    </Link>
  )
}
