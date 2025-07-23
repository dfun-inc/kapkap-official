'use client'

import * as THREE from 'three'
import { useContext, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Image as ImageTpl, Text } from '@react-three/drei'
import { RigidBody, BallCollider } from '@react-three/rapier'
import { easing } from 'maath'

export default function Bubble({ ...props }) {
  const scaleBasis = (props.amount + 10) / (props.amount - 10) * 2.5;
  const api:any = useRef(null)
  const [initialPos]:any[] = useState([THREE.MathUtils.randFloatSpread(50), THREE.MathUtils.randFloatSpread(10), 0])
  const [position] = useState(new THREE.Vector3())
  const [dragging, setDraging] = useState<any>(false)
  const [ imgData, setImgData ] = useState('');
  // const [floatPos, setFloatPos] = useState(0);
  const beginTime = useRef(0);
  // const floatingRange = [-0.2, 0.2];
  // const speed = 1;
  // const offset = useRef(Math.random() * 10000)

  useFrame((state:any, delta:any) => {
    const spX = state.pointer.x;
    const spY = state.pointer.y;
    const svW = state.viewport.width;
    const svH = state.viewport.height;
    const ratio = 0.9
    let posX = spX > ratio ? ratio * svW / 2 : (spX < -ratio ? -ratio * svW / 2 : spX * svW / 2);
    let posY = spY > ratio ? ratio * svH / 2 : (spY < -ratio ? -ratio * svH / 2 : spY * svH / 2);
    /*
    if(!dragging) {
      const t = offset.current + state.clock.getElapsedTime()
      let yPosition = Math.sin((t / 4) * speed) / 10
      yPosition = THREE.MathUtils.mapLinear(yPosition, -0.1, 0.1, floatingRange?.[0] ?? -0.1, floatingRange?.[1] ?? 0.1)
      posY += yPosition * 10

      if(props.index == 20) {
        console.log(position)
      }
      easing.damp3(position, [posX, posY, 0], 0.2, delta)
    }
    else {
      easing.damp3(position, [posX - dragging?.x, posY - dragging?.y, 0], 0.2, delta)
    }
    */
  
    easing.damp3(position, [posX - dragging?.x, posY - dragging?.y, 0], 0.2, delta)
    api.current?.setNextKinematicTranslation(position)
  })

  const handleMouseDown = (e:any) => {
    beginTime.current = new Date().getTime()
    e.target.setPointerCapture(e.pointerId);
    setDraging(new THREE.Vector3().copy(e.point).sub(api.current.translation()))
  }

  const handleMouseUp = (e:any) => {
    const duration = (new Date().getTime()) - beginTime.current;
    beginTime.current = 0;
    e.target.releasePointerCapture(e.pointerId);
    setDraging(false)
  }

  const init = async() => {
    setImgData(props.imgData)
    props.addCompleteNum();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <>
    {props.finishLoadAll ? (
      <RigidBody ref={api} type={dragging ? 'kinematicPosition' : 'dynamic'} enabledRotations={[false, false, false]} enabledTranslations={[true, true, false]} linearDamping={4} angularDamping={10} friction={0.1} position={initialPos} scale={scaleBasis + (props.amount - props.index) / 100} colliders={false}>
        <BallCollider args={dragging ? [1] : [1.1]} />
        <Float speed={2} floatingRange={[-0.2, 0.2]} >
          <mesh onPointerDown={handleMouseDown} onPointerUp={handleMouseUp}>
            { imgData != '' && <ImageTpl toneMapped={true} position={[0, 0, 0]} opacity={1} radius={0.2} scale={1 + (props.amount - props.index) / props.amount} transparent url={imgData} />}
          </mesh>
        </Float>
      </RigidBody>
    ): (
      <></>
    )}
    </>
  )
}