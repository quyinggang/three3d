<script setup>
/**
 * 主要学习：
 * - 法线向量normal
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
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(3, 3, 3)
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
  controls.minDistance = 2
  controls.maxDistance = 40
  return controls
}

const createMesh = () => {
  const vertexShader = `
      varying vec3 vNormal;

			void main() {
        vNormal = normal;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  /**
   * 利用法线向量实现六色立方体
   */
  const fragmentShader = `
    uniform vec3 uColor[6];

    varying vec3 vNormal;

    void main() {
      int index = 0;
      index = vNormal.z == 1.0 ? 0 : index;
      index = vNormal.z == -1.0 ? 1 : index;
      index = vNormal.x == -1.0 ? 2 : index;
      index = vNormal.x == 1.0 ? 3 : index;
      index = vNormal.y == 1.0 ? 4 : index;
      index = vNormal.y == -1.0 ? 5 : index;
      
      gl_FragColor = vec4(uColor[index], 1.0);
    }

  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: [
          new THREE.Color('#ff0000'),
          new THREE.Color('#00ffff'),
          new THREE.Color('#7b68ee'),
          new THREE.Color('#0000ff'),
          new THREE.Color('#006400'),
          new THREE.Color('#ff00ff')
        ]
      }
    },
    vertexShader,
    fragmentShader
  })
  return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
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
