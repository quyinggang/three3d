<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

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

const createMesh1 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = fract(position.x * 10.0 + uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
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
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, 0, 0)
  return mesh
}

const createMesh2 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    #define PI 3.14159;
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 position = vUV - vec2(0.5);
      float t = atan(position.y, position.x) / PI;
      float ratio = fract(t * 10.0 + uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
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
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(0, 0, 0)
  return mesh
}

const createMesh3 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    #define PI 3.14159;
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 position = vUV - vec2(0.5);
      float t = atan(position.y, position.x) / PI;
      float ratio = fract(t * 8.0 + length(position * 5.0) + uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
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
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(1.5, 0, 0)
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

    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
  }
  render()
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
