import { Brain, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';

export default function AnalysisPage() {
  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#48D87D]/20 rounded-lg">
                <Brain className="h-6 w-6 text-[#48D87D]" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">AI Engine v2.0</h1>
            </div>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] ml-1">
              Neural Network Analysis & Predictive Agronomy
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Status</span>
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
                <ShieldCheck size={12} className="text-[#48D87D]" /> pushpeaks7-agro-smart-ai.hf.space
              </span>
            </div>
            <a 
              href="https://pushpeaks7-agro-smart-ai.hf.space" 
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
              src="https://pushpeaks7-agro-smart-ai.hf.space" 
              width="100%" 
              height="800px" 
              style={{
                border: 'none',
                filter: 'contrast(1.05) brightness(0.95)', // Subtle adjustment to match dark theme
              }}
              title="AgroSmart AI Model"
              className="relative z-10"
            />
          </CardContent>
        </Card>

        {/* Footer Insights Meta */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetaCard 
            icon={<Zap size={14} />} 
            title="Real-time Inference" 
            desc="Model processes live sensor data from connected IoT field nodes." 
          />
          <MetaCard 
            icon={<Brain size={14} />} 
            title="Neural Architecture" 
            desc="Optimized for multi-variable agricultural yield forecasting." 
          />
          <MetaCard 
            icon={<ShieldCheck size={14} />} 
            title="Encrypted Stream" 
            desc="All telemetry data is anonymized before cloud processing." 
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
        <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Separator({ orientation, className }: { orientation: string, className: string }) {
  return <div className={`${orientation === 'vertical' ? 'w-[1px]' : 'h-[1px]'} ${className}`} />;
}