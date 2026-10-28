/* CredDex: build a downloadable badge PNG with the badge details embedded (no recipient name or email). */
(function(w){
var B={};
var tbl=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;tbl[n]=c>>>0}
function crc32(b){var c=0xFFFFFFFF;for(var i=0;i<b.length;i++)c=tbl[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function chunk(type,data){
 var tb=new TextEncoder().encode(type),out=new Uint8Array(12+data.length),dv=new DataView(out.buffer);
 dv.setUint32(0,data.length);out.set(tb,4);out.set(data,8);
 var cr=new Uint8Array(4+data.length);cr.set(tb,0);cr.set(data,4);dv.setUint32(8+data.length,crc32(cr));return out}
function itxt(key,text){
 var e=new TextEncoder(),k=e.encode(key),t=e.encode(text),d=new Uint8Array(k.length+5+t.length);
 d.set(k,0);d.set(t,k.length+5);return chunk("iTXt",d)}   /* keyword, 5 zero bytes (no compression, no language), text */
B.bake=function(bytes,items){
 var sig=[137,80,78,71,13,10,26,10];for(var i=0;i<8;i++)if(bytes[i]!==sig[i])throw new Error("Not a PNG");
 var dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),o=8,end=-1;
 while(o+8<=bytes.length){var len=dv.getUint32(o),ty=String.fromCharCode(bytes[o+4],bytes[o+5],bytes[o+6],bytes[o+7]);if(ty==="IEND"){end=o;break}o+=12+len}
 if(end<0)throw new Error("Bad PNG");
 var extra=items.filter(function(x){return x[1]}).map(function(x){return itxt(x[0],x[1])});
 var add=extra.reduce(function(a,b){return a+b.length},0),out=new Uint8Array(bytes.length+add);
 out.set(bytes.subarray(0,end),0);var p=end;extra.forEach(function(e){out.set(e,p);p+=e.length});out.set(bytes.subarray(end),p);return out};
B.pngBytes=async function(imageUrl,svg){
 if(imageUrl){try{var r=await fetch(imageUrl);if(r.ok){var b=new Uint8Array(await r.arrayBuffer());if(b[0]===137&&b[1]===80)return b}}catch(e){}}
 var s=svg.replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" ');
 var im=await new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i)};i.onerror=rej;i.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s)});
 var cv=document.createElement("canvas");cv.width=cv.height=512;cv.getContext("2d").drawImage(im,0,0,512,512);
 var blob=await new Promise(function(res){cv.toBlob(res,"image/png")});return new Uint8Array(await blob.arrayBuffer())};
/* b: {name,description,criteria,skills,orgName,orgWebsite,issuedOn,expires,verifyUrl,infoUrl,imageUrl}; svg: markup used if there is no artwork */
B.download=async function(b,svg){
 var bytes=await B.pngBytes(b.imageUrl,svg);
 var ob={"@context":"https://w3id.org/openbadges/v2","type":"Assertion","id":b.verifyUrl,
  "issuedOn":b.issuedOn?b.issuedOn+"T00:00:00Z":undefined,"expires":b.expires?b.expires+"T00:00:00Z":undefined,
  "evidence":[{"id":b.verifyUrl,"narrative":"Check this badge on CredDex"}],
  "badge":{"type":"BadgeClass","id":b.infoUrl,"name":b.name,"description":b.description||"","image":b.imageUrl||undefined,
   "criteria":{"narrative":b.criteria||""},
   "tags":String(b.skills||"").split(";").map(function(s){return s.trim()}).filter(Boolean),
   "issuer":{"type":"Profile","id":b.infoUrl,"name":b.orgName,"url":b.orgWebsite||b.infoUrl}}};
 var out=B.bake(bytes,[["openbadges",JSON.stringify(ob)],["Title",b.name],["Description",b.description||""],["Author",b.orgName],["Source",b.verifyUrl]]);
 var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([out],{type:"image/png"}));
 a.download=(String(b.name).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"badge")+".png";
 document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},5000)};
w.CDBake=B;
})(window);
