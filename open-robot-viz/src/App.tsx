import React, { JSX, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

// Type definitions
interface ModelProps {
  url: string;
}

// Component to load and render the GLTF model
function Model({ url }: ModelProps) {
  const gltf: GLTF = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  // Optional: Add a subtle rotation animation
  // useFrame((state) => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.y += 0.005;
  //   }
  // });

  return (
    <primitive 
      ref={meshRef}
      object={gltf.scene} 
      scale={0.25}
      position={[0, 0, 0]}
    />
  );
}

// Loading component
function Loader(): JSX.Element {
  return (
    <mesh scale={[5,5,5]} position={[0, 0, 0]}>
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// Main scene component
function Scene(): JSX.Element {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* GLTF Model */}
      <Suspense fallback={<Loader />}>
        <Model url="6DOF.glb" />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main App component
export default function App(): JSX.Element {
  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h1 className="text-2xl font-bold mb-2">GLTF Model Viewer</h1>
        <div className="text-sm space-y-1">
          <p>• Left click + drag: Rotate camera</p>
          <p>• Right click + drag: Pan camera</p>
          <p>• Scroll: Zoom in/out</p>
        </div>
      </div>
      
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}