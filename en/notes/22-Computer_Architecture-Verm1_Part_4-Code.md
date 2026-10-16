# Lecture 22: Verm1, Part 4: The Finished Game: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: quotient and remainder; characters and strings; fixed point; the calling convention; arrays in memory; finite-state machines; the frame buffer; the processor cycle. USE NOW: the PRG32 tools, the PRG32-QT debugger (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 4: The Finished Game: the code

This is the code deck of Lecture 22. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The reference program is ~/arc12/verm1/verm1_part4.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: The working loop, again

The same two commands as always. Before changing anything, run Part 3 in debug mode and write down what the telemetry shows during a game: retired instructions, frames per second, late frames. These numbers are the "before" of the measure that closes the lecture; without them you cannot say what you have gained.

## Slide 4: NEW to_decimal: divide by ten, three times

`to_decimal` has a contract written in its comment: the value in `a0`, the address of three characters in `a1`. Three times it does the same thing: `remu` gives the remainder of the division by ten, 48 is added, `sb` stores the byte, and `divu` leaves the quotient for the next round. The offsets are 2, 1 and 0: from the units to the hundreds. It is a *leaf* function: it calls nobody and uses only temporary registers, so it needs no stack frame at all.

## Slide 5: CHANGED draw_score: two numbers, two texts

`draw_score` replaces that of Part 3. It calls `to_decimal` twice, once for the score and once for the best score, each time with the address inside a string where the digits must go: `best_txt+5` skips the word BEST and the space. Then the two strings are drawn like any other text. Because text is drawn with its background, the new digits cover the old ones.

## Slide 6: CHANGED .data: the variables of Part 4

The new `.data` section. Two strings that the program fills in: they are in `.data` and not in `.rodata` precisely because the program writes into them. Then six new variables: `dirty`, the old position of the head, and the cell to erase. They are not used until the third step; type them now, so that the section is written once.

## Slide 7: Run it: digits

Build and run. The top line reads VERM1 000 and, on the right, BEST 000; each meal adds one; when you lose, BEST shows your score. Then open the debugger and look at `score_txt` in memory: after three meals its bytes are 30 30 33 00. You are reading the characters that your division produced.

## Slide 8: CHANGED Constants: two speeds instead of one

The constant `SPEED_Q8` is replaced by two: a minimum of 32 and a maximum of 96. They are fixed-point values in 256ths of a cell per frame, as in Part 2: 32 means one step every eight frames, 96 means three steps every eight frames.

## Slide 9: CHANGED play_update: a speed that grows

The timer at the end of `play_update`. The speed is 32 plus four times the score: a shift by two positions and an addition. Then a comparison keeps the smaller between this value and the maximum. The rest is the timer you know: the speed is added to an accumulator, and a step is taken when it passes 256. A value that follows a line and then stays at a limit is a *saturation*.

## Slide 10: Run it: faster and faster

Build and run: the worm starts slower than in Part 3 and gains speed at every meal. With the debugger, count the frames between two steps at score zero: eight. Reach sixteen points and check that the speed no longer changes. Then, if you dare, try a maximum of 256: one step per frame.

## Slide 11: CHANGED play_note: one function, any note

`play_note` replaces `eat_sound`. The caller chooses the note and the duration, in `a2` and `a4`; the function fills in channel, instrument and volume and calls `prg32_audio_note`. Notice the choice of registers: note and duration are already where the function of the runtime expects them, so nothing has to be moved. A contract designed around the callee saves instructions.

## Slide 12: CHANGED step: remember the old head

The beginning of `step`, with two stores added: before the head moves, its coordinates are written into `old_x` and `old_y`. That cell is about to stop being the head and become body, and `draw` will have to repaint it.

## Slide 13: CHANGED step: is there a cell to erase?

The branch of the meal. When the worm eats, the tail does not move, so there is no cell to erase: `erase_on` is set to zero to say so.

## Slide 14: CHANGED step: note the tail, call the end

When the worm does not eat, the tail leaves a cell: its coordinates are saved in `erase_x` and `erase_y`, and `erase_on` becomes 1. Further down, the collision with the body is no longer handled here: it has become a single call to `game_is_over`.

## Slide 15: CHANGED step: write the new head

The new head is written into the ring and into the map, exactly as in Part 3. The slide is here only because the function continues on the next one.

## Slide 16: NEW step: something changed

The new end of `step`. First `dirty` is set to 1: a step happened, and `draw` has work to do. Then, if the worm has eaten: one more point, new food, and a short high note, number 72 for 60 milliseconds, requested with two `li` and a call.

## Slide 17: NEW game_is_over: the transition, in one place

`game_is_over` gathers in one place everything that the transition from PLAY to OVER involves: the new state, the update of the best score, `dirty` set to 2 because a whole new screen must be drawn, and a long low note, number 36 for 400 milliseconds. A transition of the state machine deserves a function of its own.

## Slide 18: Run it: the sound of defeat

Build and run: the game looks exactly as after the second step. What changes can be heard: a low note when you bite yourself. In the debugger watch `erase_x` and `erase_y` follow the tail, one step behind, and `dirty` stay at 1 or 2: it is written, and nobody reads it yet.

## Slide 19: CHANGED draw: nothing, a little, or everything

The new `verm1_draw` reads `dirty` and clears it at once. If it was zero, it returns immediately: no stack frame, no call, five machine instructions. If it was 1, a step happened and `draw_changes` is called. If it was 2, the state changed and `draw_full` redraws everything. The most frequent case is the cheapest, which is the mark of a well-made optimisation.

## Slide 20: NEW draw_changes: three cells and the score

`draw_changes` paints at most three cells. If `erase_on` is set, the cell left by the tail becomes black. The old head is repainted in the colour of the body. Then the new head, the food and the score. The order matters: the head may enter exactly the cell that the tail has just left, so the erasure must come first and the head afterwards.

## Slide 21: NEW draw_full: a whole screen

`draw_full` is the body of the old `verm1_draw`: it clears the screen and draws the score; in the TITLE state it adds the invitation and returns. It is called once for every change of state, not at every frame.

## Slide 22: NEW draw_full: PLAY and OVER

The second half of `draw_full`: in PLAY and OVER it draws the worm and the food with their functions, and in OVER it adds the two words of the game over.

## Slide 23: NEW draw_head

`draw_head` draws one cell in bright green: the entry `head_i` of the ring. It is a small function with a single job, used by `draw_changes`.

## Slide 24: NEW draw_food

`draw_food`: the three lines that were inside `draw` now have a name and two callers, the full drawing and the partial one.

## Slide 25: UNCHANGED draw_text

`draw_text`, the helper of Part 3, unchanged. It is shown on a slide of its own because in Part 3 it shared one with the game-over text.

## Slide 26: CHANGED init: ask for the first screen

`verm1_init` with three lines added: `dirty` starts at 2, because the title screen must be drawn once.

## Slide 27: CHANGED update: a new state is a new screen

In `verm1_update`, the transition from OVER back to TITLE now also sets `dirty` to 2: a new state is a new screen.

## Slide 28: CHANGED new_game: and here too

The same in `new_game`, for the transition from TITLE to PLAY. This is the rule of the technique: every transition asks for a full drawing, every step for a partial one. If you forget one, the screen shows a state that is no longer true, and this is the typical bug.

## Slide 29: Run it: the finished Verm1

The finished Verm1. It must be the same game as after the third step, pixel for pixel: the optimisation must not be visible. If you see trails or holes, some change was not recorded: find it with the debugger, starting from the three variables that `step` writes.

## Slide 30: Appendix: the functions that did not change

An appendix follows: the eight parts of the file that did not change from Part 3. They are included so that this deck contains the whole program; keep them as they are in your file.

## Slide 31: UNCHANGED update: buttons and edges

`verm1_update`: the reading of the buttons and the edge detector of Part 3.

## Slide 32: UNCHANGED new_game: the map and the worm

The first half of `new_game`: the map is emptied and the worm is placed.

## Slide 33: UNCHANGED play_update: steering

The steering inside `play_update`: the masks of the buttons and the rule that forbids the U-turn, from Part 2.

## Slide 34: UNCHANGED step: the table lookup

The beginning of `step`: the stack frame and the lookup of the direction in the tables `dx` and `dy`.

## Slide 35: UNCHANGED place_food

`place_food`: a random cell, tried again until it is free.

## Slide 36: UNCHANGED draw_worm

`draw_worm`, which walks the ring backwards. It is now used only by `draw_full`, once per new screen.

## Slide 37: UNCHANGED draw_cell

`draw_cell`, from cells to pixels: the same function since Part 2.

## Slide 38: UNCHANGED .rodata

The `.rodata` section: the strings and the tables of the directions.

## Slide 39: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 40: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 41: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 42: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 43: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 44: Make it yours

Four ideas to make the game yours. A pause with button B: a fourth state. A melody on the title screen, from a table of notes. Bonus food that is worth more and disappears. Your own colours, or your own rules. The version you will publish in the next lecture should contain something that is yours, starting from the title.
