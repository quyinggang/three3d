<script setup>
/**
 * 主要学习：
 * - layers分层机制
 * - 后处理效果
 * - 渲染器和深度缓冲区
 * - ShaderPass自定义后处理逻辑，实现将两个渲染画面混合
 */
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)
const currentSchemeId = ref(0)

// 后处理效果
const createEffectComposer = (scene, camera, renderer, isToScreen = true) => {
  const renderPass = new RenderPass(scene, camera)
  const bloomComposer = new EffectComposer(renderer)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
    1.5,
    0.4,
    0.85
  )
  bloomPass.threshold = 0
  bloomPass.strength = 0.55
  bloomPass.radius = 0
  bloomComposer.addPass(renderPass)
  bloomComposer.addPass(bloomPass)

  if (isToScreen) {
    const outputPass = new OutputPass()
    bloomComposer.addPass(outputPass)
  } else {
    bloomComposer.renderToScreen = false
  }

  return bloomComposer
}

const createFinalEffectComposer = (scene, camera, renderer, bloomComposer) => {
  const renderPass = new RenderPass(scene, camera)
  const outputPass = new OutputPass()

  // 创建Shader，是方案二实现的关键
  // 实现将Bloom后处理的渲染结果与当前渲染结果进行混合处理
  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {

          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
      `,
      fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {

          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

        }
      `,
      defines: {}
    }),
    'baseTexture'
  )
  mixPass.needsSwap = true

  const finalComposer = new EffectComposer(renderer)

  finalComposer.addPass(renderPass)
  finalComposer.addPass(mixPass)
  finalComposer.addPass(outputPass)

  return finalComposer
}

const createModels = () => {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 16),
    new THREE.MeshBasicMaterial({ color: '#DC143C' })
  )
  sphere.position.set(-1.5, 0, 0)

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#8A2BE2' })
  )
  box.position.set(1.5, 0, 0)

  const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#8A2BE2' })
  )
  box2.position.set(-1.5, 0, 2)

  const noBloomGroup = new THREE.Group()
  noBloomGroup.add(sphere)
  return [noBloomGroup, box, box2]
}

/**
 * 方案一：慎用，该方案清除深度缓存区数据，单帧两次不同的渲染器处理，
 * 问题：会清除深度信息，深度信息是非常重要的，深度信息的丢失会导致模型失去前后位置关系
 */
const createGlowDepthScheme = (scene, camera, renderer) => {
  const bloomComposer = createEffectComposer(scene, camera, renderer)
  // 渲染器在每一帧前都会自动清除上一帧的颜色缓冲区、深度缓冲区、模版缓冲区中的数据，以便存储新一帧的渲染数据，这里需要关闭以便手动控制
  renderer.autoClear = false
  return () => {
    renderer.clear()
    // 渲染编号1图层的box模型，并使用bloom后处理
    camera.layers.set(1)
    bloomComposer.render()

    // 清除深度缓冲数据
    renderer.clearDepth()

    // 渲染编号0图层的sphere模型，正常渲染无bloom后处理
    camera.layers.set(0)
    // 清理了深度数据后渲染器就会处理后图层0中模型，此时进行深度比较就会判断模型像素可见从而渲染出来
    renderer.render(scene, camera)
  }
}

/**
 * 方案二：推荐使用，在每一帧后处理渲染前替换无需应用后处理效果的模型材质为特殊材质，后处理完成后还原为本来材质
 *
 */
const createGlowMaterialScheme = (scene, camera, renderer) => {
  const bloomComposer = createEffectComposer(scene, camera, renderer, false)
  const finalComposer = createFinalEffectComposer(scene, camera, renderer, bloomComposer)

  const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
  const materialRecord = {}

  function darkenNonBloomed(obj) {
    if (obj.isMesh && obj.parent && obj.parent.isGroup) {
      materialRecord[obj.uuid] = obj.material
      obj.material = darkMaterial
    }
  }

  function restoreMaterial(obj) {
    if (materialRecord[obj.uuid]) {
      obj.material = materialRecord[obj.uuid]
      delete materialRecord[obj.uuid]
    }
  }

  return () => {
    scene.traverse(darkenNonBloomed)
    bloomComposer.render()
    scene.traverse(restoreMaterial)
    finalComposer.render()
  }
}

const handleSchemeSwitch = () => {
  currentSchemeId.value = 1 - currentSchemeId.value
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  // 创建场景
  const scene = new THREE.Scene()

  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  camera.position.set(1, 1, 10)
  // 设置摄像机方向
  camera.lookAt(scene.position)

  // 创建模型
  const [sphereModel, boxModel, box2Model] = createModels()
  scene.add(sphereModel)
  scene.add(boxModel)
  scene.add(box2Model)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1
  controls.maxDistance = 20

  let render = () => {}

  // 切换方案
  const removeWatch = watch(
    currentSchemeId,
    (value) => {
      boxModel.layers.set(1 - value)
      box2Model.layers.set(1 - value)
      render =
        value == 0
          ? createGlowDepthScheme(scene, camera, renderer)
          : createGlowMaterialScheme(scene, camera, renderer)
      render()
    },
    { immediate: true }
  )

  controls.addEventListener('change', () => render())

  onBeforeUnmount(() => {
    removeWatch()
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
  })
})
</script>

<template>
  <div ref="containerElementRef" class="container">
    <span class="button--text" @click="handleSchemeSwitch"
      >点击方案切换：当前方案是{{ currentSchemeId === 0 ? '清除深度' : '替换材质' }}</span
    >
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.button--text {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-size: 18px;
  z-index: 1;
  cursor: pointer;
}
</style>
