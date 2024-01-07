import{O as R,ad as A,z as O,af as b,aE as h,C as s,q as k,u as _,ah as w}from"./three.module-b50c6fca.js";import{O as B}from"./OrbitControls-a97fbd6e.js";import{_ as D,r as S,o as G,a as I,b as L,c as W,d as j}from"./index-965901d4.js";const q={__name:"StepShader",setup(z){let c=null;const l=S(null),m=S(null),g=()=>new A,C=o=>{const e=new O(45,o,1,1e3);return e.position.set(0,0,6),e.lookAt(0,0,0),e},x=(o,e,t)=>{const n=new b({canvas:o,antialias:!0});return n.setSize(e,t),n.setPixelRatio(window.devicePixelRatio),n},E=(o,e)=>{const t=new B(o,e);return t.minDistance=6,t.maxDistance=40,t.minPolarAngle=Math.PI/4,t.maxPolarAngle=Math.PI/2*.96,t},P=()=>{const o=`
      varying vec2 vUV;
		  void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `,e=`
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;

      varying vec2 vUV;

      const float radius = 0.3;

			void main() {
        bool isOuter = step(length(vUV - vec2(0.5)), radius) == 0.0;
        // 可以根据条件判断是否丢弃片元，可以实现掏空效果
        // if (isOuter) discard;
        gl_FragColor = vec4(isOuter ? uStartColor : uEndColor, 1.0);
			}
  `,t=new h({uniforms:{uStartColor:{value:new s("#FF0000")},uEndColor:{value:new s("#0000ff")}},vertexShader:o,fragmentShader:e,side:k}),n=new _(new w(1,1,1),t);return n.position.set(-1,0,0),n},y=()=>{const o=`
      varying vec2 vUV;
		  void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `,e=`
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;

      varying vec2 vUV;

			void main() {
        float distance = length(vUV - vec2(0.5));
        // 单个smoothstep函数的波形是[0, 1]范围的上升波形
        float s1 = smoothstep(0.2, 0.3, distance);
        float s2 = smoothstep(0.3, 0.4, distance);
        // 两个smoothstep运算就比较有意思，通过此波形可以实现圆环效果
        gl_FragColor = vec4(uStartColor * (s1 - s2), 1.0);
			}
  `,t=new h({uniforms:{uStartColor:{value:new s("#FF0000")},uEndColor:{value:new s("#0000ff")}},vertexShader:o,fragmentShader:e}),n=new _(new w(1,1,1),t);return n.position.set(1,0,0),n};return G(()=>{const o=l.value,e=m.value,t=e.clientWidth,n=e.clientHeight,a=g(),d=C(t/n),r=x(o,t,n),M=E(d,r.domElement),V=P();a.add(V);const U=y();a.add(U);const v=()=>{M.update(),r.render(a,d),c=window.requestAnimationFrame(v)};v(),I(()=>{r.dispose(),r.forceContextLoss(),a.traverse(u=>{if(u instanceof R){const{geometry:f,material:i}=u;f&&f.dispose();const F=Array.isArray(i)?i:[i];for(const p of F)p&&p.dispose()}}),window.cancelAnimationFrame(c)})}),(o,e)=>(L(),W("div",{ref_key:"containerElementRef",ref:m,class:"container"},[j("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},K=D(q,[["__scopeId","data-v-70127a93"]]);export{K as default};
