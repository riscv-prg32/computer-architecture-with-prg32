# Lecture 02: First Contact: RISC-V Assembly on PRG32: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: registers, compute, move, jump; registers; functions, call and return; the init, update, draw contract; reading a line of assembly; arguments in a0 to a7; why ra is saved; address, value, load, store; the base instructions; pseudo-instructions; an instruction is a number; tracing by hand. USE NOW: hexadecimal (Lecture 04); bit, byte, word (Lecture 04); the calling convention (Lecture 18); bit masks (Lecture 08) and, used without being studied in this course, the assembler directives, the PRG32 tools, the PRG32 runtime calls, the PRG32-QT debugger, the complete program. UNDERSTAND LATER: the stack (Lecture 18); addressing modes (Lecture 19); instruction formats (Lecture 19); two's complement (Lecture 05); fixed point (Lecture 06); Boolean algebra (Lecture 08); the adder (Lecture 09); from volts to bits (Lecture 10); latches and flip-flops (Lecture 13); the processor cycle (Lecture 19); the Verm1 project (Lecture 07). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: First Contact: RISC-V Assembly on PRG32: the code

This is the code deck of Lecture 02. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l02.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Step 1: the smallest program that runs

The smallest program that runs. `.option norelax`, with which every PRG32 example begins, keeps the layout of the cartridge predictable by preventing the linker from rewriting instruction sequences. `.section .text` declares that executable code follows. Each `.global` exports a label beyond the file, so that the firmware can locate the function by name. Then come three functions, each consisting of the single instruction `ret`, which returns control to the caller. The result is a black screen, and it is a success: the framework has found the three entry points, invoked them, and regained control. These directives are used as given; the course does not study the assembler itself.

## Slide 4: Build it, run it

Two commands that will be typed hundreds of times. `cartridge build` turns the assembly file into a cartridge: `--entry-prefix first` gives the prefix of the three entry points, `--out` the name of the output. The cartridge is then executed: in QEMU with `qemu upload` followed by `qemu run`, or on a board or on PRG32-QT with `upload-and-run` and the address of the host, which for PRG32-QT on the student's own laptop is `http://localhost:8080`. The same cartridge file serves all three hosts.

## Slide 5: Step 2: say hello

The second step writes to the screen. `first_draw` is best read in three parts. The first two lines open a stack frame and save `ra`, because the function is about to make calls. Two calls follow: `prg32_gfx_clear`, with the colour in `a0`, and `prg32_gfx_text8`, with five arguments in `a0` to `a4`: x, y, the address of the string, foreground colour and background colour. The two ways of loading a register should be distinguished: `li` loads a numerical constant, `la` the address of a label. The last three lines restore `ra`, release the frame and return. The string itself is data, placed in the read-only section `.rodata`.

## Slide 6: Step 3: a value that survives between frames

The third step preserves a value from one frame to the next. Registers do not retain their contents between successive invocations of `update`, so the value must reside in memory. `counter` is a label naming a location in the `.data` section, the part of the program that holds data rather than instructions; the location holds one word. The four instructions constitute the pattern underlying every *variable*, a named place in memory whose value the program changes: `la` places the *address* of the location in `t0`; `lw` loads the *value* into `t1`; `addi` modifies it; `sw` writes it back. Load, modify, store: the defining idiom of a load-store architecture. Nothing changes on the screen yet: the counter advances, but nothing draws it.

## Slide 7: Step 4: make the counter visible

The fourth step renders the counter visible as a green bar. The value is loaded, and `andi a2, t1, 255` retains only its eight least significant bits, the eight on the right, which are worth the least, so the width runs from 0 to 255 and then begins again. The remaining registers carry the arguments of `prg32_gfx_rect`: x, y, width, height and colour. These eight lines contain the seeds of three later lectures: 255 written as 0xFF (positional notation, Lecture 04), `andi` used as a mask (Boolean algebra, Lecture 08), and 0x07e0 denoting green (the encoding of colour, Lecture 04). It is worth remembering where each was first encountered.

## Slide 8: The complete program: l02.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l02.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l02.S (3 of 3)

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

## Slide 16: Exercises on PRG32

Five exercises on the student's own cartridge, each the seed of a later lecture. Change the text and its colour. Make the bar grow two or four times as fast by modifying a single instruction. Make it shrink, and observe what happens when the counter passes zero: the bar jumps to its full width, a phenomenon that Lecture 05 explains through two's complement. Single-step `first_update` and record the registers after each instruction. Draw a second bar whose width is the counter modulo 64. In every case the outcome should be predicted before the program is run.
