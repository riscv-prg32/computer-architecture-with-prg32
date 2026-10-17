# Lecture 06: Number Representation: Real Numbers: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: fixed point; one's complement and excess-k; IEEE 754 floating point; the name RV32IMAC. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) represent a real number in fixed point and compute with it using integer instructions; (2) decode an IEEE 754 single-precision number; (3) read the name RV32IMAC and say what the kit can and cannot compute in hardware. Builds on: only what Lecture 01 set up. Next: Lecture 07, Verm1, Part 1: A Head That Crosses the World.

Closing thread: Without an F extension, fractions are integers with an agreed scale: Verm1 will move its head by fractions of a cell exactly this way. Next: the first part of the project.

## Slide 1: Number Representation: Real Numbers: the code

This is the code deck of Lecture 06. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l06.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Three-eighths of a pixel, with integers only

The warm-up poses the problem. One pixel per frame is too fast, and zero is no motion at all: the ball requires 0.375 pixels per frame, on a processor with integer instructions only. The solution is to store the position multiplied by 256. `ball_update` adds 96 at each frame, and 96/256 = 0.375. `ball_draw` needs a whole pixel, so it shifts the value right by eight positions, dividing by 256, with `srai`, the arithmetic shift that preserves the sign. All the arithmetic is performed with integer instructions. The suffix `_q8` in the names records that the value carries eight fractional bits, a naming discipline that prevents scaled and unscaled quantities from being confused.

## Slide 4: The ball, bit by bit: Q24.8

The ball examined bit by bit. The word 0x00002A60 divides into a 24-bit integer part, 0x2A, that is 42 pixels, and an 8-bit fraction, 0x60, that is 96/256 = 0.375. Read as an integer the word is 10848, and 10848/256 = 42.375, confirming the interpretation. The table states the rules of fixed-point arithmetic: addition and subtraction work exactly as for integers, because the binary points are aligned; whole pixels are obtained by shifting right by f; and after a multiplication a right shift by f is required, because the product carries twice as many fractional bits as its factors.

## Slide 5: Floating point is not the real numbers

Floating-point numbers behave almost like the real numbers, and the qualification "almost" is the source of genuine errors. 0.1 has no finite binary expansion and is stored approximately, so that 0.1 + 0.2 is not exactly 0.3, as the code demonstrates. The practical rule follows: two floating-point results are never compared for equality, but their difference is compared with a tolerance. Addition is not even associative, so the order of operations affects the result. For monetary amounts and for positions in a game, scaled integers, that is, fixed point, are frequently the appropriate tool.

## Slide 6: The complete program: l06.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l06.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l06.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 10: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 11: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 12: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 13: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 14: Exercises: paper first, then PRG32

Five exercises. On paper: write -6 in the four signed encodings; encode 10.5 and 0.15625 in IEEE 754 single precision; decode 0xBF800000. On PRG32: run the ball at three different speeds and determine after how many frames it advances by one pixel, comparing the observation with the value predicted from the resolution; then give it a vertical velocity and make it bounce at the edges by negating the velocity with `neg`. The results are given in the green box, which should be consulted only after one's own answers have been worked out.
