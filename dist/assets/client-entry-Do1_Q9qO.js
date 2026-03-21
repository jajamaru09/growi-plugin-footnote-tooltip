const F="growi-plugin-footnote-tooltip",R={name:F},O=function(e){if(e==null)return E;if(typeof e=="function")return w(e);if(typeof e=="object")return Array.isArray(e)?V(e):S(e);if(typeof e=="string")return j(e);throw new Error("Expected function, string, or object as test")};function V(e){const t=[];let n=-1;for(;++n<e.length;)t[n]=O(e[n]);return w(r);function r(...i){let o=-1;for(;++o<t.length;)if(t[o].apply(this,i))return!0;return!1}}function S(e){const t=e;return w(n);function n(r){const i=r;let o;for(o in e)if(i[o]!==t[o])return!1;return!0}}function j(e){return w(t);function t(n){return n&&n.type===e}}function w(e){return t;function t(n,r,i){return!!(I(n)&&e.call(this,n,typeof r=="number"?r:void 0,i||void 0))}}function E(){return!0}function I(e){return e!==null&&typeof e=="object"&&"type"in e}const v=[],T=!0,k=!1,b="skip";function _(e,t,n,r){let i;typeof t=="function"&&typeof n!="function"?(r=n,n=t):i=t;const o=O(i),u=r?-1:1;f(e,void 0,[])();function f(s,d,p){const l=s&&typeof s=="object"?s:{};if(typeof l.type=="string"){const c=typeof l.tagName=="string"?l.tagName:typeof l.name=="string"?l.name:void 0;Object.defineProperty(a,"name",{value:"node ("+(s.type+(c?"<"+c+">":""))+")"})}return a;function a(){let c=v,g,y,x;if((!t||o(s,d,p[p.length-1]||void 0))&&(c=C(n(s,p)),c[0]===k))return c;if("children"in s&&s.children){const h=s;if(h.children&&c[0]!==b)for(y=(r?h.children.length:-1)+u,x=p.concat(h);y>-1&&y<h.children.length;){const G=h.children[y];if(g=f(G,y,x)(),g[0]===k)return g;y=typeof g[1]=="number"?g[1]:y+u}}return c}}}function C(e){return Array.isArray(e)?e:typeof e=="number"?[T,e]:e==null?v:[e]}function P(e,t,n,r){let i,o,u;o=t,u=n,i=r,_(e,o,f,i);function f(s,d){const p=d[d.length-1],l=p?p.children.indexOf(s):void 0;return u(s,l,p)}}const z=`
.footnote-tooltip-wrapper {
  position: relative;
}
.footnote-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: #fff9c4;
  border: 1px solid #f0e68c;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.9em;
  line-height: 1.5;
  width: max-content;
  max-width: 300px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  white-space: normal;
}
.footnote-tooltip-wrapper:hover .footnote-tooltip {
  display: block;
}
`.trim();function B(e){return JSON.parse(JSON.stringify(e))}function A(e){return e.filter(t=>!(t.type==="element"&&t.tagName==="a"&&(t.properties??{}).dataFootnoteBackref!=null)).map(t=>t.type==="element"&&t.children?{...t,children:A(t.children)}:t)}function L(e){const t=new Map;return P(e,"element",n=>{var r;if(n.tagName==="section"&&((r=n.properties)==null?void 0:r.dataFootnotes)!=null)return P(n,"element",i=>{var o;if(i.tagName==="li"&&typeof((o=i.properties)==null?void 0:o.id)=="string"){const u=i.properties.id,f=B(i.children);t.set(u,A(f))}}),b}),t}const N=()=>e=>{const t=L(e);if(t.size===0)return;P(e,"element",r=>{var l;if(r.tagName!=="sup")return;const i=r.children.find(a=>{var c;return a.type==="element"&&a.tagName==="a"&&((c=a.properties)==null?void 0:c.dataFootnoteRef)!=null});if(!i)return;const u=String(((l=i.properties)==null?void 0:l.href)??"").replace(/^#/,""),f=t.get(u);if(!f)return;r.properties=r.properties??{};const s=r.properties.className,d=Array.isArray(s)?s.filter(a=>typeof a=="string"||typeof a=="number"):s!=null?[s]:[];d.push("footnote-tooltip-wrapper"),r.properties.className=d;const p={type:"element",tagName:"span",properties:{className:["footnote-tooltip"]},children:f};return r.children.push(p),b});const n={type:"element",tagName:"style",properties:{},children:[{type:"text",value:z}]};e.children.unshift(n)},m=()=>{const e=window.growiFacade;if((e==null?void 0:e.markdownRenderer)==null)return;const{optionsGenerators:t}=e.markdownRenderer,n=t.customGenerateViewOptions;t.customGenerateViewOptions=(...i)=>{const o=(n??t.generateViewOptions)(...i);return o.rehypePlugins=o.rehypePlugins??[],o.rehypePlugins.push(N),o};const r=t.customGeneratePreviewOptions;t.customGeneratePreviewOptions=(...i)=>{const o=(r??t.generatePreviewOptions)(...i);return o.rehypePlugins=o.rehypePlugins??[],o.rehypePlugins.push(N),o},m._origView=n,m._origPreview=r},J=()=>{const e=window.growiFacade;if((e==null?void 0:e.markdownRenderer)==null)return;const{optionsGenerators:t}=e.markdownRenderer,n=m._origView,r=m._origPreview;n!==void 0&&(t.customGenerateViewOptions=n),r!==void 0&&(t.customGeneratePreviewOptions=r)};window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[R.name]={activate:m,deactivate:J};
