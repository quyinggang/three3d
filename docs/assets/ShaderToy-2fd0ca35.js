import{g as h,O as k,ad as B,E as P,af as b,aE as A,aW as E,aa as F,u as V,ag as G}from"./three.module-b50c6fca.js";import{_ as I,r as y,o as O,a as W,b as D,c as U,d as j}from"./index-965901d4.js";const q={__name:"ShaderToy",setup(z){const u=y(null),v=y(null),x=()=>new B,R=()=>new P(-1,1,1,-1,-1,1),C=(n,o,t)=>{const e=new b({canvas:n,antialias:!0});return e.setSize(o,t),e.setPixelRatio(window.devicePixelRatio),e},M=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,o=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      // 归一化坐标[0, 1]
      vec2 uv = fragCoord.xy / iResolution.xy;
      fragColor = vec4(vec3(uv.x, uv.y, 0.0), 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,t=new A({uniforms:{iResolution:{value:new h(0,0,1)},iMouse:{value:new E(0,0,0,0)},iTime:{value:0}},vertexShader:n,fragmentShader:o}),e=new F(2,2);return new V(e,t)},S=(n,o,t)=>{let e=!1;const r=a=>{if(!e)return;const l=a.clientX-o.left,s=a.clientY-o.top;t.iMouse.value=new E(l,s,0,0)},i=()=>{e=!1,window.removeEventListener("mousemove",r),window.removeEventListener("mouseup",i)};n.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",r),window.addEventListener("mouseup",i)})};return O(()=>{let n=null;const o=u.value,t=v.value,e=t.getBoundingClientRect(),r=e.width,i=e.height,a=x(),l=R(),s=C(o,r,i),f=M();a.add(f);const w=s.domElement,L=new G,d=f.material.uniforms;d.iResolution.value=new h(w.width,w.height,1);const _=()=>{const c=L.getElapsedTime();d.iTime.value=c,s.render(a,l),n=window.requestAnimationFrame(_)};S(t,e,d),_(),W(()=>{s.dispose(),s.forceContextLoss(),a.traverse(c=>{if(c instanceof k){const{geometry:g,material:m}=c;g&&g.dispose();const T=Array.isArray(m)?m:[m];for(const p of T)p&&p.dispose()}}),window.cancelAnimationFrame(n)})}),(n,o)=>(D(),U("div",{ref_key:"containerElementRef",ref:v,class:"container"},[j("canvas",{ref_key:"canvasElementRef",ref:u},null,512)],512))}},Y=I(q,[["__scopeId","data-v-042d1739"]]);export{Y as default};
