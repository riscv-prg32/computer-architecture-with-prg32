# Lecture 13: Sequential Machines: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: finite-state machines; the clock; latches and flip-flops; registers as flip-flops. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Sequential Machines: the code

This is the code deck of Lecture 13. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l13.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: A game is a state machine

The warm-up: a game with a title screen, a playfield and a game-over screen. The variable `state` holds one of three values. `game_update` reads button A and the present state: in TITLE, pressing A leads to PLAY; in OVER, pressing A leads back to TITLE; otherwise nothing changes. The effect of A therefore depends on the state, which is the defining property of a *state machine*: `update` computes the next state from the present state and the input, the state persists in memory from frame to frame, and `draw` renders a screen for each state. The program anticipates every concept of the lecture.

## Slide 4: The warm-up as a state diagram

The game of the warm-up drawn as a state diagram: three states, with A leading from TITLE to PLAY and from OVER to TITLE, and the exhaustion of lives leading from PLAY to OVER. The self-loops represent the cases in which nothing changes. The table below lists, for each state, the input that changes it, the next state and the output drawn. Drawing the diagram before writing the code is the most valuable design habit for a game, because it forces every transition to be considered explicitly. The diagram also reveals a defect discussed in the warm-up note: holding A on OVER passes through TITLE to PLAY, which only an additional bit of state can prevent.

## Slide 5: The program counter: a register in a loop

The *program counter*, PC, is the register holding the address of the instruction being executed. Its next value is computed by a small network: an adder yields PC + 4, the address of the following instruction, and a multiplexer chooses between that and the target of a branch. At each clock edge the next value becomes the present one. The structure is exactly the general architecture of a sequential machine. With only the +4 path it is a counter, the simplest of all state machines.

## Slide 6: The processor is a sequential machine

The processor as a whole is a sequential machine. Its state comprises the program counter, the thirty-two registers and the memory. Its input is the instruction found at the address in the PC, together with the data it reads. The next-state network consists of decoders, multiplexers and the ALU, and at each clock edge the registers named by the instruction take their new values. Executing a program is a traversal of the states of a very large state machine, and single-stepping in PRG32-QT exhibits that traversal one state at a time.

## Slide 7: The complete program: l13.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l13.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l13.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 11: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 12: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 13: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 14: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 15: Exercises: paper first, then PRG32

Five exercises. Design a machine whose output is 1 when the last two inputs were both 1, both as a Moore and as a Mealy machine, and compare the number of states required. Complete a timing diagram of an SR latch. Synthesise a modulo-3 counter with two D flip-flops, considering what should happen in the unused fourth state. Add a PAUSE state to the game of the warm-up, drawing the diagram first. And make button A act only on a new press: this is edge detection in software, used in Verm1 Part 3.
