(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{449:function(t,e,n){var content=n(450);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(20).default)("dc0628f2",content,!0,{sourceMap:!1})},450:function(t,e,n){(e=n(19)(!1)).push([t.i,".v-tooltip{display:none}.v-tooltip--attached{display:inline}.v-tooltip__content{background:rgba(97,97,97,.9);color:#fff;border-radius:4px;font-size:14px;line-height:22px;display:inline-block;padding:5px 16px;position:absolute;text-transform:none;width:auto;opacity:1;pointer-events:none}.v-tooltip__content--fixed{position:fixed}.v-tooltip__content[class*=-active]{transition-timing-function:cubic-bezier(0,0,.2,1)}.v-tooltip__content[class*=enter-active]{transition-duration:.15s}.v-tooltip__content[class*=leave-active]{transition-duration:75ms}",""]),t.exports=e},640:function(t,e,n){"use strict";n(22);var o=n(2),r=(n(449),n(128)),c=n(27),l=n(151),h=n(136),d=n(211),v=n(193),m=n(52),f=n(0),_=n(6),x=n(4);e.a=Object(x.a)(c.a,l.a,h.a,d.a,v.a,m.a).extend({name:"v-tooltip",props:{closeDelay:{type:[Number,String],default:0},disabled:Boolean,fixed:{type:Boolean,default:!0},openDelay:{type:[Number,String],default:0},openOnHover:{type:Boolean,default:!0},tag:{type:String,default:"span"},transition:String},data:function(){return{calculatedMinWidth:0,closeDependents:!1}},computed:{calculatedLeft:function(){var t=this.dimensions,e=t.activator,content=t.content,n=!(this.bottom||this.left||this.top||this.right),o=!1!==this.attach?e.offsetLeft:e.left,r=0;return this.top||this.bottom||n?r=o+e.width/2-content.width/2:(this.left||this.right)&&(r=o+(this.right?e.width:-content.width)+(this.right?10:-10)),this.nudgeLeft&&(r-=parseInt(this.nudgeLeft)),this.nudgeRight&&(r+=parseInt(this.nudgeRight)),"".concat(this.calcXOverflow(r,this.dimensions.content.width),"px")},calculatedTop:function(){var t=this.dimensions,e=t.activator,content=t.content,n=!1!==this.attach?e.offsetTop:e.top,o=0;return this.top||this.bottom?o=n+(this.bottom?e.height:-content.height)+(this.bottom?10:-10):(this.left||this.right)&&(o=n+e.height/2-content.height/2),this.nudgeTop&&(o-=parseInt(this.nudgeTop)),this.nudgeBottom&&(o+=parseInt(this.nudgeBottom)),"".concat(this.calcYOverflow(o+this.pageYOffset),"px")},classes:function(){return{"v-tooltip--top":this.top,"v-tooltip--right":this.right,"v-tooltip--bottom":this.bottom,"v-tooltip--left":this.left,"v-tooltip--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},computedTransition:function(){return this.transition?this.transition:this.isActive?"scale-transition":"fade-transition"},offsetY:function(){return this.top||this.bottom},offsetX:function(){return this.left||this.right},styles:function(){return{left:this.calculatedLeft,maxWidth:Object(f.g)(this.maxWidth),minWidth:Object(f.g)(this.minWidth),opacity:this.isActive?.9:0,top:this.calculatedTop,zIndex:this.zIndex||this.activeZIndex}}},beforeMount:function(){var t=this;this.$nextTick((function(){t.value&&t.callActivate()}))},mounted:function(){"v-slot"===Object(f.s)(this,"activator",!0)&&Object(_.b)("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'",this)},methods:{activate:function(){this.updateDimensions(),requestAnimationFrame(this.startTransition)},deactivate:function(){this.runDelay("close")},genActivatorListeners:function(){var t=this,e=r.a.options.methods.genActivatorListeners.call(this);return e.focus=function(e){t.getActivator(e),t.runDelay("open")},e.blur=function(e){t.getActivator(e),t.runDelay("close")},e.keydown=function(e){e.keyCode===f.w.esc&&(t.getActivator(e),t.runDelay("close"))},e},genTransition:function(){var content=this.genContent();return this.computedTransition?this.$createElement("transition",{props:{name:this.computedTransition}},[content]):content},genContent:function(){var t;return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-tooltip__content",class:(t={},Object(o.a)(t,this.contentClass,!0),Object(o.a)(t,"menuable__content__active",this.isActive),Object(o.a)(t,"v-tooltip__content--fixed",this.activatorFixed),t),style:this.styles,attrs:this.getScopeIdAttrs(),directives:[{name:"show",value:this.isContentActive}],ref:"content"}),this.getContentSlot())}},render:function(t){var e=this;return t(this.tag,{staticClass:"v-tooltip",class:this.classes},[this.showLazyContent((function(){return[e.genTransition()]})),this.genActivator()])}})},681:function(t,e,n){"use strict";n.r(e);n(22),n(32),n(48),n(54);var o=n(15),r=n(78),c=n.n(r),l={asyncData:function(t){return Object(o.a)(regeneratorRuntime.mark((function e(){var n,o,r,l,data,h,i,d,v,m,f,_,x,y,w;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.payload,t.context,o=t.app,!n){e.next=5;break}return e.abrupt("return",n);case 5:return r=o.context.route.params.id,e.next=8,c.a.get("http://localhost:3000/data/curation_old.json");case 8:l=e.sent,data=l.data,h=data.selections,i=0;case 12:if(!(i<h.length)){e.next=35;break}d=h[i],v=d.within["@id"],m=d.members,f=0;case 17:if(!(f<m.length)){e.next=32;break}_=m[f],x=_.metadata,y=0;case 21:if(!(y<x.length)){e.next=29;break}if("m_sort"!=(w=x[y]).label||w.value!=r){e.next=26;break}return _.manifest=v,e.abrupt("return",_);case 26:y++,e.next=21;break;case 29:f++,e.next=17;break;case 32:i++,e.next=12;break;case 35:case"end":return e.stop()}}),e)})))()},data:function(){return{baseUrl:"https://moeller.jinsha.tsukuba.ac.jp",prefix:"https://w3id.org/hpdb"}},computed:{url:function(){return this.baseUrl+"/item/"+this.$route.params.id},id:function(){return this.$route.params.id},title:function(){for(var t=this.metadata,e={},i=0;i<t.length;i++){var n=t[i];e[n.label]=n.value}return e["Möller No Mod"][0]+"("+e["Hieroglyph No Mod"][0]+")"}},methods:{getIframeUrl:function(){return this.baseUrl+"/curation/?manifest="+this.manifest+"&canvas="+encodeURIComponent(this["@id"])},getCurationUrl:function(){var t=this["@id"].split("#xywh="),e=t[0],n=t[1];return"http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest="+this.manifest+"&canvas="+encodeURIComponent(e)+"&xywh="+n+"&xywh_highlight=border"},getUtaUrl:function(){var t=this["@id"].split("#xywh="),e=t[0],n=t[1],o=e.split("/canvas/p")[1];return"https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/document/"+this.manifest.split("/manifest/")[1].split("/")[0]+"#?c=0&m=0&s=0&cv="+(Number(o)-1)+"&xywh="+n}},head:function(){var title=this.title;return{title:title,meta:[{hid:"og:title",property:"og:title",content:title},{hid:"og:type",property:"og:type",content:"article"},{hid:"og:url",property:"og:url",content:this.url},{hid:"og:image",property:"og:image",content:this.thumbnail},{hid:"twitter:card",name:"twitter:card",content:"summary_large_image"}]}}},h=n(80),d=n(92),v=n.n(d),m=n(215),f=n(429),_=n(194),x=n(640),component=Object(h.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-container",{staticClass:"py-5"},[n("iframe",{attrs:{src:t.getIframeUrl(),width:"100%",height:"200",allowfullscreen:"",frameborder:"0"}})]),t._v(" "),n("v-container",[n("p",{staticClass:"text-center"},[n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mx-1",attrs:{icon:"",target:"_blank",href:t.getCurationUrl()}},o),[n("img",{attrs:{src:t.baseUrl+"/img/icons/icp-logo.svg",width:"30px"}})])]}}])},[t._v(" "),n("span",[t._v(t._s("IIIF Curation Viewer"))])]),t._v(" "),n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mx-1",attrs:{icon:"",target:"_blank",href:t.getUtaUrl()}},o),[n("img",{attrs:{src:t.baseUrl+"/img/icons/ut.ico",width:"30px"}})])]}}])},[t._v(" "),n("span",[t._v(t._s(t.$t("uta")))])]),t._v(" "),n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mx-1",attrs:{icon:"",target:"_blank",href:t.baseUrl+"/snorql/?describe="+t.prefix+"/api/items/"+t.id}},o),[n("img",{attrs:{src:t.baseUrl+"/img/icons/rdf-logo.svg",width:"30px"}})])]}}])},[t._v(" "),n("span",[t._v(t._s("RDF"))])]),t._v(" "),n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mx-1",attrs:{icon:"",target:"_blank",href:"https://twitter.com/intent/tweet?url="+t.url}},o),[n("v-icon",[t._v("mdi-twitter")])],1)]}}])},[t._v(" "),n("span",[t._v(t._s("Twitter"))])]),t._v(" "),n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mx-1",attrs:{icon:"",target:"_blank",href:"https://www.facebook.com/sharer/sharer.php?u="+t.url}},o),[n("v-icon",[t._v("mdi-facebook")])],1)]}}])},[t._v(" "),n("span",[t._v(t._s("Facebook"))])]),t._v(" "),n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mx-1",attrs:{icon:"",target:"_blank",href:"http://getpocket.com/edit?url="+t.url}},o),[n("img",{staticStyle:{"font-size":"30px"},attrs:{src:"https://cultural.jp/img/icons/pocket.svg"}})])]}}])},[t._v(" "),n("span",[t._v(t._s("Pocket"))])])],1),t._v(" "),n("dl",{staticClass:"row"},[n("dt",{staticClass:"col-sm-3 text-muted"},[n("b",[t._v("URL")])]),t._v(" "),n("dd",{staticClass:"col-sm-9"},[n("a",{attrs:{href:t.prefix+"/item/"+t.$route.params.id}},[t._v(t._s(t.prefix+"/item/"+t.$route.params.id))])])]),t._v(" "),n("dl",{staticClass:"row"},[n("dt",{staticClass:"col-sm-3 text-muted"},[n("b",[t._v(t._s(t.$t("label")))])]),t._v(" "),n("dd",{staticClass:"col-sm-9"},[t._v("\n        "+t._s(t.title)+"\n      ")])]),t._v(" "),t._l(t.metadata,(function(e,o){return n("dl",{key:o,staticClass:"row"},[e.label.includes("sort")||e.label.includes("Mod")||""==e.value?t._e():[n("dt",{staticClass:"col-sm-3 text-muted"},[n("b",[t._v(t._s(t.$t(e.label)))])]),t._v(" "),n("dd",{staticClass:"col-sm-9",class:"Phone/Word"===e.label?"phone":""},[t._v("\n          "+t._s(Array.isArray(e.value)?e.value.join(", "):e.value)+"\n        ")])]],2)})),t._v(" "),n("dl",{staticClass:"row"},[n("dt",{staticClass:"col-sm-3 text-muted"},[n("b",[t._v(t._s(t.$t("license")))])]),t._v(" "),n("dd",{staticClass:"col-sm-9"},["ja"==t.$i18n.locale?[n("a",{attrs:{rel:"license",href:"http://creativecommons.org/licenses/by/4.0/"}},[n("img",{staticStyle:{"border-width":"0"},attrs:{alt:"クリエイティブ・コモンズ・ライセンス",src:"https://i.creativecommons.org/l/by/4.0/88x31.png"}})]),n("br"),t._v("この作品は"),n("a",{attrs:{rel:"license",href:"http://creativecommons.org/licenses/by/4.0/"}},[t._v("クリエイティブ・コモンズ 表示 4.0 国際 ライセンス")]),t._v("の下に提供されています。\n        ")]:[n("a",{attrs:{rel:"license",href:"http://creativecommons.org/licenses/by/4.0/"}},[n("img",{staticStyle:{"border-width":"0"},attrs:{alt:"Creative Commons License",src:"https://i.creativecommons.org/l/by/4.0/88x31.png"}})]),n("br"),t._v("This work is licensed under a\n          "),n("a",{attrs:{rel:"license",href:"http://creativecommons.org/licenses/by/4.0/"}},[t._v("Creative Commons Attribution 4.0 International License")]),t._v(".\n        ")]],2)])],2)],1)}),[],!1,null,null,null);e.default=component.exports;v()(component,{VBtn:m.a,VContainer:f.a,VIcon:_.a,VTooltip:x.a})}}]);