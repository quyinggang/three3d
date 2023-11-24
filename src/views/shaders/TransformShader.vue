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
  camera.position.set(0, 0, 10)
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

// 旋转矩阵应用
const createMesh1 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uCircleColor;
    uniform vec3 uLineColor;
    uniform float uTime;

    varying vec2 vUV;

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    float cirque(vec2 coord, float outerRadius, float innerRadius) {
      float smoothness = 0.01;
      float distance = length(coord);
      float outerCircle = smoothstep(outerRadius, outerRadius + smoothness, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + smoothness, distance);
      return abs(outerCircle - innerCircle);
    }

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return 1.0 - smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float rotateLine(vec2 coord, float radius) {
      vec2 center = vec2(0.5);
      // 旋转矩阵应用
      vec2 lineEnd = vec2(radius, 0.0) * rotate2D(-uTime / 2.0);
      // 以center为旋转中心
      return straightLine(coord - center, vec2(0.0), lineEnd, 0.03, 0.001);
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float circleRatio = cirque(vUV - center, 0.46, 0.48);
      float lineRatio = rotateLine(vUV, 0.4);
      vec3 color = circleRatio * uCircleColor + lineRatio * uLineColor;
      gl_FragColor = vec4(color, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uCircleColor: {
        value: new THREE.Color('#00FFFF')
      },
      uLineColor: {
        value: new THREE.Color('#FF0000')
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
  mesh.position.set(-3, 0, 0)
  return mesh
}

// 平移矩阵应用
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

    float rectangle(vec2 position, vec2 center, float width, float height) {
      float halfWidth = width * 0.5;
      float halfHeight = height * 0.5;
      float step = 0.01;
      float leftX = center.x - halfWidth;
      float rightX = center.x + halfWidth;
      float topY = center.y + halfHeight;
      float bottomY = center.y - halfHeight;

      float left = smoothstep(leftX, leftX + step, position.x);
      float right = smoothstep(rightX, rightX + step, position.x);
      float top = smoothstep(topY, topY + step, position.y);
      float bottom = smoothstep(bottomY, bottomY - step, position.y);

      return left - right - top - bottom;
    }

    void main() {
      vec2 translate = vec2(sin(uTime) * 0.25, cos(uTime) * 0.25);
      float ratio = rectangle(vUV + translate, vec2(0.5), 0.3, 0.2);
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
  mesh.position.set(-1, 0, 0)
  return mesh
}

// 缩放矩阵应用
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

    mat2 scale2D(float scaleX, float scaleY) {
      return mat2(scaleX, 0.0, 0.0, scaleY);
    }

    float cirque(vec2 position, vec2 center, float outerRadius, float innerRadius) {
      float step = 0.01;
      float distance = length(position - center);
      float outerCircle = smoothstep(outerRadius, outerRadius + step, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + step, distance);
      return abs(outerCircle - innerCircle);
    }

    void main() {
      float scale = abs(sin(uTime)) * 2.0;
      vec2 size = vec2(0.16, 0.18) * scale2D(scale, scale);
      float ratio = cirque(vUV, vec2(0.5), size.x, size.y);
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
  mesh.position.set(1, 0, 0)
  return mesh
}

// 剪切矩阵应用
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

    mat2 skewMatrix(float skewXRad, float skewYRad) {
      return mat2(1.0, tan(skewXRad), tan(skewYRad), 1.0);
    }

    float parallelogram(vec2 position, vec2 center, float width, float height, float skewXAngle, float skewYAngle) {
      float halfWidth = width * 0.5;
      float halfHeight = height * 0.5;
      float step = 0.01;
      float leftX = center.x - halfWidth;
      float rightX = center.x + halfWidth;
      float topY = center.y + halfHeight;
      float bottomY = center.y - halfHeight;

      vec2 skewPosition = position * skewMatrix(radians(skewXAngle), radians(skewYAngle));

      float left = smoothstep(leftX, leftX + step, skewPosition.x);
      float right = smoothstep(rightX, rightX + step, skewPosition.x);
      float top = smoothstep(topY, topY + step, skewPosition.y);
      float bottom = smoothstep(bottomY, bottomY - step, skewPosition.y);
      
      return left - right - top - bottom;
    }

    void main() {
      float skewXAngle = sin(uTime) * -15.0;
      float ratio = parallelogram(vUV, vec2(0.5), 0.66, 0.8, skewXAngle, 0.0);
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
  mesh.position.set(3, 0, 0)
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

  const mesh1Uniforms = mesh1.material.uniforms
  const mesh2Uniforms = mesh2.material.uniforms
  const mesh3Uniforms = mesh3.material.uniforms
  const mesh4Uniforms = mesh4.material.uniforms
  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh1Uniforms.uTime.value = elapsedTime
    mesh2Uniforms.uTime.value = elapsedTime
    mesh3Uniforms.uTime.value = elapsedTime
    mesh4Uniforms.uTime.value = elapsedTime

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
