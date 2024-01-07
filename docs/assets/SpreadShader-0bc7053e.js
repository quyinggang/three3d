import{O as F,ad as B,z as O,af as j,aE as c,C as l,u as d,aa as u,ag as G}from"./three.module-b50c6fca.js";import{O as L}from"./OrbitControls-a97fbd6e.js";import{_ as W,r as S,o as q,a as H,b as I,c as N,d as J}from"./index-965901d4.js";const K={__name:"SpreadShader",setup(Q){let f=null;const m=S(null),v=S(null),y=()=>new B,V=a=>{const e=new O(45,a,1,1e3);return e.position.set(0,0,6),e.lookAt(0,0,0),e},x=(a,e,t)=>{const o=new j({canvas:a,antialias:!0});return o.setSize(e,t),o.setPixelRatio(window.devicePixelRatio),o},U=(a,e)=>{const t=new L(a,e);return t.minDistance=2,t.maxDistance=40,t},T=()=>{const a=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float step = 0.02;
    const float endRadius = 0.48;
    const float start = 0.0;
    const float duration = 3.0;
    const float speed = endRadius / duration;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      // 利用梯度波形进行周期扩散
      float scale = speed * mod(uTime, duration);
      float targetRadius = start + scale;
      float diff = abs(length(vUV - center) - targetRadius);
      float opacity = diff <= step && targetRadius <= endRadius ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor, opacity);
    }

  `,t=new c({uniforms:{uColor:{value:new l("#DC143C")},uTime:{value:1}},vertexShader:a,fragmentShader:e,transparent:!0}),o=new d(new u(1,1,1),t);return o.position.set(-1.5,0,0),o},M=()=>{const a=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float size = 0.02;
    const float endRadius = 0.5 - size;
    const float start = 0.0;
    const float duration = 3.0;
    const float speed = endRadius / duration;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float distance = length(vUV - center);

      // 利用梯度波形进行周期扩散
      float scale = speed * mod(uTime, duration);
      float radius1 = start + scale;
      float diff1 = abs(distance - radius1);

      // 圆环1扩散一半时圆环2开始扩散
      float halfValue = endRadius * 0.5;
      float radius2 = radius1 >= halfValue ? radius1 - halfValue : radius1 + halfValue;
      float diff2 = abs(distance - radius2);

      bool isShowCircle1 = diff1 <= size && radius1 <= endRadius;
      bool isShowCircle2 = diff2 <= size && radius2 <= endRadius;

      float opacity = isShowCircle1 || isShowCircle2 ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor, opacity);
    }
  `,t=new c({uniforms:{uColor:{value:new l("#DC143C")},uTime:{value:1}},vertexShader:a,fragmentShader:e,transparent:!0});return new d(new u(1,1,1),t)},b=()=>{const a=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    const float size = 0.1;
    const float endRadius = 0.5 - size;
    const float start = 0.0;
    const float duration = 3.0;
    const float speed = endRadius / duration;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float distance = length(vUV - center);

      // 利用梯度波形进行周期扩散
      float scale = speed * mod(uTime, duration);
      float radius = start + scale;
      float diff = distance - radius;

      bool isShowCircle1 = abs(diff) <= size && radius <= endRadius;
      float opacity = isShowCircle1 ? 1.0 : 0.0;

      // 颜色渐变系数
      float ratio = mix(0.0, 1.0, diff / size);
      gl_FragColor = vec4(uColor * ratio, opacity);
    }
  `,t=new c({uniforms:{uColor:{value:new l("#DC143C")},uTime:{value:1}},vertexShader:a,fragmentShader:e,transparent:!0}),o=new d(new u(1,1,1),t);return o.position.set(1.5,0,0),o};return q(()=>{const a=m.value,e=v.value,t=e.clientWidth,o=e.clientHeight,s=y(),p=V(t/o),r=x(a,t,o),z=U(p,r.domElement),h=T();s.add(h);const w=M();s.add(w);const C=b();s.add(C);const E=h.material.uniforms,k=w.material.uniforms,P=C.material.uniforms,D=new G,g=()=>{z.update();const n=D.getElapsedTime();E.uTime.value=n,k.uTime.value=n,P.uTime.value=n,r.render(s,p),f=window.requestAnimationFrame(g)};g(),H(()=>{r.dispose(),r.forceContextLoss(),s.traverse(n=>{if(n instanceof F){const{geometry:_,material:i}=n;_&&_.dispose();const A=Array.isArray(i)?i:[i];for(const R of A)R&&R.dispose()}}),window.cancelAnimationFrame(f)})}),(a,e)=>(I(),N("div",{ref_key:"containerElementRef",ref:v,class:"container"},[J("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},$=W(K,[["__scopeId","data-v-f5893520"]]);export{$ as default};
