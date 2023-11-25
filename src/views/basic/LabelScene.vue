<script setup>
/**
 * 主要学习：
 * - CSS2DRenderer
 * - CSS3DRenderer
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { CSS3DSprite, CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { generateRandomColor } from '@/tools/util'
import labelAssets from '@/assets/textures/label/text-image.jpg'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createModels = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const box1 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: generateRandomColor() })
  )
  box1.position.set(-0.5, 0, 0)

  const box2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: generateRandomColor()
    })
  )
  box2.position.set(-2, 0, -1)

  const box3 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: generateRandomColor()
    })
  )
  box3.position.set(2, 0, 0.5)

  const box4 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: generateRandomColor()
    })
  )
  box4.position.set(4, 0, 1.5)

  return [box1, box2, box3, box4]
}

/*
  方案一：Sprite+贴图
  特点：始终面向摄像机，随着场景缩放而缩放，必须使用贴图定制标签内容
*/
const createSpriteLabel = (position) => {
  const group = new THREE.Group()
  const start = position.clone()
  const points = [start, new THREE.Vector3(start.x + 1, start.y + 1, start.z)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#fff' }))
  group.add(line)

  const material = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load(labelAssets)
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(0.6, 0.3, 1)
  sprite.position.set(start.x + 1, start.y + 1, start.z)
  group.add(sprite)

  return group
}

/**
 * 方案二：CSS2DRender + CSS2DObject
 * 特点：始终面向摄像机，不会随着场景缩放而缩放，使用HTML扩展性强
 */
const createCSS2DLabel = () => {
  const span = document.createElement('span')
  span.textContent = 'CSS2D标签'
  span.style.cssText = `font-size:14px;color:#fff;`

  const labelObject = new CSS2DObject(span)
  return labelObject
}

/**
 * 方案三：CSS3DRender + CSS3DSprite
 * 特点：始终面向摄像机，随着场景缩放而缩放，使用HTML扩展性强
 */
const createCSS3DSpriteLabel = () => {
  const span = document.createElement('span')
  span.textContent = 'CSS3DSprite标签'
  span.style.cssText = `font-size:14px;color:#fff;`

  const labelObject = new CSS3DSprite(span)
  return labelObject
}

/**
 * 方案四：CSS3DRender + CSS3DObject
 * 特点：不会始终面对摄像机，随着场景缩放而缩放，使用HTML扩展性强
 */
const createCSS3DObjectLabel = () => {
  const span = document.createElement('span')
  span.textContent = 'CSS3DObject标签'
  span.style.cssText = `font-size:14px;color:#fff;`

  const labelObject = new CSS3DObject(span)
  return labelObject
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(1, 1, 10)
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

const createCSS2DRenderer = (element, width, height) => {
  // CSS2D渲染器
  const label2DRenderer = new CSS2DRenderer()
  const domElement = label2DRenderer.domElement
  label2DRenderer.setSize(width, height)
  domElement.style.position = 'absolute'
  domElement.style.top = '0px'
  element.appendChild(domElement)
  const effect = () => {
    element.removeChild(domElement)
  }
  return [label2DRenderer, effect]
}

const createCSS3DRenderer = (element, width, height) => {
  // CSS3D渲染器
  const label3DRenderer = new CSS3DRenderer()
  const domElement = label3DRenderer.domElement
  label3DRenderer.setSize(width, height)
  domElement.style.position = 'absolute'
  domElement.style.top = '0px'
  element.appendChild(domElement)
  const effect = () => {
    element.removeChild(domElement)
  }
  return [label3DRenderer, effect]
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const [label2DRenderer, remove2DRendererElement] = createCSS2DRenderer(
    containerElement,
    width,
    height
  )
  const [label3DRenderer, remove3DRendererElement] = createCSS3DRenderer(
    containerElement,
    width,
    height
  )

  // 创建模型
  const [box1, box2, box3, box4] = createModels()
  scene.add(box1)
  scene.add(box2)
  scene.add(box3)
  scene.add(box4)

  // box1标签
  const group = createSpriteLabel(box1.position)
  scene.add(group)

  // box2标签
  const labelObject = createCSS2DLabel()
  labelObject.position.set(0, 1, 0)
  box2.add(labelObject)

  // box3标签
  const label3DSprite = createCSS3DSpriteLabel()
  label3DSprite.position.set(0, 1, 0)
  label3DSprite.scale.set(0.018, 0.018, 0.018)
  box3.add(label3DSprite)

  // box4标签
  const label3DObject = createCSS3DObjectLabel()
  label3DObject.position.set(0, 1, 0)
  label3DObject.scale.set(0.018, 0.018, 0.018)
  box4.add(label3DObject)

  // CSS2D/CSS3D方式新建的标签层覆盖在canvas层之上，需改变响应目标元素
  const controls = new OrbitControls(camera, label3DRenderer.domElement)
  const render = () => {
    controls.update()
    renderer.render(scene, camera)
    label2DRenderer.render(scene, camera)
    label3DRenderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }

  render()

  onBeforeUnmount(() => {
    remove2DRendererElement()
    remove3DRendererElement()
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
