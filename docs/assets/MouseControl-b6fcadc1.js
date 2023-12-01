import{g,O as I,ad as b,E as P,af as T,aE as S,aW as w,aa as L,u as N,ag as O}from"./three.module-8f39f104.js";import{_ as X,r as _,o as B,a as V,b as q,c as F,d as H}from"./index-3efe2b3c.js";const G={__name:"MouseControl",setup(W){const v=_(null),u=_(null),M=()=>new b,E=()=>new P(-1,1,1,-1,-1,1),R=(o,t,n)=>{const e=new T({canvas:o,antialias:!0});return e.setSize(t,n),e.setPixelRatio(window.devicePixelRatio),e},C=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,t=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    //t是查找的距离范围
    #define TMIN 0.1
    #define TMAX 20.
    // 最大迭代次数
    #define RAYMARCH_TIME 128
    //当前距离是否小于阈值
    #define PRECISION .001
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
      float t = TMIN;
      for(int i = 0; i < RAYMARCH_TIME && t < TMAX; i++) {
        vec3 p = ro + t * rd;
        float d = map(p);
        if(d < PRECISION) break;
        t += d;
      }
      return t;
    }

    // 应用灯光
    float calcLight(vec3 p){
        vec3 lightPosition = vec3(0, 2, 0);
        vec3 lightVector = normalize(lightPosition - p);
        // 法线
        vec3 normal = calcNormal(p);
        
        float dif = clamp(dot(normal, lightVector), 0., 1.);
        float d = rayMarch(p + normal * PRECISION , lightVector);
        if(d < TMAX) {
          dif*=0.1;
        }
        
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

      if (t < TMAX) {
        vec3 p = ro + rd * t;
        float diffuseColor = calcLight(p);
        fragColor = vec4(vec3(diffuseColor), 1.0);
      }
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,n=new S({uniforms:{iResolution:{value:new g(0,0,1)},iMouse:{value:new w(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:t}),e=new L(2,2);return new N(e,n)},k=(o,t,n)=>{let e=!1;const s=a=>{if(!e)return;const l=a.clientX-t.left,r=a.clientY-t.top;n.iMouse.value=new w(l,r,0,0)},c=()=>{e=!1,window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",c)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",s),window.addEventListener("mouseup",c)})};return B(()=>{let o=null;const t=v.value,n=u.value,e=n.getBoundingClientRect(),s=e.width,c=e.height,a=M(),l=E(),r=R(t,s,c),f=C();a.add(f);const p=r.domElement,z=new O,m=f.material.uniforms;m.iResolution.value=new g(p.width,p.height,1);const x=()=>{const i=z.getElapsedTime();m.iTime.value=i,r.render(a,l),o=window.requestAnimationFrame(x)};k(n,e,m),x(),V(()=>{r.dispose(),r.forceContextLoss(),a.traverse(i=>{if(i instanceof I){const{geometry:h,material:d}=i;h&&h.dispose();const A=Array.isArray(d)?d:[d];for(const y of A)y&&y.dispose()}}),window.cancelAnimationFrame(o)})}),(o,t)=>(q(),F("div",{ref_key:"containerElementRef",ref:u,class:"container"},[H("canvas",{ref_key:"canvasElementRef",ref:v},null,512)],512))}},U=X(G,[["__scopeId","data-v-e6d9c3b3"]]);export{U as default};
