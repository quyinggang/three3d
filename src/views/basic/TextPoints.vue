<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import regularFontJson from '@/assets/fonts/regular.json?url'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(10, 45, 45)
  // 设置摄像机方向
  camera.lookAt(0, 0, 0)
  return camera
}

const createWebGLRenderer = (canvasElement, width, height) => {
  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  return renderer
}

// 使用MeshSurfaceSampler对模型表面采样得到一系列点坐标实现粒子化
const surfaceSamplerFromMesh = (mesh, count = 10000) => {
  const sampler = new MeshSurfaceSampler(mesh).build()
  const pointsGeometry = new THREE.BufferGeometry()
  const positions = []
  let samplePoint = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    sampler.sample(samplePoint)
    positions.push(samplePoint.x, samplePoint.y, samplePoint.z)
  }

  pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return pointsGeometry
}

const createTextPoints = ({ font, size }) => {
  const textGeometry = new TextGeometry('Three.js', {
    font,
    size,
    height: 4,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.2,
    bevelSegments: 5
  })
  textGeometry.computeBoundingBox()

  const mesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))


  const vertexShader = `
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 0.5 * (600.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `
  const fragmentShader = `
    uniform vec3 u_color;

    float circle(vec2 coord, float radius) {
      float distance = length(coord - vec2(0.5));
      return 1.0 - smoothstep(radius, radius + 0.01, distance);
    }

    void main() {
      float opacity = circle(gl_PointCoord, 0.5);
      if (opacity < 0.5) discard;
      gl_FragColor = vec4(u_color, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_color: { value: new THREE.Color('#0074E4') }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const pointsGeometry = surfaceSamplerFromMesh(mesh, 6000)

  const points = new THREE.Points(pointsGeometry, material)
  const boundingBox = textGeometry.boundingBox
  const centerOffset = -0.5 * (boundingBox.max.x - boundingBox.min.x)
  points.position.set(centerOffset, 0, 0)
  return points
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  const fontLoader = new FontLoader()
  fontLoader.load(regularFontJson, (font) => {
    const textPoints = createTextPoints({
      font,
      size: width * 0.01
    })
    scene.add(textPoints)
  })

  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    const rad = THREE.MathUtils.degToRad((elapsedTime * 18.0) % 360)
    const x = Math.sin(rad) * 30
    const z = Math.cos(rad) * 30

    camera.position.x = x;
    camera.position.z = z;
    camera.lookAt( scene.position );

    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()

  onBeforeUnmount(() => {
    renderer.dispose()
    renderer.forceContextLoss()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Object3D) {
        const { geometry, material } = obj
        geometry && geometry.dispose()
        const materials = Array.isArray(material) ? material : [material]
        for (const item of materials) {
          item && item.dispose()
        }
      }
    })
    window.cancelAnimationFrame(raf)
  })
})
</script>

<template>
  <div ref="containerElementRef" class="container">
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
