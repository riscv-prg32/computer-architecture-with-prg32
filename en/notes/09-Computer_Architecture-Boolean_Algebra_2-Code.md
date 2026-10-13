# Lecture 09: Elements of Boolean Algebra: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Elements of Boolean Algebra: the code

This is the code deck of Lecture 09. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l09.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: One-bit addition without add

The sum of two bits can be 0, 1 or 2, so the result needs two bits. `xor` gives the low bit, which is 1 when the two inputs differ; `and` gives the high bit, the carry, which is 1 only when both are 1. The comment under the code is a truth table with two outputs: check its four rows. This pair of gates has a name, the *half adder*. The last callout states the problem of the day: here the gates were given; how do you find them when only the table is known?

## Slide 4: A full adder, one gate per instruction

The full adder written as five instructions, one per gate: two `xor` for the sum, two `and` and an `or` for the carry out. The program is the schematic, read from left to right. It lets you practise both problems of Lecture 08. Analysis: single-step it in PRG32-QT for the eight input combinations and fill in the truth table. Synthesis: derive these gates from the table. With whole registers as inputs, the same five lines work on all thirty-two bit positions at once.

## Slide 5: The complete program: l09.S (1 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 6: The complete program: l09.S (2 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 7: The complete program: l09.S (3 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l09.S (4 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l09.S (5 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l09.S (6 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 12: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 13: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 14: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 15: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 16: Exercises: paper first, then PRG32

Five exercises. Write the canonical forms of the two outputs of the full adder. Minimise the carry out with a map of three variables and count the gates saved. Minimise a function of four variables given as a list of minterms: remember the corners. Build NOT, AND and OR using only NAND gates and check each with a truth table. Then program the full adder on PRG32 and show its outputs as lamps for the eight input combinations.
