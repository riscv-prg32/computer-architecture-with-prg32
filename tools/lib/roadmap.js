// The roadmap and the closing of every lecture, and the retrieval bridges of the long deferrals.
// Sources: ../concepts/assessments.json (outcomes, closing, exit ticket), ../concepts/bridges.json, the registry and
// decks/mastery.js (through lib/mastery.js).  Used by notes.js (header of the notes), textbook/export_listings.js
// (code/lNN/status.tex and closing.tex) and textbook/teaching_docs.js (docs/teaching); checked by check().
const M = require("./mastery");
const A = require("../concepts/assessments.json");
const B = require("../concepts/bridges.json").bridges;
const MAX_GAP = 9;   // a deferred concept is met again at least every MAX_GAP lectures until it is explained

const S = {
  en: { roadmap: "Roadmap", today: "Today's outcomes", builds: "Builds on", next: "Next", last: "This is the last lecture of the course.",
    lecture: "Lecture", bridge: "Bridge", recall: "Recall", closing: "Closing thread", exit: "Exit ticket", exitHow: "two to four minutes, alone, on paper",
    nothing: { "00": "nothing: it is the first lecture", "01": "Lecture 00, and Starting from Zero for a reader who has never programmed", any: "only what Lecture 01 set up" } },
  it: { roadmap: "Percorso", today: "I risultati di oggi", builds: "Si appoggia su", next: "Prossimo passo", last: "È l'ultima lezione del corso.",
    lecture: "Lezione", bridge: "Ponte", recall: "Richiamo", closing: "Il filo della lezione", exit: "Biglietto d'uscita", exitHow: "da due a quattro minuti, da soli, su carta",
    nothing: { "00": "niente: è la prima lezione", "01": "la Lezione 00, e Partire da zero per chi non ha mai programmato", any: "solo ciò che ha preparato la Lezione 01" } },
};
const lec = (n) => A.lectures[n];
const lower = (s) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const exitItems = (n) => Object.entries(A.items).filter(([, it]) => it.lecture === n && it.kind === "exit").map(([id, it]) => Object.assign({ id }, it));
const bridgesAt = (n) => Object.entries(B).filter(([, b]) => b.lecture === n).map(([id, b]) => Object.assign({ id }, b));

// the concepts explained in an earlier lecture that this one relies on (seen again today, in any state)
function buildsOn(lang, n, spec) {
  const sum = M.summary(spec);
  const ids = [...new Set([...sum["understand-now"], ...sum["use-now"], ...sum["understand-later"]])]
    .filter((c) => M.CONCEPTS[c].formal && M.CONCEPTS[c].formal < n);
  return ids.slice(0, 5).map((c) => `${M.CONCEPTS[c].label[lang]} (${S[lang].lecture} ${M.CONCEPTS[c].formal})`);
}
const nextOf = (lang, n, titles) => { const k = String(+n + 1).padStart(2, "0"); return titles[k] ? `${S[lang].lecture} ${k}, ${titles[k]}` : null; };

// plain text, for the header of the notes
function notesText(lang, spec, titles) {
  const n = spec.n, T = S[lang], L = lec(n), b = buildsOn(lang, n, spec), nx = nextOf(lang, n, titles);
  const out = [`${T.roadmap}. ${T.today}: ${L.outcomes[lang].map((o, i) => `(${i + 1}) ${lower(o)}`).join("; ")}. ${T.builds}: ${b.length ? b.join("; ") : T.nothing[n] || T.nothing.any}. ${nx ? `${T.next}: ${nx}.` : T.last}`];
  for (const br of bridgesAt(n)) out.push(`${T.bridge}. ${br.then[lang]} ${br.now[lang]} ${br.next[lang]} ${T.recall}: ${br.recall[lang]}`);
  out.push(`${T.closing}: ${L.closing[lang]}`);
  return out.join("\n\n");
}

// checks: every lecture has its data (assessments.js validates the rest), every bridge is well placed, no long gap
function check(titlesOk) {
  const errors = [];
  const LANGS = ["en", "it"];
  for (const [id, b] of Object.entries(B)) {
    if (!/^B\d\d$/.test(id) || id.slice(1) !== b.lecture) errors.push(`bridge ${id}: the id must be B and its lecture`);
    for (const k of ["then", "now", "next", "recall"]) for (const l of LANGS) if (!b[k] || !b[k][l] || b[k][l].trim().length < 20) errors.push(`bridge ${id}: no ${l} ${k}`);
    for (const c of b.concepts || []) {
      const C = M.CONCEPTS[c];
      if (!C) { errors.push(`bridge ${id}: unknown concept ${c}`); continue; }
      if (!C.formal || C.formal <= b.lecture) errors.push(`bridge ${id}: ${c} is explained in Lecture ${C.formal || "none"}, not after the bridge`);
      if (C.intro > b.lecture) errors.push(`bridge ${id}: ${c} is first met in Lecture ${C.intro}, after the bridge`);
    }
  }
  // the gaps: every lecture where a deferred concept is met (a badge or a bridge) before its formal lecture
  for (const [c, C] of Object.entries(M.CONCEPTS)) {
    if (!C.formal || C.intro >= C.formal) continue;
    const touch = new Set([C.intro, C.formal]);
    for (const [n, marks] of Object.entries(M.PLAN.lectures)) for (const v of Object.values(marks)) for (const m of [].concat(v)) {
      const parts = String(m).split(" ");
      if (parts[1] && parts[1].split(",").includes(c) && n < C.formal) touch.add(n);
    }
    for (const b of Object.values(B)) if (b.concepts.includes(c)) touch.add(b.lecture);
    const seq = [...touch].map(Number).sort((a, b) => a - b);
    for (let i = 1; i < seq.length; i++) if (seq[i] - seq[i - 1] > MAX_GAP)
      errors.push(`${c}: met in Lecture ${String(seq[i - 1]).padStart(2, "0")}, then not again until Lecture ${String(seq[i]).padStart(2, "0")}: add a bridge in tools/concepts/bridges.json`);
  }
  return errors;
}

module.exports = { S, MAX_GAP, lec, exitItems, bridgesAt, buildsOn, nextOf, notesText, check, A, B };
