import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useModelSettings } from "../contexts/ModelSettingsContext";

export function InteractiveScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useModelSettings();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, 8.5);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isMobile;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // Glowing Neon lights reflecting off elements
    const blueLight = new THREE.PointLight(0x3b82f6, 12, 15);
    blueLight.position.set(-3, 3, 2);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 15, 12);
    cyanLight.position.set(3, -2, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 8, 10);
    purpleLight.position.set(0, 4, -2);
    scene.add(purpleLight);

    // --- Grid Floor (Sci-Fi Data Matrix Landscape) ---
    const gridHelper = new THREE.GridHelper(24, 36, 0x06b6d4, 0x1e293b);
    gridHelper.position.set(0, -2.2, 0);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // --- Dynamic Holographic Screens with Live Text Canvas ---
    const createCodeTexture = (colorStr: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      return { canvas, ctx, texture: new THREE.CanvasTexture(canvas) };
    };

    const screen1 = createCodeTexture("#00ffff");
    const screen2 = createCodeTexture("#3b82f6");

    const screenMaterial1 = new THREE.MeshBasicMaterial({
      map: screen1.texture,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const screenMaterial2 = new THREE.MeshBasicMaterial({
      map: screen2.texture,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Outer framing for the floating holograms
    const screenGeo = new THREE.PlaneGeometry(1.6, 0.95);
    const hologramScreenL = new THREE.Mesh(screenGeo, screenMaterial1);
    const hologramScreenR = new THREE.Mesh(screenGeo, screenMaterial2);

    hologramScreenL.position.set(-1.3, 0.4, 1.2);
    hologramScreenL.rotation.set(0, Math.PI / 6, 0);
    hologramScreenR.position.set(1.3, 0.4, 1.2);
    hologramScreenR.rotation.set(0, -Math.PI / 6, 0);

    scene.add(hologramScreenL);
    scene.add(hologramScreenR);

    // Thin glowing frames around screens
    const frameGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.8, -0.475, 0),
      new THREE.Vector3(0.8, -0.475, 0),
      new THREE.Vector3(0.8, 0.475, 0),
      new THREE.Vector3(-0.8, 0.475, 0),
      new THREE.Vector3(-0.8, -0.475, 0),
    ]);
    const frameMatL = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
    const frameMatR = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
    const frameL = new THREE.Line(frameGeo, frameMatL);
    const frameR = new THREE.Line(frameGeo, frameMatR);
    hologramScreenL.add(frameL);
    hologramScreenR.add(frameR);

    // --- Interactive Globe in Background (Holographic Nodes) ---
    const globeGroup = new THREE.Group();
    globeGroup.position.set(2.4, 1.2, -3);
    scene.add(globeGroup);

    const globeGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Glowing network node points on the globe
    const nodeCount = isMobile ? 15 : 30;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeSpeeds: number[] = [];
    const r = 1.6;

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      nodePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      nodePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      nodePositions[i * 3 + 2] = r * Math.cos(phi);
      nodeSpeeds.push(Math.random() * 0.02 + 0.01);
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
    });
    const globeNodes = new THREE.Points(nodeGeo, nodeMat);
    globeGroup.add(globeNodes);

    // --- Glowing Cloud Server Nodes (Mainframes) ---
    const serverGroup = new THREE.Group();
    serverGroup.position.set(-2.8, -0.6, -2);
    scene.add(serverGroup);

    const serverGeo = new THREE.BoxGeometry(0.8, 1.4, 0.8);
    const serverMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c0c0e,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8,
      transmission: 0.3,
      thickness: 0.2,
    });
    const serverBody = new THREE.Mesh(serverGeo, serverMat);
    serverGroup.add(serverBody);

    // Server blinking LED dots
    const ledCount = 12;
    const ledPositions = new Float32Array(ledCount * 3);
    for (let i = 0; i < ledCount; i++) {
      // Front face indicator lights
      ledPositions[i * 3] = (Math.random() - 0.5) * 0.5;
      ledPositions[i * 3 + 1] = -0.6 + i * 0.11;
      ledPositions[i * 3 + 2] = 0.41;
    }
    const ledGeo = new THREE.BufferGeometry();
    ledGeo.setAttribute("position", new THREE.BufferAttribute(ledPositions, 3));
    const ledMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });
    // Create random colors (emerald green, amber, red)
    const ledColors = new Float32Array(ledCount * 3);
    for (let i = 0; i < ledCount * 3; i += 3) {
      if (Math.random() < 0.6) {
        ledColors[i] = 0.06; ledColors[i + 1] = 0.71; ledColors[i + 2] = 0.44; // Green
      } else {
        ledColors[i] = 0.93; ledColors[i + 1] = 0.27; ledColors[i + 2] = 0.27; // Red
      }
    }
    ledGeo.setAttribute("color", new THREE.BufferAttribute(ledColors, 3));
    const serverLeds = new THREE.Points(ledGeo, ledMat);
    serverGroup.add(serverLeds);

    // Glowing server stand frames
    const standGeo = new THREE.BoxGeometry(0.85, 1.45, 0.85);
    const standMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const serverStand = new THREE.Mesh(standGeo, standMat);
    serverGroup.add(serverStand);

    // --- Vertical Volumetric Light Beams (Cloud Upload) ---
    const createLightBeam = (color: number) => {
      const beamGeo = new THREE.CylinderGeometry(0.1, 0.6, 6, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(beamGeo, beamMat);
    };
    const serverBeam = createLightBeam(0x06b6d4);
    serverBeam.position.set(-2.8, 2.4, -2);
    scene.add(serverBeam);

    const globeBeam = createLightBeam(0x3b82f6);
    globeBeam.position.set(2.4, 4.2, -3);
    scene.add(globeBeam);

    // --- Cyber Hologram Engineer Avatar ---
    const engineerGroup = new THREE.Group();
    engineerGroup.position.set(0, -0.6, 0.5);
    scene.add(engineerGroup);

    // Wireframe Torso Shape
    const torsoGeo = new THREE.ConeGeometry(0.58, 1.25, 6, 4);
    const torsoMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0, 0);
    engineerGroup.add(torso);

    // Neon Solid Visor Head
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.8,
      thickness: 0.3,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.9, 0);
    engineerGroup.add(head);

    // Visor Mask
    const visorGeo = new THREE.SphereGeometry(0.33, 16, 8, 0, Math.PI, 0.3, Math.PI / 2);
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.9, 0.02);
    visor.rotation.y = -Math.PI / 2;
    engineerGroup.add(visor);

    // Visor LED Scan Beam
    const visorLedGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
    const visorLedMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, toneMapped: false });
    const visorLedL = new THREE.Mesh(visorLedGeo, visorLedMat);
    const visorLedR = new THREE.Mesh(visorLedGeo, visorLedMat);
    visorLedL.position.set(0.1, 0.92, 0.3);
    visorLedR.position.set(-0.1, 0.92, 0.3);
    engineerGroup.add(visorLedL);
    engineerGroup.add(visorLedR);

    // Hologram Joints (Shoulders, elbows)
    const jointGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const jointMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.8 });
    const shoulderL = new THREE.Mesh(jointGeo, jointMat);
    const shoulderR = new THREE.Mesh(jointGeo, jointMat);
    shoulderL.position.set(-0.6, 0.45, -0.05);
    shoulderR.position.set(0.6, 0.45, -0.05);
    engineerGroup.add(shoulderL);
    engineerGroup.add(shoulderR);

    // Typing Cybernetic Hands
    const handGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const handMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, toneMapped: false });
    const handL = new THREE.Mesh(handGeo, handMat);
    const handR = new THREE.Mesh(handGeo, handMat);
    handL.position.set(-0.4, 0.1, 0.7);
    handR.position.set(0.4, 0.1, 0.7);
    engineerGroup.add(handL);
    engineerGroup.add(handR);

    // Cyber arms connection lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 });
    const makeArm = (joint: THREE.Mesh, hand: THREE.Mesh) => {
      const points = [joint.position, new THREE.Vector3((joint.position.x + hand.position.x) / 2, 0.2, (joint.position.z + hand.position.z) / 2), hand.position];
      const armGeo = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(armGeo, lineMat);
    };
    const armL = makeArm(shoulderL, handL);
    const armR = makeArm(shoulderR, handR);
    engineerGroup.add(armL);
    engineerGroup.add(armR);

    // --- Dynamic Flowing Particle Swarm (Cloud Networks) ---
    const swarmCount = isMobile ? 120 : 350;
    const swarmGeo = new THREE.BufferGeometry();
    const swarmPositions = new Float32Array(swarmCount * 3);
    const swarmAngles: number[] = [];
    const swarmSpeeds: number[] = [];
    const swarmRadii: number[] = [];
    const swarmHeights: number[] = [];

    for (let i = 0; i < swarmCount; i++) {
      swarmAngles.push(Math.random() * Math.PI * 2);
      swarmSpeeds.push(Math.random() * 0.008 + 0.003);
      swarmRadii.push(Math.random() * 2.8 + 1.2);
      swarmHeights.push((Math.random() - 0.5) * 4);
    }

    swarmGeo.setAttribute("position", new THREE.BufferAttribute(swarmPositions, 3));
    const swarmMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const swarmParticles = new THREE.Points(swarmGeo, swarmMat);
    scene.add(swarmParticles);

    // --- Network Links & Moving Data Packets ---
    const connectionLines: THREE.Line[] = [];
    const packetList: Array<{ mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }> = [];

    const createLink = (start: THREE.Vector3, end: THREE.Vector3) => {
      const linkGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const linkMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15 });
      const link = new THREE.Line(linkGeo, linkMat);
      scene.add(link);
      connectionLines.push(link);

      // Packet geometry
      const packetGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, toneMapped: false });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      scene.add(packetMesh);

      packetList.push({
        mesh: packetMesh,
        start,
        end,
        progress: Math.random(),
        speed: Math.random() * 0.008 + 0.005,
      });
    };

    // Connect Server to Engineer Workstation and Workstation to Globe
    createLink(new THREE.Vector3(-2.8, -0.6, -2), new THREE.Vector3(0, -0.3, 0.5));
    createLink(new THREE.Vector3(0, -0.3, 0.5), new THREE.Vector3(2.4, 1.2, -3));
    createLink(new THREE.Vector3(-2.8, 1, -2), new THREE.Vector3(2.4, 2.5, -3));

    // --- Interactive Mouse & Parallax State ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- Typing Animation & Canvas Screen Drawing Logic ---
    const lines1 = ["import { AI } from 'cyber-core';", "const network = new CoreNetwork();", "network.connect('cloud_edge');", "network.on('data', parseCV);", "initializing parsing context...", "accuracy = 0.85;", "system status: 100% stable", "SSM: 60 FPS INFERENCE"];
    const lines2 = ["// AgroMind tinyML configuration", "const model = TinyML.load('esp32');", "model.predict(soilMoisture);", "water_saved += 0.25;", "sehati_sensor.on('heart_rate');", "rPPG state-space running...", "STATUS: READY FOR WORK", "rank = Majorant_1st;"];

    let lineOffset1 = 0;
    let lineOffset2 = 4;
    let cursorPulse = 0;

    const updateCanvasScreen = (screen: ReturnType<typeof createCodeTexture>, lines: string[], offsetIdx: number, title: string) => {
      const ctx = screen.ctx;
      if (!ctx) return;
      ctx.clearRect(0, 0, 512, 256);

      // Cyber hologram styling
      ctx.fillStyle = "rgba(0, 5, 20, 0.3)";
      ctx.fillRect(0, 0, 512, 256);

      // Title Banner
      ctx.font = "bold 15px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`[ ${title} ]`, 25, 30);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.moveTo(25, 42);
      ctx.lineTo(487, 42);
      ctx.stroke();

      // Matrix lines
      ctx.font = "13px monospace";
      ctx.fillStyle = "#00ffcc";
      for (let i = 0; i < 6; i++) {
        const lineIdx = (offsetIdx + i) % lines.length;
        const text = lines[lineIdx];
        ctx.fillText(`> ${text}`, 30, 75 + i * 26);
      }

      // Live Telemetry bar
      ctx.fillStyle = "rgba(0, 255, 200, 0.15)";
      ctx.fillRect(25, 222, 462, 18);
      ctx.fillStyle = "#00ffaa";
      ctx.font = "11px monospace";
      const cursorText = cursorPulse > 20 ? "_" : " ";
      ctx.fillText(`MATRIX STATUS // SYS_READY // CONNECTED${cursorText}`, 35, 235);
      
      screen.texture.needsUpdate = true;
    };

    // --- Render Loop ---
    const clock = new THREE.Clock();
    let frameCount = 0;
    let animationId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      frameCount++;

      // 1. Mouse inertia tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 2. Cyber engineer look-at follow and breathing idle
      head.rotation.y = mouse.x * 0.35;
      head.rotation.x = -mouse.y * 0.2;
      visor.rotation.y = -Math.PI / 2 + mouse.x * 0.35;
      visor.rotation.z = mouse.y * 0.2;

      const breathe = Math.sin(elapsedTime * 2.2) * 0.06;
      engineerGroup.position.y = -0.6 + breathe;

      // Typing fingers animation
      handL.position.y = 0.12 + Math.sin(elapsedTime * 15) * 0.08;
      handR.position.y = 0.12 + Math.cos(elapsedTime * 15) * 0.08;

      // Arm connections reconstruction
      armL.geometry.dispose();
      armL.geometry = new THREE.BufferGeometry().setFromPoints([
        shoulderL.position,
        new THREE.Vector3(-0.5, 0.2 + breathe * 0.5, 0.3),
        handL.position
      ]);

      armR.geometry.dispose();
      armR.geometry = new THREE.BufferGeometry().setFromPoints([
        shoulderR.position,
        new THREE.Vector3(0.5, 0.2 + breathe * 0.5, 0.3),
        handR.position
      ]);

      // 3. Floating hologram screens hover tilt
      hologramScreenL.rotation.y = Math.PI / 6 + mouse.x * 0.08;
      hologramScreenL.rotation.x = -mouse.y * 0.08;
      hologramScreenR.rotation.y = -Math.PI / 6 + mouse.x * 0.08;
      hologramScreenR.rotation.x = -mouse.y * 0.08;

      // 4. Update dynamic screen canvases
      cursorPulse = (cursorPulse + 1) % 40;
      if (frameCount % 60 === 0) {
        lineOffset1++;
        if (Math.random() < 0.5) lineOffset2++;
      }
      updateCanvasScreen(screen1, lines1, lineOffset1, "SYSTEM ENGINE LOGS");
      updateCanvasScreen(screen2, lines2, lineOffset2, "CLOUDFLARE EDGE");

      // 5. Globe rotation & speeds
      globeGroup.rotation.y = elapsedTime * 0.06 + mouse.x * 0.12;
      globeGroup.rotation.x = elapsedTime * 0.02 + mouse.y * 0.08;

      // 6. Volumetric Beams pulsing
      serverBeam.scale.set(1 + Math.sin(elapsedTime * 3) * 0.05, 1, 1 + Math.sin(elapsedTime * 3) * 0.05);
      globeBeam.scale.set(1 + Math.cos(elapsedTime * 2) * 0.06, 1, 1 + Math.cos(elapsedTime * 2) * 0.06);

      // 7. Swirling Dynamic Particles Update
      const swarmArr = swarmParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < swarmCount; i++) {
        swarmAngles[i] += swarmSpeeds[i];
        swarmArr[i * 3] = Math.cos(swarmAngles[i]) * swarmRadii[i];
        swarmArr[i * 3 + 1] = swarmHeights[i] + Math.sin(elapsedTime * 0.5 + i) * 0.2;
        swarmArr[i * 3 + 2] = Math.sin(swarmAngles[i]) * swarmRadii[i] - 1;
      }
      swarmParticles.geometry.attributes.position.needsUpdate = true;

      // 8. Server LEDs flashing simulation
      const ledColorsArr = serverLeds.geometry.attributes.color.array as Float32Array;
      for (let i = 0; i < ledCount; i++) {
        if (Math.random() < 0.1) {
          // Toggle color state slightly (dim/bright)
          const idx = i * 3;
          ledColorsArr[idx + 1] = Math.random() < 0.6 ? 0.71 : 0.15; // Green channel flash
        }
      }
      serverLeds.geometry.attributes.color.needsUpdate = true;

      // 9. Flowing Data Packets
      packetList.forEach((packet) => {
        packet.progress += packet.speed;
        if (packet.progress > 1) {
          packet.progress = 0;
        }
        packet.mesh.position.lerpVectors(packet.start, packet.end, packet.progress);
        packet.mesh.position.y += Math.sin(packet.progress * Math.PI) * 0.15; // Small arc shape
      });

      // 10. Scroll storytelling pan
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
      camera.position.z = 8.5 - scrollPercent * 2.8;
      camera.position.y = 0.5 - scrollPercent * 1.5;
      camera.lookAt(new THREE.Vector3(0 - scrollPercent * 0.8, -scrollPercent * 1.0, 0));

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // --- Resize handler ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // --- Clean Up ---
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose elements
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();
      screenGeo.dispose();
      screenMaterial1.dispose();
      screenMaterial2.dispose();
      frameGeo.dispose();
      frameMatL.dispose();
      frameMatR.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      serverGeo.dispose();
      serverMat.dispose();
      ledGeo.dispose();
      ledMat.dispose();
      standGeo.dispose();
      standMat.dispose();
      serverBeam.geometry.dispose();
      (serverBeam.material as THREE.Material).dispose();
      globeBeam.geometry.dispose();
      (globeBeam.material as THREE.Material).dispose();
      torsoGeo.dispose();
      torsoMat.dispose();
      headGeo.dispose();
      headMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      visorLedGeo.dispose();
      visorLedMat.dispose();
      jointGeo.dispose();
      jointMat.dispose();
      handGeo.dispose();
      handMat.dispose();
      lineMat.dispose();
      swarmGeo.dispose();
      swarmMat.dispose();
      packetList.forEach((p) => {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative pointer-events-none select-none z-10"
      style={{ touchAction: "none" }}
    />
  );
}
