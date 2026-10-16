# Lecture 13: Sequential Machines: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: finite-state machines; the clock; latches and flip-flops; registers as flip-flops. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Sequential Machines: the code

This is the code deck of Lecture 13. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l13.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: A game is a state machine

A game with a title screen, a playfield and a game-over screen. The variable `state` holds one of three values. `game_update` reads the button A and the present state: in TITLE, pressing A leads to PLAY; in OVER, pressing A leads back to TITLE; otherwise nothing changes. So the effect of A depends on the state. This is a *state machine*: `update` computes the next state from the present state and the input, the state survives in memory from frame to frame, and `draw` shows a screen for each state.

## Slide 4: The warm-up as a state diagram

The game of the warm-up drawn as a diagram: three states, with A leading from TITLE to PLAY and from OVER to TITLE, and the end of the lives leading from PLAY to OVER. The loops on each state are the cases in which nothing changes. The table below lists, for each state, the input that changes it, the next state and the output drawn. Draw the diagram before writing the code: for a game it is the most useful design habit there is.

## Slide 5: The program counter: a register in a loop

The *program counter*, PC, is the register that holds the address of the instruction being executed. Its next value is computed by a small network: an adder gives PC plus 4, the address of the following instruction, and a multiplexer chooses between that and the target of a branch. At each clock edge the next value becomes the present one. It has exactly the shape of the general architecture. With only the plus 4 path it is a counter, the simplest of all state machines.

## Slide 6: The processor is a sequential machine

The whole processor is a sequential machine. Its state is the program counter, the thirty-two registers and the memory. Its input is the instruction found at the address in the PC, with the data it reads. The next-state network is made of decoders, multiplexers and the ALU. At the clock edge the registers named by the instruction take their new values. Running a program is a walk through the states of a very large state machine, and single-stepping in PRG32-QT shows that walk one state at a time.

## Slide 7: The complete program: l13.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l13.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l13.S (3 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 11: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 12: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 13: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 14: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 15: Exercises: paper first, then PRG32

Five exercises. Design a machine that outputs 1 when the last two inputs were both 1, as a Moore and as a Mealy machine, and compare the number of states. Complete a timing diagram of an SR latch. Synthesise a counter modulo 3 with two D flip-flops, and think about the unused fourth state. Add a PAUSE state to the game of the warm-up, drawing the diagram first. And make the button A work only when it is pressed again: this is edge detection in software.
