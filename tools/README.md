# ARC12 Computer Architecture: the slide decks and their generator (A.Y. 2026/27)

Two decks per lecture, in English and in Italian, generated from the specifications in `decks/en` and
`decks/it` into `../en/slides` and `../it/slides`:

- the **lecture deck**, of at most 20 slides: the concepts;
- the **code deck** (`...-Lab.pptx`, in both languages): every listing of the lecture with
  its explanation, the complete program of the lecture, what it shows when it runs, a step-by-step guide
  for testing it on PRG32-QT, on QEMU and on the board, and the exercises.

The two languages have the same slides in the same order (code listings, and the Verm1 sources with their
comments, are in English in both). **English is the primary language**: a change is made in English
first and then carried to the Italian material.

The course is organised around the PRG32 didactics: students program RISC-V assembly from the first
days, and each formal topic then explains something their own program has already shown them. RISC-V
(RV32IMAC, as on the ESP32-C6 of the PRG32 kit) is the reference processor throughout; the Motorola 68000
of the previous editions appears only as a historical counterpart in comparison tables.

| Lecture | Lecture deck | Code deck | Program |
| --- | ---: | ---: | --- |
| `00-...-Course_Introduction` | 20 | 10 | `l00.S` |
| `01-...-PRG32_and_PRG32-QT_Setup` | 20 | 28 | `l01.S` |
| `02-...-First_Contact_with_RISC-V_Assembly` | 20 | 18 | `l02.S` |
| **Information** | | | |
| `03-...-History_of_Computing` | 19 | 13 | `l03.S` |
| `04-...-Digital_Information` | 20 | 13 | `l04.S` |
| `05-...-Number_Representation_Integers` | 20 | 20 | `l05.S` |
| `06-...-Number_Representation_Reals` | 20 | 14 | `l06.S` |
| `07-...-Verm1_Part_1` | 13 | 18 | Verm1, part 1 |
| **Logic** | | | |
| `08-...-Boolean_Algebra_1` | 19 | 20 | `l08.S` |
| `09-...-Boolean_Algebra_2` | 20 | 16 | `l09.S` |
| `10-...-Electronics` | 20 | 14 | `l10.S` |
| `11-...-Combinational_Machines` | 20 | 16 | `l11.S` |
| `12-...-Verm1_Part_2` | 13 | 25 | Verm1, part 2 |
| **State and memory** | | | |
| `13-...-Sequential_Machines` | 20 | 15 | `l13.S` |
| `14-...-Registers_and_Buses` | 20 | 17 | `l14.S` |
| `15-...-Memory` | 20 | 17 | `l15.S` |
| `16-...-Permanent_Memory` | 20 | 13 | `l16.S` |
| `17-...-Verm1_Part_3` | 13 | 37 | Verm1, part 3 |
| **The machine** | | | |
| `18-...-Processor` | 20 | 15 | `l18.S` |
| `19-...-Instructions_and_Interrupts` | 20 | 19 | `l19.S` |
| `20-...-Video_Card` | 20 | 11 | `l20.S` |
| `21-...-Input_Output` | 20 | 12 | `l21.S` |
| `22-...-Verm1_Part_4` | 12 | 44 | Verm1, part 4 |
| `23-...-Verm1_On_The_Cartridge_Store` | 13 | 17 | the Store bundle |
| **Outlook** | | | |
| `24-...-Superscalar_HPC_GPU_FPGA` | 20 | 21 | `l24.S`, and the vector listings |

Fifty decks per language: 463 slides in the lecture decks and 463 in the code decks. The file names above
are the English ones; the Italian decks are `NN-Architettura_dei_Calcolatori-*`.

## Pictures: `assets/` and their credits

`assets/` holds the pictures of the decks. A picture is either made for the course (the frames written by
the tests, the drawings, the photographs of the Department) or taken from Wikimedia Commons under a free
licence (public domain, CC0, CC BY, CC BY-SA): nothing else goes in. `assets/CREDITS.md` and
`assets/credits.json` give title, author, licence and source of every Commons picture; `build.js` copies
the credit into the notes of the slide that shows the picture, and `textbook/gen_credits.py` writes the
list printed in the colophon of the two books. To add a picture: put the file in `assets/`, add its entry
to `credits.json` and to `CREDITS.md`, and copy it to `../<lang>/textbook/figures` if a chapter uses it.
`textbook/draw_gpgpu_sum.js` draws `gpgpu_sum.png`.

## How a lecture is split: `decks/plan.js`

A specification, `decks/<lang>/NN-*.js`, lists the slides of a lecture in teaching order. `decks/plan.js`,
which is the same for both languages, says what goes where; `lib/lab.js` applies it.

| Slide of the specification | Where it goes |
| --- | --- |
| `K`, `WK` (a listing), `T` with a listing at its side, `X` (exercises, "Run it") | the code deck |
| a slide listed under `code:` in the plan (traces, the debugger, "back to the machine") | the code deck |
| a slide listed under `drop:` | neither deck: its content is in the textbook chapter, its note in `../<lang>/notes/reserve` |
| `H` (a section title) | no slide: it names a section of the PowerPoint file, in the lecture deck and, for the listings that follow it, in the code deck ("Warm-up on the machine", "Back to the machine", the steps of a tutorial) |
| `Q` (a question) | the lecture deck, two questions per slide |
| everything else | the lecture deck |

The build fails if a lecture deck would exceed 20 slides: move a slide to `code:` or to `drop:`.

The code deck is completed by slides that are generated, not written in the specification: an index, the
complete program of the lecture (`../code/lNN.S`, a page of at most 24 lines per slide), "what you should
see" with the frame written by the automatic test, one slide of commands for each host (PRG32-QT, QEMU,
the board), and a troubleshooting table. The lecture's entry in the plan (`lab:`) names the program and
gives, in each language, what appears on the screen and what to press.

A way to teach with the two decks: open with the warm-up listing of the code deck, give the lecture with
the lecture deck, and close on the code deck, with the program running and the exercises. The cover of
each deck names the file of the other one, and the lecture deck calls "the warm-up" the listing that opens
the code deck, in the section of that name.

After a change of `drop:` or `code:` the slides of a lecture deck are renumbered: `node notes.js` checks
that every slide has a note, not that the note is the right one. Move the notes of the slides that
changed place (`../<lang>/notes`, and `reserve/` for the dropped ones) before running it.

## Learning status: understand now, use now, understand later

A lecture shows more than it explains: that is the method. So that students can tell what to master today
from what they may use provisionally and from what is only a preview, a slide can carry one or two badges in
the band above its title:

| Badge | Italian | Means |
| --- | --- | --- |
| UNDERSTAND NOW | DA COMPRENDERE OGGI | by the end of the lecture, explain it, trace it, apply it |
| USE NOW | DA UTILIZZARE OGGI | follow and use the recipe; the inside is explained in the lecture shown, or is not a subject of the course |
| UNDERSTAND LATER | DA COMPRENDERE PIÙ AVANTI | a preview; the lecture shown explains it |

The badges are data, not drawing: `concepts/registry.json` defines the concepts (labels in both languages, the
lecture of first exposure, of first use and of formal treatment, the questions that check them) and
`decks/mastery.js` says, for each lecture, which slides carry which status, in the numbering of `decks/plan.js`
and for both languages at once. `lib/mastery.js` draws the badges, writes one sentence in the notes of each
marked slide, puts the legend on every cover and the list of the lecture in the notes of the cover and of the
last slide, writes the same list at the top of each notes file (`notes.js`) and the box *Learning status* of
each chapter of the books (`textbook/export_listings.js`). `node textbook/check_mastery.js` checks it all and
writes `concepts/coverage.md`, the matrix of the 25 lectures; `concepts/DESIGN.md` is the design guide
(colours, shapes, placement, accessibility) and the procedure for marking a slide.

## The programs of the lectures: `../code`

`../code/lNN.S` is one complete, commented cartridge per lecture: the listings of the lecture put
together in a program that draws something a test can check. See `../code/README.md`. The four parts of
the course project, Verm1, are in `../verm1`.

## The course project: Verm1

PRG32 is used both for exercises and as a place to make things. The course-long project is **Verm1**
(read "vermone"), a tribute to Snake written from scratch in RISC-V assembly. After every block of four
lectures a tutorial lecture adds a part of the game, using what the block has taught. The reference
implementation of Verm1 (`../verm1/verm1_partN.S`) was contributed by **Giuseppe Coviello**; the credit is
printed on the cover of every Verm1 deck, in the header of the sources and in the colophon of the Store bundle.

| Lecture | Verm1 gains | Uses |
| --- | --- | --- |
| 07 Part 1 | a grid, a head that moves by itself, wrap-around | colours, shifts, comparisons, fixed point |
| 12 Part 2 | steering, food, a score, a sound | masks, XOR, lookup tables, comparator |
| 17 Part 3 | a body that grows, collisions, title and game-over screens | state machine, edge detection, arrays, `.rodata`/`.data` |
| 22 Part 4 | digits, levels, two sounds, incremental drawing | calling convention, `divu`/`remu`, the processor cycle, frame buffer |
| 23 The Store | manifest, icon, colophon, bundle for two architectures | the `prg32 cartridge` and `prg32 store` tools |

In a tutorial lecture the lecture deck holds the design (the plan, the data structures, the state diagram,
the session with the PRG32-QT debugger) and the code deck holds the program: every line is on a slide
marked NEW, CHANGED or UNCHANGED, and each step ends with a "Run it" slide and its expected result.

- `../verm1/verm1_partN.S` are the reference programs. A line `#@ name` starts a region; the decks read
  the code from these files (`lib/verm1.js`), and the build fails if a region is not shown exactly
  once, so slides and program cannot drift apart.
- `../verm1/steps/` holds the temporary code of the intermediate "Run it" checkpoints.
- `../verm1/store/` holds the manifest, metadata, colophon and icon of the bundle of Lecture 23.

## Consistency rules

- Cross-references between lectures are written `Lecture NN` with the two-digit number. After inserting or
  moving a lecture, renumber them and check every one against the table above: the numbers in the notes
  are as visible to a lecturer as those on the slides.
- In a tutorial the steps are numbered in the section titles (`Step N: ...`); notes and "Run it" slides
  refer to those numbers.
- Every slide of every deck has a note in `../<lang>/notes/<deck file>.md` (one section `## Slide N` per
  slide; the notes of a code deck are in `<deck file>-Lab.md`). `node notes.js` checks that no slide is
  without its note and rewrites the headings from the titles of the slides; the notes of the generated
  slides of a code deck are generated too. `build.js` copies each note into the notes pane of its slide.
- The textbook in `../en/textbook` follows the lectures one to one (Chapter N is Lecture N), and
  `../it/textbook` is its Italian edition. A change of content here is a change there: see their READMEs.
- `node textbook/check_decks.js` fails if a lecture deck has more than 20 slides or if an Italian deck
  differs from the English one in the kind of a slide, in a listing, in a picture or in a right answer.
  `python3 textbook/check_editions.py` does the same job for the two editions of the book. Both run with
  `npm run textbook`.

## Rebuilding

```bash
cd tools
npm ci               # node_modules is not in the repository
node build.js        # all the decks, English and Italian
node build.js it     # only the Italian decks
node build.js en 05  # the two decks of lecture 05, in English
node notes.js        # check the slide notes of both languages
npm run textbook     # listings and programs for the books, answers, glossary, and the checks
npm test             # the full check (after node build.js): unit and negative tests, first-use terms, assessments,
                     # check_mastery.js and check_pptx.js on the 100 BUILT decks; fails if jszip or a deck is missing
npm run test:source  # the sources only, labelled as such: NOT the full verification
npm run teaching     # docs/teaching/<lang>: exit tickets, rubrics, roadmaps (from concepts/assessments.json, bridges.json)
npm run verify       # everything: build, notes, teaching documents, npm test, textbook pipeline
```

**Assessment and roadmaps.** `concepts/assessments.json` gives each lecture its 2-4 headline outcomes, its closing thread and
its exit ticket, and every assessment item (exit ticket, checkpoint on a slide, extra check) with the concepts it checks, a
prompt, a rubric and a likely misconception, in English and Italian. `lib/assessments.js` validates it, and `check_mastery.js`
fails if a concept understood in a lecture has no question, exercise or item to check it (or no written exception).
`concepts/bridges.json` holds the retrieval bridges of the long deferrals; `lib/roadmap.js` fails if a deferred concept goes
more than nine lectures without being met again, and writes the roadmap into the notes, the decks (cover and last-slide notes)
and the textbook (`code/lNN/status.tex`, `closing.tex`). The instructor material is in `../docs/teaching`, the audit of the
remediation in `../docs/audit`.

**Built decks.** `textbook/check_pptx.js` opens every package and checks ZIP and XML integrity, the number of slides, the titles,
the notes, the learning-status label and icon, the laboratory slides of each code deck and English/Italian parity;
`tests/pptx_test.js` damages copies of real decks and checks that each damage is caught. `textbook/check_editions.py` also fails
when the book reads a file of `code/` that does not exist (moving a slide renames the exported listings).

The course has no prerequisites, so every word that a beginner meets in the first lectures is explained where it
first appears. `concepts/terms.json` lists those words; `tests/terms_test.js` reads the course in order (lecture by
lecture, the lecture deck and then the code deck, slide text and note) and fails if the note of the slide where a term
first appears does not define it, with the term in italics, `*like this*`. A slide or a note that uses a term earlier
than its definition makes the test name the slide; move the definition there, or add the term to the list when a new
word enters the first lectures.

- `build.js` is the layout engine (pptxgenjs). It measures text before placing it and fails the build if
  a slide's text cannot fit at a readable size.
- `decks/<lang>/*.js` hold the content, one specification per lecture; `decks/plan.js` splits each into
  its two decks; `lib/lab.js` generates the slides of the code deck that come from the program;
  `lib/lang.js` holds what depends on the language (the fixed strings of the layout, the reading of the notes).
- `lib/gates.js` draws logic gates and circuits, `lib/draw.js` timing diagrams and state diagrams,
  `lib/circuit.js` electronic schematics (SVG, rasterised with sharp).
- `lib/verm1.js` reads the Verm1 sources for the tutorial decks.
- `lib/mastery.js` draws the learning-status badges and writes their notes (see the section above).
- `tests/` holds the checks of the assembly shown on the slides: encodings, a QEMU test of the
  listings, the programs of the lectures run on the PRG32-QT headless runner (which also writes the
  pictures `assets/lab_lNN.png` used in the code decks), the vector listings of lecture 24, the four parts
  of Verm1 played by a scripted player, the intermediate steps of the tutorials and the packaging of the
  Store bundle (see its README).
- `textbook/` holds the scripts that export the listings and the programs to the two books, regenerate
  their generated appendices and check one language against the other.
- `assets/` holds the pictures: the photographs of the original decks, screenshots from the PRG32
  repository and textbook, and the frames written by the tests.

Edit the specification or the plan, rebuild, and the `.pptx` files in `../<lang>/slides` are replaced.
Changes made by hand in PowerPoint are lost at the next build.
