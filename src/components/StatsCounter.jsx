import React, { useEffect, useState, useRef } from 'react';

const StatsCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          triggerCount();
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
  }, [target]);

  const triggerCount = () => {
    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = Math.max(Math.floor(duration / target), 30);
    
    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepTime);
  };

  return (
    <span ref={elementRef} className="stat-num">
      {count}{suffix}
    </span>
  );
};

export default StatsCounter;
