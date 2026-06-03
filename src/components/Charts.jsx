import React, { useEffect, useState, useRef } from 'react';

export const ChinaDominanceChart = () => {
  const [animate, setAnimate] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      });
    }, { threshold: 0.2 });

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const barData = [
    { label: "Rare Earth Elements (REE)", val: 90, color: "linear-gradient(90deg, var(--maroon), var(--gold))" },
    { label: "Natural Graphite", val: 70, color: "linear-gradient(90deg, var(--maroon), var(--gold))" },
    { label: "Cobalt refining", val: 65, color: "linear-gradient(90deg, var(--maroon), var(--gold))" },
    { label: "Lithium refining", val: 60, color: "linear-gradient(90deg, var(--maroon), var(--gold))" },
    { label: "Nickel refining", val: 35, color: "linear-gradient(90deg, var(--maroon), var(--gold))" }
  ];

  return (
    <div className="chart-card" ref={chartRef}>
      <h3>China's Share of Global Processing (2023)</h3>
      <div className="chart-container" style={{ marginTop: '2rem' }}>
        {barData.map((bar, idx) => (
          <div key={idx} className="bar-row">
            <div className="bar-label-group">
              <span>{bar.label}</span>
              <strong>{bar.val}%</strong>
            </div>
            <div className="bar-track">
              <div 
                className="bar-fill" 
                style={{ 
                  width: animate ? `${bar.val}%` : '0%',
                  background: bar.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecyclingProgressRings = () => {
  const rings = [
    { name: "Lithium", val: 5, prefix: "<", color: "var(--teal)", desc: "Extremely complex to recycle pyrometallurgically; currently cheaper to extract raw." },
    { name: "Cobalt", val: 30, prefix: "", color: "var(--teal)", desc: "High economic incentive to recycle from spent EV batteries and electronics." },
    { name: "Rare Earths (REE)", val: 1, prefix: "<", color: "var(--teal)", desc: "Very low recycling rates due to integration into complex microelectronic systems." },
    { name: "Aluminium", val: 50, prefix: "+", color: "var(--teal)", desc: "Mature industrial circularity loops with lower energy consumption than primary smelting." }
  ];

  return (
    <div className="circular-progress-grid">
      {rings.map((ring, idx) => (
        <ProgressRing key={idx} ring={ring} />
      ))}
    </div>
  );
};

const ProgressRing = ({ ring }) => {
  const [animate, setAnimate] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      });
    }, { threshold: 0.2 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (ring.val / 100) * circumference;

  return (
    <div ref={elementRef} className="progress-card">
      <div className="svg-ring-container">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="54" className="ring-bg" />
          <circle 
            cx="60" 
            cy="60" 
            r="54" 
            className="ring-fg" 
            style={{ 
              stroke: ring.color,
              strokeDasharray: circumference,
              strokeDashoffset: animate ? offset : circumference
            }} 
          />
        </svg>
        <span className="ring-text">{ring.prefix}{ring.val}%</span>
      </div>
      <h4>{ring.name}</h4>
      <p>{ring.desc}</p>
    </div>
  );
};
