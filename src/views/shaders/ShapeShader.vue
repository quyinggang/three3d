<script setup>
/**
 * 主要学习：
 * - gl_FragCoord与UV坐标的不同应用场景
 */
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

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
  camera.position.set(0, 0, 11)
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

const createMesh = () => {
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

    float circle(vec2 position, vec2 center, float radius) {
      float distance = length(position - center);
      return distance <= radius ? 1.0 : 0.0;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float opacity = circle(vUV, center, 0.5);
      gl_FragColor = vec4(uColor, opacity);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-3, 3, 0)
  return mesh
}

// 使用smoothstep实现圆，相比于直接条件比较的逻辑，存在边缘过渡可以减少锯齿
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

    varying vec2 vUV;

    float circle(vec2 position, vec2 center, float radius) {
      float distance = length(position - center);
      float ratio = smoothstep(radius, radius + 0.01, distance);
      // 反相
      return 1.0 - ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = circle(vUV, center, 0.5);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, 3, 0)
  return mesh
}

// 圆环
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

    varying vec2 vUV;

    float cirque(vec2 position, vec2 center, float outerRadius, float innerRadius) {
      float step = 0.01;
      float distance = length(position - center);
      float outerCircle = smoothstep(outerRadius, outerRadius + step, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + step, distance);
      return outerCircle - innerCircle;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = cirque(vUV, center, 0.4, 0.45);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(0, 3, 0)
  return mesh
}

// 矩形
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

    varying vec2 vUV;

    float rectangle(vec2 position, vec2 center, float width, float height) {
      float halfWidth = width * 0.5;
      float halfHeight = height * 0.5;
      float step = 0.01;
      float leftX = center.x - halfWidth;
      float rightX = center.x + halfWidth;
      float topY = center.y + halfHeight;
      float bottomY = center.y - halfHeight;

      // smoothstep的前两个参数edge0、edge1，x == edge0返回0.0，x == edge1返回1.0
      float left = smoothstep(leftX, leftX + step, position.x);
      float right = smoothstep(rightX, rightX + step, position.x);
      float top = smoothstep(topY, topY + step, position.y);
      float bottom = smoothstep(bottomY, bottomY - step, position.y);

      return left - right - top - bottom;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = rectangle(vUV, center, 0.8, 0.8);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(1.5, 3, 0)
  return mesh
}

// 平行四边形
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

    varying vec2 vUV;

    // 切变矩阵
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
      vec2 center = vec2(0.5, 0.5);
      float ratio = parallelogram(vUV, center, 0.66, 0.8, -10.0, 0.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(3, 3, 0)
  return mesh
}

// 直线
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

    varying vec2 vUV;

    // 返回点距离线段的距离从而实现线段绘制
    float straightLine(vec2 position, vec2 start, vec2 end) {
      float smoothness = 0.05;
      // 线段向量
      vec3 line = vec3(start - end, 0.0);
      // 当前点与线段开始点、结束点构成的向量
      vec3 pointEnd = vec3(position - end, 0.0);
      vec3 pointStart = vec3(position - start, 0.0);

      float lineLength = length(line);
      // 通过点积可以判断判断点向量与线段向量的相似度，结果在[-1, 1]之间，0表示垂直，> 0同向，< 0反向
      // lineLength参入计算主要是用于优化片元计算量
      float proj = dot(pointEnd, line) / lineLength;

      float distance = 0.0;
      if (proj >= 0.0 && proj <= lineLength) {
        // 归一化线段向量，线段向量方向不变长度变成1
        vec3 normalizeLine = normalize(line);
        // 叉乘得到基于uv坐标向量与归一化的线段向量得到的新向量p
        // p的长度就是uv坐标向量与线段向量组成的平行四边形面积
        // 由于线段向量归一化长度为1，此时平行四边形面积就是uv坐标向量与线段向量的垂直距离
        distance = length(cross(pointEnd, normalizeLine));
      } else {
        distance = min(length(pointEnd), length(pointStart));
      }
      return 1.0 - smoothstep(0.0, smoothness, distance);
    }

    void main() {
      float ratio = straightLine(vUV, vec2(0.1, 0.8), vec2(0.8, 0.2));
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-3, 1, 0)
  return mesh
}

// 折线
const createMesh7 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;

    varying vec2 vUV;

    float straightLine(vec2 position, vec2 start, vec2 end) {
      vec3 line = vec3(start - end, 0.0);
      vec3 pointEnd = vec3(position - end, 0.0);
      vec3 pointStart = vec3(position - start, 0.0);

      float lineLength = length(line);
      float proj = dot(pointEnd, line) / lineLength;

      float distance = 0.0;
      if (proj >= 0.0 && proj <= lineLength) {
        vec3 normalizeLine = normalize(line);
        distance = length(cross(pointEnd, normalizeLine));
      } else {
        distance = min(length(pointEnd), length(pointStart));
      }
      return distance;
    }

    float polyline(vec2 position, vec2 points[4]) {
      float ratio = 1.0;
      float smoothness = 0.05;
      int len = points.length();
      for (int index = 0; index < len - 1; index++) {
        vec2 current = points[index];
        vec2 next = points[index + 1];
        float result = straightLine(vUV, current, next);
        ratio = min(ratio, result);
      }
      return 1.0 - smoothstep(0.0, smoothness, ratio);
    }

    void main() {
      vec2 points[4];
      points[0] = vec2(0.1, 0.0);
      points[1] = vec2(0.3, 0.8);
      points[2] = vec2(0.5, 0.2);
      points[3] = vec2(0.8, 0.6);

      float ratio = polyline(vUV, points);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, 1, 0)
  return mesh
}

const createMesh8 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor;

    varying vec2 vUV;

    float lineDistance(vec2 position, vec2 start, vec2 end) {
      vec3 line = vec3(start - end, 0.0);
      vec3 pointEnd = vec3(position - end, 0.0);
      return cross(pointEnd, normalize(line)).z;
    }

    float straightLine(vec2 position, vec2 start, vec2 end) {
      vec3 line = vec3(start - end, 0.0);
      vec3 pointEnd = vec3(position - end, 0.0);
      vec3 pointStart = vec3(position - start, 0.0);

      float lineLength = length(line);
      float proj = dot(pointEnd, line) / lineLength;

      float distance = 0.0;
      if (proj >= 0.0 && proj <= lineLength) {
        vec3 normalizeLine = normalize(line);
        distance = length(cross(pointEnd, normalizeLine));
      } else {
        distance = min(length(pointEnd), length(pointStart));
      }
      return distance;
    }

    float triangle(vec2 position, vec2 start, vec2 middle, vec2 end) {
      float ratio = 1.0;
      float smoothness = 0.03;
      float distance1 = lineDistance(position, start, middle);
      float distance2 = lineDistance(position, middle, end);
      float distance3 = lineDistance(position, end, start);
      if (distance1 >= 0.0 && distance2 >= 0.0 && distance3 >= 0.0 || (distance1 <= 0.0 && distance2 <= 0.0 && distance3 <= 0.0)) {
        ratio = -min(abs(distance1), min(abs(distance2), abs(distance3)));
      } else {
        ratio = min(straightLine(position, start, middle), min(straightLine(position, middle, end), straightLine(position, end, start)));
      }

      return 1.0 - smoothstep(0.0, smoothness, ratio);
    }

    void main() {
      float ratio = triangle(vUV, vec2(0.1, 0.3), vec2(0.5, 0.8), vec2(0.8, 0.3));
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: new THREE.Color('#BA55D3')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(0, 1, 0)
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

  const mesh = createMesh()
  scene.add(mesh)

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

  const mesh7 = createMesh7()
  scene.add(mesh7)

  const mesh8 = createMesh8()
  scene.add(mesh8)

  const render = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
  }
  render()
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
