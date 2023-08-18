<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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
  camera.position.set(10, 40, 40)
  // 设置摄像机方向
  camera.lookAt(0, 0, 0)
  return camera
}

const createControls = (camera, domElement) => {
  // 轨道控制器
  const controls = new OrbitControls(camera, domElement)
  return controls
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

const createMesh = () => {
  const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(15, 5, 0),
    new THREE.Vector3(20, 0, 5),
    new THREE.Vector3(20, 0, 15),
    new THREE.Vector3(10, 0, 20)
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  // 创建一个沿着三维曲线延伸的管道，这里调整参数生成存在宽度的曲线平面，类似道路效果
  const geometry = new THREE.TubeGeometry(curve, 64, 0.5, 2, false)

  const texture = new THREE.TextureLoader().load('/src/assets/textures/other/arrow.jpeg')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(32, 2)

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })
  return new THREE.Mesh(geometry, material)
}

const applyTween = (texture) => {
  const tween = new TWEEN.Tween({ x: 0 }).to({ x: 100 }).yoyo(true).repeat(Infinity)
  tween.onUpdate(() => {
    // 利用偏移属性来实现流动
    texture.offset.x -= 0.02
  })
  tween.start()
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

  const mesh = createMesh()
  scene.add(mesh)

  applyTween(mesh.material.map)

  const render = () => {
    controls.update()
    TWEEN.update()
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
