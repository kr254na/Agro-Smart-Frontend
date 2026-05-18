import { useState } from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

export default function DeviceRegistrationModal({ isOpen, onClose, onSave, fieldId }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deviceSerialNumber: '',
    deviceName: '',
    deviceType: 'ALL_IN_ONE',
    fieldId: fieldId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ ...formData, fieldId });
      setFormData({ deviceSerialNumber: '', deviceName: '', deviceType: 'ALL_IN_ONE', fieldId });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="text-primary" size={20} /> Link IoT Device
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-[10px] uppercase font-bold">Hardware Serial Number</Label>
            <Input 
              placeholder="MAC or UUID" 
              value={formData.deviceSerialNumber}
              onChange={e => setFormData({...formData, deviceSerialNumber: e.target.value})}
              className="bg-background border-border" required 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-[10px] uppercase font-bold">Device Nickname</Label>
            <Input 
              placeholder="e.g. Moisture Probe Alpha" 
              value={formData.deviceName}
              onChange={e => setFormData({...formData, deviceName: e.target.value})}
              className="bg-background border-border" required 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-[10px] uppercase font-bold">Sensor Category</Label>
            <Select onValueChange={(val) => setFormData({...formData, deviceType: val})} defaultValue="ALL_IN_ONE">
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="WEATHER">Weather</SelectItem>
                <SelectItem value="SOIL">Soil</SelectItem>
                <SelectItem value="TANK_LEVEL">Tank Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold uppercase text-xs">
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Authorize & Link'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}