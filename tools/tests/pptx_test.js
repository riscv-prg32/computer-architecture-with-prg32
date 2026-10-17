// textbook/check_pptx.js passes on real built decks and fails on broken ones.  It copies the four decks of Lecture 02
// into a temporary folder, damages one thing at a time and runs the checker there.
//   node tests/pptx_test.js   (from tools/, after node build.js)
const assert = require("assert");
const fs = require("fs"), os = require("os"), path = require("path");
const { spawnSync } = require("child_process");
const JSZip = require("jszip");
const ROOT = path.resolve(__dirname, "..", "..");
const CHECK = path.join(__dirname, "..", "textbook", "check_pptx.js");
const decks = { en: "02-Computer_Architecture-First_Contact_with_RISC-V_Assembly", it: "02-Architettura_dei_Calcolatori-Primo_Contatto_con_Assembly_RISC-V" };

const fresh = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "arc12-pptx-"));
  for (const [l, f] of Object.entries(decks)) {
    fs.mkdirSync(path.join(dir, l, "slides"), { recursive: true });
    for (const s of ["", "-Lab"]) fs.copyFileSync(path.join(ROOT, l, "slides", f + s + ".pptx"), path.join(dir, l, "slides", f + s + ".pptx"));
  }
  return dir;
};
const run = (dir) => spawnSync(process.execPath, [CHECK, "--root", dir, "--lecture", "02"], { encoding: "utf8" });
const edit = async (file, f) => { const z = await JSZip.loadAsync(fs.readFileSync(file)); await f(z); fs.writeFileSync(file, await z.generateAsync({ type: "nodebuffer" })); };
let n = 0;
const t = async (name, damage, re) => {
  const dir = fresh();
  try {
    if (damage) await damage(dir);
    const r = run(dir);
    if (!damage) assert.strictEqual(r.status, 0, `${name}: expected a pass\n${r.stdout}`);
    else { assert.notStrictEqual(r.status, 0, `${name}: expected a failure\n${r.stdout}`); assert.match(r.stdout, re, `${name}\n${r.stdout}`); }
    n++;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
};
const en = (dir, lab = "") => path.join(dir, "en", "slides", decks.en + lab + ".pptx");
const it = (dir, lab = "") => path.join(dir, "it", "slides", decks.it + lab + ".pptx");

(async () => {
  await t("intact decks pass", null);
  await t("a deck that was not built", (d) => fs.unlinkSync(it(d, "-Lab")), /-Lab\.pptx: not built/);
  await t("a file that is not a package", (d) => fs.writeFileSync(en(d), "not a zip"), /not a valid ZIP package/);
  await t("a slide removed from the package", (d) => edit(en(d), (z) => z.remove("ppt/slides/slide5.xml")), /slide 5 missing/);
  await t("a truncated slide", (d) => edit(en(d), async (z) => { const x = await z.file("ppt/slides/slide3.xml").async("string"); z.file("ppt/slides/slide3.xml", x.slice(0, x.length >> 1)); }), /slide 3 is not well-formed XML/);
  await t("a title that changed", (d) => edit(en(d), async (z) => { const x = await z.file("ppt/slides/slide8.xml").async("string"); z.file("ppt/slides/slide8.xml", x.replace("Checkpoint 1", "Something else")); }), /slide 8 does not show its title/);
  await t("a learning-status badge removed", (d) => edit(it(d), async (z) => { const x = await z.file("ppt/slides/slide4.xml").async("string"); z.file("ppt/slides/slide4.xml", x.replace(/DA COMPRENDERE OGGI/, "")); }), /slide 4 shows 0 learning-status badge/);
  await t("a badge icon removed", (d) => edit(en(d), async (z) => { const x = await z.file("ppt/slides/slide14.xml").async("string"); z.file("ppt/slides/slide14.xml", x.replace(/<p:pic>[\s\S]*?y="128016"[\s\S]*?<\/p:pic>/, "")); }), /slide 14 has 0 badge icon/);
  await t("the notes of a slide lost", (d) => edit(it(d), async (z) => { const x = await z.file("ppt/notesSlides/notesSlide6.xml").async("string"); z.file("ppt/notesSlides/notesSlide6.xml", x.replace(/<a:t>[^<]*<\/a:t>/g, "<a:t></a:t>")); }), /slide 6 does not carry its note/);
  console.log(`pptx: ${n} tests passed (one intact copy, ${n - 1} damaged)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
