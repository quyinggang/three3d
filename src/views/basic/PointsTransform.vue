<script setup>
/**
 * 主要学习：
 * - TWEEN补间动画应用
 * - 动态变换模型position属性
 * - 粒子变换逻辑
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createModels = () => {
  const box = new THREE.Points(
    new THREE.BoxGeometry(4, 4, 4, 8, 8, 8),
    new THREE.PointsMaterial({
      color: '#8A2BE2',
      size: 0.1
    })
  )

  const sphere = new THREE.Points(
    new THREE.SphereGeometry(2, 31, 15),
    new THREE.PointsMaterial({
      size: 0.1
    })
  )

  return [box, sphere]
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(0, 4, 18)
  // 设置摄像机方向
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
  controls.minDistance = 6
  controls.maxDistance = 40
  return controls
}

const switchToOtherShape = (origin, target) => {
  const originPosition = origin.geometry.attributes.position
  const targetPosition = target.geometry.attributes.position
  // 注意变换前后的Shape的粒子组成个数最好相同
  for (let index = 0, len = originPosition.count; index < len; index++) {
    const originPoint = {
      x: originPosition.getX(index),
      y: originPosition.getY(index),
      z: originPosition.getZ(index)
    }
    const targetPoint = {
      x: targetPosition.getX(index),
      y: targetPosition.getY(index),
      z: targetPosition.getZ(index)
    }
    // 应用Tween补间动画
    const tween = new TWEEN.Tween(originPoint).to(targetPoint, 1500)
    tween.delay(1000).yoyo(true).repeat(Infinity)
    tween.onUpdate(({ x, y, z }) => {
      // 更新坐标值
      originPosition.setXYZ(index, x, y, z)
    })
    tween.start()
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

  // 创建模型
  const [box, sphere] = createModels()
  scene.add(box)

  const render = () => {
    controls.update()
    // 每次渲染触发补间动画逻辑
    TWEEN.update()
    // 粒子坐标数据被更改，需要更新
    box.geometry.attributes.position.needsUpdate = true
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  switchToOtherShape(box, sphere)
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
