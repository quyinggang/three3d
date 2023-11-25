<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import shanghaiAssets from '@/assets/models/shanghai.FBX?url'

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
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000)
  camera.position.set(0, 50, 1000)
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
  controls.enableDamping = true
  controls.minDistance = 300
  controls.maxDistance = 6000
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

const createLights = () => {
  const group = new THREE.Group()
  const light = new THREE.AmbientLight(0xadadad)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(600, 600, 0)

  group.add(light)
  group.add(directionalLight)

  return group
}

const loadCityModels = (onLoaded) => {
  const fbxLoader = new FBXLoader()
  fbxLoader.load(shanghaiAssets, (group) => {
    onLoaded && onLoaded(group)
  })
}

const shaderUniformsCallbackList = []

/**
 * 对于shader内容的修改，需要根据具体内容进行处理
 * shader中会存在#include <begin_vertex>等语句，这些事three定义的glsl，具体脚本内容查看three源码中renderer/shaders/shaderChunk下对应脚本文件
 * 而修改shader就是在对应的脚本语句后修改脚本或增加语句
 */
const applyGrowShader = (shader) => {
  shader.uniforms.uProgress = { value: 0 }
  shader.vertexShader = `
    uniform float uProgress;
    ${shader.vertexShader}
  `
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      transformed.z = position.z * min(uProgress, 1.0);
    `
  )
  shaderUniformsCallbackList.push((progress) => {
    shader.uniforms.uProgress.value = progress
  })
}

const modelHandlerMap = {
  CITY_UNTRIANGULATED: (model, group) => {
    // 城市建筑
    const { geometry, position, material } = model

    // 模型线框化
    const lienMaterial = new THREE.LineBasicMaterial({ color: '#2685fe' })
    const lineBox = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 1), lienMaterial)
    lineBox.position.copy(position)
    // 模型坐标系与WebGL坐标系不同需要处理
    lineBox.rotateX(-Math.PI / 2)
    group.add(lineBox)

    // 在原先材质效果的基础上修改shader
    material.onBeforeCompile = (shader) => {
      material.color = new THREE.Color('#0e233d')
      material.transparent = true
      material.opacity = 0.9
      // 实现生长效果
      applyGrowShader(shader)
    }
    lienMaterial.onBeforeCompile = (shader) => {
      applyGrowShader(shader)
    }
  },
  LANDMASS: (model) => {
    // 地面
    const material = model.material
    material.color = new THREE.Color('#040912')
    material.transparent = true
    material.opacity = 0.8
  },
  ROADS: (model) => {
    // 道路
    const material = model.material
    material.color = new THREE.Color('#292e4c')
  }
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
  const groupLights = createLights()
  scene.add(groupLights)

  loadCityModels((cityScene) => {
    const group = new THREE.Group()
    cityScene.children.forEach((item) => {
      const clonedData = item.clone()
      const handler = modelHandlerMap[clonedData.name]
      handler && handler(clonedData, group)
      group.add(clonedData)
    })
    scene.add(group)
  })

  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    shaderUniformsCallbackList.forEach((callback) => {
      callback && callback(elapsedTime * 0.5)
    })

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
