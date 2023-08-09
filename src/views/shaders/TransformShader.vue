<script setup>
/**
 * 主要学习：
 * - 法线向量normal
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
  camera.position.set(0, 0, 10)
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

// 旋转矩阵应用
const createMesh1 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uCircleColor;
    uniform vec3 uLineColor;
    uniform float uTime;

    varying vec2 vUV;

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    float cirque(vec2 coord, float outerRadius, float innerRadius) {
      float smoothness = 0.01;
      float distance = length(coord);
      float outerCircle = smoothstep(outerRadius, outerRadius + smoothness, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + smoothness, distance);
      return outerCircle - innerCircle;
    }

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return 1.0 - smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float rotateLine(vec2 coord, float radius) {
      vec2 center = vec2(0.5);
      // 旋转矩阵应用
      vec2 lineEnd = vec2(radius, 0.0) * rotate2D(uTime / 2.0);
      // 以center为旋转中心
      return straightLine(coord - center, vec2(0.0), lineEnd, 0.03, 0.0);
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float circleRatio = cirque(vUV - center, 0.46, 0.48);
      float lineRatio = rotateLine(vUV, 0.4);
      vec3 color = circleRatio * uCircleColor + lineRatio * uLineColor;
      gl_FragColor = vec4(color, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uCircleColor: {
        value: new THREE.Color('#00FFFF')
      },
      uLineColor: {
        value: new THREE.Color('#FF0000')
      },
      uTime: {
        value: 0.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-2, 0, 0)
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

  const mesh1 = createMesh1()
  scene.add(mesh1)

  const mesh1Uniforms = mesh1.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh1Uniforms.uTime.value = elapsedTime

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
