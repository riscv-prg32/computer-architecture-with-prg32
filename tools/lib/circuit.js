/*
 * SVG symbols for simple electronic schematics (IEC style).  Every symbol is drawn between two
 * terminals and returns its markup; wires are plain polylines.  Coordinates are in SVG pixels.
 */
const { text, doc, wire } = require("./gates");
const INK = "#1B2530", WIRE = "#2E4A62", FILL = "#D8ECEE";

// Resistor: a rectangle on a vertical (or horizontal) wire from (x, y) of length len.
function resistor(x, y, len, o = {}) {
  const h = o.horizontal, bl = 44, bw = 18, a = (len - bl) / 2;
  if (h) return `<line x1="${x}" y1="${y}" x2="${x + a}" y2="${y}" stroke="${WIRE}" stroke-width="2.2"/><rect x="${x + a}" y="${y - bw / 2}" width="${bl}" height="${bw}" fill="#fff" stroke="${INK}" stroke-width="2.2"/><line x1="${x + a + bl}" y1="${y}" x2="${x + len}" y2="${y}" stroke="${WIRE}" stroke-width="2.2"/>` +
    (o.label ? text(x + len / 2, y - 16, o.label, { anchor: "middle", size: 14 }) : "");
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + a}" stroke="${WIRE}" stroke-width="2.2"/><rect x="${x - bw / 2}" y="${y + a}" width="${bw}" height="${bl}" fill="#fff" stroke="${INK}" stroke-width="2.2"/><line x1="${x}" y1="${y + a + bl}" x2="${x}" y2="${y + len}" stroke="${WIRE}" stroke-width="2.2"/>` +
    (o.label ? text(x + 18, y + len / 2 + 5, o.label, { size: 14 }) : "");
}
// LED (or diode) on a vertical wire, current flowing downwards.
function led(x, y, len, o = {}) {
  const a = (len - 24) / 2, t = y + a, col = o.color || "#B23A48";
  let s = `<line x1="${x}" y1="${y}" x2="${x}" y2="${t}" stroke="${WIRE}" stroke-width="2.2"/><polygon points="${x - 13},${t} ${x + 13},${t} ${x},${t + 24}" fill="${o.diode ? "#fff" : col}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><line x1="${x - 13}" y1="${t + 24}" x2="${x + 13}" y2="${t + 24}" stroke="${INK}" stroke-width="2.6"/><line x1="${x}" y1="${t + 24}" x2="${x}" y2="${y + len}" stroke="${WIRE}" stroke-width="2.2"/>`;
  if (!o.diode) s += `<path d="M${x + 18},${t + 6} l12,-9 M${x + 22},${t + 16} l12,-9" stroke="${col}" stroke-width="2" fill="none"/>`;
  if (o.label) s += text(x - 20, t + 17, o.label, { anchor: "end", size: 14 });
  return s;
}
// Battery / DC source on a vertical wire, positive terminal on top.
function battery(x, y, len, label) {
  const m = y + len / 2;
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${m - 6}" stroke="${WIRE}" stroke-width="2.2"/><line x1="${x - 16}" y1="${m - 6}" x2="${x + 16}" y2="${m - 6}" stroke="${INK}" stroke-width="2.6"/><line x1="${x - 8}" y1="${m + 6}" x2="${x + 8}" y2="${m + 6}" stroke="${INK}" stroke-width="5"/><line x1="${x}" y1="${m + 6}" x2="${x}" y2="${y + len}" stroke="${WIRE}" stroke-width="2.2"/>` +
    text(x - 22, m - 10, "+", { anchor: "end", size: 15 }) + (label ? text(x - 22, m + 16, label, { anchor: "end", size: 14 }) : "");
}
const ground = (x, y) => `<line x1="${x - 14}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="${INK}" stroke-width="2.6"/><line x1="${x - 9}" y1="${y + 6}" x2="${x + 9}" y2="${y + 6}" stroke="${INK}" stroke-width="2.6"/><line x1="${x - 4}" y1="${y + 12}" x2="${x + 4}" y2="${y + 12}" stroke="${INK}" stroke-width="2.6"/>`;
// Supply rail: a short bar with its name above.
const vdd = (x, y, label) => `<line x1="${x - 14}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="${INK}" stroke-width="2.6"/>` + text(x, y - 8, label || "3.3 V", { anchor: "middle", size: 14 });
// Push-button switch on a vertical wire; closed = pressed.
function button(x, y, len, closed, label) {
  const a = (len - 34) / 2, t = y + a;
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${t}" stroke="${WIRE}" stroke-width="2.2"/><circle cx="${x}" cy="${t}" r="3.6" fill="${WIRE}"/><circle cx="${x}" cy="${t + 34}" r="3.6" fill="${WIRE}"/>` +
    (closed ? `<line x1="${x}" y1="${t}" x2="${x}" y2="${t + 34}" stroke="${INK}" stroke-width="2.6"/>` : `<line x1="${x}" y1="${t + 34}" x2="${x + 17}" y2="${t + 3}" stroke="${INK}" stroke-width="2.6"/>`) +
    `<line x1="${x}" y1="${t + 34}" x2="${x}" y2="${y + len}" stroke="${WIRE}" stroke-width="2.2"/>` + (label ? text(x + 24, t + 22, label, { size: 14 }) : "");
}
/*
 * MOS transistor, channel vertical.  Gate terminal at (x, y); the source/drain column is at x + 36,
 * from y - 26 (top) to y + 26 (bottom).  type "n" or "p" (p has the inversion bubble on the gate).
 * state: "on" | "off" | undefined colours the channel.
 */
function mos(type, x, y, o = {}) {
  const cx = x + 36, col = o.state === "on" ? "#2F7D4F" : o.state === "off" ? "#C9D2D8" : INK, gx = type === "p" ? x + 12 : x + 20;
  let s = `<line x1="${x}" y1="${y}" x2="${gx}" y2="${y}" stroke="${WIRE}" stroke-width="2.2"/>`;
  if (type === "p") s += `<circle cx="${x + 16}" cy="${y}" r="4" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  s += `<line x1="${x + 20}" y1="${y - 16}" x2="${x + 20}" y2="${y + 16}" stroke="${INK}" stroke-width="2.6"/>` +
    `<line x1="${x + 27}" y1="${y - 20}" x2="${x + 27}" y2="${y + 20}" stroke="${col}" stroke-width="${o.state ? 5 : 2.6}"/>` +
    `<polyline points="${cx},${y - 26} ${cx},${y - 14} ${x + 27},${y - 14}" fill="none" stroke="${WIRE}" stroke-width="2.2"/><polyline points="${cx},${y + 26} ${cx},${y + 14} ${x + 27},${y + 14}" fill="none" stroke="${WIRE}" stroke-width="2.2"/>`;
  if (o.label) s += text(cx + 10, y + 5, o.label, { size: 13, bold: false, fill: "#5B6B78" });
  return s;
}
const mosPins = (x, y) => ({ gate: [x, y], top: [x + 36, y - 26], bottom: [x + 36, y + 26] });
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3.8" fill="${WIRE}"/>`;

module.exports = { resistor, led, battery, ground, vdd, button, mos, mosPins, dot, wire, text, doc, INK, WIRE, FILL };
