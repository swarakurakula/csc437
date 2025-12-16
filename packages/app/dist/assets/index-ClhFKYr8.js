(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var q,$e;class it extends Error{}it.prototype.name="InvalidTokenError";function Hs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function js(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Hs(t)}catch{return atob(t)}}function Ke(i,t){if(typeof i!="string")throw new it("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new it(`Invalid token specified: missing part #${e+1}`);let r;try{r=js(s)}catch(n){throw new it(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new it(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Is="mu:context",Wt=`${Is}:change`;class zs{constructor(t,e){this._proxy=Ds(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Ze extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new zs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Wt,t),t}detach(t){this.removeEventListener(Wt,t)}}function Ds(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(Wt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Fs(i,t){const e=Ge(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function Ge(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return Ge(i,r.host)}class qs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Qe(i="mu:message"){return(t,...e)=>t.dispatchEvent(new qs(e,i))}class ee{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Bs(i){return t=>({...t,...i})}const Yt="mu:auth:jwt",Xe=class ts extends ee{constructor(t,e){super((s,r)=>this.update(s,r),t,ts.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(Ws(s)),zt(r);case"auth/signout":return e(Ys()),zt(this._redirectForLogin);case"auth/redirect":return zt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Xe.EVENT_TYPE="auth:message";let es=Xe;const ss=Qe(es.EVENT_TYPE);function zt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class Vs extends Ze{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=J.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new es(this.context,this.redirect).attach(this)}}class lt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Yt),t}}class J extends lt{constructor(t){super();const e=Ke(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(Yt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Yt);return t?J.authenticate(t):new lt}}function Ws(i){return Bs({user:J.authenticate(i),token:i})}function Ys(){return i=>{const t=i.user;return{user:t&&t.authenticated?lt.deauthenticate(t):t,token:""}}}function Js(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Ks(i){return i.authenticated?Ke(i.token||""):{}}const Jt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:Vs,User:lt,dispatch:ss,headers:Js,payload:Ks},Symbol.toStringTag,{value:"Module"}));function wt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function Kt(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const rs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Kt,relay:wt},Symbol.toStringTag,{value:"Module"}));function se(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Zs=new DOMParser;function x(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=Zs.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return be(a);case"bigint":case"boolean":case"number":case"symbol":return be(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function be(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function mt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let Gs=(q=class extends HTMLElement{constructor(){super(),this._state={},mt(this).template(q.template).styles(q.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),wt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},Qs(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},q.template=x`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,q.styles=se`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,q);function Qs(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const Xs=Object.freeze(Object.defineProperty({__proto__:null,Element:Gs},Symbol.toStringTag,{value:"Module"})),is=class ns extends ee{constructor(t){super((e,s)=>this.update(e,s),t,ns.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(er(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(sr(s,r));break}}}};is.EVENT_TYPE="history:message";let re=is;class Ae extends Ze{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=tr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ie(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new re(this.context).attach(this)}}function tr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function er(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function sr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ie=Qe(re.EVENT_TYPE),rr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ae,Provider:Ae,Service:re,dispatch:ie},Symbol.toStringTag,{value:"Module"}));class ct{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Ee(this._provider,t);this._effects.push(r),e(r)}else Fs(this._target,this._contextLabel).then(r=>{const n=new Ee(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ee{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const os=class as extends HTMLElement{constructor(){super(),this._state={},this._user=new lt,this._authObserver=new ct(this,"blazing:auth"),mt(this).template(as.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ir(r,this._state,e,this.authorization).then(n=>tt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},tt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&we(this.src,this.authorization).then(e=>{this._state=e,tt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&we(this.src,this.authorization).then(r=>{this._state=r,tt(r,this)});break;case"new":s&&(this._state={},tt({},this));break}}};os.observedAttributes=["src","new","action"];os.template=x`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function we(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function tt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function ir(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const nr=class ls extends ee{constructor(t,e){super(e,t,ls.EVENT_TYPE,!1)}};nr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,ne=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oe=Symbol(),Se=new WeakMap;let cs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ne&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Se.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Se.set(e,t))}return t}toString(){return this.cssText}};const or=i=>new cs(typeof i=="string"?i:i+"",void 0,oe),ar=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new cs(e,i,oe)},lr=(i,t)=>{if(ne)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=At.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},xe=ne?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return or(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cr,defineProperty:hr,getOwnPropertyDescriptor:ur,getOwnPropertyNames:dr,getOwnPropertySymbols:pr,getPrototypeOf:fr}=Object,K=globalThis,Pe=K.trustedTypes,mr=Pe?Pe.emptyScript:"",ke=K.reactiveElementPolyfillSupport,nt=(i,t)=>i,St={toAttribute(i,t){switch(t){case Boolean:i=i?mr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ae=(i,t)=>!cr(i,t),Ce={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),K.litPropertyMetadata??(K.litPropertyMetadata=new WeakMap);let V=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ce){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&hr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=ur(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ce}static _$Ei(){if(this.hasOwnProperty(nt("elementProperties")))return;const t=fr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nt("properties"))){const e=this.properties,s=[...dr(e),...pr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(xe(r))}else t!==void 0&&e.push(xe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:St).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:St;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ae)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[nt("elementProperties")]=new Map,V[nt("finalized")]=new Map,ke==null||ke({ReactiveElement:V}),(K.reactiveElementVersions??(K.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,Pt=xt.trustedTypes,Oe=Pt?Pt.createPolicy("lit-html",{createHTML:i=>i}):void 0,hs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,us="?"+P,gr=`<${us}>`,I=document,ht=()=>I.createComment(""),ut=i=>i===null||typeof i!="object"&&typeof i!="function",le=Array.isArray,yr=i=>le(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Dt=`[ 	
\f\r]`,et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Te=/-->/g,Re=/>/g,U=RegExp(`>|${Dt}(?:([^\\s"'>=/]+)(${Dt}*=${Dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ue=/'/g,Ne=/"/g,ds=/^(?:script|style|textarea|title)$/i,vr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),st=vr(1),Z=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Me=new WeakMap,L=I.createTreeWalker(I,129);function ps(i,t){if(!le(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oe!==void 0?Oe.createHTML(t):t}const _r=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=et;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===et?f[1]==="!--"?o=Te:f[1]!==void 0?o=Re:f[2]!==void 0?(ds.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=r??et,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ne:Ue):o===Ne||o===Ue?o=U:o===Te||o===Re?o=et:(o=U,r=void 0);const h=o===U&&i[l+1].startsWith("/>")?" ":"";n+=o===et?a+gr:u>=0?(s.push(d),a.slice(0,u)+hs+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[ps(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Zt=class fs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=_r(t,e);if(this.el=fs.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(hs)){const c=f[o++],h=r.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?br:p[1]==="?"?Ar:p[1]==="@"?Er:Ut}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(ds.test(r.tagName)){const u=r.textContent.split(P),c=u.length-1;if(c>0){r.textContent=Pt?Pt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ht()),L.nextNode(),a.push({type:2,index:++n});r.append(u[c],ht())}}}else if(r.nodeType===8)if(r.data===us)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}};function G(i,t,e=i,s){var r,n;if(t===Z)return t;let o=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=ut(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=G(i,o._$AS(i,t.values),o,s)),t}class $r{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);L.currentNode=r;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new gt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new wr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),ut(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Zt.createElement(ps(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new $r(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Me.get(t.strings);return e===void 0&&Me.set(t.strings,e=new Zt(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new gt(this.O(ht()),this.O(ht()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ut{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=G(this,t,e,0),o=!ut(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=G(this,l[s+a],e,a),d===Z&&(d=this._$AH[a]),o||(o=!ut(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class br extends Ut{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ar extends Ut{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Er extends Ut{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??_)===Z)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class wr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const Le=xt.litHtmlPolyfillSupport;Le==null||Le(Zt,gt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.2.0");const Sr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new gt(t.insertBefore(ht(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Y=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Sr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Z}};Y._$litElement$=!0,Y.finalized=!0,($e=globalThis.litElementHydrateSupport)==null||$e.call(globalThis,{LitElement:Y});const He=globalThis.litElementPolyfillSupport;He==null||He({LitElement:Y});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xr={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ae},Pr=(i=xr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function ms(i){return(t,e)=>typeof e=="object"?Pr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gs(i){return ms({...i,state:!0,attribute:!1})}function kr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Cr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ys={};(function(i){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Mt){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Mt="",A=0,ye=0,Us=2,ve=1,Ns=m.slice.call(arguments,1),v=Object.create(this.lexer),T={yy:{}};for(var Lt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Lt)&&(T.yy[Lt]=this.yy[Lt]);v.setInput(c,T.yy),T.yy.lexer=v,T.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Ht=v.yylloc;m.push(Ht);var Ms=v.options&&v.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ls=function(){var F;return F=v.lex()||ve,typeof F!="number"&&(F=h.symbols_[F]||F),F},b,R,E,jt,D={},$t,w,_e,bt;;){if(R=p[p.length-1],this.defaultActions[R]?E=this.defaultActions[R]:((b===null||typeof b>"u")&&(b=Ls()),E=y[R]&&y[R][b]),typeof E>"u"||!E.length||!E[0]){var It="";bt=[];for($t in y[R])this.terminals_[$t]&&$t>Us&&bt.push("'"+this.terminals_[$t]+"'");v.showPosition?It="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[b]||b)+"'":It="Parse error on line "+(A+1)+": Unexpected "+(b==ve?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(It,{text:v.match,token:this.terminals_[b]||b,line:v.yylineno,loc:Ht,expected:bt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+b);switch(E[0]){case 1:p.push(b),g.push(v.yytext),m.push(v.yylloc),p.push(E[1]),b=null,ye=v.yyleng,Mt=v.yytext,A=v.yylineno,Ht=v.yylloc;break;case 2:if(w=this.productions_[E[1]][1],D.$=g[g.length-w],D._$={first_line:m[m.length-(w||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(w||1)].first_column,last_column:m[m.length-1].last_column},Ms&&(D._$.range=[m[m.length-(w||1)].range[0],m[m.length-1].range[1]]),jt=this.performAction.apply(D,[Mt,ye,A,T.yy,E[1],g,m].concat(Ns)),typeof jt<"u")return jt;w&&(p=p.slice(0,-1*w*2),g=g.slice(0,-1*w),m=m.slice(0,-1*w)),p.push(this.productions_[E[1]][0]),g.push(D.$),m.push(D._$),_e=y[p[p.length-2]][p[p.length-1]],p.push(_e);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Cr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(ys);function B(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var vs={Root:B("Root"),Concat:B("Concat"),Literal:B("Literal"),Splat:B("Splat"),Param:B("Param"),Optional:B("Optional")},_s=ys.parser;_s.yy=vs;var Or=_s,Tr=Object.keys(vs);function Rr(i){return Tr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var $s=Rr,Ur=$s,Nr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function bs(i){this.captures=i.captures,this.re=i.re}bs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Mr=Ur({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Nr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new bs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Lr=Mr,Hr=$s,jr=Hr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Ir=jr,zr=Or,Dr=Lr,Fr=Ir;yt.prototype=Object.create(null);yt.prototype.match=function(i){var t=Dr.visit(this.ast),e=t.match(i);return e||!1};yt.prototype.reverse=function(i){return Fr.visit(this.ast,i)};function yt(i){var t;if(this?t=this:t=Object.create(yt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=zr.parse(i),t}var qr=yt,Br=qr,Vr=Br;const Wr=kr(Vr);var Yr=Object.defineProperty,As=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Yr(t,e,r),r};const Es=class extends Y{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>st` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Wr(r.path)})),this._historyObserver=new ct(this,e),this._authObserver=new ct(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),st` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ss(this,"auth/redirect"),st` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):st` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),st` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ie(this,"history/redirect",{href:t})}};Es.styles=ar`
    :host,
    main {
      display: contents;
    }
  `;let kt=Es;As([gs()],kt.prototype,"_user");As([gs()],kt.prototype,"_match");const Jr=Object.freeze(Object.defineProperty({__proto__:null,Element:kt,Switch:kt},Symbol.toStringTag,{value:"Module"})),Kr=class ws extends HTMLElement{constructor(){if(super(),mt(this).template(ws.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Kr.template=x`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Ss=class Gt extends HTMLElement{constructor(){super(),this._array=[],mt(this).template(Gt.template).styles(Gt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(xs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Kt(t,"button.add")?wt(t,"input-array:add"):Kt(t,"button.remove")&&wt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Zr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ss.template=x`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ss.styles=se`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function Zr(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(xs(e)))}function xs(i,t){const e=i===void 0?x`<input />`:x`<input value="${i}" />`;return x`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Ps(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Gr=Object.defineProperty,Qr=Object.getOwnPropertyDescriptor,Xr=(i,t,e,s)=>{for(var r=Qr(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Gr(t,e,r),r};class ti extends Y{constructor(t){super(),this._pending=[],this._observer=new ct(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Xr([ms()],ti.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,ce=Et.ShadowRoot&&(Et.ShadyCSS===void 0||Et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),je=new WeakMap;let ks=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&je.set(e,t))}return t}toString(){return this.cssText}};const ei=i=>new ks(typeof i=="string"?i:i+"",void 0,he),vt=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ks(e,i,he)},si=(i,t)=>{if(ce)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Et.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ie=ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ei(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ri,defineProperty:ii,getOwnPropertyDescriptor:ni,getOwnPropertyNames:oi,getOwnPropertySymbols:ai,getPrototypeOf:li}=Object,C=globalThis,ze=C.trustedTypes,ci=ze?ze.emptyScript:"",Ft=C.reactiveElementPolyfillSupport,ot=(i,t)=>i,Ct={toAttribute(i,t){switch(t){case Boolean:i=i?ci:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!ri(i,t),De={attribute:!0,type:String,converter:Ct,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ii(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=ni(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const t=li(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const e=this.properties,s=[...oi(e),...ai(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ie(r))}else t!==void 0&&e.push(Ie(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return si(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ct).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Ct;this._$Em=r;const d=a.fromAttribute(e,l.type);this[r]=d??((o=this._$Ej)==null?void 0:o.get(r))??d,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ue)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ot("elementProperties")]=new Map,W[ot("finalized")]=new Map,Ft==null||Ft({ReactiveElement:W}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const at=globalThis,Ot=at.trustedTypes,Fe=Ot?Ot.createPolicy("lit-html",{createHTML:i=>i}):void 0,Cs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Os="?"+k,hi=`<${Os}>`,z=document,dt=()=>z.createComment(""),pt=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,ui=i=>de(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",qt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Be=/>/g,N=RegExp(`>|${qt}(?:([^\\s"'>=/]+)(${qt}*=${qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,We=/"/g,Ts=/^(?:script|style|textarea|title)$/i,di=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),S=di(1),Q=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ye=new WeakMap,H=z.createTreeWalker(z,129);function Rs(i,t){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(t):t}const pi=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=qe:f[1]!==void 0?o=Be:f[2]!==void 0?(Ts.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=r??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?We:Ve):o===We||o===Ve?o=N:o===qe||o===Be?o=rt:(o=N,r=void 0);const h=o===N&&i[l+1].startsWith("/>")?" ":"";n+=o===rt?a+hi:u>=0?(s.push(d),a.slice(0,u)+Cs+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[Rs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class ft{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=pi(t,e);if(this.el=ft.createElement(d,s),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=H.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Cs)){const c=f[o++],h=r.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?mi:p[1]==="?"?gi:p[1]==="@"?yi:Nt}),r.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ts.test(r.tagName)){const u=r.textContent.split(k),c=u.length-1;if(c>0){r.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],dt()),H.nextNode(),a.push({type:2,index:++n});r.append(u[c],dt())}}}else if(r.nodeType===8)if(r.data===Os)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function X(i,t,e=i,s){var o,l;if(t===Q)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=pt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=X(i,r._$AS(i,t.values),r,s)),t}class fi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??z).importNode(e,!0);H.currentNode=r;let n=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new vi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),pt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ui(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ft.createElement(Rs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new fi(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ye.get(t.strings);return e===void 0&&Ye.set(t.strings,e=new ft(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new _t(this.O(dt()),this.O(dt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,e,0),o=!pt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=X(this,l[s+a],e,a),d===Q&&(d=this._$AH[a]),o||(o=!pt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class mi extends Nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class gi extends Nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class yi extends Nt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??$)===Q)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class vi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const Bt=at.litHtmlPolyfillSupport;Bt==null||Bt(ft,_t),(at.litHtmlVersions??(at.litHtmlVersions=[])).push("3.3.1");const _i=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new _t(t.insertBefore(dt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis;class O extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_i(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Q}}var Je;O._$litElement$=!0,O.finalized=!0,(Je=j.litElementHydrateSupport)==null||Je.call(j,{LitElement:O});const Vt=j.litElementPolyfillSupport;Vt==null||Vt({LitElement:O});(j.litElementVersions??(j.litElementVersions=[])).push("4.2.1");const pe=class pe extends O{render(){return S`
    <header class="header">
      <div class="logo">
        <h1>Story Prompt Platform</h1>
        <span>Create, like, and explore story prompts of all kinds!</span>
      </div>

      <nav class="nav">
        <ul>
          <li><a href="/app">Browse Prompts</a></li>
          <li><a href="/app/create">Make a Prompt</a></li>
          <li><a href="/app/profile">My Profile</a></li>
        </ul>
      </nav>

      <div class="user-info">
        <h2>Welcome back, Jane!</h2>
        <img
          src="../../janedoe.jpg"
          alt="Profile Picture"
          class="profile-picture"
        />
      </div>

      <label
        @change=${t=>rs.relay(t,"dark-mode",{checked:t.target.checked})}
      >
        <input type="checkbox" id="dark-mode-toggle" autocomplete="off" />
        Dark mode
      </label>
    </header>
  `}};pe.styles=vt`
    /* This matches your global header rule, but scoped to this component */
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: var(--header-background-color);
      color: var(--header-text-color);
      font-family: var(--font-header);
    }

    /* nav bar details */
    .logo {
      display: flex;
      flex-direction: column;
    }

    .nav ul {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav a {
      text-decoration: none;
      color: var(--header-text-color);
      font-weight: bold;
    }

    .nav a:hover {
      color: var(--link-color);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-info h2 {
      font-size: 1rem;
      margin: 0;
    }

    .profile-picture {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    /* Bring over your h1 header styling so it applies inside shadow DOM */
    h1 {
      color: var(--primary-color);
      font-family: var(--font-header);
      font-weight: 700;
    }
  `;let Qt=pe;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $i={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ue},bi=(i=$i,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ai(i){return(t,e)=>typeof e=="object"?bi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ei(i){return Ai({...i,state:!0,attribute:!1})}var wi=Object.defineProperty,Si=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&wi(t,e,r),r};const fe=class fe extends O{constructor(){super(...arguments),this.src="/api/story-prompts",this.prompts=[],this._authObserver=new ct(this,"spp:auth"),this._user=new Jt.User}render(){console.log("prompts =",this.prompts);const e=(this.prompts??[]).map(s=>this.renderItem(s));return S`
      <main class="page">
        <h2>Browse Prompts</h2>
        <section class="section">
          ${e}
        </section>
      </main>
    `}renderItem(t){return S`
      <article class="prompt">
        <h3>${t.title}</h3>
        <p>
          <strong>Categories:</strong>
          ${t.categories}
        </p>
        <p>
          <strong>Prompt:</strong>
          ${t.prompt}
        </p>
      </article>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:Jt.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{if(console.log("story-prompts JSON from server:",e),!e){this.prompts=[];return}if(Array.isArray(e)){this.prompts=e;return}const s=e;Array.isArray(s.prompts)?this.prompts=s.prompts:Array.isArray(s.data)?this.prompts=s.data:(console.warn("Unknown JSON shape for story-prompts:",e),this.prompts=[])}).catch(e=>console.log("Failed to load story prompts:",e))}};fe.styles=vt`
    .section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .prompt {
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-large);
      padding: 20px;
    }

    h2 {
      margin-top: 20px;
    }

    h3 {
      margin-top: 10px;
    }
  `;let Tt=fe;Si([Ei()],Tt.prototype,"prompts");const xi=vt`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  body {
    line-height: 1.5;
  }
  img {
    max-width: 100%;
  }
`,Pi={styles:xi},M=class M extends HTMLElement{get src(){return this.getAttribute("src")}connectedCallback(){this.mode||(this.mode="view");const t=this.editButton;t&&t.addEventListener("click",()=>{this.mode="edit"}),this.addEventListener("mu-form:submit",e=>{const s=e.detail;this.submit(this.src,s)}),this.src&&this.hydrate(this.src)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("mu-form.edit")}get mode(){return this.getAttribute("mode")}set mode(t){t===null?this.removeAttribute("mode"):this.setAttribute("mode",t)}get editButton(){var t;return(t=this.shadowRoot)==null?void 0:t.getElementById("edit")}hydrate(t){fetch(t).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).then(e=>{this.renderSlots(e),this.form&&(this.form.init=e)}).catch(e=>console.log(`Failed to render data ${t}:`,e))}renderSlots(t){if(console.log("fetched data response",t),!t||typeof t!="object")return;const s=Object.entries(t).map(([r,n])=>{if(r==="comments"){const o=document.createElement("a");return o.href=String(n??"#"),o.textContent="View all comments",o.setAttribute("slot","comments"),o}return x`<span slot="${r}">${String(n??"")}</span>`});this.replaceChildren(...s)}submit(t,e){if(!t){console.error("No src URL on <story-prompt>, cannot submit");return}fetch(t,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(s=>{if(!s.ok)throw new Error(`PUT failed: ${s.status}`);return s.json()}).then(s=>{this.renderSlots(s),this.form&&(this.form.init=s),this.mode="view"}).catch(s=>console.error("PUT error:",s))}constructor(){super(),mt(this).template(M.template).styles(Pi.styles,M.styles)}};M.uses=Ps({"mu-form":Xs.Element}),M.template=x`
    <template>
      <section class="view">
        <button id="edit">Edit</button>
        <article class="prompt">
          <h3><slot name="title">Default Title</slot></h3>
          <p>
            <strong>Categories:</strong>
            <slot name="categories">No categories</slot>
          </p>
          <p>
            <strong>Prompt:</strong>
            <slot name="prompt">Default prompt text</slot>
          </p>
          <div class="actions">
            <slot name="actions"></slot>
          </div>
          <div class="comments">
            <slot name="comments">
              <a href="#" class="comment-link">View all comments</a>
            </slot>
          </div>
        </article>
      </section>

      <mu-form class="edit">
        <label>
          <span>Title</span>
          <input name="title" />
        </label>

        <label>
          <span>Categories</span>
          <input name="categories" />
        </label>

        <label>
          <span>Prompt</span>
          <textarea name="prompt"></textarea>
        </label>

        <!-- make sure there is a submit button so mu-form can submit -->
        <button type="submit">Save</button>
      </mu-form>
    </template>
  `,M.styles=se`
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }

    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
    }

    .prompt {
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-large);
      padding: 20px;
    }

    h3 {
      margin-top: 10px;
    }

    p {
      color: var(--text-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
      margin: 10px 0;
    }

    time {
      font-style: italic;
      color: var(--text-secondary-color);
    }

    .prompt-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    button {
      background-color: var(--button-background-color);
      color: var(--header-text-color);
      padding: 10px 15px;
      border: none;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: var(--font-size);
    }

    button:hover {
      background-color: var(--button-hover-color);
    }

    svg.icon {
      width: 35px;
      height: 35px;
      vertical-align: middle;
      margin-right: 2px;
    }

    a {
      color: var(--link-color);
    }
  `;let Rt=M;customElements.define("story-prompt",Rt);const me=class me extends O{render(){return S`
      <main class="page">
        <section class="section">
          <h2>Jane Doe</h2>
          <img src="../../janedoe.jpg" alt="Profile Picture" width="150" />
          <p><strong>Username:</strong> JaneDoe123</p>
          <p><strong>Favorite Categories:</strong> Sci-Fi, Comedy, Mystery</p>
          <p><strong>Email:</strong> janedoewriter@gmail.com</p>
          <p>
            <strong>Bio:</strong> Hi! My name is Jane and I am 23 years old. I
            wrote the quirky, humorous, mystery book
            'The Robot Who Became a Detective' and am currently working on the
            second one! YAY! I love writing funny story prompts and inspiring
            other writers every day! Email for collaborations.
          </p>
          <p><strong>Joined:</strong> March 2024</p>
        </section>

        <section class="section">
          <h2>My Posts</h2>
          <ul>
            <li>
              <a>What If Pizza Became the Currency of the World?</a>
            </li>
          </ul>
        </section>

        <section class="section">
          <h2>My Saved Posts</h2>
          <ul>
            <li>
              <a href="comments.html">
                What Happens When Fictional Characters Meet Their Creators?
              </a>
            </li>
          </ul>
        </section>
      </main>
    `}};me.styles=vt`
    .section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    h2 {
      margin-top: 20px;
    }

    .section img {
      border-radius: 50%;
    }

    p {
      color: var(--text-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
      margin: 10px 0;
    }

    ul {
      list-style: disc;
      padding-left: 1.5rem;
    }

    a {
      color: var(--link-color);
    }
  `;let Xt=me;const ge=class ge extends O{render(){return S`
      <main class="page">
        <h2>Make a Prompt</h2>
        <section class="create-prompt section">
          <form>
            <label for="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter the prompt title."
            />

            <label for="categories">Categories:</label>
            <select id="categories" name="categories" multiple required>
              <option value="Comedy">Comedy</option>
              <option value="Mystery">Mystery</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Adventure">Adventure</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Drama">Drama</option>
              <option value="Historical">Historical</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
            <p>
              <small>
                Hold down Ctrl (Windows) or Command (Mac) to select multiple
                categories.
              </small>
            </p>

            <label for="prompt">Prompt:</label>
            <textarea id="prompt" name="description" required></textarea>

            <button type="submit">Submit</button>
          </form>
        </section>
      </main>
    `}};ge.styles=vt`
    .section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    h2 {
      margin-top: 20px;
    }

    .create-prompt {
      max-width: 600px;
      margin: 20px auto;
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      padding: 20px;
      border-radius: var(--border-radius-large);
    }

    input[type="text"],
    select,
    textarea {
      width: 95%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size);
      color: var(--text-color);
      font-family: var(--font-body);
    }

    button {
      background-color: var(--button-background-color);
      color: var(--header-text-color);
      padding: 10px 15px;
      border: none;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: var(--font-size);
    }

    button:hover {
      background-color: var(--button-hover-color);
    }

    p {
      color: var(--text-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
      margin: 10px 0;
    }
  `;let te=ge;const ki=[{path:"/app/story-prompts/:id",view:i=>S`
      <story-prompt src=${`/api/story-prompts/${i.id}`}></story-prompt>
    `},{path:"/app/profile",view:()=>S`<user-profile-view></user-profile-view>`},{path:"/app/create",view:()=>S`<create-prompt-view></create-prompt-view>`},{path:"/app",view:()=>S`<home-view></home-view>`},{path:"/",redirect:"/app"}];Ps({"mu-auth":Jt.Provider,"mu-history":rr.Provider,"mu-switch":class extends Jr.Element{constructor(){super(ki,"spp:history","spp:auth")}},"story-header":Qt,"home-view":Tt,"story-prompt":Rt,"user-profile-view":Xt,"create-prompt-view":te});window.relayEvent=rs.relay;window.addEventListener("dark-mode",i=>{const{checked:t}=i.detail;document.body.classList.toggle("dark-mode",t)});
