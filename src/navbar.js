function Navbar() {
    const { useApp } = window;
    const { theme, toggleTheme, lang, toggleLang, t, page, navigate } = useApp();

    const linkClass = (target) => 
        `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            page === target 
                ? 'bg-white/40 dark:bg-slate-800/60 shadow-sm text-blue-600 dark:text-cyan-400' 
                : 'hover:bg-white/20 dark:hover:bg-slate-800/30'
        }`;

    return (
        <nav className="glass-panel sticky top-0 z-40 backdrop-blur-md border-b m-4 rounded-2xl">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div onClick={() => navigate('home')} className="cursor-pointer flex items-center gap-2 font-bold text-lg tracking-wide bg-gradient-to-r from-blue-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                    ☀️ SkyGlass
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('home')} className={linkClass('home')}>{t('home')}</button>
                    <button onClick={() => navigate('saved')} className={linkClass('saved')}>{t('saved')}</button>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={toggleLang} className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 transition-all">
                        {lang === 'en' ? 'KA' : 'EN'}
                    </button>
                    <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 hover:scale-105 transition-transform">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

window.Navbar = Navbar;