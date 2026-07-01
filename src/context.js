const { createContext, useContext, useState, useEffect } = React;
const AppContext = createContext();

const translations = {
    en: {
        searchPlace: "Search city (e.g. Tbilisi, London)...",
        saved: "Saved Destinations",
        home: "Home Dashboard",
        humidity: "Humidity",
        wind: "Wind Speed",
        feels: "Feels Like",
        emptyFavs: "Your travel board is empty! Pin a city from the home screen.",
        pin: "Pin Location",
        unpin: "Unpin Location",
        alertTitle: "Traveler Briefing",
        alertBody: "Local parameters updated. Always review dynamic destination trends prior to departure!",
        close: "Dismiss",
        viewForecast: "Extended Forecast",
        loading: "Querying cloud weather network...",
        notFound: "Target destination not resolved. Check spelling!"
    },
    ka: {
        searchPlace: "მოძებნე ქალაქი (მაგ. თბილისი, ლონდონი)...",
        saved: "შენახული მიმართულებები",
        home: "მთავარი გვერდი",
        humidity: "ტენიანობა",
        wind: "ქარის სიჩქარე",
        feels: "იგრძნობა როგორც",
        emptyFavs: "შენახული ქალაქები ცარიელია! დაამატეთ ქალაქი მთავარი გვერდიდან.",
        pin: "ლოკაციის დამატება",
        unpin: "ლოკაციის წაშლა",
        alertTitle: "სამოგზაურო ბრიფინგი",
        alertBody: "ამინდის პარამეტრები განახლდა. გამგზავრებამდე გადაამოწმეთ პროგნოზი!",
        close: "დახურვა",
        viewForecast: "დეტალური პროგნოზი",
        loading: "მონაცემები იტვირთება...",
        notFound: "ქალაქი ვერ მოიძებნა. სცადეთ თავიდან!"
    }
};

function AppProvider({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('fav_cities')) || ['Tbilisi', 'London']);

    const [page, setPage] = useState('home');
    const [currentForecastCity, setCurrentForecastCity] = useState('Tbilisi');

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('fav_cities', JSON.stringify(favorites));
    }, [favorites]);

    const navigate = (targetPage, cityData = 'Tbilisi') => {
        setCurrentForecastCity(cityData);
        setPage(targetPage);
    };

    const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(l => l === 'en' ? 'ka' : 'en');
    const t = (key) => translations[lang][key] || key;

    const addFav = (city) => {
        if (!favorites.some(c => c.toLowerCase() === city.toLowerCase())) {
            setFavorites([...favorites, city]);
        }
    };

    const remFav = (city) => {
        setFavorites(favorites.filter(c => c.toLowerCase() !== city.toLowerCase()));
    };

    return (
        <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, favorites, addFav, remFav, t, page, currentForecastCity, navigate }}>
            {children}
        </AppContext.Provider>
    );
}

function useApp() {
    return useContext(AppContext);
}

window.AppProvider = AppProvider;
window.useApp = useApp;