# Lecture 21: Input and Output: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: polling, interrupts, DMA; CRT and LCD displays; keyboard and mouse; printers. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) describe how displays, keyboards and printers work; (2) compare polling with interrupts for reading a device. Builds on: only what Lecture 01 set up. Next: Lecture 22, Verm1, Part 4: The Finished Game.

Closing thread: Reading the joystick once per frame is polling: simple, and blind between two reads. Next: the finished game.

## Slide 1: Input and Output: the code

This is the code deck of Lecture 21. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l21.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Read the world, once per frame

The warm-up: a function that reads the input once per frame. `prg32_input_read` returns in `a0` a word with one bit per button; the code copies it into `s0`, a callee-saved register, because the word must survive the call that plays a note, and in a temporary it would be lost. Each button is then tested with `andi` and a mask: 0x10 for A, 0x01 for LEFT. Behind each bit lies a switch on an input pin of the chip, and the runtime gathers the pins into one word, a decoded representation in the sense of Lecture 11. The program asks, once per frame, and this mode of operation has a name, polling. The other devices are less simple, and the lecture examines them.

## Slide 4: The complete program: l21.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 5: The complete program: l21.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 6: The complete program: l21.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 8: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 9: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 10: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 11: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 12: Exercises: paper first, then PRG32

Five exercises. Determine how many bits the code of a 104-key keyboard requires, and propose a suitable matrix of rows and columns. Compute the memory a printer needs for the bitmap of a page at 600 dots per inch. Move a pointer on the screen with the joystick, keeping it within the screen by clamping as in Lecture 05. Make button A act only once per press, by edge detection as in Lecture 13. And draw a score with seven-segment digits, using the table of Lecture 11.
