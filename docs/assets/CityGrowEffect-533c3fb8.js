import{O as G,ad as R,z as M,af as k,G as x,ar as I,D as F,o as O,v as T,as as z,C as p,ag as N}from"./three.module-8f39f104.js";import{O as U}from"./OrbitControls-8206acf3.js";import{F as W}from"./FBXLoader-0e2d8373.js";import{_ as X,r as y,o as H,a as q,b as V,c as Y,d as $}from"./index-d7540ef8.js";const j={__name:"CityGrowEffect",setup(J){let u=null;const g=y(null),w=y(null),C=()=>new R,E=e=>{const t=new M(45,e,1,1e4);return t.position.set(0,50,1e3),t.lookAt(0,0,0),t},L=(e,t,n)=>{const r=new k({canvas:e,antialias:!0});return r.setSize(t,n),r.setPixelRatio(window.devicePixelRatio),r},A=(e,t)=>{const n=new U(e,t);return n.enableDamping=!0,n.minDistance=300,n.maxDistance=6e3,n.minPolarAngle=Math.PI/4,n.maxPolarAngle=Math.PI/2*.96,n},P=()=>{const e=new x,t=new I(11382189),n=new F(16777215,.5);return n.position.set(600,600,0),e.add(t),e.add(n),e},S=e=>{new W().load("/src/assets/models/shanghai.FBX",n=>{e&&e(n)})},_=[],h=e=>{e.uniforms.uProgress={value:0},e.vertexShader=`
    uniform float uProgress;
    ${e.vertexShader}
  `,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      transformed.z = position.z * min(uProgress, 1.0);
    `),_.push(t=>{e.uniforms.uProgress.value=t})},b={CITY_UNTRIANGULATED:(e,t)=>{const{geometry:n,position:r,material:o}=e,i=new O({color:"#2685fe"}),s=new T(new z(n,1),i);s.position.copy(r),s.rotateX(-Math.PI/2),t.add(s),o.onBeforeCompile=l=>{o.color=new p("#0e233d"),o.transparent=!0,o.opacity=.9,h(l)},i.onBeforeCompile=l=>{h(l)}},LANDMASS:e=>{const t=e.material;t.color=new p("#040912"),t.transparent=!0,t.opacity=.8},ROADS:e=>{const t=e.material;t.color=new p("#292e4c")}};return H(()=>{const e=g.value,t=w.value,n=t.clientWidth,r=t.clientHeight,o=C(),i=E(n/r),s=L(e,n,r),l=A(i,s.domElement),B=P();o.add(B),S(c=>{const a=new x;c.children.forEach(d=>{const m=d.clone(),f=b[m.name];f&&f(m,a),a.add(m)}),o.add(a)});const D=new N,v=()=>{const c=D.getElapsedTime();_.forEach(a=>{a&&a(c*.5)}),l.update(),s.render(o,i),u=window.requestAnimationFrame(v)};v(),q(()=>{s.dispose(),s.forceContextLoss(),o.traverse(c=>{if(c instanceof G){const{geometry:a,material:d}=c;a&&a.dispose();const m=Array.isArray(d)?d:[d];for(const f of m)f&&f.dispose()}}),window.cancelAnimationFrame(u)})}),(e,t)=>(V(),Y("div",{ref_key:"containerElementRef",ref:w,class:"container"},[$("canvas",{ref_key:"canvasElementRef",ref:g},null,512)],512))}},te=X(j,[["__scopeId","data-v-d601cfd7"]]);export{te as default};