# Lecture 04: Representing Digital Information: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: analog and digital; bit, byte, word; hexadecimal; positional notation; a colour is a number; characters and strings; little-endian byte order; data structures; arrays in memory; algorithms. USE NOW: shifts as multiplications (Lecture 05) and, used without being studied in this course, the complete program, the PRG32 tools. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Representing Digital Information: the code

This is the code deck of Lecture 04. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l04.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: An array in memory, an element in a register

An array of four words, and the four instructions that read element 2. `la` loads the base address, that of the first element. The index is multiplied by 4, the size of a word in bytes, by a left shift of two positions, since shifting a binary number one position to the left doubles it; this property is proved in Lecture 05 and is used here. `add` forms the address of the element, base plus scaled index, and `lw` reads its value, 34. The high-level expression `scores[i]` compiles to exactly this sequence. What is absent is equally instructive: nothing checks that the index is less than 4, so an out-of-range index silently reads whatever follows the array in memory.

## Slide 4: A probabilistic algorithm: is n prime?

Two examples of algorithms that use randomness deliberately. The first tests whether a number is prime by trying random bases: if any test fails, the number is certainly composite; if thirty tests pass, it is prime with overwhelming probability. Accepting a negligible probability of error in exchange for a large gain in speed is standard practice in cryptography, where real libraries use the Miller-Rabin variant of the test. The second is a random walk: the path differs at every run, and a simulation estimates its properties by averaging many runs. The listing is pseudo-code, intended to convey the algorithm rather than to be compiled.

## Slide 5: The complete program: l04.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 6: The complete program: l04.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l04.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 9: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 10: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 11: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 12: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 13: Exercises on PRG32

Four exercises on the cartridge of Lecture 02. An RGB565 value is computed by hand before it is tried: the three intensities are chosen, the fields written in binary, and the bits grouped by four to obtain the hexadecimal constant. The student's name is printed and its bytes counted, terminator included. An array of colours is declared with `.word` and read with `lw`, following the pattern of the array slide. Finally the string and the array are located in the memory view of PRG32-QT, where the terminating zero should be found and each word should be seen to present its least significant byte first, confirming the little-endian order.
