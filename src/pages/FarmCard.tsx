import { useState, useEffect } from 'react';
import { MapPin, Edit, Trash2, Eye, Maximize2, Sprout, Navigation, Globe, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

export interface Farm {
  id: string;
  farmName: string;
  latitude: number;
  longitude: number;
  totalArea: number;
  fields: {
    fieldName: string;
    cropType: string;
    fieldArea: number;
    soilType: string;
  }[];
}

interface FarmCardProps {
  farm: Farm;
  onDelete: (id: string) => void;
  onEdit: (farm: Farm) => void;
}

export default function FarmCard({ farm, onDelete, onEdit }: FarmCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [address, setAddress] = useState<string>('Locating...');
  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const navigate = useNavigate();

  // Reverse Geocoding Logic using OpenStreetMap Nominatim
  useEffect(() => {
    const fetchAddress = async () => {
      if (farm.latitude == null || farm.longitude == null) {
        setAddress('Coordinates Missing');
        setIsGeoLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${farm.latitude}&lon=${farm.longitude}`
        );
        const data = await response.json();
        
        // Extract a clean location string (City/District and State)
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.district || 'Unknown Location';
        const state = data.address?.state || '';
        
        setAddress(`${city}${state ? `, ${state}` : ''}`);
      } catch (error) {
        console.error("Geocoding failed:", error);
        setAddress(`Node (${farm.latitude.toFixed(2)}, ${farm.longitude.toFixed(2)})`);
      } finally {
        setIsGeoLoading(false);
      }
    };

    fetchAddress();
  }, [farm.latitude, farm.longitude]);

  const handleDelete = () => {
    onDelete(farm.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        
        <div className="block cursor-pointer" onClick={() => navigate(`/farms/${farm.id}`)}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {farm.farmName}
              </h3>
              
              {/* REVERSE GEOCODED LOCATION DISPLAY */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {isGeoLoading ? (
                  <Loader2 size={12} className="animate-spin text-slate-600" />
                ) : (
                  <MapPin size={12} className="text-primary" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[180px]">
                  {address}
                </span>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20">
              ID: {farm.id}
            </Badge>
          </div>

          <div className="bg-background/40 rounded-lg p-3 mb-4 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Maximize2 size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Coverage</span>
            </div>
            <span className="text-sm font-bold text-foreground">{farm.totalArea} Acres</span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sprout size={14} className="text-primary" />
              <p className="text-muted-foreground text-[11px] font-black uppercase tracking-tighter">
                Crop Zones ({farm.fields?.length || 0})
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {farm.fields && farm.fields.length > 0 ? (
                farm.fields.slice(0, 2).map((field, idx) => (
                  <span key={idx} className="bg-slate-800/50 text-secondary-foreground text-[10px] px-2.5 py-1 rounded-md border border-slate-700 font-medium">
                    {field.cropType}
                  </span>
                ))
              ) : (
                <span className="text-slate-600 text-xs italic">No fields assigned</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/farms/${farm.id}`)} className="flex-1 text-muted-foreground hover:text-primary text-[10px] font-black tracking-widest">
            <Eye className="h-3.5 w-3.5 mr-1.5" /> OPEN NODE
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(farm); }} className="h-8 w-8 border-border text-muted-foreground hover:text-foreground hover:bg-slate-800">
                <Edit size={14} />
            </Button>
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(true); }} className="h-8 w-8 border-border text-red-400 hover:bg-red-500/10 hover:text-red-400">
                <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground font-bold tracking-tight">Destroy Node Connection?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              Removing <span className="text-foreground font-bold">{farm.farmName}</span> located at <span className="italic">{address}</span> will unbind all IoT telemetry data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-900 border-border text-secondary-foreground hover:bg-slate-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-foreground hover:bg-red-700 font-bold uppercase text-xs">Confirm Removal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Badge({ children, className }: any) {
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-tighter ${className}`}>
      {children}
    </span>
  );
}