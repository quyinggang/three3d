import{O as D,ad as M,z,af as k,G as x,ar as G,D as H,o as I,v as O,as as U,C as l,ag as W}from"./three.module-b50c6fca.js";import{O as X}from"./OrbitControls-a97fbd6e.js";import{F as q,s as V}from"./shanghai-03ff1593.js";import{_ as Y,r as w,o as $,a as j,b as J,c as K,d as Q}from"./index-965901d4.js";const Z={__name:"CityEffect",setup(ee){let v=null;const g=w(null),S=w(null),C=()=>new M,y=e=>{const o=new z(45,e,1,1e4);return o.position.set(0,50,1e3),o.lookAt(0,0,0),o},T=(e,o,t)=>{const a=new k({canvas:e,antialias:!0});return a.setSize(o,t),a.setPixelRatio(window.devicePixelRatio),a},P=(e,o)=>{const t=new X(e,o);return t.enableDamping=!0,t.minDistance=300,t.maxDistance=6e3,t.minPolarAngle=Math.PI/4,t.maxPolarAngle=Math.PI/2*.96,t},E=()=>{const e=new x,o=new G(11382189),t=new H(16777215,.5);return t.position.set(600,600,0),e.add(o),e.add(t),e},R=e=>{new q().load(V,t=>{e&&e(t)})},m=[],h=e=>{e.uniforms.uProgress={value:0},e.vertexShader=`
    uniform float uProgress;
    ${e.vertexShader}
  `,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      transformed.z = position.z * min(uProgress, 1.0);
    `),m.push(o=>{e.uniforms.uProgress.value=o})},b=e=>{e.uniforms.uRiseTime={value:0},e.uniforms.uRiseColor={value:new l("#87CEEB")},e.vertexShader=e.vertexShader.replace("#include <common>",`
      #include <common>
      varying vec3 vTransformedNormal;
      varying float vHeight;
    `),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      vTransformedNormal = normalize(normal);
      vHeight = transformed.z;
    `),e.fragmentShader=e.fragmentShader.replace("#include <common>",`
      #include <common>
      uniform vec3 uRiseColor;
      uniform float uRiseTime;
      varying float vHeight;
      varying vec3 vTransformedNormal;
      
      vec3 riseLine() {
        float smoothness = 1.8;
        float speed = uRiseTime;
        bool isTopBottom = (vTransformedNormal.z > 0.0 || vTransformedNormal.z < 0.0) && vTransformedNormal.x == 0.0 && vTransformedNormal.y == 0.0;
        float ratio = isTopBottom ? 0.0 : smoothstep(speed, speed + smoothness, vHeight) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vHeight);
        return uRiseColor * ratio;
      }
    `),e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",`
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(riseLine(), 1.0);
    `),m.push(o=>{e.uniforms.uRiseTime.value=o*30})},L=e=>{e.uniforms.uSpreadTime={value:0},e.uniforms.uSpreadColor={value:new l("#9932CC")},e.vertexShader=e.vertexShader.replace("#include <common>",`
      #include <common>
      varying vec2 vTransformedPosition;
    `),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      vTransformedPosition = vec2(position.x, position.y);
    `),e.fragmentShader=e.fragmentShader.replace("#include <common>",`
      #include <common>
      uniform vec3 uSpreadColor;
      uniform float uSpreadTime;
      varying vec2 vTransformedPosition;
      
      vec3 spread() {
        vec2 center = vec2(0.0);
        float smoothness = 60.0;
        float start = mod(uSpreadTime, 1800.0);
        float distance = length(vTransformedPosition - center);
        float ratio = smoothstep(start, start + smoothness, distance) - smoothstep(start + smoothness, start + smoothness * 2.0, distance);
        return uSpreadColor * ratio;
      }
    `),e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",`
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(spread(), 1.0);
    `),m.push(o=>{e.uniforms.uSpreadTime.value=o*200})},A=e=>{e.uniforms.uSweepTime={value:0},e.uniforms.uSweepColor={value:new l("#00FFFF")},e.vertexShader=e.vertexShader.replace("#include <common>",`
      #include <common>
      varying vec2 vSweepPosition;
    `),e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      vSweepPosition = vec2(position.x, position.y);
    `),e.fragmentShader=e.fragmentShader.replace("#include <common>",`
      #include <common>
      uniform vec3 uSweepColor;
      uniform float uSweepTime;
      varying vec2 vSweepPosition;
      
      vec3 sweep() {
        vec2 center = vec2(0.0);
        float smoothness = 60.0;
        float start = mod(uSweepTime, 1800.0) - 800.0;
        float ratio = smoothstep(start, start + smoothness, vSweepPosition.x) - smoothstep(start + smoothness, start + smoothness * 2.0, vSweepPosition.x);
        return uSweepColor * ratio;
      }
    `),e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",`
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(sweep(), 1.0);
    `),m.push(o=>{e.uniforms.uSweepTime.value=o*160})},F={CITY_UNTRIANGULATED:(e,o)=>{const{geometry:t,position:a,material:n}=e,d=new I({color:"#2685fe"}),i=new O(new U(t,1),d);i.position.copy(a),i.rotateX(-Math.PI/2),o.add(i),n.onBeforeCompile=s=>{n.color=new l("#0e233d"),n.transparent=!0,n.opacity=.9,h(s),b(s),L(s),A(s)},d.onBeforeCompile=s=>{h(s)}},LANDMASS:e=>{const o=e.material;o.color=new l("#040912"),o.transparent=!0,o.opacity=.8},ROADS:e=>{const o=e.material;o.color=new l("#292e4c")}};return $(()=>{const e=g.value,o=S.value,t=o.clientWidth,a=o.clientHeight,n=C(),d=y(t/a),i=T(e,t,a),s=P(d,i.domElement),B=E();n.add(B),R(c=>{const r=new x;c.children.forEach(u=>{const f=u.clone(),p=F[f.name];p&&p(f,r),r.add(f)}),n.add(r)});const N=new W,_=()=>{const c=N.getElapsedTime();m.forEach(r=>{r&&r(c*.5)}),s.update(),i.render(n,d),v=window.requestAnimationFrame(_)};_(),j(()=>{i.dispose(),i.forceContextLoss(),n.traverse(c=>{if(c instanceof D){const{geometry:r,material:u}=c;r&&r.dispose();const f=Array.isArray(u)?u:[u];for(const p of f)p&&p.dispose()}}),window.cancelAnimationFrame(v)})}),(e,o)=>(J(),K("div",{ref_key:"containerElementRef",ref:S,class:"container"},[Q("canvas",{ref_key:"canvasElementRef",ref:g},null,512)],512))}},ae=Y(Z,[["__scopeId","data-v-aa7893ee"]]);export{ae as default};
