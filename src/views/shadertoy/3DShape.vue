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

    mat3 rotateX(float angle) {
      return mat3(1.0, 0.0, 0.0,
                0.0, cos(angle), -sin(angle),
                0.0, sin(angle), cos(angle));
    }
    
    mat3 rotateY(float angle) {
      return mat3(cos(angle), 0.0, -sin(angle),
                0.0, 1.0, 0.0,
                sin(angle), 0.0, cos(angle));
    }
    
    mat3 rotateZ(float angle) {
      return mat3(cos(angle), -sin(angle), 0.0,
                sin(angle), cos(angle), 0.0,
                0.0, 0.0, 1.0);
    }

    float drawPoint(vec2 p, vec3 screenVertex) {
      float d = length(screenVertex.xy - p) - 0.05 / screenVertex.z;
      return 1.0 - smoothstep(0.0, 0.005, d);
    }

    float sdSphere(vec3 p, float s) {
      return length(p)-s;
    }

    float drawLine(in vec2 p, in vec3 sv1, in vec3 sv2) {
      vec2 lineVec = vec2(sv2.x - sv1.x, sv2.y - sv1.y);
      vec2 pVec = vec2(p.x - sv1.x, p.y - sv1.y);
      
      float distToLine = length(cross(vec3(normalize(lineVec), 0.0), vec3(pVec, 0.0)));
      float distAlongLine = dot(lineVec, pVec)/dot(lineVec, lineVec);
      
      float depth = (1.0 - distAlongLine) * sv1.z + distAlongLine * sv2.z;
      
      float val = 1.0 - smoothstep(0.0, 0.005, distToLine - 0.005 /depth);
      val *= step(0.0, distAlongLine) * step(distAlongLine, 1.0);
      return val;
    }

    vec3[8] projectCube(vec2 center) {
      // 1X1正方体坐标
      vec3[8] cube;
      cube[0] = vec3(0.0, 0.0, 0.0);
      cube[1] = vec3(1.0, 0.0, 0.0);
      cube[2] = vec3(1.0, 0.0, 1.0);
      cube[3] = vec3(0.0, 0.0, 1.0);
      cube[4] = vec3(0.0, 1.0, 0.0);
      cube[5] = vec3(1.0, 1.0, 0.0);
      cube[6] = vec3(1.0, 1.0, 1.0);
      cube[7] = vec3(0.0, 1.0, 1.0);

      float depth = 4.0;
      vec3[8] screenVertices;
      for (int j = 0; j < 8; j++) {
        vec3 vertex = cube[j];
        // 正方体坐标系原点移到其中心
        vertex -= vec3(0.5);

        // 旋转
        vertex = vertex * rotateY(iTime);

        // 深度
        vertex.z -= depth;

        vec3 screenVertex = vec3(-vertex.x / vertex.z, -vertex.y / vertex.z, -vertex.z);
        screenVertex.xy += center;
        screenVertices[j] = screenVertex;
      }
      return screenVertices;
    }

    vec3 cubePoints(vec2 uv, vec2 center) {
      vec3[8] cube = projectCube(center);

      float val = 1.0;
      for (int j = 0; j < 8; j++) {
        val *= 1.0 - drawPoint(uv, cube[j]);
      }
      val = 1.0 - val;
      return val * vec3(0.0, 1.0, 1.0);
    }

    vec3 cubeLine(vec2 uv, vec2 center) {
      vec3[8] cube = projectCube(center);

      ivec2[12] edge;
      edge[0] = ivec2(0, 1);
      edge[1] = ivec2(0, 3);
      edge[2] = ivec2(0, 4);
      edge[3] = ivec2(1, 2);
      edge[4] = ivec2(1, 5);
      edge[5] = ivec2(2, 3);
      edge[6] = ivec2(2, 6);
      edge[7] = ivec2(3, 7);
      edge[8] = ivec2(4, 5);
      edge[9] = ivec2(5, 6);
      edge[10] = ivec2(6, 7);
      edge[11] = ivec2(4, 7);

      float val = 1.0;
      for (int j = 0; j < 12; j++) {
        ivec2 index = edge[j];
        vec3 current = cube[index[0]];
        vec3 next = cube[index[1]];
        val *= 1.0 - drawLine(uv, current, next);
      }

      val = 1.0 - val;

      return val * vec3(0.0, 1.0, 1.0);
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec3 cubePointColor = cubePoints(uv, vec2(-1.0, 0.5));
      vec3 cubeLineColor = cubeLine(uv, vec2(0.0, 0.5));

      fragColor = vec4(cubePointColor + cubeLineColor, 1.0);
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

  const handleMouseMove = (event) => {
    const x = event.clientX - bounding.left
    const y = event.clientY - bounding.top
    uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0)
  }
  window.addEventListener('mousemove', handleMouseMove)
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
    window.removeEventListener('mousemove', handleMouseMove)
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
