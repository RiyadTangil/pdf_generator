/**
 * AIR TICKET ITINERARY PDF GENERATOR - APP LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // SAMPLE DATA FROM USER PROMPT / SPECIFICATION
  const sampleData = {
    agencyName: "Tanvir Air Travels",
    agencyTagline: "-Govt. Approved Travel Agent.",
    agencyAddress: "ADDRESS : Sharno Market (2nd Floor), Dollai Nowabpur,\nChandina, Comilla, Bangladesh.",
    agencyMobile1: "+88 01761-953000",
    agencyMobile2: "+88 01304-222233",
    logoDataUrl: null,

    passengerName: "BILAL HOSSAN",
    passportNumber: "A22042921",
    passengerMobile: "",

    pnr: "PBQU7T",
    airTicketNumber: "-",
    dateOfIssue: "25 July 2026",
    checkInStatus: "",

    typography: {
      headerSize: "1.5rem",
      headerWeight: "800",
      bodySize: "0.78rem",
      bodyWeight: "600",
      codeSize: "1.8rem",
      codeWeight: "900"
    },

    segments: [
      {
        id: "seg-1",
        flightNo: "INDIGO (6E 1118)",
        from: "DAC",
        to: "HYD",
        departDate: "01 AUG 26",
        departTime: "13:05",
        arriveDate: "01 AUG 26",
        arriveTime: "15:10",
        baggage: "30 KG",
        travelClass: "ECONOMY",
        duration: "02h 05m",
        food: "NO",
        status: "CONFIRM",
        layoverStop: "01 stop (02 Hours 30 Minutes in HYD)"
      },
      {
        id: "seg-2",
        flightNo: "INDIGO (6E 57)",
        from: "HYD",
        to: "MED",
        departDate: "01 AUG 26",
        departTime: "17:40",
        arriveDate: "01 AUG 26",
        arriveTime: "20:50",
        baggage: "30 KG",
        travelClass: "ECONOMY",
        duration: "03h 10m",
        food: "YES",
        status: "CONFIRM",
        layoverStop: ""
      }
    ]
  };

  // APPLICATION STATE
  let state = JSON.parse(JSON.stringify(sampleData));
  let zoomLevel = 1.0;
  let currentLayout = 'layout-luxury'; // 'layout-luxury' | 'layout-modern' | 'layout-classic'
  let currentTheme = 'theme-modern-blue';

  // DOM ELEMENTS - INPUTS
  const agencyNameInput = document.getElementById('agency-name');
  const agencyTaglineInput = document.getElementById('agency-tagline');
  const agencyAddressInput = document.getElementById('agency-address');
  const agencyMobile1Input = document.getElementById('agency-mobile1');
  const agencyMobile2Input = document.getElementById('agency-mobile2');
  const agencyLogoFile = document.getElementById('agency-logo-file');
  const btnResetLogo = document.getElementById('btn-reset-logo');
  const logoFileName = document.getElementById('logo-file-name');

  // TYPOGRAPHY INPUTS
  const fontHeaderSizeSelect = document.getElementById('font-header-size');
  const fontHeaderWeightSelect = document.getElementById('font-header-weight');
  const fontBodySizeSelect = document.getElementById('font-body-size');
  const fontBodyWeightSelect = document.getElementById('font-body-weight');
  const fontCodeSizeSelect = document.getElementById('font-code-size');
  const fontCodeWeightSelect = document.getElementById('font-code-weight');

  const passNameInput = document.getElementById('pass-name');
  const passPassportInput = document.getElementById('pass-passport');
  const passMobileInput = document.getElementById('pass-mobile');

  const ticketPnrInput = document.getElementById('ticket-pnr');
  const ticketNumberInput = document.getElementById('ticket-number');
  const ticketDateInput = document.getElementById('ticket-date');
  const ticketCheckinInput = document.getElementById('ticket-checkin');

  const flightsContainer = document.getElementById('flight-segments-container');
  const btnAddSegment = document.getElementById('btn-add-segment');

  // DOM ELEMENTS - PREVIEW DOCUMENT
  const ticketDocument = document.getElementById('ticket-document');

  // ACTION BUTTONS & SELECTORS
  const btnLoadSample = document.getElementById('btn-load-sample');
  const btnClearForm = document.getElementById('btn-clear-form');
  const layoutSelect = document.getElementById('layout-select');
  const themeSelect = document.getElementById('theme-select');
  const btnPrint = document.getElementById('btn-print');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  // ZOOM CONTROLS
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const zoomLevelSpan = document.getElementById('zoom-level');

  // INITIALIZE APP
  init();

  function init() {
    bindFormEvents();
    bindActionEvents();
    bindAccordionEvents();
    bindZoomEvents();
    loadStateToForm();
    renderPreview();
  }

  // POPULATE FORM INPUTS FROM STATE
  function loadStateToForm() {
    agencyNameInput.value = state.agencyName || '';
    agencyTaglineInput.value = state.agencyTagline || '';
    agencyAddressInput.value = state.agencyAddress || '';
    agencyMobile1Input.value = state.agencyMobile1 || '';
    agencyMobile2Input.value = state.agencyMobile2 || '';

    if (state.typography) {
      fontHeaderSizeSelect.value = state.typography.headerSize || '1.5rem';
      fontHeaderWeightSelect.value = state.typography.headerWeight || '800';
      fontBodySizeSelect.value = state.typography.bodySize || '0.78rem';
      fontBodyWeightSelect.value = state.typography.bodyWeight || '600';
      fontCodeSizeSelect.value = state.typography.codeSize || '1.8rem';
      fontCodeWeightSelect.value = state.typography.codeWeight || '900';
    }

    passNameInput.value = state.passengerName || '';
    passPassportInput.value = state.passportNumber || '';
    passMobileInput.value = state.passengerMobile || '';

    ticketPnrInput.value = state.pnr || '';
    ticketNumberInput.value = state.airTicketNumber || '';
    ticketDateInput.value = state.dateOfIssue || '';
    ticketCheckinInput.value = state.checkInStatus || '';

    renderFlightSegmentInputs();
  }

  // RENDER DYNAMIC FLIGHT FORM CARDS IN EDITOR
  function renderFlightSegmentInputs() {
    flightsContainer.innerHTML = '';

    state.segments.forEach((seg, index) => {
      const card = document.createElement('div');
      card.className = 'segment-card';
      card.dataset.id = seg.id;

      card.innerHTML = `
        <div class="segment-card-header">
          <span class="segment-title"><i class="fa-solid fa-plane-flight"></i> Segment #${index + 1}</span>
          ${state.segments.length > 1 ? `<button type="button" class="btn btn-sm btn-danger btn-remove-seg" data-id="${seg.id}"><i class="fa-solid fa-trash"></i> Remove</button>` : ''}
        </div>

        <div class="form-row">
          <div class="form-group full-width">
            <label>Flight # & Airline Name</label>
            <input type="text" class="input-seg-flight" data-id="${seg.id}" value="${seg.flightNo}" placeholder="e.g. INDIGO (6E 1118)">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>From (Airport Code)</label>
            <input type="text" class="input-seg-from" data-id="${seg.id}" value="${seg.from}" placeholder="e.g. DAC">
          </div>
          <div class="form-group">
            <label>To (Airport Code)</label>
            <input type="text" class="input-seg-to" data-id="${seg.id}" value="${seg.to}" placeholder="e.g. HYD">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Depart Date & Time</label>
            <input type="text" class="input-seg-depart-date" data-id="${seg.id}" value="${seg.departDate}" placeholder="Date (e.g. 01 AUG 26)">
            <input type="text" class="input-seg-depart-time margin-top-xs" data-id="${seg.id}" value="${seg.departTime}" placeholder="Time (e.g. 13:05)">
          </div>
          <div class="form-group">
            <label>Arrive Date & Time</label>
            <input type="text" class="input-seg-arrive-date" data-id="${seg.id}" value="${seg.arriveDate}" placeholder="Date (e.g. 01 AUG 26)">
            <input type="text" class="input-seg-arrive-time margin-top-xs" data-id="${seg.id}" value="${seg.arriveTime}" placeholder="Time (e.g. 15:10)">
          </div>
        </div>

        <div class="form-row margin-top-xs">
          <div class="form-group">
            <label>Baggage</label>
            <input type="text" class="input-seg-baggage" data-id="${seg.id}" value="${seg.baggage}" placeholder="e.g. 30 KG">
          </div>
          <div class="form-group">
            <label>Class</label>
            <input type="text" class="input-seg-class" data-id="${seg.id}" value="${seg.travelClass}" placeholder="e.g. ECONOMY">
          </div>
        </div>

        <div class="form-row margin-top-xs">
          <div class="form-group">
            <label>Flight Duration</label>
            <input type="text" class="input-seg-duration" data-id="${seg.id}" value="${seg.duration || ''}" placeholder="e.g. 02h 05m">
          </div>
          <div class="form-group">
            <label>Food / Meals</label>
            <input type="text" class="input-seg-food" data-id="${seg.id}" value="${seg.food}" placeholder="e.g. NO / YES">
          </div>
        </div>

        <div class="form-row margin-top-xs">
          <div class="form-group full-width">
            <label>Booking Status</label>
            <input type="text" class="input-seg-status" data-id="${seg.id}" value="${seg.status}" placeholder="e.g. CONFIRM">
          </div>
        </div>

        <div class="layover-box margin-top-xs">
          <div class="form-group full-width">
            <label>Layover / Connection Stop Details (Optional)</label>
            <input type="text" class="input-seg-layover" data-id="${seg.id}" value="${seg.layoverStop || ''}" placeholder="e.g. 01 stop (02 Hours 30 Minutes in HYD)">
          </div>
        </div>
      `;

      flightsContainer.appendChild(card);
    });

    bindSegmentInputEvents();
  }

  // BIND SEGMENT FORM EVENTS
  function bindSegmentInputEvents() {
    document.querySelectorAll('.btn-remove-seg').forEach(btn => {
      btn.onclick = (e) => {
        const id = e.currentTarget.dataset.id;
        state.segments = state.segments.filter(s => s.id !== id);
        renderFlightSegmentInputs();
        renderPreview();
      };
    });

    const updateSegField = (id, field, value) => {
      const seg = state.segments.find(s => s.id === id);
      if (seg) {
        seg[field] = value;
        renderPreview();
      }
    };

    flightsContainer.querySelectorAll('input').forEach(input => {
      input.oninput = (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('input-seg-flight')) updateSegField(id, 'flightNo', e.target.value);
        if (e.target.classList.contains('input-seg-from')) updateSegField(id, 'from', e.target.value);
        if (e.target.classList.contains('input-seg-to')) updateSegField(id, 'to', e.target.value);
        if (e.target.classList.contains('input-seg-depart-date')) updateSegField(id, 'departDate', e.target.value);
        if (e.target.classList.contains('input-seg-depart-time')) updateSegField(id, 'departTime', e.target.value);
        if (e.target.classList.contains('input-seg-arrive-date')) updateSegField(id, 'arriveDate', e.target.value);
        if (e.target.classList.contains('input-seg-arrive-time')) updateSegField(id, 'arriveTime', e.target.value);
        if (e.target.classList.contains('input-seg-baggage')) updateSegField(id, 'baggage', e.target.value);
        if (e.target.classList.contains('input-seg-class')) updateSegField(id, 'travelClass', e.target.value);
        if (e.target.classList.contains('input-seg-duration')) updateSegField(id, 'duration', e.target.value);
        if (e.target.classList.contains('input-seg-food')) updateSegField(id, 'food', e.target.value);
        if (e.target.classList.contains('input-seg-status')) updateSegField(id, 'status', e.target.value);
        if (e.target.classList.contains('input-seg-layover')) updateSegField(id, 'layoverStop', e.target.value);
      };
    });
  }

  // BIND MAIN FORM EVENTS
  function bindFormEvents() {
    agencyNameInput.oninput = (e) => { state.agencyName = e.target.value; renderPreview(); };
    agencyTaglineInput.oninput = (e) => { state.agencyTagline = e.target.value; renderPreview(); };
    agencyAddressInput.oninput = (e) => { state.agencyAddress = e.target.value; renderPreview(); };
    agencyMobile1Input.oninput = (e) => { state.agencyMobile1 = e.target.value; renderPreview(); };
    agencyMobile2Input.oninput = (e) => { state.agencyMobile2 = e.target.value; renderPreview(); };

    // Typography Controls
    fontHeaderSizeSelect.onchange = (e) => { state.typography.headerSize = e.target.value; renderPreview(); };
    fontHeaderWeightSelect.onchange = (e) => { state.typography.headerWeight = e.target.value; renderPreview(); };
    fontBodySizeSelect.onchange = (e) => { state.typography.bodySize = e.target.value; renderPreview(); };
    fontBodyWeightSelect.onchange = (e) => { state.typography.bodyWeight = e.target.value; renderPreview(); };
    fontCodeSizeSelect.onchange = (e) => { state.typography.codeSize = e.target.value; renderPreview(); };
    fontCodeWeightSelect.onchange = (e) => { state.typography.codeWeight = e.target.value; renderPreview(); };

    passNameInput.oninput = (e) => { state.passengerName = e.target.value; renderPreview(); };
    passPassportInput.oninput = (e) => { state.passportNumber = e.target.value; renderPreview(); };
    passMobileInput.oninput = (e) => { state.passengerMobile = e.target.value; renderPreview(); };

    ticketPnrInput.oninput = (e) => { state.pnr = e.target.value; renderPreview(); };
    ticketNumberInput.oninput = (e) => { state.airTicketNumber = e.target.value; renderPreview(); };
    ticketDateInput.oninput = (e) => { state.dateOfIssue = e.target.value; renderPreview(); };
    ticketCheckinInput.oninput = (e) => { state.checkInStatus = e.target.value; renderPreview(); };

    // Logo File Upload
    agencyLogoFile.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.logoDataUrl = event.target.result;
          logoFileName.textContent = file.name;
          renderPreview();
        };
        reader.readAsDataURL(file);
      }
    };

    btnResetLogo.onclick = () => {
      state.logoDataUrl = null;
      agencyLogoFile.value = '';
      logoFileName.textContent = 'Default Tanvir Air Logo';
      renderPreview();
    };

    btnAddSegment.onclick = () => {
      const newId = `seg-${Date.now()}`;
      state.segments.push({
        id: newId,
        flightNo: 'AIRLINE (FLIGHT #)',
        from: 'DAC',
        to: 'DXB',
        departDate: '01 AUG 26',
        departTime: '12:00',
        arriveDate: '01 AUG 26',
        arriveTime: '15:00',
        baggage: '30 KG',
        travelClass: 'ECONOMY',
        duration: '03h 00m',
        food: 'YES',
        status: 'CONFIRM',
        layoverStop: ''
      });
      renderFlightSegmentInputs();
      renderPreview();
    };
  }

  // BIND TOP BAR & ACTION BUTTONS
  function bindActionEvents() {
    btnLoadSample.onclick = () => {
      state = JSON.parse(JSON.stringify(sampleData));
      loadStateToForm();
      renderPreview();
    };

    btnClearForm.onclick = () => {
      state = {
        agencyName: '',
        agencyTagline: '',
        agencyAddress: '',
        agencyMobile1: '',
        agencyMobile2: '',
        logoDataUrl: null,

        typography: {
          headerSize: "1.5rem",
          headerWeight: "800",
          bodySize: "0.78rem",
          bodyWeight: "600",
          codeSize: "1.8rem",
          codeWeight: "900"
        },

        passengerName: '',
        passportNumber: '',
        passengerMobile: '',

        pnr: '',
        airTicketNumber: '',
        dateOfIssue: '',
        checkInStatus: '',

        segments: [{
          id: `seg-${Date.now()}`,
          flightNo: '',
          from: '',
          to: '',
          departDate: '',
          departTime: '',
          arriveDate: '',
          arriveTime: '',
          baggage: '',
          travelClass: '',
          duration: '',
          food: '',
          status: '',
          layoverStop: ''
        }]
      };
      loadStateToForm();
      renderPreview();
    };

    layoutSelect.onchange = (e) => {
      currentLayout = e.target.value;
      renderPreview();
    };

    themeSelect.onchange = (e) => {
      currentTheme = e.target.value;
      renderPreview();
    };

    btnPrint.onclick = () => {
      window.print();
    };

    btnDownloadPdf.onclick = () => {
      downloadPDF();
    };
  }

  // ACCORDIONS TOGGLE
  function bindAccordionEvents() {
    document.querySelectorAll('.card-header').forEach(header => {
      header.onclick = () => {
        const card = header.closest('.card');
        card.classList.toggle('active');
      };
    });
  }

  // ZOOM CONTROLS
  function bindZoomEvents() {
    btnZoomIn.onclick = () => {
      if (zoomLevel < 1.4) {
        zoomLevel += 0.1;
        applyZoom();
      }
    };

    btnZoomOut.onclick = () => {
      if (zoomLevel > 0.6) {
        zoomLevel -= 0.1;
        applyZoom();
      }
    };

    btnZoomReset.onclick = () => {
      zoomLevel = 1.0;
      applyZoom();
    };

    function applyZoom() {
      ticketDocument.style.transform = `scale(${zoomLevel})`;
      zoomLevelSpan.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  }

  // RENDER PREVIEW DOCUMENT (DYNAMIC TYPOGRAPHY & LAYOUTS)
  function renderPreview() {
    ticketDocument.className = `a4-sheet ${currentTheme} ${currentLayout}`;

    // Apply Typography CSS Custom Properties
    if (state.typography) {
      ticketDocument.style.setProperty('--doc-header-size', state.typography.headerSize);
      ticketDocument.style.setProperty('--doc-header-weight', state.typography.headerWeight);
      ticketDocument.style.setProperty('--doc-body-size', state.typography.bodySize);
      ticketDocument.style.setProperty('--doc-body-weight', state.typography.bodyWeight);
      ticketDocument.style.setProperty('--doc-code-size', state.typography.codeSize);
      ticketDocument.style.setProperty('--doc-code-weight', state.typography.codeWeight);
    }

    // Logo HTML helper
    const logoHtml = state.logoDataUrl
      ? `<img class="doc-logo-img" src="${state.logoDataUrl}" alt="Agency Logo">`
      : `<svg class="default-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 C30 10 15 30 15 50 C15 70 30 90 50 90 C70 90 85 70 85 50 C85 30 70 10 50 10 Z" fill="#dc2626"/>
          <path d="M50 20 L58 42 L80 42 L62 55 L69 76 L50 64 L31 76 L38 55 L20 42 L42 42 Z" fill="#ffffff"/>
         </svg>`;

    // Format mobile string
    let mobText = '';
    if (state.agencyMobile1) mobText += state.agencyMobile1;
    if (state.agencyMobile2) mobText += (mobText ? '<br>' : '') + state.agencyMobile2;

    if (currentLayout === 'layout-classic') {
      renderClassicLayout(logoHtml, mobText);
    } else if (currentLayout === 'layout-modern') {
      renderModernLayout(logoHtml, mobText);
    } else {
      renderLuxuryLayout(logoHtml, mobText);
    }

    // Render Barcode
    try {
      if (state.pnr && window.JsBarcode) {
        JsBarcode("#pnr-barcode", state.pnr, {
          format: "CODE128",
          width: 1.5,
          height: 38,
          displayValue: true,
          fontSize: 10,
          margin: 0
        });
      }
    } catch (err) {
      console.warn("Barcode render error:", err);
    }
  }

  // RENDER VERSION 1: CLASSIC TABLE LAYOUT (PROMPT ORIGINAL MATCH)
  function renderClassicLayout(logoHtml, mobText) {
    const addr = state.agencyAddress || '';
    const formattedAddr = addr.startsWith('ADDRESS :') ? addr.replace(/\n/g, '<br>') : `ADDRESS : ${addr.replace(/\n/g, '<br>')}`;
    const formattedMob = mobText ? (mobText.startsWith('MOBILE :') ? mobText : `MOBILE : ${mobText}`) : '';

    let flightsTableHtml = '';
    state.segments.forEach(seg => {
      const flightFormatted = (seg.flightNo || '').replace(/\n/g, '<br>');
      flightsTableHtml += `
        <div class="doc-section">
          <table class="doc-table">
            <thead>
              <tr>
                <th style="width: 20%;">FLIGHT #</th>
                <th style="width: 15%;">FROM</th>
                <th style="width: 15%;">TO</th>
                <th style="width: 16%;">DEPART</th>
                <th style="width: 16%;">ARRIVE</th>
                <th style="width: 18%;">INFO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold">${flightFormatted}</td>
                <td class="font-bold">${seg.from || ''}</td>
                <td class="font-bold">${seg.to || ''}</td>
                <td>
                  <div class="font-bold">${seg.departDate || ''}</div>
                  <div>${seg.departTime || ''}</div>
                </td>
                <td>
                  <div class="font-bold">${seg.arriveDate || ''}</div>
                  <div>${seg.arriveTime || ''}</div>
                </td>
                <td class="flight-info-cell">
                  <div class="flight-info-row"><span class="flight-info-key">BAGGAGE :</span> <span class="flight-info-val">${seg.baggage || ''}</span></div>
                  <div class="flight-info-row"><span class="flight-info-key">CLASS :</span> <span class="flight-info-val">${seg.travelClass || ''}</span></div>
                  <div class="flight-info-row"><span class="flight-info-key">DURATION :</span> <span class="flight-info-val">${seg.duration || ''}</span></div>
                  <div class="flight-info-row"><span class="flight-info-key">FOOD :</span> <span class="flight-info-val">${seg.food || ''}</span></div>
                  <div class="flight-info-row"><span class="flight-info-key">STATUS :</span> <span class="flight-info-val">${seg.status || ''}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
          ${seg.layoverStop ? `<div class="doc-layover-bar">${seg.layoverStop}</div>` : ''}
        </div>
      `;
    });

    ticketDocument.innerHTML = `
      <header class="doc-header classic-header">
        <div class="header-left">
          <div class="doc-logo-wrapper">
            ${logoHtml}
          </div>
        </div>
        <div class="header-right classic-right">
          <h2>${state.agencyName || 'Tanvir Air Travels'}</h2>
          <p class="sub-agency">${state.agencyTagline || '-Govt. Approved Travel Agent.'}</p>
          <p class="address-text">${formattedAddr}</p>
          <p class="mobile-text">${formattedMob}</p>
        </div>
      </header>

      <div class="doc-title-wrapper">
        <h1 class="doc-title">ITINERARY</h1>
      </div>

      <div class="doc-section">
        <div class="table-label">PASSENGER INFORMATION</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th style="width: 45%;">PASSENGER NAME</th>
              <th style="width: 30%;">PASSPORT NUMBER</th>
              <th style="width: 25%;">MOBILE NUMBER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold">${state.passengerName || ''}</td>
              <td>${state.passportNumber || ''}</td>
              <td>${state.passengerMobile || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <table class="doc-table">
          <thead>
            <tr>
              <th style="width: 25%;">PNR</th>
              <th style="width: 30%;">AIR TICKET NUMBER</th>
              <th style="width: 25%;">DATE OF ISSUE</th>
              <th style="width: 20%;">Check-in</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold">${state.pnr || ''}</td>
              <td>${state.airTicketNumber || '-'}</td>
              <td>${state.dateOfIssue || ''}</td>
              <td>${state.checkInStatus || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${flightsTableHtml}

      <footer class="doc-footer">
        <div class="barcode-container">
          <svg id="pnr-barcode"></svg>
        </div>
        <div class="notice-text">
          <p>* Please check flight timings with airline 24 hours prior to departure.</p>
          <p>* Carry a valid passport with at least 6 months validity & required visa documents.</p>
        </div>
      </footer>
    `;
  }

  // RENDER VERSION 2: MODERN E-TICKET LAYOUT
  function renderModernLayout(logoHtml, mobText) {
    const addr = state.agencyAddress || '';
    const cleanAddr = addr.replace(/ADDRESS\s*:\s*/i, '');
    const cleanMob = mobText.replace(/MOBILE\s*:\s*/i, '').replace(/<br>/g, ' | ');

    let flightCardsHtml = '';
    state.segments.forEach(seg => {
      flightCardsHtml += `
        <div class="flight-segment-block">
          <div class="flight-card">
            <div class="flight-card-header">
              <div class="airline-badge">
                <i class="fa-solid fa-plane"></i>
                <span>${seg.flightNo || 'FLIGHT'}</span>
              </div>
              <span class="status-badge-sm">${seg.status || 'CONFIRM'}</span>
            </div>

            <div class="flight-card-body">
              <div class="route-node depart">
                <span class="airport-code">${seg.from || '---'}</span>
                <span class="time-str">${seg.departTime || ''}</span>
                <span class="date-str">${seg.departDate || ''}</span>
              </div>

              <div class="route-timeline">
                <div class="timeline-line">
                  <div class="plane-icon-wrapper">
                    <i class="fa-solid fa-plane"></i>
                  </div>
                </div>
                <span class="duration-tag">${seg.duration ? seg.duration : 'Direct'}</span>
              </div>

              <div class="route-node arrive">
                <span class="airport-code">${seg.to || '---'}</span>
                <span class="time-str">${seg.arriveTime || ''}</span>
                <span class="date-str">${seg.arriveDate || ''}</span>
              </div>
            </div>

            <div class="flight-card-footer">
              <div class="badge-item">
                <i class="fa-solid fa-suitcase"></i>
                <span class="badge-key">Baggage:</span>
                <span class="badge-val">${seg.baggage || '-'}</span>
              </div>
              <div class="badge-item">
                <i class="fa-solid fa-chair"></i>
                <span class="badge-key">Class:</span>
                <span class="badge-val">${seg.travelClass || '-'}</span>
              </div>
              <div class="badge-item">
                <i class="fa-solid fa-utensils"></i>
                <span class="badge-key">Meal:</span>
                <span class="badge-val">${seg.food || '-'}</span>
              </div>
              <div class="badge-item">
                <i class="fa-solid fa-circle-check"></i>
                <span class="badge-key">Status:</span>
                <span class="badge-val">${seg.status || '-'}</span>
              </div>
            </div>
          </div>

          ${seg.layoverStop ? `
            <div class="layover-bar">
              <i class="fa-solid fa-clock"></i>
              <span>${seg.layoverStop}</span>
            </div>
          ` : ''}
        </div>
      `;
    });

    ticketDocument.innerHTML = `
      <div class="doc-accent-bar"></div>

      <header class="doc-header">
        <div class="header-left">
          <div class="doc-logo-wrapper">
            ${logoHtml}
          </div>
        </div>

        <div class="header-right">
          <h2>${state.agencyName || 'Tanvir Air Travels'}</h2>
          <p class="sub-agency">${state.agencyTagline || '-Govt. Approved Travel Agent.'}</p>
          <div class="contact-details">
            <p class="address-text"><i class="fa-solid fa-location-dot"></i> ${cleanAddr}</p>
            <p class="mobile-text"><i class="fa-solid fa-phone"></i> ${cleanMob}</p>
          </div>
        </div>
      </header>

      <div class="doc-title-bar">
        <div class="title-left">
          <h1 class="doc-title">FLIGHT ITINERARY RECEIPT</h1>
          <span class="doc-badge"><i class="fa-solid fa-circle-check"></i> CONFIRMED E-TICKET</span>
        </div>
        <div class="pnr-badge-box">
          <span class="pnr-label">BOOKING REFERENCE (PNR)</span>
          <span class="pnr-value">${state.pnr || '------'}</span>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-user"></i> PASSENGER DETAILS</div>
          <div class="info-card-body">
            <div class="info-pair">
              <span class="info-key">Passenger Name</span>
              <span class="info-val highlight">${state.passengerName || '-'}</span>
            </div>
            <div class="info-pair">
              <span class="info-key">Passport Number</span>
              <span class="info-val">${state.passportNumber || '-'}</span>
            </div>
            <div class="info-pair">
              <span class="info-key">Mobile Number</span>
              <span class="info-val">${state.passengerMobile || '-'}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-card-header"><i class="fa-solid fa-ticket"></i> TICKET DETAILS</div>
          <div class="info-card-body">
            <div class="info-pair">
              <span class="info-key">Air Ticket No</span>
              <span class="info-val">${state.airTicketNumber || '-'}</span>
            </div>
            <div class="info-pair">
              <span class="info-key">Date of Issue</span>
              <span class="info-val">${state.dateOfIssue || '-'}</span>
            </div>
            <div class="info-pair">
              <span class="info-key">Check-in Status</span>
              <span class="info-val">${state.checkInStatus || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-heading">
        <i class="fa-solid fa-plane-departure"></i> FLIGHT ITINERARY & DEPARTURE DETAILS
      </div>

      ${flightCardsHtml}

      <footer class="doc-footer">
        <div class="footer-left">
          <div class="barcode-box">
            <svg id="pnr-barcode"></svg>
          </div>
        </div>
        <div class="footer-right">
          <ul class="notice-list">
            <li><i class="fa-solid fa-info-circle"></i> Check-in closes 60 minutes prior to scheduled flight departure.</li>
            <li><i class="fa-solid fa-id-card"></i> Carry valid Passport, Visa & Govt. Photo ID during entire travel.</li>
            <li><i class="fa-solid fa-headset"></i> For baggage policy or itinerary changes, contact agency helpline.</li>
          </ul>
        </div>
      </footer>
    `;
  }

  // RENDER VERSION 3: LUXURY EXECUTIVE PASS LAYOUT ("LOVE AT FIRST SIGHT")
  function renderLuxuryLayout(logoHtml, mobText) {
    const addr = state.agencyAddress || '';
    const cleanAddr = addr.replace(/ADDRESS\s*:\s*/i, '').replace(/\n/g, ', ');
    const cleanMob = mobText.replace(/MOBILE\s*:\s*/i, '').replace(/<br>/g, '  •  ');

    // Route summary from first origin to last destination
    const originFirst = state.segments[0] ? state.segments[0].from : 'DAC';
    const destLast = state.segments[state.segments.length - 1] ? state.segments[state.segments.length - 1].to : 'MED';

    let luxuryFlightsHtml = '';
    state.segments.forEach((seg, idx) => {
      luxuryFlightsHtml += `
        <div class="luxury-segment-card">
          <div class="luxury-card-head">
            <div class="airline-tag">
              <i class="fa-solid fa-plane-up"></i>
              <span>LEG 0${idx + 1} — ${seg.flightNo || 'FLIGHT'}</span>
            </div>
            <div class="status-pill">${seg.status || 'CONFIRMED'}</div>
          </div>

          <div class="luxury-card-body">
            <div class="route-column left">
              <span class="route-city">${seg.from || '---'}</span>
              <span class="route-time">${seg.departTime || ''}</span>
              <span class="route-date">${seg.departDate || ''}</span>
            </div>

            <div class="route-center">
              <span class="duration-badge">${seg.duration ? seg.duration : 'Direct Flight'}</span>
              <div class="flight-path-bar">
                <span class="dot start"></span>
                <span class="line"></span>
                <i class="fa-solid fa-plane plane-fly"></i>
                <span class="line"></span>
                <span class="dot end"></span>
              </div>
            </div>

            <div class="route-column right">
              <span class="route-city">${seg.to || '---'}</span>
              <span class="route-time">${seg.arriveTime || ''}</span>
              <span class="route-date">${seg.arriveDate || ''}</span>
            </div>
          </div>

          <div class="luxury-card-foot">
            <div class="foot-pill"><i class="fa-solid fa-briefcase"></i> <span>BAGGAGE:</span> <strong>${seg.baggage || '-'}</strong></div>
            <div class="foot-pill"><i class="fa-solid fa-couch"></i> <span>CLASS:</span> <strong>${seg.travelClass || '-'}</strong></div>
            <div class="foot-pill"><i class="fa-solid fa-utensils"></i> <span>MEAL:</span> <strong>${seg.food || '-'}</strong></div>
          </div>
        </div>

        ${seg.layoverStop ? `
          <div class="luxury-layover-ribbon">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>${seg.layoverStop}</span>
          </div>
        ` : ''}
      `;
    });

    ticketDocument.innerHTML = `
      <!-- EXECUTIVE HEADER BANNER -->
      <div class="luxury-header-banner">
        <div class="luxury-banner-left">
          <div class="doc-logo-wrapper">
            ${logoHtml}
          </div>
          <div class="agency-title-group">
            <h2 class="luxury-agency-name">${state.agencyName || 'Tanvir Air Travels'}</h2>
            <p class="luxury-agency-sub">${state.agencyTagline || '-Govt. Approved Travel Agent.'}</p>
          </div>
        </div>

        <div class="luxury-banner-right">
          <div class="luxury-pnr-box">
            <span class="pnr-caption">BOOKING REF / PNR</span>
            <span class="pnr-code">${state.pnr || '------'}</span>
          </div>
        </div>
      </div>

      <!-- CONTACT DECK STRIP -->
      <div class="luxury-contact-deck">
        <span><i class="fa-solid fa-location-dot"></i> ${cleanAddr}</span>
        <span><i class="fa-solid fa-phone"></i> ${cleanMob}</span>
      </div>

      <!-- BOARDING PASS HERO CONTAINER -->
      <div class="luxury-pass-hero">
        <div class="hero-header">
          <div class="pass-title">
            <i class="fa-solid fa-passport"></i>
            <span>EXECUTIVE ELECTRONIC ITINERARY</span>
          </div>
          <div class="verified-seal">
            <i class="fa-solid fa-shield-halved"></i> VERIFIED E-TICKET
          </div>
        </div>

        <!-- PASSENGER STUB SUMMARY -->
        <div class="hero-passenger-deck">
          <div class="deck-col">
            <span class="deck-label">PASSENGER NAME</span>
            <span class="deck-value highlight">${state.passengerName || '-'}</span>
          </div>
          <div class="deck-col">
            <span class="deck-label">PASSPORT NO</span>
            <span class="deck-value">${state.passportNumber || '-'}</span>
          </div>
          <div class="deck-col">
            <span class="deck-label">AIR TICKET NO</span>
            <span class="deck-value">${state.airTicketNumber || '-'}</span>
          </div>
          <div class="deck-col">
            <span class="deck-label">DATE OF ISSUE</span>
            <span class="deck-value">${state.dateOfIssue || '-'}</span>
          </div>
        </div>

        <!-- HERO ROUTE SUMMARY BANNER -->
        <div class="hero-route-strip">
          <div class="hero-route-node">
            <span class="hero-label">ORIGIN</span>
            <span class="hero-code">${originFirst}</span>
          </div>
          <div class="hero-arrow-box">
            <i class="fa-solid fa-plane-departure"></i>
          </div>
          <div class="hero-route-node text-right">
            <span class="hero-label">DESTINATION</span>
            <span class="hero-code">${destLast}</span>
          </div>
        </div>
      </div>

      <!-- FLIGHT LEGS SECTION -->
      <div class="luxury-section-title">
        <i class="fa-solid fa-route"></i> FLIGHT SCHEDULE & SEGMENT DETAILS
      </div>

      ${luxuryFlightsHtml}

      <!-- LUXURY FOOTER -->
      <footer class="luxury-footer">
        <div class="barcode-side">
          <svg id="pnr-barcode"></svg>
        </div>
        <div class="notice-side">
          <p><i class="fa-solid fa-circle-info"></i> Please report at airline check-in counter at least 3 hours prior to international departures.</p>
          <p><i class="fa-solid fa-id-card"></i> Carry government-approved passport and visa documents for security clearance.</p>
        </div>
      </footer>
    `;
  }

  // HIGH-QUALITY PDF GENERATION
  function downloadPDF() {
    if (typeof html2pdf === 'undefined') {
      alert("PDF library is loading or blocked by browser. Please use the Print button to Save as PDF.");
      window.print();
      return;
    }

    const element = document.getElementById('ticket-document');
    
    // Save current transform style
    const prevTransform = element.style.transform;
    element.style.transform = 'none';

    const pnrName = state.pnr ? state.pnr.trim() : 'ticket';
    const passName = state.passengerName ? state.passengerName.trim().replace(/\s+/g, '_') : 'passenger';
    const opt = {
      margin:       0,
      filename:     `Itinerary_${passName}_${pnrName}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Show download indicator
    btnDownloadPdf.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...`;
    btnDownloadPdf.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
      btnDownloadPdf.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Download PDF`;
      btnDownloadPdf.disabled = false;
      element.style.transform = prevTransform;
    }).catch(err => {
      console.error("PDF Export Error:", err);
      btnDownloadPdf.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Download PDF`;
      btnDownloadPdf.disabled = false;
      element.style.transform = prevTransform;
      window.print();
    });
  }

});
