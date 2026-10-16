# Lecture 24: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the performance equation; superscalar processors; vector instructions; HPC and Amdahl's law; GPU and FPGA accelerators. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs: the code

This is the code deck of Lecture 24. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l24.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: The loop that empties the map

The loop that empties the map in `new_game`: 960 bytes set to zero. Four instructions per turn: a store of one byte, the increment of the address, the decrement of the counter, the branch back. In all 3,840 instructions, one byte at a time, one instruction at a time. On the kit it takes about 24 microseconds, and nobody needs it faster. It is chosen because it is small enough to be followed onto every machine of today. In how many ways can it be made faster?

## Slide 4: What gets in the way: dependences

What gets in the way. The second instruction uses `t0`, which the first is still computing: it cannot run beside it. This is a *data dependence*. The third depends on nobody, and yet in an in-order processor it waits behind the second. The fourth is a branch: until it is resolved the processor does not know whether the fifth must be executed. This is a *control dependence*. Real programs are full of such chains, so width alone is not enough.

## Slide 5: Register renaming: thirty-two names, many registers

Register renaming on an example. On the left the code as written: two halves, each loading a word, incrementing it and storing it back, and both using `t0`. The second half reuses the name, not the value: it is a false dependence. On the right, after renaming, each new value has its own physical register, and the two halves share nothing, so they can execute at the same time. The thirty-two registers you know are names; the chip has a few hundred registers.

## Slide 6: The same loop, with vectors

The same loop with the vector extension. `v0` is a vector register, many bytes wide, filled with zeros. In each turn `vsetvli` asks: of the bytes still to do, how many fit in a register? The answer goes in `t2`. `vse8.v` stores that many bytes with a single instruction, and the address and the counter advance by `t2`. With 128-bit registers a turn handles 16 bytes: 60 turns instead of 960. The code never states the width of the registers, so the same program works with any width.

## Slide 7: A sum, lane by lane

A sum, lane by lane. A vector register holds several words, each in its own *lane*. `vle32.v` loads several words at once; `vadd.vv` adds two registers lane by lane, so that `v1` accumulates as many partial sums as there are lanes. At the end `vredsum` adds the lanes together into one number. With the sixteen numbers from 1 to 16 the result is 136. It is the parallel sum you saw as a picture in Lecture 04, now as instructions.

## Slide 8: The map of Verm1, one thread per cell

The map of Verm1 on a GPU. The function marked as kernel runs once in every thread. Each thread first computes who it is, its index `i`, from the number of its block and its position in the block; then, if the index is inside the map, it clears its own cell. There is no loop: there are 960 threads. The last line, on the host, launches four blocks of 256 threads. For 960 bytes the two copies cost far more than the work: this example shows the form, not a gain.

## Slide 9: The U-turn rule of Verm1, as hardware

The rule of Verm1 that forbids the U-turn, written as hardware. Verilog is a language that describes circuits, not sequences of steps. The module has two inputs of two bits, the current direction and the one requested, and one output. The line with `assign` is a wire that is always true: the output is 1 when the XOR of the two directions equals binary 10. There is no before and after. On the kit the same rule took three instructions.

## Slide 10: Emptying the map of Verm1: 960 cells

Emptying the 960 cells of the map. On the kit: one byte per turn, 3,840 cycles. On an out-of-order RISC-V core: the same binary, in a fraction of those cycles. With 128-bit vectors: 60 turns. On a GPU: one launch of 960 threads, plus two copies. On an FPGA: 960 flip-flops with a common reset, one clock cycle. The work is the same; what changes is how much of it happens at the same time, and what it costs to obtain it. The engineer's question is not which is fastest, but which is enough.

## Slide 11: The complete program: l24.S (1 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 12: The complete program: l24.S (2 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 13: The complete program: l24.S (3 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 14: The complete program: l24.S (4 of 4)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 15: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 16: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 17: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 18: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 19: The vector listings: test them on upstream QEMU

The vector listings of this lecture cannot run on the kit, whose processor has no V extension. They are tested on a bare emulated processor instead: the commands build one binary and run it with four vector lengths. The exit code is the result.

## Slide 20: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 21: Exercises: paper first, then the machine

Five exercises. Fill in the Amdahl table for p = 0.95. Draw the pipeline diagram of a three-wide processor for nine independent instructions. Rename the registers of a fragment of Verm1 and say which instructions could run in the same cycle. Write the truth table of a four-input look-up table for the U-turn rule. And build the vector test and run it on QEMU with two different widths: why does the same binary work?
