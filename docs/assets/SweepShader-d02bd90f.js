import{O as G,ad as z,z as O,af as q,aE as i,C as c,u as s,aa as l,ag as H}from"./three.module-b50c6fca.js";import{_ as N,r as x,o as J,a as K,b as Q,c as X,d as Y}from"./index-965901d4.js";const Z={__name:"SweepShader",setup($){let u=null;const m=x(null),f=x(null),V=()=>new z,C=t=>{const o=new O(45,t,1,1e3);return o.position.set(0,0,8),o.lookAt(0,0,0),o},U=(t,o,a)=>{const e=new q({canvas:t,antialias:!0});return e.setSize(o,a),e.setPixelRatio(window.devicePixelRatio),e},y=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      // 计算当前坐标对应的角度大小，然后加上旋转增加的角度
      // 取模表示每隔多少角度就切分扇形，360表示1个，180表示2个...
      float rad = mod(atan(coord.y, coord.x) + angle, PI / 1.5);
      if (distance <= radius) {
        ratio = 1.0 - rad;
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime / 2.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new i({uniforms:{uColor:{value:new c("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new l(1,1,1),a);return e.position.set(-1.5,1,0),e},T=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      // 计算当前坐标对应的角度大小，然后加上旋转增加的角度
      // 取模表示每隔多少角度就切分扇形，360表示1个，180表示2个...
      float rad = mod(atan(coord.y, coord.x) + angle, PI / 1.5);
      if (distance <= radius) {
        // 更改扇区颜色渐变值
        ratio = 1.0 - clamp(rad * 0.5, 0.0, 1.0);
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, 0.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new i({uniforms:{uColor:{value:new c("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new l(1,1,1),a);return e.position.set(0,1,0),e},M=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      if (distance <= radius) {
        float rad = mod(atan(coord.y, coord.x) + angle, PI * 2.0);
        ratio = 1.0 - rad;
      }
      return ratio;
    }

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return 1.0 - smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float rotateLine(vec2 coord, float radius) {
      vec2 center = vec2(0.5);
      vec2 lineEnd = vec2(radius, 0) * rotate2D(-uTime);
      float lineRatio = straightLine(coord - center, vec2(0.0), lineEnd, 0.01, 0.0);
      float sectorRatio = sectorShape(coord - center, radius, uTime);
      return lineRatio + sectorRatio;
    }

    void main() {
      float ratio = rotateLine(vUV, 0.4);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new i({uniforms:{uColor:{value:new c("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new l(1,1,1),a);return e.position.set(1.5,1,0),e},P=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      float rad = mod(atan(coord.y, coord.x) + angle, PI * 2.0);
      if (distance <= radius && distance >= radius - 0.02) {
        ratio = 1.0 - rad;
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new i({uniforms:{uColor:{value:new c("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new l(1,1,1),a);return e.position.set(-1.5,-1,0),e},I=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      float rad = mod(atan(coord.y, coord.x) + angle, PI / 1.5);
      if (distance <= radius) {
        ratio = 1.0 - smoothstep(0.9, 0.95, rad);
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime / 2.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new i({uniforms:{uColor:{value:new c("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new l(1,1,1),a);return e.position.set(-0,-1,0),e},R=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926535897932384626433832795;

    // 扇形区域
    float sectorShape(vec2 coord, float radius, float angle) {
      float ratio = 0.0;
      float distance = length(coord);
      float rad = atan(coord.y, coord.x);
      if (distance <= radius) {
        ratio = smoothstep(-0.3, -0.35, rad) + smoothstep(0.3, 0.35, rad);
      }
      return ratio;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float ratio = sectorShape(vUV - center, 0.4, uTime / 2.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new i({uniforms:{uColor:{value:new c("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new s(new l(1,1,1),a);return e.position.set(1.5,-1,0),e};return J(()=>{const t=m.value,o=f.value,a=o.clientWidth,e=o.clientHeight,r=V(),E=C(a/e),d=U(t,a,e),h=y();r.add(h);const k=T();r.add(k);const p=M();r.add(p);const g=P();r.add(g);const L=I();r.add(L);const w=R();r.add(w);const j=h.material.uniforms,A=p.material.uniforms,W=g.material.uniforms,B=w.material.uniforms,b=new H,_=()=>{const n=b.getElapsedTime();j.uTime.value=n,A.uTime.value=n,W.uTime.value=n,B.uTime.value=n,d.render(r,E),u=window.requestAnimationFrame(_)};_(),K(()=>{d.dispose(),d.forceContextLoss(),r.traverse(n=>{if(n instanceof G){const{geometry:S,material:v}=n;S&&S.dispose();const D=Array.isArray(v)?v:[v];for(const F of D)F&&F.dispose()}}),window.cancelAnimationFrame(u)})}),(t,o)=>(Q(),X("div",{ref_key:"containerElementRef",ref:f,class:"container"},[Y("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},te=N(Z,[["__scopeId","data-v-ea2ae764"]]);export{te as default};
