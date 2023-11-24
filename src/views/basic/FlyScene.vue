<script setup>
/**
 * 主要学习：
 * - 粒子系统
 * - canvasTexture：canvas作为贴图来源
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
let raf = null

const range = 50

const getNumberInRange = (min, max) => {
  const range = max - min
  const r = Math.random()
  return Math.round(r * range + min)
}

const getCanvasTexture = () => {
  const canvas = document.createElement('canvas')
  const base = 25
  const size = window.devicePixelRatio * base
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  context.save()
  context.beginPath()
  context.fillStyle = 'rgb(228,212,70)'
  context.shadowColor = 'rgb(228,212,70)'
  context.shadowBlur = 14
  context.shadowOffsetX = 0
  context.shadowOffsetY = 0
  context.arc(base, base, 8, 0, Math.PI * 2)
  context.fill()
  context.closePath()
  context.restore()
  return canvas
}

// 使用Points+贴图来实现，可以使用Sprite + 贴图实现
const createFirefly = () => {
  const vertices = []
  const speedList = []
  const speedRate = 0.008
  for (let index = 0; index < 333; index++) {
    const x = THREE.MathUtils.randFloatSpread(10)
    const y = THREE.MathUtils.randFloatSpread(10)
    const z = THREE.MathUtils.randFloatSpread(30)
    const speedX = getNumberInRange(-1, 1) * speedRate
    const speedY = getNumberInRange(-1, 1) * speedRate
    const speedZ = getNumberInRange(-1, 1) * speedRate
    vertices.push(x, Math.max(1, y), z)
    // 每个粒子都有自己的速度和方向
    speedList.push(speedX || speedRate, speedY || speedRate, speedZ || speedRate)
  }
  const canvasElement = getCanvasTexture()
  const canvasTexture = new THREE.CanvasTexture(canvasElement)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('customData', new THREE.Float32BufferAttribute(speedList, 3))
  // 关闭depth处理可以避免贴图遮挡后面物体
  const material = new THREE.PointsMaterial({
    transparent: true,
    map: canvasTexture,
    depthTest: false,
    depthWrite: false
  })
  return new THREE.Points(geometry, material)
}

const createGround = () => {
  // 地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(range * 2, range * 2, 10),
    new THREE.MeshStandardMaterial({
      color: '#98a97c'
    })
  )
  ground.rotateX(-Math.PI / 2)
  return ground
}

const createLight = () => {
  const group = new THREE.Group()
  const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
  const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.3)
  moonLight.position.set(10, 10, 10)

  group.add(ambientLight)
  group.add(moonLight)
  return group
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  // 雾化效果，增加夜晚漆黑模糊效果
  scene.fog = new THREE.Fog('#262837', 1, 30)
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(3, 2, 20)
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

const createControls = (camera, domElement) => {
  const controls = new OrbitControls(camera, domElement)
  controls.enablePan = false
  // 缩放距离（PerspectiveCamera的设置）
  controls.minDistance = 10
  // 设置垂直方面角度范围，避免看到地面底部
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const controls = createControls(camera, renderer.domElement)

  // 地面
  const ground = createGround()
  scene.add(ground)

  // 萤火虫
  const fireflyGroup = createFirefly()
  scene.add(fireflyGroup)

  // 灯光
  const light = createLight()
  scene.add(light)

  const render = () => {
    let isNeedUpdateSpeedData = false
    const { position: geometryPosition, customData } = fireflyGroup.geometry.attributes
    for (let index = 0, len = geometryPosition.count; index < len; index++) {
      const x = geometryPosition.getX(index)
      const y = geometryPosition.getY(index)
      const z = geometryPosition.getZ(index)
      const speedX = customData.getX(index)
      const speedY = customData.getY(index)
      const speedZ = customData.getZ(index)
      const newX = x + speedX
      const newY = y + speedY
      const newZ = z + speedZ
      if (newX > range / 4 || newX < -range / 4) {
        isNeedUpdateSpeedData = true
        customData.setX(index, -speedX)
      }
      if (newY > range / 4 || newY <= 1) {
        isNeedUpdateSpeedData = true
        customData.setY(index, -speedY)
      }
      if (newZ > range / 4 || newZ <= -range / 4) {
        isNeedUpdateSpeedData = true
        customData.setZ(index, -speedZ)
      }
      geometryPosition.setXYZ(index, newX, newY, newZ)
    }
    // 更新BufferAttribute
    fireflyGroup.geometry.attributes.position.needsUpdate = true
    if (isNeedUpdateSpeedData) {
      fireflyGroup.geometry.attributes.customData.needsUpdate = true
    }
    controls.update()
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
