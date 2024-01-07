import{O as S,ad as b,z as C,af as F,aE as M,V as k,u as A,ah as B}from"./three.module-b50c6fca.js";import{O}from"./OrbitControls-a97fbd6e.js";import{_ as P,r as f,o as V,a as G,b as L,c as W,d as z}from"./index-965901d4.js";const j={__name:"FragShader",setup(q){let i=null;const l=f(null),m=f(null),h=()=>new b,p=e=>{const n=new C(45,e,1,1e3);return n.position.set(0,2,6),n.lookAt(0,0,0),n},w=(e,n)=>new O(e,n),g=(e,n,o)=>{const t=new F({canvas:e,antialias:!0});return t.setSize(n,o),t.setPixelRatio(window.devicePixelRatio),t},x=(e,n)=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,t=`
    // 画布尺寸大小
    uniform vec2 uResolution;

    void main() {
      // 屏幕坐标归一化，即转换到范围为[0, 1]
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      // 分割场景
      if (uv.x > 0.5) {
        gl_FragColor = vec4(uv.x, 0.0, uv.y, 1.0);
      } else {
        gl_FragColor = vec4(uv.x, uv.y, 1.0, 1.0);
      }
    }
  `,r=new M({uniforms:{uResolution:{value:new k(e,n)}},vertexShader:o,fragmentShader:t});return new A(new B(1,1,1),r)};return V(()=>{const e=l.value,n=m.value,o=n.clientWidth,t=n.clientHeight,r=h(),s=p(o/t),a=g(e,o,t),y=w(s,a.domElement),R=x(e.width,e.height);r.add(R);const d=()=>{y.update(),a.render(r,s),i=window.requestAnimationFrame(d)};d(),G(()=>{a.dispose(),a.forceContextLoss(),r.traverse(u=>{if(u instanceof S){const{geometry:v,material:c}=u;v&&v.dispose();const E=Array.isArray(c)?c:[c];for(const _ of E)_&&_.dispose()}}),window.cancelAnimationFrame(i)})}),(e,n)=>(L(),W("div",{ref_key:"containerElementRef",ref:m,class:"container"},[z("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},N=P(j,[["__scopeId","data-v-be6e1b04"]]);export{N as default};
