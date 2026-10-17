# Lecture 11: Combinational Machines: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: multiplexers; combinational machines; codes; decoders and encoders; comparators and parity; the ALU. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: finite-state machines (Lecture 13). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) tell a combinational machine from a sequential one; (2) use decoders, multiplexers, comparators and parity; (3) explain the ALU as parallel units and a multiplexer. Builds on: only what Lecture 01 set up. Next: Lecture 12, Verm1, Part 2: Steering, Food and a Score.

Bridge. In Lecture 02 an instruction was a 32-bit number, and the processor somehow knew what to do with it. Today a decoder reads a field of that number, funct3, and drives the multiplexer that picks the ALU's result. Lecture 19 describes all the fields and the fetch, decode, execute cycle. Recall: Which part of the word of an instruction tells the ALU to add rather than to compute an AND?

Closing thread: The ALU that executed every add so far is one large combinational machine: many results computed at once, one chosen. Next: these circuits at work in the second part of Verm1.

## Slide 1: Combinational Machines: the code

This is the code deck of Lecture 11. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l11.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Choose one of four colours

The warm-up. `a0` holds a selector from 0 to 3, and the four instructions are the array access of Lecture 04: load the address of the table, multiply the selector by 4, add, and load the selected word. The same selector always yields the same colour, and nothing persists from one use to the next. This behaviour, outputs determined solely by present inputs, defines the machines studied today. In hardware this particular machine is a *multiplexer*: four data inputs, two selection bits, one output. The software takes four instructions; the hardware answers in a fraction of a nanosecond.

## Slide 4: In the processor: which register is written?

A decoder at work in the processor. The instruction `addi t1, t1, 1` contains a 5-bit field, `rd`, holding the number of the destination register: 00110, that is 6, the register `t1`. A 5-to-32 decoder turns those five bits into thirty-two write-enable lines, of which only the sixth is active, so that only that register receives the result. The same instruction contains two further register numbers, which select the registers to be read, by means of multiplexers.

## Slide 5: In the processor: register or constant?

A multiplexer at work in the processor. `add t2, t0, t1` adds two registers; `addi t2, t0, 5` adds a register and a constant drawn from the instruction. Both use the same adder. A multiplexer in front of the second ALU input chooses between the value of a register and the constant, its selection line being 0 for `add` and 1 for `addi`. It is a multiplexer on whole words, thirty-two one-bit multiplexers sharing a selection line. Reading a register from the register file is likewise a multiplexer, with the register number as selector.

## Slide 6: A parity network in seven instructions

A parity network in software, for one byte. Each pair of instructions shifts the value right and combines it with itself by XOR: the first fold reduces eight bits to four, the second four to two, the third two to one. The final instruction retains only the lowest bit, which is the parity. In hardware the same three levels constitute a tree of seven XOR gates, whose depth, logarithmic in the number of bits, determines its delay. The listing should be traced by hand with 0x53, which has four 1s, and with 0x13, which has three.

## Slide 7: RISC-V instructions and the ALU

How an instruction selects the operation. The 3-bit field `funct3` of the instruction is a compact code: 000 for sum or difference, 001 for left shift, 100 for XOR, 110 for OR, 111 for AND. A small decoder turns it into the selection lines of the ALU multiplexer. Where two instructions share a code, such as `add` and `sub`, an additional bit elsewhere in the instruction distinguishes them. A code, a decoder, a multiplexer: the entire lecture appears in one table, embedded in the processor.

## Slide 8: The complete program: l11.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l11.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l11.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 12: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 13: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 14: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 15: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 16: Exercises: paper first, then PRG32

Five exercises. Synthesise segment g with a Karnaugh map, exploiting the don't-care conditions. Build a 3-to-8 decoder from two 2-to-4 decoders with enable and one inverter. Implement a function with a single multiplexer by placing its truth table on the data inputs, and identify the function. Write a comparator in assembly using only `xor` and `sltiu`. And draw a seven-segment digit on PRG32: a table of ten bytes, one per digit, and seven rectangles lit by testing its bits, which is a transcoder realised in software.
