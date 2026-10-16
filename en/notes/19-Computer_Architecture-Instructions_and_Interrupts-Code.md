# Lecture 19: Instructions and Interrupts: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: instruction formats; addressing modes; the processor cycle; interrupts and traps. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Instructions and Interrupts: the code

This is the code deck of Lecture 19. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l19.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Four words in memory

Four words of memory, four addresses apart: this is `first_update`, the function that increments a counter. On the left the addresses, in the middle the machine code, on the right what you wrote. The processor has only the middle column. Three questions organise the lecture. How does it know that the first word is a load and the second an addition? Which steps does it take for each? And while it executes them, how does it notice that a button was pressed or a timer expired?

## Slide 4: Decoding by hand

Two instructions decoded by hand. Write the eight hexadecimal digits in binary; cut off the last seven bits, the opcode, which tells you the format; then cut the remaining fields. For 0x006283B3 the opcode says register to register, the fields give x7, x5 and x6, and `funct3` with `funct7` say addition: `add t2, t0, t1`. For 0x0002A303 the opcode says load, the immediate is 0, the base is x5, the destination x6: `lw t1, 0(t0)`. Do it once with pencil and paper.

## Slide 5: The fetch phase, transfer by transfer

The fetch phase in four register transfers, using the registers of the model of Lecture 18. The content of the PC goes to MA, the memory address register. The memory is read and the word arrives in MB, the buffer. The word is copied into D, the decoding register. The PC is increased by 4, because an instruction occupies four bytes, so that it points to the next one. Each row is a transfer on the internal bus, commanded by the control unit.

## Slide 6: The rest of the cycle for two instructions

The other four phases, side by side for two instructions. For `add`, decoding reads the two registers into the operand registers of the ALU, execution adds them, the memory phase is skipped, and the sum is written in `t2`. For `lw`, the second operand is the immediate, the sum is an *address*, the memory phase reads the word at that address, and the word read is written in `t1`. The same adder serves both: only the commands of the control unit differ.

## Slide 7: A trap handler, in outline

A handler in outline. It makes room on the stack and saves the registers it is going to use: the software part of the context. It reads `mcause` with `csrr` and tests its sign: the top bit is the sign bit, so `bgez` separates exceptions from interrupts with one instruction. After serving the event it restores the registers, releases the stack and executes `mret`. The interrupted program must not notice anything: one register left dirty here is a bug that appears at random, anywhere.

## Slide 8: The complete program: l19.S (1 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l19.S (2 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l19.S (3 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: The complete program: l19.S (4 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 12: The complete program: l19.S (5 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 13: The complete program: l19.S (6 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 14: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 15: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 16: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 17: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 18: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 19: Exercises: paper first, then PRG32

Five exercises. Decode two words by hand, with format, fields and assembly. Encode `sub t0, t1, t2` and `sw a0, 8(sp)`: the inverse path. Write the register transfers of the whole cycle for a store and for a branch. Draw the pipeline diagram of six instructions on four stages and say when the sixth finishes. And in PRG32-QT stop in `first_update`, step, and compare the machine code shown with your decoding of the warm-up.
