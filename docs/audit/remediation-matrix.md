# Remediation matrix: lessons, languages, Code→Lab, glossary, editions

Generated tables are reproduced from `tools/concepts/assessments.json`, `bridges.json`, and a comparison of the built decks
(script described below); the dispositions in the last two sections are the result of a manual review.

## 1. Per lesson, both languages

*Outcomes*: the 2-4 headline outcomes of the lecture (`assessments.json`, validated equal in number en/it). *Exit ticket*:
items of kind exit (prompt, rubric and misconception in English and Italian; student prompts in `docs/teaching/*/exit-tickets.md`,
rubrics in `rubrics.md`). *Bridges*: retrieval bridges printed in that lecture. *Code→Lab*: the code deck at `b9f4106`
(`-Code` / `-Codice`) against the current `-Lab` deck: slides and text runs (every `<a:t>` of every slide, compared as a
multiset), and the code identifiers and numbers of the notes.

| Lesson | Outcomes en/it | Exit ticket | Other items | Bridges | Code→Lab en (slides, runs) | Code→Lab it | Notes: ids/numbers lost |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 00 Course Introduction | 2/2 | A00.1, A00.2 | - | - | 10→10, 192→192 | 10→10, 192→192 | 0 |
| 01 PRG32 and PRG32-QT: Setting Up Your Workshop | 2/2 | A01.1, A01.2 | - | - | 28→28, 542→542 | 28→28, 542→542 | 0 |
| 02 First Contact: RISC-V Assembly on PRG32 | 3/3 | A02.1, A02.2 | CP02.1, CP02.2 | - | 16→18, 333→371, +36 (moved in) | 16→18, 333→371, +36 (moved in) | 0 |
| 03 History of Computing | 3/3 | A03.1, A03.2 | - | - | 13→13, 251→251 | 13→13, 251→251 | 0 |
| 04 Representing Digital Information | 3/3 | A04.1, A04.2 | A04.3 | B04 | 13→13, 255→255 | 13→13, 255→255 | 0 |
| 05 Number Representation: Integers | 3/3 | A05.1, A05.2 | - | - | 20→20, 422→422 | 20→20, 422→422 | 0 |
| 06 Number Representation: Real Numbers | 3/3 | A06.1, A06.2 | - | - | 14→14, 262→262 | 14→14, 262→262 | 0 |
| 07 Verm1, Part 1: A Head That Crosses the World | 3/3 | A07.1, A07.2 | - | B07 | 18→18, 365→365 | 18→18, 365→365 | 0 |
| 08 Elements of Boolean Algebra | 3/3 | A08.1, A08.2 | - | - | 20→20, 408→408 | 20→20, 408→408 | 0 |
| 09 Elements of Boolean Algebra | 3/3 | A09.1, A09.2 | - | - | 16→16, 322→322 | 16→16, 322→322 | 0 |
| 10 Introduction to Electronics and Digital Electronics | 3/3 | A10.1, A10.2 | - | B10 | 14→14, 262→262 | 14→14, 262→262 | 0 |
| 11 Combinational Machines | 3/3 | A11.1, A11.2 | - | B11 | 16→16, 390→390 | 16→16, 390→390 | 0 |
| 12 Verm1, Part 2: Steering, Food and a Score | 3/3 | A12.1 | - | B12 | 25→25, 588→588 | 25→25, 588→588 | 0 |
| 13 Sequential Machines | 3/3 | A13.1, A13.2 | - | - | 15→15, 309→309 | 15→15, 309→309 | 0 |
| 14 Elementary Machines: Registers and Buses | 2/2 | A14.1, A14.2 | - | - | 17→17, 334→334 | 17→17, 334→334 | 0 |
| 15 Memory | 3/3 | A15.1, A15.2 | - | B15 | 17→17, 342→342 | 17→17, 342→342 | 0 |
| 16 Permanent Memory | 3/3 | A16.1, A16.2 | - | - | 13→13, 262→262 | 13→13, 262→262 | 1 (7200 → 7.200, locale) |
| 17 Verm1, Part 3: A Body, Rules and States | 3/3 | A17.1, A17.2 | - | - | 37→37, 958→958 | 37→37, 958→958 | 0 |
| 18 The Processor | 3/3 | A18.1, A18.2 | - | - | 15→15, 295→295 | 15→15, 295→295 | 0 |
| 19 Instructions and Interrupts | 3/3 | A19.1, A19.2 | - | - | 19→19, 427→427 | 19→19, 427→427 | 0 |
| 20 Buses and the Video Card | 3/3 | A20.1, A20.2 | - | - | 11→11, 203→203 | 11→11, 203→203 | 0 |
| 21 Input and Output | 2/2 | A21.1, A21.2 | - | - | 12→12, 249→249 | 12→12, 249→249 | 0 |
| 22 Verm1, Part 4: The Finished Game | 3/3 | A22.1, A22.2 | - | - | 44→44, 1100→1100 | 44→44, 1100→1100 | 0 |
| 23 Verm1 on the Cartridge Store | 2/2 | A23.1, A23.2 | - | - | 17→17, 331→331 | 17→17, 331→331 | 0 |
| 24 Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs | 3/3 | A24.1, A24.2 | - | - | 21→21, 429→429 | 21→21, 429→429 | 0 |

Every lesson has a roadmap and a closing thread in both languages (header of the notes, cover and last-slide notes of the
deck, `status.tex` and `closing.tex` of the textbook chapter).

## 2. Code→Lab migration

| Classification | Lessons | Evidence |
| --- | --- | --- |
| retained, identical | 00, 01, 03-24, en and it (48 of 50 pairs) | every text run of every slide identical; slide count identical |
| intentionally moved (improved) | 02, en and it | +2 slides: *Why save ra? The stack frame* and *PRG32-QT: a microscope for registers*, moved from the lecture deck to the Lab deck in the Lecture 02 redesign; nothing removed |
| notes: rewritten (academic register, e7b84fe), substance retained | all | 0 code identifiers lost; 1 number "lost": 7200 written 7.200 (Italian thousands separator) in 16/it |
| intentionally removed / unintentionally lost | none | - |

Commands, from the repository root: `git show b9f4106:<old deck>` for each `-Code.pptx` / `-Codice.pptx`, compared with the
current `-Lab.pptx` by extracting `<a:t>` runs per slide; notes compared by back-quoted identifiers and multi-digit numbers.
The listings, commands and target APIs live in the specifications and in `code/`, which the rename did not touch; the
programs themselves are verified by `tools/tests/run_all.sh` (PASS, `logs/final-run-all-full.txt`).

## 3. The 41 controlled terms, in context

`tests/terms_test.js` checks mechanically that each term is in italics in the note of the slide where it is first met. The
table records the manual review of the defining sentence, in both languages: whether it is intelligible to a beginner,
whether it relies on a term not yet defined, and whether the two languages say the same thing.

| Term | First met (en / it) | Defined in context | Notes |
| --- | --- | --- | --- |
| program | 00:L:1 / 00:L:1 | yes, en and it | - |
| instruction | 00:L:1 / 00:L:1 | yes, en and it | - |
| debugger | 00:L:2 / 00:L:2 | yes, en and it | - |
| processor | 00:L:4 / 00:L:4 | yes, en and it | - |
| assembly | 00:L:4 / 00:L:4 | yes, en and it | - |
| bit | 00:L:5 / 00:L:5 | yes, en and it | - |
| cartridge | 00:L:5 / 00:L:5 | yes, en and it | - |
| hexadecimal | 00:L:5 / 00:L:5 | yes, en and it | - |
| two's complement | 00:L:5 / 00:L:5 | yes, en and it | - |
| machine code | 00:L:6 / 00:L:6 | yes, en and it | first met as 'machine language' (L00 note 6); 'machine code' defined in note 7 |
| memory | 00:L:6 / 00:L:6 | yes, en and it | - |
| binary | 00:L:5 / 00:L:5 | yes, en and it | - |
| Boolean algebra | 00:L:6 / 00:L:6 | yes, en and it | - |
| pixel | 00:L:7 / 00:L:7 | yes, en and it | - |
| frame | 00:L:7 / 00:L:7 | yes, en and it | - |
| instruction set | 00:L:7 / 00:L:7 | yes, en and it | - |
| open source | 00:L:7 / 00:L:7 | yes, en and it | - |
| firmware | 00:L:7 / 00:L:7 | yes, en and it | - |
| interpreter | 00:L:7 / 00:L:7 | yes, en and it | fixed: L00 note 7 now separates the board (native) from PRG32-QT (interpreter); note 8 calls PRG32-QT an emulator, more precisely an interpreter |
| function | 00:L:7 / 00:L:7 | yes, en and it | - |
| runtime | 00:L:7 / 00:L:7 | yes, en and it | - |
| register | 00:L:8 / 00:L:8 | yes, en and it | - |
| byte | 00:L:8 / 00:L:8 | yes, en and it | - |
| breakpoint | 00:L:8 / 00:L:8 | yes, en and it | - |
| compiler | 00:L:8 / 00:L:8 | yes, en and it | note 8 adds that for assembly the translator is the assembler |
| emulator | 00:L:8 / 00:L:8 | yes, en and it | see interpreter |
| address | 00:L:8 / 00:L:8 | yes, en and it | - |
| stack | 00:L:10 / 00:L:10 | yes, en and it | - |
| source code | 00:L:7 / 00:L:7 | yes, en and it | - |
| repository | 00:Lab:1 / 00:Lab:1 | yes, en and it | - |
| toolchain | 00:Lab:1 / 00:Lab:1 | yes, en and it | - |
| terminal | 00:Lab:1 / 00:Lab:1 | yes, en and it | - |
| port | 00:Lab:1 / 00:Lab:1 | yes, en and it | Italian regex matches the italic *porta* (the bare word is also a verb) |
| flash | 00:Lab:1 / 00:Lab:1 | yes, en and it | - |
| ABI | 01:L:9 / 01:L:9 | yes, en and it | - |
| clock | 01:L:10 / 01:L:10 | yes, en and it | - |
| label | 02:L:2 / 02:L:2 | yes, en and it | defined inside the learning contract of Lecture 02 (slide 9 shows one) |
| directive | 02:L:9 / 02:L:9 | yes, en and it | - |
| variable | 02:L:10 / 02:L:10 | yes, en and it | - |
| pseudo-instruction | 02:L:12 / 02:L:12 | yes, en and it | - |
| transistor | 03:L:12 / 03:L:12 | yes, en and it | - |

High-severity finding: one (interpreter/emulator, Lecture 00), fixed. No definition relies on a term defined later; the
English and Italian sentences are equivalent for all 41 terms.

## 4. The 16 numeric hints of `check_editions.py`

| File | Hint | Disposition |
| --- | --- | --- |
| ch00, ch10, ch15, ch16, ch20, ch21, ch24, zero.tex | decades (1950, 1960, 1980, 1990) in English only | valid: Italian writes "anni Cinquanta / Sessanta / Ottanta / Novanta" |
| ch03 | decades and 1800 in English, 50/60/70/80/90 in Italian | valid: "the 1980s" / "gli anni '80"; "nineteenth century" / "Ottocento" |
| ch05, ch06 | extra 1, 2, 8 in Italian | valid: captions spell out abbreviations (C1, C2, Ecc-8) |
| ch08, ch11, ch17, ch19, app_riscv | 0 in English, 1 in Italian | valid: "set (a bit)" is "porre a 1", "clear to 0" is "azzerare" |
| ch11 | numbers in a different paragraph | valid: the same sentence, wrapped at a different line ("001,
010") |

None of the 16 hints is a content difference; none was changed.
