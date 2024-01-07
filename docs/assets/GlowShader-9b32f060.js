import{O as C,ad as S,z as E,af as R,aE as G,C as M,u as V,aa as b}from"./three.module-b50c6fca.js";import{_ as k,r as v,o as A,a as P,b as U,c as B,d as F}from"./index-965901d4.js";const L={__name:"GlowShader",setup(W){let c=null;const i=v(null),l=v(null),_=()=>new S,w=n=>{const e=new E(45,n,1,1e3);return e.position.set(0,0,2),e.lookAt(0,0,0),e},p=(n,e,t)=>{const a=new R({canvas:n,antialias:!0});return a.setSize(e,t),a.setPixelRatio(window.devicePixelRatio),a},h=()=>{const n=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,e=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float glow(vec2 coord, float radius, float intensity) {
      return pow(radius / length(coord), intensity);
    }

    void main() {
      float ratio = glow(vUV - vec2(0.5), 0.1, 3.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }

  `,t=new G({uniforms:{uColor:{value:new M(65535)}},vertexShader:n,fragmentShader:e,transparent:!0});return new V(new b(1,1,1),t)};return A(()=>{const n=i.value,e=l.value,t=e.clientWidth,a=e.clientHeight,o=_(),g=w(t/a),r=p(n,t,a),y=h();o.add(y);const d=()=>{r.render(o,g),c=window.requestAnimationFrame(d)};d(),P(()=>{r.dispose(),r.forceContextLoss(),o.traverse(m=>{if(m instanceof C){const{geometry:f,material:s}=m;f&&f.dispose();const x=Array.isArray(s)?s:[s];for(const u of x)u&&u.dispose()}}),window.cancelAnimationFrame(c)})}),(n,e)=>(U(),B("div",{ref_key:"containerElementRef",ref:l,class:"container"},[F("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},j=k(L,[["__scopeId","data-v-bca59d33"]]);export{j as default};
