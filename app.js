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
        duration: "",
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
        duration: "",
        food: "YES",
        status: "CONFIRM",
        layoverStop: ""
      }
    ]
  };

  // APPLICATION STATE
  let state = JSON.parse(JSON.stringify(sampleData));
  let zoomLevel = 1.0;

  // DOM ELEMENTS - INPUTS
  const agencyNameInput = document.getElementById('agency-name');
  const agencyTaglineInput = document.getElementById('agency-tagline');
  const agencyAddressInput = document.getElementById('agency-address');
  const agencyMobile1Input = document.getElementById('agency-mobile1');
  const agencyMobile2Input = document.getElementById('agency-mobile2');
  const agencyLogoFile = document.getElementById('agency-logo-file');
  const btnResetLogo = document.getElementById('btn-reset-logo');
  const logoFileName = document.getElementById('logo-file-name');

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
  const docAgencyName = document.getElementById('doc-agency-name');
  const docAgencyTagline = document.getElementById('doc-agency-tagline');
  const docAgencyAddress = document.getElementById('doc-agency-address');
  const docAgencyMobile = document.getElementById('doc-agency-mobile');
  const docLogoSvg = document.getElementById('default-logo-svg');
  const docLogoImg = document.getElementById('doc-logo-img');

  const docPassName = document.getElementById('doc-pass-name');
  const docPassPassport = document.getElementById('doc-pass-passport');
  const docPassMobile = document.getElementById('doc-pass-mobile');

  const docTicketPnr = document.getElementById('doc-ticket-pnr');
  const docTicketNumber = document.getElementById('doc-ticket-number');
  const docTicketDate = document.getElementById('doc-ticket-date');
  const docTicketCheckin = document.getElementById('doc-ticket-checkin');

  const docFlightsContainer = document.getElementById('doc-flights-container');
  const ticketDocument = document.getElementById('ticket-document');

  // ACTION BUTTONS & THEME SELECTOR
  const btnLoadSample = document.getElementById('btn-load-sample');
  const btnClearForm = document.getElementById('btn-clear-form');
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

    passNameInput.value = state.passengerName || '';
    passPassportInput.value = state.passportNumber || '';
    passMobileInput.value = state.passengerMobile || '';

    ticketPnrInput.value = state.pnr || '';
    ticketNumberInput.value = state.airTicketNumber || '';
    ticketDateInput.value = state.dateOfIssue || '';
    ticketCheckinInput.value = state.checkInStatus || '';

    renderFlightSegmentInputs();
  }

  // RENDER DYNAMIC FLIGHT FORM CARDS
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
            <label>Flight # & Airline</label>
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
            <label>Food / Meals</label>
            <input type="text" class="input-seg-food" data-id="${seg.id}" value="${seg.food}" placeholder="e.g. NO / YES">
          </div>
          <div class="form-group">
            <label>Booking Status</label>
            <input type="text" class="input-seg-status" data-id="${seg.id}" value="${seg.status}" placeholder="e.g. CONFIRM">
          </div>
        </div>

        <div class="layover-box margin-top-xs">
          <div class="form-group full-width">
            <label>Layover / Connection Stop Info (Optional)</label>
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
        duration: '',
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

    themeSelect.onchange = (e) => {
      ticketDocument.className = `a4-sheet ${e.target.value}`;
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

  // RENDER LIVE A4 TICKET PREVIEW
  function renderPreview() {
    // Agency Header
    docAgencyName.textContent = state.agencyName || 'Agency Business Name';
    docAgencyTagline.textContent = state.agencyTagline || '';
    
    // Address with linebreaks
    const addr = state.agencyAddress || '';
    docAgencyAddress.innerHTML = addr.startsWith('ADDRESS :') ? addr.replace(/\n/g, '<br>') : `ADDRESS : ${addr.replace(/\n/g, '<br>')}`;
    
    // Mobile numbers
    let mobText = '';
    if (state.agencyMobile1) mobText += state.agencyMobile1;
    if (state.agencyMobile2) mobText += (mobText ? '<br>' : '') + state.agencyMobile2;
    docAgencyMobile.innerHTML = mobText ? (mobText.startsWith('MOBILE :') ? mobText : `MOBILE : ${mobText}`) : '';

    // Logo
    if (state.logoDataUrl) {
      docLogoImg.src = state.logoDataUrl;
      docLogoImg.classList.remove('hidden');
      docLogoSvg.style.display = 'none';
    } else {
      docLogoImg.classList.add('hidden');
      docLogoSvg.style.display = 'block';
    }

    // Passenger Info
    docPassName.textContent = state.passengerName || '';
    docPassPassport.textContent = state.passportNumber || '';
    docPassMobile.textContent = state.passengerMobile || '';

    // Ticket Booking Details
    docTicketPnr.textContent = state.pnr || '';
    docTicketNumber.textContent = state.airTicketNumber || '';
    docTicketDate.textContent = state.dateOfIssue || '';
    docTicketCheckin.textContent = state.checkInStatus || '';

    // Barcode Generator
    try {
      if (state.pnr && window.JsBarcode) {
        JsBarcode("#pnr-barcode", state.pnr, {
          format: "CODE128",
          width: 1.5,
          height: 35,
          displayValue: true,
          fontSize: 10,
          margin: 0
        });
      }
    } catch (err) {
      console.warn("Barcode render error:", err);
    }

    // Render Flight Segments Tables
    docFlightsContainer.innerHTML = '';

    state.segments.forEach(seg => {
      const segWrapper = document.createElement('div');
      segWrapper.className = 'doc-section';

      // Parse Flight # with line breaks if provided
      const flightFormatted = (seg.flightNo || '').replace(/\n/g, '<br>');

      segWrapper.innerHTML = `
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
      `;

      docFlightsContainer.appendChild(segWrapper);
    });
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
