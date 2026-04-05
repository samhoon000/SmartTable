import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import data from '../data/restaurants.json'
import { calculateBookingTotalPrice, formatRupees } from '../lib/booking-price.js'
import { isEndAfterStart } from '../lib/time-range.js'
import { useBooking } from '../hooks/use-booking.js'
import { useVenueStore } from '../hooks/use-venue-store.js'
import { CustomerReservationPick } from '../components/customer-reservation-pick.jsx'
import { EstimatedPriceBanner } from '../components/estimated-price-banner.jsx'

function formatDisplayDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

const STEP_META = [
  { n: 1, label: 'Table & time' },
  { n: 2, label: 'Guest details' },
  { n: 3, label: 'Confirm' },
]

export function BookingFlowPage() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { hasBookingConflict, syncRestaurant, getTables } = useVenueStore()
  const {
    restaurant,
    date,
    setDate,
    guests,
    setGuests,
    entryTime,
    setEntryTime,
    exitTime,
    setExitTime,
    tableId,
    setTableId,
    tableSeats,
    setTableSeats,
    step,
    setStep,
    guestName,
    setGuestName,
    phone,
    setPhone,
    email,
    setEmail,
    startBooking,
    openPaymentCheckout,
  } = useBooking()

  const [step1Error, setStep1Error] = useState('')

  const fromJson = data.restaurants.find((r) => r.id === restaurantId)

  useEffect(() => {
    if (!fromJson) return
    if (!restaurant || restaurant.id !== restaurantId) {
      startBooking({
        restaurant: fromJson,
        date: new Date().toISOString().slice(0, 10),
        guests: 2,
        tableId: '',
        tableSeats: 0,
        entryTime: '',
        exitTime: '',
        initialStep: 1,
      })
    }
  }, [restaurantId, fromJson, restaurant, startBooking])

  useEffect(() => {
    if (!fromJson) navigate('/restaurants', { replace: true })
  }, [fromJson, navigate])

  useEffect(() => {
    if (restaurantId) syncRestaurant(restaurantId)
  }, [restaurantId, syncRestaurant])

  if (!fromJson) {
    return null
  }

  if (!restaurant || restaurant.id !== restaurantId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-stone-600">
        Preparing your booking…
      </div>
    )
  }

  const goNext = () => setStep((s) => Math.min(3, s + 1))
  const goBack = () => setStep((s) => Math.max(1, s - 1))

  const step2Valid = guestName.trim() && phone.trim() && email.trim()

  const validateStep1 = () => {
    if (!tableId) return 'Please select an available table.'
    if (!entryTime || !exitTime) return 'Please choose entry and exit times.'
    if (!isEndAfterStart(entryTime, exitTime)) return 'Exit time must be after entry time.'
    if (guests > tableSeats) return `Party size exceeds table capacity (${tableSeats} seats).`
    if (hasBookingConflict(restaurant.id, tableId, date, entryTime, exitTime)) {
      return 'This table is not available for the selected date and time window.'
    }
    return ''
  }

  const handleStep1Next = () => {
    const err = validateStep1()
    setStep1Error(err)
    if (!err) goNext()
  }

  const handleSelectTable = (table) => {
    setTableId(table.id)
    setTableSeats(table.seats)
    setStep1Error('')
  }

  const handleProceedToPayment = () => {
    if (!openPaymentCheckout()) return
    navigate('/payment')
  }

  const selectedTableObj = tableId ? getTables(restaurantId).find(t => t.id === tableId) : null
  const displayTableName = selectedTableObj ? (selectedTableObj.displayName || selectedTableObj.id) : tableId

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2">
        {STEP_META.map((s, idx) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition duration-300',
                  step >= s.n ? 'bg-teal-700 text-white' : 'bg-stone-200 text-stone-600',
                ].join(' ')}
              >
                {s.n}
              </div>
              <span className="hidden text-[10px] font-medium uppercase tracking-wide text-stone-500 sm:block">
                {s.label}
              </span>
            </div>
            {idx < STEP_META.length - 1 ? (
              <div className="hidden h-0.5 w-4 bg-stone-200 sm:block md:w-6" aria-hidden />
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_3px_rgb(0_0_0/0.06),0_12px_28px_rgb(0_0_0/0.06)] transition-all duration-300 sm:p-8">
        {step === 1 && (
          <>
            <h1 className="text-xl font-semibold text-stone-900 sm:text-2xl">Select table & time</h1>
            <p className="mt-1 text-sm text-stone-600">
              Pick an available table, date, party size, and your planned entry and exit times.
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
            {step1Error ? <p className="mt-4 text-sm font-medium text-red-600">{step1Error}</p> : null}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="inline-flex justify-center rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Back to restaurant
              </Link>
              <button
                type="button"
                onClick={handleStep1Next}
                className="inline-flex justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-xl font-semibold text-stone-900 sm:text-2xl">Guest details</h1>
            <p className="mt-1 text-sm text-stone-600">Contact details the restaurant uses for confirmations.</p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Full name</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  autoComplete="name"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Phone number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex justify-center rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!step2Valid}
                onClick={goNext}
                className="inline-flex justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-xl font-semibold text-stone-900 sm:text-2xl">Confirm reservation</h1>
            <p className="mt-1 text-sm text-stone-600">
              Review your booking summary, then continue to secure payment—like OpenTable or Zomato Dining checkout.
            </p>
            <div className="mt-6 rounded-xl border border-stone-100 bg-stone-50/80 p-4 text-sm">
              <p className="font-semibold text-stone-900">{restaurant.name}</p>
              <p className="mt-2 text-stone-600">
                Table {displayTableName} · {tableSeats} seats
              </p>
              <p className="mt-1 text-stone-600">
                {formatDisplayDate(date)} · {entryTime} – {exitTime}
              </p>
              <p className="mt-1 text-stone-600">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </p>
              <p className="mt-3 border-t border-stone-200 pt-3 text-stone-600">
                {guestName}
                <br />
                {phone}
                <br />
                {email}
              </p>
            </div>
            <div className="mt-6 rounded-xl border-2 border-teal-200 bg-teal-50/90 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Total due</p>
              <p className="text-2xl font-bold text-teal-900">
                {formatRupees(
                  tableSeats && entryTime && exitTime && isEndAfterStart(entryTime, exitTime)
                    ? calculateBookingTotalPrice(tableSeats, entryTime, exitTime)
                    : 0,
                )}
              </p>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex justify-center rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="inline-flex justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/25 hover:bg-teal-600"
              >
                Continue to payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
