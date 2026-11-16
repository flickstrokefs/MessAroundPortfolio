import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const OrbitScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect mobile size
    const checkIsMobile = () => window.innerWidth < 900;
    let isMobile = checkIsMobile();

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera - Orthographic (no perspective distortion)
    const aspect = 1;
    const viewSize = 14;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect / 2,
      viewSize * aspect / 2,
      viewSize / 2,
      -viewSize / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(420, 420);
    container.appendChild(renderer.domElement);

    // Group for entire scene to apply global tilt/rotation
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 50);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Helpers to create Torus Orbit Rings
    const createRing = (radius: number, color: string, opacity: number, rotationX: number) => {
      const geometry = new THREE.TorusGeometry(radius, 0.012, 16, 100);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: opacity
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = rotationX;
      return { mesh, geometry, material };
    };

    // Helpers to create Orbiting Dots
    const createDot = (color: string) => {
      const geometry = new THREE.SphereGeometry(0.12, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: 2.5,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      return { mesh, geometry, material };
    };

    // Create central Rocket Sprite (Dead Center)
    const createEmojiTexture = (emoji: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '72px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    };

    const rocketTexture = createEmojiTexture('🚀');
    const spriteMaterial = new THREE.SpriteMaterial({ map: rocketTexture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.2, 1.2, 1);
    sprite.position.set(0, 0, 0); // Sits dead center
    sceneGroup.add(sprite);

    // Manage objects list for animation and disposal
    const rings: THREE.Mesh[] = [];
    const dots: THREE.Mesh[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    geometriesToDispose.push(sprite.geometry);
    materialsToDispose.push(spriteMaterial);
    rocketTexture.dispose();

    // Define Ring Configuration Parameters
    // Ring 1 (orange): radius 5.5, tilt 15deg on X, rotation speed 0.004
    // Ring 2 (cyan): radius 4.0, tilt -10deg on X, rotation speed -0.007
    // Ring 3 (lime): radius 2.8, flat (0 tilt) on X, rotation speed 0.011
    const ringConfigs = [
      { radius: 5.5, color: '#ff5c00', opacity: 0.4, rotationX: Math.PI * 15 / 180, speed: 0.004 },
      { radius: 4.0, color: '#00e5ff', opacity: 0.4, rotationX: -Math.PI * 10 / 180, speed: -0.007 },
      { radius: 2.8, color: '#b8ff00', opacity: 0.4, rotationX: 0, speed: 0.011 }
    ];

    // Build the items based on screen size
    const buildScene = () => {
      // Clear old meshes
      rings.forEach(r => sceneGroup.remove(r));
      dots.forEach(d => sceneGroup.remove(d));
      rings.length = 0;
      dots.length = 0;

      if (isMobile) {
        // Mobile has only 1 ring (Ring 2 config)
        const conf = ringConfigs[1];
        const r = createRing(conf.radius, conf.color, conf.opacity, conf.rotationX);
        sceneGroup.add(r.mesh);
        rings.push(r.mesh);
        geometriesToDispose.push(r.geometry);
        materialsToDispose.push(r.material);

        const d = createDot(conf.color);
        sceneGroup.add(d.mesh);
        dots.push(d.mesh);
        geometriesToDispose.push(d.geometry);
        materialsToDispose.push(d.material);
      } else {
        // Desktop has all 3 rings
        ringConfigs.forEach((conf) => {
          const r = createRing(conf.radius, conf.color, conf.opacity, conf.rotationX);
          sceneGroup.add(r.mesh);
          rings.push(r.mesh);
          geometriesToDispose.push(r.geometry);
          materialsToDispose.push(r.material);

          const d = createDot(conf.color);
          sceneGroup.add(d.mesh);
          dots.push(d.mesh);
          geometriesToDispose.push(d.geometry);
          materialsToDispose.push(d.material);
        });
      }
    };

    buildScene();

    // Animation variables
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 1;

      // Global slow Y-axis rotation at 0.002 rad/frame
      sceneGroup.rotation.y += 0.002;

      if (isMobile) {
        // Mobile Animation: 1 Ring (Ring 2 configuration)
        const conf = ringConfigs[1];
        if (rings[0] && dots[0]) {
          rings[0].rotation.z += conf.speed;

          const angle = time * conf.speed;
          const x = Math.cos(angle) * conf.radius;
          const y = Math.sin(angle) * conf.radius;

          const localPos = new THREE.Vector3(x, y, 0);
          localPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), conf.rotationX);
          dots[0].position.copy(localPos);
        }
      } else {
        // Desktop Animation: 3 Rings
        ringConfigs.forEach((conf, idx) => {
          if (rings[idx] && dots[idx]) {
            rings[idx].rotation.z += conf.speed;

            const angle = time * conf.speed;
            const x = Math.cos(angle) * conf.radius;
            const y = Math.sin(angle) * conf.radius;

            const localPos = new THREE.Vector3(x, y, 0);
            localPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), conf.rotationX);
            dots[idx].position.copy(localPos);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resizing
    const handleResize = () => {
      const parentIsMobile = checkIsMobile();
      if (parentIsMobile !== isMobile) {
        isMobile = parentIsMobile;
        buildScene();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      geometriesToDispose.forEach(g => g.dispose());
      materialsToDispose.forEach(m => m.dispose());
      
      renderer.dispose();
      if (container && renderer.domElement.parentNode) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute right-[6vw] top-1/2 -translate-y-1/2 w-[420px] h-[420px] z-10 pointer-events-none select-none hidden min-[900px]:block"
      style={{ willChange: 'transform' }}
    />
  );
};

export default React.memo(OrbitScene);
