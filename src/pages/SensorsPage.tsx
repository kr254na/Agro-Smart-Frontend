import { useState, useEffect } from 'react';
import {
  Droplets, Thermometer, Wind, Download,
  Cpu, CloudRain, Waves, FlaskConical, Beaker
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/app/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { apiClient } from '@/api/apiClient';

interface SensorDevice {
  id: number;
  deviceSerialNumber: string;
  deviceName: string;
  isActive: boolean;
  active?: boolean;
}

export default function SensorsPage() {
  const [farms, setFarms] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [devices, setDevices] = useState<SensorDevice[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [activeChart, setActiveChart] = useState('moisture');
  const [latestData, setLatestData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Helper to check if a device is active
  const isDeviceActive = (device: SensorDevice) => device.isActive === true || device.active === true;

  // --- NEW: CSV EXPORT LOGIC ---
  const handleExport = () => {
    if (historyData.length === 0) {
      toast.warning("No telemetry data available to export.");
      return;
    }

    const fieldName = fields.find(f => f.id.toString() === selectedFieldId)?.fieldName || 'Field';

    // 1. Define CSV Headers
    const headers = ["Date", "Moisture(%)", "Rainfall(mm)", "Water Level(m)", "pH", "Temp(C)", "Humidity(%)", "Nitrogen", "Phos", "Potas"];

    // 2. Map data rows
    const rows = historyData.map(item => [
      item.date,
      item.moisture,
      item.rain,
      item.waterLevel,
      item.ph,
      item.temp,
      item.humidity,
      item.n,
      item.p,
      item.k
    ]);

    // 3. Create CSV Content
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

    // 4. Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AgroSmart_${fieldName}_Telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = (await apiClient('/api/farms')) as Response;
        const result = await res.json();
        if (result.success) setFarms(result.data);
      } catch (e) { console.error(e); }
    };
    fetchFarms();
  }, []);

  useEffect(() => {
    const farm = farms.find(f => f.id.toString() === selectedFarmId);
    setFields(farm?.fields || []);
    setSelectedFieldId('');
    setLatestData(null);
    setHistoryData([]);
    setDevices([]);
  }, [selectedFarmId, farms]);

  useEffect(() => {
    if (!selectedFieldId) return;
    const loadData = async () => {
      try {
        const [devRes, telRes, histRes] = await Promise.all([
          apiClient(`/api/iot/devices/field/${selectedFieldId}`),
          apiClient(`/api/iot/telemetry/latest/${selectedFieldId}`),
          apiClient(`/api/iot/telemetry/history/${selectedFieldId}`)
        ]);
        const devResult = await (devRes as Response).json();
        const telResult = await (telRes as Response).json();
        const histResult = await (histRes as Response).json();
        if (devResult.success) setDevices(devResult.data);
        if (telResult.success) setLatestData(telResult.data);
        if (histResult.success) setHistoryData(histResult.data);
      } catch (e) { console.error(e); }
    };
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedFieldId]);

  return (
    <div className="p-6 lg:p-8 bg-background min-h-screen text-foreground">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">Multi-Node Analytics</h1>
          <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Full-Spectrum Sensor Integration</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
              <SelectTrigger className="flex-1 sm:w-[140px] bg-card/50 border-border text-[10px] font-black uppercase tracking-widest h-10"><SelectValue placeholder="FARM" /></SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {farms.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.farmName}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedFieldId} onValueChange={setSelectedFieldId} disabled={!selectedFarmId}>
              <SelectTrigger className="flex-1 sm:w-[140px] bg-card/50 border-border text-[10px] font-black uppercase tracking-widest h-10"><SelectValue placeholder="FIELD" /></SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                {fields.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.fieldName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="w-full sm:w-auto border-border text-primary hover:bg-primary/10 font-black text-[10px] uppercase h-10 shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
          >
            <Download size={14} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatusCard title="Moisture" value={latestData?.soilMoisture} unit="%" icon={<Droplets className="text-blue-400" />} color="text-blue-400" />
        <StatusCard title="Rainfall" value={latestData?.rainfall} unit="mm" icon={<CloudRain className="text-indigo-400" />} color="text-indigo-400" />
        <StatusCard title="Water Level" value={latestData?.waterLevel} unit="m" icon={<Waves className="text-blue-500" />} color="text-blue-500" />
        <StatusCard title="Soil pH" value={latestData?.soilPh} unit="pH" icon={<FlaskConical className="text-green-500" />} color="text-green-500" />
        <StatusCard title="Temp" value={latestData?.temperature} unit="°C" icon={<Thermometer className="text-orange-400" />} color="text-orange-400" />
        <StatusCard title="Humidity" value={latestData?.humidity} unit="%" icon={<Wind className="text-cyan-400" />} color="text-cyan-400" />
        <StatusCard title="Nitrogen (N)" value={latestData?.nitrogen} unit="mg" icon={<Beaker className="text-red-500" />} color="text-red-500" />
        <StatusCard title="Phos (P)" value={latestData?.phosphorus} unit="mg" icon={<Beaker className="text-purple-500" />} color="text-purple-500" />
        <StatusCard title="Potas (K)" value={latestData?.potassium} unit="mg" icon={<Beaker className="text-pink-500" />} color="text-pink-500" />
        <StatusCard
          title="Active Nodes"
          value={devices.filter(isDeviceActive).length}
          unit="Nodes"
          icon={<Cpu className={devices.filter(isDeviceActive).length > 0 ? "text-primary" : "text-muted-foreground"} />}
          color={devices.filter(isDeviceActive).length > 0 ? "text-primary" : "text-secondary-foreground"}
          isRaw
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <CardContainer title="7-DAY TREND ANALYSIS" className="lg:col-span-3">
          <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
            <TabsList className="bg-card/50 border border-border mb-8 overflow-x-auto custom-scrollbar flex-nowrap justify-start h-auto p-1.5 gap-1 shadow-inner">
              {[
                { id: 'moisture', label: 'Moisture' },
                { id: 'rain', label: 'Rainfall' },
                { id: 'waterLevel', label: 'Water' },
                { id: 'ph', label: 'pH Index' },
                { id: 'temp', label: 'Temp' },
                { id: 'humidity', label: 'Humidity' },
                { id: 'n', label: 'Nitrogen' },
                { id: 'p', label: 'Phos' },
                { id: 'k', label: 'Potas' }
              ].map((metric) => (
                <TabsTrigger
                  key={metric.id}
                  value={metric.id}
                  className="uppercase text-[9px] font-black tracking-widest px-4 py-2 transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(72,216,125,0.4)]"
                >
                  {metric.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="h-[400px] w-full bg-card/30 rounded-xl p-4 border border-border/50">
              <ResponsiveContainer>
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                  <XAxis dataKey="date" stroke="#444" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                  <YAxis stroke="#444" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222', fontSize: '10px', fontWeight: '900' }} formatter={(val: any) => [val.toFixed(2), activeChart.toUpperCase()]} />
                  <Area type="monotone" dataKey={activeChart} stroke="var(--color-primary)" fill="url(#colorActive)" strokeWidth={3} activeDot={{ r: 6, fill: '#000', stroke: 'var(--color-primary)', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Tabs>
        </CardContainer>

        <div className="space-y-6">
          <CardContainer title="HARDWARE STATUS">
            <div className="space-y-3">
              {devices.length > 0 ? devices.map(dev => {
                const active = isDeviceActive(dev);
                return (
                  <div key={dev.id} className={`bg-card/50 border p-3 rounded-lg flex items-center justify-between group transition-all ${active ? 'border-primary/30' : 'border-border'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${active ? 'bg-primary shadow-[0_0_10px_var(--color-primary)] animate-pulse' : 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]'}`} />
                      <div className="flex flex-col">
                        <span className={`font-black text-[9px] uppercase tracking-tighter ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{dev.deviceName}</span>
                        <span className="text-[7px] text-slate-600 font-bold uppercase">{dev.deviceSerialNumber}</span>
                      </div>
                    </div>
                    <Cpu size={12} className={active ? "text-primary" : "text-slate-800"} />
                  </div>
                );
              }) : (
                <p className="text-center text-slate-700 text-[9px] font-black py-10 uppercase tracking-[0.2em]">Deployment Empty</p>
              )}
            </div>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, unit, icon, color, isRaw }: any) {
  const displayVal = isRaw ? value : (!isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : '--');
  return (
    <div className={`bg-card/50 border border-border p-5 rounded-xl transition-all relative overflow-hidden group ${isRaw && value > 0 ? 'border-primary/30 shadow-[0_0_15px_rgba(72,216,125,0.1)]' : ''}`}>
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black italic tracking-tighter ${color || 'text-foreground'}`}>{displayVal}</span>
        <span className="text-slate-600 text-[8px] font-bold uppercase">{unit}</span>
      </div>
    </div>
  );
}

function CardContainer({ title, children, className }: any) {
  return (
    <div className={`bg-card/50 border border-border rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <div className="bg-card/80 border-b border-border px-6 py-4 flex items-center justify-between">
        <h2 className="text-foreground text-[9px] font-bold uppercase tracking-widest">{title}</h2>
        <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}