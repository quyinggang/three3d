import{O as G,ad as B,z as W,af as L,aE as i,C as a,u as c,aa as s,ag as O}from"./three.module-8f39f104.js";import{_ as q,r as y,o as H,a as I,b as J,c as K,d as Q}from"./index-180ee8ed.js";const X={__name:"NoiseShader",setup(Y){let d=null;const u=y(null),f=y(null),C=()=>new B,_=t=>{const o=new W(45,t,1,1e3);return o.position.set(0,0,6),o.lookAt(0,0,0),o},V=(t,o,r)=>{const e=new L({canvas:t,antialias:!0});return e.setSize(o,r),e.setPixelRatio(window.devicePixelRatio),e},F=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    // 一维随机
    float random(float x) {
      return fract(sin(x) * 100000.0);
    }

    // 2D随机（白噪声）
    float random2D(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      float ratio = vUV.x <= 0.5 ? random(vUV.x) : random2D(vUV);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,r=new i({uniforms:{uColor:{value:new a("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new c(new s(1,1,1),r);return e.position.set(-1.5,1,0),e},U=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
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
      vec2 position = vUV - vec2(0.5);
      float ratio = valueNoise(position * 10.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,r=new i({uniforms:{uColor:{value:new a("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new c(new s(1,1,1),r);return e.position.set(0,1,0),e},M=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec2 random2(vec2 st) {
      st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
      return -1.0 + 2.0*fract(sin(st)*43758.5453123);
    }

    // 为了消除值噪声的块状效果的二维Gradient noise，即梯度噪声
    // Perlin Noise
    float gradientNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        vec2 u = f*f*(3.0-2.0*f);

        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = gradientNoise(position * 10.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,r=new i({uniforms:{uColor:{value:new a("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new c(new s(1,1,1),r);return e.position.set(1.5,1,0),e},N=()=>{const t=`
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

    // 基于Gradient noise的优化，比其更低的计算复杂度等优点
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

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = simplexNoise(position * 5.0);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,r=new i({uniforms:{uColor:{value:new a("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new c(new s(1,1,1),r);return e.position.set(-1.5,-1,0),e},S=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec2 random2D(vec2 st){
      return  fract(
          sin(
              vec2(
                  dot(st, vec2(127.1,311.7)),
                  dot(st, vec2(269.5,183.3))
              )
          ) * 43758.5453
      );
    }


    // Voronoi Noise是基于特征点的采样，以距离值作为噪声值，也被称为网格噪声、晶胞噪声
    // Worley Noise基于Voronoi Noise之上的优化算法
    float voronoiNoise(vec2 uv, float time) {
      float dist = 16.0;
      vec2 intPos = floor(uv);
      vec2 fractPos = fract(uv);

      // 3x3九宫格采样
      for(int x = -1; x <= 1; x++) {
          for(int y = -1; y <= 1 ; y++) {
            vec2 origin = vec2(x, y);
            vec2 offset = random2D(intPos + origin);
            // 通过时间动态变更偏移量
            offset += sin(offset * time) * 0.5;
            float distance = length(origin + offset - fractPos);
            dist = min(dist, distance);
          }
      }
      return dist;
    }


    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = voronoiNoise(position * 5.0, uTime);
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,r=new i({uniforms:{uColor:{value:new a("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new c(new s(1,1,1),r);return e.position.set(0,-1,0),e},T=()=>{const t=`
      varying vec2 vUV;

			void main() {
        vUV = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
  `,o=`
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUV;

    vec3 random3(vec3 p3) {
      p3 = fract(p3 * vec3(.1031,.11369,.2323));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
    }

    // 三维Perlin Noise
    float gradientNoise(vec3 p) {
      vec3 pi = floor(p);
      vec3 pf = p - pi;
      vec3 w = pf * pf * (3.0 - 2.0 * pf);
    
      return 	mix(
              mix(
                    mix(dot(pf - vec3(0, 0, 0), random3(pi + vec3(0, 0, 0))), 
                          dot(pf - vec3(1, 0, 0), random3(pi + vec3(1, 0, 0))),
                          w.x),
                    mix(dot(pf - vec3(0, 0, 1), random3(pi + vec3(0, 0, 1))), 
                          dot(pf - vec3(1, 0, 1), random3(pi + vec3(1, 0, 1))),
                          w.x),
                    w.z),
              mix(
                      mix(dot(pf - vec3(0, 1, 0), random3(pi + vec3(0, 1, 0))), 
                          dot(pf - vec3(1, 1, 0), random3(pi + vec3(1, 1, 0))),
                          w.x),
                      mix(dot(pf - vec3(0, 1, 1), random3(pi + vec3(0, 1, 1))), 
                          dot(pf - vec3(1, 1, 1), random3(pi + vec3(1, 1, 1))),
                          w.x),
                    w.z),
            w.y);
    }

    void main() {
      vec2 position = vUV - vec2(0.5);
      float ratio = gradientNoise(vec3(position.xy * 10.0, uTime));
      gl_FragColor = vec4(uColor * ratio, 1.0);
    }
  `,r=new i({uniforms:{uColor:{value:new a("#00FFFF")},uTime:{value:0}},vertexShader:t,fragmentShader:o,transparent:!0}),e=new c(new s(1,1,1),r);return e.position.set(1.5,-1,0),e};return H(()=>{const t=u.value,o=f.value,r=o.clientWidth,e=o.clientHeight,n=C(),P=_(r/e),m=V(t,r,e),z=F();n.add(z);const D=U();n.add(D);const E=M();n.add(E);const R=N();n.add(R);const x=S();n.add(x);const p=T();n.add(p);const b=x.material.uniforms,k=p.material.uniforms,j=new O,g=()=>{const v=j.getElapsedTime();b.uTime.value=v,k.uTime.value=v,m.render(n,P),d=window.requestAnimationFrame(g)};g(),I(()=>{m.dispose(),m.forceContextLoss(),n.traverse(v=>{if(v instanceof G){const{geometry:w,material:l}=v;w&&w.dispose();const A=Array.isArray(l)?l:[l];for(const h of A)h&&h.dispose()}}),window.cancelAnimationFrame(d)})}),(t,o)=>(J(),K("div",{ref_key:"containerElementRef",ref:f,class:"container"},[Q("canvas",{ref_key:"canvasElementRef",ref:u},null,512)],512))}},ee=q(X,[["__scopeId","data-v-d2a0dade"]]);export{ee as default};
