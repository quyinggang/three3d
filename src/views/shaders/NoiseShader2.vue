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
  scene.background = new THREE.Color(0xbfe3dd)
  return scene
}

const createCamera = (aspect) => {
  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000)
  camera.position.set(6, 10, 20)
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
  return controls
}

const createMesh = () => {
  const geometry = new THREE.SphereGeometry(1, 32, 32)
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iColor: { value: new THREE.Color('#162a40') }
    },
    vertexShader: `
      vec3 random3(vec3 c) {
          float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
          vec3 r;
          r.z = fract(512.0*j);
          j *= .125;
          r.x = fract(512.0*j);
          j *= .125;
          r.y = fract(512.0*j);
          return r-0.5;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;
      float simplex3d(vec3 p) {
          /* 1. find current tetrahedron T and it's four vertices */
          /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
          /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
          
          /* calculate s and x */
          vec3 s = floor(p + dot(p, vec3(F3, F3, F3)));
          vec3 x = p - s + dot(s, vec3(G3, G3, G3));
          
          /* calculate i1 and i2 */
          vec3 e = step(vec3(0,0,0), x - x.yzx);
          vec3 i1 = e*(1.0 - e.zxy);
          vec3 i2 = 1.0 - e.zxy*(1.0 - e);
              
          /* x1, x2, x3 */
          vec3 x1 = x - i1 + G3;
          vec3 x2 = x - i2 + 2.0*G3;
          vec3 x3 = x - 1.0 + 3.0*G3;
          
          /* 2. find four surflets and store them in d */
          vec4 w, d;
          
          /* calculate surflet weights */
          w.x = dot(x, x);
          w.y = dot(x1, x1);
          w.z = dot(x2, x2);
          w.w = dot(x3, x3);
          
          /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
          w = max(0.6 - w, 0.0);
          
          /* calculate surflet components */
          d.x = dot(random3(s), x);
          d.y = dot(random3(s + i1), x1);
          d.z = dot(random3(s + i2), x2);
          d.w = dot(random3(s + 1.0), x3);
          
          /* multiply d by w^4 */
          w *= w;
          w *= w;
          d *= w;
          
          /* 3. return the sum of the four surflets */
          return dot(d, vec4(52.0, 52.0, 52.0, 52.0));
      }

      void main() {
        const float scale = 0.8;
        float noise = simplex3d(position * scale);
        vec3 newPosition = position * (1.0 + noise);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);  
      } 
    `,
    fragmentShader: `  
      uniform vec3 iColor;

      void main() {   
        gl_FragColor = vec4(iColor, 1.0);  
      }  
    `,
    wireframe: true
  })
  const sphereMesh = new THREE.Mesh(geometry, shaderMaterial)
  sphereMesh.position.set(0, 4, 0)
  return sphereMesh
}

const createMesh2 = () => {
  const geometry = new THREE.PlaneGeometry(20, 20, 60)
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iColor: { value: new THREE.Color('#162a40') }
    },
    vertexShader: `
    vec2 random2(vec2 st) {
      st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
      return -1.0 + 2.0*fract(sin(st)*43758.5453123);
    }

    float perlinNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        vec2 u = f*f*(3.0-2.0*f);

        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    }

      void main() {
        float noise = perlinNoise(uv) * 16.0;
        vec3 newPosition = vec3(position.x, position.y, position.z + noise);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);  
      } 
    `,
    fragmentShader: `  
      uniform vec3 iColor;

      void main() {   
        gl_FragColor = vec4(iColor, 1.0);  
      }  
    `,
    wireframe: true
  })
  const mesh = new THREE.Mesh(geometry, shaderMaterial)
  mesh.rotation.x = -Math.PI / 2
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
  const mesh2 = createMesh2()
  scene.add(mesh2)

  const render = () => {
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
