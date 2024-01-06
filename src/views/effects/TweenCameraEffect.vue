<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import sceneImage from '@/assets/textures/other/scene.png'
import leiImage from '@/assets/textures/other/gmlei.png'
import huoImage from '@/assets/textures/other/gmhuo.png'

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
  camera.position.set(0, 0, 60)
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

const createImagePlane = (image) => {
  const loader = new THREE.TextureLoader()
  const geometry = new THREE.PlaneGeometry(16, 9)
  const material = new THREE.MeshBasicMaterial({
    map: loader.load(image),
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(geometry, material)
}

const applyRayCaster = (params) => {
  const { containerElement, objects, camera, callback } = params
  const bounding = containerElement.getBoundingClientRect()
  // 射线拾取，点击任意模型实现音乐播放与暂停
  const rayCaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const handleClick = (event) => {
    pointer.x = ((event.clientX - bounding.left) / bounding.width) * 2 - 1
    pointer.y = -((event.clientY - bounding.top) / bounding.height) * 2 + 1

    rayCaster.setFromCamera(pointer, camera)
    // 计算物体和射线的焦点
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
  const controls = createControls(camera, renderer.domElement)

  const images = [sceneImage, leiImage, huoImage]
  const mesh = createImagePlane(images[0])
  mesh.position.set(-10, 0, 0)
  mesh.rotation.y = 1.0
  scene.add(mesh)
  const mesh1 = createImagePlane(images[1])
  mesh1.position.set(10, 0, 10)
  mesh1.rotation.y = -1.0
  scene.add(mesh1)
  const mesh2 = createImagePlane(images[2])
  mesh2.position.set(0, 0, -20)
  mesh2.rotation.y = 0.5
  scene.add(mesh2)

  const removeClickEventListener = applyRayCaster({
    containerElement,
    camera,
    objects: scene.children,
    callback: (selectedObject) => {
      if (!selectedObject.isMesh) return
      const offset = 20
      const targetPosition = selectedObject.position.clone()
      const targetDirection = selectedObject.getWorldDirection(new THREE.Vector3())

      // offset * direction是垂直于图片的向量点，向量相加逻辑计算出摄像机要移动到的位置点
      const newCameraPosition = new THREE.Vector3(
        targetPosition.x + offset * targetDirection.x,
        targetPosition.y + offset * targetDirection.y,
        targetPosition.z + offset * targetDirection.z
      )

      new TWEEN.Tween(camera.position)
        .to(newCameraPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          // camera.lookAt(targetPosition)
          controls.target = targetPosition
        })
        .start()
    }
  })

  const render = () => {
    TWEEN.update()
    controls.update()
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()

  onBeforeUnmount(() => {
    removeClickEventListener()
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
    <span class="tip">点击页面中图片模型实现镜头运动</span>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
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
