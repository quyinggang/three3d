<script setup>
/**
 * 主要学习：
 * - 矩阵以及变换等基本应用
 * - 镜头跟随逻辑
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const keyboardAlias = {
  forward: 87,
  back: 83,
  left: 65,
  right: 68,
  leftRotate: 81,
  rightRotate: 69
}

const createModels = () => {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#87CEFA' })
  )
  return box
}

const createScene = () => {
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog('#262837', 1, 20)
  return scene
}

const createCamera = (aspect, initialCameraPos, lookAt) => {
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.copy(initialCameraPos)
  camera.lookAt(lookAt)
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

const registerKeyboardEvent = (onKeydown, onKeyup) => {
  const handleKeydown = (event) => {
    onKeydown && onKeydown(event)
  }
  const handleKeyup = () => {
    onKeyup && onKeyup()
  }

  document.addEventListener('keydown', handleKeydown, false)
  document.addEventListener('keyup', handleKeyup, false)
  return () => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('keyup', handleKeyup)
  }
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  const initialCameraPos = new THREE.Vector3(0, 4, 10)
  const boxPosition = new THREE.Vector3(0, 0, 0)
  let currentKeycode = null

  const scene = createScene()
  const camera = createCamera(width / height, initialCameraPos, boxPosition)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const removeKeyboardEvent = registerKeyboardEvent(
    (event) => {
      currentKeycode = event.keyCode
    },
    () => {
      currentKeycode = null
    }
  )

  // 创建模型
  const box = createModels()
  box.position.copy(boxPosition)
  scene.add(box)

  // 网格辅助线
  const gridHelper = new THREE.GridHelper(100, 100)
  scene.add(gridHelper)

  const clock = new THREE.Clock()
  const updateBoxAndCamera = (delta) => {
    if (!Object.values(keyboardAlias).includes(currentKeycode)) {
      return
    }
    const cameraPosition = initialCameraPos.clone()
    const moveDistance = 5 * delta
    const rotateAngle = (Math.PI / 2) * delta
    switch (currentKeycode) {
      // w
      case 87:
        box.translateZ(-moveDistance)
        break
      // s
      case 83:
        box.translateZ(moveDistance)
        break
      // a
      case 65:
        box.translateX(-moveDistance)
        break
      // d
      case 68:
        box.translateX(moveDistance)
        break
      // q
      case 81:
        box.rotateY(rotateAngle)
        break
      // e
      case 69:
        box.rotateY(-rotateAngle)
        break
    }
    // 使用Box模型改变后的世界矩阵得到当前摄像机的最新位置，这样可以保证摄像机和box是相同的改变，从而在空间上始终保持绝对间隔距离
    // applyMatrix4应用变换矩阵，更新位置、旋转和缩放
    const newCameraPos = cameraPosition.applyMatrix4(box.matrixWorld)
    camera.position.copy(newCameraPos)
    // 摄像机方向设置指向box
    camera.lookAt(box.position)
  }

  const render = () => {
    const delta = clock.getDelta()
    updateBoxAndCamera(delta)
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()

  onBeforeUnmount(() => {
    removeKeyboardEvent()
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
    <ul class="info">
      <li>前进：w</li>
      <li>后退：s</li>
      <li>左移：a</li>
      <li>右移：d</li>
      <li>左旋：q</li>
      <li>右旋：e</li>
    </ul>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.info {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  margin: 0;
  padding: 0;
  font-size: 13px;
  color: #fff;
  list-style: none;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
