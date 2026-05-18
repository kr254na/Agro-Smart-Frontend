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
      <DialogContent className="bg-card border-border text-foreground max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="text-primary" size={20} /> Device Configuration
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Device Name</Label>
            <Input 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-card/50 border-border focus:border-primary" required 
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Label className="text-foreground text-xs font-bold">Operational Status</Label>
              <p className="text-[10px] text-muted-foreground">Toggle sensor data stream</p>
            </div>
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-black uppercase text-xs tracking-tighter">
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}