import{g as x,O as P,ad as M,E as S,af as z,aE as A,aW as b,aa as T,u as k,ag as B}from"./three.module-8f39f104.js";import{_ as D,r as h,o as F,a as G,b as I,c as O,d as W}from"./index-f2840deb.js";const X={__name:"3DShape",setup(Y){const l=h(null),u=h(null),w=()=>new M,_=()=>new S(-1,1,1,-1,-1,1),V=(n,c,a)=>{const e=new z({canvas:n,antialias:!0});return e.setSize(c,a),e.setPixelRatio(window.devicePixelRatio),e},y=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,c=`
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iTime;

    mat3 rotateX(float angle) {
      return mat3(1.0, 0.0, 0.0,
                0.0, cos(angle), -sin(angle),
                0.0, sin(angle), cos(angle));
    }
    
    mat3 rotateY(float angle) {
      return mat3(cos(angle), 0.0, -sin(angle),
                0.0, 1.0, 0.0,
                sin(angle), 0.0, cos(angle));
    }
    
    mat3 rotateZ(float angle) {
      return mat3(cos(angle), -sin(angle), 0.0,
                sin(angle), cos(angle), 0.0,
                0.0, 0.0, 1.0);
    }

    float drawPoint(vec2 p, vec3 screenVertex) {
      float d = length(screenVertex.xy - p) - 0.05 / screenVertex.z;
      return 1.0 - smoothstep(0.0, 0.005, d);
    }

    float sdSphere(vec3 p, float s) {
      return length(p)-s;
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

    vec3[8] projectCube(vec2 center) {
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

      float depth = 4.0;
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
      vec3[8] cube = projectCube(center);

      float val = 1.0;
      for (int j = 0; j < 8; j++) {
        val *= 1.0 - drawPoint(uv, cube[j]);
      }
      val = 1.0 - val;
      return val * vec3(0.0, 1.0, 1.0);
    }

    vec3 cubeLine(vec2 uv, vec2 center) {
      vec3[8] cube = projectCube(center);

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
      vec3 cubePointColor = cubePoints(uv, vec2(-1.0, 0.5));
      vec3 cubeLineColor = cubeLine(uv, vec2(0.0, 0.5));

      fragColor = vec4(cubePointColor + cubeLineColor, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,a=new A({uniforms:{iResolution:{value:new x(0,0,1)},iMouse:{value:new b(0,0,0,0)},iTime:{value:0}},vertexShader:n,fragmentShader:c}),e=new T(2,2);return new k(e,a)};return F(()=>{let n=null;const c=l.value,e=u.value.getBoundingClientRect(),C=e.width,L=e.height,s=w(),j=_(),r=V(c,C,L),d=y();s.add(d);const m=r.domElement,R=new B,v=d.material.uniforms;v.iResolution.value=new x(m.width,m.height,1);const g=()=>{const t=R.getElapsedTime();v.iTime.value=t,r.render(s,j),n=window.requestAnimationFrame(g)},f=t=>{const i=t.clientX-e.left,o=t.clientY-e.top;v.iMouse.value=new b(i,o,0,0)};window.addEventListener("mousemove",f),g(),G(()=>{r.dispose(),r.forceContextLoss(),s.traverse(t=>{if(t instanceof P){const{geometry:i,material:o}=t;i&&i.dispose();const E=Array.isArray(o)?o:[o];for(const p of E)p&&p.dispose()}}),window.cancelAnimationFrame(n),window.removeEventListener("mousemove",f)})}),(n,c)=>(I(),O("div",{ref_key:"containerElementRef",ref:u,class:"container"},[W("canvas",{ref_key:"canvasElementRef",ref:l},null,512)],512))}},U=D(X,[["__scopeId","data-v-31dfb058"]]);export{U as default};
