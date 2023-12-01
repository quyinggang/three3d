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

    // 最大查找距离
    #define MAX_DISTANCE 20.0
    // 最大前进步数
    #define MAX_STEPS 128
    // 命中阀值
    #define HIT_DISTANCE 0.001
    // 球体信息，xyz表示位置，w表示大小
    #define SPHERE_INFO vec4(0, 0.6, 3, 0.6)


    float sdSphere( vec3 p, float s ) {
      return length(p) - s;
    }

    float sdBox( vec3 p, vec3 b ) {
      vec3 q = abs(p) - b;
      return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float sdPlane(vec3 p) {
      return p.y;
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    float map(vec3 p) {
      vec4 sphere = SPHERE_INFO;
      float sd = sdSphere(p - sphere.xyz, sphere.w);
      float pd = sdPlane(p);

      float size = 0.5;
      vec3 box = vec3(sphere.x, size, -sphere.z);
      float bd = sdBox(p - box, vec3(size));

      return min(min(sd, pd), bd);
    }

    // 计算法线
    vec3 calcNormal(vec3 p) {
      const float h = 0.0001;
      const vec2 k = vec2(1, -1);
      return normalize(k.xyy * map(p + k.xyy * h) +
        k.yyx * map(p + k.yyx * h) +
        k.yxy * map(p + k.yxy * h) +
        k.xxx * map(p + k.xxx * h));
    }

    // 射线源、射线方向
    float rayMarch(vec3 ro, vec3 rd){
      float td = 0.0;
      for(int i = 0; td <= MAX_DISTANCE && i < MAX_STEPS; i++) {
        vec3 p = ro + td * rd;
        float d = map(p);
        if(d < HIT_DISTANCE) break;
        td += d;
      }
      return td > MAX_DISTANCE ? -1.0 : td;
    }

    // 应用灯光
    float calcLight(vec3 p){
        vec3 lightPosition = vec3(0, 2, 0);
        vec3 lightVector = normalize(lightPosition - p);
        // 法线
        vec3 normal = calcNormal(p);
        
        float dif = clamp(dot(normal, lightVector), 0., 1.);
        return dif;
    }

    mat3 setCamera(vec3 pos, vec3 lookAt, float rad) {
      vec3 z = normalize(lookAt - pos);
      vec3 cp = vec3(sin(rad), cos(rad), 0.);
      vec3 x = normalize(cross(z, cp));
      vec3 y = cross(x, z);
      return mat3(x, y, z);
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec2 mouse = 2.0 * (iMouse.xy / iResolution.xy - vec2(0.5));

      float time = iTime * 0.5;
      float radius = 6.0;
      float mouseX = mouse.x * 10.0;
      // 摄像机位置（支持圆周运动 + mouse控制）
      vec3 ro = vec3(radius * cos(time + mouseX), 1.0, radius * sin(time + mouseX));
      vec3 lookAt = vec3(0, 0, 0);
      // 摄像机矩阵
      mat3 cam = setCamera(ro, lookAt, 0.);
      // 射线方向
      vec3 rd = cam * normalize(vec3(uv, 1));

      float t = rayMarch(ro, rd);

      if (t > 0.0) {
        vec3 p = ro + rd * t;
        float diffuseColor = calcLight(p);
        fragColor = vec4(vec3(diffuseColor), 1.0);
      }
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
