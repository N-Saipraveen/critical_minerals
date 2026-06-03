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

  return (
    <div className="value-chain-component">
      {/* Interactive SVG Flowchart */}
      <div className="flow-diagram-wrapper">
        <svg viewBox="0 0 1000 120" className="flow-svg">
          {/* Flow Line Paths with Moving Dash Animation */}
          <path d="M 100,60 L 900,60" className="flow-path active" />
          
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

      {/* Detail Card for Active Flow Node */}
      <div className="risk-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <span className="risk-badge" style={{ background: 'var(--maroon-light)', color: 'var(--maroon)' }}>
          {data.stage}
        </span>
        <h3 style={{ margin: '0.75rem 0' }}>{data.title}</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: 0 }}>
          {data.desc}
        </p>
      </div>
    </div>
  );
};

export default ValueChain;
