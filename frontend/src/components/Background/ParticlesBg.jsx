import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBg() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: ["#60a5fa", "#facc15", "#fff"] }, // azul, dorado, blanco
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 3, random: true },
          move: { enable: true, speed: 1, direction: "none", outModes: "out" },
          links: {
            enable: true,
            color: "#60a5fa",
            distance: 120,
            opacity: 0.2,
            width: 1,
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}