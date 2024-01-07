import{ad as O,z as A,af as V,O as W,u as v,aw as L,M as u,ah as C,G as z,V as F,aE as H}from"./three.module-b50c6fca.js";import{O as I}from"./OrbitControls-a97fbd6e.js";import{R as E,E as M,U as N,O as g,S as q}from"./OutputPass-5b2ad287.js";import{_ as J,r as h,o as K,w as Q,a as X,b as Y,c as Z,d as b,t as $}from"./index-965901d4.js";const j={__name:"GlowScene",setup(ee){const x=h(null),_=h(null),d=h(0),P=(o,t,s,n=!0)=>{const c=new E(o,t),a=new M(s),r=new N(new F(window.innerWidth/2,window.innerHeight/2),1.5,.4,.85);if(r.threshold=0,r.strength=.55,r.radius=0,a.addPass(c),a.addPass(r),n){const i=new g;a.addPass(i)}else a.renderToScreen=!1;return a},G=(o,t,s,n)=>{const c=new E(o,t),a=new g,r=new q(new H({uniforms:{baseTexture:{value:null},bloomTexture:{value:n.renderTarget2.texture}},vertexShader:`
        varying vec2 vUv;

        void main() {

          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
      `,fragmentShader:`
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {

          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

        }
      `,defines:{}}),"baseTexture");r.needsSwap=!0;const i=new M(s);return i.addPass(c),i.addPass(r),i.addPass(a),i},B=()=>{const o=new v(new L(1,32,16),new u({color:"#DC143C"}));o.position.set(-1.5,0,0);const t=new v(new C(1,1,1),new u({color:"#8A2BE2"}));t.position.set(1.5,0,0);const s=new v(new C(1,1,1),new u({color:"#8A2BE2"}));s.position.set(-1.5,0,2);const n=new z;return n.add(o),[n,t,s]},D=(o,t,s)=>{const n=P(o,t,s);return s.autoClear=!1,()=>{s.clear(),t.layers.set(1),n.render(),s.clearDepth(),t.layers.set(0),s.render(o,t)}},R=(o,t,s)=>{const n=P(o,t,s,!1),c=G(o,t,s,n),a=new u({color:"black"}),r={};function i(e){e.isMesh&&e.parent&&e.parent.isGroup&&(r[e.uuid]=e.material,e.material=a)}function m(e){r[e.uuid]&&(e.material=r[e.uuid],delete r[e.uuid])}return()=>{o.traverse(i),n.render(),o.traverse(m),c.render()}},k=()=>{d.value=1-d.value};return K(()=>{const o=x.value,t=_.value,s=t.clientWidth,n=t.clientHeight,c=new O,a=new A(45,s/n,1,1e3);a.position.set(1,1,10),a.lookAt(c.position);const[r,i,m]=B();c.add(r),c.add(i),c.add(m);const e=new V({canvas:o,antialias:!0});e.setSize(s,n),e.setPixelRatio(window.devicePixelRatio);const p=new I(a,e.domElement);p.minDistance=1,p.maxDistance=20;let f=()=>{};const T=Q(d,l=>{i.layers.set(1-l),m.layers.set(1-l),f=l==0?D(c,a,e):R(c,a,e),f()},{immediate:!0});p.addEventListener("change",()=>f()),X(()=>{T(),e.dispose(),e.forceContextLoss(),c.traverse(l=>{if(l instanceof W){const{geometry:S,material:w}=l;S&&S.dispose();const U=Array.isArray(w)?w:[w];for(const y of U)y&&y.dispose()}})})}),(o,t)=>(Y(),Z("div",{ref_key:"containerElementRef",ref:_,class:"container"},[b("span",{class:"button--text",onClick:k},"点击方案切换：当前方案是"+$(d.value===0?"清除深度":"替换材质"),1),b("canvas",{ref_key:"canvasElementRef",ref:x},null,512)],512))}},ne=J(j,[["__scopeId","data-v-61c0dd97"]]);export{ne as default};
