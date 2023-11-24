<script setup>
/**
 * 主要学习：
 * - 第一人称视角实现
 * - 曲线getPointAt、getTangentAt方法
 * - lookAt
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const cameraViewRef = ref(0)
let raf = null

const createCurvePath = () => {
  const group = new THREE.Group()
  const initialPoints = [
    { x: 1, y: 1, z: -1 },
    { x: 1, y: 0, z: 1 },
    { x: -1, y: 0, z: 1 },
    { x: -1, y: 0, z: -1 }
  ]
  const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  const boxMaterial = new THREE.MeshBasicMaterial()
  for (const point of initialPoints) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.copy(point)
    group.add(box)
  }

  // curve->点->LineLoop，这里需要注意是共用Mesh Position
  const curve = new THREE.CatmullRomCurve3(
    group.children.map((mesh) => mesh.position),
    true
  )
  curve.curveType = 'centripetal'
  const points = curve.getPoints(50)
  const curveObject = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
  )
  return [group, curveObject, curve]
}

const createMotionModel = () => {
  const geometry = new THREE.ConeGeometry(0.04, 0.3, 32)
  geometry.rotateX(Math.PI / 2)
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  const cone = new THREE.Mesh(geometry, material)
  return cone
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
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

const handleViewSwitch = () => {
  cameraViewRef.value = 1 - cameraViewRef.value
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  // 相机辅助
  const helper = new THREE.CameraHelper(camera)
  scene.add(helper)

  // 曲线路径
  const [group, curveObject, curve] = createCurvePath()
  scene.add(group)
  scene.add(curveObject)

  // 运动物体
  const cylinder = createMotionModel()
  scene.add(cylinder)

  let progress = 0
  const velocity = 0.0015
  const cameraPosition = new THREE.Vector3()
  const cameraLookAt = new THREE.Vector3()
  const updatePositionLookAt = () => {
    if (progress <= 1 - velocity) {
      const position = curve.getPointAt(progress)
      const tangent = curve.getTangentAt(progress)
      // 计算出方向点即相邻的下一个曲线点，也可以通过curve.getPointAt(progress + velocity)实现
      const lookAt = tangent.add(position)

      if (cameraViewRef.value === 0) {
        cameraPosition.set(3, 3, 3)
        cameraLookAt.set(0, 0, 0)
      } else {
        cameraPosition.copy(position)
        cameraLookAt.copy(lookAt)
      }
      // 物体绕曲线运动的另一种方案
      cylinder.position.copy(position)
      /*
        lookAt是旋转物体使其在世界空间中面朝一个点
        Mesh也可以使用lookAt，需要注意的是该方法不支持其父级被旋转过或者被位移过的物体
      */
      cylinder.lookAt(lookAt)
      /*
        摄像机位置以及方向是实现第一人称视角关键逻辑，第一人称视角下需要注意摄像机的近平面的数值
        所谓的第一人称视角本质上就是摄像机的位置距离足够近
      */
      camera.position.copy(cameraPosition)
      camera.lookAt(cameraLookAt)
      progress += velocity
    } else {
      progress = 0
    }
  }

  const render = () => {
    updatePositionLookAt()
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
    <span class="button" @click="handleViewSwitch">切换视角</span>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
