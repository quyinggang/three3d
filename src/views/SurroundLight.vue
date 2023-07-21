<script setup>
/**
 * 主要学习：
 * - 光源具象化
 * - 绕物体圆周运动
 */
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createModels = () => {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhysicalMaterial({ color: '#fff' })
  )
  box.scale.set(20, 20, 20)
  return box
}

const createFigurativeLights = () => {
  const geometry = new THREE.SphereGeometry(0.5, 16, 8)
  const sphere1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#FFFF00' }))
  const light1 = new THREE.SpotLight('#FFFF00', 1, 100)
  // 具象化灯光，灯光继承自Object3D，可将Mesh作为灯光的子对象
  light1.add(sphere1)

  const sphere2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#FF0000' }))
  const light2 = new THREE.SpotLight('#FF0000', 1, 100)
  light2.add(sphere2)

  return [light1, light2]
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  // 创建场景
  const scene = new THREE.Scene()

  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  camera.position.set(0, 0, 120)
  // 设置摄像机方向
  camera.lookAt(scene.position)

  // 地板
  const geometry = new THREE.PlaneGeometry(100, 100, 20)
  const material = new THREE.MeshPhongMaterial({
    color: '#fff'
  })
  const ground = new THREE.Mesh(geometry, material)
  ground.position.set(0, -20, 0)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  // 创建模型
  const box = createModels()
  scene.add(box)

  // 具象的灯光
  const [light1, light2] = createFigurativeLights()
  scene.add(light1)
  scene.add(light2)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  const speed = 30
  const clock = new THREE.Clock()
  const controls = new OrbitControls(camera, renderer.domElement)

  const render = () => {
    // 绕物体圆周运行
    const elapsedTime = clock.getElapsedTime()
    const rad = THREE.MathUtils.degToRad((elapsedTime * speed) % 360)
    const x = Math.sin(rad) * 30
    const z = Math.cos(rad) * 30

    controls.update()
    box.rotation.y -= 0.01
    light1.position.set(x, 1, z)
    light2.position.set(-x, 1, -z)
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
