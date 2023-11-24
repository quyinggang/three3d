<script setup>
/**
 * 主要学习：
 * - group分组
 * - 灯光应用
 * - 轨道控制器OrbitControls
 * - 阴影渲染
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createRoom = () => {
  const houseGroup = new THREE.Group()
  // 房屋主体
  const wallHeight = 3
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(6, wallHeight, 6),
    new THREE.MeshStandardMaterial({
      color: '#696969'
    })
  )
  body.position.set(0, wallHeight / 2, 0)

  // 房屋顶部
  const roofHeight = 1.5
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(5.3, roofHeight, 4, 1),
    new THREE.MeshStandardMaterial({ color: '#e9967a' })
  )
  roof.position.set(0, wallHeight + roofHeight / 2, 0)
  roof.rotateY(Math.PI * 0.25)

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 2, 3),
    new THREE.MeshStandardMaterial({ color: '#fff' })
  )
  door.position.set(0, 1, 3.01)
  houseGroup.add(body)
  houseGroup.add(roof)
  houseGroup.add(door)
  return houseGroup
}

const createBush = () => {
  const group = new THREE.Group()
  const bushGeometry = new THREE.SphereGeometry(0.6, 32, 16)
  const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })
  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
  bush1.position.set(-2, 0.3, 4)
  bush1.castShadow = true

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
  bush2.position.set(-1.35, 0.1, 4.3)
  bush2.scale.set(0.4, 0.4, 0.4)
  bush2.castShadow = true

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
  bush3.position.set(2.5, 0, 5)
  bush3.castShadow = true

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
  bush4.position.set(3, 0, 5.8)
  bush4.scale.set(0.5, 0.5, 0.5)
  bush4.castShadow = true

  const bush5 = new THREE.Mesh(bushGeometry, bushMaterial)
  bush5.position.set(-2, 0, 6)
  bush5.scale.set(0.4, 0.4, 0.4)
  bush5.castShadow = true

  group.add(bush1)
  group.add(bush2)
  group.add(bush3)
  group.add(bush4)
  group.add(bush5)
  return group
}

// 灯光对象也可以使用group组合
const createLight = () => {
  const group = new THREE.Group()
  const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
  // Directional light
  const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.3)
  moonLight.position.set(10, 10, 10)
  // Door light
  const doorLight = new THREE.PointLight('#ff7d46', 3, 15)
  doorLight.position.set(0, 2.8, 3.55)
  doorLight.castShadow = true

  group.add(ambientLight)
  group.add(moonLight)
  group.add(doorLight)
  return group
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  // 雾化效果，增加夜晚漆黑模糊效果
  scene.fog = new THREE.Fog('#262837', 1, 15)
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(3, 2, 14)
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
  // 开启阴影渲染
  renderer.shadowMap.enabled = true

  return renderer
}

const createControls = (camera, domElement) => {
  // 轨道控制器
  const controls = new OrbitControls(camera, domElement)
  controls.enablePan = false
  // 缩放距离（PerspectiveCamera的设置）
  controls.minDistance = 10
  controls.maxDistance = 50
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
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60, 10),
    new THREE.MeshStandardMaterial({
      color: '#98a97c'
    })
  )
  ground.rotateX(-Math.PI / 2)
  ground.receiveShadow = true
  scene.add(ground)
  // 房屋
  const room = createRoom()
  scene.add(room)
  // 周围环境物体
  const bush = createBush()
  scene.add(bush)
  // 灯光
  const light = createLight()
  scene.add(light)

  const render = () => {
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
