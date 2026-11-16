import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ContactGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera - Perspective, looking slightly downward
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 8);
    camera.lookAt(0, -1, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Center glow: radial gradient PointLight at y: -3, color #ff5c00, intensity 2, distance 12
    const centerLight = new THREE.PointLight(0xff5c00, 2, 12);
    centerLight.position.set(0, -3, 0);
    scene.add(centerLight);

    // 5. Grid Helper (20x20 cells, tilted 35deg on X)
    const gridSize = 24;
    const gridDivisions = 24;
    const gridColor = 0xff5c00;
    
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
    gridHelper.position.set(0, -1.5, 0); // Position grid slightly down
    gridHelper.rotation.x = Math.PI * 35 / 180; // Tilt ~35 degrees
    
    // Customize Grid Material
    const gridMaterial = gridHelper.material as THREE.LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.12;
    scene.add(gridHelper);

    // 6. Scan Line Effect: Simple & Elegant (1 Bottom-to-Top, 1 Left-to-Right)
    const lineGeoZ = new THREE.BoxGeometry(gridSize, 0.04, 0.04);
    const lineGeoX = new THREE.BoxGeometry(0.04, 0.04, gridSize);

    const lineMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.0
    });

    const scanLineZ = new THREE.Mesh(lineGeoZ, lineMat);
    const scanLineX = new THREE.Mesh(lineGeoX, lineMat);

    gridHelper.add(scanLineZ);
    gridHelper.add(scanLineX);

    // 7. Animation Loop
    let animationFrameId: number;
    const duration = 7200; // Calmer 7.2-second cycle

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const progress = (Date.now() % duration) / duration; // 0.0 to 1.0
      const halfSize = gridSize / 2;

      // Z-axis sweep (Bottom to Top)
      const localZ = halfSize - progress * gridSize;
      scanLineZ.position.set(0, 0.02, localZ);

      // X-axis sweep (Left to Right)
      const localX = -halfSize + progress * gridSize;
      scanLineX.position.set(localX, 0.02, 0);

      // Fade opacity in and out using a smooth sine curve
      lineMat.opacity = Math.sin(progress * Math.PI) * 0.38;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      gridHelper.geometry.dispose();
      gridMaterial.dispose();
      lineGeoZ.dispose();
      lineGeoX.dispose();
      lineMat.dispose();
      
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

export default React.memo(ContactGrid);
