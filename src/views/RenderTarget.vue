<script setup>
/**
 * 主要学习：
 * - 渲染目标WebGLRenderTarget
 */
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  const dpr = window.devicePixelRatio

  // 创建场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfe3dd)

  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  camera.position.set(1, 1, 3)
  // 设置摄像机方向
  camera.lookAt(scene.position)

  const renderTarget = new THREE.WebGLRenderTarget(width, height)

  // 创建模型
  const [greenBoxModel, boxModel] = createModels(renderTarget)
  greenBoxModel.layers.set(1)
  scene.add(greenBoxModel)
  scene.add(boxModel)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(dpr)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false

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
    window.requestAnimationFrame(render)
  }

  render()
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
