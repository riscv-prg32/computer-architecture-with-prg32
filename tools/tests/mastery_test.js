// Unit tests of lib/mastery.js: the parsing of the marks fails clearly on bad input, and the badges say what they
// should.  node tests/mastery_test.js   (from tools/)
const assert = require("assert");
const M = require("../lib/mastery");
let n = 0;
const t = (name, f) => { f(); n++; };

t("states and concepts are parsed", () => {
  assert.deepStrictEqual(M.parseMark("now asm.register", "x"), { state: "understand-now", concepts: ["asm.register"] });
  assert.deepStrictEqual(M.parseMark("later isa.formats,arch.stack", "x").concepts, ["isa.formats", "arch.stack"]);
});
t("an unknown state fails and names the allowed ones", () => assert.throws(() => M.parseMark("soon asm.register", "L02"), /unknown state "soon" \(allowed: now, use, later\)/));
t("an unknown concept fails and says where to add it", () => assert.throws(() => M.parseMark("now asm.registers", "L02"), /unknown concept "asm.registers".*registry.json/));
t("a malformed mark fails", () => assert.throws(() => M.parseMark("now", "L02"), /a mark is/));
t("a slide outside the specification fails", () => assert.throws(() => M.lectureMarks("02", 10), /no slides/));
t("a deferred badge points to the formal lecture", () => {
  const c = M.chipText("en", "02", M.parseMark("later isa.formats", "x"));
  assert.deepStrictEqual(c, { head: "UNDERSTAND LATER", what: "instruction formats", to: "Lecture 19" });
  assert.strictEqual(M.chipText("it", "02", M.parseMark("later isa.formats", "x")).to, "Lezione 19");
});
t("a badge USE NOW shows the lecture that explains the concept, if any", () => {
  assert.strictEqual(M.chipText("en", "02", M.parseMark("use abi.calling-convention", "x")).to, "Lecture 18");
  assert.strictEqual(M.chipText("en", "02", M.parseMark("use tool.prg32-cli", "x")).to, "");
});
t("a badge UNDERSTAND NOW never points elsewhere", () => assert.strictEqual(M.chipText("en", "18", M.parseMark("now abi.calling-convention", "x")).to, ""));
t("many concepts: a range of lectures and no single label", () => {
  const c = M.chipText("en", "02", M.parseMark("later num.hex,logic.adder,cpu.cycle", "x"));
  assert.strictEqual(c.what, ""); assert.strictEqual(c.to, "Lectures 04–19");
});
t("the sentence of the notes names every concept and its lecture", () => {
  assert.strictEqual(M.sentence("en", "02", M.parseMark("use abi.calling-convention,prg32.api", "x")),
    "USE NOW: the calling convention (studied in Lecture 18); the PRG32 runtime calls (used, not studied, in this course).");
});
t("the summary of Lecture 02 lists each concept once, in the right state", () => {
  const s = M.summary({ n: "02", slides: { length: 27 } });
  assert.ok(s["understand-now"].includes("asm.register"));
  assert.ok(s["use-now"].includes("abi.calling-convention") && !s["use-now"].includes("asm.register"));
  assert.ok(s["understand-later"].includes("isa.formats") && s["understand-later"].includes("arch.stack"));
});
t("both languages label every state", () => { for (const l of ["en", "it"]) for (const st of M.ORDER) assert.ok(M.LABEL[l][st]); });
t("the Italian labels are those of the course", () => assert.deepStrictEqual(M.ORDER.map((s) => M.LABEL.it[s]), ["DA COMPRENDERE OGGI", "DA UTILIZZARE OGGI", "DA COMPRENDERE PIÙ AVANTI"]));
console.log(`mastery: ${n} tests passed`);
