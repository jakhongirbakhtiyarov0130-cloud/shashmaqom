"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function ParticleWave() {
    const pointsRef = useRef();

    const particlesCount = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            // Create a sphere distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 4 + Math.random() * 2; // Radius between 4 and 6

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        const { clock } = state;
        if (pointsRef.current) {
            // @ts-ignore
            pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
            // @ts-ignore
            pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
        }
    });

    return (
        <points ref={pointsRef as any}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <PointMaterial
                transparent
                color="#F59E0B" // Gold
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </points>
    );
}

function GridLines() {
    return (
        <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <gridHelper args={[20, 20, 0x1e293b, 0x1e293b]} position={[0, -2, 0]} />
            <gridHelper args={[20, 20, 0x1e293b, 0x1e293b]} position={[0, 2, 0]} rotation={[Math.PI, 0, 0]} />
        </group>
    )
}

export default function AbstractAnimation() {
    return (
        <div className="absolute inset-0 z-[-1]">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#F59E0B" />
                <ParticleWave />
                {/* <GridLines /> Optional based on preference */}
            </Canvas>
        </div>
    );
}
