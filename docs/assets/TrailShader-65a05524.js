import{O as S,ad as R,z as T,af as k,aE as F,C as M,u as U,aa as V,ag as b}from"./three.module-b50c6fca.js";import{_ as A,r as p,o as P,a as B,b as I,c as G,d as L}from"./index-965901d4.js";const W={__name:"TrailShader",setup(z){let i=null;const l=p(null),m=p(null),_=()=>new R,h=n=>{const e=new T(45,n,1,1e3);return e.position.set(0,0,2),e.lookAt(0,0,0),e},x=(n,e,a)=>{const t=new k({canvas:n,antialias:!0});return t.setSize(e,a),t.setPixelRatio(window.devicePixelRatio),t},w=()=>{const n=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    float spot(vec2 coord, float index) {
      return 1.0 - smoothstep(0.0, index, length(coord));
    }

    void main() {
      vec2 center = vec2(0.5);
      float ratio = 0.0;
      int count = 50;
      // 由多个点构成拖尾效果，加入时间因素使其飘动
      for (int index = 1; index < count; index++) {
        float fIndex = float(index);
        float step = -uTime - fIndex * 0.01;
        vec2 point = vec2(sin(step * 3.0) / 3.0 * 0.45 + 0.5, sin(step * 2.0) / 2.0 * 0.45 + 0.5);
        ratio += spot(vUV - point, fIndex * 0.0005);
      }
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,a=new F({uniforms:{uColor:{value:new M("#00FFFF")},uTime:{value:0}},vertexShader:n,fragmentShader:e,transparent:!0});return new U(new V(1,1,1),a)};return P(()=>{const n=l.value,e=m.value,a=e.clientWidth,t=e.clientHeight,r=_(),g=h(a/t),s=x(n,a,t),d=w();r.add(d);const y=d.material.uniforms,C=new b,u=()=>{const o=C.getElapsedTime();y.uTime.value=o,s.render(r,g),i=window.requestAnimationFrame(u)};u(),B(()=>{s.dispose(),s.forceContextLoss(),r.traverse(o=>{if(o instanceof S){const{geometry:f,material:c}=o;f&&f.dispose();const E=Array.isArray(c)?c:[c];for(const v of E)v&&v.dispose()}}),window.cancelAnimationFrame(i)})}),(n,e)=>(I(),G("div",{ref_key:"containerElementRef",ref:m,class:"container"},[L("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},q=A(W,[["__scopeId","data-v-9ab15e24"]]);export{q as default};
