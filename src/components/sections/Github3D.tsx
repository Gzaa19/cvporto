"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ------------------------------------------------------------------
// IMPORTANT: 
// Since we cannot automatically generate the .gltf/.glb file,
// you need to download a "github.glb" 3D model.
//
// Recommended free source:
// 1. Go to sketchfab.com or any 3D model site
// 2. Search for "Github Logo" (GLB/GLTF format)
// 3. Download it and place it in your project at:
//    /public/models/github.glb
//
// If the file is not found, this component will show a fallback 3D shape.
// ------------------------------------------------------------------

function GithubModel({ url }: { url: string }) {
    // This hook will attempt to load the model.
    // If it fails (404), it might suspend indefinitely or error out depending on config.
    // For now we assume the user will provide the file.
    // Note: useGLTF handles caching automatically.
    const { scene } = useGLTF(url);

    // Clone scene to avoid mutation issues if reused, though not strictly necessary here
    const savedScene = React.useMemo(() => scene.clone(), [scene]);

    return <primitive object={savedScene} scale={20} rotation={[Math.PI / 2, 0, 0]} />;
}

// A fallback mesh that looks like a high-tech placeholder
function FallbackMesh() {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Outer wireframe sphere */}
            <mesh>
                <icosahedronGeometry args={[1.2, 0]} />
                <meshStandardMaterial color="#00ffcc" wireframe wireframeLinewidth={2} />
            </mesh>

            {/* Inner solid core */}
            <mesh>
                <dodecahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial color="#0d1117" roughness={0.2} metalness={0.8} />
            </mesh>
        </group>
    );
}

// Error Boundary to catch missing model errors gracefully
class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.warn("Failed to load 3D model (likely missing file):", error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default function Github3D() {
    return (
        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] relative -mt-6 -mb-6 md:mt-0 md:mb-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

                <Float
                    speed={2} // Animation speed
                    rotationIntensity={1} // XYZ rotation intensity
                    floatIntensity={1} // Up/down float intensity
                >
                    <ErrorBoundary fallback={<FallbackMesh />}>
                        <Suspense fallback={<FallbackMesh />}>
                            {/* 
                               Attempt to load the model. 
                               If you have the file, uncomment the line below and ensure the path is correct.
                               For now, we default to fallback to prevent crashes until you add the file.
                           */}
                            {/* <GithubModel url="/models/github.glb" /> */}
                            <FallbackMesh />
                        </Suspense>
                    </ErrorBoundary>
                </Float>

                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}
