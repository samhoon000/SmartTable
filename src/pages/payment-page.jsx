import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatRupees } from '../lib/booking-price.js'
import { useBooking } from '../hooks/use-booking.js'
import { useVenueStore } from '../hooks/use-venue-store.js'

function formatDisplayDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
}

const METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
  { id: 'netbanking', label: 'Net banking' },
]

export function PaymentPage() {
  const navigate = useNavigate()
  const { pendingPayment, setPendingPayment, setConfirmedReservation } = useBooking()
  const { addReservation } = useVenueStore()

  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [bankChoice, setBankChoice] = useState('')
  const [paying, setPaying] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!pendingPayment) navigate('/restaurants', { replace: true })
  }, [pendingPayment, navigate])

  if (!pendingPayment) {
    return null
  }

  const { restaurantName, date, entryTime, exitTime, tableId, tableSeats, guests, totalPrice } = pendingPayment
  const windowLabel = entryTime && exitTime ? `${entryTime} – ${exitTime}` : pendingPayment.time

  const validateForm = () => {
    if (method === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) return 'Enter a valid UPI ID (e.g. name@bank).'
    }
    if (method === 'card') {
      const digits = cardNumber.replace(/\s/g, '')
      if (digits.length < 12) return 'Enter a valid card number.'
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) return 'Use MM/YY for expiry.'
      if (cardCvv.trim().length < 3) return 'Enter CVV.'
      if (!cardName.trim()) return 'Enter name on card.'
    }
    if (method === 'netbanking' && !bankChoice) return 'Select your bank.'
    return ''
  }

  const handlePay = () => {
    const err = validateForm()
    setFormError(err)
    if (err) return

    setPaying(true)
    window.setTimeout(() => {
      const methodLabel = METHODS.find((m) => m.id === method)?.label ?? method
      addReservation({
        restaurantId: pendingPayment.restaurantId,
        restaurantName: pendingPayment.restaurantName,
        tableId: pendingPayment.tableId,
        date: pendingPayment.date,
        entryTime: pendingPayment.entryTime,
        exitTime: pendingPayment.exitTime,
        guestName: pendingPayment.guestName,
        guests: pendingPayment.guests,
        totalPrice: pendingPayment.totalPrice,
      })

      setConfirmedReservation({
        ...pendingPayment,
        paidAmount: pendingPayment.totalPrice,
        paymentMethodLabel: methodLabel,
        paymentConfirmationMessage: 'Your payment was successful. A receipt has been sent to your email.',
      })
      setPendingPayment(null)
      setPaying(false)
      navigate('/confirmation', { replace: true })
    }, 1600)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:max-w-xl lg:px-8 lg:py-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-stone-900 sm:text-2xl">Secure payment</h1>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">Demo checkout</span>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Booking summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Restaurant</dt>
            <dd className="text-right font-medium text-stone-900">{restaurantName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Table</dt>
            <dd className="text-right font-medium text-stone-900">
              {tableId} · {tableSeats} seats
            </dd>
          </div>
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
        </dl>
        <div className="mt-5 border-t border-stone-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700">Total</span>
            <span className="text-2xl font-bold text-teal-800">{formatRupees(totalPrice)}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Payment method</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMethod(m.id)
                setFormError('')
              }}
              className={[
                'rounded-xl border px-4 py-2.5 text-sm font-medium transition',
                method === m.id
                  ? 'border-teal-700 bg-teal-700 text-white shadow-sm'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-teal-300',
              ].join(' ')}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {method === 'upi' && (
            <label className="block">
              <span className="text-sm font-medium text-stone-700">UPI ID</span>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="you@paytm"
                className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          )}

          {method === 'card' && (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Card number</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">Expiry</span>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">CVV</span>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Name on card</span>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
            </div>
          )}

          {method === 'netbanking' && (
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Select bank</span>
              <select
                value={bankChoice}
                onChange={(e) => setBankChoice(e.target.value)}
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
              >
                <option value="">Choose bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
              </select>
            </label>
          )}
        </div>

        {formError ? <p className="mt-4 text-sm font-medium text-red-600">{formError}</p> : null}

        <button
          type="button"
          disabled={paying}
          onClick={handlePay}
          className="relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-xl bg-teal-700 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-600 disabled:opacity-80"
        >
          {paying ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing…
            </span>
          ) : (
            `Pay ${formatRupees(totalPrice)}`
          )}
        </button>

        <p className="mt-4 text-center text-xs text-stone-500">
          Encrypted demo—no real charges. Your card is not stored.
        </p>
      </section>

      <div className="mt-6 text-center">
        <Link to="/restaurants" className="text-sm font-medium text-stone-600 hover:text-teal-800">
          Cancel and return
        </Link>
      </div>
    </div>
  )
}
