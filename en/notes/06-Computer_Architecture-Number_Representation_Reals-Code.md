# Lecture 06: Number Representation: Real Numbers: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: fixed point; one's complement and excess-k; IEEE 754 floating point; the name RV32IMAC. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Number Representation: Real Numbers: the code

This is the code deck of Lecture 06. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l06.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Three-eighths of a pixel, with integers only

One pixel per frame is too fast, and zero is no movement at all: the ball needs 0.375 pixels per frame. The trick is to store the position multiplied by 256. `ball_update` adds 96 at each frame, and 96 divided by 256 is 0.375. `ball_draw` needs whole pixels, so it shifts the value right by 8 positions, that is, divides by 256, with `srai`. All the arithmetic is done with integer instructions. The suffix `_q8` in the names is a reminder that the value carries eight fractional bits.

## Slide 4: The ball, bit by bit: Q24.8

The ball seen bit by bit. The word 0x00002A60 is divided into 24 bits of integer part, 0x2A, that is 42 pixels, and 8 bits of fraction, 0x60, that is 96/256 = 0.375. As an integer the word is 10848, and 10848 divided by 256 is 42.375. The table gives the rules: addition and subtraction work as for integers, because the points are aligned; to obtain whole pixels, shift right by f; after a multiplication, shift right by f, because the product has twice the fractional bits.

## Slide 5: Floating point is not the real numbers

Floating-point numbers behave almost like the real numbers, and the "almost" causes real bugs. 0.1 has no finite binary expansion, so it is stored approximately, and 0.1 plus 0.2 is not exactly 0.3, as the code shows. Hence the rule: never test two floating-point results for equality; compare their difference with a tolerance. Addition is not even associative. For money and for positions in a game, scaled integers, that is fixed point, are often the right tool.

## Slide 6: The complete program: l06.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 7: The complete program: l06.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l06.S (3 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 10: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 11: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 12: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 13: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 14: Exercises: paper first, then PRG32

Five exercises. On paper: write minus 6 in the four encodings; encode 10.5 and 0.15625 in single precision; decode 0xBF800000. On PRG32: run the ball with three speeds and count after how many frames it moves by one pixel, then give it a vertical speed and make it bounce by changing the sign of the speed with `neg` at the edges. The results are in the green box; work them out before looking.
