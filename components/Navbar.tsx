import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-white via-blue-50 to-white shadow-lg px-8 py-4 flex items-center justify-between rounded-b-xl border-b border-blue-100/60">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto drop-shadow-sm" />
      </div>
      {/* Centered nav links */}
      <div className="flex-1 flex justify-center">
        <div className="flex gap-10">
          <Link href="/dashboard" className="font-semibold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200">Dashboard</Link>
          <Link href="/main-app" className="font-semibold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200">Main App</Link>
          <Link href="/feature1" className="font-semibold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200">Feature 1</Link>
          <Link href="/feature2" className="font-semibold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200">Feature 2</Link>
        </div>
      </div>
      {/* Logout button on the right */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 shadow-lg text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200">Logout</button>
      </div>
    </nav>
  );
}
