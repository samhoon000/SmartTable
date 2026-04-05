import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '../data/restaurants.json'
import { RestaurantGridCard } from '../components/restaurant-grid-card.jsx'

const allCuisines = [...new Set(data.restaurants.flatMap((r) => r.cuisine.split(',').map((c) => c.trim())))].sort()

export function RestaurantListingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const areaFromUrl = searchParams.get('area') ?? ''

  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState(areaFromUrl)
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [priceFilter, setPriceFilter] = useState('all')
  const [minRating, setMinRating] = useState('0')
  const [bookingsToday, setBookingsToday] = useState({})

  useEffect(() => {
    setLocationFilter(areaFromUrl)
  }, [areaFromUrl])

  useEffect(() => {
    fetch('/api/reservations/today')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setBookingsToday(data)
        }
      })
      .catch(() => {
        setBookingsToday({})
      })
  }, [])

  const toggleCuisine = (c) => {
    setSelectedCuisines((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const filtered = useMemo(() => {
    const min = Number(minRating) || 0
    const sq = searchQuery.trim().toLowerCase()
    const loc = locationFilter.trim().toLowerCase()
    return data.restaurants.filter((r) => {
      const matchesSearch =
        !sq ||
        r.name.toLowerCase().includes(sq) ||
        r.cuisine.toLowerCase().includes(sq)

      const matchesLocation = !loc || r.location.toLowerCase().includes(loc)

      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.some((c) => r.cuisine.split(',').map((x) => x.trim()).includes(c))

      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === '2' && r.priceRange === '₹₹') ||
        (priceFilter === '3' && r.priceRange === '₹₹₹')

      const matchesRating = r.rating >= min

      return matchesSearch && matchesLocation && matchesCuisine && matchesPrice && matchesRating
    })
  }, [searchQuery, locationFilter, selectedCuisines, priceFilter, minRating])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Restaurants</h1>
          <p className="mt-1 text-sm text-stone-600">
            Filter by location, cuisine, price, and rating—then book a table in a few taps.
          </p>
        </div>
        <p className="text-sm text-stone-500 sm:shrink-0">
          {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:gap-10">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-20">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Filters</h2>

            <div className="mt-5">
              <p className="text-sm font-medium text-stone-900">Search</p>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, cuisine"
                className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-600/0 focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-stone-900" htmlFor="filter-location">
                Location
              </label>
              <input
                id="filter-location"
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Enter location"
                className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-600/0 focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-stone-900">Cuisine</p>
              <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1 text-sm">
                {allCuisines.map((c) => (
                  <li key={c}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={selectedCuisines.includes(c)}
                        onChange={() => toggleCuisine(c)}
                        className="size-4 rounded border-stone-300 text-teal-700 focus:ring-teal-600"
                      />
                      <span className="text-stone-700">{c}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-stone-900">Price</p>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  { id: 'all', label: 'All' },
                  { id: '2', label: '₹₹' },
                  { id: '3', label: '₹₹₹' },
                ].map((opt) => (
                  <label key={opt.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 hover:bg-stone-50">
                    <input
                      type="radio"
                      name="price"
                      value={opt.id}
                      checked={priceFilter === opt.id}
                      onChange={() => setPriceFilter(opt.id)}
                      className="size-4 border-stone-300 text-teal-700 focus:ring-teal-600"
                    />
                    <span className="text-stone-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-stone-900" htmlFor="rating-filter">
                Minimum rating
              </label>
              <select
                id="rating-filter"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
              >
                <option value="0">Any</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCuisines([])
                setPriceFilter('all')
                setMinRating('0')
                setSearchQuery('')
                setLocationFilter('')
                navigate('/restaurants', { replace: true })
              }}
              className="mt-6 w-full rounded-xl border border-stone-200 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Clear filters
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-12 text-center text-stone-600">
              No restaurants match your filters. Try clearing filters or broadening your search.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <RestaurantGridCard
                  key={r.id}
                  restaurant={r}
                  guestsToday={bookingsToday[r.id] ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
