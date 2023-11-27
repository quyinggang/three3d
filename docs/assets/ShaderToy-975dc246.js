import{g,O as C,ad as P,z as A,af as B,aE as L,aW as h,aa as b,u as F,ag as V}from"./three.module-8f39f104.js";import{_ as G,r as y,o as W,a as z,b as O,c as j,d as q}from"./index-b3ad2289.js";const D={__name:"ShaderToy",setup(I){const d=y(null),v=y(null),x=()=>new P,R=e=>{const n=new A(45,e,.1,100);return n.position.set(0,0,.1),n.lookAt(0,0,0),n},E=(e,n,s)=>{const o=new B({canvas:e,antialias:!0});return o.setSize(n,s),o.setPixelRatio(window.devicePixelRatio),o},M=()=>{const e=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,n=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    void main() {
      // 转换坐标至[0, 1]
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);
    }
  `,s=new L({uniforms:{iResolution:{value:new g(0,0,1)},iMouse:{value:new h(0,0,0,0)},iTime:{value:0}},vertexShader:e,fragmentShader:n}),o=new b(2,2);return new F(o,s)};return W(()=>{let e=null;const n=d.value,o=v.value.getBoundingClientRect(),c=o.width,i=o.height,l=x(),S=R(c/i),m=E(n,c,i),f=M();l.add(f);const T=new V,u=f.material.uniforms;u.iResolution.value=new g(c,i,1);const _=()=>{const t=T.getElapsedTime();u.iTime.value=t,m.render(l,S),e=window.requestAnimationFrame(_)},w=t=>{const r=t.clientX-o.left,a=t.clientY-o.top;u.iMouse.value=new h(r,a,0,0)};window.addEventListener("mousemove",w),_(),z(()=>{m.dispose(),m.forceContextLoss(),l.traverse(t=>{if(t instanceof C){const{geometry:r,material:a}=t;r&&r.dispose();const k=Array.isArray(a)?a:[a];for(const p of k)p&&p.dispose()}}),window.cancelAnimationFrame(e),window.removeEventListener("mousemove",w)})}),(e,n)=>(O(),j("div",{ref_key:"containerElementRef",ref:v,class:"container"},[q("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},X=G(D,[["__scopeId","data-v-71c91eae"]]);export{X as default};
