<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import arrowAssets from '@/assets/textures/other/arrow.png'
import videoSource from '@/assets/video/gm.mp4'

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
  camera.position.set(0, 0, 60)
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
  controls.maxDistance = 80
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

// shader处理纹理
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

// shader中处理重复纹理以及offset
const createMesh2 = () => {
  const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(15, 5, 0),
    new THREE.Vector3(20, 0, 5),
    new THREE.Vector3(20, 0, 15),
    new THREE.Vector3(10, 0, 20)
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  // 创建一个沿着三维曲线延伸的管道，这里调整参数生成存在宽度的曲线平面，类似道路效果
  const geometry = new THREE.TubeGeometry(curve, 64, 0.5, 2, false)

  // 逐顶点
  const vertexShader = `
    varying vec2 vUV;

    void main() {
      vUV = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  // 逐片元
  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uTextureRepeat;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 point = vUV * uTextureRepeat + vec2(-mod(uTime, 2.0), 0.0);
      gl_FragColor = texture2D(uTexture, point);
    }
  `
  const texture = new THREE.TextureLoader().load(arrowAssets)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(32, 2)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: {
        value: texture
      },
      uTextureRepeat: {
        value: new THREE.Vector2(32, 2)
      },
      uTime: {
        value: 0.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(-10, 0, -1)
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

  const mesh2 = createMesh2()
  scene.add(mesh2)

  const mesh2Uniforms = mesh2.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh2Uniforms.uTime.value = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  const handleClick = () => {
    video.play()
  }
  render()
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
  cursor: pointer;
  overflow: hidden;
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
