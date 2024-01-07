import{O as A,ad as P,z as b,af as F,aE as v,u as p,ah as h,C as O}from"./three.module-b50c6fca.js";import{O as G}from"./OrbitControls-a97fbd6e.js";import{_ as L,r as w,o as V,a as W,b as j,c as z,d as q}from"./index-965901d4.js";const D={__name:"BasicShader",setup(H){let c=null;const i=w(null),l=w(null),x=()=>new P,g=n=>{const e=new b(45,n,1,1e3);return e.position.set(0,2,6),e.lookAt(0,0,0),e},C=(n,e)=>new G(n,e),S=(n,e,o)=>{const t=new F({canvas:n,antialias:!0});return t.setSize(e,o),t.setPixelRatio(window.devicePixelRatio),t},E=()=>{const n=`
    void main() {
      // 顶点坐标位置
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,e=`
    void main() {
      // 片元颜色
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,o=new v({vertexShader:n,fragmentShader:e}),t=new p(new h(1,1,1),o);return t.position.set(-1,0,0),t},M=()=>{const n=`
    void main() {
      // 顶点坐标位置
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,e=`
    // 全局属性就意味着在每个片元处理时都是相同值
    uniform vec3 u_color;

    void main() {
      // 片元颜色
      gl_FragColor = vec4(u_color, 1.0);
    }
  `,o=new v({uniforms:{u_color:{value:new O("#9932CC")}},vertexShader:n,fragmentShader:e}),t=new p(new h(1,1,1),o);return t.position.set(1,0,0),t};return V(()=>{const n=i.value,e=l.value,o=e.clientWidth,t=e.clientHeight,r=x(),m=g(o/t),a=S(n,o,t),y=C(m,a.domElement),B=E();r.add(B);const R=M();r.add(R);const d=()=>{y.update(),a.render(r,m),c=window.requestAnimationFrame(d)};d(),W(()=>{a.dispose(),a.forceContextLoss(),r.traverse(_=>{if(_ instanceof A){const{geometry:u,material:s}=_;u&&u.dispose();const k=Array.isArray(s)?s:[s];for(const f of k)f&&f.dispose()}}),window.cancelAnimationFrame(c)})}),(n,e)=>(j(),z("div",{ref_key:"containerElementRef",ref:l,class:"container"},[q("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},J=L(D,[["__scopeId","data-v-5c56f600"]]);export{J as default};
