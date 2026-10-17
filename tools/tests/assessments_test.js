// lib/assessments.js accepts the real assessment file and refuses each kind of broken one.
//   node tests/assessments_test.js   (from tools/)
const assert = require("assert");
const { spawnSync } = require("child_process");
const path = require("path");
const { validate } = require("../lib/assessments");
const REG = require("../concepts/registry.json").concepts;
const REAL = require("../concepts/assessments.json");

// the specifications, as check_mastery.js sees them (one child per language)
const specs = {};
for (const l of ["en", "it"]) {
  const r = spawnSync(process.execPath, [path.join(__dirname, "..", "textbook", "check_mastery.js"), "--dump", l], { encoding: "utf8", maxBuffer: 1 << 28 });
  assert.strictEqual(r.status, 0, r.stderr);
  specs[l] = Object.fromEntries(Object.entries(JSON.parse(r.stdout).specs).map(([n, d]) => [n, d.slides]));
}
const clone = (x) => JSON.parse(JSON.stringify(x));
let n = 0;
const t = (name, f) => { f(); n++; };
const fails = (A, re, concepts = REG) => {
  const { errors } = validate(A, concepts, specs);
  assert.ok(errors.some((e) => re.test(e)), `expected an error matching ${re}, got:\n  ${errors.slice(0, 5).join("\n  ") || "(none)"}`);
};

t("the real file is valid", () => assert.deepStrictEqual(validate(REAL, REG, specs).errors, []));
t("an unknown concept fails", () => { const A = clone(REAL); A.items["A05.1"].concepts.push("num.no-such-thing"); fails(A, /A05\.1: unknown concept num\.no-such-thing/); });
t("a missing Italian rubric fails", () => { const A = clone(REAL); delete A.items["A08.2"].rubric.it; fails(A, /A08\.2 rubric: no it text/); });
t("an empty misconception fails", () => { const A = clone(REAL); A.items["A11.1"].misconception.en = " "; fails(A, /A11\.1 misconception: no en text/); });
t("a placeholder fails", () => { const A = clone(REAL); A.items["A13.1"].prompt.en = "TODO: write the question about the clock"; fails(A, /A13\.1 prompt \(en\): placeholder/); });
t("a checkpoint that points to a slide which is not a checkpoint fails", () => { const A = clone(REAL); A.items["CP02.1"].source = "02:5"; fails(A, /CP02\.1: source 02:5 \(en\) is "The machine you are programming"/); });
t("a source that does not exist fails", () => { const A = clone(REAL); A.items["CP02.2"].source = "02:99"; fails(A, /CP02\.2: source 02:99 does not exist/); });
t("an item before the formal lecture of its concept fails", () => { const A = clone(REAL); A.items["A03.1"].concepts = ["isa.formats"]; fails(A, /A03\.1: isa\.formats is understood only in Lecture 19/); });
t("a lecture without exit ticket fails", () => { const A = clone(REAL); delete A.items["A14.1"]; delete A.items["A14.2"]; fails(A, /lecture 14: the exit ticket has 0 items/); });
t("a lecture without outcomes fails", () => { const A = clone(REAL); delete A.lectures["09"]; fails(A, /lecture 09: no outcomes and closing/); });
t("English and Italian outcomes must match in number", () => { const A = clone(REAL); A.lectures["05"].outcomes.it.pop(); fails(A, /lecture 05: English and Italian outcomes differ/); });
t("an understood concept with no check and no exception fails", () => {
  const A = clone(REAL); delete A.items["A24.1"];
  fails(A, /perf\.equation: understood in Lecture 24, but no question, exercise or assessment item checks it/);
});
t("an exception is reported separately and accepted only with a reason in both languages", () => {
  const A = clone(REAL); delete A.items["A24.1"];
  A.exceptions = { "perf.equation": { en: "Assessed in the oral examination only, as a worked example at the board.", it: "Valutato solo all'orale, come esempio svolto alla lavagna." } };
  const r = validate(A, REG, specs);
  assert.deepStrictEqual(r.errors, []); assert.ok(r.exceptions["perf.equation"]);
  A.exceptions["perf.equation"].it = "";
  fails(A, /exception perf\.equation: no it text/);
});
t("a level-use item may not name a concept used only later", () => { const A = clone(REAL); A.items["A01.2"].concepts = ["tool.debugger", "arch.stack"]; fails(A, /A01\.2: arch\.stack is not yet used in Lecture 01/); });
console.log(`assessments: ${n} tests passed`);
