import{O as An,ad as bn,z as nt,af as tt,F as et,ai as it,V as rt,G as ot,g as In,aY as ut,u as lt,aZ as at,M as ft,w as ct,s as st,o as pt,C as Fn}from"./three.module-8f39f104.js";import{O as vt}from"./OrbitControls-8206acf3.js";import{t as ht}from"./util-c747da73.js";import{_ as gt,r as Ln,o as St,a as dt,b as Et,c as wt,d as Jn,p as yt,e as Mt}from"./index-d7540ef8.js";class mt{constructor(){this._partials=new Float64Array(32),this._n=0}add(t){const i=this._partials;let e=0;for(let r=0;r<this._n&&r<32;r++){const f=i[r],c=t+f,v=Math.abs(t)<Math.abs(f)?t-(c-f):f-(c-t);v&&(i[e++]=v),t=c}return i[e]=t,this._n=e+1,this}valueOf(){const t=this._partials;let i=this._n,e,r,f,c=0;if(i>0){for(c=t[--i];i>0&&(e=c,r=t[--i],c=e+r,f=r-(c-e),!f););i>0&&(f<0&&t[i-1]<0||f>0&&t[i-1]>0)&&(r=f*2,e=c+r,r==e-c&&(c=e))}return c}}function*_t(n){for(const t of n)yield*t}function Un(n){return Array.from(_t(n))}var D=1e-6,Pt=1e-12,L=Math.PI,V=L/2,Cn=L/4,Y=L*2,$=180/L,q=L/180,T=Math.abs,Xn=Math.atan,nn=Math.atan2,B=Math.cos,Rt=Math.exp,At=Math.log,G=Math.sin,It=Math.sign||function(n){return n>0?1:n<0?-1:0},hn=Math.sqrt,Ft=Math.tan;function Lt(n){return n>1?0:n<-1?L:Math.acos(n)}function tn(n){return n>1?V:n<-1?-V:Math.asin(n)}function k(){}function cn(n,t){n&&Dn.hasOwnProperty(n.type)&&Dn[n.type](n,t)}var Nn={Feature:function(n,t){cn(n.geometry,t)},FeatureCollection:function(n,t){for(var i=n.features,e=-1,r=i.length;++e<r;)cn(i[e].geometry,t)}},Dn={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var i=n.coordinates,e=-1,r=i.length;++e<r;)n=i[e],t.point(n[0],n[1],n[2])},LineString:function(n,t){dn(n.coordinates,t,0)},MultiLineString:function(n,t){for(var i=n.coordinates,e=-1,r=i.length;++e<r;)dn(i[e],t,0)},Polygon:function(n,t){zn(n.coordinates,t)},MultiPolygon:function(n,t){for(var i=n.coordinates,e=-1,r=i.length;++e<r;)zn(i[e],t)},GeometryCollection:function(n,t){for(var i=n.geometries,e=-1,r=i.length;++e<r;)cn(i[e],t)}};function dn(n,t,i){var e=-1,r=n.length-i,f;for(t.lineStart();++e<r;)f=n[e],t.point(f[0],f[1],f[2]);t.lineEnd()}function zn(n,t){var i=-1,e=n.length;for(t.polygonStart();++i<e;)dn(n[i],t,1);t.polygonEnd()}function Ct(n,t){n&&Nn.hasOwnProperty(n.type)?Nn[n.type](n,t):cn(n,t)}function En(n){return[nn(n[1],n[0]),tn(n[2])]}function K(n){var t=n[0],i=n[1],e=B(i);return[e*B(t),e*G(t),G(i)]}function on(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function sn(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function gn(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function un(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function wn(n){var t=hn(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function yn(n,t){function i(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(i.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),i}function Mn(n,t){return T(n)>L&&(n-=Math.round(n/Y)*Y),[n,t]}Mn.invert=Mn;function Zn(n,t,i){return(n%=Y)?t||i?yn(Bn(n),Gn(t,i)):Bn(n):t||i?Gn(t,i):Mn}function Tn(n){return function(t,i){return t+=n,T(t)>L&&(t-=Math.round(t/Y)*Y),[t,i]}}function Bn(n){var t=Tn(n);return t.invert=Tn(-n),t}function Gn(n,t){var i=B(n),e=G(n),r=B(t),f=G(t);function c(v,S){var h=B(S),u=B(v)*h,o=G(v)*h,l=G(S),a=l*i+u*e;return[nn(o*r-a*f,u*i-l*e),tn(a*r+o*f)]}return c.invert=function(v,S){var h=B(S),u=B(v)*h,o=G(v)*h,l=G(S),a=l*r-o*f;return[nn(o*r+l*f,u*i+a*e),tn(a*i-u*e)]},c}function Nt(n){n=Zn(n[0]*q,n[1]*q,n.length>2?n[2]*q:0);function t(i){return i=n(i[0]*q,i[1]*q),i[0]*=$,i[1]*=$,i}return t.invert=function(i){return i=n.invert(i[0]*q,i[1]*q),i[0]*=$,i[1]*=$,i},t}function Dt(n,t,i,e,r,f){if(i){var c=B(t),v=G(t),S=e*i;r==null?(r=t+e*Y,f=t-S/2):(r=qn(c,r),f=qn(c,f),(e>0?r<f:r>f)&&(r+=e*Y));for(var h,u=r;e>0?u>f:u<f;u-=S)h=En([c,-v*B(u),-v*G(u)]),n.point(h[0],h[1])}}function qn(n,t){t=K(t),t[0]-=n,wn(t);var i=Lt(-t[1]);return((-t[2]<0?-i:i)+Y-D)%Y}function Kn(){var n=[],t;return{point:function(i,e,r){t.push([i,e,r])},lineStart:function(){n.push(t=[])},lineEnd:k,rejoin:function(){n.length>1&&n.push(n.pop().concat(n.shift()))},result:function(){var i=n;return n=[],t=null,i}}}function fn(n,t){return T(n[0]-t[0])<D&&T(n[1]-t[1])<D}function ln(n,t,i,e){this.x=n,this.z=t,this.o=i,this.e=e,this.v=!1,this.n=this.p=null}function Qn(n,t,i,e,r){var f=[],c=[],v,S;if(n.forEach(function(p){if(!((w=p.length-1)<=0)){var w,g=p[0],m=p[w],d;if(fn(g,m)){if(!g[2]&&!m[2]){for(r.lineStart(),v=0;v<w;++v)r.point((g=p[v])[0],g[1]);r.lineEnd();return}m[0]+=2*D}f.push(d=new ln(g,p,null,!0)),c.push(d.o=new ln(g,null,d,!1)),f.push(d=new ln(m,p,null,!1)),c.push(d.o=new ln(m,null,d,!0))}}),!!f.length){for(c.sort(t),On(f),On(c),v=0,S=c.length;v<S;++v)c[v].e=i=!i;for(var h=f[0],u,o;;){for(var l=h,a=!0;l.v;)if((l=l.n)===h)return;u=l.z,r.lineStart();do{if(l.v=l.o.v=!0,l.e){if(a)for(v=0,S=u.length;v<S;++v)r.point((o=u[v])[0],o[1]);else e(l.x,l.n.x,1,r);l=l.n}else{if(a)for(u=l.p.z,v=u.length-1;v>=0;--v)r.point((o=u[v])[0],o[1]);else e(l.x,l.p.x,-1,r);l=l.p}l=l.o,u=l.z,a=!a}while(!l.v);r.lineEnd()}}}function On(n){if(t=n.length){for(var t,i=0,e=n[0],r;++i<t;)e.n=r=n[i],r.p=e,e=r;e.n=r=n[0],r.p=e}}function Sn(n){return T(n[0])<=L?n[0]:It(n[0])*((T(n[0])+L)%Y-L)}function zt(n,t){var i=Sn(t),e=t[1],r=G(e),f=[G(i),-B(i),0],c=0,v=0,S=new mt;r===1?e=V+D:r===-1&&(e=-V-D);for(var h=0,u=n.length;h<u;++h)if(l=(o=n[h]).length)for(var o,l,a=o[l-1],p=Sn(a),w=a[1]/2+Cn,g=G(w),m=B(w),d=0;d<l;++d,p=E,g=R,m=I,a=M){var M=o[d],E=Sn(M),A=M[1]/2+Cn,R=G(A),I=B(A),_=E-p,P=_>=0?1:-1,C=P*_,y=C>L,W=g*R;if(S.add(nn(W*P*G(C),m*I+W*B(C))),c+=y?_+P*Y:_,y^p>=i^E>=i){var z=sn(K(a),K(M));wn(z);var N=sn(f,z);wn(N);var s=(y^_>=0?-1:1)*tn(N[2]);(e>s||e===s&&(z[0]||z[1]))&&(v+=y^_>=0?1:-1)}}return(c<-D||c<D&&S<-Pt)^v&1}function jn(n,t,i,e){return function(r){var f=t(r),c=Kn(),v=t(c),S=!1,h,u,o,l={point:a,lineStart:w,lineEnd:g,polygonStart:function(){l.point=m,l.lineStart=d,l.lineEnd=M,u=[],h=[]},polygonEnd:function(){l.point=a,l.lineStart=w,l.lineEnd=g,u=Un(u);var E=zt(h,e);u.length?(S||(r.polygonStart(),S=!0),Qn(u,Bt,E,i,r)):E&&(S||(r.polygonStart(),S=!0),r.lineStart(),i(null,null,1,r),r.lineEnd()),S&&(r.polygonEnd(),S=!1),u=h=null},sphere:function(){r.polygonStart(),r.lineStart(),i(null,null,1,r),r.lineEnd(),r.polygonEnd()}};function a(E,A){n(E,A)&&r.point(E,A)}function p(E,A){f.point(E,A)}function w(){l.point=p,f.lineStart()}function g(){l.point=a,f.lineEnd()}function m(E,A){o.push([E,A]),v.point(E,A)}function d(){v.lineStart(),o=[]}function M(){m(o[0][0],o[0][1]),v.lineEnd();var E=v.clean(),A=c.result(),R,I=A.length,_,P,C;if(o.pop(),h.push(o),o=null,!!I){if(E&1){if(P=A[0],(_=P.length-1)>0){for(S||(r.polygonStart(),S=!0),r.lineStart(),R=0;R<_;++R)r.point((C=P[R])[0],C[1]);r.lineEnd()}return}I>1&&E&2&&A.push(A.pop().concat(A.shift())),u.push(A.filter(Tt))}}return l}}function Tt(n){return n.length>1}function Bt(n,t){return((n=n.x)[0]<0?n[1]-V-D:V-n[1])-((t=t.x)[0]<0?t[1]-V-D:V-t[1])}const Wn=jn(function(){return!0},Gt,Ot,[-L,-V]);function Gt(n){var t=NaN,i=NaN,e=NaN,r;return{lineStart:function(){n.lineStart(),r=1},point:function(f,c){var v=f>0?L:-L,S=T(f-t);T(S-L)<D?(n.point(t,i=(i+c)/2>0?V:-V),n.point(e,i),n.lineEnd(),n.lineStart(),n.point(v,i),n.point(f,i),r=0):e!==v&&S>=L&&(T(t-e)<D&&(t-=e*D),T(f-v)<D&&(f-=v*D),i=qt(t,i,f,c),n.point(e,i),n.lineEnd(),n.lineStart(),n.point(v,i),r=0),n.point(t=f,i=c),e=v},lineEnd:function(){n.lineEnd(),t=i=NaN},clean:function(){return 2-r}}}function qt(n,t,i,e){var r,f,c=G(n-i);return T(c)>D?Xn((G(t)*(f=B(e))*G(i)-G(e)*(r=B(t))*G(n))/(r*f*c)):(t+e)/2}function Ot(n,t,i,e){var r;if(n==null)r=i*V,e.point(-L,r),e.point(0,r),e.point(L,r),e.point(L,0),e.point(L,-r),e.point(0,-r),e.point(-L,-r),e.point(-L,0),e.point(-L,r);else if(T(n[0]-t[0])>D){var f=n[0]<t[0]?L:-L;r=i*f/2,e.point(-f,r),e.point(0,r),e.point(f,r)}else e.point(t[0],t[1])}function Wt(n){var t=B(n),i=6*q,e=t>0,r=T(t)>D;function f(u,o,l,a){Dt(a,n,i,l,u,o)}function c(u,o){return B(u)*B(o)>t}function v(u){var o,l,a,p,w;return{lineStart:function(){p=a=!1,w=1},point:function(g,m){var d=[g,m],M,E=c(g,m),A=e?E?0:h(g,m):E?h(g+(g<0?L:-L),m):0;if(!o&&(p=a=E)&&u.lineStart(),E!==a&&(M=S(o,d),(!M||fn(o,M)||fn(d,M))&&(d[2]=1)),E!==a)w=0,E?(u.lineStart(),M=S(d,o),u.point(M[0],M[1])):(M=S(o,d),u.point(M[0],M[1],2),u.lineEnd()),o=M;else if(r&&o&&e^E){var R;!(A&l)&&(R=S(d,o,!0))&&(w=0,e?(u.lineStart(),u.point(R[0][0],R[0][1]),u.point(R[1][0],R[1][1]),u.lineEnd()):(u.point(R[1][0],R[1][1]),u.lineEnd(),u.lineStart(),u.point(R[0][0],R[0][1],3)))}E&&(!o||!fn(o,d))&&u.point(d[0],d[1]),o=d,a=E,l=A},lineEnd:function(){a&&u.lineEnd(),o=null},clean:function(){return w|(p&&a)<<1}}}function S(u,o,l){var a=K(u),p=K(o),w=[1,0,0],g=sn(a,p),m=on(g,g),d=g[0],M=m-d*d;if(!M)return!l&&u;var E=t*m/M,A=-t*d/M,R=sn(w,g),I=un(w,E),_=un(g,A);gn(I,_);var P=R,C=on(I,P),y=on(P,P),W=C*C-y*(on(I,I)-1);if(!(W<0)){var z=hn(W),N=un(P,(-C-z)/y);if(gn(N,I),N=En(N),!l)return N;var s=u[0],F=o[0],O=u[1],H=o[1],x;F<s&&(x=s,s=F,F=x);var j=F-s,J=T(j-L)<D,X=J||j<D;if(!J&&H<O&&(x=O,O=H,H=x),X?J?O+H>0^N[1]<(T(N[0]-s)<D?O:H):O<=N[1]&&N[1]<=H:j>L^(s<=N[0]&&N[0]<=F)){var U=un(P,(-C+z)/y);return gn(U,I),[N,En(U)]}}}function h(u,o){var l=e?n:L-n,a=0;return u<-l?a|=1:u>l&&(a|=2),o<-l?a|=4:o>l&&(a|=8),a}return jn(c,v,f,e?[0,-n]:[-L,n-L])}function Ht(n,t,i,e,r,f){var c=n[0],v=n[1],S=t[0],h=t[1],u=0,o=1,l=S-c,a=h-v,p;if(p=i-c,!(!l&&p>0)){if(p/=l,l<0){if(p<u)return;p<o&&(o=p)}else if(l>0){if(p>o)return;p>u&&(u=p)}if(p=r-c,!(!l&&p<0)){if(p/=l,l<0){if(p>o)return;p>u&&(u=p)}else if(l>0){if(p<u)return;p<o&&(o=p)}if(p=e-v,!(!a&&p>0)){if(p/=a,a<0){if(p<u)return;p<o&&(o=p)}else if(a>0){if(p>o)return;p>u&&(u=p)}if(p=f-v,!(!a&&p<0)){if(p/=a,a<0){if(p>o)return;p>u&&(u=p)}else if(a>0){if(p<u)return;p<o&&(o=p)}return u>0&&(n[0]=c+u*l,n[1]=v+u*a),o<1&&(t[0]=c+o*l,t[1]=v+o*a),!0}}}}}var b=1e9,an=-b;function Vt(n,t,i,e){function r(h,u){return n<=h&&h<=i&&t<=u&&u<=e}function f(h,u,o,l){var a=0,p=0;if(h==null||(a=c(h,o))!==(p=c(u,o))||S(h,u)<0^o>0)do l.point(a===0||a===3?n:i,a>1?e:t);while((a=(a+o+4)%4)!==p);else l.point(u[0],u[1])}function c(h,u){return T(h[0]-n)<D?u>0?0:3:T(h[0]-i)<D?u>0?2:1:T(h[1]-t)<D?u>0?1:0:u>0?3:2}function v(h,u){return S(h.x,u.x)}function S(h,u){var o=c(h,1),l=c(u,1);return o!==l?o-l:o===0?u[1]-h[1]:o===1?h[0]-u[0]:o===2?h[1]-u[1]:u[0]-h[0]}return function(h){var u=h,o=Kn(),l,a,p,w,g,m,d,M,E,A,R,I={point:_,lineStart:W,lineEnd:z,polygonStart:C,polygonEnd:y};function _(s,F){r(s,F)&&u.point(s,F)}function P(){for(var s=0,F=0,O=a.length;F<O;++F)for(var H=a[F],x=1,j=H.length,J=H[0],X,U,rn=J[0],Z=J[1];x<j;++x)X=rn,U=Z,J=H[x],rn=J[0],Z=J[1],U<=e?Z>e&&(rn-X)*(e-U)>(Z-U)*(n-X)&&++s:Z<=e&&(rn-X)*(e-U)<(Z-U)*(n-X)&&--s;return s}function C(){u=o,l=[],a=[],R=!0}function y(){var s=P(),F=R&&s,O=(l=Un(l)).length;(F||O)&&(h.polygonStart(),F&&(h.lineStart(),f(null,null,1,h),h.lineEnd()),O&&Qn(l,v,s,f,h),h.polygonEnd()),u=h,l=a=p=null}function W(){I.point=N,a&&a.push(p=[]),A=!0,E=!1,d=M=NaN}function z(){l&&(N(w,g),m&&E&&o.rejoin(),l.push(o.result())),I.point=_,E&&u.lineEnd()}function N(s,F){var O=r(s,F);if(a&&p.push([s,F]),A)w=s,g=F,m=O,A=!1,O&&(u.lineStart(),u.point(s,F));else if(O&&E)u.point(s,F);else{var H=[d=Math.max(an,Math.min(b,d)),M=Math.max(an,Math.min(b,M))],x=[s=Math.max(an,Math.min(b,s)),F=Math.max(an,Math.min(b,F))];Ht(H,x,n,t,i,e)?(E||(u.lineStart(),u.point(H[0],H[1])),u.point(x[0],x[1]),O||u.lineEnd(),R=!1):O&&(u.lineStart(),u.point(s,F),R=!1)}d=s,M=F,E=O}return I}}const Hn=n=>n;var Q=1/0,pn=Q,en=-Q,vn=en,$t={point:xt,lineStart:k,lineEnd:k,polygonStart:k,polygonEnd:k,result:function(){var n=[[Q,pn],[en,vn]];return en=vn=-(pn=Q=1/0),n}};function xt(n,t){n<Q&&(Q=n),n>en&&(en=n),t<pn&&(pn=t),t>vn&&(vn=t)}const Vn=$t;function _n(n){return function(t){var i=new mn;for(var e in n)i[e]=n[e];return i.stream=t,i}}function mn(){}mn.prototype={constructor:mn,point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};function Pn(n,t,i){var e=n.clipExtent&&n.clipExtent();return n.scale(150).translate([0,0]),e!=null&&n.clipExtent(null),Ct(i,n.stream(Vn)),t(Vn.result()),e!=null&&n.clipExtent(e),n}function kn(n,t,i){return Pn(n,function(e){var r=t[1][0]-t[0][0],f=t[1][1]-t[0][1],c=Math.min(r/(e[1][0]-e[0][0]),f/(e[1][1]-e[0][1])),v=+t[0][0]+(r-c*(e[1][0]+e[0][0]))/2,S=+t[0][1]+(f-c*(e[1][1]+e[0][1]))/2;n.scale(150*c).translate([v,S])},i)}function Yt(n,t,i){return kn(n,[[0,0],t],i)}function Jt(n,t,i){return Pn(n,function(e){var r=+t,f=r/(e[1][0]-e[0][0]),c=(r-f*(e[1][0]+e[0][0]))/2,v=-f*e[0][1];n.scale(150*f).translate([c,v])},i)}function Ut(n,t,i){return Pn(n,function(e){var r=+t,f=r/(e[1][1]-e[0][1]),c=-f*e[0][0],v=(r-f*(e[1][1]+e[0][1]))/2;n.scale(150*f).translate([c,v])},i)}var $n=16,Xt=B(30*q);function xn(n,t){return+t?Kt(n,t):Zt(n)}function Zt(n){return _n({point:function(t,i){t=n(t,i),this.stream.point(t[0],t[1])}})}function Kt(n,t){function i(e,r,f,c,v,S,h,u,o,l,a,p,w,g){var m=h-e,d=u-r,M=m*m+d*d;if(M>4*t&&w--){var E=c+l,A=v+a,R=S+p,I=hn(E*E+A*A+R*R),_=tn(R/=I),P=T(T(R)-1)<D||T(f-o)<D?(f+o)/2:nn(A,E),C=n(P,_),y=C[0],W=C[1],z=y-e,N=W-r,s=d*z-m*N;(s*s/M>t||T((m*z+d*N)/M-.5)>.3||c*l+v*a+S*p<Xt)&&(i(e,r,f,c,v,S,y,W,P,E/=I,A/=I,R,w,g),g.point(y,W),i(y,W,P,E,A,R,h,u,o,l,a,p,w,g))}}return function(e){var r,f,c,v,S,h,u,o,l,a,p,w,g={point:m,lineStart:d,lineEnd:E,polygonStart:function(){e.polygonStart(),g.lineStart=A},polygonEnd:function(){e.polygonEnd(),g.lineStart=d}};function m(_,P){_=n(_,P),e.point(_[0],_[1])}function d(){o=NaN,g.point=M,e.lineStart()}function M(_,P){var C=K([_,P]),y=n(_,P);i(o,l,u,a,p,w,o=y[0],l=y[1],u=_,a=C[0],p=C[1],w=C[2],$n,e),e.point(o,l)}function E(){g.point=m,e.lineEnd()}function A(){d(),g.point=R,g.lineEnd=I}function R(_,P){M(r=_,P),f=o,c=l,v=a,S=p,h=w,g.point=M}function I(){i(o,l,u,a,p,w,f,c,r,v,S,h,$n,e),g.lineEnd=E,E()}return g}}var Qt=_n({point:function(n,t){this.stream.point(n*q,t*q)}});function jt(n){return _n({point:function(t,i){var e=n(t,i);return this.stream.point(e[0],e[1])}})}function kt(n,t,i,e,r){function f(c,v){return c*=e,v*=r,[t+n*c,i-n*v]}return f.invert=function(c,v){return[(c-t)/n*e,(i-v)/n*r]},f}function Yn(n,t,i,e,r,f){if(!f)return kt(n,t,i,e,r);var c=B(f),v=G(f),S=c*n,h=v*n,u=c/n,o=v/n,l=(v*i-c*t)/n,a=(v*t+c*i)/n;function p(w,g){return w*=e,g*=r,[S*w-h*g+t,i-h*w-S*g]}return p.invert=function(w,g){return[e*(u*w-o*g+l),r*(a-o*w-u*g)]},p}function bt(n){return ne(function(){return n})()}function ne(n){var t,i=150,e=480,r=250,f=0,c=0,v=0,S=0,h=0,u,o=0,l=1,a=1,p=null,w=Wn,g=null,m,d,M,E=Hn,A=.5,R,I,_,P,C;function y(s){return _(s[0]*q,s[1]*q)}function W(s){return s=_.invert(s[0],s[1]),s&&[s[0]*$,s[1]*$]}y.stream=function(s){return P&&C===s?P:P=Qt(jt(u)(w(R(E(C=s)))))},y.preclip=function(s){return arguments.length?(w=s,p=void 0,N()):w},y.postclip=function(s){return arguments.length?(E=s,g=m=d=M=null,N()):E},y.clipAngle=function(s){return arguments.length?(w=+s?Wt(p=s*q):(p=null,Wn),N()):p*$},y.clipExtent=function(s){return arguments.length?(E=s==null?(g=m=d=M=null,Hn):Vt(g=+s[0][0],m=+s[0][1],d=+s[1][0],M=+s[1][1]),N()):g==null?null:[[g,m],[d,M]]},y.scale=function(s){return arguments.length?(i=+s,z()):i},y.translate=function(s){return arguments.length?(e=+s[0],r=+s[1],z()):[e,r]},y.center=function(s){return arguments.length?(f=s[0]%360*q,c=s[1]%360*q,z()):[f*$,c*$]},y.rotate=function(s){return arguments.length?(v=s[0]%360*q,S=s[1]%360*q,h=s.length>2?s[2]%360*q:0,z()):[v*$,S*$,h*$]},y.angle=function(s){return arguments.length?(o=s%360*q,z()):o*$},y.reflectX=function(s){return arguments.length?(l=s?-1:1,z()):l<0},y.reflectY=function(s){return arguments.length?(a=s?-1:1,z()):a<0},y.precision=function(s){return arguments.length?(R=xn(I,A=s*s),N()):hn(A)},y.fitExtent=function(s,F){return kn(y,s,F)},y.fitSize=function(s,F){return Yt(y,s,F)},y.fitWidth=function(s,F){return Jt(y,s,F)},y.fitHeight=function(s,F){return Ut(y,s,F)};function z(){var s=Yn(i,0,0,l,a,o).apply(null,t(f,c)),F=Yn(i,e-s[0],r-s[1],l,a,o);return u=Zn(v,S,h),I=yn(t,F),_=yn(u,I),R=xn(I,A),N()}function N(){return P=C=null,y}return function(){return t=n.apply(this,arguments),y.invert=t.invert&&W,z()}}function Rn(n,t){return[n,At(Ft((V+t)/2))]}Rn.invert=function(n,t){return[n,2*Xn(Rt(t))-V]};function te(){return ee(Rn).scale(961/Y)}function ee(n){var t=bt(n),i=t.center,e=t.scale,r=t.translate,f=t.clipExtent,c=null,v,S,h;t.scale=function(o){return arguments.length?(e(o),u()):e()},t.translate=function(o){return arguments.length?(r(o),u()):r()},t.center=function(o){return arguments.length?(i(o),u()):i()},t.clipExtent=function(o){return arguments.length?(o==null?c=v=S=h=null:(c=+o[0][0],v=+o[0][1],S=+o[1][0],h=+o[1][1]),u()):c==null?null:[[c,v],[S,h]]};function u(){var o=L*e(),l=t(Nt(t.rotate()).invert([0,0]));return f(c==null?[[l[0]-o,l[1]-o],[l[0]+o,l[1]+o]]:n===Rn?[[Math.max(l[0]-o,c),v],[Math.min(l[0]+o,S),h]]:[[c,Math.max(l[1]-o,v)],[S,Math.min(l[1]+o,h)]])}return u()}const ie=n=>(yt("data-v-65e4d0aa"),n=n(),Mt(),n),re=ie(()=>Jn("div",{class:"tip"},null,-1)),oe={__name:"MapScene",setup(n){let t=null;const i=Ln(null),e=Ln(null),r=()=>new bn,f=o=>{const l=new nt(45,o,1,1e3);return l.position.set(0,0,120),l.lookAt(0,0,0),l},c=(o,l,a)=>{const p=new tt({canvas:o,antialias:!0});return p.setSize(l,a),p.setPixelRatio(window.devicePixelRatio),p},v=(o,l)=>{const a=new vt(o,l);return a.minDistance=6,a.maxDistance=400,a},S=o=>{new et().load("/src/assets/json/china.json",a=>{const p=JSON.parse(a);o&&o(p)})},h=(o,l)=>{const a=new An;return l.geometry.coordinates.forEach(w=>{w.forEach(g=>{const m=[],d=new ut;g.forEach((R,I)=>{if(Array.isArray(R)){const[_,P]=o(R);m.push(new In(_,-P,0)),I===0?d.moveTo(_,-P):d.lineTo(_,-P)}});const M={depth:3,bevelEnabled:!1},E=new lt(new at(d,M),new ft({color:"#7FFFD4",transparent:!0,opacity:.5})),A=new ct(new st().setFromPoints(m),new pt({color:"#fff"}));a.add(A),a.add(E)})}),a},u=(o,l,a)=>{const p=new it,w=new rt,g=m=>{w.x=m.clientX/window.innerWidth*2-1,w.y=-(m.clientY/window.innerHeight)*2+1,p.setFromCamera(w,o);const d=p.intersectObjects(l);d.length>0&&a&&a(d[0].object)};return document.addEventListener("pointermove",g),()=>{document.removeEventListener("pointermove",g)}};return St(()=>{const o=i.value,l=e.value,a=l.clientWidth,p=l.clientHeight,w=l.querySelector(".tip");let g=null;const m=r(),d=f(a/p),M=c(o,a,p),E=v(d,M.domElement);S(I=>{const _=new ot,P=te().center([104,37.5]).scale(60).translate([0,0]);I.features.forEach(C=>{const y=h(P,C),{name:W,center:z}=C.properties;if(W&&Array.isArray(z)){const[N,s]=P(z);y.userData={name:W,center:ht(d,new In(N,-s,0))}}_.add(y)}),m.add(_)});const A=u(d,m.children,I=>{if(!I||!I.isMesh)return;if(g){if(I.uuid===g.uuid)return;g.material.color=new Fn("#7FFFD4")}const _=I.parent;if(_&&Object.keys(_.userData).length>0){const{name:P,center:C}=_.userData;w.textContent=P,w.style.transform=`translate(${C.x}px, ${C.y}px)`}I.material.color=new Fn("#FF0000"),I.material.needsUpdate=!0,g=I}),R=()=>{E.update(),M.render(m,d),t=window.requestAnimationFrame(R)};R(),dt(()=>{A(),M.dispose(),M.forceContextLoss(),m.traverse(I=>{if(I instanceof An){const{geometry:_,material:P}=I;_&&_.dispose();const C=Array.isArray(P)?P:[P];for(const y of C)y&&y.dispose()}}),window.cancelAnimationFrame(t)})}),(o,l)=>(Et(),wt("div",{ref_key:"containerElementRef",ref:e,class:"container"},[re,Jn("canvas",{ref_key:"canvasElementRef",ref:i},null,512)],512))}},ce=gt(oe,[["__scopeId","data-v-65e4d0aa"]]);export{ce as default};