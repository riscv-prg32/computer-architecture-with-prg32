# Lecture 02: First Contact: RISC-V Assembly on PRG32: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: registers, compute, move, jump; registers; the init, update, draw contract; arguments in a0 to a7; why ra is saved; address, value, load, store; the base instructions; pseudo-instructions; an instruction is a number; tracing by hand. USE NOW: the calling convention (Lecture 18); bit masks (Lecture 08) and, used without being studied in this course, the assembler directives, the PRG32 tools, the PRG32 runtime calls, the PRG32-QT debugger, the complete program. UNDERSTAND LATER: the stack (Lecture 18); addressing modes (Lecture 19); instruction formats (Lecture 19); hexadecimal (Lecture 04); two's complement (Lecture 05); fixed point (Lecture 06); Boolean algebra (Lecture 08); the adder (Lecture 09); from volts to bits (Lecture 10); latches and flip-flops (Lecture 13); the processor cycle (Lecture 19); the Verm1 project (Lecture 07). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: First Contact: RISC-V Assembly on PRG32: the code

This is the code deck of Lecture 02. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l02.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Step 1: the smallest program that runs

The smallest program that runs. `.option norelax` is a line with which every PRG32 example starts: it keeps the layout of the cartridge predictable. `.section .text` says that code follows. Each `.global` makes a label visible outside the file, so that the firmware can find the function by name. Then three functions, each made of the single instruction `ret`, which returns to the caller. The result is a black screen, and it is a success: the framework found your three functions, called them, and got control back.

## Slide 4: Build it, run it

Two commands that you will type hundreds of times. `cartridge build` turns the assembly file into a cartridge: `--entry-prefix first` is the prefix of your three functions, `--out` the name of the result. Then you run it: in QEMU with `qemu upload` and `qemu run`, or on a board or PRG32-QT with `upload-and-run` and the address of the host. For PRG32-QT on your own laptop the address is `http://localhost:8080`. The cartridge file is the same for all three.

## Slide 5: Step 2: say hello

The second step writes on the screen. Read `first_draw` in three parts. The first two lines make room on the stack and save `ra`. Then two calls: `prg32_gfx_clear` with the colour in `a0`, and `prg32_gfx_text8` with five arguments in `a0` to `a4`: x, y, the address of the string, foreground, background. Note the two ways of loading: `li` loads a number, `la` loads the address of a label. The last three lines restore `ra`, release the stack and return. The string itself is data, in the section `.rodata`.

## Slide 6: Step 3: a value that survives between frames

The third step keeps a value from one frame to the next. Registers do not survive between calls of `update`, so the value must live in memory. `counter` is a label: it names a location in the section `.data` that holds one word. The four instructions are the pattern of every variable: `la` puts the *address* of the location in `t0`; `lw` loads the *value* into `t1`; `addi` changes it; `sw` stores it back. Load, modify, store. Nothing changes on the screen yet: the counter ticks, but nobody draws it.

## Slide 7: Step 4: make the counter visible

The fourth step makes the counter visible as a green bar. The value is loaded, and `andi a2, t1, 255` keeps only its low eight bits, so the width goes from 0 to 255 and then starts again. The other registers are the arguments of `prg32_gfx_rect`: x, y, width, height and colour. Eight lines, and three later lectures are hidden in them: 255 written as 0xFF, `andi` used as a mask, and 0x07e0 that means green. Remember where you first saw them.

## Slide 8: The complete program: l02.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l02.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l02.S (3 of 3)

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

## Slide 16: Exercises on PRG32

Five exercises on your own cartridge; each is the seed of a later lecture. Change the text and its colour. Make the bar grow two or four times as fast by changing one instruction. Make it shrink, and observe what happens when the counter passes zero: the bar jumps to its full width, and Lecture 05 will explain why. Single-step `first_update` and write down the registers. Draw a second bar whose width is the counter modulo 64. Predict first, then run.
