import{g as _,O as R,ad as T,E as b,af as L,aE as P,aW as k,aa as D,u as I,ag as N}from"./three.module-b50c6fca.js";import{_ as B,r as h,o as X,a as q,b as F,c as V,d as G}from"./index-965901d4.js";const O={__name:"SkyCloud",setup(W){const m=h(null),p=h(null),g=()=>new T,M=()=>new b(-1,1,1,-1,-1,1),C=(o,t,n)=>{const e=new L({canvas:o,antialias:!0});return e.setSize(t,n),e.setPixelRatio(window.devicePixelRatio),e},E=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,t=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    // 最大查找距离
    #define MAX_DISTANCE 60.0
    // 最大前进步数
    #define MAX_STEPS 128
    // 命中阀值
    #define HIT_DISTANCE 0.001

    vec3 random3(vec3 p3) {
      p3 = fract(p3 * vec3(.1031,.11369,.2323));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
    }

    // 三维Perlin Noise
    float pNoise(vec3 p) {
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

    float fbm(vec3 p) {
      float amplitude = 0.5;
      float frequency = 1.0;
      float value = 0.0;

      for (int i = 0; i < 6; i++) {
        value += amplitude * pNoise(frequency * p);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float sdPlane(vec3 p) {
      return p.y;
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    float map(vec3 p) {
      return sdPlane(p);
    }

    // 计算法线
    vec3 calcNormal(vec3 p) {
      const float h = 0.0001;
      const vec2 k = vec2(1, -1);
      return normalize(k.xyy * map(p + k.xyy * h) +
        k.yyx * map(p + k.yyx * h) +
        k.yxy * map(p + k.yxy * h) +
        k.xxx * map(p + k.xxx * h));
    }

    // 射线源、射线方向
    float rayMarch(vec3 ro, vec3 rd, float tMin, float tMax){
      float td = tMin;
      for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + td * rd;
        float d = map(p);
        if(d < HIT_DISTANCE || td > tMax) break;
        td += d;
      }
      return td;
    }

    vec3 sky(vec3 ro, vec3 rd) {
      vec3 sunLight = normalize(vec3(0.0, 0.25, -1.0));
      vec3 sunColor = vec3(1., .7, .55);
      float sunDot = max(dot(rd, sunLight), 0.);
      vec3 sky = mix(vec3(.0, .1, .4), vec3(.3, .6, .8), 1.0 - rd.y);

      // sun
      sky += sunColor * min(pow(sunDot, 4000.0) * 5.0, 1.0);
      sky += sunColor * min(pow(sunDot, 400.0) * .6, 1.0);

      // clouds
      vec3 wind = vec3(0, 0, -iTime * .05);
      float t = -ro.y / rd.y;
      vec3 p = (ro + t * rd) + wind;
      sky = mix(sky, vec3(1.0), smoothstep(.4, .8, 4.0 * fbm(p)));

      return sky;
    }

    vec3 chessBoard(vec3 p) {
      float f = mod(floor(6.0 * p.z) + floor(6.0 * p.x), 2.0);
      return 0.4 + f * vec3(0.1);
    }

    mat3 setCamera(vec3 pos, vec3 lookAt, float rad) {
      vec3 z = normalize(lookAt - pos);
      vec3 cp = vec3(sin(rad), cos(rad), 0.);
      vec3 x = normalize(cross(z, cp));
      vec3 y = cross(x, z);
      return mat3(x, y, z);
    }


    vec3 render(vec3 ro, vec3 rd) {
      vec3 color = vec3(0.0);

      float tMin = 0.01;
      float tMax = MAX_DISTANCE;
      float t = rayMarch(ro, rd, tMin, tMax);
      if (t < tMax) {
        vec3 p = ro + rd * t;
        // 地平面
        color = chessBoard(p);
      } else {
        color = sky(ro, rd);
      }

      // 天空与地面交接处模糊
      color = mix(color, vec3(0.9), pow(1.0 - max(abs(rd.y), 0.0), 8.0));

      return color;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord ){
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec2 mouse = 2.0 * ((iMouse.xy / iResolution.xy) - vec2(0.5));
      // 摄像机位置
      vec3 ro = vec3(3.0 * cos(mouse.x * 8.0), 1.0, -3.0 * sin(mouse.x * 8.0));
      vec3 lookAt = vec3(0.0, 1.0, -1.0);
      // 摄像机矩阵
      mat3 cam = setCamera(ro, lookAt, 0.);
      // 射线方向
      vec3 rd = cam * normalize(vec3(uv, 1));

      vec3 color = render(ro, rd);
      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,n=new P({uniforms:{iResolution:{value:new _(0,0,1)},iMouse:{value:new k(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:t}),e=new D(2,2);return new I(e,n)},z=(o,t,n)=>{let e=!1;const c=r=>{if(!e)return;const l=r.clientX-t.left,a=r.clientY-t.top;n.iMouse.value=new k(l,a,0,0)},s=()=>{e=!1,window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",s)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",c),window.addEventListener("mouseup",s)})};return X(()=>{let o=null;const t=m.value,n=p.value,e=n.getBoundingClientRect(),c=e.width,s=e.height,r=g(),l=M(),a=C(t,c,s),u=E();r.add(u);const f=a.domElement,S=new N,d=u.material.uniforms;d.iResolution.value=new _(f.width,f.height,1);const x=()=>{const i=S.getElapsedTime();d.iTime.value=i,a.render(r,l),o=window.requestAnimationFrame(x)};z(n,e,d),x(),q(()=>{a.dispose(),a.forceContextLoss(),r.traverse(i=>{if(i instanceof R){const{geometry:y,material:v}=i;y&&y.dispose();const A=Array.isArray(v)?v:[v];for(const w of A)w&&w.dispose()}}),window.cancelAnimationFrame(o)})}),(o,t)=>(F(),V("div",{ref_key:"containerElementRef",ref:p,class:"container"},[G("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},j=B(O,[["__scopeId","data-v-65b0e401"]]);export{j as default};
