// Extracts quiz answers and glossaries from the deck specifications of a language into
// textbook/quiz_glossary.<lang>.json (read by gen_appendices.py).
//   node textbook/quiz_glossary.js [en|it]        (no language: both)
const fs = require("fs"), path = require("path");
const { LANGS, loadDecks } = require("../lib/lang");
const lang = process.argv[2];
if (!lang) {
  for (const l of LANGS) require("child_process").spawnSync(process.execPath, [__filename, l], { stdio: "inherit" });
} else {
  const out = loadDecks(lang).map((d) => ({ n: Number(d.n), title: d.title,
    quiz: d.slides.filter((s) => s.t === "quiz").map((s) => ({ q: s.a[0], opts: s.a[1], ans: s.a[2], why: s.a[3] || "" })),
    gloss: d.slides.filter((s) => s.t === "table" && /^Gloss/.test(s.a[0])).flatMap((s) => s.a[2].flatMap((r) => [[r[0], r[1]], [r[2], r[3]]])).filter((p) => p[0]) }));
  const f = path.resolve(__dirname, `quiz_glossary.${lang}.json`);
  fs.writeFileSync(f, JSON.stringify(out, null, 1));
  console.log(`${lang}: ${out.reduce((a, d) => a + d.quiz.length, 0)} questions, ${out.reduce((a, d) => a + d.gloss.length, 0)} glossary pairs -> ${path.basename(f)}`);
}
