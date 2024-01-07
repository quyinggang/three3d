import{b8 as k,O as S,ad as B,z as F,af as H,s as D,au as h,aE as L,y as M,ag as N}from"./three.module-b50c6fca.js";import{O}from"./OrbitControls-a97fbd6e.js";import{s as G}from"./scene-329a337a.js";import{_ as T,r as y,o as V,a as j,b as q,c as U,d as J}from"./index-965901d4.js";const K={__name:"ImagePointsEffect",setup(Q){let x=null;const w=y(null),_=y(null),C=()=>new B,E=t=>{const e=new F(45,t,1,1e3);return e.position.set(0,0,60),e.lookAt(0,0,0),e},P=(t,e)=>new O(t,e),b=(t,e,n)=>{const o=new H({canvas:t,antialias:!0});return o.setSize(e,n),o.setPixelRatio(window.devicePixelRatio),o},I=({canvasWidth:t,canvasHeight:e,image:n})=>{const o=document.createElement("canvas");o.width=t,o.height=e;const a=o.getContext("2d");return a.drawImage(n,0,0,t,e),a.getImageData(0,0,t,e)},z=t=>{const e=[],n=[],c=I({canvasWidth:480,canvasHeight:270,image:t}),g=c.width,p=c.data;for(let r=0;r<270;r+=1)for(let i=0;i<480;i+=1){const l=(r*g+i)*4,A=p[l]/255,R=p[l+1]/255,W=p[l+2]/255;n.push(A,R,W),e.push((i-240)*.1,(-r+135)*.1,0)}const m=new D;m.setAttribute("position",new h(e,3)),m.setAttribute("color",new h(n,3));const v=`
    varying vec3 vColor;

    uniform float u_time;


    vec3 random3(vec3 p3) {
      p3 = fract(p3 * vec3(.1031,.11369,.2323));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
    }

    // 三维Perlin Noise
    float gradientNoise(vec3 p) {
      vec3 pi = floor(p);
      vec3 pf = p - pi;
      vec3 w = pf * pf * (3.0 - 2.0 * pf);
    
      return 	mix(
              mix(
                    mix(dot(pf - vec3(0, 0, 0), random3(pi + vec3(0, 0, 0))), 
                          dot(pf - vec3(1, 0, 0), random3(pi + vec3(1, 0, 0))),
                          w.x),
                    mix(dot(pf - vec3(0, 0, 1), random3(pi + vec3(0, 0, 1))), 
                          dot(pf - vec3(1, 0, 1), random3(pi + vec3(1, 0, 1))),
                          w.x),
                    w.z),
              mix(
                      mix(dot(pf - vec3(0, 1, 0), random3(pi + vec3(0, 1, 0))), 
                          dot(pf - vec3(1, 1, 0), random3(pi + vec3(1, 1, 0))),
                          w.x),
                      mix(dot(pf - vec3(0, 1, 1), random3(pi + vec3(0, 1, 1))), 
                          dot(pf - vec3(1, 1, 1), random3(pi + vec3(1, 1, 1))),
                          w.x),
                    w.z),
            w.y);
    }


    void main() {
      vColor = color;
      vec3 value = vec3(position.x, position.y, u_time * 0.1);
      float noise = gradientNoise(value);
      float progress = sin(u_time * 0.05); 
      vec3 newPos = position + vec3(position.x, position.y, position.x * position.y * 0.1) * noise * progress;
      gl_PointSize = 4.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,s=`
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,f=new L({uniforms:{u_time:{value:0}},vertexShader:v,fragmentShader:s,vertexColors:!0});return new M(m,f)};return V(()=>{const t=w.value,e=_.value,n=e.clientWidth,o=e.clientHeight;let a=null;const d=C(),u=E(n/o),c=b(t,n,o),g=P(u,c.domElement);new k().load(G,s=>{a=z(s),d.add(a)});const m=new N,v=()=>{const s=m.getElapsedTime();a&&(a.material.uniforms.u_time.value=s),g.update(),c.render(d,u),x=window.requestAnimationFrame(v)};v(),j(()=>{c.dispose(),c.forceContextLoss(),d.traverse(s=>{if(s instanceof S){const{geometry:f,material:r}=s;f&&f.dispose();const i=Array.isArray(r)?r:[r];for(const l of i)l&&l.dispose()}}),window.cancelAnimationFrame(x)})}),(t,e)=>(q(),U("div",{ref_key:"containerElementRef",ref:_,class:"container"},[J("canvas",{ref_key:"canvasElementRef",ref:w},null,512)],512))}},ee=T(K,[["__scopeId","data-v-b604b066"]]);export{ee as default};
