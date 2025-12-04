import React from 'react';
import { JapieResponse, Corpus, Plaat } from '../types';
import { Box, Ruler, Scissors, AlertTriangle, CheckCircle, ArrowRight, Printer, Download } from 'lucide-react';
import { ImageViewer } from './ImageViewer';

interface AnalysisViewProps {
  data: JapieResponse;
  onReset: () => void;
}

const SummaryCard: React.FC<{ title: string; value: string | number; sub?: string; icon: React.ReactNode }> = ({ title, value, sub, icon }) => (
  <div className="glass-panel p-4 rounded-xl flex items-start justify-between group hover:bg-white/5 transition-colors page-break-inside-avoid">
    <div>
      <p className="text-brand-accent text-xs uppercase font-bold tracking-wider mb-1 opacity-80">{title}</p>
      <h3 className="text-3xl font-mono text-white tracking-tight">{value}</h3>
      {sub && <p className="text-xs text-gray-300 mt-1 font-medium">{sub}</p>}
    </div>
    <div className="p-3 bg-white/5 rounded-lg text-brand-accent group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
  </div>
);

const CorpusCard: React.FC<{ corpus: Corpus }> = ({ corpus }) => (
  <div className="border border-white/10 bg-brand-dark/80 p-5 rounded-lg hover:border-brand-accent/50 transition-all shadow-lg page-break-inside-avoid break-inside-avoid">
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="text-xs font-mono text-brand-black bg-brand-accent px-2 py-1 rounded font-bold">{corpus.id}</span>
        <h4 className="text-white font-semibold mt-2 text-lg">{corpus.naam}</h4>
        <p className="text-brand-accent text-xs mt-0.5">{corpus.type}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-brand-accent font-bold uppercase mb-0.5">Buitenmaten</p>
        <p className="font-mono text-sm text-gray-200">
          {corpus.buitenmaten.hoogte} × {corpus.buitenmaten.breedte} × {corpus.buitenmaten.diepte}
        </p>
      </div>
    </div>
    
    <div className="space-y-2 bg-black/20 p-3 rounded border border-white/5">
      {corpus.panelen.slice(0, 4).map((p, i) => (
        <div key={i} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0 text-gray-300">
          <span className="font-medium text-white/90">{p.type}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{p.materiaal.code}</span>
            <span className="font-mono text-brand-accent">{p.afmetingen.hoogte}×{p.afmetingen.breedte}</span>
          </div>
        </div>
      ))}
      {corpus.panelen.length > 4 && (
        <div className="text-xs text-center pt-1 text-gray-400 italic">
          + {corpus.panelen.length - 4} andere panelen
        </div>
      )}
    </div>
  </div>
);

const PlaatVisual: React.FC<{ plaat: Plaat }> = ({ plaat }) => (
  <div className="glass-panel p-4 rounded-xl hover:bg-white/5 transition-colors page-break-inside-avoid">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
            {plaat.plaat_id}
        </h4>
        <p className="text-xs text-gray-300 mt-1">{plaat.materiaal} <span className="text-gray-600">•</span> {plaat.formaat}</p>
      </div>
      <div className="text-right">
        <span className={`text-lg font-mono font-bold ${plaat.benutting_percentage > 85 ? 'text-green-400' : 'text-yellow-400'}`}>
          {plaat.benutting_percentage}%
        </span>
        <p className="text-[10px] text-brand-accent uppercase font-bold">Benutting</p>
      </div>
    </div>
    
    <div className="w-full h-24 bg-brand-black border border-white/10 relative overflow-hidden rounded shadow-inner">
      <div className="absolute top-0 left-0 h-full w-[60%] bg-white/10 border-r border-dashed border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors">
        <span className="text-[10px] text-white/50">Optimalisatie Zone A</span>
      </div>
      <div className="absolute top-0 right-0 h-[40%] w-[40%] bg-white/5 border-b border-dashed border-white/20"></div>
      <div className="absolute bottom-0 right-0 h-[60%] w-[40%] bg-brand-accent/10 flex items-center justify-center">
         <span className="text-[9px] text-brand-accent/50">Rest</span>
      </div>
    </div>
  </div>
);

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, onReset }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-32 animate-fade-in print:p-0">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-mono tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse no-print"></span>
                Japie v3.0 Quantum
            </span>
            <span className="text-brand-accent font-mono text-sm font-bold">{data.id}</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{data.project.naam || "Naamloos Project"}</h2>
          <p className="text-gray-300 text-sm mt-1">
            Datum: {new Date(data.timestamp || Date.now()).toLocaleDateString()} • Betrouwbaarheid: <span className="text-white font-bold">{Math.round(data.project.betrouwbaarheid * 100)}%</span>
          </p>
          {data.klant && (
            <div className="mt-2 text-xs text-gray-400 border-l-2 border-brand-accent pl-2">
                <p>Klant: {data.klant.naam}</p>
                <p>Email: {data.klant.email} | Tel: {data.klant.telefoon}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 no-print">
             <button 
                onClick={() => window.print()}
                className="px-4 py-2 text-sm bg-brand-gray border border-white/20 text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 group"
            >
                <Printer className="w-4 h-4 group-hover:text-brand-accent" />
                Print / Opslaan als PDF
            </button>
            <button 
            onClick={onReset}
            className="px-4 py-2 text-sm bg-brand-accent hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-brand-accent/20 transition-all"
            >
            Nieuw Project
            </button>
        </div>
      </div>

      {/* Validatie Messages */}
      {data.validatie.waarschuwingen.length > 0 && (
        <div className="mb-8 p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl flex items-start gap-4 shadow-lg shadow-orange-900/5 print:border-orange-500">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-orange-400 mb-2 uppercase tracking-wide">Japie Validatie Rapport</h4>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-1 list-disc list-inside text-sm text-gray-300">
              {data.validatie.waarschuwingen.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 summary-grid">
        <SummaryCard 
          title="Korpussen" 
          value={data.samenvatting.totaal_korpussen} 
          icon={<Box className="w-6 h-6" />} 
        />
        <SummaryCard 
          title="Totaal Panelen" 
          value={data.samenvatting.totaal_panelen} 
          icon={<Ruler className="w-6 h-6" />} 
        />
        <SummaryCard 
          title="Platen Nodig" 
          value={(Object.values(data.samenvatting.totaal_platen_benodigd) as number[]).reduce((a, b) => a + b, 0)}
          sub="Wit & Houtnerf"
          icon={<ArrowRight className="w-6 h-6" />} 
        />
        <SummaryCard 
          title="Kantband Totaal" 
          value={`${Math.ceil((Object.values(data.samenvatting.totaal_kantband_meters) as number[]).reduce((a, b) => a + b, 0))}m`}
          sub="Incl. 10% zaagverlies"
          icon={<Scissors className="w-6 h-6" />} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 print:block">
        {/* Main Content: Korpussen */}
        <div className="lg:col-span-2 space-y-8 print:mb-8">
          <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                <Box className="w-6 h-6 text-brand-accent" /> 
                Gedetecteerde Elementen
              </h3>
              <div className="grid md:grid-cols-2 gap-4 print:grid-cols-2">
                {data.korpussen.map((corpus) => (
                  <CorpusCard key={corpus.id} corpus={corpus} />
                ))}
              </div>
          </div>
          
          {/* Image Viewer Section at bottom of calculation */}
          {data.imageBase64 && (
            <div className="no-print">
                 <ImageViewer imageBase64={data.imageBase64} />
            </div>
          )}
          
           {/* Static Image for Print only */}
           {data.imageBase64 && (
            <div className="hidden print:block mt-8 break-inside-avoid">
                 <h3 className="text-lg font-bold mb-2">Technische Tekening (Bron)</h3>
                 <img src={data.imageBase64} alt="Bron" className="max-w-full border border-gray-300 rounded" />
            </div>
          )}
        </div>

        {/* Sidebar: Materials & Validation */}
        <div className="space-y-8 print:break-before-page">
          <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-brand-accent" /> 
                Systeem Validatie
              </h3>
              
              <div className="glass-panel p-5 rounded-xl space-y-3">
                <div className="text-[10px] uppercase text-brand-accent font-bold mb-2 tracking-widest">Veiligheids Checks</div>
                {data.validatie.checks_uitgevoerd.map((check, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 py-2">
                    <span className="text-gray-200 capitalize font-medium">{check.check.replace(/_/g, " ")}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide ${check.status === 'OK' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
          </div>

          <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                 Zaagplan Preview
              </h3>
              <div className="space-y-4 print:grid print:grid-cols-2 print:gap-4 print:space-y-0">
                {data.platenberekening.platen.map((plaat, i) => (
                  <PlaatVisual key={i} plaat={plaat} />
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};