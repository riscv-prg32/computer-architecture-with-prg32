/*
 * Tiny SVG library for logic-gate drawings.  Each gate is drawn in a 60x44 box
 * whose top-left corner is (x, y); inputs enter at y+11 and y+33 (y+22 for a
 * NOT), the output leaves at y+22.  pins() returns the exact pin coordinates so
 * wires can be routed to them.
 */
const INK = "#1B2530", FILL = "#D8ECEE", WIRE = "#2E4A62";
const body = {
  and: (x, y) => `M${x},${y} h26 a22,22 0 0 1 0,44 h-26 z`,
  or: (x, y) => `M${x},${y} q20,0 34,8 q12,6 16,14 q-4,8 -16,14 q-14,8 -34,8 q12,-22 0,-44 z`,
  not: (x, y) => `M${x},${y + 4} l34,18 l-34,18 z`,
};
function gate(type, x, y, label) {
  const t = type.toLowerCase(), neg = t === "nand" || t === "nor" || t === "not" || t === "xnor";
  const base = t === "nand" ? "and" : t === "nor" || t === "xor" || t === "xnor" ? "or" : t;
  const bx = t === "xor" || t === "xnor" ? x + 7 : x;
  let out = `<path d="${body[base](bx, y)}" fill="${FILL}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
  if (t === "xor" || t === "xnor") out += `<path d="M${x},${y} q12,22 0,44" fill="none" stroke="${INK}" stroke-width="2.2"/>`;
  const tip = base === "and" ? bx + 48 : base === "or" ? bx + 50 : bx + 34;
  if (neg) out += `<circle cx="${tip + 5}" cy="${y + 22}" r="5" fill="#fff" stroke="${INK}" stroke-width="2.2"/>`;
  if (label) out += `<text x="${bx + (base === "not" ? 11 : 22)}" y="${y + 27}" font-family="Arial" font-size="12" font-weight="bold" fill="${INK}" text-anchor="middle">${label}</text>`;
  return out;
}
function pins(type, x, y) {
  const t = type.toLowerCase(), neg = t === "nand" || t === "nor" || t === "not" || t === "xnor";
  const base = t === "nand" ? "and" : t === "nor" || t === "xor" || t === "xnor" ? "or" : t;
  const bx = t === "xor" || t === "xnor" ? x + 7 : x;
  const tip = (base === "and" ? bx + 48 : base === "or" ? bx + 50 : bx + 34) + (neg ? 10 : 0);
  const inx = base === "or" ? (t === "xor" || t === "xnor" ? x + 4 : x + 5) : x;
  if (base === "not") return { a: [x, y + 22], out: [tip, y + 22] };
  return { a: [inx, y + 11], b: [inx, y + 33], out: [tip, y + 22] };
}
// wire through points [[x,y],...]; dot=true draws a junction at the first point
const wire = (pts, dot) => `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${WIRE}" stroke-width="2.2" stroke-linejoin="round"/>` +
  (dot ? `<circle cx="${pts[0][0]}" cy="${pts[0][1]}" r="3.6" fill="${WIRE}"/>` : "");
const text = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="Arial" font-size="${o.size || 15}" font-weight="${o.bold === false ? "normal" : "bold"}" fill="${o.fill || INK}" text-anchor="${o.anchor || "start"}"${o.italic ? ' font-style="italic"' : ""}>${s}</text>`;
const doc = (w, h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
module.exports = { gate, pins, wire, text, doc, INK, FILL, WIRE };
