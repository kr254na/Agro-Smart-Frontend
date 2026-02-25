import { useState, useEffect } from 'react';
import { Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

// UPDATED: Added editingField to the interface to satisfy TypeScript
interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: any) => Promise<void>;
  editingField?: any | null; 
}

export default function AddFieldModal({ isOpen, onClose, onSave, editingField }: AddFieldModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fieldName: '',
    cropType: '',
    fieldArea: '',
    soilType: '',
  });

  // UPDATED: Fill form fields if editingField is provided (Update Mode)
  // Clear fields if editingField is null (Create Mode)
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
      // Reset form state on success
      setFormData({ fieldName: '', cropType: '', fieldArea: '', soilType: '' });
      onClose();
    } catch (error) {
      console.error("Failed to save field:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-slate-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="text-[#48D87D]" size={20} /> 
            {editingField ? 'Update Field Zone' : 'Add New Field Zone'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Field Name</Label>
            <Input 
              value={formData.fieldName} 
              onChange={e => setFormData({...formData, fieldName: e.target.value})} 
              className="bg-black border-slate-800 focus:border-[#48D87D] transition-colors" 
              placeholder="e.g. North Sector" 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Crop Type</Label>
              <Input 
                value={formData.cropType} 
                onChange={e => setFormData({...formData, cropType: e.target.value})} 
                className="bg-black border-slate-800 focus:border-[#48D87D] transition-colors" 
                placeholder="Wheat" 
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Area (Acres)</Label>
              <Input 
                type="number" 
                step="0.1"
                value={formData.fieldArea} 
                onChange={e => setFormData({...formData, fieldArea: e.target.value})} 
                className="bg-black border-slate-800 focus:border-[#48D87D] transition-colors" 
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Soil Type</Label>
            <Input 
              value={formData.soilType} 
              onChange={e => setFormData({...formData, soilType: e.target.value})} 
              className="bg-black border-slate-800 focus:border-[#48D87D] transition-colors" 
              placeholder="Alluvial / Clay"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-[#48D87D] hover:bg-[#3bc56d] text-black font-black uppercase tracking-tighter mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              editingField ? 'Update Zone' : 'Register Zone'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}