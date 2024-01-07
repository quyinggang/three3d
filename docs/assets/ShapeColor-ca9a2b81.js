import{g as _,O as I,ad as T,E as z,af as P,aE as b,aW as y,aa as L,u as N,ag as X}from"./three.module-b50c6fca.js";import{_ as D,r as w,o as F,a as V,b as B,c as O,d as H}from"./index-965901d4.js";const U={__name:"ShapeColor",setup(G){const v=w(null),u=w(null),S=()=>new T,C=()=>new z(-1,1,1,-1,-1,1),E=(o,r,t)=>{const e=new P({canvas:o,antialias:!0});return e.setSize(r,t),e.setPixelRatio(window.devicePixelRatio),e},k=()=>{const o=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,r=`
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
    #define SPHERE_INFO vec4(0, 0.6, 0, 0.6)

    struct Shape {
      float d;
      vec3 color;
    };

    struct Intersection {
      float t;
      vec3 color;
    };

    Shape opU(Shape s1, Shape s2) {
      if (s1.d < s2.d) return s1;
      return s2;
    }

    float sdSphere( vec3 p, float s) {
      return length(p) - s;
    }

    float sdPlane(vec3 p) {
      return p.y;
    }

    // 返回采样距离可在此实现场景中多个sdf对象合并
    Shape map(vec3 p) {
      vec4 sphere = SPHERE_INFO;
      vec3 floorColor = 0.4 + mod(floor(6.0 * p.z) + floor(6.0 * p.x), 2.0) * vec3(0.6);
      return opU(
        Shape(sdPlane(p), floorColor),
        Shape(sdSphere(p - sphere.xyz, sphere.w), vec3(1.0, 0.0, 0.0))
      );
    }

    // 计算法线
    vec3 calcNormal(vec3 p) {
      const float h = 0.0001;
      const vec2 k = vec2(1, -1);
      return normalize(k.xyy * map(p + k.xyy * h).d +
        k.yyx * map(p + k.yyx * h).d +
        k.yxy * map(p + k.yxy * h).d +
        k.xxx * map(p + k.xxx * h).d);
    }

    // 射线源、射线方向
    Intersection rayMarch(vec3 ro, vec3 rd){
      float td = 0.0;
      vec3 color = vec3(0.0);
      for(int i = 0; td <= MAX_DISTANCE && i < MAX_STEPS; i++) {
        vec3 p = ro + td * rd;
        Shape sp = map(p);
        if(sp.d < HIT_DISTANCE) break;
        td += sp.d;
        color = sp.color;
      }
      return Intersection(td > MAX_DISTANCE ? -1.0 : td, color);
    }

    // 应用灯光
    float calcLight(vec3 p){
        vec3 lightPosition = vec3(10, 10, 10);
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
      vec3 color = vec3(0);
      vec3 backgroundColor = vec3(0.65, 0.85, 1.0);
      
      float radius = 6.0;
      float mouseX = mouse.x * 10.0;
      // 摄像机位置（支持mouse控制）
      vec3 ro = vec3(radius * cos(mouseX), 1.0, radius * sin(mouseX));
      vec3 lookAt = vec3(0, 0, 0);
      // 摄像机矩阵
      mat3 cam = setCamera(ro, lookAt, 0.);
      // 射线方向
      vec3 rd = cam * normalize(vec3(uv, 1));

      Intersection inter = rayMarch(ro, rd);

      if (inter.t > 0.0) {
        vec3 p = ro + rd * inter.t;
        float diffuseColor = calcLight(p);
        color = backgroundColor * 0.2 + diffuseColor * inter.color;
      } else {
        color = backgroundColor;
      }

      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,t=new b({uniforms:{iResolution:{value:new _(0,0,1)},iMouse:{value:new y(0,0,0,0)},iTime:{value:0}},vertexShader:o,fragmentShader:r}),e=new L(2,2);return new N(e,t)},M=(o,r,t)=>{let e=!1;const c=n=>{if(!e)return;const l=n.clientX-r.left,a=n.clientY-r.top;t.iMouse.value=new y(l,a,0,0)},s=()=>{e=!1,window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",s)};o.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",c),window.addEventListener("mouseup",s)})};return F(()=>{let o=null;const r=v.value,t=u.value,e=t.getBoundingClientRect(),c=e.width,s=e.height,n=S(),l=C(),a=E(r,c,s),p=k();n.add(p);const f=a.domElement,A=new X,d=p.material.uniforms;d.iResolution.value=new _(f.width,f.height,1);const h=()=>{const i=A.getElapsedTime();d.iTime.value=i,a.render(n,l),o=window.requestAnimationFrame(h)};M(t,e,d),h(),V(()=>{a.dispose(),a.forceContextLoss(),n.traverse(i=>{if(i instanceof I){const{geometry:g,material:m}=i;g&&g.dispose();const R=Array.isArray(m)?m:[m];for(const x of R)x&&x.dispose()}}),window.cancelAnimationFrame(o)})}),(o,r)=>(B(),O("div",{ref_key:"containerElementRef",ref:u,class:"container"},[H("canvas",{ref_key:"canvasElementRef",ref:v},null,512)],512))}},q=D(U,[["__scopeId","data-v-1f816fb4"]]);export{q as default};
