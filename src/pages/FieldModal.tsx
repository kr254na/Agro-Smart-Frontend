import { useState, useEffect } from 'react';
import { Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: any) => Promise<void>;
  editingField?: any | null; // Added for Update support
}

export default function FieldModal({ isOpen, onClose, onSave, editingField }: FieldModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fieldName: '',
    cropType: '',
    fieldArea: '',
    soilType: '',
  });

  // Pre-populate form when editingField changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fieldName: editingField?.fieldName || '',
        cropType: editingField?.cropType || '',
        fieldArea: editingField?.fieldArea?.toString() || '',
        soilType: editingField?.soilType || '',
      });
    }
  }, [isOpen, editingField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        fieldArea: Number(formData.fieldArea)
      });
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
            <Leaf className="text-primary" size={20} /> 
            {editingField ? 'Update Field Zone' : 'Add New Field Zone'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase font-bold">Field Name</Label>
            <Input 
              value={formData.fieldName} 
              onChange={e => setFormData({...formData, fieldName: e.target.value})} 
              className="bg-card/50 border-border focus:border-primary" placeholder="e.g. North Sector" required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase font-bold">Crop Type</Label>
              <Input 
                value={formData.cropType} 
                onChange={e => setFormData({...formData, cropType: e.target.value})} 
                className="bg-card/50 border-border focus:border-primary" placeholder="Wheat" required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase font-bold">Area (Acres)</Label>
              <Input 
                type="number" step="0.1"
                value={formData.fieldArea} 
                onChange={e => setFormData({...formData, fieldArea: e.target.value})} 
                className="bg-card/50 border-border focus:border-primary" required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs uppercase font-bold">Soil Type</Label>
            <Input 
              value={formData.soilType} 
              onChange={e => setFormData({...formData, soilType: e.target.value})} 
              className="bg-card/50 border-border focus:border-primary" placeholder="Alluvial"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs">
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : editingField ? 'Update Zone' : 'Register Zone'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}