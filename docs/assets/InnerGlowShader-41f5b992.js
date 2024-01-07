import{O as P,ad as R,z as E,af as N,aE as M,C as b,u as B,aw as G}from"./three.module-b50c6fca.js";import{O as k}from"./OrbitControls-a97fbd6e.js";import{_ as z,r as p,o as A,a as I,b as O,c as D,d as F}from"./index-965901d4.js";const L={__name:"InnerGlowShader",setup(V){let c=null;const i=p(null),l=p(null),_=()=>new R,w=n=>{const e=new E(45,n,1,1e3);return e.position.set(0,0,6),e.lookAt(0,0,0),e},x=(n,e,o)=>{const a=new N({canvas:n,antialias:!0});return a.setSize(e,o),a.setPixelRatio(window.devicePixelRatio),a},h=(n,e)=>{const o=new k(n,e);return o.minDistance=6,o.maxDistance=40,o},y=()=>{const n=`
      varying vec3 vNormal;
      varying vec3 vPositionNormal;

			void main() {
        // 视图空间下的单位法线向量
        vNormal = normalize(normalMatrix * normal);
        // 视图空间下的单位坐标向量
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0) ).xyz);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;
    uniform float uBias;
    uniform float uPower;
    uniform float uScale;

    varying vec3 vNormal;
    varying vec3 vPositionNormal;

    // 菲涅尔反射
    float fresnelReflex() {
      return pow(uBias + uScale * abs(dot(vNormal, vPositionNormal)), uPower);
    }

    void main() {
      float opacity = fresnelReflex();
      gl_FragColor = vec4(uColor, opacity);
    }

  `,o=new M({uniforms:{uColor:{value:new b(65535)},uBias:{value:1},uScale:{value:-1},uPower:{value:2}},vertexShader:n,fragmentShader:e,transparent:!0});return new B(new G(1,32,16),o)};return A(()=>{const n=i.value,e=l.value,o=e.clientWidth,a=e.clientHeight,t=_(),m=w(o/a),r=x(n,o,a),S=h(m,r.domElement),g=y();t.add(g);const u=()=>{S.update(),r.render(t,m),c=window.requestAnimationFrame(u)};u(),I(()=>{r.dispose(),r.forceContextLoss(),t.traverse(d=>{if(d instanceof P){const{geometry:f,material:s}=d;f&&f.dispose();const C=Array.isArray(s)?s:[s];for(const v of C)v&&v.dispose()}}),window.cancelAnimationFrame(c)})}),(n,e)=>(O(),D("div",{ref_key:"containerElementRef",ref:l,class:"container"},[F("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},H=z(L,[["__scopeId","data-v-357d4b61"]]);export{H as default};
