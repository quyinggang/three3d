<script setup>
/**
 * 主要学习：
 * - gl_FragCoord
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
  camera.position.set(0, 2, 6)
  // 设置摄像机方向
  camera.lookAt(0, 0, 0)
  return camera
}

const createControls = (camera, domElement) => {
  // 轨道控制器
  const controls = new OrbitControls(camera, domElement)
  return controls
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

const createMesh = (width, height) => {
  // 逐顶点
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  /* 
    逐片元
    - gl_FragCoord表示片元屏幕坐标
  */
  const fragmentShader = `
    // 画布尺寸大小
    uniform vec2 uResolution;

    void main() {
      // 屏幕坐标归一化，即转换到范围为[0, 1]
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      // 半边绘制区域宽度
      float halfWidth = uResolution.x * 0.5;
      if (gl_FragCoord.x < halfWidth) {
        gl_FragColor = vec4(uv.x, 0.0, uv.y, 1.0);
      } else {
        gl_FragColor = vec4(uv.x, uv.y, 1.0, 1.0);
      }
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(width, height) }
    },
    vertexShader,
    fragmentShader
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
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

  const render = () => {
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