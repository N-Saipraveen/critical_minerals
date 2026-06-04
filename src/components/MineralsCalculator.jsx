import React, { useState, useMemo } from 'react';

const TECH_PRESETS = {
  ev: {
    id: 'ev',
    name: 'Electric Vehicles',
    unit: 'Vehicles',
    defaultVal: 500000,
    min: 10000,
    max: 5000000,
    step: 10000,
    desc: 'Calculates critical mineral requirements for manufacturing standard passenger battery electric vehicles (BEVs).',
    minerals: {
      Lithium: { amountPerUnit: 9, globalProdKg: 130000000, topProducer: 'Australia (47%), Chile (30%)', risk: 'Medium' },
      Cobalt: { amountPerUnit: 13, globalProdKg: 190000000, topProducer: 'DR Congo (70%)', risk: 'High' },
      Nickel: { amountPerUnit: 40, globalProdKg: 3600000000, topProducer: 'Indonesia (50%)', risk: 'High' },
      Manganese: { amountPerUnit: 25, globalProdKg: 20000000000, topProducer: 'South Africa (35%)', risk: 'Low' },
      Graphite: { amountPerUnit: 66, globalProdKg: 1600000000, topProducer: 'China (70%)', risk: 'High' },
      Copper: { amountPerUnit: 53, globalProdKg: 22000000000, topProducer: 'Chile (28%), Peru (10%)', risk: 'Medium' }
    }
  },
  wind: {
    id: 'wind',
    name: 'Offshore Wind Turbines',
    unit: 'Megawatts (MW)',
    defaultVal: 500,
    min: 50,
    max: 5000,
    step: 50,
    desc: 'Calculates copper, zinc, and rare-earth magnet requirements for offshore direct-drive wind generator installations.',
    minerals: {
      Neodymium: { amountPerUnit: 300, globalProdKg: 8000000, topProducer: 'China (70%)', risk: 'High' },
      Dysprosium: { amountPerUnit: 50, globalProdKg: 1800000, topProducer: 'China (90%)', risk: 'High' },
      Copper: { amountPerUnit: 8000, globalProdKg: 22000000000, topProducer: 'Chile (28%), Peru (10%)', risk: 'Medium' },
      Zinc: { amountPerUnit: 5500, globalProdKg: 13000000000, topProducer: 'China (35%), Peru (12%)', risk: 'Low' },
      Manganese: { amountPerUnit: 780, globalProdKg: 20000000000, topProducer: 'South Africa (35%)', risk: 'Low' }
    }
  },
  solar: {
    id: 'solar',
    name: 'Utility Solar PV Arrays',
    unit: 'Megawatts (MW)',
    defaultVal: 1000,
    min: 100,
    max: 10000,
    step: 100,
    desc: 'Estimates pure silicon, silver, copper, and thin-film elements for industrial-scale utility solar installations.',
    minerals: {
      Silicon: { amountPerUnit: 6000, globalProdKg: 9000000000, topProducer: 'China (75%)', risk: 'Medium' },
      Silver: { amountPerUnit: 25, globalProdKg: 26000000, topProducer: 'Mexico (23%), China (13%)', risk: 'Medium' },
      Copper: { amountPerUnit: 3000, globalProdKg: 22000000000, topProducer: 'Chile (28%)', risk: 'Medium' },
      Tellurium: { amountPerUnit: 5, globalProdKg: 600000, topProducer: 'China (60%)', risk: 'High' },
      Indium: { amountPerUnit: 3, globalProdKg: 900000, topProducer: 'China (60%)', risk: 'High' }
    }
  },
  storage: {
    id: 'storage',
    name: 'Grid Battery Storage',
    unit: 'Megawatt-hours (MWh)',
    defaultVal: 200,
    min: 20,
    max: 2000,
    step: 20,
    desc: 'Models core active minerals needed for high-capacity, stationary utility-grid NMC/LFP energy storage packs.',
    minerals: {
      Lithium: { amountPerUnit: 150, globalProdKg: 130000000, topProducer: 'Australia, Chile', risk: 'Medium' },
      Cobalt: { amountPerUnit: 180, globalProdKg: 190000000, topProducer: 'DR Congo (70%)', risk: 'High' },
      Nickel: { amountPerUnit: 650, globalProdKg: 3600000000, topProducer: 'Indonesia (50%)', risk: 'High' },
      Graphite: { amountPerUnit: 900, globalProdKg: 1600000000, topProducer: 'China (70%)', risk: 'High' },
      Copper: { amountPerUnit: 750, globalProdKg: 22000000000, topProducer: 'Chile (28%)', risk: 'Medium' }
    }
  }
};

const MineralsCalculator = () => {
  const [activeTech, setActiveTech] = useState('ev');
  const [scale, setScale] = useState(TECH_PRESETS.ev.defaultVal);

  // Switch technology preset and reset scale
  const handleTechChange = (techId) => {
    setActiveTech(techId);
    setScale(TECH_PRESETS[techId].defaultVal);
  };

  const tech = TECH_PRESETS[activeTech];

  const calculations = useMemo(() => {
    return Object.entries(tech.minerals).map(([name, data]) => {
      const neededKg = scale * data.amountPerUnit;
      const percentageOfGlobal = (neededKg / data.globalProdKg) * 100;
      return {
        name,
        neededKg,
        neededTons: neededKg / 1000,
        percentageOfGlobal,
        topProducer: data.topProducer,
        risk: data.risk
      };
    });
  }, [activeTech, scale]);

  const overallRiskScore = useMemo(() => {
    const highRiskCount = calculations.filter(c => c.risk === 'High').length;
    const medRiskCount = calculations.filter(c => c.risk === 'Medium').length;
    const total = calculations.length;
    
    if (highRiskCount / total > 0.4) return { label: 'CRITICAL CONCENTRATION', color: 'var(--risk-high)', bg: 'var(--risk-high-light)' };
    if (highRiskCount > 0 || medRiskCount / total > 0.5) return { label: 'ELEVEATED RISK', color: 'var(--risk-med)', bg: 'var(--risk-med-light)' };
    return { label: 'MODERATE SUPPLY RISK', color: 'var(--risk-low)', bg: 'var(--risk-low-light)' };
  }, [calculations]);

  return (
    <section className="section section-bg-alt" id="interactive-calculator">
      <div className="container">
        <h2>Interactive Clean Energy Demand Calculator</h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Estimate the global raw material requirements and supply-chain vulnerabilities of scaling transition technologies. Select a tech preset, adjust the sliders, and explore.
        </p>

        <div className="calculator-layout reveal">
          {/* Controls Panel */}
          <div className="calc-controls-card">
            <h3>Select Technology</h3>
            <div className="calc-tabs">
              {Object.values(TECH_PRESETS).map((preset) => (
                <button
                  key={preset.id}
                  className={`calc-tab-btn ${activeTech === preset.id ? 'active' : ''}`}
                  onClick={() => handleTechChange(preset.id)}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <p className="calc-desc">{tech.desc}</p>

            <div className="slider-container">
              <div className="slider-header">
                <span className="slider-label">Production Target:</span>
                <span className="slider-value">
                  {scale.toLocaleString()} {tech.unit}
                </span>
              </div>
              <input
                type="range"
                min={tech.min}
                max={tech.max}
                step={tech.step}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="slider-limits">
                <span>{tech.min.toLocaleString()}</span>
                <span>{tech.max.toLocaleString()}</span>
              </div>
            </div>

            <div className="risk-indicator-box" style={{ background: overallRiskScore.bg, borderColor: overallRiskScore.color }}>
              <div className="risk-header" style={{ color: overallRiskScore.color }}>
                <span className="risk-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                <span>{overallRiskScore.label}</span>
              </div>
              <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>
                This manufacturing mix relies heavily on minerals refined in monopolistic markets, presenting potential supply chain bottlenecks.
              </p>
            </div>
          </div>

          {/* Output Results Panel */}
          <div className="calc-results-card">
            <h3>Estimated Mineral Raw Material Requirements</h3>
            
            <div className="results-list">
              {calculations.map((calc) => (
                <div key={calc.name} className="result-item">
                  <div className="result-item-header">
                    <div className="result-name-block">
                      <span className="result-mineral-name">{calc.name}</span>
                      <span className={`result-risk-badge ${calc.risk.toLowerCase()}`}>
                        {calc.risk} Supply Risk
                      </span>
                    </div>
                    <span className="result-amount">
                      {calc.neededTons >= 1 ? `${calc.neededTons.toLocaleString(undefined, {maximumFractionDigits: 1})} Metric Tons` : `${calc.neededKg.toLocaleString()} kg`}
                    </span>
                  </div>

                  {/* Progress Bar of Global Production */}
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar-fill ${calc.risk.toLowerCase()}`} 
                      style={{ width: `${Math.min(100, Math.max(1, calc.percentageOfGlobal * 10))}%` }}
                    />
                  </div>

                  <div className="result-item-footer">
                    <span>% of Global Annual Supply: <strong>{calc.percentageOfGlobal.toFixed(4)}%</strong></span>
                    <span>Top Supplier: <strong>{calc.topProducer}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MineralsCalculator;
