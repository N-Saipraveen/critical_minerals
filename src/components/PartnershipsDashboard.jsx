import React, { useState, useEffect, useRef } from 'react';

const PARTNERSHIP_DATA = {
  ar: {
    id: "ar",
    name: "Argentina Agreement",
    flag: "🇦🇷",
    type: "Equity Joint Venture (KABIL)",
    status: "Active Exploration Phase",
    minerals: "Lithium (Li) Brines",
    funding: "$24 Million USD",
    detail: "KABIL secured exclusive exploration and mining rights for five lithium brine blocks in Catamarca Province. India is establishing regional offices and importing advanced extraction systems to process raw brine resources directly.",
    relevance: "Establishes a dedicated, government-secured lithium supply channel to support India's domestic battery manufacturing schemes.",
    color: "#D4A017",
    arcPath: "M 601.86,472.57 Q 431.73,557.30 261.60,642.04",
    cx: 261.60,
    cy: 642.04
  },
  au: {
    id: "au",
    name: "Australia Partnership",
    flag: "🇦🇺",
    type: "Co-Investment Exploration JV",
    status: "Resource Verification Phase",
    minerals: "Lithium, Cobalt (Pegmatites & Hard-rock)",
    funding: "$6 Million USD (Initial)",
    detail: "Joint investment in exploratory pipelines in Western Australia. Focuses on securing high-purity raw spodumene ore and cobalt byproducts from stable allied mining nodes.",
    relevance: "Bypasses geographic supply concentration in non-aligned refining centers by establishing secure shipping channels.",
    color: "#9E4E59",
    arcPath: "M 601.86,472.57 Q 660.18,548.07 718.51,623.58",
    cx: 718.51,
    cy: 623.58
  },
  us: {
    id: "us",
    name: "Minerals Security Partnership (MSP)",
    flag: "🇺🇸",
    type: "Multilateral Strategic Coalition",
    status: "Active Collaboration",
    minerals: "Full Critical Minerals Spectrum (REE, Cobalt, Lithium, Nickel)",
    funding: "Institutional Alignment & Trade Guarantees",
    detail: "India joined the US-led MSP in 2023 alongside 13 other nations. The coalition coordinates public finances and fast-tracks regulatory approvals to build clean, independent downstream supply networks.",
    relevance: "Enables India to share risk on multi-billion dollar mining acquisitions and gain access to state-of-the-art chemical refining designs.",
    color: "#1A7A7A",
    arcPath: "M 601.86,472.57 Q 397.59,345.81 193.32,419.05",
    cx: 193.32,
    cy: 419.05
  },
  eu: {
    id: "eu",
    name: "EU-India Trade & Tech Council (TTC)",
    flag: "🇪🇺",
    type: "Strategic Bilateral Forum",
    status: "Active Policy Exchange",
    minerals: "Neodymium, Dysprosium, Battery Scrap",
    funding: "Joint R&D Funding Schemes",
    detail: "Focuses on recycling standards, circular economy guidelines, and technical exchanges regarding rare-earth magnet substitutions and industrial battery waste recovery.",
    relevance: "Assists India in developing advanced urban mining systems, reducing primary dependency on raw ore imports.",
    color: "#3D5E8C",
    arcPath: "M 601.86,472.57 Q 499.43,441.94 397.00,491.32",
    cx: 397.00,
    cy: 491.32
  },
  cl: {
    id: "cl",
    name: "Chile Cooperation MoU",
    flag: "🇨🇱",
    type: "Bilateral Resource Trade Protocol",
    status: "Signed / Active Exploration",
    minerals: "Copper (Cu), Lithium (Li)",
    funding: "Trade Tariff Concessions",
    detail: "Bilateral agreement seeking preferential tariff access for Chilean copper concentrates and lithium chemicals in exchange for Indian engineering and pharmaceutical exports.",
    relevance: "Secures high-grade copper imports for expanding India's domestic electric grids and high-voltage EV motor windings.",
    color: "#8F4E99",
    arcPath: "M 601.86,472.57 Q 426.93,556.28 252.00,640.00",
    cx: 252.00,
    cy: 640.00
  },
  mn: {
    id: "mn",
    name: "Mongolia Exploration Protocol",
    flag: "🇲🇳",
    type: "Bilateral Geological JV",
    status: "MoU Signed",
    minerals: "Copper (Cu), Rare Earths (REE)",
    funding: "Public Sector Technical Assistance",
    detail: "Signed bilateral protocol for joint geological exploration of copper reserves and heavy rare earth elements in Mongolia's southern Gobi region, leveraging Indian exploration teams.",
    relevance: "Leverages Geological Survey of India (GSI) exploration expertise to gain early-stage access to copper assets.",
    color: "#4D6B3C",
    arcPath: "M 601.86,472.57 Q 620.93,416.28 640.00,360.00",
    cx: 640.00,
    cy: 360.00
  }
};

const PartnershipsDashboard = () => {
  const [activePartner, setActivePartner] = useState('ar');
  const [worldSvgContent, setWorldSvgContent] = useState('');
  const containerRef = useRef(null);

  // Fetch world SVG map
  useEffect(() => {
    fetch('/world.svg')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load partnership world map');
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
      .catch(err => console.error("Error loading partnership map SVG", err));
  }, []);

  // Configure SVG map interactivity and highlights
  useEffect(() => {
    if (!worldSvgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';

    const paths = svg.querySelectorAll('path');
    paths.forEach(el => {
      const id = el.id || el.parentElement?.id;
      if (!id) return;

      const iso2 = id.toLowerCase();
      
      // Determine if this path corresponds to the active partner country
      const activeData = PARTNERSHIP_DATA[activePartner];
      const isActiveCountry = (activeData.id === 'ar' && iso2 === 'ar') ||
                            (activeData.id === 'au' && iso2 === 'au') ||
                            (activeData.id === 'us' && iso2 === 'us') ||
                            (activeData.id === 'eu' && iso2 === 'fr') ||
                            (activeData.id === 'cl' && iso2 === 'cl') ||
                            (activeData.id === 'mn' && iso2 === 'mn');

      const isIndia = (iso2 === 'in');

      if (isActiveCountry) {
        el.style.fill = activeData.color + '55';
        el.style.stroke = activeData.color;
        el.style.strokeWidth = '1.8px';
        el.style.transition = 'all 0.3s ease';
      } else if (isIndia) {
        el.style.fill = 'var(--maroon-light)';
        el.style.stroke = 'var(--maroon)';
        el.style.strokeWidth = '1.8px';
        el.style.transition = 'all 0.3s ease';
      } else {
        el.style.fill = '#EAE6DF';
        el.style.stroke = '#FFFFFF';
        el.style.strokeWidth = '0.5px';
        el.style.transition = 'all 0.3s ease';
      }
    });
  }, [worldSvgContent, activePartner]);

  const activeData = PARTNERSHIP_DATA[activePartner];

  return (
    <div className="partnership-dashboard-layout reveal">
      {/* 1. Map Panel */}
      <div className="partnership-map-panel">
        {worldSvgContent ? (
          <div className="kabil-svg-container" ref={containerRef}>
            <div 
              dangerouslySetInnerHTML={{ __html: worldSvgContent }} 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            
            {/* Absolute SVG Overlay for Arcs and Pins */}
            <svg 
              viewBox="30.767 241.591 784.077 458.627" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
            >
              {/* Arcs rendering with reactive opacity */}
              {Object.values(PARTNERSHIP_DATA).map((p) => {
                const isActive = p.id === activePartner;
                return (
                  <path 
                    key={p.id}
                    d={p.arcPath} 
                    className={`kabil-arc ${isActive ? 'active' : 'inactive'}`} 
                    style={{
                      stroke: isActive ? p.color : 'var(--border-color)',
                      strokeWidth: isActive ? '2.5px' : '0.8px',
                      opacity: isActive ? 1 : 0.12,
                      transition: 'all 0.4s ease'
                    }}
                  />
                );
              })}
              
              {/* India Hub Pin */}
              <circle cx="601.86" cy="472.57" r="12" fill="var(--maroon)" opacity="0.3" className="kabil-pulse-circle hub" />
              <circle cx="601.86" cy="472.57" r="4.5" fill="var(--maroon)" stroke="#FFFFFF" strokeWidth="1" />
              <text x="601.86" y="454" className="kabil-label hub-label">India (KABIL Hub)</text>

              {/* Partner Pins */}
              {Object.values(PARTNERSHIP_DATA).map((p) => {
                const isActive = p.id === activePartner;
                return (
                  <g key={p.id} style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => setActivePartner(p.id)}>
                    <circle 
                      cx={p.cx} 
                      cy={p.cy} 
                      r={isActive ? 10 : 7} 
                      fill={isActive ? p.color : 'var(--text-secondary)'} 
                      opacity={isActive ? 0.35 : 0.15} 
                      className={isActive ? 'pulse-effect' : ''}
                      style={{ transformOrigin: `${p.cx}px ${p.cy}px`, transition: 'all 0.3s ease' }}
                    />
                    <circle 
                      cx={p.cx} 
                      cy={p.cy} 
                      r={isActive ? 4.5 : 3} 
                      fill={isActive ? p.color : 'var(--text-secondary)'} 
                      stroke="#FFFFFF" 
                      strokeWidth="1" 
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    {isActive && (
                      <text x={p.cx} y={p.cy - 12} className="kabil-label" style={{ fill: p.color, fontWeight: 700 }}>
                        {p.flag} {p.name.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Loading partnership visualization map...
          </div>
        )}
      </div>

      {/* 2. Controls & Intelligence Panel */}
      <div className="partnership-intel-panel">
        <h3 style={{ marginBottom: '1.25rem' }}>Bilateral & Multilateral Alliances</h3>
        
        {/* Selector Tabs */}
        <div className="partnership-tabs">
          {Object.values(PARTNERSHIP_DATA).map((p) => (
            <button
              key={p.id}
              className={`partnership-tab-btn ${activePartner === p.id ? 'active' : ''}`}
              onClick={() => setActivePartner(p.id)}
              style={{
                borderColor: activePartner === p.id ? p.color : 'var(--border-color)',
                color: activePartner === p.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: activePartner === p.id ? p.color + '0a' : 'transparent'
              }}
            >
              <span>{p.flag}</span>
              <span>{p.name.replace(' Partnership', '').replace(' Agreement', '').replace(' Cooperation MoU', '').replace(' Exploration Protocol', '')}</span>
            </button>
          ))}
        </div>

        {/* Intelligence Card details */}
        <div className="partnership-card-active" style={{ borderLeftColor: activeData.color }}>
          <div className="partner-card-header">
            <h4>{activeData.flag} {activeData.name}</h4>
            <span className="partner-badge" style={{ background: activeData.color + '18', color: activeData.color }}>
              {activeData.type}
            </span>
          </div>

          <div className="partner-specs-grid">
            <div className="spec-item">
              <span className="spec-label">Target Minerals:</span>
              <strong className="spec-val">{activeData.minerals}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Outlay / Commitments:</span>
              <strong className="spec-val" style={{ color: 'var(--maroon)' }}>{activeData.funding}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Current Status:</span>
              <strong className="spec-val">{activeData.status}</strong>
            </div>
          </div>

          <div className="partner-detail-body">
            <p><strong>Operational Details:</strong> {activeData.detail}</p>
            <p className="strategic-relevance-p">
              <strong>Strategic Relevance for India:</strong> <br />
              {activeData.relevance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipsDashboard;
