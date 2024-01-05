<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import videoSource from '@/assets/video/sintel.mp4'

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
  camera.position.set(0, 0, 14)
  // 设置摄像机方向
  camera.lookAt(0, 0, 0)
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

const createVideoPlane = (video) => {
  const texture = new THREE.VideoTexture(video)

  const group = new THREE.Group()
  const config = {
    width: 16,
    height: 9,
    xGrid: 4,
    yGrid: 3,
    offset: 0.1
  }
  const ux = 1 / config.xGrid
  const uy = 1 / config.yGrid
  const planeWidth = config.width / config.xGrid - config.offset
  const planeHeight = config.height / config.yGrid - config.offset
  for (let i = 0; i < config.xGrid; i++) {
    for (let j = 0; j < config.yGrid; j++) {
      // 创建 4 * 3 子平面实现整体效果
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      })

      // 切割uv来实现纹理映射到全部平面
      const uvs = geometry.attributes.uv.array
      for (let index = 0; index < uvs.length; index += 2) {
        uvs[index] = (uvs[index] + i) * ux
        uvs[index + 1] = (uvs[index + 1] + j) * uy
      }

      const mesh = new THREE.Mesh(geometry, material)

      mesh.dx = 0.004 * (0.5 - Math.random())
      mesh.dy = 0.004 * (0.5 - Math.random())

      const x = (i - config.xGrid / 2) * planeWidth + planeWidth * 0.5 + (i * config.offset) / 2
      const y = (j - config.yGrid / 2) * planeHeight + planeHeight * 0.5 + (j * config.offset) / 2
      mesh.position.set(x, y, 0)
      group.add(mesh)
    }
  }

  return group
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  const video = document.getElementById('video')

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  const plane = createVideoPlane(video)
  scene.add(plane)

  const clock = new THREE.Clock()
  const group = plane.children
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    for (const mesh of group) {
      mesh.rotation.x += Math.sin(elapsedTime * 0.1) * mesh.dx;
      mesh.rotation.y += Math.sin(elapsedTime * 0.2) * mesh.dy;

      mesh.position.x -= Math.sin(elapsedTime * 0.1) * mesh.dx;
      mesh.position.y += Math.sin(elapsedTime * 0.3) * mesh.dy;
      mesh.position.z += Math.cos(elapsedTime * 0.2) * mesh.dx;
    }
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()

  const handleClick = () => video.play()
  containerElement.addEventListener('click', handleClick)

  onBeforeUnmount(() => {
    containerElement.removeEventListener('click', handleClick)
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
    <span class="tip">点击页面播放视频</span>
    <video id="video" loop crossOrigin="anonymous" playsinline>
      <source :src="videoSource" />
    </video>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

#video {
  display: none;
}

.tip {
  position: absolute;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: #fff;
  user-select: none;
  pointer-events: none;
}
</style>
