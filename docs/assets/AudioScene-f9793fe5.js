import{O as j,V as C,G as D,ah as F,M as U,u as V,ad as W,z as q,af as z,ai as H,aj as N,ak as X,al as Y,am as J}from"./three.module-8787a522.js";import{O as K}from"./OrbitControls-8109a5ff.js";import{E as Q,R as T,U as Z,O as $}from"./OutputPass-4699418a.js";import{g as ee}from"./util-760d6c6b.js";import{_ as te,r as E,o as ne,a as se,b as oe,c as ae,d as R,p as ce,e as re}from"./index-1a0b05a6.js";const ie=""+new URL("fearless-81b433ae.mp3",import.meta.url).href;const le=m=>(ce("data-v-d8c375cc"),m=m(),re(),m),de=le(()=>R("span",{class:"tip"},"点击场景中方块播放音乐",-1)),P=64,ue={__name:"AudioScene",setup(m){const w=E(null),h=E(null);let _=null;const b=(t,e,a)=>{const o=new Q(a),n=new T(t,e),s=new Z(new C(window.innerWidth/2,window.innerHeight/2),1.5,.4,.85);return s.threshold=0,s.strength=.25,s.radius=0,o.addPass(n),o.addPass(s),o.addPass(new $),o},k=()=>{const t=new D,e=new F(1,1,1),a=P/2,o=Math.round(Math.sqrt(a));for(let n=0;n<o;n++)for(let s=0;s<o;s++){const i=ee(),r=new U({color:i}),c=new V(e,r);if(c.position.set(n-o/2,0,s-o/2),c.scale.set(.3,.3,.3),t.children.length>=a)break;t.add(c)}return t},x=()=>new W,L=t=>{const e=new q(45,t,1,1e3);return e.position.set(16,11,12),e.lookAt(0,0,0),e},B=(t,e,a)=>{const o=new z({canvas:t,antialias:!0});return o.setSize(e,a),o.setPixelRatio(window.devicePixelRatio),o},S=(t,e)=>{const a=new K(t,e);return a.minDistance=8,a.maxDistance=40,a},I=t=>{const{containerElement:e,objects:a,camera:o,callback:n}=t,s=e.getBoundingClientRect(),i=new H,r=new C,c=p=>{r.x=(p.clientX-s.left)/s.width*2-1,r.y=-((p.clientY-s.top)/s.height)*2+1,i.setFromCamera(r,o),i.intersectObjects(a).length>0&&n&&n()};return e.addEventListener("click",c),()=>e.removeEventListener("click",c)},M=t=>{let e=null,a=null;return new N().load(ie,function(n){const s=new X;e=new Y(s),e.setBuffer(n),e.setVolume(1),e.setLoop(!0),a=new J(e,P),t&&t(e,s,a)},()=>{},n=>{console.log(n)}),()=>{e&&e.isPlaying&&e.stop()}};return ne(()=>{const t=w.value,e=h.value,a=e.clientWidth,o=e.clientHeight;let n,s;const i=x(),r=L(a/o),c=B(t,a,o),p=b(i,r,c),y=S(r,c.domElement),O=M((d,u,l)=>{n=d,s=l,r.add(u)}),G=I({camera:r,containerElement:e,objects:i.children,callback:()=>{n&&(n.isPlaying?n.pause():n.play())}}),g=k();i.add(g);const v=()=>{if(y.update(),p.render(),n&&n.isPlaying&&s){const d=s.getFrequencyData();g.children.forEach((u,l)=>{const f=d[l]/45;u.scale.y=f})}_=window.requestAnimationFrame(v)};v(),se(()=>{O(),G(),c.dispose(),c.forceContextLoss(),i.traverse(d=>{if(d instanceof j){const{geometry:u,material:l}=d;u&&u.dispose();const f=Array.isArray(l)?l:[l];for(const A of f)A&&A.dispose()}}),window.cancelAnimationFrame(_)})}),(t,e)=>(oe(),ae("div",{ref_key:"containerElementRef",ref:h,class:"container"},[de,R("canvas",{ref_key:"canvasElementRef",ref:w},null,512)],512))}},_e=te(ue,[["__scopeId","data-v-d8c375cc"]]);export{_e as default};