# LayerLab 3D - Sito Web & Preventivatore Stampa 3D B2C

Sito web moderno, responsive e ad alte prestazioni per il brand **"LayerLab 3D"**, servizio di stampa 3D B2C in Italia (maker, hobbisti, cosplay, modellismo) specializzato nella tecnologia **multi-colore / multi-materiale fino a 4 colori su Snapmaker U1**.

---

## 🚀 Come Pubblicare su GitHub Pages (Gratuito e Immediato)

Il codice è già organizzato e ottimizzato per funzionare direttamente su **GitHub Pages**:

1. **Crea un nuovo repository su GitHub:**
   - Vai su [github.com/new](https://github.com/new) e chiama il repository (es. `layerlab-3d`).
   - Mantienilo **Public**.

2. **Carica i file del progetto:**
   - Carica direttamente i seguenti file nella radice (`root`) del repository:
     - `index.html`
     - `style.css`
     - `script.js`
     - `README.md`

3. **Attiva GitHub Pages:**
   - Nel tuo repository GitHub, clicca su **Settings** (Impostazioni) in alto a destra.
   - Nella barra laterale sinistra, clicca su **Pages**.
   - Sotto la sezione **"Build and deployment"**:
     - **Source**: `Deploy from a branch`
     - **Branch**: seleziona `main` (o `master`) e cartella `/ (root)`.
     - Clicca su **Save**.

4. **Fatto!**
   - Entro 1-2 minuti GitHub genererà il link pubblico del tuo sito web:
     `https://tuo-username.github.io/layerlab-3d/`

---

## 🌟 Funzionalità Principali Incluse

1. **Header & Branding:**
   - Logo vettoriale stilizzato "LayerLab 3D" con icona ugello di stampa a strati.
   - Barra superiore con badge in evidenza: `🚚 Spedizioni rapide in tutta Italia (24/48h)`.
   - Menu di navigazione responsive con hamburger menu per smartphone.

2. **Hero Section d'Impatto:**
   - Visual 3D isometrico simulato che mostra i 4 strati di colore della tecnologia **Snapmaker U1**.
   - Call to Action principale con scorrimento fluido all'area di preventivo e upload.
   - Statistiche di laboratorio (4 colori simultanei, spedizioni 24/48h, risoluzione fino a 0.08mm).

3. **Upload Interattivo STL + PDF & Preventivatore Dinamico:**
   - **Box Drag & Drop 3D:** supporta file `.stl`, `.obj`, `.3mf`, `.step` fino a 80MB.
   - **Box Drag & Drop PDF:** permette al cliente di allegare le istruzioni con l'assegnazione dei colori o note di assemblaggio.
   - **Toggle Modalità di Stampa:** passaggio istantaneo tra *Monocolore Standard* e *Multi-Colore (Fino a 4 Colori)*.
   - **Selettore Palette Interattivo:** 8 colori vivaci selezionabili e assegnabili a 4 slot dedicati per Snapmaker U1.
   - **Calcolo Dinamico in Tempo Reale:** tiene conto di:
     - Dimensione approssimativa del pezzo (Small, Medium, Large, X-Large).
     - Materiale (PLA Tough 1.0x, PETG Pro 1.25x, ABS/ASA 1.35x, Resina UV 1.70x).
     - Densità di riempimento (Infill 15%, 25%, 50%, 100%).
     - Altezza layer (0.28mm bozza, 0.20mm standard, 0.12mm alta definizione, 0.08mm ultra).
     - Ricarico setup e cambi filamento multi-colore.
     - Sconti quantità automatici (fino al -20%).
     - Spedizione espressa con indicatore di progresso e **spedizione GRATUITA oltre i 59€**.

4. **Vetrina Stampa 4 Colori (Snapmaker U1):**
   - Spiegazione tecnica dei vantaggi: fusi direttamente nella struttura, nessuna verniciatura necessaria, loghi e scritte a contrasto, supporti facili.

5. **Guida ai Materiali & Tecnologie:**
   - Schede comparative dettagliate per PLA Tough, PETG Tecnico, ABS/ASA e Resina UV SLA con classificazione per uso ideale.

6. **Come Funziona (3 Semplici Step):**
   - 1. Carica STL e Istruzioni PDF -> 2. Scegli i 4 Colori e ricevi la stima -> 3. Stampa di precisione e consegna in 24/48h.

7. **Galleria Lavori Recenti con Filtri:**
   - Filtro dinamico per categoria: Multi-Colore 4X, Cosplay, Miniature & Resina, Componenti Tecnici.

8. **FAQ Interattive a Fisarmonica (Accordion):**
   - Risposte chiare su tolleranze, formati file 3D e tempi di produzione.

9. **Footer Completo & Toast Notifications:**
   - Notifiche toast fluttuanti animate per conferme di caricamento file e preventivi.

---

## 🛠️ Personalizzazione Facile

### 1. Modificare i Prezzi o le Formule
Apri `script.js` e modifica i valori nella funzione `calculateQuote()`:
```javascript
// Prezzi base per taglia in euro
switch(size) {
  case 'small': sizeBasePrice = 8.50; break;
  case 'medium': sizeBasePrice = 14.50; break;
  case 'large': sizeBasePrice = 28.00; break;
  case 'xlarge': sizeBasePrice = 48.00; break;
}

// Sovrapprezzo fisso multi-colore (Snapmaker U1)
let multicolorFee = 7.50;

// Soglia per spedizione gratuita
const FREE_SHIPPING_THRESHOLD = 59.00;
```

### 2. Aggiungere o Cambiare i Colori della Palette
In cima a `script.js`:
```javascript
const AVAILABLE_COLORS = [
  { id: 'black', name: 'Nero Stealth', hex: '#111827', textDark: false },
  { id: 'white', name: 'Bianco Ghiaccio', hex: '#f8fafc', textDark: true },
  { id: 'orange', name: 'Arancio Cyber', hex: '#ff5722', textDark: false },
  // Aggiungi qui i tuoi colori
];
```

### 3. Collegare l'Invio del Modulo a un Servizio Email o WhatsApp
In `script.js`, all'interno dell'evento `quoteForm.addEventListener('submit', ...)` puoi inoltrare i dati a:
- **Formspree** o **Formkeep** (per ricevere i file STL e PDF direttamente sulla tua email).
- **API WhatsApp** (creando un link `https://wa.me/39XXXXXXXXXX?text=...` con il riepilogo del preventivo).

---

## 💻 Requisiti Tecnici
- **Nessuna dipendenza npm, webpack o framework pesante.**
- 100% HTML5 semantico, CSS3 (Grid & Flexbox) e Vanilla JavaScript ES6+.
- Compatibile con tutti i browser moderni (Chrome, Safari, Firefox, Edge, Opera) sia Desktop che Mobile.
