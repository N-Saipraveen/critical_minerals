import React, { useState, useEffect } from 'react';

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

const IndiaMap = () => {
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    // Fetch the accurate cartographic SVG map from the public folder
    fetch('/india_accurate.svg')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load India map');
        return res.text();
      })
      .then(text => {
        const svgStart = text.indexOf('<svg');
        if (svgStart !== -1) {
          setSvgContent(text.substring(svgStart));
        } else {
          setSvgContent(text);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const data = selectedLoc ? indiaLocations[selectedLoc] : null;

  return (
    <div className="india-section-layout">
      {/* Accurate Cartographic SVG India Map Wrapper */}
      <div 
        className="india-map-container" 
        data-selected={selectedLoc || ''}
      >
        {svgContent ? (
          <div 
            className="india-svg-wrapper"
            style={{ position: 'relative', width: '100%', height: 'auto', display: 'block' }}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }} 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            
            {/* absolute-positioned hotspots mapped onto the viewBox coordinates */}
            {/* J&K */}
            <div 
              className={`state-marker-pin ${selectedLoc === 'jk' ? 'active' : ''}`} 
              style={{ left: '23.92%', top: '12.41%' }}
              onClick={() => setSelectedLoc('jk')}
            >
              <div className="pin-pulse"></div>
              <div className="pin-dot"></div>
              <span className="pin-label">J&K (Li)</span>
            </div>

            {/* Arunachal */}
            <div 
              className={`state-marker-pin ${selectedLoc === 'arunachal' ? 'active' : ''}`} 
              style={{ left: '89.92%', top: '32.28%' }}
              onClick={() => setSelectedLoc('arunachal')}
            >
              <div className="pin-pulse"></div>
              <div className="pin-dot"></div>
              <span className="pin-label" style={{ left: '-80px' }}>Arunachal (Gr)</span>
            </div>

            {/* Odisha */}
            <div 
              className={`state-marker-pin ${selectedLoc === 'odisha' ? 'active' : ''}`} 
              style={{ left: '55.77%', top: '58.26%' }}
              onClick={() => setSelectedLoc('odisha')}
            >
              <div className="pin-pulse"></div>
              <div className="pin-dot"></div>
              <span className="pin-label">Odisha (Ni)</span>
            </div>

            {/* Andhra Pradesh */}
            <div 
              className={`state-marker-pin ${selectedLoc === 'andhra' ? 'active' : ''}`} 
              style={{ left: '43.26%', top: '71.91%' }}
              onClick={() => setSelectedLoc('andhra')}
            >
              <div className="pin-pulse"></div>
              <div className="pin-dot"></div>
              <span className="pin-label">AP (REE)</span>
            </div>

            {/* Kerala */}
            <div 
              className={`state-marker-pin ${selectedLoc === 'kerala' ? 'active' : ''}`} 
              style={{ left: '27.51%', top: '88.52%' }}
              onClick={() => setSelectedLoc('kerala')}
            >
              <div className="pin-pulse"></div>
              <div className="pin-dot"></div>
              <span className="pin-label" style={{ left: '16px' }}>Kerala (Ti)</span>
            </div>
          </div>
        ) : (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Loading cartographic map...
          </div>
        )}

        {/* Floating Info overlay */}
        <div className="india-overlay-card" id="india-overlay-card">
          <strong style={{ color: 'var(--maroon)' }}>
            {data ? data.title : "Select a Mineral Marker"}
          </strong>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: 0 }}>
            {data ? data.desc : "Click on any of the interactive circular nodes on the map to display state-level exploration and reserve details."}
          </p>
        </div>
      </div>

      {/* Import Dependency Badges side-column */}
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>100% Import Dependent Minerals</h3>
        <p>
          India currently depends entirely on external partners for the raw and processed supply of these critical tech inputs, creating high strategic risks.
        </p>

        <div className="import-badges-grid">
          <div className="import-card">
            <div className="import-card-left">
              <span className="import-name">Lithium (Li)</span>
              <span className="import-use">EV Battery Cathodes, Grid Storage</span>
            </div>
            <span className="import-badge-val badge-100">100% IMPORTED</span>
          </div>
          
          <div className="import-card">
            <div className="import-card-left">
              <span className="import-name">Cobalt (Co)</span>
              <span className="import-use">NMC Battery chemistry, aerospace alloys</span>
            </div>
            <span className="import-badge-val badge-100">100% IMPORTED</span>
          </div>

          <div className="import-card">
            <div className="import-card-left">
              <span className="import-name">Nickel (Ni)</span>
              <span className="import-use">Stainless steel, EV battery cathodes</span>
            </div>
            <span className="import-badge-val badge-100">100% IMPORTED</span>
          </div>

          <div className="import-card">
            <div className="import-card-left">
              <span className="import-name">Germanium & Gallium</span>
              <span className="import-use">Semiconductors, fiber optics, LEDs</span>
            </div>
            <span className="import-badge-val badge-100">100% IMPORTED</span>
          </div>

          <div className="import-card">
            <div className="import-card-left">
              <span className="import-name">Tantalum & Niobium</span>
              <span className="import-use">Defense radars, capacitors, superalloys</span>
            </div>
            <span className="import-badge-val badge-100">100% IMPORTED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
