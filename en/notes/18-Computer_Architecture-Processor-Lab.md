# Lecture 18: The Processor: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: accumulator, stack, registers; the processor model; the registers of RISC-V; the calling convention; the stack; the RV32 processor. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: interrupts and traps (Lecture 19). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: The Processor: the code

This is the code deck of Lecture 18. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l18.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: z = x + y

The warm-up. To compute z = x + y the program loads x into one register and y into another, adds the two registers into a third, and stores the result in z: seven lines for one sum. Memory is accessed only by `lw` and `sw`; arithmetic takes place only between registers. Other processors perform the same task with three instructions, or with one. Why is RISC-V designed in this way? Answering the question requires first a model of what a processor is, and then a comparison of the different ways of building one, which is the plan of the lecture.

## Slide 4: Push and pop in RISC-V

In RISC-V the stack pointer `sp` holds the address of the last occupied location, and the stack grows towards lower addresses. A push takes two instructions: subtract 4 from `sp`, then store at the new top. A pop is the reverse: load from the top, then add 4. The table compares three processors: RISC-V requires two instructions, the 68000 one instruction with a pre-decrement addressing mode, x86 a dedicated instruction. In practice a RISC-V function allocates its entire frame once, sixteen bytes at a time to respect the alignment the calling convention requires, as has been done since Lecture 02.

## Slide 5: z = x + y in four processors

The sum of the warm-up on four machines. The accumulator machine: load x, add y, store z. The stack machine: push x, push y, add, pop z. A register machine with memory operands: move x into a register, add y to it, move the register into z. RISC-V: two loads, a register-to-register add, a store. Three memory accesses occur in every case. What differs is the number of instructions and the work each performs: in RISC-V each instruction does exactly one thing, which is what allows each to be executed quickly and in a pipeline.

## Slide 6: The complete program: l18.S (1 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l18.S (2 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l18.S (3 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l18.S (4 of 4)

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

Five exercises. Write z = (a + b) - (c + d) for an accumulator machine, a stack machine and RISC-V, counting instructions and memory accesses in each. Write push and pop of two registers while keeping `sp` a multiple of 16, as the calling convention requires. Classify the registers of one's latest program by function, distinguishing caller-saved from callee-saved. Single-step a call and its return in PRG32-QT, observing `pc`, `ra` and `sp`. And identify the processor of one's own phone or laptop, locating it among the models of the lecture.
