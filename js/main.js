/**
 * Harshal Bari - CAD Design Specialist Portfolio
 * Interactive 3D Canvas Simulator, Project Filter, Estimator, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCadCanvas();
  initProjectFilters();
  initProjectModal();
  initEstimator();
  initContactForm();
});

/* ==========================================================================
   1. Navigation & Smooth Scroll
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

  // Active section tracking on scroll
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
   2. Interactive 3D CAD Canvas Simulator
   ========================================================================== */
function initCadCanvas() {
  const canvas = document.getElementById('cadCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width * window.devicePixelRatio || 600;
    height = canvas.height = rect.height * window.devicePixelRatio || 450;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 3D Geometry: Industrial Structural Bracket / Manifold Flange
  // Vertices (x, y, z)
  const baseVertices = [
    // Base plate (rectangle with cutout)
    [-1.2, -0.3, -1.2], [1.2, -0.3, -1.2], [1.2, -0.3, 1.2], [-1.2, -0.3, 1.2],
    [-1.2,  0.0, -1.2], [1.2,  0.0, -1.2], [1.2,  0.0, 1.2], [-1.2,  0.0, 1.2],
    // Central vertical column / boss
    [-0.5, 0.0, -0.5], [0.5, 0.0, -0.5], [0.5, 0.0, 0.5], [-0.5, 0.0, 0.5],
    [-0.5, 1.2, -0.5], [0.5, 1.2, -0.5], [0.5, 1.2, 0.5], [-0.5, 1.2, 0.5],
    // Top flange
    [-0.8, 1.2, -0.8], [0.8, 1.2, -0.8], [0.8, 1.2, 0.8], [-0.8, 1.2, 0.8],
    [-0.8, 1.4, -0.8], [0.8, 1.4, -0.8], [0.8, 1.4, 0.8], [-0.8, 1.4, 0.8],
    // Reinforcing Gussets / Ribs (Weldment feature)
    [0.0, 0.0, -1.1], [0.0, 1.0, -0.5], [0.0, 0.0, -0.5],
    [0.0, 0.0,  1.1], [0.0, 1.0,  0.5], [0.0, 0.0,  0.5],
    [-1.1, 0.0, 0.0], [-0.5, 1.0, 0.0], [-0.5, 0.0, 0.0],
    [ 1.1, 0.0, 0.0], [ 0.5, 1.0, 0.0], [ 0.5, 0.0, 0.0]
  ];

  // Quad & Triangle Faces
  const faces = [
    // Base plate bottom & top
    [0, 1, 2, 3], [4, 5, 6, 7],
    // Base plate sides
    [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
    // Central cylinder/box
    [8, 9, 13, 12], [9, 10, 14, 13], [10, 11, 15, 14], [11, 8, 12, 15],
    // Top flange bottom & top
    [16, 17, 18, 19], [20, 21, 22, 23],
    // Top flange sides
    [16, 17, 21, 20], [17, 18, 22, 21], [18, 19, 23, 22], [19, 16, 20, 23],
    // Gusset triangles
    [24, 25, 26], [27, 28, 29], [30, 31, 32], [33, 34, 35]
  ];

  let rotX = 0.5;
  let rotY = 0.8;
  let autoRotate = true;
  let renderMode = 'solid'; // 'wireframe' | 'solid' | 'blueprint'
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  // View Mode Buttons
  const modeButtons = document.querySelectorAll('.ctrl-btn[data-mode]');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      modeButtons.forEach(b => b.classList.remove('active'));
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
      rotY = 0.8;
    });
  }

  // Mouse & Touch Interaction
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouseX;
    const dy = e.clientY - prevMouseY;
    rotY += dx * 0.01;
    rotX += dy * 0.01;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - prevMouseX;
    const dy = e.touches[0].clientY - prevMouseY;
    rotY += dx * 0.015;
    rotX += dy * 0.015;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Render Loop
  function render() {
    if (autoRotate && !isDragging) {
      rotY += 0.008;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw Isometric Grid on Canvas background
    drawGrid(ctx, width, height);

    // 3D Projection Matrices
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const scale = Math.min(width, height) * 0.28;
    const centerX = width / 2;
    const centerY = height / 2;

    // Transform vertices
    const transformed = baseVertices.map(v => {
      // Rotate Y
      const x1 = v[0] * cosY + v[2] * sinY;
      const y1 = v[1];
      const z1 = -v[0] * sinY + v[2] * cosY;

      // Rotate X
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Perspective Projection
      const fov = 4.5;
      const p = fov / (fov + z2);
      return {
        x: centerX + x2 * scale * p,
        y: centerY - y2 * scale * p,
        z: z2
      };
    });

    // Update HUD Coordinates
    const hudCoords = document.getElementById('hudCoords');
    if (hudCoords) {
      hudCoords.textContent = `X: ${(rotX * 180 / Math.PI % 360).toFixed(1)}° | Y: ${(rotY * 180 / Math.PI % 360).toFixed(1)}° | SCALE: 1:1 DFM`;
    }

    // Sort faces by depth
    const faceDepths = faces.map((face, index) => {
      let avgZ = 0;
      face.forEach(vIdx => { avgZ += transformed[vIdx].z; });
      avgZ /= face.length;
      return { index, depth: avgZ };
    });
    faceDepths.sort((a, b) => b.depth - a.depth);

    // Render Faces
    faceDepths.forEach(f => {
      const face = faces[f.index];
      ctx.beginPath();
      ctx.moveTo(transformed[face[0]].x, transformed[face[0]].y);
      for (let i = 1; i < face.length; i++) {
        ctx.lineTo(transformed[face[i]].x, transformed[face[i]].y);
      }
      ctx.closePath();

      if (renderMode === 'solid') {
        // Calculate fake lighting normal
        const v0 = transformed[face[0]];
        const v1 = transformed[face[1]];
        const v2 = transformed[face[2]];
        const normalZ = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
        const shade = Math.max(0.15, Math.min(0.9, (normalZ / 12000) * 0.5 + 0.5));
        
        ctx.fillStyle = `rgba(${Math.floor(15 + shade * 35)}, ${Math.floor(30 + shade * 120)}, ${Math.floor(60 + shade * 180)}, 0.85)`;
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else if (renderMode === 'wireframe') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      } else if (renderMode === 'blueprint') {
        ctx.fillStyle = 'rgba(2, 132, 199, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Vertex points in blueprint/wireframe mode
    if (renderMode !== 'solid') {
      ctx.fillStyle = '#38bdf8';
      transformed.forEach(v => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    requestAnimationFrame(render);
  }

  function drawGrid(context, w, h) {
    context.save();
    context.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    context.lineWidth = 1;
    const step = 30;
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
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

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
const projectData = {
  furnace: {
    title: "Boiler Furnace Structure Design",
    category: "Industrial & Structural Weldments",
    software: "SOLIDWORKS (Weldments, Assembly, 2D Drafting)",
    overview: "Comprehensive 3D parametric structural design of an industrial boiler furnace framework engineered to sustain extreme operational thermal stresses, mechanical load distribution, and stringent industrial safety margins.",
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
      const data = projectData[projectId];
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
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
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
      deliverablesList.push("Universal STEP / IGES / STL Files");
    }

    if (estTimeDisplay) estTimeDisplay.textContent = timeline;
    if (estDeliverablesDisplay) estDeliverablesDisplay.textContent = deliverablesList.join(" + ");

    // Setup WhatsApp and Email links
    const phone = "919665104477";
    const email = "harshalbari132002@gmail.com";
    const projectTypeName = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;

    const message = `Hello Harshal, I am interested in your Freelance CAD Design services.\n\n` +
      `*Project Type:* ${projectTypeName}\n` +
      `*Parts Scope:* ${parts}\n` +
      `*Required Timeline:* ${timeline}\n` +
      `*Deliverables:* ${deliverablesList.join(", ")}\n\n` +
      `Please let me know your availability to discuss further.`;

    if (whatsappQuoteBtn) {
      whatsappQuoteBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }

    if (emailQuoteBtn) {
      const subject = `Freelance CAD Inquiry: ${projectTypeName}`;
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
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const email = document.getElementById('clientEmail').value;
      const service = document.getElementById('clientService').value;
      const message = document.getElementById('clientMessage').value;

      const recipient = "harshalbari132002@gmail.com";
      const subject = `New CAD Project Inquiry from ${name} [${service}]`;
      const body = `Name: ${name}\nEmail: ${email}\nService Required: ${service}\n\nProject Details:\n${message}`;

      // Open email client
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formSuccess) {
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
      }
    });
  }
}
