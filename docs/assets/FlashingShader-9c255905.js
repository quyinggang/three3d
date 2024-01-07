import{O as R,ad as F,z as k,af as B,s as M,C as x,au as p,y as T,aE as D,h as L,aJ as O,ag as G}from"./three.module-b50c6fca.js";import{O as I}from"./OrbitControls-a97fbd6e.js";import{a as W,g as U}from"./util-8759745b.js";import{s as V}from"./spark-5a5bb6aa.js";import{_ as X,r as C,o as j,a as q,b as H,c as J,d as N}from"./index-965901d4.js";const Y={__name:"FlashingShader",setup(Z){let v=null;const g=C(null),_=C(null),b=()=>new F,y=e=>{const t=new k(45,e,1,1e3);return t.position.set(0,10,200),t.lookAt(0,0,0),t},A=(e,t,o)=>{const n=new B({canvas:e,antialias:!0});return n.setSize(t,o),n.setPixelRatio(window.devicePixelRatio),n},P=(e,t)=>{const o=new I(e,t);return o.enableDamping=!0,o.minDistance=10,o.maxDistance=300,o.minPolarAngle=Math.PI/4,o.maxPolarAngle=Math.PI/2*.96,o},z=()=>{const e=`
    attribute float size;
		attribute vec3 customColor;
    varying vec3 vColor;
    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = size * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }
  `,t=`
    uniform vec3 color;
		uniform sampler2D pointTexture;
		varying vec3 vColor;
		void main() {
		  gl_FragColor = vec4( color * vColor, 1.0 );
			gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
	  }
  `;return new D({uniforms:{color:{value:new x(16777215)},pointTexture:{value:new L().load(V)}},vertexShader:e,fragmentShader:t,blending:O,depthTest:!1,transparent:!0})},S=()=>{const e=new M,t=z(),o=[],n=[],r=[];for(let i=0;i<10;i++){const[s,d,l]=W({x:300,y:200,z:100}),c=new x(U());n.push(c.r,c.g,c.b),o.push(s,d,l),r.push(60)}return e.setAttribute("position",new p(o,3)),e.setAttribute("customColor",new p(n,3)),e.setAttribute("size",new p(r,1)),new T(e,t)};return j(()=>{const e=g.value,t=_.value,o=t.clientWidth,n=t.clientHeight,r=b(),i=y(o/n),s=A(e,o,n),d=P(i,s.domElement),l=S();r.add(l);const c=new G,u=l.geometry.attributes.size,h=()=>{const m=c.getElapsedTime();d.update();for(let a=0;a<u.count;a++)u.setX(a,Math.sin(m)*26+40);u.needsUpdate=!0,s.render(r,i),v=window.requestAnimationFrame(h)};h(),q(()=>{s.dispose(),s.forceContextLoss(),r.traverse(m=>{if(m instanceof R){const{geometry:a,material:f}=m;a&&a.dispose();const E=Array.isArray(f)?f:[f];for(const w of E)w&&w.dispose()}}),window.cancelAnimationFrame(v)})}),(e,t)=>(H(),J("div",{ref_key:"containerElementRef",ref:_,class:"container"},[N("canvas",{ref_key:"canvasElementRef",ref:g},null,512)],512))}},oe=X(Y,[["__scopeId","data-v-98c836e2"]]);export{oe as default};
