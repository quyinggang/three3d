import{O as B,V as ne,g as _,f as W,Q as se,ah as re,u as O,M,G as oe,s as ie,w as le,o as ae,aP as ce,h as de,aQ as me,ad as pe,z as ue,af as fe}from"./three.module-8f39f104.js";import{O as he}from"./OrbitControls-8206acf3.js";import{g as R}from"./util-c747da73.js";import{_ as xe,r as $,o as ye,a as Se,b as we,c as ve,d as be}from"./index-d7540ef8.js";class Ce extends B{constructor(l=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=l,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ne(.5,.5),this.addEventListener("removed",function(){this.traverse(function(a){a.element instanceof Element&&a.element.parentNode!==null&&a.element.parentNode.removeChild(a.element)})})}copy(l,a){return super.copy(l,a),this.element=l.element.cloneNode(!0),this.center=l.center,this}}const g=new _,U=new W,V=new W,Q=new _,Z=new _;class ge{constructor(l={}){const a=this;let f,x,v,w;const u={objects:new WeakMap},p=l.element!==void 0?l.element:document.createElement("div");p.style.overflow="hidden",this.domElement=p,this.getSize=function(){return{width:f,height:x}},this.render=function(o,n){o.matrixWorldAutoUpdate===!0&&o.updateMatrixWorld(),n.parent===null&&n.matrixWorldAutoUpdate===!0&&n.updateMatrixWorld(),U.copy(n.matrixWorldInverse),V.multiplyMatrices(n.projectionMatrix,U),m(o,o,n),C(o)},this.setSize=function(o,n){f=o,x=n,v=f/2,w=x/2,p.style.width=o+"px",p.style.height=n+"px"};function m(o,n,t){if(o.isCSS2DObject){g.setFromMatrixPosition(o.matrixWorld),g.applyMatrix4(V);const e=o.visible===!0&&g.z>=-1&&g.z<=1&&o.layers.test(t.layers)===!0;if(o.element.style.display=e===!0?"":"none",e===!0){o.onBeforeRender(a,n,t);const i=o.element;i.style.transform="translate("+-100*o.center.x+"%,"+-100*o.center.y+"%)translate("+(g.x*v+v)+"px,"+(-g.y*w+w)+"px)",i.parentNode!==p&&p.appendChild(i),o.onAfterRender(a,n,t)}const s={distanceToCameraSquared:h(t,o)};u.objects.set(o,s)}for(let e=0,s=o.children.length;e<s;e++)m(o.children[e],n,t)}function h(o,n){return Q.setFromMatrixPosition(o.matrixWorld),Z.setFromMatrixPosition(n.matrixWorld),Q.distanceToSquared(Z)}function r(o){const n=[];return o.traverse(function(t){t.isCSS2DObject&&n.push(t)}),n}function C(o){const n=r(o).sort(function(e,s){if(e.renderOrder!==s.renderOrder)return s.renderOrder-e.renderOrder;const i=u.objects.get(e).distanceToCameraSquared,c=u.objects.get(s).distanceToCameraSquared;return i-c}),t=n.length;for(let e=0,s=n.length;e<s;e++)n[e].element.style.zIndex=t-e}}}const X=new _,_e=new se,Y=new _;class J extends B{constructor(l=document.createElement("div")){super(),this.isCSS3DObject=!0,this.element=l,this.element.style.position="absolute",this.element.style.pointerEvents="auto",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.addEventListener("removed",function(){this.traverse(function(a){a.element instanceof Element&&a.element.parentNode!==null&&a.element.parentNode.removeChild(a.element)})})}copy(l,a){return super.copy(l,a),this.element=l.element.cloneNode(!0),this}}class De extends J{constructor(l){super(l),this.isCSS3DSprite=!0,this.rotation2D=0}copy(l,a){return super.copy(l,a),this.rotation2D=l.rotation2D,this}}const S=new W,Ee=new W;class Oe{constructor(l={}){const a=this;let f,x,v,w;const u={camera:{fov:0,style:""},objects:new WeakMap},p=l.element!==void 0?l.element:document.createElement("div");p.style.overflow="hidden",this.domElement=p;const m=document.createElement("div");m.style.transformOrigin="0 0",m.style.pointerEvents="none",p.appendChild(m);const h=document.createElement("div");h.style.transformStyle="preserve-3d",m.appendChild(h),this.getSize=function(){return{width:f,height:x}},this.render=function(t,e){const s=e.projectionMatrix.elements[5]*w;u.camera.fov!==s&&(m.style.perspective=e.isPerspectiveCamera?s+"px":"",u.camera.fov=s),e.view&&e.view.enabled?(m.style.transform=`translate( ${-e.view.offsetX*(f/e.view.width)}px, ${-e.view.offsetY*(x/e.view.height)}px )`,m.style.transform+=`scale( ${e.view.fullWidth/e.view.width}, ${e.view.fullHeight/e.view.height} )`):m.style.transform="",t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),e.parent===null&&e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld();let i,c;e.isOrthographicCamera&&(i=-(e.right+e.left)/2,c=(e.top+e.bottom)/2);const d=e.view&&e.view.enabled?e.view.height/e.view.fullHeight:1,b=(e.isOrthographicCamera?`scale( ${d} )scale(`+s+")translate("+r(i)+"px,"+r(c)+"px)"+C(e.matrixWorldInverse):`scale( ${d} )translateZ(`+s+"px)"+C(e.matrixWorldInverse))+"translate("+v+"px,"+w+"px)";u.camera.style!==b&&(h.style.transform=b,u.camera.style=b),n(t,t,e)},this.setSize=function(t,e){f=t,x=e,v=f/2,w=x/2,p.style.width=t+"px",p.style.height=e+"px",m.style.width=t+"px",m.style.height=e+"px",h.style.width=t+"px",h.style.height=e+"px"};function r(t){return Math.abs(t)<1e-10?0:t}function C(t){const e=t.elements;return"matrix3d("+r(e[0])+","+r(-e[1])+","+r(e[2])+","+r(e[3])+","+r(e[4])+","+r(-e[5])+","+r(e[6])+","+r(e[7])+","+r(e[8])+","+r(-e[9])+","+r(e[10])+","+r(e[11])+","+r(e[12])+","+r(-e[13])+","+r(e[14])+","+r(e[15])+")"}function o(t){const e=t.elements;return"translate(-50%,-50%)"+("matrix3d("+r(e[0])+","+r(e[1])+","+r(e[2])+","+r(e[3])+","+r(-e[4])+","+r(-e[5])+","+r(-e[6])+","+r(-e[7])+","+r(e[8])+","+r(e[9])+","+r(e[10])+","+r(e[11])+","+r(e[12])+","+r(e[13])+","+r(e[14])+","+r(e[15])+")")}function n(t,e,s,i){if(t.isCSS3DObject){const c=t.visible===!0&&t.layers.test(s.layers)===!0;if(t.element.style.display=c===!0?"":"none",c===!0){t.onBeforeRender(a,e,s);let d;t.isCSS3DSprite?(S.copy(s.matrixWorldInverse),S.transpose(),t.rotation2D!==0&&S.multiply(Ee.makeRotationZ(t.rotation2D)),t.matrixWorld.decompose(X,_e,Y),S.setPosition(X),S.scale(Y),S.elements[3]=0,S.elements[7]=0,S.elements[11]=0,S.elements[15]=1,d=o(S)):d=o(t.matrixWorld);const y=t.element,b=u.objects.get(t);if(b===void 0||b.style!==d){y.style.transform=d;const E={style:d};u.objects.set(t,E)}y.parentNode!==h&&h.appendChild(y),t.onAfterRender(a,e,s)}}for(let c=0,d=t.children.length;c<d;c++)n(t.children[c],e,s)}}}const Me={__name:"LabelScene",setup(D){let l=null;const a=$(null),f=$(null),x=()=>{const n=new re(1,1,1),t=new O(n,new M({color:R()}));t.position.set(-.5,0,0);const e=new O(n,new M({color:R()}));e.position.set(-2,0,-1);const s=new O(n,new M({color:R()}));s.position.set(2,0,.5);const i=new O(n,new M({color:R()}));return i.position.set(4,0,1.5),[t,e,s,i]},v=n=>{const t=new oe,e=n.clone(),s=[e,new _(e.x+1,e.y+1,e.z)],i=new ie().setFromPoints(s),c=new le(i,new ae({color:"#fff"}));t.add(c);const d=new ce({map:new de().load("src/assets/textures/label/text-image.jpg")}),y=new me(d);return y.scale.set(.6,.3,1),y.position.set(e.x+1,e.y+1,e.z),t.add(y),t},w=()=>{const n=document.createElement("span");return n.textContent="CSS2D标签",n.style.cssText="font-size:14px;color:#fff;",new Ce(n)},u=()=>{const n=document.createElement("span");return n.textContent="CSS3DSprite标签",n.style.cssText="font-size:14px;color:#fff;",new De(n)},p=()=>{const n=document.createElement("span");return n.textContent="CSS3DObject标签",n.style.cssText="font-size:14px;color:#fff;",new J(n)},m=()=>new pe,h=n=>{const t=new ue(45,n,1,1e3);return t.position.set(1,1,10),t.lookAt(0,0,0),t},r=(n,t,e)=>{const s=new fe({canvas:n,antialias:!0});return s.setSize(t,e),s.setPixelRatio(window.devicePixelRatio),s},C=(n,t)=>{const e=new ge,s=e.domElement;return e.setSize(n,t),s.style.position="absolute",s.style.top="0px",document.body.appendChild(s),[e,()=>{document.body.removeChild(s)}]},o=(n,t)=>{const e=new Oe,s=e.domElement;return e.setSize(n,t),s.style.position="absolute",s.style.top="0px",document.body.appendChild(s),[e,()=>{document.body.removeChild(s)}]};return ye(()=>{const n=a.value,t=f.value,e=t.clientWidth,s=t.clientHeight,i=m(),c=h(e/s),d=r(n,e,s),[y,b]=C(e,s),[E,K]=o(e,s),[P,N,T,k]=x();i.add(P),i.add(N),i.add(T),i.add(k);const j=v(P.position);i.add(j);const q=w();q.position.set(0,1,0),N.add(q);const z=u();z.position.set(0,1,0),z.scale.set(.018,.018,.018),T.add(z);const A=p();A.position.set(0,1,0),A.scale.set(.018,.018,.018),k.add(A);const ee=new he(c,E.domElement),F=()=>{ee.update(),d.render(i,c),y.render(i,c),E.render(i,c),l=window.requestAnimationFrame(F)};F(),Se(()=>{b(),K(),d.dispose(),d.forceContextLoss(),i.traverse(H=>{if(H instanceof B){const{geometry:G,material:L}=H;G&&G.dispose();const te=Array.isArray(L)?L:[L];for(const I of te)I&&I.dispose()}}),window.cancelAnimationFrame(l)})}),(n,t)=>(we(),ve("div",{ref_key:"containerElementRef",ref:f,class:"container"},[be("canvas",{ref_key:"canvasElementRef",ref:a},null,512)],512))}},Le=xe(Me,[["__scopeId","data-v-08bb6b47"]]);export{Le as default};