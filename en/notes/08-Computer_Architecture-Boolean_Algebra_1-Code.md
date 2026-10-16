# Lecture 08: Elements of Boolean Algebra: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; the von Neumann architecture; analysis and synthesis; Boolean algebra; logic gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: minimisation, Karnaugh maps (Lecture 09). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Elements of Boolean Algebra: the code

This is the code deck of Lecture 08. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l08.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Is LEFT pressed?

`prg32_input_read` returns all the buttons at once in `a0`, one bit per button. `andi t3, t0, 0x01` keeps bit 0 and forces every other bit to zero; the result is different from zero exactly when LEFT is pressed, and `beqz` skips the movement otherwise. The same pattern, with 0x02, tests RIGHT. The constant used with `andi` is called a *mask*. The last callout asks the question of the lecture: `andi` is thirty-two AND gates working side by side, so what is an AND?

## Slide 4: One bit per button

The value returned by the buttons is a word in which each bit has a meaning: bit 0 is LEFT, bit 1 RIGHT, bit 2 UP, bit 3 DOWN, bits 4 and 5 are A and B, bit 6 is START. If you hold RIGHT and A together you get 0x12, that is 0001 0010. In the picture each lamp is one bit of this word. Every question you can ask about the joystick, such as "is LEFT pressed but not RIGHT?", is a Boolean expression over these seven variables.

## Slide 5: Bitwise instructions: the algebra on a whole register

`and`, `or`, `xor` and `not` apply one gate to every pair of corresponding bits of two registers, all positions at once. The third column works out an example on eight bits: with a equal to 1100 1010 and b equal to 0000 1111, AND gives 0000 1010, OR gives 1100 1111, XOR gives 1100 0101. The last column shows the same operators in C. `not` is a pseudo-instruction: it is `xori` with minus 1, because minus 1 in two's complement is all ones.

## Slide 6: Four things to do with a mask

The four standard uses of a mask, each resting on a law of the algebra. To *test* a bit, AND with a mask that has 1 in that position: x AND 1 is x, x AND 0 is 0. To *set* it to 1, OR with the same mask. To *clear* it, AND with the complemented mask. To *toggle* it, XOR with the mask. In the last three cases the other bits are unchanged, and this is the whole point: a mask acts on the bits you choose and leaves the rest alone.

## Slide 7: De Morgan at the joystick

De Morgan in a program. The player is idle when neither LEFT nor RIGHT is pressed. The short version uses a mask with two bits, 0x03: the result is zero only if both bits are zero, that is NOT (LEFT OR RIGHT). The long version tests each button separately: (NOT LEFT) AND (NOT RIGHT). The second law of De Morgan says that the two are the same condition. Two instructions instead of five: simplifying an expression is useful in software as well as in hardware.

## Slide 8: One lamp per bit: shifting and masking

How to read bit number n of a word when n is in a register: shift the word right by n positions, so that the bit you want arrives in position 0, then mask with 1. Here `s0` holds the number of the lamp, `srl` shifts the button word, `andi` isolates the bit, and the colour is chosen accordingly: grey for off, yellow for on. Shift and mask is one of the most common idioms in low-level programming.

## Slide 9: The complete program: l08.S (1 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l08.S (2 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: The complete program: l08.S (3 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 12: The complete program: l08.S (4 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 13: The complete program: l08.S (5 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 14: The complete program: l08.S (6 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 15: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 16: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 17: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 18: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 19: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 20: Exercises: paper first, then PRG32

Five exercises. Prove the second law of De Morgan with a truth table. Simplify an expression, naming the law at each step. Write the mask and the test for "A and B pressed together": note that testing for a non-zero result would mean A or B. Change the lamps so that they show the complement of the buttons. And convert a letter between upper and lower case with one instruction, remembering from Lecture 04 that the two differ in one bit.
