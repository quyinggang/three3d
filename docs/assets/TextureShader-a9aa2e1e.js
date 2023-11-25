import{O as L,ad as B,z as O,af as F,bb as G,aE as T,q as I,u as y,aa as W,g as c,ap as j,aC as q,h as z,R,V as H,ag as N}from"./three.module-8f39f104.js";import{O as J}from"./OrbitControls-8206acf3.js";import{a as K}from"./arrow-ce0c96dc.js";import{_ as Q,r as V,o as X,a as Y,b as Z,c as $,d as l,u as ee}from"./index-16e2df25.js";const te=""+new URL("gm-8dde0536.mp4",import.meta.url).href;const ne={id:"video",loop:"",crossOrigin:"anonymous",playsinline:""},oe=["src"],re={__name:"TextureShader",setup(ae){let d=null;const v=V(null),p=V(null),S=()=>new B,E=n=>{const e=new O(45,n,1,1e3);return e.position.set(0,0,60),e.lookAt(0,0,0),e},C=(n,e,t)=>{const o=new F({canvas:n,antialias:!0});return o.setSize(e,t),o.setPixelRatio(window.devicePixelRatio),o},M=(n,e)=>{const t=new J(n,e);return t.minDistance=6,t.maxDistance=80,t.minPolarAngle=Math.PI/4,t.maxPolarAngle=Math.PI/2*.96,t},U=n=>{const e=`
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
  `,o=new G(n),r=new T({uniforms:{uTexture:{value:o}},vertexShader:e,fragmentShader:t,side:I});return new y(new W(16,9,3),r)},k=()=>{const n=[new c(-10,0,0),new c(10,0,0),new c(15,5,0),new c(20,0,5),new c(20,0,15),new c(10,0,20)],e=new j(n),t=new q(e,64,.5,2,!1),o=`
    varying vec2 vUV;

    void main() {
      vUV = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,r=`
    uniform sampler2D uTexture;
    uniform vec2 uTextureRepeat;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 point = vUV * uTextureRepeat + vec2(-mod(uTime, 2.0), 0.0);
      gl_FragColor = texture2D(uTexture, point);
    }
  `,a=new z().load(K);a.wrapS=R,a.wrapT=R,a.repeat.set(32,2);const s=new T({uniforms:{uTexture:{value:a},uTextureRepeat:{value:new H(32,2)},uTime:{value:0}},vertexShader:o,fragmentShader:r,transparent:!0}),i=new y(t,s);return i.position.set(-10,0,-1),i};return X(()=>{const n=v.value,e=p.value,t=e.clientWidth,o=e.clientHeight,r=S(),a=E(t/o),s=C(n,t,o),i=M(a,s.domElement),f=document.getElementById("video"),P=U(f);r.add(P);const w=k();r.add(w);const b=w.material.uniforms,A=new N,x=()=>{const m=A.getElapsedTime();b.uTime.value=m,i.update(),s.render(r,a),d=window.requestAnimationFrame(x)},_=()=>{f.play()};x(),document.addEventListener("click",_),Y(()=>{document.removeEventListener("click",_),s.dispose(),s.forceContextLoss(),r.traverse(m=>{if(m instanceof L){const{geometry:h,material:u}=m;h&&h.dispose();const D=Array.isArray(u)?u:[u];for(const g of D)g&&g.dispose()}}),window.cancelAnimationFrame(d)})}),(n,e)=>(Z(),$("div",{ref_key:"containerElementRef",ref:p,class:"container"},[l("video",ne,[l("source",{src:ee(te)},null,8,oe)]),l("canvas",{ref_key:"canvasElementRef",ref:v},null,512)],512))}},ue=Q(re,[["__scopeId","data-v-4a87879e"]]);export{ue as default};
