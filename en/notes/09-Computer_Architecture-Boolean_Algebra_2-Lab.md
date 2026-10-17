# Lecture 09: Elements of Boolean Algebra: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the adder; Boolean functions; canonical forms; minimisation, Karnaugh maps. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) write a function in canonical form from its truth table; (2) minimise a function of up to four variables with a Karnaugh map; (3) build a full adder and chain it into an n-bit adder. Builds on: only what Lecture 01 set up. Next: Lecture 10, Introduction to Electronics and Digital Electronics.

Closing thread: The add of Lecture 02 is now a circuit you could draw: 32 full adders and a carry that ripples. Next: the electronics that make a gate.

## Slide 1: Elements of Boolean Algebra: the code

This is the code deck of Lecture 09. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l09.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: One-bit addition without add

The warm-up. The sum of two bits can be 0, 1 or 2, so the result requires two bits. `xor` produces the low bit, which is 1 when the inputs differ; `and` produces the high bit, the carry, which is 1 only when both inputs are 1. The comment beneath the code is a truth table with two outputs, whose four rows should be verified. This pair of gates has a name, the *half adder*. The final callout states the problem of the lecture: here the gates were supplied; how are they found when only the table is known?

## Slide 4: A full adder, one gate per instruction

The full adder written as five instructions, one per gate: two `xor` for the sum, two `and` and one `or` for the outgoing carry. The program is the schematic, read from left to right, and it allows both problems of Lecture 08 to be practised. Analysis: single-step it in PRG32-QT for the eight input combinations and fill in the truth table. Synthesis: derive these gates from the table with the method of the lecture. With whole registers as inputs, the same five lines operate on all thirty-two bit positions at once, though without propagating carries between them; propagation is what the ripple-carry chain adds.

## Slide 5: The complete program: l09.S (1 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 6: The complete program: l09.S (2 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l09.S (3 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l09.S (4 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l09.S (5 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l09.S (6 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 12: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 13: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 14: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 15: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 16: Exercises: paper first, then PRG32

Five exercises. Write the canonical forms of the two outputs of the full adder. Minimise the outgoing carry with a three-variable map and count the gates saved. Minimise a four-variable function given as a list of minterms, remembering that the corners are adjacent. Construct NOT, AND and OR from NAND gates alone, verifying each by its truth table, which demonstrates functional completeness constructively. Then program the full adder on PRG32 and display its outputs as lamps for the eight input combinations.
