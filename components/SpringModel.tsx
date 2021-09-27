import React, { useEffect, useRef } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import { useFrame } from '@react-three/fiber'
import { animated, useSpring } from '@react-spring/three'

const positions = {
  left: {
    hidden: [-5, -33, 0],
    shown: [-3, -25, 0],
  },
  right: {
    hidden: [15, 10, 0],
    shown: [10, 2, 0],
  },
}

// @reset refresh
export function SpringModel({ isSpinning, isShowing, ...props }) {
  const groupRef = useRef()
  const springLeft = useRef<any>()
  const springRight = useRef<any>()

  const { nodes, materials } = useGLTF('/spring.gltf') as any
  const materialProps = useSpring({
    delay: 1,
    from: { opacity: 0 },
    to: { opacity: 1 },
  })

  const getScale = (scaleFactor = 1) =>
    [1, 2.03, 1].map((scale) => (scale / 100) * scaleFactor)

  const isSpinningSpringsRef = useRef(false)
  useFrame((state) => {
    if (isSpinningSpringsRef.current) {
      const angle = Math.sin(state.clock.getElapsedTime() / Math.PI) / 5
      springLeft.current.rotateY(angle)
      springRight.current.rotateY(angle)
    }
  })

  useEffect(() => {
    if (isShowing) {
      const tl = gsap.timeline({
        delay: 0.1,
        duration: 3,
        ease: 'elastic.out(1, 0.75)',
      })

      const getXYZ = (position) => ({
        x: position[0],
        y: position[1],
        z: position[2],
      })

      tl.add(() => (isSpinningSpringsRef.current = true), 0)
      tl.add(() => (isSpinningSpringsRef.current = false), 0.25)

      tl.to(
        springLeft.current.position,
        getXYZ(isShowing ? positions.left.shown : positions.left.hidden),
        0
      )
      tl.to(
        springRight.current.position,
        getXYZ(isShowing ? positions.right.shown : positions.right.hidden),
        0
      )
    }
  }, [isShowing])

  useEffect(() => {
    isSpinningSpringsRef.current = isSpinning
  }, [isSpinning])

  return (
    <>
      <group ref={groupRef} {...props} dispose={null}>
        <group
          ref={springLeft}
          scale={getScale(1.7)}
          position={positions.left.hidden}
          rotation={[0, 0, Math.PI / 5]}
        >
          <animated.mesh
            geometry={nodes.Sweep.geometry}
            material={materials.Mat}
            material-color="#c2dfff"
            scale={[1, 1.32, 1]}
            {...materialProps}
          />
        </group>
        <group
          ref={springRight}
          scale={getScale(1.7)}
          position={positions.right.hidden}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <animated.mesh
            geometry={nodes.Sweep.geometry}
            material={materials.Mat}
            material-color="#c2dfff"
            scale={[1, 1.32, 1]}
            {...materialProps}
          />
        </group>
      </group>
      {/* @ts-ignore */}
      <PerspectiveCamera makeDefault position={[0, 0, 32]} />
    </>
  )
}

useGLTF.preload('/spring.gltf')
