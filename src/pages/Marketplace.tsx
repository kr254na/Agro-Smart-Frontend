import { useState, useEffect, useCallback } from 'react';
import { 
  Search, MapPin, ShoppingCart, Plus, Minus, Edit, Trash2,
  Package, Loader2, Phone, MessageCircle, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { apiClient } from '@/api/apiClient';

const CATEGORY_MAP: Record<string, string> = {
  SEEDS: "Seeds",
  FERTILIZERS: "Fertilizers",
  EQUIPMENT: "Equipment",
  TOOLS: "Tools",
  CEREALS: "Cereals",
  VEGETABLES: "Vegetables",
  OTHERS: "Others"
};

interface ProductResponse {
  id: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: keyof typeof CATEGORY_MAP;
  imageUrl: string;
  sellerName: string;
  sellerContact: string;
  isSold: boolean;
  createdAt: string;
}

export default function Marketplace() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [myListings, setMyListings] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal & Logic States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{show: boolean, msg: string} | null>(null);

  const initialForm = { productName: '', description: '', price: '', quantity: 1, unit: 'KG', category: 'SEEDS' as keyof typeof CATEGORY_MAP, imageUrl: '' };
  const [productForm, setProductForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- TOAST HELPER ---
  const showNotification = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBrowseProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      const res = await apiClient(`/api/market/products?${params.toString()}`) as Response;
      const result = await res.json();
      if (result.success) setProducts(result.data);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [selectedCategory, searchQuery]);

  const fetchMyListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient('/api/market/products/my-listings') as Response;
      const result = await res.json();
      if (result.success) setMyListings(result.data);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, []);

  const handleSaveProduct = async () => {
    if (!productForm.productName || !productForm.price) return;
    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/market/products/${editingId}` : '/api/market/products';
      const res = await apiClient(url, {
        method,
        body: JSON.stringify({ ...productForm, price: parseFloat(productForm.price) })
      }) as Response;
      
      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        showNotification(method === 'POST' ? 'Listing Deployed to Network' : 'Data Transmission Successful');
        if (method === 'POST') setActiveTab('mylisting');
        activeTab === 'browse' ? await fetchBrowseProducts() : await fetchMyListings();
      }
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  const updateStock = async (productId: number, newQty: number) => {
    if (newQty < 0) return;
    try {
      const p = myListings.find(item => item.id === productId);
      if (!p) return;
      const res = await apiClient(`/api/market/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...p, quantity: newQty })
      }) as Response;
      if (res.ok) {
        showNotification(`Stock Adjusted: ${newQty} ${p.unit}`);
        fetchMyListings();
      }
    } catch (e) { console.error(e); }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await apiClient(`/api/market/products/${deleteConfirmId}`, { method: 'DELETE' }) as Response;
      if (res.ok) {
        showNotification('Listing Permanently Purged');
        activeTab === 'browse' ? await fetchBrowseProducts() : await fetchMyListings();
      }
    } catch (e) { console.error(e); } finally { setDeleteConfirmId(null); }
  };

  const openEditModal = (p: ProductResponse) => {
    setEditingId(p.id);
    setProductForm({
      productName: p.productName,
      description: p.description,
      price: p.price.toString(),
      quantity: p.quantity,
      unit: p.unit,
      category: p.category,
      imageUrl: p.imageUrl
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        activeTab === 'browse' ? fetchBrowseProducts() : fetchMyListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, fetchBrowseProducts, fetchMyListings]);

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
              <ShoppingCart className="text-[#48D87D]" /> Marketplace
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">Lucknow network</p>
          </div>
          <button onClick={() => { setEditingId(null); setProductForm(initialForm); setIsModalOpen(true); }} 
            className="px-6 py-3 bg-[#48D87D] text-black font-black uppercase text-xs tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(72,216,125,0.4)] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Listing
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-[#111] border border-gray-800 p-1 rounded-xl">
            <TabsTrigger value="browse" className="rounded-lg data-[state=active]:bg-[#48D87D] data-[state=active]:text-black text-white font-black uppercase text-[10px]">Browse Market</TabsTrigger>
            <TabsTrigger value="mylisting" className="rounded-lg data-[state=active]:bg-[#48D87D] data-[state=active]:text-black text-white font-black uppercase text-[10px]">My Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                 <Input placeholder="Search crops or tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-[#111] border-gray-800 h-12 text-white" />
               </div>
               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                 <SelectTrigger className="w-full md:w-56 bg-[#111] border-gray-800 h-12 uppercase font-black text-[10px] text-white flex items-center">
                   <SelectValue placeholder="Category" />
                 </SelectTrigger>
                 <SelectContent className="bg-[#111] border-gray-800 text-white">
                    <SelectItem value="ALL" className="text-[10px] font-black uppercase">All Categories</SelectItem>
                    {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-[10px] font-black uppercase">{label}</SelectItem>
                    ))}
                 </SelectContent>
               </Select>
            </div>

            {isLoading ? (
              <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-[#48D87D] mx-auto" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => {
                  const isOut = p.quantity <= 0 || p.isSold;
                  return (
                    <Card key={p.id} className={`bg-[#111] border-gray-800 group overflow-hidden shadow-2xl transition-all ${isOut ? 'opacity-50' : 'hover:border-[#48D87D]/30'}`}>
                      <div className="h-48 relative overflow-hidden">
                        <img src={p.imageUrl || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <Badge className="absolute top-3 left-3 bg-[#48D87D] text-black font-black uppercase text-[8px] tracking-widest">{CATEGORY_MAP[p.category]}</Badge>
                        {isOut && <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-black uppercase text-red-500 text-sm border-2 border-red-500 m-4 italic font-bold text-center">Sold Out</div>}
                      </div>
                      <CardContent className="p-5 space-y-4">
                        <div className="min-h-[60px]">
                          <h3 className="text-xl font-black italic uppercase truncate text-white">{p.productName}</h3>
                          <p className="text-gray-400 text-[10px] line-clamp-2 mt-1 lowercase font-medium italic leading-tight">{p.description || "No technical description provided."}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-black text-white">₹{p.price} <span className="text-[10px] text-gray-500 uppercase font-black">/ {p.unit}</span></p>
                          <Badge variant="outline" className="text-[9px] border-gray-700 text-[#48D87D] uppercase font-black italic">{p.sellerName}</Badge>
                        </div>
                        <Separator className="bg-gray-800" />
                        <div className="flex gap-2">
                           <button onClick={() => {
                             const phone = p.sellerContact.replace(/\D/g, '');
                             window.open(`https://wa.me/${phone.startsWith('91') ? phone : '91'+phone}?text=Interested in ${p.productName}`, '_blank');
                           }} disabled={isOut} className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] font-black uppercase text-[10px] rounded hover:bg-[#25D366] hover:text-black transition-all flex items-center justify-center gap-2"><MessageCircle size={14}/> WhatsApp</button>
                           <a href={isOut ? "#" : `tel:${p.sellerContact}`} className="flex-1 py-3 border border-gray-800 text-gray-400 font-black uppercase text-[10px] rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"><Phone size={14}/> Call</a>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mylisting">
             <Card className="bg-[#111] border-gray-800 shadow-2xl">
                <CardHeader><CardTitle className="text-white font-black uppercase italic">Inventory Management</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {myListings.map(p => (
                    <div key={p.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-black border border-gray-900 rounded-xl gap-4">
                      <div className="flex items-center gap-4 w-full md:w-1/3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${p.quantity <= 0 ? 'bg-red-500/10 text-red-500' : 'bg-[#48D87D]/10 text-[#48D87D]'}`}><Package /></div>
                        <div>
                          <h4 className="font-black text-white uppercase italic">{p.productName}</h4>
                          <p className="text-gray-400 text-[10px] font-bold uppercase">{CATEGORY_MAP[p.category]} • {p.unit}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-zinc-900 border border-gray-800 rounded-lg p-1 shadow-inner min-w-[140px] justify-between">
                        <button onClick={() => updateStock(p.id, p.quantity - 1)} disabled={p.quantity <= 0} className="p-2 text-white hover:text-[#48D87D] disabled:text-zinc-700 disabled:cursor-not-allowed"><Minus size={16}/></button>
                        <span className="text-sm font-black text-white text-center">{p.quantity}</span>
                        <button onClick={() => updateStock(p.id, p.quantity + 1)} className="p-2 text-white hover:text-[#48D87D]"><Plus size={16}/></button>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(p)} className="p-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white"><Edit size={16}/></button>
                        <button onClick={() => setDeleteConfirmId(p.id)} className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  {myListings.length === 0 && <p className="text-center py-10 text-gray-500 uppercase font-black text-xs italic">No listings discovered.</p>}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        {/* --- MODALS & TOAST --- */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-black border border-gray-800 text-white sm:max-w-[550px] !rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-[#48D87D]">{editingId ? 'Edit Listing' : 'Deploy Listing'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Product Name</label><Input value={productForm.productName} onChange={e => setProductForm({...productForm, productName: e.target.value})} className="bg-[#111] border-gray-800 text-white" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Category</label>
                <Select value={productForm.category} onValueChange={v => setProductForm({...productForm, category: v as keyof typeof CATEGORY_MAP})}>
                  <SelectTrigger className="bg-[#111] border-gray-800 text-[10px] font-black uppercase text-white h-12"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-800 text-white">{Object.entries(CATEGORY_MAP).map(([key, label]) => (<SelectItem key={key} value={key} className="text-[10px] font-black uppercase">{label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Price (₹)</label><Input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="bg-[#111] border-gray-800 text-white" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Quantity</label>
                <div className="flex items-center bg-zinc-900 border border-gray-800 rounded-lg h-12 overflow-hidden shadow-inner">
                  <button onClick={() => setProductForm(p=>({...p, quantity: Math.max(0, p.quantity-1)}))} className="flex-1 hover:bg-zinc-800 border-r border-zinc-800 flex justify-center text-white"><Minus size={14}/></button>
                  <div className="flex-1 flex justify-center font-black text-sm text-white">{productForm.quantity}</div>
                  <button onClick={() => setProductForm(p=>({...p, quantity: p.quantity+1}))} className="flex-1 hover:bg-zinc-800 border-l border-zinc-800 flex justify-center text-white"><Plus size={14}/></button>
                </div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Unit</label><Input value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})} className="bg-[#111] border-gray-800 text-white" placeholder="KG, Bag..." /></div>
              <div className="col-span-2 space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Image URL</label><Input value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="bg-[#111] border-gray-800 text-white" /></div>
              <div className="col-span-2 space-y-1.5"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">Details</label><Textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="bg-[#111] border-gray-800 text-white min-h-[100px]" placeholder="Technical data..." /></div>
            </div>
            <button disabled={isSubmitting} onClick={handleSaveProduct} className="w-full py-4 mt-4 bg-[#48D87D] text-black font-black uppercase text-xs rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Finalize Listing'}
            </button>
          </DialogContent>
        </Dialog>

        {/* --- DELETE DIALOG --- */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="bg-black border-2 border-red-900/50 text-white sm:max-w-[400px] !rounded-3xl shadow-2xl">
            <DialogHeader>
              <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-red-500 w-6 h-6" /></div>
              <DialogTitle className="text-center text-xl font-black italic uppercase tracking-tighter">Confirm Delete</DialogTitle>
              <DialogDescription className="text-center text-gray-500 font-bold uppercase text-[9px] mt-2">This item will be permanently removed from the network.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-6">
              <button onClick={executeDelete} className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl hover:bg-red-700 transition-all">Yes, Delete</button>
              <button onClick={() => setDeleteConfirmId(null)} className="w-full py-4 bg-gray-900 text-gray-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- TOAST NOTIFICATION --- */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-300">
            <div className="bg-[#111] border-2 border-[#48D87D] text-white px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(72,216,125,0.2)] flex items-center gap-3">
              <CheckCircle2 className="text-[#48D87D] w-5 h-5" />
              <span className="font-black uppercase text-[10px] tracking-widest">{toast.msg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}