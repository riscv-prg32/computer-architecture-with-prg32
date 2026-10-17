# development-2 remediation: final report (17 October 2026)

Branch `remediation/development-2`, from base `1dab30b` (development-2). See `development2-baseline.md` for the starting point,
`remediation-issues.json` for every issue and its status, `remediation-matrix.md` for the per-lesson tables and
`visual-qa-manifest.md` for the rendered evidence. Raw logs are in `logs/`.

**Three words are used carefully below.** *Implemented*: the change is in the sources and generated artefacts. *Verified*:
a test, a checker or an inspection named in the row confirms it. *Effective in class*: nobody knows yet; see G16.

## Before and after

| Measure | Before (1dab30b) | After |
| --- | --- | --- |
| Warnings of `check_mastery.js` | 27 (+1 in an environment without `jszip`: built decks silently skipped) | **0** |
| UNDERSTAND NOW concepts with no check | 27 of 100 | **0** (73 by a deck question or exercise, 27 by an assessment item; 0 exceptions) |
| Assessment items with bilingual prompt, rubric and misconception | 0 | **52** (49 exit-ticket items, 2 slide checkpoints, 1 extra check) |
| Lectures with an exit ticket, outcomes and a closing, en and it | 0 / 25 | **25 / 25** |
| Lecture 02 headline outcomes | 6, plus everything on the slides | **3**, each with a visible check; 2 in-lecture checkpoints; a *not expected yet* map; a closing map |
| Built decks inspected structurally | badges only (and skippable) | **100 / 100 packages, 1,852 slides**, failure on a missing tool or deck |
| Negative tests | 0 | **22** (14 on assessments, 8 damaged decks) + 1 intact control; broken listing reference also caught |
| Deferred concepts with an unbridged gap > 9 lectures | 6 | **0** (6 retrieval bridges) |
| Slides per language | 463 + 461 | 463 + 463 (two Lecture 02 slides moved to its Lab deck) |
| Numeric hints of `check_editions.py` | 16, unexplained | 16, each classified as a valid translation difference |
| Instructor and student instruments | none | 9 documents per language in `docs/teaching` |

## Changes, by priority

**P0, assessment.** `tools/concepts/assessments.json` (outcomes, closings, 52 items); `tools/lib/assessments.js` (validator:
referential integrity, chronology, bilingual texts, placeholders, 1-2 exit items per lecture, coverage of every understood
concept, exceptions with reasons reported separately); `check_mastery.js` turns the old warning into a failure;
`tests/assessments_test.js` (14 tests, 13 of them deliberately broken inputs). Instructor rubrics and student tickets
are generated (`docs/teaching/*/rubrics.md`, `exit-tickets.md`); the last-slide notes of each lecture deck carry the ticket.

**P0, Lecture 02.** Specifications en/it, plan, marks, registry and notes: learning contract (3 outcomes, prerequisites,
what is used without being understood), checkpoint 1 after the contract of three functions, checkpoint 2 as a trace with
rows to fill, *not expected yet* table, closing concept map; the stack frame and the debugger slides moved to the Lab deck
(they are where step 2 and step 3 use them). Facilitation guide en/it with a 90-minute plan, pauses, misconceptions and
recovery paths. Textbook chapter 2 references updated.

**P0, built decks.** `jszip` declared and locked; `check_mastery.js` fails without it or without a deck, with a labelled
`--source-only` mode; `textbook/check_pptx.js` (new) inspects every package; `tests/pptx_test.js` (new); `npm test`,
`test:source`, `verify` scripts; `.github/workflows/verify.yml` (new).

**P1.** Code→Lab parity checked for 50 pairs (no loss); Verm1 milestone guides en/it; `concepts/bridges.json` and
`lib/roadmap.js` (bridges, gap check, roadmaps and closings in notes, decks and textbook); glossary reviewed in context, one
semantic conflict fixed (interpreter/emulator, Lecture 00); confusable pairs added to *Starting from Zero*; the 16 edition
hints classified; `check_editions.py` now checks that every listing the book reads exists; classroom instruments (status
guide, facilitation template, pulse survey, pilot protocol with decision rubric) en/it.

## Acceptance matrix

| ID | Gate | Status | Proof |
| --- | --- | --- | --- |
| G01 | Baseline reproduced and divergences documented | PASS | `development2-baseline.md`; `logs/baseline-*.txt`; divergence (jszip, PRG32_HOME) explained |
| G02 | All current UNDERSTAND NOW gaps assessed or individually justified | PASS | `node textbook/check_mastery.js`: "52 assessment items, 0 exception(s); 0 warning(s), 0 failure(s)" (`logs/final-verify.txt`); ledger entries P0-ASSESS-* |
| G03 | 25/25 bilingual exit tickets and instructor rubrics | PASS | validator rule "1 or 2 exit items per lecture", en/it texts required; `docs/teaching/{en,it}/exit-tickets.md`, `rubrics.md` |
| G04 | Lecture 02 novice-first contract and checkpoints | PASS (implemented, verified structurally and visually) | slides 2, 8, 14, 15, 16 of the lecture deck rendered en/it (`visual-qa/`); items CP02.1, CP02.2 point at checkpoint slides and are validated; `docs/teaching/*/lesson02-facilitation.md`. Whether a student with no background can follow it: see G16 |
| G05 | 100/100 compiled PPTX checked without silent skip | PASS | `check_pptx: 100/100 packages opened, 1852 slides inspected; 0 failure(s)`; `pptx: 9 tests passed (one intact copy, 8 damaged)`; missing jszip or deck now fails |
| G06 | Representative rendered slides reviewed en/it | PASS (sample) | 26 slide renders and 6 book pages in `visual-qa/`, two defects found and fixed; the other slides are checked structurally only |
| G07 | Code→Lab parity matrix complete, no unexplained loss | PASS | `remediation-matrix.md` §1-2: 48 pairs identical, L02 en/it +2 moved slides, 0 lost runs, 0 lost identifiers |
| G08 | PRG32/Verm1 tests run or blockers documented | PASS | `bash tools/tests/run_all.sh` (full, including the scripted Verm1 player) and `quick`: "all checks passed" (`logs/final-run-all-full.txt`, `final-run-all-quick.txt`), toolchain and commits recorded; the physical board was not tested (not available to the automatic tests) |
| G09 | Verm1 milestones 07/12/17/22 scaffolded and referenced | PASS | `docs/teaching/{en,it}/verm1-milestones.md`: prerequisites, checkpoints taken from the "Run it" slides and the tests, common mistakes, rescue path, concept ids, exit check |
| G10 | Deferred concepts linked to future lessons and bridged | PASS | `roadmap.check()` in `check_mastery.js` (UNDERSTAND LATER pointing backwards already failed); 6 bridges; with the bridges removed the check reports the 6 gaps |
| G11 | 25/25 roadmaps, prerequisite bridges and closings | PASS | notes headers (`node notes.js`), cover and last-slide notes of the decks, `code/lNN/status.tex` and `closing.tex` in both books, `docs/teaching/*/roadmaps.md` |
| G12 | 41 terms context-reviewed, IT/EN parity | PASS | `terms_test.js` en/it; manual review table in `remediation-matrix.md` §3; 1 high-severity issue fixed |
| G13 | 16 edition hints classified | PASS | `remediation-matrix.md` §4: all valid translation differences, none changed |
| G14 | Existing tests, new negative tests and CI checks pass | PASS locally; CI NOT VERIFIED | `npm run verify` exit 0 (`logs/final-verify.txt`); the GitHub workflow has not run yet (it runs on the first push) |
| G15 | Instructor guides and pilot instruments ready | PASS | `docs/teaching/{en,it}/`: learning-status-guide, facilitation-template, lesson02-facilitation, verm1-milestones, pulse-survey, pilot-protocol |
| G16 | Student learning impact | **NOT VERIFIED — requires classroom data** | no classroom measurement exists; the pilot protocol says how to obtain one |

**Completion.** Technical and documentary remediation: complete for G01-G15, with two qualifications: the CI workflow has not
run yet (G14), and visual review covers a sample (G06). Effect on learning: not known (G16).

## Remaining risks

- The code slides of the longest Verm1 listings (e.g. Lecture 17, Lab slide 24) use the smallest code font of the course:
  legible on screen, at the limit when projected in a large room. Not changed; the textbook prints the same listings.
- Exit tickets are new and untested with students: some may take longer than four minutes (Lectures 20 and 24 involve arithmetic).
- The roadmap's *builds on* list is derived automatically (concepts explained earlier that appear again); it can be
  shorter than an instructor would write.
- Several lectures remain at the 20-slide limit; any future addition must move a slide to the Lab deck or the textbook.

## Reproduce

```bash
cd tools && npm ci
npm run verify                                   # build, notes, teaching docs, all tests, textbook pipeline
cd ../en/textbook && latexmk -pdf main.tex       # and in ../../it/textbook
cd ../.. && PRG32_HOME=~/devel/riscv-prg32/PRG32 \
  PRG32QT_HEADLESS=~/devel/riscv-prg32/PRG32-QT/build-macos/prg32qt-headless \
  PATH="$(ls -d ~/.espressif/tools/riscv32-esp-elf/*/riscv32-esp-elf/bin | head -1):$PATH" \
  bash tools/tests/run_all.sh                    # assembly, lecture programs, Verm1 (needs the toolchain and PRG32)
```
