import{O as G,ad as j,z as I,af as A,u as B,aa as N,h as n,aE as s,ag as W}from"./three.module-b50c6fca.js";import{G as z}from"./dat.gui.module-5ea4ba08.js";import{l as i,h as u}from"./gmhuo-8b7c69f8.js";import{_ as O,r as h,o as q,a as H,b as $,c as J,d as K}from"./index-965901d4.js";const Q={__name:"TransitionEffect",setup(X){let d=null;const f=h(null),p=h(null),_=()=>new j,w=e=>{const t=new I(45,e,1,1e3);return t.position.set(0,0,2),t.lookAt(0,0,0),t},D=(e,t,r)=>{const o=new A({canvas:e,antialias:!0});return o.setSize(t,r),o.setPixelRatio(window.devicePixelRatio),o},T=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float progress = smoothstep(0.0, 1.0, abs(sin(uTime)));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `,r=new n;return new s({uniforms:{uTexture1:{value:r.load(i)},uTexture2:{value:r.load(u)},uTime:{value:0}},vertexShader:e,fragmentShader:t})},y=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        // 根据阶梯函数step的特性实现
        float progress = step(vUV.x, abs(sin(uTime)));
        // float progress = 1.0 - step(vUV.x, abs(sin(uTime)));
        // float progress = step(vUV.y, abs(sin(uTime)));
        // float progress = 1.0 - step(vUV.y, abs(sin(uTime)));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `,r=new n;return new s({uniforms:{uTexture1:{value:r.load(i)},uTexture2:{value:r.load(u)},uTime:{value:0}},vertexShader:e,fragmentShader:t})},M=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float progress = step(fract(vUV.x * 8.0), time);
        // float progress = step(fract(vUV.y * 8.0), time);
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `,r=new n;return new s({uniforms:{uTexture1:{value:r.load(i)},uTexture2:{value:r.load(u)},uTime:{value:0}},vertexShader:e,fragmentShader:t})},S=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float value = length(vUV - vec2(0.5));
        float progress = step(value, time);
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `,r=new n;return new s({uniforms:{uTexture1:{value:r.load(i)},uTexture2:{value:r.load(u)},uTime:{value:0}},vertexShader:e,fragmentShader:t})},b=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float smoothness = 0.5;
        float count = 10.0;
        float pr = smoothstep(-smoothness, 0.0, vUV.x - time * (1.0 + smoothness));
        float progress = step(pr, fract(count * vUV.x));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `,r=new n;return new s({uniforms:{uTexture1:{value:r.load(i)},uTexture2:{value:r.load(u)},uTime:{value:0}},vertexShader:e,fragmentShader:t})},E=()=>{const e=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,t=`
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uTime;

      varying vec2 vUV;

      float random2D(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // 二维值噪声
      float valueNoise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random2D(i);
        float b = random2D(i + vec2(1.0, 0.0));
        float c = random2D(i + vec2(0.0, 1.0));
        float d = random2D(i + vec2(1.0, 1.0));

        vec2 u = f*f*(3.0-2.0*f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
      }

			void main() {
        vec4 texture1 = texture2D(uTexture1, vUV);
        vec4 texture2 = texture2D(uTexture2, vUV);
        float time = abs(sin(uTime));
        float progress = step(time, valueNoise(vUV * 10.0));
        // float smoothness = 0.01;
        // float progress = smoothstep(time - smoothness, time + smoothness, valueNoise(vUV * 10.0));
        gl_FragColor = mix(texture1, texture2, progress);
			}
  `,r=new n;return new s({uniforms:{uTexture1:{value:r.load(i)},uTexture2:{value:r.load(u)},uTime:{value:0}},vertexShader:e,fragmentShader:t})},C=()=>{const e=T();return new B(new N(1.4,.7,1),e)},a=e=>{e.material.dispose()},L=e=>{const t=new z;t.width=100;const r={scheme1:()=>{a(e),e.material=T()},scheme2:()=>{a(e),e.material=y()},scheme3:()=>{a(e),e.material=M()},scheme4:()=>{a(e),e.material=S()},scheme5:()=>{a(e),e.material=b()},scheme6:()=>{a(e),e.material=E()}};return t.add(r,"scheme1").name("方案1"),t.add(r,"scheme2").name("方案2"),t.add(r,"scheme3").name("方案3"),t.add(r,"scheme4").name("方案4"),t.add(r,"scheme5").name("方案5"),t.add(r,"scheme6").name("方案6"),t.open(),()=>t.destroy()};return q(()=>{const e=f.value,t=p.value,r=t.clientWidth,o=t.clientHeight,m=_(),P=w(r/o),l=D(e,r,o),v=C(),F=L(v);m.add(v);const R=new W,g=()=>{const c=R.getElapsedTime();v.material.uniforms.uTime.value=c,l.render(m,P),d=window.requestAnimationFrame(g)};g(),H(()=>{F(),l.dispose(),l.forceContextLoss(),m.traverse(c=>{if(c instanceof G){const{geometry:V,material:x}=c;V&&V.dispose();const k=Array.isArray(x)?x:[x];for(const U of k)U&&U.dispose()}}),window.cancelAnimationFrame(d)})}),(e,t)=>($(),J("div",{ref_key:"containerElementRef",ref:p,class:"container"},[K("canvas",{ref_key:"canvasElementRef",ref:f},null,512)],512))}},re=O(Q,[["__scopeId","data-v-f12deed7"]]);export{re as default};
