import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-950">
      {/* Universal navigation bar at the top with glassmorphism */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl shadow-slate-900/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-950 text-white px-3 py-2 rounded-xl font-extrabold text-xl tracking-wider shadow-inner">
                RP
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Reno Platforms</span>
              <div className="flex items-center space-x-2 -mt-0.5">
                <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">Notice Board</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1 text-sm font-semibold text-slate-400">
            <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs text-slate-300 flex items-center">
              <svg className="w-3.5 h-3.5 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Live Database connected
            </span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="py-10 px-4 md:px-6 max-w-5xl mx-auto">
        <Component {...pageProps} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-8 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 Reno Platforms. All rights reserved.</p>
      </footer>
    </div>
  );
}