import{g as x,O as P,ad as S,E as z,af as T,aE as N,aW as w,aa as L,u as O,ag as F}from"./three.module-8f39f104.js";import{_ as V,r as _,o as b,a as B,b as H,c as X,d as G}from"./index-7b8941a7.js";const W={__name:"RayMarching",setup(Y){const v=_(null),f=_(null),E=()=>new S,R=()=>new z(-1,1,1,-1,-1,1),M=(o,t,n)=>{const e=new T({canvas:o,antialias:!0});return e.setSize(t,n),e.setPixelRatio(window.devicePixelRatio),e},k=()=>{const o=`
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
    #define SPHERE_INFO vec4(0, 1, 6, 1)


    float sdSphere( vec3 p, float s ) {
      return length(p) - s;
    }

    float sdPlane(vec3 p) {
      return p.y;
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    float map(vec3 p) {
      vec4 sphere = SPHERE_INFO;
      float sd = sdSphere(p - sphere.xyz, sphere.w);
      float pd = sdPlane(p);

      return min(sd, pd);
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

    void mainImage( out vec4 fragColor, in vec2 fragCoord ){
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec3 color = vec3(0);

        // 摄像机位置
        vec3 ro = vec3(0, 1.0, 0.0);
        vec3 lookAt = SPHERE_INFO.xyz;
        // 摄像机矩阵
        mat3 cam = setCamera(ro, lookAt, 0.);
        // 射线方向
        vec3 rd = normalize(cam * vec3(uv, 1));

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
  `,n=new N({uniforms:{iResolution:{value:new x(0,0,1)},iMouse:{value:new w(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:t}),e=new L(2,2);return new O(e,n)},C=(o,t,n)=>{let e=!1;const c=a=>{if(!e)return;const l=a.clientX-t.left,r=a.clientY-t.top;n.iMouse.value=new w(l,r,0,0)},s=()=>{e=!1,window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",s)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",c),window.addEventListener("mouseup",s)})};return b(()=>{let o=null;const t=v.value,n=f.value,e=n.getBoundingClientRect(),c=e.width,s=e.height,a=E(),l=R(),r=M(t,c,s),u=k();a.add(u);const p=r.domElement,A=new F,d=u.material.uniforms;d.iResolution.value=new x(p.width,p.height,1);const h=()=>{const i=A.getElapsedTime();d.iTime.value=i,r.render(a,l),o=window.requestAnimationFrame(h)};C(n,e,d),h(),B(()=>{r.dispose(),r.forceContextLoss(),a.traverse(i=>{if(i instanceof P){const{geometry:g,material:m}=i;g&&g.dispose();const I=Array.isArray(m)?m:[m];for(const y of I)y&&y.dispose()}}),window.cancelAnimationFrame(o)})}),(o,t)=>(H(),X("div",{ref_key:"containerElementRef",ref:f,class:"container"},[G("canvas",{ref_key:"canvasElementRef",ref:v},null,512)],512))}},j=V(W,[["__scopeId","data-v-8c2f2904"]]);export{j as default};
