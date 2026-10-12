# ARC12 Computer Architecture: teaching material (A.Y. 2026/27)

Course of *Computer Architecture and Computer Architecture Laboratory* (ARC12),
Bachelor's Degree in Computer Science, University of Naples "Parthenope".
Prof. Raffaele Montella. Approach: *program first, formalise later*, in RISC-V
assembly on the PRG32 platform, with the course-long project Verm1.

| Folder | Content |
| --- | --- |
| `en/slides`, `it/slides` | the 25 slide decks, English (`NN-Computer_Architecture-*.pptx`) and Italian (`NN-Architettura_dei_Calcolatori-*.pptx`): 907 slides per language, the same slides in the same order |
| `en/notes`, `it/notes` | the notes of every slide, one Markdown file per deck; the generator copies them into the notes pane of the slides |
| `en/textbook` | the LaTeX textbook that follows the decks, Chapter N = Lecture N: sources, the PDF (408 pages) and the Overleaf-ready zip |
| `it/textbook` | the Italian edition of the textbook, **in progress**: front matter and Chapters 0 to 6 are translated; the other chapters and the appendices are still to be written |
| `tools/` | the deck generator and the deck specifications (`tools/decks/en`, `tools/decks/it`), the pictures (`tools/assets`), the tests of every listing (`tools/tests`) and the scripts that feed the textbook (`tools/textbook`) |
| `verm1/` | the Verm1 project: the four reference programs, the intermediate steps of the tutorials and the files of the Cartridge Store bundle |

Decks, notes, listings of the book, quiz answers and glossary are all generated from, or
checked against, the deck specifications in `tools/decks`, so they cannot drift from each
other. `tools/README.md`, `tools/tests/README.md` and `en/textbook/README.md` have the details.

```bash
cd tools
npm ci                 # once
node build.js          # the decks of both languages, into ../en/slides and ../it/slides
node notes.js          # every slide has its note
npm run textbook       # listings of the book, answers and glossary
sh tests/run_all.sh    # the assembly shown on the slides (needs the PRG32 toolchain: see tests/README.md)
```

**Credits.** Lectures, decks and textbook: Raffaele Montella. Laboratory:
Mariacarla Staffa. Reference implementation of Verm1: Giuseppe Coviello
(contributor). PRG32: Raffaele Montella, Ivan Cafiero, Simone Boscaglia.

The decks derive in part from the Italian decks of the previous editions of the course,
which are not in this repository.
