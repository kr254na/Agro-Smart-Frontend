import { useState, useEffect } from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Switch } from '@/app/components/ui/switch';

export default function UpdateDeviceModal({ isOpen, onClose, onSave, device }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (device) {
      setNewName(device.deviceName || '');
      setIsActive(device.active !== undefined ? device.active : true);
    }
  }, [device, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(device.id, newName, isActive);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="text-[#48D87D]" size={20} /> Device Configuration
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-1">
            <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Device Name</Label>
            <Input 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-gray-900/50 border-gray-800 focus:border-[#48D87D]" required 
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-slate-800">
            <div className="space-y-0.5">
              <Label className="text-white text-xs font-bold">Operational Status</Label>
              <p className="text-[10px] text-slate-500">Toggle sensor data stream</p>
            </div>
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-[#48D87D]"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-[#48D87D] text-black font-black uppercase text-xs tracking-tighter">
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}