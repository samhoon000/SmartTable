import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojppwpo'

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

const initialMenuRow = { id: 'menu-row-0', file: null, preview: null }

function buildSuccessRedirectUrl() {
  if (typeof window === 'undefined') return ''
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${base === '' ? '' : base}/admin/register/success`
}

export function AdminRegisterPage() {
  const [form, setForm] = useState(initial)
  const [menuImages, setMenuImages] = useState([initialMenuRow])

  const successRedirectUrl = useMemo(() => buildSuccessRedirectUrl(), [])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleMenuImageChange = (id, file) => {
    if (file) {
      const preview = URL.createObjectURL(file)
      setMenuImages((prev) => prev.map((img) => (img.id === id ? { ...img, file, preview } : img)))
    } else {
      setMenuImages((prev) => prev.map((img) => (img.id === id ? { ...img, file: null, preview: null } : img)))
    }
  }

  const addMenuImage = () => {
    setMenuImages((prev) => [...prev, { id: `menu-row-${Date.now()}`, file: null, preview: null }])
  }

  const removeMenuImage = (id) => {
    setMenuImages((prev) =>
      prev.filter((img) => {
        if (img.id === id && img.preview) {
          URL.revokeObjectURL(img.preview)
        }
        return img.id !== id
      }),
    )
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20'

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-xl font-semibold text-stone-900">Register your restaurant</h1>
        <p className="mt-2 text-sm text-stone-600">
          Partner onboarding form—submit to Formspree. Activate your form in the Formspree email after the first test
          submission.
        </p>
        <form
          method="POST"
          action={FORMSPREE_ENDPOINT}
          encType="multipart/form-data"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <input type="hidden" name="_subject" value="New Restaurant Registration" />
          <input type="hidden" name="_template" value="table" />
          {successRedirectUrl ? <input type="hidden" name="_next" value={successRedirectUrl} /> : null}
          <input type="hidden" name="_replyto" value={form.email} />

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Restaurant name</span>
            <input
              name="restaurant_name"
              required
              autoComplete="organization"
              value={form.restaurantName}
              onChange={update('restaurantName')}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Owner name</span>
            <input
              name="owner_name"
              required
              autoComplete="name"
              value={form.ownerName}
              onChange={update('ownerName')}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={update('email')}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Phone number</span>
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={update('phone')}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Restaurant address</span>
            <input
              name="address"
              required
              autoComplete="street-address"
              value={form.address}
              onChange={update('address')}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">City</span>
            <input
              name="city"
              required
              autoComplete="address-level2"
              value={form.city}
              onChange={update('city')}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Cuisine type</span>
            <input
              name="cuisine"
              required
              autoComplete="off"
              value={form.cuisine}
              onChange={update('cuisine')}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Seating capacity</span>
            <input
              name="seating_capacity"
              type="number"
              required
              min={1}
              step={1}
              inputMode="numeric"
              value={form.capacity}
              onChange={update('capacity')}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Restaurant images</span>
            <input
              name="restaurant_images"
              type="file"
              accept="image/*"
              multiple
              className="mt-1.5 w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-800"
            />
          </label>
          <div className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">Menu images</span>
            <div className="space-y-3">
              {menuImages.map((item) => (
                <div key={item.id} className="flex items-center gap-3 transition-opacity duration-300">
                  {item.preview && (
                    <img
                      src={item.preview}
                      alt="Menu preview"
                      className="h-10 w-10 shrink-0 rounded-lg border border-stone-200 object-cover"
                    />
                  )}
                  <input
                    name={`menu_image_${item.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMenuImageChange(item.id, e.target.files[0])}
                    className="flex-1 text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeMenuImage(item.id)}
                    className="shrink-0 rounded-lg border border-transparent px-2 py-1.5 text-xs text-red-600 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                  >
                    Remove ❌
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMenuImage}
              className="mt-3 inline-block text-sm font-medium text-teal-700 transition hover:text-teal-800 hover:underline"
            >
              + Add more images
            </button>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-700">Business license / proof</span>
            <input
              name="license_proof"
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
