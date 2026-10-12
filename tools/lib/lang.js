/*
 * What depends on the language: the fixed strings of the layout engine, and the reading of the
 * tutorial notes in ../<lang>/notes.  English and Italian decks have the same slides in the same
 * order; code listings, and the Verm1 sources with their comments, are in English in both.
 */
const fs = require("fs");
const path = require("path");
const LANGS = ["en", "it"];
const STR = {
  en: {
    course: "ARC12 Computer Architecture", year: "A.Y. 2026/27", lecture: "Lecture", opening: "Opening",
    company: "University of Naples Parthenope", university: "University of Naples “Parthenope”",
    quiz: "Check your understanding", answer: "Answer", tryit: "TRY IT", expected: "Expected result",
    screenshot: "Screenshot: this step, built and run on PRG32", lecturer: "For the lecturer",
    notesTitle: "Slide notes", notesIntro: "One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.",
    verm1Credit: "Verm1 reference implementation contributed by Giuseppe Coviello",
    grid: { cols: "columns 0 ... 39   (x = column x 8)", title: "title line: 8 pixels", col: "column", row: "row", rows: "rows 0 ... 23   (y = row x 8 + 8)" },
  },
  it: {
    course: "ARC12 Architettura dei Calcolatori", year: "A.A. 2026/27", lecture: "Lezione", opening: "Apertura",
    company: "Università degli Studi di Napoli Parthenope", university: "Università degli Studi di Napoli “Parthenope”",
    quiz: "Verifica la comprensione", answer: "Risposta", tryit: "PROVA TU", expected: "Risultato atteso",
    screenshot: "Schermata: questo passo, compilato ed eseguito su PRG32", lecturer: "Per il docente",
    notesTitle: "Note alle slide", notesIntro: "Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.",
    verm1Credit: "Implementazione di riferimento di Verm1: contributo di Giuseppe Coviello",
    grid: { cols: "colonne 0 ... 39   (x = colonna x 8)", title: "riga del titolo: 8 pixel", col: "colonna", row: "riga", rows: "righe 0 ... 23   (y = riga x 8 + 8)" },
  },
};

const notesFile = (lang, deck) => path.resolve(__dirname, "..", "..", lang, "notes", `${deck.file}.md`);

// Title of slide k (1 = cover) as it appears in the heading of its note.
function slideTitle(lang, deck, k) {
  if (k === 1) return deck.title;
  const sl = deck.slides[k - 2], a = sl.a;
  if (sl.t === "quiz") return `${STR[lang].quiz}: ${a[0]}`;
  const t = typeof a[0] === "string" && a[0] ? a[0] : "(diagram)";
  return t.replace(/\s+/g, " ");
}

// Returns {slideNumber: text} or null when the deck has no notes file yet.
function parseNotes(lang, deck) {
  const f = notesFile(lang, deck);
  if (!fs.existsSync(f)) return null;
  const out = {}; let cur = null;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^## (?:Slide )?(\d+)\b/);
    if (m) { cur = Number(m[1]); if (out[cur]) throw new Error(`${f}: slide ${cur} has two notes`); out[cur] = []; }
    else if (/^# /.test(line)) cur = null;
    else if (cur != null) out[cur].push(line);
  }
  for (const k of Object.keys(out)) out[k] = out[k].join("\n").trim();
  return out;
}
// The same, as plain text for the notes pane of PowerPoint.
function readNotes(lang, deck) {
  const n = parseNotes(lang, deck);
  if (!n) return null;
  for (const k of Object.keys(n)) n[k] = n[k].replace(/`([^`]*)`/g, "$1").replace(/\*\*([^*]*)\*\*/g, "$1").replace(/\*([^*\n]+)\*/g, "$1").replace(/\n{3,}/g, "\n\n");
  return n;
}

// Loads the specifications of a language without building anything (for the tools that only read them).
function loadDecks(lang) {
  const mk = (t) => (...a) => ({ t, a });
  const api = {};
  for (const [k, t] of Object.entries({ T: "bullets", O: "ordered", C: "cards", S: "steps", K: "code", WK: "walk", V: "versus", G: "table", B: "big",
    DEF: "definition", X: "exercise", Q: "quiz", H: "section", I: "images", F: "flow", D: "draw" })) api[k] = mk(t);
  const decks = [];
  api.Deck = (d) => { decks.push(d); return d; };
  Object.assign(global, api, { P: new Proxy({}, { get: () => "000000" }), LANG: lang });
  const dir = path.resolve(__dirname, "..", "decks", lang);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".js")).sort()) require(path.join(dir, f));
  return decks;
}

module.exports = { LANGS, STR, notesFile, slideTitle, parseNotes, readNotes, loadDecks };
