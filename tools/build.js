#!/usr/bin/env node
/*
 * Slide-deck generator for ARC12 - Computer Architecture (A.Y. 2026/27).
 *
 *   npm install && node build.js        # build every deck, English and Italian
 *   node build.js it                    # only the Italian decks
 *   node build.js en 03                 # only lecture 03, in English
 *
 * Deck content lives in decks/<lang>/*.js as compact slide specifications, one per lecture.
 * Two decks are built from each: the lecture deck, of at most 20 slides, and the code deck
 * (decks/plan.js says which slide goes where, lib/lab.js adds the program of the lecture and
 * the test guides).  This file turns each deck into a 16:9 .pptx with pptxgenjs.  The look is the
 * one of the "Playing with RISC-V" (PRG32 textbook) decks, so course slides and
 * lab slides read as one family.  Text is measured before it is placed: a slide
 * whose text cannot fit at a readable size fails the build instead of shipping
 * overflowing text.
 *
 * The decks are written to ../<lang>/slides.  If ../<lang>/notes holds the notes
 * of a deck (one section "## Slide N" per slide, see notes.js), each note goes
 * into the notes pane of its slide, before the lecturer's remarks of the
 * specification; a slide without a note then fails the build.
 */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

const { LANGS, STR, readNotes } = require("./lib/lang");
const LANG = LANGS.includes(process.argv[2]) ? process.argv[2] : null;
const L = STR[LANG || "en"];
global.LANG = LANG || "en";

const ASSETS = path.resolve(__dirname, "assets");
const OUT = path.resolve(__dirname, "..", global.LANG, "slides");

// ---- palette (the PRG32 textbook's own colours) ----------------------------
const P = {
  ink: "1B2530", steel: "2E4A62", teal: "0E7C86", amber: "C7791B",
  red: "B23A48", green: "2F7D4F", violet: "6B4FA0", plum: "A03A8A",
  panel: "EEF2F4", rule: "C9D2D8", white: "FFFFFF", mute: "5B6B78",
  code: "12202B", codeText: "E6EDF2", codeComment: "8FB3A0", ice: "CFE3EA",
  tealSoft: "D8ECEE", amberSoft: "F6E7D2", greenSoft: "DCEEE3", redSoft: "F3DDE0", violetSoft: "E6E0F1",
};
const TINTS = [P.teal, P.amber, P.violet, P.green, P.red, P.steel];
const HEAD = "Cambria", BODY = "Calibri", MONO = "Courier New";
const CREDITS = Object.fromEntries(require("./assets/credits.json").map((c) => [c.file, c]));
const W = 13.333, H = 7.5, MX = 0.6, TOP = 1.55, BOT = 6.75, CW = W - 2 * MX;
const COURSE = L.course, YEAR = L.year;

// ---- slide constructors used by the deck files -----------------------------
const mk = (t) => (...a) => ({ t, a });
const api = {
  T: mk("bullets"),   // T(title, [items], note?, side?)  item: "text" | ["text", ["sub", ...]];  side: {big, label} | {img, cap} | {code}
  O: mk("ordered"),   // O(title, [items], note?)                     numbered list
  C: mk("cards"),     // C(title, [[head, body], ...], note?)
  S: mk("steps"),     // S(title, [[head, body], ...], note?)
  K: mk("code"),      // K(title, code, [callouts], note?, lang?, {wide}?)
  WK: mk("walk"),     // WK(title, code, image, caption, note?)       code + real screenshot
  V: mk("versus"),    // V(title, [head, [items]], [head, [items]], note?)
  G: mk("table"),     // G(title, [headers], [[cells]...], note?, {widths, mono, fs, caption})
  B: mk("big"),       // B(statement, sub?, note?)
  DEF: mk("definition"), // DEF(title, term, definition, [bullets]?, note?)
  X: mk("exercise"),  // X(title, [tasks], expected, note?)
  Q: mk("quiz"),      // Q(question, [options], answerIndex, explanation)
  H: mk("section"),   // H(title, sub?)
  I: mk("images"),    // I(title, [[file, caption], ...], note?, text?)
  F: mk("flow"),      // F(title, ["Head|sub", ...], caption?, note?)
  D: mk("draw"),      // D(title, async (s, h) => {...}, note?)       bespoke diagram
};
let decks = [];
api.Deck = (d) => { decks.push(d); return d; };
Object.assign(global, api, { P });

// ---- text measurement ------------------------------------------------------
function linesFor(text, wIn, fsPt, mono, bold) {
  const cw = (mono ? 0.6 : bold ? 0.54 : 0.5) * fsPt / 72;
  const cpl = Math.max(4, Math.floor(wIn / cw));
  let n = 0;
  for (const para of String(text).split("\n")) {
    let line = 0, c = 0;
    for (const word of para.split(" ")) {
      if (c > 0 && c + 1 + word.length > cpl) { line++; c = 0; }
      c += (c > 0 ? 1 : 0) + word.length;
      while (c > cpl) { line++; c -= cpl; }
    }
    n += line + 1;
  }
  return n;
}
const heightFor = (text, w, fsz, mono, bold) => linesFor(text, w, fsz, mono, bold) * fsz * 1.22 / 72;
let WHERE = "";
function fit(text, w, h, max, min, mono, bold) {
  for (let s = max; s >= min; s -= 1) if (heightFor(text, w, s, mono, bold) <= h) return s;
  throw new Error(`${WHERE}: text does not fit (${w.toFixed(1)}x${h.toFixed(1)}in at ${min}pt): "${String(text).slice(0, 70)}"`);
}

// ---- assets ----------------------------------------------------------------
const DIM = {};
async function loadDims() {
  for (const f of fs.readdirSync(ASSETS)) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue;
    const m = await sharp(path.join(ASSETS, f)).metadata();
    DIM[f] = { w: m.width, h: m.height };
  }
}
function contain(file, x, y, w, h, align) {
  const d = DIM[file]; if (!d) throw new Error(`${WHERE}: unknown asset ${file}`);
  const r = Math.min(w / d.w, h / d.h), iw = d.w * r, ih = d.h * r;
  const ax = align === "left" ? x : align === "right" ? x + w - iw : x + (w - iw) / 2;
  return { path: path.join(ASSETS, file), x: ax, y: y + (h - ih) / 2, w: iw, h: ih };
}

function commentAt(line, lang) {
  if (lang === "asm") return line.indexOf("#");
  if (lang === "sh") { const i = line.search(/(^|\s)#/); return i; }
  if (lang === "txt") return -1;
  const a = line.indexOf("//"), b = line.indexOf("/*");
  if (a < 0) return b; if (b < 0) return a; return Math.min(a, b);
}

async function build(deck) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Raffaele Montella";
  pres.company = L.company;
  pres.title = `${COURSE} - ${deck.title}`;
  pres.subject = `${L.lecture} ${deck.n}`;
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
  const ACC = P.teal, BASE = 20, MIN = 14;
  const footer = `${COURSE}  |  ${L.lecture} ${deck.n}: ${deck.short || deck.title}  |  ${YEAR}`;

  pres.defineSlideMaster({
    title: "LIGHT", background: { color: P.white },
    objects: [
      { text: { text: footer, options: { x: MX, y: 7.02, w: 10.5, h: 0.3, fontFace: BODY, fontSize: 10, color: P.mute, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.4, w: CW, h: 0.95, fontFace: HEAD, fontSize: 32, bold: true, color: P.steel, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: W - MX - 0.7, y: 7.02, w: 0.7, h: 0.3, fontFace: BODY, fontSize: 10, color: P.mute, align: "right" },
  });
  pres.defineSlideMaster({ title: "DARK", background: { color: P.ink },
    slideNumber: { x: W - MX - 0.7, y: 7.02, w: 0.7, h: 0.3, fontFace: BODY, fontSize: 10, color: P.ice, align: "right" } });

  let section = L.opening;
  pres.addSection({ title: section });
  let secNo = 0, count = 0, pendingSection = null;
  // A section of the PowerPoint file begins with the first slide that follows its mark.
  const openSection = () => { if (pendingSection) { section = pendingSection; pres.addSection({ title: section }); pendingSection = null; } };
  const pending = [];

  const tx = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: BODY, color: P.ink, valign: "top" }, o));
  const light = (title) => {
    openSection();
    const s = pres.addSlide({ masterName: "LIGHT", sectionTitle: section });
    if (title.length > 60) throw new Error(`${WHERE}: title too long (${title.length}): ${title}`);
    s.addText(title, { placeholder: "title", fontSize: title.length > 46 ? 27 : 32 });
    count++; return s;
  };
  const dark = () => { openSection(); count++; return pres.addSlide({ masterName: "DARK", sectionTitle: section }); };
  const rect = (s, x, y, w, h, fill, line) => s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: fill }, line: { color: line || fill, width: line ? 0.75 : 0 } });
  const pixels = (s, x, y, sz, cols) => cols.forEach((c, i) => c && rect(s, x + (i % 3) * sz, y + Math.floor(i / 3) * sz, sz * 0.92, sz * 0.92, c));
  const badge = (s, x, y, d, label, color) => s.addText(String(label), { isTextBox: true, shape: pres.ShapeType.roundRect, rectRadius: 0.08,
    x, y, w: d, h: d, fill: { color }, line: { color, width: 0 }, color: P.white, bold: true, fontFace: BODY,
    fontSize: Math.round(d * 34), align: "center", valign: "middle", margin: 0 });
  const card = (s, x, y, w, h, fill) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08,
    fill: { color: fill || P.panel }, line: { color: fill || P.panel, width: 0 } });
  const pill = (s, text, x, y, w, h, color, fs) => s.addText(text, { isTextBox: true, shape: pres.ShapeType.roundRect, rectRadius: 0.08, x, y, w, h,
    fill: { color }, line: { color, width: 0 }, color: P.white, bold: true, fontFace: BODY, fontSize: fs || fit(text, w - 0.3, h, 19, 12, false, true), align: "center", valign: "middle", margin: 0 });
  const arrow = (s, x1, y1, x2, y2, color, width) => s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1, line: { color: color || P.mute, width: width || 1.5, endArrowType: "triangle" } });
  const line = (s, x1, y1, x2, y2, color, width, dash) => s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1, line: { color: color || P.mute, width: width || 1.25, dashType: dash || "solid" } });
  // A picture taken from Wikimedia Commons is credited in the notes of its slide (assets/credits.json).
  const pics = new Map();
  const img = (s, file, x, y, w, h, align) => { if (CREDITS[file]) pics.set(file, CREDITS[file]); return s.addImage(contain(file, x, y, w, h, align)); };
  // Notes pane: the tutorial note of ../<lang>/notes (if the deck has them), then the lecturer's remarks.
  const tutorial = readNotes(global.LANG, deck);
  const notes = (s, n) => {
    const t = tutorial && tutorial[count];
    if (tutorial && !t) throw new Error(`${WHERE}: no note for slide ${count} in ${global.LANG}/notes`);
    const cr = [...pics.values()].map((c) => `${c.title}, ${c.author}, ${c.licence}, Wikimedia Commons`); pics.clear();
    const text = [t, n ? (t ? `${L.lecturer}: ${n}` : n) : null, cr.length ? `${L.pictures}: ${cr.join("; ")}.` : null].filter(Boolean).join("\n\n");
    if (text) s.addNotes(text);
  };

  // Unordered or ordered rows.  item: "text" | ["text", ["sub", ...]]
  const rows = (s, items, x, y, w, h, mode) => {
    const n = items.length, gapMin = 0.14;
    const norm = items.map((it) => (Array.isArray(it) ? { t: it[0], sub: it[1] || [] } : { t: it, sub: [] }));
    const d = mode === "num" ? 0.44 : 0.16, pad = mode === "num" ? 0.28 : 0.26, tw = w - d - pad;
    const full = (it, f) => Math.max(mode === "num" ? d + 0.04 : 0, heightFor(it.t, tw, f) + it.sub.reduce((a, sb) => a + heightFor("– " + sb, tw - 0.2, f - 3) + 0.04, 0));
    const total = (f) => norm.reduce((a, it) => a + full(it, f), 0) + gapMin * (n - 1);
    let fsz = n <= 4 ? 24 : 22;
    while (fsz > MIN && total(fsz) > h) fsz--;
    if (total(fsz) > h + 0.02) throw new Error(`${WHERE}: list does not fit: "${norm[0].t.slice(0, 60)}"`);
    const gap = n > 1 ? Math.min(0.5, gapMin + (h - total(fsz)) / (n - 1)) : 0;
    let yy = y + Math.min(0.2, Math.max(0, (h - (total(fsz) - gapMin * (n - 1)) - gap * (n - 1)) / 2));
    norm.forEach((it, i) => {
      const th = full(it, fsz), lh = fsz * 1.22 / 72, one = heightFor(it.t, tw, fsz) <= lh + 0.01 && !it.sub.length;
      if (mode === "num") badge(s, x, yy + 0.02, d, i + 1, ACC);
      else rect(s, x, yy + lh / 2 - d / 2 + 0.01, d, d, i % 2 ? P.amber : ACC);
      const runs = [{ text: it.t, options: { fontSize: fsz, color: P.ink, breakLine: it.sub.length > 0 } }];
      it.sub.forEach((sb, k) => runs.push({ text: "– " + sb, options: { fontSize: fsz - 3, color: P.mute, breakLine: k < it.sub.length - 1 } }));
      const single = mode === "num" && one;
      tx(s, runs, { x: x + d + pad, y: yy, w: tw, h: single ? d + 0.04 : th, valign: single ? "middle" : "top", paraSpaceAfter: 2 });
      yy += th + gap;
    });
  };

  const codeBox = (s, text, x, y, w, h, lang, maxFs) => {
    const lines = String(text).replace(/\t/g, "    ").replace(/\s+$/, "").split("\n");
    const longest = Math.max(...lines.map((l) => l.length));
    let fsz = maxFs || 18;
    while (fsz > 10 && (lines.length * fsz * 1.2 / 72 > h - 0.4 || longest * fsz * 0.612 / 72 > w - 0.5)) fsz -= 0.5;
    if (lines.length * fsz * 1.2 / 72 > h - 0.4 || longest * fsz * 0.612 / 72 > w - 0.5)
      throw new Error(`${WHERE}: listing too large (${lines.length} lines, ${longest} cols)`);
    card(s, x, y, w, h, P.code);
    const runs = [];
    lines.forEach((l, i) => {
      const c = commentAt(l, lang || "asm"), last = i === lines.length - 1;
      const a = c < 0 ? l : l.slice(0, c), b = c < 0 ? "" : l.slice(c);
      if (b) { if (a) runs.push({ text: a, options: { color: P.codeText } }); runs.push({ text: b, options: { color: P.codeComment, breakLine: !last } }); }
      else runs.push({ text: a || "\u00A0", options: { color: P.codeText, breakLine: !last } });
    });
    s.addText(runs, { isTextBox: true, x: x + 0.25, y: y + 0.2, w: w - 0.5, h: h - 0.4, fontFace: MONO, fontSize: fsz, margin: 0, valign: "top", paraSpaceAfter: 0 });
    return fsz;
  };

  // Native table.  opts: {fs, mono:[cols], hi:{row:color}, head:false, align, bold0, rowH}
  const table = (s, x, y, colW, head, body, o = {}) => {
    const fsz = o.fs || 16, mono = o.mono || [];
    const cell = (t, extra, i) => ({ text: String(t), options: Object.assign({ fontFace: mono.includes(i) ? MONO : BODY, fontSize: fsz, color: P.ink,
      valign: "middle", align: o.align || "left", margin: o.margin || [3, 7, 3, 7] }, extra) });
    const data = [];
    if (head) data.push(head.map((h, i) => cell(h, { bold: true, color: P.white, fill: { color: o.headColor || P.steel }, fontFace: BODY }, -1)));
    body.forEach((r, k) => data.push(r.map((c, i) => {
      const hi = o.hi && o.hi[k], cellHi = o.cellHi && o.cellHi[`${k},${i}`];
      return cell(c, { fill: { color: cellHi || hi || (k % 2 ? P.white : P.panel) }, bold: o.bold0 !== false && i === 0 && !mono.includes(0) }, i);
    })));
    const opt = { x, y, w: colW.reduce((a, b) => a + b, 0), colW, border: { type: "solid", color: P.rule, pt: 0.5 } };
    if (o.rowH) opt.rowH = o.rowH;
    s.addTable(data, opt);
  };

  // Bit-field strip: fields [{n, label, value, color}] from MSB to LSB.
  const bits = (s, x, y, w, fields, o = {}) => {
    const total = fields.reduce((a, f) => a + f.n, 0), h = o.h || 0.7, minW = o.minW || 0.55;
    let ws = fields.map((f) => Math.max(minW, w * f.n / total));
    const k = w / ws.reduce((a, b) => a + b, 0); ws = ws.map((v) => v * k);
    let xx = x, bit = total;
    fields.forEach((f, i) => {
      const col = f.color || TINTS[i % 6];
      s.addText(String(f.value == null ? "" : f.value), { isTextBox: true, shape: pres.ShapeType.rect, x: xx, y, w: ws[i], h, fill: { color: col }, line: { color: P.white, width: 1.5 },
        color: P.white, bold: true, fontFace: MONO, fontSize: o.fs || fit(String(f.value || ""), ws[i] - 0.1, h, 18, 9, true), align: "center", valign: "middle", margin: 0 });
      if (f.label) tx(s, f.label, { x: xx, y: y + h + 0.06, w: ws[i], h: 0.55, fontSize: o.labelFs || 13, color: P.ink, align: "center" });
      if (o.index !== false) {
        const hi = bit - 1, lo = bit - f.n;
        tx(s, f.n === 1 ? String(hi) : `${hi}`, { x: xx + 0.04, y: y - 0.26, w: ws[i] / 2, h: 0.24, fontSize: 10.5, color: P.mute, fontFace: MONO });
        if (f.n > 1) tx(s, `${lo}`, { x: xx + ws[i] / 2, y: y - 0.26, w: ws[i] / 2 - 0.04, h: 0.24, fontSize: 10.5, color: P.mute, fontFace: MONO, align: "right" });
      }
      xx += ws[i]; bit -= f.n;
    });
  };

  // Memory strip: cells [{addr, val, label, color}] laid out horizontally.
  const mem = (s, x, y, cw, cells, o = {}) => {
    const h = o.h || 0.62;
    cells.forEach((c, i) => {
      const xx = x + i * cw;
      s.addText(String(c.val), { isTextBox: true, shape: pres.ShapeType.rect, x: xx, y, w: cw, h, fill: { color: c.color || P.panel }, line: { color: P.steel, width: 1 },
        color: c.color ? P.white : P.ink, bold: true, fontFace: MONO, fontSize: o.fs || 16, align: "center", valign: "middle", margin: 0 });
      if (c.addr != null) tx(s, String(c.addr), { x: xx, y: y - 0.27, w: cw, h: 0.25, fontSize: 10.5, color: P.mute, fontFace: MONO, align: "center" });
      if (c.label != null) tx(s, String(c.label), { x: xx, y: y + h + 0.04, w: cw, h: 0.3, fontSize: o.labelFs || 13, color: P.ink, align: "center", fontFace: o.labelMono ? MONO : BODY });
    });
  };

  // Karnaugh map.  o: {rowVar, colVar, rowLabels, colLabels, vals[r][c], loops:[{r,c,rs,cs,color}]}
  const kmap = (s, x, y, cell, o) => {
    const R = o.rowLabels.length, Cn = o.colLabels.length, lx = x + 0.75, ly = y + 0.7;
    tx(s, o.colVar, { x: lx, y: y - 0.02, w: Cn * cell, h: 0.32, fontSize: 15, bold: true, color: P.steel, align: "center" });
    tx(s, o.rowVar, { x: x - 0.1, y: ly, w: 0.42, h: R * cell, fontSize: 15, bold: true, color: P.steel, align: "center", valign: "middle" });
    o.colLabels.forEach((l, c) => tx(s, l, { x: lx + c * cell, y: y + 0.34, w: cell, h: 0.32, fontSize: 14, fontFace: MONO, color: P.mute, align: "center" }));
    o.rowLabels.forEach((l, r) => tx(s, l, { x: x + 0.3, y: ly + r * cell, w: 0.42, h: cell, fontSize: 14, fontFace: MONO, color: P.mute, align: "center", valign: "middle" }));
    for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
      const v = o.vals[r][c];
      s.addText(String(v), { isTextBox: true, shape: pres.ShapeType.rect, x: lx + c * cell, y: ly + r * cell, w: cell, h: cell, fill: { color: v === 1 || v === "1" ? P.tealSoft : v === "x" || v === "-" ? P.amberSoft : P.white },
        line: { color: P.steel, width: 1 }, color: P.ink, bold: v !== 0, fontFace: MONO, fontSize: Math.round(cell * 26), align: "center", valign: "middle", margin: 0 });
    }
    (o.loops || []).forEach((l, i) => { const m = 0.06 + (l.inset || 0);
      s.addShape(pres.ShapeType.roundRect, { x: lx + l.c * cell + m, y: ly + l.r * cell + m, w: l.cs * cell - 2 * m, h: l.rs * cell - 2 * m, rectRadius: 0.14,
        fill: { color: P.white, transparency: 100 }, line: { color: l.color || [P.red, P.violet, P.green, P.amber][i % 4], width: 2.75 } }); });
    return { w: 0.75 + Cn * cell, h: 0.7 + R * cell };
  };

  const svg = async (s, markup, x, y, w, h) => {
    const buf = await sharp(Buffer.from(markup), { density: 220 }).png().toBuffer();
    const m = await sharp(buf).metadata(), r = Math.min(w / m.width, h / m.height);
    s.addImage({ data: "image/png;base64," + buf.toString("base64"), x: x + (w - m.width * r) / 2, y: y + (h - m.height * r) / 2, w: m.width * r, h: m.height * r });
  };

  const helpers = { pres, P, TINTS, tx, card, badge, pill, rect, arrow, line, img, rows, codeBox, table, bits, mem, kmap, svg, fit, heightFor,
    W, H, MX, TOP, BOT, CW, HEAD, BODY, MONO };

  const R = {
    bullets([title, items, note, side]) {
      const s = light(title);
      if (side) {
        const lw = side.wide ? 6.4 : 7.6, sx = MX + lw + 0.4, sw = W - MX - sx;
        rows(s, items, MX, TOP, lw, BOT - TOP);
        if (side.big) {
          card(s, sx, TOP, sw, BOT - TOP, P.ink);
          tx(s, side.big, { x: sx + 0.2, y: TOP + 0.8, w: sw - 0.4, h: 2.0, fontFace: HEAD, fontSize: fit(side.big, sw - 0.5, 2.0, 60, 26, false, true), bold: true, color: P.white, align: "center", valign: "middle" });
          tx(s, side.label, { x: sx + 0.3, y: TOP + 3.0, w: sw - 0.6, h: 1.7, fontSize: fit(side.label, sw - 0.6, 1.7, 19, 13), color: P.ice, align: "center" });
        } else if (side.img) {
          const ch = side.cap ? 0.5 : 0;
          img(s, side.img, sx, TOP, sw, BOT - TOP - ch);
          if (side.cap) tx(s, side.cap, { x: sx, y: BOT - 0.42, w: sw, h: 0.42, fontSize: 12, color: P.mute, italic: true, align: "center", valign: "middle" });
        } else if (side.code) {
          codeBox(s, side.code, sx, TOP, sw, side.h || BOT - TOP, side.lang, 16);
        } else if (side.box) {
          card(s, sx, TOP, sw, BOT - TOP, side.color || P.tealSoft);
          tx(s, side.head, { x: sx + 0.3, y: TOP + 0.25, w: sw - 0.6, h: 0.6, fontSize: 18, bold: true, color: P.steel, valign: "middle" });
          tx(s, side.box, { x: sx + 0.3, y: TOP + 0.95, w: sw - 0.6, h: BOT - TOP - 1.2, fontSize: fit(side.box, sw - 0.6, BOT - TOP - 1.2, 19, 13) });
        }
      } else rows(s, items, MX, TOP, CW, BOT - TOP);
      notes(s, note);
    },
    ordered([title, items, note]) { const s = light(title); rows(s, items, MX, TOP, CW, BOT - TOP, "num"); notes(s, note); },
    cards([title, cards, note]) {
      const s = light(title), n = cards.length;
      const cols = n <= 3 ? n : n === 4 ? 2 : n <= 6 ? 3 : 4, rws = Math.ceil(n / cols), g = 0.3;
      const cw = (CW - g * (cols - 1)) / cols, ch = (BOT - TOP - g * (rws - 1)) / rws;
      const bf = Math.min(...cards.map(([, body]) => fit(body, cw - 0.6, ch - 1.15, BASE, MIN - 1)));
      cards.forEach(([head, body], i) => {
        const x = MX + (i % cols) * (cw + g), y = TOP + Math.floor(i / cols) * (ch + g);
        card(s, x, y, cw, ch);
        badge(s, x + 0.25, y + 0.25, 0.42, i + 1, TINTS[i % 6]);
        tx(s, head, { x: x + 0.85, y: y + 0.2, w: cw - 1.1, h: 0.75, fontSize: fit(head, cw - 1.1, 0.75, 20, 13, false, true), bold: true, color: P.steel, valign: "middle" });
        tx(s, body, { x: x + 0.3, y: y + 1.0, w: cw - 0.6, h: ch - 1.15, fontSize: bf });
      });
      notes(s, note);
    },
    steps([title, steps, note]) {
      const s = light(title), n = steps.length, g = 0.45, bw = (CW - g * (n - 1)) / n, y = TOP + 0.45, bh = BOT - y - 0.1;
      const bf = Math.min(...steps.map(([, b]) => fit(b, bw - 0.4, bh - 1.7, BASE - 1, MIN - 1)));
      steps.forEach(([head, body], i) => {
        const x = MX + i * (bw + g);
        card(s, x, y, bw, bh);
        badge(s, x + bw / 2 - 0.3, y - 0.3, 0.6, i + 1, ACC);
        tx(s, head, { x: x + 0.2, y: y + 0.45, w: bw - 0.4, h: 0.9, fontSize: fit(head, bw - 0.4, 0.9, 19, 13, false, true), bold: true, color: P.steel, align: "center", valign: "middle" });
        tx(s, body, { x: x + 0.2, y: y + 1.5, w: bw - 0.4, h: bh - 1.7, fontSize: bf });
        if (i < n - 1) s.addShape(pres.ShapeType.rightArrow, { x: x + bw + 0.07, y: y + bh / 2 - 0.16, w: g - 0.14, h: 0.32, fill: { color: P.rule }, line: { color: P.rule, width: 0 } });
      });
      notes(s, note);
    },
    code([title, src, callouts, note, lang, o]) {
      const s = light(title);
      const side = callouts && callouts.length, cwid = side ? (o && o.wide ? 8.9 : 8.1) : CW, ch = BOT - TOP;
      codeBox(s, src, MX, TOP, cwid, ch, lang || "asm");
      if (side) {
        const x = MX + cwid + 0.3, w = W - MX - x, g = 0.22, n = callouts.length, h = (ch - g * (n - 1)) / n;
        const cf = Math.min(...callouts.map((c) => fit(c, w - 0.95, h - 0.3, 17, o && o.wide ? 11 : 12)));
        callouts.forEach((c, i) => {
          const y = TOP + i * (h + g);
          card(s, x, y, w, h); badge(s, x + 0.18, y + 0.18, 0.4, i + 1, P.amber);
          tx(s, c, { x: x + 0.75, y: y + 0.15, w: w - 0.95, h: h - 0.3, fontSize: cf, valign: "middle" });
        });
      }
      notes(s, note);
    },
    walk([title, src, image, caption, note]) {
      const s = light(title), cwid = 7.3, ch = BOT - TOP, x = MX + cwid + 0.35, w = W - MX - x;
      codeBox(s, src, MX, TOP, cwid, ch, "asm", 16);
      const ih = w * 400 / 640;
      card(s, x - 0.08, TOP - 0.02, w + 0.16, ih + 0.16, P.ink);
      img(s, image, x, TOP + 0.06, w, ih);
      tx(s, L.screenshot, { x, y: TOP + ih + 0.22, w, h: 0.28, fontSize: 11.5, color: P.mute, italic: true });
      const cy = TOP + ih + 0.6;
      card(s, x - 0.08, cy, w + 0.16, BOT - cy);
      tx(s, caption, { x: x + 0.15, y: cy + 0.12, w: w - 0.3, h: BOT - cy - 0.24, fontSize: fit(caption, w - 0.3, BOT - cy - 0.24, 17, 12), valign: "middle" });
      notes(s, note);
    },
    versus([title, left, right, note]) {
      const s = light(title), g = 0.4, cw = (CW - g) / 2;
      [left, right].forEach(([head, items], i) => {
        const x = MX + i * (cw + g), col = i ? P.amber : P.teal;
        card(s, x, TOP, cw, BOT - TOP);
        pill(s, head, x + 0.3, TOP + 0.25, cw - 0.6, 0.6, col);
        const bh = BOT - TOP - 1.3;
        const fsz = Math.min(...[left, right].map(([, its]) => fit(its.join("\n"), cw - 0.95, bh - its.length * 0.14, BASE + 1, MIN)));
        s.addText(items.map((t, k) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: k < items.length - 1 } })),
          { isTextBox: true, x: x + 0.35, y: TOP + 1.1, w: cw - 0.7, h: bh, fontFace: BODY, fontSize: fsz, color: P.ink, valign: "top", margin: 0, paraSpaceAfter: 8 });
      });
      notes(s, note);
    },
    table([title, head, body, note, o = {}]) {
      const s = light(title), cols = head.length, widths = o.widths, cap = o.caption ? 0.55 : 0;
      const tw = widths ? widths.map((v) => v * CW / widths.reduce((a, b) => a + b, 0)) : Array(cols).fill(CW / cols);
      const mono = o.mono || [];
      let fsz = o.fs || 21, total;
      for (; fsz >= 11; fsz--) {
        total = [head, ...body].reduce((acc, r) => acc + Math.max(...r.map((c, i) => heightFor(c, tw[i] - 0.25, fsz, mono.includes(i)))) + (o.pad == null ? 0.15 : o.pad), 0);
        if (total <= BOT - TOP - cap) break;
      }
      if (total > BOT - TOP - cap) throw new Error(`${WHERE}: table too tall`);
      table(s, MX, TOP, tw, head, body, { fs: fsz, mono, hi: o.hi, margin: o.pad != null && o.pad < 0.1 ? [0, 8, 0, 8] : [4, 8, 4, 8], align: o.align });
      if (o.caption) tx(s, o.caption, { x: MX, y: BOT - 0.45, w: CW, h: 0.45, fontSize: fit(o.caption, CW, 0.45, 15, 11), color: P.mute, italic: true, valign: "middle" });
      notes(s, note);
    },
    big([statement, sub, note]) {
      const s = dark();
      pixels(s, MX, 0.7, 0.2, [ACC, P.amber, null, null, ACC, null]);
      tx(s, statement, { x: MX, y: 1.7, w: CW, h: 3.0, fontFace: HEAD, fontSize: fit(statement, CW, 3.0, 44, 26, false, true), bold: true, color: P.white, valign: "middle" });
      if (sub) tx(s, sub, { x: MX, y: 4.9, w: CW, h: 1.5, fontSize: fit(sub, CW, 1.5, 22, 15), color: P.ice });
      notes(s, note);
    },
    definition([title, term, def, items, note]) {
      const s = light(title), hasItems = items && items.length;
      const dh = hasItems ? Math.min(2.6, Math.max(1.5, heightFor(def, CW - 0.8, 22) + 1.0)) : BOT - TOP - 0.6;
      card(s, MX, TOP, CW, dh, P.amberSoft);
      tx(s, term, { x: MX + 0.4, y: TOP + 0.2, w: CW - 0.8, h: 0.45, fontSize: 16, bold: true, color: P.amber, valign: "middle" });
      tx(s, def, { x: MX + 0.4, y: TOP + 0.7, w: CW - 0.8, h: dh - 0.9, fontFace: HEAD, italic: true, fontSize: fit(def, CW - 0.8, dh - 0.9, hasItems ? 24 : 30, 15), valign: "middle" });
      if (hasItems) rows(s, items, MX, TOP + dh + 0.35, CW, BOT - TOP - dh - 0.35);
      notes(s, note);
    },
    exercise([title, tasks, expected, note]) {
      const s = light(title);
      pill(s, L.tryit, W - MX - 1.7, 0.62, 1.7, 0.5, P.green, 15);
      const eh = expected ? 1.15 : 0;
      rows(s, tasks, MX, TOP, CW, BOT - TOP - eh - (eh ? 0.25 : 0), "num");
      if (expected) {
        card(s, MX, BOT - eh, CW, eh, P.greenSoft);
        tx(s, L.expected, { x: MX + 0.3, y: BOT - eh + 0.1, w: 3, h: 0.3, fontSize: 13, bold: true, color: P.green });
        tx(s, expected, { x: MX + 0.3, y: BOT - eh + 0.42, w: CW - 0.6, h: eh - 0.5, fontSize: fit(expected, CW - 0.6, eh - 0.5, 18, 12), valign: "middle" });
      }
      notes(s, note);
    },
    quiz([question, options, answer, why]) {
      const s = light(L.quiz);
      const qh = 1.25;
      tx(s, question, { x: MX, y: TOP, w: CW, h: qh, fontFace: HEAD, bold: true, color: P.ink, fontSize: fit(question, CW, qh, 26, 16, false, true), valign: "middle" });
      const n = options.length, cols = 2, rws = Math.ceil(n / cols), g = 0.3, y0 = TOP + qh + 0.3;
      const cw = (CW - g) / 2, ch = (BOT - y0 - g * (rws - 1)) / rws;
      const of = Math.min(...options.map((o) => fit(o, cw - 1.3, ch - 0.3, 22, 13)));
      options.forEach((o, i) => {
        const x = MX + (i % cols) * (cw + g), y = y0 + Math.floor(i / cols) * (ch + g);
        card(s, x, y, cw, ch);
        badge(s, x + 0.25, y + ch / 2 - 0.27, 0.54, "ABCDEF"[i], P.steel);
        tx(s, o, { x: x + 1.05, y: y + 0.15, w: cw - 1.3, h: ch - 0.3, fontSize: of, valign: "middle" });
      });
      notes(s, `${L.answer}: ${"ABCDEF"[answer]}. ${why || ""}`);
    },
    mark([title]) { pendingSection = title; },
    // Two questions on one slide.
    quiz2([pair]) {
      const s = light(L.quiz), half = (BOT - TOP - 0.15) / 2, qh = 0.72, g = 0.14, cw = (CW - 0.3) / 2;
      pair.forEach(([question, options], j) => {
        const y0 = TOP + j * (half + 0.15), rws = Math.ceil(options.length / 2), oh = (half - qh - 0.08 - g * (rws - 1)) / rws;
        badge(s, MX, y0 + qh / 2 - 0.2, 0.4, j + 1, ACC);
        tx(s, question, { x: MX + 0.55, y: y0, w: CW - 0.55, h: qh, fontFace: HEAD, bold: true, color: P.ink, fontSize: fit(question, CW - 0.55, qh, 20, 12, false, true), valign: "middle" });
        const of = Math.min(...options.map((o) => fit(o, cw - 0.85, oh - 0.12, 17, 10)));
        options.forEach((o, i) => {
          const x = MX + (i % 2) * (cw + 0.3), y = y0 + qh + 0.08 + Math.floor(i / 2) * (oh + g);
          card(s, x, y, cw, oh);
          badge(s, x + 0.15, y + oh / 2 - 0.18, 0.36, "ABCDEF"[i], P.steel);
          tx(s, o, { x: x + 0.68, y: y + 0.06, w: cw - 0.85, h: oh - 0.12, fontSize: of, valign: "middle" });
        });
      });
      notes(s, pair.map(([, , answer, why], j) => `${j + 1}. ${L.answer}: ${"ABCDEF"[answer]}. ${why || ""}`).join("\n"));
    },
    section([title, sub]) {
      secNo++; section = title; pres.addSection({ title });
      const s = dark();
      pixels(s, MX, 0.7, 0.2, [ACC, P.amber, null, null, ACC, null]);
      tx(s, String(secNo).padStart(2, "0"), { x: MX, y: 2.0, w: 3, h: 1.2, fontFace: HEAD, fontSize: 72, bold: true, color: P.amber, valign: "middle" });
      tx(s, title, { x: MX, y: 3.3, w: CW, h: 1.3, fontFace: HEAD, fontSize: fit(title, CW, 1.3, 44, 28, false, true), bold: true, color: P.white, valign: "middle" });
      if (sub) tx(s, sub, { x: MX, y: 4.75, w: CW, h: 1.2, fontSize: fit(sub, CW, 1.2, 22, 15), color: P.ice });
      notes(s, null);
    },
    images([title, pics, note, text]) {
      const s = light(title), n = pics.length, g = 0.3, th = text ? 0.9 : 0;
      const cols = n <= 4 ? n : Math.ceil(n / 2), rws = Math.ceil(n / cols);
      const cw = (CW - g * (cols - 1)) / cols, ch = (BOT - TOP - th - g * (rws - 1)) / rws;
      pics.forEach(([file, cap], i) => {
        const x = MX + (i % cols) * (cw + g), y = TOP + Math.floor(i / cols) * (ch + g);
        card(s, x, y, cw, ch);
        img(s, file, x + 0.15, y + 0.15, cw - 0.3, ch - (cap ? 0.95 : 0.3));
        if (cap) tx(s, cap, { x: x + 0.15, y: y + ch - 0.75, w: cw - 0.3, h: 0.65, fontSize: fit(cap, cw - 0.3, 0.65, 15, 10), align: "center", valign: "middle" });
      });
      if (text) tx(s, text, { x: MX, y: BOT - th + 0.15, w: CW, h: th - 0.15, fontSize: fit(text, CW, th - 0.15, 19, 13), valign: "middle" });
      notes(s, note);
    },
    flow([title, nodes, caption, note]) {
      const s = light(title), n = nodes.length, g = 0.4, bw = (CW - g * (n - 1)) / n, bh = caption ? 2.7 : 3.4, y = TOP + (caption ? 0.5 : 0.8);
      const parts = nodes.map((nd) => nd.split("|"));
      const sf = Math.min(...parts.map(([, sub]) => (sub ? fit(sub, bw - 0.3, bh - 1.25, 17, 11) : 17)));
      parts.forEach(([head, sub], i) => {
        const x = MX + i * (bw + g), col = TINTS[i % 6];
        card(s, x, y, bw, bh);
        pill(s, head, x + 0.15, y + 0.2, bw - 0.3, 0.75, col, fit(head, bw - 0.5, 0.75, 19, 11, false, true));
        if (sub) tx(s, sub, { x: x + 0.15, y: y + 1.1, w: bw - 0.3, h: bh - 1.25, fontSize: sf, align: "center", valign: "middle" });
        if (i < n - 1) s.addShape(pres.ShapeType.rightArrow, { x: x + bw + 0.05, y: y + bh / 2 - 0.16, w: g - 0.1, h: 0.32, fill: { color: P.mute }, line: { color: P.mute, width: 0 } });
      });
      if (caption) { card(s, MX, y + bh + 0.4, CW, BOT - (y + bh + 0.4), P.tealSoft);
        tx(s, caption, { x: MX + 0.3, y: y + bh + 0.5, w: CW - 0.6, h: BOT - (y + bh + 0.6), fontSize: fit(caption, CW - 0.6, BOT - (y + bh + 0.6), 20, 13), valign: "middle" }); }
      notes(s, note);
    },
    draw([title, fn, note]) {
      const s = title ? light(title) : dark();
      const r = fn(s, helpers);
      if (r && r.then) pending.push(r);
      notes(s, note);
    },
  };

  // ---- title slide ---------------------------------------------------------
  WHERE = `L${deck.n} title`;
  {
    const s = dark();
    pixels(s, MX, 0.7, 0.24, [ACC, P.amber, null, null, ACC, P.amber, ACC, null, null]);
    tx(s, `${COURSE.toUpperCase()}  ·  ${L.lecture.toUpperCase()} ${deck.n}`, { x: MX, y: 1.75, w: CW, h: 0.4, fontSize: 16, bold: true, color: P.amber, charSpacing: 3 });
    tx(s, deck.title.replace(/RISC-V/g, "RISC\u2011V"), { x: MX, y: 2.2, w: CW - 1.5, h: 1.7, fontFace: HEAD, fontSize: fit(deck.title, CW - 1.5, 1.7, 48, 30, false, true), bold: true, color: P.white, valign: "middle" });
    if (deck.sub) tx(s, deck.sub, { x: MX, y: 3.95, w: CW - 1.5, h: 0.6, fontSize: fit(deck.sub, CW - 1.5, 0.6, 22, 15), color: P.ice, valign: "middle" });
    if (deck.quote) {
      tx(s, [{ text: `“${deck.quote[0]}”`, options: { italic: true, color: P.white, fontSize: fit(deck.quote[0], 8.6, 0.75, 19, 13), breakLine: true } },
        { text: deck.quote[1], options: { color: P.ice, fontSize: 12 } }], { x: MX, y: 4.75, w: 8.8, h: 1.2, fontFace: deck.quoteMono ? MONO : BODY, valign: "top" });
    }
    tx(s, [{ text: "Prof. Raffaele Montella, PhD", options: { bold: true, color: P.white, fontSize: 17, breakLine: true } },
      { text: L.university + "  ·  " + YEAR, options: { color: P.ice, fontSize: 14, breakLine: true } },
      { text: "raffaelemontella.it  ·  raffaele.montella@uniparthenope.it", options: { color: P.ice, fontSize: 13 } }], { x: MX, y: 6.0, w: 9, h: 1.0 });
    if (deck.credit) tx(s, deck.credit, { x: MX, y: 7.02, w: 9, h: 0.3, fontSize: 12, italic: true, color: P.ice });
    if (deck.pair) tx(s, deck.pair, { x: W - MX - 7.6, y: 0.62, w: 7.6, h: 0.7, fontSize: fit(deck.pair, 7.6, 0.7, 13, 10), color: P.ice, align: "right", valign: "top" });
    if (deck.cover) { card(s, W - MX - 3.3, 4.55, 3.3, 2.2, "000000"); img(s, deck.cover, W - MX - 3.2, 4.65, 3.1, 2.0); }
    notes(s, deck.notes);
  }

  deck.slides.forEach((sl) => {
    WHERE = `L${deck.n}${deck.kind === "code" ? " code deck" : ""} slide ${count + 1} "${typeof sl.a[0] === "string" ? sl.a[0] : sl.t}"`;
    if (!R[sl.t]) throw new Error(`${WHERE}: unknown slide type ${sl.t}`);
    R[sl.t](sl.a);
  });
  await Promise.all(pending);
  const file = path.join(OUT, `${deck.file}.pptx`);
  await pres.writeFile({ fileName: file });
  return { file, count };
}

(async () => {
  if (!LANG) {   // no language given: one child process per language (the specifications are loaded once per process)
    let bad = 0;
    for (const l of LANGS) bad += require("child_process").spawnSync(process.execPath, [__filename, l, ...process.argv.slice(2)], { stdio: "inherit" }).status ? 1 : 0;
    process.exit(bad ? 1 : 0);
  }
  await loadDims();
  const dir = path.join(__dirname, "decks", LANG);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".js")).sort()) require(path.join(dir, f));
  try { decks = decks.flatMap((d) => require("./lib/lab").split(d, LANG)); }
  catch (e) { console.error(`FAILED: ${e.message}`); process.exit(1); }
  const only = process.argv[3];
  let failed = 0, built = 0;
  for (const d of decks) {
    if (only && Number(d.n) !== Number(only)) continue;
    built++;
    try { const r = await build(d); console.log(`${LANG}/slides/${path.basename(r.file)}  ${r.count} slides`); }
    catch (e) { failed++; console.error(`FAILED L${d.n}: ${e.message}`); }
  }
  if (!built) { console.error(`no lecture ${only}: the decks are ${decks[0].n} ... ${decks[decks.length - 1].n}`); process.exit(1); }
  process.exit(failed ? 1 : 0);
})();
