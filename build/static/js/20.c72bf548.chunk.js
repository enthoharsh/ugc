(this.webpackJsonpemilus=this.webpackJsonpemilus||[]).push([[20],{277:function(e,t,c){"use strict";var n=c(4),a=c(3),r=c(23),o=c(0),i=c(6),s=c.n(i),l=c(479),u=c(60),d=function(e,t){var c={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(c[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(c[n[a]]=e[n[a]])}return c};var f=["xs","sm","md","lg","xl","xxl"],b=o.forwardRef((function(e,t){var c,i=o.useContext(u.b),b=i.getPrefixCls,p=i.direction,j=o.useContext(l.a),m=j.gutter,O=j.wrap,h=j.supportFlexGap,x=e.prefixCls,y=e.span,v=e.order,g=e.offset,w=e.push,C=e.pull,N=e.className,E=e.children,P=e.flex,A=e.style,k=d(e,["prefixCls","span","order","offset","push","pull","className","children","flex","style"]),R=b("col",x),S={};f.forEach((function(t){var c,o={},i=e[t];"number"===typeof i?o.span=i:"object"===Object(r.a)(i)&&(o=i||{}),delete k[t],S=Object(a.a)(Object(a.a)({},S),(c={},Object(n.a)(c,"".concat(R,"-").concat(t,"-").concat(o.span),void 0!==o.span),Object(n.a)(c,"".concat(R,"-").concat(t,"-order-").concat(o.order),o.order||0===o.order),Object(n.a)(c,"".concat(R,"-").concat(t,"-offset-").concat(o.offset),o.offset||0===o.offset),Object(n.a)(c,"".concat(R,"-").concat(t,"-push-").concat(o.push),o.push||0===o.push),Object(n.a)(c,"".concat(R,"-").concat(t,"-pull-").concat(o.pull),o.pull||0===o.pull),Object(n.a)(c,"".concat(R,"-rtl"),"rtl"===p),c))}));var G=s()(R,(c={},Object(n.a)(c,"".concat(R,"-").concat(y),void 0!==y),Object(n.a)(c,"".concat(R,"-order-").concat(v),v),Object(n.a)(c,"".concat(R,"-offset-").concat(g),g),Object(n.a)(c,"".concat(R,"-push-").concat(w),w),Object(n.a)(c,"".concat(R,"-pull-").concat(C),C),c),N,S),D={};if(m&&m[0]>0){var F=m[0]/2;D.paddingLeft=F,D.paddingRight=F}if(m&&m[1]>0&&!h){var T=m[1]/2;D.paddingTop=T,D.paddingBottom=T}return P&&(D.flex=function(e){return"number"===typeof e?"".concat(e," ").concat(e," auto"):/^\d+(\.\d+)?(px|em|rem|%)$/.test(e)?"0 0 ".concat(e):e}(P),"auto"!==P||!1!==O||D.minWidth||(D.minWidth=0)),o.createElement("div",Object(a.a)({},k,{style:Object(a.a)(Object(a.a)({},D),A),className:G,ref:t}),E)}));b.displayName="Col",t.a=b},278:function(e,t,c){"use strict";var n=c(3),a=c(4),r=c(23),o=c(7),i=c(0),s=c(6),l=c.n(s),u=c(60),d=c(479),f=c(56),b=c(162),p=c(482),j=function(e,t){var c={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(c[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(c[n[a]]=e[n[a]])}return c},m=(Object(f.a)("top","middle","bottom","stretch"),Object(f.a)("start","end","center","space-around","space-between"),i.forwardRef((function(e,t){var c,s=e.prefixCls,f=e.justify,m=e.align,O=e.className,h=e.style,x=e.children,y=e.gutter,v=void 0===y?0:y,g=e.wrap,w=j(e,["prefixCls","justify","align","className","style","children","gutter","wrap"]),C=i.useContext(u.b),N=C.getPrefixCls,E=C.direction,P=i.useState({xs:!0,sm:!0,md:!0,lg:!0,xl:!0,xxl:!0}),A=Object(o.a)(P,2),k=A[0],R=A[1],S=function(){var e=i.useState(!1),t=Object(o.a)(e,2),c=t[0],n=t[1];return i.useEffect((function(){n(Object(p.b)())}),[]),c}(),G=i.useRef(v);i.useEffect((function(){var e=b.a.subscribe((function(e){var t=G.current||0;(!Array.isArray(t)&&"object"===Object(r.a)(t)||Array.isArray(t)&&("object"===Object(r.a)(t[0])||"object"===Object(r.a)(t[1])))&&R(e)}));return function(){return b.a.unsubscribe(e)}}),[]);var D=N("row",s),F=function(){var e=[0,0];return(Array.isArray(v)?v:[v,0]).forEach((function(t,c){if("object"===Object(r.a)(t))for(var n=0;n<b.b.length;n++){var a=b.b[n];if(k[a]&&void 0!==t[a]){e[c]=t[a];break}}else e[c]=t||0})),e}(),T=l()(D,(c={},Object(a.a)(c,"".concat(D,"-no-wrap"),!1===g),Object(a.a)(c,"".concat(D,"-").concat(f),f),Object(a.a)(c,"".concat(D,"-").concat(m),m),Object(a.a)(c,"".concat(D,"-rtl"),"rtl"===E),c),O),W={},B=F[0]>0?F[0]/-2:void 0,I=F[1]>0?F[1]/-2:void 0;if(B&&(W.marginLeft=B,W.marginRight=B),S){var J=Object(o.a)(F,2);W.rowGap=J[1]}else I&&(W.marginTop=I,W.marginBottom=I);var L=i.useMemo((function(){return{gutter:F,wrap:g,supportFlexGap:S}}),[F,g,S]);return i.createElement(d.a.Provider,{value:L},i.createElement("div",Object(n.a)({},w,{className:T,style:Object(n.a)(Object(n.a)({},W),h),ref:t}),x))})));m.displayName="Row";t.a=m},479:function(e,t,c){"use strict";var n=c(0),a=Object(n.createContext)({});t.a=a},480:function(e,t,c){"use strict";var n=c(277);t.a=n.a},481:function(e,t,c){"use strict";var n=c(278);t.a=n.a},482:function(e,t,c){"use strict";c.d(t,"a",(function(){return r})),c.d(t,"c",(function(){return o})),c.d(t,"b",(function(){return i}));var n,a=c(70),r=function(){return Object(a.a)()&&window.document.documentElement},o=function(e){if(r()){var t=Array.isArray(e)?e:[e],c=window.document.documentElement;return t.some((function(e){return e in c.style}))}return!1},i=function(){if(!r())return!1;if(void 0!==n)return n;var e=document.createElement("div");return e.style.display="flex",e.style.flexDirection="column",e.style.rowGap="1px",e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div")),document.body.appendChild(e),n=1===e.scrollHeight,document.body.removeChild(e),n}},525:function(e,t,c){"use strict";c.r(t);c(0);var n=c(481),a=c(480),r=c(100),o=c(465),i=c(17),s=c(46),l=c(165),u=c(37),d=c(1);t.default=()=>{const e=Object(u.c)((e=>e.theme.currentTheme));return Object(d.jsx)("div",{className:"h-100 ".concat("light"===e?"bg-white":""),children:Object(d.jsxs)("div",{className:"container-fluid d-flex flex-column justify-content-between h-100 px-md-4 pb-md-4 pt-md-1",children:[Object(d.jsx)("div",{children:Object(d.jsx)("img",{className:"img-fluid",src:"/img/".concat("light"===e?"logo.png":"logo-white.png"),alt:""})}),Object(d.jsx)("div",{className:"container",children:Object(d.jsxs)(n.a,{align:"middle",children:[Object(d.jsxs)(a.a,{xs:24,sm:24,md:8,children:[Object(d.jsx)("h1",{className:"font-weight-bold mb-4 display-4",children:"Page not found"}),Object(d.jsx)("p",{className:"font-size-md mb-4",children:"We've noticed you lost your way, no worries, we will help you to found the correct path."}),Object(d.jsx)(s.b,{to:"/app",children:Object(d.jsx)(r.a,{type:"primary",icon:Object(d.jsx)(o.a,{}),children:"Go back"})})]}),Object(d.jsx)(a.a,{xs:24,sm:24,md:{span:14,offset:2},children:Object(d.jsx)("img",{className:"img-fluid mt-md-0 mt-4",src:"/img/others/img-20.png",alt:""})})]})}),Object(d.jsxs)(l.a,{mobileFlex:!1,justifyContent:"between",children:[Object(d.jsxs)("span",{children:["Copyright  \xa9  ","".concat((new Date).getFullYear())," ",Object(d.jsx)("span",{className:"font-weight-semibold",children:"".concat(i.b)})]}),Object(d.jsxs)("div",{children:[Object(d.jsx)("a",{className:"text-gray",href:"/#",onClick:e=>e.preventDefault(),children:"Term & Conditions"}),Object(d.jsx)("span",{className:"mx-2 text-muted",children:" | "}),Object(d.jsx)("a",{className:"text-gray",href:"/#",onClick:e=>e.preventDefault(),children:"Privacy & Policy"})]})]})]})})}}}]);
//# sourceMappingURL=20.c72bf548.chunk.js.map