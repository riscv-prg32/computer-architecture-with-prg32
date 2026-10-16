# Learning-status markers: change report (2026-10-16)

Implementation of the brief *ARC12 epistemic learning-status markers*: every lecture now tells students what to
**understand now**, what they may **use now**, and what they will **understand later**, on the slides, in the
notes and in both textbooks, from one set of data checked automatically.

## Architecture found, and differences from the brief

- The repository is `~/devel/riscv-prg32/computer-architecture-with-prg32` (branch `epistemic-markers`, from
  `main` at `e931b7e`, clean). The brief's description of `tools/` matches: specifications in `decks/en` and
  `decks/it`, `build.js`, `lib/`, `decks/plan.js`, `notes.js`, 25 lectures, two decks each, 20-slide cap.
- Generated outputs *are* committed here (the `.pptx` decks, the notes, both book PDFs and Overleaf zips), so
  they were regenerated rather than left out.
- There was no JavaScript test suite; the existing checks are `notes.js`, `textbook/check_decks.js`,
  `textbook/check_editions.py` and the assembly tests in `tests/` (`run_all.sh`). New checks were added next to them.
- Every specification already has an objectives slide (slide 2). It was left unchanged: the legend goes on the
  cover, so no slide was added and every lecture deck keeps its count (456 + 461 slides, as before).

## What was added

| Path | Role |
| --- | --- |
| `tools/concepts/registry.json`, `registry.schema.json` | 102 concepts: id, English/Italian label, intro, use, formal, practice, reason, review |
| `tools/decks/mastery.js` | the status of the slides of the 25 lectures (460 badges on 438 slides), one plan for both languages |
| `tools/lib/mastery.js` | states, labels, style tokens, drawing of the badges, sentences of the notes, summaries |
| `tools/textbook/check_mastery.js` | the checks (registry, marks, destinations, parity, widths, contrast, built decks) and the matrix |
| `tools/concepts/coverage.md` | generated coverage matrix: by lecture, by concept, operational concepts, open issues, contrast |
| `tools/concepts/DESIGN.md` | bilingual design guide and procedure |
| `tools/tests/mastery_test.js` | 13 unit tests (unknown states and concepts fail clearly, texts, destinations) |
| `{en,it}/textbook/code/lNN/status.tex` | the generated box *Learning status of this chapter*, 25 per edition |

Changed: `tools/build.js` (badges, cover legend, notes), `tools/notes.js` (status at the top of each notes file),
`tools/textbook/export_listings.js` (writes `status.tex`), `tools/package.json` (`npm test`, check in
`npm run textbook`), `tools/tests/run_all.sh` and the READMEs (`tools/`, `tools/tests/`, both textbooks);
`{en,it}/textbook/arc12style.sty` (`\masterychip`, `chapstatus`), `{en,it}/textbook/frontmatter/howtoread.tex`
(the legend), the 50 chapters (one `\input` line after the goals). Regenerated: the 100 decks, the 100 notes
files, both PDFs and both zips. No `.S` program, PRG32 ABI, Verm1 source, listing, picture, credit, question
or slide text was changed.

## Pilot: before and after (Lecture 02)

Slide 18 of the specification, *One instruction is one 32-bit number*, deck slide 10.

- **Before.** The slide showed the fields of `addi t1, t1, 1`. Only the lecturer's note said "Do not explain
  the formats now; the point is only that an instruction is data." A student had no way to know whether the
  opcode and funct3 fields were exam material today.
- **After.** Two badges above the title: `UNDERSTAND NOW · an instruction is a number` and
  `UNDERSTAND LATER · instruction formats → Lecture 19` (in Italian `DA COMPRENDERE OGGI · un'istruzione è un
  numero`, `DA COMPRENDERE PIÙ AVANTI · formati delle istruzioni → Lezione 19`). The notes add: "UNDERSTAND NOW:
  an instruction is a number. UNDERSTAND LATER: instruction formats (studied in Lecture 19)." Lecture 19,
  slides 6-8, carries `UNDERSTAND NOW · instruction formats`, and question 30 of Lecture 19 checks it.

Other pilot classifications, each made from the slide and its note: registers *now* with the calling convention
*use → 18* (slide 5, "Preserved across a call?"); the directives, the build commands and the runtime calls *use*
(operational, with the reason in the registry); `andi 255` *use → 08* (slide 14); the stack frame: why `ra` is
saved *now*, the stack *later → 18* (slide 11); address vs value *now*, addressing modes *later → 19* (slide 13);
the forward map (slide 22) *later → Lectures 04–19*, nine concepts each with its destination. Lecture 05: the
warm-up is *now* (it is explained on slide 26 the same day), the runtime calls *use*.

## Progressions made visible

| Concept | Path through the course |
| --- | --- |
| bit masks | 02 use → **08 now** → 12 now (Verm1 steering) |
| the calling convention | 02 use → 12 use → 17 use → **18 now** → 22 now (Verm1 Part 4 contracts, debugger) |
| registers | 01 later → **02 now** |
| the adder | 02 later → **09 now** |
| shifts as multiplications | 04 use → **05 now** → 07 now |
| instruction formats | 02 later → 07 later → **19 now** |
| finite-state machines | 11 later → **13 now** → 17, 22 now (Verm1 states) |

Concepts deferred for good are only the tools (`tool.prg32-cli`, `tool.debugger`, `prg32.api`, `prg32.program`,
`asm.directives`), each with its reason in the registry.

## Checks and results (2026-10-16)

| Command | Result |
| --- | --- |
| `node build.js` | 100 decks built; no badge too wide, no text overflow |
| `node notes.js` | every slide has its note; 917 notes per language |
| `node textbook/check_decks.js` | 456 + 461 slides, every lecture deck within 20, 0 differences English/Italian |
| `npm test` (`mastery_test.js`, `check_mastery.js`) | 13 tests passed; 0 failures, 30 warnings (below) |
| `npm run textbook` | exports, appendices, credits, both checks: 0 failures (15 number hints, as before) |
| `latexmk -pdf main.tex`, both editions | 462 and 470 pages, no error, no undefined reference; both zips compile from a clean unzip |
| `tests/run_all.sh quick` | all checks passed (encodings, listings, vectors, cartridges, Verm1 steps, Store bundle) |

`check_mastery.js` fails on: unknown state or concept, a badge on a missing, dropped or section slide, on a
question or an exercise, more than two badges, a deferral that does not point to a later formal lecture, a
registry `intro`/`use`/`formal` that disagrees with the marks, a `practice` reference that is not a question,
a never-studied concept without its reason, different slide kinds in the two languages, a badge too wide in
either language, a colour pair below WCAG AA, and, in the 100 built decks, a missing badge or any other shape in
the band of the badges. The 30 warnings are 26 concepts understood without a question or exercise that checks
them (listed in `coverage.md`), and the 4 open issues below.

## Visual QA log

Rendered with Quick Look (no LibreOffice on this Mac; Quick Look substitutes Calibri and Cambria, so widths are
approximate and the real look in PowerPoint was not inspected).

| Deck | Slides | Layouts | Outcome |
| --- | --- | --- | --- |
| en 02 lecture | 1, 3, 4, 6, 8, 10, 14 | cover, cards, table, draw, bullets+figure, quiz | first render: dotted bar of *later* indistinguishable from its frame; fixed with a dashed frame and three dots; widths re-estimated; after: clear |
| en 05 code | 3 | listing with callouts | ok |
| en 24 lecture | 5, 6 | table, steps | ok |
| it 00 lecture | 1, 4, 16 | dark cover, dark statement slides | ok on dark |
| it 01 code | 14, 16 | listing, numbered list; two badges, the widest Italian pair | ok (an Italian label was shortened after the checker flagged 6.3 in) |
| it 02 code | 1, 5, 8, 12 | code cover with legend, walk-through, program page, generated host guide | ok |
| it 17 code | 8 | Verm1 CHANGED listing, two badges | ok |
| it 22 lecture | 5, 9 | bullets with box, bullets with screenshot | ok |
| en book | p. 17, p. 35 | reading guide, chapter box | ok; badges legible at 80 and 300 dpi |

## Needs review (nothing changed: the decision is the author's)

1. **Lecture 02, slide 11 (note):** "the lectures on memory and on subroutines" — there is no lecture on
   subroutines; the stack is Lecture 18, slides 20-21. Proposed: "The stack is treated formally in Lecture 18."
2. **Lecture 22, slide 3:** credits "the M extension: divu and remu" to Lecture 18, which does not treat them
   (they are listed in Lecture 05, slide 27, and the M extension is read in Lecture 06, slide 26). Lecture 22 was
   therefore marked as the formal treatment of quotient and remainder.
3. **Lecture 07, slide 24 (note):** promises compressed instructions in Lecture 19, where they are only
   mentioned (slide 4 note, question 31, conclusions).
4. **Lecture 18, slide 16:** the formal home of the calling convention gives the register roles "by
   convention" and its note points back to Lecture 02; no slide states the caller-saved / callee-saved rule.

## Remaining risks and limits

- Classification is a pedagogical judgement made by reading the slides: it should be read once by the lecturer,
  lecture by lecture, with `coverage.md`. Lectures 00, 03, 16, 20 and 21 are mostly descriptive and carry fewer
  badges by design (history, devices: context without a badge).
- 26 concepts are taught *now* without a question or exercise that checks them; that is a gap of the course, not
  of the markers, and is listed in `coverage.md`.
- Badges are positioned by measured estimate, not by PowerPoint's own layout; real Calibri is narrower than the
  estimate, so the risk is extra padding, not clipping.
- Hand edits made in PowerPoint are still lost at a rebuild: no deck had been edited by hand before this run.

## Regenerating

```bash
cd tools
npm ci
node build.js && node notes.js
npm run textbook        # includes check_mastery.js
npm test
cd ../en/textbook && latexmk -pdf main.tex     # and ../../it/textbook; then refresh the PDF copy and the zip
```
