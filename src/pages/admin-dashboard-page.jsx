import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import data from '../data/restaurants.json'
import { formatRupees } from '../lib/booking-price.js'
import { useAdminAuth } from '../hooks/use-admin-auth.js'
import { useVenueStore } from '../hooks/use-venue-store.js'
import { TableFloorPlan } from '../components/table-floor-plan.jsx'

export function AdminDashboardPage() {
  const { session, isAuthenticated, logout } = useAdminAuth()
  const { setManualTableReserved, isManualReserved, addTable, removeTable, reservationsForRestaurant } =
    useVenueStore()

  const [restaurantId, setRestaurantId] = useState(
    () => session?.restaurantId ?? data.restaurants[0]?.id ?? '',
  )
  const [adminPick, setAdminPick] = useState(null)
  const [newTableId, setNewTableId] = useState('')
  const [newSeats, setNewSeats] = useState(4)
  const [addMsg, setAddMsg] = useState('')

  const reservations = useMemo(() => reservationsForRestaurant(restaurantId), [reservationsForRestaurant, restaurantId])

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleAddTable = (e) => {
    e.preventDefault()
    setAddMsg('')
    const ok = addTable(restaurantId, newTableId, newSeats)
    if (ok) {
      setNewTableId('')
      setNewSeats(4)
      setAddMsg('Table added.')
    } else {
      setAddMsg('Could not add table—check ID is unique.')
    }
  }

  const handleRemove = () => {
    if (!adminPick?.id) return
    removeTable(restaurantId, adminPick.id)
    setAdminPick(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Owner dashboard</h1>
          <p className="mt-1 text-sm text-stone-600">
            Signed in as {session?.displayName} ({session?.email})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center justify-center rounded-xl bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Log out
          </button>
        </div>
      </div>

      <label className="mt-8 block max-w-md">
        <span className="text-sm font-medium text-stone-700">Restaurant</span>
        <select
          value={restaurantId}
          onChange={(e) => {
            setRestaurantId(e.target.value)
            setAdminPick(null)
          }}
          className="mt-1.5 w-full cursor-pointer rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
        >
          {data.restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-stone-900">Table layout management</h2>
          <p className="mt-1 text-sm text-stone-600">
            Tap a table to select it, then mark it reserved or available. Green = available, red = manually held.
          </p>
          <div className="mt-6">
            <TableFloorPlan
              mode="admin"
              restaurantId={restaurantId}
              adminSelectedId={adminPick?.id}
              onAdminSelect={(t) => setAdminPick(t)}
            />
          </div>
          {adminPick ? (
            <div className="mt-6 flex flex-wrap gap-2 rounded-xl border border-stone-100 bg-stone-50 p-4">
              <p className="w-full text-sm text-stone-600">
                Selected <span className="font-semibold text-stone-900">{adminPick.id}</span> · {adminPick.seats} seats ·
                currently{' '}
                {isManualReserved(restaurantId, adminPick.id) ? (
                  <span className="font-medium text-red-700">reserved (manual)</span>
                ) : (
                  <span className="font-medium text-emerald-700">available</span>
                )}
              </p>
              <button
                type="button"
                onClick={() => setManualTableReserved(restaurantId, adminPick.id, true)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                Mark as reserved
              </button>
              <button
                type="button"
                onClick={() => setManualTableReserved(restaurantId, adminPick.id, false)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Mark as available
              </button>
            </div>
          ) : null}
        </section>

        <div className="space-y-8">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Add table</h2>
            <form onSubmit={handleAddTable} className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-stone-600">Table ID</span>
                <input
                  value={newTableId}
                  onChange={(e) => setNewTableId(e.target.value)}
                  placeholder="e.g. T7"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-stone-600">Seats</span>
                <input
                  type="number"
                  min={1}
                  value={newSeats}
                  onChange={(e) => setNewSeats(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-600"
              >
                Add table
              </button>
              {addMsg ? <p className="text-xs text-stone-600">{addMsg}</p> : null}
            </form>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Remove table</h2>
            <p className="mt-1 text-xs text-stone-500">Select a table on the floor, then remove it from the layout.</p>
            <button
              type="button"
              disabled={!adminPick}
              onClick={handleRemove}
              className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove selected table
            </button>
          </section>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-stone-900">Reservation overview</h2>
        <p className="mt-1 text-sm text-stone-600">Guest bookings created from the public flow (stored locally in this demo).</p>
        {reservations.length === 0 ? (
          <p className="mt-6 text-sm text-stone-500">No reservations yet for this restaurant.</p>
        ) : (
          <ul className="mt-6 divide-y divide-stone-100">
            {reservations.map((r) => (
              <li key={r.id} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-stone-900">{r.guestName}</p>
                  <p className="text-sm text-stone-600">
                    Table {r.tableId} · {r.guests} {r.guests === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
                <div className="text-right text-sm text-stone-600">
                  <div>
                    {r.date} · {r.entryTime} – {r.exitTime}
                  </div>
                  {r.totalPrice != null ? (
                    <div className="mt-1 font-semibold text-teal-800">{formatRupees(r.totalPrice)}</div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
