import{ai as Tt,g as c,O as ht,Q as L,f as yt,M as pt,o as Xt,at as S,ah as b,s as wt,au as _t,u as s,av as ot,w as O,aw as zt,ax as N,aa as Lt,q as Ht,ay as Zt,I as Ot,az as Dt,aA as kt,aB as jt,R as vt,U as Ct,G as Rt,ap as Ft,x as qt,ad as Gt,z as Wt,af as Nt,V as Bt}from"./three.module-8787a522.js";import{O as Ut}from"./OrbitControls-8109a5ff.js";import{_ as Vt,r as gt,o as $t,a as Jt,b as Kt,c as te,d as Qt,p as ee,e as ne}from"./index-57a9dfb5.js";const C=new Tt,E=new c,D=new c,f=new L,bt={X:new c(1,0,0),Y:new c(0,1,0),Z:new c(0,0,1)},mt={type:"change"},Pt={type:"mouseDown"},St={type:"mouseUp",mode:null},Mt={type:"objectChange"};class ie extends ht{constructor(e,i){super(),i===void 0&&(console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'),i=document),this.isTransformControls=!0,this.visible=!1,this.domElement=i,this.domElement.style.touchAction="none";const n=new ce;this._gizmo=n,this.add(n);const o=new he;this._plane=o,this.add(o);const r=this;function t(m,g){let Q=g;Object.defineProperty(r,m,{get:function(){return Q!==void 0?Q:g},set:function(A){Q!==A&&(Q=A,o[m]=A,n[m]=A,r.dispatchEvent({type:m+"-changed",value:A}),r.dispatchEvent(mt))}}),r[m]=g,o[m]=g,n[m]=g}t("camera",e),t("object",void 0),t("enabled",!0),t("axis",null),t("mode","translate"),t("translationSnap",null),t("rotationSnap",null),t("scaleSnap",null),t("space","world"),t("size",1),t("dragging",!1),t("showX",!0),t("showY",!0),t("showZ",!0);const l=new c,w=new c,p=new L,d=new L,u=new c,P=new L,I=new c,v=new c,y=new c,_=0,x=new c;t("worldPosition",l),t("worldPositionStart",w),t("worldQuaternion",p),t("worldQuaternionStart",d),t("cameraPosition",u),t("cameraQuaternion",P),t("pointStart",I),t("pointEnd",v),t("rotationAxis",y),t("rotationAngle",_),t("eye",x),this._offset=new c,this._startNorm=new c,this._endNorm=new c,this._cameraScale=new c,this._parentPosition=new c,this._parentQuaternion=new L,this._parentQuaternionInv=new L,this._parentScale=new c,this._worldScaleStart=new c,this._worldQuaternionInv=new L,this._worldScale=new c,this._positionStart=new c,this._quaternionStart=new L,this._scaleStart=new c,this._getPointer=oe.bind(this),this._onPointerDown=ae.bind(this),this._onPointerHover=se.bind(this),this._onPointerMove=re.bind(this),this._onPointerUp=le.bind(this),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp)}updateMatrixWorld(){this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this._parentPosition,this._parentQuaternion,this._parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this._worldScale),this._parentQuaternionInv.copy(this._parentQuaternion).invert(),this._worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this._cameraScale),this.camera.isOrthographicCamera?this.camera.getWorldDirection(this.eye).negate():this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld(this)}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;C.setFromCamera(e,this.camera);const i=ft(this._gizmo.picker[this.mode],C);i?this.axis=i.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e.button!==0)&&this.axis!==null){C.setFromCamera(e,this.camera);const i=ft(this._plane,C,!0);i&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(i.point).sub(this.worldPositionStart)),this.dragging=!0,Pt.mode=this.mode,this.dispatchEvent(Pt)}}pointerMove(e){const i=this.axis,n=this.mode,o=this.object;let r=this.space;if(n==="scale"?r="local":(i==="E"||i==="XYZE"||i==="XYZ")&&(r="world"),o===void 0||i===null||this.dragging===!1||e.button!==-1)return;C.setFromCamera(e,this.camera);const t=ft(this._plane,C,!0);if(t){if(this.pointEnd.copy(t.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&i!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),i.indexOf("X")===-1&&(this._offset.x=0),i.indexOf("Y")===-1&&(this._offset.y=0),i.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&i!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),o.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(o.position.applyQuaternion(f.copy(this._quaternionStart).invert()),i.search("X")!==-1&&(o.position.x=Math.round(o.position.x/this.translationSnap)*this.translationSnap),i.search("Y")!==-1&&(o.position.y=Math.round(o.position.y/this.translationSnap)*this.translationSnap),i.search("Z")!==-1&&(o.position.z=Math.round(o.position.z/this.translationSnap)*this.translationSnap),o.position.applyQuaternion(this._quaternionStart)),r==="world"&&(o.parent&&o.position.add(E.setFromMatrixPosition(o.parent.matrixWorld)),i.search("X")!==-1&&(o.position.x=Math.round(o.position.x/this.translationSnap)*this.translationSnap),i.search("Y")!==-1&&(o.position.y=Math.round(o.position.y/this.translationSnap)*this.translationSnap),i.search("Z")!==-1&&(o.position.z=Math.round(o.position.z/this.translationSnap)*this.translationSnap),o.parent&&o.position.sub(E.setFromMatrixPosition(o.parent.matrixWorld))));else if(n==="scale"){if(i.search("XYZ")!==-1){let l=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(l*=-1),D.set(l,l,l)}else E.copy(this.pointStart),D.copy(this.pointEnd),E.applyQuaternion(this._worldQuaternionInv),D.applyQuaternion(this._worldQuaternionInv),D.divide(E),i.search("X")===-1&&(D.x=1),i.search("Y")===-1&&(D.y=1),i.search("Z")===-1&&(D.z=1);o.scale.copy(this._scaleStart).multiply(D),this.scaleSnap&&(i.search("X")!==-1&&(o.scale.x=Math.round(o.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),i.search("Y")!==-1&&(o.scale.y=Math.round(o.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),i.search("Z")!==-1&&(o.scale.z=Math.round(o.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const l=20/this.worldPosition.distanceTo(E.setFromMatrixPosition(this.camera.matrixWorld));i==="E"?(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1):i==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(E.copy(this.rotationAxis).cross(this.eye))*l):(i==="X"||i==="Y"||i==="Z")&&(this.rotationAxis.copy(bt[i]),E.copy(bt[i]),r==="local"&&E.applyQuaternion(this.worldQuaternion),this.rotationAngle=this._offset.dot(E.cross(this.eye).normalize())*l),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&i!=="E"&&i!=="XYZE"?(o.quaternion.copy(this._quaternionStart),o.quaternion.multiply(f.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),o.quaternion.copy(f.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),o.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(mt),this.dispatchEvent(Mt)}}pointerUp(e){e.button===0&&(this.dragging&&this.axis!==null&&(St.mode=this.mode,this.dispatchEvent(St)),this.dragging=!1,this.axis=null)}dispose(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}attach(e){return this.object=e,this.visible=!0,this}detach(){return this.object=void 0,this.visible=!1,this.axis=null,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(mt),this.dispatchEvent(Mt),this.pointStart.copy(this.pointEnd))}getRaycaster(){return C}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}}function oe(a){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:a.button};{const e=this.domElement.getBoundingClientRect();return{x:(a.clientX-e.left)/e.width*2-1,y:-(a.clientY-e.top)/e.height*2+1,button:a.button}}}function se(a){if(this.enabled)switch(a.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(a));break}}function ae(a){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(a.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(a)),this.pointerDown(this._getPointer(a)))}function re(a){this.enabled&&this.pointerMove(this._getPointer(a))}function le(a){this.enabled&&(this.domElement.releasePointerCapture(a.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(a)))}function ft(a,e,i){const n=e.intersectObject(a,!0);for(let o=0;o<n.length;o++)if(n[o].object.visible||i)return n[o];return!1}const st=new Zt,h=new c(0,1,0),Et=new c(0,0,0),It=new yt,at=new L,ct=new L,z=new c,At=new yt,V=new c(1,0,0),R=new c(0,1,0),$=new c(0,0,1),rt=new c,B=new c,U=new c;class ce extends ht{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new pt({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=new Xt({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=e.clone();n.opacity=.15;const o=i.clone();o.opacity=.5;const r=e.clone();r.color.setHex(16711680);const t=e.clone();t.color.setHex(65280);const l=e.clone();l.color.setHex(255);const w=e.clone();w.color.setHex(16711680),w.opacity=.5;const p=e.clone();p.color.setHex(65280),p.opacity=.5;const d=e.clone();d.color.setHex(255),d.opacity=.5;const u=e.clone();u.opacity=.25;const P=e.clone();P.color.setHex(16776960),P.opacity=.25,e.clone().color.setHex(16776960);const v=e.clone();v.color.setHex(7895160);const y=new S(0,.04,.1,12);y.translate(0,.05,0);const _=new b(.08,.08,.08);_.translate(0,.04,0);const x=new wt;x.setAttribute("position",new _t([0,0,0,1,0,0],3));const m=new S(.0075,.0075,.5,3);m.translate(0,.25,0);function g(X,tt){const Y=new N(X,.0075,3,64,tt*Math.PI*2);return Y.rotateY(Math.PI/2),Y.rotateX(Math.PI/2),Y}function Q(){const X=new wt;return X.setAttribute("position",new _t([0,0,0,1,1,1],3)),X}const A={X:[[new s(y,r),[.5,0,0],[0,0,-Math.PI/2]],[new s(y,r),[-.5,0,0],[0,0,Math.PI/2]],[new s(m,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new s(y,t),[0,.5,0]],[new s(y,t),[0,-.5,0],[Math.PI,0,0]],[new s(m,t)]],Z:[[new s(y,l),[0,0,.5],[Math.PI/2,0,0]],[new s(y,l),[0,0,-.5],[-Math.PI/2,0,0]],[new s(m,l),null,[Math.PI/2,0,0]]],XYZ:[[new s(new ot(.1,0),u.clone()),[0,0,0]]],XY:[[new s(new b(.15,.15,.01),d.clone()),[.15,.15,0]]],YZ:[[new s(new b(.15,.15,.01),w.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new s(new b(.15,.15,.01),p.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},W={X:[[new s(new S(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new s(new S(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new s(new S(.2,0,.6,4),n),[0,.3,0]],[new s(new S(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new s(new S(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new s(new S(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new s(new ot(.2,0),n)]],XY:[[new s(new b(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new s(new b(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new s(new b(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},dt={START:[[new s(new ot(.01,2),o),null,null,null,"helper"]],END:[[new s(new ot(.01,2),o),null,null,null,"helper"]],DELTA:[[new O(Q(),o),null,null,null,"helper"]],X:[[new O(x,o.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new O(x,o.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new O(x,o.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},J={XYZE:[[new s(g(.5,1),v),null,[0,Math.PI/2,0]]],X:[[new s(g(.5,.5),r)]],Y:[[new s(g(.5,.5),t),null,[0,0,-Math.PI/2]]],Z:[[new s(g(.5,.5),l),null,[0,Math.PI/2,0]]],E:[[new s(g(.75,1),P),null,[0,Math.PI/2,0]]]},K={AXIS:[[new O(x,o.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},Z={XYZE:[[new s(new zt(.25,10,8),n)]],X:[[new s(new N(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new s(new N(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new s(new N(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new s(new N(.75,.1,2,24),n)]]},k={X:[[new s(_,r),[.5,0,0],[0,0,-Math.PI/2]],[new s(m,r),[0,0,0],[0,0,-Math.PI/2]],[new s(_,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new s(_,t),[0,.5,0]],[new s(m,t)],[new s(_,t),[0,-.5,0],[0,0,Math.PI]]],Z:[[new s(_,l),[0,0,.5],[Math.PI/2,0,0]],[new s(m,l),[0,0,0],[Math.PI/2,0,0]],[new s(_,l),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new s(new b(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new s(new b(.15,.15,.01),w),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new s(new b(.15,.15,.01),p),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new s(new b(.1,.1,.1),u.clone())]]},j={X:[[new s(new S(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new s(new S(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new s(new S(.2,0,.6,4),n),[0,.3,0]],[new s(new S(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new s(new S(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new s(new S(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new s(new b(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new s(new b(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new s(new b(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new s(new b(.2,.2,.2),n),[0,0,0]]]},ut={X:[[new O(x,o.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new O(x,o.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new O(x,o.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function T(X){const tt=new ht;for(const Y in X)for(let F=X[Y].length;F--;){const M=X[Y][F][0].clone(),et=X[Y][F][1],nt=X[Y][F][2],it=X[Y][F][3],Yt=X[Y][F][4];M.name=Y,M.tag=Yt,et&&M.position.set(et[0],et[1],et[2]),nt&&M.rotation.set(nt[0],nt[1],nt[2]),it&&M.scale.set(it[0],it[1],it[2]),M.updateMatrix();const xt=M.geometry.clone();xt.applyMatrix4(M.matrix),M.geometry=xt,M.renderOrder=1/0,M.position.set(0,0,0),M.rotation.set(0,0,0),M.scale.set(1,1,1),tt.add(M)}return tt}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=T(A)),this.add(this.gizmo.rotate=T(J)),this.add(this.gizmo.scale=T(k)),this.add(this.picker.translate=T(W)),this.add(this.picker.rotate=T(Z)),this.add(this.picker.scale=T(j)),this.add(this.helper.translate=T(dt)),this.add(this.helper.rotate=T(K)),this.add(this.helper.scale=T(ut)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:ct;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let o=[];o=o.concat(this.picker[this.mode].children),o=o.concat(this.gizmo[this.mode].children),o=o.concat(this.helper[this.mode].children);for(let r=0;r<o.length;r++){const t=o[r];t.visible=!0,t.rotation.set(0,0,0),t.position.copy(this.worldPosition);let l;if(this.camera.isOrthographicCamera?l=(this.camera.top-this.camera.bottom)/this.camera.zoom:l=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),t.scale.set(1,1,1).multiplyScalar(l*this.size/4),t.tag==="helper"){t.visible=!1,t.name==="AXIS"?(t.visible=!!this.axis,this.axis==="X"&&(f.setFromEuler(st.set(0,0,0)),t.quaternion.copy(n).multiply(f),Math.abs(h.copy(V).applyQuaternion(n).dot(this.eye))>.9&&(t.visible=!1)),this.axis==="Y"&&(f.setFromEuler(st.set(0,0,Math.PI/2)),t.quaternion.copy(n).multiply(f),Math.abs(h.copy(R).applyQuaternion(n).dot(this.eye))>.9&&(t.visible=!1)),this.axis==="Z"&&(f.setFromEuler(st.set(0,Math.PI/2,0)),t.quaternion.copy(n).multiply(f),Math.abs(h.copy($).applyQuaternion(n).dot(this.eye))>.9&&(t.visible=!1)),this.axis==="XYZE"&&(f.setFromEuler(st.set(0,Math.PI/2,0)),h.copy(this.rotationAxis),t.quaternion.setFromRotationMatrix(It.lookAt(Et,h,R)),t.quaternion.multiply(f),t.visible=this.dragging),this.axis==="E"&&(t.visible=!1)):t.name==="START"?(t.position.copy(this.worldPositionStart),t.visible=this.dragging):t.name==="END"?(t.position.copy(this.worldPosition),t.visible=this.dragging):t.name==="DELTA"?(t.position.copy(this.worldPositionStart),t.quaternion.copy(this.worldQuaternionStart),E.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),E.applyQuaternion(this.worldQuaternionStart.clone().invert()),t.scale.copy(E),t.visible=this.dragging):(t.quaternion.copy(n),this.dragging?t.position.copy(this.worldPositionStart):t.position.copy(this.worldPosition),this.axis&&(t.visible=this.axis.search(t.name)!==-1));continue}t.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(t.name==="X"&&Math.abs(h.copy(V).applyQuaternion(n).dot(this.eye))>.99&&(t.scale.set(1e-10,1e-10,1e-10),t.visible=!1),t.name==="Y"&&Math.abs(h.copy(R).applyQuaternion(n).dot(this.eye))>.99&&(t.scale.set(1e-10,1e-10,1e-10),t.visible=!1),t.name==="Z"&&Math.abs(h.copy($).applyQuaternion(n).dot(this.eye))>.99&&(t.scale.set(1e-10,1e-10,1e-10),t.visible=!1),t.name==="XY"&&Math.abs(h.copy($).applyQuaternion(n).dot(this.eye))<.2&&(t.scale.set(1e-10,1e-10,1e-10),t.visible=!1),t.name==="YZ"&&Math.abs(h.copy(V).applyQuaternion(n).dot(this.eye))<.2&&(t.scale.set(1e-10,1e-10,1e-10),t.visible=!1),t.name==="XZ"&&Math.abs(h.copy(R).applyQuaternion(n).dot(this.eye))<.2&&(t.scale.set(1e-10,1e-10,1e-10),t.visible=!1)):this.mode==="rotate"&&(at.copy(n),h.copy(this.eye).applyQuaternion(f.copy(n).invert()),t.name.search("E")!==-1&&t.quaternion.setFromRotationMatrix(It.lookAt(this.eye,Et,R)),t.name==="X"&&(f.setFromAxisAngle(V,Math.atan2(-h.y,h.z)),f.multiplyQuaternions(at,f),t.quaternion.copy(f)),t.name==="Y"&&(f.setFromAxisAngle(R,Math.atan2(h.x,h.z)),f.multiplyQuaternions(at,f),t.quaternion.copy(f)),t.name==="Z"&&(f.setFromAxisAngle($,Math.atan2(h.y,h.x)),f.multiplyQuaternions(at,f),t.quaternion.copy(f))),t.visible=t.visible&&(t.name.indexOf("X")===-1||this.showX),t.visible=t.visible&&(t.name.indexOf("Y")===-1||this.showY),t.visible=t.visible&&(t.name.indexOf("Z")===-1||this.showZ),t.visible=t.visible&&(t.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),t.material._color=t.material._color||t.material.color.clone(),t.material._opacity=t.material._opacity||t.material.opacity,t.material.color.copy(t.material._color),t.material.opacity=t.material._opacity,this.enabled&&this.axis&&(t.name===this.axis||this.axis.split("").some(function(w){return t.name===w}))&&(t.material.color.setHex(16776960),t.material.opacity=1)}super.updateMatrixWorld(e)}}class he extends s{constructor(){super(new Lt(1e5,1e5,2,2),new pt({visible:!1,wireframe:!0,side:Ht,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let i=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(i="local"),rt.copy(V).applyQuaternion(i==="local"?this.worldQuaternion:ct),B.copy(R).applyQuaternion(i==="local"?this.worldQuaternion:ct),U.copy($).applyQuaternion(i==="local"?this.worldQuaternion:ct),h.copy(B),this.mode){case"translate":case"scale":switch(this.axis){case"X":h.copy(this.eye).cross(rt),z.copy(rt).cross(h);break;case"Y":h.copy(this.eye).cross(B),z.copy(B).cross(h);break;case"Z":h.copy(this.eye).cross(U),z.copy(U).cross(h);break;case"XY":z.copy(U);break;case"YZ":z.copy(rt);break;case"XZ":h.copy(U),z.copy(B);break;case"XYZ":case"E":z.set(0,0,0);break}break;case"rotate":default:z.set(0,0,0)}z.length()===0?this.quaternion.copy(this.cameraQuaternion):(At.lookAt(E.set(0,0,0),z,h),this.quaternion.setFromRotationMatrix(At)),super.updateMatrixWorld(e)}}const q=4,G=1024,H=4;function pe(a=1){const e=new Float32Array(G*H*a*q),i=new Dt(e,G,H*a,kt,jt);return i.wrapS=vt,i.wrapY=vt,i.magFilter=Ct,i.needsUpdate=!0,i}function de(a,e,i=0){const n=Math.floor(G*(H/4));e.arcLengthDivisions=n/2,e.updateArcLengths();const o=e.getSpacedPoints(n),r=e.computeFrenetFrames(n,!0);for(let t=0;t<n;t++){const l=Math.floor(t/G),w=t%G;let p=o[t];lt(a,w,p.x,p.y,p.z,0+l+H*i),p=r.tangents[t],lt(a,w,p.x,p.y,p.z,1+l+H*i),p=r.normals[t],lt(a,w,p.x,p.y,p.z,2+l+H*i),p=r.binormals[t],lt(a,w,p.x,p.y,p.z,3+l+H*i)}a.needsUpdate=!0}function lt(a,e,i,n,o,r){const t=a.image,{data:l}=t,w=q*G*r;l[e*q+w+0]=i,l[e*q+w+1]=n,l[e*q+w+2]=o,l[e*q+w+3]=1}function ue(a){return{spineTexture:{value:a},pathOffset:{type:"f",value:0},pathSegment:{type:"f",value:1},spineOffset:{type:"f",value:161},spineLength:{type:"f",value:400},flow:{type:"i",value:1}}}function me(a,e,i=1){a.__ok||(a.__ok=!0,a.onBeforeCompile=n=>{if(n.__modified)return;n.__modified=!0,Object.assign(n.uniforms,e);const o=`
		uniform sampler2D spineTexture;
		uniform float pathOffset;
		uniform float pathSegment;
		uniform float spineOffset;
		uniform float spineLength;
		uniform int flow;

		float textureLayers = ${H*i}.;
		float textureStacks = ${H/4}.;

		${n.vertexShader}
		`.replace("#include <beginnormal_vertex>","").replace("#include <defaultnormal_vertex>","").replace("#include <begin_vertex>","").replace(/void\s*main\s*\(\)\s*\{/,`
void main() {
#include <beginnormal_vertex>

vec4 worldPos = modelMatrix * vec4(position, 1.);

bool bend = flow > 0;
float xWeight = bend ? 0. : 1.;

#ifdef USE_INSTANCING
float pathOffsetFromInstanceMatrix = instanceMatrix[3][2];
float spineLengthFromInstanceMatrix = instanceMatrix[3][0];
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLengthFromInstanceMatrix : 0.;
float mt = (spinePortion * pathSegment + pathOffset + pathOffsetFromInstanceMatrix)*textureStacks;
#else
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLength : 0.;
float mt = (spinePortion * pathSegment + pathOffset)*textureStacks;
#endif

mt = mod(mt, textureStacks);
float rowOffset = floor(mt);

#ifdef USE_INSTANCING
rowOffset += instanceMatrix[3][1] * ${H}.;
#endif

vec3 spinePos = texture2D(spineTexture, vec2(mt, (0. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 a =        texture2D(spineTexture, vec2(mt, (1. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 b =        texture2D(spineTexture, vec2(mt, (2. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 c =        texture2D(spineTexture, vec2(mt, (3. + rowOffset + 0.5) / textureLayers)).xyz;
mat3 basis = mat3(a, b, c);

vec3 transformed = basis
	* vec3(worldPos.x * xWeight, worldPos.y * 1., worldPos.z * 1.)
	+ spinePos;

vec3 transformedNormal = normalMatrix * (basis * objectNormal);
			`).replace("#include <project_vertex>",`vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
				gl_Position = projectionMatrix * mvPosition;`);n.vertexShader=o})}class fe{constructor(e,i=1){const n=e.clone(),o=pe(i),r=ue(o);n.traverse(function(t){(t instanceof s||t instanceof Ot)&&(t.material=t.material.clone(),me(t.material,r,i))}),this.curveArray=new Array(i),this.curveLengthArray=new Array(i),this.object3D=n,this.splineTexure=o,this.uniforms=r}updateCurve(e,i){if(e>=this.curveArray.length)throw Error("Index out of range for Flow");const n=i.getLength();this.uniforms.spineLength.value=n,this.curveLengthArray[e]=n,this.curveArray[e]=i,de(this.splineTexure,i,e)}moveAlongCurve(e){this.uniforms.pathOffset.value+=e}}new yt;const we=a=>(ee("data-v-bade6b9f"),a=a(),ne(),a),ye=we(()=>Qt("span",{class:"tip"},"点击方块实现路线调整",-1)),xe={__name:"CurveMotion",setup(a){const e=gt(null),i=gt(null);let n=null;const o=()=>{const d=new Rt,u=[{x:1,y:0,z:-1},{x:1,y:0,z:1},{x:-1,y:0,z:1},{x:-1,y:0,z:-1}],P=new b(.1,.1,.1),I=new pt;for(const x of u){const m=new s(P,I);m.position.copy(x),d.add(m)}const v=new Ft(d.children.map(x=>x.position),!0);v.curveType="centripetal";const y=v.getPoints(50),_=new qt(new wt().setFromPoints(y),new Xt({color:65280}));return[d,_,v]},r=()=>{const d=new S(.05,.05,.2,32,32);d.rotateX(Math.PI/2),d.rotateY(Math.PI/2);const u=new pt({color:16776960});return new s(d,u)},t=()=>new Gt,l=d=>{const u=new Wt(45,d,.1,1e3);return u.position.set(2,4,3),u.lookAt(0,0,0),u},w=(d,u,P)=>{const I=new Nt({canvas:d,antialias:!0});return I.setSize(u,P),I.setPixelRatio(window.devicePixelRatio),I},p=d=>{const{containerElement:u,camera:P,objects:I,callback:v}=d,y=u.getBoundingClientRect(),_=new Tt,x=new Bt,m=g=>{x.x=(g.clientX-y.left)/y.width*2-1,x.y=-((g.clientY-y.top)/y.height)*2+1,_.setFromCamera(x,P);const Q=_.intersectObjects(I);Q.length>0&&v&&v(Q[0].object)};return u.addEventListener("click",m),()=>u.removeEventListener("click",m)};return $t(()=>{const d=e.value,u=i.value,P=u.clientWidth,I=u.clientHeight,v=t(),y=l(P/I),_=w(d,P,I),[x,m,g]=o();v.add(x),v.add(m);const Q=r(),A=new fe(Q);A.updateCurve(0,g),v.add(A.object3D);const W=new ie(y,_.domElement);W.addEventListener("dragging-changed",function(Z){const k=Z.value;if(!k){const j=g.getPoints(50);m.geometry.setFromPoints(j),A.updateCurve(0,g)}J.enabled=!k}),v.add(W);const dt=p({camera:y,containerElement:u,objects:x.children,callback:Z=>{W.attach(Z)}}),J=new Ut(y,_.domElement),K=()=>{J.update(),A&&A.moveAlongCurve(.002),_.render(v,y),n=window.requestAnimationFrame(K)};K(),Jt(()=>{dt(),_.dispose(),_.forceContextLoss(),v.traverse(Z=>{if(Z instanceof ht){const{geometry:k,material:j}=Z;k&&k.dispose();const ut=Array.isArray(j)?j:[j];for(const T of ut)T&&T.dispose()}}),window.cancelAnimationFrame(n)})}),(d,u)=>(Kt(),te("div",{ref_key:"containerElementRef",ref:i,class:"container"},[ye,Qt("canvas",{ref_key:"canvasElementRef",ref:e},null,512)],512))}},be=Vt(xe,[["__scopeId","data-v-bade6b9f"]]);export{be as default};