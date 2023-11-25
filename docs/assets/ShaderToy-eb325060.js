import{O as g,ad as E,z as R,af as P,aE as b,aa as k,u as A}from"./three.module-8f39f104.js";import{_ as M,r as u,o as B,a as C,b as F,c as G,d as L}from"./index-40ed5397.js";const T={__name:"ShaderToy",setup(W){let c=null;const i=u(null),l=u(null),p=()=>new E,v=n=>{const e=new R(45,n,.1,100);return e.position.set(0,0,.1),e.lookAt(0,0,0),e},w=(n,e,t)=>{const a=new P({canvas:n,antialias:!0});return a.setSize(e,t),a.setPixelRatio(window.devicePixelRatio),a},h=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,e=`
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,t=new b({vertexShader:n,fragmentShader:e}),a=new k(2,2);return new A(a,t)};return B(()=>{const n=i.value,e=l.value,t=e.clientWidth,a=e.clientHeight,r=p(),y=v(t/a),o=w(n,t,a),x=h();r.add(x);const d=()=>{o.render(r,y),c=window.requestAnimationFrame(d)};d(),C(()=>{o.dispose(),o.forceContextLoss(),r.traverse(m=>{if(m instanceof g){const{geometry:_,material:s}=m;_&&_.dispose();const S=Array.isArray(s)?s:[s];for(const f of S)f&&f.dispose()}}),window.cancelAnimationFrame(c)})}),(n,e)=>(F(),G("div",{ref_key:"containerElementRef",ref:l,class:"container"},[L("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},V=M(T,[["__scopeId","data-v-fb9aee2e"]]);export{V as default};
