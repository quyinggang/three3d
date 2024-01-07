import{O as A,ad as D,z as L,af as O,aE as m,C as i,u as l,ah as v,q as j,ag as z}from"./three.module-b50c6fca.js";import{O as G}from"./OrbitControls-a97fbd6e.js";import{_ as I,r as x,o as W,a as q,b as H,c as J,d as K}from"./index-965901d4.js";const Q={__name:"RiseShader",setup(X){let u=null;const d=x(null),f=x(null),F=()=>new D,T=n=>{const e=new L(45,n,1,1e3);return e.position.set(2,4,8),e.lookAt(0,0,0),e},R=(n,e,o)=>{const t=new O({canvas:n,antialias:!0});return t.setSize(e,o),t.setPixelRatio(window.devicePixelRatio),t},M=(n,e)=>{const o=new G(n,e);return o.enableDamping=!0,o.minDistance=1,o.maxDistance=300,o.minPolarAngle=Math.PI/4,o.maxPolarAngle=Math.PI/2*.96,o},S=()=>{const n=`
      uniform float uTime;

			void main() {
        float y = min(uTime * 0.8 - position.y, position.y);
        vec3 newPosition = vec3(position.x, y, position.z);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
			}
  `,e=`
    uniform vec3 uColor;

    void main() {
      gl_FragColor = vec4(uColor, 1.0);
    }
  `,o=new m({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:n,fragmentShader:e,transparent:!0}),t=new l(new v(1,2,1),o);return t.position.set(-1.5,0,0),t},U=()=>{const n=`
      varying vec2 vUV;
      varying vec3 vNormal;

			void main() {
        vUV = uv;
        vNormal = normal;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform vec3 uRiseColor;
    uniform float uTime;

    varying vec2 vUV;
    varying vec3 vNormal;

    vec3 riseLine() {
      float smoothness = 0.02;
      float speed = clamp(uTime * 0.5, 0.0, 1.0);
      // 不处理法向量指向y轴方向的面
      bool isTopBottom = vNormal.y > 0.0 || vNormal.y < 0.0;
      float ratio = isTopBottom || speed >= 1.0 ? 0.0 : smoothstep(speed, speed + smoothness, vUV.y) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vUV.y);
      return uRiseColor * ratio;
    }

    void main() {
      vec3 color = riseLine();
      gl_FragColor = vec4(uColor + color, 1.0);
    }
  `,o=new m({uniforms:{uColor:{value:new i("#a9a9a9")},uRiseColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:n,fragmentShader:e,transparent:!0}),t=new l(new v(1,2,.5),o);return t.position.set(0,0,0),t},V=()=>{const n=`
      varying vec2 vUV;
      varying vec3 vNormal;

			void main() {
        vUV = uv;
        vNormal = normal;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform vec3 uRiseColor;
    uniform float uTime;

    varying vec2 vUV;
    varying vec3 vNormal;

    void main() {
      bool isTopBottom = vNormal.y > 0.0 || vNormal.y < 0.0;
      if (isTopBottom) {
        discard;
      }
      float ratio = 1.0 - smoothstep(0.0, 1.0, vUV.y);
      gl_FragColor = vec4(uColor * ratio, ratio);
    }
  `,o=new m({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:n,fragmentShader:e,transparent:!0,side:j}),t=new l(new v(2,1,2),o);return t.position.set(2,-.5,0),t};return W(()=>{const n=d.value,e=f.value,o=e.clientWidth,t=e.clientHeight,a=F(),p=T(o/t),s=R(n,o,t),P=M(p,s.domElement),h=S();a.add(h);const w=U();a.add(w);const _=V();a.add(_);const N=h.material.uniforms,b=w.material.uniforms,E=_.material.uniforms,B=new z,g=()=>{const r=B.getElapsedTime();N.uTime.value=r,b.uTime.value=r,E.uTime.value=r,P.update(),s.render(a,p),u=window.requestAnimationFrame(g)};g(),q(()=>{s.dispose(),s.forceContextLoss(),a.traverse(r=>{if(r instanceof A){const{geometry:y,material:c}=r;y&&y.dispose();const k=Array.isArray(c)?c:[c];for(const C of k)C&&C.dispose()}}),window.cancelAnimationFrame(u)})}),(n,e)=>(H(),J("div",{ref_key:"containerElementRef",ref:f,class:"container"},[K("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},ee=I(Q,[["__scopeId","data-v-8e0bd32d"]]);export{ee as default};
