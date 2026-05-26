import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/">
          <h1 className="font-serif text-2xl tracking-tight">Somethin' Else</h1>
        </Link>
        <nav className="hidden md:flex gap-6 text-xs tracking-widest uppercase">
          <Link href="/" className="hover:text-orange-700">Home</Link>
          <Link href="#" className="hover:text-orange-700">About</Link>
          <Link href="#" className="hover:text-orange-700">Archive</Link>
        </nav>
      </div>
    </header>
  )
}
