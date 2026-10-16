# Lecture 00: Course Introduction: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the program-first method; the rules of the course. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: the pieces of PRG32 (Lecture 01); RISC and an open ISA (Lecture 03); the Verm1 project (Lecture 07). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Course Introduction: the code

This is the code deck of Lecture 00. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l00.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Before the next lecture: we install everything together

Homework for the next lecture, which is a hands-on installation. Bring your laptop, charged, on which you are allowed to install software. Download the installer of PRG32-QT for your system. At home, on a good connection, start the long download of ESP-IDF, following the README of PRG32. If something fails, do not lose an evening on it: bring the exact error message and it will be solved in class. The expected result is stated at the bottom: after Lecture 01 everyone has PRG32-QT running and a cartridge built on their own machine.

## Slide 4: The complete program: l00.S (1 of 2)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 5: The complete program: l00.S (2 of 2)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 6: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 7: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 8: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 9: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 10: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.
