import { useState } from 'react'
import { Link } from 'react-router-dom'

const initial = {
  restaurantName: '',
  ownerName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  cuisine: '',
  capacity: '',
}

export function AdminRegisterPage() {
  const [form, setForm] = useState(initial)
  const [submitted, setSubmitted] = useState(false)
  const [menuImages, setMenuImages] = useState([{ id: Math.random().toString(36).slice(2, 9), file: null, preview: null }])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleMenuImageChange = (id, file) => {
    if (file) {
      const preview = URL.createObjectURL(file)
      setMenuImages(prev => prev.map(img => img.id === id ? { ...img, file, preview } : img))
    } else {
      setMenuImages(prev => prev.map(img => img.id === id ? { ...img, file: null, preview: null } : img))
    }
  }

  const addMenuImage = () => {
    setMenuImages(prev => [...prev, { id: Math.random().toString(36).slice(2, 9), file: null, preview: null }])
  }

  const removeMenuImage = (id) => {
    setMenuImages(prev => prev.filter(img => {
      if (img.id === id && img.preview) {
        URL.revokeObjectURL(img.preview)
      }
      return img.id !== id
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">✓</div>
          <h1 className="mt-6 text-xl font-semibold text-stone-900">Application received</h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Your application is being processed. We will get in touch with you.
          </p>
          <Link
            to="/admin/login"
            className="mt-8 inline-flex rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600"
          >
            Return to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-xl font-semibold text-stone-900">Register your restaurant</h1>
        <p className="mt-2 text-sm text-stone-600">
          Partner onboarding form—mirrors real marketplace flows (no data is saved in this demo).
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Restaurant name</span>
            <input
              required
              value={form.restaurantName}
              onChange={update('restaurantName')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Owner name</span>
            <input
              required
              value={form.ownerName}
              onChange={update('ownerName')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Phone number</span>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={update('phone')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Restaurant address</span>
            <input
              required
              value={form.address}
              onChange={update('address')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">City</span>
            <input
              required
              value={form.city}
              onChange={update('city')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Cuisine type</span>
            <input
              required
              value={form.cuisine}
              onChange={update('cuisine')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Seating capacity</span>
            <input
              required
              type="number"
              min={1}
              value={form.capacity}
              onChange={update('capacity')}
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Restaurant images (UI only)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-1.5 w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-800"
            />
          </label>
          <div className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700 block mb-1.5">Menu Images</span>
            <div className="space-y-3">
              {menuImages.map((item) => (
                <div key={item.id} className="flex items-center gap-3 transition-opacity duration-300">
                  {item.preview && (
                    <img src={item.preview} alt="Menu preview" className="h-10 w-10 shrink-0 rounded-lg object-cover border border-stone-200" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMenuImageChange(item.id, e.target.files[0])}
                    className="flex-1 text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeMenuImage(item.id)}
                    className="shrink-0 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    Remove ❌
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMenuImage}
              className="mt-3 inline-block text-sm font-medium text-teal-700 hover:text-teal-800 transition hover:underline"
            >
              + Add more images
            </button>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Business license / proof (UI only)</span>
            <input
              type="file"
              accept=".pdf,image/*"
              className="mt-1.5 w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-800"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 sm:w-auto sm:px-8"
            >
              Submit application
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link to="/admin/login" className="font-semibold text-teal-800 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
