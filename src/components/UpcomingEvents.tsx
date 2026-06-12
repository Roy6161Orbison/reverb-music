import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

type Event = {
  _id: string
  artist: string
  venue: string
  city?: string
  date: string
  ticketUrl?: string
  image?: { asset: { _ref: string } }
  featured?: boolean
}

export default function UpcomingEvents({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate(),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    }
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="font-serif text-2xl mb-8 tracking-tight">Upcoming Events</h2>
      <div className="divide-y divide-gray-100">
        {events.map((ev) => {
          const { month, day, weekday, time } = formatDate(ev.date)
          return (
            <div
              key={ev._id}
              className="group flex items-center gap-6 py-4 hover:bg-gray-50 transition-colors duration-200 -mx-6 px-6"
            >
              {/* 日付 */}
              <div className="flex-shrink-0 w-14 text-center">
                <p className="font-label text-[0.6rem] text-orange-700 tracking-widest">{month}</p>
                <p className="font-serif text-3xl leading-none">{day}</p>
                <p className="font-label text-[0.55rem] text-gray-400 tracking-widest mt-0.5">{weekday}</p>
              </div>

              {/* サムネイル */}
              {ev.image && (
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                  <img
                    src={urlFor(ev.image).width(96).height(96).url()}
                    alt={ev.artist}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* メイン情報 */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-lg leading-tight truncate">{ev.artist}</p>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {ev.venue}{ev.city ? ` — ${ev.city}` : ''}
                  <span className="ml-2 text-gray-400">{time}</span>
                </p>
              </div>

              {/* チケットリンク */}
              {ev.ticketUrl && (
                <Link
                  href={ev.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 font-label text-[0.65rem] tracking-widest uppercase border border-gray-300 px-3 py-1.5 hover:border-orange-700 hover:text-orange-700 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Tickets
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
