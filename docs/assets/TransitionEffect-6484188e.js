import{O as R,ad as k,z as G,af as j,u as A,aa as B,h as s,aE as n,ag as I}from"./three.module-8f39f104.js";import{G as N}from"./dat.gui.module-5ea4ba08.js";import{_ as W,r as h,o as z,a as O,b as q,c as H,d as $}from"./index-639cdcb3.js";const J={__name:"TransitionEffect",setup(K){let v=null;const x=h(null),f=h(null),V=()=>new k,U=e=>{const t=new G(45,e,1,1e3);return t.position.set(0,0,2),t.lookAt(0,0,0),t},_=(e,t,r)=>{const o=new j({canvas:e,antialias:!0});return o.setSize(t,r),o.setPixelRatio(window.devicePixelRatio),o},d=()=>{const e=`
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
  `,r=new s;return new n({uniforms:{uTexture1:{value:r.load("/src/assets/textures/other/gmlei.png")},uTexture2:{value:r.load("/src/assets/textures/other/gmhuo.png")},uTime:{value:0}},vertexShader:e,fragmentShader:t})},w=()=>{const e=`
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
  `,r=new s;return new n({uniforms:{uTexture1:{value:r.load("/src/assets/textures/other/gmlei.png")},uTexture2:{value:r.load("/src/assets/textures/other/gmhuo.png")},uTime:{value:0}},vertexShader:e,fragmentShader:t})},D=()=>{const e=`
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
  `,r=new s;return new n({uniforms:{uTexture1:{value:r.load("/src/assets/textures/other/gmlei.png")},uTexture2:{value:r.load("/src/assets/textures/other/gmhuo.png")},uTime:{value:0}},vertexShader:e,fragmentShader:t})},y=()=>{const e=`
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
  `,r=new s;return new n({uniforms:{uTexture1:{value:r.load("/src/assets/textures/other/gmlei.png")},uTexture2:{value:r.load("/src/assets/textures/other/gmhuo.png")},uTime:{value:0}},vertexShader:e,fragmentShader:t})},M=()=>{const e=`
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
  `,r=new s;return new n({uniforms:{uTexture1:{value:r.load("/src/assets/textures/other/gmlei.png")},uTexture2:{value:r.load("/src/assets/textures/other/gmhuo.png")},uTime:{value:0}},vertexShader:e,fragmentShader:t})},b=()=>{const e=`
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
  `,r=new s;return new n({uniforms:{uTexture1:{value:r.load("/src/assets/textures/other/gmlei.png")},uTexture2:{value:r.load("/src/assets/textures/other/gmhuo.png")},uTime:{value:0}},vertexShader:e,fragmentShader:t})},S=()=>{const e=d();return new A(new B(1.4,.7,1),e)},a=e=>{e.material.dispose()},E=e=>{const t=new N;t.width=100;const r={scheme1:()=>{a(e),e.material=d()},scheme2:()=>{a(e),e.material=w()},scheme3:()=>{a(e),e.material=D()},scheme4:()=>{a(e),e.material=y()},scheme5:()=>{a(e),e.material=M()},scheme6:()=>{a(e),e.material=b()}};return t.add(r,"scheme1").name("方案1"),t.add(r,"scheme2").name("方案2"),t.add(r,"scheme3").name("方案3"),t.add(r,"scheme4").name("方案4"),t.add(r,"scheme5").name("方案5"),t.add(r,"scheme6").name("方案6"),t.open(),()=>t.destroy()};return z(()=>{const e=x.value,t=f.value,r=t.clientWidth,o=t.clientHeight,u=V(),C=U(r/o),c=_(e,r,o),m=S(),L=E(m);u.add(m);const P=new I,p=()=>{const i=P.getElapsedTime();m.material.uniforms.uTime.value=i,c.render(u,C),v=window.requestAnimationFrame(p)};p(),O(()=>{L(),c.dispose(),c.forceContextLoss(),u.traverse(i=>{if(i instanceof R){const{geometry:g,material:l}=i;g&&g.dispose();const F=Array.isArray(l)?l:[l];for(const T of F)T&&T.dispose()}}),window.cancelAnimationFrame(v)})}),(e,t)=>(q(),H("div",{ref_key:"containerElementRef",ref:f,class:"container"},[$("canvas",{ref_key:"canvasElementRef",ref:x},null,512)],512))}},Z=W(J,[["__scopeId","data-v-5facb479"]]);export{Z as default};
