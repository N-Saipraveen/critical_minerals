import React, { useState, useEffect, useRef } from 'react';
import ThreeGlobe from './components/ThreeGlobe';
import ValueChain from './components/ValueChain';
import IndiaMap from './components/IndiaMap';
import MineralsTable from './components/MineralsTable';
import StatsCounter from './components/StatsCounter';
import MineralsCalculator from './components/MineralsCalculator';
import SupplyChainPlanner from './components/SupplyChainPlanner';
import { ChinaDominanceChart, RecyclingProgressRings } from './components/Charts';

const App = () => {
  const [activeCountry, setActiveCountry] = useState({
    id: "china",
    iso2: "cn",
    name: "China",
    flag: "🇨🇳",
    resource: "Rare Earths & Graphite refining",
    share: "85 - 90% of REE refining, 70% Graphite",
    position: "Monopolistic Supply Bottleneck",
    desc: "China holds absolute processing control over heavy rare earths, crucial for high-performance military radars and electric vehicle traction magnets.",
    badge: "Strategic Choke Point",
    color: "#C89312"
  });

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showBibliography, setShowBibliography] = useState(false);
  const [worldSvgContent, setWorldSvgContent] = useState('');

  const tableRef = useRef(null);
  const latticeCanvasRef = useRef(null);

  // Fetch KABIL world map SVG
  useEffect(() => {
    fetch('/world.svg')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load world map');
        return res.text();
      })
      .then(text => {
        const svgStart = text.indexOf('<svg');
        if (svgStart !== -1) {
          setWorldSvgContent(text.substring(svgStart));
        } else {
          setWorldSvgContent(text);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Canvas Crystal Lattice particle animation
  useEffect(() => {
    const canvas = latticeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 40;
    const connectionDistance = 120;
    let mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    const heroEl = document.getElementById('hero');
    heroEl.addEventListener('mousemove', handleMouseMove);
    heroEl.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 3 + 1.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx / dist * force * 1.2;
            this.y -= dy / dist * force * 1.2;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#6B0F1A';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.hypot(dx, dy);
          if (dist < connectionDistance) {
            let alpha = (connectionDistance - dist) / connectionDistance * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 160, 23, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          render();
        } else {
          cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(heroEl);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      heroEl.removeEventListener('mousemove', handleMouseMove);
      heroEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleCategoryClick = (catName) => {
    setCategoryFilter(catName);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getMapCardBorderColor = (name) => {
    if (name === "China") return "var(--risk-high)";
    if (name === "India") return "var(--maroon)";
    return "var(--teal)";
  };

  const handleMouseMoveTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8; // Max 8 deg
    const rotateY = ((centerX - x) / centerX) * 8; // Max 8 deg
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = 'var(--shadow-lg)';
  };

  const handleMouseLeaveTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = 'var(--shadow-sm)';
  };

  return (
    <div className="react-root-layout">
      {/* ==========================================================================
           HEADER / NAVIGATION
           ========================================================================== */}
      <header>
        <div className="container nav-container">
          <div className="logo-block">
            <img src="assets/osmania_university_logo.png" alt="Osmania University Logo" id="nav-logo" />
            <div className="brand-text">
              <span className="brand-title">Critical Minerals Portal</span>
              <span className="brand-dept">Mining Engineering • Osmania University</span>
            </div>
          </div>
          <nav>
            <ul>
              <li><a href="#abstract">Summary</a></li>
              <li><a href="#global-map">Global Map</a></li>
              <li><a href="#supply-chain">Value Chain</a></li>
              <li><a href="#geopolitical-planner">Planner</a></li>
              <li><a href="#interactive-calculator">Calculator</a></li>
              <li><a href="#india-strategy">India's Strategy</a></li>
              <li><a href="#minerals-table">Database</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ==========================================================================
           1. HERO / LANDING SECTION
           ========================================================================== */}
      <section className="hero-section" id="hero">
        <div className="hero-background-img" style={{ backgroundImage: "url('assets/osmania_arts_college.png')" }}></div>
        <canvas ref={latticeCanvasRef} id="canvas-lattice"></canvas>
        
        <div className="hero-content reveal">
          <span className="hero-tag">B.E. Major Project Report Presentation</span>
          <h1 className="hero-title" id="animated-hero-title">
            <span>Critical</span> <span>Minerals:</span> <br />
            <span>A</span> <span>Global</span> <span>Overview</span> <span>and</span> <br />
            <span>India's</span> <span>Strategic</span> <span>Perspective</span>
          </h1>
          
          <p className="hero-subtitle">
            Department of Mining Engineering • University College of Engineering (Autonomous) <br />
            <strong>Osmania University, Hyderabad</strong>
          </p>

          <div className="hero-meta">
            <div className="meta-group">
              <div className="meta-label">Submitted By</div>
              <div className="meta-val">G. Rohan | M. Hemanth Rao | N. Karthik</div>
            </div>
            <div className="meta-group">
              <div className="meta-label">Supervisor</div>
              <div className="meta-val">Dr. K. V. Shankar (Chair Professor)</div>
            </div>
          </div>

          <div className="scroll-cta" onClick={() => document.getElementById('abstract').scrollIntoView({ behavior: 'smooth' })}>
            <span>Scroll to Explore Report</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           2. ABSTRACT / EXECUTIVE SUMMARY
           ========================================================================== */}
      <section className="section" id="abstract">
        <div className="container">
          <div className="abstract-layout">
            <div className="reveal">
              <blockquote className="abstract-quote">
                "Critical minerals are the bedrock of the 21st-century technology and clean energy revolution. Ensuring their secure supply is no longer just a mining challenge—it is a geopolitical imperative."
              </blockquote>
              <div className="abstract-body">
                <p>
                  This report examines the global landscape of <strong>Critical Minerals</strong>—essential minerals with high economic importance and significant supply chain vulnerability. As the world transitions from a fossil-fuel-intensive energy system to a mineral-intensive clean energy system, demand for lithium, cobalt, nickel, and rare earth elements is projected to skyrocket.
                </p>
                <p>
                  We analyze global production concentrations, supply chain vulnerabilities, environmental impacts, and India's position, specifically outlining the policy implications of India's newly identified 30 critical minerals and the National Critical Mineral Mission.
                </p>
              </div>
            </div>

            <div className="stats-grid reveal">
              <div className="stat-pill">
                <StatsCounter target={30} />
                <span className="stat-label">Critical Minerals Identified by India</span>
              </div>
              <div className="stat-pill">
                <StatsCounter target={40} suffix="×" />
                <span className="stat-label">Lithium Demand Increase by 2040</span>
              </div>
              <div className="stat-pill">
                <StatsCounter target={6} suffix="×" />
                <span className="stat-label">More Minerals Needed for EV vs ICE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           3. WHAT ARE CRITICAL MINERALS? & TIMELINE
           ========================================================================== */}
      <section className="section section-bg-alt" id="what-are-they">
        <div className="container">
          <h2>What are Critical Minerals?</h2>
          
          <div className="two-column-editorial reveal">
            <div>
              <h3 className="serif-sub">The Definition of Criticality</h3>
              <p>
                A mineral is classified as <strong>critical</strong> when it plays an indispensable role in key economic sectors, has no viable substitutes, and faces substantial risk of supply disruption. Unlike general industrial commodities (like iron ore or coal), critical minerals are typically produced in small volumes with highly concentrated supply chains.
              </p>
              <p>
                The criticality status of any mineral is not static. It shifts dynamically based on technological breakthroughs, geopolitical alliances, trade policies, and geological discoveries.
              </p>
            </div>

            <div className="criteria-grid">
              <div className="criteria-card">
                <div className="criteria-icon-box">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <div>
                  <h4>1. Economic Importance</h4>
                  <p>Crucial for core national infrastructure, defense equipment, high-tech manufacturing, and clean energy transition technologies.</p>
                </div>
              </div>

              <div className="criteria-card">
                <div className="criteria-icon-box">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <div>
                  <h4>2. Supply Disruption Risk</h4>
                  <p>Concentrated production in a few countries, trade limitations, geopolitical instability, or resource nationalism.</p>
                </div>
              </div>

              <div className="criteria-card">
                <div className="criteria-icon-box">
                  <svg viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.306 9H18" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <div>
                  <h4>3. Limited Substitutability</h4>
                  <p>No cost-effective or technologically equivalent alternatives exist to replace the mineral's unique physical/chemical properties.</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="timeline-title">The Evolution of Critical Mineral Policies</h3>
          <div className="timeline-container reveal">
            <div className="timeline-line"></div>
            
            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-date">2008</div>
              <div className="timeline-card">
                <h4>US NRC Framework</h4>
                <p>The US National Research Council publishes the first formal criticality matrix, defining the axes of economic importance and supply risk.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-date">2011</div>
              <div className="timeline-card">
                <h4>First EU Criticality List</h4>
                <p>The European Commission releases its first list containing 14 critical raw materials to protect industrial competitiveness.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-date">2018</div>
              <div className="timeline-card">
                <h4>USGS 35 Mineral List</h4>
                <p>United States Geological Survey drafts a list of 35 minerals critical to US national security and economic output.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-date">2022</div>
              <div className="timeline-card">
                <h4>EU Critical Raw Materials Act</h4>
                <p>The EU introduces strict mandates for domestic extraction (10%), refining (40%), and recycling (15%) by 2030.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-date">2023</div>
              <div className="timeline-card">
                <h4>India Identifies 30 Minerals</h4>
                <p>Ministry of Mines publishes India's first official list of 30 critical minerals to secure supply chains for domestic manufacturing.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge"></div>
              <div className="timeline-date">2025</div>
              <div className="timeline-card">
                <h4>National Critical Mineral Mission</h4>
                <p>India establishes the NCMM to institutionalize stockpile management, international partnerships, and R&D.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           4. CLASSIFICATION — THE 4 CATEGORIES
           ========================================================================== */}
      <section className="section" id="classification">
        <div className="container">
          <h2>Classification: The Four Key Categories</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            Critical minerals are broadly categorized by their primary industrial applications, showing distinct market dynamics, pricing models, and geopolitical concerns.
          </p>

          <div className="categories-quadrant reveal">
            {/* Category 1 */}
            <div 
              className="category-card" 
              onClick={() => handleCategoryClick('Battery')}
              onMouseMove={handleMouseMoveTilt}
              onMouseLeave={handleMouseLeaveTilt}
              style={{ transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="category-header" style={{ transform: 'translateZ(20px)' }}>
                <div className="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M23 12h-2m-13 0H6m15-4v8c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h11c1.1 0 2 .9 2 2z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <h3>Battery & Energy Minerals</h3>
              </div>
              <p style={{ transform: 'translateZ(10px)' }}>Essential for energy storage systems, batteries, and electric grid storage. These minerals drive the clean energy transition and experience the fastest growth in demand.</p>
              <div className="category-minerals" style={{ transform: 'translateZ(15px)' }}>
                <div className="minerals-list">
                  <span className="min-tag">Lithium</span>
                  <span className="min-tag">Cobalt</span>
                  <span className="min-tag">Nickel</span>
                  <span className="min-tag">Graphite</span>
                  <span className="min-tag">Manganese</span>
                </div>
              </div>
            </div>

            {/* Category 2 */}
            <div 
              className="category-card" 
              onClick={() => handleCategoryClick('REE')}
              onMouseMove={handleMouseMoveTilt}
              onMouseLeave={handleMouseLeaveTilt}
              style={{ transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="category-header" style={{ transform: 'translateZ(20px)' }}>
                <div className="category-icon">
                  <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" strokeWidth="2" fill="none"/><polygon points="2 17 12 22 22 17" stroke="currentColor" strokeWidth="2" fill="none"/><polygon points="2 12 12 17 22 12" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <h3>Rare Earth Elements (REE)</h3>
              </div>
              <p style={{ transform: 'translateZ(10px)' }}>A group of 17 chemical elements in the periodic table (lanthanides plus scandium and yttrium) crucial for high-performance permanent magnets used in wind turbines, EV motors, and electronic displays.</p>
              <div className="category-minerals" style={{ transform: 'translateZ(15px)' }}>
                <div className="minerals-list">
                  <span className="min-tag">Neodymium</span>
                  <span className="min-tag">Dysprosium</span>
                  <span className="min-tag">Praseodymium</span>
                  <span className="min-tag">Terbium</span>
                  <span className="min-tag">Yttrium</span>
                </div>
              </div>
            </div>

            {/* Category 3 */}
            <div 
              className="category-card" 
              onClick={() => handleCategoryClick('Industrial')}
              onMouseMove={handleMouseMoveTilt}
              onMouseLeave={handleMouseLeaveTilt}
              style={{ transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="category-header" style={{ transform: 'translateZ(20px)' }}>
                <div className="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <h3>Industrial High-Tech Minerals</h3>
              </div>
              <p style={{ transform: 'translateZ(10px)' }}>Minerals needed for advanced microchips, semiconductors, photovoltaics, and aerospace alloy manufacturing. Often byproduct minerals with complex extraction processes.</p>
              <div className="category-minerals" style={{ transform: 'translateZ(15px)' }}>
                <div className="minerals-list">
                  <span className="min-tag">Silicon</span>
                  <span className="min-tag">Gallium</span>
                  <span className="min-tag">Germanium</span>
                  <span className="min-tag">Indium</span>
                  <span className="min-tag">Platinum Group</span>
                </div>
              </div>
            </div>

            {/* Category 4 */}
            <div 
              className="category-card" 
              onClick={() => handleCategoryClick('Strategic')}
              onMouseMove={handleMouseMoveTilt}
              onMouseLeave={handleMouseLeaveTilt}
              style={{ transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="category-header" style={{ transform: 'translateZ(20px)' }}>
                <div className="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                </div>
                <h3>Strategic & Defence Minerals</h3>
              </div>
              <p style={{ transform: 'translateZ(10px)' }}>Critical for armor plating, missile guidance systems, radar components, and lightweight high-strength aerospace structures. Directly linked to national sovereignty.</p>
              <div className="category-minerals" style={{ transform: 'translateZ(15px)' }}>
                <div className="minerals-list">
                  <span className="min-tag">Titanium</span>
                  <span className="min-tag">Beryllium</span>
                  <span className="min-tag">Tantalum</span>
                  <span className="min-tag">Tungsten</span>
                  <span className="min-tag">Niobium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           5. GLOBAL DISTRIBUTION — INTERACTIVE 3D GLOBE
           ========================================================================== */}
      <section className="section section-bg-alt" id="global-map">
        <div className="container">
          <h2>Global Distribution: Production Hotspots</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            Critical mineral reserves and production are highly concentrated geographically. Orbit the interactive 3D Globe and hover over nodes to explore global supply dynamics.
          </p>

          <div className="map-layout">
            {/* Custom Stylized 3D WebGL Globe */}
            <div className="map-wrapper reveal globe-outer-container">
              <ThreeGlobe activeCountry={activeCountry} onSelectCountry={setActiveCountry} />
            </div>

            {/* Detail Display Card */}
            <div className="map-card-sticky reveal" style={{ borderColor: getMapCardBorderColor(activeCountry.name) }}>
              <div className="map-card-header">
                <span className="country-title">{activeCountry.name}</span>
                <span className="country-flag">{activeCountry.flag}</span>
              </div>
              
              <div className="map-data-row">
                <span className="map-data-label">Key Resource:</span>
                <span className="map-data-val">{activeCountry.resource}</span>
              </div>
              <div className="map-data-row">
                <span className="map-data-label">Global Production Share:</span>
                <span className="map-data-val">{activeCountry.share}</span>
              </div>
              <div className="map-data-row">
                <span className="map-data-label">Market Position:</span>
                <span className="map-data-val">{activeCountry.position}</span>
              </div>
              
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {activeCountry.desc}
              </p>

              <span 
                className="map-mineral-badge" 
                style={{ 
                  background: activeCountry.name === "China" ? "var(--risk-high-light)" : activeCountry.name === "India" ? "var(--maroon-light)" : "var(--teal-light)",
                  color: activeCountry.name === "China" ? "var(--risk-high)" : activeCountry.name === "India" ? "var(--maroon)" : "var(--teal)"
                }}
              >
                {activeCountry.badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           6. CHINA'S DOMINANCE — SUPPLY RISK
           ========================================================================== */}
      <section className="section" id="china-dominance">
        <div className="container">
          <div className="dominance-grid reveal">
            <div className="dominance-narrative">
              <h2 style={{ textAlign: 'left', marginBottom: '1rem' }}>China's Stranglehold on Refining</h2>
              <div className="dominance-stat">
                <span>85–90%</span> <br />
                of Rare Earth Refining
              </div>
              <p>
                While mining reserves are dispersed globally, the true bottleneck lies in <strong>processing and refining</strong>. China has spent three decades building downstream dominance by maintaining low environmental standards and offering massive state subsidies.
              </p>
              <p>
                This concentration creates an asymmetric risk profile. A single export restriction or geopolitical conflict could immediately halt major Western semiconductor, defense, and electric vehicle production.
              </p>
            </div>
            <ChinaDominanceChart />
          </div>
        </div>
      </section>

      {/* ==========================================================================
           7. GEOPOLITICAL PLANNER (NEW TOP FEATURE)
           ========================================================================== */}
      <SupplyChainPlanner />

      {/* ==========================================================================
           7.5 INTERACTIVE CALCULATOR
           ========================================================================== */}
      <MineralsCalculator />

      {/* Parallax Section Transition */}
      <div className="parallax-divider" style={{ backgroundImage: "url('assets/collage.jpeg')" }}>
        <div className="parallax-content">
          <h3>The Supply Chain Bottleneck</h3>
          <p>From deep geological deposits to end-user high-tech manufacturing.</p>
        </div>
      </div>

      {/* ==========================================================================
           8. SUPPLY CHAIN CHALLENGES
           ========================================================================== */}
      <section className="section" id="supply-chain">
        <div className="container">
          <h2>Critical Mineral Value Chain</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }} className="reveal">
            Understanding the steps from mine exploration to industrial manufacturing, highlighting India's developmental focus areas.
          </p>

          <ValueChain />

          {/* Recent Event Box */}
          <div className="recent-event-box reveal">
            <span className="event-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: 'var(--maroon)' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <div>
              <strong>Recent Geopolitical Event (2023):</strong> China restricted exports of gallium and germanium—vital elements for optoelectronics and high-performance radar chips—as a counter-response to Western trade sanctions.
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           9. ENVIRONMENT & ETHICS
           ========================================================================== */}
      <section className="section section-bg-alt" id="ethics">
        <div className="container">
          <h2>Environment, Ethics & Governance</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            Critical mineral extraction leaves significant environmental footprints and raises severe humanitarian concerns that demand rigid ESG frameworks.
          </p>

          <div className="impact-pathway reveal">
            <div className="impact-node">
              <div className="impact-node-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
              </div>
              <h4>Land</h4>
              <p>Open-pit mining causes massive deforestation and habitat destruction.</p>
            </div>
            <div className="impact-node">
              <div className="impact-node-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>
              </div>
              <h4>Water</h4>
              <p>Lithium brine extraction in Chile consumes millions of liters of local groundwater.</p>
            </div>
            <div className="impact-node">
              <div className="impact-node-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
              </div>
              <h4>Air</h4>
              <p>High-energy refining and smelting release heavy sulfur dioxide emissions.</p>
            </div>
            <div className="impact-node">
              <div className="impact-node-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7 7 0 0 1-9 10Z"/><path d="M19 2c-2.26 4.33-5.27 7.14-8 8"/></svg>
              </div>
              <h4>Biodiversity</h4>
              <p>Tailings leaks pollute local rivers, wiping out aquatic ecosystems.</p>
            </div>
          </div>

          <div className="ethical-callout reveal">
            <div className="ethics-graphic">
              <div className="ethics-graphic-stat">70%</div>
              <p>of Global Cobalt from DRC</p>
            </div>
            <div>
              <h3>The Human Cost: Cobalt Mining in the DRC</h3>
              <p>
                Approximately 70% of the world's cobalt is extracted in the Democratic Republic of Congo (DRC). Of this, roughly 15–20% comes from informal, "artisanal" small-scale mines.
              </p>
              <p>
                Tens of thousands of miners, including children, work in hazardous conditions without protective gear, facing chronic lung diseases, tunnel collapses, and extreme exploitation. Addressing battery supply chain ethics requires robust mineral traceability systems (like blockchain tracing) and institutional audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           10. RECYCLING & CIRCULAR ECONOMY
           ========================================================================== */}
      <section className="section" id="recycling">
        <div className="container">
          <h2>Recycling & Circular Economy</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            Reducing supply dependence requires transition from a linear "extract-use-dispose" model to a closed-loop recycling infrastructure.
          </p>

          <RecyclingProgressRings />

          {/* India Opportunity Callout */}
          <div className="reveal" style={{ background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: '16px', padding: '2.5rem' }}>
            <h3 style={{ color: 'var(--teal)', marginBottom: '1rem' }}>Urban Mining: India's Great Opportunity</h3>
            <p>
              India's <strong>Battery Waste Management Rules 2022</strong> introduced Extended Producer Responsibility (EPR) mandates, forcing EV battery manufacturers to meet strict recovery targets. This has catalyzed the growth of local urban mining startup players (e.g., Attero Recycling, Lohum Cleantech, Tata Chemicals) specializing in hydrometallurgical recycling to recover high-purity lithium, cobalt, and nickel salts.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           11. INDIA — THE STRATEGIC PICTURE
           ========================================================================== */}
      <section className="section section-bg-alt" id="india-strategy">
        <div className="container">
          <h2>India's Strategic Perspective</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            India faces structural supply vulnerabilities, running near-100% import dependency for critical clean-energy inputs. Click hotspots on the map to explore.
          </p>

          <IndiaMap />
        </div>
      </section>

      {/* ==========================================================================
           12. NATIONAL CRITICAL MINERAL MISSION (NCMM)
           ========================================================================== */}
      <section className="section" id="ncmm">
        <div className="container">
          <h2>National Critical Mineral Mission (NCMM)</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }} className="reveal">
            India's multi-pronged institutional framework designed to guarantee mineral security and support the domestic manufacturing revolution.
          </p>

          <div className="ncmm-hexagon-container reveal">
            <div className="ncmm-card">
              <div className="ncmm-num">01</div>
              <h4>Domestic Exploration</h4>
              <p>Accelerating GSI's target surveys, mapping over 1,200 prospects from 2024–31 focusing on deep-seated critical minerals.</p>
            </div>
            <div className="ncmm-card">
              <div className="ncmm-num">02</div>
              <h4>Strategic Stockpiling</h4>
              <p>Setting up institutional national stockpiles (under mineral security directives) to offset sudden geopolitical supply disruptions.</p>
            </div>
            <div className="ncmm-card">
              <div className="ncmm-num">03</div>
              <h4>International Joint Ventures</h4>
              <p>Acquiring overseas mining concessions through KABIL (Khanij Bidesh India Ltd) in resource-rich nations like Argentina & Australia.</p>
            </div>
            <div className="ncmm-card">
              <div className="ncmm-num">04</div>
              <h4>Recycling & EPR</h4>
              <p>Enforcing strict recovery targets for lithium batteries and urban mining schemes to integrate secondary scrap materials.</p>
            </div>
            <div className="ncmm-card">
              <div className="ncmm-num">05</div>
              <h4>Academic & R&D Funding</h4>
              <p>Investing in IITs, CSIR labs, and mining departments to develop low-cost hydrometallurgical refining and bio-leaching tech.</p>
            </div>
            <div className="ncmm-card">
              <div className="ncmm-num">06</div>
              <h4>Downstream Incentives</h4>
              <p>Linking supply chain security to Production Linked Incentives (PLI) for advanced chemistry batteries and solar panels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           13. KABIL & INTERNATIONAL COOPERATION
           ========================================================================== */}
      <section className="section section-bg-alt" id="kabil">
        <div className="container">
          <h2>International Cooperation & KABIL</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            India is actively building international diplomatic ties and joint ventures to secure mineral access.
          </p>

          <div className="kabil-map-box reveal">
            {worldSvgContent ? (
              <div className="kabil-svg-container">
                <div 
                  dangerouslySetInnerHTML={{ __html: worldSvgContent }} 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                
                {/* Absolute-congruent SVG Overlay for arcs, hub pulses and vector labels */}
                <svg 
                  viewBox="30.767 241.591 784.077 458.627" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
                >
                  {/* India to USA Arc */}
                  <path d="M 601.86,472.57 Q 397.59,345.81 193.32,419.05" className="kabil-arc" />
                  
                  {/* India to France/EU Arc */}
                  <path d="M 601.86,472.57 Q 499.43,441.94 397.00,491.32" className="kabil-arc" />
                  
                  {/* India to Argentina Arc */}
                  <path d="M 601.86,472.57 Q 431.73,557.30 261.60,642.04" className="kabil-arc" />
                  
                  {/* India to Australia Arc */}
                  <path d="M 601.86,472.57 Q 660.18,548.07 718.51,623.58" className="kabil-arc" />
                  
                  {/* Pulsing halos and solid pin dots */}
                  {/* India Hub */}
                  <circle cx="601.86" cy="472.57" r="10" className="kabil-pulse-circle hub" />
                  <circle cx="601.86" cy="472.57" r="4" className="kabil-pin-dot" />

                  {/* USA Partner */}
                  <circle cx="193.32" cy="419.05" r="8" className="kabil-pulse-circle" />
                  <circle cx="193.32" cy="419.05" r="3.5" className="kabil-pin-dot partner" />

                  {/* France Partner (EU) */}
                  <circle cx="397.00" cy="491.32" r="8" className="kabil-pulse-circle" />
                  <circle cx="397.00" cy="491.32" r="3.5" className="kabil-pin-dot partner" />

                  {/* Argentina Partner */}
                  <circle cx="261.60" cy="642.04" r="8" className="kabil-pulse-circle" />
                  <circle cx="261.60" cy="642.04" r="3.5" className="kabil-pin-dot partner" />

                  {/* Australia Partner */}
                  <circle cx="718.51" cy="623.58" r="8" className="kabil-pulse-circle" />
                  <circle cx="718.51" cy="623.58" r="3.5" className="kabil-pin-dot partner" />

                  {/* Clean vector labels */}
                  <text x="601.86" y="458.57" className="kabil-label hub-label">India (KABIL Hub)</text>
                  <text x="193.32" y="405.05" className="kabil-label">USA (MSP)</text>
                  <text x="397.00" y="477.32" className="kabil-label">EU (TTC)</text>
                  <text x="261.60" y="628.04" className="kabil-label">Argentina</text>
                  <text x="718.51" y="609.58" className="kabil-label">Australia</text>
                </svg>
              </div>
            ) : (
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Loading global partnership map...
              </div>
            )}
          </div>

          <div className="kabil-cards-grid reveal">
            <div className="kabil-card">
              <span className="kabil-partner">🇦🇷 Argentina Agreement</span>
              <p><strong>Focus:</strong> Lithium brine exploration.</p>
              <p>KABIL secured exploration rights for five lithium brine blocks in Catamarca Province, investing $24 million to establish domestic equity stakes.</p>
            </div>
            <div className="kabil-card">
              <span className="kabil-partner">🇦🇺 Australia Partnership</span>
              <p><strong>Focus:</strong> Lithium & Cobalt hard-rock deposits.</p>
              <p>Co-investing $6 million in exploratory pipelines to identify hard-rock lithium deposits in Western Australia for priority supply channels.</p>
            </div>
            <div className="kabil-card">
              <span className="kabil-partner">🌐 Mineral Security Partnership (MSP)</span>
              <p><strong>Focus:</strong> Multilateral security alliances.</p>
              <p>India joined the US-led MSP in 2023, collaborating alongside 13 other nations to build alternative, China-free processing chains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           14. INDIA'S 30 CRITICAL MINERALS — COMPLETE TABLE
           ========================================================================== */}
      <MineralsTable 
        ref={tableRef} 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter} 
      />

      {/* ==========================================================================
           15. POLICY COMPARISON — GLOBAL BENCHMARKS
           ========================================================================== */}
      <section className="section section-bg-alt" id="policy-benchmarks">
        <div className="container">
          <h2>Global Policy Benchmarks</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            A comparative breakdown of how major global economies frame their critical mineral policies.
          </p>

          <div className="policy-grid reveal">
            <div className="policy-card">
              <span className="policy-nation">🇺🇸 USA</span>
              <h4>Inflation Reduction Act (IRA 2022)</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                <strong>Minerals Listed:</strong> 50 Minerals <br />
                <strong>Key Instruments:</strong> Massive tax credits ($7,500 EV credit) conditioned on sourcing minerals from Free Trade Agreement (FTA) partners.
              </p>
            </div>

            <div className="policy-card">
              <span className="policy-nation">🇪🇺 European Union</span>
              <h4>Critical Raw Materials Act (CRMA)</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                <strong>Minerals Listed:</strong> 34 Minerals <br />
                <strong>Key Instruments:</strong> Strict mandates. Requires 10% domestic extraction, 40% domestic processing, and 15% recycling rates by 2030.
              </p>
            </div>

            <div className="policy-card">
              <span className="policy-nation">🇦🇺 Australia</span>
              <h4>Critical Minerals Strategy</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                <strong>Minerals Listed:</strong> 31 Minerals <br />
                <strong>Key Instruments:</strong> Focuses on positioning as a secure, ethical producer. Backed by a $2 billion critical minerals loan facility.
              </p>
            </div>

            <div className="policy-card highlighted">
              <span className="policy-nation">🇮🇳 India</span>
              <h4>National Critical Mineral Mission</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                <strong>Minerals Listed:</strong> 30 Minerals <br />
                <strong>Key Instruments:</strong> Outlines domestic bidding blocks (e.g. J&K Lithium blocks), KABIL overseas joint ventures, and customs duty exemptions on imports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           16. FUTURE OUTLOOK & RECOMMENDATIONS
           ========================================================================== */}
      <section className="section" id="future-outlook">
        <div className="container">
          <h2>Future Outlook & Recommendations</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }} className="reveal">
            Strategic policy roadmap and technical recommendations to achieve absolute critical mineral security for India.
          </p>

          <div className="recs-list reveal">
            <div className="rec-item">
              <div className="rec-num">01</div>
              <div>
                <h4>Establish a National stockpiling agency</h4>
                <p>Model stockpile plans after Japan's JOGMEC framework, maintaining a rolling 60–90 day industrial reserve of highly vulnerable minerals like cobalt and heavy rare earths.</p>
              </div>
            </div>
            <div className="rec-item">
              <div className="rec-num">02</div>
              <div>
                <h4>Incentivize domestic recycling technologies</h4>
                <p>Introduce green capital subsidies and tax exemptions for battery-waste hydrometallurgical recycling plants to jump-start urban mining.</p>
              </div>
            </div>
            <div className="rec-item">
              <div className="rec-num">03</div>
              <div>
                <h4>Scale up bilateral mineral diplomacy</h4>
                <p>Accelerate acquisitions under KABIL in Argentina, Chile, and Australia, while joining strategic global processing coalitions.</p>
              </div>
            </div>
            <div className="rec-item">
              <div className="rec-num">04</div>
              <div>
                <h4>Deploy Advanced Geophysical & Hyperspectral Exploration</h4>
                <p>Utilize high-resolution satellite hyperspectral remote sensing data and airborne magnetic surveys to detect deep-seated pegmatites and reduce exploration risk.</p>
              </div>
            </div>
          </div>

          <div className="cinematic-quote reveal">
            <blockquote className="cinematic-quote-text">
              "The resource security of today determines the industrial sovereignty of tomorrow."
            </blockquote>
            <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)' }}>
              — Department of Mining Engineering, Osmania University
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           17. CREDITS / ACADEMIC FOOTER
           ========================================================================== */}
      <footer id="about">
        <div className="container">
          <div className="footer-top">
            <img src="assets/osmania_university_logo.png" alt="Osmania University Logo" className="footer-logo" />
            <div className="footer-dept">Department of Mining Engineering</div>
            <div className="footer-inst">University College of Engineering (Autonomous)<br />Osmania University, Hyderabad</div>
          </div>

          <div className="footer-grid">
            <div className="credits-block">
              <h4>Project Authors</h4>
              <div className="author-item">
                <span className="author-name">Gundu Rohan</span>
                <span className="author-roll">1005-22-807011</span>
              </div>
              <div className="author-item">
                <span className="author-name">Medi Hemanth Rao</span>
                <span className="author-roll">1005-22-807018</span>
              </div>
              <div className="author-item">
                <span className="author-name">Nandipaka Karthik</span>
                <span className="author-roll">1005-22-807025</span>
              </div>
            </div>

            <div className="credits-block">
              <h4>Project Supervisor</h4>
              <p style={{ marginBottom: '0.5rem' }}><strong>Dr. K. V. Shankar</strong></p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                Professor & Chair Professor <br />
                Department of Mining Engineering <br />
                UCE (A), Osmania University
              </p>
            </div>
          </div>

          {/* Bibliography Accordion */}
          <div className={`references-accordion ${showBibliography ? 'active' : ''}`} id="ref-accordion">
            <div className="accordion-header" onClick={() => setShowBibliography(!showBibliography)}>
              Academic References & Bibliography
            </div>
            <div className="accordion-body">
              <div className="ref-item">
                1. International Energy Agency (IEA), (2021). <em>The Role of Critical Minerals in Clean Energy Transitions</em>. World Energy Outlook Special Report.
              </div>
              <div className="ref-item">
                2. Ministry of Mines, Government of India, (2023). <em>Critical Minerals for India: Report of the Committee on Identification of Critical Minerals</em>.
              </div>
              <div className="ref-item">
                3. U.S. Geological Survey (USGS), (2022). <em>Methodology and Technical Input for the 2021 Draft List of Critical Minerals</em>. Open-File Report.
              </div>
              <div className="ref-item">
                4. European Commission, (2023). <em>European Critical Raw Materials Act</em>. Brussels, COM(2023) 160.
              </div>
              <div className="ref-item">
                5. G. Rohan, M. Hemanth Rao, N. Karthik (2026). <em>Critical Minerals: A Global Overview and India's Strategic Perspective</em>. B.E. Major Project Report, Osmania University.
              </div>
            </div>
          </div>

          <div className="footer-bottom" style={{ marginTop: '4rem' }}>
            <p>&copy; 2026 Department of Mining Engineering, Osmania University. All rights reserved.</p>
            <p style={{ fontSize: 0.75 + 'rem', marginTop: 0.5 + 'rem', opacity: 0.7 }}>Developed for Major Project Evaluation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
