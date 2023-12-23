<script setup>
/**
 * 主要学习：
 * - AudioLoader加载音频文件
 * - Audio + AudioListener + AudioAnalyser
 * - 射线拾取选中
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { generateRandomColor } from '@/tools/util'
import fearlessAssets from '@/assets/mp3/fearless.mp3'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const size = 64
let raf = null

const createEffectComposer = (scene, camera, renderer) => {
  const bloomComposer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
    1.5,
    0.4,
    0.85
  )
  bloomPass.threshold = 0
  bloomPass.strength = 0.25
  bloomPass.radius = 0
  bloomComposer.addPass(renderPass)
  bloomComposer.addPass(bloomPass)
  bloomComposer.addPass(new OutputPass())

  return bloomComposer
}

const createModels = () => {
  const group = new THREE.Group()
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const targetCount = size / 2
  const limit = Math.round(Math.sqrt(targetCount))
  for (let xIndex = 0; xIndex < limit; xIndex++) {
    for (let yIndex = 0; yIndex < limit; yIndex++) {
      const color = generateRandomColor()
      const material = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(xIndex - limit / 2, 0, yIndex - limit / 2)
      mesh.scale.set(0.3, 0.3, 0.3)
      if (group.children.length >= targetCount) {
        break
      }
      group.add(mesh)
    }
  }

  return group
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000)
  camera.position.set(16, 11, 12)
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
  controls.minDistance = 8
  controls.maxDistance = 40
  return controls
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
      callback && callback()
    }
  }
  containerElement.addEventListener('click', handleClick)
  return () => containerElement.removeEventListener('click', handleClick)
}

const loadAssets = (onLoaded) => {
  // 加载音频文件
  let audio = null
  let audioAnalyser = null
  const audioLoader = new THREE.AudioLoader()
  audioLoader.load(
    fearlessAssets,
    function (buffer) {
      const listener = new THREE.AudioListener()
      // 位置相关的音频对象
      audio = new THREE.Audio(listener)

      audio.setBuffer(buffer)
      audio.setVolume(1)
      audio.setLoop(true)

      // 获取音频数据
      audioAnalyser = new THREE.AudioAnalyser(audio, size)

      onLoaded && onLoaded(audio, listener, audioAnalyser)
    },
    () => {},
    (err) => {
      console.log(err)
    }
  )
  return () => {
    if (audio && audio.isPlaying) {
      audio.stop()
    }
  }
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  let audioInstance, audioAnalyserInstance

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const composer = createEffectComposer(scene, camera, renderer)
  const controls = createControls(camera, renderer.domElement)
  const stopAudioPlay = loadAssets((audio, listener, audioAnalyser) => {
    audioInstance = audio
    audioAnalyserInstance = audioAnalyser
    camera.add(listener)
  })
  const removeClickEvent = applyRayCaster({
    camera,
    containerElement,
    objects: scene.children,
    callback: () => {
      if (!audioInstance) return
      audioInstance.isPlaying ? audioInstance.pause() : audioInstance.play()
    }
  })

  // 创建模型
  const group = createModels()
  scene.add(group)

  const render = () => {
    controls.update()
    composer.render()
    if (audioInstance && audioInstance.isPlaying && audioAnalyserInstance) {
      const data = audioAnalyserInstance.getFrequencyData()
      group.children.forEach((mesh, index) => {
        const value = data[index] / 45
        mesh.scale.y = value
      })
    }
    raf = window.requestAnimationFrame(render)
  }
  render()

  onBeforeUnmount(() => {
    stopAudioPlay()
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
    <span class="tip">点击场景中方块播放音乐</span>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  position: relative;
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
