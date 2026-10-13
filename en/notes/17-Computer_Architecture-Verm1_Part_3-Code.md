# Lecture 17: Verm1, Part 3: A Body, Rules and States: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 3: A Body, Rules and States: the code

This is the code deck of Lecture 17. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The reference program is ~/arc12/verm1/verm1_part3.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: The working loop, again

The usual two commands. Today the file changes a great deal, so do not wait until the end to build: build and run after every slide entitled "Run it". If something breaks, the mistake is in the lines added since the last run.

## Slide 4: CHANGED Constants: a button, a colour, three states

The new constants replace those of Part 2. `BODY` is a darker green for the segments behind the head. `BTN_A` is the mask of button A, bit 4 of the word of buttons. The three states are simply the numbers 0, 1 and 2, with names. The lines `.section` and `.global`, which used to close this block, move to the next slide.

## Slide 5: CHANGED .rodata: what stays in the file

The read-only section: three strings, for the title, the invitation and the game over, and the two tables `dx` and `dy` of Part 2. The program never writes here. On the board this section could remain in flash; it is the part of the cartridge that would survive a power-off.

## Slide 6: CHANGED .data: what lives in RAM

The section of variables. `head_x` and `head_y` have disappeared: the head now lives in the ring. The directive `.space` reserves a number of bytes without naming each one: 256 for `body_x`, 256 for `body_y`, 960 for the map. `best` holds the best score: it survives from one game to the next, but not a power-off, because it lives in RAM. A portable cartridge has no permanent memory of its own: an honest limit.

## Slide 7: CHANGED init: start on the title

`verm1_init` now does one thing only: it chooses the first state, TITLE. Preparing the game is the job of a new function, `new_game`, called when the player presses A. Delete from your file the old `verm1_update`, `step` and `verm1_draw`: the next slides replace them. Keep `place_food`, `eat_sound` and `draw_cell`.

## Slide 8: CHANGED update: buttons, and their edges

The first half of the new `verm1_update` reads the buttons and computes their edges. `s0` holds the buttons of this frame; `prev_btn`, in memory, holds those of the previous frame. The expression "now AND NOT before" gives a 1 only in the positions where a press has just begun, and the result goes into `s1`. Then `prev_btn` is updated. It is the edge detector of Lecture 13: a register that delays by one clock, and an AND gate with one input inverted.

## Slide 9: CHANGED update: one branch per state

The second half is the transition table, line by line. The state is read first, and it decides who looks at the inputs. In TITLE a new press of A calls `new_game`. In OVER a new press of A stores TITLE. In PLAY the buttons that are held, the levels and not the edges, are passed to `play_update`, because steering must work while a button is kept down. The labels have names here, `u_play`, `u_start`, `u_done`, because numbers would be hard to follow.

## Slide 10: CHANGED draw: what to show in each state

`verm1_draw` shows a different picture in each state. The title line is always drawn. In TITLE only the invitation PRESS A appears, centred: 132 is the x that centres seven characters of 8 pixels. In PLAY and OVER the function draws the score, the worm and the food. Note that `draw` changes nothing: its output depends only on the state and on the memory, as in a Moore machine.

## Slide 11: CHANGED draw: game over, and draw_text

The end of `verm1_draw`: in the state OVER two words are written over the scene. A small helper, `draw_text`, fills in the two colour arguments, white on black, and passes the first three through, so that each call to draw text needs two lines less. Small helpers like this make a program shorter and easier to change.

## Slide 12: For now: four functions that do nothing

Four *stubs*: functions that exist only by name and return at once, except `new_game`, which just stores PLAY. Thanks to them the program builds and the machine can be tried before its parts are written. It is the method of the first lecture: start with returns that do nothing, then add one thing at a time.

## Slide 13: Run it: a machine with nothing inside

Run it. You see the title line and PRESS A. Press A: the invitation disappears and a red cell appears in the top-left corner, because the variables of the food are still zero. Nothing moves and the game cannot end: PLAY has no rules yet. In the debugger, find the variable `state` and watch it go from 0 to 1 when you press A: the machine works, and it is empty.

## Slide 14: NEW new_game: empty the map, lay the worm

The first half of the real `new_game`. A loop sets the 960 bytes of the map to zero, one `sb` at a time. Then the worm is laid down: three segments in columns 3, 4 and 5 of row 12. Each segment is written twice: its column and row in the ring, and a 1 in the map. The expression `grid+12*COLS` is computed by the assembler. Since each entry is one byte, the index is added to the base address without any shift.

## Slide 15: NEW new_game: the variables, the food, PLAY

The second half sets the variables: `head_i` is 2 and `length` is 3, which together describe the worm just laid; direction, timer and score start from zero; the first food is placed. The last instruction stores PLAY in the state. The order is deliberate: the transition is complete only when everything is ready.

## Slide 16: NEW draw_worm: walk the ring backwards

`draw_worm` walks the ring backwards from the head: segment number i is entry `head_i - i`, masked with 255. Column and row are loaded with `lbu`, which reads one byte as an unsigned number, and passed to `draw_cell`. Segment 0, the head, is drawn in a brighter green than the others. The loop ends when i reaches the length.

## Slide 17: NEW draw_score: the marks of Part 2

`draw_score` is the loop that in Part 2 was inside `verm1_draw`, now a function of its own: one small mark for each point. It uses `s0` as its counter, so it saves it at the beginning and restores it at the end.

## Slide 18: One stub is left

Of the four stubs only one is left: `play_update`, which still does nothing. The worm exists in memory and on the screen, and stands still.

## Slide 19: Run it: a worm that stands still

Run it and press A: a worm of three cells in row 12, with the brighter head on the right, and the food in a random cell. Now look at memory with the debugger. At the address of `body_x` the first bytes are 03 04 05. In the map, at row 12 times 40 plus 3, there are three bytes at 01 in a sea of zeros. You are looking at the two structures of the lecture deck, the ring and the map, filled.

## Slide 20: CHANGED play_update: your update of Part 2

`play_update` is your `verm1_update` of Part 2 under a new name: the four button tests and the U-turn rule. One difference: the buttons arrive as an argument in `a0`, so there is no call to read them.

## Slide 21: CHANGED play_update: the timer

The end of `play_update` is exactly the timer of Part 2: add the speed, and when a whole cell has accumulated call `step`.

## Slide 22: CHANGED step: three registers to keep

The beginning of `step`. Three registers must keep their values across the calls that follow: `s0` and `s1` for the cell of the new head, `s2` for the result of the food test. So the frame saves `ra` and three `s` registers. The lookup of `dx` and `dy` is that of Part 2.

## Slide 23: CHANGED step: where will the head be?

Where will the head be? The present head is entry `head_i` of the ring: its column and row are loaded with `lbu`, `dx` and `dy` are added, and the result wraps at the edges as in Part 2. The new cell is now in `s0` and `s1`. Nothing has been written: first the program must look.

## Slide 24: CHANGED step: eat, or move the tail

Eat, or move the tail. The comparator of Part 2 leaves its result in `s2`: zero if the new head is on the food. If the worm eats, the length grows by one and the tail stays where it is. If not, the tail must leave: its entry is `head_i - length + 1`, and its column and row are loaded. Growing and not moving the tail are the same thing: that is the whole trick of Snake.

## Slide 25: NEW step: free the tail, test the head

Now the map. The number of a byte is row times 40 plus column, computed with `mul` and `add`. First the byte of the tail is cleared; then the byte of the new head is tested. The order matters: in the same step the tail moves away, so the head may enter the cell that the tail has just left. If the byte is 1 the worm has bitten itself: the state becomes OVER and the best score is updated.

## Slide 26: NEW step: write the new head

If the cell is free, the new head is written: a 1 in the map, `head_i` plus 1 masked with 255, and column and row in the new entry of the ring. Then, if `s2` is zero, the reward: a point, new food, a sound. After a collision the function skips all of this, so the screen shows the worm as it was before the fatal step.

## Slide 27: CHANGED place_food: not on the worm

`place_food` is corrected: it draws a random cell, looks at its byte in the map, and if the cell is occupied draws again, until a free one comes out. The column waits in `s0` while the second random number is requested. The loop is short: even with the longest worm fewer than two attempts are needed on average.

## Slide 28: Run it: Verm1, Part 3

Run it: this is Verm1, Part 3. The worm follows the head and grows at every meal; turning into the body ends the game; A returns to the title, and A again starts a new game. The two screenshots come from the automatic test: seven cells and four marks after four meals, and the game-over screen.

## Slide 29: Appendix: two functions that did not change

Two functions did not change with respect to Part 2: `eat_sound` and `draw_cell`. They are reprinted on the next two slides, marked UNCHANGED, so that this deck contains the whole program. The complete file is the sum of the slides marked NEW and CHANGED, plus these two.

## Slide 30: UNCHANGED eat_sound

`eat_sound`, as in Part 2: five arguments and a call to `prg32_audio_note`, for one note of 60 milliseconds.

## Slide 31: UNCHANGED draw_cell

`draw_cell`, as in Part 2: column, row and colour come in, the cell coordinates are converted to pixels, and one rectangle is drawn.

## Slide 32: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 33: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 34: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 35: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 36: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 37: Make it yours

Four changes of your own. Walls: the worm dies at the edge instead of wrapping. A longer worm at the start, perhaps depending on the best score. Poison: a second, blue cell that makes the worm one cell shorter. And the best score shown as marks on the game-over screen. Each touches one or two functions. Keep a copy of the working Part 3 first.
