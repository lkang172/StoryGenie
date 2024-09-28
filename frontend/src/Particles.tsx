// Particles.tsx
import React, { useEffect, useRef, useState } from 'react';
import particlesJS from 'particles.js';
import Stats from 'stats.js';

const Particles: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [particleCount, setParticleCount] = useState<number>(0);

  useEffect(() => {
    if (!particlesRef.current || !statsRef.current) return;

    // Particles.js configuration
    particlesJS(particlesRef.current.id, {
      // ... (keep the existing particles configuration)
    });

    // Stats.js setup
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom    statsRef.current.appendChild(stats.dom);

    const update = () => {
      stats.begin();
      stats.end();
      if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
        setParticleCount(window.pJSDom[0].pJS.particles.array.length);
      }
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    // Cleanup function
    return () => {
      if (statsRef.current && statsRef.current.contains(stats.dom)) {
        statsRef.current.removeChild(stats.dom);
      }
    };
  }, []);

  return (
    <>
      <div id="particles-js" ref={particlesRef}></div>
      <div ref={statsRef} style={{ position: 'absolute', left: '0px', top: '0px' }}></div>
      <div className="count-particles">
        <span className="js-count-particles">{particleCount}</span> particles
      </div>
    </>
  );
};

export default Particles;