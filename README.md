# 🪚 VLUGGE JAPIE — CALCULATOR v3.0 (Quantum Edition)

> **Voor:** Jaap Schuurmans Meubelmakerij & Interieurbouw  
> **Status:** Production Ready (Quantum Stable)  
> **Engine:** Google Gemini 3.0 Pro + React 18 + Tailwind Quantum UI

![Japie Banner](https://img.shields.io/badge/VLUGGE-JAPIE-orange?style=for-the-badge) ![AI Powered](https://img.shields.io/badge/AI-POWERED-blue?style=for-the-badge) ![Woodworking](https://img.shields.io/badge/CRAFTSMANSHIP-100%25-green?style=for-the-badge)

---

## 🏗️ DE TECHNISCHE BOUWTEKENING (Architectuur)

Dit is geen gewone app; dit is een **digitaal meesterwerk**. Hieronder volgt de blauwdruk van hoe Vlugge Japie een schets omtovert tot een zaaglijst.

### 1. Data Flow Diagram
```mermaid
graph TD
    A[Input: Foto/PDF Tekening] -->|Base64 Encoding| B(React Frontend)
    B -->|API Request + System Prompt v3.0| C{Google Gemini AI}
    C -->|Computer Vision & Logica| D[Analyse & Component Detectie]
    D -->|Validatie & Optimalisatie| E[JSON Productiedossier]
    E -->|Render| F[Dashboard UI]
    F -->|Opslag| G[Local Storage Database]
    F -->|Interactie| H[Quantum Chatbot]
    F -->|Output| I[PDF Zaaglijst / Print]
```

### 2. De Kern: JAPIE SYSTEM PROMPT v3.0
De intelligentie zit in `constants.ts`. Het AI-model volgt een strikt 4-stappenplan:
1.  **Scan:** Herkent meubeltype (keuken, kast, dressoir).
2.  **Detectie:** Identificeert elk paneel (zijwand, bodem, deur).
3.  **Materialisatie:** Koppelt materialen (W18, Houtnerf) en regels (nerfrichting!).
4.  **Calculatie:** Berekent zaagverlies, kantbandlengtes en plaatoptimalisatie.

---

## 🧰 DE GEREEDSCHAPSKIST (Tech Stack)

Net zoals je Festool gebruikt voor het beste resultaat, gebruiken wij deze stack:

| Onderdeel | Technologie | Functie |
|-----------|-------------|---------|
| **Core** | React 19 + TypeScript | Het chassis van de applicatie. |
| **Brain** | Google GenAI SDK | De hersenen (Gemini 3.0 Pro). |
| **Styling** | Tailwind CSS | De afwerking (Industrial Dark Mode). |
| **Icons** | Lucide React | De visuele taal. |
| **Storage** | LocalStorage API | Het archief (Client-side database). |
| **Build** | Vite / Parcel | De werkplaatsmachine. |

---

## 📂 PROJECT STRUCTUUR (De Werkplaats Indeling)

```bash
/
├── index.html              # De voordeur (bevat Print CSS regels)
├── index.tsx               # De hoofdschakelaar
├── App.tsx                 # De routering en state manager
├── types.ts                # Het wetboek (TypeScript definities)
├── constants.ts            # De ziel (System Prompts & Config)
├── services/
│   ├── geminiService.ts    # De lijn naar de AI (Vision & Chat)
│   └── storageService.ts   # Het archiefsysteem
├── components/
│   ├── AnalysisView.tsx    # Het dashboard (Het resultaat)
│   ├── ChatDrawer.tsx      # De assistent (Quantum Chat)
│   ├── ImageViewer.tsx     # Het vergrootglas (Zoom functie)
│   ├── ProjectList.tsx     # De archiefkast (Zoeken & Filteren)
│   └── Logo.tsx            # Het merk
```

---

## ⚙️ INSTALLATIE & AFSTELLING

Wil je de machine opnieuw opbouwen? Volg deze stappen:

### 1. Voorbereiding
Zorg dat je `Node.js` geïnstalleerd hebt.

### 2. Installatie
```bash
npm install
```
Dit installeert alle afhankelijkheden (de schroeven en bouten).

### 3. De Sleutel (API Key)
Maak een `.env` bestand of stel de variabele in je omgeving in:
```bash
API_KEY=jouw_google_gemini_api_key_hier
```
*Zonder deze sleutel start de motor niet.*

### 4. Starten
```bash
npm start
```
De app draait nu op `localhost:1234` (of vergelijkbaar).

---

## 🚀 FUNCTIONALITEITEN (De Specificaties)

### 🧠 1. Quantum Analyse
Upload een schets (zelfs een servetje werkt). Japie herkent:
*   **Korpussen:** Buitenmaten en types.
*   **Panelen:** Alle onderdelen (bodem, dek, zij, rug).
*   **Materialen:** Wit melamine vs. Houtnerf vs. Kleur.
*   **Nerfrichting:** Cruciaal! Houtnerf draait nooit fout.

### 🗄️ 2. Project Archief & Database
Elk project krijgt een uniek **Sequence ID** (bijv. `#1024`).
*   **Zoekfilters:** Zoek op klantnaam, datum, prijs, telefoonnummer of ID.
*   **Persistentie:** Alles wordt lokaal bewaard. Sluit je browser? Geen probleem, Japie onthoudt het.

### 💬 3. Context-Aware Chatbot
De chatbot is niet zomaar een bot. Hij krijgt de **volledige JSON-analyse** van het huidige project in zijn geheugen.
*   *Vraag:* "Hoeveel meter kantband heb ik nodig voor kast 1?"
*   *Japie:* "Voor K1 heb je precies 4.2 meter wit band nodig."

### 🖨️ 4. PDF Rapportage
Geoptimaliseerde print-styles (`@media print` in `index.html`):
*   Verwijdert donkere achtergronden (bespaart inkt).
*   Verbergt knoppen en navigatie.
*   Maakt een strakke, witte lijst voor in de werkplaats.

---

## 📏 REKENREGELS (De Logica)

Japie hanteert de volgende harde regels in zijn brein:

1.  **Plaatmaten:**
    *   Standaard Wit: `2800 x 2070 mm`
    *   Houtnerf/Decor: `2800 x 2100 mm`
2.  **Kantband:**
    *   Fronten: Altijd rondom (4 zijdes).
    *   Zijwanden/Bodem/Dek: Alleen voorzijde (zichtzijde).
    *   Schappen: Alleen voorzijde.
3.  **Nerfrichting:**
    *   Lades: Horizontaal.
    *   Deuren: Verticaal (tenzij anders aangegeven).
    *   NOOIT draaien op de plaatoptimalisatie als er nerf is.

---

## 🔮 TOEKOMSTVISIE (Roadmap)

*   [ ] **CNC Export:** Directe `.mpr` of `.dxf` export voor de Homag/Biesse machines.
*   [ ] **Koppeling Boekhouding:** Automatische factuur op basis van m2 prijs.
*   [ ] **3D Preview:** Een eenvoudige wireframe render van de gedetecteerde kast.

---

**Gemaakt met ❤️ en ☕ voor Jaap Schuurmans.**
*Vlugge Japie - Omdat meten weten is, maar rekenen tijd kost.*
