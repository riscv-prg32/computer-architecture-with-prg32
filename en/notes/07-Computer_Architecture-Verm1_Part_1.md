# Lecture 07: Verm1, Part 1: A Head That Crosses the World

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the Verm1 project; the init, update, draw contract; a colour is a number; arrays in memory; .text, .rodata, .data; address, value, load, store; why ra is saved; shifts as multiplications; fixed point; pseudo-instructions; little-endian byte order. USE NOW: the PRG32 tools, the PRG32-QT debugger (used, not studied, in this course). UNDERSTAND LATER: instruction formats (Lecture 19). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) build a cartridge from an empty file: a grid, a title and a moving head; (2) place constants and variables in the right section, .rodata or .data; (3) control a speed with a fixed-point accumulator. Builds on: the init, update, draw contract (Lecture 02); a colour is a number (Lecture 04); arrays in memory (Lecture 04); address, value, load, store (Lecture 02); why ra is saved (Lecture 02). Next: Lecture 08, Elements of Boolean Algebra.

Bridge. In Lecture 02 step 2 saved ra on the stack before its calls, and lw t1, 0(t0) read a word at the address in t0. Today verm1_draw saves ra and verm1_update does not, and every variable of Verm1 is read with la and lw. Lecture 18 explains the stack and the calling convention; Lecture 19 names the addressing modes. Recall: Why does verm1_draw save ra while verm1_update does not?

Closing thread: Numbers became positions, colours and a speed: the whole information block, in one running game. Next: the logic that will let the player steer it.

## Slide 1: Verm1, Part 1: A Head That Crosses the World

The course project begins here. This is a tutorial rather than a lecture: a program is written step by step, and at the end it runs. It draws exclusively on Lectures 02 to 06: registers and memory, colours and strings as numbers, comparisons and shifts, fixed point. The cover shows the state of the screen two hours from now: a title and a green square, the head of the worm, crossing the screen unaided. The purpose of the session is integration: concepts studied separately must now cooperate within one program. The reference implementation was contributed by Giuseppe Coviello.

## Slide 2: What you will have by the end

Five outcomes. A cartridge of the student's own, built from a single file typed by hand. A title, a grid of 40 by 24 cells, and the head drawn in one of them. The head moving autonomously, one cell at a time, at a speed expressed in fixed point. A world without edges, in which the head that leaves on the right re-enters on the left. And, more important than the program itself, a method: the working loop of edit, build, run and observe, with the debugger as an ordinary instrument rather than a last resort.

## Slide 3: Verm1: a tribute to Snake

Verm1, pronounced "vermone", is a tribute to Snake: a worm moves on a grid, eats, grows, and must not collide with itself. The idea goes back to the arcade game Blockade of 1976 and achieved wide popularity on the Nokia phones of 1997. It was chosen because it is small enough to be written from scratch in assembly yet requires every topic of the course. Every line is written by the student, with no engine underneath. The picture on the right shows the destination, reached in Part 4.

## Slide 4: The plan: four parts and a publication

The plan of the project. Each row is a tutorial, what it adds and the lectures on which it draws. Part 1, today: a grid, a head, autonomous movement. Part 2, Lecture 12: steering, food and a score. Part 3, Lecture 17: a growing body and collisions. Part 4, Lecture 22: the finished game. Lecture 23 prepares the bundle for the Store. One rule applies to every part: never begin from a program that does not run. A student whose file is broken starts again from the reference file, so that every session builds on a working foundation.

## Slide 5: What Part 1 takes from the lectures

Nothing in today's program is new: each idea is traceable to a lecture. Registers, `la`, `lw`, `sw`, procedure calls and the stack frame come from Lecture 02. Colours as RGB565 numbers and zero-terminated strings come from Lecture 04. Shifts as multiplications, comparisons and wrap-around come from Lecture 05. Fixed point, a fraction held as a scaled integer, comes from Lecture 06 and becomes the speed of the worm. The table should remain open throughout the session: when a line of code is puzzling, its third column indicates which lecture to revisit.

## Slide 6: The world of Verm1

The worm inhabits cells, not pixels. A position is a column from 0 to 39 and a row from 0 to 23, and the head starts in column 5 of row 12, the highlighted cell. To draw a cell, its coordinates are mapped to pixels: x is the column times 8, a left shift by 3; y is the row times 8 plus 8, to leave room for the title line. This change of coordinate system is a modelling decision with lasting benefits: in cell coordinates every later rule is simple, since moving is adding 1 and two objects collide exactly when their cells are equal.

## Slide 7: How fast should a worm go?

`update` runs approximately thirty times per second. At one cell per frame the head would cross the forty columns in little more than a second, which is unplayable. A fraction of a cell per frame is required. The solution keeps an accumulator in units of 1/256 of a cell, adds the speed to it at every frame, and advances by one cell whenever a whole cell, 256 units, has accumulated. With `SPEED_Q8` equal to 40, the head advances 40/256 of a cell per frame, one step roughly every six frames. Because the remainder is retained rather than discarded, the average speed is exact.

## Slide 8: Trace it by hand

A trace by hand, the most instructive exercise of the tutorial. At each frame 40 is added to the accumulator. During frames 1 to 6 the sum remains below 256 and the head does not move. At frame 7 it reaches 280: a whole cell has accumulated, 256 is subtracted, 24 remains, and the head moves from column 5 to column 6. Steps thus occur every six or seven frames, and the remainder absorbs the difference, much as the extra day of a leap year reconciles the calendar with the solar year. Frames 8 to 12 are left to be completed.

## Slide 9: Stop the program and read the machine

A precise debugging procedure. Debug mode is enabled in *Settings* and the cartridge run. *Update* displays `verm1_update` in the listing; a click in the gutter beside its first instruction sets a breakpoint, at which the program halts on the next frame. Stepping one instruction at a time, the registers are observed. After the two instructions into which `la` expands, `t0` holds an address; entering it in the *Memory* field reveals the bytes of `step_q8`. Each *Resume* executes one frame, and the value increases by 40, that is, 0x28.

## Slide 10: Reading memory: little-endian, live

The memory view displays 128 bytes in hexadecimal from the address entered. A word occupies four bytes, least significant first: when `step_q8` holds 240 the view shows F0 00 00 00. This is the little-endian order of Lecture 04, now observed directly. Variables appear in memory in the order in which the file declares them, `head_x`, `head_y`, `step_q8`, so the column of the head lies eight bytes before the accumulator. The debugger only observes; to change the program one edits, builds and runs again.

## Slide 11: Check your understanding: With SPEED_Q8 = 64, how many frames pass between two steps of the head? / Which pixel is the top-left corner of the cell in column 10, row 3?

For the first question: 64 out of 256 is one quarter of a cell per frame, and the question is how many quarters make a whole cell. The two large numbers are distractors: 64 is the speed itself, and 256 is the size of a cell in the units of the accumulator.

For the second, the two grid formulas apply: x is the column times 8; y is the row times 8 plus the 8 pixels of the title line. The option that omits the title line represents the most common error.

## Slide 12: Check your understanding: Why does verm1_draw save ra and verm1_update does not?

The answer does not depend on the length of the function. A call writes the return address into `ra`, so a function that makes calls must preserve its own `ra` on the stack. `verm1_update` is a *leaf* function: it calls nothing, so `ra` still holds the correct address when `ret` is reached, and no stack frame is needed.

## Slide 13: Where we are, and what comes next

The current position. The student has a cartridge that runs and is understood line by line. It already exhibits the structure common to every game: a state in memory, a rule that transforms it at every frame, and a function that renders it. What is missing is the player: the head goes where it pleases. The next four lectures supply the means to read the joystick and to make decisions, namely bits, masks, Boolean rules and tables, and Part 2 applies them to add steering, food and a score.
