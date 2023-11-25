<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import nipplejs from 'nipplejs'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import soldierAssets from '@/assets/models/Soldier.glb?url'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
let raf = null

const createGround = () => {
  const group = new THREE.Group()
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xcbcbcb, depthWrite: false })
  )
  mesh.rotation.x = -Math.PI / 2
  group.add(mesh)
  const gridHelper = new THREE.GridHelper(100, 100)
  group.add(gridHelper)
  return group
}

const createLights = () => {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.8)
  hemiLight.position.set(0, 120, 100)

  const dirLight = new THREE.DirectionalLight(0xffffff, 4)
  dirLight.position.set(0, 400, -400)
  return [dirLight, hemiLight]
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xa0a0a0)
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)
  return scene
}

const createCamera = (aspect, initialCameraPos, lookAt) => {
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.copy(initialCameraPos)
  camera.lookAt(lookAt)
  return camera
}

const createWebGLRenderer = (canvasElement, width, height) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  return renderer
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  const initialCameraPos = new THREE.Vector3(0, 3, 6)
  const initialCameraLookAt = new THREE.Vector3(0, 1, 0)
  const speedRatio = 0.1
  const mixers = []
  let moveAction = null
  let idleAction = null

  const scene = createScene()
  const camera = createCamera(width / height, initialCameraPos, initialCameraLookAt)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  // 创建模型
  let box = null

  const ground = createGround()
  scene.add(ground)
  const lights = createLights()
  lights.forEach((light) => scene.add(light))

  const loader = new GLTFLoader()
  loader.load(soldierAssets, (gltf) => {
    const animations = gltf.animations
    box = SkeletonUtils.clone(gltf.scene)

    const moveMixer = new THREE.AnimationMixer(box)
    const idleMixer = new THREE.AnimationMixer(box)
    idleAction = idleMixer.clipAction(animations[0])
    moveAction = moveMixer.clipAction(animations[1])

    idleAction.play()
    mixers.push(idleMixer, moveMixer)
    scene.add(box)
  })

  const manager = nipplejs.create({
    zone: containerElement,
    mode: 'static',
    color: 'black',
    position: {
      bottom: '10%',
      right: '50%'
    }
  })
  const speed = new THREE.Vector2()
  let oldRad = 0
  const stop = () => {
    speed.set(0, 0)
    moveAction.stop()
    idleAction.play()
  }
  const run = () => {
    idleAction.stop()
    moveAction.play()
  }
  manager.on('move', (evt, data) => {
    const { angle, vector } = data
    if (angle) {
      // nipplejs的坐标是笛卡尔坐标系所以需要处理：偏移90度，3D坐标系z轴正负方向相反
      const rad = angle.radian - Math.PI * 0.5
      box.rotateY(rad - oldRad)
      speed.set(vector.x, -vector.y)
      oldRad = rad
      run()
    } else {
      stop()
    }
  })
  manager.on('end', () => stop())

  const clock = new THREE.Clock()

  const render = () => {
    const delta = clock.getDelta()
    for (const mixer of mixers) {
      mixer.update(delta)
    }
    if (box && speed.length() > 0) {
      const { x, y } = speed.clone().normalize().multiplyScalar(speedRatio)
      box.position.x += x
      box.position.z += y

      // 场景1：相机跟随人物，相对位置不变，只更新位置信息
      camera.position.x += x
      camera.position.z += y

      // 场景2：相机跟随人物，相对位置不变，相机会应用人物模型世界矩阵，会存在旋转
      // const cameraPosition = initialCameraPos.clone()
      // const newCameraPos = cameraPosition.applyMatrix4(box.matrixWorld)
      // camera.position.copy(newCameraPos)
      camera.lookAt(box.position.clone().add(initialCameraLookAt))
    }

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
