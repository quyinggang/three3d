import{g as p,O as P,ad as S,E as k,af as z,aE as T,aW as _,aa as B,u as L,ag as A}from"./three.module-8f39f104.js";import{_ as D,r as w,o as F,a as G,b as I,c as O,d as W}from"./index-dafdd258.js";const X={__name:"3DShape",setup(Y){const v=w(null),u=w(null),h=()=>new S,b=()=>new k(-1,1,1,-1,-1,1),y=(n,o,r)=>{const e=new z({canvas:n,antialias:!0});return e.setSize(o,r),e.setPixelRatio(window.devicePixelRatio),e},C=()=>{const n=`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,o=`
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

    vec3 cubePoints(vec2 uv, vec2 center) {
      // 1X1正方体坐标
      vec3[8] cube;
      cube[0] = vec3(0.0, 0.0, 0.0);
      cube[1] = vec3(1.0, 0.0, 0.0);
      cube[2] = vec3(0.0, 0.0, 1.0);
      cube[3] = vec3(1.0, 0.0, 1.0);
      cube[4] = vec3(0.0, 1.0, 0.0);
      cube[5] = vec3(1.0, 1.0, 0.0);
      cube[6] = vec3(0.0, 1.0, 1.0);
      cube[7] = vec3(1.0, 1.0, 1.0);

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

        screenVertices[j] = vec3(-vertex.x / vertex.z, -vertex.y / vertex.z, -vertex.z);
      }

      float val = 1.0;
      for (int j = 0; j < 8; j++) {
        vec3 vertex = screenVertices[j];
        vertex.xy += center;
        val *= 1.0 - drawPoint(uv, vertex);
      }
      val = 1.0 - val;
      vec3 vertexColor = vec3(0.0, 1.0, 1.0);
      vec3 backgroundColor = vec3(0.0);
      return backgroundColor + val * vertexColor;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
      vec3 color = cubePoints(uv, vec2(-1.0, 0.5));
      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,r=new T({uniforms:{iResolution:{value:new p(0,0,1)},iMouse:{value:new _(0,0,0,0)},iTime:{value:0}},vertexShader:n,fragmentShader:o}),e=new B(2,2);return new L(e,r)};return F(()=>{let n=null;const o=v.value,e=u.value.getBoundingClientRect(),R=e.width,E=e.height,i=h(),j=b(),c=y(o,R,E),m=C();i.add(m);const d=c.domElement,M=new A,l=m.material.uniforms;l.iResolution.value=new p(d.width,d.height,1);const f=()=>{const t=M.getElapsedTime();l.iTime.value=t,c.render(i,j),n=window.requestAnimationFrame(f)},g=t=>{const s=t.clientX-e.left,a=t.clientY-e.top;l.iMouse.value=new _(s,a,0,0)};window.addEventListener("mousemove",g),f(),G(()=>{c.dispose(),c.forceContextLoss(),i.traverse(t=>{if(t instanceof P){const{geometry:s,material:a}=t;s&&s.dispose();const V=Array.isArray(a)?a:[a];for(const x of V)x&&x.dispose()}}),window.cancelAnimationFrame(n),window.removeEventListener("mousemove",g)})}),(n,o)=>(I(),O("div",{ref_key:"containerElementRef",ref:u,class:"container"},[W("canvas",{ref_key:"canvasElementRef",ref:v},null,512)],512))}},U=D(X,[["__scopeId","data-v-b221c5be"]]);export{U as default};
