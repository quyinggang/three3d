<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

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
  camera.position.set(0, 0, 8)
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

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      // 计算当前坐标对应的角度大小，然后加上旋转增加的角度
      // 取模表示每隔多少角度就切分扇形，360表示1个，180表示2个...
      float rad = mod(atan(coord.y, coord.x) + angle, PI / 1.5);
      if (distance <= radius) {
        ratio = 1.0 - rad;
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime / 2.0);
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
  mesh.position.set(-1.5, 1, 0)
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
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      // 计算当前坐标对应的角度大小，然后加上旋转增加的角度
      // 取模表示每隔多少角度就切分扇形，360表示1个，180表示2个...
      float rad = mod(atan(coord.y, coord.x) + angle, PI / 1.5);
      if (distance <= radius) {
        // 更改扇区颜色渐变值
        ratio = 1.0 - clamp(rad * 0.5, 0.0, 1.0);
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, 0.0);
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
  mesh.position.set(0, 1, 0)
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
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      if (distance <= radius) {
        float rad = mod(atan(coord.y, coord.x) + angle, PI * 2.0);
        ratio = 1.0 - rad;
      }
      return ratio;
    }

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return 1.0 - smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float rotateLine(vec2 coord, float radius) {
      vec2 center = vec2(0.5);
      vec2 lineEnd = vec2(radius, 0) * rotate2D(-uTime);
      float lineRatio = straightLine(coord - center, vec2(0.0), lineEnd, 0.01, 0.0);
      float sectorRatio = sectorShape(coord - center, radius, uTime);
      return lineRatio + sectorRatio;
    }

    void main() {
      float ratio = rotateLine(vUV, 0.4);
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
  mesh.position.set(1.5, 1, 0)
  return mesh
}

const createMesh4 = () => {
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

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      float rad = mod(atan(coord.y, coord.x) + angle, PI * 2.0);
      if (distance <= radius && distance >= radius - 0.02) {
        ratio = 1.0 - rad;
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime);
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
  mesh.position.set(-1.5, -1, 0)
  return mesh
}

const createMesh5 = () => {
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

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      float rad = mod(atan(coord.y, coord.x) + angle, PI / 1.5);
      if (distance <= radius) {
        ratio = 1.0 - smoothstep(0.9, 0.95, rad);
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime / 2.0);
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
  mesh.position.set(-0, -1, 0)
  return mesh
}

const createMesh6 = () => {
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

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      float rad = atan(coord.y, coord.x);
      if (distance <= radius) {
        ratio = smoothstep(-0.3, -0.35, rad) + smoothstep(0.3, 0.35, rad);
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime / 2.0);
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
  mesh.position.set(1.5, -1, 0)
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

  const mesh4 = createMesh4()
  scene.add(mesh4)

  const mesh5 = createMesh5()
  scene.add(mesh5)

  const mesh6 = createMesh6()
  scene.add(mesh6)

  const mesh1Uniforms = mesh1.material.uniforms
  const mesh3Uniforms = mesh3.material.uniforms
  const mesh4Uniforms = mesh4.material.uniforms
  const mesh6Uniforms = mesh6.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    const time = clock.getElapsedTime()
    mesh1Uniforms.uTime.value = time
    mesh3Uniforms.uTime.value = time
    mesh4Uniforms.uTime.value = time
    mesh6Uniforms.uTime.value = time

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
