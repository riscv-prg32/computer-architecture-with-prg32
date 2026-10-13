// Checks the decks that are built: the limit of 20 slides for the lecture decks, and that the Italian
// decks have the same slides as the English ones (the reference), in the same order: the same kinds,
// the same listings, the same pictures and the same right answers.
//   node textbook/check_decks.js        (from tools/)
const { spawnSync } = require("child_process");
const crypto = require("crypto");
const lang = process.argv[2];
if (lang) {
  const { loadDecks, visible } = require("../lib/lang");
  const h = (x) => crypto.createHash("md5").update(String(x)).digest("hex").slice(0, 8);
  const out = [];
  for (const d of loadDecks(lang)) {
    const v = visible(d);
    out.push(`${d.n} ${d.kind} ${v.length + 1}`);
    v.forEach((s, i) => {
      const a = s.a; let x = "";
      if (s.t === "quiz") x = ` ${a[1].length} ${a[2]}`;
      if (s.t === "quiz2") x = " " + a[0].map((q) => `${q[1].length} ${q[2]}`).join(" ");
      if (s.t === "code" || s.t === "walk") x = ` ${s.gen || (a[4] === "txt" ? "text" : h(a[1]))} ${(a[2] || []).length}`;   // a plain-text listing may be translated
      if (s.t === "walk") x += " " + a[2];
      if (s.t === "table") x = ` ${a[1].length}x${a[2].length}`;
      if (["bullets", "ordered", "cards", "steps", "exercise", "flow"].includes(s.t)) x = ` ${(a[1] || []).length}`;
      if (s.t === "bullets" && a[3]) x += " " + (a[3].img || (a[3].code ? h(a[3].code) : a[3].big ? "big" : "box"));
      if (s.t === "images") x = " " + a[1].map((p) => p[0]).join(",");
      out.push(`${d.n} ${d.kind} ${i + 2} ${s.t}${x}`);
    });
  }
  process.stdout.write(out.join("\n") + "\n");
} else {
  const run = (l) => { const r = spawnSync(process.execPath, [__filename, l], { encoding: "utf8", maxBuffer: 1 << 26 }); if (r.status) { console.error(r.stderr); process.exit(1); } return r.stdout.trim().split("\n"); };
  const en = run("en"), it = run("it");
  let bad = 0, main = 0, code = 0, over = 0;
  for (const l of en) { const m = l.match(/^(\d\d) (main|code) (\d+)$/); if (m) { if (m[2] === "main") { main += +m[3]; if (+m[3] > 20) { over++; console.log(`FAIL lecture ${m[1]}: the lecture deck has ${m[3]} slides`); } } else code += +m[3]; } }
  for (let i = 0; i < Math.max(en.length, it.length); i++) if (en[i] !== it[i]) { bad++; if (bad <= 20) console.log(`FAIL en: ${en[i]}\n     it: ${it[i]}`); }
  console.log(`50 decks: ${main} slides in the 25 lecture decks, ${code} in the 25 code decks; ${bad} difference(s) between English and Italian`);
  process.exit(bad || over ? 1 : 0);
}
