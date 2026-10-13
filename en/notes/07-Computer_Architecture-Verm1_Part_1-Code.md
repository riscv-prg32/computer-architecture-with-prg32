# Lecture 07: Verm1, Part 1: A Head That Crosses the World: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 1: A Head That Crosses the World: the code

This is the code deck of Lecture 07. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The reference program is ~/arc12/verm1/verm1_part1.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: Build and run

Make a folder called `verm1` in your home directory and keep in it one file, `verm1.S`, that will grow from part to part. The first command builds the cartridge; the second sends it to PRG32-QT running on the same computer and starts it. These two commands are identical in every tutorial. If `localhost` does not answer, use the address shown on the *Setup* screen of PRG32-QT. As an alternative you can import the file from the menu of PRG32-QT.

## Slide 4: Step 1: three functions that return

Step 1 is the skeleton of Lecture 02 with the prefix `verm1`: three global labels and three functions that only return. Type it, build it, run it. The right result is a black screen: it proves that the tools work and that the firmware finds your functions. If the build fails here, the problem is the installation, not your program, and it must be solved before going on. The last callout is the rule of the whole project: add one thing, run, look. Never two things at once.

## Slide 5: Constants: colours and the grid

These lines replace the beginning of the skeleton. Each `.equ` gives a name to a number and uses no memory: the assembler simply substitutes the number. Three colours in RGB565. Then the geometry: a cell is 8 by 8 pixels, so the 320 pixels of the width hold 40 columns; the top 8 pixels are reserved for the title, and the remaining 192 hold 24 rows. `SPEED_Q8` is the speed in fixed point and will be used in step 3. Constants with names make the program readable and easy to change.

## Slide 6: Variables and a string

This goes at the end of the file. The section `.rodata` holds what never changes: the title, a string that `.asciz` ends with a zero byte. The section `.data` holds the variables, one 32-bit word each: the column of the head, its row, and the fraction of a step accumulated so far. The initial values written here are only a start: `init` will set them again explicitly.

## Slide 7: init: put the head in its place

`verm1_init` puts the head in its place. For each variable the pattern is the same: `la` loads the address, `li` loads the value, `sw` stores the value at the address. The fraction `step_q8` is set to zero by storing the register `zero` directly. The function calls nothing, so it is a *leaf* and needs no stack frame. Why set values that `.data` already contains? Because `init` may be called again to restart the game: never trust what memory contained.

## Slide 8: draw: title and head

`verm1_draw` makes three calls: clear the screen, write the title, draw the head. It therefore saves `ra` in a stack frame at the beginning and restores it at the end, as in Lecture 02. Look at how the cell becomes pixels: the column is loaded into `a0` and shifted left by 3; the row is loaded into `a1`, shifted and increased by `TOP`. The remaining arguments are width, height and colour. Arguments travel in `a0` to `a4`, in the order in which the function expects them.

## Slide 9: Run it: a head on the grid

Build and run. You should see the word VERM1 at the top left and a green square standing still in column 5 of row 12. The screenshot on the slide was taken later, from the finished Part 1, so its head is further to the right: do not worry about the difference. If your square is in the wrong place, check the two shifts and the addition of `TOP` before anything else.

## Slide 10: update: accumulate, step, wrap

Read `verm1_update` in two halves. First the timer: load `step_q8`, add the speed, compare with 256. If it is less, jump to label 2, store the fraction and return: nothing moves in this frame. Otherwise subtract 256, keeping the remainder, and store it. Then the step: load `head_x`, add 1, compare with `COLS`; if the column has reached 40 it becomes 0, and the head comes back from the left. The labels `1:` and `2:` are local labels: `1f` means "the next label 1 forward".

## Slide 11: Run it: the head crosses the world

Run it. The head moves to the right at about five cells per second, leaves at column 39 and returns at column 0. Then experiment with the speed: before each run, predict what you will see. With 8 the head is slow; with 128 it takes a step every two frames; with 256, one step per frame. Try a larger value and discover a limit of this program: `update` takes at most one step per frame.

## Slide 12: What the listing shows: your code, as the assembler left it

The debugger does not show your source: it shows what the assembler produced. Names have disappeared: labels have become addresses and `SPEED_Q8` has become the number 40. Pseudo-instructions are expanded: `la` is `auipc` followed by `addi`, `li` is an `addi` from `zero`, `ret` is a jump to `ra`. Some instructions begin with `c.`: they are the compressed, 16-bit forms of the same instructions, the C in RV32IMAC. Recognising your own program in this listing is a skill that grows with practice.

## Slide 13: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 14: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 15: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 16: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 17: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 18: Make it yours

Four changes to make the program yours, each of a few lines. Make the head move to the left: the addition becomes a subtraction, and the edge is detected on the sign of the result. Make it move downwards. Draw a second, darker cell behind the head. Write your name beside the title in a colour computed by hand. Before experimenting, keep a copy of the working Part 1: Part 2 starts from it.
