import { timeToMinutes } from './time-range.js'

/** Duration in fractional hours (same calendar day). */
export function bookingDurationHours(entryTime, exitTime) {
  const start = timeToMinutes(entryTime)
  const end = timeToMinutes(exitTime)
  if (start === null || end === null || end <= start) return 0
  return (end - start) / 60
}

/**
 * ₹10 per seat (one-time) + ₹2 per hour (flat, not per seat).
 * @returns {number} total in ₹ (2 decimal places max)
 */
export function calculateBookingTotalPrice(tableSeats, entryTime, exitTime) {
  const seats = Number(tableSeats) || 0
  const hours = bookingDurationHours(entryTime, exitTime)
  const total = seats * 10 + hours * 2
  return Math.round(total * 100) / 100
}

export function formatRupees(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '₹0'
  const n = Number(amount)
  return n % 1 === 0 ? `₹${n}` : `₹${n.toFixed(2)}`
}
