import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ProjectsParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera - Perspective, positioned slightly in front of 0
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, -10);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. Generate Particle Data
    const count = 1500;
    const orangeCount = Math.floor(count * 0.6); // 900
    const cyanCount = count - orangeCount;       // 600

    const orangePositions = new Float32Array(orangeCount * 3);
    const cyanPositions = new Float32Array(cyanCount * 3);

    const initializePosition = (arr: Float32Array, idx: number) => {
      // Wide spread on X/Y so they fill the screen, deep spread on Z
      arr[idx * 3] = (Math.random() - 0.5) * 16;
      arr[idx * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[idx * 3 + 2] = Math.random() * -20; // z: -20 to 0
    };

    // Initialize arrays
    for (let i = 0; i < orangeCount; i++) {
      initializePosition(orangePositions, i);
    }
    for (let i = 0; i < cyanCount; i++) {
      initializePosition(cyanPositions, i);
    }

    // Geometries
    const orangeGeometry = new THREE.BufferGeometry();
    orangeGeometry.setAttribute('position', new THREE.BufferAttribute(orangePositions, 3));

    const cyanGeometry = new THREE.BufferGeometry();
    cyanGeometry.setAttribute('position', new THREE.BufferAttribute(cyanPositions, 3));

    // Materials - Using sizeAttenuation for natural depth size scaling
    const orangeMaterial = new THREE.PointsMaterial({
      color: 0xff5c00,
      size: 0.12, // Base size
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      depthWrite: false
    });

    const cyanMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.12, // Base size
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      depthWrite: false
    });

    const orangePoints = new THREE.Points(orangeGeometry, orangeMaterial);
    const cyanPoints = new THREE.Points(cyanGeometry, cyanMaterial);

    scene.add(orangePoints);
    scene.add(cyanPoints);

    // 5. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate particle systems slowly to simulate night sky rotation
      orangePoints.rotation.z += 0.0002;
      cyanPoints.rotation.z += 0.00015;

      // Move orange particles with slow diagonal drift
      const orangePositionsAttr = orangeGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < orangeCount; i++) {
        orangePositionsAttr[i * 3] += 0.0012; // dx
        orangePositionsAttr[i * 3 + 1] += 0.0006; // dy
        
        // Wrap around horizontal and vertical bounds
        if (orangePositionsAttr[i * 3] > 10) {
          orangePositionsAttr[i * 3] = -10;
        }
        if (orangePositionsAttr[i * 3 + 1] > 8) {
          orangePositionsAttr[i * 3 + 1] = -8;
        }
      }
      orangeGeometry.attributes.position.needsUpdate = true;

      // Move cyan particles with different slow diagonal drift (creates depth parallax)
      const cyanPositionsAttr = cyanGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < cyanCount; i++) {
        cyanPositionsAttr[i * 3] += 0.0018; // dx
        cyanPositionsAttr[i * 3 + 1] += 0.0009; // dy
        
        if (cyanPositionsAttr[i * 3] > 10) {
          cyanPositionsAttr[i * 3] = -10;
        }
        if (cyanPositionsAttr[i * 3 + 1] > 8) {
          cyanPositionsAttr[i * 3 + 1] = -8;
        }
      }
      cyanGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup
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
      className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden bg-transparent opacity-60"
      style={{ willChange: 'transform' }}
    />
  );
};

export default React.memo(ProjectsParticles);
