(this.webpackJsonpemilus=this.webpackJsonpemilus||[]).push([[2],{529:function(e,t,n){"use strict";var r=n(3),i=n(4),a=n(0),o=n(6),l=n.n(o),c=n(45),s=n(60),p=n(40),d=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},u=function(e,t){var n=e.prefixCls,o=e.component,u=void 0===o?"article":o,f=e.className,y=e["aria-label"],b=e.setContentRef,h=e.children,v=d(e,["prefixCls","component","className","aria-label","setContentRef","children"]),m=t;return b&&(Object(p.a)(!1,"Typography","`setContentRef` is deprecated. Please use `ref` instead."),m=Object(c.a)(t,b)),a.createElement(s.a,null,(function(e){var t=e.getPrefixCls,o=e.direction,c=u,s=t("typography",n),p=l()(s,Object(i.a)({},"".concat(s,"-rtl"),"rtl"===o),f);return a.createElement(c,Object(r.a)({className:p,"aria-label":y,ref:m},v),h)}))},f=a.forwardRef(u);f.displayName="Typography";var y=f,b=n(23),h=n(36),v=n(11),m=n(12),g=n(14),O=n(15),E=n(18),x=n(52),j=n(279),C=n.n(j),S={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"}}]},name:"edit",theme:"outlined"},w=n(13),k=function(e,t){return a.createElement(w.a,Object.assign({},e,{ref:t,icon:S}))};k.displayName="EditOutlined";var N=a.forwardRef(k),T=n(196),P=n(454),R=n(78),I=n(30),z=n(121),L=n(31),H=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},A={border:0,background:"transparent",padding:0,lineHeight:"inherit",display:"inline-block"},M=a.forwardRef((function(e,t){var n=e.style,i=e.noStyle,o=e.disabled,l=H(e,["style","noStyle","disabled"]),c={};return i||(c=Object(r.a)({},A)),o&&(c.pointerEvents="none"),c=Object(r.a)(Object(r.a)({},c),n),a.createElement("div",Object(r.a)({role:"button",tabIndex:0,ref:t},l,{onKeyDown:function(e){e.keyCode===L.a.ENTER&&e.preventDefault()},onKeyUp:function(t){var n=t.keyCode,r=e.onClick;n===L.a.ENTER&&r&&r()},style:c}))})),K=n(183),D=n(482),F=n(191),U=n(7),B={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z"}}]},name:"enter",theme:"outlined"},W=function(e,t){return a.createElement(w.a,Object.assign({},e,{ref:t,icon:B}))};W.displayName="EnterOutlined";var J,V=a.forwardRef(W),_=n(243),q=function(e){var t=e.prefixCls,n=e["aria-label"],r=e.className,o=e.style,c=e.direction,s=e.maxLength,p=e.autoSize,d=void 0===p||p,u=e.value,f=e.onSave,y=e.onCancel,b=e.onEnd,h=a.useRef(),v=a.useRef(!1),m=a.useRef(),g=a.useState(u),O=Object(U.a)(g,2),E=O[0],x=O[1];a.useEffect((function(){x(u)}),[u]),a.useEffect((function(){if(h.current&&h.current.resizableTextArea){var e=h.current.resizableTextArea.textArea;e.focus();var t=e.value.length;e.setSelectionRange(t,t)}}),[]);var j=function(){f(E.trim())},C=l()(t,"".concat(t,"-edit-content"),Object(i.a)({},"".concat(t,"-rtl"),"rtl"===c),r);return a.createElement("div",{className:C,style:o},a.createElement(_.a,{ref:h,maxLength:s,value:E,onChange:function(e){var t=e.target;x(t.value.replace(/[\n\r]/g,""))},onKeyDown:function(e){var t=e.keyCode;v.current||(m.current=t)},onKeyUp:function(e){var t=e.keyCode,n=e.ctrlKey,r=e.altKey,i=e.metaKey,a=e.shiftKey;m.current!==t||v.current||n||r||i||a||(t===L.a.ENTER?(j(),null===b||void 0===b||b()):t===L.a.ESC&&y())},onCompositionStart:function(){v.current=!0},onCompositionEnd:function(){v.current=!1},onBlur:function(){j()},"aria-label":n,autoSize:d}),a.createElement(V,{className:"".concat(t,"-edit-content-confirm")}))},G=n(42),Q={padding:0,margin:0,display:"inline",lineHeight:"inherit"};function X(e){if(!e)return 0;var t=e.match(/^\d*(\.\d*)?/);return t?Number(t[0]):0}var Y=function(e,t,n,r,i){J||((J=document.createElement("div")).setAttribute("aria-hidden","true"),document.body.appendChild(J));var o,l=t.rows,c=t.suffix,s=void 0===c?"":c,p=window.getComputedStyle(e),d=(o=p,Array.prototype.slice.apply(o).map((function(e){return"".concat(e,": ").concat(o.getPropertyValue(e),";")})).join("")),u=X(p.lineHeight),f=Math.round(u*(l+1)+X(p.paddingTop)+X(p.paddingBottom));J.setAttribute("style",d),J.style.position="fixed",J.style.left="0",J.style.height="auto",J.style.minHeight="auto",J.style.maxHeight="auto",J.style.top="-999999px",J.style.zIndex="-1000",J.style.textOverflow="clip",J.style.whiteSpace="normal",J.style.webkitLineClamp="none";var y=function(e){var t=[];return e.forEach((function(e){var n=t[t.length-1];"string"===typeof e&&"string"===typeof n?t[t.length-1]+=e:t.push(e)})),t}(Object(x.a)(n));function b(){return J.offsetHeight<f}if(Object(G.render)(a.createElement("div",{style:Q},a.createElement("span",{style:Q},y,s),a.createElement("span",{style:Q},r)),J),b())return Object(G.unmountComponentAtNode)(J),{content:n,text:J.innerHTML,ellipsis:!1};var h=Array.prototype.slice.apply(J.childNodes[0].childNodes[0].cloneNode(!0).childNodes).filter((function(e){return 8!==e.nodeType})),v=Array.prototype.slice.apply(J.childNodes[0].childNodes[1].cloneNode(!0).childNodes);Object(G.unmountComponentAtNode)(J);var m=[];J.innerHTML="";var g=document.createElement("span");J.appendChild(g);var O=document.createTextNode(i+s);function E(e){g.insertBefore(e,O)}function j(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t.length,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,a=Math.floor((n+r)/2),o=t.slice(0,a);if(e.textContent=o,n>=r-1)for(var l=r;l>=n;l-=1){var c=t.slice(0,l);if(e.textContent=c,b()||!c)return l===t.length?{finished:!1,reactNode:t}:{finished:!0,reactNode:c}}return b()?j(e,t,a,r,a):j(e,t,n,a,i)}function C(e,t){var n=e.nodeType;if(1===n)return E(e),b()?{finished:!1,reactNode:y[t]}:(g.removeChild(e),{finished:!0,reactNode:null});if(3===n){var r=e.textContent||"",i=document.createTextNode(r);return E(i),j(i,r)}return{finished:!1,reactNode:null}}return g.appendChild(O),v.forEach((function(e){J.appendChild(e)})),h.some((function(e,t){var n=C(e,t),r=n.finished,i=n.reactNode;return i&&m.push(i),r})),{content:m,text:J.innerHTML,ellipsis:!0}},Z=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},$=Object(D.c)("webkitLineClamp"),ee=Object(D.c)("textOverflow");var te=function(e){Object(O.a)(n,e);var t=Object(E.a)(n);function n(){var e;return Object(m.a)(this,n),(e=t.apply(this,arguments)).contentRef=a.createRef(),e.state={edit:!1,copied:!1,ellipsisText:"",ellipsisContent:null,isEllipsis:!1,expanded:!1,clientRendered:!1},e.getPrefixCls=function(){var t=e.props.prefixCls;return(0,e.context.getPrefixCls)("typography",t)},e.onExpandClick=function(t){var n,r=e.getEllipsis().onExpand;e.setState({expanded:!0}),null===(n=r)||void 0===n||n(t)},e.onEditClick=function(){e.triggerEdit(!0)},e.onEditChange=function(t){var n=e.getEditable().onChange;null===n||void 0===n||n(t),e.triggerEdit(!1)},e.onEditCancel=function(){var t,n;null===(n=(t=e.getEditable()).onCancel)||void 0===n||n.call(t),e.triggerEdit(!1)},e.onCopyClick=function(t){t.preventDefault();var n=e.props,i=n.children,a=n.copyable,o=Object(r.a)({},"object"===Object(b.a)(a)?a:null);void 0===o.text&&(o.text=String(i)),C()(o.text||""),e.setState({copied:!0},(function(){o.onCopy&&o.onCopy(),e.copyId=window.setTimeout((function(){e.setState({copied:!1})}),3e3)}))},e.setEditRef=function(t){e.editIcon=t},e.triggerEdit=function(t){var n=e.getEditable().onStart;t&&n&&n(),e.setState({edit:t},(function(){!t&&e.editIcon&&e.editIcon.focus()}))},e.resizeOnNextFrame=function(){K.a.cancel(e.rafId),e.rafId=Object(K.a)((function(){e.syncEllipsis()}))},e}return Object(g.a)(n,[{key:"componentDidMount",value:function(){this.setState({clientRendered:!0}),this.resizeOnNextFrame()}},{key:"componentDidUpdate",value:function(e){var t=this.props.children,n=this.getEllipsis(),r=this.getEllipsis(e);t===e.children&&n.rows===r.rows||this.resizeOnNextFrame()}},{key:"componentWillUnmount",value:function(){window.clearTimeout(this.copyId),K.a.cancel(this.rafId)}},{key:"getEditable",value:function(e){var t=this.state.edit,n=(e||this.props).editable;return n?Object(r.a)({editing:t},"object"===Object(b.a)(n)?n:null):{editing:t}}},{key:"getEllipsis",value:function(e){var t=(e||this.props).ellipsis;return t?Object(r.a)({rows:1,expandable:!1},"object"===Object(b.a)(t)?t:null):{}}},{key:"canUseCSSEllipsis",value:function(){var e=this.state.clientRendered,t=this.props,n=t.editable,r=t.copyable,i=this.getEllipsis(),a=i.rows,o=i.expandable,l=i.suffix,c=i.onEllipsis,s=i.tooltip;return!l&&!s&&(!(n||r||o||!e||c)&&(1===a?ee:$))}},{key:"syncEllipsis",value:function(){var e=this.state,t=e.ellipsisText,n=e.isEllipsis,r=e.expanded,i=this.getEllipsis(),a=i.rows,o=i.suffix,l=i.onEllipsis,c=this.props.children;if(a&&!(a<0)&&this.contentRef.current&&!r&&!this.canUseCSSEllipsis()){Object(p.a)(Object(x.a)(c).every((function(e){return"string"===typeof e})),"Typography","`ellipsis` should use string as children only.");var s=Y(this.contentRef.current,{rows:a,suffix:o},c,this.renderOperations(!0),"..."),d=s.content,u=s.text,f=s.ellipsis;t===u&&n===f||(this.setState({ellipsisText:u,ellipsisContent:d,isEllipsis:f}),n!==f&&l&&l(f))}}},{key:"renderExpand",value:function(e){var t,n=this.getEllipsis(),r=n.expandable,i=n.symbol,o=this.state,l=o.expanded,c=o.isEllipsis;return r&&(e||!l&&c)?(t=i||this.expandStr,a.createElement("a",{key:"expand",className:"".concat(this.getPrefixCls(),"-expand"),onClick:this.onExpandClick,"aria-label":this.expandStr},t)):null}},{key:"renderEdit",value:function(){var e=this.props.editable;if(e){var t=e.icon,n=e.tooltip,r=Object(x.a)(n)[0]||this.editStr,i="string"===typeof r?r:"";return a.createElement(F.a,{key:"edit",title:!1===n?"":r},a.createElement(M,{ref:this.setEditRef,className:"".concat(this.getPrefixCls(),"-edit"),onClick:this.onEditClick,"aria-label":i},t||a.createElement(N,{role:"button"})))}}},{key:"renderCopy",value:function(){var e=this.state.copied,t=this.props.copyable;if(t){var n=this.getPrefixCls(),r=t.tooltips,i=Object(x.a)(r);0===i.length&&(i=[this.copyStr,this.copiedStr]);var o=e?i[1]:i[0],c="string"===typeof o?o:"",s=Object(x.a)(t.icon);return a.createElement(F.a,{key:"copy",title:!1===r?"":o},a.createElement(M,{className:l()("".concat(n,"-copy"),e&&"".concat(n,"-copy-success")),onClick:this.onCopyClick,"aria-label":c},e?s[1]||a.createElement(T.a,null):s[0]||a.createElement(P.a,null)))}}},{key:"renderEditInput",value:function(){var e=this.props,t=e.children,n=e.className,r=e.style,i=this.context.direction,o=this.getEditable(),l=o.maxLength,c=o.autoSize,s=o.onEnd;return a.createElement(q,{value:"string"===typeof t?t:"",onSave:this.onEditChange,onCancel:this.onEditCancel,onEnd:s,prefixCls:this.getPrefixCls(),className:n,style:r,direction:i,maxLength:l,autoSize:c})}},{key:"renderOperations",value:function(e){return[this.renderExpand(e),this.renderEdit(),this.renderCopy()].filter((function(e){return e}))}},{key:"renderContent",value:function(){var e=this,t=this.state,n=t.ellipsisContent,o=t.isEllipsis,c=t.expanded,s=this.props,p=s.component,d=s.children,u=s.className,f=s.type,b=s.disabled,m=s.style,g=Z(s,["component","children","className","type","disabled","style"]),O=this.context.direction,E=this.getEllipsis(),x=E.rows,j=E.suffix,C=E.tooltip,S=this.getPrefixCls(),w=Object(h.a)(g,["prefixCls","editable","copyable","ellipsis","mark","code","delete","underline","strong","keyboard"].concat(Object(v.a)(I.a))),k=this.canUseCSSEllipsis(),N=1===x&&k,T=x&&x>1&&k,P=d;if(x&&o&&!c&&!k){var L=g.title,H=L||"";L||"string"!==typeof d&&"number"!==typeof d||(H=String(d)),H=H.slice(String(n||"").length),P=a.createElement(a.Fragment,null,n,a.createElement("span",{title:H,"aria-hidden":"true"},"..."),j),C&&(P=a.createElement(F.a,{title:!0===C?d:C},a.createElement("span",null,P)))}else P=a.createElement(a.Fragment,null,d,j);return P=function(e,t){var n=e.mark,r=e.code,i=e.underline,o=e.delete,l=e.strong,c=e.keyboard,s=t;function p(e,t){e&&(s=a.createElement(t,{},s))}return p(l,"strong"),p(i,"u"),p(o,"del"),p(r,"code"),p(n,"mark"),p(c,"kbd"),s}(this.props,P),a.createElement(z.a,{componentName:"Text"},(function(t){var n,o=t.edit,c=t.copy,s=t.copied,d=t.expand;return e.editStr=o,e.copyStr=c,e.copiedStr=s,e.expandStr=d,a.createElement(R.a,{onResize:e.resizeOnNextFrame,disabled:!x},a.createElement(y,Object(r.a)({className:l()((n={},Object(i.a)(n,"".concat(S,"-").concat(f),f),Object(i.a)(n,"".concat(S,"-disabled"),b),Object(i.a)(n,"".concat(S,"-ellipsis"),x),Object(i.a)(n,"".concat(S,"-ellipsis-single-line"),N),Object(i.a)(n,"".concat(S,"-ellipsis-multiple-line"),T),n),u),style:Object(r.a)(Object(r.a)({},m),{WebkitLineClamp:T?x:void 0}),component:p,ref:e.contentRef,direction:O},w),P,e.renderOperations()))}))}},{key:"render",value:function(){return this.getEditable().editing?this.renderEditInput():this.renderContent()}}],[{key:"getDerivedStateFromProps",value:function(e){var t=e.children,n=e.editable;return Object(p.a)(!n||"string"===typeof t,"Typography","When `editable` is enabled, the `children` should use string."),{}}}]),n}(a.Component);te.contextType=s.b,te.defaultProps={children:""};var ne=te,re=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},ie=function(e){var t=e.ellipsis,n=re(e,["ellipsis"]),i=a.useMemo((function(){return t&&"object"===Object(b.a)(t)?Object(h.a)(t,["expandable","rows"]):t}),[t]);return Object(p.a)("object"!==Object(b.a)(t)||!t||!("expandable"in t)&&!("rows"in t),"Typography.Text","`ellipsis` do not support `expandable` or `rows` props."),a.createElement(ne,Object(r.a)({},n,{ellipsis:i,component:"span"}))},ae=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},oe=function(e,t){var n=e.ellipsis,i=e.rel,o=ae(e,["ellipsis","rel"]);Object(p.a)("object"!==Object(b.a)(n),"Typography.Link","`ellipsis` only supports boolean value.");var l=a.useRef(null);a.useImperativeHandle(t,(function(){var e;return null===(e=l.current)||void 0===e?void 0:e.contentRef.current}));var c=Object(r.a)(Object(r.a)({},o),{rel:void 0===i&&"_blank"===o.target?"noopener noreferrer":i});return delete c.navigate,a.createElement(ne,Object(r.a)({},c,{ref:l,ellipsis:!!n,component:"a"}))},le=a.forwardRef(oe),ce=n(56),se=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},pe=Object(ce.b)(1,2,3,4,5),de=function(e){var t,n=e.level,i=void 0===n?1:n,o=se(e,["level"]);return-1!==pe.indexOf(i)?t="h".concat(i):(Object(p.a)(!1,"Typography.Title","Title only accept `1 | 2 | 3 | 4 | 5` as `level` value. And `5` need 4.6.0+ version."),t="h1"),a.createElement(ne,Object(r.a)({},o,{component:t}))},ue=function(e){return a.createElement(ne,Object(r.a)({},e,{component:"div"}))},fe=y;fe.Text=ie,fe.Link=le,fe.Title=de,fe.Paragraph=ue;t.a=fe}}]);
//# sourceMappingURL=2.191ade20.chunk.js.map