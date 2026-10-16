# Lecture 08: Elements of Boolean Algebra: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; the von Neumann architecture; analysis and synthesis; Boolean algebra; logic gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: minimisation, Karnaugh maps (Lecture 09). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Elements of Boolean Algebra: the code

This is the code deck of Lecture 08. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l08.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Is LEFT pressed?

The warm-up. `prg32_input_read` returns the state of every button at once in `a0`, one bit per button. `andi t3, t0, 0x01` retains bit 0 and forces every other bit to zero; the result is non-zero exactly when LEFT is pressed, and `beqz` skips the movement otherwise. The same pattern with 0x02 tests RIGHT. The constant used with `andi` is called a *mask*. The final callout poses the question of the lecture: `andi` is thirty-two AND gates operating side by side, so what, precisely, is an AND?

## Slide 4: One bit per button

The value returned for the buttons is a word in which each bit has an assigned meaning: bit 0 is LEFT, bit 1 RIGHT, bit 2 UP, bit 3 DOWN, bits 4 and 5 are A and B, bit 6 is START. Holding RIGHT and A together yields 0x12, that is, 0001 0010. In the picture each lamp displays one bit of this word. Every question that can be asked about the controls, such as "is LEFT pressed but not RIGHT?", is a Boolean expression over these seven variables; this is the *decoded* representation that Lecture 11 names.

## Slide 5: Bitwise instructions: the algebra on a whole register

`and`, `or`, `xor` and `not` apply a single gate to every pair of corresponding bits of two registers, in all positions simultaneously. The third column works an eight-bit example: with a equal to 1100 1010 and b equal to 0000 1111, AND gives 0000 1010, OR gives 1100 1111, XOR gives 1100 0101. The last column shows the corresponding C operators. `not` is a pseudo-instruction: it is `xori` with -1, since -1 in two's complement consists entirely of ones, and XOR with 1 inverts a bit.

## Slide 6: Four things to do with a mask

The four canonical uses of a mask, each grounded in a law of the algebra. To *test* a bit, AND with a mask holding 1 in that position, since x AND 1 is x and x AND 0 is 0. To *set* it, OR with the same mask. To *clear* it, AND with the complemented mask. To *toggle* it, XOR with the mask. In the last three cases the remaining bits are unaffected, which is the essential property: a mask acts on the chosen bits and leaves all others untouched.

## Slide 7: De Morgan at the joystick

De Morgan's laws applied in a program. The player is idle when neither LEFT nor RIGHT is pressed. The short version uses a two-bit mask, 0x03: the result is zero only if both bits are zero, that is, NOT (LEFT OR RIGHT). The long version tests each button separately: (NOT LEFT) AND (NOT RIGHT). The second of De Morgan's laws guarantees that the two conditions are identical. Two instructions replace five: simplification is as valuable in software as in hardware, and the algebra is what certifies that the shorter program is correct.

## Slide 8: One lamp per bit: shifting and masking

To read bit number n of a word when n is held in a register, the word is shifted right by n positions, so that the desired bit reaches position 0, and then masked with 1. Here `s0` holds the index of the lamp, `srl` shifts the button word, `andi` isolates the bit, and the colour is selected accordingly: grey for off, yellow for on. Shift-and-mask is among the most common idioms of low-level programming. `srl` is the logical shift of Lecture 05, which inserts zeros on the left.

## Slide 9: The complete program: l08.S (1 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l08.S (2 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: The complete program: l08.S (3 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 12: The complete program: l08.S (4 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 13: The complete program: l08.S (5 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 14: The complete program: l08.S (6 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 15: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 16: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 17: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 18: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 19: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 20: Exercises: paper first, then PRG32

Five exercises. Prove the second of De Morgan's laws by perfect induction. Simplify an expression, naming the law that justifies each step. Write the mask and the test for "A and B pressed together", noting that testing merely for a non-zero result would express "A or B", a common logical error. Modify the lamps so that they display the complement of the buttons. And convert a letter between upper and lower case with a single instruction, recalling from Lecture 04 that the two codes differ in exactly one bit.
