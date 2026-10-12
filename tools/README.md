# ARC12 Computer Architecture: the slide decks and their generator (A.Y. 2026/27)

English and Italian decks, generated from the specifications in `decks/en` and `decks/it`
into `../en/slides` and `../it/slides`: the same slides in the same order in both languages
(code listings, and the Verm1 sources with their comments, are in English in both). They are
modernised versions of the Italian lecture decks of the previous editions (not in this repository),
reorganised around the PRG32 didactics: students program RISC-V assembly from
the first days, and each formal topic then explains something their own program
has already shown them. RISC-V (RV32IMAC, as on the ESP32-C6 of the PRG32 kit) is
the reference processor throughout. The old decks used the Motorola 68000 in
the memory, processor and interrupt lectures; it now appears only as a
historical counterpart in comparison tables.

| Deck | From (Italian deck) | Slides |
| --- | --- | --- |
| `00-...-Course_Introduction` | `00-...-Introduzione_al_corso`, plus PRG32 philosophy and the project | 39 |
| `01-...-PRG32_and_PRG32-QT_Setup` | new: the platform in detail, installation on Windows, macOS, Linux | 41 |
| `02-...-First_Contact_with_RISC-V_Assembly` | new | 28 |
| **Information** | | |
| `03-...-History_of_Computing` | `01-...-Storia_della_Computazione` | 29 |
| `04-...-Digital_Information` | `02-...-Introduzione_alla_rappresentazione...` | 36 |
| `05-...-Number_Representation_Integers` | `03-...-Rappresentazione_Numeri` | 37 |
| `06-...-Number_Representation_Reals` | `04-...-Rappresentazione_Numeri` | 33 |
| `07-...-Verm1_Part_1` | new: project tutorial | 30 |
| **Logic** | | |
| `08-...-Boolean_Algebra_1` | `05-...-Algebra_di_Boole` | 32 |
| `09-...-Boolean_Algebra_2` | `06-...-Algebra_di_Boole` | 34 |
| `10-...-Electronics` | new | 34 |
| `11-...-Combinational_Machines` | `09`, `10-...-Macchine_trattamento_codici` | 42 |
| `12-...-Verm1_Part_2` | new: project tutorial | 37 |
| **State and memory** | | |
| `13-...-Sequential_Machines` | `08-...-Macchine_sequenziali`, `11-...-latch_flip_flop_SR`, `12-...-flip_flop_JK_D` | 41 |
| `14-...-Registers_and_Buses` | `13-...-Macchine_elementari_per_architettura` | 31 |
| `15-...-Memory` | `14-...-Memoria` | 35 |
| `16-...-Permanent_Memory` | `15-...-Memoria-Permanente` | 34 |
| `17-...-Verm1_Part_3` | new: project tutorial | 51 |
| **The machine** | | |
| `18-...-Processor` | `18-...-Processore` | 36 |
| `19-...-Instructions_and_Interrupts` | `19-...-Istruzioni_e_Interruzioni` | 36 |
| `20-...-Video_Card` | `16-...-Scheda-Video` | 29 |
| `21-...-Input_Output` | `17-...-Input-Output-Video-Tastiera-Mouse-Stampante` | 29 |
| `22-...-Verm1_Part_4` | new: project tutorial | 56 |
| `23-...-Verm1_On_The_Cartridge_Store` | new: project tutorial | 29 |
| **Outlook** | | |
| `24-...-Superscalar_HPC_GPU_FPGA` | new: superscalar RISC-V, vectors, HPC, GPU and FPGA accelerators | 48 |

Twenty-five decks, 907 slides per language. The file names above are the English ones; the Italian
decks are `NN-Architettura_dei_Calcolatori-*`. The decks are numbered consecutively in teaching order; the numbers do not match the Italian
files, which keep their old names. Compared with the Italian order, the processor and the instructions
come before the video card and input/output: the devices are explained after the machine that drives them.

## The course project: Verm1

PRG32 is used both for exercises and as a place to make things. The course-long project is **Verm1**
(read "vermone"), a tribute to Snake written from scratch in RISC-V assembly. After every block of four
lectures a tutorial deck adds a part of the game, using what the block has taught. The reference
implementation of Verm1 (`../verm1/verm1_partN.S`) was contributed by **Giuseppe Coviello**; the credit is
printed on the cover of every Verm1 deck, in the header of the sources and in the colophon of the Store bundle.

| Deck | Verm1 gains | Uses |
| --- | --- | --- |
| 07 Part 1 | a grid, a head that moves by itself, wrap-around | colours, shifts, comparisons, fixed point |
| 12 Part 2 | steering, food, a score, a sound | masks, XOR, lookup tables, comparator |
| 17 Part 3 | a body that grows, collisions, title and game-over screens | state machine, edge detection, arrays, `.rodata`/`.data` |
| 22 Part 4 | digits, levels, two sounds, incremental drawing | calling convention, `divu`/`remu`, the processor cycle, frame buffer |
| 23 The Store | manifest, icon, colophon, bundle for two architectures | the `prg32 cartridge` and `prg32 store` tools |

The tutorial decks are step by step and self-contained: every line of the program is on a slide marked
NEW, CHANGED or UNCHANGED, each step ends with a "Run it" slide and its expected result, and each deck
has a session with the PRG32-QT debugger.

- `../verm1/verm1_partN.S` are the reference programs. A line `#@ name` starts a region; the decks read
  the code from these files (`lib/verm1.js`), and the build fails if a region is not shown exactly
  once, so slides and program cannot drift apart.
- `../verm1/steps/` holds the temporary code of the intermediate "Run it" checkpoints.
- `../verm1/store/` holds the manifest, metadata, colophon and icon of the bundle of Lecture 23.

## Shape of every topical deck

1. **Warm-up on the machine**: a few lines of RISC-V on PRG32 that raise the question.
2. **The formal treatment**: the content of the original deck, translated and checked.
3. **Back to the machine**: the same rules as RISC-V implements them.
4. **Check your understanding**: multiple-choice questions in the style of the midterm test (answers in the speaker notes).
5. **Exercises** (paper first, then PRG32), an English/Italian **glossary**, conclusions and reading.

Speaker notes carry quiz answers, teaching tips, the source of every listing and
every correction made to the original slides.

## Consistency rules

- Cross-references between decks are written `Lecture NN` with the two-digit number of the deck. After
  inserting or moving a deck, renumber them and check every one against the table above: the numbers in
  speaker notes are as visible to a lecturer as those on the slides.
- In a tutorial deck the steps are numbered in the section titles (`Step N: ...`); notes and "Run it"
  slides refer to those numbers. The last numbered step of each tutorial is the session with the debugger.
- Every slide has a note in `../<lang>/notes/<deck file>.md` (one section `## Slide N` per slide).
  `node notes.js` checks that no slide is without its note and rewrites the headings from the deck
  titles; `build.js` copies each note into the notes pane of its slide.
- The textbook in `../en/textbook` follows the decks one to one (Chapter N is Lecture N). A change of
  content here is a change there: see its README.

## Rebuilding

The decks are generated, in the same way and with the same look as the
presentations of the PRG32 textbook.

```bash
cd tools
npm ci               # node_modules is not in the repository
node build.js        # all decks, English and Italian
node build.js it     # only the Italian decks
node build.js en 05  # only lecture 05, in English
node notes.js        # check the slide notes of both languages
```

- `build.js` is the layout engine (pptxgenjs). It measures text before
  placing it and fails the build if a slide's text cannot fit at a readable size.
- `decks/<lang>/*.js` hold the content, one specification per deck; `lib/lang.js` holds what depends
  on the language (the fixed strings of the layout, the reading of the notes).
- `lib/gates.js` draws logic gates and circuits, `lib/draw.js` timing diagrams and state diagrams,
  `lib/circuit.js` electronic schematics (SVG, rasterised with sharp).
- `lib/verm1.js` reads the Verm1 sources for the tutorial decks.
- `tests/` holds the checks of the assembly shown on the slides: encodings, a QEMU test of the
  listings, cartridges run on the PRG32-QT headless runner, the vector listings of lecture 24, the four parts of Verm1 played by a scripted
  player (which also writes the screenshots used in the decks), the intermediate steps of the tutorials
  and the packaging of the Store bundle (see its README).
- `textbook/` holds the scripts that export the listings and regenerate the generated appendices of
  the book (see `../en/textbook/README.md`).
- `assets/` holds the pictures: the photographs of the original decks and
  screenshots from the PRG32 repository and textbook.

Edit the specification, rebuild, and the `.pptx` in `../<lang>/slides` is replaced.
Changes made by hand in PowerPoint are lost at the next build.
