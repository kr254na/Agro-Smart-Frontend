
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CloudRain, Cloud, AlertTriangle, Wind, Droplets, Eye } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { WEATHER_CONFIG } from '@/config/weatherConfig';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  visibility: number;
}

interface HourlyForecast {
  hour: string;
  temp: number;
  condition: string;
  icon: string;
  rainProbability: number;
}

interface DailyForecast {
  day: string;
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  icon: string;
  rainProbability: number;
}

interface WeatherAlert {
  id: number;
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
}

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes('sunny') || c.includes('clear')) 
    return <Sun className="h-12 w-12 text-yellow-400" />;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) 
    return <CloudRain className="h-12 w-12 text-blue-400" />;
  if (c.includes('thunder') || c.includes('storm')) 
    return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
  if (c.includes('cloud') || c.includes('overcast')) 
    return <Cloud className="h-12 w-12 text-muted-foreground" />;
  if (c.includes('mist') || c.includes('fog')) 
    return <Wind className="h-12 w-12 text-muted-foreground" />;
  return <Cloud className="h-12 w-12 text-muted-foreground" />;
};

const defaultCurrentWeather: WeatherData = {
  temp: 0,
  condition: 'Loading...',
  icon: 'loading',
  humidity: 0,
  windSpeed: 0,
  rainProbability: 0,
  visibility: 0,
};

export default function WeatherPage() {
const navigate = useNavigate();


  // State declarations for public page
  const [selectedFarm, setSelectedFarm] = useState('current');
  const [tempUnit, setTempUnit] = useState('celsius');
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const [currentWeather, setCurrentWeather] = useState<WeatherData>(defaultCurrentWeather);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);

  const fetchWeatherData = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${WEATHER_CONFIG.API_URL}?key=${WEATHER_CONFIG.API_KEY}&q=${query}&days=7&aqi=no&alerts=yes`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();

      // Map current weather
      setCurrentWeather({
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.text, // Simplified for getWeatherIcon
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        rainProbability: data.forecast.forecastday[0].day.daily_chance_of_rain,
        visibility: data.current.vis_km,
      });

      // Map hourly (next 8 hours from now)
      const currentHour = new Date().getHours();
      const allHours = data.forecast.forecastday[0].hour;
      const futureHours = allHours
        .filter((h: any) => {
          const hDate = new Date(h.time);
          return hDate.getHours() >= currentHour;
        })
        .slice(0, 8)
        .map((h: any) => ({
          hour: new Date(h.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          temp: h.temp_c,
          condition: h.condition.text,
          icon: h.condition.text,
          rainProbability: h.chance_of_rain,
        }));
      setHourlyForecast(futureHours);

      // Map daily
      const daily = data.forecast.forecastday.map((day: any) => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        minTemp: day.day.mintemp_c,
        maxTemp: day.day.maxtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.text,
        rainProbability: day.day.daily_chance_of_rain,
      }));
      setDailyForecast(daily);

      // Localized alerts fallback (WeatherAPI alerts can be empty or non-UP specific)
      // For now, we keep the UP region alerts as requested, but we could also check data.alerts
      const alerts: WeatherAlert[] = [
        {
          id: 1,
          severity: 'critical',
          title: 'Heatwave Alert (UP Region)',
          description: 'Severe heatwave conditions expected across Lucknow and Kanpur. Maintain irrigation cycles and avoid midday field work.',
          timestamp: 'Live Update',
        },
      ];
      setWeatherAlerts(alerts);
      
      setLocationName(`${data.location.name}, ${data.location.region}`);
    } catch (err) {
      console.error(err);
      setError('Could not update weather. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFarm === 'current') {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = `${position.coords.latitude},${position.coords.longitude}`;
            fetchWeatherData(coords);
          },
          (error) => {
            console.error("Error fetching location:", error);
            fetchWeatherData('Lucknow');
          },
          WEATHER_CONFIG.GEOLOCATION_OPTIONS
        );
      } else {
        fetchWeatherData('Lucknow');
      }
    } else {
      const cityMap: Record<string, string> = {
        lucknow: 'Lucknow',
        kanpur: 'Kanpur',
        barabanki: 'Barabanki',
        unnao: 'Unnao'
      };
      fetchWeatherData(cityMap[selectedFarm] || 'Lucknow');
    }
  }, [selectedFarm]);

  const convertTemp = (temp: number) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-background min-h-screen overflow-x-hidden pt-12">
        {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">Weather Insights</h1>
                <p className="text-muted-foreground">
                  Real-time weather for <span className="text-green-400 font-bold">{locationName}</span>
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={selectedFarm} onValueChange={setSelectedFarm}>
                <SelectTrigger className="bg-card/50 border-border text-foreground">
                <SelectValue placeholder="Select Farm / Location" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="current" className="text-foreground focus:bg-accent">
                  📍 Current Location
                </SelectItem>
                <SelectItem value="lucknow" className="text-foreground focus:bg-accent">
                  Lucknow (Hazratganj)
                </SelectItem>
                <SelectItem value="kanpur" className="text-foreground focus:bg-accent">
                  Kanpur (Civic Lines)
                </SelectItem>
                <SelectItem value="barabanki" className="text-foreground focus:bg-accent">
                  Barabanki (Rural)
                </SelectItem>
                <SelectItem value="unnao" className="text-foreground focus:bg-accent">
                  Unnao (Central Area)
                </SelectItem>
              </SelectContent>
              </Select>

              <Select value={tempUnit} onValueChange={setTempUnit}>
                <SelectTrigger className="bg-card/50 border-border text-foreground">
                <SelectValue placeholder="Temperature Unit" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="celsius" className="text-foreground focus:bg-accent">
                  Celsius (°C)
                </SelectItem>
                <SelectItem value="fahrenheit" className="text-foreground focus:bg-accent">
                  Fahrenheit (°F)
                </SelectItem>
              </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Weather Alerts */}
          {weatherAlerts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Active Alerts
              </h2>
              <div className="space-y-4">
                {weatherAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'critical'
                        ? 'border-red-500/20 bg-red-500/5'
                        : 'border-yellow-500/20 bg-yellow-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-foreground">{alert.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              alert.severity === 'critical'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {alert.severity === 'critical' ? 'Critical' : 'Advisory'}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{alert.description}</p>
                        <p className="text-muted-foreground text-xs">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Weather Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 sm:gap-8 text-center sm:text-left">
                <div className="scale-75 sm:scale-100">
                  {getWeatherIcon(currentWeather.condition)}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-1 uppercase tracking-wider">
                    {isLoading ? 'Detecting Location...' : 'Current Weather'}
                  </p>
                  <p className="text-4xl sm:text-6xl text-foreground mb-1">
                    {convertTemp(currentWeather.temp)}°{tempUnit === 'celsius' ? 'C' : 'F'}
                  </p>
                  <p className="text-lg sm:text-xl text-secondary-foreground font-medium">{currentWeather.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full lg:w-auto mt-6 sm:mt-8">
                <div className="bg-accent/50 rounded-xl p-3 sm:p-4 border border-input/50">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-muted-foreground text-xs sm:text-sm">Humidity</span>
                  </div>
                  <p className="text-xl sm:text-2xl text-foreground font-bold">{currentWeather.humidity}%</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-3 sm:p-4 border border-input/50">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Wind className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-muted-foreground text-xs sm:text-sm">Wind</span>
                  </div>
                  <p className="text-xl sm:text-2xl text-foreground font-bold">{currentWeather.windSpeed} km/h</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-3 sm:p-4 border border-input/50">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-muted-foreground text-xs sm:text-sm">Rain</span>
                  </div>
                  <p className="text-xl sm:text-2xl text-foreground font-bold">{currentWeather.rainProbability}%</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-3 sm:p-4 border border-input/50">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs sm:text-sm">Visibility</span>
                  </div>
                  <p className="text-xl sm:text-2xl text-foreground font-bold">{currentWeather.visibility} km</p>
                </div>
              </div>
            </div>

          {/* Hourly Forecast */}
          <div className="bg-card/50 border border-border rounded-2xl p-4 sm:p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full inline-block"></span>
              Hourly Forecast
            </h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-2">
                {hourlyForecast.map((hour, index) => (
                  <div
                    key={index}
                    className="bg-card/50 rounded-lg p-4 min-w-[120px] hover:bg-accent/50 transition-colors"
                  >
                    <p className="text-muted-foreground text-sm mb-3 text-center">{hour.hour}</p>
                    <div className="flex justify-center mb-3">
                      {getWeatherIcon(hour.condition)}
                    </div>
                    <p className="text-foreground text-xl text-center mb-2">
                      {convertTemp(hour.temp)}°
                    </p>
                    <div className="flex items-center justify-center gap-1 text-blue-400">
                      <Droplets className="h-3 w-3" />
                      <span className="text-xs">{hour.rainProbability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-card/50 border border-border rounded-2xl p-4 sm:p-6 text-sm sm:text-base">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full inline-block"></span>
              7-Day Forecast
            </h2>
            <div className="space-y-3">
              {dailyForecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-card/50 rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                      <div className="w-16 sm:w-24 shrink-0">
                        <p className="text-foreground font-medium text-sm sm:text-base">{day.day}</p>
                        <p className="text-muted-foreground text-[10px] sm:text-xs uppercase">{day.date}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="scale-75 sm:scale-100 origin-left shrink-0">
                          {getWeatherIcon(day.condition)}
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm hidden md:block w-32">
                          {day.condition}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="flex items-center gap-1 sm:gap-2 text-blue-400 min-w-[45px] sm:min-w-[60px]">
                        <Droplets className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                        <span className="text-[11px] sm:text-sm font-medium">{day.rainProbability}%</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-end">
                        <span className="text-muted-foreground text-xs sm:text-sm w-7 sm:w-8 text-right shrink-0">
                          {convertTemp(day.minTemp)}°
                        </span>
                        <div className="w-12 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full shrink-0" />
                        <span className="text-foreground font-medium text-xs sm:text-sm w-7 sm:w-8 shrink-0">
                          {convertTemp(day.maxTemp)}°
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
    </div>
  );
}
