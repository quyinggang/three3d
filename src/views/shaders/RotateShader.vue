<script setup>
/**
 * 主要学习：
 * - 纹理坐标uv
 * - atan内置函数应用
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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
  camera.position.set(0, 0, 6)
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
  controls.minDistance = 2
  controls.maxDistance = 40
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  controls.minAzimuthAngle = -Math.PI / 4
  controls.maxAzimuthAngle = Math.PI / 4

  return controls
}

const createMesh = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  /**
   * atan将当前坐标转换为角度
   */
  const fragmentShader = `
    uniform vec3 uColor[3];
    uniform float uTime;

    varying vec2 vUV;

    const float radius = 0.15;
    const float step = 0.015;
    const float speed = 0.5;

    // 旋转矩阵
    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    int getIndex(vec2 uvPosition) {
      // 圆环逻辑，获取圆环层级
      float distance = length(uvPosition);
      int targetIndex = -1;
      for(int index = 1; index <= 3; index++) {
        if (abs(distance - (radius * float(index))) < step) {
          targetIndex = index - 1;
          break;
        }
      }
      return targetIndex;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      int targetIndex = getIndex(vec2(vUV - center));

      // 旋转逻辑
      float index = float(targetIndex + 1);
      int rotateDirection = mod(index, 2.0) == 0.0 ? -1 : 1;
      float time = float(rotateDirection) * index * speed * uTime;
      vec2 uvPosition = (vUV - center) * rotate2D(time);

      // 圆环间隔
      float angle = abs(degrees(atan(uvPosition.y, uvPosition.x)));
      bool isInRange = (angle >= 15.0 && angle <= 45.0) || (angle >= 75.0 && angle <= 105.0) || (angle >= 135.0 && angle <= 165.0);
      float opacity = targetIndex >= 0 && isInRange ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor[targetIndex], opacity);
    }

  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: [new THREE.Color('#00FFFF'), new THREE.Color('#FF00FF'), new THREE.Color('#DC143C')]
      },
      uTime: {
        value: 1
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  return mesh
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

  const mesh = createMesh()
  scene.add(mesh)

  const uniforms = mesh.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    controls.update()
    uniforms.uTime.value = clock.getElapsedTime()
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
