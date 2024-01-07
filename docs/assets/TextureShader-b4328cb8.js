import{O as L,ad as B,z as O,af as F,ba as G,aE as y,q as W,u as S,aa as j,g as c,ap as q,aC as z,h as H,R,V as N,ag as J}from"./three.module-b50c6fca.js";import{O as K}from"./OrbitControls-a97fbd6e.js";import{a as Q}from"./arrow-ce0c96dc.js";import{_ as X,r as V,o as Y,a as Z,b as $,c as ee,d as m,u as te,p as ne,e as oe}from"./index-965901d4.js";const ae=""+new URL("gm-8dde0536.mp4",import.meta.url).href;const re=i=>(ne("data-v-99d8e0bc"),i=i(),oe(),i),se=re(()=>m("span",{class:"tip"},"点击页面播放视频",-1)),ce={id:"video",loop:"",crossOrigin:"anonymous",playsinline:""},ie=["src"],le={__name:"TextureShader",setup(i){let v=null;const p=V(null),f=V(null),E=()=>new B,C=n=>{const e=new O(45,n,1,1e3);return e.position.set(0,0,60),e.lookAt(0,0,0),e},M=(n,e,t)=>{const o=new F({canvas:n,antialias:!0});return o.setSize(e,t),o.setPixelRatio(window.devicePixelRatio),o},U=(n,e)=>{const t=new K(n,e);return t.minDistance=6,t.maxDistance=80,t.minPolarAngle=Math.PI/4,t.maxPolarAngle=Math.PI/2*.96,t},b=n=>{const e=`
      varying vec2 vUV;

		  void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture;

      varying vec2 vUV;
			void main() {
        gl_FragColor = texture2D(uTexture, vUV);
			}
  `,o=new G(n),a=new y({uniforms:{uTexture:{value:o}},vertexShader:e,fragmentShader:t,side:W});return new S(new j(16,9,3),a)},k=()=>{const n=[new c(-10,0,0),new c(10,0,0),new c(15,5,0),new c(20,0,5),new c(20,0,15),new c(10,0,20)],e=new q(n),t=new z(e,64,.5,2,!1),o=`
    varying vec2 vUV;

    void main() {
      vUV = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,a=`
    uniform sampler2D uTexture;
    uniform vec2 uTextureRepeat;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 point = vUV * uTextureRepeat + vec2(-mod(uTime, 2.0), 0.0);
      gl_FragColor = texture2D(uTexture, point);
    }
  `,r=new H().load(Q);r.wrapS=R,r.wrapT=R,r.repeat.set(32,2);const s=new y({uniforms:{uTexture:{value:r},uTextureRepeat:{value:new N(32,2)},uTime:{value:0}},vertexShader:o,fragmentShader:a,transparent:!0}),l=new S(t,s);return l.position.set(-10,0,-1),l};return Y(()=>{const n=p.value,e=f.value,t=e.clientWidth,o=e.clientHeight,a=E(),r=C(t/o),s=M(n,t,o),l=U(r,s.domElement),w=document.getElementById("video"),P=b(w);a.add(P);const _=k();a.add(_);const A=_.material.uniforms,D=new J,h=()=>{const u=D.getElapsedTime();A.uTime.value=u,l.update(),s.render(a,r),v=window.requestAnimationFrame(h)},x=()=>{w.play()};h(),e.addEventListener("click",x),Z(()=>{e.removeEventListener("click",x),s.dispose(),s.forceContextLoss(),a.traverse(u=>{if(u instanceof L){const{geometry:g,material:d}=u;g&&g.dispose();const I=Array.isArray(d)?d:[d];for(const T of I)T&&T.dispose()}}),window.cancelAnimationFrame(v)})}),(n,e)=>($(),ee("div",{ref_key:"containerElementRef",ref:f,class:"container"},[se,m("video",ce,[m("source",{src:te(ae)},null,8,ie)]),m("canvas",{ref_key:"canvasElementRef",ref:p},null,512)],512))}},pe=X(le,[["__scopeId","data-v-99d8e0bc"]]);export{pe as default};
