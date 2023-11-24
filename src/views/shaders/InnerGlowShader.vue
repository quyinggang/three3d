<script setup>
/**
 * 主要学习：
 * - 菲涅尔反射
 * - 视觉空间坐标应用
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
  camera.position.set(0, 0, 6)
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
  return controls
}

const createMesh = () => {
  const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;

			void main() {
        // 视图空间下的单位法线向量
        vNormal = normalize(normalMatrix * normal);
        // 视图空间下的单位坐标向量
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0) ).xyz);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  /**
   * 需要注意法线向量值，菲涅尔反射对于法线向量差别比较大的模型效果明显，即不规则物体
   * 模型表面平整的话效果较差，不过可以使用法线贴图更改物体法线向量
   */
  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uBias;
    uniform float uPower;
    uniform float uScale;

    varying vec3 vNormal;
    varying vec3 vPositionNormal;

    // 菲涅尔反射
    float fresnelReflex() {
      return pow(uBias + uScale * abs(dot(vNormal, vPositionNormal)), uPower);
    }

    void main() {
      float opacity = fresnelReflex();
      gl_FragColor = vec4(uColor, opacity);
    }

  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0x00ffff) },
      uBias: { value: 1.0 },
      uScale: { value: -1.0 },
      uPower: { value: 2.0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  return new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material)
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
