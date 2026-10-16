# Lecture 22: Verm1, Part 4: The Finished Game: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: quotient and remainder; characters and strings; fixed point; the calling convention; arrays in memory; finite-state machines; the frame buffer; the processor cycle. USE NOW: the PRG32 tools, the PRG32-QT debugger (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 4: The Finished Game: the code

This is the code deck of Lecture 22. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The reference program is ~/arc12/verm1/verm1_part4.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: The working loop, again

The same two commands as always. Before anything is changed, Part 3 is run in debug mode and the telemetry recorded during a game: retired instructions, frames per second, late frames. These figures are the baseline of the measurement that concludes the lecture; without them no claim of improvement could be substantiated.

## Slide 4: NEW to_decimal: divide by ten, three times

`to_decimal` states its contract in a comment: the value in `a0`, the address of three characters in `a1`. It performs the same operation three times: `remu` yields the remainder of division by ten, 48 is added to it, `sb` stores the byte, and `divu` leaves the quotient for the next round. The offsets are 2, 1 and 0, from units to hundreds. The function is a *leaf*: it calls nothing and uses only temporaries, so it needs no stack frame. Division instructions are slow on a small processor, tens of cycles each, but ten of them per step are negligible.

## Slide 5: CHANGED draw_score: two numbers, two texts

`draw_score` replaces that of Part 3. It calls `to_decimal` twice, once for the score and once for the best score, each time with an address within a string where the digits belong: `best_txt+5` skips the word BEST and the following space. The two strings are then drawn like any other text. Because text is drawn with its background colour, the new digits overwrite the old ones without any need to clear them first.

## Slide 6: CHANGED .data: the variables of Part 4

The new `.data` section. Two strings that the program fills in, placed in `.data` rather than `.rodata` precisely because the program writes into them. Six new variables follow: `dirty`, the previous position of the head, and the cell to be erased. They are not used until the third step, but are typed now so that the section is written once.

## Slide 7: Run it: digits

Build and run. The top line reads VERM1 000 and, on the right, BEST 000; each meal increments the first; on losing, BEST shows the score attained. In the debugger, `score_txt` can be inspected in memory: after three meals its bytes are 30 30 33 00, the characters produced by the student's own division.

## Slide 8: CHANGED Constants: two speeds instead of one

The constant `SPEED_Q8` is replaced by two: a minimum of 32 and a maximum of 96. Both are fixed-point values in 256ths of a cell per frame, as in Part 2: 32 means one step every eight frames, 96 three steps every eight frames.

## Slide 9: CHANGED play_update: a speed that grows

The timer at the end of `play_update`. The speed is 32 plus four times the score, computed with a shift by two positions and an addition. A comparison then retains the smaller of this value and the maximum. The rest is the familiar timer: the speed is added to an accumulator, and a step is taken whenever it exceeds 256. A quantity that follows a line and then remains at a bound is said to *saturate*, the same idea as the clamping of Lecture 05.

## Slide 10: Run it: faster and faster

Build and run: the worm starts more slowly than in Part 3 and accelerates at every meal. With the debugger, the frames between two steps at score zero can be counted: eight, as predicted. Reaching sixteen points, the speed can be verified to remain constant. A maximum of 256, one step per frame, may then be tried by the adventurous.

## Slide 11: CHANGED play_note: one function, any note

`play_note` replaces `eat_sound`. The caller chooses the note and the duration, in `a2` and `a4`; the function supplies channel, instrument and volume and calls `prg32_audio_note`. The choice of registers is deliberate: note and duration already sit where the runtime function expects them, so nothing needs to be moved. Designing a contract around the callee's interface saves instructions, a small but characteristic instance of interface design.

## Slide 12: CHANGED step: remember the old head

The beginning of `step`, with two stores added: before the head moves, its coordinates are written into `old_x` and `old_y`. That cell is about to cease being the head and become body, and `draw` will need to repaint it.

## Slide 13: CHANGED step: is there a cell to erase?

The branch taken on a meal. When the worm eats, the tail does not move, so there is no cell to erase, and `erase_on` is set to zero to record the fact.

## Slide 14: CHANGED step: note the tail, call the end

When the worm does not eat, the tail vacates a cell: its coordinates are saved in `erase_x` and `erase_y`, and `erase_on` is set to 1. Further on, the collision with the body is no longer handled inline: it has become a single call to `game_is_over`.

## Slide 15: CHANGED step: write the new head

The new head is written into the ring and into the map exactly as in Part 3. The slide appears only because the function continues on the next one.

## Slide 16: NEW step: something changed

The new end of `step`. First `dirty` is set to 1, because a step has occurred and `draw` has work to do. Then, if the worm has eaten: one more point, new food, and a short high note, number 72 for 60 milliseconds, requested with two `li` instructions and a call, arguments passed by contract.

## Slide 17: NEW game_is_over: the transition, in one place

`game_is_over` gathers in one place everything the transition from PLAY to OVER entails: the new state, the update of the best score, `dirty` set to 2 because an entire new screen must be drawn, and a long low note, number 36 for 400 milliseconds. A transition of the state machine merits a function of its own, so that its effects cannot be scattered or partially forgotten.

## Slide 18: Run it: the sound of defeat

Build and run: the game looks exactly as it did after the second step. What changes can be heard: a low note on biting oneself. In the debugger, `erase_x` and `erase_y` can be seen to follow the tail one step behind, and `dirty` to hold 1 or 2: it is written, and nothing reads it yet.

## Slide 19: CHANGED draw: nothing, a little, or everything

The new `verm1_draw` reads `dirty` and clears it at once. If it was zero, the function returns immediately: no stack frame, no call, five machine instructions. If it was 1, a step has occurred and `draw_changes` is called. If it was 2, the state has changed and `draw_full` redraws everything. The most frequent case is the cheapest, which is the hallmark of a well-conceived optimisation.

## Slide 20: NEW draw_changes: three cells and the score

`draw_changes` paints at most three cells. If `erase_on` is set, the cell vacated by the tail is painted black. The old head is repainted in the colour of the body. Then the new head, the food and the score are drawn. The order matters: the head may enter exactly the cell the tail has just left, so the erasure must precede the drawing of the head.

## Slide 21: NEW draw_full: a whole screen

`draw_full` is the body of the former `verm1_draw`: it clears the screen and draws the score, and in the TITLE state adds the invitation and returns. It is called once per change of state, not at every frame.

## Slide 22: NEW draw_full: PLAY and OVER

The second half of `draw_full`: in PLAY and OVER it draws the worm and the food through their functions, and in OVER it adds the two words of the game-over screen.

## Slide 23: NEW draw_head

`draw_head` draws one cell in bright green, the entry `head_i` of the ring. It is a small function with a single responsibility, used by `draw_changes`.

## Slide 24: NEW draw_food

`draw_food`: the three lines formerly inside `draw` now have a name and two callers, the full drawing and the partial one.

## Slide 25: UNCHANGED draw_text

`draw_text`, the helper of Part 3, unchanged. It is shown on a slide of its own because in Part 3 it shared one with the game-over text.

## Slide 26: CHANGED init: ask for the first screen

`verm1_init` with three lines added: `dirty` starts at 2, because the title screen must be drawn once.

## Slide 27: CHANGED update: a new state is a new screen

In `verm1_update`, the transition from OVER back to TITLE now also sets `dirty` to 2: a new state requires a new screen.

## Slide 28: CHANGED new_game: and here too

The same in `new_game`, for the transition from TITLE to PLAY. This is the governing rule of the technique: every transition requests a full drawing, every step a partial one. Forgetting one produces the characteristic defect of incremental rendering, a screen that depicts a state no longer true.

## Slide 29: Run it: the finished Verm1

The finished Verm1. It must be the same game as after the third step, pixel for pixel: the optimisation must be invisible. Trails or holes indicate that some change was not recorded, and the debugger should be used to find it, starting from the three variables that `step` writes.

## Slide 30: Appendix: the functions that did not change

An appendix follows: the eight parts of the file unchanged since Part 3. They are included so that this deck contains the whole program, and they are to be kept as they stand.

## Slide 31: UNCHANGED update: buttons and edges

`verm1_update`: the reading of the buttons and the edge detector of Part 3.

## Slide 32: UNCHANGED new_game: the map and the worm

The first half of `new_game`: the map is cleared and the worm laid down.

## Slide 33: UNCHANGED play_update: steering

The steering within `play_update`: the button masks and the rule forbidding the U-turn, from Part 2.

## Slide 34: UNCHANGED step: the table lookup

The beginning of `step`: the stack frame and the lookup of the direction in the tables `dx` and `dy`.

## Slide 35: UNCHANGED place_food

`place_food`: a random cell, drawn again until a free one results.

## Slide 36: UNCHANGED draw_worm

`draw_worm`, which traverses the ring backwards. It is now used only by `draw_full`, once per new screen.

## Slide 37: UNCHANGED draw_cell

`draw_cell`, from cells to pixels: the same function since Part 2.

## Slide 38: UNCHANGED .rodata

The `.rodata` section: the strings and the direction tables.

## Slide 39: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 40: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 41: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 42: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 43: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 44: Make it yours

Four ideas for making the game one's own. A pause on button B, which requires a fourth state. A melody on the title screen, read from a table of notes. Bonus food that is worth more and disappears after a time. One's own colours, or one's own rules. The version published in the next lecture should contain something of the author's, beginning with the title.
