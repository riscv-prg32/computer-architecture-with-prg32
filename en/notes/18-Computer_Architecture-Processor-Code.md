# Lecture 18: The Processor: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: The Processor: the code

This is the code deck of Lecture 18. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l18.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: z = x + y

To compute z = x + y the program loads x into a register, loads y into another, adds the two registers into a third, and stores the result in z. Seven lines for one sum. Memory is touched only by `lw` and `sw`; the arithmetic happens only between registers. Other processors do the same job with three instructions, or with one. Why is RISC-V made like this? To answer we need a model of what a processor is, and then a comparison between different ways of building one.

## Slide 4: Push and pop in RISC-V

In RISC-V the stack pointer `sp` holds the address of the last occupied location, and the stack grows towards low addresses. A push is two instructions: subtract 4 from `sp`, then store on the new top. A pop is the reverse: load from the top, then add 4. The table compares three processors: RISC-V needs two instructions, the 68000 one instruction with a special addressing mode, x86 a dedicated instruction. In practice a RISC-V function allocates its whole frame once, as you have done since Lecture 02.

## Slide 5: z = x + y in four processors

The sum of the warm-up in four machines. The accumulator machine: load x, add y, store z. The stack machine: push x, push y, add, pop z. A register machine with memory operands: move x into a register, add y to it, move the register into z. RISC-V: two loads, an add between registers, a store. The memory accesses are three in every case. What changes is the number of instructions and how much each one does: in RISC-V each does one thing only.

## Slide 6: The complete program: l18.S (1 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 7: The complete program: l18.S (2 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l18.S (3 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l18.S (4 of 4)

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

Five exercises. Write the expression z = (a + b) - (c + d) for an accumulator machine, a stack machine and RISC-V, counting instructions and memory accesses. Write push and pop of two registers keeping `sp` a multiple of 16. Classify the registers of your last program by function. Single-step a call and its return in PRG32-QT, watching `pc`, `ra` and `sp`. And look up the processor of your phone or laptop.
