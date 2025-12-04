export interface JapieResponse {
  id?: string; // Sequence ID (e.g., #1024)
  imageBase64?: string; // Stored image for reference
  timestamp?: number;
  // New fields for filtering
  klant?: {
    naam: string;
    email: string;
    telefoon: string;
  };
  prijs_indicatie?: number;
  
  project: {
    naam: string;
    datum_analyse: string;
    betrouwbaarheid: number;
    versie: string;
    bron_bestand: string;
  };
  samenvatting: {
    totaal_korpussen: number;
    totaal_panelen: number;
    totaal_platen_benodigd: Record<string, number>;
    totaal_kantband_meters: Record<string, number>;
    geschat_restmateriaal_percentage: number;
  };
  korpussen: Corpus[];
  platenberekening: {
    platen: Plaat[];
  };
  validatie: {
    checks_uitgevoerd: { check: string; status: string }[];
    waarschuwingen: string[];
    fouten: string[];
  };
}

export interface Corpus {
  id: string;
  naam: string;
  type: string;
  buitenmaten: { hoogte: number; breedte: number; diepte: number };
  panelen: Paneel[];
}

export interface Paneel {
  id: string;
  type: string;
  afmetingen: { hoogte: number; breedte: number; dikte: number };
  materiaal: {
    code: string;
    omschrijving: string;
    kleur: string;
    nerf: 'geen' | 'verticaal' | 'horizontaal';
  };
  kantband_totaal_mm: number;
  kantband: {
    boven: { nodig: boolean; lengte_mm: number };
    onder: { nodig: boolean; lengte_mm: number };
    links: { nodig: boolean; lengte_mm: number };
    rechts: { nodig: boolean; lengte_mm: number };
  };
}

export interface Plaat {
  plaat_id: string;
  formaat: string;
  materiaal: string;
  benutting_percentage: number;
}

export type AnalysisState = 'idle' | 'analyzing' | 'success' | 'error' | 'history';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
