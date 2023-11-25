<script setup>
/**
 * 主要学习：
 * - 外发光效果纹理方式实现
 * - size更改实现闪烁效果
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { generateRandomXYZ, generateRandomColor } from '@/tools/util'
import sparkAssets from '@/assets/textures/sprites/spark.png'

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
  camera.position.set(0, 10, 200)
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
  controls.enableDamping = true
  controls.minDistance = 10
  controls.maxDistance = 300
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

const createShaderMaterial = () => {
  const vertexShader = `
    attribute float size;
		attribute vec3 customColor;
    varying vec3 vColor;
    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = size * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }
  `
  const fragmentShader = `
    uniform vec3 color;
		uniform sampler2D pointTexture;
		varying vec3 vColor;
		void main() {
		  gl_FragColor = vec4( color * vColor, 1.0 );
			gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
	  }
  `
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: {
        value: new THREE.TextureLoader().load(sparkAssets)
      }
    },
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  })
}

const createStars = () => {
  const geometry = new THREE.BufferGeometry()
  const material = createShaderMaterial()
  const positions = []
  const colors = []
  const sizes = []
  for (let index = 0; index < 10; index++) {
    const [x, y, z] = generateRandomXYZ({ x: 300, y: 200, z: 100 })
    const color = new THREE.Color(generateRandomColor())
    colors.push(color.r, color.g, color.b)
    positions.push(x, y, z)
    sizes.push(60)
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

  return new THREE.Points(geometry, material)
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

  const stars = createStars()
  scene.add(stars)

  const clock = new THREE.Clock()
  const sizeBufferAttribute = stars.geometry.attributes.size
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    // 修改size大小实现
    for (let index = 0; index < sizeBufferAttribute.count; index++) {
      sizeBufferAttribute.setX(index, Math.sin(elapsedTime) * 26 + 40)
    }
    sizeBufferAttribute.needsUpdate = true
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
