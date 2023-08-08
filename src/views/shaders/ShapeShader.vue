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
    transparent: true
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
    transparent: true
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
    transparent: true
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
    transparent: true
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
    transparent: true
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
    transparent: true
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
        // 使用min取最小值可以处理线段重叠处颜色
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, 1, 0)
  return mesh
}

// 三角形
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

    // 获取坐标距离线段的距离，通过判断该距离值可以着色线段一侧的所有片元
    float lineDistance(vec2 position, vec2 start, vec2 end) {
      vec3 line = vec3(start - end, 0.0);
      vec3 pointEnd = vec3(position - end, 0.0);
      // 叉乘的结果是一个新向量，被称为法向量，其垂直于两个向量所在平面，其方向的判断使用右手定则
      // 三维向量这意味着z值可能是负值，z值就是position距离line的距离
      // z值大小 = length(叉乘值)，但是z值存在负值
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
      float ratio = triangle(vUV, vec2(0.1, 0.3), vec2(0.3, 0.8), vec2(0.8, 0.3));
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(0, 1, 0)
  return mesh
}

// sin曲线区域
const createMesh9 = () => {
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

    // 正弦曲线可表示为y = A * sin(ω * x +/- φ * t) + k
    float sinCurveArea(vec2 position) {
      // 振幅，曲线值域[-amplitude, amplitude]
      float amplitude = 0.08;
      // 角速度，控制波浪的周期，值越大越频繁
      float angularVelocity = 12.0;
      // 相位，曲线的水平偏移位置，即φ，可通过t值实现运动效果
      float initialPhase = 0.5;
      // 垂直方向的偏移距离
      float k = 0.4;
      
      float y = amplitude * sin((angularVelocity * position.x) + initialPhase) + k;
      // 比较原始y值与sin曲线y值距离实现
      return 1.0 - smoothstep(y, y + 0.01, position.y);
    }

    void main() {
      float ratio = sinCurveArea(vUV);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(1.5, 1, 0)
  return mesh
}

// sin曲线
const createMesh10 = () => {
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

    // 正弦曲线可表示为y = A * sin(ω * x +/- φ * t) + k
    float sinCurve(vec2 position) {
      float smoothness = 0.03;
      // 振幅，曲线值域[-amplitude, amplitude]
      float amplitude = 0.2;
      // 角速度，控制波浪的周期，值越大越频繁
      float angularVelocity = 12.0;
      // 相位，曲线的水平偏移位置，即φ，可通过t值实现运动效果
      float initialPhase = 0.5;
      // 垂直方向的偏移距离
      float k = 0.4;
      
      float y = amplitude * sin((angularVelocity * position.x) + initialPhase) + k;
      return smoothstep(y - smoothness, y, position.y) - smoothstep(y, y + smoothness, position.y);
    }

    void main() {
      float ratio = sinCurve(vUV);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(3, 1, 0)
  return mesh
}

// 胶囊形状
const createMesh11 = () => {
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

    float lineDistance(vec2 position, vec2 direction) {
      return length(cross(vec3(position, 0.0), normalize(vec3(direction, 0.0))));
    }

    float capsule(vec2 position, vec2 start, vec2 end, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return 1.0 - smoothstep(0.0, 0.06, length(direction - line * h) - radius);
    }

    void main() {
      float ratio = capsule(vUV, vec2(0.2, 0.2), vec2(0.8, 0.8), 0.1);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-3, -1, 0)
  return mesh
}

// 椭圆
const createMesh12 = () => {
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

    float ellipse(vec2 position, vec2 range, float radius) {
      float distance = length(position / range);
      float ratio = smoothstep(radius, radius + 0.01, distance);
      // 反相
      return 1.0 - ratio;
    }

    void main() {
      float ratio = ellipse(vUV - vec2(0.5), vec2(0.7, 0.9), 0.5);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, -1, 0)
  return mesh
}

// 十字架
const createMesh13 = () => {
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

    float crucifix(vec2 position, vec2 center) {
      float ratio1 = rectangle(position, center, 1.0, 0.3);
      float ratio2 = rectangle(position, center, 0.3, 1.0);
      return max(ratio1, ratio2);
    }

    void main() {
      float ratio = crucifix(vUV, vec2(0.5));
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(0, -1, 0)
  return mesh
}

// 圆点环带
const createMesh14 = () => {
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

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    float pointShape(vec2 position, vec2 center) {
      float smoothness = 0.02;
      float distance = length(position - center);
      return smoothstep(0.03, 0.03 + smoothness, distance);
    }

    float points(vec2 position, int count) {
      float ratio = 1.0;
      // 旋转默认是绕原点进行的，将原点移至中心，此逻辑可以实现绕任意点旋转
      vec2 origin = position - vec2(0.5);
      // 旋转点，其x值表示圆的半径
      vec2 start = vec2(0.35, 0.0);
      for (int index = 0; index < count; index++) {
        vec2 center = start * rotate2D(radians(30.0 * float(index)));
        float current = pointShape(origin, center);
        ratio = min(ratio, current);
      }
      return 1.0 - ratio;
    }

    void main() {
      float ratio = points(vUV, 12);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(1.5, -1, 0)
  return mesh
}

// 多层渐变圆环
const createMesh15 = () => {
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

    void main() {
      float distance = length(vUV - vec2(0.5));
      // fract获取小数部分，可依据此实现边框向内部渐变并且周期性绘制
      float ratio = fract(10.0 * distance);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(3, -1, 0)
  return mesh
}

// 多层圆环1
const createMesh16 = () => {
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

    void main() {
      float distance = length(vUV - vec2(0.5));
      // fract获取小数部分，可依据此实现边框向内部渐变并且周期性绘制
      float ratio = fract(10.0 * distance);
      ratio = smoothstep(0.45, 0.5, ratio);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-3, -3, 0)
  return mesh
}

// 多层圆环2
const createMesh17 = () => {
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

    float circle(vec2 coord, float lineWidth) {
      float distance = length(coord - vec2(0.5));
      // fract处理的另一种逻辑
      float ratio = abs(fract(distance / lineWidth - 0.5) - 0.5) / fwidth(distance) * lineWidth / 2.0;
      return 1.0 - clamp(ratio, 0.0, 1.0);
    }

    void main() {
      float ratio = circle(vUV, 0.16);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(-1.5, -3, 0)
  return mesh
}

// 棋盘
const createMesh18 = () => {
  const vertexShader = `
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `
  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    varying vec2 vUV;

    vec3 checkerboard(vec2 position) {
      vec2 point = fract(position * 10.0);
      return ((point.x < 0.5) != (point.y < 0.5)) ? uColor1 : uColor2;
    }

    void main() {
      vec3 color = checkerboard(vUV);
      gl_FragColor = vec4(color, 1.0);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor1: {
        value: new THREE.Color('#BA55D3')
      },
      uColor2: {
        value: new THREE.Color('#fff')
      }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(0, -3, 0)
  return mesh
}

// 网格
const createMesh19 = () => {
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
    
    float grid(vec2 coord, float gridSize) {
      float wx = coord.x;
      float wy = coord.y;
      float x0 = abs(fract(wx / gridSize - 0.5) - 0.5) / fwidth(wx) * gridSize / 2.0;
      float z0 = abs(fract(wy / gridSize - 0.5) - 0.5) / fwidth(wy) * gridSize / 2.0;

      return 1.0 - clamp(min(x0, z0), 0.0, 1.0);
    }

    void main() {
      float ratio = grid(vUV, 0.1);
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
    transparent: true
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material)
  mesh.position.set(1.5, -3, 0)
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

  const mesh9 = createMesh9()
  scene.add(mesh9)

  const mesh10 = createMesh10()
  scene.add(mesh10)

  const mesh11 = createMesh11()
  scene.add(mesh11)

  const mesh12 = createMesh12()
  scene.add(mesh12)

  const mesh13 = createMesh13()
  scene.add(mesh13)

  const mesh14 = createMesh14()
  scene.add(mesh14)

  const mesh15 = createMesh15()
  scene.add(mesh15)

  const mesh16 = createMesh16()
  scene.add(mesh16)

  const mesh17 = createMesh17()
  scene.add(mesh17)

  const mesh18 = createMesh18()
  scene.add(mesh18)

  const mesh19 = createMesh19()
  scene.add(mesh19)

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
