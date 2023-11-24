<script setup>
/**
 * 主要学习：
 * - 渲染目标WebGLRenderTarget
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createModels = (renderTarget) => {
  const greenBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: '#8A2BE2'
    })
  )

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: '#808080',
      map: renderTarget.texture
    })
  )

  return [greenBox, box]
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfe3dd)
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(1, 1, 3)
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
  controls.enableZoom = false
  return controls
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  const dpr = window.devicePixelRatio

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const controls = createControls(camera, renderer.domElement)

  const renderTarget = new THREE.WebGLRenderTarget(width * dpr, height * dpr)

  // 创建模型
  const [greenBoxModel, boxModel] = createModels(renderTarget)
  greenBoxModel.layers.set(1)
  scene.add(greenBoxModel)
  scene.add(boxModel)

  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    // 渲染出画面到RenderTarget，作为对应模型的纹理
    camera.layers.set(1)
    greenBoxModel.rotateX(Math.sin(elapsedTime) * 0.025)
    greenBoxModel.rotateY(Math.cos(elapsedTime) * 0.025)
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)

    // 渲染到屏幕
    camera.layers.set(0)
    renderer.setRenderTarget(null)
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
