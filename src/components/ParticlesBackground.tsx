"use client";

import { useState, useEffect } from "react";
import Particles from "@/components/Particles";

export default function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);
  
  // Hydration fix for server/client mismatch with WebGL content
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Particles 
      particleCount={2400}
      particleColors={["#5d8cb3", "#4ac29a", "#7d62de","#00BFFF"]}
      particleSpread={40}
      speed={0.03}
      particleBaseSize={600}
      moveParticlesOnHover={true}
      particleHoverFactor={0.5}
      alphaParticles={true}
      sizeRandomness={1.1}
    />
  );
} 