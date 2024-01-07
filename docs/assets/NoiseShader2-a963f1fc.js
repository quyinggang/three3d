import{O as b,ad as j,C as c,z as k,af as F,aw as R,aE as w,u as p,aa as N}from"./three.module-b50c6fca.js";import{O as A}from"./OrbitControls-a97fbd6e.js";import{_ as B,r as h,o as O,a as L,b as T,c as V,d as W}from"./index-965901d4.js";const I={__name:"NoiseShader2",setup(q){let i=null;const d=h(null),l=h(null),_=()=>{const e=new j;return e.background=new c(12575709),e},y=e=>{const t=new k(45,e,1,1e4);return t.position.set(6,10,20),t.lookAt(0,0,0),t},g=(e,t,o)=>{const n=new F({canvas:e,antialias:!0});return n.setSize(t,o),n.setPixelRatio(window.devicePixelRatio),n},C=(e,t)=>new A(e,t),M=()=>{const e=new R(1,32,32),t=new w({uniforms:{iColor:{value:new c("#162a40")}},vertexShader:`
      vec3 random3(vec3 c) {
          float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
          vec3 r;
          r.z = fract(512.0*j);
          j *= .125;
          r.x = fract(512.0*j);
          j *= .125;
          r.y = fract(512.0*j);
          return r-0.5;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;
      float simplex3d(vec3 p) {
          /* 1. find current tetrahedron T and it's four vertices */
          /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
          /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
          
          /* calculate s and x */
          vec3 s = floor(p + dot(p, vec3(F3, F3, F3)));
          vec3 x = p - s + dot(s, vec3(G3, G3, G3));
          
          /* calculate i1 and i2 */
          vec3 e = step(vec3(0,0,0), x - x.yzx);
          vec3 i1 = e*(1.0 - e.zxy);
          vec3 i2 = 1.0 - e.zxy*(1.0 - e);
              
          /* x1, x2, x3 */
          vec3 x1 = x - i1 + G3;
          vec3 x2 = x - i2 + 2.0*G3;
          vec3 x3 = x - 1.0 + 3.0*G3;
          
          /* 2. find four surflets and store them in d */
          vec4 w, d;
          
          /* calculate surflet weights */
          w.x = dot(x, x);
          w.y = dot(x1, x1);
          w.z = dot(x2, x2);
          w.w = dot(x3, x3);
          
          /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
          w = max(0.6 - w, 0.0);
          
          /* calculate surflet components */
          d.x = dot(random3(s), x);
          d.y = dot(random3(s + i1), x1);
          d.z = dot(random3(s + i2), x2);
          d.w = dot(random3(s + 1.0), x3);
          
          /* multiply d by w^4 */
          w *= w;
          w *= w;
          d *= w;
          
          /* 3. return the sum of the four surflets */
          return dot(d, vec4(52.0, 52.0, 52.0, 52.0));
      }

      void main() {
        const float scale = 0.8;
        float noise = simplex3d(position * scale);
        vec3 newPosition = position * (1.0 + noise);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);  
      } 
    `,fragmentShader:`  
      uniform vec3 iColor;

      void main() {   
        gl_FragColor = vec4(iColor, 1.0);  
      }  
    `,wireframe:!0}),o=new p(e,t);return o.position.set(0,4,0),o},S=()=>{const e=new N(20,20,60),t=new w({uniforms:{iColor:{value:new c("#162a40")}},vertexShader:`
    vec2 random2(vec2 st) {
      st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
      return -1.0 + 2.0*fract(sin(st)*43758.5453123);
    }

    float perlinNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        vec2 u = f*f*(3.0-2.0*f);

        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    }

      void main() {
        float noise = perlinNoise(uv) * 16.0;
        vec3 newPosition = vec3(position.x, position.y, position.z + noise);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);  
      } 
    `,fragmentShader:`  
      uniform vec3 iColor;

      void main() {   
        gl_FragColor = vec4(iColor, 1.0);  
      }  
    `,wireframe:!0}),o=new p(e,t);return o.rotation.x=-Math.PI/2,o};return O(()=>{const e=d.value,t=l.value,o=t.clientWidth,n=t.clientHeight,r=_(),m=y(o/n),s=g(e,o,n),G=C(m,s.domElement),P=M();r.add(P);const z=S();r.add(z);const f=()=>{G.update(),s.render(r,m),i=window.requestAnimationFrame(f)};f(),L(()=>{s.dispose(),s.forceContextLoss(),r.traverse(v=>{if(v instanceof b){const{geometry:u,material:a}=v;u&&u.dispose();const E=Array.isArray(a)?a:[a];for(const x of E)x&&x.dispose()}}),window.cancelAnimationFrame(i)})}),(e,t)=>(T(),V("div",{ref_key:"containerElementRef",ref:l,class:"container"},[W("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},J=B(I,[["__scopeId","data-v-83ec9c29"]]);export{J as default};
