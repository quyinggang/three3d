import{O as M,ah as R,y as u,m as b,ad as z,z as D,af as F,aE as k,C as A}from"./three.module-8f39f104.js";import{O}from"./OrbitControls-8206acf3.js";import{_ as G,r as p,o as L,a as W,b as V,c as j,d as q}from"./index-f5e783e1.js";const H={__name:"DotShader",setup(I){let c=null;const i=p(null),l=p(null),w=()=>{const o=`
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
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5 ) discard;
        gl_FragColor = vec4(color, 1.0);
			}
  `;return new k({uniforms:{color:{value:new A("#FF0000")}},vertexShader:o,fragmentShader:e})},h=()=>{const o=new R(4,4,4,10,10,10),e=new u(o,new b({color:"#FF0000",size:.2}));e.position.set(-3,0,0);const t=w(),n=new u(o,t);return n.position.set(3,0,0),[e,n]},x=()=>new z,P=o=>{const e=new D(45,o,1,1e3);return e.position.set(0,4,18),e.lookAt(0,0,0),e},g=(o,e,t)=>{const n=new F({canvas:o,antialias:!0});return n.setSize(e,t),n.setPixelRatio(window.devicePixelRatio),n},S=(o,e)=>{const t=new O(o,e);return t.minDistance=6,t.maxDistance=40,t};return L(()=>{const o=i.value,e=l.value,t=e.clientWidth,n=e.clientHeight,r=x(),d=P(t/n),s=g(o,t,n),y=S(d,s.domElement),[C,E]=h();r.add(C),r.add(E);const m=()=>{y.update(),s.render(r,d),c=window.requestAnimationFrame(m)};m(),W(()=>{s.dispose(),s.forceContextLoss(),r.traverse(f=>{if(f instanceof M){const{geometry:_,material:a}=f;_&&_.dispose();const B=Array.isArray(a)?a:[a];for(const v of B)v&&v.dispose()}}),window.cancelAnimationFrame(c)})}),(o,e)=>(V(),j("div",{ref_key:"containerElementRef",ref:l,class:"container"},[q("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},K=G(H,[["__scopeId","data-v-98bcfcfd"]]);export{K as default};
