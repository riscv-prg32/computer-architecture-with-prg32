# Lecture 07: Verm1, Part 1: A Head That Crosses the World

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the Verm1 project; the init, update, draw contract; a colour is a number; arrays in memory; .text, .rodata, .data; address, value, load, store; why ra is saved; shifts as multiplications; fixed point; pseudo-instructions; little-endian byte order. USE NOW: the PRG32 tools, the PRG32-QT debugger (used, not studied, in this course). UNDERSTAND LATER: instruction formats (Lecture 19). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 1: A Head That Crosses the World

The project of the course starts here. This is a tutorial, not a lecture: you type a program, step by step, and at the end it runs. It uses only what the lectures from 02 to 06 have taught: registers and memory, colours and strings as numbers, comparisons and shifts, fixed point. The picture on the cover is what you will have on your screen in two hours: a title and a green square, the head of the worm, that crosses the screen by itself. The reference implementation was contributed by Giuseppe Coviello.

## Slide 2: What you will have by the end

Five results. A cartridge of your own, built from one file that you typed. A title, a grid of 40 by 24 cells and the head drawn in one of them. The head moving by itself, one cell at a time, at a speed set in fixed point. A world without edges, in which the head that leaves on the right comes back from the left. And a habit, which matters more than the program: the working loop of edit, build, run, look, with the debugger as a normal tool.

## Slide 3: Verm1: a tribute to Snake

Verm1, read "vermone", is a tribute to Snake: a worm that moves on a grid, eats, grows and must not bite itself. The idea goes back to the arcade game Blockade of 1976 and became famous on the Nokia phones of 1997. It was chosen because it is small enough to be written from scratch in assembly and yet needs every topic of the course. You write every line; there is no engine underneath. The picture on the right is where you will arrive in Part 4.

## Slide 4: The plan: four parts and a publication

The plan of the project. Each row is a tutorial, what you add in it and the lectures it uses. Part 1, today: a grid, a head, automatic movement. Part 2, Lecture 12: steering, food, a score. Part 3, Lecture 17: a body that grows and collisions. Part 4, Lecture 22: the finished game. Lecture 23 prepares the bundle for the Store. One rule, from the notes of the lecturer, applies to every part: never start with a program that does not run; if yours is broken, start from the reference file.

## Slide 5: What Part 1 takes from the lectures

Nothing in today's program is new: each idea comes from a lecture. The registers, `la`, `lw`, `sw`, calls and the stack frame come from Lecture 02. Colours as RGB565 numbers and strings that end with a zero come from Lecture 04. Shifts used as multiplications, comparisons and wrapping around come from Lecture 05. Fixed point, a fraction kept as a scaled integer, comes from Lecture 06, and it becomes the speed of the worm. Keep this table open: when a line of code puzzles you, the third column tells you which lecture to reread.

## Slide 6: The world of Verm1

The worm does not live in pixels: it lives in cells. A position is a column from 0 to 39 and a row from 0 to 23, and the head starts in column 5 of row 12, the bright cell in the drawing. To draw a cell its coordinates are turned into pixels: x is the column times 8, a shift left by 3; y is the row times 8 plus 8, because the title line comes first. Thinking in cells makes all the later rules simple: moving is adding 1, and two things collide when their cells are equal.

## Slide 7: How fast should a worm go?

`update` runs about thirty times per second. At one cell per frame the head would cross the forty columns in little more than a second. We want a fraction of a cell per frame. So we keep a fraction in units of 1/256 of a cell, add the speed to it at every frame, and take a step each time a whole cell, 256, has accumulated. With `SPEED_Q8` equal to 40 the head advances 40/256 of a cell per frame: one step about every six frames. The remainder is kept, so on average the speed is exact.

## Slide 8: Trace it by hand

A trace by hand, the most useful exercise of the tutorial. At each frame 40 is added to the fraction. At frames 1 to 6 the sum stays below 256 and the head does not move. At frame 7 it reaches 280: a whole cell has accumulated, 256 is subtracted, 24 remains, and the head goes from column 5 to column 6. The steps come every six or seven frames, and the remainder carries the difference, like the extra day of a leap year. Fill in frames 8 to 12 yourself.

## Slide 9: Stop the program and read the machine

A precise procedure. Enable the debug mode in *Settings* and run the cartridge. Press *Update*: the listing shows `verm1_update`. Click in the gutter beside its first instruction to set a breakpoint: the program stops there at the next frame. Now step, one instruction at a time, and watch the registers. After the two instructions that implement `la`, `t0` holds an address: type it in the *Memory* field and you will see the bytes of `step_q8`. Each *Resume* runs one frame, and the value grows by 40, 0x28.

## Slide 10: Reading memory: little-endian, live

The memory view shows 128 bytes in hexadecimal starting from the address you typed. A word occupies four bytes, least significant first: when `step_q8` is 240 you read F0 00 00 00. This is the little-endian order of Lecture 04, seen live. The variables are in memory in the order of the file: `head_x`, `head_y`, `step_q8`, so the head's column is eight bytes before the fraction. The debugger only observes: to change the program you edit, build and run.

## Slide 11: Check your understanding: With SPEED_Q8 = 64, how many frames pass between two steps of the head? / Which pixel is the top-left corner of the cell in column 10, row 3?

64 out of 256 is one quarter of a cell per frame. How many quarters make a whole cell? The two large numbers are distractors: 64 is the speed itself, and 256 is the size of a cell in the units of the timer.

Apply the two formulas of the grid: x is the column times 8; y is the row times 8, plus the 8 pixels of the title line. The option that forgets the title line is the most common mistake.

## Slide 12: Check your understanding: Why does verm1_draw save ra and verm1_update does not?

It is not a matter of length. A call writes the return address into `ra`, so a function that makes calls must keep its own `ra` safe on the stack. `verm1_update` is a leaf: it calls nothing, and `ra` still holds the right address when it reaches `ret`.

## Slide 13: Where we are, and what comes next

Where you are. You have a cartridge that runs and that you understand line by line. It already has the shape of every game: a state in memory, a rule that changes it at every frame, and a function that draws it. What is missing is the player: the head goes where it wants. The next four lectures give the tools to read the joystick and to decide, bits, masks and tables, and Part 2 uses them to add steering, food and a score.
