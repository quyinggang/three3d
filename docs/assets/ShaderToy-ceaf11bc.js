import{O as g,ad as E,z as R,af as P,aE as k,aa as A,u as M}from"./three.module-8f39f104.js";import{_ as B,r as u,o as C,a as b,b as F,c as G,d as L}from"./index-90a11509.js";const T={__name:"ShaderToy",setup(W){let c=null;const i=u(null),l=u(null),p=()=>new E,v=n=>{const e=new R(45,n,.1,100);return e.position.set(0,0,.1),e.lookAt(0,0,0),e},w=(n,e,a)=>{const t=new P({canvas:n,antialias:!0});return t.setSize(e,a),t.setPixelRatio(window.devicePixelRatio),t},h=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,e=`
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,a=new k({vertexShader:n,fragmentShader:e}),t=new A(2,2);return new M(t,a)};return C(()=>{const n=i.value,e=l.value,a=e.clientWidth,t=e.clientHeight,r=p(),y=v(a/t),o=w(n,a,t),x=h();r.add(x);const d=()=>{o.render(r,y),c=window.requestAnimationFrame(d)};d(),b(()=>{o.dispose(),o.forceContextLoss(),r.traverse(m=>{if(m instanceof g){const{geometry:_,material:s}=m;_&&_.dispose();const S=Array.isArray(s)?s:[s];for(const f of S)f&&f.dispose()}}),window.cancelAnimationFrame(c)})}),(n,e)=>(F(),G("div",{ref_key:"containerElementRef",ref:l,class:"container"},[L("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},V=B(T,[["__scopeId","data-v-c506613e"]]);export{V as default};
