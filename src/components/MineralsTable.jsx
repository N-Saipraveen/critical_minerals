import React, { useState, useMemo, forwardRef } from 'react';

const mineralsDataset = [
  // India's 30 (mapped with details for both India and Global)
  { 
    name: "Lithium", symbol: "Li", category: "Battery",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "EV Battery Cathodes, Grid Storage", indiaSources: "Chile, Australia, Argentina",
    globalShare: "Australia (47%), Chile (30%)", globalReserves: "Chile, Australia, Argentina", globalSectors: "EV Batteries, Power Grid Packs", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Cobalt", symbol: "Co", category: "Battery",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Aerospace superalloys, NMC battery cathodes", indiaSources: "DRC, China, Finland",
    globalShare: "DR Congo (70%)", globalReserves: "DR Congo, Australia", globalSectors: "Jet turbine engines, battery chemistry", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Nickel", symbol: "Ni", category: "Battery",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Stainless steel, EV battery chemistries", indiaSources: "Indonesia, Philippines, Russia",
    globalShare: "Indonesia (50%)", globalReserves: "Indonesia, Australia, Brazil", globalSectors: "EV Battery Cathodes, Alloys", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Graphite", symbol: "C", category: "Battery",
    indiaImport: "High Import (60%)", indiaRisk: "medium", indiaSector: "Anode material in batteries, steel refractories", indiaSources: "China, Madagascar, Brazil",
    globalShare: "China (70%)", globalReserves: "China, Brazil, Turkey", globalSectors: "Battery Anodes, Metallurgy", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Neodymium", symbol: "Nd", category: "REE",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Permanent magnets for EV motors & Wind turbines", indiaSources: "China, USA, Myanmar",
    globalShare: "China (70%)", globalReserves: "China, Vietnam, Brazil", globalSectors: "Wind generators, electric powertrains", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Dysprosium", symbol: "Dy", category: "REE",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "High-temperature military magnets, sensors", indiaSources: "China, Myanmar",
    globalShare: "China (90%)", globalReserves: "China, Vietnam", globalSectors: "Defense guidance, heavy magnets", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Gallium", symbol: "Ga", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Semiconductors, 5G chips, optoelectronic LEDs", indiaSources: "China, Japan, UK",
    globalShare: "China (98%)", globalReserves: "China, Russia, Ukraine", globalSectors: "5G systems, military radars, microchips", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Germanium", symbol: "Ge", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Fiber optic cables, solar cells, infrared optics", indiaSources: "China, USA, Belgium",
    globalShare: "China (60%)", globalReserves: "China, Russia, USA", globalSectors: "Night-vision optics, space solar cells", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Indium", symbol: "In", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Touchscreen displays (ITO), solar panels", indiaSources: "China, South Korea, Canada",
    globalShare: "China (60%)", globalReserves: "China, Peru, Canada", globalSectors: "LCD screens, thin-film solar PVs", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Silicon", symbol: "Si", category: "Industrial",
    indiaImport: "Medium Import (40%)", indiaRisk: "medium", indiaSector: "Solar wafers, semiconductor chips, alloys", indiaSources: "China, Russia, Norway",
    globalShare: "China (75%)", globalReserves: "China, Russia, Norway", globalSectors: "Solar cells, computer microprocessors", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Titanium", symbol: "Ti", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Aerospace alloy structures, medical implants", indiaSources: "India (Chavara sands), Australia",
    globalShare: "China (35%), Russia (15%)", globalReserves: "China, Australia, India", globalSectors: "Jet engines, aerospace hulls", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Beryllium", symbol: "Be", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Nuclear reactors, aerospace electronics, sensors", indiaSources: "USA, China, Mozambique",
    globalShare: "USA (65%)", globalReserves: "USA, China, Kazakhstan", globalSectors: "Defense sensors, nuclear control rods", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Niobium", symbol: "Nb", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Superalloys, structural steel, pipelines", indiaSources: "Brazil, Canada",
    globalShare: "Brazil (88%)", globalReserves: "Brazil, Canada", globalSectors: "Jet engines, superconducting magnets", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Tantalum", symbol: "Ta", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Capacitors in electronics, surgical implants", indiaSources: "DRC, Rwanda, Brazil",
    globalShare: "DRC (40%), Brazil (30%)", globalReserves: "Brazil, Australia", globalSectors: "Smartphones, turbine superalloys", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Tungsten", symbol: "W", category: "Strategic",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Industrial cutting tools, armor-piercing shells", indiaSources: "China, Vietnam, Bolivia",
    globalShare: "China (85%)", globalReserves: "China, Vietnam, Russia", globalSectors: "Armor-piercing munitions, drills", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Vanadium", symbol: "V", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Vanadium flow batteries, high-strength alloys", indiaSources: "China, Russia, South Africa",
    globalShare: "China (60%)", globalReserves: "China, Russia, South Africa", globalSectors: "Grid-scale flow batteries, specialty steel", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Platinum", symbol: "Pt", category: "Industrial",
    indiaImport: "High Import (99%)", indiaRisk: "medium", indiaSector: "Catalysts, hydrogen fuel cell electrodes", indiaSources: "South Africa, Russia",
    globalShare: "South Africa (70%)", globalReserves: "South Africa, Russia", globalSectors: "Hydrogen electrolyzers, auto catalysts", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Palladium", symbol: "Pd", category: "Industrial",
    indiaImport: "High Import (99%)", indiaRisk: "medium", indiaSector: "Catalytic converters, multilayer capacitors", indiaSources: "South Africa, Russia, Canada",
    globalShare: "Russia (40%), South Africa (40%)", globalReserves: "South Africa, Russia", globalSectors: "Auto catalysts, electronics", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Antimony", symbol: "Sb", category: "Industrial",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Flame retardants, military ammunition", indiaSources: "China, Tajikistan, Turkey",
    globalShare: "China (55%)", globalReserves: "China, Russia, Bolivia", globalSectors: "Military munitions, flame retardants", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Bismuth", symbol: "Bi", category: "Industrial",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "Eco-friendly alloys, pharmaceuticals", indiaSources: "China, Laos",
    globalShare: "China (80%)", globalReserves: "China, Vietnam", globalSectors: "Eco-alloys, medical elements", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Selenium", symbol: "Se", category: "Industrial",
    indiaImport: "High Import (85%)", indiaRisk: "medium", indiaSector: "Solar PV cells, glass manufacturing", indiaSources: "China, Japan, Germany",
    globalShare: "China (50%)", globalReserves: "China, Russia, USA", globalSectors: "Solar energy, glass tinting", globalRisk: "low",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Tellurium", symbol: "Te", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Cadmium telluride thin-film solar modules", indiaSources: "China, USA, Japan",
    globalShare: "China (60%)", globalReserves: "China, USA, Canada", globalSectors: "Thin-film solar PV arrays", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Zirconium", symbol: "Zr", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Nuclear cladding, high-temp ceramics", indiaSources: "India, Australia, South Africa",
    globalShare: "Australia (35%), South Africa (25%)", globalReserves: "Australia, South Africa, India", globalSectors: "Nuclear fuel rods, refractories", globalRisk: "low",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Hafnium", symbol: "Hf", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Nuclear control rods, microchip dielectric gates", indiaSources: "France, USA",
    globalShare: "France (45%), USA (40%)", globalReserves: "France, USA", globalSectors: "Semiconductor gate dielectrics", globalRisk: "high",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Rhenium", symbol: "Re", category: "Strategic",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Jet engine turbine blades, high-octane fuels", indiaSources: "Chile, USA, Poland",
    globalShare: "Chile (55%), USA (15%)", globalReserves: "Chile, USA, Peru", globalSectors: "Aviation jet turbine blades", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Strontium", symbol: "Sr", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Ferrite magnets, pyrotechnics, ceramics", indiaSources: "Spain, China, Mexico",
    globalShare: "Spain (30%), China (25%)", globalReserves: "Spain, China, Turkey", globalSectors: "Permanent magnets, metallurgy", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Molybdenum", symbol: "Mo", category: "Strategic",
    indiaImport: "High Import (95%)", indiaRisk: "medium", indiaSector: "High-temperature alloy steels, lubricants", indiaSources: "China, Chile, USA",
    globalShare: "China (45%), Chile (20%)", globalReserves: "China, Peru, Chile", globalSectors: "Military steel armor, turbine blades", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Cadmium", symbol: "Cd", category: "Industrial",
    indiaImport: "High Import (80%)", indiaRisk: "medium", indiaSector: "Corrosion-resistant plating, Ni-Cd batteries", indiaSources: "China, South Korea, Japan",
    globalShare: "China (35%), South Korea (12%)", globalReserves: "China, Peru, India", globalSectors: "Corrosion barriers, Ni-Cd cells", globalRisk: "low",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Chromium", symbol: "Cr", category: "Strategic",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Stainless steel corrosion-resistance, plating", indiaSources: "South Africa, India, Turkey",
    globalShare: "South Africa (44%), Kazakhstan (15%)", globalReserves: "Kazakhstan, South Africa, India", globalSectors: "Stainless steel, defense armor plating", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  { 
    name: "Manganese", symbol: "Mn", category: "Battery",
    indiaImport: "Low Import / Exporting", indiaRisk: "low", indiaSector: "Steel alloying, batteries", indiaSources: "South Africa, India, Gabon",
    globalShare: "South Africa (35%), Gabon (20%)", globalReserves: "South Africa, Brazil, India", globalSectors: "Steel reinforcing, battery chemistries", globalRisk: "low",
    criticality: { in: true, us: true, eu: true }
  },

  // Additional World Critical Minerals (US/EU/Global list)
  {
    name: "Helium", symbol: "He", category: "Industrial",
    indiaImport: "Medium Import (50%)", indiaRisk: "medium", indiaSector: "MRI scanners, cryogenics, space applications", indiaSources: "USA, Qatar",
    globalShare: "USA (35%), Qatar (35%)", globalReserves: "USA, Qatar, Algeria", globalSectors: "Cryogenics, semiconductors, gas cooling", globalRisk: "medium",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Magnesium", symbol: "Mg", category: "Strategic",
    indiaImport: "High Import (85%)", indiaRisk: "medium", indiaSector: "Structural aluminum alloys, refractories", indiaSources: "China, Turkey",
    globalShare: "China (90%)", globalReserves: "China, Russia, Turkey", globalSectors: "Lightweight aircraft skins, car frames", globalRisk: "high",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Scandium", symbol: "Sc", category: "REE",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Solid oxide fuel cells, specialty alloys", indiaSources: "China, Japan",
    globalShare: "China (60%), Russia (20%)", globalReserves: "China, Russia, Australia", globalSectors: "SOFC fuel cells, aerospace alloys", globalRisk: "high",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Rhodium", symbol: "Rh", category: "Industrial",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Specialty chemicals, auto catalysts", indiaSources: "South Africa, Russia",
    globalShare: "South Africa (80%)", globalReserves: "South Africa, Russia", globalSectors: "Automotive emission converters", globalRisk: "high",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Iridium", symbol: "Ir", category: "Industrial",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Electronics spark plugs, electrolyzers", indiaSources: "South Africa, UK",
    globalShare: "South Africa (85%)", globalReserves: "South Africa", globalSectors: "Green hydrogen PEM electrolyzers", globalRisk: "high",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Ruthenium", symbol: "Ru", category: "Industrial",
    indiaImport: "100% Imported", indiaRisk: "high", indiaSector: "Hard disk drive coatings, microchips", indiaSources: "South Africa, Germany",
    globalShare: "South Africa (90%)", globalReserves: "South Africa", globalSectors: "Magnetoresistive storage (HDD), chemical cells", globalRisk: "high",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Cerium", symbol: "Ce", category: "REE",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Catalytic converters, glass polishing", indiaSources: "China, Japan",
    globalShare: "China (70%)", globalReserves: "China, Russia, India", globalSectors: "Polishing microchips, catalytic systems", globalRisk: "medium",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Lanthanum", symbol: "La", category: "REE",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Hybrid batteries, catalyst cracking", indiaSources: "China, Japan",
    globalShare: "China (70%)", globalReserves: "China, Russia, India", globalSectors: "NiMH battery nodes, petroleum cracking", globalRisk: "medium",
    criticality: { in: false, us: true, eu: true }
  },
  {
    name: "Copper", symbol: "Cu", category: "Industrial",
    indiaImport: "Medium Import (50%)", indiaRisk: "medium", indiaSector: "Electrical wire harness, motors, power grid", indiaSources: "Chile, Peru, Zambia",
    globalShare: "Chile (28%), Peru (10%)", globalReserves: "Chile, Peru, Australia", globalSectors: "EV copper wiring, green power grids", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  {
    name: "Fluorite", symbol: "CaF2", category: "Industrial",
    indiaImport: "High Import (90%)", indiaRisk: "medium", indiaSector: "Steel smelting fluxes, fluorochemicals", indiaSources: "China, Mexico, South Africa",
    globalShare: "China (60%), Mexico (15%)", globalReserves: "China, Mexico, South Africa", globalSectors: "Hydrofluoric acid, steelmaking fluxes", globalRisk: "medium",
    criticality: { in: true, us: true, eu: true }
  },
  {
    name: "Phosphorus", symbol: "P", category: "Battery",
    indiaImport: "Medium Import (60%)", indiaRisk: "medium", indiaSector: "LFP batteries, chemical fertilizers", indiaSources: "Morocco, China, Egypt",
    globalShare: "Morocco (70%), China (10%)", globalReserves: "Morocco, China, Algeria", globalSectors: "LFP battery cathodes, agriculture", globalRisk: "low",
    criticality: { in: true, us: false, eu: true }
  },
  {
    name: "Tin", symbol: "Sn", category: "Industrial",
    indiaImport: "High Import (80%)", indiaRisk: "medium", indiaSector: "Electronic solder, plating processes", indiaSources: "Indonesia, China, Peru",
    globalShare: "China (30%), Indonesia (25%)", globalReserves: "China, Indonesia, Peru", globalSectors: "Electronics board soldering", globalRisk: "medium",
    criticality: { in: true, us: true, eu: false }
  },
  {
    name: "Potash", symbol: "K", category: "Industrial",
    indiaImport: "100% Imported (Red)", indiaRisk: "high", indiaSector: "Agriculture fertilizers, chemical synthesis", indiaSources: "Canada, Belarus, Israel",
    globalShare: "Canada (30%), Belarus (20%), Russia (20%)", globalReserves: "Canada, Belarus, Russia", globalSectors: "Agricultural nutrients, chemicals", globalRisk: "high",
    criticality: { in: true, us: false, eu: false }
  }
];

const MineralsTable = forwardRef(({ categoryFilter, setCategoryFilter }, ref) => {
  const [viewMode, setViewMode] = useState('india'); // 'india' or 'global'
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredData = useMemo(() => {
    return mineralsDataset.filter(m => {
      // If India Focus is selected, only show minerals critical to India
      if (viewMode === 'india' && !m.criticality.in) {
        return false;
      }

      const searchMatch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.symbol.toLowerCase().includes(search.toLowerCase());
      
      const categoryMatch = (categoryFilter === 'all') || (m.category === categoryFilter);
      
      // Determine which risk status to filter by based on active view mode
      const activeRisk = viewMode === 'india' ? m.indiaRisk : m.globalRisk;
      const riskMatch = (riskFilter === 'all') || (activeRisk === riskFilter);
      
      return searchMatch && categoryMatch && riskMatch;
    });
  }, [search, categoryFilter, riskFilter, viewMode]);

  const getStatusStyle = (status) => {
    if (status === 'high') {
      return { color: 'var(--risk-high)', background: 'var(--risk-high-light)' };
    } else if (status === 'medium') {
      return { color: 'var(--risk-med)', background: 'var(--risk-med-light)' };
    }
    return { color: 'var(--risk-low)', background: 'var(--risk-low-light)' };
  };

  return (
    <section className="section" id="minerals-table" ref={ref}>
      <div className="container">
        <h2>
          {viewMode === 'india' ? "India's 30 Critical Minerals Register" : "Global Critical Minerals Database"}
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          {viewMode === 'india' 
            ? "Explore the 30 critical minerals identified by the Ministry of Mines, highlighting import dependencies and sectors for India's economy."
            : "Review a comprehensive global catalog of 45+ critical minerals, showing supply monopolies, reserve holders, and criticality across regions."}
        </p>

        {/* View Mode Toggle Switcher */}
        <div className="view-mode-tabs">
          <button 
            className={`view-tab-btn ${viewMode === 'india' ? 'active' : ''}`}
            onClick={() => { setViewMode('india'); setRiskFilter('all'); }}
          >
            India Focus
          </button>
          <button 
            className={`view-tab-btn ${viewMode === 'global' ? 'active' : ''}`}
            onClick={() => { setViewMode('global'); setRiskFilter('all'); }}
          >
            Global Focus (USA/EU Comparison)
          </button>
        </div>

        {/* Filter Panel */}
        <div className="table-filter-bar reveal">
          <div className="search-input-wrapper">
            <svg className="search-icon-svg" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search by mineral name or chemical symbol..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select 
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Battery">Battery & Energy</option>
              <option value="REE">Rare Earth (REE)</option>
              <option value="Industrial">High-Tech Industrial</option>
              <option value="Strategic">Strategic & Defence</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Supply Risk</label>
            <select 
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk / Self-Sufficient</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper reveal">
          <table className="minerals-table">
            <thead>
              {viewMode === 'india' ? (
                <tr>
                  <th>Mineral Name</th>
                  <th>Symbol</th>
                  <th>Category</th>
                  <th>Import Dependency</th>
                  <th>Primary Sector Application</th>
                  <th>Key Source Nations</th>
                </tr>
              ) : (
                <tr>
                  <th>Mineral Name</th>
                  <th>Symbol</th>
                  <th>Category</th>
                  <th>Designated Critical</th>
                  <th>Global Production Share</th>
                  <th>Top Reserves Holders</th>
                  <th>Global Supply Risk</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredData.map((m, idx) => (
                <tr key={idx} className="table-row-animate">
                  <td><strong>{m.name}</strong></td>
                  <td><code>{m.symbol}</code></td>
                  <td><span className="min-tag">{m.category}</span></td>
                  
                  {viewMode === 'india' ? (
                    <>
                      <td>
                        <span className="badge-risk" style={getStatusStyle(m.indiaRisk)}>
                          {m.indiaImport}
                        </span>
                      </td>
                      <td>{m.indiaSector}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {m.indiaSources}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="critical-flags">
                          {m.criticality.in && <span className="flag-badge" title="Critical in India">IN</span>}
                          {m.criticality.us && <span className="flag-badge" title="Critical in USA">US</span>}
                          {m.criticality.eu && <span className="flag-badge" title="Critical in EU">EU</span>}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>{m.globalShare}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.globalReserves}</td>
                      <td>
                        <span className="badge-risk" style={getStatusStyle(m.globalRisk)}>
                          {m.globalRisk.toUpperCase()}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={viewMode === 'india' ? 6 : 7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No minerals found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
});

export default MineralsTable;
