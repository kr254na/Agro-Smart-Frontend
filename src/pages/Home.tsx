import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Droplets, Brain, CloudRain, Activity, Users, ShoppingCart, 
  CheckCircle, ArrowRight, Leaf, MapPin, Calendar, 
  Shield, Zap, MessageSquare, TrendingUp, Bell, DollarSign,
  Thermometer, Wind
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useState, useEffect } from 'react';
import { WEATHER_CONFIG } from '@/config/weatherConfig';

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState('Lucknow, UP');
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchHomeWeather = async (query: string) => {
      try {
        const url = `${WEATHER_CONFIG.API_URL}?key=${WEATHER_CONFIG.API_KEY}&q=${query}&days=3&aqi=no&alerts=no`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
          setLocationName(`${data.location.name}, ${data.location.region}`);
        }
      } catch (err) {
        console.error("Home weather error:", err);
      } finally {
        setIsWeatherLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchHomeWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => fetchHomeWeather('Lucknow'),
        WEATHER_CONFIG.GEOLOCATION_OPTIONS
      );
    } else {
      fetchHomeWeather('Lucknow');
    }
  }, []);

  const features = [
    {
      icon: Droplets,
      title: 'Soil Health Monitoring',
      description: 'Track moisture, pH, and nutrients in real time with IoT sensors.',
      color: 'text-blue-400'
    },
    {
      icon: Brain,
      title: 'Crop Disease Detection',
      description: 'AI-powered early alerts to prevent crop loss and maximize yield.',
      color: 'text-purple-400'
    },
    {
      icon: CloudRain,
      title: 'Weather Intelligence',
      description: 'Local forecasts and extreme weather warnings tailored for your farm.',
      color: 'text-cyan-400'
    },
    {
      icon: Activity,
      title: 'Farm Dashboard',
      description: 'Manage multiple farms from one centralized, easy-to-use platform.',
      color: 'text-green-400'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Learn from other farmers\' experiences and share best practices.',
      color: 'text-orange-400'
    },
    {
      icon: ShoppingCart,
      title: 'Agro Marketplace',
      description: 'Buy and sell seeds, equipment, and produce directly with farmers.',
      color: 'text-yellow-400'
    }
  ];

  const communityPosts = [
    { title: 'Best practices for wheat cultivation in winter', author: 'Rajesh Kumar', replies: 24 },
    { title: 'How to prevent pest attacks naturally?', author: 'Priya Singh', replies: 18 },
    { title: 'Organic fertilizer recommendations', author: 'Mohammed Ali', replies: 31 }
  ];

  const marketplaceItems = [
    { name: 'Hybrid Rice Seeds', price: '₹450/kg', seller: 'Verified Farmer', image: 'https://images.unsplash.com/photo-1677726987913-fe2a6666509f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBsYW50cyUyMGdyb3d0aCUyMHN1c3RhaW5hYmxlfGVufDF8fHx8MTc2OTg2OTcxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Organic Fertilizer', price: '₹850/bag', seller: 'Agro Vendor', image: 'https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGZhcm1pbmclMjBpb3QlMjBzZW5zb3JzJTIwY3JvcHN8ZW58MXx8fHwxNzY5ODY5NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Drip Irrigation Kit', price: '₹3,200', seller: 'Equipment Store', image: 'https://images.unsplash.com/photo-1769259046907-a5165e978af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZSUyMGZhcm0lMjBmaWVsZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY5ODY5NzA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Fresh Tomatoes', price: '₹35/kg', seller: 'Local Farmer', image: 'https://images.unsplash.com/photo-1573481078935-b9605167e06b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0cGxhY2UlMjB2ZWdldGFibGVzJTIwZnJlc2h8ZW58MXx8fHwxNzY5ODY5NzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
  ];

  return (
    <div className="text-white">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(34, 197, 94) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                🌱 Powered by IoT & AI
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Smart Farming{' '}
                <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Powered by
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  IoT & AI
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Monitor soil health, track crops, predict diseases, and grow smarter with real-time insights designed for modern farmers.
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Real-time monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-gray-300">AI recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CloudRain className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">Weather alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-gray-300">Farmer community</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-xl
                z-10 hover:shadow-green-500/50 transition-all text-lg font-semibold flex items-center justify-center gap-2">
                  Start Farming Smart
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border-2 border-green-500 text-green-400 rounded-lg cursor-pointer hover:bg-green-500/10 transition-all text-lg font-semibold z-10"
                >
                  Explore Features
                </button>
              </div>
            </motion.div>

            {/* Right Side - Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1769259046907-a5165e978af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZSUyMGZhcm0lMjBmaWVsZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY5ODY5NzA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Smart Farm"
                  className="rounded-2xl shadow-2xl shadow-green-500/20"
                />

                {/* Floating Data Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-8 -left-4 bg-gray-900/90 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Soil Moisture</p>
                      <p className="text-lg font-bold text-white">68%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-8 -right-4 bg-gray-900/90 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Temperature</p>
                      <p className="text-lg font-bold text-white">
                        {weatherData ? `${weatherData.current.temp_c}°C` : '28°C'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 right-0 bg-gray-900/90 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Crop Health</p>
                      <p className="text-lg font-bold text-white">Excellent</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Four simple steps to transform your farming with smart technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                icon: Activity,
                title: 'Sensors in the Field',
                description: 'IoT devices collect soil moisture, temperature, humidity, and crop data.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '2',
                icon: Brain,
                title: 'Data Analysis',
                description: 'AI analyzes farm conditions, crop health, and weather patterns.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                icon: Bell,
                title: 'Smart Recommendations',
                description: 'Farmers receive alerts, disease warnings, and crop suggestions.',
                color: 'from-orange-500 to-yellow-500'
              },
              {
                step: '4',
                icon: TrendingUp,
                title: 'Better Yield & Profit',
                description: 'Informed decisions lead to healthier crops and higher productivity.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all h-full group hover:shadow-xl hover:shadow-green-500/10">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl font-bold text-green-500/20 mb-2">{item.step}</div>
                    <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools designed to make farming smarter, easier, and more profitable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all h-full group hover:shadow-xl hover:shadow-green-500/20 hover:scale-105">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gray-800/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-all">
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Weather Section */}
      <section id="weather" className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1768490124155-9f38b686e88f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwZm9yZWNhc3QlMjBza3klMjBjbG91ZHN8ZW58MXx8fHwxNzY5ODY5NzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-4 py-2">
              Live Weather
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Weather Intelligence</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time weather data and forecasts tailored for your location
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 backdrop-blur-lg shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                    <div>
                      <CardTitle className="text-2xl text-white">{isWeatherLoading ? 'Detecting...' : locationName}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {weatherData ? `Live update from ${weatherData.current.last_updated}` : 'Analyzing conditions...'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-cyan-400">
                    {weatherData ? `${Math.round(weatherData.current.temp_c)}°C` : '--°C'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-400">Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData ? `${weatherData.current.humidity}%` : '--%'}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudRain className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm text-gray-400">Visibility</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData ? `${weatherData.current.vis_km} km` : '-- km'}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-400">Wind</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData ? `${weatherData.current.wind_kph} km/h` : '-- km/h'}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-400">UV Index</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData ? weatherData.current.uv : '--'}</p>
                  </div>
                </div>

                {/* 3-Day Forecast */}
                <div className="grid grid-cols-3 gap-4">
                  {(weatherData?.forecast?.forecastday || [null, null, null]).map((day: any, index: number) => (
                    <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 text-center">
                      <p className="text-sm text-gray-400 mb-2">
                        {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Next Day'}
                      </p>
                      <CloudRain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-white">
                        {day ? `${Math.round(day.day.maxtemp_c)}°C` : '--°C'}
                      </p>
                    </div>
                  ))}
                </div>

                <Link to="/weather" className="w-full mt-6 px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2">
                  View Detailed Weather Analysis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  AgroSmart?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                We combine cutting-edge technology with farmer-friendly design to deliver real results
              </p>

              <div className="space-y-4">
                {[
                  { icon: Brain, text: 'Data-driven farming decisions' },
                  { icon: Shield, text: 'Reduced crop loss and risk' },
                  { icon: Droplets, text: 'Better resource management' },
                  { icon: Users, text: 'Designed for small & large farmers' },
                  { icon: Zap, text: 'Easy-to-use interface' },
                  { icon: DollarSign, text: 'Increased profitability' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-green-500/50 transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGZhcm1pbmclMjBpb3QlMjBzZW5zb3JzJTIwY3JvcHN8ZW58MXx8fHwxNzY5ODY5NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Smart Farming Technology"
                className="rounded-2xl shadow-2xl shadow-green-500/20"
              />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
              Community
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Farmer Community</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Learn, share, and grow together with farmers across regions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900/50 border-gray-800 h-full">
                <CardHeader>
                  <img 
                    src="https://images.unsplash.com/photo-1724996871733-93a10302de11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGNvbW11bml0eSUyMHBlb3BsZSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY5ODY5NzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Community"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-2xl text-white">Connect with Experts</CardTitle>
                  <CardDescription className="text-gray-400">
                    Join thousands of farmers sharing knowledge and experiences
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900/50 border-gray-800 h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                    Recent Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {communityPosts.map((post, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-green-500/50 transition-all cursor-pointer">
                      <h4 className="text-white font-medium mb-2">{post.title}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">by {post.author}</span>
                        <span className="text-green-400">{post.replies} replies</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center">
            <Link to="/community" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all text-lg font-semibold inline-flex items-center gap-2">
              Join the Farmer Community
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
              Marketplace
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Agro Marketplace</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Buy and sell seeds, equipment, and produce directly with farmers and vendors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {marketplaceItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all overflow-hidden group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">{item.price}</span>
                      <Badge className="bg-gray-800 text-gray-400 border-gray-700">
                        {item.seller}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/marketplace" className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:shadow-xl hover:shadow-yellow-500/50 transition-all text-lg font-semibold inline-flex items-center gap-2">
              Explore Marketplace
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(34, 197, 94) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Transform{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Your Farming?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of farmers using smart technology to grow better crops and increase profitability
            </p>
            <Link to="/register" className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all text-xl font-bold inline-flex items-center gap-3">
              Create Free Account
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
