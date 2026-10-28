/* CredDex shared helpers. Loaded after the supabase-js script on index, manage and verify pages. */
(function(w){
var CD={};
CD.sb=supabase.createClient("https://yjeqsgzivnxsaniarrjb.supabase.co","sb_publishable_zza_qcM68oQERB8Saiqfdw_-Vssku-T");
CD.MAIL="dustinjmcguire@gmail.com";
CD.BASE=location.origin+location.pathname.replace(/[^\/]*$/,"");
CD.$=function(i){return document.getElementById(i)};
CD.esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
CD.toast=function(m){var t=CD.$("toast");if(!t)return;t.textContent=m;t.className="on";clearTimeout(CD.toast.h);CD.toast.h=setTimeout(function(){t.className=""},3200)};
CD.smooth=function(){return matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"};
CD.hsh=function(t){var x=7;t=String(t);for(var i=0;i<t.length;i++)x=(x*31+t.charCodeAt(i))>>>0;return x};
CD.ini=function(s){
 var w=String(s||"?").split(/[\s\/]+/).filter(function(x){return /^[A-Za-z0-9]/.test(x)});
 if(!w.length)return "?";
 if(/^[A-Z0-9]{2,4}$/.test(w[0]))return w[0];
 return w.slice(0,2).map(function(x){return x[0]}).join("").toUpperCase()};
CD.badge=function(c){
 var e=CD.esc;
 if(c.img)return '<img class="badge" alt="" referrerpolicy="no-referrer" src="'+e(c.img)+'" data-i="'+e(c.issuer||"")+'" data-n="'+e(c.name||"")+'">';
 var k=String(c.issuer||c.name||"?"),h=0;for(var i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))%360;
 var t=CD.ini(k);
 return '<svg class="badge" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="hsl('+h+',55%,38%)"/><polygon points="50,12 84,31 84,69 50,88 16,69 16,31" fill="none" stroke="hsl('+h+',60%,80%)" stroke-width="2"/><text x="50" y="58" text-anchor="middle" font-size="'+(t.length>2?21:26)+'" font-weight="800" fill="#fff" font-family="Bricolage Grotesque,system-ui,sans-serif">'+e(t)+'</text></svg>'};
/* a dead image link falls back to the generated badge */
document.addEventListener("error",function(ev){var t=ev.target;
 if(t&&t.tagName==="IMG"&&t.dataset&&t.dataset.n!==undefined){var d=document.createElement("div");d.innerHTML=CD.badge({issuer:t.dataset.i,name:t.dataset.n});if(d.firstChild)t.replaceWith(d.firstChild)}},true);
CD.artUrl=function(p){return p?CD.sb.storage.from("badge-art").getPublicUrl(p).data.publicUrl:""};
CD.safeUrl=function(u){return /^https?:\/\//i.test(u||"")?u:""};

/* Category list and the clusters used for browsing. New categories that aren't listed here land in "Other". */
CD.CATS=["AI & Machine Learning","CAD & Design","Communication & Service","Cloud","Cyber Security","Data Engineering","Employability & Pathways","Engineering Practice","Finance & Business","Leadership & Mentoring","Manufacturing & Making","Programming & Numerical Computing","Project Management","Risk & Safety","Simulation & Analysis","Software & DevOps","Sustainability & Climate","Teaching & Learning"];
CD.CLUSTERS=[
 ["Engineering",["CAD & Design","Simulation & Analysis","Programming & Numerical Computing","Engineering Practice","Manufacturing & Making","Risk & Safety"]],
 ["Technology",["Software & DevOps","Cloud","Cyber Security","Data Engineering","AI & Machine Learning"]],
 ["Business",["Finance & Business","Project Management","Leadership & Mentoring"]],
 ["People & Skills",["Teaching & Learning","Communication & Service","Employability & Pathways"]],
 ["Sustainability",["Sustainability & Climate"]]
];
/* general, cross-cutting shortcuts: label -> category */
CD.GENERAL=[["AI","AI & Machine Learning"],["Leadership","Leadership & Mentoring"],["Communication","Communication & Service"],["Project management","Project Management"],["Cyber security","Cyber Security"],["Employability","Employability & Pathways"]];
CD.clusterOf=function(cat){for(var i=0;i<CD.CLUSTERS.length;i++)if(CD.CLUSTERS[i][1].indexOf(cat)>-1)return CD.CLUSTERS[i][0];return "Other"};
CD.audience=function(a){
 if(!a)return "";
 var chk=/\(check page\)/i.test(a),t=a.replace(/\s*\(check page\)/i,"").trim();
 if(/^open$/i.test(t))t="Open to anyone";
 else if(/^open\b/i.test(t))t=t.replace(/^open( course)?\s*/i,"Open to anyone ").trim();
 else t="Usually for: "+t;
 return t+(chk?" · not confirmed, check the badge page":"")};
CD.fmtDate=function(d){if(!d)return "";var x=new Date(d+"T00:00:00");return isNaN(x)?d:x.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"})};
CD.footer=function(){return '<a href="index.html">Home</a> · <a href="creddex-terms.html">Terms</a> · <a href="creddex-privacy.html">Privacy</a>'};
w.CD=CD;
})(window);
