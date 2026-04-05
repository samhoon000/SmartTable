import { Link } from 'react-router-dom'
import { StarRating } from './star-rating.jsx'

export function RestaurantGridCard({ restaurant, guestsToday = 0 }) {
  const { id, name, cuisine, rating, reviewCount, priceRange, location, image } = restaurant

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_1px_3px_rgb(0_0_0/0.06),0_12px_28px_rgb(0_0_0/0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgb(0_0_0/0.08),0_20px_40px_rgb(0_0_0/0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold leading-snug text-stone-900">{name}</h2>
          <span className="shrink-0 rounded-lg bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
            {priceRange}
          </span>
        </div>
        <p className="mt-1 text-sm text-teal-800/90">{cuisine}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-stone-600">
          <StarRating value={rating} />
          <span className="font-medium text-stone-800">{rating.toFixed(1)}</span>
          <span className="text-stone-400">·</span>
          <span>{reviewCount} reviews</span>
        </div>
        <p className="mt-2 text-sm text-stone-500">{location}</p>
        <p className="mt-1 text-sm text-stone-600">{guestsToday} guests today</p>
        <div className="mt-auto pt-4">
          <Link
            to={`/restaurants/${id}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 active:scale-[0.99]"
          >
            Book table
          </Link>
        </div>
      </div>
    </article>
  )
}
