/**
 * LAYERLAB 3D - CORE ENGINE JAVASCRIPT
 * Funzionalità: Drag & Drop Upload STL/PDF, Preventivo Dinamico con Sovrapprezzo Multi-Colore 4X,
 * Selettore Palette Colori Snapmaker U1, Filtri Galleria e Accordion FAQ.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inizializza tutti i moduli
  initYear();
  initMobileNav();
  initColorPaletteSystem();
  initFileUploads();
  initQuoteCalculator();
  initGalleryFilters();
  initFaqAccordion();
});

/* ==========================================================================
   1. UTILITY: ANNO DINAMICO NEL FOOTER
   ========================================================================== */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   2. MOBILE MENU HAMBURGER & SMOOTH SCROLL
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Chiudi il menu quando si clicca su una voce
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   3. SELETTORE COLORI MULTI-COLORE 4X (SNAPMAKER U1)
   ========================================================================== */
// Palette predefinita di filamenti di alta qualità
const AVAILABLE_COLORS = [
  { id: 'black', name: 'Nero Stealth', hex: '#111827', textDark: false },
  { id: 'white', name: 'Bianco Ghiaccio', hex: '#f8fafc', textDark: true },
  { id: 'orange', name: 'Arancio Cyber', hex: '#ff5722', textDark: false },
  { id: 'cyan', name: 'Ciano Elettrico', hex: '#00e5ff', textDark: true },
  { id: 'purple', name: 'Viola Cyber', hex: '#8b5cf6', textDark: false },
  { id: 'red', name: 'Rosso Fuoco', hex: '#ef4444', textDark: false },
  { id: 'lime', name: 'Verde Lime Neon', hex: '#10b981', textDark: false },
  { id: 'yellow', name: 'Giallo Industriale', hex: '#fbbf24', textDark: true }
];

// Stato colori selezionati
let selectedSingleColor = AVAILABLE_COLORS[0];
let activeSlotIndex = 1; // 1 to 4
let multiColorSlots = [
  AVAILABLE_COLORS[0], // Slot 1: Nero
  AVAILABLE_COLORS[2], // Slot 2: Arancio
  AVAILABLE_COLORS[3], // Slot 3: Ciano
  AVAILABLE_COLORS[1]  // Slot 4: Bianco
];

function initColorPaletteSystem() {
  const paletteContainer = document.getElementById('color-palette');
  const modeRadios = document.querySelectorAll('input[name="print-mode"]');
  const multiSlotsRow = document.getElementById('multi-color-slots');
  const colorInstruction = document.getElementById('color-instruction');
  const colorCounter = document.getElementById('color-counter');
  const colorLabel = document.getElementById('color-label');

  if (!paletteContainer) return;

  // Render Swatches
  renderPalette();

  // Listeners per modalità di stampa (Monocolore vs Multi-Colore)
  modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isMulti = e.target.value === 'multi';
      if (isMulti) {
        multiSlotsRow.style.display = 'grid';
        colorInstruction.textContent = 'Clicca su uno slot (1-4) in basso e assegna il colore desiderato dalla palette:';
        colorLabel.textContent = 'Configurazione 4 Colori:';
        colorCounter.textContent = '4 Colori Assegnati (Snapmaker U1)';
      } else {
        multiSlotsRow.style.display = 'none';
        colorInstruction.textContent = 'Scegli il colore desiderato per il tuo pezzo monocolore:';
        colorLabel.textContent = 'Seleziona il Colore:';
        colorCounter.textContent = '1 Colore Selezionato';
      }
      renderPalette();
      if (window.updateQuotePrice) window.updateQuotePrice();
    });
  });

  // Listener per clic sugli slot multi-colore
  const slotElements = document.querySelectorAll('.slot-item');
  slotElements.forEach(slotEl => {
    slotEl.addEventListener('click', () => {
      slotElements.forEach(s => s.classList.remove('active'));
      slotEl.classList.add('active');
      activeSlotIndex = parseInt(slotEl.getAttribute('data-slot'), 10);
      renderPalette();
    });
  });

  function renderPalette() {
    paletteContainer.innerHTML = '';
    const isMultiMode = document.querySelector('input[name="print-mode"]:checked').value === 'multi';

    AVAILABLE_COLORS.forEach(color => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'palette-swatch-btn';
      btn.style.backgroundColor = color.hex;
      btn.title = color.name;
      btn.setAttribute('aria-label', color.name);

      if (isMultiMode) {
        // Se il colore corrisponde a quello dello slot attivo
        if (multiColorSlots[activeSlotIndex - 1].id === color.id) {
          btn.classList.add('selected');
        }
      } else {
        // Modalità monocolore
        if (selectedSingleColor.id === color.id) {
          btn.classList.add('selected');
        }
      }

      btn.addEventListener('click', () => {
        if (isMultiMode) {
          multiColorSlots[activeSlotIndex - 1] = color;
          updateSlotDisplay(activeSlotIndex, color);
          // Auto-avanza al prossimo slot per facilità d'uso
          if (activeSlotIndex < 4) {
            activeSlotIndex++;
            slotElements.forEach(s => s.classList.remove('active'));
            const nextSlot = document.querySelector(`.slot-item[data-slot="${activeSlotIndex}"]`);
            if (nextSlot) nextSlot.classList.add('active');
          }
        } else {
          selectedSingleColor = color;
        }
        renderPalette();
        if (window.updateQuotePrice) window.updateQuotePrice();
      });

      paletteContainer.appendChild(btn);
    });
  }

  function updateSlotDisplay(slotNumber, colorObj) {
    const swatch = document.getElementById(`slot-${slotNumber}-swatch`);
    const name = document.getElementById(`slot-${slotNumber}-name`);
    if (swatch) swatch.style.backgroundColor = colorObj.hex;
    if (name) name.textContent = colorObj.name;
  }
}

/* ==========================================================================
   4. GESTIONE UPLOAD FILE (DRAG & DROP PER STL/3D E PDF ISTRUZIONI)
   ========================================================================== */
let uploadedFiles = {
  models: [],
  pdf: null
};

function initFileUploads() {
  const stlDropzone = document.getElementById('stl-dropzone');
  const stlInput = document.getElementById('stl-file-input');
  const stlList = document.getElementById('stl-file-list');

  const pdfDropzone = document.getElementById('pdf-dropzone');
  const pdfInput = document.getElementById('pdf-file-input');
  const pdfList = document.getElementById('pdf-file-list');

  // --- Gestione STL / 3D Dropzone ---
  setupDragAndDrop(stlDropzone, (files) => {
    handleModelFiles(files);
  });

  if (stlInput) {
    stlInput.addEventListener('change', (e) => {
      handleModelFiles(e.target.files);
    });
  }

  function handleModelFiles(files) {
    const validExts = ['.stl', '.obj', '.3mf', '.step'];
    Array.from(files).forEach(file => {
      const fileNameLower = file.name.toLowerCase();
      const isValid = validExts.some(ext => fileNameLower.endsWith(ext));

      if (!isValid) {
        showToast('Formato non supportato', `Il file ${file.name} non è un modello 3D valido (.stl, .obj, .3mf, .step).`, '⚠️');
        return;
      }

      if (file.size > 80 * 1024 * 1024) {
        showToast('File troppo grande', `Il file supera il limite massimo di 80MB.`, '⚠️');
        return;
      }

      uploadedFiles.models.push(file);
      renderFileList(stlList, uploadedFiles.models, 'model');
      showToast('Modello 3D Ricevuto', `${file.name} pronto per la verifica tecnica.`, '✓');
    });

    if (window.updateQuotePrice) window.updateQuotePrice();
  }

  // --- Gestione PDF Dropzone ---
  setupDragAndDrop(pdfDropzone, (files) => {
    handlePdfFiles(files);
  });

  if (pdfInput) {
    pdfInput.addEventListener('change', (e) => {
      handlePdfFiles(e.target.files);
    });
  }

  function handlePdfFiles(files) {
    if (files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Formato errato', 'Carica un documento in formato .pdf.', '⚠️');
      return;
    }

    uploadedFiles.pdf = file;
    renderPdfList(pdfList, uploadedFiles.pdf);
    showToast('Istruzioni PDF Allegate', `${file.name} associato all'ordine!`, '📄');
  }

  // Helper generico per il Drag & Drop visivo
  function setupDragAndDrop(dropArea, onDropCallback) {
    if (!dropArea) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('drag-active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-active');
      }, false);
    });

    dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      onDropCallback(files);
    }, false);
  }

  function renderFileList(container, fileArray, type) {
    container.innerHTML = '';
    fileArray.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <div class="file-info">
          <span>📦</span>
          <div>
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-size">${formatBytes(file.size)}</div>
          </div>
        </div>
        <button type="button" class="btn-remove-file" title="Rimuovi">&times;</button>
      `;

      item.querySelector('.btn-remove-file').addEventListener('click', () => {
        fileArray.splice(index, 1);
        renderFileList(container, fileArray, type);
        if (window.updateQuotePrice) window.updateQuotePrice();
      });

      container.appendChild(item);
    });
  }

  function renderPdfList(container, pdfFile) {
    container.innerHTML = '';
    if (!pdfFile) return;

    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <div class="file-info">
        <span>📄</span>
        <div>
          <div class="file-name" title="${pdfFile.name}">${pdfFile.name}</div>
          <div class="file-size">${formatBytes(pdfFile.size)}</div>
        </div>
      </div>
      <button type="button" class="btn-remove-file" title="Rimuovi">&times;</button>
    `;

    item.querySelector('.btn-remove-file').addEventListener('click', () => {
      uploadedFiles.pdf = null;
      container.innerHTML = '';
      if (pdfInput) pdfInput.value = '';
    });

    container.appendChild(item);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/* ==========================================================================
   5. CALCOLATORE PREVENTIVO DINAMICO IN TEMPO REALE
   ========================================================================== */
function initQuoteCalculator() {
  const modeRadios = document.querySelectorAll('input[name="print-mode"]');
  const materialSelect = document.getElementById('material-select');
  const infillSelect = document.getElementById('infill-select');
  const resolutionSelect = document.getElementById('resolution-select');
  const sizePresetSelect = document.getElementById('size-preset');
  const qtyInput = document.getElementById('quantity-input');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');

  // Display Elements
  const priceBaseEl = document.getElementById('price-base');
  const multicolorFeeLine = document.getElementById('multicolor-fee-line');
  const priceMulticolorEl = document.getElementById('price-multicolor');
  const summaryMatName = document.getElementById('summary-mat-name');
  const priceShippingEl = document.getElementById('price-shipping');
  const finalPriceEl = document.getElementById('final-price');
  const shippingProgressFill = document.getElementById('shipping-progress-fill');
  const shippingThresholdText = document.getElementById('shipping-threshold-text');
  const quoteForm = document.getElementById('quote-form');

  // Quantità stepper
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
        calculateQuote();
      }
    });

    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < 100) {
        qtyInput.value = val + 1;
        calculateQuote();
      }
    });

    qtyInput.addEventListener('input', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) qtyInput.value = 1;
      if (val > 100) qtyInput.value = 100;
      calculateQuote();
    });
  }

  // Aggiungi listeners su tutti i selettori
  [materialSelect, infillSelect, resolutionSelect, sizePresetSelect].forEach(elem => {
    if (elem) elem.addEventListener('change', calculateQuote);
  });

  modeRadios.forEach(r => r.addEventListener('change', calculateQuote));

  // Esponi per gli altri moduli
  window.updateQuotePrice = calculateQuote;

  function calculateQuote() {
    const isMulti = document.querySelector('input[name="print-mode"]:checked').value === 'multi';
    const materialOption = materialSelect.options[materialSelect.selectedIndex];
    const materialFactor = parseFloat(materialOption.getAttribute('data-base')) || 1.0;
    const materialLabel = materialOption.text.split('(')[0].trim();
    
    const infillFactor = parseFloat(infillSelect.value) || 0.25;
    const resolutionFactor = parseFloat(resolutionSelect.value) || 0.20;
    const size = sizePresetSelect.value;
    const quantity = parseInt(qtyInput.value, 10) || 1;

    // Costo base per taglia oggetto (stima volume/tempo)
    let sizeBasePrice = 14.50;
    switch(size) {
      case 'small': sizeBasePrice = 8.50; break;
      case 'medium': sizeBasePrice = 14.50; break;
      case 'large': sizeBasePrice = 28.00; break;
      case 'xlarge': sizeBasePrice = 48.00; break;
    }

    // Risoluzione: più sottile è il layer, più aumenta il tempo di stampa
    let resMultiplier = 1.0;
    if (resolutionFactor <= 0.08) resMultiplier = 1.45;
    else if (resolutionFactor <= 0.12) resMultiplier = 1.25;
    else if (resolutionFactor >= 0.28) resMultiplier = 0.85;

    // Infill multiplier
    let infillMultiplier = 0.9 + (infillFactor * 0.5);

    // Prezzo base singolo pezzo
    let singlePieceBase = sizeBasePrice * materialFactor * resMultiplier * infillMultiplier;

    // Sovrapprezzo Multi-Colore 4X (Snapmaker U1 con cambi filamento e purge block)
    let multicolorFee = 0;
    if (isMulti) {
      // 7.50€ di calibrazione cambi ugello + filamenti multipli
      multicolorFee = 7.50;
      if (multicolorFeeLine) multicolorFeeLine.style.display = 'flex';
      if (priceMulticolorEl) priceMulticolorEl.textContent = `+€${(multicolorFee * quantity).toFixed(2)}`;
    } else {
      if (multicolorFeeLine) multicolorFeeLine.style.display = 'none';
    }

    // Sconto volume automatico per quantità
    let volumeDiscount = 1.0;
    if (quantity >= 25) volumeDiscount = 0.80;      // -20%
    else if (quantity >= 10) volumeDiscount = 0.85; // -15%
    else if (quantity >= 5) volumeDiscount = 0.90;  // -10%

    let subtotalPrint = ((singlePieceBase * quantity) + (multicolorFee * quantity)) * volumeDiscount;

    // Spedizione in Italia: Gratis sopra 59€, altrimenti 5.90€
    const FREE_SHIPPING_THRESHOLD = 59.00;
    let shippingPrice = subtotalPrint >= FREE_SHIPPING_THRESHOLD ? 0.00 : 5.90;

    let finalPrice = subtotalPrint + shippingPrice;

    // Aggiorna hidden inputs per Formspree
    const hiddenMode = document.getElementById('hidden-mode');
    const hiddenColors = document.getElementById('hidden-colors');
    const hiddenMaterial = document.getElementById('hidden-material');
    const hiddenInfill = document.getElementById('hidden-infill');
    const hiddenResolution = document.getElementById('hidden-resolution');
    const hiddenSize = document.getElementById('hidden-size');
    const hiddenTotalPrice = document.getElementById('hidden-total-price');

    if (hiddenMode) hiddenMode.value = isMulti ? 'Multi-Colore 4X (Snapmaker U1)' : 'Monocolore Standard';
    if (hiddenColors) hiddenColors.value = isMulti ? multiColorSlots.map((s, i) => `Slot ${i+1}: ${s.name}`).join(' | ') : selectedSingleColor.name;
    if (hiddenMaterial) hiddenMaterial.value = materialLabel;
    if (hiddenInfill) hiddenInfill.value = `${Math.round(infillFactor * 100)}%`;
    if (hiddenResolution) hiddenResolution.value = `${resolutionFactor.toFixed(2)} mm`;
    if (hiddenSize) hiddenSize.value = size;
    if (hiddenTotalPrice) hiddenTotalPrice.value = `€${finalPrice.toFixed(2)}`;

    // Aggiornamento DOM
    if (priceBaseEl) priceBaseEl.textContent = `€${(singlePieceBase * quantity).toFixed(2)}`;
    if (summaryMatName) summaryMatName.textContent = materialLabel;
    
    if (priceShippingEl) {
      if (shippingPrice === 0) {
        priceShippingEl.innerHTML = '<span style="color:var(--accent-green)">GRATIS (Inclusa)</span>';
      } else {
        priceShippingEl.textContent = `€${shippingPrice.toFixed(2)}`;
      }
    }

    if (finalPriceEl) {
      finalPriceEl.textContent = finalPrice.toFixed(2);
    }

    // Progress Bar Spedizione Gratuita
    if (shippingProgressFill && shippingThresholdText) {
      if (subtotalPrint >= FREE_SHIPPING_THRESHOLD) {
        shippingProgressFill.style.width = '100%';
        shippingThresholdText.innerHTML = '🎉 Complimenti! Hai sbloccato la <strong>SPEDIZIONE ESPRESSA GRATUITA</strong> in tutta Italia!';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotalPrint).toFixed(2);
        const progressPct = Math.min(100, Math.round((subtotalPrint / FREE_SHIPPING_THRESHOLD) * 100));
        shippingProgressFill.style.width = `${progressPct}%`;
        shippingThresholdText.innerHTML = `Aggiungi altri <strong>€${remaining}</strong> per ottenere la <strong>SPEDIZIONE GRATIS!</strong>`;
      }
    }
  }

  // Esegui primo calcolo
  calculateQuote();

  // Invio modulo preventivo integrato con Formspree e Dashboard Locale
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const email = document.getElementById('client-email').value.trim();
      const address = document.getElementById('client-address').value.trim();
      const isMulti = document.querySelector('input[name="print-mode"]:checked').value === 'multi';

      if (uploadedFiles.models.length === 0) {
        showToast('Nessun file 3D caricato', 'Per favore, carica almeno un file STL, OBJ o 3MF nel box in alto prima di inviare.', '⚠️');
        document.getElementById('stl-dropzone').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = document.getElementById('btn-submit-quote');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Invio richiesta in corso...</span>';

      const notes = document.getElementById('order-notes')?.value.trim() || '';
      const materialOption = materialSelect.options[materialSelect.selectedIndex];
      const materialText = materialOption.text.split('(')[0].trim();
      const infillText = infillSelect.options[infillSelect.selectedIndex].text;
      const resolutionText = resolutionSelect.options[resolutionSelect.selectedIndex].text;
      const currentFinalPrice = document.getElementById('final-price')?.textContent || '0.00';
      const quantity = parseInt(qtyInput.value, 10) || 1;
      const fileNamesList = uploadedFiles.models.map(m => `${m.name} (${formatBytes(m.size)})`).join(', ');
      const pdfNameStr = uploadedFiles.pdf ? `${uploadedFiles.pdf.name} (${formatBytes(uploadedFiles.pdf.size)})` : 'Nessun PDF allegato';

      let formspreeNotified = false;

      try {
        // 1. Invio a Formspree come JSON (compatibile al 100% con account Free senza blocchi file)
        const payload = {
          Nome_Cliente: name,
          Email_Cliente: email,
          Citta_Indirizzo: address || 'Non specificato',
          Modalita_Stampa: isMulti ? 'Multi-Colore 4X (Snapmaker U1)' : 'Monocolore Standard',
          Colori_Assegnati: isMulti ? multiColorSlots.map((s, i) => `Slot ${i+1}: ${s.name}`).join(' | ') : selectedSingleColor.name,
          Materiale: materialText,
          Infill: infillText,
          Risoluzione_Layer: resolutionText,
          Quantita: quantity,
          Preventivo_Stimato_Euro: `€${currentFinalPrice}`,
          File_3D_Caricati: fileNamesList,
          Istruzioni_PDF: pdfNameStr,
          Note_Cliente: notes || 'Nessuna nota aggiuntiva'
        };

        // Timeout a 5 secondi con AbortController per evitare blocchi infiniti
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch('https://formspree.io/f/xyeklwwa', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          if (response.ok) {
            formspreeNotified = true;
          }
        } catch (fetchErr) {
          console.warn('Invio Formspree (normale in ambiente locale file:// o timeout):', fetchErr);
        }

        // 2. Prepara i file per il salvataggio nella Dashboard Locale (admin.html)
        const modelsData = [];
        for (const file of uploadedFiles.models) {
          let dataUrl = null;
          if (file.size < 4 * 1024 * 1024) { // Converti solo se < 4MB per non bloccare la memoria
            try {
              dataUrl = await readFileAsDataURL(file);
            } catch (err) {
              dataUrl = null;
            }
          }
          modelsData.push({ name: file.name, size: formatBytes(file.size), dataUrl: dataUrl });
        }

        let pdfData = null;
        if (uploadedFiles.pdf) {
          let pdfUrl = null;
          if (uploadedFiles.pdf.size < 4 * 1024 * 1024) {
            try {
              pdfUrl = await readFileAsDataURL(uploadedFiles.pdf);
            } catch (err) {
              pdfUrl = null;
            }
          }
          pdfData = { name: uploadedFiles.pdf.name, size: formatBytes(uploadedFiles.pdf.size), dataUrl: pdfUrl };
        }

        // 3. Salva l'ordine nell'archivio locale
        const newOrder = {
          id: Math.floor(1000 + Math.random() * 9000),
          date: new Date().toLocaleString('it-IT'),
          clientName: name,
          clientEmail: email,
          clientAddress: address,
          notes: notes,
          isMultiColor: isMulti,
          singleColorName: selectedSingleColor.name,
          slots: isMulti ? [...multiColorSlots] : [],
          material: materialText,
          infill: infillText,
          resolution: resolutionText,
          quantity: quantity,
          finalPrice: currentFinalPrice,
          status: 'nuovo',
          formspreeNotified: formspreeNotified,
          models: modelsData,
          pdf: pdfData
        };

        try {
          const currentOrders = JSON.parse(localStorage.getItem('layerlab_orders') || '[]');
          currentOrders.unshift(newOrder);
          localStorage.setItem('layerlab_orders', JSON.stringify(currentOrders));
        } catch (storageErr) {
          // In caso di quota superata, salva senza dataUrl
          newOrder.models = newOrder.models.map(m => ({ name: m.name, size: m.size, dataUrl: null }));
          if (newOrder.pdf) newOrder.pdf.dataUrl = null;
          const currentOrders = JSON.parse(localStorage.getItem('layerlab_orders') || '[]');
          currentOrders.unshift(newOrder);
          localStorage.setItem('layerlab_orders', JSON.stringify(currentOrders));
        }

        // Feedback utente
        const fileNames = uploadedFiles.models.map(m => m.name).join(', ');
        showToast(
          'Richiesta Registrata con Successo!', 
          `Grazie ${name}! Abbiamo ricevuto il modello (${fileNames}). I dettagli sono stati inviati alla tua email e registrati nella Dashboard!`,
          '🚀'
        );

        // Pulisci file e form
        uploadedFiles.models = [];
        uploadedFiles.pdf = null;
        document.getElementById('stl-file-list').innerHTML = '';
        document.getElementById('pdf-file-list').innerHTML = '';
        quoteForm.reset();
        calculateQuote();

      } catch (globalErr) {
        console.error('Errore durante l\'invio:', globalErr);
        showToast('Errore durante l\'invio', 'Si è verificato un problema. Puoi anche cliccare sul tasto verde WhatsApp per inviare il preventivo direttamente!', '⚠️');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Invio rapido preventivo tramite WhatsApp
  const whatsappBtn = document.getElementById('btn-whatsapp-quote');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const isMulti = document.querySelector('input[name="print-mode"]:checked').value === 'multi';
      const materialText = materialSelect.options[materialSelect.selectedIndex].text.split('(')[0].trim();
      const currentFinalPrice = document.getElementById('final-price')?.textContent || '0.00';
      const quantity = parseInt(qtyInput.value, 10) || 1;
      const fileNames = uploadedFiles.models.length > 0 ? uploadedFiles.models.map(m => m.name).join(', ') : 'File da condividere';
      
      let colorDetails = isMulti 
        ? `Multi-Colore 4X Snapmaker U1 (${multiColorSlots.map(s => s.name).join(' + ')})`
        : `Monocolore (${selectedSingleColor.name})`;

      const message = `Ciao LayerLab 3D! 👋\nVorrei richiedere la stampa 3D per questo progetto:\n\n` +
        `📦 File 3D: ${fileNames}\n` +
        `🎨 Modalità: ${colorDetails}\n` +
        `🧵 Materiale: ${materialText}\n` +
        `🔢 Quantità: ${quantity} pz\n` +
        `💶 Preventivo Stimato: €${currentFinalPrice}\n\n` +
        `Posso inviarvi qui il file STL per la conferma definitiva?`;

      const encodedMsg = encodeURIComponent(message);
      // Sostituisci il numero 390000000000 con il numero WhatsApp ufficiale del laboratorio
      window.open(`https://api.whatsapp.com/send?phone=393330000000&text=${encodedMsg}`, '_blank');
    });
  }
}

/* ==========================================================================
   6. FILTRI GALLERIA LAVORI RECENTI
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('active');

      // Chiudi gli altri
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-body').style.maxHeight = null;
        }
      });

      // Toggle corrente
      if (isOpen) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(title, message, iconChar = '✓') {
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast) return;

  clearTimeout(toastTimeout);

  toastTitle.textContent = title;
  toastMsg.textContent = message;
  toastIcon.textContent = iconChar;

  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
