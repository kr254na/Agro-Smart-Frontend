import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain, MapPin,
  AlertTriangle, CheckCircle,
  Leaf, ArrowRight, Loader2, Users, ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WEATHER_CONFIG } from '@/config/weatherConfig';
import { Button } from '@/app/components/ui/button';
import { apiClient } from '@/api/apiClient';
import { CloudRain } from 'lucide-react';
import { getStorage } from '../utils/storage';

// --- TYPES ---
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const sensorData = [
  { time: '00:00', moisture: 65, temp: 24, humidity: 70 },
  { time: '04:00', moisture: 62, temp: 22, humidity: 75 },
  { time: '08:00', moisture: 58, temp: 26, humidity: 68 },
  { time: '12:00', moisture: 54, temp: 32, humidity: 55 },
  { time: '16:00', moisture: 52, temp: 30, humidity: 58 },
  { time: '20:00', moisture: 56, temp: 26, humidity: 65 },
  { time: '24:00', moisture: 60, temp: 24, humidity: 72 },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  // Dynamic State
  const [user, setUser] = useState({ displayName: '', role: '' });
  const [stats, setStats] = useState({ totalFarms: 0, totalAcreage: 0, activeCrops: 0, alertCount: 0 });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  // --- 1. DYNAMIC DATA FETCHING ---
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch Identity
        const profileRes = (await apiClient('/api/users/me')) as Response;
        const profileResult = (await profileRes.json()) as ApiResponse<any>;

        if (profileResult.success) {
          const role = getStorage('userRole');
          setUser({
            displayName: profileResult.data.firstName,
            role: role === 'ROLE_USER' ? 'FARMER' : 'ADMIN'
          });
        }

        // Fetch Farms & Calculate Stats
        const farmRes = (await apiClient('/api/farms')) as Response;
        const farmResult = (await farmRes.json()) as ApiResponse<any[]>;

        if (farmResult.success) {
          const fetchedFarms = farmResult.data;

          // Dynamic Stat Calculation
          const acreage = fetchedFarms.reduce((acc, f) => acc + (f.totalArea || 0), 0);
          const crops = new Set(fetchedFarms.flatMap(f => f.fields?.map((field: any) => field.cropType) || [])).size;

          setStats({
            totalFarms: fetchedFarms.length,
            totalAcreage: acreage,
            activeCrops: crops,
            alertCount: fetchedFarms.filter(f => f.health === 'warning' || f.health === 'critical').length
          });

          // Weather Logic (using first farm's location if available)
          if (fetchedFarms.length > 0) {
            fetchWeather(`${fetchedFarms[0].latitude},${fetchedFarms[0].longitude}`);
          } else {
            fetchWeather('Lucknow');
          }
        }

      } catch (err) {
        console.error("Dashboard failed to load:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    const fetchWeather = async (query: string) => {
      const url = `${WEATHER_CONFIG.API_URL}?key=${WEATHER_CONFIG.API_KEY}&q=${query}&days=1`;
      const weatherRes = await fetch(url);
      if (weatherRes.ok) {
        const data = await weatherRes.json();
        setWeatherData(data);
      }
    };

    initializeDashboard();
  }, [navigate]);

  if (isDataLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-950">
        <Loader2 className="h-12 w-12 text-[#48D87D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 bg-gray-950 min-h-screen text-slate-100">
      <div className="max-w-6xl mx-auto">

        {/* Header with Dynamic Name */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Control Center</h1>
            <p className="text-slate-400 font-medium">Synchronized for <span className="text-[#48D87D] font-bold underline decoration-green-500/30 underline-offset-4">{user.displayName}</span></p>
          </div>
          <Badge className="bg-[#48D87D]/10 text-[#48D87D] border-[#48D87D]/20 px-4 py-1 font-bold tracking-wider uppercase text-[10px]">
            {user.role} ACCESS ENABLED
          </Badge>
        </div>

        {/* Global CTA */}
        <div className="bg-gradient-to-r from-[#48D87D]/20 via-[#48D87D]/5 to-transparent border border-[#48D87D]/20 rounded-2xl p-6 md:p-8 mb-10 relative overflow-hidden  group transition-all hover:border-[#48D87D]/40">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl text-white mb-2 font-bold uppercase tracking-tight">Infrastructure Pulse</h2>
            <p className="text-slate-400 mb-6 max-w-xl font-medium leading-relaxed">
              Real-time monitoring active across <span className="text-white font-bold">{stats.totalAcreage} acres</span>. No hardware disconnects detected in the last 24 hours.
            </p>
            <Button onClick={() => navigate('/farms')} className="bg-[#48D87D] hover:bg-[#3bc56d] text-black font-bold h-12 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(72,216,125,0.2)]">
              View Deployment <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Brain className="absolute -right-10 -bottom-10 h-64 w-64 text-[#48D87D]/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Dynamic Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Registered Farms" value={stats.totalFarms} sub={`${stats.totalAcreage} AC Coverage`} icon={MapPin} color="border-blue-500/20" />
          <StatCard title="Active Crop Types" value={stats.activeCrops} sub="Diverse Cultivation" icon={Leaf} color="border-green-500/20" />
          <StatCard title="Network Status" value="Online" sub="IoT Nodes Synchronized" icon={CheckCircle} color="border-[#48D87D]/20" isStatus />
          <StatCard title="Active Alerts" value={stats.alertCount} sub="Priority Action items" icon={AlertTriangle} color={stats.alertCount > 0 ? "border-red-500/50 bg-red-500/5" : "border-slate-800"} isAlert={stats.alertCount > 0} />
        </div>

        {/* ... Rest of components like Chart and Weather follow below ... */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800 h-full overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-gray-800/50 bg-gray-900/80 flex flex-row items-center justify-between py-4">
                <CardTitle className="text-white text-[10px] font-bold uppercase tracking-wider">Global Sensor Analytics</CardTitle>
                <Badge className="bg-blue-500/10 text-blue-400 border-none text-[8px] font-bold">24H STREAM</Badge>
              </CardHeader>
              <CardContent className="pt-8">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="time" stroke="#444" fontSize={10} />
                    <YAxis stroke="#444" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222' }} />
                    <Line type="monotone" dataKey="moisture" stroke="#3B82F6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div>
            <WeatherCard data={weatherData} />
          </div>
        </div>

        {/* Marketplace & Community (Static but styled) */}
        <div className="grid lg:grid-cols-2 gap-8">
          <SectionCard title="Regional Marketplace" icon={ShoppingCart} link="/marketplace" items={marketplaceItems} />
          <SectionCard title="Farmer Community" icon={Users} link="/community" items={communityPosts} />
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS FOR CLEANER CODE ---

function StatCard({ title, value, sub, icon: Icon, color, isStatus, isAlert }: any) {
  return (
    <Card className={`bg-[#111] border ${color} transition-all hover:scale-[1.02] relative overflow-hidden group`}>
      <CardHeader className="pb-2">
        <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">{title}</CardDescription>
        <CardTitle className={`text-3xl sm:text-4xl font-bold tracking-tight ${isStatus ? 'text-[#48D87D]' : isAlert ? 'text-red-500' : 'text-white'}`}>
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{sub}</p>
      </CardContent>
      <Icon className={`absolute -right-2 -bottom-2 h-16 w-16 opacity-5 group-hover:opacity-10 transition-opacity ${isAlert ? 'text-red-500' : 'text-white'}`} />
    </Card>
  );
}

function WeatherCard({ data }: any) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 h-full shadow-2xl relative overflow-hidden">
      <CardHeader className="border-b border-slate-900/50">
        <CardTitle className="text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <CloudRain size={12} className="text-blue-400" /> Atmospheric Data
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-white tracking-tight">
            {data ? Math.round(data.current.temp_c) : '--'}°
          </p>
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-wider mt-1">
            {data ? data.current.condition.text : 'Syncing...'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 text-center">
            <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Humidity</p>
            <p className="text-white font-bold">{data?.current.humidity || '--'}%</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 text-center">
            <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Wind Speed</p>
            <p className="text-white font-bold">{Math.round(data?.current.wind_kph || 0)} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, icon: Icon, link, items }: any) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/50 bg-gray-900/80 py-3">
        <CardTitle className="text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
          <Icon size={12} className="text-[#48D87D]" /> {title}
        </CardTitle>
        <Link to={link} className="text-[9px] font-bold text-[#48D87D] uppercase tracking-wider hover:underline">Launch App</Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {items.map((item: any, i: number) => (
          <div key={i} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 group hover:border-[#48D87D]/30 transition-all">
            <span className="text-xs text-slate-300 font-bold uppercase tracking-tight truncate w-full sm:w-auto">{item.title || item.name}</span>
            <Badge className="bg-[#48D87D]/10 text-[#48D87D] border-none text-[8px] font-bold flex-shrink-0">
              {item.replies ? `${item.replies} Replies` : `₹${item.price}`}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const marketplaceItems = [
  { id: 1, name: 'Premium Sharbati Wheat', price: 450, seller: 'Awadh Agri' },
  { id: 2, name: 'Dussheri Mangoes', price: 120, seller: 'Malihabad Orchards' }
];

const communityPosts = [
  { title: 'Best organic fertilizers?', author: 'Sanjay Yadav', replies: 12 },
  { title: 'Natural Pest control', author: 'Neha Verma', replies: 8 }
];