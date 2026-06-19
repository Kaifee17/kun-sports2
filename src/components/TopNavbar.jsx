export default function TopNavbar() {
  const openNewChat = () => {
    window.dispatchEvent(new CustomEvent("new-chat"));
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-[#0b0d10]/90 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.02)]">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F26A3D]/[0.035] via-transparent to-transparent pointer-events-none" />

      <div className="relative h-full px-5 sm:px-7 flex items-center justify-between">

        {/* Left Section */}
        <button
          type="button"
          onClick={openNewChat}
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 -ml-2 cursor-pointer transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A3D]/70"
          aria-label="Open a new KUN Sports AI chat"
        >

          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.09] transition-all duration-200 group-hover:bg-[#F26A3D]/15 group-hover:border-[#F26A3D]/50 group-hover:shadow-lg group-hover:shadow-[#F26A3D]/10">
            <img
              src="/logo.png"
              alt="KUN Sports"
              className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          <div className="text-left">
            <h1 className="text-white text-[17px] font-semibold tracking-tight transition-colors group-hover:text-[#F26A3D]">
              KUN Sports
              <span className="text-[#F26A3D]"> AI</span>
            </h1>

            <p className="text-[11px] text-gray-500 mt-0.5">
              Sports Intelligence Platform
            </p>
          </div>

        </button>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.06] border border-emerald-400/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></div>
            <span className="text-xs text-emerald-100/70">
              Online
            </span>
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-100">KUN Team</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Team workspace</p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff835b] to-[#e9572a] border border-white/10 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[#F26A3D]/10" aria-hidden="true">
            KUN
          </div>

        </div>

      </div>
    </header>
  );
}
