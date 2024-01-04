<script setup>
/**
 * 主要学习：
 * - gl_PointCoord
 * - gl_PointSize
 * - length内置函数
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createDotShaderMaterial = () => {
  /**
   * modelViewMatrix表示模型视图矩阵，经过该矩阵处理后的顶点位于视图空间坐标系中，即摄像机坐标系
   * 不同类型的投影（正交投影、透视投影）该坐标系的原点不同，透视投影情况下z轴都是负值
   */
  const vertexShader = `
			void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // gl_PointSize表示顶点大小，mvPosition.z参入计算则实现近大远小效果
        gl_PointSize = 0.2 * (600.0 / -mvPosition.z);
				gl_Position = projectionMatrix * mvPosition;
			}
  `
  /**
   * length：内置函数，表示长度，length = sqrt(x^2 + y^2)
   * length(a - b)则表示a与b两点之间的直线距离
   * gl_PointCoord是片元在顶点内坐标，坐标范围为[0, 1]
   */
  const fragmentShader = `
      uniform vec3 color;

			void main() {
        // 当片元与顶点中心点距离大于0.5则丢弃，从而实现顶点圆形，适用于Points绘制方式
        // 也可以判断透明度小于某个限定值，直接丢弃
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
