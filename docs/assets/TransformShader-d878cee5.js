import{O as W,ad as L,z as H,af as q,aE as s,C as i,u as l,aa as c,ag as z}from"./three.module-b50c6fca.js";import{_ as D,r as R,o as j,a as B,b as G,c as O,d as I}from"./index-965901d4.js";const N={__name:"TransformShader",setup(J){let u=null;const d=R(null),v=R(null),y=()=>new L,k=o=>{const t=new H(45,o,1,1e3);return t.position.set(0,0,10),t.lookAt(0,0,0),t},F=(o,t,a)=>{const e=new q({canvas:o,antialias:!0});return e.setSize(t,a),e.setPixelRatio(window.devicePixelRatio),e},T=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uCircleColor;
    uniform vec3 uLineColor;
    uniform float uTime;

    varying vec2 vUV;

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    float cirque(vec2 coord, float outerRadius, float innerRadius) {
      float smoothness = 0.01;
      float distance = length(coord);
      float outerCircle = smoothstep(outerRadius, outerRadius + smoothness, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + smoothness, distance);
      return abs(outerCircle - innerCircle);
    }

    float straightLine(vec2 position, vec2 start, vec2 end, float lineWidth, float radius) {
      vec2 direction = position - start;
      vec2 line = end - start;
      float h = clamp(dot(direction, line) / dot(line, line), 0.0, 1.0 );
      return 1.0 - smoothstep(0.0, lineWidth, length(direction - line * h) - radius);
    }

    float rotateLine(vec2 coord, float radius) {
      vec2 center = vec2(0.5);
      // 旋转矩阵应用
      vec2 lineEnd = vec2(radius, 0.0) * rotate2D(-uTime / 2.0);
      // 以center为旋转中心
      return straightLine(coord - center, vec2(0.0), lineEnd, 0.03, 0.001);
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float circleRatio = cirque(vUV - center, 0.46, 0.48);
      float lineRatio = rotateLine(vUV, 0.4);
      vec3 color = circleRatio * uCircleColor + lineRatio * uLineColor;
      gl_FragColor = vec4(color, 1.0);
    }
  `,a=new s({uniforms:{uCircleColor:{value:new i("#00FFFF")},uLineColor:{value:new i("#FF0000")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new l(new c(1,1,1),a);return e.position.set(-3,0,0),e},U=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    float rectangle(vec2 position, vec2 center, float width, float height) {
      float halfWidth = width * 0.5;
      float halfHeight = height * 0.5;
      float step = 0.01;
      float leftX = center.x - halfWidth;
      float rightX = center.x + halfWidth;
      float topY = center.y + halfHeight;
      float bottomY = center.y - halfHeight;

      float left = smoothstep(leftX, leftX + step, position.x);
      float right = smoothstep(rightX, rightX + step, position.x);
      float top = smoothstep(topY, topY + step, position.y);
      float bottom = smoothstep(bottomY, bottomY - step, position.y);

      return left - right - top - bottom;
    }

    void main() {
      vec2 translate = vec2(sin(uTime) * 0.25, cos(uTime) * 0.25);
      float ratio = rectangle(vUV + translate, vec2(0.5), 0.3, 0.2);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new s({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new l(new c(1,1,1),a);return e.position.set(-1,0,0),e},V=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    mat2 scale2D(float scaleX, float scaleY) {
      return mat2(scaleX, 0.0, 0.0, scaleY);
    }

    float cirque(vec2 position, vec2 center, float outerRadius, float innerRadius) {
      float step = 0.01;
      float distance = length(position - center);
      float outerCircle = smoothstep(outerRadius, outerRadius + step, distance);
      float innerCircle = smoothstep(innerRadius, innerRadius + step, distance);
      return abs(outerCircle - innerCircle);
    }

    void main() {
      float scale = abs(sin(uTime)) * 2.0;
      vec2 size = vec2(0.16, 0.18) * scale2D(scale, scale);
      float ratio = cirque(vUV, vec2(0.5), size.x, size.y);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new s({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new l(new c(1,1,1),a);return e.position.set(1,0,0),e},X=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

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
      float skewXAngle = sin(uTime) * -15.0;
      float ratio = parallelogram(vUV, vec2(0.5), 0.66, 0.8, skewXAngle, 0.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new s({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new l(new c(1,1,1),a);return e.position.set(3,0,0),e};return j(()=>{const o=d.value,t=v.value,a=t.clientWidth,e=t.clientHeight,r=y(),Y=k(a/e),m=F(o,a,e),h=T();r.add(h);const p=U();r.add(p);const g=V();r.add(g);const w=X();r.add(w);const M=h.material.uniforms,b=p.material.uniforms,S=g.material.uniforms,P=w.material.uniforms,A=new z,C=()=>{const n=A.getElapsedTime();M.uTime.value=n,b.uTime.value=n,S.uTime.value=n,P.uTime.value=n,m.render(r,Y),u=window.requestAnimationFrame(C)};C(),B(()=>{m.dispose(),m.forceContextLoss(),r.traverse(n=>{if(n instanceof W){const{geometry:_,material:f}=n;_&&_.dispose();const E=Array.isArray(f)?f:[f];for(const x of E)x&&x.dispose()}}),window.cancelAnimationFrame(u)})}),(o,t)=>(G(),O("div",{ref_key:"containerElementRef",ref:v,class:"container"},[I("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},Z=D(N,[["__scopeId","data-v-9041f88d"]]);export{Z as default};
