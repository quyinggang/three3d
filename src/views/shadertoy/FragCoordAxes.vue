<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvasElementRef = ref(null)
const containerElementRef = ref(null)

const createScene = () => {
  // 创建场景
  const scene = new THREE.Scene()
  return scene
}

const createCamera = () => {
  return new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
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

const createPlane = () => {
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  const fragmentShader = `
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    vec3 grid(vec2 uv, float gridSize) {
      float wx = uv.x;
      float wy = uv.y;
      float x0 = abs(fract(wx / gridSize - 0.5) - 0.5) / fwidth(wx) * gridSize / 2.0;
      float z0 = abs(fract(wy / gridSize - 0.5) - 0.5) / fwidth(wy) * gridSize / 2.0;

      float val = 1.0 - clamp(min(x0, z0), 0.0, 1.0);

      vec3 color = val * vec3(0.3);

      // x axis
      // fwidth(uv.x)可以认为是一个X轴方向上1个像素的大小
      color = mix(vec3(1.0, 0.0, 0.0), color, smoothstep(0.0, 2.0 * fwidth(uv.x), abs(uv.y)));
      // y axis
      color = mix(vec3(0.0, 1.0, 0.0), color, smoothstep(0.0, 2.0 * fwidth(uv.y), abs(uv.x)));
      return color;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      // 归一化坐标[0, 1]
      // vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec3 color = grid(uv, 0.5);
      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      iResolution: { value: new THREE.Vector3(0, 0, 1) },
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      iTime: { value: 0 }
    },
    vertexShader,
    fragmentShader
  })
  const plane = new THREE.PlaneGeometry(2, 2)
  return new THREE.Mesh(plane, material)
}

const bindMouseEvents = (containerElement, bounding, uniforms) => {
  let isDragging = false
  const handleMouseMove = (event) => {
    if (!isDragging) return
    const x = event.clientX - bounding.left
    const y = event.clientY - bounding.top
    uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0)
  }
  const handleUp = () => {
    isDragging = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleUp)
  }
  containerElement.addEventListener('mousedown', () => {
    isDragging = true
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleUp)
  })
}

onMounted(() => {
  let raf = null
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const bounding = containerElement.getBoundingClientRect()
  const width = bounding.width
  const height = bounding.height

  const scene = createScene()
  const camera = createCamera()
  const renderer = createWebGLRenderer(canvasElement, width, height)

  const plane = createPlane()
  scene.add(plane)

  const canvas = renderer.domElement
  const clock = new THREE.Clock()
  const uniforms = plane.material.uniforms
  // 注意需要使用canvas的width和hight，即dpr后的大小
  uniforms.iResolution.value = new THREE.Vector3(canvas.width, canvas.height, 1)
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    uniforms.iTime.value = elapsedTime
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }

  bindMouseEvents(containerElement, bounding, uniforms)
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
