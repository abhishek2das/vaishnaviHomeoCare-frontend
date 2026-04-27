export function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="w-12 h-12 bg-neutral-200 rounded-xl mb-4" />
      <div className="h-5 bg-neutral-200 rounded-lg w-3/4 mb-3" />
      <div className="space-y-2">
        <div className="h-3.5 bg-neutral-100 rounded-lg w-full" />
        <div className="h-3.5 bg-neutral-100 rounded-lg w-5/6" />
        <div className="h-3.5 bg-neutral-100 rounded-lg w-4/6" />
      </div>
    </div>
  )
}

export function SkeletonDoctorCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4" />
      <div className="h-5 bg-neutral-200 rounded-lg w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-neutral-100 rounded-lg w-1/2 mx-auto mb-4" />
      <div className="h-9 bg-neutral-200 rounded-xl" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 bg-neutral-200 rounded-lg ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  )
}
