(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{140:function(t,e,r){var content=r(294);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(20).default)("7750648c",content,!0,{sourceMap:!1})},183:function(t,e,r){"use strict";(function(t){r(6),r(41),r(7),r(36),r(74),r(32),r(27),r(8),r(29),r(45),r(55),r(47),r(62),r(66);var n=r(26),o=r(38),l=function(){function e(){Object(n.a)(this,e)}return Object(o.a)(e,[{key:"createQuery",value:function(t,e){var r=Object.keys(e.facetLabels),n=["_full_text","_title"],o=t.from?Number(t.from):0,l=t.size?Number(t.size):e.size,c={keyword:"true"===t.keywordOr,q:"true"===t.advancedOr,fc:"true"===t.facetOr};l>500&&(l=500);for(var f={},v={},i=0;i<r.length;i++){var h=r[i],m="fc-"+h;if(t[m]){var d=t[m],y=[];y=Array.isArray(d)?d:[d],v[m]=y}f[h]={terms:{field:h+".keyword",size:50,order:{_count:"desc"}}}}var _={bool:{must:[],should:[],filter:[],must_not:[]}},k=t.keyword?t.keyword:[],w=[];w=Array.isArray(k)?k:[k];for(var A=0;A<w.length;A++){var j=w[A];if(j.startsWith("-"))for(var x=0;x<n.length;x++){var I={};I[n[x]]=j.slice(1),_.bool.must_not.push({match_phrase:I})}else if(c.keyword);else{for(var F=[],O=0;O<n.length;O++){var S={};S[n[O]]=j,F.push({match_phrase:S})}_.bool.must.push({bool:{should:F}})}}for(var C in t)if(C.startsWith("q-")||C.startsWith("fc-")){var V=C,N=V.split("-")[0],P=V.split("-")[0],z=c[P]?"should":"q"===P?"must":"filter",L=t[V],M=[];M=Array.isArray(L)?L:[L];for(var D=[],T=[],E=0;E<M.length;E++){var R=M[E];R.startsWith("-")?T.push(R.slice(1)):D.push(R)}for(var W=0;W<T.length;W++){var K=T[W];if("fc"===N){var H={};H[C.slice(3)+".keyword"]=K,_.bool.must_not.push({term:H})}else{var J={};J[C.slice(2)]=K,_.bool.must_not.push({term:J})}}if(0===D.length)continue;if("fc"===N){for(var Q=[],U=0;U<D.length;U++){var B=M[U],$={};$[C.slice(3)+".keyword"]=B,Q.push({term:$})}_.bool[z].push({bool:{should:Q}})}else for(var G=0;G<D.length;G++){var X=M[G],Y={};Y[C.slice(2)]=X,_.bool[z].push({term:Y})}}var Z=t.sort?t.sort:null,tt=[];if(null!=Z&&!Z.includes("_score")){var et=Z.split(":"),at=et[0],nt=et[1],it={};it[at]={order:nt},tt.push(it),tt.push("_score")}return{query:_,aggs:f,size:l,from:o,sort:tt}}},{key:"getTitle",value:function(t,e){return t.title_mt&&t.title_mt.length>0&&"ja"===e?this.formatArrayValue(t.title_mt)+" <i class='mdi mdi-google-translate'></i>":this.formatArrayValue(t._title)}},{key:"getOriginalTitle",value:function(t,e){return t.title_mt.length>0&&"ja"===e?"翻訳前タイトル: "+this.formatArrayValue(t._title):null}},{key:"formatArrayValue",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:", ";if(null==t)return"";if(1===t.length)return t[0];var r=t.join(e);return r}},{key:"indexedQuery",value:function(t,e){var r={};for(var n in t)r[n]=t[n];var o=t.from?t.from:0;return r.index=e+Number(o),r}},{key:"item2CardItem",value:function(t){var e=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"ja",n=t._source,o=t._id,path={name:"item-id",params:{id:o}},l={path:path,label:this.getTitle(n,r),id:o,url:this.formatArrayValue(n._url)};return n._image&&(l.image=this.formatArrayValue(n._image).split(", ")[0]),n._manifest&&(l.manifest=this.formatArrayValue(n._manifest)),n.access&&(l.access=this.formatArrayValue(n.access)),n.source&&(l.source=this.formatArrayValue(n.source)),e&&(l.type=e),n.agential&&(l.agential=this.formatArrayValue(n.agential)),n.temporal&&(l.temporal=this.formatArrayValue(n.temporal)),n.description&&(l.description=this.formatArrayValue(n.description)),n._url&&(l._url=this.formatArrayValue(n._url)),l}},{key:"getProjectFooter",value:function(e){return"ja"===e?t.env.projectFooterJa:t.env.projectFooterEn}},{key:"getProjectName",value:function(e){return"ja"===e?t.env.projectNameJa:t.env.projectNameEn}},{key:"getProjectDescription",value:function(e){return"ja"===e?t.env.projectDescriptionJa:t.env.projectDescriptionEn}},{key:"splitKeyword",value:function(t){for(var e=t.replace(/　/g," ").split(" ").filter((function(t){return""!==t})),r=[],i=0;i<e.length;i++){var n=e[i],o=n.split(":");2===o.length?r.push({label:"q-"+o[0].trim(),value:o[1].trim()}):r.push({label:"keyword",value:n})}return r}},{key:"createFacetQuery",value:function(t){for(var e={},i=0;i<t.length;i++){var r=t[i];e[r.field]=r.value}return e}},{key:"truncate",value:function(t,e){return t&&t["@id"]?"":(t=String(t)).length<=e?t:t.substring(0,e)+"..."}},{key:"convert2arr",value:function(t){var e=[];return Array.isArray(t)?e=t:""!==(t=t.trim())&&(e=[t]),e}},{key:"getSearchQueryFromQueryStore",value:function(t,u){var e={sort:t.sort,size:t.size,from:(t.currentPage-1)*t.size};""!==t.before&&(e.before=t.before),""!==t.after&&(e.after=t.after),t.keyword.length>0&&(e.keyword=t.keyword),t.id.length>0&&(e.id=t.id),t.image.length>0&&(e.image=t.image);for(var r=t.advanced,n=["fc","q"],o=0;o<n.length;o++){var l=n[o];for(var label in r[l]){var c=[],f=r[l][label];for(var v in f)for(var h=f[v],i=0;i<h.length;i++){var m=h[i];c.push("+"===v?m:"-"+m)}e[label]=c}}return u&&(e.u=u),e}},{key:"getManifestIcon",value:function(t){return t.includes("api.cultural.jp")?"/img/icons/iiif-gray-logo.svg":"/img/icons/iiif-logo.svg"}},{key:"getTopMessage",value:function(t,e,r){var n="",o="ja"===r?"件":"";return t===e&&(n="ja"===r?"上位":"Top "),n+t.toLocaleString()+o}}]),e}();e.a=function(t,e){e("utils",new l)}}).call(this,r(151))},184:function(t,e,r){"use strict";r(6),r(41),r(57),r(28),r(7),r(50),r(36),r(61),r(32),r(25),r(27),r(8),r(14),r(29),r(22),r(374),r(45),r(49),r(55),r(47),r(62),r(46);var n=r(48),o=(r(56),r(13)),l=r(257),c=r(26),f=r(38),v=r(81),h=r.n(v);function m(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return d(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return d(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var i=0,n=function(){};return{s:n,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,c=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return l=t.done,t},e:function(t){c=!0,o=t},f:function(){try{l||null==r.return||r.return()}finally{if(c)throw o}}}}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,r=new Array(e);i<e;i++)r[i]=t[i];return r}var y=function(){function t(){Object(c.a)(this,t),this.shuffle=function(t){for(var e=Object(l.a)(t).slice(0),i=e.length-1;i>=0;i--){var r=Math.floor(Math.random()*(i+1)),n=[e[r],e[i]];e[i]=n[0],e[r]=n[1]}return e}}var e,r;return Object(f.a)(t,[{key:"createQuery",value:function(t,e){var r=Object.keys(e.facetLabels),n=["_full_text","_title"],o=t.from?Number(t.from):0,l=t.size?Number(t.size):e.size,c={keyword:"true"===t.keywordOr,q:"true"===t.advancedOr,fc:"true"===t.facetOr};l>500&&(l=500);for(var f={},v={},i=0;i<r.length;i++){var h=r[i],m="fc-"+h;if(t[m]){var d=t[m],y=[];y=Array.isArray(d)?d:[d],v[m]=y}f[h]={terms:{field:h+".keyword",size:50,order:{_count:"desc"}}}}var _={bool:{must:[],should:[],filter:[],must_not:[]}},k=t.keyword?t.keyword:[],w=[];w=Array.isArray(k)?k:[k];for(var A=0;A<w.length;A++){var j=w[A];if(j.startsWith("-"))for(var x=0;x<n.length;x++){var I={};I[n[x]]=j.slice(1),_.bool.must_not.push({match_phrase:I})}else if(c.keyword);else{for(var F=[],O=0;O<n.length;O++){var S={};S[n[O]]=j,F.push({match_phrase:S})}_.bool.must.push({bool:{should:F}})}}for(var C in t)if(C.startsWith("q-")||C.startsWith("fc-")){var V=C,N=V.split("-")[0],P=V.split("-")[0],z=c[P]?"should":"q"===P?"must":"filter",L=t[V],M=[];M=Array.isArray(L)?L:[L];for(var D=[],T=[],E=0;E<M.length;E++){var R=M[E];R.startsWith("-")?T.push(R.slice(1)):D.push(R)}for(var W=0;W<T.length;W++){var K=T[W];if("fc"===N){var H={};H[C.slice(3)+".keyword"]=K,_.bool.must_not.push({term:H})}else{var J={};J[C.slice(2)]=K,_.bool.must_not.push({term:J})}}if(0===D.length)continue;if("fc"===N){for(var Q=[],U=0;U<D.length;U++){var B=M[U],$={};$[C.slice(3)+".keyword"]=B,Q.push({term:$})}_.bool[z].push({bool:{should:Q}})}else for(var G=0;G<D.length;G++){var X=M[G],Y={};Y[C.slice(2)]=X,_.bool[z].push({term:Y})}}var Z=t.sort?t.sort:null,tt=[];if(null!=Z&&!Z.includes("_score")){var et=Z.split(":"),at=et[0],nt=et[1],it={};it[at]={order:nt},tt.push(it),tt.push("_score")}return{query:_,aggs:f,size:l,from:o,sort:tt}}},{key:"handleManifests",value:function(t){for(var e=[],i=0;i<t.length;i++){var r=t[i],n={_id:r["@id"],_source:{_label:[r.label],_manifest:[r["@id"]]}};if(r.thumbnail&&(n._source._thumbnail=[r.thumbnail]),r.texts&&(n.texts=r.texts),r.images&&(n.images=r.images),r.attribution){var o=r.attribution;Array.isArray(o)||(o=[o]);for(var l=[],c=0;c<o.length;c++){var f=o[c];f["@value"]&&(f=f["@value"]),l.push(f)}n._source.Attribution=l}var v=void 0;v=r.related?r.related:"http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest="+encodeURIComponent(r["@id"]),n._source._related=[v],r.description&&(n._source.Description=[r.description]);var h={},m=r.metadata;if(m)for(var d=0;d<m.length;d++){var y=m[d],_=y.value;Array.isArray(_)||(_=[_]),n._source[y.label]||(n._source[y.label]=[]);for(var k=0;k<_.length;k++){var w=_[k];n._source[y.label].includes(w)||n._source[y.label].push(w)}if(y.property){var A=y.property;h[A]||(h[A]={}),y.uri?h[A][y.uri]||(h[A][y.uri]={label:y.value}):h[A][y.value]||(h[A][y.valu]={label:y.value})}}n.entity=h,e.push(n)}return e}},{key:"handleCollections",value:function(t,e){for(var r=[],i=0;i<t.length;i++){var n=t[i],o=[];o=n.manifests?this.handleManifests(n.manifests):this.handleCollections(n.collections,e+1);for(var l=0;l<o.length;l++){var c=o[l];n.label&&(c._source[("0000000000"+e).slice(-2)+" Collection"]=[n.label]),r.push(c)}}return r}},{key:"initStore",value:function(t,e){t.commit("setIndex",e.index),t.commit("setData",e.data),t.commit("setTitle",e.title),t.commit("setThumbnail",e.thumbnail),t.commit("setDescription",e.description),t.commit("setAttribution",e.attribution),t.commit("setJson",e.json),t.commit("setEntity",e.entity),t.commit("setApi",e.api),e.layout&&t.commit("setLayout",e.layout)}},{key:"createIndex",value:(r=Object(o.a)(regeneratorRuntime.mark((function t(u){var data,e=this;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h.a.get(u).then((function(t){var r=t.data;return"sc:Collection"===r["@type"]?e.createIndexFromIIIFCollection(r):"cr:Curation"===r["@type"]?e.createIndexFromIIIFCurationList(r):{}}));case 2:return data=t.sent,t.abrupt("return",data);case 4:case"end":return t.stop()}}),t)}))),function(t){return r.apply(this,arguments)})},{key:"createIndexFromIIIFCollection",value:function(t){var e=[];t.manifests?e=this.handleManifests(t.manifests):t.collections&&(e=this.handleCollections(t.collections,1));for(var r=1,n={},data=[],o={},i=0;i<e.length;i++){var l=e[i],c="",f=r-1;for(var v in l._source){n[v]||(n[v]={});for(var h=l._source[v],m=0;m<h.length;m++){var d=h[m],y=[];if(Array.isArray(d))for(var _=0;_<d.length;_++){var k=d[_];k["@value"]&&(k=k["@value"]),y.includes(k)||y.push(k)}else d["@value"]&&(d=d["@value"]),y=[d];for(var w=0;w<y.length;w++){var A=y[w];null==A||String(A).startsWith("http")||(n[v][A]||(n[v][A]=[]),n[v][A].push(f),c+=A+" ")}}}var j="_full_text";n[j]||(n[j]={}),n[j][c]||(n[j][c]=[]),n[j][c].push(f),data.push(l),r+=1;var x=l.entity;for(var I in x){o[I]||(o[I]={});var F=x[I];for(var O in F){var label=F[O].label;o[I][O]||(o[I][O]={label:label,count:0});var S=o[I][O].count+1;o[I][O].count=S}}}var C="list";return"grid"===t.viewingHint&&(C="grid"),{data:data,index:n,title:t.label,thumbnail:t.thumbnail,description:t.description,attribution:t.attribution,json:t,entity:o,api:t.api,layout:C}}},{key:"createIndexFromIIIFCurationList",value:(e=Object(o.a)(regeneratorRuntime.mark((function t(e){var title,r,n,data,o,l,c,f,v,i,m,d,y,_,k,w,label,A,j,x,I,F,O,S,C,V,N,P,z,L,M,D,T,E,R,W,K,H,J,Q,U,B,$,G,X,area,image,Y;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:title=e.label,r="",n=e["@id"],e.thumbnail&&(r=e.thumbnail),data=[],o=e.selections,l=1,c={},f={},v={},i=0;case 11:if(!(i<o.length)){t.next=86;break}m=o[i],d=m.members,y=m.within["@id"],_=0;case 16:if(!(_<d.length)){t.next=83;break}if(k=d[_],w="",0===i&&0===_&&""===r&&(r=k.thumbnail),(label=k.label)["@value"]&&(label=label["@value"]),A={_label:[label]},k.related&&(A._related=[k.related]),k.thumbnail?A._thumbnail=[k.thumbnail]:(f[y]||(f[y]={}),f[y][l-1]=k["@id"]),j={},!(x=k.metadata)){t.next=45;break}I=0;case 29:if(!(I<x.length)){t.next=45;break}if(F=x[I],O=F.value,Array.isArray(O)||(O=[O]),!(S=O[0])||"oa:Annotation"!==S["@type"]){t.next=38;break}return C=S.resource.chars.replace(/<[^>]*>?/gm,""),A._label=[C],t.abrupt("continue",42);case 38:for(A[F.label]||(A[F.label]=[]),V=0;V<O.length;V++)N=O[V],A[F.label].includes(N)||A[F.label].push(N);F.property&&(P=F.property,j[P]||(j[P]={}),F.uri?j[P][F.uri]||(j[P][F.uri]={label:F.value}):j[P][F.value]||(j[P][F.valu]={label:F.value})),F.property&&(z=F.property,v[z]||(v[z]={}),L=F.uri,M=F.value,v[z][L]||(v[z][L]={label:M,count:0}),D=v[z][L].count+1,v[z][L].count=D);case 42:I++,t.next=29;break;case 45:A._manifest=[y],t.t0=regeneratorRuntime.keys(A);case 47:if((t.t1=t.t0()).done){t.next=69;break}T=t.t1.value,c[T]||(c[T]={}),E=A[T],R=0;case 52:if(!(R<E.length)){t.next=67;break}if(W=E[R],!Array.isArray(W)){t.next=56;break}return t.abrupt("continue",64);case 56:if(!W||!W["@id"]){t.next=58;break}return t.abrupt("continue",64);case 58:if(!W||!String(W).startsWith("http")||"_manifest"===T){t.next=60;break}return t.abrupt("continue",64);case 60:c[T][W]||(c[T][W]=[]),K=l-1,c[T][W].push(K),w+=W+" ";case 64:R++,t.next=52;break;case 67:t.next=47;break;case 69:c[H="_full_text"]||(c[H]={}),c[H][w]||(c[H][w]=[]),c[H][w].push(l-1),A._curation=[n],A._pos=[l],J={_id:A.m_sort[0],_source:A,entity:j},k.images&&(J.images=k.images),k.texts&&(J.texts=k.texts),data.push(J),l+=1;case 80:_++,t.next=16;break;case 83:i++,t.next=11;break;case 86:t.t2=regeneratorRuntime.keys(f);case 87:if((t.t3=t.t2()).done){t.next=98;break}return Q=t.t3.value,t.next=91,h.a.get(Q).then((function(t){for(var e={},r=t.data.sequences[0].canvases,n=0;n<r.length;n++){var canvas=r[n];canvas.images[0].resource.service?e[canvas["@id"]]=canvas.images[0].resource.service["@id"]+"/info.json":e[canvas["@id"]]=canvas.images[0].resource["@id"]}return e})).catch((function(){return null}));case 91:if(U=t.sent){t.next=94;break}return t.abrupt("continue",87);case 94:for($ in B=f[Q])G=B[$].split("#xywh="),X=G[0],area=G[1],(image=U[X])&&(image.includes("info.json")&&(image=image.replace("info.json",area+"/256,/0/default.jpg")),data[Number($)]._source._thumbnail=[image]);t.next=87;break;case 98:return Y="list","annotation"===e.viewingHint?Y="table":e.viewingHint&&(Y=e.viewingHint),t.abrupt("return",{data:data,index:c,title:title,thumbnail:r,json:e,entity:v,api:e.api,layout:Y,description:e.description});case 101:case"end":return t.stop()}}),t)}))),function(t){return e.apply(this,arguments)})},{key:"search",value:function(t,e,r){var n=this.filter(t,e,r),o=this.getDataFiltered(n,e),l=this.createFacets(t,n,r.aggs);return o=this.sortData(r.sort,o),{aggregations:l,hits:{hits:this.getResult(o,r.from,r.size),total:{relation:r.sort,value:o.length}}}}},{key:"filter",value:function(t,e,r){for(var o=this,l=[],i=0;i<e.length;i++)l.push(i);if(!r.query)return l;var c=r.query.bool,f=new Set(l),v=new Set,h={filter:!1,must:!1,must_not:!1,should:!1};for(var d in c){var y=c[d];y.length>0&&(h[d]=!0);for(var _=function(e){var r=y[e],c=new Set;if(r.bool){var h=r.bool.should;c=new Set([]);for(var m=0;m<h.length;m++){var _=o.getIds(t,l,h[m],d);c=new Set([].concat(Object(n.a)(c),Object(n.a)(_)))}}else c=o.getIds(t,l,r,d);"should"!==d?f=new Set(Object(n.a)(f).filter((function(t){return c.has(t)}))):v=new Set([].concat(Object(n.a)(v),Object(n.a)(c)))},k=0;k<y.length;k++)_(k)}!h.should||h.must||h.filter||h.must_not||(f=new Set([]));var w,A=[],j=m(new Set([].concat(Object(n.a)(f),Object(n.a)(v))));try{for(j.s();!(w=j.n()).done;){var x=w.value;A.push(x)}}catch(t){j.e(t)}finally{j.f()}return A}},{key:"getIds",value:function(t,e,r,n){var o=r[Object.keys(r)[0]],l=Object.keys(o)[0],c=o[l];c=c.toLowerCase();var f=[];if("must_not"===n&&(f=e),l.includes(".keyword")){var v=t[l=l.replace(".keyword","")];for(var h in v)h.toLowerCase()===c&&function(){var t=v[h];f="must_not"!==n?f.concat(t):f.filter((function(e){return!t.includes(e)}))}()}else{var map=t[l];for(var m in map)m.toLowerCase().includes(c)&&function(){var t=map[m];f="must_not"!==n?f.concat(t):f.filter((function(e){return!t.includes(e)}))}()}return new Set(f)}},{key:"getDataFiltered",value:function(t,e){for(var r=[],i=0;i<t.length;i++)r.push(e[t[i]]);return r}},{key:"createFacets",value:function(t,e,r){var n={},o=function(label){var o=r[label].terms,l=o.size?Number(o.size):-1,c=o.field.replace(".keyword",""),map=t[c],f={};for(var v in map){for(var h=[],m=map[v],i=0;i<m.length;i++)e.includes(m[i])&&h.push(m[i]);var d=h.length;d>0&&(f[v]=d)}var y=Object.keys(f).map((function(t){return{key:t,value:f[t]}}));y.sort((function(a,b){return a.value<b.value?1:a.value>b.value?-1:0})),(-1===l||l>y.length)&&(l=y.length);for(var _=[],k=0;k<l;k++){var w={key:y[k].key,doc_count:y[k].value};_.push(w)}n[label]={buckets:_}};for(var label in r)o(label);return n}},{key:"sortData",value:function(t,e){var r,n=(r=t,Array.isArray(r)?r:[r])[0];if(!n)return e;var o=Object.keys(n)[0];if("_random"===o)return this.shuffle(e);var l=n[o].order;o=o.replace(".keyword","");var c=!0;"desc"===l&&(c=!1);var f=1,v=-1;return c||(f*=-1,v*=-1),e.sort((function(a,b){return a._source[o]?b._source[o]?a._source[o][0]>b._source[o][0]?f:a._source[o][0]<b._source[o][0]?v:0:v:f})),e}},{key:"getResult",value:function(t,e,r){var n=[],o=e+r;o>t.length&&(o=t.length);for(var i=e;i<o;i++)n.push(t[i]);return n}}]),t}();e.a=function(t,e){e("searchUtils",new y)}},259:function(t,e,r){"use strict";var n={data:function(){return{drawer:!1,baseUrl:"https://hp-db.github.io"}}},o=r(90),l=r(123),c=r.n(l),f=r(383),v=r(388),h=r(385),m=r(384),d=r(386),y=r(176),_=r(177),k=r(116),w=r(178),A=r(85),j=r(387),x=r(389),I=r(251),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-app",[r("div",[r("v-navigation-drawer",{attrs:{app:"",temporary:!0},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[r("v-list",[r("v-list-item",{attrs:{link:"",to:t.localePath({name:"index"})}},[r("v-list-item-action",[r("v-icon",[t._v("mdi-home")])],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",[t._v("Home")])],1)],1),t._v(" "),r("v-list-item",{attrs:{link:"",to:t.localePath({name:"search"})}},[r("v-list-item-action",[r("v-icon",[t._v("mdi-magnify")])],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",[t._v("Search")])],1)],1),t._v(" "),r("v-list-item",{attrs:{link:"",href:"https://wdb.jinsha.tsukuba.ac.jp/hdb/",target:"_blank"}},[r("v-list-item-action",[r("v-icon",[t._v("mdi-database")])],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",[t._v("Hieratic Database"),r("br"),t._v("Project")])],1)],1),t._v(" "),r("v-list-item",{attrs:{link:"",href:"https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/item?search=6+W%3A800+X%3Amol&sort_by=uparl%3AidentifierOfTheData&sort_order=asc",target:"_blank"}},[r("v-list-item-action",[r("v-icon",[t._v("mdi-image")])],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",[t._v("Digital Resources for"),r("br"),t._v("Egyptian Studies")])],1)],1),t._v(" "),r("v-list-item",{attrs:{link:"",href:"http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation=https://moeller.jinsha.tsukuba.ac.jp/data/curation.json&mode=annotation&lang=ja",target:"_blank"}},[r("v-list-item-action",[r("v-icon",[t._v("mdi-image")])],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",[t._v("IIIF Curation Platfrom")])],1)],1),t._v(" "),r("v-list-item",{attrs:{link:"",href:t.baseUrl+"/snorql",target:"_blank"}},[r("v-list-item-action",[r("v-icon",[t._v("mdi-image")])],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",[t._v("SPARQL Endpoint")])],1)],1)],1)],1),t._v(" "),r("v-app-bar",[r("v-app-bar-nav-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),r("v-toolbar-title",{attrs:{to:"/"}},[r("nuxt-link",{staticStyle:{color:"inherit","text-decoration":"inherit"},attrs:{to:"/"}},[t._v("\n          Hieratische Paläographie DB\n        ")])],1)],1)],1),t._v(" "),r("v-main",[r("nuxt")],1),t._v(" "),r("v-footer",{staticClass:"mt-5",attrs:{dark:!0}},[r("v-container",[r("p",{staticClass:"text-center my-5"},[t._v("\n        Masakatsu NAGAI, Toshihito WAKI, Yona TAKAHASHI and Satoru NAKAMURA\n      ")]),t._v(" "),r("p",{staticClass:"text-center my-5"},[t._v("\n        This work was supported by JSPS KAKENHI Grant Number\n        "),r("a",{attrs:{href:"https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-18K00525/"}},[t._v("18K00525")]),t._v(".\n      ")])])],1)],1)}),[],!1,null,null,null);e.a=component.exports;c()(component,{VApp:f.a,VAppBar:v.a,VAppBarNavIcon:h.a,VContainer:m.a,VFooter:d.a,VIcon:y.a,VList:_.a,VListItem:k.a,VListItemAction:w.a,VListItemContent:A.a,VListItemTitle:A.b,VMain:j.a,VNavigationDrawer:x.a,VToolbarTitle:I.a})},272:function(t,e,r){r(273),t.exports=r(274)},293:function(t,e,r){"use strict";var n=r(140);r.n(n).a},294:function(t,e,r){(e=r(19)(!1)).push([t.i,"h1[data-v-66a519aa]{font-size:20px}",""]),t.exports=e},351:function(t,e,r){"use strict";r.r(e),r.d(e,"state",(function(){return o})),r.d(e,"mutations",(function(){return l}));r(6),r(41),r(7),r(36),r(32),r(14),r(45),r(62),r(46);function n(t){return Array.isArray(t)?t:[t]}var o=function(){return{title:"IIIF Multi Viewer",sort:"_score:desc",size:24,from:0,after:"",before:"",id:[],image:[],keyword:[],advanced:{q:{},fc:{}},currentPage:1,layout:"list",col:4,facetFlag:!0,facetFlags:{},facetLabels:{},fullPath:"",result:{},mode:"",index:null,data:null,query:{},thumbnail:null,attribution:null,description:null,json:null,entity:null,api:null,currentManifest:"",currentMember:""}},l={init:function(t){t.sort="_score:desc",t.size=24,t.from=0,t.currentPage=1,t.keyword=[],t.advanced={q:{},fc:{}},t.id=[],t.image=[],t.after="",t.before=""},setLayout:function(t,e){t.layout=e},setCol:function(t,e){t.col=e},setResult:function(t,e){t.result=e},setFacetLabels:function(t,e){t.facetLabels=e},setFacetFlags:function(t,e){for(var i=0;i<e.length;i++){var r=e[i];t.facetFlags[r]=!0}},setSize:function(t,e){t.size=e},setSort:function(t,e){t.sort=e},setCurrentPage:function(t,e){t.currentPage=e},setFrom:function(t,e){t.from=e},setFacetFlag:function(t,e){t.facetFlag=e},setId:function(t,e){t.id=n(e)},setImage:function(t,e){t.image=n(e)},setAfter:function(t,e){t.after=n(e)},setBefore:function(t,e){t.before=n(e)},setKeyword:function(t,e){t.keyword=n(e)},setAdvanced2:function(t,e){t.advanced=e},setAdvanced:function(t,e){var label=e.label,r=e.values;r=n(r);var o=e.type,l=t.advanced[o];l[label]||(l[label]={"+":[],"-":[]});for(var c=l[label],i=0;i<r.length;i++){var f=r[i];f.startsWith("-")?c["-"].push(f.slice(1)):c["+"].push(f)}},setFullPath:function(t,e){t.fullPath=e},setMode:function(t,e){t.mode=e},removeAdvanced:function(t,data){for(var label=data.label,e=data.values,r=data.type,n=t.advanced[r],o=function(i){var t=e[i],r="+";t.startsWith("-")&&(t=t.slice(1),r="-");var o=n[label][r];n[label][r]=o.filter((function(e){return e!==t}))},i=0;i<e.length;i++)o(i)},changeFacetFlags:function(t,data){t.facetFlags[data.label]=data.value},removeKeyword:function(t,e){var r=t.keyword.filter((function(t){return!e.includes(t)}));t.keyword=r},removeKey:function(t,data){var e=t[data.label].filter((function(t){return!data.value.includes(t)}));t[data.label]=e},removeId:function(t,e){var r=t.id.filter((function(t){return!e.includes(t)}));t.id=r},removeImage:function(t,e){var r=t.image.filter((function(t){return!e.includes(t)}));t.image=r},setResult4Print:function(t,e){t.result4print=e},setData:function(t,e){t.data=e},setIndex:function(t,e){t.index=e},setQuery:function(t,e){t.query=e},setTitle:function(t,e){t.title=e},setDescription:function(t,e){t.description=e},setThumbnail:function(t,e){t.thumbnail=e},setAttribution:function(t,e){t.attribution=e},setJson:function(t,e){t.json=e},setEntity:function(t,e){t.entity=e},setApi:function(t,e){t.api=e},setCurrentManifest:function(t,e){t.currentManifest=e},setCurrentMember:function(t,e){t.currentMember=e}}},357:function(t,e,r){var map={"./en":[268,0],"./en.json":[268,0],"./ja":[269,1],"./ja.json":[269,1]};function n(t){if(!r.o(map,t))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=map[t],n=e[0];return r.e(e[1]).then((function(){return r.t(n,3)}))}n.keys=function(){return Object.keys(map)},n.id=357,t.exports=n},80:function(t,e,r){"use strict";var n={layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{pageNotFound:"404 Not Found",otherError:"An error occurred"}},head:function(){return{title:404===this.error.statusCode?this.pageNotFound:this.otherError}}},o=(r(293),r(90)),l=r(123),c=r.n(l),f=r(383),v=r(384),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-app",{attrs:{dark:""}},[r("v-container",{staticClass:"my-5"},[404===t.error.statusCode?r("h1",[t._v("\n      "+t._s(t.pageNotFound)+"\n    ")]):r("h1",[t._v("\n      "+t._s(t.otherError)+"\n    ")]),t._v(" "),r("NuxtLink",{attrs:{to:"/"}},[t._v(" Home page ")])],1)],1)}),[],!1,null,"66a519aa",null);e.a=component.exports;c()(component,{VApp:f.a,VContainer:v.a})}},[[272,8,4,9]]]);