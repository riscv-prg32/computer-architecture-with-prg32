// Exports every listing of the slide decks of a language to <lang>/textbook/code/lNN/sKK.<ext>,
// so that the book prints the same files that the decks show and the tests check.
//   node textbook/export_listings.js <en|it> [dump_dir]
// With dump_dir, a plain-text dump of each deck (titles, bullets, notes) is written too.
// Listings are not translated: the export of "it" must be byte-identical to that of "en"
// except where a listing is plain text (compare with  diff -r en/textbook/code it/textbook/code).
const fs=require("fs"),path=require("path");
const {LANGS,loadDecks}=require("../lib/lang");
const lang=process.argv[2];
if(!LANGS.includes(lang)){console.error("usage: node textbook/export_listings.js <"+LANGS.join("|")+"> [dump_dir]");process.exit(2);}
const decks=loadDecks(lang);
const TB=path.resolve(__dirname,"..","..",lang,"textbook","code");const EXT={asm:"S",sh:"sh",c:"c",txt:"txt",json:"json",py:"py",verilog:"v"};
let CUR="";const save=(i,code,lang)=>{const dir=TB+"/l"+CUR;fs.mkdirSync(dir,{recursive:true});const f=`s${String(i+2).padStart(2,"0")}.${EXT[lang||"asm"]||lang}`;fs.writeFileSync(dir+"/"+f,String(code).replace(/\t/g,"    ").replace(/\s+$/,"")+"\n");return `code/l${CUR}/${f}`;};
const j=(x)=>typeof x==="string"?x:JSON.stringify(x);
const items=(its,ind="  - ")=>(its||[]).map(it=>Array.isArray(it)?ind+it[0]+"\n"+(it[1]||[]).map(s=>"      . "+s).join("\n"):ind+j(it)).join("\n");
for(const d of decks){CUR=String(d.n).padStart(2,"0");
 let o=`DECK ${d.n}: ${d.title}\nsub: ${d.sub||""}\nquote: ${j(d.quote||"")}\ncover: ${d.cover||""}\nfile: ${d.file}\nnotes: ${d.notes||""}\n\n`;
 d.slides.forEach((sl,i)=>{const a=sl.a;let s=`### [${i+2}] ${sl.t.toUpperCase()}: `;
  const N=(n)=>n?`\n  NOTE: ${n}`:"";
  switch(sl.t){
   case "bullets": s+=a[0]+"\n"+items(a[1])+(a[3]?"\n  SIDE: "+(a[3].code?"CODEFILE "+save(i,a[3].code,a[3].lang)+"\n~~~\n"+a[3].code+"\n~~~":j(a[3])):"")+N(a[2]);break;
   case "ordered": s+=a[0]+"\n"+items(a[1],"  # ")+N(a[2]);break;
   case "cards": case "steps": s+=a[0]+"\n"+a[1].map(([h,b])=>`  * ${h}: ${b}`).join("\n")+N(a[2]);break;
   case "code": s+=a[0]+` (lang=${a[4]||"asm"}) FILE ${save(i,a[1],a[4])}\n~~~\n${a[1]}\n~~~\n`+items(a[2],"  > ")+N(a[3]);break;
   case "walk": s+=a[0]+` FILE ${save(i,a[1],"asm")}\n~~~\n${a[1]}\n~~~\n  IMG: ${a[2]}\n  CAP: ${a[3]}`+N(a[4]);break;
   case "versus": s+=a[0]+`\n  L ${a[1][0]}:\n${items(a[1][1],"    - ")}\n  R ${a[2][0]}:\n${items(a[2][1],"    - ")}`+N(a[3]);break;
   case "table": s+=a[0]+"\n  | "+a[1].join(" | ")+"\n"+a[2].map(r=>"  | "+r.join(" | ")).join("\n")+(a[4]&&a[4].caption?"\n  CAPTION: "+a[4].caption:"")+N(a[3]);break;
   case "big": s+=a[0]+(a[1]?"\n  SUB: "+a[1]:"")+N(a[2]);break;
   case "definition": s+=a[0]+`\n  TERM: ${a[1]}\n  DEF: ${a[2]}\n`+items(a[3])+N(a[4]);break;
   case "exercise": s+=a[0]+"\n"+items(a[1],"  # ")+"\n  EXPECTED: "+(a[2]||"")+N(a[3]);break;
   case "quiz": s+=a[0]+"\n"+a[1].map((o,k)=>`  ${"ABCDEF"[k]}${k===a[2]?"*":" "} ${o}`).join("\n")+"\n  WHY: "+(a[3]||"");break;
   case "section": s+=a[0]+(a[1]?"\n  SUB: "+a[1]:"");break;
   case "images": s+=a[0]+"\n"+a[1].map(([f,c])=>`  IMG ${f}: ${c||""}`).join("\n")+(a[3]?"\n  TEXT: "+a[3]:"")+N(a[2]);break;
   case "flow": s+=a[0]+"\n"+a[1].map(n=>"  -> "+n).join("\n")+(a[2]?"\n  CAPTION: "+a[2]:"")+N(a[3]);break;
   case "draw": s+=(a[0]||"(dark)")+"\n  DRAWFN: "+String(a[1]).replace(/\s+/g," ").slice(0,3000)+N(a[2]);break;
  }
  o+=s+"\n\n";});
 if(process.argv[3]) fs.writeFileSync(`${process.argv[3]}/${String(d.n).padStart(2,"0")}.txt`,o);
 console.log(d.n,d.title,d.slides.length+1,o.length);
}
