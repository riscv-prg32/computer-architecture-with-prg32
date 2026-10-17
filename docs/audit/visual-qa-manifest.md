# Visual QA manifest

## What was checked, and how

**Structural, all decks.** `tools/textbook/check_pptx.js` opened the 100 built packages (25 lectures x 2 decks x 2 languages)
and inspected 1,852 slides: ZIP and XML integrity, number of slides against the specification, titles and questions present,
note of every slide carried into the package, learning-status label **and** icon on every marked slide, the laboratory
slides of every code deck, and English/Italian parity of slide kinds and badges. `tools/tests/pptx_test.js` proves that it
fails on eight kinds of damage. Structural validation is not visual validation: it says nothing about legibility.

**Visual, a sample.** Slides were rendered with macOS Quick Look (no LibreOffice on this machine) from the final built
decks and inspected one by one. Textbook pages were rendered with `pdftoppm`. Grayscale copies were made with `sharp` to
check that no meaning depends on colour alone. The images are in `visual-qa/`.

| Image (`visual-qa/`) | Deck, slide | Why sampled | Findings | Disposition |
| --- | --- | --- | --- | --- |
| en/it-02-L-s02 | L02 lecture, learning contract | new slide | legible; long Italian bullets wrap cleanly | ok |
| en/it-02-L-s08 | L02, checkpoint 1 | new slide | legible; answers not on the slide | ok |
| en/it-02-L-s14 | L02, checkpoint 2 (trace) | changed slide | rows to fill marked ?; highlighted row also carries the question in the caption | ok |
| en/it-02-L-s15 | L02, not expected yet | renamed slide | first column of prose was set in a monospaced font, hard to read in Italian | **fixed** (spec en/it), re-rendered |
| en/it-02-L-s16 | L02, closing map | new slide | five boxes and a caption; Italian fits | ok |
| en/it-02-L-s17, s18 | L02, questions | renumbered | ok | ok |
| en/it-05-L-s06 | L05, densest slide (147 words) | dense | two worked tables, legible | ok |
| en/it-09-L-s05 | L09, densest lecture slide of the course (190 words) | dense | 16-row table split in two, legible at projection size; highlighted rows are also named in the caption | ok, no change |
| en/it-11-L-s11 | L11, densest slide (165 words) | dense | seven-segment table and figure; the pink row is also named in the text ("the digit 2") | ok |
| en/it-12-L-s03 | Verm1 part 2, what it takes from the lectures | Verm1 milestone | ok | ok |
| en/it-17-Lab-s24 | Verm1 part 3, code slide (185 words) | dense code | code font is the smallest of the sample; readable on screen, at the limit when projected in a large room | **open risk**: no change made; advise zooming, or reading the listing in the textbook |
| en/it-19-L-s04 | L19, instruction formats | later formalisation | ok | ok |
| gray-en-02-L-s14-badge, gray-it-02-L-s15, gray-en-19-L-s04, gray-it-05-L-s06 | grayscale | colour-independence | the three badges stay distinct by icon (book, wrench, clock), label and bar (solid, double, dashed) | ok |
| book-en/it-p22 | textbook, *Starting from Zero*, confusable pairs | new section | table fits the text width; no overfull box | ok |
| book-en/it-p27 | textbook, Chapter 0, status and roadmap boxes | new box | first rendering said "builds on Chapter 1" | **fixed** in `lib/roadmap.js` and `export_listings.js`, re-rendered |
| book-en/it-p38 | textbook, Chapter 0, closing and exit ticket | new box | ok | ok |

**Not checked visually:** the other 1,800-odd slides (only structurally), projection on a real classroom projector, and
the slides with a colour-vision-deficiency simulation beyond grayscale. These remain NOT VERIFIED.
