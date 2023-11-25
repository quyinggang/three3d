<script setup>
/**
 * 主要学习：
 * - FBX模型文件加载
 * - 模型线框化应用
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import shanghaiAssets from '@/assets/models/shanghai.FBX?url'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
let raf = null

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000)
  camera.position.set(0, 50, 1000)
  camera.lookAt(0, 0, 0)
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

const createControls = (camera, domElement) => {
  const controls = new OrbitControls(camera, domElement)
  controls.enableDamping = true
  controls.minDistance = 300
  controls.maxDistance = 6000
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

const createLights = () => {
  const group = new THREE.Group()
  const light = new THREE.AmbientLight(0xadadad)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(600, 600, 0)

  group.add(light)
  group.add(directionalLight)

  return group
}

const loadCityModels = (onLoaded) => {
  const fbxLoader = new FBXLoader()
  fbxLoader.load(shanghaiAssets, (group) => {
    onLoaded && onLoaded(group)
  })
}

const modelHandlerMap = {
  CITY_UNTRIANGULATED: (model, group) => {
    // 城市建筑
    const { geometry, position, material } = model
    // 模型线框化
    const lineBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 1),
      new THREE.LineBasicMaterial({ color: '#2685fe' })
    )
    lineBox.position.copy(position)
    // 模型坐标系与WebGL坐标系不同需要处理
    lineBox.rotateX(-Math.PI / 2)
    group.add(lineBox)

    // 更改建筑模型材质
    material.color = new THREE.Color('#0e233d')
    material.transparent = true
    material.opacity = 0.9
    group.add(model)
  },
  LANDMASS: (model, group) => {
    // 地面
    const material = model.material
    material.color = new THREE.Color('#040912')
    material.transparent = true
    material.opacity = 0.8
    group.add(model)
  },
  ROADS: (model, group) => {
    // 道路
    const material = model.material
    material.color = new THREE.Color('#292e4c')
    group.add(model)
  }
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
  const groupLights = createLights()
  scene.add(groupLights)

  loadCityModels((cityScene) => {
    const group = new THREE.Group()
    cityScene.children.forEach((item) => {
      const clonedData = item.clone()
      const handler = modelHandlerMap[clonedData.name]
      handler && handler(clonedData, group)
    })
    scene.add(group)
  })

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
