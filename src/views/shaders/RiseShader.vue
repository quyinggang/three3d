<script setup>
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
  camera.position.set(2, 4, 8)
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
  controls.enableDamping = true
  controls.minDistance = 1
  controls.maxDistance = 300
  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = (Math.PI / 2) * 0.96
  return controls
}

const createMesh1 = () => {
  const vertexShader = `
      uniform float uTime;

			void main() {
        float y = min(uTime * 0.8 - position.y, position.y);
        vec3 newPosition = vec3(position.x, y, position.z);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;

    void main() {
      gl_FragColor = vec4(uColor, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#00FFFF')
      },
      uTime: {
        value: 0.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), material)
  mesh.position.set(-1.5, 0, 0)
  return mesh
}

const createMesh2 = () => {
  const vertexShader = `
      varying vec2 vUV;
      varying vec3 vNormal;

			void main() {
        vUV = uv;
        vNormal = normal;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;
    uniform vec3 uRiseColor;
    uniform float uTime;

    varying vec2 vUV;
    varying vec3 vNormal;

    vec3 riseLine() {
      float smoothness = 0.02;
      float speed = clamp(uTime * 0.5, 0.0, 1.0);
      // 不处理法向量指向y轴方向的面
      bool isTopBottom = vNormal.y > 0.0 || vNormal.y < 0.0;
      float ratio = isTopBottom || speed >= 1.0 ? 0.0 : smoothstep(speed, speed + smoothness, vUV.y) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vUV.y);
      return uRiseColor * ratio;
    }

    void main() {
      vec3 color = riseLine();
      gl_FragColor = vec4(uColor + color, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#a9a9a9')
      },
      uRiseColor: {
        value: new THREE.Color('#00FFFF')
      },
      uTime: {
        value: 0.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), material)
  mesh.position.set(0, 0, 0)
  return mesh
}

const createMesh3 = () => {
  const vertexShader = `
      varying vec2 vUV;
      varying vec3 vNormal;

			void main() {
        vUV = uv;
        vNormal = normal;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;
    uniform vec3 uRiseColor;
    uniform float uTime;

    varying vec2 vUV;
    varying vec3 vNormal;

    void main() {
      bool isTopBottom = vNormal.y > 0.0 || vNormal.y < 0.0;
      if (isTopBottom) {
        discard;
      }
      float ratio = 1.0 - smoothstep(0.0, 1.0, vUV.y);
      gl_FragColor = vec4(uColor * ratio, ratio);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#00FFFF')
      },
      uTime: {
        value: 0.0
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), material)
  mesh.position.set(2, -0.5, 0)
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

  const mesh1 = createMesh1()
  scene.add(mesh1)

  const mesh2 = createMesh2()
  scene.add(mesh2)

  const mesh3 = createMesh3()
  scene.add(mesh3)

  const mesh1Uniforms = mesh1.material.uniforms
  const mesh2Uniforms = mesh2.material.uniforms
  const mesh3Uniforms = mesh3.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    const time = clock.getElapsedTime()
    mesh1Uniforms.uTime.value = time
    mesh2Uniforms.uTime.value = time
    mesh3Uniforms.uTime.value = time

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
