import{O as S,ad as R,z as M,af as b,aE as k,C as r,u as A,ah as B}from"./three.module-b50c6fca.js";import{O as z}from"./OrbitControls-a97fbd6e.js";import{_ as O,r as _,o as P,a as D,b as F,c as G,d as L}from"./index-965901d4.js";const W={__name:"NormalShader",setup(V){let i=null;const l=_(null),d=_(null),w=()=>new R,p=n=>{const e=new M(45,n,1,1e3);return e.position.set(3,3,3),e.lookAt(0,0,0),e},h=(n,e,o)=>{const a=new b({canvas:n,antialias:!0});return a.setSize(e,o),a.setPixelRatio(window.devicePixelRatio),a},N=(n,e)=>{const o=new z(n,e);return o.minDistance=2,o.maxDistance=40,o},y=()=>{const n=`
      varying vec3 vNormal;

			void main() {
        vNormal = normal;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor[6];

    varying vec3 vNormal;

    void main() {
      int index = 0;
      index = vNormal.z == 1.0 ? 0 : index;
      index = vNormal.z == -1.0 ? 1 : index;
      index = vNormal.x == -1.0 ? 2 : index;
      index = vNormal.x == 1.0 ? 3 : index;
      index = vNormal.y == 1.0 ? 4 : index;
      index = vNormal.y == -1.0 ? 5 : index;
      
      gl_FragColor = vec4(uColor[index], 1.0);
    }

  `,o=new k({uniforms:{uColor:{value:[new r("#ff0000"),new r("#00ffff"),new r("#7b68ee"),new r("#0000ff"),new r("#006400"),new r("#ff00ff")]}},vertexShader:n,fragmentShader:e});return new A(new B(1,1,1),o)};return P(()=>{const n=l.value,e=d.value,o=e.clientWidth,a=e.clientHeight,s=w(),m=p(o/a),t=h(n,o,a),C=N(m,t.domElement),g=y();s.add(g);const f=()=>{C.update(),t.render(s,m),i=window.requestAnimationFrame(f)};f(),D(()=>{t.dispose(),t.forceContextLoss(),s.traverse(v=>{if(v instanceof S){const{geometry:u,material:c}=v;u&&u.dispose();const E=Array.isArray(c)?c:[c];for(const x of E)x&&x.dispose()}}),window.cancelAnimationFrame(i)})}),(n,e)=>(F(),G("div",{ref_key:"containerElementRef",ref:d,class:"container"},[L("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},I=O(W,[["__scopeId","data-v-343653d0"]]);export{I as default};
