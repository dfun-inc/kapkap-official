'use client'

import { useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

export default function Wall() {
  const { size } = useThree() // Adjust this according to your scene size
  const walls:any = [
    { position: [0, size.height / 19.5 + 25, 0], size: [size.width, 30, 30] }, // Bottom wall
    { position: [0, -size.height / 19.5 - 30, 0], size: [size.width, 30, 30] }, // Top wall
    { position: [-size.width / 19.8 - 30, 0, 0], size: [30, size.height, 30] }, // Left wall
    { position: [size.width / 19.8 + 30, 0, 0], size: [30, size.height, 30] } // Right wall
  ]

  return (
    <>
    {walls.map((wall:any, index:number) => (
      <RigidBody key={index} type="fixed">
        <CuboidCollider args={wall.size} position={wall.position} />
      </RigidBody>
    ))}
    </>
  );
}