<script setup>
/**
 * 主要学习：
 * - 纹理坐标uv
 */
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
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
  camera.position.set(0, 0, 3)
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
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  /**
   * 利用uv坐标实现同心圆环，每个平面的uv坐标范围是[0, 1]
   * 平面坐标系中心的uv坐标就是vec2(0.5, 0.5)
   */
  const fragmentShader = `
    uniform vec3 uColor[3];

    varying vec2 vUV;

    const float radius = 0.15;
    const float step = 0.015;

    void main() {
      float distance = length(vUV - vec2(0.5, 0.5));
      int targetIndex = -1;
      for(int index = 1; index <= 3; index++) {
        if (abs(distance - (radius * float(index))) < step) {
          targetIndex = index - 1;
          break;
        }
      }
      float opacity = targetIndex >= 0 ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor[targetIndex], opacity);
    }

  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: [new THREE.Color('#00FFFF'), new THREE.Color('#FF00FF'), new THREE.Color('#DC143C')]
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
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
