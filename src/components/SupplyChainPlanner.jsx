import React, { useState, useMemo } from 'react';

const PLANNER_MINERALS = {
  lithium: {
    name: 'Lithium',
    miningOptions: [
      { id: 'aus', name: 'Australia', alliance: 'allied', risk: 15, desc: 'Hard-rock spodumene extraction. Highly reliable but lacks domestic refining.' },
      { id: 'chile', name: 'Chile', alliance: 'allied', risk: 30, desc: 'Brine extraction in the Lithium Triangle. Environmentally vulnerable.' },
      { id: 'china', name: 'China', alliance: 'monopoly', risk: 75, desc: 'Domestic lepidolite mining. Highly controlled by state mandates.' }
    ]
  },
  cobalt: {
    name: 'Cobalt',
    miningOptions: [
      { id: 'drc', name: 'DR Congo', alliance: 'unaligned', risk: 70, desc: 'Mines 70% of global cobalt. High human rights and ethical vulnerability.' },
      { id: 'aus', name: 'Australia', alliance: 'allied', risk: 15, desc: 'Byproduct cobalt mining. Secure but low volume output.' },
      { id: 'china', name: 'China', alliance: 'monopoly', risk: 80, desc: 'Monopolized state supply networks.' }
    ]
  },
  ree: {
    name: 'Rare Earths',
    miningOptions: [
      { id: 'china', name: 'China', alliance: 'monopoly', risk: 85, desc: 'Dominates heavy rare earth deposits. Immediate embargo threat.' },
      { id: 'usa', name: 'United States', alliance: 'allied', risk: 20, desc: 'Mountain Pass mine. High security but relies on overseas processing.' },
      { id: 'aus', name: 'Australia', alliance: 'allied', risk: 15, desc: 'Mt Weld deposit. High-grade allied source.' }
    ]
  }
};

const REFINING_OPTIONS = [
  { id: 'china', name: 'China', alliance: 'monopoly', risk: 85, desc: 'Dominates 85% of global chemical refining. Severe single-point failure bottleneck.' },
  { id: 'india', name: 'India', alliance: 'allied', risk: 35, desc: 'Developing processing infrastructure under NCMM. Moderate security.' },
  { id: 'usa', name: 'United States', alliance: 'allied', risk: 25, desc: 'High labor and environmental compliance cost, but maximum strategic security.' },
  { id: 'eu', name: 'European Union', alliance: 'allied', risk: 20, desc: 'Under strict circular mandates. Secure but low chemical throughput.' }
];

const MANUFACTURING_OPTIONS = [
  { id: 'india', name: 'India', alliance: 'allied', label: 'India (PLI Hub)' },
  { id: 'usa', name: 'United States', alliance: 'allied', label: 'USA (Gigafactory)' },
  { id: 'eu', name: 'European Union', alliance: 'allied', label: 'EU (Battery Hub)' },
  { id: 'china', name: 'China', alliance: 'monopoly', label: 'China (Supply Center)' }
];

const SupplyChainPlanner = () => {
  const [selectedMineral, setSelectedMineral] = useState('lithium');
  const [miningLoc, setMiningLoc] = useState('aus');
  const [refiningLoc, setRefiningLoc] = useState('china');
  const [mfgLoc, setMfgLoc] = useState('india');

  // Handle mineral change and reset defaults
  const handleMineralChange = (e) => {
    const min = e.target.value;
    setSelectedMineral(min);
    const defaults = { lithium: 'aus', cobalt: 'drc', ree: 'china' };
    setMiningLoc(defaults[min]);
  };

  const mineral = PLANNER_MINERALS[selectedMineral];
  const activeMining = useMemo(() => mineral.miningOptions.find(o => o.id === miningLoc) || mineral.miningOptions[0], [mineral, miningLoc]);
  const activeRefining = useMemo(() => REFINING_OPTIONS.find(o => o.id === refiningLoc), [refiningLoc]);
  const activeMfg = useMemo(() => MANUFACTURING_OPTIONS.find(o => o.id === mfgLoc), [mfgLoc]);

  // Calculate Vulnerability & Ratings
  const simulation = useMemo(() => {
    let vulnerabilityScore = 0;
    
    // 1. Accumulate risk based on components
    vulnerabilityScore += activeMining.risk * 0.4;
    vulnerabilityScore += activeRefining.risk * 0.5;
    
    // 2. Add penalty for supply chain dispersion
    const uniqueLocations = new Set([miningLoc, refiningLoc, mfgLoc]);
    if (uniqueLocations.size === 3) {
      vulnerabilityScore += 10; // Transit and logistics penalty
    }

    // 3. Trade and policy compliance checks
    // IRA Compliance: Mining & Refining must be in US/FTA countries (Australia, Chile, US are FTA)
    const miningFTA = ['aus', 'chile', 'usa'].includes(miningLoc);
    const refiningFTA = ['usa'].includes(refiningLoc); // Simplification for IRA guidelines
    const isIRACompliant = miningFTA && refiningFTA;

    // MSP (Minerals Security Partnership) Secure: All stages must be in Allied countries (India, USA, EU, Australia, Chile)
    const isMSPSecure = activeMining.alliance === 'allied' && activeRefining.alliance === 'allied' && activeMfg.alliance === 'allied';

    // Geopolitical rating determination
    let rating = 'Secure & Resilient';
    let ratingColor = 'var(--risk-low)';
    let ratingBg = 'var(--risk-low-light)';

    if (vulnerabilityScore > 65) {
      rating = 'Critical Vulnerability (Monopoly Lock)';
      ratingColor = 'var(--risk-high)';
      ratingBg = 'var(--risk-high-light)';
    } else if (vulnerabilityScore > 40) {
      rating = 'Elevated Dependency';
      ratingColor = 'var(--risk-med)';
      ratingBg = 'var(--risk-med-light)';
    }

    return {
      vulnerabilityScore: Math.round(Math.min(100, vulnerabilityScore)),
      isIRACompliant,
      isMSPSecure,
      rating,
      ratingColor,
      ratingBg
    };
  }, [selectedMineral, miningLoc, refiningLoc, mfgLoc, activeMining, activeRefining, activeMfg]);

  return (
    <section className="section" id="geopolitical-planner">
      <div className="container">
        <h2>Geopolitical Supply Chain route Planner</h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Simulate a custom logistics route for critical minerals. Evaluate how sourcing, processing, and assembly locations affect compliance, carbon risk, and geopolitical vulnerability.
        </p>

        <div className="planner-layout reveal">
          {/* Sourcing Selectors */}
          <div className="planner-controls-card">
            <h3>Configure Sourcing Route</h3>
            
            <div className="planner-control-group">
              <label>Select Target Mineral</label>
              <select className="filter-select select-full" value={selectedMineral} onChange={handleMineralChange}>
                <option value="lithium">Lithium (Li)</option>
                <option value="cobalt">Cobalt (Co)</option>
                <option value="ree">Rare Earths (Nd/Dy)</option>
              </select>
            </div>

            <div className="planner-control-group">
              <label>Stage 1: Extraction & Sourcing</label>
              <select className="filter-select select-full" value={miningLoc} onChange={(e) => setMiningLoc(e.target.value)}>
                {mineral.miningOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
              <p className="stage-choice-desc">{activeMining.desc}</p>
            </div>

            <div className="planner-control-group">
              <label>Stage 2: Chemical Refining</label>
              <select className="filter-select select-full" value={refiningLoc} onChange={(e) => setRefiningLoc(e.target.value)}>
                {REFINING_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
              <p className="stage-choice-desc">{activeRefining.desc}</p>
            </div>

            <div className="planner-control-group">
              <label>Stage 3: Advanced Manufacturing</label>
              <select className="filter-select select-full" value={mfgLoc} onChange={(e) => setMfgLoc(e.target.value)}>
                {MANUFACTURING_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sourcing Visualizer & Calculations */}
          <div className="planner-results-card">
            <h3>Geopolitical Risk & Compliance Audit</h3>
            
            <div className="rating-pill" style={{ background: simulation.ratingBg, borderColor: simulation.ratingColor, color: simulation.ratingColor }}>
              <span className="rating-status-label">Route Assessment:</span>
              <strong>{simulation.rating}</strong>
            </div>

            {/* Visual Progress bar for vulnerability */}
            <div className="meter-container">
              <div className="meter-label">
                <span>Geopolitical Vulnerability Index:</span>
                <strong style={{ color: simulation.ratingColor }}>{simulation.vulnerabilityScore}%</strong>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${simulation.vulnerabilityScore}%`,
                    background: simulation.ratingColor 
                  }}
                />
              </div>
            </div>

            {/* Visual Route Flow */}
            <div className="route-flow-box">
              <h4>Supply Logistics Route</h4>
              <div className="route-nodes">
                <div className="route-step">
                  <span className="step-tag">1. Mined</span>
                  <strong>{activeMining.name}</strong>
                </div>
                <div className="route-connector-line">➔</div>
                <div className="route-step">
                  <span className="step-tag">2. Processed</span>
                  <strong>{activeRefining.name}</strong>
                </div>
                <div className="route-connector-line">➔</div>
                <div className="route-step">
                  <span className="step-tag">3. Assembled</span>
                  <strong>{activeMfg.name}</strong>
                </div>
              </div>
            </div>

            {/* Compliance Matrix */}
            <div className="compliance-grid-planner">
              <h4>Trade & Security Compliance</h4>
              
              <div className="compliance-row">
                <div className="compliance-indicator">
                  <span className={`compliance-dot ${simulation.isMSPSecure ? 'active' : ''}`} />
                  <span>Allied Sourced (MSP Secure)</span>
                </div>
                <span className="compliance-result">
                  {simulation.isMSPSecure ? 'Passed' : 'Failed'}
                </span>
              </div>

              <div className="compliance-row">
                <div className="compliance-indicator">
                  <span className={`compliance-dot ${simulation.isIRACompliant ? 'active' : ''}`} />
                  <span>US IRA Tax-Credit Eligible</span>
                </div>
                <span className="compliance-result">
                  {simulation.isIRACompliant ? 'Qualified' : 'Excludes'}
                </span>
              </div>

              <div className="compliance-row">
                <div className="compliance-indicator">
                  <span className={`compliance-dot ${refiningLoc === 'india' ? 'active' : ''}`} />
                  <span>National Critical Mineral Mission (NCMM) Alignment</span>
                </div>
                <span className="compliance-result">
                  {refiningLoc === 'india' ? 'Aligned' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplyChainPlanner;
