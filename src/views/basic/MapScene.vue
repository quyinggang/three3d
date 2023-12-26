<script setup>
/**
 * 主要学习：
 * - d3-geo处理地图数据
 * - shape和ExtrudeGeometry实现二维形状生成三维形状
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as d3 from 'd3-geo'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { transform3DTo2D } from '@/tools/util'
import chinaJson from '@/assets/json/china.json?url'

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
  camera.position.set(0, 0, 120)
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
  controls.minDistance = 6
  controls.maxDistance = 400
  return controls
}

const loadChinaMapJson = (onLoaded) => {
  const loader = new THREE.FileLoader()
  loader.load(chinaJson, (data) => {
    const object = JSON.parse(data)
    onLoaded && onLoaded(object)
  })
}

const createProvinceShape = (projection, provinceData) => {
  const province = new THREE.Object3D()
  const coordinates = provinceData.geometry.coordinates
  coordinates.forEach((coordinate) => {
    coordinate.forEach((polygons) => {
      const points = []
      const shape = new THREE.Shape()
      // 将经纬度坐标转换成二维坐标并根据Shape创建二维形状
      polygons.forEach((polygon, index) => {
        if (Array.isArray(polygon)) {
          const [x, y] = projection(polygon)
          points.push(new THREE.Vector3(x, -y, 0))
          index === 0 ? shape.moveTo(x, -y) : shape.lineTo(x, -y)
        }
      })
      const extrudeSettings = {
        depth: 3,
        bevelEnabled: false
      }
      const mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, extrudeSettings),
        new THREE.MeshBasicMaterial({
          color: '#7FFFD4',
          transparent: true,
          opacity: 0.5
        })
      )
      const boundary = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: '#fff'
        })
      )
      province.add(boundary)
      province.add(mesh)
    })
  })
  return province
}

const applyRayCaster = (params) => {
  const { camera, objects, callback, containerElement } = params
  const bounding = containerElement.getBoundingClientRect()
  const rayCaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const handlePointerMove = (event) => {
    pointer.x = ((event.clientX - bounding.left) / bounding.width) * 2 - 1
    pointer.y = -((event.clientY - bounding.top) / bounding.height) * 2 + 1
    rayCaster.setFromCamera(pointer, camera)
    const intersects = rayCaster.intersectObjects(objects)
    if (intersects.length > 0) {
      callback && callback(intersects[0].object)
    }
  }
  containerElement.addEventListener('pointermove', handlePointerMove)
  return () => {
    containerElement.removeEventListener('pointermove', handlePointerMove)
  }
}

onMounted(() => {
  const canvasElement = canvasElementRef.value
  const containerElement = containerElementRef.value
  const width = containerElement.clientWidth
  const height = containerElement.clientHeight
  const topElement = containerElement.querySelector('.tip')
  let lastSelectedObject = null

  const scene = createScene()
  const camera = createCamera(width / height)
  const renderer = createWebGLRenderer(canvasElement, width, height)
  const controls = createControls(camera, renderer.domElement)

  loadChinaMapJson((mapObject) => {
    const mapGroup = new THREE.Group()
    // 墨卡托投影转换
    const projection = d3.geoMercator().center([104.0, 37.5]).scale(60).translate([0, 0])
    mapObject.features.forEach((item) => {
      const province = createProvinceShape(projection, item)
      const { name, center } = item.properties
      if (name && Array.isArray(center)) {
        const [x, y] = projection(center)
        province.userData = {
          name,
          center: transform3DTo2D(camera, new THREE.Vector3(x, -y, 0), { width, height })
        }
      }
      mapGroup.add(province)
    })
    scene.add(mapGroup)
  })

  const removeListenerEvent = applyRayCaster({
    camera,
    objects: scene.children,
    containerElement,
    callback: (selectedObject) => {
      if (!selectedObject || !selectedObject.isMesh) return
      if (lastSelectedObject) {
        if (selectedObject.uuid === lastSelectedObject.uuid) return
        lastSelectedObject.material.color = new THREE.Color('#7FFFD4')
      }
      const province = selectedObject.parent
      if (province && Object.keys(province.userData).length > 0) {
        const { name, center } = province.userData
        topElement.textContent = name
        topElement.style.transform = `translate(${center.x}px, ${center.y}px)`
      }
      selectedObject.material.color = new THREE.Color('#FF0000')
      selectedObject.material.needsUpdate = true
      lastSelectedObject = selectedObject
    }
  })

  const render = () => {
    controls.update()
    renderer.render(scene, camera)
    raf = window.requestAnimationFrame(render)
  }
  render()

  onBeforeUnmount(() => {
    removeListenerEvent()
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
    <div class="tip"></div>
    <canvas ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped>
.tip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  font-size: 13px;
  color: #fff;
  transform-origin: 0 0;
  pointer-events: none;
  cursor: pointer;
}
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
