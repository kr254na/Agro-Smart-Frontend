import { useState, useEffect } from 'react';
import { Sprout, Loader2, Navigation, Crosshair } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

// Define the interface locally to avoid import errors
interface FarmData {
  id?: string|number;
  farmName: string;
  latitude: number;
  longitude: number;
  totalArea: number;
}

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farmData: any) => Promise<void>;
  editingFarm?: FarmData | null; // Allow null to match the state in FarmDetailPage
}

export default function AddFarmModal({ isOpen, onClose, onSave, editingFarm }: AddFarmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    latitude: '',
    longitude: '',
    totalArea: '',
  });

  const [errors, setErrors] = useState<any>({});

  // Safely populate the form when the modal opens or editingFarm changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        farmName: editingFarm?.farmName || '',
        latitude: editingFarm?.latitude?.toString() || '',
        longitude: editingFarm?.longitude?.toString() || '',
        totalArea: editingFarm?.totalArea?.toString() || '',
      });
      setErrors({});
    }
  }, [isOpen, editingFarm]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData(prev => ({
        ...prev,
        latitude: pos.coords.latitude.toString(),
        longitude: pos.coords.longitude.toString()
      }));
    });
  };

  const validate = () => {
    const e: any = {};
    if (!formData.farmName.trim()) e.farmName = "Required";
    if (!formData.latitude) e.latitude = "Required";
    if (!formData.longitude) e.longitude = "Required";
    if (!formData.totalArea || parseFloat(formData.totalArea) <= 0) e.totalArea = "Invalid Area";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        farmName: formData.farmName.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        totalArea: Number(formData.totalArea)
      };

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Navigation className="text-primary" size={20} />
            {editingFarm ? 'Update Infrastructure Node' : 'Register New Node'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Farm Identifier</Label>
            <Input
              value={formData.farmName}
              onChange={e => setFormData({...formData, farmName: e.target.value})}
              className="bg-background border-border text-foreground focus:border-primary"
              placeholder="e.g. Lucknow HQ"
            />
            {errors.farmName && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.farmName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Latitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={e => setFormData({...formData, latitude: e.target.value})}
                className="bg-background border-border text-foreground focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Longitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={e => setFormData({...formData, longitude: e.target.value})}
                className="bg-background border-border text-foreground focus:border-primary"
              />
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={getCurrentLocation}
            className="w-full border-border text-muted-foreground text-[10px] font-black uppercase h-9 hover:bg-white/5"
          >
            <Crosshair size={12} className="mr-2 text-primary" /> Sync GPS Coordinates
          </Button>

          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Total Area (Acres)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.totalArea}
              onChange={e => setFormData({...formData, totalArea: e.target.value})}
              className="bg-background border-border text-foreground focus:border-primary"
            />
            {errors.totalArea && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.totalArea}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-muted-foreground font-bold uppercase text-[10px]">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest">
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : editingFarm ? 'Apply Updates' : 'Register Node'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}