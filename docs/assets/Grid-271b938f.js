import{g as x,O as k,ad as G,E as B,af as L,aE as P,aW as _,aa as T,u as A,ag as F}from"./three.module-8f39f104.js";import{_ as V,r as p,o as I,a as O,b as W,c as j,d as q}from"./index-f7a3d314.js";const D={__name:"Grid",setup(N){const d=p(null),m=p(null),h=()=>new G,y=()=>new B(-1,1,1,-1,-1,1),R=(o,t,r)=>{const e=new L({canvas:o,antialias:!0});return e.setSize(t,r),e.setPixelRatio(window.devicePixelRatio),e},E=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,t=`
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
  `,r=new P({uniforms:{iResolution:{value:new x(0,0,1)},iMouse:{value:new _(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:t}),e=new T(2,2);return new A(e,r)};return I(()=>{let o=null;const t=d.value,e=m.value.getBoundingClientRect(),b=e.width,C=e.height,c=h(),S=y(),i=R(t,b,C),u=E();c.add(u);const v=i.domElement,M=new F,l=u.material.uniforms;l.iResolution.value=new x(v.width,v.height,1);const f=()=>{const n=M.getElapsedTime();l.iTime.value=n,i.render(c,S),o=window.requestAnimationFrame(f)},w=n=>{const s=n.clientX-e.left,a=n.clientY-e.top;l.iMouse.value=new _(s,a,0,0)};window.addEventListener("mousemove",w),f(),O(()=>{i.dispose(),i.forceContextLoss(),c.traverse(n=>{if(n instanceof k){const{geometry:s,material:a}=n;s&&s.dispose();const z=Array.isArray(a)?a:[a];for(const g of z)g&&g.dispose()}}),window.cancelAnimationFrame(o),window.removeEventListener("mousemove",w)})}),(o,t)=>(W(),j("div",{ref_key:"containerElementRef",ref:m,class:"container"},[q("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},Y=V(D,[["__scopeId","data-v-ba3bef7a"]]);export{Y as default};
