# Computer Architecture: Program First, Formalise Later

Textbook of ARC12, *Computer Architecture and Computer Architecture Laboratory*,
University of Naples "Parthenope", A.Y. 2026/27. LaTeX source, ready for Overleaf.

The book follows the 25 English slide decks in `../slides` one to one: **Chapter N is
Lecture N** (chapters are numbered from 0, like the lectures). 408 pages.

Author: Raffaele Montella. The reference implementation of Verm1, the course-long
project (the four programs of Appendix D), was contributed by Giuseppe Coviello.

The compiled book is `Computer_Architecture-Program_First_Formalise_Later.pdf`. The Italian
edition, in progress, is in `../../it/textbook`: same structure, file names and labels.

## Compiling

**Overleaf.** *New Project → Upload Project*, choose
`ARC12-Computer-Architecture-textbook.zip` (in this folder). The main document is
`main.tex`, the compiler is **pdfLaTeX**, the bibliography runs with BibTeX. Nothing
else has to be configured: every package is in TeX Live.

The first full compilation makes several passes over more than 400 pages. If it exceeds the
compile time of your Overleaf plan, uncomment the `\includeonly{...}` line near the top
of `main.tex` and compile a few chapters at a time; numbering and cross-references are
kept from the last full run.

**Locally.**

```bash
latexmk -pdf main.tex
```

or `pdflatex main && bibtex main && pdflatex main && pdflatex main`
(about 12 seconds per pass on a recent laptop).

## Layout

```
main.tex                 master document: the \include order is the book
arc12style.sty           style: palette, boxes, listings, quiz and exercise environments
                         (derived from prg32style.sty of "Playing with RISC-V")
frontmatter/             title page, colophon, preface, reading guide, references.bib
chapters/chNN_*.tex      one chapter per lecture, NN = lecture number
appendices/
  app_riscv.tex          A  RISC-V reference: RV32IMAC, CSRs, traps, assembler, ABI
  app_prg32.tex          B  PRG32 reference: contract, API, cartridge, tools, hosts, Store
  app_github.tex         C  Git and GitHub reference
  app_verm1.tex          D  the four complete Verm1 programs and the Store files
  app_answers.tex        E  answers to the 90 multiple-choice questions   (generated)
  app_glossary.tex       F  English-Italian glossary, 207 entries          (generated)
figures/                 photographs and screenshots used by the chapters
code/lNN/sKK.*           the listing of slide KK of lecture NN, exported from the deck
code/verm1/              the Verm1 reference programs and the Store bundle files
```

The scripts that re-export the listings and regenerate appendices E and F are in
`../../tools/textbook`.

## Where the content comes from

- **Text.** Written from the deck specifications in `../../tools/decks/en/*.js`: slide
  content, speaker notes, quiz answers. Section order follows slide order.
- **Listings.** Not typed into the text. `code/lNN/sKK.*` are exported verbatim from the
  decks, so they are the files checked by `../../tools/tests`. `code/verm1/verm1_partN.S`
  are the tested reference programs with the `#@ region` marker lines removed.
- **Figures.** Photographs and screenshots are the assets of the decks. Diagrams
  (gates, CMOS circuits, Karnaugh maps, timing and state diagrams, instruction formats)
  are redrawn in TikZ, circuitikz, karnaugh-map, tikz-timing and bytefield.
- **Appendices E and F** are generated from the decks. Regenerate them after changing a
  quiz or a glossary; do not edit them by hand:

  ```bash
  cd ../../tools
  node textbook/export_listings.js en                         # code/lNN/sKK.*
  for i in 1 2 3 4; do grep -v '^#@' ../verm1/verm1_part$i.S > ../en/textbook/code/verm1/verm1_part$i.S; done
  cp ../verm1/store/*.json ../en/textbook/code/verm1/store/
  node textbook/quiz_glossary.js && python3 textbook/gen_appendices.py
  ```

  The scripts read `tools/decks`, so they run from this repository layout, not on
  Overleaf. `npm run textbook` (in `tools`) runs the first and the last line for both languages.

## Keeping the book in step with the decks

When a deck changes, re-export its listings into `code/lNN/` and revise the chapter.
In the generated answers "Lecture NN" becomes "Chapter N" automatically.
Renumbering the lectures means renaming `chapters/chNN_*` and `code/lNN`; cross-references
in the text use labels (`\ref{ch:integers}`), not numbers, so they follow automatically.

## Things to decide before distributing

- **Licence.** The colophon states CC BY-SA 4.0 for text and figures and MIT for
  programs, while the `LICENSE` file at the root of the repository is CC0 1.0: make the
  two agree (change `frontmatter/copyright.tex` or the `LICENSE` file).
- **Photographs.** The historical photographs come from the lecture slides; check the
  rights of each before publishing the PDF outside the course.
- **Dates.** The midterm and closing-event dates are "to be announced" in Chapter 0, as
  in the deck.
