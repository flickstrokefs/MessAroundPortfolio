import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CircuitNode {
  id: number;
  x: number;
  y: number;
  col: number;
  row: number;
  neighbors: number[];
}

interface PulseInstance {
  path: CircuitNode[];
  segmentIndex: number;
  progress: number;
  mesh: THREE.Mesh;
}

interface Connection {
  nodeA: CircuitNode;
  nodeB: CircuitNode;
}

export const CircuitBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Mobile screen check
    const checkIsMobile = () => window.innerWidth < 900;
    if (checkIsMobile()) {
      return; // Disabled on mobile
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Setup Scene
    const scene = new THREE.Scene();

    // 3. Setup Camera (Orthographic flat top-down view)
    const aspect = window.innerWidth / window.innerHeight;
    const viewHeight = 22; // Height of view in world units
    const camera = new THREE.OrthographicCamera(
      -viewHeight * aspect / 2,
      viewHeight * aspect / 2,
      viewHeight / 2,
      -viewHeight / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // 4. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 0, 8);
    scene.add(dirLight);

    // 5. Generate Procedural Grid (Expanded: 58 x 36 to cover wide viewports)
    const cols = 58;
    const rows = 36;
    const spacingX = 0.85;
    const spacingY = 0.85;
    const jitter = 0.25;

    const nodes: CircuitNode[] = [];
    const nodeMap: (CircuitNode | null)[][] = Array(cols).fill(null).map(() => Array(rows).fill(null));

    let idCounter = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Center the grid around origin
        const baseX = (c - cols / 2) * spacingX;
        const baseY = (r - rows / 2) * spacingY;

        // Apply ±jitter
        const x = baseX + (Math.random() * 2 - 1) * jitter;
        const y = baseY + (Math.random() * 2 - 1) * jitter;

        const node: CircuitNode = {
          id: idCounter++,
          x,
          y,
          col: c,
          row: r,
          neighbors: []
        };

        nodes.push(node);
        nodeMap[c][r] = node;
      }
    }

    // Connect nodes with 60% probability
    const connectionProb = 0.6;
    const connections: Connection[] = [];
    const lineSegmentsPoints: THREE.Vector3[] = [];
    const lineSegmentsColors: number[] = [];

    const cyanColor = new THREE.Color('#00e5ff');
    const orangeColor = new THREE.Color('#ff5c00');

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const node = nodeMap[c][r];
        if (!node) continue;

        // Try connecting to right neighbor (c + 1, r)
        if (c < cols - 1) {
          const rightNode = nodeMap[c + 1][r];
          if (rightNode && Math.random() < connectionProb) {
            node.neighbors.push(rightNode.id);
            rightNode.neighbors.push(node.id);

            connections.push({ nodeA: node, nodeB: rightNode });

            // Initial points
            lineSegmentsPoints.push(new THREE.Vector3(node.x, node.y, 0));
            lineSegmentsPoints.push(new THREE.Vector3(rightNode.x, rightNode.y, 0));

            // Color assignment (20% orange, 80% cyan)
            const color = Math.random() < 0.2 ? orangeColor : cyanColor;
            lineSegmentsColors.push(color.r, color.g, color.b);
            lineSegmentsColors.push(color.r, color.g, color.b);
          }
        }

        // Try connecting to top neighbor (c, r + 1)
        if (r < rows - 1) {
          const topNode = nodeMap[c][r + 1];
          if (topNode && Math.random() < connectionProb) {
            node.neighbors.push(topNode.id);
            topNode.neighbors.push(node.id);

            connections.push({ nodeA: node, nodeB: topNode });

            lineSegmentsPoints.push(new THREE.Vector3(node.x, node.y, 0));
            lineSegmentsPoints.push(new THREE.Vector3(topNode.x, topNode.y, 0));

            const color = Math.random() < 0.2 ? orangeColor : cyanColor;
            lineSegmentsColors.push(color.r, color.g, color.b);
            lineSegmentsColors.push(color.r, color.g, color.b);
          }
        }
      }
    }

    // Create Line Segments Mesh
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(lineSegmentsPoints);
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineSegmentsColors, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42, // Brighter lines
      linewidth: 1
    });
    const circuitLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(circuitLines);

    // Instanced Mesh for junction dots
    const dotGeometry = new THREE.SphereGeometry(0.048, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.65 // Brighter dots
    });
    const junctionDots = new THREE.InstancedMesh(dotGeometry, dotMaterial, nodes.length);

    const dummy = new THREE.Object3D();
    nodes.forEach((n, idx) => {
      dummy.position.set(n.x, n.y, 0);
      dummy.updateMatrix();
      junctionDots.setMatrixAt(idx, dummy.matrix);
    });
    scene.add(junctionDots);

    // Personalization: Custom Canvas-Textured Microchips in background
    const createChipTexture = (label1: string, label2: string, label3: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dark background
        ctx.fillStyle = '#0b0b14';
        ctx.fillRect(0, 0, 256, 256);

        // Tech borders
        ctx.strokeStyle = '#ff5c00';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 240, 240);

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(16, 16, 224, 224);

        // Pin leads on all 4 edges
        ctx.fillStyle = '#666680';
        for (let i = 40; i < 220; i += 36) {
          ctx.fillRect(i - 6, 0, 12, 10); // Top
          ctx.fillRect(i - 6, 246, 12, 10); // Bottom
          ctx.fillRect(0, i - 6, 10, 12); // Left
          ctx.fillRect(246, i - 6, 10, 12); // Right
        }

        // Chip markings
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label1, 128, 80);

        ctx.fillStyle = '#00e5ff';
        ctx.font = '16px monospace';
        ctx.fillText(label2, 128, 128);

        ctx.fillStyle = '#ff5c00';
        ctx.font = '14px monospace';
        ctx.fillText(label3, 128, 176);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const chipGeo = new THREE.PlaneGeometry(2.3, 2.3);

    // Chip 1 (Top Left area)
    const chipTex1 = createChipTexture('SUDHANSHU', 'STM32 / MCU', 'CORE v2.0');
    const chipMat1 = new THREE.MeshBasicMaterial({ map: chipTex1, transparent: true, opacity: 0.8 });
    const chip1 = new THREE.Mesh(chipGeo, chipMat1);
    chip1.position.set(-11, 5, -0.05);
    scene.add(chip1);

    // Chip 2 (Bottom Right area)
    const chipTex2 = createChipTexture('NEURONODE', 'KICAD / HW', 'SYS_ACTIVE');
    const chipMat2 = new THREE.MeshBasicMaterial({ map: chipTex2, transparent: true, opacity: 0.8 });
    const chip2 = new THREE.Mesh(chipGeo, chipMat2);
    chip2.position.set(11, -5.5, -0.05);
    scene.add(chip2);

    // 6. Pulse Animation Setup (More movement: max 14 pulses)
    const maxPulses = 14;
    const pulses: PulseInstance[] = [];

    const pulseGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const pulseMaterial = new THREE.MeshStandardMaterial({
      color: 0xb8ff00,
      emissive: 0xb8ff00,
      emissiveIntensity: 4.0, // Brighter pulses
      roughness: 0.1,
      metalness: 0.9
    });

    const generatePath = (): CircuitNode[] | null => {
      const nodesWithNeighbors = nodes.filter(n => n.neighbors.length > 0);
      if (nodesWithNeighbors.length === 0) return null;

      const startNode = nodesWithNeighbors[Math.floor(Math.random() * nodesWithNeighbors.length)];
      const path: CircuitNode[] = [startNode];
      const visited = new Set<number>([startNode.id]);

      const targetLength = Math.floor(Math.random() * 5) + 4; // 4 to 8 nodes

      let currentNode = startNode;
      while (path.length < targetLength) {
        const validNeighbors = currentNode.neighbors
          .map(nid => nodes[nid])
          .filter(n => !visited.has(n.id));

        if (validNeighbors.length === 0) break;

        const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
        path.push(next);
        visited.add(next.id);
        currentNode = next;
      }

      return path.length >= 3 ? path : null;
    };

    const spawnPulse = () => {
      if (pulses.length >= maxPulses) return;

      const path = generatePath();
      if (!path) return;

      const mesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
      mesh.position.set(path[0].x, path[0].y, 0.05);
      scene.add(mesh);

      pulses.push({
        path,
        segmentIndex: 0,
        progress: 0,
        mesh
      });
    };

    // Spawn initial pulses
    for (let i = 0; i < 6; i++) {
      spawnPulse();
    }

    let lastPulseSpawn = 0;

    // Mouse Tracking Logic
    const mouse = new THREE.Vector2(-9999, -9999);
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      const worldX = x * ((camera.right - camera.left) / 2) + (camera.right + camera.left) / 2;
      const worldY = y * ((camera.top - camera.bottom) / 2) + (camera.top + camera.bottom) / 2;
      
      mouse.set(worldX, worldY);
    };

    const onMouseLeave = () => {
      mouse.set(-9999, -9999);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // 7. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = Date.now();
      // Spawn pulse check every 700ms (more frequent)
      if (now - lastPulseSpawn > 700) {
        spawnPulse();
        lastPulseSpawn = now;
      }

      // Generate current coordinates with organic ripple physics
      const timeSec = now * 0.001;
      const currentCoords = nodes.map(node => {
        // Slow grid wave movement
        const moveX = Math.sin(timeSec * 0.55 + node.y * 0.28) * 0.16;
        const moveY = Math.cos(timeSec * 0.55 + node.x * 0.28) * 0.16;
        return {
          x: node.x + moveX,
          y: node.y + moveY
        };
      });

      // Update line segments positions
      const posAttr = lineGeometry.attributes.position;
      const posArray = posAttr.array as Float32Array;
      let pIdx = 0;

      connections.forEach(conn => {
        const coordA = currentCoords[conn.nodeA.id];
        const coordB = currentCoords[conn.nodeB.id];

        posArray[pIdx++] = coordA.x;
        posArray[pIdx++] = coordA.y;
        posArray[pIdx++] = 0;

        posArray[pIdx++] = coordB.x;
        posArray[pIdx++] = coordB.y;
        posArray[pIdx++] = 0;
      });
      posAttr.needsUpdate = true;

      // Update active pulses along shifting coordinates
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        
        const nodeA = pulse.path[pulse.segmentIndex];
        const nodeB = pulse.path[pulse.segmentIndex + 1];
        const coordA = currentCoords[nodeA.id];
        const coordB = currentCoords[nodeB.id];

        const dx = coordB.x - coordA.x;
        const dy = coordB.y - coordA.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Speed is slightly faster for more dynamic motion
        const speed = 0.18 / (dist || 1);
        pulse.progress += speed;

        if (pulse.progress >= 1.0) {
          pulse.segmentIndex++;
          pulse.progress = 0;
        }

        if (pulse.segmentIndex >= pulse.path.length - 1) {
          scene.remove(pulse.mesh);
          pulses.splice(i, 1);
        } else {
          const currentA = currentCoords[pulse.path[pulse.segmentIndex].id];
          const currentB = currentCoords[pulse.path[pulse.segmentIndex + 1].id];
          const x = currentA.x + (currentB.x - currentA.x) * pulse.progress;
          const y = currentA.y + (currentB.y - currentA.y) * pulse.progress;
          
          pulse.mesh.position.set(x, y, 0.05);
        }
      }

      // Update junction dots instance matrices with mouse repulsion
      nodes.forEach((node) => {
        const coord = currentCoords[node.id];
        const baseX = coord.x;
        const baseY = coord.y;
        
        const dx = mouse.x - baseX;
        const dy = mouse.y - baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let offsetX = 0;
        let offsetY = 0;
        
        const repulsionRadius = 3.5;
        if (dist < repulsionRadius) {
          const force = (1.0 - dist / repulsionRadius) * 0.45;
          const angle = Math.atan2(baseY - mouse.y, baseX - mouse.x);
          offsetX = Math.cos(angle) * force;
          offsetY = Math.sin(angle) * force;
        }
        
        dummy.position.set(baseX + offsetX, baseY + offsetY, 0);
        dummy.updateMatrix();
        junctionDots.setMatrixAt(node.id, dummy.matrix);
      });
      junctionDots.instanceMatrix.needsUpdate = true;

      // Pulse microchip visual scale/rotation subtly
      chip1.rotation.z = Math.sin(timeSec * 0.2) * 0.02;
      chip2.rotation.z = Math.cos(timeSec * 0.2) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const newAspect = width / height;
      camera.left = -viewHeight * newAspect / 2;
      camera.right = viewHeight * newAspect / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);

      lineGeometry.dispose();
      lineMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();

      chipGeo.dispose();
      chipMat1.dispose();
      chipMat2.dispose();
      chipTex1.dispose();
      chipTex2.dispose();

      pulses.forEach(p => scene.remove(p.mesh));

      renderer.dispose();
      if (container && renderer.domElement.parentNode) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden bg-transparent"
      style={{ willChange: 'transform', opacity: 0.35 }}
    />
  );
};

export default React.memo(CircuitBackground);
