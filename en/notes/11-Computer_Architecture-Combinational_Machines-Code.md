# Lecture 11: Combinational Machines: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: multiplexers; combinational machines; codes; decoders and encoders; comparators and parity; the ALU. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: finite-state machines (Lecture 13). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Combinational Machines: the code

This is the code deck of Lecture 11. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l11.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Choose one of four colours

`a0` holds a number from 0 to 3. The four instructions are the array access of Lecture 04: load the address of the table, multiply the selector by 4, add, and load the selected word. The same selector always gives the same colour, and nothing is remembered from one use to the next. This behaviour, outputs that depend only on the present inputs, defines the machines of today. In hardware this particular one is a *multiplexer*: four data inputs, two selection bits, one output.

## Slide 4: In the processor: which register is written?

A decoder at work in the processor. The instruction `addi t1, t1, 1` contains a 5-bit field, `rd`, with the number of the destination register: 00110, that is 6, the register `t1`. A 5-to-32 decoder turns those five bits into thirty-two write-enable lines, of which only the sixth is active: only that register receives the result. The same instruction contains two more register numbers, which select the registers to be read.

## Slide 5: In the processor: register or constant?

A multiplexer at work in the processor. `add t2, t0, t1` adds two registers; `addi t2, t0, 5` adds a register and a constant taken from the instruction. Both use the same adder. A multiplexer in front of the second input of the ALU chooses between the value of a register and the constant: its selection line is 0 for `add` and 1 for `addi`. It is a multiplexer on whole words: thirty-two one-bit multiplexers with a common selection line. Reading a register is a multiplexer too.

## Slide 6: A parity network in seven instructions

A parity network in software, for one byte. Each pair of instructions shifts the value right and combines it with itself by XOR: the first fold brings eight bits onto four, the second four onto two, the third two onto one. The last instruction keeps only the lowest bit, which is the parity. In hardware the same three levels are a tree of seven XOR gates. Trace it by hand with 0x53, which has four 1s, and with 0x13, which has three.

## Slide 7: RISC-V instructions and the ALU

How an instruction chooses the operation. The 3-bit field `funct3` of the instruction is a compact code: 000 for sum or difference, 001 for shift left, 100 for XOR, 110 for OR, 111 for AND. A small decoder turns it into the selection lines of the multiplexer of the ALU. Where two instructions share a value, such as `add` and `sub`, one more bit elsewhere in the instruction distinguishes them. A code, a decoder, a multiplexer: the whole lecture in one table.

## Slide 8: The complete program: l11.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l11.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l11.S (3 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 12: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 13: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 14: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 15: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 16: Exercises: paper first, then PRG32

Five exercises. Synthesise segment g with a map, using the don't-cares. Build a 3-to-8 decoder from two 2-to-4 decoders with enable and one inverter. Implement a function with one multiplexer by putting its truth table on the data inputs, and recognise the function. Write a comparator in assembly with only `xor` and `sltiu`. And draw a seven-segment digit on PRG32: a table of ten bytes, one per digit, and seven rectangles lit by testing its bits: a transcoder in software.
