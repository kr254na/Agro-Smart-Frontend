import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Sprout, Loader2 } from "lucide-react";
import FarmCard, { type Farm } from "./FarmCard";
import AddFarmModal from "./AddFarmModal";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { apiClient } from "@/api/apiCient";

export default function FarmsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setIsLoading(true);
    try {
      const response = (await apiClient("/api/farms")) as Response;
      const result = await response.json();
      if (result.success) setFarms(result.data || []);
    } catch (err) {
      setFarms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFarm = async (farmData: any) => {
    // Check if we are updating (PUT) or creating (POST)
    const isUpdating = !!editingFarm;
    const method = isUpdating ? "PUT" : "POST";
    const url = isUpdating ? `/api/farms/${editingFarm.id}` : "/api/farms";

    try {
      const response = (await apiClient(url, {
        method: method,
        body: JSON.stringify(farmData),
      })) as Response;

      const result = await response.json();
      if (result.success) {
        await fetchFarms();
        setIsAddModalOpen(false);
        setEditingFarm(null); // Reset state
      } else {
        alert("Operation failed: " + result.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDeleteFarm = async (id: string | number) => {
    if (!window.confirm("Confirm permanent deletion of this farm node?")) return;
    try {
      const response = (await apiClient(`/api/farms/${id}`, { method: "DELETE" })) as Response;
      if (response.ok) {
        // Ensure string comparison for IDs
        setFarms((prev) => prev.filter((f) => String(f.id) !== String(id)));
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredFarms = useMemo(() => {
    let result = Array.isArray(farms) ? [...farms] : [];
    if (searchQuery) {
      result = result.filter((f) =>
        f.farmName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [farms, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-12 h-12 text-[#48D87D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* HEADER SECTION - Ensure high contrast */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Infrastructure</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Global Node Registry</p>
        </div>
        
        {/* ADD FARM BUTTON - Made more prominent */}
        <Button
          onClick={() => {
            setEditingFarm(null); // CRITICAL: Reset editing state before opening
            setIsAddModalOpen(true);
          }}
          className="bg-[#48D87D] text-black font-black uppercase text-xs tracking-widest h-12 px-8 hover:bg-[#3bc56d] shadow-[0_0_20px_rgba(72,216,125,0.2)] transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5 stroke-[3]" /> Register New Node
        </Button>
      </div>

      {/* SEARCH SECTION */}
      <div className="max-w-md mb-12">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#48D87D] transition-colors h-4 w-4" />
          <Input
            placeholder="Search farm identifiers..."
            className="bg-[#111] border-slate-800 pl-10 h-12 focus:border-[#48D87D] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FARM LIST */}
      {filteredFarms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onDelete={() => handleDeleteFarm(farm.id!)}
              onEdit={(f) => {
                setEditingFarm(f);
                setIsAddModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border-2 border-dashed border-slate-900">
          <Sprout size={64} className="mx-auto text-slate-800 mb-6 animate-pulse" />
          <h3 className="text-slate-400 font-black uppercase text-sm tracking-widest">No active deployments</h3>
          <p className="text-slate-600 text-xs mt-2 uppercase font-bold">Use the register button above to link your first farm node.</p>
        </div>
      )}

      {/* MODAL */}
      <AddFarmModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFarm(null);
        }}
        onSave={handleSaveFarm}
        editingFarm={editingFarm}
      />
    </div>
  );
}