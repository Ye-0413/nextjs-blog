import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, useTexture, useAnimations, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Vector3, Quaternion, Euler, Group } from 'three';
import { useTheme } from 'next-themes';
import { ThreeEvent } from '@react-three/fiber';

interface Card3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  hoverColor?: string;
  modelPath?: string;
  onClick?: () => void;
  draggable?: boolean;
}

export default function Card3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#ffffff',
  hoverColor = '#f0f0f0',
  modelPath = '/models/card.glb',
  onClick,
  draggable = true
}: Card3DProps) {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';
  
  // Refs
  const group = useRef<Group>(null);
  const rigidBody = useRef<RapierRigidBody>(null);
  const { gl } = useThree();
  
  // State
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [initialPosition] = useState(new Vector3(...position));
  const [targetPosition] = useState(new Vector3(...position));
  const [targetRotation] = useState(new Euler(...rotation));
  
  // Load model
  const { scene } = useGLTF(modelPath);
  
  // Handle pointer events
  const onPointerOver = () => {
    setHovered(true);
    gl.domElement.style.cursor = draggable ? 'grab' : 'pointer';
  };
  
  const onPointerOut = () => {
    setHovered(false);
    gl.domElement.style.cursor = 'auto';
  };
  
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!draggable) return;
    e.stopPropagation();
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  };
  
  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!draggable) return;
    e.stopPropagation();
    setIsDragging(false);
    document.body.style.cursor = 'auto';
    
    // If this was a quick tap/click, trigger onClick
    if (onClick && !isDragging) {
      onClick();
    }
  };
  
  // Clean up
  useEffect(() => {
    return () => {
      gl.domElement.style.cursor = 'auto';
    };
  }, [gl]);
  
  // Handle animation and physics
  useFrame((state, delta) => {
    if (!group.current || !rigidBody.current) return;
    
    // Hover animation
    if (hovered && !isDragging) {
      group.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      group.current.rotation.y = rotation[1] + Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
    
    // Return to original position when not dragging
    if (!isDragging && rigidBody.current) {
      const currentPosition = rigidBody.current.translation();
      const currentRotation = rigidBody.current.rotation();
      
      // Smoothly move back to target position
      const newPos = new Vector3(
        currentPosition.x + (targetPosition.x - currentPosition.x) * 0.1,
        currentPosition.y + (targetPosition.y - currentPosition.y) * 0.1,
        currentPosition.z + (targetPosition.z - currentPosition.z) * 0.1
      );
      
      // Smoothly rotate back to target rotation
      const currentQuat = new Quaternion(
        currentRotation.x, 
        currentRotation.y, 
        currentRotation.z, 
        currentRotation.w
      );
      const targetQuat = new Quaternion().setFromEuler(targetRotation);
      currentQuat.slerp(targetQuat, 0.1);
      
      rigidBody.current.setTranslation(newPos, true);
      rigidBody.current.setRotation(currentQuat, true);
    }
  });
  
  // Set material color based on theme and hover state
  const materialColor = isDarkTheme 
    ? hovered ? hoverColor : '#333333' 
    : hovered ? hoverColor : color;
  
  return (
    <RigidBody
      ref={rigidBody}
      position={position}
      rotation={rotation}
      type={isDragging ? 'dynamic' : 'fixed'}
      enabledRotations={[true, true, true]}
      linearDamping={4}
      angularDamping={2}
      colliders="cuboid"
    >
      <group
        ref={group}
        scale={[scale, scale, scale]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={onClick}
      >
        {/* We'll use the GLB model if it exists, otherwise fallback to a simple mesh */}
        {scene ? (
          <primitive object={scene.clone()} />
        ) : (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 1.2, 0.02]} />
            <meshStandardMaterial 
              color={materialColor} 
              roughness={0.3} 
              metalness={0.2}
              emissive={hovered ? materialColor : 'black'}
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
} 