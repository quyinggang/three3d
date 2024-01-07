import{g as y,O as z,ad as T,E as P,af as b,aE as I,aW as g,aa as L,u as N,ag as X}from"./three.module-b50c6fca.js";import{_ as B,r as w,o as D,a as q,b as F,c as V,d as O}from"./index-965901d4.js";const H={__name:"MouseControl",setup(G){const v=w(null),u=w(null),E=()=>new T,C=()=>new P(-1,1,1,-1,-1,1),M=(o,t,n)=>{const e=new b({canvas:o,antialias:!0});return e.setSize(t,n),e.setPixelRatio(window.devicePixelRatio),e},k=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,t=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    // 最大查找距离
    #define MAX_DISTANCE 20.0
    // 最大前进步数
    #define MAX_STEPS 128
    // 命中阀值
    #define HIT_DISTANCE 0.001
    // 球体信息，xyz表示位置，w表示大小
    #define SPHERE_INFO vec4(0, 0.6, 3, 0.6)


    float sdSphere( vec3 p, float s ) {
      return length(p) - s;
    }

    float sdBox( vec3 p, vec3 b ) {
      vec3 q = abs(p) - b;
      return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float sdPlane(vec3 p) {
      return p.y;
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    float map(vec3 p) {
      vec4 sphere = SPHERE_INFO;
      float sd = sdSphere(p - sphere.xyz, sphere.w);
      float pd = sdPlane(p);

      float size = 0.5;
      vec3 box = vec3(sphere.x, size, -sphere.z);
      float bd = sdBox(p - box, vec3(size));

      return min(min(sd, pd), bd);
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
    float rayMarch(vec3 ro, vec3 rd){
      float td = 0.0;
      for(int i = 0; td <= MAX_DISTANCE && i < MAX_STEPS; i++) {
        vec3 p = ro + td * rd;
        float d = map(p);
        if(d < HIT_DISTANCE) break;
        td += d;
      }
      return td > MAX_DISTANCE ? -1.0 : td;
    }

    // 应用灯光
    float calcLight(vec3 p){
        vec3 lightPosition = vec3(0, 2, 0);
        vec3 lightVector = normalize(lightPosition - p);
        // 法线
        vec3 normal = calcNormal(p);
        
        float dif = clamp(dot(normal, lightVector), 0., 1.);
        return dif;
    }

    mat3 setCamera(vec3 pos, vec3 lookAt, float rad) {
      vec3 z = normalize(lookAt - pos);
      vec3 cp = vec3(sin(rad), cos(rad), 0.);
      vec3 x = normalize(cross(z, cp));
      vec3 y = cross(x, z);
      return mat3(x, y, z);
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec2 mouse = 2.0 * (iMouse.xy / iResolution.xy - vec2(0.5));

      float time = iTime * 0.5;
      float radius = 6.0;
      float mouseX = mouse.x * 10.0;
      // 摄像机位置（支持圆周运动 + mouse控制）
      vec3 ro = vec3(radius * cos(time + mouseX), 1.0, radius * sin(time + mouseX));
      vec3 lookAt = vec3(0, 0, 0);
      // 摄像机矩阵
      mat3 cam = setCamera(ro, lookAt, 0.);
      // 射线方向
      vec3 rd = cam * normalize(vec3(uv, 1));

      float t = rayMarch(ro, rd);

      if (t > 0.0) {
        vec3 p = ro + rd * t;
        float diffuseColor = calcLight(p);
        fragColor = vec4(vec3(diffuseColor), 1.0);
      }
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,n=new I({uniforms:{iResolution:{value:new y(0,0,1)},iMouse:{value:new g(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:t}),e=new L(2,2);return new N(e,n)},S=(o,t,n)=>{let e=!1;const s=a=>{if(!e)return;const l=a.clientX-t.left,r=a.clientY-t.top;n.iMouse.value=new g(l,r,0,0)},c=()=>{e=!1,window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",c)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",s),window.addEventListener("mouseup",c)})};return D(()=>{let o=null;const t=v.value,n=u.value,e=n.getBoundingClientRect(),s=e.width,c=e.height,a=E(),l=C(),r=M(t,s,c),f=k();a.add(f);const p=r.domElement,A=new X,d=f.material.uniforms;d.iResolution.value=new y(p.width,p.height,1);const x=()=>{const i=A.getElapsedTime();d.iTime.value=i,r.render(a,l),o=window.requestAnimationFrame(x)};S(n,e,d),x(),q(()=>{r.dispose(),r.forceContextLoss(),a.traverse(i=>{if(i instanceof z){const{geometry:h,material:m}=i;h&&h.dispose();const R=Array.isArray(m)?m:[m];for(const _ of R)_&&_.dispose()}}),window.cancelAnimationFrame(o)})}),(o,t)=>(F(),V("div",{ref_key:"containerElementRef",ref:u,class:"container"},[O("canvas",{ref_key:"canvasElementRef",ref:v},null,512)],512))}},j=B(H,[["__scopeId","data-v-7223a544"]]);export{j as default};
