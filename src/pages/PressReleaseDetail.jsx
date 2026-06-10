import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, ArrowLeft, Share2 } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { API_ENDPOINTS } from '../api/endpoints'

export default function PressReleaseDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [pressRelease, setPressRelease] = useState(null)
  const [error, setError] = useState(null)

  const structuredData = pressRelease
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: pressRelease.metaTitle || pressRelease.title,
        description: pressRelease.metaDescription || pressRelease.content?.replace(/<[^>]*>/g, '').slice(0, 160),
        image: pressRelease.coverImage,
        author: {
          '@type': 'Person',
          name: pressRelease.author || 'Vaishnavi Homeo Care Clinic'
        },
        datePublished: pressRelease.publishedDate || pressRelease.date
      }
    : null

  useEffect(() => {
    const loadPressRelease = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_ENDPOINTS.PRESS_RELEASES.GET_BY_SLUG(slug))
        if (!res.ok) throw new Error('Unable to fetch blog')

        const data = await res.json()
        setPressRelease(data)
      } catch (err) {
        console.error('Failed to load Blog:', err)
        setError('Blog not found')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadPressRelease()
    }
  }, [slug])

  if (loading) {
    return (
      <div>
        <PageHero
          title="Blog"
          subtitle="Loading..."
          breadcrumbs={[{ label: 'Blog' }]}
        />
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
              <div className="h-64 bg-neutral-200 rounded mt-6"></div>
              <div className="space-y-2 mt-6">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !pressRelease) {
    return (
      <div>
        <PageHero
          title="Blog"
          subtitle={error || 'Not found'}
          breadcrumbs={[{ label: 'Blog' }]}
        />
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-neutral-400 text-lg mb-6">{error || 'The blog you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-all"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        title={pressRelease.title}
        subtitle="Latest news and announcements"
        breadcrumbs={[{ label: 'Blog' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </button>

          {/* Featured Image */}
          {structuredData && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
          )}
          {pressRelease.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={pressRelease.coverImage}
                alt={pressRelease.imageAltText || pressRelease.title}
                loading="lazy"
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Article Metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-600">
              <Calendar size={18} />
              <span className="font-medium">
                {pressRelease.publishedDate || pressRelease.date || 'No date'}
              </span>
            </div>
            <button
              onClick={() => {
                const url = window.location.href
                navigator.share ? navigator.share({ title: pressRelease.title, url }) : navigator.clipboard.writeText(url)
              }}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          {/* Article Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            {pressRelease.title}
          </h1>

          {/* Article Content - Render as HTML */}
          <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
            {pressRelease.content ? (
              // Check if content looks like HTML
              pressRelease.content.includes('<') ? (
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: pressRelease.content }}
                />
              ) : (
                <p className="whitespace-pre-wrap">{pressRelease.content}</p>
              )
            ) : (
              <p className="text-neutral-400">No content available.</p>
            )}
          </div>

          {/* Additional Meta Information */}
          {pressRelease.author && (
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-neutral-700">By</span> {pressRelease.author}
              </p>
            </div>
          )}

          {/* Back Button at Bottom */}
          <div className="mt-12">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-all"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blogs
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
