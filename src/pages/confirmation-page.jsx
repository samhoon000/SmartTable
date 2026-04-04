import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatRupees } from '../lib/booking-price.js'
import { useBooking } from '../hooks/use-booking.js'

function formatDisplayDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function ConfirmationPage() {
  const navigate = useNavigate()
  const { confirmedReservation } = useBooking()

  useEffect(() => {
    if (!confirmedReservation) navigate('/', { replace: true })
  }, [confirmedReservation, navigate])

  if (!confirmedReservation) {
    return null
  }

  const {
    restaurantName,
    date,
    time,
    guests,
    tableId,
    tableSeats,
    entryTime,
    exitTime,
    totalPrice,
    paidAmount,
    paymentMethodLabel,
    paymentConfirmationMessage,
  } = confirmedReservation
  const windowLabel =
    entryTime && exitTime ? `${entryTime} – ${exitTime}` : time
  const amountPaid = paidAmount ?? totalPrice

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-[0_1px_3px_rgb(0_0_0/0.06),0_12px_28px_rgb(0_0_0/0.06)] sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl text-teal-800">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900">You&apos;re Booked!</h1>
        <p className="mt-2 text-sm text-stone-600">
          Your table request is confirmed for the details below. A typical platform would email or text this summary.
        </p>
        {paymentConfirmationMessage ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-900">
            <p className="font-semibold">Payment confirmed</p>
            <p className="mt-1 text-emerald-800/95">{paymentConfirmationMessage}</p>
            {paymentMethodLabel ? (
              <p className="mt-2 text-xs text-emerald-800/80">Paid via {paymentMethodLabel}</p>
            ) : null}
            {amountPaid != null ? (
              <p className="mt-2 text-lg font-bold text-emerald-950">Amount paid: {formatRupees(amountPaid)}</p>
            ) : null}
          </div>
        ) : null}
        <div className="mt-8 rounded-xl border border-stone-100 bg-stone-50/90 p-5 text-left text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Reservation details</p>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Restaurant</dt>
              <dd className="text-right font-medium text-stone-900">{restaurantName}</dd>
            </div>
            {tableId ? (
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Table</dt>
                <dd className="text-right font-medium text-stone-900">
                  {tableId}
                  {tableSeats ? ` · ${tableSeats} seats` : ''}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Date</dt>
              <dd className="text-right font-medium text-stone-900">{formatDisplayDate(date)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Time</dt>
              <dd className="text-right font-medium text-stone-900">{windowLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Guests</dt>
              <dd className="text-right font-medium text-stone-900">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </dd>
            </div>
            {totalPrice != null ? (
              <div className="flex justify-between gap-4 border-t border-stone-200 pt-3">
                <dt className="text-stone-500">Booking total</dt>
                <dd className="text-right font-semibold text-teal-900">{formatRupees(totalPrice)}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/restaurants"
            className="inline-flex justify-center rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Find more tables
          </Link>
          <Link
            to="/"
            className="inline-flex justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
