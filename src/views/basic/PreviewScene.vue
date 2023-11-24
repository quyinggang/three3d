<script setup>
/**
 * 主要学习：
 * - 裁剪测试Scissor Test
 * - viewport视口范围定义
 * - 渲染目标对象
 * - 帧缓冲纹理对象
 */
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { generateRandomColor } from '@/tools/util'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const schemeId = ref(1)
let raf = null

const createPreviewCanvas = () => {
  const dpr = window.devicePixelRatio
  const size = {
    width: 70,
    height: 70
  }
  const previewCanvas = document.createElement('canvas')
  previewCanvas.id = 'preview'
  previewCanvas.width = size.width
  previewCanvas.height = size.height
  const positionStyle = 'position:absolute;right:10px;bottom:10px;z-index:1;'
  previewCanvas.style.cssText = `${positionStyle}border:1px solid #fff;width:${
    size.width * dpr
  }px;height:${size.height * dpr}px;`
  return previewCanvas
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

const createBasic = (width, height) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  camera.position.set(1, 1, 6)
  camera.lookAt(scene.position)

  // 创建模型
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const box = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: generateRandomColor() })
  )
  scene.add(box)

  return { scene, camera }
}

/**
 * 方案一：将渲染的canvas内容输出图片，放置在另一个canvas中
 */
const applyCanvasScheme = (width, height, renderer, previewCanvas) => {
  const { scene, camera } = createBasic(width, height)

  // 渲染图片到preview中
  const context = previewCanvas.getContext('2d')
  const previewWidth = previewCanvas.width
  const previewHeight = previewCanvas.height
  const renderPreviewImage = () => {
    const image = new Image()
    // 会有严重的性能问题
    const base64Image = domElement.toDataURL()
    image.onload = () => {
      context.drawImage(image, 0, 0, previewWidth, previewHeight)
    }
    image.src = base64Image
  }

  const domElement = renderer.domElement
  const controls = new OrbitControls(camera, domElement)
  const render = () => {
    controls.update()
    renderer.render(scene, camera)
    renderPreviewImage()
    raf = window.requestAnimationFrame(render)
  }
  render()
}

/**
 * 方案二：借助渲染目标对象实现读取帧内容，放置在另一个canvas中
 * 缺点：
 * - 借助RenderTarget，整个场景需要渲染两次
 * - 读取RenderTarget像素到视口，整个过程相对繁琐
 * - 会有严重的性能问题
 */
const applyRenderTargetScheme = (width, height, renderer, previewCanvas) => {
  const { scene, camera } = createBasic(width, height)

  // 创建RenderTarget
  const dpr = window.devicePixelRatio
  const targetSize = {
    width: width * dpr,
    height: height * dpr
  }
  const renderTarget = new THREE.WebGLRenderTarget(targetSize.width, targetSize.height, {
    depthBuffer: false
  })
  const previewWidth = previewCanvas.width
  const previewHeight = previewCanvas.height
  const context = previewCanvas.getContext('2d')
  const renderPreview = () => {
    const array = new Uint8Array(targetSize.width * targetSize.height * 4)
    const clampArray = new Uint8ClampedArray(array.buffer)
    renderer.readRenderTargetPixels(
      renderTarget,
      0,
      0,
      targetSize.width,
      targetSize.height,
      clampArray
    )
    // Uint8Array -> Uint8ClampedArray -> ImageData
    const imageData = new ImageData(clampArray, targetSize.width, targetSize.height)

    // canvas的putImageData无法实现视口转换，drawImage可以实现屏幕所有像素渲染到指定的canvas视口中，
    // 故而使用ImageBitmap => drawImage
    createImageBitmap(imageData).then((value) => {
      context.drawImage(value, 0, 0, previewWidth, previewHeight)
    })
  }

  const controls = new OrbitControls(camera, renderer.domElement)
  const render = () => {
    controls.update()
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)
    renderPreview()

    renderer.setRenderTarget(null)
    renderer.render(scene, camera)

    raf = window.requestAnimationFrame(render)
  }
  render()
}

/**
 * 方案三：利用FrameBufferTexture读取帧缓冲到纹理对象，在其他场景渲染带有该纹理的精灵材质，从而实现预览
 * 该方案有很多逻辑点需要深入学习
 * - copyFramebufferToTexture中position是二维坐标，具体取值逻辑
 */
const applyFrameBufferTextureDataScheme = (width, height, renderer) => {
  const { scene, camera } = createBasic(width, height)
  camera.position.z = 20

  // 使用正交相机渲染预览图
  const dpr = window.devicePixelRatio
  const previewSize = 80 * dpr
  const previewScene = new THREE.Scene()
  const previewCamera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    1,
    10
  )
  previewCamera.position.z = 10
  previewCamera.lookAt(previewScene.position)

  // 帧缓冲纹理对象
  const texture = new THREE.FramebufferTexture(previewSize, previewSize, THREE.RGBAFormat)
  const material = new THREE.SpriteMaterial({
    map: texture
  })

  // 创建精灵渲染帧纹理在右下角位置
  const sprite = new THREE.Sprite(material)
  const space = 10
  const halfWidth = width / 2
  const halfHeight = height / 2
  const halfImageWidth = previewSize / 2
  const halfImageHeight = previewSize / 2
  const rightBottomPositionX = halfWidth - halfImageWidth
  const rightBottomPositionY = -halfHeight + halfImageHeight
  sprite.position.set(rightBottomPositionX - space, rightBottomPositionY + space, 1)
  sprite.scale.set(previewSize, previewSize, 1)

  previewScene.add(sprite)

  // 设置复制帧缓存数据的起始坐标
  const position = new THREE.Vector2()
  position.set((width * dpr) / 2 - previewSize / 2, (height * dpr) / 2 - previewSize / 2)

  const controls = new OrbitControls(camera, renderer.domElement)
  renderer.autoClear = false
  const render = () => {
    controls.update()
    renderer.clear()
    // 每次render都会自动清空帧缓冲数据，重新写入新的数据，所以根据实现效果需要合理的关闭自动清除
    renderer.render(scene, camera)

    renderer.copyFramebufferToTexture(position, texture)

    renderer.clearDepth()
    renderer.render(previewScene, previewCamera)
    raf = window.requestAnimationFrame(render)
  }
  render()
}

/**
 * 方案四：利用sicssor和viewport实现，同一个场景不同的相机处理
 */
const applyViewportScheme = (width, height, renderer) => {
  const { scene, camera } = createBasic(width, height)

  // 预览图场景和相机
  const dpr = window.devicePixelRatio
  const previewSize = 70 * dpr
  const previewCamera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  previewCamera.position.set(1, 1, 6)
  previewCamera.lookAt(scene.position)

  const viewport = {
    x: 0,
    y: 0,
    width,
    height
  }
  const previewViewport = {
    x: width - previewSize - 4,
    y: 4,
    width: previewSize,
    height: previewSize
  }

  const controls = new OrbitControls(camera, renderer.domElement)
  const render = () => {
    controls.update()
    renderer.setScissorTest(true)
    scene.background = new THREE.Color('#000')
    renderer.setScissor(viewport.x, viewport.y, viewport.width, viewport.height)
    renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height)
    renderer.render(scene, camera)

    // 渲染到右下角预览视口区域
    scene.background = new THREE.Color(0x222222)
    renderer.setScissor(
      previewViewport.x,
      previewViewport.y,
      previewViewport.width,
      previewViewport.height
    )
    renderer.setViewport(
      previewViewport.x,
      previewViewport.y,
      previewViewport.width,
      previewViewport.height
    )

    /**
     * 由于是两个不同的摄像机，当OrbitControls操作时操作的是场景摄像机，而预览摄像机是没有任何变动的，
     * 此时复制场景中摄像机位置以及旋转角度，这样预览内容就会与场景保持一致
     * 也可以使用两个OrbitControls + requestAnimationFrame的形式来自动实现该逻辑
     */
    previewCamera.position.copy(camera.position)
    previewCamera.quaternion.copy(camera.quaternion)
    renderer.render(scene, previewCamera)
    renderer.setScissorTest(false)
    raf = window.requestAnimationFrame(render)
  }
  render()
}

/**
 * 方案五：双渲染器+双canvas实现
 */
const applyMultipleRenderScheme = (width, height, renderer, previewCanvasElement) => {
  const { scene, camera } = createBasic(width, height)

  // 预览图可以采用正交相机来渲染
  const previewWidth = previewCanvasElement.clientWidth
  const previewHeight = previewCanvasElement.clientHeight
  const previewRenderer = new THREE.WebGLRenderer({
    canvas: previewCanvasElement,
    antialias: true
  })
  previewRenderer.setSize(previewWidth, previewHeight)
  previewRenderer.setPixelRatio(window.devicePixelRatio)

  const controls = new OrbitControls(camera, renderer.domElement)
  const render = () => {
    controls.update()
    previewRenderer.render(scene, camera)
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()
}

const handleSchemeSwitch = () => {
  schemeId.value = schemeId.value >= 5 ? 1 : schemeId.value + 1
}

const schemeMap = {
  5: (width, height, renderer, containerElement) => {
    const previewCanvas = createPreviewCanvas()
    containerElement.appendChild(previewCanvas)
    applyCanvasScheme(width, height, renderer, previewCanvas)
  },
  4: (width, height, renderer, containerElement) => {
    const previewCanvas = createPreviewCanvas()
    containerElement.appendChild(previewCanvas)
    applyRenderTargetScheme(width, height, renderer, previewCanvas)
  },
  3: (width, height, renderer) => {
    applyFrameBufferTextureDataScheme(width, height, renderer)
  },
  2: (width, height, renderer) => {
    applyViewportScheme(width, height, renderer)
  },
  1: (width, height, renderer, containerElement) => {
    const previewCanvas = createPreviewCanvas()
    containerElement.appendChild(previewCanvas)
    applyMultipleRenderScheme(width, height, renderer, previewCanvas)
  }
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const clearBeforeSwitchScheme = () => {
    const preview = document.getElementById('preview')
    preview && containerElement.removeChild(preview)
    raf && window.cancelAnimationFrame(raf)
  }

  watch(
    schemeId,
    (value) => {
      clearBeforeSwitchScheme()
      const handler = schemeMap[value]
      if (handler) {
        // 切换不同方案渲染器存在一些问题，这里简单处理每次新建新的渲染器
        const renderer = createWebGLRenderer(canvasElement, width, height)
        handler(width, height, renderer, containerElement)
      }
    },
    {
      immediate: true
    }
  )
})

onBeforeUnmount(() => window.cancelAnimationFrame(raf))
</script>

<template>
  <div ref="containerElementRef" class="container">
    <div class="button" @click="handleSchemeSwitch">
      <span>切换方案：</span>
      <span>方案{{ schemeId }}</span>
    </div>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;
  font-size: 18px;
  color: #fff;
  user-select: none;
  cursor: pointer;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
