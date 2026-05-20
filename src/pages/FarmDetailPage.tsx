import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Droplets, Thermometer, Wind, Leaf, Maximize,
  Shield, Trash2, Plus, AlertTriangle, Loader2, Edit3, Globe, Cpu,
  TrendingUp, FlaskConical, CloudRain, Waves
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useState, useEffect, useCallback } from 'react';
import AddFarmModal from './AddFarmModal';
import AddFieldModal from './AddFieldModal';
import DeviceRegistrationModal from './DeviceRegistrationModal';
import UpdateDeviceModal from './UpdateDeviceModal';
import FarmMap from './FarmMap';
import { Separator } from '@/app/components/ui/separator';
import { apiClient } from '@/api/apiClient';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

export default function FarmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isUpdateDeviceOpen, setIsUpdateDeviceOpen] = useState(false);

  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [editingField, setEditingField] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [farm, setFarm] = useState<any>(null);
  const [devices, setDevices] = useState<Record<number, any[]>>({});

  const [latestData, setLatestData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const formatValue = (val: any) => {
    const num = parseFloat(val);
    return isNaN(num) ? '--' : num.toFixed(2);
  };

  const fetchTelemetry = async (fieldId: number) => {
    try {
      const res = (await apiClient(`/api/iot/telemetry/latest/${fieldId}`)) as Response;
      const result = await res.json();
      // Logic: Map backend fields correctly
      if (result.success) setLatestData(result.data);

      const histRes = (await apiClient(`/api/iot/telemetry/history/${fieldId}`)) as Response;
      const histResult = await histRes.json();
      if (histResult.success) setHistoryData(histResult.data);
    } catch (err) {
      console.error("Telemetry fetch error", err);
    }
  };

  const fetchDevicesForField = useCallback(async (fieldId: number) => {
    try {
      const response = (await apiClient(`/api/iot/devices/field/${fieldId}`)) as Response;
      const result = await response.json();
      if (result.success) {
        setDevices(prev => ({ ...prev, [fieldId]: result.data }));
      }
    } catch (err) {
      console.error("Device fetch error", err);
    }
  }, []);

  const fetchFarmDetails = useCallback(async () => {
    try {
      const response = (await apiClient(`/api/farms/${id}`)) as Response;
      const result = await response.json();
      if (result.success) {
        setFarm(result.data);
        if (result.data.fields?.length > 0) {
          const firstFieldId = result.data.fields[0].id;
          setSelectedFieldId(firstFieldId);
          fetchTelemetry(firstFieldId);
        }
        result.data.fields?.forEach((f: any) => fetchDevicesForField(f.id));
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchDevicesForField]);

  useEffect(() => {
    fetchFarmDetails();
  }, [fetchFarmDetails]);

  // Poll for fresh telemetry every 30 seconds when a field is selected
  useEffect(() => {
    if (!selectedFieldId) return;
    const interval = setInterval(() => fetchTelemetry(selectedFieldId), 30000);
    return () => clearInterval(interval);
  }, [selectedFieldId]);

  // Modals/Handlers (Preserved from existing code)
  const handleUpdateFarm = async (farmData: any) => {
    try {
      const response = (await apiClient(`/api/farms/${id}`, { method: 'PUT', body: JSON.stringify(farmData) })) as Response;
      if (response.ok) { await fetchFarmDetails(); setIsEditModalOpen(false); }
    } catch (error) { toast.error("Update failed."); }
  };

  const handleUpdateDevice = async (deviceId: number, newName: string, isActive: boolean) => {
    try {
      const url = `/api/iot/devices/${deviceId}?newName=${encodeURIComponent(newName)}&isActive=${isActive}`;
      const response = (await apiClient(url, { method: 'PUT' })) as Response;
      if (response.ok) { farm.fields?.forEach((f: any) => fetchDevicesForField(f.id)); setIsUpdateDeviceOpen(false); }
    } catch (error) { toast.error("Device update failed"); }
  };

  const handleLinkDevice = async (deviceData: any) => {
    try {
      const response = (await apiClient(`/api/iot/devices/register`, { method: 'POST', body: JSON.stringify(deviceData) })) as Response;
      if (response.ok) { fetchDevicesForField(deviceData.fieldId); setIsDeviceModalOpen(false); }
    } catch (error) { toast.error("Registration failed"); }
  };

  const handleUnlinkDevice = async (deviceId: number, fieldId: number) => {
    if (!window.confirm("Unlink hardware?")) return;
    await apiClient(`/api/iot/devices/${deviceId}`, { method: 'DELETE' });
    fetchDevicesForField(fieldId);
  };

  const handleSaveField = async (fieldData: any) => {
    try {
      const isUpdating = !!editingField;
      const url = isUpdating ? `/api/fields/${editingField.id}` : `/api/fields/farm/${id}`;
      const response = (await apiClient(url, { method: isUpdating ? 'PUT' : 'POST', body: JSON.stringify(fieldData) })) as Response;
      if (response.ok) { await fetchFarmDetails(); setIsFieldModalOpen(false); setEditingField(null); }
    } catch (error) { toast.error("Field save failed."); }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!window.confirm("Delete field zone?")) return;
    try {
      const response = (await apiClient(`/api/fields/${fieldId}`, { method: 'DELETE' })) as Response;
      if (response.ok) await fetchFarmDetails();
    } catch (err) { toast.error("Delete failed"); }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  if (!farm) return <div className="p-20 text-center"><h2 className="text-foreground text-2xl font-bold">Node not found</h2></div>;

  return (
    <div className="p-4 lg:p-8 pt-6 bg-background min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button onClick={() => navigate('/farms')} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 text-xs font-bold uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-4xl font-bold text-foreground tracking-tight uppercase">{farm.farmName}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-xs font-bold">
              <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" />{farm.latitude?.toFixed(4)}, {farm.longitude?.toFixed(4)}</div>
              <Separator orientation="vertical" className="h-3 bg-slate-800" />
              <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-black">{farm.totalArea?.toFixed(2)} AC COVERAGE</Badge>
            </div>
          </div>
          <Button onClick={() => setIsEditModalOpen(true)} className="bg-white text-primary-foreground font-bold hover:bg-slate-200 px-6 uppercase text-[10px] tracking-widest">Configure Node</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* SECTION 1: ENVIRONMENTAL & SOIL STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusCard icon={Droplets} title="Moisture" value={latestData ? `${formatValue(latestData.soilMoisture)}%` : '--'} unit="Soil saturation" color="text-blue-400" />
              <StatusCard icon={Thermometer} title="Temperature" value={latestData ? `${formatValue(latestData.temperature)}°C` : '--'} unit="Ambient Heat" color="text-orange-400" />
              <StatusCard icon={Wind} title="Humidity" value={latestData ? `${formatValue(latestData.humidity)}%` : '--'} unit="Air saturation" color="text-cyan-400" />
              <StatusCard icon={CloudRain} title="Rainfall" value={latestData ? `${formatValue(latestData.rainfall)}mm` : '--'} unit="Precipitation" color="text-indigo-400" />
              <StatusCard icon={Waves} title="Water Level" value={latestData ? formatValue(latestData.waterLevel) : '--'} unit="Field depth" color="text-blue-500" />
              <StatusCard icon={FlaskConical} title="Soil pH" value={latestData ? formatValue(latestData.soilPh) : '--'} unit="Acidity/Alkalinity" color="text-green-500" />
            </div>

            {/* SECTION 2: NUTRIENTS (NPK) */}
            <Card className="bg-card/50 border-border shadow-2xl p-6">
              <h3 className="text-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-6">
                <Leaf size={14} className="text-primary" /> Live Soil Nutrients (NPK)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Nitrogen (N)</p>
                  <p className="text-3xl font-black text-foreground">{latestData ? formatValue(latestData.nitrogen) : '--'} <span className="text-xs font-normal text-slate-600">mg/kg</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Phosphorus (P)</p>
                  <p className="text-3xl font-black text-foreground">{latestData ? formatValue(latestData.phosphorus) : '--'} <span className="text-xs font-normal text-slate-600">mg/kg</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Potassium (K)</p>
                  <p className="text-3xl font-black text-foreground">{latestData ? formatValue(latestData.potassium) : '--'} <span className="text-xs font-normal text-slate-600">mg/kg</span></p>
                </div>
              </div>
            </Card>

            {/* SECTION 3: 7-DAY ANALYTICS CHART */}
            <Card className="bg-card/50 border-border shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" /> Multi-Variable Trend Analysis
                </h3>
                <Badge variant="outline" className="border-border text-[10px] text-muted-foreground uppercase font-black">7-Day History</Badge>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer>
                  <AreaChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="date" stroke="#444" fontSize={10} />
                    <YAxis stroke="#444" fontSize={10} tickFormatter={(val) => val.toFixed(1)} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222' }} formatter={(val: any) => val.toFixed(2)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />

                    {/* Environment Group */}
                    <Area type="monotone" dataKey="moisture" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Moisture" />
                    <Area type="monotone" dataKey="temp" stroke="#f59e0b" fill="transparent" strokeWidth={2} name="Temp" />
                    <Area type="monotone" dataKey="humidity" stroke="#06b6d4" fill="transparent" strokeWidth={2} name="Humidity" />
                    <Area type="monotone" dataKey="rain" stroke="#6366f1" fill="transparent" strokeDasharray="5 5" name="Rainfall" />

                    {/* Nutrient Group */}
                    <Area type="monotone" dataKey="n" stroke="#ef4444" fill="transparent" strokeWidth={1} name="Nitrogen" />
                    <Area type="monotone" dataKey="p" stroke="#8b5cf6" fill="transparent" strokeWidth={1} name="Phos" />
                    <Area type="monotone" dataKey="k" stroke="#ec4899" fill="transparent" strokeWidth={1} name="Potas" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bg-card/50 border-border overflow-hidden shadow-2xl h-[400px]">
              <FarmMap farms={[farm]} />
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card/50 border-border shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-900/50 pb-4">
                <CardTitle className="text-lg text-foreground flex items-center gap-2 font-bold italic uppercase tracking-tighter">
                  Infrastructure Nodes
                </CardTitle>
                <Button onClick={() => { setEditingField(null); setIsFieldModalOpen(true); }} className="h-7 w-7 p-0 bg-primary text-primary-foreground rounded-full shadow-[0_0_10px_rgba(72,216,125,0.4)]"><Plus size={14} /></Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {farm.fields?.map((field: any) => (
                    <div
                      key={field.id}
                      onClick={() => { setSelectedFieldId(field.id); fetchTelemetry(field.id); }}
                      className={`bg-card/50 p-4 rounded-xl border group relative cursor-pointer transition-all ${selectedFieldId === field.id ? 'border-primary' : 'border-border'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-primary font-black text-[10px] uppercase tracking-widest">{field.fieldName}</span>
                          <Badge className="bg-primary text-primary-foreground border-none text-[10px] font-black px-2 py-0.5">
                            {field.cropType}
                          </Badge>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditingField(field); setIsFieldModalOpen(true); }} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit3 size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id); }} className="p-1.5 text-red-900 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Active Sensors ({devices[field.id]?.length || 0})</p>
                          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{field.fieldArea?.toFixed(2)} AC</p>
                        </div>

                        {devices[field.id]?.map((dev) => {
                          const isOn = dev.isActive || dev.active;
                          return (
                            <div key={dev.id} className="flex items-center justify-between bg-accent/50 p-2.5 rounded-lg border border-input/50 group/dev hover:border-primary/30 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="relative flex h-2 w-2">
                                  {isOn && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOn ? 'bg-primary' : 'bg-red-600'}`}></span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-secondary-foreground">{dev.deviceName}</span>
                                  <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-tighter">{isOn ? 'Signal Active' : 'Node Offline'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover/dev:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setSelectedDevice(dev); setIsUpdateDeviceOpen(true); }} className="text-muted-foreground hover:text-primary"><Edit3 size={12} /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleUnlinkDevice(dev.id, field.id); }} className="text-red-500/70 hover:text-red-400"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          );
                        })}
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); setIsDeviceModalOpen(true); }} className="w-full h-8 mt-2 border border-dashed border-input text-muted-foreground hover:text-primary text-[9px] font-bold uppercase tracking-widest transition-all">
                          <Cpu size={10} className="mr-2" /> Register Node
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DeviceRegistrationModal isOpen={isDeviceModalOpen} onClose={() => setIsDeviceModalOpen(false)} onSave={handleLinkDevice} fieldId={selectedFieldId} />
      <UpdateDeviceModal isOpen={isUpdateDeviceOpen} onClose={() => { setIsUpdateDeviceOpen(false); setSelectedDevice(null); }} onSave={handleUpdateDevice} device={selectedDevice} />
      <AddFarmModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateFarm} editingFarm={farm} />
      <AddFieldModal isOpen={isFieldModalOpen} onClose={() => { setIsFieldModalOpen(false); setEditingField(null); }} onSave={handleSaveField} editingField={editingField} />
    </div>
  );
}

function StatusCard({ icon: Icon, title, value, unit, color }: any) {
  return (
    <Card className="bg-card/50 border-border relative group transition-all hover:bg-card shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Icon size={54} className={color} /></div>
      <CardHeader className="pb-1"><CardDescription className={`${color} font-black text-[9px] uppercase tracking-[0.2em]`}>{title}</CardDescription><CardTitle className="text-4xl text-foreground font-black tracking-tighter italic">{value}</CardTitle></CardHeader>
      <CardContent><p className="text-[10px] text-muted-foreground font-bold uppercase italic tracking-widest">{unit}</p></CardContent>
    </Card>
  );
}