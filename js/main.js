/**
 * Harshal Bari - Mechanical CAD Design & Product Development Portfolio
 * Interactive CAD Viewport, Estimator, Project Modals & Engineering Telemetry
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavigation();
  initCadViewport();
  initProjectFilters();
  initProjectModal();
  initEstimatorCalculator();
  initContactForm();
  initCounterAnimations();
});

/* ==========================================================================
   1. Sticky Navigation & Scroll Spy
   ========================================================================== */
function initStickyNavigation() {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-item-link');

  // Scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 130;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-item-link[href="#${id}"]`);

      if (matchingLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. Number Counter Animation for Hero Metrics
   ========================================================================== */
function initCounterAnimations() {
  const countElements = document.querySelectorAll('.count-up');
  if (!countElements.length) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        countElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const duration = 1200;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsBar = document.querySelector('.credibility-metrics-bar');
  if (metricsBar) observer.observe(metricsBar);
}

/* ==========================================================================
   3. Live 3D CAD / Concept Visualization Viewport
   ========================================================================== */
function initCadViewport() {
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

  // Model 1: Structural Manifold Flange
  const flangeModel = {
    name: "STRUCTURAL_GUSSET_FLANGE.SLDPRT",
    material: "Structural Steel (ASTM A36)",
    process: "Weldment & CNC Machining",
    tolerance: "ISO 2768-mK (±0.02 mm)",
    dimensions: "240 × 160 × 95 mm",
    software: "SOLIDWORKS (Weldments)",
    status: "Production-Ready [DFM Passed]",
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

  // Model 2: Involute Spur Gear
  function buildGearModel() {
    const teeth = 12;
    const rOuter = 1.3;
    const rRoot = 0.88;
    const thickness = 0.45;
    const verts = [];
    const fcs = [];

    for (let t = 0; t < 2; t++) {
      const y = t === 0 ? -thickness / 2 : thickness / 2;
      for (let i = 0; i < teeth; i++) {
        const a1 = (i * 2 * Math.PI) / teeth;
        const a2 = a1 + (Math.PI / teeth) * 0.35;
        const a3 = a1 + (Math.PI / teeth) * 0.65;
        const a4 = a1 + (Math.PI / teeth);

        verts.push([Math.cos(a1) * rRoot, y, Math.sin(a1) * rRoot]);
        verts.push([Math.cos(a2) * rOuter, y, Math.sin(a2) * rOuter]);
        verts.push([Math.cos(a3) * rOuter, y, Math.sin(a3) * rOuter]);
        verts.push([Math.cos(a4) * rRoot, y, Math.sin(a4) * rRoot]);
      }
      for (let i = 0; i < 8; i++) {
        const a = (i * 2 * Math.PI) / 8;
        verts.push([Math.cos(a) * 0.38, y, Math.sin(a) * 0.38]);
      }
    }

    const nToothVerts = teeth * 4;
    for (let i = 0; i < nToothVerts; i++) {
      const next = (i + 1) % nToothVerts;
      fcs.push([i, next, nToothVerts + 8 + next, nToothVerts + 8 + i]);
    }
    for (let i = 0; i < nToothVerts; i += 2) {
      const next = (i + 2) % nToothVerts;
      fcs.push([i, i + 1, next]);
      fcs.push([nToothVerts + 8 + i, nToothVerts + 8 + next, nToothVerts + 8 + i + 1]);
    }

    return {
      name: "INVOLUTE_SPUR_GEAR_M2.5.SLDPRT",
      material: "EN8 / AISI 1045 Carbon Steel",
      process: "Hobbing & Case Hardening",
      tolerance: "DIN 3962 Grade 7",
      dimensions: "Ø 130 mm × 35 mm",
      software: "SOLIDWORKS & CATIA V5",
      status: "Production-Ready [DFM Passed]",
      vertices: verts,
      faces: fcs
    };
  }

  // Model 3: Pillow Block Split Bearing Housing
  const bearingModel = {
    name: "PILLOW_BLOCK_HOUSING_P205.SLDPRT",
    material: "Cast Iron (EN-GJL-200)",
    process: "Sand Casting + 4-Axis CNC",
    tolerance: "H7 / k6 Precision Bore",
    dimensions: "180 × 65 × 90 mm",
    software: "SOLIDWORKS & AutoCAD",
    status: "Production-Ready [DFM Passed]",
    vertices: [
      [-1.4, -0.4, -0.7], [1.4, -0.4, -0.7], [1.4, -0.4, 0.7], [-1.4, -0.4, 0.7],
      [-1.4, -0.1, -0.7], [1.4, -0.1, -0.7], [1.4, -0.1, 0.7], [-1.4, -0.1, 0.7],
      [-0.8, -0.1, -0.5], [0.8, -0.1, -0.5], [0.8, -0.1, 0.5], [-0.8, -0.1, 0.5],
      [-0.8,  0.8, -0.5], [0.8,  0.8, -0.5], [0.8,  0.8, 0.5], [-0.8,  0.8, 0.5],
      [-0.4,  1.3, -0.5], [0.4,  1.3, -0.5], [0.4,  1.3, 0.5], [-0.4,  1.3, 0.5]
    ],
    faces: [
      [0, 1, 2, 3], [4, 5, 6, 7],
      [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
      [8, 9, 13, 12], [9, 10, 14, 13], [10, 11, 15, 14], [11, 8, 12, 15],
      [12, 13, 17, 16], [13, 14, 18, 17], [14, 15, 19, 18], [15, 12, 16, 19],
      [16, 17, 18, 19]
    ]
  };

  const models = {
    flange: flangeModel,
    gear: buildGearModel(),
    bearing: bearingModel
  };

  let activeKey = 'flange';
  let model = models[activeKey];

  let rotX = 0.45;
  let rotY = 0.75;
  let autoRotate = true;
  let renderMode = 'solid'; // 'solid' | 'wireframe' | 'blueprint'
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  // Update Side Panel Specs
  function updateSidePanel(m) {
    const nameEl = document.getElementById('metaModelName');
    const matEl = document.getElementById('metaMaterial');
    const procEl = document.getElementById('metaProcess');
    const tolEl = document.getElementById('metaTolerance');
    const dimEl = document.getElementById('metaDimensions');
    const softEl = document.getElementById('metaSoftware');
    const statEl = document.getElementById('metaStatus');

    if (nameEl) nameEl.textContent = m.name;
    if (matEl) matEl.textContent = m.material;
    if (procEl) procEl.textContent = m.process;
    if (tolEl) tolEl.textContent = m.tolerance;
    if (dimEl) dimEl.textContent = m.dimensions;
    if (softEl) softEl.textContent = m.software;
    if (statEl) statEl.textContent = m.status;
  }
  updateSidePanel(model);

  // Model Selector Buttons
  const pickerBtns = document.querySelectorAll('.cad-picker-btn');
  pickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pickerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeKey = btn.dataset.model;
      model = models[activeKey];
      updateSidePanel(model);
    });
  });

  // Viewport Tool Buttons
  const vpToolBtns = document.querySelectorAll('.vp-tool-btn[data-mode]');
  vpToolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vpToolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMode = btn.dataset.mode;
    });
  });

  const toggleSpinBtn = document.getElementById('toggleSpin');
  if (toggleSpinBtn) {
    toggleSpinBtn.addEventListener('click', () => {
      autoRotate = !autoRotate;
      toggleSpinBtn.classList.toggle('active', autoRotate);
      toggleSpinBtn.textContent = autoRotate ? 'Pause Orbit' : 'Resume Orbit';
    });
  }

  const resetAngleBtn = document.getElementById('resetAngle');
  if (resetAngleBtn) {
    resetAngleBtn.addEventListener('click', () => {
      rotX = 0.45;
      rotY = 0.75;
    });
  }

  // Mouse & Touch Orbit Controls
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

  // Main 3D Render Loop
  function render() {
    if (autoRotate && !isDragging) {
      rotY += 0.007;
    }

    ctx.clearRect(0, 0, width, height);

    // Subtle CAD Blueprint Background Grid
    drawGrid(ctx, width, height);

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const scale = Math.min(width, height) * 0.28;
    const centerX = width / 2;
    const centerY = height / 2;

    const transformed = model.vertices.map(v => {
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
      hudCoords.textContent = `RX: ${(rotX * 180 / Math.PI % 360).toFixed(1)}° | RY: ${(rotY * 180 / Math.PI % 360).toFixed(1)}° | SCALE: 1:1 DFM`;
    }

    // Depth sort faces
    const faceDepths = model.faces.map((face, index) => {
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
      const face = model.faces[f.index];
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

        ctx.fillStyle = `rgba(${Math.floor(8 + shade * 20)}, ${Math.floor(22 + shade * 95)}, ${Math.floor(45 + shade * 170)}, 0.88)`;
        ctx.fill();

        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.15;
        ctx.stroke();
      } else if (renderMode === 'wireframe') {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      } else if (renderMode === 'blueprint') {
        ctx.fillStyle = 'rgba(22, 139, 255, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([4, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    if (renderMode !== 'solid') {
      ctx.fillStyle = '#22d3ee';
      transformed.forEach(v => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    requestAnimationFrame(render);
  }

  function drawGrid(context, w, h) {
    context.save();
    context.strokeStyle = 'rgba(34, 211, 238, 0.04)';
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
   4. Project Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-pill');
  const projectCards = document.querySelectorAll('.project-showcase-card');

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
   5. Project Case Study Modal Data & Controller
   ========================================================================== */
const projectData = {
  furnace: {
    title: "Boiler Furnace Structure Design",
    category: "Industrial & Structural Weldments",
    software: "SOLIDWORKS (Weldments, Assembly, 2D Drafting)",
    challenge: "Design a heavy industrial boiler furnace structural frame capable of supporting extreme operational thermal gradients, high mechanical deadloads, and strict industrial safety margins with zero shop-floor rework.",
    solution: "Engineered parametric structural trusses, bracing channels, and mounting brackets using standard structural steel profiles. Generated complete manufacturing drawings with cut-lists, joint weld symbols (AWS D1.1), and automated bills of materials.",
    outcome: "100% shop-floor cut-list accuracy, optimized structural member weights, and full fabrication blueprint package ready for weld bay assembly.",
    deliverables: "SOLIDWORKS Assemblies (.SLDASM), Part Models (.SLDPRT), Fabrication Cut Lists, Production Drawings (.PDF, .DWG)."
  },
  enclosure: {
    title: "Precision Sheet Metal Control Panel Enclosure",
    category: "Sheet Metal & Enclosures",
    software: "SOLIDWORKS Sheet Metal",
    challenge: "Develop an industrial IP-rated electrical control panel enclosure optimized for CNC fiber laser cutting and press-brake forming with tight clearance for internal mounting sub-plates.",
    solution: "Calculated exact K-Factors and bend deductions across multi-thickness CRCA sheet metal. Integrated ventilation louvers, PEM self-clinching studs, hinge brackets, and neoprene door gasket grooves.",
    outcome: "Exported 1:1 scale flat pattern DXFs directly usable by CNC lasers, eliminating prototype trial-and-error bending scrap.",
    deliverables: "1:1 Flat Pattern DXF, 3D Assembly, Formed Part Models, Fabrication Step-by-Step Drawings."
  },
  skid: {
    title: "Heavy Equipment Base Skid & Piping Support",
    category: "Industrial & Structural Weldments",
    software: "SOLIDWORKS & AutoCAD",
    challenge: "Engineer a rigid structural steel base skid for high-pressure pump sets, vibration motor drives, and manifold piping with certified lifting points.",
    solution: "Modeled structural frame with standard I-beams, C-channels, and diagonal gusset stiffeners. Integrated rated lifting lugs with load distribution pads and foundation anchor hole patterns.",
    outcome: "Rigid vibration-damped framework with detailed shop-floor fabrication drawings and comprehensive material weight take-off.",
    deliverables: "3D CAD Model (STEP/SLDASM), Detailed 2D Fabrication Drawings (DWG/PDF), Material Take-Off / BOM."
  },
  coupling: {
    title: "Flexible Flange Transmission Coupling",
    category: "3D Parametric Modeling",
    software: "CATIA V5 (Part Design & Assembly)",
    challenge: "Design high-torque flexible flange coupling requiring precise tolerance stack-up and dynamic shaft fitments to eliminate rotational backlash.",
    solution: "Developed parametric hubs, flexible rubber buffer bushings, and drive pins in CATIA V5 using generative sketches. Conducted tolerance analysis for shaft fitments (H7/k6) and dynamic interference checks.",
    outcome: "Smooth rotational torque transfer with complete multi-sheet orthographic, sectional, and exploded assembly drawings.",
    deliverables: "CATIA Part & Product files (.CATPart, .CATProduct), Neutral STEP/IGES, Production Blueprints."
  },
  bearing: {
    title: "Precision Split Bearing Housing",
    category: "3D Modeling & Machining",
    software: "AutoCAD & SOLIDWORKS",
    challenge: "Author high-precision split bearing housing for spherical roller bearings with tight internal run-out tolerances and seal grooves.",
    solution: "Engineered internal bearing seatings adhering to ISO fit standards. Applied comprehensive GD&T callouts (concentricity, parallelism, cylindrical run-out) per ASME Y14.5.",
    outcome: "Ready for 5-axis CNC toolpath generation, casting pattern manufacture, and CMM quality inspection.",
    deliverables: "3D Solid Models (STEP, Parasolid), 2D Machining Drawings with GD&T (DWG, PDF)."
  },
  conversion: {
    title: "Legacy 2D Blueprint to 3D Parametric CAD",
    category: "2D Drafting & Conversion",
    software: "AutoCAD to SOLIDWORKS / CATIA V5",
    challenge: "Modernize legacy hand-drawn mechanical drawings and scanned PDF blueprints with missing dimensions into fully parametric 3D CAD assets.",
    solution: "Re-engineered legacy parts using geometric constraint solving and parametric feature trees. Validated thread standards, chamfers, fillet reliefs, and standard hardware sizes.",
    outcome: "Unified modern drawing sheets with company title blocks, revision logs, and editable 3D CAD models.",
    deliverables: "Parametric 3D CAD models, Native CAD files, Standardized 2D Drawings, STEP/IGES archives."
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const detailsBtns = document.querySelectorAll('.view-case-study-btn');

  if (!modalBackdrop) return;

  detailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.project;
      const data = projectData[pId];
      if (!data) return;

      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalSoftware').textContent = data.software;
      document.getElementById('modalChallenge').textContent = data.challenge;
      document.getElementById('modalSolution').textContent = data.solution;
      document.getElementById('modalOutcome').textContent = data.outcome;
      document.getElementById('modalDeliverables').textContent = data.deliverables;

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
   6. Project Scope & Timeline Estimator
   ========================================================================== */
function initEstimatorCalculator() {
  const projectTypeSelect = document.getElementById('estProjectType');
  const complexitySelect = document.getElementById('estComplexity');
  const methodSelect = document.getElementById('estMethod');
  const timelineSelect = document.getElementById('estTimeline');
  const budgetSelect = document.getElementById('estBudget');
  const drawingCheck = document.getElementById('estCheckDrawing');
  const stepCheck = document.getElementById('estCheckStep');

  const summaryTimeline = document.getElementById('summaryTimeline');
  const summaryBudget = document.getElementById('summaryBudget');
  const summaryDeliverables = document.getElementById('summaryDeliverables');
  const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');
  const emailQuoteBtn = document.getElementById('emailQuoteBtn');

  function calculateEstimate() {
    if (!projectTypeSelect || !complexitySelect) return;

    const pType = projectTypeSelect.value;
    const complexity = complexitySelect.value;
    const timelineChoice = timelineSelect ? timelineSelect.value : 'standard';
    const budgetChoice = budgetSelect ? budgetSelect.value : 'standard';

    let estimatedTime = "24 – 48 Hours";
    let deliverables = [];

    if (pType === '3d-part') {
      estimatedTime = complexity === 'low' ? '24 Hours' : (complexity === 'medium' ? '2 – 3 Days' : '3 – 5 Days');
      deliverables.push("3D Parametric CAD Model");
    } else if (pType === 'assembly') {
      estimatedTime = complexity === 'low' ? '2 – 3 Days' : (complexity === 'medium' ? '3 – 5 Days' : '5 – 8 Days');
      deliverables.push("Complete 3D Assembly & Mates");
    } else if (pType === 'sheet-metal') {
      estimatedTime = complexity === 'low' ? '24 – 48 Hours' : '3 – 4 Days';
      deliverables.push("Sheet Metal 3D Model + Flat Pattern DXF");
    } else if (pType === 'weldment') {
      estimatedTime = '3 – 5 Days';
      deliverables.push("Structural Weldment + Cut-Lists & Weld Symbols");
    } else if (pType === 'conversion') {
      estimatedTime = complexity === 'low' ? '24 Hours' : '2 – 4 Days';
      deliverables.push("Legacy Blueprint Digitization into Parametric 3D");
    }

    if (timelineChoice === 'express') {
      estimatedTime += " (Express Priority)";
    }

    if (drawingCheck && drawingCheck.checked) {
      deliverables.push("2D Manufacturing Blueprints (GD&T, BOM)");
    }
    if (stepCheck && stepCheck.checked) {
      deliverables.push("Universal STEP / IGES / 3D Print STL");
    }

    if (summaryTimeline) summaryTimeline.textContent = estimatedTime;
    if (summaryBudget) summaryBudget.textContent = budgetChoice;
    if (summaryDeliverables) summaryDeliverables.textContent = deliverables.join(" + ");

    const phone = "919665104477";
    const email = "harshalbari132002@gmail.com";
    const typeName = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;
    const methodName = methodSelect ? methodSelect.options[methodSelect.selectedIndex].text : 'Standard';

    const message = `Hello Harshal, I am requesting a project estimate from your portfolio.\n\n` +
      `*Project Type:* ${typeName}\n` +
      `*CAD Complexity:* ${complexity}\n` +
      `*Manufacturing Method:* ${methodName}\n` +
      `*Estimated Timeline:* ${estimatedTime}\n` +
      `*Budget Range:* ${budgetChoice}\n` +
      `*Required Deliverables:* ${deliverables.join(", ")}\n\n` +
      `Please let me know your availability to review technical details.`;

    if (whatsappQuoteBtn) {
      whatsappQuoteBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }

    if (emailQuoteBtn) {
      const subject = `Project Scope Inquiry: ${typeName}`;
      emailQuoteBtn.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    }
  }

  const inputs = [projectTypeSelect, complexitySelect, methodSelect, timelineSelect, budgetSelect, drawingCheck, stepCheck];
  inputs.forEach(input => {
    if (input) input.addEventListener('change', calculateEstimate);
  });

  calculateEstimate();
}

/* ==========================================================================
   7. Final CTA Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('projectInquiryForm');
  const formSuccess = document.getElementById('formSuccessMessage');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('formClientName').value;
      const email = document.getElementById('formClientEmail').value;
      const pType = document.getElementById('formProjectType').value;
      const budget = document.getElementById('formBudget').value;
      const timeline = document.getElementById('formTimeline').value;
      const desc = document.getElementById('formDescription').value;

      const recipient = "harshalbari132002@gmail.com";
      const subject = `Project Inquiry from ${name} [${pType}]`;
      const body = `Name: ${name}\nEmail: ${email}\nProject Type: ${pType}\nBudget: ${budget}\nTimeline: ${timeline}\n\nDescription:\n${desc}`;

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formSuccess) {
        formSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
      }
    });
  }
}
