<script setup>
/**
 * 主要学习：
 * - clamp
 * - 周期性函数应用
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
  camera.position.set(0, 0, 8)
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
  controls.minDistance = 3
  controls.maxDistance = 40
  return controls
}

const createMesh = () => {
  const vertexShader = `
			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  /**
   * clamp就是min(maxValue, max(value, minValue))
   * sin函数是周期性函数，在一定范围内反复波动，依此可以实现周期性效果
   * GLSL还提供其他周期性函数，例如cos、mod等，具体的波形周期可以具体查看
   */
  const fragmentShader = `
      uniform vec3 color;
      uniform float time;

			void main() {
        float colorR = clamp(sin(time), 0.0, 1.0);
        vec3 newColor = vec3(colorR, color.yz);
        gl_FragColor = vec4(newColor, 1.0);
			}
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#FF0000') },
      time: { value: 1.0 }
    },
    vertexShader,
    fragmentShader
  })
  return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
}

const createMesh2 = () => {
  const vertexShader = `
      uniform float time;

			void main() {
        vec3 newPosition = vec3(position.xy, sin(time));
				gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
			}
  `
  const fragmentShader = `
      uniform vec3 color;

			void main() {
        gl_FragColor = vec4(color, 1.0);
			}
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#FF0000') },
      time: { value: 1.0 }
    },
    vertexShader,
    fragmentShader
  })
  return new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 2), material)
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

  const box = createMesh()
  box.position.set(-1, 0, 0)
  scene.add(box)

  const plane = createMesh2()
  plane.position.set(1, 0, 0)
  scene.add(plane)

  const planeMaterialUniforms = plane.material.uniforms
  const materialUniforms = box.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    const time = clock.getElapsedTime()
    controls.update()
    materialUniforms.time.value = time
    planeMaterialUniforms.time.value = time
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
