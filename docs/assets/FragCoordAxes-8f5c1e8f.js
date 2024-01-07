import{g as _,O as L,ad as A,E as F,af as k,aE as B,aW as h,aa as P,u as T,ag as V}from"./three.module-b50c6fca.js";import{_ as G,r as y,o as I,a as O,b as W,c as D,d as U}from"./index-965901d4.js";const X={__name:"FragCoordAxes",setup(j){const m=y(null),v=y(null),E=()=>new A,R=()=>new F(-1,1,1,-1,-1,1),C=(o,n,t)=>{const e=new k({canvas:o,antialias:!0});return e.setSize(n,t),e.setPixelRatio(window.devicePixelRatio),e},M=()=>{const o=`
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
      // fwidth(uv.x)可以认为是一个X轴方向上1个像素的大小
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
  `,t=new B({uniforms:{iResolution:{value:new _(0,0,1)},iMouse:{value:new h(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:n}),e=new P(2,2);return new T(e,t)},S=(o,n,t)=>{let e=!1;const s=a=>{if(!e)return;const l=a.clientX-n.left,r=a.clientY-n.top;t.iMouse.value=new h(l,r,0,0)},i=()=>{e=!1,window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",i)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",s),window.addEventListener("mouseup",i)})};return I(()=>{let o=null;const n=m.value,t=v.value,e=t.getBoundingClientRect(),s=e.width,i=e.height,a=E(),l=R(),r=C(n,s,i),f=M();a.add(f);const w=r.domElement,b=new V,d=f.material.uniforms;d.iResolution.value=new _(w.width,w.height,1);const g=()=>{const c=b.getElapsedTime();d.iTime.value=c,r.render(a,l),o=window.requestAnimationFrame(g)};S(t,e,d),g(),O(()=>{r.dispose(),r.forceContextLoss(),a.traverse(c=>{if(c instanceof L){const{geometry:x,material:u}=c;x&&x.dispose();const z=Array.isArray(u)?u:[u];for(const p of z)p&&p.dispose()}}),window.cancelAnimationFrame(o)})}),(o,n)=>(W(),D("div",{ref_key:"containerElementRef",ref:v,class:"container"},[U("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},Y=G(X,[["__scopeId","data-v-2c49aec9"]]);export{Y as default};
