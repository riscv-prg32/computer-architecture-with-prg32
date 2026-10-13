// gpgpu_sum.png: a parallel sum of 16 items in log2(16) = 4 steps. Drawn for the course (CC BY-SA 4.0); no words, so that both languages use it.
const sharp=require("sharp");
const W=1200,H=640,N=16,x0=60,dx=(W-200)/(N-1),y0=50,dy=135; let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Helvetica,Arial,sans-serif"><rect width="100%" height="100%" fill="#ffffff"/>`;
const col=["#1f7a8c","#c9791f","#6a4c93","#2e8b57","#b23a48"];
let xs=Array.from({length:N},(_,i)=>x0+i*dx);
for(let l=0;l<=4;l++){ const y=y0+l*dy;
  s+=`<text x="${W-20}" y="${y+9}" text-anchor="end" font-size="26" font-weight="bold" fill="#555">${l===0?"N = 16":l}</text>`;
  xs.forEach((x)=>{ s+=`<rect x="${x-17}" y="${y-17}" width="34" height="34" rx="6" fill="${col[l]}"/>`; });
  if(l<4){ const nx=[]; for(let i=0;i<xs.length;i+=2){ const m=(xs[i]+xs[i+1])/2; nx.push(m); for(const x of [xs[i],xs[i+1]]) s+=`<line x1="${x}" y1="${y+17}" x2="${m}" y2="${y+dy-17}" stroke="#7a8794" stroke-width="3"/>`; s+=`<text x="${m}" y="${y+dy/2+8}" text-anchor="middle" font-size="22" font-weight="bold" fill="#1f2a37">+</text>`; } xs=nx; } }
s+="</svg>";
sharp(Buffer.from(s)).png({compressionLevel:9}).toFile(require("path").join(__dirname, "..", "assets", "gpgpu_sum.png")).then(i=>console.log(i.width,i.height));
