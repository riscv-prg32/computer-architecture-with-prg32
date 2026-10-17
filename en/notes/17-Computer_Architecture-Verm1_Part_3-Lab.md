# Lecture 17: Verm1, Part 3: A Body, Rules and States: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: arrays in memory; finite-state machines; .text, .rodata, .data; latches and flip-flops; fixed point. USE NOW: the calling convention (Lecture 18) and, used without being studied in this course, the PRG32 tools, the PRG32-QT debugger. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) implement the game as a state machine with three states; (2) keep the body in a ring buffer and the grid in an array of bytes; (3) detect a collision by reading the grid. Builds on: arrays in memory (Lecture 04); finite-state machines (Lecture 13); .text, .rodata, .data (Lecture 07); latches and flip-flops (Lecture 13); fixed point (Lecture 06). Next: Lecture 18, The Processor.

Closing thread: The game now has a memory and states: the sequential machines of Lecture 13, written in software. Next: the processor that runs all of this.

## Slide 1: Verm1, Part 3: A Body, Rules and States: the code

This is the code deck of Lecture 17. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The reference program is ~/arc12/verm1/verm1_part3.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: The working loop, again

The usual two commands. Today the file changes substantially, so building should not wait until the end: the program is built and run after every slide titled "Run it". If something breaks, the fault lies in the lines added since the last successful run, which confines the search.

## Slide 4: CHANGED Constants: a button, a colour, three states

The new constants replace those of Part 2. `BODY` is a darker green for the segments behind the head. `BTN_A` is the mask of button A, bit 4 of the button word. The three states are the numbers 0, 1 and 2, given names. The `.section` and `.global` lines that used to close this block move to the next slide.

## Slide 5: CHANGED .rodata: what stays in the file

The read-only section: three strings, for the title, the invitation and the game over, and the two tables `dx` and `dy` of Part 2. The program never writes here. On the board this section could remain in flash; it is the part of the cartridge that would survive a power cycle, as the warm-up of Lecture 16 demonstrated.

## Slide 6: CHANGED .data: what lives in RAM

The section of variables. `head_x` and `head_y` have disappeared: the head now lives in the ring. The directive `.space` reserves a number of bytes without naming each: 256 for `body_x`, 256 for `body_y`, 960 for the map. `best` holds the best score, which survives from one game to the next but not a power cycle, because it resides in RAM. A portable cartridge has no permanent memory of its own, a limitation acknowledged here explicitly.

## Slide 7: CHANGED init: start on the title

`verm1_init` now performs a single task: it selects the initial state, TITLE. Preparing a game becomes the responsibility of a new function, `new_game`, invoked when the player presses A. The old `verm1_update`, `step` and `verm1_draw` are deleted from the file, since the following slides replace them; `place_food`, `eat_sound` and `draw_cell` are kept.

## Slide 8: CHANGED update: buttons, and their edges

The first half of the new `verm1_update` reads the buttons and computes their edges. `s0` holds the buttons of the current frame; `prev_btn`, in memory, those of the previous frame. The expression "now AND NOT before" yields 1 only in the positions where a press has just begun, and the result is placed in `s1`. `prev_btn` is then updated. This is the edge detector of Lecture 13: a register delaying by one clock period, followed by an AND gate with one inverted input. Because `s0` and `s1` must survive the calls that follow, they are saved in the frame.

## Slide 9: CHANGED update: one branch per state

The second half is the transition table, written line by line. The state is read first, and it determines which inputs are considered. In TITLE, a new press of A calls `new_game`. In OVER, a new press of A stores TITLE. In PLAY, the buttons currently held, levels rather than edges, are passed to `play_update`, because steering must respond while a button remains down. The labels are named, `u_play`, `u_start`, `u_done`, because numeric labels would be difficult to follow in a function of this size.

## Slide 10: CHANGED draw: what to show in each state

`verm1_draw` renders a different picture for each state. The title line is always drawn. In TITLE only the invitation PRESS A appears, centred: x = 132 centres seven characters of 8 pixels. In PLAY and OVER the function draws the score, the worm and the food. `draw` changes nothing: its output depends only on the state and on memory, exactly as the output of a Moore machine depends only on its state.

## Slide 11: CHANGED draw: game over, and draw_text

The end of `verm1_draw`: in the OVER state two words are written over the scene. A small helper, `draw_text`, supplies the two colour arguments, white on black, and passes the first three through, saving two lines at each call that draws text. Small helpers of this kind make a program shorter and easier to modify consistently.

## Slide 12: For now: four functions that do nothing

Four *stubs*: functions that exist only by name and return immediately, except `new_game`, which merely stores PLAY. Thanks to them the program builds, and the state machine can be exercised before its parts are written. This is the method of the first programming lecture applied at a larger scale: begin with functions that do nothing, then add one thing at a time.

## Slide 13: Run it: a machine with nothing inside

Run it. The title line and PRESS A appear. When A is pressed the invitation disappears and a red cell appears in the top-left corner, because the variables of the food are still zero. Nothing moves and the game cannot end, since PLAY has no rules yet. In the debugger the variable `state` can be located and observed to change from 0 to 1 when A is pressed: the machine works, and it is empty.

## Slide 14: NEW new_game: empty the map, lay the worm

The first half of the real `new_game`. A loop clears the 960 bytes of the map, one `sb` at a time. The worm is then laid down: three segments in columns 3, 4 and 5 of row 12. Each segment is written twice, its column and row into the ring and a 1 into the map, which establishes the invariant that ring and map agree. The expression `grid+12*COLS` is evaluated by the assembler. Since each entry is one byte, the index is added to the base address without scaling.

## Slide 15: NEW new_game: the variables, the food, PLAY

The second half initialises the variables: `head_i` = 2 and `length` = 3, which together describe the worm just laid; direction, timer and score start from zero; the first food is placed. The last instruction stores PLAY in the state. The order is deliberate: the transition is completed only when everything it requires is ready, so that no other part of the program can observe a half-initialised game.

## Slide 16: NEW draw_worm: walk the ring backwards

`draw_worm` traverses the ring backwards from the head: segment i is entry `head_i - i`, masked with 255. Column and row are loaded with `lbu`, which reads a byte as an unsigned number, and passed to `draw_cell`. Segment 0, the head, is drawn in a brighter green than the rest. The loop ends when i reaches the length. `lbu` rather than `lb` states that a column is never negative, as the note on Lecture 05 explains.

## Slide 17: NEW draw_score: the marks of Part 2

`draw_score` is the loop that in Part 2 lay inside `verm1_draw`, now a function in its own right: one small mark per point. Since it uses `s0` as its counter, it saves that register on entry and restores it on exit.

## Slide 18: One stub is left

Of the four stubs only one remains: `play_update`, which still does nothing. The worm exists in memory and on screen, and stands still.

## Slide 19: Run it: a worm that stands still

Run it and press A: a worm of three cells in row 12, with the brighter head on the right, and the food in a random cell. Memory can now be inspected with the debugger. At the address of `body_x` the first bytes are 03 04 05. In the map, at offset 12 × 40 + 3, three bytes equal to 01 stand amid zeros. These are the two data structures of the lecture deck, the ring and the map, now populated.

## Slide 20: CHANGED play_update: your update of Part 2

`play_update` is the `verm1_update` of Part 2 under a new name: the four button tests and the U-turn rule. One difference: the buttons arrive as an argument in `a0`, so no call is needed to read them.

## Slide 21: CHANGED play_update: the timer

The end of `play_update` is exactly the timer of Part 2: the speed is added, and when a whole cell has accumulated `step` is called.

## Slide 22: CHANGED step: three registers to keep

The beginning of `step`. Three registers must retain their values across the calls that follow: `s0` and `s1` for the cell of the new head, `s2` for the result of the food test. The frame therefore saves `ra` and three `s` registers, four words in all. The lookup of `dx` and `dy` is that of Part 2.

## Slide 23: CHANGED step: where will the head be?

Where will the head be? The present head is entry `head_i` of the ring: its column and row are loaded with `lbu`, `dx` and `dy` added, and the result wrapped at the edges as in Part 2. The new cell is now in `s0` and `s1`. Nothing has yet been written: the program must examine before it acts.

## Slide 24: CHANGED step: eat, or move the tail

Eat, or move the tail. The comparator of Part 2 leaves its result in `s2`, zero if the new head lies on the food. If the worm eats, the length grows by one and the tail stays in place. Otherwise the tail must leave: its entry is `head_i - length + 1`, and its column and row are loaded. Growing and not moving the tail are one and the same operation, which is the whole trick of Snake.

## Slide 25: NEW step: free the tail, test the head

Now the map. The index of a byte is row × 40 + column, computed with `mul` and `add`; `mul` belongs to the M extension, which the ESP32-C6 implements. First the byte of the tail is cleared, then the byte of the new head is tested. The order matters: within the same step the tail moves away, so the head may legitimately enter the cell the tail has just vacated. If the byte is 1 the worm has bitten itself: the state becomes OVER and the best score is updated.

## Slide 26: NEW step: write the new head

If the cell is free, the new head is written: a 1 in the map, `head_i` incremented and masked with 255, and column and row stored in the new entry of the ring. Then, if `s2` is zero, the reward: a point, new food, a sound. After a collision the function skips all of this, so the screen shows the worm as it was before the fatal step.

## Slide 27: CHANGED place_food: not on the worm

`place_food` is corrected: it draws a random cell, examines its byte in the map, and if the cell is occupied draws again, until a free cell results. The column waits in `s0` while the second random number is requested. The loop is short: even with the longest worm, 255 cells out of 960, fewer than two attempts are needed on average.

## Slide 28: Run it: Verm1, Part 3

Run it: this is Verm1, Part 3. The worm follows its head and grows at every meal; turning into the body ends the game; A returns to the title, and A again starts a new game. The two screenshots come from the automatic test: seven cells and four marks after four meals, and the game-over screen.

## Slide 29: Appendix: two functions that did not change

Two functions are unchanged with respect to Part 2: `eat_sound` and `draw_cell`. They are reprinted on the next two slides, marked UNCHANGED, so that this deck contains the whole program. The complete file is the union of the slides marked NEW and CHANGED, together with these two.

## Slide 30: UNCHANGED eat_sound

`eat_sound`, as in Part 2: five arguments and a call to `prg32_audio_note`, producing one note of 60 milliseconds.

## Slide 31: UNCHANGED draw_cell

`draw_cell`, as in Part 2: column, row and colour are received, the cell coordinates converted to pixels, and one rectangle drawn.

## Slide 32: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 33: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 34: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 35: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 36: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 37: Make it yours

Four modifications of the student's own devising. Walls: the worm dies at the edge instead of wrapping. A longer initial worm, perhaps depending on the best score. Poison: a second, blue cell that shortens the worm by one, which requires the tail to advance twice while preserving the ring-map invariant. And the best score displayed as marks on the game-over screen. Each touches one or two functions. A copy of the working Part 3 should be kept first.
