<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvasElementRef = ref(null);
const containerElementRef = ref(null);

onMounted(() => {
  const canvasElement = canvasElementRef.value;
  const containerElement = containerElementRef.value;
  const width = containerElement.clientWidth;
  const height = containerElement.clientHeight;

  // 创建场景
  const scene = new THREE.Scene();

  // 网格物体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xb9d3ff,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 坐标轴辅助
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // 透视投影摄像机
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(0, 10, 10);
  // 设置摄像机方向
  camera.lookAt(0, 0, 0);

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  const render = () => {
    renderer.render(scene, camera);
  }

  // 轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement );
  controls.addEventListener('change', render);
  render();
});
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
