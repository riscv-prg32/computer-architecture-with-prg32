# Lecture 07: Verm1, Part 1: A Head That Crosses the World

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 1: A Head That Crosses the World

The project of the course starts here. This is a tutorial, not a lecture: you type a program, step by step, and at the end it runs. It uses only what the lectures from 02 to 06 have taught: registers and memory, colours and strings as numbers, comparisons and shifts, fixed point. The picture on the cover is what you will have on your screen in two hours: a title and a green square, the head of the worm, that crosses the screen by itself. The reference implementation was contributed by Giuseppe Coviello.

## Slide 2: What you will have by the end

Five results. A cartridge of your own, built from one file that you typed. A title, a grid of 40 by 24 cells and the head drawn in one of them. The head moving by itself, one cell at a time, at a speed set in fixed point. A world without edges, in which the head that leaves on the right comes back from the left. And a habit, which matters more than the program: the working loop of edit, build, run, look, with the debugger as a normal tool.

## Slide 3: The project

First the project as a whole: what the game is, how it is divided into four parts, and what this part takes from the lectures you have attended.

## Slide 4: Verm1: a tribute to Snake

Verm1, read "vermone", is a tribute to Snake: a worm that moves on a grid, eats, grows and must not bite itself. The idea goes back to the arcade game Blockade of 1976 and became famous on the Nokia phones of 1997. It was chosen because it is small enough to be written from scratch in assembly and yet needs every topic of the course. You write every line; there is no engine underneath. The picture on the right is where you will arrive in Part 4.

## Slide 5: The plan: four parts and a publication

The plan of the project. Each row is a tutorial, what you add in it and the lectures it uses. Part 1, today: a grid, a head, automatic movement. Part 2, Lecture 12: steering, food, a score. Part 3, Lecture 17: a body that grows and collisions. Part 4, Lecture 22: the finished game. Lecture 23 prepares the bundle for the Store. One rule, from the notes of the lecturer, applies to every part: never start with a program that does not run; if yours is broken, start from the reference file.

## Slide 6: What Part 1 takes from the lectures

Nothing in today's program is new: each idea comes from a lecture. The registers, `la`, `lw`, `sw`, calls and the stack frame come from Lecture 02. Colours as RGB565 numbers and strings that end with a zero come from Lecture 04. Shifts used as multiplications, comparisons and wrapping around come from Lecture 05. Fixed point, a fraction kept as a scaled integer, comes from Lecture 06, and it becomes the speed of the worm. Keep this table open: when a line of code puzzles you, the third column tells you which lecture to reread.

## Slide 7: Step 0: the working loop

Step 0 is not code: it is the routine that you will repeat after every change. Edit the file, build the cartridge, run it, look at the result. The faster this loop, the more you learn.

## Slide 8: Build and run

Make a folder called `verm1` in your home directory and keep in it one file, `verm1.S`, that will grow from part to part. The first command builds the cartridge; the second sends it to PRG32-QT running on the same computer and starts it. These two commands are identical in every tutorial. If `localhost` does not answer, use the address shown on the *Setup* screen of PRG32-QT. As an alternative you can import the file from the menu of PRG32-QT.

## Slide 9: Step 1: three functions that return

Step 1 is the skeleton of Lecture 02 with the prefix `verm1`: three global labels and three functions that only return. Type it, build it, run it. The right result is a black screen: it proves that the tools work and that the firmware finds your functions. If the build fails here, the problem is the installation, not your program, and it must be solved before going on. The last callout is the rule of the whole project: add one thing, run, look. Never two things at once.

## Slide 10: Step 2: a grid and a head

Step 2 adds what is needed to see something: names for the numbers, variables in memory, and one rectangle on the screen. At the end of the step the head is drawn but does not move yet.

## Slide 11: Constants: colours and the grid

These lines replace the beginning of the skeleton. Each `.equ` gives a name to a number and uses no memory: the assembler simply substitutes the number. Three colours in RGB565. Then the geometry: a cell is 8 by 8 pixels, so the 320 pixels of the width hold 40 columns; the top 8 pixels are reserved for the title, and the remaining 192 hold 24 rows. `SPEED_Q8` is the speed in fixed point and will be used in step 3. Constants with names make the program readable and easy to change.

## Slide 12: The world of Verm1

The worm does not live in pixels: it lives in cells. A position is a column from 0 to 39 and a row from 0 to 23, and the head starts in column 5 of row 12, the bright cell in the drawing. To draw a cell its coordinates are turned into pixels: x is the column times 8, a shift left by 3; y is the row times 8 plus 8, because the title line comes first. Thinking in cells makes all the later rules simple: moving is adding 1, and two things collide when their cells are equal.

## Slide 13: Variables and a string

This goes at the end of the file. The section `.rodata` holds what never changes: the title, a string that `.asciz` ends with a zero byte. The section `.data` holds the variables, one 32-bit word each: the column of the head, its row, and the fraction of a step accumulated so far. The initial values written here are only a start: `init` will set them again explicitly.

## Slide 14: init: put the head in its place

`verm1_init` puts the head in its place. For each variable the pattern is the same: `la` loads the address, `li` loads the value, `sw` stores the value at the address. The fraction `step_q8` is set to zero by storing the register `zero` directly. The function calls nothing, so it is a *leaf* and needs no stack frame. Why set values that `.data` already contains? Because `init` may be called again to restart the game: never trust what memory contained.

## Slide 15: draw: title and head

`verm1_draw` makes three calls: clear the screen, write the title, draw the head. It therefore saves `ra` in a stack frame at the beginning and restores it at the end, as in Lecture 02. Look at how the cell becomes pixels: the column is loaded into `a0` and shifted left by 3; the row is loaded into `a1`, shifted and increased by `TOP`. The remaining arguments are width, height and colour. Arguments travel in `a0` to `a4`, in the order in which the function expects them.

## Slide 16: Run it: a head on the grid

Build and run. You should see the word VERM1 at the top left and a green square standing still in column 5 of row 12. The screenshot on the slide was taken later, from the finished Part 1, so its head is further to the right: do not worry about the difference. If your square is in the wrong place, check the two shifts and the addition of `TOP` before anything else.

## Slide 17: Step 3: movement

Step 3 makes the head move. The problem is the speed: the natural step, one cell per frame, is far too fast, and the processor has only integers. The solution is the fixed point of Lecture 06, used as a timer.

## Slide 18: How fast should a worm go?

`update` runs about thirty times per second. At one cell per frame the head would cross the forty columns in little more than a second. We want a fraction of a cell per frame. So we keep a fraction in units of 1/256 of a cell, add the speed to it at every frame, and take a step each time a whole cell, 256, has accumulated. With `SPEED_Q8` equal to 40 the head advances 40/256 of a cell per frame: one step about every six frames. The remainder is kept, so on average the speed is exact.

## Slide 19: update: accumulate, step, wrap

Read `verm1_update` in two halves. First the timer: load `step_q8`, add the speed, compare with 256. If it is less, jump to label 2, store the fraction and return: nothing moves in this frame. Otherwise subtract 256, keeping the remainder, and store it. Then the step: load `head_x`, add 1, compare with `COLS`; if the column has reached 40 it becomes 0, and the head comes back from the left. The labels `1:` and `2:` are local labels: `1f` means "the next label 1 forward".

## Slide 20: Trace it by hand

A trace by hand, the most useful exercise of the tutorial. At each frame 40 is added to the fraction. At frames 1 to 6 the sum stays below 256 and the head does not move. At frame 7 it reaches 280: a whole cell has accumulated, 256 is subtracted, 24 remains, and the head goes from column 5 to column 6. The steps come every six or seven frames, and the remainder carries the difference, like the extra day of a leap year. Fill in frames 8 to 12 yourself.

## Slide 21: Run it: the head crosses the world

Run it. The head moves to the right at about five cells per second, leaves at column 39 and returns at column 0. Then experiment with the speed: before each run, predict what you will see. With 8 the head is slow; with 128 it takes a step every two frames; with 256, one step per frame. Try a larger value and discover a limit of this program: `update` takes at most one step per frame.

## Slide 22: Step 4: look inside with PRG32-QT

Step 4 uses no new code. You stop your own program in PRG32-QT and look at it from the inside. In this course the debugger is part of the method, to be used when things work as well as when they do not.

## Slide 23: Stop the program and read the machine

A precise procedure. Enable the debug mode in *Settings* and run the cartridge. Press *Update*: the listing shows `verm1_update`. Click in the gutter beside its first instruction to set a breakpoint: the program stops there at the next frame. Now step, one instruction at a time, and watch the registers. After the two instructions that implement `la`, `t0` holds an address: type it in the *Memory* field and you will see the bytes of `step_q8`. Each *Resume* runs one frame, and the value grows by 40, 0x28.

## Slide 24: What the listing shows: your code, as the assembler left it

The debugger does not show your source: it shows what the assembler produced. Names have disappeared: labels have become addresses and `SPEED_Q8` has become the number 40. Pseudo-instructions are expanded: `la` is `auipc` followed by `addi`, `li` is an `addi` from `zero`, `ret` is a jump to `ra`. Some instructions begin with `c.`: they are the compressed, 16-bit forms of the same instructions, the C in RV32IMAC. Recognising your own program in this listing is a skill that grows with practice.

## Slide 25: Reading memory: little-endian, live

The memory view shows 128 bytes in hexadecimal starting from the address you typed. A word occupies four bytes, least significant first: when `step_q8` is 240 you read F0 00 00 00. This is the little-endian order of Lecture 04, seen live. The variables are in memory in the order of the file: `head_x`, `head_y`, `step_q8`, so the head's column is eight bytes before the fraction. The debugger only observes: to change the program you edit, build and run.

## Slide 26: Check your understanding: With SPEED_Q8 = 64, how many frames pass between two steps of the head?

64 out of 256 is one quarter of a cell per frame. How many quarters make a whole cell? The two large numbers are distractors: 64 is the speed itself, and 256 is the size of a cell in the units of the timer.

## Slide 27: Check your understanding: Which pixel is the top-left corner of the cell in column 10, row 3?

Apply the two formulas of the grid: x is the column times 8; y is the row times 8, plus the 8 pixels of the title line. The option that forgets the title line is the most common mistake.

## Slide 28: Check your understanding: Why does verm1_draw save ra and verm1_update does not?

It is not a matter of length. A call writes the return address into `ra`, so a function that makes calls must keep its own `ra` safe on the stack. `verm1_update` is a leaf: it calls nothing, and `ra` still holds the right address when it reaches `ret`.

## Slide 29: Make it yours

Four changes to make the program yours, each of a few lines. Make the head move to the left: the addition becomes a subtraction, and the edge is detected on the sign of the result. Make it move downwards. Draw a second, darker cell behind the head. Write your name beside the title in a colour computed by hand. Before experimenting, keep a copy of the working Part 1: Part 2 starts from it.

## Slide 30: Where we are, and what comes next

Where you are. You have a cartridge that runs and that you understand line by line. It already has the shape of every game: a state in memory, a rule that changes it at every frame, and a function that draws it. What is missing is the player: the head goes where it wants. The next four lectures give the tools to read the joystick and to decide, bits, masks and tables, and Part 2 uses them to add steering, food and a score.
