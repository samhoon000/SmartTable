import { useCallback, useMemo, useState } from 'react'
import { getRestaurantExtras } from '../lib/get-restaurant-extras.js'
import { reservationOverlaps } from '../lib/time-range.js'
import { VenueContext } from './venue-context.js'

const STORAGE_KEY = 'tablewise-venue-state'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function manualKey(restaurantId, tableId) {
  return `${restaurantId}::${tableId}`
}

export function VenueStoreProvider({ children }) {
  const [snapshot, setSnapshot] = useState(() => {
    const saved = loadPersisted()
    return {
      reservations: saved?.reservations ?? [],
      manualReserved: saved?.manualReserved ?? {},
      removedTableIds: saved?.removedTableIds ?? {},
      extraTables: saved?.extraTables ?? {},
    }
  })

  const setAndPersist = useCallback((updater) => {
    setSnapshot((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persist(next)
      return next
    })
  }, [])

  const getTables = useCallback(
    (restaurantId) => {
      const { tables: defaults } = getRestaurantExtras(restaurantId)
      const removed = new Set(snapshot.removedTableIds[restaurantId] ?? [])
      const extras = snapshot.extraTables[restaurantId] ?? []
      return [...defaults.filter((t) => !removed.has(t.id)), ...extras]
    },
    [snapshot.extraTables, snapshot.removedTableIds],
  )

  const isManualReserved = useCallback(
    (restaurantId, tableId) => snapshot.manualReserved[manualKey(restaurantId, tableId)] === true,
    [snapshot.manualReserved],
  )

  const hasBookingConflict = useCallback(
    (restaurantId, tableId, date, entryTime, exitTime, excludeId) => {
      return snapshot.reservations.some((r) => {
        if (r.restaurantId !== restaurantId || r.tableId !== tableId || r.date !== date) return false
        if (excludeId && r.id === excludeId) return false
        return reservationOverlaps(r.entryTime, r.exitTime, entryTime, exitTime)
      })
    },
    [snapshot.reservations],
  )

  const getTableUiStatus = useCallback(
    (restaurantId, tableId, date, entryTime, exitTime, selectedTableId) => {
      if (selectedTableId === tableId) return 'selected'
      if (isManualReserved(restaurantId, tableId)) return 'reserved'
      if (date && entryTime && exitTime && hasBookingConflict(restaurantId, tableId, date, entryTime, exitTime)) {
        return 'reserved'
      }
      return 'available'
    },
    [hasBookingConflict, isManualReserved],
  )

  const addReservation = useCallback(
    async (payload) => {
      try {
        const response = await fetch("http://localhost:5000/api/reservations/book-table", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            restaurantId: payload.restaurantId,
            tableId: payload.tableId,
            userName: payload.guestName,
            userEmail: payload.email || "test@example.com",
            date: payload.date,
            startTime: payload.entryTime,
            endTime: payload.exitTime,
            guests: payload.guests,
            totalPrice: payload.totalPrice,
          })
        });

        if (!response.ok) {
          throw new Error("Failed to book table");
        }

        const data = await response.json();
        
        const id = data.reservation?._id || 
          (typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `res-${Date.now()}-${Math.random().toString(16).slice(2)}`);

        setAndPersist((prev) => ({
          ...prev,
          reservations: [
            ...prev.reservations,
            {
              id,
              restaurantId: payload.restaurantId,
              tableId: payload.tableId,
              date: payload.date,
              entryTime: payload.entryTime,
              exitTime: payload.exitTime,
              guestName: payload.guestName,
              guests: payload.guests,
              restaurantName: payload.restaurantName,
              totalPrice: payload.totalPrice ?? null,
              createdAt: new Date().toISOString(),
            },
          ],
        }));

        return id;
      } catch (error) {
        console.error("Booking error:", error);
      }
    },
    [setAndPersist],
  )

  const setManualTableReserved = useCallback(
    (restaurantId, tableId, reserved) => {
      const key = manualKey(restaurantId, tableId)
      setAndPersist((prev) => {
        const next = { ...prev.manualReserved }
        if (reserved) next[key] = true
        else delete next[key]
        return { ...prev, manualReserved: next }
      })
    },
    [setAndPersist],
  )

  const addTable = useCallback(
    (restaurantId, tableId, seats) => {
      const id = tableId.trim()
      if (!id) return false
      const existing = getTables(restaurantId)
      if (existing.some((t) => t.id === id)) return false
      setAndPersist((prev) => ({
        ...prev,
        extraTables: {
          ...prev.extraTables,
          [restaurantId]: [...(prev.extraTables[restaurantId] ?? []), { id, seats: Number(seats) || 2 }],
        },
      }))
      return true
    },
    [getTables, setAndPersist],
  )

  const removeTable = useCallback(
    (restaurantId, tableId) => {
      const { tables: defaults } = getRestaurantExtras(restaurantId)
      const isDefault = defaults.some((t) => t.id === tableId)
      setAndPersist((prev) => {
        if (isDefault) {
          const set = new Set(prev.removedTableIds[restaurantId] ?? [])
          set.add(tableId)
          return {
            ...prev,
            removedTableIds: { ...prev.removedTableIds, [restaurantId]: [...set] },
            extraTables: {
              ...prev.extraTables,
              [restaurantId]: (prev.extraTables[restaurantId] ?? []).filter((t) => t.id !== tableId),
            },
          }
        }
        return {
          ...prev,
          extraTables: {
            ...prev.extraTables,
            [restaurantId]: (prev.extraTables[restaurantId] ?? []).filter((t) => t.id !== tableId),
          },
        }
      })
    },
    [setAndPersist],
  )

  const reservationsForRestaurant = useCallback(
    (restaurantId) => snapshot.reservations.filter((r) => r.restaurantId === restaurantId),
    [snapshot.reservations],
  )

  const value = useMemo(
    () => ({
      getTables,
      getTableUiStatus,
      isManualReserved,
      hasBookingConflict,
      addReservation,
      setManualTableReserved,
      addTable,
      removeTable,
      reservationsForRestaurant,
      allReservations: snapshot.reservations,
    }),
    [
      getTables,
      getTableUiStatus,
      isManualReserved,
      hasBookingConflict,
      addReservation,
      setManualTableReserved,
      addTable,
      removeTable,
      reservationsForRestaurant,
      snapshot.reservations,
    ],
  )

  return <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
}
