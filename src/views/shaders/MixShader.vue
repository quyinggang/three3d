<script setup>
/**
 * 主要学习：
 * - mix内置函数
 * - uv应用
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
  camera.position.set(0, 0, 20)
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

const createMesh = (width, height) => {
  const vertexShader = `
			void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `
  /**
   * mix是内置的线性混合函数，该函数在两个值之间进行线性插值，即lerp
   * mix(x, y, a)：a值越大则意味着y占比越大
   */
  const fragmentShader = `
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;
      uniform vec2 uResolution;

			void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        // 实现从左到右渐变
        vec3 mixColor = mix(uStartColor, uEndColor, uv.x);
        // 实现从上到下渐变
        // vec3 mixColor = mix(uStartColor, uEndColor, uv.y);
        gl_FragColor = vec4(mixColor, 1.0);
			}
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uStartColor: { value: new THREE.Color('#FF0000') },
      uEndColor: { value: new THREE.Color('#0000ff') },
      uResolution: { value: new THREE.Vector2(width, height) }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 2), material)
  mesh.position.set(-3, 2, 0)
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
   * vec2 uv = gl_FragCoord.xy / uResolution.xy
   * 此逻辑下模型旋转后导致模型片元坐标变化从而出现不同
   * 而通过顶点着色器传递的uv坐标在每个平面都是确定的，所以不会出现上面问题
   */
  const fragmentShader = `
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;
      
      varying vec2 vUV;

			void main() {
        vec3 mixColor = mix(uStartColor, uEndColor, vUV.x);
        gl_FragColor = vec4(mixColor, 1.0);
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
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 2), material)
  mesh.position.set(3, 2, 0)
  return mesh
}

const createMesh3 = () => {
  const vertexShader = `
      varying vec2 vUV;
			void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `
  /**
   * uv坐标值表示纹理坐标，范围是[0, 1]，不同的顶点有不同的uv坐标
   * 借助不同uv坐标与中心点距离 + mix线性插值颜色，从而实现径向渐变
   */
  const fragmentShader = `
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;
      uniform float uRadius;
      varying vec2 vUV;

			void main() {
        float distance = length(vUV - vec2(0.5));
        vec3 mixColor = mix(uStartColor, uEndColor, distance / uRadius);
        gl_FragColor = vec4(mixColor, 1.0);
			}
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uRadius: { value: 0.5 },
      uStartColor: { value: new THREE.Color('#fff') },
      uEndColor: { value: new THREE.Color('#000') }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 2), material)
  mesh.position.set(-3, -3, 0)
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

  const mesh = createMesh(canvasElement.width, canvasElement.height)
  scene.add(mesh)

  const mesh2 = createMesh2()
  scene.add(mesh2)

  const mesh3 = createMesh3()
  scene.add(mesh3)

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
