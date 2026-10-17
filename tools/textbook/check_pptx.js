// Structural check of the BUILT decks (../../<lang>/slides/*.pptx), not of their specifications.
//   node textbook/check_pptx.js                       every deck of both languages (after node build.js)
//   node textbook/check_pptx.js --root DIR --lecture 02   the decks of one lecture under DIR/<lang>/slides (tests)
//
// For each package: it opens as a ZIP; [Content_Types].xml and ppt/presentation.xml are there; the presentation lists
// exactly the slides that the specification and decks/plan.js produce; every slide and notes part is well-formed XML;
// every slide shows its title (or, for a page of questions, its questions); every slide carries its note from
// ../../<lang>/notes; a code deck contains the slides a student needs in the laboratory (what to expect and how to run
// it on PRG32-QT, QEMU and the board, and what to do if it fails).  Then English and Italian: the same number of
// slides, of the same kinds, with the same number of learning-status badges.  Fails on a missing tool or deck:
// nothing is skipped.  The badges themselves (text, frame, position) are checked by check_mastery.js.
const fs = require("fs"), path = require("path");
const { spawnSync } = require("child_process");
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };

if (argv[0] === "--dump") {     // one child per language: the specifications are loaded once per process
  const lang = argv[1];
  const { loadDecks, visible, slideTitle, parseNotes } = require("../lib/lang");
  const M = require("../lib/mastery");
  const out = loadDecks(lang).map((d) => {
    const notes = parseNotes(lang, d) || {};
    return { n: d.n, kind: d.kind, file: d.file, slides: [{ t: "cover", title: d.title, badges: 0, note: notes[1] || "" }].concat(visible(d).map((s, i) => ({
      t: s.t, gen: s.gen || null,
      title: s.t === "quiz2" ? null : typeof s.a[0] === "string" ? s.a[0] : null,
      questions: s.t === "quiz2" ? s.a[0].map((q) => q[0]) : null,
      badges: M.slideMarks(d, s).length, note: notes[i + 2] || "", heading: slideTitle(lang, d, i + 2) }))) };
  });
  process.stdout.write(JSON.stringify(out), () => process.exit(0));
  return;
}

const ROOT = path.resolve(opt("--root") || path.join(__dirname, "..", ".."));
const ONLY = opt("--lecture");
const LANGS = ["en", "it"];
let bad = 0;
const fail = (m) => { bad++; console.log("FAIL " + m); };
let JSZip;
try { JSZip = require("jszip"); } catch (e) { console.log("FAIL jszip not found: run npm ci in tools/. The built decks cannot be checked."); process.exit(1); }

const dump = (l) => { const r = spawnSync(process.execPath, [__filename, "--dump", l], { encoding: "utf8", maxBuffer: 1 << 28 }); if (r.status) { console.error(r.stderr); process.exit(1); } return JSON.parse(r.stdout); };
const DECKS = Object.fromEntries(LANGS.map((l) => [l, dump(l).filter((d) => !ONLY || d.n === ONLY)]));

// well-formed XML: every element closed in order (enough to catch a truncated or edited part)
function wellFormed(xml) {
  const stack = [];
  for (const m of xml.replace(/<\?[^>]*\?>|<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>/g, "").matchAll(/<(\/?)([A-Za-z_][\w:.-]*)(?:\s[^>]*?)?(\/?)>/g)) {
    if (m[3]) continue;
    if (!m[1]) stack.push(m[2]);
    else if (stack.pop() !== m[2]) return false;
  }
  return stack.length === 0 && /^\s*(<\?xml[^>]*\?>\s*)?</.test(xml);
}
const unxml = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&");
const textOf = (xml) => unxml([...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join(""));
// the layout writes RISC-V with a non-breaking hyphen and may use typographic quotes: compare the letters
const squash = (s) => String(s).replace(/[\u2010\u2011\u2012\u2013]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[*`_]/g, "").replace(/\s+/g, "").toLowerCase();
const EMU = 914400;
const LAB = ["see", "qt", "qemu", "board", "trouble"];
const BADGE = /UNDERSTAND NOW|USE NOW|UNDERSTAND LATER|DA COMPRENDERE OGGI|DA UTILIZZARE OGGI|DA COMPRENDERE PIÙ AVANTI/g;

(async () => {
  const seen = {};
  let nd = 0, ns = 0;
  for (const l of LANGS) for (const d of DECKS[l]) {
    const f = path.join(ROOT, l, "slides", d.file + ".pptx"), rel = `${l}/slides/${d.file}.pptx`;
    if (!fs.existsSync(f)) { fail(`${rel}: not built`); continue; }
    let zip;
    try { zip = await JSZip.loadAsync(fs.readFileSync(f)); } catch (e) { fail(`${rel}: not a valid ZIP package (${e.message})`); continue; }
    const pres = zip.file("ppt/presentation.xml"), types = zip.file("[Content_Types].xml");
    if (!pres || !types) { fail(`${rel}: no presentation.xml or [Content_Types].xml`); continue; }
    const px = await pres.async("string");
    if (!wellFormed(px)) fail(`${rel}: presentation.xml is not well-formed`);
    const listed = (px.match(/<p:sldId /g) || []).length;
    if (listed !== d.slides.length) fail(`${rel}: ${listed} slides in the package, ${d.slides.length} expected from the specification`);
    nd++;
    for (let k = 1; k <= d.slides.length; k++) {
      const s = d.slides[k - 1], part = zip.file(`ppt/slides/slide${k}.xml`);
      if (!part) { fail(`${rel}: slide ${k} missing`); continue; }
      const xml = await part.async("string");
      if (!wellFormed(xml)) { fail(`${rel}: slide ${k} is not well-formed XML`); continue; }
      ns++;
      const txt = squash(textOf(xml));
      if (s.title && !txt.includes(squash(s.title))) fail(`${rel}: slide ${k} does not show its title "${s.title}"`);
      if (s.questions) for (const q of s.questions) if (!txt.includes(squash(q))) fail(`${rel}: slide ${k} does not show the question "${q}"`);
      // a badge is text + icon + colour (lib/mastery.js): count the labels, and the icons, pictures of 0.22 in at y = 0.14 in
      const marks = (textOf(xml).match(BADGE) || []).length;
      const icons = [...xml.matchAll(/<p:pic>[\s\S]*?<a:off x="\d+" y="(\d+)"\/>\s*<a:ext cx="(\d+)" cy="(\d+)"\/>/g)]
        .filter((m) => Math.abs(+m[1] - 0.14 * EMU) < 2000 && Math.abs(+m[3] - 0.22 * EMU) < 2000).length;
      if (k > 1 && marks !== s.badges) fail(`${rel}: slide ${k} shows ${marks} learning-status badge(s), ${s.badges} expected`);
      if (k > 1 && icons !== s.badges) fail(`${rel}: slide ${k} has ${icons} badge icon(s), ${s.badges} expected: the state must not be told by colour alone`);
      const np = zip.file(`ppt/notesSlides/notesSlide${k}.xml`);
      if (!np) fail(`${rel}: slide ${k} has no notes part`);
      else {
        const nx = await np.async("string");
        if (!wellFormed(nx)) fail(`${rel}: the notes of slide ${k} are not well-formed XML`);
        else if (s.note && !squash(textOf(nx)).includes(squash(s.note).slice(0, 60))) fail(`${rel}: slide ${k} does not carry its note from ${l}/notes/${d.file}.md`);
      }
    }
    if (d.kind === "code") {
      const gens = new Set(d.slides.map((s) => s.gen).filter(Boolean));
      const need = d.n === "23" ? ["trouble"] : LAB;       // Lecture 23 packages a bundle: its run guide is a hand-written exercise
      for (const g of need) if (!gens.has(g)) fail(`${rel}: no "${g}" slide: a student cannot check the laboratory without it`);
    }
    seen[`${d.n}:${d.kind}`] = seen[`${d.n}:${d.kind}`] || {};
    seen[`${d.n}:${d.kind}`][l] = d.slides.map((s) => `${s.t}/${s.gen || ""}/${s.badges}`);
  }
  for (const [k, v] of Object.entries(seen)) {
    if (!v.en || !v.it) { fail(`lecture ${k}: built in one language only`); continue; }
    if (v.en.length !== v.it.length) fail(`lecture ${k}: ${v.en.length} slides in English, ${v.it.length} in Italian`);
    else v.en.forEach((x, i) => { if (x !== v.it[i]) fail(`lecture ${k} slide ${i + 1}: English ${x}, Italian ${v.it[i]} (kind/generated/badges)`); });
  }
  const want = LANGS.reduce((a, l) => a + DECKS[l].length, 0);
  console.log(`check_pptx: ${nd}/${want} packages opened, ${ns} slides inspected under ${path.relative(process.cwd(), ROOT) || "."}; ${bad} failure(s)`);
  process.exit(bad || nd !== want ? 1 : 0);
})();
