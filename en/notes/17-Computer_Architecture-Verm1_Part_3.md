# Lecture 17: Verm1, Part 3: A Body, Rules and States

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 3: A Body, Rules and States

The third tutorial turns Verm1 into a real game. Until now the worm was a single cell and nothing could go wrong. Today memory enters the project: the worm gets a body that follows the head and grows, biting itself ends the game, and the program acquires a title screen and a game-over screen. Brooks's sentence on the cover is the motto of the day: choose the data structures well, and the code almost writes itself. You will meet two of them, a ring and a map.

## Slide 2: What you will have by the end

Five results. A worm with a body that follows the head and grows by one cell at every meal. A game that can be lost. Three screens, title, game and game over, linked by button A. Food that never appears on the worm. And a best score, kept as long as the cartridge stays in memory. It is the largest step of the project: the file roughly doubles in length, so follow the steps and run the program every time a slide says so.

## Slide 3: What Part 3 takes from the lectures

The ideas of the block on state and memory, and where they appear today. The finite-state machine of Lecture 13 becomes the three states of the game. The edge, a change and not a level, becomes "A pressed now and not one frame ago". The register that keeps a value for the next clock becomes `prev_btn`. Memory as an array of bytes becomes the body and the map of the world. And the difference between what stays in the file and what lives in RAM becomes `.rodata`, `.data` and the best score.

## Slide 4: Where you are going

The three screens you are going to build: the title with its invitation, the game with a worm of seven cells after four meals, and the game over. They are one program in three states. Start from a Part 2 that runs; if yours does not, copy the reference file of Part 2.

## Slide 5: The body is a ring of 256 entries

The body is stored in two arrays of 256 bytes, `body_x` and `body_y`: entry k holds the column and the row of one segment. Nothing is ever shifted. Two numbers describe the worm: `head_i`, the entry of the head, and `length`, the number of entries in use; the tail is entry `head_i - length + 1`. A step writes one new entry after the head and advances `head_i`. If the worm has eaten the tail stays; otherwise it advances too. After entry 255 comes entry 0, which is an AND with 255: the array is a *ring*.

## Slide 6: The world is a map of 960 bytes

To know whether the new head touches the body, the program could compare it with every segment: up to 255 comparisons at each step. Instead it keeps a map of the world: one byte for each of the 960 cells, 1 if a segment is there and 0 if not. The cell in column c of row r is byte number r times 40 plus c. A step sets one byte and clears one, and the collision test becomes a single load. It is the classic exchange of memory for time. The price: map and ring must always agree.

## Slide 7: The game is a machine with three states

The state diagram of the game, as in Lecture 13: TITLE goes to PLAY when A is pressed; PLAY goes to OVER when the worm bites itself; OVER goes back to TITLE when A is pressed. The table adds the action of each transition. One detail decides whether the machine works: "A pressed" means down now and up one frame ago, an edge and not a level. Otherwise holding A would run through the states one per frame.

## Slide 8: Watch the ring turn

Put a breakpoint on the first instruction of `step` and resume: the program now stops once per step of the worm. Open the memory at the address of `body_x`: after the initial 03 04 05 a new byte appears at each step. Turn downwards: `body_x` repeats the same column, while `body_y`, 256 bytes further on, counts the rows. Eat, and compare `head_i` and `length` before and after: both have grown by one. The old bytes are never erased: the ring holds the history of the last 256 steps.

## Slide 9: Catch the edge of button A

The edge of button A, frame by frame. While A is up everything is zero. In the frame in which A goes down, `s0` is 0x10 and `prev_btn` is still 0: the AND with the negation gives 0x10, and the transition happens. In the following frames A is still down, but `prev_btn` is now 0x10 too, and the result is zero. One edge, one transition, however long the button is held.

## Slide 10: Three questions for the debugger

Three questions to answer with the debugger. Where is `state`, and what does it contain while you play and lose? Is the map consistent with the ring: does the byte at row times 40 plus column of the head contain 1? What did the fatal step see: at the `lbu` after the second `mul` in `step`, `t1` is 1 exactly once, at the bite. The last line is a principle: a program is right when its memory is right.

## Slide 11: Check your understanding: head_i = 1 and length = 4. Which entries of the ring hold the worm? / Which byte of grid describes the cell in column 7 of row 3?

Compute the tail first: `head_i - length + 1` is 1 minus 4 plus 1, minus 2. Masked with 255 it becomes 254. From there count four entries forward, wrapping after 255.

The formula of the map: row times 40 plus column. Do not swap the two: the option with 283 is 7 times 40 plus 3.

## Slide 12: Check your understanding: The player holds A down for two seconds on the title screen. What happens? / Why is the tail's byte cleared before the head's byte is tested?

Think in terms of edges. A is down for many frames, but only in the first of them is it "down now and up one frame ago".

In one step the tail leaves a cell and the head enters one. If they are the same cell, which of the two operations must be done first for the move to be legal?

## Slide 13: Where we are, and what comes next

Where you are. Verm1 is now a game, with a goal, a risk, a beginning and an end, and you can explain every line of it. It is sequential logic and memory written as a program: a machine with three states, a ring of bytes, a map. Three things are still rough: the whole screen is redrawn at every frame, the score is a row of marks, the speed never changes. The next four lectures open the machine that runs your code, and Part 4 finishes the game.
