import{g,O as k,ad as B,E as L,af as P,aE as A,aW as p,aa as F,u as V,ag as G}from"./three.module-8f39f104.js";import{_ as I,r as h,o as O,a as W,b as j,c as q,d as z}from"./index-af97948e.js";const D={__name:"ShaderToy",setup(N){const m=h(null),d=h(null),y=()=>new B,x=()=>new L(-1,1,1,-1,-1,1),E=(n,a,r)=>{const e=new P({canvas:n,antialias:!0});return e.setSize(a,r),e.setPixelRatio(window.devicePixelRatio),e},R=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,a=`
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
  `,r=new A({uniforms:{iResolution:{value:new g(0,0,1)},iMouse:{value:new p(0,0,0,0)},iTime:{value:0}},vertexShader:n,fragmentShader:a}),e=new F(2,2);return new V(e,r)};return O(()=>{let n=null;const a=m.value,e=d.value.getBoundingClientRect(),C=e.width,M=e.height,c=y(),S=x(),s=E(a,C,M),u=R();c.add(u);const v=s.domElement,T=new G,l=u.material.uniforms;l.iResolution.value=new g(v.width,v.height,1);const f=()=>{const o=T.getElapsedTime();l.iTime.value=o,s.render(c,S),n=window.requestAnimationFrame(f)},_=o=>{const i=o.clientX-e.left,t=o.clientY-e.top;l.iMouse.value=new p(i,t,0,0)};window.addEventListener("mousemove",_),f(),W(()=>{s.dispose(),s.forceContextLoss(),c.traverse(o=>{if(o instanceof k){const{geometry:i,material:t}=o;i&&i.dispose();const b=Array.isArray(t)?t:[t];for(const w of b)w&&w.dispose()}}),window.cancelAnimationFrame(n),window.removeEventListener("mousemove",_)})}),(n,a)=>(j(),q("div",{ref_key:"containerElementRef",ref:d,class:"container"},[z("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},Y=I(D,[["__scopeId","data-v-be93620f"]]);export{Y as default};
