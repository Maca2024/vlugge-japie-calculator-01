import React, { useState, useMemo } from 'react';
import { JapieResponse } from '../types';
import { Clock, ChevronRight, FileText, Search, Filter, User, Phone, Mail, Hash } from 'lucide-react';

interface ProjectListProps {
  projects: JapieResponse[];
  onSelect: (project: JapieResponse) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    
    const lowerTerm = searchTerm.toLowerCase();
    
    return projects.filter(p => {
        const matchesName = p.project.naam.toLowerCase().includes(lowerTerm);
        const matchesId = p.id?.toLowerCase().includes(lowerTerm);
        const matchesDate = new Date(p.timestamp || 0).toLocaleDateString().includes(lowerTerm);
        
        // Client filtering
        const matchesClientName = p.klant?.naam.toLowerCase().includes(lowerTerm);
        const matchesEmail = p.klant?.email.toLowerCase().includes(lowerTerm);
        const matchesPhone = p.klant?.telefoon.includes(lowerTerm);
        
        // Price filtering (approximate string match)
        const matchesPrice = p.prijs_indicatie?.toString().includes(lowerTerm);

        return matchesName || matchesId || matchesDate || matchesClientName || matchesEmail || matchesPhone || matchesPrice;
    });
  }, [projects, searchTerm]);

  if (projects.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up delay-200">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-accent" /> 
                {searchTerm ? 'Zoekresultaten' : 'Project Archief'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projecten'} gevonden
            </p>
        </div>

        <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek op naam, datum, nr, klant..."
                className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg leading-5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 sm:text-sm transition-all"
            />
            {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                   <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-white">
                       <span className="text-xs uppercase font-bold">Wis</span>
                   </button>
                </div>
            )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => (
          <div 
            key={p.id} 
            onClick={() => onSelect(p)}
            className="group glass-panel p-5 rounded-xl cursor-pointer hover:border-brand-accent/50 transition-all duration-300 hover:transform hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Hover Accent Flash */}
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-3 pl-2">
              <span className="text-xs font-mono text-brand-accent font-bold bg-brand-accent/10 px-2 py-1 rounded flex items-center gap-1">
                <Hash className="w-3 h-3" /> {p.id}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {new Date(p.timestamp || Date.now()).toLocaleDateString()}
              </span>
            </div>
            
            <div className="pl-2">
                <h4 className="font-bold text-white text-lg mb-1 group-hover:text-brand-accent transition-colors truncate">
                {p.project.naam}
                </h4>
                
                {p.klant && (
                    <div className="flex flex-col gap-1 mt-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <User className="w-3 h-3 text-gray-600" /> {p.klant.naam}
                        </div>
                         {(p.klant.email || p.klant.telefoon) && (
                            <div className="flex gap-3">
                                {p.klant.telefoon && <span className="flex items-center gap-1 text-[10px] text-gray-500"><Phone className="w-2.5 h-2.5" /> {p.klant.telefoon}</span>}
                                {p.klant.email && <span className="flex items-center gap-1 text-[10px] text-gray-500"><Mail className="w-2.5 h-2.5" /> {p.klant.email}</span>}
                            </div>
                        )}
                    </div>
                )}
                
                {p.prijs_indicatie && (
                     <p className="text-sm font-bold text-white mt-1">€ {p.prijs_indicatie.toFixed(2)}</p>
                )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-4 border-t border-white/5 pt-3 pl-2">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" /> {p.samenvatting.totaal_korpussen} korpussen
              </span>
              <span className="flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform text-brand-accent">
                Open Dossier <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
        
        {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-1">Geen projecten gevonden</h4>
                <p className="text-gray-500 text-sm">Probeer een andere zoekterm of wis het filter.</p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase rounded hover:bg-brand-accent/20 transition-colors"
                >
                    Reset Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
