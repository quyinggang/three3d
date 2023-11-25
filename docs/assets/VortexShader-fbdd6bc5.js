import{O as B,ad as D,z as L,af as G,aE as i,C as m,u as s,aa as c,h as W,ag as z}from"./three.module-8f39f104.js";import{_ as O,r as U,o as q,a as H,b as N,c as J,d as K}from"./index-d7540ef8.js";const Q={__name:"VortexShader",setup(X){let v=null;const d=U(null),f=U(null),T=()=>new D,C=o=>{const t=new L(45,o,1,1e3);return t.position.set(0,0,6),t.lookAt(0,0,0),t},y=(o,t,n)=>{const e=new G({canvas:o,antialias:!0});return e.setSize(t,n),e.setPixelRatio(window.devicePixelRatio),e},F=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = fract(position.x * 10.0 + uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new i({uniforms:{uColor:{value:new m("#00FFFF")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(-1.5,1,0),e},M=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    #define PI 3.14159;
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 position = vUV - vec2(0.5);
      float t = atan(position.y, position.x) / PI;
      float ratio = fract(t * 10.0 + uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new i({uniforms:{uColor:{value:new m("#00FFFF")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(0,1,0),e},S=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    #define PI 3.14159;
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    void main() {
      vec2 position = vUV - vec2(0.5);
      float t = atan(position.y, position.x) / PI;
      // length(position * 5.0)就是弯曲值
      float ratio = fract(t * 8.0 + length(position * 5.0) + uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,n=new i({uniforms:{uColor:{value:new m("#00FFFF")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new s(new c(1,1,1),n);return e.position.set(1.5,1,0),e},P=()=>{const o=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
    uniform sampler2D uTexture;
    uniform float uTime;

    varying vec2 vUV;

    const float PI = 3.1415926;

    mat2 rotate2D(float rad) {
      return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    }

    vec2 twist(vec2 coord, vec2 center, float radius, float degree) {
      vec2 position = coord - center;
      float distance = length(position);
      if (distance < radius) {
        float percent = (radius - distance) / radius;
        float value = ( degree <= 0.5 ) ? mix( 0.0, 1.0, degree / 0.5 ) : mix( 1.0, 0.0, (degree - 0.5) / 0.5 );
        float theta = percent * percent * value * 8.0 * PI;
        float sinValue = sin(theta);
        float cosValue = cos(theta);
        position = vec2(dot(position, vec2(cosValue, -sinValue)), dot(position, vec2(sinValue, cosValue)));
      }
      return position + center;
    }

    void main() {
      vec2 newUV = twist(vUV, vec2(0.5), 1.0, abs(sin(uTime)));
      gl_FragColor = texture2D(uTexture, newUV);
    }
  `,n=new i({uniforms:{uTexture:{value:new W().load("/src/assets/textures/other/color.jpg")},uTime:{value:0}},vertexShader:o,fragmentShader:t,transparent:!0}),e=new s(new c(4,2,1),n);return e.position.set(0,-1,0),e};return q(()=>{const o=d.value,t=f.value,n=t.clientWidth,e=t.clientHeight,r=T(),E=C(n/e),l=y(o,n,e),p=F();r.add(p);const h=M();r.add(h);const g=S();r.add(g);const w=P();r.add(w);const R=p.material.uniforms,k=h.material.uniforms,I=g.material.uniforms,j=w.material.uniforms,A=new z,x=()=>{const a=A.getElapsedTime();R.uTime.value=a,k.uTime.value=a,I.uTime.value=a,j.uTime.value=a,l.render(r,E),v=window.requestAnimationFrame(x)};x(),H(()=>{l.dispose(),l.forceContextLoss(),r.traverse(a=>{if(a instanceof B){const{geometry:V,material:u}=a;V&&V.dispose();const b=Array.isArray(u)?u:[u];for(const _ of b)_&&_.dispose()}}),window.cancelAnimationFrame(v)})}),(o,t)=>(N(),J("div",{ref_key:"containerElementRef",ref:f,class:"container"},[K("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},$=O(Q,[["__scopeId","data-v-c84ec05a"]]);export{$ as default};
