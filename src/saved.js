function SavedCities() {
    const { useApp } = window;
    const { favorites, remFav, t, navigate } = useApp();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">📂 {t('saved')}</h2>

            {favorites.length === 0 ? (
                <div className="glass-panel border p-8 rounded-2xl text-center text-slate-500 font-medium">
                    {t('emptyFavs')}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {favorites.map((city, idx) => (
                        <div key={idx} className="glass-panel border p-5 rounded-2xl flex justify-between items-center shadow-sm">
                            <div>
                                <h3 className="text-lg font-bold capitalize">{city}</h3>
                                <button onClick={() => navigate('forecast', city)} className="text-xs text-blue-500 font-semibold hover:underline mt-1 text-left">
                                    {t('viewForecast')} →
                                </button>
                            </div>
                            <button 
                                onClick={() => remFav(city)}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl border border-red-500/20 text-sm"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

window.SavedCities = SavedCities;