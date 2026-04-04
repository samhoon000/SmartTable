import { useNavigate } from 'react-router-dom'
import data from '../data/restaurants.json'
import { PopularRestaurantCard } from '../components/popular-restaurant-card.jsx'

const popular = data.restaurants.slice(0, 6)

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="relative isolate min-h-[min(520px,85vh)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/55 to-stone-900/80" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 lg:pb-24 lg:pt-40">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200/90">Reserve in seconds</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find a table for tonight—or plan ahead
            </h1>
            <p className="mt-4 max-w-xl text-lg text-stone-200/95">
              Browse trusted restaurants with real ratings and transparent availability-style booking—just like the apps
              you already use.
            </p>
          </div>
          <div className="mt-10 flex w-full justify-center px-1 sm:px-0">
            <button
              type="button"
              onClick={() => navigate('/restaurants')}
              className="rounded-full bg-teal-600 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-950/25 transition hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200 active:scale-[0.98]"
            >
              Search Restaurants
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Popular restaurants</h2>
            <p className="mt-2 max-w-xl text-stone-600">
              Highly rated spots guests book again and again—swipe sideways on mobile to explore.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="self-start text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
          >
            View all
          </button>
        </div>
        <div className="relative mt-8">
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin [-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-5 [&::-webkit-scrollbar]:h-2">
            {popular.map((r) => (
              <PopularRestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
