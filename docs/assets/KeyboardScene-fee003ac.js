import{g as x,ab as I,O as F,u as G,ah as W,M as D,ad as H,ae as O,z as q,af as z,ag as V}from"./three.module-8f39f104.js";import{_ as X,r as g,o as Y,a as Z,b as j,c as N,d as c,p as U,e as J}from"./index-d7540ef8.js";const Q=l=>(U("data-v-695d979a"),l=l(),J(),l),T=Q(()=>c("ul",{class:"info"},[c("li",null,"前进：w"),c("li",null,"后退：s"),c("li",null,"左移：a"),c("li",null,"右移：d"),c("li",null,"左旋：q"),c("li",null,"右旋：e")],-1)),$={__name:"KeyboardScene",setup(l){let w=null;const y=g(null),b=g(null),E={forward:87,back:83,left:65,right:68,leftRotate:81,rightRotate:69},A=()=>new G(new W(1,1,1),new D({color:"#87CEFA"})),R=()=>{const e=new H;return e.fog=new O("#262837",1,20),e},C=(e,n,o)=>{const t=new q(45,e,1,1e3);return t.position.copy(n),t.lookAt(o),t},S=(e,n,o)=>{const t=new z({canvas:e,antialias:!0});return t.setSize(n,o),t.setPixelRatio(window.devicePixelRatio),t},M=(e,n)=>{const o=i=>{e&&e(i)},t=()=>{n&&n()};return document.addEventListener("keydown",o,!1),document.addEventListener("keyup",t,!1),()=>{document.removeEventListener("keydown",o),document.removeEventListener("keyup",t)}};return Y(()=>{const e=y.value,n=b.value,o=n.clientWidth,t=n.clientHeight,i=new x(0,4,10),k=new x(0,0,0);let d=null;const u=R(),_=C(o/t,i,k),v=S(e,o,t),P=M(s=>{d=s.keyCode},()=>{d=null}),a=A();a.position.copy(k),u.add(a);const B=new I(100,100);u.add(B);const L=new V,K=s=>{if(!Object.values(E).includes(d))return;const m=i.clone(),r=5*s,p=Math.PI/2*s;switch(d){case 87:a.translateZ(-r);break;case 83:a.translateZ(r);break;case 65:a.translateX(-r);break;case 68:a.translateX(r);break;case 81:a.rotateY(p);break;case 69:a.rotateY(-p);break}const f=m.applyMatrix4(a.matrixWorld);_.position.copy(f),_.lookAt(a.position)},h=()=>{const s=L.getDelta();K(s),v.render(u,_),w=window.requestAnimationFrame(h)};h(),Z(()=>{P(),v.dispose(),v.forceContextLoss(),u.traverse(s=>{if(s instanceof F){const{geometry:m,material:r}=s;m&&m.dispose();const p=Array.isArray(r)?r:[r];for(const f of p)f&&f.dispose()}}),window.cancelAnimationFrame(w)})}),(e,n)=>(j(),N("div",{ref_key:"containerElementRef",ref:b,class:"container"},[T,c("canvas",{ref_key:"canvasElementRef",ref:y},null,512)],512))}},ne=X($,[["__scopeId","data-v-695d979a"]]);export{ne as default};
