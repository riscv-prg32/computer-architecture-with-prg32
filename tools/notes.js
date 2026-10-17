#!/usr/bin/env node
/*
 * Slide notes: ../<lang>/notes/<deck file>.md, one section per slide, for each of the two decks of a
 * lecture (the lecture deck and the code deck).
 *
 *   node notes.js            # check every deck of both languages
 *   node notes.js it 05      # only lecture 05, in Italian
 *   node notes.js --new en 05   # write an empty file with one heading per slide (never overwrites)
 *
 * A note starts with a heading "## Slide N" (or just "## N"); this tool rewrites every heading as
 * "## Slide N: <title of the slide>", taking the title from the deck, so the headings always match
 * the deck.  The notes of the slides that lib/lab.js generates in a code deck (its cover, the
 * complete program, the test guides) are generated too, and rewritten at every run.  The tool fails
 * if a slide has no note, if a note is empty, or if a note refers to a slide that does not exist.
 * build.js then copies each note into the notes pane of its slide.  The header of each file, also generated,
 * ends with the learning status of the lecture (lib/mastery.js): what to understand, what to use, what comes later;
 * then the roadmap (outcomes, what it builds on, the next lecture), the retrieval bridges and the closing thread
 * (lib/roadmap.js, from concepts/assessments.json and concepts/bridges.json).
 */
const fs = require("fs");
const { LANGS, STR, visible, notesFile, slideTitle, parseNotes, loadDecks } = require("./lib/lang");
const { NOTE } = require("./lib/lab");
const MASTERY = require("./lib/mastery");
const path = require("path");

const args = process.argv.slice(2), fresh = args[0] === "--new";
if (fresh) args.shift();
const langs = LANGS.includes(args[0]) ? [args.shift()] : LANGS, only = args[0];
if (langs.length > 1) {      // the specifications are loaded once per process: one child per language
  let bad = 0;
  for (const l of langs) bad += require("child_process").spawnSync(process.execPath, [__filename, ...(fresh ? ["--new"] : []), l, ...args], { stdio: "inherit" }).status ? 1 : 0;
  process.exit(bad ? 1 : 0);
}
const lang = langs[0], L = STR[lang];
const ROADMAP = require("./lib/roadmap");
let failed = 0, total = 0, words = 0, seen = 0;
const DECKS = loadDecks(lang), TITLES = Object.fromEntries(DECKS.map((d) => [d.n, d.lecture.title]));
for (const d of DECKS) {
  if (only && Number(d.n) !== Number(only)) continue;
  seen++;
  const f = notesFile(lang, d), vis = visible(d), n = vis.length + 1, rel = `${lang}/notes/${path.basename(f)}`;
  const gen = (k) => (k === 1 ? (d.kind === "code" ? NOTE[lang].cover(d) : null) : vis[k - 2].gen ? NOTE[lang][vis[k - 2].gen](d) : null);
  const head = `# ${L.lecture} ${d.n}: ${d.title}\n\n*${L.course}, ${L.year}. ${L.notesTitle}.* ${L.notesIntro}\n\n${MASTERY.summaryText(lang, d.lecture)}\n\n${ROADMAP.notesText(lang, d.lecture, TITLES)}\n`;
  if (fresh) {
    if (fs.existsSync(f)) { console.error(`${f} exists: not overwritten`); failed++; continue; }
    fs.writeFileSync(f, head + Array.from({ length: n }, (_, i) => `\n## Slide ${i + 1}: ${slideTitle(lang, d, i + 1)}\n\n${gen(i + 1) || ""}\n`).join(""));
    console.log(`${rel}  created, ${n} notes to write`);
    continue;
  }
  let notes;
  try { notes = parseNotes(lang, d); } catch (e) { console.error(`FAILED: ${e.message}`); failed++; continue; }
  if (!notes) { console.error(`MISSING ${rel}`); failed++; continue; }
  for (let k = 1; k <= n; k++) if (gen(k)) notes[k] = gen(k);
  const bad = [];
  for (let k = 1; k <= n; k++) if (!notes[k]) bad.push(`slide ${k} has no note`);
  for (const k of Object.keys(notes)) if (k < 1 || k > n) bad.push(`note for slide ${k}, but the deck has ${n} slides`);
  if (bad.length) { console.error(`FAILED ${rel}: ${bad.join("; ")}`); failed++; continue; }
  const text = head + Array.from({ length: n }, (_, i) => `\n## Slide ${i + 1}: ${slideTitle(lang, d, i + 1)}\n\n${notes[i + 1]}\n`).join("");
  if (text !== fs.readFileSync(f, "utf8")) fs.writeFileSync(f, text);
  const w = Object.values(notes).join(" ").split(/\s+/).length;
  total += n; words += w;
  console.log(`${rel}  ${n} notes, ${w} words`);
}
if (!seen) { console.error(`no lecture ${only}`); failed++; }
if (!fresh) console.log(`${lang}: ${total} notes, ${words} words${failed ? `, ${failed} deck(s) FAILED` : ""}`);
process.exit(failed ? 1 : 0);
