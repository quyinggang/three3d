import{O as B,ad as k,z,af as T,s as x,o as U,w as G,au as V,aE as W,y as j,g as a,ap as g}from"./three.module-b50c6fca.js";import{T as h,u as q}from"./tween.esm-4d835848.js";import{O as D}from"./OrbitControls-a97fbd6e.js";import{_ as H,r as P,o as N,a as J,b as K,c as Q,d as X}from"./index-965901d4.js";const Y={__name:"FlyLineEffect",setup(Z){let d=null;const m=P(null),u=P(null),b=()=>new k,E=e=>{const t=new z(45,e,1,1e3);return t.position.set(2,2,10),t.lookAt(0,0,0),t},F=(e,t)=>new D(e,t),I=(e,t,n)=>{const o=new T({canvas:e,antialias:!0});return o.setSize(t,n),o.setPixelRatio(window.devicePixelRatio),o},L=()=>{const e=[new a(-3,0,0),new a(0,3,0),new a(0,0,3),new a(0,0,6)];return new g(e).getSpacedPoints(100)},M=e=>{const t=L(),n=e.attributes.position,o=new h({index:-3}).to({index:100},3e3).delay(800).repeat(1/0);o.onUpdate(({index:s})=>{const r=t.slice(s,s+3);r.length>0&&(e.setFromPoints(r),n.needsUpdate=!0)}),o.start()},R=()=>{const e=new x().setFromPoints([]),t=new U({color:"#FF0000"});return new G(e,t)},S=()=>{const e=[new a(3,0,-1),new a(3,0,3),new a(0,3,0),new a(0,0,6)];return new g(e).getSpacedPoints(1e3)},C=e=>{const t=new h({index:-10}).to({index:1010},3e3).delay(800).repeat(1/0);t.onUpdate(({index:n})=>{e.uniforms.uIndex.value=n}),t.start()},O=()=>{const e=`
    attribute float aIndex;

    uniform float uIndex;

    varying float vOpacity;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      bool isLine =  aIndex > uIndex - 10.0 && aIndex < uIndex + 10.0;
      vOpacity = isLine ? 1.0 : 0.0;
      gl_PointSize = isLine ? 0.2 * (80.0 / -mvPosition.z) : 0.0;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,t=`
    varying float vOpacity;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, vOpacity);
    }
  `,n=S(),o=n.map((i,c)=>c),s=new x().setFromPoints(n);s.setAttribute("aIndex",new V(o,1));const r=new W({uniforms:{uIndex:{value:0}},vertexShader:e,fragmentShader:t});return new j(s,r)};return N(()=>{const e=m.value,t=u.value,n=t.clientWidth,o=t.clientHeight,s=b(),r=E(n/o),i=I(e,n,o),c=F(r,i.domElement),f=R();M(f.geometry),s.add(f);const p=O();C(p.material),s.add(p);const w=()=>{c.update(),q(),i.render(s,r),d=window.requestAnimationFrame(w)};w(),J(()=>{i.dispose(),i.forceContextLoss(),s.traverse(v=>{if(v instanceof B){const{geometry:_,material:l}=v;_&&_.dispose();const A=Array.isArray(l)?l:[l];for(const y of A)y&&y.dispose()}}),window.cancelAnimationFrame(d)})}),(e,t)=>(K(),Q("div",{ref_key:"containerElementRef",ref:u,class:"container"},[X("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},oe=H(Y,[["__scopeId","data-v-2b0834b6"]]);export{oe as default};
