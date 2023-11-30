import{g as _,O as L,ad as k,E as G,af as B,aE as P,aW as h,aa as T,u as A,ag as F}from"./three.module-8f39f104.js";import{_ as V,r as y,o as I,a as O,b as W,c as D,d as U}from"./index-7b8941a7.js";const j={__name:"Grid",setup(q){const m=y(null),v=y(null),E=()=>new k,R=()=>new G(-1,1,1,-1,-1,1),b=(o,n,t)=>{const e=new B({canvas:o,antialias:!0});return e.setSize(n,t),e.setPixelRatio(window.devicePixelRatio),e},C=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,n=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    vec3 grid(vec2 uv, float gridSize) {
      float wx = uv.x;
      float wy = uv.y;
      float x0 = abs(fract(wx / gridSize - 0.5) - 0.5) / fwidth(wx) * gridSize / 2.0;
      float z0 = abs(fract(wy / gridSize - 0.5) - 0.5) / fwidth(wy) * gridSize / 2.0;

      float val = 1.0 - clamp(min(x0, z0), 0.0, 1.0);

      vec3 color = val * vec3(0.3);

      // x axis
      color = mix(vec3(1.0, 0.0, 0.0), color, smoothstep(0.0, 2.0 * fwidth(uv.x), abs(uv.y)));
      // y axis
      color = mix(vec3(0.0, 1.0, 0.0), color, smoothstep(0.0, 2.0 * fwidth(uv.y), abs(uv.x)));
      return color;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      // 归一化坐标[0, 1]
      // vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec3 color = grid(uv, 0.5);
      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,t=new P({uniforms:{iResolution:{value:new _(0,0,1)},iMouse:{value:new h(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:n}),e=new T(2,2);return new A(e,t)},M=(o,n,t)=>{let e=!1;const s=a=>{if(!e)return;const l=a.clientX-n.left,r=a.clientY-n.top;t.iMouse.value=new h(l,r,0,0)},i=()=>{e=!1,window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",i)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",s),window.addEventListener("mouseup",i)})};return I(()=>{let o=null;const n=m.value,t=v.value,e=t.getBoundingClientRect(),s=e.width,i=e.height,a=E(),l=R(),r=b(n,s,i),f=C();a.add(f);const w=r.domElement,S=new F,d=f.material.uniforms;d.iResolution.value=new _(w.width,w.height,1);const g=()=>{const c=S.getElapsedTime();d.iTime.value=c,r.render(a,l),o=window.requestAnimationFrame(g)};M(t,e,d),g(),O(()=>{r.dispose(),r.forceContextLoss(),a.traverse(c=>{if(c instanceof L){const{geometry:x,material:u}=c;x&&x.dispose();const z=Array.isArray(u)?u:[u];for(const p of z)p&&p.dispose()}}),window.cancelAnimationFrame(o)})}),(o,n)=>(W(),D("div",{ref_key:"containerElementRef",ref:v,class:"container"},[U("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},Y=V(j,[["__scopeId","data-v-b1b89df3"]]);export{Y as default};
