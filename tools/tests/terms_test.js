#!/usr/bin/env node
// Every term of ../concepts/terms.json is explained where a beginner first meets it.  The course is read in order:
// lecture by lecture, the lecture deck and then the code deck, each slide with its note.  The first slide whose text
// or note uses the term must have a note that sets the term in italics, *like this*, in the sentence that defines it.
//   node tests/terms_test.js          (from tools/; one child process per language, as the specifications require)
const path = require("path");
const { LANGS, loadDecks, parseNotes, visible } = require("../lib/lang");
const { terms } = require("../concepts/terms.json");

const args = process.argv.slice(2);
if (!LANGS.includes(args[0])) {
  let bad = 0;
  for (const l of LANGS) bad += require("child_process").spawnSync(process.execPath, [__filename, l], { stdio: "inherit" }).status ? 1 : 0;
  process.exit(bad ? 1 : 0);
}
const lang = args[0];
const flat = (x) => typeof x === "string" ? x : Array.isArray(x) ? x.map(flat).join(" ") : x && typeof x === "object" ? Object.values(x).map(flat).join(" ") : "";
const italics = (note) => (note.match(/(?<![*\w])\*[^*\n]+\*(?![*\w])/g) || []).join(" ");
const word = (re) => new RegExp(`(?<![\\w-])(?:${re})(?![\\w-])`, "i");

const first = {};
for (const d of loadDecks(lang)) {
  const notes = parseNotes(lang, d) || {};
  const pages = [{ k: 1, text: "", note: notes[1] || "" }].concat(visible(d).map((s, i) => ({
    k: i + 2, text: s.t === "code" || s.t === "walk" ? flat([s.a[0], s.a[2], s.a[3]]) : flat(s.a), note: notes[i + 2] || "" })));
  for (const p of pages)
    for (const [t, re] of Object.entries(terms))
      if (!first[t] && word(re[lang]).test(p.text + " " + p.note)) first[t] = { where: `Lecture ${d.n}, ${d.kind === "main" ? "lecture" : "code"} deck, slide ${p.k}`, note: p.note };
}
let bad = 0;
for (const [t, re] of Object.entries(terms)) {
  const f = first[t];
  if (!f) { console.error(`FAIL ${lang} "${t}": never used`); bad++; continue; }
  if (!word(re[lang]).test(italics(f.note))) { console.error(`FAIL ${lang} "${t}": first used in ${f.where}, whose note does not define it (no *${t}* in italics)`); bad++; }
}
console.log(`terms ${lang}: ${Object.keys(terms).length} terms, ${bad ? `${bad} not defined at first use` : "each defined where it is first met"}`);
process.exit(bad ? 1 : 0);
