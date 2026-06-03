/* ==========================================================================
   1. HERO CANVAS: CRYSTAL LATTICE ANIMATION
   ========================================================================== */
const canvas = document.getElementById('canvas-lattice');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 45;
const connectionDistance = 120;
let mouse = { x: null, y: null, radius: 150 };

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position in hero
const heroSection = document.getElementById('hero');
heroSection.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

heroSection.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary bounce
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Mouse attraction / push
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        this.x -= dx / dist * force * 1.5;
        this.y -= dy / dist * force * 1.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#6B0F1A'; // Maroon nodes
    ctx.fill();
  }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Draw connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.hypot(dx, dy);

      if (dist < connectionDistance) {
        // Opacity based on distance
        let alpha = (connectionDistance - dist) / connectionDistance * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212, 160, 23, ${alpha})`; // Gold lattice links
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

// Animation loop
let animationId;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  drawConnections();
  animationId = requestAnimationFrame(animate);
}

// Stop lattice canvas when not visible to optimize performance
const latticeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animate();
    } else {
      cancelAnimationFrame(animationId);
    }
  });
}, { threshold: 0.1 });
latticeObserver.observe(heroSection);


/* ==========================================================================
   2. SCROLL REVEALS & STATS COUNT UP
   ========================================================================== */
const revealElements = document.querySelectorAll('.reveal');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Trigger count up if it contains counting classes
      const counters = entry.target.querySelectorAll('.stat-num[data-count]');
      counters.forEach(counter => triggerCountUp(counter));
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => scrollObserver.observe(el));

function triggerCountUp(el) {
  if (el.classList.contains('counted')) return;
  el.classList.add('counted');
  
  const target = parseInt(el.getAttribute('data-count'), 10);
  let count = 0;
  const duration = 2000; // 2 seconds
  const stepTime = Math.max(Math.floor(duration / target), 30);
  
  const timer = setInterval(() => {
    count += 1;
    el.innerText = count;
    if (count >= target) {
      el.innerText = target;
      clearInterval(timer);
    }
  }, stepTime);
}


/* ==========================================================================
   3. WORLD MAP INTERACTION (3D ROTATING GLOBE)
   ========================================================================== */
const countriesData = {
  china: {
    name: "China",
    flag: "🇨🇳",
    resource: "Rare Earths & Graphite refining",
    share: "85 - 90% of REE refining, 70% Graphite",
    position: "Monopolistic Supply Bottleneck",
    desc: "China holds absolute processing control over heavy rare earths, crucial for high-performance military radars and electric vehicle traction magnets.",
    badge: "Strategic Choke Point"
  },
  drc: {
    name: "Democratic Republic of Congo",
    flag: "🇨🇩",
    resource: "Cobalt (Co)",
    share: "70% of global mine production",
    position: "Vulnerable Primary Miner",
    desc: "Congo mines the vast majority of global cobalt, but the supply chain is highly unstable due to widespread child labor, environmental degradation, and artisanal mining issues.",
    badge: "Ethical & Supply Chain Focus"
  },
  chile: {
    name: "Chile",
    flag: "🇨🇱",
    resource: "Copper (Cu) & Lithium (Li) Brines",
    share: "25% of Copper reserves, 30% Lithium reserves",
    position: "Leading Reserve Node",
    desc: "Chile sits in the 'Lithium Triangle' and serves as the primary global source of lithium brine, which requires massive water resources to extract.",
    badge: "Water & Environmental Risk"
  },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    resource: "Hard-rock Lithium (Spodumene)",
    share: "47% of global Lithium mining",
    position: "Leading Raw Supplier",
    desc: "Australia produces the most raw lithium. However, it ships almost all of its raw spodumene ore to China for conversion into chemical-grade battery materials.",
    badge: "Core Allied Partner"
  },
  indonesia: {
    name: "Indonesia",
    flag: "🇮🇩",
    resource: "Nickel (Ni) Ore",
    share: "50% of global Nickel mining output",
    position: "Dominant Miner",
    desc: "Indonesia has expanded nickel mining rapidly by banning raw ore exports to force multi-billion dollar domestic Chinese-backed smelting plants to build locally.",
    badge: "Resource Nationalism Leader"
  },
  india: {
    name: "India",
    flag: "🇮🇳",
    resource: "30 Critical Minerals (NCMM Focus)",
    share: "100% dependent on imports for Lithium, Cobalt, Nickel",
    position: "Emerging Consumer",
    desc: "India has high geological potential for beach sands (REEs) and local reserves but faces extreme dependency on foreign refiners to sustain its EV and solar production.",
    badge: "Focus Security Country"
  }
};

const mapDetailCard = document.getElementById('map-detail-card');

function updateMapCard(data) {
  document.getElementById('m-country').innerText = data.name;
  document.getElementById('m-flag').innerText = data.flag;
  document.getElementById('m-resource').innerText = data.resource;
  document.getElementById('m-share').innerText = data.share;
  document.getElementById('m-position').innerText = data.position;
  document.getElementById('m-description').innerText = data.desc;
  
  const badge = document.getElementById('m-badge');
  badge.innerText = data.badge;

  // Change map card borders to correspond to status
  if (data.name === "China") {
    mapDetailCard.style.borderColor = "var(--risk-high)";
    badge.style.background = "var(--risk-high-light)";
    badge.style.color = "var(--risk-high)";
  } else if (data.name === "India") {
    mapDetailCard.style.borderColor = "var(--maroon)";
    badge.style.background = "var(--maroon-light)";
    badge.style.color = "var(--maroon)";
  } else {
    mapDetailCard.style.borderColor = "var(--teal)";
    badge.style.background = "var(--teal-light)";
    badge.style.color = "var(--teal)";
  }
}

// 3D Canvas Globe Setup
const canvasG = document.getElementById('canvas-globe');
const ctxG = canvasG.getContext('2d');

let globeRadius = 190;
let rLat = 0.35; // Tilt (Latitude)
let rLon = -0.6; // Rotation (Longitude)
let isDragging = false;
let previousMouse = { x: 0, y: 0 };
let activeHoverCountry = null;
let automaticRotation = true;
let spinSpeed = 0.0025;
let globeAnimId;

// Glowing hotspot points mapping
const globePoints = [
  { id: "china", name: "China", lat: 35.8617, lon: 104.1954, color: "#D4A017" },
  { id: "drc", name: "DR Congo", lat: -4.0383, lon: 21.7587, color: "#1A7A7A" },
  { id: "chile", name: "Chile", lat: -27.0000, lon: -70.0000, color: "#8F4D58" },
  { id: "australia", name: "Australia", lat: -25.2744, lon: 133.7751, color: "#5D784A" },
  { id: "indonesia", name: "Indonesia", lat: -0.7893, lon: 113.9213, color: "#755B8F" },
  { id: "india", name: "India", lat: 20.5937, lon: 78.9629, color: "#6B0F1A" }
];

// Generate discrete landmass dots for clean, wireframe globe design
const landmassPoints = [];
const landRanges = [
  // Eurasia
  { minLat: 10, maxLat: 68, minLon: -10, maxLon: 140, step: 10 },
  // Africa
  { minLat: -32, maxLat: 30, minLon: -15, maxLon: 50, step: 11 },
  // Australia
  { minLat: -38, maxLat: -12, minLon: 113, maxLon: 153, step: 9 },
  // North America
  { minLat: 15, maxLat: 60, minLon: -130, maxLon: -60, step: 11 },
  // South America
  { minLat: -54, maxLat: 12, minLon: -80, maxLon: -38, step: 10 }
];

landRanges.forEach(r => {
  for (let lat = r.minLat; lat <= r.maxLat; lat += r.step) {
    for (let lon = r.minLon; lon <= r.maxLon; lon += r.step) {
      // Mute coordinates falling outside simplified land boundaries
      if (r.minLon === -80 && lat > 0 && lon > -50) continue; // South America narrowing
      if (r.minLon === -15 && lat < -15 && lon > 35) continue; // South Africa narrowing
      landmassPoints.push({ lat, lon });
    }
  }
});

// Spherical 3D Projection Math
function projectSpherical(lon, lat, rLat, rLon) {
  let radLon = lon * Math.PI / 180;
  let radLat = lat * Math.PI / 180;

  // Unit sphere coordinate
  let x0 = Math.cos(radLat) * Math.sin(radLon);
  let y0 = Math.sin(radLat);
  let z0 = Math.cos(radLat) * Math.cos(radLon);

  // Rotate X-axis (Pitch)
  let x1 = x0;
  let y1 = y0 * Math.cos(rLat) - z0 * Math.sin(rLat);
  let z1 = y0 * Math.sin(rLat) + z0 * Math.cos(rLat);

  // Rotate Y-axis (Yaw)
  let x2 = x1 * Math.cos(rLon) + z1 * Math.sin(rLon);
  let y2 = y1;
  let z2 = -x1 * Math.sin(rLon) + z1 * Math.cos(rLon);

  let cx = canvasG.width / 2;
  let cy = canvasG.height / 2;

  return {
    x: cx + x2 * globeRadius,
    y: cy - y2 * globeRadius,
    z: z2 // front facing if z > 0
  };
}

// Draw a grid ring of Latitude
function drawLatitude(latVal, rLat, rLon) {
  ctxG.beginPath();
  let first = true;
  for (let lonDeg = 0; lonDeg <= 360; lonDeg += 5) {
    let pt = projectSpherical(lonDeg, latVal, rLat, rLon);
    if (pt.z > 0) {
      if (first) {
        ctxG.moveTo(pt.x, pt.y);
        first = false;
      } else {
        ctxG.lineTo(pt.x, pt.y);
      }
    } else {
      first = true;
    }
  }
  ctxG.stroke();
}

// Draw a grid ring of Longitude
function drawLongitude(lonVal, rLat, rLon) {
  ctxG.beginPath();
  let first = true;
  for (let latDeg = -90; latDeg <= 90; latDeg += 3) {
    let pt = projectSpherical(lonVal, latDeg, rLat, rLon);
    if (pt.z > 0) {
      if (first) {
        ctxG.moveTo(pt.x, pt.y);
        first = false;
      } else {
        ctxG.lineTo(pt.x, pt.y);
      }
    } else {
      first = true;
    }
  }
  ctxG.stroke();
}

// Main globe loop rendering frame
function drawGlobeFrame() {
  ctxG.clearRect(0, 0, canvasG.width, canvasG.height);
  
  let cx = canvasG.width / 2;
  let cy = canvasG.height / 2;

  // Globe shadow backing
  ctxG.beginPath();
  ctxG.arc(cx, cy, globeRadius, 0, Math.PI * 2);
  ctxG.fillStyle = '#FFFFFF';
  ctxG.fill();

  let shadowGrad = ctxG.createRadialGradient(cx - 50, cy - 50, 20, cx, cy, globeRadius);
  shadowGrad.addColorStop(0, 'rgba(255,255,255,0)');
  shadowGrad.addColorStop(0.8, 'rgba(107, 15, 26, 0.02)');
  shadowGrad.addColorStop(1, 'rgba(107, 15, 26, 0.08)');
  ctxG.beginPath();
  ctxG.arc(cx, cy, globeRadius, 0, Math.PI * 2);
  ctxG.fillStyle = shadowGrad;
  ctxG.fill();

  ctxG.strokeStyle = 'rgba(107, 15, 26, 0.08)';
  ctxG.lineWidth = 1;
  ctxG.stroke();

  // Graticules grid mapping
  ctxG.strokeStyle = 'rgba(107, 15, 26, 0.04)';
  ctxG.lineWidth = 0.5;
  for (let lat = -75; lat <= 75; lat += 15) {
    drawLatitude(lat, rLat, rLon);
  }
  for (let lon = 0; lon < 360; lon += 30) {
    drawLongitude(lon, rLat, rLon);
  }

  // Draw Dotted Landmass
  ctxG.fillStyle = 'rgba(140, 122, 101, 0.28)';
  landmassPoints.forEach(pt => {
    let projected = projectSpherical(pt.lon, pt.lat, rLat, rLon);
    if (projected.z > 0) {
      ctxG.beginPath();
      ctxG.arc(projected.x, projected.y, 1.8, 0, Math.PI * 2);
      ctxG.fill();
    }
  });

  // Draw Hotspots
  globePoints.forEach(pt => {
    let projected = projectSpherical(pt.lon, pt.lat, rLat, rLon);
    if (projected.z > 0) {
      let isHovered = (activeHoverCountry === pt.id);
      
      if (isHovered) {
        // Glowing halo ring
        ctxG.beginPath();
        ctxG.arc(projected.x, projected.y, 14, 0, Math.PI * 2);
        ctxG.strokeStyle = pt.color;
        ctxG.lineWidth = 2;
        ctxG.stroke();
        
        ctxG.beginPath();
        ctxG.arc(projected.x, projected.y, 8, 0, Math.PI * 2);
        ctxG.fillStyle = pt.color + "33"; // 20% opacity fill
        ctxG.fill();
      } else {
        // Subtle pulse sizing
        let pulse = 6 + Math.sin(Date.now() * 0.005) * 1.5;
        ctxG.beginPath();
        ctxG.arc(projected.x, projected.y, pulse, 0, Math.PI * 2);
        ctxG.strokeStyle = pt.color;
        ctxG.lineWidth = 1;
        ctxG.stroke();
      }
      
      // Core center dot
      ctxG.beginPath();
      ctxG.arc(projected.x, projected.y, 4, 0, Math.PI * 2);
      ctxG.fillStyle = pt.color;
      ctxG.fill();

      // Sleek label text
      ctxG.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctxG.fillStyle = 'var(--text-primary)';
      ctxG.shadowColor = '#FFFFFF';
      ctxG.shadowBlur = 4;
      ctxG.fillText(pt.name, projected.x + 8, projected.y + 3);
      ctxG.shadowBlur = 0; // Reset shadow
    }
  });
}

function globeLoop() {
  if (automaticRotation && !isDragging) {
    rLon += spinSpeed;
  }
  drawGlobeFrame();
  globeAnimId = requestAnimationFrame(globeLoop);
}

// Drag Handlers
canvasG.addEventListener('mousedown', (e) => {
  isDragging = true;
  automaticRotation = false;
  previousMouse = { x: e.clientX, y: e.clientY };
  canvasG.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) {
    // Hover checks
    const rect = canvasG.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    let hoveredId = null;
    for (let pt of globePoints) {
      let projected = projectSpherical(pt.lon, pt.lat, rLat, rLon);
      if (projected.z > 0) {
        let dist = Math.hypot(mx - projected.x, my - projected.y);
        if (dist < 15) {
          hoveredId = pt.id;
          break;
        }
      }
    }
    
    if (hoveredId) {
      if (activeHoverCountry !== hoveredId) {
        activeHoverCountry = hoveredId;
        updateMapCard(countriesData[hoveredId]);
      }
      canvasG.style.cursor = 'pointer';
    } else {
      activeHoverCountry = null;
      canvasG.style.cursor = 'grab';
    }
    return;
  }

  // Handle Drag Spin and Pitch rotation
  const deltaX = e.clientX - previousMouse.x;
  const deltaY = e.clientY - previousMouse.y;
  
  rLon += deltaX * 0.006;
  rLat += deltaY * 0.006;
  
  // Clamp pitch to prevent going upside down
  rLat = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rLat));
  
  previousMouse = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    canvasG.style.cursor = 'grab';
    // Resume auto spin after a delay
    setTimeout(() => {
      if (!isDragging) automaticRotation = true;
    }, 2000);
  }
});

// Auto pause loop when section goes out of viewport
const globeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      globeLoop();
    } else {
      cancelAnimationFrame(globeAnimId);
    }
  });
}, { threshold: 0.15 });
globeObserver.observe(document.getElementById('global-map'));


/* ==========================================================================
   4. ENERGY TRANSITION TABS
   ========================================================================== */
function switchTransitionTab(e, tabId) {
  // Deactivate all tab buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Deactivate all tab content boxes
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));
  
  // Activate selected elements
  e.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}


/* ==========================================================================
   5. VALUE CHAIN FLOWCHART INTERACTION
   ========================================================================== */
const chainData = {
  1: {
    stage: "STAGE 1",
    title: "Geological Exploration",
    desc: "First phase involving satellite hyperspectral imaging, aerial magnetic surveys, and exploratory core drilling. The Geological Survey of India (GSI) has scaled up projects to target deep-seated, concealed critical mineral pegmatites."
  },
  2: {
    stage: "STAGE 2",
    title: "Mining & Extraction",
    desc: "Extraction of critical ores from open-pit or underground mines. These mining projects are capital-intensive, require strict environmental permits, and typically take 10–15 years to develop from initial discovery to commercial operation."
  },
  3: {
    stage: "STAGE 3",
    title: "Beneficiation & Concentration",
    desc: "Mechanical processing of raw ore to remove gangue minerals. Processes like crushing, gravity separation, and froth flotation concentrate low-grade mineral deposits (e.g. converting 1% lithium rock to 6% spodumene concentrate)."
  },
  4: {
    stage: "STAGE 4",
    title: "Chemical Refining & Conversion",
    desc: "Converting mineral concentrates into high-purity battery-grade chemicals (e.g., lithium carbonate/hydroxide, nickel sulfate). This step is highly chemical and energy-intensive, and is currently dominated by China."
  },
  5: {
    stage: "STAGE 5",
    title: "Advanced Manufacturing",
    desc: "Fabrication of processed chemicals into cell electrodes, solid-state batteries, wind turbine permanent magnets, or microchips. Securing domestic cell manufacturing is a major driver of India's PLI incentive schemes."
  },
  6: {
    stage: "STAGE 6",
    title: "Recycling & Urban Mining",
    desc: "Recovering metals from spent battery packs and electronic scrap. Recycling represents a highly secure, local supply loop that generates up to 90% less greenhouse emissions than raw mining operations."
  }
};

function showChainDetail(nodeId) {
  // Remove active from all nodes
  const nodes = document.querySelectorAll('.flow-node');
  nodes.forEach(n => n.classList.remove('active'));
  
  // Add active to selected
  document.getElementById(`node-${nodeId}`).classList.add('active');
  
  // Update detail card
  const data = chainData[nodeId];
  document.getElementById('chain-badge').innerText = data.stage;
  document.getElementById('chain-title').innerText = data.title;
  document.getElementById('chain-desc').innerText = data.desc;
}


/* ==========================================================================
   6. RECYCLING RATE PROGRESS RINGS
   ========================================================================== */
const progressRings = document.querySelectorAll('.ring-fg');

const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const ring = entry.target;
      const percent = parseInt(ring.getAttribute('data-percent'), 10);
      const radius = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      
      const offset = circumference - (percent / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }
  });
}, { threshold: 0.5 });

progressRings.forEach(ring => ringObserver.observe(ring));


/* ==========================================================================
   7. INDIA MAP INTERACTION
   ========================================================================== */
const indiaLocations = {
  jk: {
    title: "Jammu & Kashmir (Salal-Haimana)",
    desc: "In 2023, GSI announced the discovery of 5.9 million tonnes of inferred resources (G3 category) of Lithium ore in Reasi District. This discovery holds significant potential to decrease India's import dependency."
  },
  odisha: {
    title: "Odisha Nickel (Sukinda Valley)",
    desc: "Sukinda Valley holds over 90% of India's chromite and nickel reserves. Nickel is critical for high-performance battery cathodes and specialty stainless steel alloys."
  },
  andhra: {
    title: "Andhra Beach Sands (Nellore & Vizag)",
    desc: "Coastal heavy mineral sand deposits contain rich reserves of monazite, zircon, and rutile, serving as India's primary source for Light Rare Earth Elements (LREEs)."
  },
  arunachal: {
    title: "Arunachal Pradesh Graphite",
    desc: "State accounts for nearly 35% of India's total graphite deposits. Exploration is ongoing to establish commercial mining and processing plants."
  },
  kerala: {
    title: "Kerala Monazite Sands (Chavara)",
    desc: "Chavara deposits contain titanium-bearing minerals (ilmenite, rutile) and monazite, critical for advanced aerospace structures and atomic energy operations."
  }
};

function showIndiaDetail(locId) {
  const data = indiaLocations[locId];
  document.getElementById('ind-title').innerText = data.title;
  document.getElementById('ind-desc').innerText = data.desc;
}


/* ==========================================================================
   8. FILTERABLE 30 MINERALS REGISTER DATA
   ========================================================================== */
const mineralsDataset = [
  { name: "Lithium", symbol: "Li", category: "Battery", import: "100% Imported (Red)", status: "high", sector: "EV Battery Cathodes, Grid Storage", sources: "Chile, Australia, Argentina" },
  { name: "Cobalt", symbol: "Co", category: "Battery", import: "100% Imported (Red)", status: "high", sector: "Aerospace superalloys, NMC battery cathodes", sources: "DRC, China, Finland" },
  { name: "Nickel", symbol: "Ni", category: "Battery", import: "100% Imported (Red)", status: "high", sector: "Stainless steel, EV battery chemistries", sources: "Indonesia, Philippines, Russia" },
  { name: "Graphite", symbol: "C", category: "Battery", import: "High Import (60%)", status: "medium", sector: "Anode material in batteries, steel refractories", sources: "China, Madagascar, Brazil" },
  { name: "Neodymium", symbol: "Nd", category: "REE", import: "High Import (95%)", status: "medium", sector: "Permanent magnets for EV motors & Wind turbines", sources: "China, USA, Myanmar" },
  { name: "Dysprosium", symbol: "Dy", category: "REE", import: "100% Imported (Red)", status: "high", sector: "High-temperature military magnets, sensors", sources: "China, Myanmar" },
  { name: "Gallium", symbol: "Ga", category: "Industrial", import: "100% Imported (Red)", status: "high", sector: "Semiconductors, 5G chips, optoelectronic LEDs", sources: "China, Japan, UK" },
  { name: "Germanium", symbol: "Ge", category: "Industrial", import: "100% Imported (Red)", status: "high", sector: "Fiber optic cables, solar cells, infrared optics", sources: "China, USA, Belgium" },
  { name: "Indium", symbol: "In", category: "Industrial", import: "100% Imported (Red)", status: "high", sector: "Touchscreen displays (ITO), solar panels", sources: "China, South Korea, Canada" },
  { name: "Titanium", symbol: "Ti", category: "Strategic", import: "Low Import / Exporting", status: "low", sector: "Aerospace alloy structures, medical implants", sources: "India (Chavara sands), Australia" },
  { name: "Beryllium", symbol: "Be", category: "Strategic", import: "100% Imported (Red)", status: "high", sector: "Nuclear reactors, aerospace electronics, sensors", sources: "USA, China, Mozambique" },
  { name: "Niobium", symbol: "Nb", category: "Strategic", import: "100% Imported (Red)", status: "high", sector: "Superalloys, structural steel, pipelines", sources: "Brazil, Canada" },
  { name: "Tantalum", symbol: "Ta", category: "Strategic", import: "100% Imported (Red)", status: "high", sector: "Capacitors in electronics, surgical implants", sources: "DRC, Rwanda, Brazil" },
  { name: "Tungsten", symbol: "W", category: "Strategic", import: "High Import (95%)", status: "medium", sector: "Industrial cutting tools, armor-piercing shells", sources: "China, Vietnam, Bolivia" },
  { name: "Vanadium", symbol: "V", category: "Strategic", import: "100% Imported (Red)", status: "high", sector: "Vanadium flow batteries, high-strength alloys", sources: "China, Russia, South Africa" },
  { name: "Platinum", symbol: "Pt", category: "Industrial", import: "High Import (99%)", status: "medium", sector: "Catalysts, hydrogen fuel cell electrodes", sources: "South Africa, Russia" },
  { name: "Palladium", symbol: "Pd", category: "Industrial", import: "High Import (99%)", status: "medium", sector: "Catalytic converters, multilayer capacitors", sources: "South Africa, Russia, Canada" },
  { name: "Antimony", symbol: "Sb", category: "Industrial", import: "High Import (90%)", status: "medium", sector: "Flame retardants, military ammunition", sources: "China, Tajikistan, Turkey" },
  { name: "Bismuth", symbol: "Bi", category: "Industrial", import: "High Import (95%)", status: "medium", sector: "Eco-friendly alloys, pharmaceuticals", sources: "China, Laos" },
  { name: "Selenium", symbol: "Se", category: "Industrial", import: "High Import (85%)", status: "medium", sector: "Solar PV cells, glass manufacturing", sources: "China, Japan, Germany" },
  { name: "Tellurium", symbol: "Te", category: "Industrial", import: "100% Imported (Red)", status: "high", sector: "Cadmium telluride thin-film solar modules", sources: "China, USA, Japan" },
  { name: "Zirconium", symbol: "Zr", category: "Strategic", import: "Low Import / Exporting", status: "low", sector: "Nuclear cladding, high-temp ceramics", sources: "India, Australia, South Africa" },
  { name: "Hafnium", symbol: "Hf", category: "Strategic", import: "100% Imported (Red)", status: "high", sector: "Nuclear control rods, microchip dielectric gates", sources: "France, USA" },
  { name: "Rhenium", symbol: "Re", category: "Strategic", import: "100% Imported (Red)", status: "high", sector: "Jet engine turbine blades, high-octane fuels", sources: "Chile, USA, Poland" },
  { name: "Strontium", symbol: "Sr", category: "Industrial", import: "100% Imported (Red)", status: "high", sector: "Ferrite magnets, pyrotechnics, ceramics", sources: "Spain, China, Mexico" },
  { name: "Molybdenum", symbol: "Mo", category: "Strategic", import: "High Import (95%)", status: "medium", sector: "High-temperature alloy steels, lubricants", sources: "China, Chile, USA" },
  { name: "Cadmium", symbol: "Cd", category: "Industrial", import: "High Import (80%)", status: "medium", sector: "Corrosion-resistant plating, Ni-Cd batteries", sources: "China, South Korea, Japan" },
  { name: "Silicon", symbol: "Si", category: "Industrial", import: "Medium Import (40%)", status: "medium", sector: "Solar wafers, semiconductor chips, alloys", sources: "China, Russia, Norway" },
  { name: "Chromium", symbol: "Cr", category: "Strategic", import: "Low Import / Exporting", status: "low", sector: "Stainless steel corrosion-resistance, plating", sources: "South Africa, India, Turkey" },
  { name: "Manganese", symbol: "Mn", category: "Battery", import: "Low Import / Exporting", status: "low", sector: "Steel alloying, batteries", sources: "South Africa, India, Gabon" }
];

function populateTable(data) {
  const tbody = document.querySelector('#critical-table tbody');
  tbody.innerHTML = '';
  
  data.forEach(m => {
    const tr = document.createElement('tr');
    
    // Check status color class
    let badgeClass = 'badge-risk';
    if (m.status === 'high') badgeClass += ' badge-100';
    else if (m.status === 'medium') badgeClass += ' badge-risk';
    else badgeClass += ' badge-risk';
    
    // Apply status-specific text colors
    let statusStyle = '';
    if (m.status === 'high') statusStyle = 'color: var(--risk-high); background: var(--risk-high-light);';
    else if (m.status === 'medium') statusStyle = 'color: var(--risk-med); background: var(--risk-med-light);';
    else statusStyle = 'color: var(--risk-low); background: var(--risk-low-light);';

    tr.innerHTML = `
      <td><strong>${m.name}</strong></td>
      <td><code>${m.symbol}</code></td>
      <td><span class="min-tag">${m.category}</span></td>
      <td><span class="${badgeClass}" style="${statusStyle}">${m.import}</span></td>
      <td>${m.sector}</td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${m.sources}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Initial Population
populateTable(mineralsDataset);

function filterTable() {
  const searchQuery = document.getElementById('table-search').value.toLowerCase();
  const categoryFilter = document.getElementById('filter-category').value;
  const riskFilter = document.getElementById('filter-risk').value;
  
  const filtered = mineralsDataset.filter(m => {
    // Search match
    const nameMatch = m.name.toLowerCase().includes(searchQuery);
    const symbolMatch = m.symbol.toLowerCase().includes(searchQuery);
    const searchMatch = nameMatch || symbolMatch;
    
    // Category match
    const categoryMatch = (categoryFilter === 'all') || (m.category === categoryFilter);
    
    // Risk match
    const riskMatch = (riskFilter === 'all') || (m.status === riskFilter);
    
    return searchMatch && categoryMatch && riskMatch;
  });
  
  populateTable(filtered);
}


/* ==========================================================================
   9. COLLAPSIBLE BIBLIOGRAPHY ACCORDION
   ========================================================================== */
function toggleAccordion() {
  const accordion = document.getElementById('ref-accordion');
  accordion.classList.toggle('active');
}


/* ==========================================================================
   10. CATEGORY CARD HIGHLIGHT REDIRECT
   ========================================================================== */
function highlightCategory(catName) {
  const filterSelect = document.getElementById('filter-category');
  
  if (catName === 'battery') filterSelect.value = 'Battery';
  else if (catName === 'ree') filterSelect.value = 'REE';
  else if (catName === 'industrial') filterSelect.value = 'Industrial';
  else if (catName === 'strategic') filterSelect.value = 'Strategic';
  
  // Update filters
  filterTable();
  
  // Smooth scroll to register section
  document.getElementById('minerals-table').scrollIntoView({ behavior: 'smooth' });
}
