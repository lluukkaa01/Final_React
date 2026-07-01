function Home() {
    const { useState, useEffect } = React;
    const { useApp } = window;
    const { favorites, addFav, remFav, t, navigate } = useApp();
    
    const [search, setSearch] = useState('');
    const [weatherList, setWeatherList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [citiesTracked, setCitiesTracked] = useState([
        'Tbilisi', 'London', 'New York', 'Tokyo', 
        'Paris', 'Rome', 'Dubai', 'Sydney', 'Cairo', 'Berlin'
    ]);

    useEffect(() => {
        async function fetchAllWeather() {
            setLoading(true);
            setError(false);
            try {
                const promises = citiesTracked.map(async (cityName) => {
                    const res = await fetch(`https://wttr.in/${cityName}?format=j1`);
                    if (!res.ok) return null;
                    const data = await res.json();
                    
                    const current = data.current_condition[0];
                    const area = data.nearest_area[0];
                    const rawName = area.areaName[0].value;
                    
                    const cityNameClean = rawName.toLowerCase() === 'okrokana' ? 'Tbilisi' : rawName;
                    
                    return {
                        idName: cityName,
                        name: cityNameClean,
                        country: area.country[0].value,
                        temp: current.temp_C,
                        desc: current.weatherDesc[0].value,
                        humidity: current.humidity,
                        wind: current.windspeedKmph,
                        feels: current.FeelsLikeC
                    };
                });

                const results = await Promise.all(promises);
                setWeatherList(results.filter(item => item !== null));
            } catch (err) {
                setError(true);
            }
            setLoading(false);
        }
        fetchAllWeather();
    }, [citiesTracked]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!search.trim()) return;

        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`https://wttr.in/${search.trim()}?format=j1`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            
            const current = data.current_condition[0];
            const area = data.nearest_area[0];
            const rawName = area.areaName[0].value;
            const targetName = rawName.toLowerCase() === 'okrokana' ? 'Tbilisi' : rawName;

            const newWeatherData = {
                idName: search.trim(),
                name: targetName,
                country: area.country[0].value,
                temp: current.temp_C,
                desc: current.weatherDesc[0].value,
                humidity: current.humidity,
                wind: current.windspeedKmph,
                feels: current.FeelsLikeC
            };

            if (!weatherList.some(w => w.name.toLowerCase() === targetName.toLowerCase())) {
                setWeatherList([newWeatherData, ...weatherList]);
            }
            setSearch('');
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    };

    const removeCityCard = (idName) => {
        setWeatherList(weatherList.filter(item => item.idName !== idName));
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl mx-auto">
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlace')} 
                    className="flex-grow px-4 py-3 rounded-2xl glass-panel border focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base"
                />
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-2xl shadow-lg active:scale-95 transition-transform">
                    🔍
                </button>
            </form>

            {error && <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl text-center font-medium max-w-2xl mx-auto">{t('notFound')}</div>}
            {loading && <div className="p-8 text-center text-slate-500 font-medium animate-pulse">{t('loading')}</div>}

            {!loading && weatherList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weatherList.map((weather, index) => {
                        const isPinned = favorites.some(c => c.toLowerCase() === weather.name.toLowerCase());
                        
                        return (
                            <div key={index} className="glass-panel rounded-3xl p-6 relative shadow-md hover:scale-[1.01] transition-transform duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight">{weather.name}</h2>
                                            <p className="text-xs opacity-60 font-medium">{weather.country}</p>
                                        </div>
                                        <button 
                                            onClick={() => isPinned ? remFav(weather.name) : addFav(weather.name)}
                                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                                                isPinned ? 'bg-red-500/20 text-red-600 border-red-500/30' : 'bg-green-500/20 text-green-600 border-green-500/30'
                                            }`}
                                        >
                                            {isPinned ? '🗑️' : '📌'}
                                        </button>
                                    </div>

                                    <div className="my-6 flex items-center justify-between">
                                        <div className="text-4xl font-black text-slate-800 dark:text-white">
                                            {weather.temp}°C
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-400 border border-blue-500/20">
                                                {weather.desc}
                                            </span>
                                            <p className="text-xs mt-1 opacity-70">{t('feels')}: {weather.feels}°C</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-500/10 text-sm">
                                        <div className="bg-white/20 dark:bg-slate-800/20 p-2 rounded-xl text-center">
                                            <p className="text-[10px] opacity-60">{t('humidity')}</p>
                                            <p className="font-bold text-xs">{weather.humidity}%</p>
                                        </div>
                                        <div className="bg-white/20 dark:bg-slate-800/20 p-2 rounded-xl text-center">
                                            <p className="text-[10px] opacity-60">{t('wind')}</p>
                                            <p className="font-bold text-xs">{weather.wind} km/h</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => navigate('forecast', weather.name)} className="flex-grow text-center py-2 bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 font-semibold text-xs rounded-xl transition-all">
                                        📅 {t('viewForecast')}
                                    </button>
                                    <button 
                                        onClick={() => removeCityCard(weather.idName)} 
                                        className="px-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 active:scale-95 transition-all text-xs"
                                        title="Remove from Dashboard"
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

window.Home = Home;