import { useState, useEffect, useRef } from 'react'
import { X, ImageOff, ChevronLeft, ChevronRight, Play, Maximize2, Calendar, FileText } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { API_ENDPOINTS } from '../api/endpoints'

// Custom Slider Component for individual cards
const MediaSlider = ({ media, onMediaClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  if (!media || media.length === 0) return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <ImageOff size={40} className="text-gray-300" />
    </div>
  );

  // reset index when media changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [media])

  // auto-slide logic
  useEffect(() => {
    if (!media || media.length <= 1) return;
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 1500);

    return () => clearInterval(intervalRef.current);
  }, [media, isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  return (
    <div
      className="relative w-full h-full group/slider overflow-hidden rounded-2xl border border-gray-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {media.map((m, idx) => (
          <div 
            key={m.id || idx} 
            className="w-full h-full flex-shrink-0 cursor-pointer relative"
            onClick={() => onMediaClick(idx)}
          >
            {m.type === 'VIDEO' ? (
              <div className="w-full h-full relative bg-black">
                <video src={m.url} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play size={24} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={m.url}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-primary-900/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Maximize2 size={24} className="text-white drop-shadow-md" />
            </div>
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {media.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-bold">
        {currentIndex + 1} / {media.length}
      </div>
    </div>
  );
};

export default function PatientFeedback() {
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [lightbox, setLightbox] = useState(null) // { feedbackIdx, mediaIdx }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_ENDPOINTS.PATIENT_FEEDBACK.GET_ALL}?page=0&limit=100`)
        if (!res.ok) throw new Error('Failed to fetch feedback')
        const json = await res.json()
        if (mounted) {
          setFeedbackList(json.content || [])
          setError(false)
        }
      } catch (err) {
        console.error('Patient feedback load error:', err)
        if (mounted) {
          setFeedbackList([])
          setError(true)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [retryTrigger])

  const openLightbox = (fIdx, mIdx) => setLightbox({ feedbackIdx: fIdx, mediaIdx: mIdx })
  const closeLightbox = () => setLightbox(null)

  const navigateLightbox = (dir) => {
    if (!lightbox) return
    const { feedbackIdx, mediaIdx } = lightbox
    const media = feedbackList[feedbackIdx].media
    const newIdx = (mediaIdx + dir + media.length) % media.length
    setLightbox({ ...lightbox, mediaIdx: newIdx })
  }

  const selectMediaIdx = (idx) => {
    if (!lightbox) return
    setLightbox({ ...lightbox, mediaIdx: idx })
  }

  useEffect(() => {
    if (!lightbox) return
    const handler = e => {
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
      if (e.key === 'ArrowRight') navigateLightbox(1)
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  const formatDate = (val) => {
    if (!val) return '';
    return new Date(val).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-20">
      <PageHero
        title="Patient Success Stories"
        subtitle="Witness real transformations and clinical results from our homeopathy care."
        breadcrumbs={[{ label: 'Patient Progress' }]}
      />

      <section className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 px-8 bg-white rounded-[2.5rem] shadow-soft-xl border border-gray-100">
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary-600">
              <ImageOff size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Feedback Stories Yet</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Check back soon for more patient transformations.
            </p>
            <button onClick={() => setRetryTrigger(prev => prev + 1)}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all"
            >
              Refresh Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {feedbackList.map((item, fIdx) => (
              <div 
                key={item.id} 
                className=" rounded-3xl shadow-soft-xl border border-gray-200 overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl"
              >
                <div className="relative aspect-[3/2] p-3">
                  <MediaSlider 
                    media={item.media} 
                    onMediaClick={(mIdx) => openLightbox(fIdx, mIdx)} 
                  />
                </div>
                <div className="p-6 pt-2 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <div className="w-12 h-1.5 bg-primary-100 rounded-full mb-4 group-hover:w-20 transition-all duration-500"></div>
                  <div
                    className="text-gray-500 text-sm leading-relaxed flex-1 mb-6"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    dangerouslySetInnerHTML={{ __html: item.description || 'Success story of a patient treated at Vaishnavi Homeo Care.' }}
                  />
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <button 
                      onClick={() => openLightbox(fIdx, 0)}
                      className="text-primary-700 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all px-4 py-2 bg-primary-100 rounded-xl hover:bg-primary-100"
                    >
                      Case Details <ChevronRight size={16} />
                    </button>
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                      {item.media?.length || 0} Assets
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-[#0a0c10] flex items-center justify-center p-4 md:p-8 overflow-hidden"
          onClick={closeLightbox}
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-20 bg-[#161920] border-b border-white/5">
             <div className="flex items-center gap-4">
                <div className="bg-primary-600 p-2 rounded-xl shadow-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg leading-none">{feedbackList[lightbox.feedbackIdx].title}</h4>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1.5 font-bold">Patient Transformation Case</p>
                </div>
             </div>
             <button
              onClick={closeLightbox}
              className="w-11 h-11 bg-[#252a34] hover:bg-[#323946] border border-white/10 rounded-xl flex items-center justify-center text-white transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          
          {/* Main Content Area */}
          <div onClick={e => e.stopPropagation()} className="w-full h-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center gap-8 pt-24 pb-12">
            
            {/* Media Section */}
            <div className="flex-1 w-full h-full flex flex-col gap-6 items-center min-w-0">
              <div className="relative flex-1 w-full bg-[#11141a] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group/main">
                {feedbackList[lightbox.feedbackIdx].media[lightbox.mediaIdx].type === 'VIDEO' ? (
                  <video 
                    src={feedbackList[lightbox.feedbackIdx].media[lightbox.mediaIdx].url} 
                    controls 
                    autoPlay
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <img
                    src={feedbackList[lightbox.feedbackIdx].media[lightbox.mediaIdx].url}
                    alt=""
                    className="w-full h-full object-contain p-4"
                  />
                )}

                {/* Navigation Arrows */}
                {feedbackList[lightbox.feedbackIdx].media.length > 1 && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); navigateLightbox(-1) }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#161920]/80 hover:bg-[#161920] border border-white/10 rounded-xl flex items-center justify-center text-white transition-all opacity-0 group-hover/main:opacity-100 hover:scale-110 shadow-xl"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); navigateLightbox(1) }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#161920]/80 hover:bg-[#161920] border border-white/10 rounded-xl flex items-center justify-center text-white transition-all opacity-0 group-hover/main:opacity-100 hover:scale-110 shadow-xl"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Strip */}
              {feedbackList[lightbox.feedbackIdx].media.length > 1 && (
                <div className="flex items-center gap-3 p-3 bg-[#161920] rounded-2xl border border-white/5 shadow-lg">
                  {feedbackList[lightbox.feedbackIdx].media.map((m, idx) => (
                    <button
                      key={m.id || idx}
                      onClick={() => selectMediaIdx(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${idx === lightbox.mediaIdx ? 'border-primary-500 scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                      {m.type === 'VIDEO' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Play size={16} className="text-white fill-white" />
                        </div>
                      ) : (
                        <img src={m.url} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="hidden lg:flex flex-col w-[400px] self-stretch">
              <div className="bg-[#161920] rounded-2xl p-6 border border-white/5 h-full flex flex-col min-h-0 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-[2px] w-8 bg-primary-500"></div>
                  <span className="text-primary-400 text-[10px] font-black uppercase tracking-[0.3em]">Patient Journey</span>
                </div>
                
                <h4 className="text-white text-3xl font-bold mb-8 leading-tight">
                  {feedbackList[lightbox.feedbackIdx].title}
                </h4>

                <div className="space-y-8 flex-1">
                  <div className="bg-[#1c212b] rounded-2xl p-7 border border-white/5 max-h-44 overflow-auto">
                    <div className="flex items-center gap-3 text-white/50 mb-4 text-xs font-bold uppercase tracking-[0.1em]">
                      <FileText size={16} className="text-primary-500" /> Case Summary
                    </div>
                    <div className="text-gray-300 text-[15px] leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: feedbackList[lightbox.feedbackIdx].description || 'Detailed success story of the patient treatment process.' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1c212b] rounded-2xl p-6 border border-white/5">
                      <div className="flex items-center gap-3 text-white/50 mb-2.5 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar size={14} className="text-primary-400" /> Updated
                      </div>
                      <p className="text-white text-sm font-bold">{formatDate(feedbackList[lightbox.feedbackIdx].createdAt)}</p>
                    </div>
                    <div className="bg-[#1c212b] rounded-2xl p-6 border border-white/5">
                      <div className="flex items-center gap-3 text-white/50 mb-2.5 text-[10px] font-bold uppercase tracking-widest">
                        <Maximize2 size={14} className="text-primary-400" /> Assets
                      </div>
                      <p className="text-white text-sm font-bold">{feedbackList[lightbox.feedbackIdx].media.length} Files</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-loose">
                    Clinical documentation by <br/> Vaishnavi Homeo Care
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Metadata */}
            <div className="lg:hidden text-center pb-6 px-4">
              <h4 className="text-white text-xl font-bold">{feedbackList[lightbox.feedbackIdx].title}</h4>
              <p className="text-white/50 text-xs mt-3 font-semibold uppercase tracking-widest">
                File {lightbox.mediaIdx + 1} of {feedbackList[lightbox.feedbackIdx].media.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
