<script setup>
/**
 * 主要学习：
 * - step内置函数
 * - smoothstep内置函数
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
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

const createMesh = () => {
  const vertexShader = `
      varying vec2 vUV;
		  void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `
  /**
   * 每个物体表面的uv坐标都是[0, 1]范围
   * step函数是阶跃函数，该函数返回0.0或1.0
   * float step(float edge, float x)
   * - edge > x 返回0.0，否则返回1.0
   */
  const fragmentShader = `
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;

      varying vec2 vUV;

      const float radius = 0.3;

			void main() {
        bool isOuter = step(length(vUV - vec2(0.5)), radius) == 0.0;
        // 可以根据条件判断是否丢弃片元，可以实现掏空效果
        // if (isOuter) discard;
        gl_FragColor = vec4(isOuter ? uStartColor : uEndColor, 1.0);
			}
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uStartColor: { value: new THREE.Color('#FF0000') },
      uEndColor: { value: new THREE.Color('#0000ff') }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
  mesh.position.set(-1, 0, 0)
  return mesh
}

const createMesh2 = () => {
  const vertexShader = `
      varying vec2 vUV;
		  void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `
  /**
   * smoothstep是平滑过渡函数，该函数的输出值是[0, 1]范围内的，可以用于标量也可用于向量
   * float smoothstep(float edge0, float edge1, float x)
   * - edge0 代表样条插值函数的下界
   * - edge1 代表样条插值函数的上界
   * - x 代表用于插值的源输入
   * 当x = edge0时，结果为0
   * 当x = edge1时，结果为1
   */
  const fragmentShader = `
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;

      varying vec2 vUV;

			void main() {
        float distance = length(vUV - vec2(0.5));
        // 单个smoothstep函数的波形是[0, 1]范围的上升波形
        float s1 = smoothstep(0.2, 0.3, distance);
        float s2 = smoothstep(0.3, 0.4, distance);
        // 两个smoothstep运算就比较有意思，通过此波形可以实现圆环效果
        gl_FragColor = vec4(uStartColor * (s1 - s2), 1.0);
			}
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uStartColor: { value: new THREE.Color('#FF0000') },
      uEndColor: { value: new THREE.Color('#0000ff') }
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
