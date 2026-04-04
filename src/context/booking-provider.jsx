import { useCallback, useMemo, useState } from 'react'
import { calculateBookingTotalPrice } from '../lib/booking-price.js'
import { BookingContext } from './booking-context.js'

export function BookingProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [entryTime, setEntryTime] = useState('')
  const [exitTime, setExitTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [tableId, setTableId] = useState('')
  const [tableSeats, setTableSeats] = useState(0)
  const [step, setStep] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [pendingPayment, setPendingPayment] = useState(null)
  const [confirmedReservation, setConfirmedReservation] = useState(null)

  const resetBooking = useCallback(() => {
    setRestaurant(null)
    setDate('')
    setTime('')
    setEntryTime('')
    setExitTime('')
    setGuests(2)
    setTableId('')
    setTableSeats(0)
    setStep(1)
    setGuestName('')
    setPhone('')
    setEmail('')
    setPendingPayment(null)
    setConfirmedReservation(null)
  }, [])

  const startBooking = useCallback((payload) => {
    setRestaurant(payload.restaurant)
    setDate(payload.date ?? '')
    setGuests(payload.guests ?? 2)
    setTableId(payload.tableId ?? '')
    setTableSeats(payload.tableSeats ?? 0)
    setEntryTime(payload.entryTime ?? '')
    setExitTime(payload.exitTime ?? '')
    const range =
      payload.entryTime && payload.exitTime ? `${payload.entryTime} – ${payload.exitTime}` : payload.time ?? ''
    setTime(range)
    setStep(payload.initialStep ?? 1)
    setGuestName('')
    setPhone('')
    setEmail('')
    setPendingPayment(null)
    setConfirmedReservation(null)
  }, [])

  /** Validates and stages checkout for the payment page. */
  const openPaymentCheckout = useCallback(() => {
    if (!restaurant || !date || !entryTime || !exitTime || !tableId) return false
    const range = `${entryTime} – ${exitTime}`
    setTime(range)
    const totalPrice = calculateBookingTotalPrice(tableSeats, entryTime, exitTime)
    setPendingPayment({
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      date,
      time: range,
      entryTime,
      exitTime,
      tableId,
      tableSeats,
      guests,
      guestName,
      phone,
      email,
      totalPrice,
    })
    return true
  }, [restaurant, date, entryTime, exitTime, tableId, tableSeats, guests, guestName, phone, email])

  const value = useMemo(
    () => ({
      restaurant,
      setRestaurant,
      date,
      setDate,
      time,
      setTime,
      entryTime,
      setEntryTime,
      exitTime,
      setExitTime,
      guests,
      setGuests,
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
      pendingPayment,
      setPendingPayment,
      confirmedReservation,
      setConfirmedReservation,
      resetBooking,
      startBooking,
      openPaymentCheckout,
    }),
    [
      restaurant,
      date,
      time,
      entryTime,
      exitTime,
      guests,
      tableId,
      tableSeats,
      step,
      guestName,
      phone,
      email,
      pendingPayment,
      confirmedReservation,
      resetBooking,
      startBooking,
      openPaymentCheckout,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
