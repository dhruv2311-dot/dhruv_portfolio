import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function InteractiveParticles() {
  const particlesRef = useRef();
  const linesRef = useRef();
  const [mouse, setMouse] = useState(new THREE.Vector2());
  const { viewport, camera } = useThree();
  
  const particleCount = 150;
  const maxDistance = 2.5;
  
  // Initialize particle data
  const particleData = useMemo(() => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        originalPosition: new THREE.Vector3(),
        isViolet: Math.random() > 0.6
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
  const { positions, colors, linePositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    
    particleData.forEach((particle, i) => {
      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;
      
      if (particle.isViolet) {
        colors[i3] = 0.8;     // R
        colors[i3 + 1] = 0.5; // G  
        colors[i3 + 2] = 1.0; // B
      } else {
        colors[i3] = 1.0;     // R
        colors[i3 + 1] = 1.0; // G
        colors[i3 + 2] = 1.0; // B
      }
    });
    
    return { positions, colors, linePositions };
  }, [particleData]);

  useFrame((state) => {
    if (!particlesRef.current || !linesRef.current) return;

    const mouseWorld = new THREE.Vector3(
      mouse.x * viewport.width / 2,
      mouse.y * viewport.height / 2,
      0
    );

    let lineIndex = 0;
    const lineColors = [];

    // Update particles
    particleData.forEach((particle, i) => {
      // Mouse repulsion
      const distance = particle.position.distanceTo(mouseWorld);
      if (distance < 3) {
        const repulsion = new THREE.Vector3()
          .subVectors(particle.position, mouseWorld)
          .normalize()
          .multiplyScalar(0.1 * (3 - distance) / 3);
        particle.position.add(repulsion);
      }

      // Floating animation
      particle.position.add(particle.velocity);
      particle.position.x += Math.sin(state.clock.elapsedTime + i) * 0.001;
      particle.position.y += Math.cos(state.clock.elapsedTime + i * 0.5) * 0.001;

      // Boundary constraints
      if (Math.abs(particle.position.x) > 12) particle.velocity.x *= -1;
      if (Math.abs(particle.position.y) > 8) particle.velocity.y *= -1;
      if (Math.abs(particle.position.z) > 6) particle.velocity.z *= -1;

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
          const opacity = 1 - (distance / maxDistance);
          
          // Line positions
          linePositions[lineIndex * 6] = particleData[i].position.x;
          linePositions[lineIndex * 6 + 1] = particleData[i].position.y;
          linePositions[lineIndex * 6 + 2] = particleData[i].position.z;
          linePositions[lineIndex * 6 + 3] = particleData[j].position.x;
          linePositions[lineIndex * 6 + 4] = particleData[j].position.y;
          linePositions[lineIndex * 6 + 5] = particleData[j].position.z;
          
          // Line colors (mix of connected particles)
          const color1 = particleData[i].isViolet ? [0.8, 0.5, 1.0] : [1.0, 1.0, 1.0];
          const color2 = particleData[j].isViolet ? [0.8, 0.5, 1.0] : [1.0, 1.0, 1.0];
          const mixedColor = [
            (color1[0] + color2[0]) / 2,
            (color1[1] + color2[1]) / 2,
            (color1[2] + color2[2]) / 2
          ];
          
          lineColors.push(...mixedColor, opacity, ...mixedColor, opacity);
          lineIndex++;
        }
      }
    }

    // Update geometries
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    if (lineIndex > 0) {
      linesRef.current.geometry.setFromPoints(
        Array.from({ length: lineIndex * 2 }, (_, i) => {
          const idx = Math.floor(i / 2) * 6 + (i % 2) * 3;
          return new THREE.Vector3(
            linePositions[idx],
            linePositions[idx + 1],
            linePositions[idx + 2]
          );
        })
      );
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Particles */}
      <Points ref={particlesRef}>
        <PointMaterial
          transparent
          vertexColors
          size={0.05}
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
          color="#ffffff"
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
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient glow spheres */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * Math.PI * 2 / 5) * 8,
            Math.cos(i * Math.PI * 2 / 5) * 6,
            Math.sin(i * Math.PI) * 4
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ffffff" : "#8b5cf6"}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

const Background = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              #0f0f23 0%, 
              #1a0b2e 25%, 
              #16213e 50%, 
              #0f3460 75%, 
              #1a0b2e 100%
            )
          `
        }}
      />
      
      {/* Radial overlays for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Three.js Canvas */}
      <Canvas 
        camera={{ 
          position: [0, 0, 8], 
          fov: 75,
          near: 0.1,
          far: 1000 
        }}
        style={{ background: 'transparent' }}
      >
        <InteractiveParticles />
        <BackgroundEffects />
        
        {/* Subtle lighting */}
        <ambientLight intensity={0.3} color="#8b5cf6" />
        <pointLight position={[5, 5, 5]} intensity={0.2} color="#ffffff" />
      </Canvas>
      
      {/* Content overlay for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, 
              transparent 0%, 
              rgba(15, 15, 35, 0.05) 60%, 
              rgba(15, 15, 35, 0.15) 100%
            )
          `
        }}
      />
    </div>
  );
};

export default Background;
// import { useRef, useEffect } from 'react';
// import * as THREE from 'three';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Points, PointMaterial } from '@react-three/drei';

// function Stars() {
//   const ref = useRef();
  
//   useFrame((state, delta) => {
//     ref.current.rotation.x -= delta / 10;
//     ref.current.rotation.y -= delta / 15;
//   });
  
//   const count = 5000;
//   const positions = new Float32Array(count * 3);
  
//   for (let i = 0; i < count; i++) {
//     const i3 = i * 3;
//     positions[i3] = (Math.random() - 0.5) * 10;
//     positions[i3 + 1] = (Math.random() - 0.5) * 10;
//     positions[i3 + 2] = (Math.random() - 0.5) * 10;
//   }
  
//   return (
//     <Points ref={ref}>
//       <PointMaterial
//         transparent
//         color="#00ffff"
//         size={0.02}
//         sizeAttenuation={true}
//         depthWrite={false}
//       />
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={positions.length / 3}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//     </Points>
//   );
// }

// const Background = () => {
//   return (
//     <div className="fixed inset-0 z-0">
//       <Canvas camera={{ position: [0, 0, 1] }}>
//         <Stars />
//       </Canvas>
//     </div>
//   );
// };

// export default Background;