import{O as L,ad as B,z as O,af as F,bb as G,aE as y,q as W,u as S,aa as j,g as c,ap as q,aC as z,h as H,R,V as N,ag as J}from"./three.module-8f39f104.js";import{O as K}from"./OrbitControls-8206acf3.js";import{_ as Q,r as V,o as X,a as Y,b as Z,c as $,d,p as ee,e as te}from"./index-639cdcb3.js";const ne=""+new URL("gm-8dde0536.mp4",import.meta.url).href;const oe=i=>(ee("data-v-ba005050"),i=i(),te(),i),ae=oe(()=>d("video",{id:"video",loop:"",crossOrigin:"anonymous",playsinline:""},[d("source",{src:ne})],-1)),re={__name:"TextureShader",setup(i){let v=null;const p=V(null),f=V(null),E=()=>new B,C=n=>{const e=new O(45,n,1,1e3);return e.position.set(0,0,60),e.lookAt(0,0,0),e},b=(n,e,t)=>{const o=new F({canvas:n,antialias:!0});return o.setSize(e,t),o.setPixelRatio(window.devicePixelRatio),o},M=(n,e)=>{const t=new K(n,e);return t.minDistance=6,t.maxDistance=80,t.minPolarAngle=Math.PI/4,t.maxPolarAngle=Math.PI/2*.96,t},U=n=>{const e=`
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
  `,r=new H().load("/src/assets/textures/other/arrow.png");r.wrapS=R,r.wrapT=R,r.repeat.set(32,2);const s=new y({uniforms:{uTexture:{value:r},uTextureRepeat:{value:new N(32,2)},uTime:{value:0}},vertexShader:o,fragmentShader:a,transparent:!0}),m=new S(t,s);return m.position.set(-10,0,-1),m};return X(()=>{const n=p.value,e=f.value,t=e.clientWidth,o=e.clientHeight,a=E(),r=C(t/o),s=b(n,t,o),m=M(r,s.domElement),w=document.getElementById("video"),P=U(w);a.add(P);const x=k();a.add(x);const D=x.material.uniforms,A=new J,_=()=>{const u=A.getElapsedTime();D.uTime.value=u,m.update(),s.render(a,r),v=window.requestAnimationFrame(_)},h=()=>{w.play()};_(),document.addEventListener("click",h),Y(()=>{document.removeEventListener("click",h),s.dispose(),s.forceContextLoss(),a.traverse(u=>{if(u instanceof L){const{geometry:g,material:l}=u;g&&g.dispose();const I=Array.isArray(l)?l:[l];for(const T of I)T&&T.dispose()}}),window.cancelAnimationFrame(v)})}),(n,e)=>(Z(),$("div",{ref_key:"containerElementRef",ref:f,class:"container"},[ae,d("canvas",{ref_key:"canvasElementRef",ref:p},null,512)],512))}},me=Q(re,[["__scopeId","data-v-ba005050"]]);export{me as default};
