import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function InteractiveParticles() {
  const particlesRef = useRef();
  const linesRef = useRef();
  const [mouse, setMouse] = useState(new THREE.Vector2());
  const { viewport } = useThree();
  
  const particleCount = 200;
  const maxDistance = 3.0;
  
  // Initialize particle data
  const particleData = useMemo(() => {
    const particles = [];
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
    const handleMouseMove = (event) => {
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
    if (!particlesRef.current) return;

    const mouseWorld = new THREE.Vector3(
      mouse.x * viewport.width / 2,
      mouse.y * viewport.height / 2,
      0
    );

    const linePositions = [];
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

    // Update particle positions
    if (particlesRef.current && particlesRef.current.geometry) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Update connection lines
    if (linesRef.current && linePositions.length > 0) {
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      linesRef.current.geometry.dispose();
      linesRef.current.geometry = lineGeometry;
    }
  });

  return (
    <group>
      {/* Particles */}
      <Points ref={particlesRef}>
        <PointMaterial
          transparent
          vertexColors
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
      </Points>

      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          transparent
          opacity={0.3}
          color="#00ffff"
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function BackgroundEffects() {
  const groupRef = useRef();
  
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
          ]}
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
// import { useRef, useEffect, useState, useMemo } from 'react';
// import * as THREE from 'three';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { Points, PointMaterial } from '@react-three/drei';

// function InteractiveParticles() {
//   const particlesRef = useRef();
//   const linesRef = useRef();
//   const [mouse, setMouse] = useState(new THREE.Vector2());
//   const { viewport, camera } = useThree();
  
//   const particleCount = 150;
//   const maxDistance = 2.5;
  
//   // Initialize particle data
//   const particleData = useMemo(() => {
//     const particles = [];
//     for (let i = 0; i < particleCount; i++) {
//       particles.push({
//         position: new THREE.Vector3(
//           (Math.random() - 0.5) * 20,
//           (Math.random() - 0.5) * 15,
//           (Math.random() - 0.5) * 10
//         ),
//         velocity: new THREE.Vector3(
//           (Math.random() - 0.5) * 0.02,
//           (Math.random() - 0.5) * 0.02,
//           (Math.random() - 0.5) * 0.02
//         ),
//         originalPosition: new THREE.Vector3(),
//         isViolet: Math.random() > 0.6
//       });
//     }
//     return particles;
//   }, []);

//   // Mouse tracking
//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       setMouse(new THREE.Vector2(
//         (event.clientX / window.innerWidth) * 2 - 1,
//         -(event.clientY / window.innerHeight) * 2 + 1
//       ));
//     };
    
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Create geometry arrays
//   const { positions, colors, linePositions } = useMemo(() => {
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);
//     const linePositions = new Float32Array(particleCount * particleCount * 6);
    
//     particleData.forEach((particle, i) => {
//       const i3 = i * 3;
//       positions[i3] = particle.position.x;
//       positions[i3 + 1] = particle.position.y;
//       positions[i3 + 2] = particle.position.z;
      
//       if (particle.isViolet) {
//         colors[i3] = 0.8;     // R
//         colors[i3 + 1] = 0.5; // G  
//         colors[i3 + 2] = 1.0; // B
//       } else {
//         colors[i3] = 1.0;     // R
//         colors[i3 + 1] = 1.0; // G
//         colors[i3 + 2] = 1.0; // B
//       }
//     });
    
//     return { positions, colors, linePositions };
//   }, [particleData]);

//   useFrame((state) => {
//     if (!particlesRef.current || !linesRef.current) return;

//     const mouseWorld = new THREE.Vector3(
//       mouse.x * viewport.width / 2,
//       mouse.y * viewport.height / 2,
//       0
//     );

//     let lineIndex = 0;
//     const lineColors = [];

//     // Update particles
//     particleData.forEach((particle, i) => {
//       // Mouse repulsion
//       const distance = particle.position.distanceTo(mouseWorld);
//       if (distance < 3) {
//         const repulsion = new THREE.Vector3()
//           .subVectors(particle.position, mouseWorld)
//           .normalize()
//           .multiplyScalar(0.1 * (3 - distance) / 3);
//         particle.position.add(repulsion);
//       }

//       // Floating animation
//       particle.position.add(particle.velocity);
//       particle.position.x += Math.sin(state.clock.elapsedTime + i) * 0.001;
//       particle.position.y += Math.cos(state.clock.elapsedTime + i * 0.5) * 0.001;

//       // Boundary constraints
//       if (Math.abs(particle.position.x) > 12) particle.velocity.x *= -1;
//       if (Math.abs(particle.position.y) > 8) particle.velocity.y *= -1;
//       if (Math.abs(particle.position.z) > 6) particle.velocity.z *= -1;

//       // Update position buffer
//       const i3 = i * 3;
//       positions[i3] = particle.position.x;
//       positions[i3 + 1] = particle.position.y;
//       positions[i3 + 2] = particle.position.z;
//     });

//     // Create connections between close particles
//     for (let i = 0; i < particleCount; i++) {
//       for (let j = i + 1; j < particleCount; j++) {
//         const distance = particleData[i].position.distanceTo(particleData[j].position);
        
//         if (distance < maxDistance) {
//           const opacity = 1 - (distance / maxDistance);
          
//           // Line positions
//           linePositions[lineIndex * 6] = particleData[i].position.x;
//           linePositions[lineIndex * 6 + 1] = particleData[i].position.y;
//           linePositions[lineIndex * 6 + 2] = particleData[i].position.z;
//           linePositions[lineIndex * 6 + 3] = particleData[j].position.x;
//           linePositions[lineIndex * 6 + 4] = particleData[j].position.y;
//           linePositions[lineIndex * 6 + 5] = particleData[j].position.z;
          
//           // Line colors (mix of connected particles)
//           const color1 = particleData[i].isViolet ? [0.8, 0.5, 1.0] : [1.0, 1.0, 1.0];
//           const color2 = particleData[j].isViolet ? [0.8, 0.5, 1.0] : [1.0, 1.0, 1.0];
//           const mixedColor = [
//             (color1[0] + color2[0]) / 2,
//             (color1[1] + color2[1]) / 2,
//             (color1[2] + color2[2]) / 2
//           ];
          
//           lineColors.push(...mixedColor, opacity, ...mixedColor, opacity);
//           lineIndex++;
//         }
//       }
//     }

//     // Update geometries
//     particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
//     if (lineIndex > 0) {
//       linesRef.current.geometry.setFromPoints(
//         Array.from({ length: lineIndex * 2 }, (_, i) => {
//           const idx = Math.floor(i / 2) * 6 + (i % 2) * 3;
//           return new THREE.Vector3(
//             linePositions[idx],
//             linePositions[idx + 1],
//             linePositions[idx + 2]
//           );
//         })
//       );
//       linesRef.current.geometry.attributes.position.needsUpdate = true;
//     }
//   });

//   return (
//     <group>
//       {/* Particles */}
//       <Points ref={particlesRef}>
//         <PointMaterial
//           transparent
//           vertexColors
//           size={0.05}
//           sizeAttenuation={true}
//           depthWrite={false}
//           blending={THREE.AdditiveBlending}
//           opacity={0.8}
//         />
//         <bufferGeometry>
//           <bufferAttribute
//             attach="attributes-position"
//             count={positions.length / 3}
//             array={positions}
//             itemSize={3}
//           />
//           <bufferAttribute
//             attach="attributes-color"
//             count={colors.length / 3}
//             array={colors}
//             itemSize={3}
//           />
//         </bufferGeometry>
//       </Points>

//       {/* Connection Lines */}
//       <lineSegments ref={linesRef}>
//         <bufferGeometry />
//         <lineBasicMaterial
//           transparent
//           opacity={0.3}
//           color="#ffffff"
//           blending={THREE.AdditiveBlending}
//         />
//       </lineSegments>
//     </group>
//   );
// }

// function BackgroundEffects() {
//   const groupRef = useRef();
  
//   useFrame((state) => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
//       groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.02;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       {/* Ambient glow spheres */}
//       {[...Array(5)].map((_, i) => (
//         <mesh
//           key={i}
//           position={[
//             Math.sin(i * Math.PI * 2 / 5) * 8,
//             Math.cos(i * Math.PI * 2 / 5) * 6,
//             Math.sin(i * Math.PI) * 4
//           ]}
//         >
//           <sphereGeometry args={[0.1, 16, 16]} />
//           <meshBasicMaterial
//             color={i % 2 === 0 ? "#ffffff" : "#8b5cf6"}
//             transparent
//             opacity={0.4}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// const Background = () => {
//   return (
//     <div className="fixed inset-0 z-0">
//       {/* Gradient Background */}
//       <div 
//         className="absolute inset-0"
//         style={{
//           background: `
//             linear-gradient(135deg, 
//               #0f0f23 0%, 
//               #1a0b2e 25%, 
//               #16213e 50%, 
//               #0f3460 75%, 
//               #1a0b2e 100%
//             )
//           `
//         }}
//       />
      
//       {/* Radial overlays for depth */}
//       <div 
//         className="absolute inset-0"
//         style={{
//           background: `
//             radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
//             radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
//             radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)
//           `
//         }}
//       />
      
//       {/* Three.js Canvas */}
//       <Canvas 
//         camera={{ 
//           position: [0, 0, 8], 
//           fov: 75,
//           near: 0.1,
//           far: 1000 
//         }}
//         style={{ background: 'transparent' }}
//       >
//         <InteractiveParticles />
//         <BackgroundEffects />
        
//         {/* Subtle lighting */}
//         <ambientLight intensity={0.3} color="#8b5cf6" />
//         <pointLight position={[5, 5, 5]} intensity={0.2} color="#ffffff" />
//       </Canvas>
      
//       {/* Content overlay for better readability */}
//       <div 
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background: `
//             radial-gradient(circle at 50% 50%, 
//               transparent 0%, 
//               rgba(15, 15, 35, 0.05) 60%, 
//               rgba(15, 15, 35, 0.15) 100%
//             )
//           `
//         }}
//       />
//     </div>
//   );
// };

// export default Background;
