import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} size={size}
          className={star <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' :
            star - 0.5 <= rating ? 'text-amber-400 fill-amber-200' : 'text-neutral-200 fill-neutral-200'} />
      ))}
    </div>
  )
}
