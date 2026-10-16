# Lecture 22: Verm1, Part 4: The Finished Game

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: quotient and remainder; characters and strings; fixed point; the calling convention; arrays in memory; finite-state machines; the frame buffer; the processor cycle. USE NOW: the PRG32 tools, the PRG32-QT debugger (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 4: The Finished Game

The fourth and final tutorial completes Verm1. At the end of Part 3 the game was complete in its rules; today it becomes complete as a program. The score is written in decimal digits, the worm accelerates, there are two sounds, and the screen is redrawn only where it changes. Knuth's sentence on the cover justifies the order of the work: first the game was made correct, and only now, with a measurement in hand, is it made fast. Optimisation without measurement is guesswork, and the tutorial ends by measuring the effect of its own changes.

## Slide 2: What you will have by the end

Five outcomes. The score and the best score displayed in digits, converted by a division by ten written by the student. A worm that accelerates as the score grows, up to a limit. Two sounds, one for a meal and one for the end of the game. A `draw` function that touches a handful of cells per step instead of the whole screen. And a finished game, ready to be packaged and published in the next lecture.

## Slide 3: What Part 4 takes from the lectures

The ideas of the last block of lectures, and where they appear today. The calling convention of Lecture 18 becomes small functions with explicit contracts, some of them leaves. The M extension, whose unsigned division and remainder `divu` and `remu` were met in Lectures 05 and 06, yields the digits. The processor cycle of Lecture 19 reminds us that every instruction costs time, hence the measurement. The screen as memory, from Lecture 20, suggests redrawing only what has changed. And from Lecture 21: the devices belong to the runtime, from which a note of a given duration is requested.

## Slide 4: Where you are going

The destination: the title screen with the best score, the game with the score in digits, and the game-over screen. The session begins from a working Part 3; a student whose file does not run copies the reference file. There are four steps of code today, and the program is run after each one.

## Slide 5: A number is not its digits

The variable `score` holds a binary number: 137 is the byte 0x89. The screen requires three characters, the bytes 0x31, 0x33 and 0x37. The conversion is the repeated division of Lecture 05: dividing by ten, the remainder is a digit, and the procedure is repeated on the quotient. The digits emerge from the right, units first, so they are stored from the last character to the first. A digit becomes a character by adding 48, the ASCII code of the character zero, as Lecture 04 established. The distinction between a number and its representation, a theme of the whole course, is here made operational.

## Slide 6: The levels, in numbers

The levels, quantified. For each score the table gives the speed, the frames per step, which is 256 divided by the speed, and the cells per second at thirty frames per second: from 3.75 cells per second at the start to 11.25 from sixteen points onwards. The frames per step are not always integers, and this is not a problem: at a speed of 48 the steps occur every five or six frames, 5.33 on average. This fine gradation is precisely what fixed-point representation provides, and no integer speed could achieve it.

## Slide 7: What does a frame cost?

What does a frame of Part 3 cost? It clears 64,000 pixels and redraws title, score, worm and food, thirty times per second. Yet between two steps nothing on the screen changes, and a step changes very little: the cell vacated by the tail, the old head that becomes body, the new head, and occasionally the food and the score. The solution is to record what changed and draw only that. It works because the frame buffer is memory, in which the picture persists by itself, the property established in Lecture 20.

## Slide 8: Before and after, with numbers

Six actions. The finished game is run in debug mode and a game started. The telemetry is read for ten seconds and compared with the figures for Part 3 recorded at the start of the session. The worm is grown to twenty cells in both versions and the telemetry read again: in one version the cost grows with the length of the worm, in the other it does not. A breakpoint on `draw_changes` confirms that it halts once per step. The figures are recorded, since they belong in the description of the game, and they constitute the evidence that the optimisation was worthwhile.

## Slide 9: Follow a call with the debugger

A procedure call followed in the debugger. Execution halts on the call to `to_decimal`, and `a0`, `a1`, `ra` and `sp` are read. One step: the PC jumps into the function and `ra` holds the address of the instruction following the call. Stepping on, only temporaries change and `sp` never moves, because the function is a leaf. At `ret` the PC takes the value of `ra`. The same procedure with `draw_text` shows the contrast: `sp` decreases by 16, `ra` is stored, and both are restored. The calling convention of Lecture 18 is thus observed instruction by instruction.

## Slide 10: Check your understanding: to_decimal receives a0 = 205. Which bytes does it store, from offset 0 to 2? / At which score does the worm take one step every 4 frames?

For the first question 205 is converted into three digits, and each digit into its ASCII code by adding 0x30. The order matters: offset 0 holds the hundreds.

For the second: one step every four frames corresponds to a speed of 256 / 4. That value is substituted into the formula of the speed, and the equation solved for the score.

## Slide 11: Check your understanding: dirty is 0 when verm1_draw is called. How many machine instructions does it execute? / Why can to_decimal do without a stack frame?

For the first question the instructions on the shortest path through `verm1_draw` are counted, remembering that `la` is a pseudo-instruction that expands into two.

For the second one asks what a stack frame is for: saving `ra` when a further call is made, and saving the callee-saved registers the function uses. The question is whether `to_decimal` requires either.

## Slide 12: Where we are, and what comes next

Verm1 is finished: about six hundred lines of RISC-V assembly, every one written by the student. It began as three functions that merely return and grew one runnable step at a time, and every part of the course is present in it: numbers, logic, state, memory, procedure calls, pixels and devices. One thing remains: a program that only its author can run is half finished. The next lecture gives it a name, an icon and credits, and publishes it.
