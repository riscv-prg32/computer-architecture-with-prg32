/*
 * SVG helpers for timing diagrams and state diagrams.
 */
const { text, doc } = require("./gates");
const INK = "#1B2530", MUTE = "#5B6B78", RULE = "#C9D2D8";
const COLS = ["#0E7C86", "#C7791B", "#6B4FA0", "#2F7D4F", "#B23A48", "#2E4A62"];

/*
 * Timing diagram.  signals: [{ name, v: "0011..." | [0,1,...] , color? }] one value per time slot.
 * opts: { slot, marks: [{ t, label }], width }  A slanted edge of `slope` px models the propagation delay.
 */
function wave(signals, opts = {}) {
  const slot = opts.slot || 46, n = Math.max(...signals.map((s) => s.v.length)), left = opts.left || 70, rowH = 62, amp = 30, slope = opts.slope == null ? 5 : opts.slope;
  const W = left + n * slot + 20, H = signals.length * rowH + (opts.marks ? 34 : 10);
  let out = "";
  for (let t = 0; t <= n; t++) out += `<line x1="${left + t * slot}" y1="6" x2="${left + t * slot}" y2="${signals.length * rowH}" stroke="${RULE}" stroke-width="1" stroke-dasharray="3 4"/>`;
  signals.forEach((s, i) => {
    const y0 = i * rowH + rowH - 14, y1 = y0 - amp, col = s.color || COLS[i % 6], vals = [...s.v].map(Number);
    let d = `M${left},${vals[0] ? y1 : y0}`;
    for (let t = 0; t < vals.length; t++) {
      const x = left + t * slot, y = vals[t] ? y1 : y0, dl = s.delay || 0;
      if (t > 0 && vals[t] !== vals[t - 1]) d += ` L${x + dl},${vals[t - 1] ? y1 : y0} L${x + dl + slope},${y}`;
      d += ` L${x + slot},${y}`;
    }
    out += `<path d="${d}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>` + text(left - 12, y0 - amp / 2 + 6, s.name, { anchor: "end", size: 17, fill: col });
  });
  (opts.marks || []).forEach((m) => {
    const x = left + m.t * slot;
    out += `<line x1="${x}" y1="2" x2="${x}" y2="${signals.length * rowH + 6}" stroke="${INK}" stroke-width="1.6"/>` + text(x, signals.length * rowH + 24, m.label, { anchor: "middle", size: 14, fill: INK });
  });
  return doc(W, H, out);
}

/*
 * State diagram.  states: [{ id, x, y, label, sub?, color? }];  edges: [{ from, to, label, bend?, loop? }]
 * bend: perpendicular offset of the curve (px); loop: "top" | "bottom" | "left" | "right" for a self-loop.
 */
function fsm(states, edges, opts = {}) {
  const R = opts.r || 34, W = opts.w || 520, H = opts.h || 360, byId = Object.fromEntries(states.map((s) => [s.id, s]));
  let out = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${INK}"/></marker></defs>`;
  edges.forEach((e) => {
    const a = byId[e.from], b = byId[e.to];
    if (e.from === e.to) {
      const dir = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] }[e.loop || "top"], px = -dir[1], py = dir[0];
      const sx = a.x + dir[0] * R * 0.8 + px * R * 0.6, sy = a.y + dir[1] * R * 0.8 + py * R * 0.6, ex = a.x + dir[0] * R * 0.8 - px * R * 0.6, ey = a.y + dir[1] * R * 0.8 - py * R * 0.6;
      const c1x = a.x + dir[0] * R * 2.6 + px * R * 1.1, c1y = a.y + dir[1] * R * 2.6 + py * R * 1.1, c2x = a.x + dir[0] * R * 2.6 - px * R * 1.1, c2y = a.y + dir[1] * R * 2.6 - py * R * 1.1;
      out += `<path d="M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}" fill="none" stroke="${INK}" stroke-width="2" marker-end="url(#ah)"/>`;
      out += text(a.x + dir[0] * R * 2.55, a.y + dir[1] * R * 2.55 + 5, e.label, { anchor: "middle", size: opts.labelSize || 15, fill: "#B23A48" });
      return;
    }
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux, bend = e.bend || 0;
    const mx = (a.x + b.x) / 2 + nx * bend, my = (a.y + b.y) / 2 + ny * bend;
    const sa = Math.hypot(mx - a.x, my - a.y), sb = Math.hypot(mx - b.x, my - b.y);
    const sx = a.x + (mx - a.x) / sa * R, sy = a.y + (my - a.y) / sa * R, ex = b.x + (mx - b.x) / sb * (R + 2), ey = b.y + (my - b.y) / sb * (R + 2);
    out += `<path d="M${sx},${sy} Q${mx},${my} ${ex},${ey}" fill="none" stroke="${INK}" stroke-width="2" marker-end="url(#ah)"/>`;
    const t = e.lt == null ? 0.5 : e.lt, off = bend >= 0 ? 14 : -14;   // label: a point on the curve, pushed outwards
    const lx = (1 - t) * (1 - t) * sx + 2 * t * (1 - t) * mx + t * t * ex + nx * off, ly = (1 - t) * (1 - t) * sy + 2 * t * (1 - t) * my + t * t * ey + ny * off;
    out += text(lx, ly + 5, e.label, { anchor: "middle", size: opts.labelSize || 15, fill: "#B23A48" });
  });
  states.forEach((s, i) => {
    out += `<circle cx="${s.x}" cy="${s.y}" r="${R}" fill="${s.color || COLS[i % 6]}"/>`;
    out += text(s.x, s.y + (s.sub ? -2 : 6), s.label, { anchor: "middle", size: opts.stateSize || 17, fill: "#fff" });
    if (s.sub) out += text(s.x, s.y + 17, s.sub, { anchor: "middle", size: 13, fill: "#fff", bold: false });
  });
  return doc(W, H, out);
}

module.exports = { wave, fsm, COLS };
