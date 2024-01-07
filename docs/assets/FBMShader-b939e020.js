import{O as j,ad as A,z as G,af as I,aE as a,C as i,u as v,aa as x,ag as L}from"./three.module-b50c6fca.js";import{_ as W,r as g,o as O,a as D,b as H,c as J,d as K}from"./index-965901d4.js";const Q={__name:"FBMShader",setup(X){let l=null;const u=g(null),f=g(null),C=()=>new A,w=t=>{const o=new G(45,t,1,1e3);return o.position.set(0,0,6),o.lookAt(0,0,0),o},F=(t,o,c)=>{const e=new I({canvas:t,antialias:!0});return e.setSize(o,c),e.setPixelRatio(window.devicePixelRatio),e},_=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float simplexNoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      
      i = mod289(i);
      vec3 p = permute(
        permute( i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            
      vec3 m = max(0.5 - vec3(
                    dot(x0,x0),
                    dot(x1,x1),
                    dot(x2,x2)
                    ), 0.0);

      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
    }

    // 最基础的FBM
    float fbm(vec2 st) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      // 多层Noise叠加处理
      for (int i = 0; i < 6; i++) {
        value += amplitude * simplexNoise(frequency * st);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = fbm(position * 5.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,c=new a({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new v(new x(1,1,1),c);return e.position.set(-1.5,1,0),e},z=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float simplexNoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      
      i = mod289(i);
      vec3 p = permute(
        permute( i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            
      vec3 m = max(0.5 - vec3(
                    dot(x0,x0),
                    dot(x1,x1),
                    dot(x2,x2)
                    ), 0.0);

      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
    }

    // 湍流FBM
    float fbm(vec2 st) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * abs(simplexNoise(frequency * st));
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = fbm(position * 5.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,c=new a({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new v(new x(1,1,1),c);return e.position.set(0,1,0),e},V=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float simplexNoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      
      i = mod289(i);
      vec3 p = permute(
        permute( i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            
      vec3 m = max(0.5 - vec3(
                    dot(x0,x0),
                    dot(x1,x1),
                    dot(x2,x2)
                    ), 0.0);

      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
    }

    // 山脊FBM
    float fbm(vec2 st) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * abs(simplexNoise(frequency * st));
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = pow(1.1 - fbm(position * 5.0), 2.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,c=new a({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new v(new x(1,1,1),c);return e.position.set(1.5,1,0),e},b=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float simplexNoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      
      i = mod289(i);
      vec3 p = permute(
        permute( i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            
      vec3 m = max(0.5 - vec3(
                    dot(x0,x0),
                    dot(x1,x1),
                    dot(x2,x2)
                    ), 0.0);

      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
    }

    // 山脊FBM
    float fbm(vec2 st) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * abs(simplexNoise(frequency * st));
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    // fBm 来扭曲 fBm 空间
    float pattern(vec2 p ) {
      vec2 q = vec2(
        fbm( p + vec2(0.0,0.0) ),
        fbm( p + vec2(5.2,1.3) )
      );
      return fbm( p + 4.0 * q );
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = pattern(position);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,c=new a({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new v(new x(1,1,1),c);return e.position.set(-1.5,-1,0),e},M=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float simplexNoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      
      i = mod289(i);
      vec3 p = permute(
        permute( i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            
      vec3 m = max(0.5 - vec3(
                    dot(x0,x0),
                    dot(x1,x1),
                    dot(x2,x2)
                    ), 0.0);

      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 st) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * simplexNoise(frequency * st);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      const float PI = 3.1415926;
      vec2 position = vUV - vec2(0.5);
      float t = atan(position.y, position.x) / PI;
      float ratio = fract(t * 5.0 + fbm(position * 5.0));
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,c=new a({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new v(new x(1,1,1),c);return e.position.set(0,-1,0),e},U=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float simplexNoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,
                          0.366025403784439,
                          -0.577350269189626,
                          0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      
      i = mod289(i);
      vec3 p = permute(
        permute( i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            
      vec3 m = max(0.5 - vec3(
                    dot(x0,x0),
                    dot(x1,x1),
                    dot(x2,x2)
                    ), 0.0);

      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 st) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * simplexNoise(frequency * st);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    // 圆环结构
    float circle(vec2 coord, float offset) {
      float distance = length(coord);
      float start = 0.3;
      return smoothstep(start, start + offset, distance) - smoothstep(start + offset, start + offset * 2.0, distance);
    }

    float circle2(vec2 coord, float offset) {
      float distance = length(coord);
      return 1.0 - smoothstep(0.1, 0.4 + offset, distance);
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float t = fbm(position * 10.0);
      float ratio = circle2(position, t * 0.1);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,c=new a({uniforms:{uColor:{value:new i("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new v(new x(1,1,1),c);return e.position.set(1.5,-1,0),e};return O(()=>{const t=u.value,o=f.value,c=o.clientWidth,e=o.clientHeight,r=C(),q=w(c/e),s=F(t,c,e),S=_();r.add(S);const T=z();r.add(T);const N=V();r.add(N);const B=b();r.add(B);const P=M();r.add(P);const d=U();r.add(d);const E=d.material.uniforms,R=new L,p=()=>{const n=R.getElapsedTime();E.uTime.value=n,s.render(r,q),l=window.requestAnimationFrame(p)};p(),D(()=>{s.dispose(),s.forceContextLoss(),r.traverse(n=>{if(n instanceof j){const{geometry:y,material:m}=n;y&&y.dispose();const k=Array.isArray(m)?m:[m];for(const h of k)h&&h.dispose()}}),window.cancelAnimationFrame(l)})}),(t,o)=>(H(),J("div",{ref_key:"containerElementRef",ref:f,class:"container"},[K("canvas",{ref_key:"canvasElementRef",ref:u},null,512)],512))}},$=W(Q,[["__scopeId","data-v-fb6ba378"]]);export{$ as default};
