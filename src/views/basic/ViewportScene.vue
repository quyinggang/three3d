<script setup>
/**
 * 主要学习：
 * - 裁剪测试Scissor Test
 * - viewport视口范围定义
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { generateRandomColor } from '@/tools/util'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createModels = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const box1 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: generateRandomColor() })
  )
  box1.position.set(-1, 0, 0)

  const box2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: generateRandomColor()
    })
  )
  box2.position.set(1, 0, 0)
  return [box1, box2]
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(1, 1, 6)
  // 设置摄像机方向
  camera.lookAt(0, 0, 0)
  return camera
}

const createWebGLRenderer = (canvasElement, width, height) => {
  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  // 开启裁剪测试
  renderer.setScissorTest(true)

  return renderer
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const leftSize = {
    x: 0,
    y: 0,
    width: width / 2,
    height: height
  }

  const rightSize = {
    x: width / 2,
    y: 0,
    width: width / 2,
    height: height
  }

  const scene = createScene()
  const leftCamera = createCamera(leftSize.width / leftSize.height)
  const rightCamera = createCamera(rightSize.width / rightSize.height)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  // 创建模型
  const [box1, box2] = createModels()
  scene.add(box1)
  scene.add(box2)

  // 由于左右两边区域使用同一个DOM，故而鼠标操作同步，如果想要区域鼠标操作独立需要使用不同的DOM
  const domElement = renderer.domElement
  const leftControls = new OrbitControls(leftCamera, domElement)
  const rightControls = new OrbitControls(rightCamera, domElement)
  const render = () => {
    leftControls.update()
    rightControls.update()

    // 左边区域
    scene.background = new THREE.Color('#a9a9a9')
    // 裁剪区域按照屏幕坐标系定义，左下角原点，向右x轴正方向，向上y轴正方向
    renderer.setScissor(leftSize.x, leftSize.y, leftSize.width, leftSize.height / 2)
    // viewport区域也是按照屏幕坐标系定义的
    renderer.setViewport(leftSize.x, leftSize.y, leftSize.width, leftSize.height)
    // 每一次render都生成一次渲染结果，即一帧内容图片
    renderer.render(scene, leftCamera)

    /**
     * 裁剪区域和Viewport视口范围比较容易困惑，虽然它们都是划定范围，但并不是同一个东西，它们功能不同并且应用在渲染管线的阶段不同
     */

    // 右边区域
    scene.background = new THREE.Color('#00bfff')
    renderer.setScissor(rightSize.x, rightSize.y + height / 2, rightSize.width, rightSize.height)
    renderer.setViewport(rightSize.x, rightSize.y, rightSize.width, rightSize.height)
    renderer.render(scene, rightCamera)

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
