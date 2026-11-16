import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Mobile screen check
    const checkIsMobile = () => window.innerWidth < 900;
    if (checkIsMobile()) {
      return; // Disable entirely on mobile
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Setup Scene
    const scene = new THREE.Scene();

    // 3. Setup Camera (Perspective, z: 5, fov: 75)
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);

    // 4. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 5. Generate Particle Data
    const count = 2800;
    const initialPositions = new Float32Array(count * 3); // X, Y, Z target positions
    const currentPositions = new Float32Array(count * 3); // X, Y, Z active positions
    const velocities = new Float32Array(count * 2);       // VX, VY
    const phaseOffsets = new Float32Array(count);         // Sine offset for Y float
    const particleTypes = new Uint8Array(count);          // 0 = small orange, 1 = larger cyan

    // Distribute 2200 small dots (type 0) and 600 larger dots (type 1)
    for (let i = 0; i < count; i++) {
      // x: -30 to 30, y: -15 to 15, z: -8 to 2
      const x = Math.random() * 60 - 30;
      const y = Math.random() * 30 - 15;
      const z = Math.random() * 10 - 8;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      currentPositions[i * 3] = x;
      currentPositions[i * 3 + 1] = y;
      currentPositions[i * 3 + 2] = z;

      velocities[i * 2] = 0;
      velocities[i * 2 + 1] = 0;

      phaseOffsets[i] = Math.random() * Math.PI * 2;
      particleTypes[i] = i < 2200 ? 0 : 1;
    }

    // 6. Create Buffer Geometries
    const orangeGeometry = new THREE.BufferGeometry();
    const cyanGeometry = new THREE.BufferGeometry();

    const orangeIndices: number[] = [];
    const cyanIndices: number[] = [];

    for (let i = 0; i < count; i++) {
      if (particleTypes[i] === 0) {
        orangeIndices.push(i);
      } else {
        cyanIndices.push(i);
      }
    }

    // We create subset buffer views for the two Point Systems
    const orangePositions = new Float32Array(orangeIndices.length * 3);
    const cyanPositions = new Float32Array(cyanIndices.length * 3);

    const updateSubsetArrays = () => {
      let oIdx = 0;
      let cIdx = 0;
      for (let i = 0; i < count; i++) {
        if (particleTypes[i] === 0) {
          orangePositions[oIdx++] = currentPositions[i * 3];
          orangePositions[oIdx++] = currentPositions[i * 3 + 1];
          orangePositions[oIdx++] = currentPositions[i * 3 + 2];
        } else {
          cyanPositions[cIdx++] = currentPositions[i * 3];
          cyanPositions[cIdx++] = currentPositions[i * 3 + 1];
          cyanPositions[cIdx++] = currentPositions[i * 3 + 2];
        }
      }
      orangeGeometry.setAttribute('position', new THREE.BufferAttribute(orangePositions, 3));
      cyanGeometry.setAttribute('position', new THREE.BufferAttribute(cyanPositions, 3));
      orangeGeometry.attributes.position.needsUpdate = true;
      cyanGeometry.attributes.position.needsUpdate = true;
    };

    updateSubsetArrays();

    // Materials
    // 1. 2200 small round dots - PointsMaterial size 0.04, #ff5c00, opacity 0.5
    const orangeMaterial = new THREE.PointsMaterial({
      color: 0xff5c00,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false
    });

    // 2. 600 slightly larger dots - PointsMaterial size 0.07, #00e5ff, opacity 0.35
    const cyanMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.07,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false
    });

    const orangePoints = new THREE.Points(orangeGeometry, orangeMaterial);
    const cyanPoints = new THREE.Points(cyanGeometry, cyanMaterial);

    scene.add(orangePoints);
    scene.add(cyanPoints);

    // 8. Animation Loop
    let animationFrameId: number;
    let time = 0;
    let driftOffset = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.02; // Slow time step
      
      // Drift slowly rightward (0.0003 per frame)
      driftOffset += 0.0003;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const i2 = i * 2;

        const initX = initialPositions[i3];
        const initY = initialPositions[i3 + 1];
        const pz = initialPositions[i3 + 2];

        // Apply drift and wrap X back if out of bounds [-30, 30]
        let targetX = initX + driftOffset;
        if (targetX > 30) {
          targetX = -30 + ((targetX - 30) % 60);
        }

        // Apply sinus Y float (sin(time + phase) * 0.002 per step or absolute float)
        const targetY = initY + Math.sin(time + phaseOffsets[i]) * 0.08;

        const currX = currentPositions[i3];
        const currY = currentPositions[i3 + 1];

        // Physics: Spring back to target
        const springX = (targetX - currX) * 0.025;
        const springY = (targetY - currY) * 0.025;

        let vx = velocities[i2];
        let vy = velocities[i2 + 1];

        // Damping factor: 0.92
        vx = (vx + springX) * 0.92;
        vy = (vy + springY) * 0.92;

        // Update velocities
        velocities[i2] = vx;
        velocities[i2 + 1] = vy;

        // Apply velocities
        currentPositions[i3] = currX + vx;
        currentPositions[i3 + 1] = currY + vy;
        currentPositions[i3 + 2] = pz; // Z is static in depth
      }

      // Sync data to geometries
      updateSubsetArrays();

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      orangeGeometry.dispose();
      cyanGeometry.dispose();
      orangeMaterial.dispose();
      cyanMaterial.dispose();
      
      renderer.dispose();
      if (container && renderer.domElement.parentNode) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden bg-transparent"
      style={{ willChange: 'transform' }}
    />
  );
};

export default React.memo(HeroParticles);
