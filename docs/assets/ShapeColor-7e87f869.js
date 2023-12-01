import{g,O as z,ad as I,E as P,af as T,aE as b,aW as w,aa as L,u as N,ag as O}from"./three.module-8f39f104.js";import{_ as X,r as _,o as V,a as F,b as B,c as H,d as U}from"./index-3efe2b3c.js";const G={__name:"ShapeColor",setup(W){const m=_(null),u=_(null),C=()=>new I,E=()=>new P(-1,1,1,-1,-1,1),M=(o,r,a)=>{const e=new T({canvas:o,antialias:!0});return e.setSize(r,a),e.setPixelRatio(window.devicePixelRatio),e},R=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,r=`
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
    #define SPHERE_INFO vec4(0, 0.6, 0, 0.6)

    vec4 opU(vec4 d1, vec4 d2) {
      return (d1.x < d2.x) ? d1 : d2;
    }

    vec4 sdSphere( vec3 p, float s, vec3 color) {
      float d = length(p) - s;
      return vec4(d, color);
    }

    vec4 sdPlane(vec3 p, vec3 color) {
      return vec4(p.y, color);
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    vec4 map(vec3 p) {
      vec4 sphere = SPHERE_INFO;
      vec3 floorColor = vec3(.5 + 0.3*mod(floor(p.x/2.) + floor(p.z/2.), 2.0));
      return opU(
        sdPlane(p, floorColor),
        sdSphere(p - sphere.xyz, sphere.w, vec3(1.0, 0.0, 0.0))
      );
    }

    // 计算法线
    vec3 calcNormal(vec3 p) {
      const float h = 0.0001;
      const vec2 k = vec2(1, -1);
      return normalize(k.xyy * map(p + k.xyy * h).x +
        k.yyx * map(p + k.yyx * h).x +
        k.yxy * map(p + k.yxy * h).x +
        k.xxx * map(p + k.xxx * h).x);
    }

    // 射线源、射线方向
    vec4 rayMarch(vec3 ro, vec3 rd){
      float t = TMIN;
      vec3 color = vec3(1.0);
      for(int i = 0; i < RAYMARCH_TIME && t < TMAX; i++) {
        vec3 p = ro + t * rd;
        vec4 d = map(p);
        if(d.x < PRECISION) break;
        t += d.x;
        color = d.yzw;
      }
      return vec4(t, color);
    }

    // 应用灯光
    float calcLight(vec3 p){
        vec3 lightPosition = vec3(10, 10, 10);
        vec3 lightVector = normalize(lightPosition - p);
        // 法线
        vec3 normal = calcNormal(p);
        
        float dif = clamp(dot(normal, lightVector), 0., 1.);
        vec4 ray = rayMarch(p + normal * PRECISION , lightVector);
        if(ray.x < TMAX) {
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
      vec3 color = vec3(0);
      vec3 backgroundColor = vec3(0.835, 1, 1);
      
      float radius = 6.0;
      float mouseX = mouse.x * 10.0;
      // 摄像机位置（支持圆周运动 + mouse控制）
      vec3 ro = vec3(radius * cos(mouseX), 1.0, radius * sin(mouseX));
      vec3 lookAt = vec3(0, 0, 0);
      // 摄像机矩阵
      mat3 cam = setCamera(ro, lookAt, 0.);
      // 射线方向
      vec3 rd = cam * normalize(vec3(uv, 1));

      vec4 ray = rayMarch(ro, rd);
      float t = ray.x;
      vec3 shapeColor = ray.yzw;

      if (t < TMAX) {
        vec3 p = ro + rd * t;
        float diffuseColor = calcLight(p);
        color = diffuseColor * shapeColor + backgroundColor * 0.2;
      } else {
        color = backgroundColor;
      }
      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,a=new b({uniforms:{iResolution:{value:new g(0,0,1)},iMouse:{value:new w(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:r}),e=new L(2,2);return new N(e,a)},k=(o,r,a)=>{let e=!1;const c=n=>{if(!e)return;const l=n.clientX-r.left,t=n.clientY-r.top;a.iMouse.value=new w(l,t,0,0)},s=()=>{e=!1,window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",s)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",c),window.addEventListener("mouseup",s)})};return V(()=>{let o=null;const r=m.value,a=u.value,e=a.getBoundingClientRect(),c=e.width,s=e.height,n=C(),l=E(),t=M(r,c,s),f=R();n.add(f);const p=t.domElement,A=new O,v=f.material.uniforms;v.iResolution.value=new g(p.width,p.height,1);const x=()=>{const i=A.getElapsedTime();v.iTime.value=i,t.render(n,l),o=window.requestAnimationFrame(x)};k(a,e,v),x(),F(()=>{t.dispose(),t.forceContextLoss(),n.traverse(i=>{if(i instanceof z){const{geometry:h,material:d}=i;h&&h.dispose();const S=Array.isArray(d)?d:[d];for(const y of S)y&&y.dispose()}}),window.cancelAnimationFrame(o)})}),(o,r)=>(B(),H("div",{ref_key:"containerElementRef",ref:u,class:"container"},[U("canvas",{ref_key:"canvasElementRef",ref:m},null,512)],512))}},j=X(G,[["__scopeId","data-v-f23eb54a"]]);export{j as default};
