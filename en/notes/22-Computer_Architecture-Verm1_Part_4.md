# Lecture 22: Verm1, Part 4: The Finished Game

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 4: The Finished Game

The fourth and last tutorial finishes Verm1. In Part 3 the game was complete in its rules; today it becomes complete as a program. The score is written in digits, the worm accelerates, there are two sounds, and the screen is redrawn only where it changes. Knuth's sentence on the cover explains the order of the work: first the game was made to work, and only now, with a measure in hand, do we make it fast.

## Slide 2: What you will have by the end

Five results. The score and the best score in digits, converted by a division by ten that you write. A worm that goes faster as the score grows, up to a limit. Two sounds, one for a meal and one for the end. A `draw` that touches a handful of cells per step instead of the whole screen. And a finished game, ready to be packaged and published in the next lecture.

## Slide 3: What Part 4 takes from the lectures

The ideas of the last block of lectures, and where they appear today. The calling convention of Lecture 18 becomes small functions with a contract, some of them leaves. The M extension gives quotient and remainder for the digits. The processor cycle reminds us that every instruction costs time, so we measure. The screen as memory, from Lecture 20, suggests drawing only what changed. And from Lecture 21: the devices belong to the runtime, to which we ask for a note of a given duration.

## Slide 4: Where you are going

Where you are going: the title screen with the best score, the game with the score in digits, the game over. Start from a Part 3 that runs; if yours does not, copy the reference file. There are four steps of code today, and the program runs after each one.

## Slide 5: A number is not its digits

The variable `score` holds a binary number: 137 is the byte 0x89. The screen wants three characters, the bytes 0x31, 0x33 and 0x37. The conversion is the one you did by hand in Lecture 05: divide by ten, and the remainder is a digit; repeat on the quotient. The digits come out from the right, units first, so they are stored from the last character to the first. A digit becomes a character by adding 48, the ASCII code of the character zero.

## Slide 6: The levels, in numbers

The levels in numbers. For each score, the speed, the frames per step, which is 256 divided by the speed, and the cells per second at thirty frames per second. From 3.75 cells per second at the start to 11.25 from sixteen points on. The frames per step are not always whole numbers, and it is not a problem: at 48 the steps come every five or six frames, 5.33 on average. This is what fixed point gives you.

## Slide 7: What does a frame cost?

What does a frame of Part 3 cost? It clears 64,000 pixels and redraws title, score, worm and food, thirty times per second. Yet between two steps nothing changes on the screen, and a step changes very little: the cell the tail left, the old head that becomes body, the new head, and sometimes the food and the score. So remember what changed and draw only that. It works because the frame buffer is memory: the picture stays there by itself.

## Slide 8: Before and after, with numbers

Six actions. Run the finished game in debug mode and start a game. Read the telemetry for ten seconds. Compare with the numbers of Part 3 that you wrote down at the beginning. Let the worm grow to twenty cells in both versions and read again: in one the cost grows with the worm, in the other it does not. Put a breakpoint on `draw_changes` and check that it stops once per step. Write the numbers down: they go into the description of your game.

## Slide 9: Follow a call with the debugger

Follow a call with the debugger. Stop on the call to `to_decimal` and read `a0`, `a1`, `ra` and `sp`. One step: the PC jumps into the function and `ra` holds the address of the instruction after the call. Step through: only temporaries change and `sp` never moves, because it is a leaf. At `ret` the PC takes the value of `ra`. Then do the same with `draw_text`: `sp` goes down by 16, `ra` is stored and comes back.

## Slide 10: Check your understanding: to_decimal receives a0 = 205. Which bytes does it store, from offset 0 to 2? / At which score does the worm take one step every 4 frames?

Convert 205 into three digits, then each digit into its ASCII code by adding 0x30. Mind the order: offset 0 holds the hundreds.

One step every four frames means a speed of 256 divided by 4. Put that value into the formula of the speed and solve for the score.

## Slide 11: Check your understanding: dirty is 0 when verm1_draw is called. How many machine instructions does it execute? / Why can to_decimal do without a stack frame?

Count the instructions of the shortest path of `verm1_draw`, remembering that `la` is a pseudo-instruction and expands into two.

Ask what a stack frame is for: saving `ra` when there is another call, and saving the registers that must be preserved. Does `to_decimal` need either?

## Slide 12: Where we are, and what comes next

Verm1 is finished: about six hundred lines of RISC-V assembly, all yours. It began as three functions that return and grew one runnable step at a time, and every part of the course is in it: numbers, logic, state, memory, calls, pixels, devices. One thing is missing: a program that only its author can run is half finished. The next lecture gives it a name, an icon and credits, and publishes it.
