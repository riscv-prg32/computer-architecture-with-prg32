# Lecture 04: Representing Digital Information: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: analog and digital; bit, byte, word; hexadecimal; positional notation; a colour is a number; characters and strings; little-endian byte order; data structures; arrays in memory; algorithms. USE NOW: shifts as multiplications (Lecture 05) and, used without being studied in this course, the complete program, the PRG32 tools. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Representing Digital Information: the code

This is the code deck of Lecture 04. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l04.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: An array in memory, an element in a register

An array of four words, and the four instructions that read element 2. `la` loads the address of the first element. The index is multiplied by 4, the size of a word in bytes, with a shift to the left by 2: shifting by one position doubles a binary number. `add` forms the address of the element, and `lw` reads its value, 34. The expression `scores[i]` of a high-level language is exactly this. Note what is missing: nobody checks that the index is less than 4.

## Slide 4: A probabilistic algorithm: is n prime?

Two examples of algorithms that use chance. The first tests whether a number is prime by trying random values: if a test fails, the number is certainly composite; if thirty tests pass, it is prime with overwhelming probability. Trading a tiny chance of error for a great gain in speed is how cryptography works in practice. The second is a random walk: the path is different at every run, and a simulation averages many runs. The listing is pseudo-code, not a language you can compile.

## Slide 5: The complete program: l04.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 6: The complete program: l04.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 7: The complete program: l04.S (3 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 9: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 10: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 11: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 12: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 13: Exercises on PRG32

Four exercises on the cartridge of Lecture 02. Compute an RGB565 value by hand before trying it: choose the three intensities, write the fields in binary, group by four. Print your name and count the bytes, including the terminator. Declare an array of colours with `.word` and read it with `lw`, as on the slide of the array. Finally look at the string and the array in the memory view of PRG32-QT: find the zero at the end, and check that each word shows its least significant byte first.
