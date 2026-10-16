# ARC12 Computer Architecture: teaching material (A.Y. 2026/27)

Course of *Computer Architecture and Computer Architecture Laboratory* (ARC12),
Bachelor's Degree in Computer Science, University of Naples "Parthenope".
Prof. Raffaele Montella. Approach: *program first, formalise later*, in RISC-V
assembly on the PRG32 platform, with the course-long project Verm1.

| Folder | Content |
| --- | --- |
| `en/slides`, `it/slides` | two slide decks per lecture, English (`NN-Computer_Architecture-*.pptx`) and Italian (`NN-Architettura_dei_Calcolatori-*.pptx`): the **lecture deck**, of at most 20 slides, and the **code deck** (`-Lab`), with every listing explained, the complete program and the guide for testing it on PRG32-QT, on QEMU and on the board. 456 + 461 slides per language, the same slides in the same order |
| `en/notes`, `it/notes` | the notes of every slide, one Markdown file per deck; the generator copies them into the notes pane of the slides. `reserve/` keeps the notes of the slides that are in neither deck |
| `code/` | one complete, tested RISC-V program per lecture (`lNN.S`): the listings of the slides, runnable as they are on the three hosts |
| `en/textbook` | the LaTeX textbook that follows the lectures, Chapter N = Lecture N: sources, the PDF (458 pages) and the Overleaf-ready zip |
| `it/textbook` | the Italian edition of the textbook, *Architettura dei calcolatori: prima programmare, poi formalizzare* (466 pages): same structure, file names and labels as the English one, which is the reference edition |
| `tools/` | the deck generator, the deck specifications (`tools/decks/en`, `tools/decks/it`) and the plan that splits each lecture into its two decks (`tools/decks/plan.js`), the pictures (`tools/assets`), the tests of every listing (`tools/tests`) and the scripts that feed the textbook (`tools/textbook`) |
| `verm1/` | the Verm1 project: the four reference programs, the intermediate steps of the tutorials and the files of the Cartridge Store bundle |

Decks, notes, listings of the book, quiz answers and glossary are all generated from, or
checked against, the deck specifications in `tools/decks`, so they cannot drift from each
other. English is the primary language: the Italian decks, notes and textbook are translations, and
`node textbook/check_decks.js` and `python3 textbook/check_editions.py` (in `tools`) check that they have
not drifted. `tools/README.md`, `code/README.md`, `tools/tests/README.md`, `en/textbook/README.md` and
`it/textbook/README.md` have the details.

```bash
cd tools
npm ci                 # once
node build.js          # the two decks of every lecture, in both languages, into ../en/slides and ../it/slides
node notes.js          # every slide has its note
npm run textbook       # listings and programs for the books, answers and glossary, and the checks of the two languages
sh tests/run_all.sh    # the assembly shown on the slides (needs the PRG32 toolchain: see tests/README.md)
```

**Credits.** Lectures, decks and textbook: Raffaele Montella. Laboratory:
Mariacarla Staffa. Reference implementation of Verm1: Giuseppe Coviello
(contributor). PRG32: Raffaele Montella, Ivan Cafiero, Simone Boscaglia.

**Licence.** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0): see `LICENSE`.
The licence covers the whole course: the decks, the notes, the textbooks, the programs (`code/`, `verm1/`)
and the tools. PRG32 and PRG32-QT are separate projects, under the MIT License. The photographs of
historical machines and of devices come from Wikimedia Commons under their own free licences (public
domain, CC0, CC BY, CC BY-SA): `tools/assets/CREDITS.md` lists title, author and licence of each one,
the build copies the credit into the notes of the slide that shows the picture, and the books print the
list in their colophon.

The decks derive in part from the Italian decks of the previous editions of the course,
which are not in this repository.
