import { Suspense, useState, useRef, useLayoutEffect } from "react"
import { motion, MotionConfig, useMotionValue, useSpring, useTransform } from "framer-motion"
import { motion as motionThree } from "framer-motion-3d"
import { Canvas, useThree } from "@react-three/fiber"
import useMeasure from "react-use-measure"

import styles from '@/styles/Home.module.css'

function useSmoothTransform(value, springOptions, transformer) {
    return useSpring(useTransform(value, transformer), springOptions)
}

export default function ThreeButton() {
    const [ref, bounds] = useMeasure({ scroll: false })
    const [isHover, setIsHover] = useState(false)
    const [isPress, setIsPress] = useState(false)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const resetMousePosition = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <MotionConfig transition={transition}>
        <motion.button
            className={styles.threeButton}
            ref={ref}
            initial={false}
            animate={isHover ? "hover" : "rest"}
            whileTap="press"
            variants={{
            rest: { scale: 1 },
            hover: { scale: 1.2 },
            press: { scale: 1.1 }
            }}
            onHoverStart={() => {
            resetMousePosition()
            setIsHover(true)
            }}
            onHoverEnd={() => {
            resetMousePosition()
            setIsHover(false)
            }}
            onTapStart={() => setIsPress(true)}
            onTap={() => setIsPress(false)}
            onTapCancel={() => setIsPress(false)}
            onPointerMove={(e) => {
            mouseX.set(e.clientX - bounds.x - bounds.width / 2)
            mouseY.set(e.clientY - bounds.y - bounds.height / 2)
            }}
        >
            <motion.div
            className={styles.shapes}
            variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 }
            }}
            >
            <div className={styles.pinkBlush} />
            <div className={styles.blueBlush} />
            <div className={styles.shapesContainer}>
                <Suspense fallback={null}>
                <Shapes
                    isHover={isHover}
                    isPress={isPress}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
                </Suspense>
            </div>
            </motion.div>
            <motion.div
                variants={{ hover: { scale: 0.85 }, press: { scale: 1.1 } }}
                className={styles.shapesLabel}
            >
                Place order
            </motion.div>
        </motion.button>
        </MotionConfig>
    )
}

const transition = {
    type: "spring",
    duration: 0.7,
    bounce: 0.2
}

export function Shapes({ isHover, isPress, mouseX, mouseY }) {
    const lightRotateX = useSmoothTransform(mouseY, spring, mouseToLightRotation)
    const lightRotateY = useSmoothTransform(mouseX, spring, mouseToLightRotation)

    return (
        <Canvas shadows dpr={[1, 2]} resize={{ scroll: false, offsetSize: true }}>
        <Camera mouseX={mouseX} mouseY={mouseY} />
        <MotionConfig transition={transition}>
            <motionThree.group
                center={[0, 0, 0]}
                rotation={[lightRotateX, lightRotateY, 0]}
            >
            <Lights />
            </motionThree.group>
            <motionThree.group
                initial={false}
                animate={isHover ? "hover" : "rest"}
                dispose={null}
                variants={{
                    hover: { z: isPress ? -0.9 : 0 }
                }}
            >
            <Sphere />
            <Cone />
            <Torus />
            <Icosahedron />
            </motionThree.group>
        </MotionConfig>
        </Canvas>
    )
}

export function Lights() {
    return (
        <>
        <motionThree.spotLight color="#61dafb" position={[-10, -10, -10]} intensity={0.2} />
        <motionThree.spotLight color="#61dafb" position={[-10, 0, 15]} intensity={0.8} />
        <motionThree.spotLight color="#61dafb" position={[-5, 20, 2]} intensity={0.5} />
        <motionThree.spotLight color="#f2056f" position={[15, 10, -2]} intensity={2} />
        <motionThree.spotLight color="#f2056f" position={[15, 10, 5]} intensity={1} />
        <motionThree.spotLight color="#b107db" position={[5, -10, 5]} intensity={0.8} />
        </>
    )
}

export function Sphere() {
    return (
        <motionThree.mesh position={[-0.5, -0.5, 0]} variants={{ hover: { z: 2 } }}>
        <motionThree.sphereGeometry args={[0.4]} />
        <Material />
        </motionThree.mesh>
    )
}

export function Cone() {
    return (
        <motionThree.mesh
            position={[-0.8, 0.4, 0]}
            rotation={[-0.5, 0, -0.3]}
            variants={{
                hover: {
                z: 1.1,
                x: -1.5,
                rotateX: -0.2,
                rotateZ: 0.4
                }
            }}
        >
        <motionThree.coneGeometry args={[0.3, 0.6, 20]} />
        <Material />
        </motionThree.mesh>
    )
}

export function Torus() {
    return (
        <motionThree.mesh
        position={[0.1, 0.4, 0]}
        rotation={[-0.5, 0.5, 0]}
        variants={{
            hover: {
            y: 0.5,
            z: 2,
            rotateY: -0.2
            }
        }}
        >
        <motionThree.torusGeometry args={[0.2, 0.1, 10, 50]} />
        <Material />
        </motionThree.mesh>
    )
}

export function Icosahedron() {
    return (
        <motionThree.mesh
            position={[1.1, 0, 0]}
            rotation-z={0.5}
            variants={{
                hover: {
                x: 1.8,
                z: 0.6,
                y: 0.6,
                rotateZ: -0.5
                }
            }}
        >
        <motionThree.icosahedronGeometry args={[0.7, 0]} />
        <Material />
        </motionThree.mesh>
    )
}

export function Material() {
    return <motionThree.meshPhongMaterial color="#fff" specular="#61dafb" shininess={10} />
}

// Adapted from https://github.com/pmndrs/drei/blob/master/src/core/PerspectiveCamera.tsx
function Camera({ mouseX, mouseY, ...props }) {
    const cameraX = useSmoothTransform(mouseX, spring, (x) => x / 350)
    const cameraY = useSmoothTransform(mouseY, spring, (y) => (-1 * y) / 350)

    const set = useThree(({ set }) => set)
    const camera = useThree(({ camera }) => camera)
    const size = useThree(({ size }) => size)
    const scene = useThree(({ scene }) => scene)
    const cameraRef = useRef()

    useLayoutEffect(() => {
        const { current: cam } = cameraRef
        if (cam) {
        cam.aspect = size.width / size.height
        cam.updateProjectionMatrix()
        }
    }, [size, props])

    useLayoutEffect(() => {
        if (cameraRef.current) {
            const oldCam = camera
            set(() => ({ camera: cameraRef.current }))
            return () => set(() => ({ camera: oldCam }))
        }
    }, [camera, cameraRef, set])

    useLayoutEffect(() => {
        return cameraX.onChange(() => camera.lookAt(scene.position))
    }, [cameraX])

    return (
        <motionThree.perspectiveCamera
            ref={cameraRef}
            fov={90}
            position={[cameraX, cameraY, 3.8]}
        />
    )
}

const spring = { stiffness: 600, damping: 30 }

const mouseToLightRotation = (v) => (-1 * v) / 140
