import{O as B,ad as D,z as P,af as b,aE as p,C as _,q as h,u as g,aa as w,V as k}from"./three.module-b50c6fca.js";import{O}from"./OrbitControls-a97fbd6e.js";import{_ as G,r as x,o as L,a as W,b as j,c as q,d as z}from"./index-965901d4.js";const H={__name:"FragUVShader",setup(I){let i=null;const l=x(null),u=x(null),y=()=>new D,C=e=>{const t=new P(45,e,1,1e3);return t.position.set(0,0,4),t.lookAt(0,0,0),t},R=(e,t,n)=>{const o=new b({canvas:e,antialias:!0});return o.setSize(t,n),o.setPixelRatio(window.devicePixelRatio),o},S=(e,t)=>{const n=new O(e,t);return n.minDistance=6,n.maxDistance=40,n},V=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uColor;

    varying vec2 vUV;

    float circle(vec2 position, vec2 center, float radius) {
      float distance = length(position - center);
      return distance <= radius ? 1.0 : 0.0;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float opacity = circle(vUV, center, 0.5);
      gl_FragColor = vec4(uColor, opacity);
    }
  `,n=new p({uniforms:{uColor:{value:new _("#BA55D3")}},vertexShader:e,fragmentShader:t,transparent:!0,side:h}),o=new g(new w(1,1,1),n);return o.position.set(-1,0,0),o},E=(e,t)=>{const n=`
			void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform vec2 uResolution;

    void main() {
      // 将屏幕坐标转换成[-1, 1]范围，原点在屏幕中心，但实际上不规则的长宽比会导致只有最短距离的坐标系范围满足[-1, 1]，另外的会超出这个范围
      vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

      // 这种方式是将屏幕坐标转换成[0, 1]范围内原点在左下角的坐标系
      // vec2 uv = gl_FragCoord.xy  / uResolution;

      float radius = length(uv);
      float opacity = radius <= 0.3 ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor, opacity);
    }
  `,a=new p({uniforms:{uColor:{value:new _("#BA55D3")},uResolution:{value:new k(e,t)}},vertexShader:n,fragmentShader:o,transparent:!0,side:h}),r=new g(new w(1,1,1),a);return r.position.set(1,0,0),r};return L(()=>{const e=l.value,t=u.value,n=t.clientWidth,o=t.clientHeight,a=y(),r=C(n/o),s=R(e,n,o),F=S(r,s.domElement),M=V();a.add(M);const U=E(e.width,e.height);a.add(U);const d=()=>{F.update(),s.render(a,r),i=window.requestAnimationFrame(d)};d(),W(()=>{s.dispose(),s.forceContextLoss(),a.traverse(m=>{if(m instanceof B){const{geometry:v,material:c}=m;v&&v.dispose();const A=Array.isArray(c)?c:[c];for(const f of A)f&&f.dispose()}}),window.cancelAnimationFrame(i)})}),(e,t)=>(j(),q("div",{ref_key:"containerElementRef",ref:u,class:"container"},[z("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},Q=G(H,[["__scopeId","data-v-74aa0378"]]);export{Q as default};
