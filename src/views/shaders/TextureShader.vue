<script setup>
/**
 * 主要学习：
 * - step内置函数
 * - smoothstep内置函数
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
  camera.position.set(0, 0, 16)
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
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

const createMesh = (video) => {
  const vertexShader = `
      varying vec2 vUV;

		  void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  /**
   */
  const fragmentShader = `
      uniform sampler2D uTexture;

      varying vec2 vUV;
			void main() {
        gl_FragColor = texture2D(uTexture, vUV);
			}
  `
  const texture = new THREE.VideoTexture(video)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 9, 3), material)
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

  const video = document.getElementById('video')
  const mesh = createMesh(video)
  scene.add(mesh)

  const render = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
  }
  const handleClick = () => {
    video.play()
  }
  render()
  document.addEventListener('click', handleClick)

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick)
  })
})
</script>

<template>
  <div ref="containerElementRef" class="container">
    <video id="video" loop crossOrigin="anonymous" playsinline>
      <source src="/src/assets/video/gm.mp4" />
    </video>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}
#video {
  display: none;
}
</style>
