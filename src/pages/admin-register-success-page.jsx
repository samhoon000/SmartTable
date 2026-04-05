import { Link } from 'react-router-dom'

export function AdminRegisterSuccessPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">✓</div>
        <h1 className="mt-6 text-xl font-semibold text-stone-900">Application received</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Your application was sent successfully. We will get in touch with you.
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
