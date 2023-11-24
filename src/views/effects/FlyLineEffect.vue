<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
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
  camera.position.set(2, 2, 10)
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

const getPoints = () => {
  const points = [
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 0, 3),
    new THREE.Vector3(0, 0, 6)
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  return curve.getSpacedPoints(100)
}

const applyTween = (geometry) => {
  const points = getPoints()
  const position = geometry.attributes.position
  const tween = new TWEEN.Tween({ index: -3 }).to({ index: 100 }, 3000).delay(800).repeat(Infinity)
  tween.onUpdate(({ index }) => {
    const slicePoints = points.slice(index, index + 3)
    if (slicePoints.length > 0) {
      geometry.setFromPoints(slicePoints)
      position.needsUpdate = true
    }
  })
  tween.start()
}

// 截取曲线一段points绘制线段实现飞线
const createMesh1 = () => {
  const geometry = new THREE.BufferGeometry().setFromPoints([])
  // 无法设置线段宽度
  const material = new THREE.LineBasicMaterial({
    color: '#FF0000'
  })
  const mesh = new THREE.Line(geometry, material)
  return mesh
}

const getMesh2Points = () => {
  const points = [
    new THREE.Vector3(3, 0, -1),
    new THREE.Vector3(3, 0, 3),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 0, 6)
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  return curve.getSpacedPoints(1000)
}
const applyMesh2Tween = (material) => {
  const tween = new TWEEN.Tween({ index: -10 })
    .to({ index: 1010 }, 3000)
    .delay(800)
    .repeat(Infinity)
  tween.onUpdate(({ index }) => {
    material.uniforms.uIndex.value = index
  })
  tween.start()
}
// shader上顶点着色器中截取一段线段显示，线段其他部分不显示实现飞线
const createMesh2 = () => {
  // 逐顶点
  const vertexShader = `
    attribute float aIndex;

    uniform float uIndex;

    varying float vOpacity;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      bool isLine =  aIndex > uIndex - 10.0 && aIndex < uIndex + 10.0;
      vOpacity = isLine ? 1.0 : 0.0;
      gl_PointSize = isLine ? 0.2 * (80.0 / -mvPosition.z) : 0.0;
      gl_Position = projectionMatrix * mvPosition;
    }
  `
  // 逐片元
  const fragmentShader = `
    varying float vOpacity;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, vOpacity);
    }
  `
  const points = getMesh2Points()
  const indexes = points.map((item, index) => index)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  geometry.setAttribute('aIndex', new THREE.Float32BufferAttribute(indexes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uIndex: {
        value: 0.0
      }
    },
    vertexShader,
    fragmentShader
  })
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

  const mesh1 = createMesh1()
  applyTween(mesh1.geometry)
  scene.add(mesh1)

  const mesh2 = createMesh2()
  applyMesh2Tween(mesh2.material)
  scene.add(mesh2)

  const render = () => {
    controls.update()
    TWEEN.update()
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
