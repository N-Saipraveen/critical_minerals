import React, { useState, useEffect, useRef } from 'react';

const countriesData = {
  china: {
    name: "China",
    flag: "CN",
    resource: "Rare Earths & Graphite refining",
    share: "85 - 90% of REE refining, 70% Graphite",
    position: "Monopolistic Supply Bottleneck",
    desc: "China holds absolute processing control over heavy rare earths, crucial for high-performance military radars and electric vehicle traction magnets.",
    badge: "Strategic Choke Point"
  },
  drc: {
    name: "Democratic Republic of Congo",
    flag: "CD",
    resource: "Cobalt (Co)",
    share: "70% of global mine production",
    position: "Vulnerable Primary Miner",
    desc: "Congo mines the vast majority of global cobalt, but the supply chain is highly unstable due to widespread child labor, environmental degradation, and artisanal mining issues.",
    badge: "Ethical & Supply Chain Focus"
  },
  chile: {
    name: "Chile",
    flag: "CL",
    resource: "Copper (Cu) & Lithium (Li) Brines",
    share: "25% of Copper reserves, 30% Lithium reserves",
    position: "Leading Reserve Node",
    desc: "Chile sits in the 'Lithium Triangle' and serves as the primary global source of lithium brine, which requires massive water resources to extract.",
    badge: "Water & Environmental Risk"
  },
  australia: {
    name: "Australia",
    flag: "AU",
    resource: "Hard-rock Lithium (Spodumene)",
    share: "47% of global Lithium mining",
    position: "Leading Raw Supplier",
    desc: "Australia produces the most raw lithium. However, it ships almost all of its raw spodumene ore to China for conversion into chemical-grade battery materials.",
    badge: "Core Allied Partner"
  },
  indonesia: {
    name: "Indonesia",
    flag: "ID",
    resource: "Nickel (Ni) Ore",
    share: "50% of global Nickel mining output",
    position: "Dominant Miner",
    desc: "Indonesia has expanded nickel mining rapidly by banning raw ore exports to force multi-billion dollar domestic Chinese-backed smelting plants to build locally.",
    badge: "Resource Nationalism Leader"
  },
  india: {
    name: "India",
    flag: "IN",
    resource: "30 Critical Minerals (NCMM Focus)",
    share: "100% dependent on imports for Lithium, Cobalt, Nickel",
    position: "Emerging Consumer",
    desc: "India has high geological potential for beach sands (REEs) and local reserves but faces extreme dependency on foreign refiners to sustain its EV and solar production.",
    badge: "Focus Security Country"
  },
  usa: {
    name: "United States",
    flag: "US",
    resource: "Advanced Battery Tech & Processing (MSP)",
    share: "Leading technology developer & consumer",
    position: "Allied Security Hub",
    desc: "The United States leads the Minerals Security Partnership (MSP), coordinating international efforts with India and other allies to secure raw inputs and bypass supply chains dominated by single nations.",
    badge: "MSP Diplomatic Hub"
  },
  argentina: {
    name: "Argentina",
    flag: "AR",
    resource: "Lithium Brines (Catamarca Province)",
    share: "21% of global Lithium reserves",
    position: "Strategic KABIL Joint Venture",
    desc: "Argentina hosts massive lithium brine reserves in the Lithium Triangle. India's joint venture, KABIL, has secured exclusive rights for five exploration blocks to ensure dedicated lithium supply channels.",
    badge: "Core Equity Resource"
  },
  eu: {
    name: "European Union",
    flag: "EU",
    resource: "Clean Energy Technology & Supply Chains (TTC)",
    share: "Key consumption & environmental standards leader",
    position: "Strategic Tech Partner",
    desc: "Through the EU-India Trade and Technology Council (TTC), Europe collaborates with India to research, secure, and diversify critical raw material supply chains while promoting high circular economy standards.",
    badge: "TTC Partnership Hub"
  }
};

const hotspots = [
  { id: "india", iso2: "in", name: "India", cx: 601.86, cy: 472.57, color: '#6B0F1A' },
  { id: "china", iso2: "cn", name: "China", cx: 625.00, cy: 405.00, color: '#C89312' },
  { id: "drc", iso2: "cd", name: "DR Congo", cx: 450.00, cy: 540.00, color: '#167B80' },
  { id: "chile", iso2: "cl", name: "Chile", cx: 252.00, cy: 640.00, color: '#9E4E59' },
  { id: "australia", iso2: "au", name: "Australia", cx: 718.51, cy: 623.58, color: '#4D6B3C' },
  { id: "indonesia", iso2: "id", name: "Indonesia", cx: 680.00, cy: 530.00, color: '#6D518F' },
  { id: "usa", iso2: "us", name: "USA", cx: 193.32, cy: 419.05, color: '#1A7A7A' },
  { id: "argentina", iso2: "ar", name: "Argentina", cx: 261.60, cy: 642.04, color: '#D4A017' },
  { id: "eu", iso2: "fr", name: "European Union", cx: 397.00, cy: 491.32, color: '#3D5E8C' }
];

const ThreeGlobe = ({ onSelectCountry }) => {
  const [worldSvgContent, setWorldSvgContent] = useState('');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const containerRef = useRef(null);

  // Fetch world SVG map
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
      .catch(err => console.error("Error loading world SVG map", err));
  }, []);

  // Configure SVG map interactivity
  useEffect(() => {
    if (!worldSvgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    // Apply clean vector responsive styling attributes
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';

    const paths = svg.querySelectorAll('path');
    paths.forEach(el => {
      const id = el.id || el.parentElement?.id;
      if (!id) return;

      const iso2 = id.toLowerCase();
      const hotspot = hotspots.find(h => h.iso2 === iso2);

      if (hotspot) {
        // Style focus hotspot countries
        el.style.fill = hotspot.color + '18'; // Elegant semi-transparent fill
        el.style.stroke = hotspot.color;
        el.style.strokeWidth = '1px';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

        const handleMouseOver = () => {
          // Highlight all paths belonging to this country code (e.g. islands, mainland)
          const siblingPaths = svg.querySelectorAll(`#${iso2} path, [id="${iso2}"]`);
          if (siblingPaths.length > 0) {
            siblingPaths.forEach(p => {
              p.style.fill = hotspot.color + '45';
              p.style.strokeWidth = '1.8px';
            });
          } else {
            el.style.fill = hotspot.color + '45';
            el.style.strokeWidth = '1.8px';
          }

          setHoveredHotspot(hotspot);
          if (countriesData[hotspot.id]) {
            onSelectCountry(countriesData[hotspot.id]);
          }
        };

        const handleMouseOut = () => {
          const siblingPaths = svg.querySelectorAll(`#${iso2} path, [id="${iso2}"]`);
          if (siblingPaths.length > 0) {
            siblingPaths.forEach(p => {
              p.style.fill = hotspot.color + '18';
              p.style.strokeWidth = '1px';
            });
          } else {
            el.style.fill = hotspot.color + '18';
            el.style.strokeWidth = '1px';
          }
          setHoveredHotspot(null);
        };

        el.addEventListener('mouseover', handleMouseOver);
        el.addEventListener('mouseout', handleMouseOut);

        el._cleanup = () => {
          el.removeEventListener('mouseover', handleMouseOver);
          el.removeEventListener('mouseout', handleMouseOut);
        };
      } else {
        // Standard countries colored in warm sand-beige with white borders
        el.style.fill = '#EAE6DF';
        el.style.stroke = '#FFFFFF';
        el.style.strokeWidth = '0.5px';
        el.style.transition = 'all 0.3s ease';
      }
    });

    return () => {
      paths.forEach(el => {
        if (el._cleanup) el._cleanup();
      });
    };
  }, [worldSvgContent, onSelectCountry]);

  // Handle absolute overlay node hovers
  const handleNodeHover = (hotspot, isEntering) => {
    if (isEntering) {
      setHoveredHotspot(hotspot);
      if (countriesData[hotspot.id]) {
        onSelectCountry(countriesData[hotspot.id]);
      }
      
      // Highlight matching country paths in the SVG
      if (containerRef.current) {
        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          const siblingPaths = svg.querySelectorAll(`#${hotspot.iso2} path, [id="${hotspot.iso2}"]`);
          if (siblingPaths.length > 0) {
            siblingPaths.forEach(p => {
              p.style.fill = hotspot.color + '45';
              p.style.strokeWidth = '1.8px';
            });
          }
        }
      }
    } else {
      setHoveredHotspot(null);
      if (containerRef.current) {
        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          const siblingPaths = svg.querySelectorAll(`#${hotspot.iso2} path, [id="${hotspot.iso2}"]`);
          if (siblingPaths.length > 0) {
            siblingPaths.forEach(p => {
              p.style.fill = hotspot.color + '18';
              p.style.strokeWidth = '1px';
            });
          }
        }
      }
    }
  };

  return (
    <div className="world-hotspots-map reveal" style={{ width: '100%', position: 'relative' }}>
      {worldSvgContent ? (
        <div ref={containerRef} className="kabil-svg-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', background: '#FAF8F5', padding: '1.5rem' }}>
          <div 
            dangerouslySetInnerHTML={{ __html: worldSvgContent }} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          
          {/* Absolute-congruent SVG Overlay for pulsing hotspots and clean text labels */}
          <svg 
            viewBox="30.767 241.591 784.077 458.627" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
          >
            {hotspots.map(h => {
              const isHovered = hoveredHotspot && hoveredHotspot.id === h.id;
              return (
                <g key={h.id} style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                   onMouseEnter={() => handleNodeHover(h, true)}
                   onMouseLeave={() => handleNodeHover(h, false)}
                >
                  {/* Pulsing halo */}
                  <circle 
                    cx={h.cx} 
                    cy={h.cy} 
                    r="8" 
                    className={`kabil-pulse-circle ${h.id === 'india' ? 'hub' : ''}`} 
                    style={{
                      stroke: h.color,
                      transformOrigin: `${h.cx}px ${h.cy}px`,
                      animationDuration: '2.2s',
                      transform: isHovered ? 'scale(1.2)' : 'none',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Solid core pin dot */}
                  <circle 
                    cx={h.cx} 
                    cy={h.cy} 
                    r="3.5" 
                    className={`kabil-pin-dot ${h.id !== 'india' ? 'partner' : ''}`} 
                    style={{
                      fill: h.color,
                      transform: isHovered ? 'scale(1.3)' : 'none',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Clean text label shown on hover */}
                  {isHovered && (
                    <text 
                      x={h.cx} 
                      y={h.cy - 12} 
                      textAnchor="middle" 
                      fill="var(--maroon)" 
                      fontSize="9px" 
                      fontWeight="800"
                      style={{
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 1px 2px #FFFFFF)'
                      }}
                    >
                      {h.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          Loading resource hotspots map...
        </div>
      )}
    </div>
  );
};

export default ThreeGlobe;
