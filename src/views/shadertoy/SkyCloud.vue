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

/**
 * RayMarching叫做光线步进算法，完全基于屏幕进行运算的，场景中的对象全部都是由程序来表示，通过该算法就可以在二维表面实现三维效果
 * 在shadertoy中大量效果的实现都是基于该算法来的
 * RayMarching原理简要概括为：按照摄像机方向(Ray)逐步前进（March）进行采样，当采样线碰到球或者场景的时候停止采样返回采样的距离
 *
 */
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
    #define MAX_DISTANCE 60.0
    // 最大前进步数
    #define MAX_STEPS 128
    // 命中阀值
    #define HIT_DISTANCE 0.001

    vec3 random3(vec3 p3) {
      p3 = fract(p3 * vec3(.1031,.11369,.2323));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
    }

    // 三维Perlin Noise
    float pNoise(vec3 p) {
      vec3 pi = floor(p);
      vec3 pf = p - pi;
      vec3 w = pf * pf * (3.0 - 2.0 * pf);
    
      return 	mix(
              mix(
                    mix(dot(pf - vec3(0, 0, 0), random3(pi + vec3(0, 0, 0))), 
                          dot(pf - vec3(1, 0, 0), random3(pi + vec3(1, 0, 0))),
                          w.x),
                    mix(dot(pf - vec3(0, 0, 1), random3(pi + vec3(0, 0, 1))), 
                          dot(pf - vec3(1, 0, 1), random3(pi + vec3(1, 0, 1))),
                          w.x),
                    w.z),
              mix(
                      mix(dot(pf - vec3(0, 1, 0), random3(pi + vec3(0, 1, 0))), 
                          dot(pf - vec3(1, 1, 0), random3(pi + vec3(1, 1, 0))),
                          w.x),
                      mix(dot(pf - vec3(0, 1, 1), random3(pi + vec3(0, 1, 1))), 
                          dot(pf - vec3(1, 1, 1), random3(pi + vec3(1, 1, 1))),
                          w.x),
                    w.z),
            w.y);
    }

    float fbm(vec3 p) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * pNoise(frequency * p);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float sdPlane(vec3 p) {
      return p.y;
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    float map(vec3 p) {
      return sdPlane(p);
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
    float rayMarch(vec3 ro, vec3 rd, float tMin, float tMax){
      float td = tMin;
      for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + td * rd;
        float d = map(p);
        if(d < HIT_DISTANCE || td > tMax) break;
        td += d;
      }
      return td;
    }

    vec3 sky(vec3 ro, vec3 rd) {
      vec3 sunLight = normalize(vec3(0.0, 0.25, -1.0));
      vec3 sunColor = vec3(1., .7, .55);
      float sunDot = max(dot(rd, sunLight), 0.);
      vec3 sky = mix(vec3(.0, .1, .4), vec3(.3, .6, .8), 1.0 - rd.y);

      // sun
      sky += sunColor * min(pow(sunDot, 4000.0) * 5.0, 1.0);
      sky += sunColor * min(pow(sunDot, 400.0) * .6, 1.0);

      // clouds
      vec3 wind = vec3(0, 0, -iTime * .05);
      float t = -ro.y / rd.y;
      vec3 p = (ro + t * rd) + wind;
      sky = mix(sky, vec3(1.0), smoothstep(.4, .8, 4.0 * fbm(p)));

      return sky;
    }

    vec3 chessBoard(vec3 p) {
      float f = mod(floor(6.0 * p.z) + floor(6.0 * p.x), 2.0);
      return 0.4 + f * vec3(0.1);
    }

    mat3 setCamera(vec3 pos, vec3 lookAt, float rad) {
      vec3 z = normalize(lookAt - pos);
      vec3 cp = vec3(sin(rad), cos(rad), 0.);
      vec3 x = normalize(cross(z, cp));
      vec3 y = cross(x, z);
      return mat3(x, y, z);
    }


    vec3 render(vec3 ro, vec3 rd) {
      vec3 color = vec3(0.0);

      float tMin = 0.01;
      float tMax = MAX_DISTANCE;
      float t = rayMarch(ro, rd, tMin, tMax);
      if (t < tMax) {
        vec3 p = ro + rd * t;
        // 地平面
        color = chessBoard(p);
      } else {
        color = sky(ro, rd);
      }

      // 天空与地面交接处模糊
      color = mix(color, vec3(0.9), pow(1.0 - max(abs(rd.y), 0.0), 8.0));

      return color;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord ){
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec2 mouse = 2.0 * ((iMouse.xy / iResolution.xy) - vec2(0.5));
      // 摄像机位置
      vec3 ro = vec3(3.0 * cos(mouse.x * 8.0), 1.0, -3.0 * sin(mouse.x * 8.0));
      vec3 lookAt = vec3(0.0, 1.0, -1.0);
      // 摄像机矩阵
      mat3 cam = setCamera(ro, lookAt, 0.);
      // 射线方向
      vec3 rd = cam * normalize(vec3(uv, 1));

      vec3 color = render(ro, rd);
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
