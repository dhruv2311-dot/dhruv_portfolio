import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Extend Three.js objects to be used as JSX elements
extend({ Group: THREE.Group, Mesh: THREE.Mesh, SphereGeometry: THREE.SphereGeometry, MeshBasicMaterial: THREE.MeshBasicMaterial, AmbientLight: THREE.AmbientLight, PointLight: THREE.PointLight });

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  originalPosition: THREE.Vector3;
  isSpecial: boolean;
}

function InteractiveParticles() {
  const particlesRef = useRef<any>(null);
  const linesRef = useRef<any>(null);
  const frameCounterRef = useRef(0);
  const [mouse, setMouse] = useState(new THREE.Vector2());
  const { viewport } = useThree();
  
  const particleCount = 140;
  const maxDistance = 3.0;
  
  // Initialize particle data
  const particleData = useMemo(() => {
    const particles: ParticleData[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 12
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
        originalPosition: new THREE.Vector3(),
        isSpecial: Math.random() > 0.7
      });
    }
    return particles;
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse(new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create geometry arrays
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    particleData.forEach((particle, i) => {
      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;
      
      if (particle.isSpecial) {
        colors[i3] = 0.8;     // R - Purple
        colors[i3 + 1] = 0.4; // G  
        colors[i3 + 2] = 1.0; // B
      } else {
        colors[i3] = 0.0;     // R - Cyan
        colors[i3 + 1] = 0.9; // G
        colors[i3 + 2] = 1.0; // B
      }
    });
    
    return { positions, colors };
  }, [particleData]);

  useFrame((state) => {
    frameCounterRef.current += 1;
    const shouldUpdateConnections = frameCounterRef.current % 3 === 0;

    if (!particlesRef.current) return;

    const mouseWorld = new THREE.Vector3(
      mouse.x * viewport.width / 2,
      mouse.y * viewport.height / 2,
      0
    );

    const linePositions: number[] = shouldUpdateConnections ? [] : [];
    const time = state.clock.elapsedTime;

    // Update particles
    particleData.forEach((particle, i) => {
      // Mouse interaction - attraction and repulsion
      const distance = particle.position.distanceTo(mouseWorld);
      if (distance < 4) {
        const force = new THREE.Vector3()
          .subVectors(particle.position, mouseWorld)
          .normalize();
        
        if (distance < 2) {
          // Repulsion when very close
          force.multiplyScalar(0.15 * (2 - distance) / 2);
          particle.position.add(force);
        } else {
          // Slight attraction when medium distance
          force.multiplyScalar(-0.05 * (4 - distance) / 4);
          particle.position.add(force);
        }
      }

      // Natural floating movement
      particle.position.add(particle.velocity);
      particle.position.x += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      particle.position.y += Math.cos(time * 0.3 + i * 0.15) * 0.002;
      particle.position.z += Math.sin(time * 0.4 + i * 0.2) * 0.001;

      // Boundary constraints with smooth bounce
      if (Math.abs(particle.position.x) > 15) {
        particle.velocity.x *= -0.8;
        particle.position.x = Math.sign(particle.position.x) * 15;
      }
      if (Math.abs(particle.position.y) > 10) {
        particle.velocity.y *= -0.8;
        particle.position.y = Math.sign(particle.position.y) * 10;
      }
      if (Math.abs(particle.position.z) > 8) {
        particle.velocity.z *= -0.8;
        particle.position.z = Math.sign(particle.position.z) * 8;
      }

      // Update position buffer
      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;
    });

    // Create connections between close particles
    if (shouldUpdateConnections) {
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const distance = particleData[i].position.distanceTo(particleData[j].position);
          
          if (distance < maxDistance) {
            linePositions.push(
              particleData[i].position.x, particleData[i].position.y, particleData[i].position.z,
              particleData[j].position.x, particleData[j].position.y, particleData[j].position.z
            );
          }
        }
      }
    }

    // Update particle positions
    if (particlesRef.current && particlesRef.current.geometry) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Update connection lines
    if (shouldUpdateConnections && linesRef.current) {
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      if (linesRef.current.geometry) {
        linesRef.current.geometry.dispose();
      }
      linesRef.current.geometry = lineGeometry;
    }
  });

  // Initialize line segments
  useEffect(() => {
    const lineSegments = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.3,
        color: 0x00ffff,
        blending: THREE.AdditiveBlending
      })
    );
    linesRef.current = lineSegments;
    
    return () => {
      if (linesRef.current) {
        linesRef.current.geometry.dispose();
        (linesRef.current.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <>
      {/* Particles */}
      <Points ref={particlesRef} positions={positions} colors={colors}>
        <PointMaterial
          transparent
          vertexColors
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>

      {/* Connection Lines */}
      {linesRef.current && <primitive object={linesRef.current} />}
    </>
  );
}

function BackgroundEffects() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.12) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient glow spheres */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * Math.PI * 2 / 8) * 12,
            Math.cos(i * Math.PI * 2 / 8) * 8,
            Math.sin(i * Math.PI * 1.5) * 5
          ] as [number, number, number]}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#8a2be2" : "#ff3e6b"}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

const Background = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark' || theme === null);
    };

    // Initial check
    handleThemeChange();

    // Listen for storage changes
    window.addEventListener('storage', handleThemeChange);
    
    // Custom event for theme changes
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {/* Dynamic Background based on theme */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: isDark 
            ? `linear-gradient(135deg, 
                #0a0a1a 0%, 
                #1a0b2e 20%, 
                #16213e 40%, 
                #0f3460 60%, 
                #1a0b2e 80%,
                #0a0a1a 100%
              )`
            : `linear-gradient(135deg, 
                #f1f5f9 0%, 
                #e2e8f0 20%, 
                #cbd5e1 40%, 
                #94a3b8 60%, 
                #64748b 80%,
                #475569 100%
              )`
        }}
      />
      
      {/* Enhanced radial overlays */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: isDark 
            ? `radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 60%),
               radial-gradient(ellipse at 80% 80%, rgba(0, 255, 255, 0.15) 0%, transparent 60%),
               radial-gradient(ellipse at 50% 50%, rgba(255, 62, 107, 0.1) 0%, transparent 70%)`
            : `radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 60%),
               radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
               radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 70%)`
        }}
      />
      
      {/* Three.js Canvas with better settings */}
      <Canvas 
        camera={{ 
          position: [0, 0, 10], 
          fov: 60,
          near: 0.1,
          far: 1000 
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <InteractiveParticles />
        <BackgroundEffects />
        
        {/* Enhanced lighting */}
        <ambientLight intensity={isDark ? 0.4 : 0.6} color={isDark ? "#4c1d95" : "#64748b"} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 0.3 : 0.4} color={isDark ? "#00ffff" : "#8b5cf6"} />
        <pointLight position={[-10, -10, 5]} intensity={isDark ? 0.2 : 0.3} color={isDark ? "#8a2be2" : "#ec4899"} />
      </Canvas>
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }}
      />
      
      {/* Content overlay for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: isDark 
            ? `radial-gradient(circle at 50% 50%, 
                transparent 0%, 
                rgba(10, 10, 26, 0.1) 70%, 
                rgba(10, 10, 26, 0.2) 100%
              )`
            : `radial-gradient(circle at 50% 50%, 
                transparent 0%, 
                rgba(241, 245, 249, 0.1) 70%, 
                rgba(241, 245, 249, 0.2) 100%
              )`
        }}
      />
    </div>
  );
};

export default Background;
