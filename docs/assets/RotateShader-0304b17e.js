import{O as F,ad as E,z as M,af as S,aE as b,C as i,u as k,aa as D,ag as V}from"./three.module-b50c6fca.js";import{O as U}from"./OrbitControls-a97fbd6e.js";import{_ as T,r as p,o as z,a as B,b as O,c as G,d as L}from"./index-965901d4.js";const W={__name:"RotateShader",setup(j){let c=null;const l=p(null),d=p(null),_=()=>new E,h=n=>{const t=new M(45,n,1,1e3);return t.position.set(0,0,6),t.lookAt(0,0,0),t},w=(n,t,e)=>{const a=new S({canvas:n,antialias:!0});return a.setSize(t,e),a.setPixelRatio(window.devicePixelRatio),a},I=(n,t)=>{const e=new U(n,t);return e.minDistance=2,e.maxDistance=40,e.minPolarAngle=Math.PI/4,e.maxPolarAngle=Math.PI/2*.96,e.minAzimuthAngle=-Math.PI/4,e.maxAzimuthAngle=Math.PI/4,e},P=()=>{const n=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uColor[3];
    uniform float uTime;

    varying vec2 vUV;

    const float radius = 0.15;
    const float step = 0.015;
    const float speed = 0.5;

    // 旋转矩阵
    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    int getIndex(vec2 uvPosition) {
      // 圆环逻辑，获取圆环层级
      float distance = length(uvPosition);
      int targetIndex = -1;
      for(int index = 1; index <= 3; index++) {
        if (abs(distance - (radius * float(index))) < step) {
          targetIndex = index - 1;
          break;
        }
      }
      return targetIndex;
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      int targetIndex = getIndex(vec2(vUV - center));

      // 旋转逻辑
      float index = float(targetIndex + 1);
      int rotateDirection = mod(index, 2.0) == 0.0 ? -1 : 1;
      float time = float(rotateDirection) * index * speed * uTime;
      vec2 uvPosition = (vUV - center) * rotate2D(time);

      // 圆环间隔
      float angle = abs(degrees(atan(uvPosition.y, uvPosition.x)));
      bool isInRange = (angle >= 15.0 && angle <= 45.0) || (angle >= 75.0 && angle <= 105.0) || (angle >= 135.0 && angle <= 165.0);
      float opacity = targetIndex >= 0 && isInRange ? 1.0 : 0.0;
      gl_FragColor = vec4(uColor[targetIndex], opacity);
    }

  `,e=new b({uniforms:{uColor:{value:[new i("#00FFFF"),new i("#FF00FF"),new i("#DC143C")]},uTime:{value:1}},vertexShader:n,fragmentShader:t,transparent:!0});return new k(new D(1,1,1),e)};return z(()=>{const n=l.value,t=d.value,e=t.clientWidth,a=t.clientHeight,r=_(),m=h(e/a),o=w(n,e,a),C=I(m,o.domElement),u=P();r.add(u);const y=u.material.uniforms,R=new V,f=()=>{C.update(),y.uTime.value=R.getElapsedTime(),o.render(r,m),c=window.requestAnimationFrame(f)};f(),B(()=>{o.dispose(),o.forceContextLoss(),r.traverse(v=>{if(v instanceof F){const{geometry:g,material:s}=v;g&&g.dispose();const A=Array.isArray(s)?s:[s];for(const x of A)x&&x.dispose()}}),window.cancelAnimationFrame(c)})}),(n,t)=>(O(),G("div",{ref_key:"containerElementRef",ref:d,class:"container"},[L("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},J=T(W,[["__scopeId","data-v-569a1ad7"]]);export{J as default};
