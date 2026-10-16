# Lecture 07: Verm1, Part 1: A Head That Crosses the World: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the Verm1 project; the init, update, draw contract; a colour is a number; arrays in memory; .text, .rodata, .data; address, value, load, store; why ra is saved; shifts as multiplications; fixed point; pseudo-instructions; little-endian byte order. USE NOW: the PRG32 tools, the PRG32-QT debugger (used, not studied, in this course). UNDERSTAND LATER: instruction formats (Lecture 19). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 1: A Head That Crosses the World: the code

This is the code deck of Lecture 07. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The reference program is ~/arc12/verm1/verm1_part1.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: Build and run

A folder named `verm1` is created in the home directory, and in it a single file, `verm1.S`, which will grow from part to part. The first command builds the cartridge; the second sends it to PRG32-QT, running on the same computer, and starts it. These two commands are identical in every tutorial, which is the point: the cost of trying an idea must be negligible. If `localhost` does not answer, the address shown on the *Setup* screen of PRG32-QT is used instead; alternatively, the file can be imported from the PRG32-QT menu.

## Slide 4: Step 1: three functions that return

Step 1 is the skeleton of Lecture 02 with the prefix `verm1`: three global labels and three functions that merely return. It is typed, built and run. The correct result is a black screen, which demonstrates that the tools work and that the firmware locates the three entry points. A build failure at this stage indicates a problem with the installation, not with the program, and must be resolved before proceeding. The last callout states the methodological rule of the entire project: add one thing, run, observe; never two things at once, so that every failure has a single candidate cause.

## Slide 5: Constants: colours and the grid

These lines replace the beginning of the skeleton. Each `.equ` binds a name to a number and occupies no memory: the assembler merely substitutes the value wherever the name appears. Three colours are defined in RGB565. Then the geometry: a cell measures 8 by 8 pixels, so the 320-pixel width holds 40 columns; the top 8 pixels are reserved for the title, and the remaining 192 hold 24 rows. `SPEED_Q8`, the speed in fixed point, is used in step 3. Named constants make the program legible and its parameters easy to change in one place.

## Slide 6: Variables and a string

This block is placed at the end of the file. The `.rodata` section holds what never changes: the title, a string terminated by a zero byte through `.asciz`. The `.data` section holds the variables, one 32-bit word each: the column of the head, its row, and the fraction of a step accumulated so far. The initial values written here are only a starting point; `init` assigns them again explicitly, for a reason given on the next slide.

## Slide 7: init: put the head in its place

`verm1_init` places the head in its starting position. For each variable the pattern is identical: `la` loads the address, `li` the value, and `sw` stores the value at the address. The accumulator `step_q8` is cleared by storing the register `zero` directly. The function calls nothing, so it is a *leaf* and requires no stack frame. Why assign values that `.data` already contains? Because `init` may be invoked again to restart the game; the general principle is never to rely on the prior content of memory.

## Slide 8: draw: title and head

`verm1_draw` makes three calls: clear the screen, write the title, draw the head. It therefore saves `ra` in a stack frame on entry and restores it on exit, as in Lecture 02. The conversion from cell to pixels deserves attention: the column is loaded into `a0` and shifted left by 3; the row is loaded into `a1`, shifted, and offset by `TOP`. The remaining arguments are width, height and colour. Arguments are passed in `a0` to `a4`, in the order the callee expects them.

## Slide 9: Run it: a head on the grid

Build and run. The word VERM1 should appear at the top left, and a stationary green square in column 5 of row 12. The screenshot on the slide was taken from the finished Part 1, so its head lies further to the right; the difference is expected. If the square is misplaced, the two shifts and the addition of `TOP` are the first things to check.

## Slide 10: update: accumulate, step, wrap

`verm1_update` is best read in two halves. First the timer: `step_q8` is loaded, the speed added, and the sum compared with 256. If it is smaller, control jumps to label 2, the accumulator is stored and the function returns: nothing moves in this frame. Otherwise 256 is subtracted, the remainder kept and stored. Then the step: `head_x` is loaded and incremented, and compared with `COLS`; if the column has reached 40 it is reset to 0, so the head re-enters from the left. The labels `1:` and `2:` are local labels, and `1f` denotes "the next label 1, searching forward".

## Slide 11: Run it: the head crosses the world

Run it. The head moves to the right at about five cells per second, leaves at column 39 and reappears at column 0. The speed should then be varied, predicting the outcome before each run: with 8 the head is slow; with 128 it steps every two frames; with 256, once per frame. A larger value exposes a limitation of this program: `update` takes at most one step per frame, so speeds above 256 saturate. Discovering such a limit by prediction and experiment is exactly the habit the course aims to form.

## Slide 12: What the listing shows: your code, as the assembler left it

The debugger does not display the source but what the assembler produced from it. Symbolic names have disappeared: labels have become addresses, and `SPEED_Q8` has become the number 40. Pseudo-instructions have been expanded: `la` into `auipc` followed by `addi`, `li` into an `addi` from `zero`, `ret` into a jump through `ra`. Some instructions bear the prefix `c.`: these are the compressed 16-bit encodings of the same operations, the C of RV32IMAC. Recognising one's own program in this listing is a skill acquired with practice; the instruction formats behind it are studied in Lecture 19.

## Slide 13: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 14: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 15: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 16: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 17: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 18: Make it yours

Four modifications that make the program the student's own, each requiring a few lines. Make the head move leftwards: the addition becomes a subtraction, and the edge is detected from the sign of the result. Make it move downwards. Draw a second, darker cell behind the head. Write one's name beside the title, in a colour computed by hand. Before experimenting, a copy of the working Part 1 should be kept, since Part 2 starts from it.
