import{g as h,O as M,ad as P,E as z,af as A,aE as S,aW as b,aa as T,u as k,ag as B}from"./three.module-b50c6fca.js";import{_ as D,r as _,o as F,a as G,b as I,c as O,d as W}from"./index-965901d4.js";const Y={__name:"DepthShape",setup(U){const d=_(null),m=_(null),L=()=>new P,V=()=>new z(-1,1,1,-1,-1,1),y=(n,t,c)=>{const e=new A({canvas:n,antialias:!0});return e.setSize(t,c),e.setPixelRatio(window.devicePixelRatio),e},C=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,t=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;
    
    mat3 rotateY(float angle) {
      return mat3(cos(angle), 0.0, -sin(angle),
                0.0, 1.0, 0.0,
                sin(angle), 0.0, cos(angle));
    }

    float drawPoint(vec2 p, vec3 screenVertex) {
      float d = length(screenVertex.xy - p) - 0.05 / screenVertex.z;
      return 1.0 - smoothstep(0.0, 0.005, d);
    }

    float drawLine(in vec2 p, in vec3 sv1, in vec3 sv2) {
      vec2 lineVec = vec2(sv2.x - sv1.x, sv2.y - sv1.y);
      vec2 pVec = vec2(p.x - sv1.x, p.y - sv1.y);
      
      float distToLine = length(cross(vec3(normalize(lineVec), 0.0), vec3(pVec, 0.0)));
      float distAlongLine = dot(lineVec, pVec)/dot(lineVec, lineVec);
      
      float depth = (1.0 - distAlongLine) * sv1.z + distAlongLine * sv2.z;
      
      float val = 1.0 - smoothstep(0.0, 0.005, distToLine - 0.005 /depth);
      val *= step(0.0, distAlongLine) * step(distAlongLine, 1.0);
      return val;
    }

    vec3[8] projectCube(vec2 center, float depth) {
      // 1X1正方体坐标
      vec3[8] cube;
      cube[0] = vec3(0.0, 0.0, 0.0);
      cube[1] = vec3(1.0, 0.0, 0.0);
      cube[2] = vec3(1.0, 0.0, 1.0);
      cube[3] = vec3(0.0, 0.0, 1.0);
      cube[4] = vec3(0.0, 1.0, 0.0);
      cube[5] = vec3(1.0, 1.0, 0.0);
      cube[6] = vec3(1.0, 1.0, 1.0);
      cube[7] = vec3(0.0, 1.0, 1.0);

      vec3[8] screenVertices;
      for (int j = 0; j < 8; j++) {
        vec3 vertex = cube[j];
        // 正方体坐标系原点移到其中心
        vertex -= vec3(0.5);

        // 旋转
        vertex = vertex * rotateY(iTime);

        // 深度
        vertex.z -= depth;

        vec3 screenVertex = vec3(-vertex.x / vertex.z, -vertex.y / vertex.z, -vertex.z);
        screenVertex.xy += center;
        screenVertices[j] = screenVertex;
      }
      return screenVertices;
    }

    vec3 cubePoints(vec2 uv, vec2 center) {
      vec3[8] cube = projectCube(center, 2.0);

      float val = 1.0;
      for (int j = 0; j < 8; j++) {
        val *= 1.0 - drawPoint(uv, cube[j]);
      }
      val = 1.0 - val;
      return val * vec3(0.0, 1.0, 1.0);
    }

    vec3 cubeLine(vec2 uv, vec2 center) {
      vec3[8] cube = projectCube(center, 4.0);

      ivec2[12] edge;
      edge[0] = ivec2(0, 1);
      edge[1] = ivec2(0, 3);
      edge[2] = ivec2(0, 4);
      edge[3] = ivec2(1, 2);
      edge[4] = ivec2(1, 5);
      edge[5] = ivec2(2, 3);
      edge[6] = ivec2(2, 6);
      edge[7] = ivec2(3, 7);
      edge[8] = ivec2(4, 5);
      edge[9] = ivec2(5, 6);
      edge[10] = ivec2(6, 7);
      edge[11] = ivec2(4, 7);

      float val = 1.0;
      for (int j = 0; j < 12; j++) {
        ivec2 index = edge[j];
        vec3 current = cube[index[0]];
        vec3 next = cube[index[1]];
        val *= 1.0 - drawLine(uv, current, next);
      }

      val = 1.0 - val;

      return val * vec3(0.0, 1.0, 1.0);
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec3 cubePointColor = cubePoints(uv, vec2(0.0, 0.0));
      vec3 cubeLineColor = cubeLine(uv, vec2(0.0, 0.0));
      fragColor = vec4(cubePointColor + cubeLineColor , 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,c=new S({uniforms:{iResolution:{value:new h(0,0,1)},iMouse:{value:new b(0,0,0,0)},iTime:{value:0}},vertexShader:n,fragmentShader:t}),e=new T(2,2);return new k(e,c)},j=(n,t,c)=>{let e=!1;const a=o=>{if(!e)return;const v=o.clientX-t.left,r=o.clientY-t.top;c.iMouse.value=new b(v,r,0,0)},i=()=>{e=!1,window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",i)};n.addEventListener("mousedown",()=>{e=!0,window.addEventListener("mousemove",a),window.addEventListener("mouseup",i)})};return F(()=>{let n=null;const t=d.value,c=m.value,e=c.getBoundingClientRect(),a=e.width,i=e.height,o=L(),v=V(),r=y(t,a,i),f=C();o.add(f);const g=r.domElement,E=new B,l=f.material.uniforms;l.iResolution.value=new h(g.width,g.height,1);const p=()=>{const s=E.getElapsedTime();l.iTime.value=s,r.render(o,v),n=window.requestAnimationFrame(p)};j(c,e,l),p(),G(()=>{r.dispose(),r.forceContextLoss(),o.traverse(s=>{if(s instanceof M){const{geometry:x,material:u}=s;x&&x.dispose();const R=Array.isArray(u)?u:[u];for(const w of R)w&&w.dispose()}}),window.cancelAnimationFrame(n)})}),(n,t)=>(I(),O("div",{ref_key:"containerElementRef",ref:m,class:"container"},[W("canvas",{ref_key:"canvasElementRef",ref:d},null,512)],512))}},N=D(Y,[["__scopeId","data-v-fc858da8"]]);export{N as default};
