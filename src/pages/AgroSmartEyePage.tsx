import { Eye, ExternalLink, ShieldCheck, Camera } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';

export default function AgroSmartEyePage() {
  return (
    <div className="p-6 lg:p-8 bg-gray-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#48D87D]/20 rounded-lg">
                <Eye className="h-6 w-6 text-[#48D87D]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Agro Smart Eye</h1>
            </div>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] ml-1">
              Computer Vision & Crop Disease Detection
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vision Model</span>
              <span className="text-[#48D87D] text-xs font-bold uppercase">● Operational</span>
            </div>
            <Badge className="bg-[#48D87D]/10 text-[#48D87D] border-[#48D87D]/20 px-3 py-1 font-black">
              HUGGINGFACE SPACES CLOUD
            </Badge>
          </div>
        </div>

        {/* Model Container */}
        <Card className="bg-[#111] border-slate-800 overflow-hidden shadow-2xl relative">
          {/* Top Bar for the Iframe Container */}
          <div className="bg-black/40 border-b border-slate-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#48D87D]/20" />
              </div>
              <Separator orientation="vertical" className="h-4 bg-slate-800 mx-2" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} className="text-[#48D87D]" /> pushpeaks7-agro-smart-eye.hf.space
              </span>
            </div>
            <a 
              href="https://huggingface.co/spaces/Pushpeaks7/AGRO-SMART-EYE" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-500 hover:text-[#48D87D] transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>

          <CardContent className="p-0 bg-black relative">
            {/* Loading Glow Backdrop */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(72,216,125,0.05)]" />
            
            <iframe 
              src="https://pushpeaks7-agro-smart-eye.hf.space" 
              width="100%" 
              height="800px" 
              style={{
                border: 'none',
                filter: 'contrast(1.05) brightness(0.95)', // Subtle adjustment to match dark theme
              }}
              title="AgroSmart Eye Model"
              className="relative z-10"
            />
          </CardContent>
        </Card>

        {/* Footer Insights Meta */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetaCard 
            icon={<Camera size={14} />} 
            title="Image Recognition" 
            desc="Advanced visual analysis of plant leaves and crops." 
          />
          <MetaCard 
            icon={<Eye size={14} />} 
            title="Disease Detection" 
            desc="Identify early signs of crop diseases and nutrient deficiencies." 
          />
          <MetaCard 
            icon={<ShieldCheck size={14} />} 
            title="Actionable Insights" 
            desc="Get immediate recommendations for crop treatment." 
          />
        </div>
      </div>
    </div>
  );
}

function MetaCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#111]/50 border border-slate-800/50 p-4 rounded-xl flex gap-4 items-start">
      <div className="text-[#48D87D] mt-1">{icon}</div>
      <div>
        <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Separator({ orientation, className }: { orientation: string, className: string }) {
  return <div className={`${orientation === 'vertical' ? 'w-[1px]' : 'h-[1px]'} ${className}`} />;
}
