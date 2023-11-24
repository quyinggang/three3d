<script setup>
/**
 * 主要学习：
 * - 模型线框化实现
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000)
  camera.position.set(0, 5, 10)
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
  controls.minDistance = 10
  controls.maxDistance = 100
  return controls
}

const createModels = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const box1 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: '#2685fe'
    })
  )
  box1.position.set(-3, 0, 0)

  const box2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: '#9400D3'
    })
  )
  box2.position.set(-1, 0, 0)

  const box3 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: '#FF0000'
    })
  )
  box3.position.set(1, 0, 0)

  const box4 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: '#FFA500'
    })
  )
  box4.position.set(3, 0, 0)

  return [box1, box2, box3, box4]
}

/**
 * 方案一：wireframe
 */
const applyWireframeScheme = (model) => {
  model.material.wireframe = true
}

/**
 * 方案二：线段渲染模式
 */
const applyLineScheme = (model) => {
  const line = new THREE.Line(
    model.geometry,
    new THREE.LineBasicMaterial({ color: model.material.color })
  )
  line.position.copy(model.position)
  return line
}

/**
 * 方案三：EdgesGeometry + LineSegments
 */
const applyEdgeScheme = (model) => {
  const { position, geometry } = model
  const color = model.material.color
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({ color })
  const line = new THREE.LineSegments(edges, material)
  line.position.copy(position)
  return line
}

/**
 * 方案四：WireframeGeometry + LineSegments
 */
const applyWireframeGeometryScheme = (model) => {
  const line = new THREE.LineSegments(
    new THREE.WireframeGeometry(model.geometry),
    new THREE.LineBasicMaterial({
      color: model.material.color
    })
  )
  line.position.copy(model.position)
  return line
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

  const [box1, box2, box3, box4] = createModels()
  applyWireframeScheme(box1)
  scene.add(box1)

  const lineModel = applyLineScheme(box2)
  scene.add(lineModel)

  const edgeLine = applyEdgeScheme(box3)
  scene.add(edgeLine)

  const wireLine = applyWireframeGeometryScheme(box4)
  scene.add(wireLine)

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
