import{O as B,ad as G,z as O,af as z,aE as w,C as h,u as x,ah as D,aa as L,ag as U}from"./three.module-b50c6fca.js";import{O as V}from"./OrbitControls-a97fbd6e.js";import{_ as W,r as g,o as j,a as q,b as H,c as I,d as N}from"./index-965901d4.js";const T={__name:"PeriodicShader",setup(J){let m=null;const d=g(null),f=g(null),C=()=>new G,y=o=>{const e=new O(45,o,1,1e3);return e.position.set(0,0,8),e.lookAt(0,0,0),e},P=(o,e,n)=>{const t=new z({canvas:o,antialias:!0});return t.setSize(e,n),t.setPixelRatio(window.devicePixelRatio),t},S=(o,e)=>{const n=new V(o,e);return n.minDistance=3,n.maxDistance=40,n},E=()=>{const o=`
			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
      uniform vec3 color;
      uniform float time;

			void main() {
        float colorR = clamp(sin(time), 0.0, 1.0);
        vec3 newColor = vec3(colorR, color.yz);
        gl_FragColor = vec4(newColor, 1.0);
			}
  `,n=new w({uniforms:{color:{value:new h("#FF0000")},time:{value:1}},vertexShader:o,fragmentShader:e});return new x(new D(1,1,1),n)},M=()=>{const o=`
      uniform float time;

			void main() {
        vec3 newPosition = vec3(position.xy, sin(time));
				gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
			}
  `,e=`
      uniform vec3 color;

			void main() {
        gl_FragColor = vec4(color, 1.0);
			}
  `,n=new w({uniforms:{color:{value:new h("#FF0000")},time:{value:1}},vertexShader:o,fragmentShader:e});return new x(new L(2,2,2),n)};return j(()=>{const o=d.value,e=f.value,n=e.clientWidth,t=e.clientHeight,r=C(),u=y(n/t),s=P(o,n,t),R=S(u,s.domElement),c=E();c.position.set(-1,0,0),r.add(c);const i=M();i.position.set(1,0,0),r.add(i);const F=i.material.uniforms,b=c.material.uniforms,k=new U,v=()=>{const a=k.getElapsedTime();R.update(),b.time.value=a,F.time.value=a,s.render(r,u),m=window.requestAnimationFrame(v)};v(),q(()=>{s.dispose(),s.forceContextLoss(),r.traverse(a=>{if(a instanceof B){const{geometry:p,material:l}=a;p&&p.dispose();const A=Array.isArray(l)?l:[l];for(const _ of A)_&&_.dispose()}}),window.cancelAnimationFrame(m)})}),(o,e)=>(H(),I("div",{ref_key:"containerElementRef",ref:f,class:"container"},[N("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},Y=W(T,[["__scopeId","data-v-8b745a55"]]);export{Y as default};
