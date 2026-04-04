import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import data from '../data/restaurants.json'
import { getRestaurantExtras } from '../lib/get-restaurant-extras.js'
import { isEndAfterStart } from '../lib/time-range.js'
import { useBooking } from '../hooks/use-booking.js'
import { useVenueStore } from '../hooks/use-venue-store.js'
import { StarRating } from '../components/star-rating.jsx'
import { MenuSection } from '../components/menu-section.jsx'
import { CustomerReservationPick } from '../components/customer-reservation-pick.jsx'
import { EstimatedPriceBanner } from '../components/estimated-price-banner.jsx'

function defaultDate() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function RestaurantDetailPage() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { startBooking } = useBooking()
  const { hasBookingConflict } = useVenueStore()

  const restaurant = useMemo(
    () => data.restaurants.find((r) => r.id === restaurantId),
    [restaurantId],
  )

  const extras = useMemo(
    () => (restaurant ? getRestaurantExtras(restaurant.id) : { menuCategories: [] }),
    [restaurant],
  )

  const [date, setDate] = useState(defaultDate)
  const [guests, setGuests] = useState(2)
  const [tableId, setTableId] = useState('')
  const [tableSeats, setTableSeats] = useState(0)
  const [entryTime, setEntryTime] = useState('')
  const [exitTime, setExitTime] = useState('')
  const [formError, setFormError] = useState('')

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-stone-900">Restaurant not found</h1>
        <Link to="/restaurants" className="mt-4 inline-block font-medium text-teal-800 hover:underline">
          Back to restaurants
        </Link>
      </div>
    )
  }

  const handleSelectTable = (table) => {
    setTableId(table.id)
    setTableSeats(table.seats)
    setFormError('')
  }

  const handleContinue = () => {
    if (!tableId) {
      setFormError('Please select an available table.')
      return
    }
    if (!entryTime || !exitTime) {
      setFormError('Please choose entry and exit times.')
      return
    }
    if (!isEndAfterStart(entryTime, exitTime)) {
      setFormError('Exit time must be after entry time.')
      return
    }
    if (guests > tableSeats) {
      setFormError(`Party size exceeds table capacity (${tableSeats} seats). Choose a larger table.`)
      return
    }
    if (hasBookingConflict(restaurant.id, tableId, date, entryTime, exitTime)) {
      setFormError('This table is not available for the selected date and time window.')
      return
    }
    setFormError('')
    startBooking({
      restaurant,
      date,
      guests,
      tableId,
      tableSeats,
      entryTime,
      exitTime,
      initialStep: 2,
    })
    navigate(`/book/${restaurant.id}`)
  }

  return (
    <div>
      <div className="relative h-[min(52vh,420px)] w-full overflow-hidden sm:h-[min(48vh,480px)]">
        <img src={restaurant.bannerImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/35 to-stone-900/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <p className="text-sm font-medium text-teal-200/95">{restaurant.cuisine}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {restaurant.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-200">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
              <StarRating value={restaurant.rating} />
              <span className="font-medium text-white">{restaurant.rating.toFixed(1)}</span>
              <span className="text-stone-300">({restaurant.reviewCount} reviews)</span>
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">{restaurant.priceRange}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">{restaurant.location}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_min(400px)] lg:gap-12 xl:grid-cols-[1fr_min(420px)]">
          <div className="space-y-10">
            <MenuSection menuCategories={extras.menuCategories} />

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-stone-900">About</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{restaurant.description}</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Opening hours</h3>
                  <ul className="mt-2 space-y-1 text-sm text-stone-700">
                    {restaurant.openingHours.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Contact</h3>
                  <ul className="mt-2 space-y-1 text-sm text-stone-700">
                    <li>{restaurant.phone}</li>
                    <li>{restaurant.email}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-lg font-semibold text-stone-900">Reviews</h2>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <StarRating value={restaurant.rating} />
                  <span className="font-semibold text-stone-900">{restaurant.rating.toFixed(1)}</span>
                  <span>· {restaurant.reviewCount} reviews</span>
                </div>
              </div>
              <ul className="mt-6 divide-y divide-stone-100">
                {restaurant.reviews.map((rev) => (
                  <li key={rev.author + rev.date} className="py-5 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-stone-900">{rev.author}</span>
                      <span className="text-sm text-stone-500">{rev.date}</span>
                    </div>
                    <div className="mt-1">
                      <StarRating value={rev.rating} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{rev.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_3px_rgb(0_0_0/0.06),0_12px_28px_rgb(0_0_0/0.06)] sm:p-7">
              <h2 className="text-lg font-semibold text-stone-900">Reserve a table</h2>
              <p className="mt-1 text-sm text-stone-600">
                Choose an available table, then set your arrival and planned finish time—similar to floor-plan booking
                flows.
              </p>

              <div className="mt-6">
                <CustomerReservationPick
                  restaurantId={restaurant.id}
                  date={date}
                  onDateChange={setDate}
                  guests={guests}
                  onGuestsChange={setGuests}
                  entryTime={entryTime}
                  onEntryChange={setEntryTime}
                  exitTime={exitTime}
                  onExitChange={setExitTime}
                  selectedTableId={tableId}
                  onSelectTable={handleSelectTable}
                />
              </div>

              <EstimatedPriceBanner
                className="mt-6"
                tableSeats={tableSeats}
                entryTime={entryTime}
                exitTime={exitTime}
              />

              {formError ? <p className="mt-4 text-sm font-medium text-red-600">{formError}</p> : null}

              <button
                type="button"
                onClick={handleContinue}
                className="mt-6 w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/25 transition hover:bg-teal-600 active:scale-[0.99]"
              >
                Continue to booking
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
