function Forecast({ city }) {
    const { useState, useEffect } = React;
    const { useApp } = window;
    const { t, navigate } = useApp();
    
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchForecast() {
            try {
                const res = await fetch(`https://wttr.in/${city}?format=j1`);
                const data = await res.json();
                setDays(data.weather || []);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchForecast();
    }, [city]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold capitalize">📍 {city} - {t('forecast')}</h2>
                <button onClick={() => navigate('home')} className="text-sm font-semibold text-blue-500 hover:underline">← Back</button>
            </div>

            {loading ? (
                <div className="p-8 text-center text-slate-500 font-medium animate-pulse">{t('loading')}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {days.slice(0, 5).map((day, idx) => (
                        <div key={idx} className="glass-panel border p-5 rounded-2xl flex flex-col items-center text-center shadow-sm">
                            <p className="text-sm font-bold opacity-70">{day.date}</p>
                            <div className="text-3xl my-3">☀️</div>
                            <p className="text-xl font-extrabold">{day.avgtempC}°C</p>
                            <p className="text-xs mt-2 opacity-60 font-medium">Max: {day.maxtempC}°C / Min: {day.mintempC}°C</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

window.Forecast = Forecast;