/**
 * Harshal Bari - Mechanical CAD Specialist Portfolio
 * Interactive Multi-Geometry 3D CAD Workbench, Project Filter, Estimator & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCadWorkbench();
  initProjectFilters();
  initProjectModal();
  initEstimator();
  initContactForm();
});

/* ==========================================================================
   1. Navigation & Smooth Scroll Spy
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. Interactive Multi-Model 3D CAD Workbench
   ========================================================================== */
function initCadWorkbench() {
  const canvas = document.getElementById('cadCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width * (window.devicePixelRatio || 1);
    height = canvas.height = rect.height * (window.devicePixelRatio || 1);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Model 1: Structural Flange & Gusset (Weldment)
  const bracketModel = {
    name: "STRUCTURAL_GUSSET_FLANGE.SLDPRT",
    type: "Weldment & Cast Assembly",
    standard: "ISO 5211 / ASME B16.5",
    tolerance: "ISO 2768-mK",
    vertices: [
      [-1.2, -0.3, -1.2], [1.2, -0.3, -1.2], [1.2, -0.3, 1.2], [-1.2, -0.3, 1.2],
      [-1.2,  0.0, -1.2], [1.2,  0.0, -1.2], [1.2,  0.0, 1.2], [-1.2,  0.0, 1.2],
      [-0.5, 0.0, -0.5], [0.5, 0.0, -0.5], [0.5, 0.0, 0.5], [-0.5, 0.0, 0.5],
      [-0.5, 1.2, -0.5], [0.5, 1.2, -0.5], [0.5, 1.2, 0.5], [-0.5, 1.2, 0.5],
      [-0.8, 1.2, -0.8], [0.8, 1.2, -0.8], [0.8, 1.2, 0.8], [-0.8, 1.2, 0.8],
      [-0.8, 1.4, -0.8], [0.8, 1.4, -0.8], [0.8, 1.4, 0.8], [-0.8, 1.4, 0.8],
      [0.0, 0.0, -1.1], [0.0, 1.0, -0.5], [0.0, 0.0, -0.5],
      [0.0, 0.0,  1.1], [0.0, 1.0,  0.5], [0.0, 0.0,  0.5],
      [-1.1, 0.0, 0.0], [-0.5, 1.0, 0.0], [-0.5, 0.0, 0.0],
      [ 1.1, 0.0, 0.0], [ 0.5, 1.0, 0.0], [ 0.5, 0.0, 0.0]
    ],
    faces: [
      [0, 1, 2, 3], [4, 5, 6, 7],
      [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
      [8, 9, 13, 12], [9, 10, 14, 13], [10, 11, 15, 14], [11, 8, 12, 15],
      [16, 17, 18, 19], [20, 21, 22, 23],
      [16, 17, 21, 20], [17, 18, 22, 21], [18, 19, 23, 22], [19, 16, 20, 23],
      [24, 25, 26], [27, 28, 29], [30, 31, 32], [33, 34, 35]
    ]
  };

  // Model 2: Parametric Spur Gear (Machined Part)
  function createSpurGearModel() {
    const teeth = 12;
    const rOuter = 1.3;
    const rRoot = 0.88;
    const thickness = 0.45;
    const verts = [];
    const fcs = [];

    // Generate tooth profile vertices (bottom ring: y = -thickness/2, top ring: y = thickness/2)
    for (let t = 0; t < 2; t++) {
      const y = t === 0 ? -thickness / 2 : thickness / 2;
      for (let i = 0; i < teeth; i++) {
        const a1 = (i * 2 * Math.PI) / teeth;
        const a2 = a1 + (Math.PI / teeth) * 0.35;
        const a3 = a1 + (Math.PI / teeth) * 0.65;
        const a4 = a1 + (Math.PI / teeth);

        // root 1, tip 1, tip 2, root 2
        verts.push([Math.cos(a1) * rRoot, y, Math.sin(a1) * rRoot]);
        verts.push([Math.cos(a2) * rOuter, y, Math.sin(a2) * rOuter]);
        verts.push([Math.cos(a3) * rOuter, y, Math.sin(a3) * rOuter]);
        verts.push([Math.cos(a4) * rRoot, y, Math.sin(a4) * rRoot]);
      }
      // Hub center hole
      for (let i = 0; i < 8; i++) {
        const a = (i * 2 * Math.PI) / 8;
        verts.push([Math.cos(a) * 0.35, y, Math.sin(a) * 0.35]);
      }
    }

    const nToothVerts = teeth * 4;
    // Side faces for teeth
    for (let i = 0; i < nToothVerts; i++) {
      const next = (i + 1) % nToothVerts;
      fcs.push([i, next, nToothVerts + 8 + next, nToothVerts + 8 + i]);
    }

    // Top and bottom cap segments
    for (let i = 0; i < nToothVerts; i += 2) {
      const next = (i + 2) % nToothVerts;
      fcs.push([i, i + 1, next]);
      fcs.push([nToothVerts + 8 + i, nToothVerts + 8 + next, nToothVerts + 8 + i + 1]);
    }

    return {
      name: "INVOLUTE_SPUR_GEAR_MOD2.5.SLDPRT",
      type: "Power Transmission",
      standard: "DIN 3962 / AGMA 2000",
      tolerance: "Grade 7 (DIN)",
      vertices: verts,
      faces: fcs
    };
  }

  // Model 3: Precision Split Bearing Housing
  const bearingModel = {
    name: "PILLOW_BLOCK_HOUSING_P205.SLDPRT",
    type: "Cast & Machined Housing",
    standard: "ISO 113 / JIS B1559",
    tolerance: "H7 / k6 Fitment",
    vertices: [
      // Base foot
      [-1.4, -0.4, -0.7], [1.4, -0.4, -0.7], [1.4, -0.4, 0.7], [-1.4, -0.4, 0.7],
      [-1.4, -0.1, -0.7], [1.4, -0.1, -0.7], [1.4, -0.1, 0.7], [-1.4, -0.1, 0.7],
      // Central arched housing
      [-0.8, -0.1, -0.5], [0.8, -0.1, -0.5], [0.8, -0.1, 0.5], [-0.8, -0.1, 0.5],
      [-0.8,  0.8, -0.5], [0.8,  0.8, -0.5], [0.8,  0.8, 0.5], [-0.8,  0.8, 0.5],
      [-0.4,  1.3, -0.5], [0.4,  1.3, -0.5], [0.4,  1.3, 0.5], [-0.4,  1.3, 0.5],
      // Bore indicators
      [0.0, 0.6, -0.52], [0.0, 0.6, 0.52]
    ],
    faces: [
      [0, 1, 2, 3], [4, 5, 6, 7],
      [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
      [8, 9, 13, 12], [9, 10, 14, 13], [10, 11, 15, 14], [11, 8, 12, 15],
      [12, 13, 17, 16], [13, 14, 18, 17], [14, 15, 19, 18], [15, 12, 16, 19],
      [16, 17, 18, 19]
    ]
  };

  const gearModel = createSpurGearModel();
  const models = {
    bracket: bracketModel,
    gear: gearModel,
    bearing: bearingModel
  };

  let currentModelKey = 'bracket';
  let activeModel = models[currentModelKey];

  let rotX = 0.5;
  let rotY = 0.75;
  let autoRotate = true;
  let renderMode = 'solid'; // 'solid' | 'wireframe' | 'blueprint'
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  // UI elements update
  function updateModelSpecs(m) {
    const titleEl = document.getElementById('activeModelName');
    const typeEl = document.getElementById('specModelType');
    const stdEl = document.getElementById('specModelStandard');
    const tolEl = document.getElementById('specModelTol');
    const vertEl = document.getElementById('specVertCount');
    const faceEl = document.getElementById('specFaceCount');

    if (titleEl) titleEl.textContent = m.name;
    if (typeEl) typeEl.textContent = m.type;
    if (stdEl) stdEl.textContent = m.standard;
    if (tolEl) tolEl.textContent = m.tolerance;
    if (vertEl) vertEl.textContent = m.vertices.length;
    if (faceEl) faceEl.textContent = m.faces.length;
  }
  updateModelSpecs(activeModel);

  // Model selection buttons
  const modelBtns = document.querySelectorAll('.model-sel-btn');
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentModelKey = btn.dataset.model;
      activeModel = models[currentModelKey];
      updateModelSpecs(activeModel);
    });
  });

  // View modes
  const modeBtns = document.querySelectorAll('.vp-btn[data-mode]');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMode = btn.dataset.mode;
    });
  });

  const toggleSpinBtn = document.getElementById('toggleSpin');
  if (toggleSpinBtn) {
    toggleSpinBtn.addEventListener('click', () => {
      autoRotate = !autoRotate;
      toggleSpinBtn.classList.toggle('active', autoRotate);
      toggleSpinBtn.textContent = autoRotate ? 'Pause Rotation' : 'Resume Rotation';
    });
  }

  const resetViewBtn = document.getElementById('resetView');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      rotX = 0.5;
      rotY = 0.75;
    });
  }

  // Mouse & Touch Controls
  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    rotY += dx * 0.01;
    rotX += dy * 0.01;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - prevX;
    const dy = e.touches[0].clientY - prevY;
    rotY += dx * 0.015;
    rotX += dy * 0.015;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Main Render Loop
  function render() {
    if (autoRotate && !isDragging) {
      rotY += 0.007;
    }

    ctx.clearRect(0, 0, width, height);

    // Millimeter blueprint grid
    drawCadGrid(ctx, width, height);

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const scale = Math.min(width, height) * 0.28;
    const centerX = width / 2;
    const centerY = height / 2;

    const transformed = activeModel.vertices.map(v => {
      const x1 = v[0] * cosY + v[2] * sinY;
      const y1 = v[1];
      const z1 = -v[0] * sinY + v[2] * cosY;

      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const fov = 4.5;
      const p = fov / (fov + z2);
      return {
        x: centerX + x2 * scale * p,
        y: centerY - y2 * scale * p,
        z: z2
      };
    });

    const hudCoords = document.getElementById('hudCoords');
    if (hudCoords) {
      hudCoords.textContent = `RX: ${(rotX * 180 / Math.PI % 360).toFixed(1)}° | RY: ${(rotY * 180 / Math.PI % 360).toFixed(1)}° | DFM: PASS`;
    }

    // Sort faces by depth
    const faceDepths = activeModel.faces.map((face, index) => {
      let avgZ = 0;
      face.forEach(vIdx => {
        if (transformed[vIdx]) avgZ += transformed[vIdx].z;
      });
      avgZ /= face.length;
      return { index, depth: avgZ };
    });
    faceDepths.sort((a, b) => b.depth - a.depth);

    // Draw faces
    faceDepths.forEach(f => {
      const face = activeModel.faces[f.index];
      if (!face || face.length < 3) return;

      ctx.beginPath();
      ctx.moveTo(transformed[face[0]].x, transformed[face[0]].y);
      for (let i = 1; i < face.length; i++) {
        ctx.lineTo(transformed[face[i]].x, transformed[face[i]].y);
      }
      ctx.closePath();

      if (renderMode === 'solid') {
        const v0 = transformed[face[0]];
        const v1 = transformed[face[1]];
        const v2 = transformed[face[2]];
        const normalZ = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
        const shade = Math.max(0.12, Math.min(0.95, (normalZ / 14000) * 0.5 + 0.5));

        ctx.fillStyle = `rgba(${Math.floor(10 + shade * 25)}, ${Math.floor(25 + shade * 110)}, ${Math.floor(55 + shade * 180)}, 0.88)`;
        ctx.fill();

        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      } else if (renderMode === 'wireframe') {
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      } else if (renderMode === 'blueprint') {
        ctx.fillStyle = 'rgba(2, 132, 199, 0.1)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([4, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw vertex pins in wireframe/blueprint
    if (renderMode !== 'solid') {
      ctx.fillStyle = '#00d2ff';
      transformed.forEach(v => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    requestAnimationFrame(render);
  }

  function drawCadGrid(context, w, h) {
    context.save();
    context.strokeStyle = 'rgba(0, 210, 255, 0.04)';
    context.lineWidth = 1;
    const step = 28;
    for (let x = 0; x < w; x += step) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, h);
      context.stroke();
    }
    for (let y = 0; y < h; y += step) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(w, y);
      context.stroke();
    }
    context.restore();
  }

  render();
}

/* ==========================================================================
   3. Project Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.eng-filter-btn');
  const projectCards = document.querySelectorAll('.blueprint-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Project Modal Case Studies
   ========================================================================== */
const engineeringProjectData = {
  furnace: {
    title: "Boiler Furnace Structure Design",
    category: "Industrial & Structural Weldments",
    software: "SOLIDWORKS (Weldments, Assembly, 2D Drafting)",
    overview: "Complete 3D parametric structural design of an industrial boiler furnace framework engineered to sustain extreme operational thermal stresses, mechanical load distribution, and stringent industrial safety margins.",
    highlights: [
      "Engineered structural framing members using SOLIDWORKS Weldments with custom standard profiles (beams, angles, channels).",
      "Created complete parametric 3D models for fabricated structural trusses, bracing, and mounting brackets.",
      "Developed end-to-end manufacturing drawing package with cut-lists, joint weld symbols (AWS/ISO), and BOM.",
      "Applied strict engineering dimensions, interference detection, and assembly mates for hassle-free shop-floor fabrication."
    ],
    deliverables: "SOLIDWORKS Assemblies (.SLDASM), Part Models (.SLDPRT), Fabrication Cut Lists, Production Drawings (.PDF, .DWG)."
  },
  enclosure: {
    title: "Precision Sheet Metal Control Panel Enclosure",
    category: "Sheet Metal & Enclosures",
    software: "SOLIDWORKS Sheet Metal",
    overview: "Custom electrical control panel enclosure optimized for laser cutting and CNC press-brake bending with zero manufacturing rework.",
    highlights: [
      "Calculated exact K-Factors and bend deductions across multi-thickness CRCA sheet metal.",
      "Integrated ventilation louvers, PEM self-clinching studs, hinge cutouts, and neoprene gasket grooves.",
      "Exported 1:1 flat pattern DXFs directly usable by CNC fiber laser cutting machinery.",
      "Verified clearance and assembly ergonomics with electrical switches, din-rails, and meters."
    ],
    deliverables: "Flat Pattern DXF, 3D Assembly, Formed Part Models, Fabrication Step-by-Step Drawings."
  },
  skid: {
    title: "Heavy-Duty Industrial Skid & Equipment Frame",
    category: "Industrial & Structural Weldments",
    software: "SOLIDWORKS & AutoCAD",
    overview: "Heavy structural base skid designed for mounting high-pressure pump sets, piping headers, and motor drives with certified lifting points.",
    highlights: [
      "Designed robust structural steel frame with I-beams, C-channels, and gusset reinforcements.",
      "Incorporated rated lifting lugs and pad-eyes with load distribution gussets.",
      "Produced detailed shop-floor fabrication drawings with GD&T tolerances and weld joint specifications.",
      "Generated comprehensive Bill of Materials (BOM) with raw material weight estimations."
    ],
    deliverables: "3D CAD Model (STEP/SLDASM), Detailed 2D Fabrication Drawings (DWG/PDF), Material Take-Off / BOM."
  },
  coupling: {
    title: "Parametric Flange Coupling & Transmission Assembly",
    category: "3D Parametric Modeling",
    software: "CATIA V5 (Part Design & Assembly)",
    overview: "Precision torque transmission flexible flange coupling designed in CATIA V5 with tight tolerance stack-up and keyway specifications.",
    highlights: [
      "Modeled precision hubs, bush pins, and flexible rubber buffers using generative parametric sketches.",
      "Conducted assembly clearance checks and tolerance analysis for shaft fitments (H7/k6).",
      "Generated multi-sheet orthographic and isometric production drafting with sectional views.",
      "Created exploded assembly views with numbered balloons and part schedule."
    ],
    deliverables: "CATIA Part & Product files (.CATPart, .CATProduct), Neutral STEP/IGES, Production Blueprints."
  },
  bearing: {
    title: "CNC Machined Precision Bearing Housing",
    category: "3D Modeling & Machining",
    software: "AutoCAD & SOLIDWORKS",
    overview: "High-precision split bearing housing engineered for CNC machining centers with tight run-out tolerances and seal grooves.",
    highlights: [
      "Designed internal bearing seatings adhering to ISO tolerance standards for spherical roller bearings.",
      "Incorporated labyrinth seal grooves, grease nipples, and oil drain ports.",
      "Applied comprehensive GD&T callouts (perpendicularity, concentricity, cylindrical runout) per ASME Y14.5.",
      "Ready for 5-axis CNC machining path generation and CMM inspection."
    ],
    deliverables: "3D Solid Models (STEP, Parasolid), 2D Machining Drawings with GD&T (DWG, PDF)."
  },
  conversion: {
    title: "Legacy 2D Blueprints to 3D Parametric CAD Conversion",
    category: "2D Drafting & Conversion",
    software: "AutoCAD to SOLIDWORKS / CATIA V5",
    overview: "Digitization and modernization of legacy hand-drawn mechanical blueprints into fully parametric, revision-ready 3D CAD assets.",
    highlights: [
      "Re-engineered legacy parts with missing dimensions via parametric deduction and geometric constraint solving.",
      "Created fully editable feature trees allowing fast future modifications and modular variants.",
      "Validated thread standards, chamfers, fillet reliefs, and standard hardware sizes.",
      "Exported unified modern drawing sheets with company title blocks and revision logs."
    ],
    deliverables: "Parametric 3D CAD models, Native CAD files, Standardized 2D Drawings, STEP/IGES archives."
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const detailsBtns = document.querySelectorAll('.view-details-btn');

  if (!modalBackdrop) return;

  detailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.project;
      const data = engineeringProjectData[projectId];
      if (!data) return;

      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalSoftware').textContent = data.software;
      document.getElementById('modalOverview').textContent = data.overview;
      document.getElementById('modalDeliverables').textContent = data.deliverables;

      const highlightsList = document.getElementById('modalHighlights');
      highlightsList.innerHTML = '';
      data.highlights.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        highlightsList.appendChild(li);
      });

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   5. Instant Project Scope & Cost Estimator
   ========================================================================== */
function initEstimator() {
  const projectTypeSelect = document.getElementById('calcProjectType');
  const partCountSelect = document.getElementById('calcPartCount');
  const urgencySelect = document.getElementById('calcUrgency');
  const drawingCheck = document.getElementById('calcDrawingCheck');
  const stepCheck = document.getElementById('calcStepCheck');

  const estTimeDisplay = document.getElementById('estTimeDisplay');
  const estDeliverablesDisplay = document.getElementById('estDeliverablesDisplay');
  const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');
  const emailQuoteBtn = document.getElementById('emailQuoteBtn');

  function updateEstimate() {
    if (!projectTypeSelect || !partCountSelect) return;

    const type = projectTypeSelect.value;
    const parts = partCountSelect.value;
    const urgency = urgencySelect ? urgencySelect.value : 'standard';

    let timeline = "24 – 48 Hours";
    let deliverablesList = [];

    if (type === '3d-part') {
      timeline = parts === '1' ? '24 Hours' : (parts === 'multiple' ? '2 – 3 Days' : '3 – 5 Days');
      deliverablesList.push("3D Parametric CAD Model");
    } else if (type === 'assembly') {
      timeline = parts === '1' ? '2 – 3 Days' : '4 – 7 Days';
      deliverablesList.push("Complete 3D Assembly + Exploded View");
    } else if (type === 'sheet-metal') {
      timeline = parts === '1' ? '24 – 48 Hours' : '3 – 4 Days';
      deliverablesList.push("Sheet Metal 3D Model + Flat Pattern DXF");
    } else if (type === 'weldment') {
      timeline = '3 – 5 Days';
      deliverablesList.push("Weldment Structure + Cut-Lists & Weld Symbols");
    } else if (type === '2d-conversion') {
      timeline = parts === '1' ? '24 Hours' : '2 – 4 Days';
      deliverablesList.push("Legacy Blueprint Digitization into Parametric 3D");
    }

    if (urgency === 'express') {
      timeline += " (Priority Express)";
    }

    if (drawingCheck && drawingCheck.checked) {
      deliverablesList.push("2D Manufacturing Blueprints (GD&T, BOM, Title Block)");
    }
    if (stepCheck && stepCheck.checked) {
      deliverablesList.push("Universal Neutral STEP / IGES / 3D Print STL");
    }

    if (estTimeDisplay) estTimeDisplay.textContent = timeline;
    if (estDeliverablesDisplay) estDeliverablesDisplay.textContent = deliverablesList.join(" + ");

    const phone = "919665104477";
    const email = "harshalbari132002@gmail.com";
    const projectTypeName = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;

    const message = `Hello Harshal, I am interested in your Freelance CAD Design services.\n\n` +
      `*Service Required:* ${projectTypeName}\n` +
      `*Component Scope:* ${parts}\n` +
      `*Required Timeline:* ${timeline}\n` +
      `*Deliverables Needed:* ${deliverablesList.join(", ")}\n\n` +
      `Please let me know your availability to review my requirements.`;

    if (whatsappQuoteBtn) {
      whatsappQuoteBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }

    if (emailQuoteBtn) {
      const subject = `CAD Engineering Inquiry: ${projectTypeName}`;
      emailQuoteBtn.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    }
  }

  const inputs = [projectTypeSelect, partCountSelect, urgencySelect, drawingCheck, stepCheck];
  inputs.forEach(input => {
    if (input) input.addEventListener('change', updateEstimate);
  });

  updateEstimate();
}

/* ==========================================================================
   6. Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const email = document.getElementById('clientEmail').value;
      const service = document.getElementById('clientService').value;
      const message = document.getElementById('clientMessage').value;

      const recipient = "harshalbari132002@gmail.com";
      const subject = `CAD Project Inquiry from ${name} [${service}]`;
      const body = `Name: ${name}\nEmail: ${email}\nService Required: ${service}\n\nProject Details:\n${message}`;

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formSuccess) {
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
      }
    });
  }
}
