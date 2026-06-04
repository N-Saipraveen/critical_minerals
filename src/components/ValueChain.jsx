import React, { useState } from 'react';

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

const ValueChain = () => {
  const [activeStage, setActiveStage] = useState(1);
  const data = chainData[activeStage];

  // 3D Card Tilt Effect
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 6; // max 6 degrees
    const rotateY = ((centerX - x) / centerX) * 6; // max 6 degrees
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = '0 20px 40px rgba(107, 15, 26, 0.12)';
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = 'var(--shadow-md)';
  };

  const currentX = 75 + (activeStage - 1) * 160;

  return (
    <div className="value-chain-component">
      {/* Interactive SVG Flowchart */}
      <div className="flow-diagram-wrapper">
        <svg viewBox="0 0 1000 120" className="flow-svg">
          {/* Inactive Base Path Line */}
          <path d="M 75,60 L 875,60" stroke="rgba(107, 15, 26, 0.08)" strokeWidth="4" strokeLinecap="round" />
          
          {/* Dynamic Active Grow Line */}
          <path 
            d={`M 75,60 L ${currentX},60`} 
            stroke="var(--maroon)" 
            strokeWidth="4" 
            strokeLinecap="round"
            className="flow-path-active"
            style={{ transition: 'd 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
          />

          {/* Flowing Dash Line Overlay for Energy Current */}
          {activeStage > 1 && (
            <path 
              d={`M 75,60 L ${currentX},60`} 
              stroke="var(--gold)" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="10 15"
              className="flow-path-current"
              style={{ transition: 'd 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
            />
          )}

          {/* Pulsing halo around current stage endpoint */}
          <circle 
            cx={currentX} 
            cy="60" 
            r="12" 
            fill="none" 
            stroke="var(--gold)" 
            strokeWidth="2" 
            className="flow-halo" 
            style={{ 
              transition: 'cx 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
              transformOrigin: `${currentX}px 60px`
            }}
          />

          <circle 
            cx={currentX} 
            cy="60" 
            r="6" 
            fill="var(--gold)" 
            style={{ transition: 'cx 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
          />
          
          {/* Nodes */}
          {/* Exploration */}
          <g className={`flow-node ${activeStage === 1 ? 'active' : ''}`} onClick={() => setActiveStage(1)}>
            <rect x="20" y="30" width="110" height="60" rx="8" />
            <text x="75" y="65" textAnchor="middle">1. Exploration</text>
          </g>

          {/* Mining */}
          <g className={`flow-node ${activeStage === 2 ? 'active' : ''}`} onClick={() => setActiveStage(2)}>
            <rect x="180" y="30" width="110" height="60" rx="8" />
            <text x="235" y="65" textAnchor="middle">2. Mining</text>
          </g>

          {/* Beneficiation */}
          <g className={`flow-node ${activeStage === 3 ? 'active' : ''}`} onClick={() => setActiveStage(3)}>
            <rect x="340" y="30" width="110" height="60" rx="8" />
            <text x="395" y="65" textAnchor="middle">3. Beneficiation</text>
          </g>

          {/* Refining */}
          <g className={`flow-node ${activeStage === 4 ? 'active' : ''}`} onClick={() => setActiveStage(4)}>
            <rect x="500" y="30" width="110" height="60" rx="8" />
            <text x="555" y="65" textAnchor="middle">4. Refining</text>
          </g>

          {/* Manufacturing */}
          <g className={`flow-node ${activeStage === 5 ? 'active' : ''}`} onClick={() => setActiveStage(5)}>
            <rect x="660" y="30" width="110" height="60" rx="8" />
            <text x="715" y="65" textAnchor="middle">5. Manufacturing</text>
          </g>

          {/* Recycling */}
          <g className={`flow-node ${activeStage === 6 ? 'active' : ''}`} onClick={() => setActiveStage(6)}>
            <rect x="820" y="30" width="110" height="60" rx="8" />
            <text x="875" y="65" textAnchor="middle">6. Recycling</text>
          </g>
        </svg>
      </div>

      {/* Detail Card for Active Flow Node with 3D Tilt Effect */}
      <div 
        className="risk-card value-chain-detail-card" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="risk-badge" style={{ background: 'var(--maroon-light)', color: 'var(--maroon)' }}>
          {data.stage}
        </span>
        <h3 style={{ margin: '0.75rem 0', transform: 'translateZ(20px)' }}>{data.title}</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: 0, transform: 'translateZ(10px)' }}>
          {data.desc}
        </p>
      </div>
    </div>
  );
};

export default ValueChain;
