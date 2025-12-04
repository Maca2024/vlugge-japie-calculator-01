import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './components/Logo';
import { AnalysisView } from './components/AnalysisView';
import { ChatDrawer } from './components/ChatDrawer';
import { ProjectList } from './components/ProjectList';
import { analyzeImage, createChatSession } from './services/geminiService';
import { saveProject, getProjects } from './services/storageService';
import { JapieResponse, AnalysisState } from './types';
import { Camera, Loader2, MessageSquare, AlertCircle, History, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<JapieResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [projects, setProjects] = useState<JapieResponse[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history on mount
  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Upload alstublieft een geldig afbeeldingsbestand (JPG, PNG).");
      return;
    }

    setState('analyzing');
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        // 1. Analyze
        const response = await analyzeImage(base64);
        // 2. Save
        const savedProject = saveProject(response, base64);
        
        // 3. Update State
        setResult(savedProject);
        setProjects(getProjects()); // Refresh list
        createChatSession(savedProject); // Initialize chatbot context
        setState('success');
      } catch (err) {
        console.error(err);
        setErrorMsg("Japie kon de tekening niet verwerken. Probeer een duidelijkere foto.");
        setState('error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjectSelect = (project: JapieResponse) => {
    setResult(project);
    createChatSession(project);
    setState('success');
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const goHome = () => {
    setState('idle');
    setResult(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-accent selection:text-white bg-[#111]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-gray/40 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header - Sticky */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={goHome}>
            <Logo />
          </div>
          
          {state !== 'idle' && state !== 'analyzing' && (
             <button onClick={goHome} className="md:hidden p-2 text-white">
                 <ArrowLeft />
             </button>
          )}

          <div className="hidden md:flex items-center gap-6">
             <button 
                onClick={() => setState(state === 'history' ? 'idle' : 'history')}
                className={`text-sm font-medium flex items-center gap-2 transition-colors ${state === 'history' ? 'text-brand-accent' : 'text-gray-400 hover:text-white'}`}
             >
                <History className="w-4 h-4" /> Project Historie
             </button>
             
             {state === 'success' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-green-400 font-mono tracking-wide">SYSTEM READY</span>
                </div>
             )}
          </div>
        </div>
      </header>

      <main className="relative pb-24">
        {state === 'idle' && (
          <>
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in-up mt-12">
              <div className="max-w-3xl w-full space-y-10">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">
                    VLUGGE <span className="text-brand-accent">JAPIE</span>
                  </h2>
                  <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed font-light">
                    De <span className="text-white font-medium">Quantum-Powered</span> calculator voor Jaap Schuurmans. 
                    Sleep je tekening hierin en krijg direct een productiedossier.
                  </p>
                </div>

                {/* Upload Card */}
                <div 
                  onClick={triggerUpload}
                  className="group relative overflow-hidden bg-brand-gray/40 border-2 border-dashed border-white/10 hover:border-brand-accent rounded-3xl p-12 cursor-pointer transition-all duration-500 hover:bg-brand-gray/60 hover:shadow-2xl hover:shadow-brand-accent/10"
                >
                  <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-brand-accent/40 group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Start Nieuwe Analyse</h3>
                      <p className="text-sm text-gray-400">Ondersteunt JPG, PNG, WEBP, PDF</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
            {/* Show recent projects below */}
            <ProjectList projects={projects.slice(0, 3)} onSelect={handleProjectSelect} />
          </>
        )}

        {state === 'history' && (
            <div className="animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Project Archief</h2>
                    <p className="text-gray-400">Database met alle voorgaande calculaties.</p>
                </div>
                <ProjectList projects={projects} onSelect={handleProjectSelect} />
            </div>
        )}

        {state === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-accent/20 blur-2xl rounded-full animate-pulse"></div>
              <Loader2 className="w-20 h-20 text-brand-accent animate-spin relative z-10" />
            </div>
            <h3 className="mt-10 text-3xl font-bold text-white tracking-tight">Japie Rekent...</h3>
            <div className="flex flex-col items-center gap-2 mt-4">
                <p className="text-gray-300 font-mono text-sm">Component Detectie <span className="text-green-400">OK</span></p>
                <p className="text-gray-400 font-mono text-xs animate-pulse">Optimalisatie Zaagplan...</p>
            </div>
            
            <div className="mt-12 w-64 bg-brand-gray h-1 rounded-full overflow-hidden">
              <div className="h-full bg-brand-accent animate-[shimmer_1.5s_infinite] w-1/2 rounded-full"></div>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Systeem Fout</h3>
            <p className="text-gray-400 max-w-md mb-10 leading-relaxed">{errorMsg}</p>
            <button 
              onClick={() => setState('idle')}
              className="px-8 py-4 bg-white text-brand-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
              Terug naar Dashboard
            </button>
          </div>
        )}

        {state === 'success' && result && (
          <AnalysisView data={result} onReset={goHome} />
        )}
      </main>

      {/* Floating Action Button for Chat */}
      {state === 'success' && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-brand-accent text-white rounded-full shadow-2xl shadow-brand-accent/40 flex items-center justify-center hover:scale-110 hover:bg-orange-600 transition-all border-4 border-[#111]"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#111] rounded-full"></span>
          </button>
        </div>
      )}

      {/* Chat Interface */}
      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        projectName={result?.project.naam || "Project"} 
      />
    </div>
  );
};

export default App;
