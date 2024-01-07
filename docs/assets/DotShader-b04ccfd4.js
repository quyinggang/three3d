import{O as M,ah as R,y as u,m as z,ad as D,z as F,af as b,aE as k,C as A}from"./three.module-b50c6fca.js";import{O}from"./OrbitControls-a97fbd6e.js";import{_ as G,r as p,o as L,a as W,b as V,c as j,d as q}from"./index-965901d4.js";const H={__name:"DotShader",setup(I){let c=null;const i=p(null),l=p(null),w=()=>{const o=`
			void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // gl_PointSize表示顶点大小，mvPosition.z参入计算则实现近大远小效果
        gl_PointSize = 0.2 * (600.0 / -mvPosition.z);
				gl_Position = projectionMatrix * mvPosition;
			}
  `,e=`
      uniform vec3 color;

			void main() {
        // 当片元与顶点中心点距离大于0.5则丢弃，从而实现顶点圆形，适用于Points绘制方式
        // 也可以判断透明度小于某个限定值，直接丢弃
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5 ) discard;
        gl_FragColor = vec4(color, 1.0);
			}
  `;return new k({uniforms:{color:{value:new A("#FF0000")}},vertexShader:o,fragmentShader:e})},h=()=>{const o=new R(4,4,4,10,10,10),e=new u(o,new z({color:"#FF0000",size:.2}));e.position.set(-3,0,0);const t=w(),n=new u(o,t);return n.position.set(3,0,0),[e,n]},x=()=>new D,P=o=>{const e=new F(45,o,1,1e3);return e.position.set(0,4,18),e.lookAt(0,0,0),e},g=(o,e,t)=>{const n=new b({canvas:o,antialias:!0});return n.setSize(e,t),n.setPixelRatio(window.devicePixelRatio),n},S=(o,e)=>{const t=new O(o,e);return t.minDistance=6,t.maxDistance=40,t};return L(()=>{const o=i.value,e=l.value,t=e.clientWidth,n=e.clientHeight,a=x(),d=P(t/n),r=g(o,t,n),y=S(d,r.domElement),[C,E]=h();a.add(C),a.add(E);const m=()=>{y.update(),r.render(a,d),c=window.requestAnimationFrame(m)};m(),W(()=>{r.dispose(),r.forceContextLoss(),a.traverse(_=>{if(_ instanceof M){const{geometry:f,material:s}=_;f&&f.dispose();const B=Array.isArray(s)?s:[s];for(const v of B)v&&v.dispose()}}),window.cancelAnimationFrame(c)})}),(o,e)=>(V(),j("div",{ref_key:"containerElementRef",ref:l,class:"container"},[q("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},K=G(H,[["__scopeId","data-v-ae237d38"]]);export{K as default};
