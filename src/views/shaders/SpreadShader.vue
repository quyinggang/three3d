<script setup>
/**
 * 主要学习：
 * - 扩散逻辑
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
  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float step = 0.02;
    const float endRadius = 0.48;
    const float start = 0.0;
    const float duration = 3.0;
    const float speed = endRadius / duration;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      // 利用梯度波形进行周期扩散
      float scale = speed * mod(uTime, duration);
      float targetRadius = start + scale;
      float diff = abs(length(vUV - center) - targetRadius);
      float opacity = diff <= step && targetRadius <= endRadius ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor, opacity);
    }

  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#DC143C')
      },
      uTime: {
        value: 1.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, 0, 0)
  return mesh
}

const createMesh2 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float size = 0.02;
    const float endRadius = 0.5 - size;
    const float start = 0.0;
    const float duration = 3.0;
    const float speed = endRadius / duration;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float distance = length(vUV - center);

      // 利用梯度波形进行周期扩散
      float scale = speed * mod(uTime, duration);
      float radius1 = start + scale;
      float diff1 = abs(distance - radius1);

      // 圆环1扩散一半时圆环2开始扩散
      float halfValue = endRadius * 0.5;
      float radius2 = radius1 >= halfValue ? radius1 - halfValue : radius1 + halfValue;
      float diff2 = abs(distance - radius2);

      bool isShowCircle1 = diff1 <= size && radius1 <= endRadius;
      bool isShowCircle2 = diff2 <= size && radius2 <= endRadius;

      float opacity = isShowCircle1 || isShowCircle2 ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor, opacity);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#DC143C')
      },
      uTime: {
        value: 1.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  return mesh
}

const createMesh3 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float size = 0.1;
    const float endRadius = 0.5 - size;
    const float start = 0.0;
    const float duration = 3.0;
    const float speed = endRadius / duration;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float distance = length(vUV - center);

      // 利用梯度波形进行周期扩散
      float scale = speed * mod(uTime, duration);
      float radius = start + scale;
      float diff = distance - radius;

      bool isShowCircle1 = abs(diff) <= size && radius <= endRadius;
      float opacity = isShowCircle1 ? 1.0 : 0.0;

      // 颜色渐变系数
      float ratio = mix(0.0, 1.0, diff / size);
      gl_FragColor = vec4(uColor * ratio, opacity);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#DC143C')
      },
      uTime: {
        value: 1.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(1.5, 0, 0)
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

  const mesh3 = createMesh3()
  scene.add(mesh3)

  const uniforms = mesh.material.uniforms
  const mesh2Uniforms = mesh2.material.uniforms
  const mesh3Uniforms = mesh3.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    controls.update()
    const elapsedTime = clock.getElapsedTime()
    uniforms.uTime.value = elapsedTime
    mesh2Uniforms.uTime.value = elapsedTime
    mesh3Uniforms.uTime.value = elapsedTime
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
