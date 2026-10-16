# Lecture 24: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the performance equation; superscalar processors; vector instructions; HPC and Amdahl's law; GPU and FPGA accelerators. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs: the code

This is the code deck of Lecture 24. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l24.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: The loop that empties the map

The warm-up: the loop in `new_game` that clears the map, setting 960 bytes to zero. Each iteration executes four instructions: a byte store, the increment of the address, the decrement of the counter, and the branch back, for 3,840 instructions in all, one byte and one instruction at a time. On the kit it takes about 24 microseconds, and nothing requires it to be faster. It was chosen because it is small enough to be followed onto every class of contemporary machine. The lecture's question is: in how many distinct ways can it be made faster?

## Slide 4: What gets in the way: dependences

What impedes parallel execution. The second instruction uses `t0`, which the first is still computing, so it cannot execute alongside it: a *data dependence*. The third depends on nothing, yet in an in-order processor it waits behind the second. The fourth is a branch: until it is resolved the processor cannot know whether the fifth must be executed, a *control dependence*. Real programs are full of such chains, so issue width alone does not deliver speed; the remedy is to let independent instructions overtake.

## Slide 5: Register renaming: thirty-two names, many registers

Register renaming illustrated. On the left, the code as written: two halves, each loading a word, incrementing it and storing it back, and both using `t0`. The second half reuses the name, not the value, which constitutes a false dependence. On the right, after renaming, each new value has its own physical register, so the two halves share nothing and can execute simultaneously. The thirty-two registers of the instruction set are names; the chip contains a few hundred physical registers. The register numbers on the slide are illustrative.

## Slide 6: The same loop, with vectors

The same loop written with the vector extension. `v0` is a vector register, many bytes wide, filled with zeros. In each iteration `vsetvli` asks how many of the remaining bytes fit in a register, and the answer is placed in `t2`. `vse8.v` stores that many bytes in a single instruction, and the address and the counter advance by `t2`. With 128-bit registers one iteration handles 16 bytes: 60 iterations instead of 960. The code never states the width of the registers, so the same binary is correct for any width, a property called vector-length agnosticism, which the test verifies at four widths.

## Slide 7: A sum, lane by lane

A sum computed lane by lane. A vector register holds several words, each in its own *lane*. `vle32.v` loads several words at once; `vadd.vv` adds two registers lane by lane, so that `v1` accumulates as many partial sums as there are lanes. At the end `vredsum` reduces the lanes to a single number. With the sixteen numbers from 1 to 16 the result is 136. This is the parallel sum shown pictorially in Lecture 04, now expressed in instructions.

## Slide 8: The map of Verm1, one thread per cell

The map of Verm1 cleared on a GPU, in CUDA C. The function marked as a kernel executes once in every thread. Each thread first determines its identity, its index `i`, from its block number and its position within the block; then, if the index lies within the map, it clears its own cell. There is no loop: there are 960 threads. The last line, executed on the host, launches four blocks of 256 threads. For 960 bytes the two memory copies cost far more than the work, so the example illustrates the programming model, not a gain; a GPU pays off only when data are large and the work per element is substantial.

## Slide 9: The U-turn rule of Verm1, as hardware

The rule of Verm1 forbidding the U-turn, written as hardware in Verilog, a language that describes circuits rather than sequences of steps. The module has two two-bit inputs, the current direction and the requested one, and one output. The `assign` statement denotes a wire that holds continuously: the output is 1 when the XOR of the two directions equals binary 10. There is no before and after, only a combinational relation. On the kit the same rule took three instructions and three cycles; as hardware it answers in a fraction of a nanosecond, continuously.

## Slide 10: Emptying the map of Verm1: 960 cells

Clearing the 960 cells of the map on five machines. On the kit: one byte per iteration, 3,840 cycles. On an out-of-order RISC-V core: the same binary, in a fraction of those cycles. With 128-bit vectors: 60 iterations. On a GPU: one launch of 960 threads, plus two copies. On an FPGA: 960 flip-flops with a common reset, cleared in one clock cycle. The work is identical; what differs is how much of it occurs simultaneously, and at what cost. The engineer's question is not which machine is fastest, but which is sufficient.

## Slide 11: The complete program: l24.S (1 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 12: The complete program: l24.S (2 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 13: The complete program: l24.S (3 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 14: The complete program: l24.S (4 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 15: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 16: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 17: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 18: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 19: The vector listings: test them on upstream QEMU

The vector listings of this lecture cannot run on the kit, whose processor does not implement the V extension. They are therefore tested on a bare emulated RV32 processor: the commands build a single binary and execute it with four different vector lengths. The exit code is the result, zero meaning that every check passed, which also demonstrates that the code is independent of the vector length.

## Slide 20: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 21: Exercises: paper first, then the machine

Five exercises. Complete the Amdahl table for p = 0.95. Draw the pipeline diagram of a three-wide processor executing nine independent instructions. Rename the registers of a fragment of Verm1 and identify which instructions could execute in the same cycle. Write the truth table of a four-input look-up table implementing the U-turn rule. And build the vector test and run it on QEMU with two different vector widths, explaining why the same binary works in both cases.
