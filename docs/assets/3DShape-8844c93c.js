import{g,O as A,ad as B,z as L,af as T,aa as b,u as D,aW as h,aE as F,ag as V}from"./three.module-8f39f104.js";import{_ as G,r as x,o as W,a as z,b as O,c as j,d as q}from"./index-b3ad2289.js";const I={__name:"3DShape",setup(N){const u=x(null),d=x(null),R=()=>new B,E=e=>{const n=new L(45,e,.1,100);return n.position.set(0,0,.1),n.lookAt(0,0,0),n},y=(e,n,v)=>{const t=new T({canvas:e,antialias:!0});return t.setSize(n,v),t.setPixelRatio(window.devicePixelRatio),t},M=()=>{const e=`
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
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  `;return new F({uniforms:{iResolution:{value:new g(0,0,1)},iMouse:{value:new h(0,0,0,0)},iTime:{value:0}},vertexShader:e,fragmentShader:n})},S=()=>{const e=M(),n=new b(2,2);return new D(n,e)};return W(()=>{let e=null;const n=u.value,t=d.value.getBoundingClientRect(),r=t.width,c=t.height,i=R(),k=E(r/c),l=y(n,r,c),f=S();i.add(f);const C=new V,m=f.material.uniforms;m.iResolution.value=new g(r,c,1);const _=()=>{const o=C.getElapsedTime();m.iTime.value=o,l.render(i,k),e=window.requestAnimationFrame(_)},p=o=>{const s=o.clientX-t.left,a=o.clientY-t.top;m.iMouse.value=new h(s,a,0,0)};window.addEventListener("mousemove",p),_(),z(()=>{l.dispose(),l.forceContextLoss(),i.traverse(o=>{if(o instanceof A){const{geometry:s,material:a}=o;s&&s.dispose();const P=Array.isArray(a)?a:[a];for(const w of P)w&&w.dispose()}}),window.cancelAnimationFrame(e),window.removeEventListener("mousemove",p)})}),(e,n)=>(O(),j("div",{ref_key:"containerElementRef",ref:d,class:"container"},[q("canvas",{ref_key:"canvasElementRef",ref:u},null,512)],512))}},Y=G(I,[["__scopeId","data-v-e4933372"]]);export{Y as default};
