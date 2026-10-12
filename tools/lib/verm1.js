/*
 * Verm1 sources for the tutorial decks.  The reference implementation of Verm1 was contributed by
 * Giuseppe Coviello.  The code shown on the slides is read from the tested files in
 * ../../verm1/verm1_partN.S; a line "#@ name" starts a region.  Every region of a part must be shown exactly
 * once in its deck: done(part) throws otherwise, so a slide can never silently drift from the program.
 */
const fs = require("fs");
const path = require("path");
const DIR = path.resolve(__dirname, "..", "..", "verm1");
const { STR } = require("./lang");
const LS = () => STR[global.LANG || "en"];
const cache = {}, used = {};
function load(part) {
  if (cache[part]) return cache[part];
  const text = fs.readFileSync(path.join(DIR, `verm1_part${part}.S`), "utf8"), out = {};
  let name = null;
  for (const line of text.split("\n")) {
    const m = line.match(/^#@ (.+)$/);
    if (m) { name = m[1]; out[name] = []; } else if (name) out[name].push(line);
  }
  for (const k of Object.keys(out)) out[k] = out[k].join("\n").replace(/\s+$/, "");
  used[part] = new Set();
  return (cache[part] = out);
}
function region(part, name) {
  const r = load(part);
  if (!(name in r)) throw new Error(`verm1 part ${part}: no region "${name}"`);
  if (used[part].has(name)) throw new Error(`verm1 part ${part}: region "${name}" shown twice`);
  used[part].add(name);
  return r[name];
}
function done(part) {
  const missing = Object.keys(load(part)).filter((k) => !used[part].has(k));
  if (missing.length) throw new Error(`verm1 part ${part}: regions not shown in the deck: ${missing.join(", ")}`);
}
const lines = (part) => fs.readFileSync(path.join(DIR, `verm1_part${part}.S`), "utf8").replace(/\n+$/, "").split("\n").filter((l) => !l.startsWith("#@")).length;
module.exports = { region, done, lines };

// Commands shown, identically, in every tutorial deck.
module.exports.BUILD = `# 1. build the cartridge (from your PRG32 folder, toolchain active)
python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \\
    --entry-prefix verm1 --name verm1 --out ~/verm1/verm1.prg32

# 2. send it to PRG32-QT, running on the same computer
python3 -m prg32 esp32c6 upload-and-run ~/verm1/verm1.prg32 \\
    --url http://localhost:8080 --slot cart0

# or: in PRG32-QT, import the file verm1.prg32 and choose Run Cartridge`;

// The 40 x 24 grid with one highlighted cell, as SVG.
module.exports.gridSvg = function (col, row, extra) {
  const c = 14, L = 64, T = 30, W = 40 * c + L + 12, H = 25 * c + T + 52;
  let o = `<rect x="${L}" y="${T}" width="${40 * c}" height="${c}" fill="#2E4A62"/><rect x="${L}" y="${T + c}" width="${40 * c}" height="${24 * c}" fill="#12202B"/>`;
  for (let i = 0; i <= 40; i++) o += `<line x1="${L + i * c}" y1="${T + c}" x2="${L + i * c}" y2="${T + 25 * c}" stroke="#2E4A62" stroke-width="0.7"/>`;
  for (let j = 0; j <= 24; j++) o += `<line x1="${L}" y1="${T + c + j * c}" x2="${L + 40 * c}" y2="${T + c + j * c}" stroke="#2E4A62" stroke-width="0.7"/>`;
  (extra || []).forEach(([x, y, col2]) => { o += `<rect x="${L + x * c}" y="${T + c + y * c}" width="${c}" height="${c}" fill="${col2}"/>`; });
  o += `<rect x="${L + col * c}" y="${T + c + row * c}" width="${c}" height="${c}" fill="#00FC00"/>`;
  const t = (x, y, s, a, fill) => `<text x="${x}" y="${y}" font-family="Arial" font-size="13" font-weight="bold" fill="${fill || "#1B2530"}" text-anchor="${a || "middle"}">${s}</text>`;
  const g = STR[global.LANG || "en"].grid;
  o += t(L + 20 * c, 18, g.cols) + t(L + 6, T + c - 3, g.title, "start", "#fff");
  o += t(L + col * c + c / 2, T + 25 * c + 16, `${g.col} ${col}`) + t(L - 6, T + c + row * c + c - 2, `${g.row} ${row}`, "end");
  o += t(L + 20 * c, T + 25 * c + 38, g.rows);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o}</svg>`;
};
// A code slide for one region of a part: wide listing, narrow callouts.
module.exports.slide = (part, name, title, callouts, note) => K(title, module.exports.region(part, name), callouts, note, "asm", { wide: true });
// Temporary code of a tutorial checkpoint (verm1/steps), built and run by tests/verm1_steps.py.
module.exports.stub = (name) => fs.readFileSync(path.join(DIR, "steps", name + ".S"), "utf8").replace(/\s+$/, "");
module.exports.stubSlide = (name, title, callouts, note) => K(title, module.exports.stub(name), callouts, note, "asm", { wide: true });
// A file of the Store bundle (verm1/store), with over-long lines cut for the slide.
module.exports.storeFile = (name) => fs.readFileSync(path.join(DIR, "store", name), "utf8").replace(/\s+$/, "").split("\n")
  .map((l) => (l.length > 84 ? l.slice(0, 74).replace(/\s+\S*$/, "") + ' ..."' + (l.trimEnd().endsWith(",") ? "," : "") : l)).join("\n");

// Credit line printed on the cover of every Verm1 deck.
Object.defineProperty(module.exports, "CREDIT", { get: () => LS().verm1Credit, enumerable: true });
