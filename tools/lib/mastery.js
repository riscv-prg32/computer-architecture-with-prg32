/*
 * Learning status: what a student is expected to do with the content of a slide by the end of the lecture.
 *
 *   understand-now    UNDERSTAND NOW / DA COMPRENDERE OGGI          explain, trace and apply it on your own
 *   use-now           USE NOW / DA UTILIZZARE OGGI                  follow and use the recipe; the inside comes later, or never
 *   understand-later  UNDERSTAND LATER / DA COMPRENDERE PIÙ AVANTI  recognise the name and the purpose; a later lecture explains it
 *
 * The states are expectations in time, not levels of difficulty.  A slide without a badge is context:
 * a story, an example, a question, an exercise.
 *
 * What is marked where is data, kept apart from the drawing:
 *   ../concepts/registry.json   the concepts: stable ids, English and Italian labels, the lecture of first
 *                               exposure, of first use and of formal treatment, and the questions that check them
 *   ../decks/mastery.js         for each lecture, the slides of the specification that carry a status (same
 *                               numbering as decks/plan.js: the cover is 1), the same for both languages
 * This module reads both, resolves the badges of each built deck, draws them (build.js) and writes the
 * sentences of the notes, the notes headers (notes.js) and the boxes of the textbook (textbook/export_listings.js).
 * textbook/check_mastery.js checks the data.
 */
const fs = require("fs");
const path = require("path");

const REGISTRY = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "concepts", "registry.json"), "utf8"));
const CONCEPTS = REGISTRY.concepts;
const PLAN = require("../decks/mastery");

// Short names used in decks/mastery.js, and the three states in their canonical order.
const SHORT = { now: "understand-now", use: "use-now", later: "understand-later" };
const ORDER = ["understand-now", "use-now", "understand-later"];

// Style tokens.  fg on bg passes WCAG AA for small bold text (check_mastery.js computes the ratios); the bar
// and the icon repeat the state in shape, so colour is never the only cue: solid bar and book, double bar and
// wrench, dotted bar and clock.
const STYLE = {
  "understand-now": { fg: "075985", bg: "E0F2FE", bar: "0369A1", line: "solid", icon: "book" },
  "use-now": { fg: "92400E", bg: "FEF3C7", bar: "B45309", line: "double", icon: "wrench" },
  "understand-later": { fg: "6B21A8", bg: "F3E8FF", bar: "7E22CE", line: "dotted", icon: "clock" },
};

const LABEL = {
  en: { "understand-now": "UNDERSTAND NOW", "use-now": "USE NOW", "understand-later": "UNDERSTAND LATER",
    lecture: "Lecture", lectures: "Lectures", status: "Learning status", recap: "Learning status, recap",
    none: "nothing", noBadge: "A slide without a badge is context: a story, an example, a question, an exercise.",
    meaning: {
      "understand-now": "by the end of this lecture you explain it, trace it and apply it on your own",
      "use-now": "you follow and use the recipe today; how it works inside is explained later, or is not part of the course",
      "understand-later": "recognise the name and what it is for; a later lecture explains it",
    },
    slide: "Learning status of this slide", studied: (l) => `studied in Lecture ${l}`, operational: "used, not studied, in this course", tools: "and, used without being studied in this course,",
    deck: "Learning status of this lecture" },
  it: { "understand-now": "DA COMPRENDERE OGGI", "use-now": "DA UTILIZZARE OGGI", "understand-later": "DA COMPRENDERE PIÙ AVANTI",
    lecture: "Lezione", lectures: "Lezioni", status: "Stato di apprendimento", recap: "Stato di apprendimento, riepilogo",
    none: "niente", noBadge: "Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.",
    meaning: {
      "understand-now": "alla fine di questa lezione lo spiegate, lo seguite passo passo e lo applicate da soli",
      "use-now": "oggi seguite e usate la ricetta; come funziona dentro si spiega più avanti, o non fa parte del corso",
      "understand-later": "riconoscete il nome e lo scopo; lo spiega una lezione successiva",
    },
    slide: "Stato di apprendimento di questa slide", studied: (l) => `si studia nella Lezione ${l}`, operational: "si usa, non si studia, in questo corso", tools: "e, usati senza essere studiati nel corso,",
    deck: "Stato di apprendimento di questa lezione" },
};

// "now asm.register,abi.call-args" -> { state, concepts }
function parseMark(text, where) {
  const m = String(text).trim().match(/^(\S+)\s+(\S+)$/);
  if (!m) throw new Error(`${where}: a mark is "<state> <concept>[,<concept>...]", not "${text}"`);
  const state = SHORT[m[1]] || m[1];
  if (!STYLE[state]) throw new Error(`${where}: unknown state "${m[1]}" (allowed: ${Object.keys(SHORT).join(", ")})`);
  const concepts = m[2].split(",");
  for (const c of concepts) if (!CONCEPTS[c]) throw new Error(`${where}: unknown concept "${c}" (add it to concepts/registry.json)`);
  return { state, concepts };
}

// The marks of a lecture, by slide of the specification: { k: [mark, mark?] }.  Keys are "k" or "k-m".
function lectureMarks(n, nSlides) {
  const p = PLAN.lectures[n] || {}, out = {};
  for (const [key, v] of Object.entries(p)) {
    if (key === "program" || key === "review") continue;
    const r = key.match(/^(\d+)(?:-(\d+))?$/);
    if (!r) throw new Error(`decks/mastery.js lecture ${n}: bad key "${key}"`);
    const a = +r[1], b = r[2] ? +r[2] : a;
    if (b < a || a < 2 || (nSlides && b > nSlides)) throw new Error(`decks/mastery.js lecture ${n}: no slides ${key}`);
    const marks = (Array.isArray(v) ? v : [v]).map((t) => parseMark(t, `decks/mastery.js lecture ${n} slide ${key}`));
    if (marks.length > 2) throw new Error(`decks/mastery.js lecture ${n} slide ${key}: at most two badges per slide`);
    for (let k = a; k <= b; k++) {
      if (out[k]) throw new Error(`decks/mastery.js lecture ${n}: slide ${k} is marked twice`);
      out[k] = { marks, range: a !== b };
    }
  }
  return out;
}

// The lecture a badge points to, if any: the formal treatment of its concepts, when it comes after lecture n.
function destinations(n, mark) {
  return [...new Set(mark.concepts.map((c) => CONCEPTS[c].formal).filter((f) => f && +f > +n))].sort();
}

function chipText(lang, n, mark) {
  const L = LABEL[lang], d = destinations(n, mark);
  const what = mark.concepts.length > 2 ? "" : CONCEPTS[mark.concepts[0]].label[lang];
  const to = mark.state === "understand-now" || !d.length ? "" : d.length === 1 ? `${L.lecture} ${d[0]}` : `${L.lectures} ${d[0]}–${d[d.length - 1]}`;
  return { head: L[mark.state], what, to };
}

// One sentence per badge, for the notes of a slide.
function sentence(lang, n, mark) {
  const L = LABEL[lang];
  const items = mark.concepts.map((c) => {
    const k = CONCEPTS[c], f = k.formal, extra = mark.state === "understand-now" ? "" : f && +f > +n ? ` (${L.studied(f)})` : !f ? ` (${L.operational})` : "";
    return k.label[lang] + extra;
  });
  return `${L[mark.state]}: ${items.join("; ")}.`;
}

// The badges of the slides of a built deck (lab.js keeps in src the slides of the specification each one comes from).
const GEN = { qt: "use tool.prg32-cli", qemu: "use tool.prg32-cli", board: "use tool.prg32-cli", vec: "use tool.prg32-cli", trouble: "use tool.prg32-cli" };
function slideMarks(deck, sl) {
  const n = deck.n;
  if (sl.gen) {
    const t = sl.gen === "page" ? (PLAN.lectures[n] || {}).program : GEN[sl.gen];
    return t ? [parseMark(t, `decks/mastery.js lecture ${n} program`)] : [];
  }
  if (!sl.src || sl.src.length !== 1) return [];      // two questions on one slide: no badge
  const m = lectureMarks(n)[sl.src[0]];
  return m ? m.marks : [];
}

// Summary of a whole lecture: { state: [concept ids] } in the order of first appearance, with destinations.
function summary(lecture) {
  const marks = lectureMarks(lecture.n, lecture.slides.length + 1), out = { "understand-now": [], "use-now": [], "understand-later": [] };
  const p = PLAN.lectures[lecture.n] || {};
  const all = Object.keys(marks).map(Number).sort((a, b) => a - b).flatMap((k) => marks[k].marks);
  if (p.program) all.push(parseMark(p.program, "program"));
  all.push(parseMark(GEN.qt, "generated slides"));   // every code deck ends with the commands for the three hosts
  for (const m of all) for (const c of m.concepts) if (!out[m.state].includes(c)) out[m.state].push(c);
  // a concept understood today is not also listed as used or deferred
  out["use-now"] = out["use-now"].filter((c) => !out["understand-now"].includes(c));
  out["understand-later"] = out["understand-later"].filter((c) => !out["understand-now"].includes(c) && !out["use-now"].includes(c));
  return out;
}

function summaryText(lang, lecture, recap) {
  const L = LABEL[lang], s = summary(lecture), n = lecture.n;
  const lines = ORDER.map((st) => {
    const lbl = (c) => CONCEPTS[c].label[lang], f = (c) => CONCEPTS[c].formal;
    const later = (c) => f(c) && +f(c) > +n;
    let items = s[st].map((c) => lbl(c) + (st !== "understand-now" && later(c) ? ` (${L.lecture} ${f(c)})` : ""));
    if (st === "use-now") {   // the tools that the course never studies, once, at the end
      const tools = s[st].filter((c) => !f(c));
      items = s[st].filter((c) => f(c)).map((c) => lbl(c) + (later(c) ? ` (${L.lecture} ${f(c)})` : ""));
      if (tools.length) items.push(items.length ? `${L.tools} ${tools.map(lbl).join(", ")}` : `${tools.map(lbl).join(", ")} (${L.operational})`);
    }
    return `${L[st]}: ${items.length ? items.join("; ").replace(/; (and|e), /, " $1, ") : L.none}.`;
  });
  return `${recap ? L.recap : L.deck}. ${lines.join(" ")} ${L.noBadge}`;
}

// ---- drawing (pptxgenjs) ----------------------------------------------------------------------------------------
const ICON = {
  book: (c) => `<path d="M2 5.5c3.2-1.6 6.4-1.4 9.4 0.8V20c-3-2-6.2-2.2-9.4-0.8z M22 5.5c-3.2-1.6-6.4-1.4-9.4 0.8V20c3-2 6.2-2.2 9.4-0.8z" fill="#${c}"/>`,
  wrench: (c, bg) => `<g transform="rotate(45 12 12)"><rect x="10.1" y="8" width="3.8" height="15" rx="1.6" fill="#${c}"/><circle cx="12" cy="6.2" r="5.6" fill="#${c}"/><rect x="10.3" y="-0.5" width="3.4" height="6.4" fill="#${bg}"/></g>`,
  clock: (c) => `<circle cx="12" cy="12" r="9.2" fill="none" stroke="#${c}" stroke-width="2.6"/><path d="M12 6.5V12l3.8 2.6" fill="none" stroke="#${c}" stroke-width="2.6" stroke-linecap="round"/>`,
};
const icons = {};
async function loadIcons(sharp) {
  for (const [st, s] of Object.entries(STYLE)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">${ICON[s.icon](s.fg, s.bg)}</svg>`;
    icons[st] = "image/png;base64," + (await sharp(Buffer.from(svg), { density: 300 }).resize(96, 96).png().toBuffer()).toString("base64");
  }
}

const FS = 11, H_CHIP = 0.3, Y_CHIP = 0.1;
// Calibri at 11 pt: about 0.62 em for bold capitals, 0.47 em for lower case, 0.53 em for bold mixed case.
const textW = (s, k) => s.length * k * FS / 72;
function chipWidth(c) { return 0.52 + textW(c.head, 0.62) + (c.what ? textW(" · " + c.what, 0.47) : 0) + (c.to ? textW(" → " + c.to, 0.53) : 0) + 0.1; }

// Draws one badge with its right edge at xr; returns its width.
function drawChip(pres, s, xr, c, st) {
  const S = STYLE[st], w = chipWidth(c), x = xr - w, y = Y_CHIP, h = H_CHIP;
  // the border and the left bar repeat the state in shape: solid and solid, solid and double, dashed and dotted
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: S.bg }, line: { color: S.bar, width: 1, dashType: S.line === "dotted" ? "dash" : "solid" } });
  const bar = (bx, by, bw, bh) => s.addShape(pres.ShapeType.rect, { x: bx, y: by, w: bw, h: bh, fill: { color: S.bar }, line: { color: S.bar, width: 0 } });
  if (S.line === "solid") bar(x, y, 0.08, h);
  else if (S.line === "double") { bar(x, y, 0.03, h); bar(x + 0.06, y, 0.03, h); }
  else for (let i = 0; i < 3; i++) bar(x + 0.03, y + 0.04 + i * 0.085, 0.05, 0.05);
  s.addImage({ data: icons[st], x: x + 0.14, y: y + 0.04, w: 0.22, h: 0.22 });
  const runs = [{ text: c.head, options: { bold: true } }];
  if (c.what) runs.push({ text: " · " + c.what });
  if (c.to) runs.push({ text: " → " + c.to, options: { bold: true } });
  s.addText(runs, { isTextBox: true, x: x + 0.42, y, w: w - 0.46, h, margin: 0, fontFace: "Calibri", fontSize: FS, color: S.fg, valign: "middle", fit: "none" });
  return w;
}

// The badges of one slide, right-aligned in the band above the title.
function drawSlide(pres, s, lang, n, marks, right, maxW, where) {
  const chips = marks.map((m) => ({ c: chipText(lang, n, m), st: m.state }));
  const total = chips.reduce((a, k) => a + chipWidth(k.c), 0) + 0.12 * (chips.length - 1);
  if (total > maxW) throw new Error(`${where}: the badges are too wide (${total.toFixed(1)} in): shorten the labels in concepts/registry.json`);
  let xr = right;
  for (let i = chips.length - 1; i >= 0; i--) xr -= drawChip(pres, s, xr, chips[i].c, chips[i].st) + 0.12;
}

// The legend on the cover: the three states, without a concept.
function drawLegend(pres, s, lang, right) {
  let xr = right;
  for (const st of [...ORDER].reverse()) xr -= drawChip(pres, s, xr, { head: LABEL[lang][st] }, st) + 0.12;
}

function legendText(lang) {
  const L = LABEL[lang];
  return `${L.status}: ${ORDER.map((st) => `${L[st]}, ${L.meaning[st]}`).join("; ")}. ${L.noBadge}`;
}

module.exports = { REGISTRY, CONCEPTS, PLAN, SHORT, ORDER, STYLE, LABEL, parseMark, lectureMarks, destinations, chipText, chipWidth, sentence,
  slideMarks, summary, summaryText, legendText, loadIcons, drawSlide, drawLegend };
