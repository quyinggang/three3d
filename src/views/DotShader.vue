<script setup>
/**
 * 主要学习：
 * - ShaderMaterial
 * - GLSL ES基础
 */
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createDotShaderMaterial = () => {
  const vertexShader = `
			void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 0.2 * (600.0 / -mvPosition.z);
				gl_Position = projectionMatrix * mvPosition;
			}
  `
  /**
   * if (length(gl_PointCoord - vec2( 0.5, 0.5 )) > 0.5 ) discard;
   * 实现圆点的关键逻辑
   */
  const fragmentShader = `
      uniform vec3 color;

			void main() {
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5 ) discard;
        gl_FragColor = vec4(color, 1.0);
			}
  `
  return new THREE.ShaderMaterial({
    // 片元着色器参数传递，顶点着色器需要自定义geometry属性来传递
    uniforms: {
      color: { value: new THREE.Color('#FF0000') }
    },
    vertexShader,
    fragmentShader
  })
}

/**
 * 待研究问题：PointsMaterial和ShaderMaterial使用相同的颜色有时渲染出来的结果不同，比如#0080ff
 * 估计是PointsMaterial内部对应做了其他处理，对于gl_FragColor有影响
 */
const createModels = () => {
  const geometry = new THREE.BoxGeometry(4, 4, 4, 10, 10, 10)
  const boxPoints = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: '#FF0000',
      size: 0.2
    })
  )
  boxPoints.position.set(-3, 0, 0)
  const shaderMaterial = createDotShaderMaterial()
  const dotBoxPoints = new THREE.Points(geometry, shaderMaterial)
  dotBoxPoints.position.set(3, 0, 0)
  return [boxPoints, dotBoxPoints]
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(0, 4, 18)
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

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const controls = createControls(camera, renderer.domElement)

  // 创建模型
  const [originBox, shaderBox] = createModels()
  scene.add(originBox)
  scene.add(shaderBox)

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
