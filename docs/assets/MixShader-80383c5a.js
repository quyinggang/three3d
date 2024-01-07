import{O as k,ad as B,z as D,af as O,aE as l,C as a,V as j,q as m,u,aa as v}from"./three.module-b50c6fca.js";import{O as G}from"./OrbitControls-a97fbd6e.js";import{_ as I,r as p,o as L,a as W,b as q,c as z,d as H}from"./index-965901d4.js";const N={__name:"MixShader",setup(J){let d=null;const f=p(null),C=p(null),g=()=>new B,S=e=>{const o=new D(45,e,1,1e3);return o.position.set(0,0,20),o.lookAt(0,0,0),o},E=(e,o,n)=>{const t=new O({canvas:e,antialias:!0});return t.setSize(o,n),t.setPixelRatio(window.devicePixelRatio),t},M=(e,o)=>{const n=new G(e,o);return n.minDistance=6,n.maxDistance=40,n.minPolarAngle=Math.PI/4,n.maxPolarAngle=Math.PI/2*.96,n},P=(e,o)=>{const n=`
			void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `,t=`
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;
      uniform vec2 uResolution;

			void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        // 实现从左到右渐变
        vec3 mixColor = mix(uStartColor, uEndColor, uv.x);
        // 实现从上到下渐变
        // vec3 mixColor = mix(uStartColor, uEndColor, uv.y);
        gl_FragColor = vec4(mixColor, 1.0);
			}
  `,r=new l({uniforms:{uStartColor:{value:new a("#FF0000")},uEndColor:{value:new a("#0000ff")},uResolution:{value:new j(e,o)}},vertexShader:n,fragmentShader:t,side:m}),i=new u(new v(4,4,2),r);return i.position.set(-3,2,0),i},y=()=>{const e=`
      varying vec2 vUV;
			void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `,o=`
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;
      
      varying vec2 vUV;

			void main() {
        vec3 mixColor = mix(uStartColor, uEndColor, vUV.x);
        gl_FragColor = vec4(mixColor, 1.0);
			}
  `,n=new l({uniforms:{uStartColor:{value:new a("#FF0000")},uEndColor:{value:new a("#0000ff")}},vertexShader:e,fragmentShader:o,side:m}),t=new u(new v(4,4,2),n);return t.position.set(3,2,0),t},R=()=>{const e=`
      varying vec2 vUV;
			void main() {
        vUV = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
			}
  `,o=`
      uniform vec3 uStartColor;
      uniform vec3 uEndColor;
      uniform float uRadius;
      varying vec2 vUV;

			void main() {
        float distance = length(vUV - vec2(0.5));
        vec3 mixColor = mix(uStartColor, uEndColor, distance / uRadius);
        gl_FragColor = vec4(mixColor, 1.0);
			}
  `,n=new l({uniforms:{uRadius:{value:.5},uStartColor:{value:new a("#fff")},uEndColor:{value:new a("#000")}},vertexShader:e,fragmentShader:o,side:m}),t=new u(new v(4,4,2),n);return t.position.set(-3,-3,0),t};return L(()=>{const e=f.value,o=C.value,n=o.clientWidth,t=o.clientHeight,r=g(),i=S(n/t),s=E(e,n,t),V=M(i,s.domElement),F=P(e.width,e.height);r.add(F);const U=y();r.add(U);const A=R();r.add(A);const x=()=>{V.update(),s.render(r,i),d=window.requestAnimationFrame(x)};x(),W(()=>{s.dispose(),s.forceContextLoss(),r.traverse(h=>{if(h instanceof k){const{geometry:w,material:c}=h;w&&w.dispose();const b=Array.isArray(c)?c:[c];for(const _ of b)_&&_.dispose()}}),window.cancelAnimationFrame(d)})}),(e,o)=>(q(),z("div",{ref_key:"containerElementRef",ref:C,class:"container"},[H("canvas",{ref_key:"canvasElementRef",ref:f},null,512)],512))}},X=I(N,[["__scopeId","data-v-49031346"]]);export{X as default};
