<script setup>
/**
 * 主要学习：
 * - gl_FragCoord与UV坐标的不同应用场景
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
  camera.position.set(0, 0, 4)
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

/**
 * 每个平面的UV都是[0, 1]范围内的，不同的位置对应的UV坐标是不同的
 * 平面的UV坐标是二维坐标系，三维场景的缩放旋转等不会更改表面的uv坐标
 */
const createMesh = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;

    varying vec2 vUV;

    float circle(vec2 position, vec2 center, float radius) {
      float distance = length(position - center);
      return distance <= radius ? 1.0 : 0.0;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float opacity = circle(vUV, center, 0.5);
      gl_FragColor = vec4(uColor, opacity);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1, 0, 0)
  return mesh
}

/**
 * gl_FragCoord表示是片元屏幕坐标，基于屏幕坐标计算得到uv坐标跟纹理坐标uv不同，它代表着当前渲染画布屏幕坐标的归一化坐标
 * - 它依赖于渲染视口画布的宽高，这意味着画布渲染宽高的更改会导致基于此逻辑的变化
 * - 几何体如果不是位于场景中心，那么归一化坐标uv的应用是有问题的，它不会跟几何体表面一一对应的
 * - 场景的旋转缩放是无法作用基于归一化uv坐标的处理的，会存在问题
 *
 * 需要注意：归一化uv坐标以及纹理uv坐标各自的应用场景是不同的，二者不是同一个东西
 */
const createMesh2 = (width, height) => {
  const vertexShader = `
			void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;
    uniform vec2 uResolution;

    void main() {
      // 将屏幕坐标转换成[-1, 1]范围，原点在屏幕中心，但实际上不规则的长宽比会导致只有最短距离的坐标系范围满足[-1, 1]，另外的会超出这个范围
      vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

      // 这种方式是将屏幕坐标转换成[0, 1]范围内原点在左下角的坐标系
      // vec2 uv = gl_FragCoord.xy  / uResolution;

      float radius = length(uv);
      float opacity = radius <= 0.3 ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor, opacity);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      },
      uResolution: {
        value: new THREE.Vector2(width, height)
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
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

  const mesh2 = createMesh2(canvasElement.width, canvasElement.height)
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
