export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-[#111111]/95 backdrop-blur-xl border-b border-white/10">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F26A3D]/5 via-transparent to-[#F26A3D]/5 pointer-events-none" />

      <div className="relative h-full px-8 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-4">

          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
            <img
              src="/logo.png"
              alt="KUN Sports"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">
              KUN Sports
              <span className="text-[#F26A3D]"> AI</span>
            </h1>

            <p className="text-xs text-gray-400">
              Sports Intelligence Platform
            </p>
          </div>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-300">
              Online
            </span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <span className="text-sm text-white">
              Sports Expert
            </span>

            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F26A3D] to-[#ff8c66] flex items-center justify-center text-white font-semibold shadow-lg">
            K
          </div>

        </div>

      </div>
    </header>
  );
}