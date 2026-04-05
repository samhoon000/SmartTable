import { BOOKING_TIME_OPTIONS } from '../lib/time-slots.js'
import { isEndAfterStart } from '../lib/time-range.js'
import { TableFloorPlan } from './table-floor-plan.jsx'
import { useVenueStore } from '../hooks/use-venue-store.js'

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8]

export function CustomerReservationPick({
  restaurantId,
  date,
  onDateChange,
  guests,
  onGuestsChange,
  entryTime,
  onEntryChange,
  exitTime,
  onExitChange,
  selectedTableId,
  onSelectTable,
}) {
  const timeInvalid = entryTime && exitTime && !isEndAfterStart(entryTime, exitTime)
  const { allReservations } = useVenueStore()

  const isEntryTimeTaken = (t) => {
    if (!selectedTableId || !date) return false
    return allReservations.some((r) => {
      if (r.restaurantId !== restaurantId || r.tableId !== selectedTableId || r.date !== date) return false
      return t >= r.entryTime && t < r.exitTime
    })
  }

  const isExitTimeTaken = (t) => {
    if (!selectedTableId || !date) return false
    return allReservations.some((r) => {
      if (r.restaurantId !== restaurantId || r.tableId !== selectedTableId || r.date !== date) return false
      return t > r.entryTime && t <= r.exitTime
    })
  }

  return (
    <div className="space-y-6">
      <TableFloorPlan
        mode="customer"
        restaurantId={restaurantId}
        date={date}
        entryTime={entryTime}
        exitTime={exitTime}
        selectedTableId={selectedTableId}
        onSelectTable={onSelectTable}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Guests</span>
          <select
            value={guests}
            onChange={(e) => onGuestsChange(Number(e.target.value))}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
          >
            {guestOptions.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Entry time</span>
          <select
            value={entryTime}
            onChange={(e) => onEntryChange(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
          >
            <option value="">Select start</option>
            {BOOKING_TIME_OPTIONS.map((t) => {
              const taken = isEntryTimeTaken(t)
              return (
                <option 
                  key={t} 
                  value={t}
                  disabled={taken}
                  className={taken ? "text-red-600 bg-red-50" : ""}
                >
                  {t} {taken ? "(Reserved)" : ""}
                </option>
              )
            })}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Exit time</span>
          <select
            value={exitTime}
            onChange={(e) => onExitChange(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
          >
            <option value="">Select end</option>
            {BOOKING_TIME_OPTIONS.map((t) => {
              const taken = isExitTimeTaken(t)
              return (
                <option 
                  key={`e-${t}`} 
                  value={t}
                  disabled={taken}
                  className={taken ? "text-red-600 bg-red-50" : ""}
                >
                  {t} {taken ? "(Reserved)" : ""}
                </option>
              )
            })}
          </select>
        </label>
      </div>
      {timeInvalid ? (
        <p className="text-sm font-medium text-red-600">Exit time must be after entry time.</p>
      ) : null}
    </div>
  )
}

