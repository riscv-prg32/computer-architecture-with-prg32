// Checks the learning status of the course (lib/mastery.js) and writes the coverage matrix.
//   node textbook/check_mastery.js            (from tools/; after node build.js, for the checks on the decks)
//
// Fails, with the reason, if
//   - the registry has an unknown field, a bad lecture number, a missing English or Italian label, or a concept
//     that the course never studies (formal: null) without the reason;
//   - decks/mastery.js uses an unknown state or concept, marks a slide that does not exist, that is dropped, a
//     section title, a question or an exercise, or puts more than two badges on a slide;
//   - a badge UNDERSTAND LATER points to a concept whose formal lecture is not a later lecture;
//   - intro, use and formal of the registry differ from what decks/mastery.js says (they cannot drift apart);
//   - a question named in practice is not a question or an exercise of that lecture;
//   - the English and the Italian specification differ in a marked slide, or a badge is too wide in a language;
//   - a pair of colours of the badges falls below WCAG AA (4.5:1 for the text, 3:1 for the bar);
//   - in a built deck, a badge overlaps another shape, or the badges are missing from a slide that has them.
// Warns (and lists in the matrix) a concept understood without any question or exercise to check it, and the
// open issues of the audit (review).  Writes ../concepts/coverage.md.
const fs = require("fs"), path = require("path");
const M = require("../lib/mastery");
const { loadDecks, visible, LANGS } = require("../lib/lang");
const { spawnSync } = require("child_process");

// The specifications are loaded once per process (lib/verm1.js counts the regions it shows): one child per language
// prints what the checks need.
if (process.argv[2] === "--dump") {
  const lang = process.argv[3], out = { specs: {}, decks: [] };
  const raw = loadDecks(lang, { raw: true });
  for (const d of raw) out.specs[d.n] = { n: d.n, title: d.title, short: d.short, slides: d.slides.map((s) => ({ t: s.t })) };
  for (const d of raw.flatMap((x) => require("../lib/lab").split(x, lang))) out.decks.push({ n: d.n, file: d.file, kind: d.kind, slides: visible(d).map((s) => ({ t: s.t, gen: s.gen, src: s.src })) });
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}
const dump = (l) => { const r = spawnSync(process.execPath, [__filename, "--dump", l], { encoding: "utf8", maxBuffer: 1 << 28 }); if (r.status) { console.error(r.stderr); process.exit(1); } return JSON.parse(r.stdout); };
const DUMP = Object.fromEntries(LANGS.map((l) => [l, dump(l)]));
const PLAN = require("../decks/plan");
const ROOT = path.resolve(__dirname, "..", "..");
let bad = 0, warn = 0;
const fail = (m) => { bad++; console.log("FAIL " + m); };
const note = (m) => { warn++; console.log("warn " + m); };

// ---- registry ---------------------------------------------------------------------------------------------------
const LEC = /^(0\d|1\d|2[0-4])$/, FIELDS = ["label", "intro", "use", "formal", "practice", "reason", "review"];
for (const [id, c] of Object.entries(M.CONCEPTS)) {
  if (!/^[a-z0-9]+\.[a-z0-9-]+$/.test(id)) fail(`registry: bad id ${id}`);
  for (const k of Object.keys(c)) if (!FIELDS.includes(k)) fail(`registry ${id}: unknown field ${k}`);
  for (const l of LANGS) if (!c.label || !c.label[l] || !c.label[l].trim()) fail(`registry ${id}: no ${l} label`);
  if (!LEC.test(c.intro)) fail(`registry ${id}: intro ${c.intro}`);
  for (const k of ["use", "formal"]) if (c[k] !== null && !LEC.test(c[k])) fail(`registry ${id}: ${k} ${c[k]}`);
  if (c.formal === null && !c.reason) fail(`registry ${id}: never studied (formal null) and no reason given`);
  if (c.formal !== null && c.reason) fail(`registry ${id}: a reason is only for a concept that is never studied`);
  if (!Array.isArray(c.practice)) fail(`registry ${id}: practice must be a list`);
}
for (const st of M.ORDER) for (const l of LANGS) if (!M.LABEL[l][st] || !M.LABEL[l].meaning[st]) fail(`lib/mastery.js: no ${l} label for ${st}`);

// ---- contrast -----------------------------------------------------------------------------------------------------
const lum = (hex) => { const v = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const contrast = [];
for (const [st, s] of Object.entries(M.STYLE)) {
  const t = ratio(s.fg, s.bg), b = ratio(s.bar, s.bg), w = ratio(s.bar, "FFFFFF"), d = ratio(s.bg, "1B2530");
  contrast.push([st, t, b, w, d]);
  if (t < 4.5) fail(`contrast ${st}: text ${t.toFixed(2)}:1`);
  if (b < 3 || w < 3) fail(`contrast ${st}: bar ${b.toFixed(2)}:1 on the badge, ${w.toFixed(2)}:1 on a white slide`);
  if (d < 3) fail(`contrast ${st}: badge ${d.toFixed(2)}:1 on a dark slide`);
}

// ---- marks against the specifications ---------------------------------------------------------------------------
const specs = Object.fromEntries(LANGS.map((l) => [l, DUMP[l].specs]));
const derived = {};
const see = (c, n, st) => {
  const d = (derived[c] = derived[c] || { intro: null, use: null, formal: null, where: {} });
  if (!d.intro || n < d.intro) d.intro = n;
  if (st !== "understand-later" && (!d.use || n < d.use)) d.use = n;
  if (st === "understand-now" && (!d.formal || n < d.formal)) d.formal = n;
  (d.where[n] = d.where[n] || new Set()).add(st);
};
const lectures = Object.keys(specs.en).sort();
const perLecture = {};
for (const n of lectures) {
  const en = specs.en[n], it = specs.it[n], p = PLAN[n] || {}, drop = new Set(p.drop || []);
  const nSlides = en.slides.length + 1;
  let marks;
  try { marks = M.lectureMarks(n, nSlides); } catch (e) { fail(e.message); continue; }
  const raw = M.PLAN.lectures[n] || {};
  for (const key of Object.keys(raw)) if (/^\d+$/.test(key)) {
    const k = +key, t = en.slides[k - 2].t;
    if (drop.has(k)) fail(`decks/mastery.js lecture ${n}: slide ${k} is dropped by decks/plan.js`);
    if (t === "section") fail(`decks/mastery.js lecture ${n}: slide ${k} is a section title`);
  }
  perLecture[n] = { marks: [], shown: 0 };
  for (const [k, v] of Object.entries(marks)) {
    const s = en.slides[k - 2], si = it.slides[k - 2];
    if (!si || si.t !== s.t) fail(`lecture ${n} slide ${k}: English ${s.t}, Italian ${si && si.t}: the specifications differ`);
    if (s.t === "section" || drop.has(+k)) continue;     // skipped inside a range
    if (s.t === "quiz" || s.t === "exercise") fail(`decks/mastery.js lecture ${n}: slide ${k} is a ${s.t}: questions and exercises carry no badge`);
    perLecture[n].shown++;
    for (const m of v.marks) {
      perLecture[n].marks.push({ k: +k, m });
      for (const c of m.concepts) {
        see(c, n, m.state);
        const f = M.CONCEPTS[c].formal;
        if (m.state === "understand-later" && !(f && f > n)) fail(`lecture ${n} slide ${k}: UNDERSTAND LATER ${c}, but its formal lecture is ${f || "none"}`);
      }
      for (const l of LANGS) {
        const w = M.chipWidth(M.chipText(l, n, m));
        if (w > 6.2) fail(`lecture ${n} slide ${k} (${l}): a badge of ${w.toFixed(1)} in`);
      }
    }
    if (v.marks.length === 2) for (const l of LANGS) {
      const w = v.marks.reduce((a, m) => a + M.chipWidth(M.chipText(l, n, m)), 0.12);
      if (w > 12.1) fail(`lecture ${n} slide ${k} (${l}): two badges of ${w.toFixed(1)} in`);
    }
  }
  for (const key of ["program"]) if (raw[key]) {
    const m = M.parseMark(raw[key], `lecture ${n} program`);
    for (const c of m.concepts) see(c, n, m.state);
  }
  // the generated slides of every code deck (the commands for the three hosts, the troubleshooting table)
  see("tool.prg32-cli", n, "use-now");
}
for (const [id, c] of Object.entries(M.CONCEPTS)) {
  const d = derived[id];
  if (!d) { fail(`registry ${id}: no slide carries it`); continue; }
  for (const k of ["intro", "use", "formal"]) if (c[k] !== d[k]) fail(`registry ${id}: ${k} is ${c[k]}, decks/mastery.js says ${d[k]}`);
  for (const r of c.practice) {
    const [n, k] = r.split(":"), s = specs.en[n] && specs.en[n].slides[+k - 2];
    if (!s || (s.t !== "quiz" && s.t !== "exercise")) fail(`registry ${id}: practice ${r} is not a question or an exercise`);
    else if (c.formal && n < c.formal) fail(`registry ${id}: practice ${r} comes before the formal lecture ${c.formal}`);
  }
  if (c.formal && !c.practice.length) note(`${id}: understood in Lecture ${c.formal}, no question or exercise checks it`);
  if (c.review) note(`${id}: needs review: ${c.review.slice(0, 120)}...`);
}
for (const n of lectures) if (!perLecture[n] || !perLecture[n].marks.length) fail(`lecture ${n}: no slide carries a learning status`);

// ---- the built decks ------------------------------------------------------------------------------------------------
async function checkBuilt() {
  let JSZip;
  try { JSZip = require("jszip"); } catch (e) { note("jszip not found: the built decks are not checked"); return { decks: 0, slides: 0 }; }
  const EMU = 914400, BAND = 0.4 * EMU;
  let nd = 0, ns = 0;
  for (const l of LANGS) for (const d of DUMP[l].decks) {
    const f = path.join(ROOT, l, "slides", d.file + ".pptx");
    if (!fs.existsSync(f)) { fail(`${l}/slides/${d.file}.pptx: not built`); continue; }
    const zip = await JSZip.loadAsync(fs.readFileSync(f));
    nd++;
    const vis = d.slides;
    for (let k = 1; k <= vis.length + 1; k++) {
      const xml = await zip.file(`ppt/slides/slide${k}.xml`).async("string");
      const want = k === 1 ? 3 : M.slideMarks(d, vis[k - 2]).length;
      // shapes and pictures that start in the band above the title
      const offs = [...xml.matchAll(/<a:off x="(\d+)" y="(\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/>/g)].map((m) => m.slice(1).map(Number));
      const band = offs.filter(([, y]) => y < BAND);
      const chips = band.filter(([, y, , h]) => Math.abs(y - 0.1 * EMU) < 2000 && Math.abs(h - 0.3 * EMU) < 2000).length;
      const texts = (xml.match(/UNDERSTAND NOW|USE NOW|UNDERSTAND LATER|DA COMPRENDERE OGGI|DA UTILIZZARE OGGI|DA COMPRENDERE PIÙ AVANTI/g) || []).length;
      if (texts !== want) fail(`${l} ${d.file} slide ${k}: ${texts} badge(s), expected ${want}`);
      ns += want ? 1 : 0;
      // anything else in the band, below the badges, that reaches their row
      const bottom = 0.4 * EMU, top = 0.1 * EMU;
      for (const [x, y, w, h] of band) {
        const ours = y >= top - 2000 && y + h <= bottom + 2000 && (Math.abs(h - 0.3 * EMU) < 2000 || h < 0.3 * EMU);
        if (!ours && y + h > top && want) fail(`${l} ${d.file} slide ${k}: a shape at y=${(y / EMU).toFixed(2)} in reaches the row of the badges`);
      }
      if (want && chips < want) fail(`${l} ${d.file} slide ${k}: ${chips} badge frame(s), expected ${want}`);
    }
  }
  return { decks: nd, slides: ns };
}

// ---- the coverage matrix ------------------------------------------------------------------------------------------------
function matrix(built) {
  const S = { "understand-now": "now", "use-now": "use", "understand-later": "later" };
  const o = [];
  o.push("# Learning status: coverage matrix", "",
    "Generated by `tools/textbook/check_mastery.js` from `tools/decks/mastery.js` and `tools/concepts/registry.json`: do not edit.",
    "Slide numbers are those of the specification (`decks/plan.js`: the cover is 1). **now** = UNDERSTAND NOW, **use** = USE NOW,",
    "**later** = UNDERSTAND LATER; → the lecture that explains the concept. See `DESIGN.md` for the meaning of the states.", "",
    "## By lecture", "",
    "| Lecture | Slides with a badge | Understand now | Use now | Understand later (→ lecture) | Open issues |", "| --- | ---: | --- | --- | --- | --- |");
  for (const n of lectures) {
    const sum = M.summary(specs.en[n]), lbl = (c) => `\`${c}\``;
    const later = sum["understand-later"].map((c) => `${lbl(c)} → ${M.CONCEPTS[c].formal}`);
    const use = sum["use-now"].map((c) => lbl(c) + (M.CONCEPTS[c].formal && M.CONCEPTS[c].formal > n ? ` → ${M.CONCEPTS[c].formal}` : M.CONCEPTS[c].formal ? "" : " (operational)"));
    const issues = Object.entries(M.CONCEPTS).filter(([, c]) => c.review && (c.formal === n || (derived[Object.keys(M.CONCEPTS).find((k) => M.CONCEPTS[k] === c)] || { where: {} }).where[n])).map(([id]) => `\`${id}\``);
    o.push(`| ${n} ${specs.en[n].short || specs.en[n].title} | ${perLecture[n].shown} | ${sum["understand-now"].map(lbl).join(", ") || "-"} | ${use.join(", ") || "-"} | ${later.join(", ") || "-"} | ${issues.join(", ") || "-"} |`);
  }
  o.push("", "## By concept", "", "Every lecture in which the concept carries a badge, with the state; *intro* is the first exposure, *use* the first",
    "operational use, *formal* the lecture that explains it. *Check* lists the questions and exercises (lecture:slide).", "",
    "| Concept | English | Italiano | intro | use | formal | Progression | Check |", "| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const [id, c] of Object.entries(M.CONCEPTS)) {
    const d = derived[id] || { where: {} };
    const prog = Object.keys(d.where).sort().map((n) => `${n} ${[...d.where[n]].map((s) => S[s]).join("+")}`).join(" · ");
    o.push(`| \`${id}\` | ${c.label.en} | ${c.label.it} | ${c.intro} | ${c.use || "-"} | ${c.formal || "never"} | ${prog} | ${c.practice.join(", ") || (c.formal ? "**none**" : "-")} |`);
  }
  o.push("", "## Concepts that the course uses and does not study", "");
  for (const [id, c] of Object.entries(M.CONCEPTS)) if (!c.formal) o.push(`- \`${id}\`: ${c.reason}`);
  o.push("", "## Needs review", "", "Issues found by the audit, left to the author: nothing below has been changed in the slides.", "");
  for (const [id, c] of Object.entries(M.CONCEPTS)) if (c.review) o.push(`- \`${id}\`: ${c.review}`);
  o.push("", "## Concepts understood without a question or an exercise", "");
  const none = Object.entries(M.CONCEPTS).filter(([, c]) => c.formal && !c.practice.length).map(([id, c]) => `\`${id}\` (${c.formal})`);
  o.push(none.join(", ") + ".", "");
  o.push("## Contrast of the badges", "", "| State | text on badge | bar on badge | bar on white slide | badge on dark slide |", "| --- | ---: | ---: | ---: | ---: |");
  for (const [st, t, b, w, d] of contrast) o.push(`| ${st} | ${t.toFixed(2)}:1 | ${b.toFixed(2)}:1 | ${w.toFixed(2)}:1 | ${d.toFixed(2)}:1 |`);
  o.push("", `Built decks checked: ${built.decks}; slides with a badge in them: ${built.slides}.`, "");
  fs.writeFileSync(path.resolve(__dirname, "..", "concepts", "coverage.md"), o.join("\n"));
}

(async () => {
  const built = await checkBuilt();
  matrix(built);
  const nm = Object.values(perLecture).reduce((a, p) => a + p.marks.length, 0), ns = Object.values(perLecture).reduce((a, p) => a + p.shown, 0);
  console.log(`${Object.keys(M.CONCEPTS).length} concepts, ${lectures.length} lectures, ${ns} slides of the specifications with ${nm} badges; ${built.decks} built decks checked; ${warn} warning(s), ${bad} failure(s)`);
  process.exit(bad ? 1 : 0);
})();
