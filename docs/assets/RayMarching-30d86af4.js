import{g as y,O as P,ad as S,E as z,af as T,aE as N,aW as g,aa as O,u as F,ag as L}from"./three.module-8f39f104.js";import{_ as V,r as _,o as b,a as B,b as H,c as X,d as G}from"./index-af97948e.js";const W={__name:"RayMarching",setup(Y){const d=_(null),m=_(null),x=()=>new S,w=()=>new z(-1,1,1,-1,-1,1),R=(o,t,r)=>{const e=new T({canvas:o,antialias:!0});return e.setSize(t,r),e.setPixelRatio(window.devicePixelRatio),e},M=()=>{const o=`
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

        vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;

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
  `,r=new N({uniforms:{iResolution:{value:new y(0,0,1)},iMouse:{value:new g(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:t}),e=new O(2,2);return new F(e,r)};return b(()=>{let o=null;const t=d.value,e=m.value.getBoundingClientRect(),E=e.width,k=e.height,i=x(),C=w(),c=R(t,E,k),v=M();i.add(v);const f=c.domElement,A=new L,l=v.material.uniforms;l.iResolution.value=new y(f.width,f.height,1);const p=()=>{const a=A.getElapsedTime();l.iTime.value=a,c.render(i,C),o=window.requestAnimationFrame(p)},u=a=>{const s=a.clientX-e.left,n=a.clientY-e.top;l.iMouse.value=new g(s,n,0,0)};window.addEventListener("mousemove",u),p(),B(()=>{c.dispose(),c.forceContextLoss(),i.traverse(a=>{if(a instanceof P){const{geometry:s,material:n}=a;s&&s.dispose();const I=Array.isArray(n)?n:[n];for(const h of I)h&&h.dispose()}}),window.cancelAnimationFrame(o),window.removeEventListener("mousemove",u)})}),(o,t)=>(H(),X("div",{ref_key:"containerElementRef",ref:m,class:"container"},[G("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},D=V(W,[["__scopeId","data-v-4a937dc4"]]);export{D as default};
