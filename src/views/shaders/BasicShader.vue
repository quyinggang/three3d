<script setup>
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
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(0, 2, 6)
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
  // 逐顶点
  const vertexShader = `
    void main() {
      // 顶点坐标位置
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  // 逐片元
  const fragmentShader = `
    void main() {
      // 片元颜色
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
  mesh.position.set(-1, 0, 0)
  return mesh
}

const createMesh2 = () => {
  // 逐顶点
  const vertexShader = `
    void main() {
      // 顶点坐标位置
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  // 逐片元
  const fragmentShader = `
    // 全局属性就意味着在每个片元处理时都是相同值
    uniform vec3 u_color;

    void main() {
      // 片元颜色
      gl_FragColor = vec4(u_color, 1.0);
    }
  `
  // 使用自定义颜色
  const material = new THREE.ShaderMaterial({
    // 定义uniforms全局变量
    uniforms: {
      u_color: { value: new THREE.Color('#9932CC') }
    },
    vertexShader,
    fragmentShader
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
  mesh.position.set(1, 0, 0)
  return mesh
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
  const mesh2 = createMesh2()
  scene.add(mesh2)

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
