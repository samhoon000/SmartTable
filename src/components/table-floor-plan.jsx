import { useVenueStore } from '../hooks/use-venue-store.js'

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-600 sm:text-sm">
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-emerald-500 shadow-sm" aria-hidden />
        Available
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-red-500 shadow-sm" aria-hidden />
        Reserved
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-teal-600 ring-2 ring-teal-300 shadow-sm" aria-hidden />
        Selected
      </span>
    </div>
  )
}

/**
 * @param {'customer' | 'admin'} props.mode
 */
export function TableFloorPlan({
  mode,
  restaurantId,
  date,
  entryTime,
  exitTime,
  selectedTableId,
  onSelectTable,
  adminSelectedId,
  onAdminSelect,
}) {
  const { getTables, getTableUiStatus, isManualReserved, reservationsForRestaurant } = useVenueStore()
  const tables = getTables(restaurantId)

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Table layout</h3>
        {mode === 'customer' ? <Legend /> : null}
      </div>
      {mode === 'admin' ? (
        <p className="mt-2 text-xs text-stone-500">
          Legend: green = available · red = marked reserved (manual) · ring = selected for controls
        </p>
      ) : null}

      <div
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3"
        role={mode === 'customer' ? 'group' : undefined}
        aria-label="Restaurant floor tables"
      >
        {tables.map((table) => {
          const uiStatus =
            mode === 'admin'
              ? isManualReserved(restaurantId, table.id)
                ? 'reserved'
                : adminSelectedId === table.id
                  ? 'selected'
                  : 'available'
              : getTableUiStatus(restaurantId, table.id, date, entryTime, exitTime, selectedTableId)

          const isReserved = uiStatus === 'reserved'
          const isSelected = uiStatus === 'selected'

          const base =
            'relative flex min-h-[100px] flex-col justify-between rounded-xl border-2 p-3 text-left text-sm transition duration-200'

          const stateClass = isSelected
            ? 'border-teal-600 bg-teal-50 shadow-md ring-2 ring-teal-200'
            : isReserved
              ? 'cursor-not-allowed border-red-200 bg-red-50/90 text-stone-700 opacity-90'
              : 'cursor-pointer border-emerald-200 bg-emerald-50/80 hover:border-emerald-400 hover:shadow-md'

          const handleClick = () => {
            if (mode === 'admin') {
              onAdminSelect?.(table)
              return
            }
            if (!isReserved) onSelectTable?.(table)
          }

          return (
            <button
              key={table.id}
              type="button"
              disabled={mode === 'customer' && isReserved}
              onClick={handleClick}
              className={`${base} ${stateClass}`}
            >
              <div className="flex w-full items-start justify-between">
                <span className="font-bold text-stone-900">{table.displayName || table.id}</span>
                <span className="text-xs font-medium text-stone-600">{table.seats} seats</span>
              </div>
              <span
                className={[
                  'mt-1 inline-flex w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase',
                  isReserved ? 'bg-red-600 text-white' : isSelected ? 'bg-teal-700 text-white' : 'bg-emerald-600 text-white',
                ].join(' ')}
              >
                {isReserved && mode === 'admin' && isManualReserved(restaurantId, table.id) ? 'Manual' : isReserved ? 'Reserved' : isSelected ? 'Selected' : 'Available'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
