import{a6 as j,g as v,aR as te,au as N,aS as H,a1 as L,aT as ne,a7 as K,V as ie,aF as Q,aU as O,aE as se,aV as C,aW as P,f as oe,aX as re,u as ae,A as ce,O as le,ad as de,z as fe,af as ue,ap as pe}from"./three.module-b50c6fca.js";import{O as me}from"./OrbitControls-a97fbd6e.js";import{_ as he,r as V,o as ve,a as ge,b as ye,c as Se,d as we}from"./index-965901d4.js";const k=new j,B=new v;class Y extends te{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new N(e,3)),this.setAttribute("uv",new N(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new H(t,6,1);return this.setAttribute("instanceStart",new L(i,3,0)),this.setAttribute("instanceEnd",new L(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new H(t,6,1);return this.setAttribute("instanceColorStart",new L(i,3,0)),this.setAttribute("instanceColorEnd",new L(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new ne(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new j);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),k.setFromBufferAttribute(t),this.boundingBox.union(k))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new K),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let a=0,d=e.count;a<d;a++)B.fromBufferAttribute(e,a),n=Math.max(n,i.distanceToSquared(B)),B.fromBufferAttribute(t,a),n=Math.max(n,i.distanceToSquared(B));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}O.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ie(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};C.line={uniforms:Q.merge([O.common,O.fog,O.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class G extends se{constructor(e){super({type:"LineMaterial",uniforms:Q.clone(C.line.uniforms),vertexShader:C.line.vertexShader,fragmentShader:C.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const q=new v,X=new v,u=new P,p=new P,S=new P,R=new v,I=new oe,m=new re,J=new v,M=new j,D=new K,w=new P;let x,A;function $(l,e,t){return w.set(0,0,-e,1).applyMatrix4(l.projectionMatrix),w.multiplyScalar(1/w.w),w.x=A/t.width,w.y=A/t.height,w.applyMatrix4(l.projectionMatrixInverse),w.multiplyScalar(1/w.w),Math.abs(Math.max(w.x,w.y))}function xe(l,e){const t=l.matrixWorld,i=l.geometry,n=i.attributes.instanceStart,a=i.attributes.instanceEnd,d=Math.min(i.instanceCount,n.count);for(let s=0,h=d;s<h;s++){m.start.fromBufferAttribute(n,s),m.end.fromBufferAttribute(a,s),m.applyMatrix4(t);const r=new v,o=new v;x.distanceSqToSegment(m.start,m.end,o,r),o.distanceTo(r)<A*.5&&e.push({point:o,pointOnLine:r,distance:x.origin.distanceTo(o),object:l,face:null,faceIndex:s,uv:null,uv1:null})}}function be(l,e,t){const i=e.projectionMatrix,a=l.material.resolution,d=l.matrixWorld,s=l.geometry,h=s.attributes.instanceStart,r=s.attributes.instanceEnd,o=Math.min(s.instanceCount,h.count),c=-e.near;x.at(1,S),S.w=1,S.applyMatrix4(e.matrixWorldInverse),S.applyMatrix4(i),S.multiplyScalar(1/S.w),S.x*=a.x/2,S.y*=a.y/2,S.z=0,R.copy(S),I.multiplyMatrices(e.matrixWorldInverse,d);for(let f=0,E=o;f<E;f++){if(u.fromBufferAttribute(h,f),p.fromBufferAttribute(r,f),u.w=1,p.w=1,u.applyMatrix4(I),p.applyMatrix4(I),u.z>c&&p.z>c)continue;if(u.z>c){const b=u.z-p.z,y=(u.z-c)/b;u.lerp(p,y)}else if(p.z>c){const b=p.z-u.z,y=(p.z-c)/b;p.lerp(u,y)}u.applyMatrix4(i),p.applyMatrix4(i),u.multiplyScalar(1/u.w),p.multiplyScalar(1/p.w),u.x*=a.x/2,u.y*=a.y/2,p.x*=a.x/2,p.y*=a.y/2,m.start.copy(u),m.start.z=0,m.end.copy(p),m.end.z=0;const g=m.closestPointToPointParameter(R,!0);m.at(g,J);const _=ce.lerp(u.z,p.z,g),T=_>=-1&&_<=1,U=R.distanceTo(J)<A*.5;if(T&&U){m.start.fromBufferAttribute(h,f),m.end.fromBufferAttribute(r,f),m.start.applyMatrix4(d),m.end.applyMatrix4(d);const b=new v,y=new v;x.distanceSqToSegment(m.start,m.end,y,b),t.push({point:y,pointOnLine:b,distance:x.origin.distanceTo(y),object:l,face:null,faceIndex:f,uv:null,uv1:null})}}}class _e extends ae{constructor(e=new Y,t=new G({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let d=0,s=0,h=t.count;d<h;d++,s+=2)q.fromBufferAttribute(t,d),X.fromBufferAttribute(i,d),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+q.distanceTo(X);const a=new H(n,2,1);return e.setAttribute("instanceDistanceStart",new L(a,1,0)),e.setAttribute("instanceDistanceEnd",new L(a,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const a=e.params.Line2!==void 0&&e.params.Line2.threshold||0;x=e.ray;const d=this.matrixWorld,s=this.geometry,h=this.material;A=h.linewidth+a,s.boundingSphere===null&&s.computeBoundingSphere(),D.copy(s.boundingSphere).applyMatrix4(d);let r;if(i)r=A*.5;else{const c=Math.max(n.near,D.distanceToPoint(x.origin));r=$(n,c,h.resolution)}if(D.radius+=r,x.intersectsSphere(D)===!1)return;s.boundingBox===null&&s.computeBoundingBox(),M.copy(s.boundingBox).applyMatrix4(d);let o;if(i)o=A*.5;else{const c=Math.max(n.near,M.distanceToPoint(x.origin));o=$(n,c,h.resolution)}M.expandByScalar(o),x.intersectsBox(M)!==!1&&(i?xe(this,t):be(this,n,t))}}class Z extends Y{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setColors(i),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class Ee extends _e{constructor(e=new Z,t=new G({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const Ae={__name:"LineWidthScene",setup(l){let e=null;const t=V(null),i=V(null),n=()=>new de,a=r=>{const o=new fe(45,r,1,1e3);return o.position.set(0,6,10),o.lookAt(0,0,0),o},d=(r,o,c)=>{const f=new ue({canvas:r,antialias:!0});return f.setSize(o,c),f.setPixelRatio(window.devicePixelRatio),f},s=(r,o)=>new me(r,o),h=()=>{const r=[new v(-3,0,0),new v(-1,0,0),new v(0,0,2),new v(-2,0,2)],c=new pe(r).getPoints(100),f=[];for(const _ of c)f.push(_.x,_.y,_.z);const E=new Z().setPositions(f),z=new G({color:"#FF0000",linewidth:8});z.resolution.set(window.innerWidth,window.innerHeight);const g=new Ee(E,z);return g.computeLineDistances(),g};return ve(()=>{const r=t.value,o=i.value,c=o.clientWidth,f=o.clientHeight,E=n(),z=a(c/f),g=d(r,c,f),_=s(z,g.domElement),T=h();E.add(T);const U=()=>{_.update(),g.render(E,z),e=window.requestAnimationFrame(U)};U(),ge(()=>{g.dispose(),g.forceContextLoss(),E.traverse(b=>{if(b instanceof le){const{geometry:y,material:W}=b;y&&y.dispose();const ee=Array.isArray(W)?W:[W];for(const F of ee)F&&F.dispose()}}),window.cancelAnimationFrame(e)})}),(r,o)=>(ye(),Se("div",{ref_key:"containerElementRef",ref:i,class:"container"},[we("canvas",{ref_key:"canvasElementRef",ref:t},null,512)],512))}},Be=he(Ae,[["__scopeId","data-v-887e23f9"]]);export{Be as default};
