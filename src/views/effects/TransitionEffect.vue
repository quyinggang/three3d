<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import gmleiAssets from '@/assets/textures/other/gmlei.png'
import gmhuoAssets from '@/assets/textures/other/gmhuo.png'

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
  camera.position.set(0, 0, 2)
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

// 更多的转场实现：https://gl-transitions.com/gallery
const createMaterial = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float progress = smoothstep(0.0, 1.0, abs(sin(uTime)));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `
  const textureLoader = new THREE.TextureLoader()
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: textureLoader.load(gmleiAssets) },
      uTexture2: { value: textureLoader.load(gmhuoAssets) },
      uTime: { value: 0.0 }
    },
    vertexShader,
    fragmentShader
  })
}

const createMaterial2 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        // 根据阶梯函数step的特性实现
        float progress = step(vUV.x, abs(sin(uTime)));
        // float progress = 1.0 - step(vUV.x, abs(sin(uTime)));
        // float progress = step(vUV.y, abs(sin(uTime)));
        // float progress = 1.0 - step(vUV.y, abs(sin(uTime)));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `
  const textureLoader = new THREE.TextureLoader()
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: textureLoader.load(gmleiAssets) },
      uTexture2: { value: textureLoader.load(gmhuoAssets) },
      uTime: { value: 0.0 }
    },
    vertexShader,
    fragmentShader
  })
}

const createMaterial3 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float progress = step(fract(vUV.x * 8.0), time);
        // float progress = step(fract(vUV.y * 8.0), time);
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `
  const textureLoader = new THREE.TextureLoader()
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: textureLoader.load(gmleiAssets) },
      uTexture2: { value: textureLoader.load(gmhuoAssets) },
      uTime: { value: 0.0 }
    },
    vertexShader,
    fragmentShader
  })
}

const createMaterial4 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float value = length(vUV - vec2(0.5));
        float progress = step(value, time);
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `
  const textureLoader = new THREE.TextureLoader()
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: textureLoader.load(gmleiAssets) },
      uTexture2: { value: textureLoader.load(gmhuoAssets) },
      uTime: { value: 0.0 }
    },
    vertexShader,
    fragmentShader
  })
}

const createMaterial5 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float smoothness = 0.5;
        float count = 10.0;
        float pr = smoothstep(-smoothness, 0.0, vUV.x - time * (1.0 + smoothness));
        float progress = step(pr, fract(count * vUV.x));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `
  const textureLoader = new THREE.TextureLoader()
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: textureLoader.load(gmleiAssets) },
      uTexture2: { value: textureLoader.load(gmhuoAssets) },
      uTime: { value: 0.0 }
    },
    vertexShader,
    fragmentShader
  })
}

const createMaterial6 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

      float random2D(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // 二维值噪声
      float valueNoise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random2D(i);
        float b = random2D(i + vec2(1.0, 0.0));
        float c = random2D(i + vec2(0.0, 1.0));
        float d = random2D(i + vec2(1.0, 1.0));

        vec2 u = f*f*(3.0-2.0*f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
      }

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float progress = step(time, valueNoise(vUV * 10.0));
        // float smoothness = 0.01;
        // float progress = smoothstep(time - smoothness, time + smoothness, valueNoise(vUV * 10.0));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `
  const textureLoader = new THREE.TextureLoader()
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: textureLoader.load(gmleiAssets) },
      uTexture2: { value: textureLoader.load(gmhuoAssets) },
      uTime: { value: 0.0 }
    },
    vertexShader,
    fragmentShader
  })
}

const createMesh = () => {
  const material = createMaterial()
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7, 1), material)
  return mesh
}

const disposeMaterial = (mesh) => {
  mesh.material.dispose()
}

const initDataGUI = (mesh) => {
  const gui = new dat.GUI()
  gui.width = 100
  const parameters = {
    scheme1: () => {
      disposeMaterial(mesh)
      mesh.material = createMaterial()
    },
    scheme2: () => {
      disposeMaterial(mesh)
      mesh.material = createMaterial2()
    },
    scheme3: () => {
      disposeMaterial(mesh)
      mesh.material = createMaterial3()
    },
    scheme4: () => {
      disposeMaterial(mesh)
      mesh.material = createMaterial4()
    },
    scheme5: () => {
      disposeMaterial(mesh)
      mesh.material = createMaterial5()
    },
    scheme6: () => {
      disposeMaterial(mesh)
      mesh.material = createMaterial6()
    }
  }
  gui.add(parameters, 'scheme1').name('方案1')
  gui.add(parameters, 'scheme2').name('方案2')
  gui.add(parameters, 'scheme3').name('方案3')
  gui.add(parameters, 'scheme4').name('方案4')
  gui.add(parameters, 'scheme5').name('方案5')
  gui.add(parameters, 'scheme6').name('方案6')
  gui.open()
  return () => gui.destroy()
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)

  const mesh = createMesh()
  const removeDataGUI = initDataGUI(mesh)
  scene.add(mesh)

  const clock = new THREE.Clock()
  const render = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh.material.uniforms.uTime.value = elapsedTime

    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()

  onBeforeUnmount(() => {
    removeDataGUI()
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
