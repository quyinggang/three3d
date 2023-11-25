<script setup>
/**
 * 主要学习：
 * - 粒子引擎实现烟雾、火焰、烟花、下雨、下雪等效果
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { ParticleEngine, ParticleType, Tween } from '@/libs/ParticleEngine.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import spikeyAssets from '@/assets/textures/sprites/spikey.png'
import smokeparticleAssets from '@/assets/textures/sprites/smokeparticle.png'
import snowflakeAssets from '@/assets/textures/sprites/snowflake.png'
import raindrop2flipAssets from '@/assets/textures/sprites/raindrop2flip.png'
import sparkAssets from '@/assets/textures/sprites/spark.png'

let raf = null
const canvasElementRef = ref(null)
const containerElementRef = ref(null)

let particleEngine = null
const textureLoader = new THREE.TextureLoader()
const particleExamples = {
  starfield: {
    positionStyle: ParticleType.CUBE,
    positionBase: new THREE.Vector3(0, 200, 0),
    positionSpread: new THREE.Vector3(600, 400, 600),

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(0, 0, 0),
    velocitySpread: new THREE.Vector3(0.5, 0.5, 0.5),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 0,
    angleVelocitySpread: 4,

    particleTexture: textureLoader.load(spikeyAssets),

    sizeBase: 10.0,
    sizeSpread: 2.0,
    colorBase: new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
    colorSpread: new THREE.Vector3(0.0, 0.0, 0.2),
    opacityBase: 1,

    particlesPerSecond: 20000,
    particleDeathAge: 60.0,
    emitterDeathAge: 0.1
  },
  fireball: {
    positionStyle: ParticleType.SPHERE,
    positionBase: new THREE.Vector3(0, 50, 0),
    positionRadius: 2,

    velocityStyle: ParticleType.SPHERE,
    speedBase: 40,
    speedSpread: 8,

    particleTexture: textureLoader.load(smokeparticleAssets),

    sizeTween: new Tween([0, 0.1], [1, 150]),
    opacityTween: new Tween([0.7, 1], [1, 0]),
    colorBase: new THREE.Vector3(0.02, 1, 0.4),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 60,
    particleDeathAge: 1.5,
    emitterDeathAge: 60
  },
  smoke: {
    positionStyle: ParticleType.CUBE,
    positionBase: new THREE.Vector3(0, 0, 0),
    positionSpread: new THREE.Vector3(10, 0, 10),

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(0, 150, 0),
    velocitySpread: new THREE.Vector3(80, 50, 80),
    accelerationBase: new THREE.Vector3(0, -10, 0),
    particleTexture: textureLoader.load(smokeparticleAssets),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 0,
    angleVelocitySpread: 720,

    sizeTween: new Tween([0, 1], [32, 128]),
    opacityTween: new Tween([0.8, 2], [0.5, 0]),
    colorTween: new Tween([0.4, 1], [new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, 0, 0.5)]),

    particlesPerSecond: 200,
    particleDeathAge: 2.0,
    emitterDeathAge: 60
  },
  clouds: {
    positionStyle: ParticleType.CUBE,
    positionBase: new THREE.Vector3(-100, 100, 0),
    positionSpread: new THREE.Vector3(0, 50, 60),

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(40, 0, 0),
    velocitySpread: new THREE.Vector3(20, 0, 0),

    particleTexture: textureLoader.load(smokeparticleAssets),

    sizeBase: 80.0,
    sizeSpread: 100.0,
    colorBase: new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
    opacityTween: new Tween([0, 1, 4, 5], [0, 1, 1, 0]),

    particlesPerSecond: 50,
    particleDeathAge: 10.0,
    emitterDeathAge: 60
  },
  snow: {
    positionStyle: ParticleType.CUBE,
    positionBase: new THREE.Vector3(0, 200, 0),
    positionSpread: new THREE.Vector3(500, 0, 500),

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(0, -60, 0),
    velocitySpread: new THREE.Vector3(50, 20, 50),
    accelerationBase: new THREE.Vector3(0, -10, 0),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 0,
    angleVelocitySpread: 60,

    particleTexture: textureLoader.load(snowflakeAssets),

    sizeTween: new Tween([0, 0.25], [1, 10]),
    colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
    opacityTween: new Tween([2, 3], [0.8, 0]),

    particlesPerSecond: 200,
    particleDeathAge: 4.0,
    emitterDeathAge: 60
  },
  rain: {
    positionStyle: ParticleType.CUBE,
    positionBase: new THREE.Vector3(0, 200, 0),
    positionSpread: new THREE.Vector3(600, 0, 600),

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(0, -400, 0),
    velocitySpread: new THREE.Vector3(10, 50, 10),
    accelerationBase: new THREE.Vector3(0, -10, 0),

    particleTexture: textureLoader.load(raindrop2flipAssets),

    sizeBase: 8.0,
    sizeSpread: 4.0,
    colorBase: new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
    colorSpread: new THREE.Vector3(0.0, 0.0, 0.2),
    opacityBase: 0.6,

    particlesPerSecond: 1000,
    particleDeathAge: 1.0,
    emitterDeathAge: 60
  },
  fireflies: {
    positionStyle: ParticleType.CUBE,
    positionBase: new THREE.Vector3(0, 100, 0),
    positionSpread: new THREE.Vector3(400, 200, 400),

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(0, 0, 0),
    velocitySpread: new THREE.Vector3(60, 20, 60),

    particleTexture: textureLoader.load(sparkAssets),

    sizeBase: 40.0,
    sizeSpread: 6.0,
    opacityTween: new Tween(
      [0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
      [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2]
    ),
    colorBase: new THREE.Vector3(0.3, 1.0, 0.6), // H,S,L
    colorSpread: new THREE.Vector3(0.3, 0.0, 0.0),

    particlesPerSecond: 20,
    particleDeathAge: 6.1,
    emitterDeathAge: 600
  },
  firework: {
    positionStyle: ParticleType.SPHERE,
    positionBase: new THREE.Vector3(0, 100, 0),
    positionRadius: 10,

    velocityStyle: ParticleType.SPHERE,
    speedBase: 90,
    speedSpread: 10,

    accelerationBase: new THREE.Vector3(0, -80, 0),

    particleTexture: textureLoader.load(sparkAssets),

    sizeTween: new Tween([0.5, 0.7, 1.3], [5, 40, 1]),
    opacityTween: new Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
    colorTween: new Tween(
      [0.4, 0.8, 1.0],
      [new THREE.Vector3(0, 1, 1), new THREE.Vector3(0, 1, 0.6), new THREE.Vector3(0.8, 1, 0.6)]
    ),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 3000,
    particleDeathAge: 2.5,
    emitterDeathAge: 0.2
  },
  candle: {
    positionStyle: ParticleType.SPHERE,
    positionBase: new THREE.Vector3(0, 50, 0),
    positionRadius: 2,

    velocityStyle: ParticleType.CUBE,
    velocityBase: new THREE.Vector3(0, 100, 0),
    velocitySpread: new THREE.Vector3(20, 0, 20),

    particleTexture: textureLoader.load(smokeparticleAssets),

    sizeTween: new Tween([0, 0.3, 1.2], [20, 150, 1]),
    opacityTween: new Tween([0.9, 1.5], [1, 0]),
    colorTween: new Tween(
      [0.5, 1.0],
      [new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0)]
    ),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 60,
    particleDeathAge: 1.5,
    emitterDeathAge: 60
  }
}

const initParticleEngine = (parameters, group) => {
  particleEngine = new ParticleEngine()
  particleEngine.setValues(parameters)
  particleEngine.initialize(group)
}

const restartEngine = (parameters, group) => {
  particleEngine && particleEngine.destroy(group)
  initParticleEngine(parameters, group)
}

const initDataGUI = (group) => {
  const gui = new dat.GUI()
  gui.width = 100
  const parameters = {
    starfield: () => restartEngine(particleExamples.starfield, group),
    fireflies: () => restartEngine(particleExamples.fireflies, group),
    clouds: () => restartEngine(particleExamples.clouds, group),
    smoke: () => restartEngine(particleExamples.smoke, group),
    fireball: () => restartEngine(particleExamples.fireball, group),
    candle: () => restartEngine(particleExamples.candle, group),
    rain: () => restartEngine(particleExamples.rain, group),
    snow: () => restartEngine(particleExamples.snow, group),
    firework: () => restartEngine(particleExamples.firework, group)
  }
  gui.add(parameters, 'starfield').name('繁星')
  gui.add(parameters, 'fireflies').name('萤火虫')
  gui.add(parameters, 'clouds').name('云朵')
  gui.add(parameters, 'smoke').name('烟雾')
  gui.add(parameters, 'fireball').name('火球')
  gui.add(parameters, 'candle').name('火焰')
  gui.add(parameters, 'rain').name('下雨')
  gui.add(parameters, 'snow').name('下雪')
  gui.add(parameters, 'firework').name('烟花')

  gui.open()
  return () => gui.destroy()
}

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 10000)
  camera.position.set(0, 200, 400)
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
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
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

  const clock = new THREE.Clock()
  const render = () => {
    const delta = clock.getDelta()
    controls.update()
    particleEngine && particleEngine.update(delta * 0.5)
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }

  const group = new THREE.Group()
  scene.add(group)

  const destroyDataGUI = initDataGUI(group)
  initParticleEngine(particleExamples.fireflies, group)
  render()

  onBeforeUnmount(() => {
    destroyDataGUI()
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
