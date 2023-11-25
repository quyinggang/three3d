<script setup>
/**
 * 主要学习：
 * - CubeTextureLoader
 * - TextureLoader
 */
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import pxAssets from '@/assets/textures/cube/px.png'
import nxAssets from '@/assets/textures/cube/nx.png'
import pyAssets from '@/assets/textures/cube/py.png'
import nyAssets from '@/assets/textures/cube/ny.png'
import pzAssets from '@/assets/textures/cube/pz.png'
import nzAssets from '@/assets/textures/cube/nz.png'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const schemeIdRef = ref(0)
const images = [pxAssets, nxAssets, pyAssets, nyAssets, pzAssets, nzAssets]

// 方案一：使用立方体+贴图
const createCubeScheme = () => {
  const scene = new THREE.Scene()
  const loader = new THREE.TextureLoader()
  const materials = images.map((url) => {
    // 资源的加载需要时间，最好的处理是等资源加载完成再渲染
    return new THREE.MeshBasicMaterial({
      // loader支持异步方法，即loadAsync
      map: loader.load(url)
    })
  })
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const cube = new THREE.Mesh(geometry, materials)
  // 关键逻辑实现，缩放值−1在任何单轴上 都会镜像对象而不影响大小
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

const createCamera = (aspect) => {
  // 摄像机需要再立方体内部
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
  camera.position.z = 0.1
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
  controls.enableZoom = false
  return controls
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  let scene = null
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const controls = createControls(camera, renderer.domElement)

  watch(
    schemeIdRef,
    (value) => {
      scene = value === 1 ? createEnvMapScheme() : createCubeScheme()
    },
    { immediate: true }
  )

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
