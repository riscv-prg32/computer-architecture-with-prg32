# Lecture 19: Instructions and Interrupts: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: instruction formats; addressing modes; the processor cycle; interrupts and traps. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) decode a RISC-V instruction into its fields; (2) name the addressing mode of each operand; (3) describe the instruction cycle and what an interrupt changes. Builds on: only what Lecture 01 set up. Next: Lecture 20, Buses and the Video Card.

Closing thread: The number 0x00130313 of Lecture 02 can now be read field by field, and the processor that fetches it can be interrupted and resumed. Next: the devices that the processor serves.

## Slide 1: Instructions and Interrupts: the code

This is the code deck of Lecture 19. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l19.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Four words in memory

The warm-up: four words of memory, four addresses apart, which together constitute `first_update`, the function of Lecture 02 that increments a counter. On the left are the addresses, in the centre the machine code, on the right the source as written. The processor possesses only the central column. Three questions organise the lecture. How does it know that the first word is a load and the second an addition? Which steps does it take to execute each? And while executing them, how does it notice that a button has been pressed or a timer has expired?

## Slide 4: Decoding by hand

Two instructions decoded by hand. The eight hexadecimal digits are written in binary; the last seven bits, the opcode, are separated first, since they determine the format; the remaining fields are then separated accordingly. For 0x006283B3 the opcode indicates a register-to-register operation, the fields give x7, x5 and x6, and `funct3` with `funct7` select addition: `add t2, t0, t1`. For 0x0002A303 the opcode indicates a load, the immediate is 0, the base x5 and the destination x6: `lw t1, 0(t0)`. The exercise should be done once with pencil and paper; it is the inverse of the assembler's work.

## Slide 5: The fetch phase, transfer by transfer

The fetch phase expressed as four register transfers, using the registers of the reference model of Lecture 18. The content of the PC goes to MA, the memory address register. Memory is read, and the word arrives in MB, the buffer register. The word is copied into D, the decoding register. The PC is incremented by 4, because an instruction occupies four bytes, so that it points to the next instruction. Each row is a transfer on the internal bus, commanded by the control unit.

## Slide 6: The rest of the cycle for two instructions

The remaining four phases, side by side for two instructions. For `add`, decoding reads the two registers into the ALU operand registers, execution adds them, the memory phase is skipped, and the sum is written into `t2`. For `lw`, the second operand is the immediate, the sum is an *address*, the memory phase reads the word at that address, and the word read is written into `t1`. The same adder serves both instructions; only the commands issued by the control unit differ. The economy of the datapath rests on this sharing.

## Slide 7: A trap handler, in outline

A trap handler in outline. It reserves space on the stack and saves the registers it will use, the software part of the context. It reads `mcause` with `csrr` and tests its sign: the top bit is the sign bit, so `bgez` separates exceptions from interrupts in one instruction. After serving the event it restores the registers, releases the stack and executes `mret`. The interrupted program must observe nothing: a single register left modified here produces an error that appears at random, anywhere, which makes the discipline of saving the context non-negotiable. A production handler saves every caller-saved register, usually on a separate stack reached through `mscratch`.

## Slide 8: The complete program: l19.S (1 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l19.S (2 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l19.S (3 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: The complete program: l19.S (4 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 12: The complete program: l19.S (5 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 13: The complete program: l19.S (6 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 14: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 15: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 16: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 17: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 18: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 19: Exercises: paper first, then PRG32

Five exercises. Decode two words by hand, giving format, fields and assembly. Encode `sub t0, t1, t2` and `sw a0, 8(sp)`, following the inverse path. Write the register transfers of the complete cycle for a store and for a branch. Draw the pipeline diagram of six instructions on four stages and determine in which cycle the sixth completes. And in PRG32-QT, halt in `first_update`, single-step, and compare the machine code displayed with one's own decoding of the warm-up.
