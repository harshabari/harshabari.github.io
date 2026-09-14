/**
 * Harshal Bari - Mechanical Design Engineer & CAD Specialist
 * Interactive 3D Canvas Simulator, Project Scope Estimator, Modal Case Studies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCadCanvas();
  initProjectModals();
  initEstimator();
  initContactForm();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL TRACKING
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Sticky header appearance change
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', expanded);
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (targetLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          links.forEach(l => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. LIVE 3D CAD VISUALIZATION CANVAS
   ========================================================================== */
function initCadCanvas() {
  const canvas = document.getElementById('cadCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width * (window.devicePixelRatio || 1);
    height = canvas.height = rect.height * (window.devicePixelRatio || 1);
  }
  resize();
  window.addEventListener('resize', resize);

  // 3D Geometry: Precision Industrial Structural Flange Bracket (Gusseted Manifold)
  const baseVertices = [
    // Base rectangular mounting plate (8 vertices)
    [-1.3, -0.25, -1.3], [1.3, -0.25, -1.3], [1.3, -0.25, 1.3], [-1.3, -0.25, 1.3],
    [-1.3,  0.05, -1.3], [1.3,  0.05, -1.3], [1.3,  0.05, 1.3], [-1.3,  0.05, 1.3],
    
    // Central cylinder / boss column (8 vertices)
    [-0.55, 0.05, -0.55], [0.55, 0.05, -0.55], [0.55, 0.05, 0.55], [-0.55, 0.05, 0.55],
    [-0.55, 1.3, -0.55],  [0.55, 1.3, -0.55],  [0.55, 1.3, 0.55],  [-0.55, 1.3, 0.55],

    // Top flanged ring (8 vertices)
    [-0.85, 1.3, -0.85], [0.85, 1.3, -0.85], [0.85, 1.3, 0.85], [-0.85, 1.3, 0.85],
    [-0.85, 1.5, -0.85], [0.85, 1.5, -0.85], [0.85, 1.5, 0.85], [-0.85, 1.5, 0.85],

    // Four Structural Reinforcement Weldment Gussets
    [0.0, 0.05, -1.2], [0.0, 1.1, -0.55], [0.0, 0.05, -0.55], // North Gusset
    [0.0, 0.05,  1.2], [0.0, 1.1,  0.55], [0.0, 0.05,  0.55], // South Gusset
    [-1.2, 0.05, 0.0], [-0.55, 1.1, 0.0], [-0.55, 0.05, 0.0], // West Gusset
    [ 1.2, 0.05, 0.0], [ 0.55, 1.1, 0.0], [ 0.55, 0.05, 0.0]  // East Gusset
  ];

  const faces = [
    // Base plate bottom, top, sides
    [0, 1, 2, 3], [4, 5, 6, 7],
    [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
    // Central column faces
    [8, 9, 13, 12], [9, 10, 14, 13], [10, 11, 15, 14], [11, 8, 12, 15],
    // Top flange faces
    [16, 17, 18, 19], [20, 21, 22, 23],
    [16, 17, 21, 20], [17, 18, 22, 21], [18, 19, 23, 22], [19, 16, 20, 23],
    // Four Triangular Gussets
    [24, 25, 26], [27, 28, 29], [30, 31, 32], [33, 34, 35]
  ];

  let rotX = 0.45;
  let rotY = 0.75;
  let isAutoRotating = true;
  let renderStyle = 'solid'; // 'solid', 'wireframe', 'blueprint'
  let isPointerDown = false;
  let lastX = 0;
  let lastY = 0;

  // View Mode Toolbar buttons
  const modeBtns = document.querySelectorAll('.tool-btn[data-mode]');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStyle = btn.dataset.mode;
    });
  });

  const toggleSpinBtn = document.getElementById('visToggleSpin');
  if (toggleSpinBtn) {
    toggleSpinBtn.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      toggleSpinBtn.classList.toggle('active', isAutoRotating);
      toggleSpinBtn.textContent = isAutoRotating ? 'Pause Spin' : 'Resume Spin';
    });
  }

  const resetViewBtn = document.getElementById('visResetView');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      rotX = 0.45;
      rotY = 0.75;
    });
  }

  // Pointer Drag interactions
  canvas.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isPointerDown = false; });

  canvas.addEventListener('mousemove', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    rotY += deltaX * 0.009;
    rotX += deltaY * 0.009;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isPointerDown = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isPointerDown || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastX;
    const deltaY = e.touches[0].clientY - lastY;
    rotY += deltaX * 0.012;
    rotX += deltaY * 0.012;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => { isPointerDown = false; });

  // Main Render Loop
  function drawFrame() {
    if (isAutoRotating && !isPointerDown) {
      rotY += 0.006;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw background blueprint grid
    drawGridLines(ctx, width, height);

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const scale = Math.min(width, height) * 0.26;
    const cx = width / 2;
    const cy = height / 2 + 15;

    // Transform vertices
    const projected = baseVertices.map(v => {
      const x1 = v[0] * cosY + v[2] * sinY;
      const y1 = v[1];
      const z1 = -v[0] * sinY + v[2] * cosY;

      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const fov = 4.8;
      const p = fov / (fov + z2);

      return {
        x: cx + x2 * scale * p,
        y: cy - y2 * scale * p,
        z: z2
      };
    });

    // Update HUD Coordinates
    const hudAngle = document.getElementById('visHudAngle');
    if (hudAngle) {
      const degX = (rotX * 180 / Math.PI % 360).toFixed(1);
      const degY = (rotY * 180 / Math.PI % 360).toFixed(1);
      hudAngle.textContent = `ROT_X: ${degX}° | ROT_Y: ${degY}° | DFM: ASME Y14.5`;
    }

    // Sort faces by depth
    const faceOrder = faces.map((face, index) => {
      let depthSum = 0;
      face.forEach(idx => { depthSum += projected[idx].z; });
      return { index, depth: depthSum / face.length };
    });
    faceOrder.sort((a, b) => b.depth - a.depth);

    // Render Faces
    faceOrder.forEach(item => {
      const f = faces[item.index];
      ctx.beginPath();
      ctx.moveTo(projected[f[0]].x, projected[f[0]].y);
      for (let i = 1; i < f.length; i++) {
        ctx.lineTo(projected[f[i]].x, projected[f[i]].y);
      }
      ctx.closePath();

      if (renderStyle === 'solid') {
        // Calculate fake lighting normal
        const p0 = projected[f[0]];
        const p1 = projected[f[1]];
        const p2 = projected[f[2]];
        const normalZ = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
        const intensity = Math.max(0.2, Math.min(0.85, (normalZ / 14000) * 0.45 + 0.5));

        ctx.fillStyle = `rgba(${Math.floor(10 + intensity * 20)}, ${Math.floor(40 + intensity * 110)}, ${Math.floor(120 + intensity * 135)}, 0.88)`;
        ctx.fill();

        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      } else if (renderStyle === 'wireframe') {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      } else if (renderStyle === 'blueprint') {
        ctx.fillStyle = 'rgba(22, 139, 255, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Vertex points in blueprint/wireframe
    if (renderStyle !== 'solid') {
      ctx.fillStyle = '#22d3ee';
      projected.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    requestAnimationFrame(drawFrame);
  }

  function drawGridLines(context, w, h) {
    context.save();
    context.strokeStyle = 'rgba(34, 211, 238, 0.04)';
    context.lineWidth = 1;
    const gap = 28;
    for (let x = 0; x < w; x += gap) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, h);
      context.stroke();
    }
    for (let y = 0; y < h; y += gap) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(w, y);
      context.stroke();
    }
    context.restore();
  }

  drawFrame();
}

/* ==========================================================================
   3. PROJECT CASE STUDY MODALS
   ========================================================================== */
const projectDatabase = {
  furnace: {
    category: "Industrial Weldments & Heavy Structures",
    title: "Boiler Furnace Structure Design",
    software: "SOLIDWORKS (Weldments, Assembly, 2D Production Drafting)",
    challenge: "Design the complete structural frame and load-bearing framework of an industrial boiler furnace engineered to withstand severe operational thermal stresses, mechanical vibration, and heavy dead loads without deflection.",
    solution: "Modeled structural members, trusses, and bracing using SOLIDWORKS Weldments. Configured standard structural profiles, welded joints, cut-lists, and gusset plates. Conducted interference checks and developed multi-sheet manufacturing drawings with AWS weld callouts.",
    standards: "AWS D1.1 Structural Welding Standards • ASME Section VIII Design Criteria • Standard Steel Beams & Channels",
    deliverables: "SOLIDWORKS Assemblies (.SLDASM), Part Files (.SLDPRT), Structural Cut-Lists, 2D Production Blueprints (.DWG, .PDF)",
    outcome: "Zero shop-floor fabrication rework, exact cut-length procurement, and complete bill of materials for manufacturing."
  },
  enclosure: {
    category: "Sheet Metal & Enclosures",
    title: "Precision Control Panel Enclosure",
    software: "SOLIDWORKS Sheet Metal",
    challenge: "Design an IP-rated electrical control panel cabinet with modular internal sub-plates, door hinge clearances, ventilation louvers, and zero scrap on the laser-cutting table.",
    solution: "Calculated exact K-Factors and bend deductions across multi-thickness CRCA sheet metal. Designed seamless folded flanges, PEM clinch fasteners, door gaskets, and 1:1 flat pattern DXF files ready for fiber laser cutting.",
    standards: "DIN EN 62208 Enclosure Standards • ISO 2768-m Tolerancing • Sheet Metal Bending K-Factor 0.44",
    deliverables: "1:1 Flat Pattern DXF Cut-Files, Formed 3D Models, Exploded Assembly Drawings, Bending Sequence Sheets",
    outcome: "Seamless CNC press-brake forming with 100% first-pass assembly fitment and zero manual filing."
  },
  skid: {
    category: "Structural Skids & Framing",
    title: "Heavy Equipment Base Skid & Frame",
    software: "SOLIDWORKS & AutoCAD",
    challenge: "Create a heavy-duty structural base skid to support heavy motor-pump assemblies, high-pressure piping manifolds, and four-point overhead crane lifting.",
    solution: "Engineered heavy structural steel skid with I-beams, C-channels, and gusset plates. Modeled certified lifting lugs with center-of-gravity alignment. Created detailed fabrication blueprints with weld joint details.",
    standards: "ASME B30.20 Lifting Devices • ISO 5817 Weld Quality Standards • AWS Joint Nomenclature",
    deliverables: "Complete 3D CAD Model (STEP, Parasolid), AutoCAD Fabrication Blueprints, Material Take-Off / BOM",
    outcome: "Certified lifting safety margin, optimized raw steel weight, and approved shop-floor weld schedule."
  },
  coupling: {
    category: "Mechanical Assembly & Kinematics",
    title: "Flexible Flange Transmission Coupling",
    software: "CATIA V5 (Part Design & Assembly)",
    challenge: "Develop an industrial flexible flange coupling for shaft power transmission requiring tight concentricity, keyway alignment, and vibration damping buffer fitment.",
    solution: "Designed mating cast-iron hubs, drive pins, and elastomeric bushes using CATIA V5 parametric modeling. Performed tolerance stack-up analysis for shaft fit (H7/k6) and verified dynamic clearance.",
    standards: "ISO 286 Fit & Tolerance System • DIN 6885 Drive Keyways • ASME B4.1 Limits and Fits",
    deliverables: "CATIA Part & Product Files (.CATPart, .CATProduct), Neutral STEP/IGES, Multi-Sheet Drafting with Sectional Views",
    outcome: "High-torque transmission capability with full geometric tolerance documentation and part ballooning."
  },
  bearing: {
    category: "Machining & GD&T",
    title: "Precision Split Bearing Housing",
    software: "AutoCAD & SOLIDWORKS",
    challenge: "Design a heavy-duty split bearing housing for spherical roller bearings with tight bore concentricity, grease labyrinth seals, and casting draft angles.",
    solution: "Developed 3D solid model and comprehensive 2D machining drawings with ASME Y14.5 GD&T callouts (true position, cylindrical runout, parallelism). Specified precision bearing seats and inspection datums.",
    standards: "ASME Y14.5 GD&T Standard • ISO 1101 Geometrical Tolerancing • ISO 286 Precision Fits",
    deliverables: "3D Parasolid / STEP Solids, 2D AutoCAD Machining Blueprints (.DWG, .PDF) with Complete GD&T",
    outcome: "CMM-verified machining compliance for 5-axis CNC production and zero bearing misalignment."
  },
  conversion: {
    category: "Blueprint Digitization & Modernization",
    title: "Legacy 2D Blueprint to 3D CAD Conversion",
    software: "AutoCAD to SOLIDWORKS / CATIA V5",
    challenge: "Convert legacy hand-drawn mechanical drawings, non-parametric blueprints, and PDF archives into parametric, feature-based 3D digital twins.",
    solution: "Reconstructed geometry from legacy dimensions, resolved missing tolerance callouts, and structured clean, parametric feature trees allowing rapid future design revisions.",
    standards: "Modern CAD Modeling Best Practices • Standard Parametric Sketch Constraints • Neutral 3D Exchange Formats",
    deliverables: "Parametric SOLIDWORKS / CATIA Models, Neutral STEP/IGES Files, Modernized 2D CAD Blueprints",
    outcome: "Fully editable digital CAD library enabling fast CNC toolpath generation and additive prototyping."
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalBtns = document.querySelectorAll('.case-study-btn');

  if (!modalOverlay) return;

  modalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.project;
      const data = projectDatabase[pId];
      if (!data) return;

      document.getElementById('mCategory').textContent = data.category;
      document.getElementById('mTitle').textContent = data.title;
      document.getElementById('mSoftware').textContent = data.software;
      document.getElementById('mChallenge').textContent = data.challenge;
      document.getElementById('mSolution').textContent = data.solution;
      document.getElementById('mStandards').textContent = data.standards;
      document.getElementById('mDeliverables').textContent = data.deliverables;
      document.getElementById('mOutcome').textContent = data.outcome;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   4. PROJECT SCOPE & TIMELINE ESTIMATOR
   ========================================================================== */
function initEstimator() {
  const pType = document.getElementById('estProjectType');
  const pComplexity = document.getElementById('estComplexity');
  const pMfg = document.getElementById('estMfgMethod');
  const pUrgency = document.getElementById('estUrgency');

  const checkDrawings = document.getElementById('estCheckDrawings');
  const checkStep = document.getElementById('estCheckStep');
  const checkDxf = document.getElementById('estCheckDxf');

  const outTimeline = document.getElementById('outTimeline');
  const outTier = document.getElementById('outTier');
  const outDeliverables = document.getElementById('outDeliverables');
  const btnWhatsApp = document.getElementById('btnEstimateWhatsApp');
  const btnEmail = document.getElementById('btnEstimateEmail');

  function calculate() {
    if (!pType || !pComplexity) return;

    const type = pType.value;
    const comp = pComplexity.value;
    const urg = pUrgency ? pUrgency.value : 'standard';

    let time = "24 – 48 Hours";
    let tier = "Standard Engineering Scope";
    let deliv = ["3D Parametric CAD Model"];

    if (type === 'part') {
      time = comp === 'high' ? '2 – 3 Days' : (comp === 'medium' ? '24 – 48 Hours' : '24 Hours');
    } else if (type === 'assembly') {
      time = comp === 'high' ? '5 – 7 Days' : '3 – 4 Days';
      tier = "Complex Mechanical Assembly";
      deliv = ["Complete 3D Assembly + Exploded View"];
    } else if (type === 'sheet-metal') {
      time = comp === 'high' ? '3 – 4 Days' : '24 – 48 Hours';
      tier = "Sheet Metal & Laser-Cut Package";
    } else if (type === 'weldment') {
      time = comp === 'high' ? '4 – 6 Days' : '2 – 3 Days';
      tier = "Structural Framing & Weldment";
    } else if (type === 'conversion') {
      time = comp === 'high' ? '3 – 4 Days' : '24 – 48 Hours';
      tier = "Blueprint 2D to 3D Re-Engineering";
    }

    if (checkDrawings && checkDrawings.checked) {
      deliv.push("2D Blueprints (GD&T + BOM)");
    }
    if (checkDxf && checkDxf.checked) {
      deliv.push("1:1 Flat Pattern DXF Cut-Files");
    }
    if (checkStep && checkStep.checked) {
      deliv.push("STEP / IGES / STL Formats");
    }

    if (urg === 'priority') {
      time += " (Priority Express)";
      tier += " [Expedited]";
    }

    if (outTimeline) outTimeline.textContent = time;
    if (outTier) outTier.textContent = tier;
    if (outDeliverables) outDeliverables.textContent = deliv.join(" • ");

    // Pre-fill message
    const phone = "919665104477";
    const email = "harshalbari132002@gmail.com";
    const typeLabel = pType.options[pType.selectedIndex].text;
    const mfgLabel = pMfg ? pMfg.options[pMfg.selectedIndex].text : 'Standard';

    const msg = `Hello Harshal, I would like to request an engineering project estimate:\n\n` +
      `• Project Type: ${typeLabel}\n` +
      `• Complexity: ${comp.toUpperCase()}\n` +
      `• Manufacturing: ${mfgLabel}\n` +
      `• Estimated Timeline: ${time}\n` +
      `• Deliverables: ${deliv.join(", ")}\n\n` +
      `Looking forward to discussing the project specifications.`;

    if (btnWhatsApp) {
      btnWhatsApp.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }

    if (btnEmail) {
      const subject = `Engineering Project Estimate Request: ${typeLabel}`;
      btnEmail.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    }
  }

  const inputs = [pType, pComplexity, pMfg, pUrgency, checkDrawings, checkStep, checkDxf];
  inputs.forEach(item => {
    if (item) item.addEventListener('change', calculate);
  });

  calculate();
}

/* ==========================================================================
   5. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('projectInquiryForm');
  const alertSuccess = document.getElementById('inquirySuccessAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('inqName').value;
      const email = document.getElementById('inqEmail').value;
      const projectType = document.getElementById('inqType').value;
      const desc = document.getElementById('inqDesc').value;
      const timeline = document.getElementById('inqTimeline').value;

      const recipient = "harshalbari132002@gmail.com";
      const subject = `New Engineering Project Inquiry: ${projectType} from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\nRequired Timeline: ${timeline}\n\nProject Scope & Description:\n${desc}`;

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (alertSuccess) {
        alertSuccess.style.display = 'block';
        form.reset();
        setTimeout(() => { alertSuccess.style.display = 'none'; }, 7000);
      }
    });
  }
}
