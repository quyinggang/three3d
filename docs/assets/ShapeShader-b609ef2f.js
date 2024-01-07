import{O as me,ad as ue,z as fe,af as pe,aE as a,C as i,u as s,aa as c}from"./three.module-b50c6fca.js";import{_ as he,r as x,o as ge,a as xe,b as we,c as Ve,d as ye}from"./index-965901d4.js";const Ce={__name:"ShapeShader",setup(Ue){let d=null;const m=x(null),u=x(null),w=()=>new ue,V=t=>{const o=new fe(45,t,1,1e3);return o.position.set(0,0,14),o.lookAt(0,0,0),o},y=(t,o,n)=>{const e=new pe({canvas:t,antialias:!0});return e.setSize(o,n),e.setPixelRatio(window.devicePixelRatio),e},C=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-3,3,0),e},U=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-1.5,3,0),e},_=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float cirque(vec2 position, vec2 center, float outerRadius, float innerRadius) {
      float step = 0.01;
      float distance = length(position - center);
      float outerCircle = smoothstep(outerRadius, outerRadius + step, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + step, distance);
      return abs(outerCircle - innerCircle);
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = cirque(vUV, center, 0.4, 0.45);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(0,3,0),e},M=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    // 正方体
    float boxDistance( in vec3 p, in vec3 b )  {
      vec3 q = abs(p) - b;
      return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float sdOrientedBox( in vec2 p, in vec2 a, in vec2 b, float th ) {
      float l = length(b-a);
      vec2  d = (b-a)/l;
      vec2  q = p-(a+b)*0.5;
            q = mat2(d.x,-d.y,d.y,d.x)*q;
            q = abs(q)-vec2(l*0.5,th);
      return length(max(q,0.0)) + min(max(q.x,q.y),0.0);    
    }

    void main() {
      float d = sdOrientedBox(vUV, vec2(0.1, 0.5), vec2(0.6, 0.5), 0.25);
      vec3 color = vec3(0.0) - sign(d) * uColor;
      color = mix(color, vec3(0.0), 1.0 - smoothstep(0.0,0.015, abs(d)));
      gl_FragColor = vec4(color, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(1.5,3,0),e},S=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float sdParallelogram( in vec2 p, float wi, float he, float sk ) {
      vec2 e = vec2(sk,he);
      p = (p.y<0.0)?-p:p;
      vec2  w = p - e; w.x -= clamp(w.x,-wi,wi);
      vec2  d = vec2(dot(w,w), -w.y);
      float s = p.x*e.y - p.y*e.x;
      p = (s<0.0)?-p:p;
      vec2  v = p - vec2(wi,0); v -= e*clamp(dot(v,e)/dot(e,e),-1.0,1.0);
      d = min( d, vec2(dot(v,v), wi*he-abs(s)));
      return sqrt(d.x)*sign(-d.y);
    }

    void main() {
      float d = sdParallelogram(vUV - vec2(0.5), 0.2, 0.3, 0.1);
      vec3 color = d > 0.0 ? vec3(0.0) : uColor;
      color = mix(color, uColor, 1.0 - smoothstep(0.0,0.01, abs(d)) );
      gl_FragColor = vec4(color, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(3,3,0),e},b=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float sdSegment(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p-a, ba = b-a;
      float h = clamp( dot(pa,ba) / dot(ba,ba), 0.0, 1.0 );
      return length( pa - ba * h );
    }

    void main() {
      float lineWidth = 0.03;
      float d = sdSegment(vUV, vec2(0.1, 0.8), vec2(0.8, 0.2));
      vec3 color = vec3(0.0) - sign(d) * uColor;
      color = mix(color, uColor, 1.0 - smoothstep(0.0, lineWidth, abs(d)));
      gl_FragColor = vec4(color, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-3,1,0),e},P=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float polyline(vec2 position, vec2 points[4]) {
      float ratio = 1.0;
      int len = points.length();
      for (int index = 0; index < len - 1; index++) {
        vec2 current = points[index];
        vec2 next = points[index + 1];
        float result = straightLine(vUV, current, next, 0.03, 0.0);
        // 使用min取最小值可以处理线段重叠处颜色
        ratio = min(ratio, result);
      }
      return 1.0 - ratio;
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-1.5,1,0),e},z=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float triangle(vec2 position, vec2 start, vec2 middle, vec2 end) {
      float ratio = 1.0;
      float smoothness = 0.03;
      float ratio1 = straightLine(position, start, middle, 0.03, 0.0);
      float ratio2 = straightLine(position, middle, end, 0.03, 0.0);
      float ratio3 = straightLine(position, start, end, 0.03, 0.0);

      return 1.0 - min(ratio1, min(ratio2, ratio3));
    }

    void main() {
      float ratio = triangle(vUV, vec2(0.1, 0.3), vec2(0.3, 0.8), vec2(0.8, 0.3));
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(0,1,0),e},A=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(1.5,1,0),e},B=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(3,1,0),e},D=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-3,-1,0),e},F=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-1.5,-1,0),e},j=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(0,-1,0),e},W=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(1.5,-1,0),e},q=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    void main() {
      float distance = length(vUV - vec2(0.5));
      // fract获取小数部分，可依据此实现边框向内部渐变并且周期性绘制
      float ratio = fract(10.0 * distance);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(3,-1,0),e},k=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    void main() {
      float distance = length(vUV - vec2(0.5));
      // fract获取小数部分，可依据此实现边框向内部渐变并且周期性绘制
      float ratio = fract(10.0 * distance);
      ratio = smoothstep(0.45, 0.5, ratio);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-3,-3,0),e},R=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-1.5,-3,0),e},E=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor1:{value:new i("#BA55D3")},uColor2:{value:new i("#fff")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(0,-3,0),e},I=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
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
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(1.5,-3,0),e},L=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718

    // 判断点到直线的距离，也可以通过三次边处理来构建三角形
    float lineDistance(vec2 coord, vec2 start, vec2 end) {
      vec3 line = vec3(start - end, 0.0);
      vec3 pointEnd = vec3(coord - end, 0.0);
      // 叉乘的结果是一个新向量，被称为法向量，其垂直于两个向量所在平面，其方向的判断使用右手定则
      // 三维向量这意味着z值可能是负值，z值就是coord距离line的距离
      // z值大小 = length(叉乘值)，但是z值存在负值
      return cross(pointEnd, normalize(line)).z;
    }

    float triangle(vec2 st, vec2 start, vec2 middle, vec2 end, float smoothness) {
      
      vec3 e0, e1, e2;
      e0.xy = normalize(end - start).yx * vec2(1.0, -1.0);
      e1.xy = normalize(middle - end).yx * vec2(1.0, -1.0);
      e2.xy = normalize(start - middle).yx * vec2(1.0, -1.0);
      
      e0.z = dot(e0.xy, start) - smoothness;
      e1.z = dot(e1.xy, end) - smoothness;
      e2.z = dot(e2.xy, middle) - smoothness;
      
      float a = max(0.0, dot(e0.xy, st) - e0.z);
      float b = max(0.0, dot(e1.xy, st) - e1.z);
      float c = max(0.0, dot(e2.xy, st) - e2.z);
      return smoothstep(smoothness * 2.0, 1e-7, length(vec3(a, b, c)));
    }

    float triangle2(vec2 coord, int number, float size) {
      float a = atan(coord.x, coord.y) + PI;
      float r = TWO_PI/float(number);
      float distance = cos(floor(.5+a/r)*r-a)*length(coord);
      return 1.0 - smoothstep(size, size + 0.01, distance);
    }

    void main() {
      float ratio = triangle(vUV, vec2(0.0, 0.3), vec2(0.8, 0.8), vec2(0.6, 0.4), 0.001);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(3,-3,0),e},O=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;

    varying vec2 vUV;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718

    float regularPolygon(vec2 coord, int number, float size) {
      float a = atan(coord.x, coord.y) + PI;
      float r = TWO_PI/float(number);
      float distance = cos(floor(.5+a/r)*r-a)*length(coord);
      return 1.0 - smoothstep(size, size + 0.01, distance);
    }

    void main() {
      float ratio = regularPolygon(vUV - vec2(0.5), 6, 0.4);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new a({uniforms:{uColor:{value:new i("#BA55D3")}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-3,-5,0),e};return ge(()=>{const t=m.value,o=u.value,n=o.clientWidth,e=o.clientHeight,r=w(),X=V(n/e),l=y(t,n,e),Y=C();r.add(Y);const T=U();r.add(T);const H=_();r.add(H);const G=M();r.add(G);const N=S();r.add(N);const J=b();r.add(J);const K=P();r.add(K);const Q=z();r.add(Q);const Z=A();r.add(Z);const $=B();r.add($);const ee=D();r.add(ee);const oe=F();r.add(oe);const te=j();r.add(te);const ne=W();r.add(ne);const re=q();r.add(re);const ie=k();r.add(ie);const ae=R();r.add(ae);const se=E();r.add(se);const ce=I();r.add(ce);const le=L();r.add(le);const ve=O();r.add(ve);const f=()=>{l.render(r,X),d=window.requestAnimationFrame(f)};f(),xe(()=>{l.dispose(),l.forceContextLoss(),r.traverse(p=>{if(p instanceof me){const{geometry:h,material:v}=p;h&&h.dispose();const de=Array.isArray(v)?v:[v];for(const g of de)g&&g.dispose()}}),window.cancelAnimationFrame(d)})}),(t,o)=>(we(),Ve("div",{ref_key:"containerElementRef",ref:u,class:"container"},[ye("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},Se=he(Ce,[["__scopeId","data-v-4bf4778f"]]);export{Se as default};
