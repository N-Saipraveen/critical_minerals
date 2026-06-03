import React, { useState, useMemo, forwardRef } from 'react';

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

const MineralsTable = forwardRef(({ categoryFilter, setCategoryFilter }, ref) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredData = useMemo(() => {
    return mineralsDataset.filter(m => {
      const searchMatch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.symbol.toLowerCase().includes(search.toLowerCase());
      
      const categoryMatch = (categoryFilter === 'all') || (m.category === categoryFilter);
      const riskMatch = (riskFilter === 'all') || (m.status === riskFilter);
      
      return searchMatch && categoryMatch && riskMatch;
    });
  }, [search, categoryFilter, riskFilter]);

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
        <h2>India's 30 Critical Minerals Register</h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Use the interactive filter controls to search, filter by category classification, or evaluate country import risk profiles.
        </p>

        {/* Filter Panel */}
        <div className="table-filter-bar">
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
            <label>Import Risk</label>
            <select 
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk (100%)</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Self-Sufficient</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="minerals-table">
            <thead>
              <tr>
                <th>Mineral Name</th>
                <th>Symbol</th>
                <th>Category</th>
                <th>Import Dependency</th>
                <th>Primary Sector Application</th>
                <th>Key Source Nations</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((m, idx) => (
                <tr key={idx}>
                  <td><strong>{m.name}</strong></td>
                  <td><code>{m.symbol}</code></td>
                  <td><span className="min-tag">{m.category}</span></td>
                  <td>
                    <span className="badge-risk" style={getStatusStyle(m.status)}>
                      {m.import}
                    </span>
                  </td>
                  <td>{m.sector}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {m.sources}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
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
