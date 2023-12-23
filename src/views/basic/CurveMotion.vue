<script setup>
/**
 * 主要学习：
 * - TransformControls
 * - 沿曲线运行的Flow方案
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { Flow } from 'three/addons/modifiers/CurveModifier.js'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
let raf = null

const createCurvePath = () => {
  const group = new THREE.Group()
  const initialPoints = [
    { x: 1, y: 0, z: -1 },
    { x: 1, y: 0, z: 1 },
    { x: -1, y: 0, z: 1 },
    { x: -1, y: 0, z: -1 }
  ]
  const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  const boxMaterial = new THREE.MeshBasicMaterial()
  for (const point of initialPoints) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.copy(point)
    group.add(box)
  }

  // curve->点->LineLoop，这里需要注意是共用Mesh Position
  const curve = new THREE.CatmullRomCurve3(
    group.children.map((mesh) => mesh.position),
    true
  )
  curve.curveType = 'centripetal'
  const points = curve.getPoints(50)
  const curveObject = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
  )
  return [group, curveObject, curve]
}

const createFlowMotionTarget = () => {
  // 圆柱体
  const geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 32, 32)
  geometry.rotateX(Math.PI / 2)
  geometry.rotateY(Math.PI / 2)
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  const cylinder = new THREE.Mesh(geometry, material)
  return cylinder
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
  camera.position.set(2, 4, 3)
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
  return renderer
}

const applyRayCaster = (params) => {
  const { containerElement, camera, objects, callback } = params
  const containerBounding = containerElement.getBoundingClientRect()
  // 选中绑定TransformControls拖拽点
  const rayCaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const handleClick = (event) => {
    pointer.x = ((event.clientX - containerBounding.left) / containerBounding.width) * 2 - 1
    pointer.y = -((event.clientY - containerBounding.top) / containerBounding.height) * 2 + 1
    rayCaster.setFromCamera(pointer, camera)
    const intersects = rayCaster.intersectObjects(objects)
    if (intersects.length > 0) {
      callback && callback(intersects[0].object)
    }
  }
  containerElement.addEventListener('click', handleClick)
  return () => containerElement.removeEventListener('click', handleClick)
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  // 曲线路径
  const [group, curveObject, curve] = createCurvePath()
  scene.add(group)
  scene.add(curveObject)

  // CurveModifier Flow用于处理物体绕曲线运动
  const model = createFlowMotionTarget()
  const flow = new Flow(model)
  flow.updateCurve(0, curve)
  scene.add(flow.object3D)

  // TransformControls
  const transformControls = new TransformControls(camera, renderer.domElement)
  transformControls.addEventListener('dragging-changed', function (event) {
    const isDragging = event.value
    if (!isDragging) {
      // 拖拽结束后获取最新的curve点集，从而更新曲线
      const points = curve.getPoints(50)
      curveObject.geometry.setFromPoints(points)
      flow.updateCurve(0, curve)
    }
    controls.enabled = !isDragging
  })
  // TransformControls需要添加到场景，可以通过控制其visible来显示隐藏
  scene.add(transformControls)

  const removeClickEvent = applyRayCaster({
    camera,
    containerElement,
    objects: group.children,
    callback: (selectedObject) => {
      // 关联对应的拖拽点并且更改position，共用position变量是关键
      transformControls.attach(selectedObject)
    }
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  const render = () => {
    controls.update()
    // 运动速率
    flow && flow.moveAlongCurve(0.002)
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()
  onBeforeUnmount(() => {
    removeClickEvent()
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
    <span class="tip">点击方块实现路线调整</span>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tip {
  position: absolute;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: #fff;
  user-select: none;
  pointer-events: none;
}
</style>
