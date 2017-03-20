/*!
 * Mobiscroll v2.8.3
 * http://mobiscroll.com
 *
 * Copyright 2010-2013, Acid Media
 * Licensed under the MIT license.
 *
 */
(function(f){function h(n){var m;for(m in n){if(k[n[m]]!==undefined){return true}}return false}function e(){var m=["Webkit","Moz","O","ms"],n;for(n in m){if(h([m[n]+"Transform"])){return"-"+m[n].toLowerCase()+"-"}}return""}function d(n,p){var o=n.originalEvent,m=n.changedTouches;return m||(o&&o.changedTouches)?(o?o.changedTouches[0]["page"+p]:m[0]["page"+p]):n["page"+p]}function l(p,o,n){var m=p;if(typeof o==="object"){return p.each(function(){if(!this.id){this.id="mobiscroll"+(++c)}if(a[this.id]){a[this.id].destroy()}new f.mobiscroll.classes[o.component||"Scroller"](this,o)})}if(typeof o==="string"){p.each(function(){var q,s=a[this.id];if(s&&s[o]){q=s[o].apply(this,Array.prototype.slice.call(n,1));if(q!==undefined){m=q;return false}}})}return m}var c=+new Date,a={},j=f.extend,k=document.createElement("modernizr").style,i=h(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]),g=e(),b=g.replace(/^\-/,"").replace(/\-$/,"").replace("moz","Moz");f.fn.mobiscroll=function(m){j(this,f.mobiscroll.components);return l(this,m,arguments)};f.mobiscroll=f.mobiscroll||{util:{prefix:g,jsPrefix:b,has3d:i,getCoord:d},presets:{},themes:{},i18n:{},instances:a,classes:{},components:{},presetShort:function(m,n){this.components[m]=function(o){return l(this,j(o,{component:n,preset:m}),arguments)}}};f.scroller=f.scroller||f.mobiscroll;f.fn.scroller=f.fn.scroller||f.fn.mobiscroll})(jQuery);
