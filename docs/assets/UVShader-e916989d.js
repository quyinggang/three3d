import{O as M,ad as k,z as D,af as P,aE as x,C as o,q as p,u as _,aa as w}from"./three.module-b50c6fca.js";import{O as A}from"./OrbitControls-a97fbd6e.js";import{_ as B,r as h,o as O,a as G,b as L,c as W,d as j}from"./index-965901d4.js";const q={__name:"UVShader",setup(z){let c=null;const d=h(null),l=h(null),F=()=>new k,y=n=>{const e=new D(45,n,1,1e3);return e.position.set(0,0,6),e.lookAt(0,0,0),e},C=(n,e,t)=>{const a=new P({canvas:n,antialias:!0});return a.setSize(e,t),a.setPixelRatio(window.devicePixelRatio),a},V=(n,e)=>{const t=new A(n,e);return t.minDistance=2,t.maxDistance=40,t},U=()=>{const n=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor[3];

    varying vec2 vUV;

    const float radius = 0.15;
    const float step = 0.015;

    void main() {
      float distance = length(vUV - vec2(0.5, 0.5));
      int targetIndex = -1;
      for(int index = 1; index <= 3; index++) {
        if (abs(distance - (radius * float(index))) < step) {
          targetIndex = index - 1;
          break;
        }
      }
      float opacity = targetIndex >= 0 ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor[targetIndex], opacity);
    }

  `,t=new x({uniforms:{uColor:{value:[new o("#00FFFF"),new o("#FF00FF"),new o("#DC143C")]}},vertexShader:n,fragmentShader:e,transparent:!0,side:p}),a=new _(new w(1,1,1),t);return a.position.set(-1,0,0),a},b=()=>{const n=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor[3];

    varying vec2 vUV;

    const float radius = 0.15;
    const float step = 0.015;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float distance = length(vUV - center);
      int targetIndex = -1;
      for(int index = 1; index <= 3; index++) {
        if (abs(distance - (radius * float(index))) < step) {
          targetIndex = index - 1;
          break;
        }
      }

      vec2 direction = vec2(center.x - vUV.x, center.y - vUV.y);
      float angle = abs(degrees(atan(direction.y, direction.x)));
      bool isInRange = (angle >= 15.0 && angle <= 45.0) || (angle >= 75.0 && angle <= 105.0) || (angle >= 135.0 && angle <= 165.0);
      float opacity = targetIndex >= 0 && isInRange ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor[targetIndex], opacity);
    }

  `,t=new x({uniforms:{uColor:{value:[new o("#00FFFF"),new o("#FF00FF"),new o("#DC143C")]}},vertexShader:n,fragmentShader:e,transparent:!0,side:p}),a=new _(new w(1,1,1),t);return a.position.set(1,0,0),a};return O(()=>{const n=d.value,e=l.value,t=e.clientWidth,a=e.clientHeight,r=F(),v=y(t/a),s=C(n,t,a),S=V(v,s.domElement),I=U();r.add(I);const R=b();r.add(R);const m=()=>{S.update(),s.render(r,v),c=window.requestAnimationFrame(m)};m(),G(()=>{s.dispose(),s.forceContextLoss(),r.traverse(u=>{if(u instanceof M){const{geometry:f,material:i}=u;f&&f.dispose();const E=Array.isArray(i)?i:[i];for(const g of E)g&&g.dispose()}}),window.cancelAnimationFrame(c)})}),(n,e)=>(L(),W("div",{ref_key:"containerElementRef",ref:l,class:"container"},[j("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},K=B(q,[["__scopeId","data-v-7ddc4b27"]]);export{K as default};
