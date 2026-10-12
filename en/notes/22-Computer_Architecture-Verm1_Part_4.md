# Lecture 22: Verm1, Part 4: The Finished Game

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 4: The Finished Game

The fourth and last tutorial finishes Verm1. In Part 3 the game was complete in its rules; today it becomes complete as a program. The score is written in digits, the worm accelerates, there are two sounds, and the screen is redrawn only where it changes. Knuth's sentence on the cover explains the order of the work: first the game was made to work, and only now, with a measure in hand, do we make it fast.

## Slide 2: What you will have by the end

Five results. The score and the best score in digits, converted by a division by ten that you write. A worm that goes faster as the score grows, up to a limit. Two sounds, one for a meal and one for the end. A `draw` that touches a handful of cells per step instead of the whole screen. And a finished game, ready to be packaged and published in the next lecture.

## Slide 3: What Part 4 takes from the lectures

The ideas of the last block of lectures, and where they appear today. The calling convention of Lecture 18 becomes small functions with a contract, some of them leaves. The M extension gives quotient and remainder for the digits. The processor cycle reminds us that every instruction costs time, so we measure. The screen as memory, from Lecture 20, suggests drawing only what changed. And from Lecture 21: the devices belong to the runtime, to which we ask for a note of a given duration.

## Slide 4: Where you are going

Where you are going: the title screen with the best score, the game with the score in digits, the game over. Start from a Part 3 that runs; if yours does not, copy the reference file. There are four steps of code today, and the program runs after each one.

## Slide 5: The working loop, again

The same two commands as always. Before changing anything, run Part 3 in debug mode and write down what the telemetry shows during a game: retired instructions, frames per second, late frames. These numbers are the "before" of the measure that closes the lecture; without them you cannot say what you have gained.

## Slide 6: Step 1: the score in digits

The first step replaces the marks of the score with digits. It needs one new function and a change of point of view: a number and its written form are different things.

## Slide 7: A number is not its digits

The variable `score` holds a binary number: 137 is the byte 0x89. The screen wants three characters, the bytes 0x31, 0x33 and 0x37. The conversion is the one you did by hand in Lecture 05: divide by ten, and the remainder is a digit; repeat on the quotient. The digits come out from the right, units first, so they are stored from the last character to the first. A digit becomes a character by adding 48, the ASCII code of the character zero.

## Slide 8: NEW to_decimal: divide by ten, three times

`to_decimal` has a contract written in its comment: the value in `a0`, the address of three characters in `a1`. Three times it does the same thing: `remu` gives the remainder of the division by ten, 48 is added, `sb` stores the byte, and `divu` leaves the quotient for the next round. The offsets are 2, 1 and 0: from the units to the hundreds. It is a *leaf* function: it calls nobody and uses only temporary registers, so it needs no stack frame at all.

## Slide 9: CHANGED draw_score: two numbers, two texts

`draw_score` replaces that of Part 3. It calls `to_decimal` twice, once for the score and once for the best score, each time with the address inside a string where the digits must go: `best_txt+5` skips the word BEST and the space. Then the two strings are drawn like any other text. Because text is drawn with its background, the new digits cover the old ones.

## Slide 10: CHANGED .data: the variables of Part 4

The new `.data` section. Two strings that the program fills in: they are in `.data` and not in `.rodata` precisely because the program writes into them. Then six new variables: `dirty`, the old position of the head, and the cell to erase. They are not used until the third step; type them now, so that the section is written once.

## Slide 11: Run it: digits

Build and run. The top line reads VERM1 000 and, on the right, BEST 000; each meal adds one; when you lose, BEST shows your score. Then open the debugger and look at `score_txt` in memory: after three meals its bytes are 30 30 33 00. You are reading the characters that your division produced.

## Slide 12: Step 2: levels

The second step makes the game harder as it goes on: the speed, a constant until now, becomes a function of the score.

## Slide 13: CHANGED Constants: two speeds instead of one

The constant `SPEED_Q8` is replaced by two: a minimum of 32 and a maximum of 96. They are fixed-point values in 256ths of a cell per frame, as in Part 2: 32 means one step every eight frames, 96 means three steps every eight frames.

## Slide 14: CHANGED play_update: a speed that grows

The timer at the end of `play_update`. The speed is 32 plus four times the score: a shift by two positions and an addition. Then a comparison keeps the smaller between this value and the maximum. The rest is the timer you know: the speed is added to an accumulator, and a step is taken when it passes 256. A value that follows a line and then stays at a limit is a *saturation*.

## Slide 15: The levels, in numbers

The levels in numbers. For each score, the speed, the frames per step, which is 256 divided by the speed, and the cells per second at thirty frames per second. From 3.75 cells per second at the start to 11.25 from sixteen points on. The frames per step are not always whole numbers, and it is not a problem: at 48 the steps come every five or six frames, 5.33 on average. This is what fixed point gives you.

## Slide 16: Run it: faster and faster

Build and run: the worm starts slower than in Part 3 and gains speed at every meal. With the debugger, count the frames between two steps at score zero: eight. Reach sixteen points and check that the speed no longer changes. Then, if you dare, try a maximum of 256: one step per frame.

## Slide 17: Step 3: step tells what it changed

The third step prepares the fourth. The function `step` begins to write down what it changed, and the sounds are reorganised. Nothing new will appear on the screen.

## Slide 18: CHANGED play_note: one function, any note

`play_note` replaces `eat_sound`. The caller chooses the note and the duration, in `a2` and `a4`; the function fills in channel, instrument and volume and calls `prg32_audio_note`. Notice the choice of registers: note and duration are already where the function of the runtime expects them, so nothing has to be moved. A contract designed around the callee saves instructions.

## Slide 19: CHANGED step: remember the old head

The beginning of `step`, with two stores added: before the head moves, its coordinates are written into `old_x` and `old_y`. That cell is about to stop being the head and become body, and `draw` will have to repaint it.

## Slide 20: CHANGED step: is there a cell to erase?

The branch of the meal. When the worm eats, the tail does not move, so there is no cell to erase: `erase_on` is set to zero to say so.

## Slide 21: CHANGED step: note the tail, call the end

When the worm does not eat, the tail leaves a cell: its coordinates are saved in `erase_x` and `erase_y`, and `erase_on` becomes 1. Further down, the collision with the body is no longer handled here: it has become a single call to `game_is_over`.

## Slide 22: CHANGED step: write the new head

The new head is written into the ring and into the map, exactly as in Part 3. The slide is here only because the function continues on the next one.

## Slide 23: NEW step: something changed

The new end of `step`. First `dirty` is set to 1: a step happened, and `draw` has work to do. Then, if the worm has eaten: one more point, new food, and a short high note, number 72 for 60 milliseconds, requested with two `li` and a call.

## Slide 24: NEW game_is_over: the transition, in one place

`game_is_over` gathers in one place everything that the transition from PLAY to OVER involves: the new state, the update of the best score, `dirty` set to 2 because a whole new screen must be drawn, and a long low note, number 36 for 400 milliseconds. A transition of the state machine deserves a function of its own.

## Slide 25: Run it: the sound of defeat

Build and run: the game looks exactly as after the second step. What changes can be heard: a low note when you bite yourself. In the debugger watch `erase_x` and `erase_y` follow the tail, one step behind, and `dirty` stay at 1 or 2: it is written, and nobody reads it yet.

## Slide 26: Step 4: draw only what changed

The fourth step is the optimisation: from a whole screen at every frame to a few cells at every step.

## Slide 27: What does a frame cost?

What does a frame of Part 3 cost? It clears 64,000 pixels and redraws title, score, worm and food, thirty times per second. Yet between two steps nothing changes on the screen, and a step changes very little: the cell the tail left, the old head that becomes body, the new head, and sometimes the food and the score. So remember what changed and draw only that. It works because the frame buffer is memory: the picture stays there by itself.

## Slide 28: CHANGED draw: nothing, a little, or everything

The new `verm1_draw` reads `dirty` and clears it at once. If it was zero, it returns immediately: no stack frame, no call, five machine instructions. If it was 1, a step happened and `draw_changes` is called. If it was 2, the state changed and `draw_full` redraws everything. The most frequent case is the cheapest, which is the mark of a well-made optimisation.

## Slide 29: NEW draw_changes: three cells and the score

`draw_changes` paints at most three cells. If `erase_on` is set, the cell left by the tail becomes black. The old head is repainted in the colour of the body. Then the new head, the food and the score. The order matters: the head may enter exactly the cell that the tail has just left, so the erasure must come first and the head afterwards.

## Slide 30: NEW draw_full: a whole screen

`draw_full` is the body of the old `verm1_draw`: it clears the screen and draws the score; in the TITLE state it adds the invitation and returns. It is called once for every change of state, not at every frame.

## Slide 31: NEW draw_full: PLAY and OVER

The second half of `draw_full`: in PLAY and OVER it draws the worm and the food with their functions, and in OVER it adds the two words of the game over.

## Slide 32: NEW draw_head

`draw_head` draws one cell in bright green: the entry `head_i` of the ring. It is a small function with a single job, used by `draw_changes`.

## Slide 33: NEW draw_food

`draw_food`: the three lines that were inside `draw` now have a name and two callers, the full drawing and the partial one.

## Slide 34: UNCHANGED draw_text

`draw_text`, the helper of Part 3, unchanged. It is shown on a slide of its own because in Part 3 it shared one with the game-over text.

## Slide 35: CHANGED init: ask for the first screen

`verm1_init` with three lines added: `dirty` starts at 2, because the title screen must be drawn once.

## Slide 36: CHANGED update: a new state is a new screen

In `verm1_update`, the transition from OVER back to TITLE now also sets `dirty` to 2: a new state is a new screen.

## Slide 37: CHANGED new_game: and here too

The same in `new_game`, for the transition from TITLE to PLAY. This is the rule of the technique: every transition asks for a full drawing, every step for a partial one. If you forget one, the screen shows a state that is no longer true, and this is the typical bug.

## Slide 38: Run it: the finished Verm1

The finished Verm1. It must be the same game as after the third step, pixel for pixel: the optimisation must not be visible. If you see trails or holes, some change was not recorded: find it with the debugger, starting from the three variables that `step` writes.

## Slide 39: Step 5: measure

The last step writes no code. You use PRG32-QT as a measuring instrument, because an optimisation that has not been measured is only an opinion.

## Slide 40: Before and after, with numbers

Six actions. Run the finished game in debug mode and start a game. Read the telemetry for ten seconds. Compare with the numbers of Part 3 that you wrote down at the beginning. Let the worm grow to twenty cells in both versions and read again: in one the cost grows with the worm, in the other it does not. Put a breakpoint on `draw_changes` and check that it stops once per step. Write the numbers down: they go into the description of your game.

## Slide 41: Follow a call with the debugger

Follow a call with the debugger. Stop on the call to `to_decimal` and read `a0`, `a1`, `ra` and `sp`. One step: the PC jumps into the function and `ra` holds the address of the instruction after the call. Step through: only temporaries change and `sp` never moves, because it is a leaf. At `ret` the PC takes the value of `ra`. Then do the same with `draw_text`: `sp` goes down by 16, `ra` is stored and comes back.

## Slide 42: Check your understanding: to_decimal receives a0 = 205. Which bytes does it store, from offset 0 to 2?

Convert 205 into three digits, then each digit into its ASCII code by adding 0x30. Mind the order: offset 0 holds the hundreds.

## Slide 43: Check your understanding: At which score does the worm take one step every 4 frames?

One step every four frames means a speed of 256 divided by 4. Put that value into the formula of the speed and solve for the score.

## Slide 44: Check your understanding: dirty is 0 when verm1_draw is called. How many machine instructions does it execute?

Count the instructions of the shortest path of `verm1_draw`, remembering that `la` is a pseudo-instruction and expands into two.

## Slide 45: Check your understanding: Why can to_decimal do without a stack frame?

Ask what a stack frame is for: saving `ra` when there is another call, and saving the registers that must be preserved. Does `to_decimal` need either?

## Slide 46: Make it yours

Four ideas to make the game yours. A pause with button B: a fourth state. A melody on the title screen, from a table of notes. Bonus food that is worth more and disappears. Your own colours, or your own rules. The version you will publish in the next lecture should contain something that is yours, starting from the title.

## Slide 47: Appendix: the functions that did not change

An appendix follows: the eight parts of the file that did not change from Part 3. They are included so that this deck contains the whole program; keep them as they are in your file.

## Slide 48: UNCHANGED update: buttons and edges

`verm1_update`: the reading of the buttons and the edge detector of Part 3.

## Slide 49: UNCHANGED new_game: the map and the worm

The first half of `new_game`: the map is emptied and the worm is placed.

## Slide 50: UNCHANGED play_update: steering

The steering inside `play_update`: the masks of the buttons and the rule that forbids the U-turn, from Part 2.

## Slide 51: UNCHANGED step: the table lookup

The beginning of `step`: the stack frame and the lookup of the direction in the tables `dx` and `dy`.

## Slide 52: UNCHANGED place_food

`place_food`: a random cell, tried again until it is free.

## Slide 53: UNCHANGED draw_worm

`draw_worm`, which walks the ring backwards. It is now used only by `draw_full`, once per new screen.

## Slide 54: UNCHANGED draw_cell

`draw_cell`, from cells to pixels: the same function since Part 2.

## Slide 55: UNCHANGED .rodata

The `.rodata` section: the strings and the tables of the directions.

## Slide 56: Where we are, and what comes next

Verm1 is finished: about six hundred lines of RISC-V assembly, all yours. It began as three functions that return and grew one runnable step at a time, and every part of the course is in it: numbers, logic, state, memory, calls, pixels, devices. One thing is missing: a program that only its author can run is half finished. The next lecture gives it a name, an icon and credits, and publishes it.
