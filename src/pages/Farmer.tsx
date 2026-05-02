import { useNavigate, Link } from 'react-router-dom';
import { 
  Brain, CloudRain, Users, ShoppingCart,
  MapPin, Droplets, Thermometer, Wind,
  AlertTriangle, CheckCircle, MessageSquare, Package,
  ChevronRight, Leaf, Bug, Sprout
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Separator } from '@/app/components/ui/separator';
import { useState, useEffect } from 'react';
import { WEATHER_CONFIG } from '@/config/weatherConfig';

export default function Farmer() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState('Lucknow');
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardWeather = async (query: string) => {
      try {
        const url = `${WEATHER_CONFIG.API_URL}?key=${WEATHER_CONFIG.API_KEY}&q=${query}&days=1&aqi=no&alerts=no`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
          setLocationName(data.location.name);
        }
      } catch (err) {
        console.error("Dashboard weather error:", err);
      } finally {
        setIsWeatherLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDashboardWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => fetchDashboardWeather('Lucknow'),
        WEATHER_CONFIG.GEOLOCATION_OPTIONS
      );
    } else {
      fetchDashboardWeather('Lucknow');
    }
  }, []);
  // Mock data for sensor charts
  const sensorData = [
    { time: '00:00', moisture: 65, temp: 24, humidity: 70 },
    { time: '04:00', moisture: 62, temp: 22, humidity: 75 },
    { time: '08:00', moisture: 58, temp: 26, humidity: 68 },
    { time: '12:00', moisture: 54, temp: 32, humidity: 55 },
    { time: '16:00', moisture: 52, temp: 30, humidity: 58 },
    { time: '20:00', moisture: 56, temp: 26, humidity: 65 },
    { time: '24:00', moisture: 60, temp: 24, humidity: 72 },
  ];

  const farms = [
    { 
      id: 1, 
      name: 'Awadh Sona Farm', 
      location: 'Lucknow, UP', 
      fields: [{ fieldName: 'Main Plot', cropType: 'Wheat', fieldArea: 5, soilType: 'Alluvial' }],
      health: 'healthy',
      moisture: 68,
      temp: 28,
      area: '5 acres'
    },
    { 
      id: 2, 
      name: 'Gomti Organic Fields', 
      location: 'Sitapur, UP', 
      fields: [{ fieldName: 'East Plot', cropType: 'Rice', fieldArea: 3, soilType: 'Loamy' }],
      health: 'attention',
      moisture: 45,
      temp: 32,
      area: '3 acres'
    },
    { 
      id: 3, 
      name: 'Golden Harvest', 
      location: 'Haryana', 
      fields: [{ fieldName: 'North Plot', cropType: 'Maize', fieldArea: 4, soilType: 'Clay' }],
      health: 'healthy',
      moisture: 72,
      temp: 26,
      area: '4 acres'
    },
  ];

  const aiRecommendations = [
    {
      icon: Droplets,
      title: 'Irrigation Needed',
      message: 'Irrigate Sunrise Fields within next 12 hours',
      confidence: 'High',
      type: 'warning',
      color: 'border-yellow-500'
    },
    {
      icon: Bug,
      title: 'Disease Alert',
      message: 'Early signs of Leaf Blight detected in Green Valley',
      confidence: 'Medium',
      type: 'critical',
      color: 'border-red-500'
    },
    {
      icon: Sprout,
      title: 'Crop Recommendation',
      message: 'Based on your soil and weather, maize is suitable for next season',
      confidence: 'High',
      type: 'success',
      color: 'border-green-500'
    },
  ];

  const alerts = [
    { id: 1, type: 'critical', icon: AlertTriangle, message: 'Low soil moisture detected in Farm 2', time: '10 min ago', color: 'text-red-400' },
    { id: 2, type: 'warning', icon: Thermometer, message: 'High temperature warning - 35°C expected', time: '1 hour ago', color: 'text-yellow-400' },
    { id: 3, type: 'success', icon: CheckCircle, message: 'Crop health improved in Farm 1', time: '3 hours ago', color: 'text-green-400' },
    { id: 4, type: 'info', icon: CloudRain, message: 'Rain expected in 48 hours', time: '5 hours ago', color: 'text-blue-400' },
  ];

  const communityPosts = [
    { title: 'Best organic fertilizers for wheat?', author: 'Sanjay Yadav', replies: 12 },
    { title: 'Dealing with pest control naturally', author: 'Neha Verma', replies: 8 },
    { title: 'Water conservation techniques', author: 'Rajesh Kumar', replies: 15 },
  ];

  const marketplaceItems = [
  { id: 1, name: 'Premium Sharbati Wheat', price: 450, seller: 'Awadh Agri', location: 'Lucknow' },
  { id: 2, name: 'Dussheri Mangoes', price: 120, seller: 'Malihabad Orchards', location: 'Lucknow' },
  { id: 3, name: 'Organic Fertilizer', price: 850, seller: 'Gomti Biotech', location: 'Unnao' },
];

  return (
    <div className="p-4 lg:p-8 bg-gray-950 min-h-screen text-slate-100">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Control Center</h1>
            <p className="text-slate-400 font-medium tracking-tight">Synchronized Agricultural Intelligence</p>
          </div>
          <Badge className="bg-[#48D87D]/10 text-[#48D87D] border-[#48D87D]/20 px-4 py-1 font-bold tracking-wider uppercase text-[10px]">
            FARMER ACCESS ENABLED
          </Badge>
        </div>

        {/* Overview Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            onClick={() => navigate('/farms')}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Total Farms</CardDescription>
              <CardTitle className="text-4xl text-white font-bold">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-cyan-400">
                <Sprout className="w-4 h-4" />
                <span className="text-sm font-medium">12 acres total</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50 transition-all cursor-pointer hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Active Crops</CardDescription>
              <CardTitle className="text-4xl text-white font-bold">5</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-400">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Growing well</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50 transition-all cursor-pointer hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Health Status</CardDescription>
              <CardTitle className="text-4xl text-green-400 font-bold">Good</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Overall health</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => navigate('/notifications')}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50 transition-all cursor-pointer hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Alerts</CardDescription>
              <CardTitle className="text-4xl text-yellow-400 font-bold">2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Needs attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Health Overview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Farm Health Overview</h2>
            <Link to="/farms" className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Card 
                key={farm.id} 
                onClick={() => navigate(`/farms/${farm.id}`)}
                className={`bg-gray-950 border-2 transition-all cursor-pointer hover:shadow-xl ${
                  farm.health === 'healthy' 
                    ? 'border-green-500/30 hover:border-green-500/50' 
                    : farm.health === 'attention'
                    ? 'border-yellow-500/30 hover:border-yellow-500/50'
                    : 'border-red-500/30 hover:border-red-500/50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-white font-bold">{farm.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {farm.location}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${
                        farm.health === 'healthy' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                          : farm.health === 'attention'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      } font-semibold`}
                    >
                      {farm.health === 'healthy' ? '🟢 Healthy' : farm.health === 'attention' ? '🟡 Attention' : '🔴 Critical'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Crop Type</span>
                      <span className="text-white font-semibold">{farm.fields[0]?.cropType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Area</span>
                      <span className="text-white font-semibold">{farm.area}</span>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Droplets className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-gray-500">Moisture</span>
                        </div>
                        <p className="text-lg font-bold text-white">{farm.moisture}%</p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="w-4 h-4 text-orange-400" />
                          <span className="text-xs text-gray-500">Temp</span>
                        </div>
                        <p className="text-lg font-bold text-white">{farm.temp}°C</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Live Sensor Data - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-950 border-gray-800 h-full shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white font-bold">Live Sensor Data</CardTitle>
                    <CardDescription className="text-gray-400">Real-time monitoring - Last 24 hours</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm border border-green-500/50 font-medium">
                      24h
                    </button>
                    <button className="px-3 py-1 bg-gray-900 text-gray-400 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-all">
                      7d
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="moisture" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Soil Moisture %" />
                    <Line type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Temperature °C" />
                    <Line type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Humidity %" />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-500 font-medium">Avg Moisture</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">60%</p>
                    <p className="text-xs text-gray-500 mt-1">Optimal: 55-75%</p>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-gray-500 font-medium">Avg Temp</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-400">27°C</p>
                    <p className="text-xs text-gray-500 mt-1">Optimal: 20-30°C</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-500 font-medium">Avg Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">66%</p>
                    <p className="text-xs text-gray-500 mt-1">Optimal: 60-80%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Risk Summary */}
          <div>
            <Card className="bg-gradient-to-br from-cyan-950 to-blue-950 border-cyan-500/30 mb-6 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2 font-bold">
                  <CloudRain className="w-5 h-5 text-cyan-400" />
                  Weather Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/40 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1 font-medium">Local Forecast for {locationName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-white">
                      {weatherData ? `${Math.round(weatherData.current.temp_c)}°C` : isWeatherLoading ? '...' : '28°C'}
                    </p>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">
                        {weatherData ? weatherData.current.condition.text : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
                    <div className="flex items-center gap-1 mb-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-500 font-medium">Humidity</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {weatherData ? `${weatherData.current.humidity}%` : '--%'}
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
                    <div className="flex items-center gap-1 mb-1">
                      <Wind className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-500 font-medium">Wind</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {weatherData ? `${Math.round(weatherData.current.wind_kph)} km/h` : '--'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-yellow-500">Weather Alert</p>
                      <p className="text-xs text-gray-300 mt-1 font-medium">Heavy rainfall expected in 36 hours</p>
                    </div>
                  </div>
                </div>

                <Link to="/weather" className="w-full px-4 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-bold flex items-center justify-center">
                  View Full Forecast
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Insights & Recommendations */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">AI Insights & Recommendations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {aiRecommendations.map((rec, index) => (
              <Card 
                key={index} 
                className={`bg-gray-950 border-2 ${rec.color} hover:shadow-xl transition-all cursor-pointer`}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      rec.type === 'warning' ? 'bg-yellow-500/20' :
                      rec.type === 'critical' ? 'bg-red-500/20' :
                      'bg-green-500/20'
                    }`}>
                      <rec.icon className={`w-6 h-6 ${
                        rec.type === 'warning' ? 'text-yellow-400' :
                        rec.type === 'critical' ? 'text-red-400' :
                        'text-green-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-1 font-bold">{rec.title}</CardTitle>
                      <Badge className={`text-xs ${
                        rec.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        rec.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                        'bg-green-500/20 text-green-400'
                      } font-semibold`}>
                        {rec.confidence} Confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed">{rec.message}</p>
                  <button className="mt-4 text-sm text-green-400 hover:text-green-300 flex items-center gap-1 font-semibold">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Alerts & Notifications */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Recent Alerts & Notifications</h2>
            <button className="text-green-400 hover:text-green-300 text-sm font-medium">Mark all as read</button>
          </div>
          <Card className="bg-gray-950 border-gray-800 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {alerts.map((alert, index) => (
                <div 
                  key={alert.id} 
                  className={`flex items-start gap-4 p-5 hover:bg-gray-900 cursor-pointer transition-colors ${
                    index !== alerts.length - 1 ? 'border-b border-gray-900' : ''
                  }`}
                >
                  <alert.icon className={`w-5 h-5 ${alert.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{alert.time}</p>
                  </div>
                  <button className="text-gray-600 hover:text-white text-xs font-medium">
                    Mark read
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Community & Marketplace Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Community Snapshot */}
          <Card className="bg-gray-950 border-gray-800 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <CardTitle className="text-xl text-white font-bold">Community Highlights</CardTitle>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 font-semibold">
                  {communityPosts.reduce((acc, post) => acc + post.replies, 0)} Active
                </Badge>
              </div>
              <CardDescription className="text-gray-400">Trending discussions from nearby farmers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityPosts.map((post, index) => (
                <div 
                  key={index} 
                  className="bg-gray-900 rounded-lg p-4 hover:border-orange-500/40 transition-all border border-gray-800 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">{post.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-500 text-xs">by {post.author}</span>
                        <span className="text-orange-400 text-xs font-bold">{post.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/community" className="w-full px-4 py-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-all flex items-center justify-center gap-2 font-bold mt-2">
                Go to Community <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Marketplace Highlights */}
          <Card className="bg-gray-950 border-gray-800 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-yellow-400" />
                  <CardTitle className="text-xl text-white font-bold">Marketplace Highlights</CardTitle>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 font-semibold">
                  Featured
                </Badge>
              </div>
              <CardDescription className="text-gray-400">Popular products from nearby sellers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketplaceItems.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gray-900 rounded-lg p-4 hover:border-yellow-500/40 transition-all border border-gray-800 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                        <Package className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                        <span className="text-gray-500 text-xs">{item.seller}</span>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-bold">{item.price}</span>
                  </div>
                </div>
              ))}
              <Link to="/marketplace" className="w-full px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-2 font-bold mt-2">
                Visit Marketplace <ChevronRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
