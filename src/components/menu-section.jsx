import { useState, useEffect, useCallback } from 'react'
import { getMenuForRestaurant } from '../data/restaurant-menus.js'

export function MenuSection({ restaurantId }) {
  const menu = getMenuForRestaurant(restaurantId)
  const [modalIndex, setModalIndex] = useState(null)

  const pages = menu?.pages ?? []

  const openModal = (index) => setModalIndex(index)
  const closeModal = useCallback(() => setModalIndex(null), [])

  const nextImage = useCallback((e) => {
    if (e) e.stopPropagation()
    setModalIndex((prev) => (prev !== null ? (prev + 1) % pages.length : null))
  }, [pages.length])

  const prevImage = useCallback((e) => {
    if (e) e.stopPropagation()
    setModalIndex((prev) => (prev !== null ? (prev - 1 + pages.length) % pages.length : null))
  }, [pages.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalIndex === null) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalIndex, closeModal, nextImage, prevImage])

  useEffect(() => {
    if (modalIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modalIndex])

  if (!pages.length) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">Menu</h2>
        <p className="text-sm text-stone-500 italic">Menu not available</p>
      </section>
    )
  }

  return (
    <>
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-6">Menu</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {pages.map((page, idx) => (
            <div
              key={idx}
              className="group cursor-pointer"
              onClick={() => openModal(idx)}
            >
              <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-teal-300">
                <img
                  src={page.src}
                  alt={page.label}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-center text-sm font-medium text-stone-700">{page.label}</p>
            </div>
          ))}
        </div>
      </section>

      {modalIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/95 p-4 backdrop-blur-sm" onClick={closeModal}>
          {/* Close button */}
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-stone-800/50 p-2 text-stone-200 transition hover:bg-stone-700 hover:text-white sm:right-8 sm:top-8"
            onClick={(e) => { e.stopPropagation(); closeModal(); }}
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {/* Page indicator */}
          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-stone-800/70 px-4 py-1.5 text-xs font-medium text-stone-200 backdrop-blur sm:bottom-10">
            {pages[modalIndex].label} — {modalIndex + 1} / {pages.length}
          </div>

          {/* Previous */}
          <button
            type="button"
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-stone-800/80 text-white shadow-lg backdrop-blur transition hover:bg-stone-700 hover:scale-105 sm:left-12"
            onClick={prevImage}
            title="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          {/* Image */}
          <div className="relative mx-auto flex h-full max-h-[90vh] w-full max-w-4xl items-center justify-center p-2 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <img
              src={pages[modalIndex].src}
              alt={pages[modalIndex].label}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>

          {/* Next */}
          <button
            type="button"
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-stone-800/80 text-white shadow-lg backdrop-blur transition hover:bg-stone-700 hover:scale-105 sm:right-12"
            onClick={nextImage}
            title="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </>
  )
}
