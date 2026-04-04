import { isEndAfterStart } from '../lib/time-range.js'
import { calculateBookingTotalPrice, formatRupees } from '../lib/booking-price.js'

export function EstimatedPriceBanner({ tableSeats, entryTime, exitTime, className = '' }) {
  const canQuote =
    tableSeats > 0 && entryTime && exitTime && isEndAfterStart(entryTime, exitTime)
  const total = canQuote ? calculateBookingTotalPrice(tableSeats, entryTime, exitTime) : null

  if (!canQuote) {
    return (
      <div
        className={`rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 ${className}`}
      >
        Select a table and valid entry/exit times to see your estimated price.
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white px-4 py-4 shadow-sm ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Estimated price</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-teal-900">{formatRupees(total)}</p>
      <p className="mt-2 text-xs text-teal-800/85">
        ₹10 per seat + ₹2 per hour of your sitting · {tableSeats} seat{tableSeats !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
