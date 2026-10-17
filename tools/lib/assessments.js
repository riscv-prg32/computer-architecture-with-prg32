// The formative assessment of the course: ../concepts/assessments.json, checked against the registry and the specifications.
//
//   validate(A, concepts, specs) -> { errors: [...], covered: {concept: [where...]}, exceptions: {concept: reason} }
//
// A: the parsed assessments.json.  concepts: the registry (id -> {formal, use, practice, ...}).  specs: for each language,
// lecture -> list of the slides of the specification, [{t, title}], numbered from 2 as everywhere else (index 0 = slide 2).
// Every rule below is a failure, never a warning: a missing file, a broken reference, a placeholder or an empty rubric
// must not pass.
const LANGS = ["en", "it"];
const LECTURES = Array.from({ length: 25 }, (_, i) => String(i).padStart(2, "0"));
const KINDS = ["exit", "checkpoint", "check"];
const PLACEHOLDER = /\b(TODO|TBD|FIXME|XXX|lorem ipsum)\b|\?\?\?|^\s*\.\.\.\s*$/i;
const CHECKPOINT = { en: /^Checkpoint \d/, it: /^Punto di controllo \d/ };
const TEXTS = ["prompt", "rubric", "misconception"];

function text(errors, where, o, min) {
  if (!o || typeof o !== "object") { errors.push(`${where}: missing`); return; }
  for (const l of LANGS) {
    const s = o[l];
    if (typeof s !== "string" || !s.trim()) errors.push(`${where}: no ${l} text`);
    else if (s.trim().length < min) errors.push(`${where} (${l}): too short to be meaningful`);
    else if (PLACEHOLDER.test(s)) errors.push(`${where} (${l}): placeholder text`);
  }
}

function validate(A, concepts, specs) {
  const errors = [], covered = {}, exceptions = {};
  if (!A || typeof A !== "object") return { errors: ["assessments.json: not an object"], covered, exceptions };
  for (const k of Object.keys(A)) if (!["description", "lectures", "items", "exceptions"].includes(k)) errors.push(`assessments.json: unknown key ${k}`);
  const lectures = A.lectures || {}, items = A.items || {};
  // ---- lectures: outcomes and closing
  for (const n of LECTURES) {
    const L = lectures[n];
    if (!L) { errors.push(`lecture ${n}: no outcomes and closing`); continue; }
    for (const l of LANGS) {
      const o = L.outcomes && L.outcomes[l];
      if (!Array.isArray(o) || o.length < 2 || o.length > 4) errors.push(`lecture ${n}: ${l} outcomes must be 2 to 4, found ${o ? o.length : 0}`);
      else o.forEach((s, i) => { if (typeof s !== "string" || s.trim().length < 15 || PLACEHOLDER.test(s)) errors.push(`lecture ${n}: ${l} outcome ${i + 1} is empty or a placeholder`); });
    }
    if (L.outcomes && L.outcomes.en && L.outcomes.it && L.outcomes.en.length !== L.outcomes.it.length) errors.push(`lecture ${n}: English and Italian outcomes differ in number`);
    text(errors, `lecture ${n} closing`, L.closing, 40);
  }
  for (const n of Object.keys(lectures)) if (!LECTURES.includes(n)) errors.push(`lectures: unknown lecture ${n}`);
  // ---- items
  const exitCount = Object.fromEntries(LECTURES.map((n) => [n, 0]));
  for (const [id, it] of Object.entries(items)) {
    const m = /^(A|CP)(\d\d)\.(\d+)$/.exec(id);
    if (!m) { errors.push(`item ${id}: bad id (A or CP, lecture, dot, number)`); continue; }
    if (it.lecture !== m[2]) errors.push(`item ${id}: lecture ${it.lecture} does not match its id`);
    if (!LECTURES.includes(it.lecture)) { errors.push(`item ${id}: unknown lecture ${it.lecture}`); continue; }
    if (!KINDS.includes(it.kind)) errors.push(`item ${id}: kind must be one of ${KINDS.join(", ")}`);
    if ((it.kind === "checkpoint") !== (m[1] === "CP")) errors.push(`item ${id}: checkpoints, and only they, are named CP`);
    if (it.kind === "exit") exitCount[it.lecture]++;
    for (const k of Object.keys(it)) if (!["lecture", "kind", "concepts", "level", "source", ...TEXTS].includes(k)) errors.push(`item ${id}: unknown field ${k}`);
    if (it.level !== undefined && it.level !== "use") errors.push(`item ${id}: level, if given, is "use"`);
    for (const t of TEXTS) text(errors, `item ${id} ${t}`, it[t], 20);
    for (const l of LANGS) if (it.prompt && it.rubric && it.prompt[l] && it.prompt[l] === it.rubric[l]) errors.push(`item ${id} (${l}): the rubric repeats the prompt`);
    if (!Array.isArray(it.concepts) || !it.concepts.length) { errors.push(`item ${id}: no concepts`); continue; }
    for (const c of it.concepts) {
      const C = concepts[c];
      if (!C) { errors.push(`item ${id}: unknown concept ${c}`); continue; }
      if (it.level === "use") {
        if (!C.use || C.use > it.lecture) errors.push(`item ${id}: ${c} is not yet used in Lecture ${it.lecture}`);
      } else {
        if (!C.formal) errors.push(`item ${id}: ${c} is never studied (formal null): mark the item level "use"`);
        else if (C.formal > it.lecture) errors.push(`item ${id}: ${c} is understood only in Lecture ${C.formal}, after the item`);
        else (covered[c] = covered[c] || []).push(id);
      }
    }
    if (it.kind === "checkpoint" && !it.source) errors.push(`item ${id}: a checkpoint names its slide (source)`);
    if (it.source !== undefined) {
      const s = /^(\d\d):(\d+)$/.exec(it.source);
      if (!s || s[1] !== it.lecture) { errors.push(`item ${id}: source ${it.source} is not a slide of Lecture ${it.lecture}`); continue; }
      for (const l of LANGS) {
        const slide = specs[l] && specs[l][s[1]] && specs[l][s[1]][+s[2] - 2];
        if (!slide) { errors.push(`item ${id}: source ${it.source} does not exist (${l})`); continue; }
        const ok = slide.t === "quiz" || slide.t === "exercise" || CHECKPOINT[l].test(slide.title || "");
        if (!ok) errors.push(`item ${id}: source ${it.source} (${l}) is "${slide.title}", not a question, an exercise or a checkpoint`);
      }
    }
  }
  for (const n of LECTURES) if (exitCount[n] < 1 || exitCount[n] > 2) errors.push(`lecture ${n}: the exit ticket has ${exitCount[n]} items, it must have 1 or 2`);
  // ---- coverage of the concepts understood in a lecture
  for (const [c, r] of Object.entries(A.exceptions || {})) {
    if (!concepts[c]) errors.push(`exception ${c}: unknown concept`);
    text(errors, `exception ${c}`, r, 40);
    exceptions[c] = r;
  }
  for (const [c, C] of Object.entries(concepts)) {
    if (!C.formal) continue;
    const deck = (C.practice || []).length, own = (covered[c] || []).length;
    if (!deck && !own && !exceptions[c]) errors.push(`${c}: understood in Lecture ${C.formal}, but no question, exercise or assessment item checks it, and no exception explains why`);
    if (exceptions[c] && (deck || own)) errors.push(`exception ${c}: the concept is assessed, the exception is not needed`);
  }
  return { errors, covered, exceptions };
}

module.exports = { validate, LECTURES, KINDS };
