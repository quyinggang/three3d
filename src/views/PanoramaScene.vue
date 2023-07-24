<script setup>
/**
 * 主要学习：
 * - 裁剪测试Scissor Test
 * - viewport视口范围定义
 */
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const schemeIdRef = ref(0)
const images = [
  '/src/assets/textures/cube/px.png',
  '/src/assets/textures/cube/nx.png',
  '/src/assets/textures/cube/py.png',
  '/src/assets/textures/cube/ny.png',
  '/src/assets/textures/cube/pz.png',
  '/src/assets/textures/cube/nz.png'
]

// 方案一：使用立方体+贴图
const createCubeScheme = () => {
  const scene = new THREE.Scene()
  const loader = new THREE.TextureLoader()
  const materials = images.map((url) => {
    // 资源的加载需要时间，最好的处理是等资源加载完成再渲染
    return new THREE.MeshBasicMaterial({
      map: loader.load(url)
    })
  })
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const cube = new THREE.Mesh(geometry, materials)
  // 关键逻辑实现
  geometry.scale(1, 1, -1)
  scene.add(cube)

  return scene
}

// 方案二：环境贴图 + 立方纹理
const createEnvMapScheme = () => {
  const scene = new THREE.Scene()
  const cubeTexture = new THREE.CubeTextureLoader().load(images)
  scene.background = cubeTexture
  return scene
}

const handleSchemeSwitch = () => {
  schemeIdRef.value = 1 - schemeIdRef.value
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  let scene = null

  watch(
    schemeIdRef,
    (value) => {
      scene = value === 1 ? createEnvMapScheme() : createCubeScheme()
    },
    { immediate: true }
  )

  // 摄像机需要再立方体内部
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 0.1
  // 设置摄像机方向
  camera.lookAt(scene.position)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableZoom = false
  const render = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
  }
  render()
})
</script>

<template>
  <div ref="containerElementRef" class="container">
    <div class="button" @click="handleSchemeSwitch">
      <span>方案切换：</span>
      <span>当前方案{{ schemeIdRef }}</span>
    </div>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;
  font-size: 18px;
  color: #fff;
}
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
