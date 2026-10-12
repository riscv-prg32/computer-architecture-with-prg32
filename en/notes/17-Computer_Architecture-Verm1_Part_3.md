# Lecture 17: Verm1, Part 3: A Body, Rules and States

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 3: A Body, Rules and States

The third tutorial turns Verm1 into a real game. Until now the worm was a single cell and nothing could go wrong. Today memory enters the project: the worm gets a body that follows the head and grows, biting itself ends the game, and the program acquires a title screen and a game-over screen. Brooks's sentence on the cover is the motto of the day: choose the data structures well, and the code almost writes itself. You will meet two of them, a ring and a map.

## Slide 2: What you will have by the end

Five results. A worm with a body that follows the head and grows by one cell at every meal. A game that can be lost. Three screens, title, game and game over, linked by button A. Food that never appears on the worm. And a best score, kept as long as the cartridge stays in memory. It is the largest step of the project: the file roughly doubles in length, so follow the steps and run the program every time a slide says so.

## Slide 3: What Part 3 takes from the lectures

The ideas of the block on state and memory, and where they appear today. The finite-state machine of Lecture 13 becomes the three states of the game. The edge, a change and not a level, becomes "A pressed now and not one frame ago". The register that keeps a value for the next clock becomes `prev_btn`. Memory as an array of bytes becomes the body and the map of the world. And the difference between what stays in the file and what lives in RAM becomes `.rodata`, `.data` and the best score.

## Slide 4: Where you are going

The three screens you are going to build: the title with its invitation, the game with a worm of seven cells after four meals, and the game over. They are one program in three states. Start from a Part 2 that runs; if yours does not, copy the reference file of Part 2.

## Slide 5: The working loop, again

The usual two commands. Today the file changes a great deal, so do not wait until the end to build: build and run after every slide entitled "Run it". If something breaks, the mistake is in the lines added since the last run.

## Slide 6: The design, before the code

Before any code, the design: two data structures and one diagram. Spend time here. If the ring, the map and the three states are clear, the listings that follow are a transcription.

## Slide 7: The body is a ring of 256 entries

The body is stored in two arrays of 256 bytes, `body_x` and `body_y`: entry k holds the column and the row of one segment. Nothing is ever shifted. Two numbers describe the worm: `head_i`, the entry of the head, and `length`, the number of entries in use; the tail is entry `head_i - length + 1`. A step writes one new entry after the head and advances `head_i`. If the worm has eaten the tail stays; otherwise it advances too. After entry 255 comes entry 0, which is an AND with 255: the array is a *ring*.

## Slide 8: The world is a map of 960 bytes

To know whether the new head touches the body, the program could compare it with every segment: up to 255 comparisons at each step. Instead it keeps a map of the world: one byte for each of the 960 cells, 1 if a segment is there and 0 if not. The cell in column c of row r is byte number r times 40 plus c. A step sets one byte and clears one, and the collision test becomes a single load. It is the classic exchange of memory for time. The price: map and ring must always agree.

## Slide 9: The game is a machine with three states

The state diagram of the game, as in Lecture 13: TITLE goes to PLAY when A is pressed; PLAY goes to OVER when the worm bites itself; OVER goes back to TITLE when A is pressed. The table adds the action of each transition. One detail decides whether the machine works: "A pressed" means down now and up one frame ago, an edge and not a level. Otherwise holding A would run through the states one per frame.

## Slide 10: Step 1: the memory of the game

Step 1 declares the memory of the game: new constants, what stays in the cartridge file, and what lives in RAM. Nothing runs differently yet.

## Slide 11: CHANGED Constants: a button, a colour, three states

The new constants replace those of Part 2. `BODY` is a darker green for the segments behind the head. `BTN_A` is the mask of button A, bit 4 of the word of buttons. The three states are simply the numbers 0, 1 and 2, with names. The lines `.section` and `.global`, which used to close this block, move to the next slide.

## Slide 12: CHANGED .rodata: what stays in the file

The read-only section: three strings, for the title, the invitation and the game over, and the two tables `dx` and `dy` of Part 2. The program never writes here. On the board this section could remain in flash; it is the part of the cartridge that would survive a power-off.

## Slide 13: CHANGED .data: what lives in RAM

The section of variables. `head_x` and `head_y` have disappeared: the head now lives in the ring. The directive `.space` reserves a number of bytes without naming each one: 256 for `body_x`, 256 for `body_y`, 960 for the map. `best` holds the best score: it survives from one game to the next, but not a power-off, because it lives in RAM. A portable cartridge has no permanent memory of its own: an honest limit.

## Slide 14: Step 2: three states

Step 2 builds the machine with three states first, with the functions that do the real work replaced by empty ones. The skeleton runs before anything is inside it.

## Slide 15: CHANGED init: start on the title

`verm1_init` now does one thing only: it chooses the first state, TITLE. Preparing the game is the job of a new function, `new_game`, called when the player presses A. Delete from your file the old `verm1_update`, `step` and `verm1_draw`: the next slides replace them. Keep `place_food`, `eat_sound` and `draw_cell`.

## Slide 16: CHANGED update: buttons, and their edges

The first half of the new `verm1_update` reads the buttons and computes their edges. `s0` holds the buttons of this frame; `prev_btn`, in memory, holds those of the previous frame. The expression "now AND NOT before" gives a 1 only in the positions where a press has just begun, and the result goes into `s1`. Then `prev_btn` is updated. It is the edge detector of Lecture 13: a register that delays by one clock, and an AND gate with one input inverted.

## Slide 17: CHANGED update: one branch per state

The second half is the transition table, line by line. The state is read first, and it decides who looks at the inputs. In TITLE a new press of A calls `new_game`. In OVER a new press of A stores TITLE. In PLAY the buttons that are held, the levels and not the edges, are passed to `play_update`, because steering must work while a button is kept down. The labels have names here, `u_play`, `u_start`, `u_done`, because numbers would be hard to follow.

## Slide 18: CHANGED draw: what to show in each state

`verm1_draw` shows a different picture in each state. The title line is always drawn. In TITLE only the invitation PRESS A appears, centred: 132 is the x that centres seven characters of 8 pixels. In PLAY and OVER the function draws the score, the worm and the food. Note that `draw` changes nothing: its output depends only on the state and on the memory, as in a Moore machine.

## Slide 19: CHANGED draw: game over, and draw_text

The end of `verm1_draw`: in the state OVER two words are written over the scene. A small helper, `draw_text`, fills in the two colour arguments, white on black, and passes the first three through, so that each call to draw text needs two lines less. Small helpers like this make a program shorter and easier to change.

## Slide 20: For now: four functions that do nothing

Four *stubs*: functions that exist only by name and return at once, except `new_game`, which just stores PLAY. Thanks to them the program builds and the machine can be tried before its parts are written. It is the method of the first lecture: start with returns that do nothing, then add one thing at a time.

## Slide 21: Run it: a machine with nothing inside

Run it. You see the title line and PRESS A. Press A: the invitation disappears and a red cell appears in the top-left corner, because the variables of the food are still zero. Nothing moves and the game cannot end: PLAY has no rules yet. In the debugger, find the variable `state` and watch it go from 0 to 1 when you press A: the machine works, and it is empty.

## Slide 22: Step 3: a worm in memory

Step 3 puts a worm into memory, in both structures, and draws it. It still does not move.

## Slide 23: NEW new_game: empty the map, lay the worm

The first half of the real `new_game`. A loop sets the 960 bytes of the map to zero, one `sb` at a time. Then the worm is laid down: three segments in columns 3, 4 and 5 of row 12. Each segment is written twice: its column and row in the ring, and a 1 in the map. The expression `grid+12*COLS` is computed by the assembler. Since each entry is one byte, the index is added to the base address without any shift.

## Slide 24: NEW new_game: the variables, the food, PLAY

The second half sets the variables: `head_i` is 2 and `length` is 3, which together describe the worm just laid; direction, timer and score start from zero; the first food is placed. The last instruction stores PLAY in the state. The order is deliberate: the transition is complete only when everything is ready.

## Slide 25: NEW draw_worm: walk the ring backwards

`draw_worm` walks the ring backwards from the head: segment number i is entry `head_i - i`, masked with 255. Column and row are loaded with `lbu`, which reads one byte as an unsigned number, and passed to `draw_cell`. Segment 0, the head, is drawn in a brighter green than the others. The loop ends when i reaches the length.

## Slide 26: NEW draw_score: the marks of Part 2

`draw_score` is the loop that in Part 2 was inside `verm1_draw`, now a function of its own: one small mark for each point. It uses `s0` as its counter, so it saves it at the beginning and restores it at the end.

## Slide 27: One stub is left

Of the four stubs only one is left: `play_update`, which still does nothing. The worm exists in memory and on the screen, and stands still.

## Slide 28: Run it: a worm that stands still

Run it and press A: a worm of three cells in row 12, with the brighter head on the right, and the food in a random cell. Now look at memory with the debugger. At the address of `body_x` the first bytes are 03 04 05. In the map, at row 12 times 40 plus 3, there are three bytes at 01 in a sea of zeros. You are looking at the two structures of slide 7 and slide 8, filled.

## Slide 29: Step 4: rules

Step 4 writes the rules. One step of the worm has three phases, and their order is the whole point: decide where the head will go, look at what is there, and only then write.

## Slide 30: CHANGED play_update: your update of Part 2

`play_update` is your `verm1_update` of Part 2 under a new name: the four button tests and the U-turn rule. One difference: the buttons arrive as an argument in `a0`, so there is no call to read them.

## Slide 31: CHANGED play_update: the timer

The end of `play_update` is exactly the timer of Part 2: add the speed, and when a whole cell has accumulated call `step`.

## Slide 32: CHANGED step: three registers to keep

The beginning of `step`. Three registers must keep their values across the calls that follow: `s0` and `s1` for the cell of the new head, `s2` for the result of the food test. So the frame saves `ra` and three `s` registers. The lookup of `dx` and `dy` is that of Part 2.

## Slide 33: CHANGED step: where will the head be?

Where will the head be? The present head is entry `head_i` of the ring: its column and row are loaded with `lbu`, `dx` and `dy` are added, and the result wraps at the edges as in Part 2. The new cell is now in `s0` and `s1`. Nothing has been written: first the program must look.

## Slide 34: CHANGED step: eat, or move the tail

Eat, or move the tail. The comparator of Part 2 leaves its result in `s2`: zero if the new head is on the food. If the worm eats, the length grows by one and the tail stays where it is. If not, the tail must leave: its entry is `head_i - length + 1`, and its column and row are loaded. Growing and not moving the tail are the same thing: that is the whole trick of Snake.

## Slide 35: NEW step: free the tail, test the head

Now the map. The number of a byte is row times 40 plus column, computed with `mul` and `add`. First the byte of the tail is cleared; then the byte of the new head is tested. The order matters: in the same step the tail moves away, so the head may enter the cell that the tail has just left. If the byte is 1 the worm has bitten itself: the state becomes OVER and the best score is updated.

## Slide 36: NEW step: write the new head

If the cell is free, the new head is written: a 1 in the map, `head_i` plus 1 masked with 255, and column and row in the new entry of the ring. Then, if `s2` is zero, the reward: a point, new food, a sound. After a collision the function skips all of this, so the screen shows the worm as it was before the fatal step.

## Slide 37: CHANGED place_food: not on the worm

`place_food` is corrected: it draws a random cell, looks at its byte in the map, and if the cell is occupied draws again, until a free one comes out. The column waits in `s0` while the second random number is requested. The loop is short: even with the longest worm fewer than two attempts are needed on average.

## Slide 38: Run it: Verm1, Part 3

Run it: this is Verm1, Part 3. The worm follows the head and grows at every meal; turning into the body ends the game; A returns to the title, and A again starts a new game. The two screenshots come from the automatic test: seven cells and four marks after four meals, and the game-over screen.

## Slide 39: Step 5: look at memory move

Step 5 uses the debugger to watch the data structures at work: the ring that turns, the edge of a button, the byte that decides a collision.

## Slide 40: Watch the ring turn

Put a breakpoint on the first instruction of `step` and resume: the program now stops once per step of the worm. Open the memory at the address of `body_x`: after the initial 03 04 05 a new byte appears at each step. Turn downwards: `body_x` repeats the same column, while `body_y`, 256 bytes further on, counts the rows. Eat, and compare `head_i` and `length` before and after: both have grown by one. The old bytes are never erased: the ring holds the history of the last 256 steps.

## Slide 41: Catch the edge of button A

The edge of button A, frame by frame. While A is up everything is zero. In the frame in which A goes down, `s0` is 0x10 and `prev_btn` is still 0: the AND with the negation gives 0x10, and the transition happens. In the following frames A is still down, but `prev_btn` is now 0x10 too, and the result is zero. One edge, one transition, however long the button is held.

## Slide 42: Three questions for the debugger

Three questions to answer with the debugger. Where is `state`, and what does it contain while you play and lose? Is the map consistent with the ring: does the byte at row times 40 plus column of the head contain 1? What did the fatal step see: at the `lbu` after the second `mul` in `step`, `t1` is 1 exactly once, at the bite. The last line is a principle: a program is right when its memory is right.

## Slide 43: Check your understanding: head_i = 1 and length = 4. Which entries of the ring hold the worm?

Compute the tail first: `head_i - length + 1` is 1 minus 4 plus 1, minus 2. Masked with 255 it becomes 254. From there count four entries forward, wrapping after 255.

## Slide 44: Check your understanding: Which byte of grid describes the cell in column 7 of row 3?

The formula of the map: row times 40 plus column. Do not swap the two: the option with 283 is 7 times 40 plus 3.

## Slide 45: Check your understanding: The player holds A down for two seconds on the title screen. What happens?

Think in terms of edges. A is down for many frames, but only in the first of them is it "down now and up one frame ago".

## Slide 46: Check your understanding: Why is the tail's byte cleared before the head's byte is tested?

In one step the tail leaves a cell and the head enters one. If they are the same cell, which of the two operations must be done first for the move to be legal?

## Slide 47: Make it yours

Four changes of your own. Walls: the worm dies at the edge instead of wrapping. A longer worm at the start, perhaps depending on the best score. Poison: a second, blue cell that makes the worm one cell shorter. And the best score shown as marks on the game-over screen. Each touches one or two functions. Keep a copy of the working Part 3 first.

## Slide 48: Appendix: two functions that did not change

Two functions did not change with respect to Part 2: `eat_sound` and `draw_cell`. They are reprinted on the next two slides, marked UNCHANGED, so that this deck contains the whole program. The complete file is the sum of the slides marked NEW and CHANGED, plus these two.

## Slide 49: UNCHANGED eat_sound

`eat_sound`, as in Part 2: five arguments and a call to `prg32_audio_note`, for one note of 60 milliseconds.

## Slide 50: UNCHANGED draw_cell

`draw_cell`, as in Part 2: column, row and colour come in, the cell coordinates are converted to pixels, and one rectangle is drawn.

## Slide 51: Where we are, and what comes next

Where you are. Verm1 is now a game, with a goal, a risk, a beginning and an end, and you can explain every line of it. It is sequential logic and memory written as a program: a machine with three states, a ring of bytes, a map. Three things are still rough: the whole screen is redrawn at every frame, the score is a row of marks, the speed never changes. The next four lectures open the machine that runs your code, and Part 4 finishes the game.
