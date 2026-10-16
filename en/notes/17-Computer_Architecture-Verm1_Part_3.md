# Lecture 17: Verm1, Part 3: A Body, Rules and States

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: arrays in memory; finite-state machines; .text, .rodata, .data; latches and flip-flops; fixed point. USE NOW: the calling convention (Lecture 18) and, used without being studied in this course, the PRG32 tools, the PRG32-QT debugger. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 3: A Body, Rules and States

The third tutorial turns Verm1 into a genuine game. Until now the worm was a single cell and nothing could go wrong. Today memory enters the project: the worm acquires a body that follows the head and grows, biting itself ends the game, and the program gains a title screen and a game-over screen. Fred Brooks's sentence on the cover is the guiding principle of the session: choose the data structures well, and the code nearly writes itself. Two such structures are introduced, a ring and a map, and the tutorial is in large part a study of how their design shapes the code.

## Slide 2: What you will have by the end

Five outcomes. A worm with a body that follows the head and grows by one cell at every meal. A game that can be lost. Three screens, title, game and game over, linked by button A. Food that never appears on the worm. And a best score, retained as long as the cartridge remains in memory. This is the largest step of the project: the file roughly doubles in length, so the steps should be followed in order and the program run whenever a slide calls for it.

## Slide 3: What Part 3 takes from the lectures

The ideas of the block on state and memory, and where they appear today. The finite-state machine of Lecture 13 becomes the three states of the game. The edge, a change rather than a level, becomes "A pressed now and not one frame ago". The register that holds a value until the next clock becomes `prev_btn`. Memory as an array of bytes, from Lecture 15, becomes the body and the map of the world. And the distinction between what stays in the file and what lives in RAM, from Lecture 16, becomes `.rodata`, `.data` and the best score.

## Slide 4: Where you are going

The three screens to be built: the title with its invitation, the game with a worm of seven cells after four meals, and the game-over screen. They are one program in three states. The session begins from a working Part 2; a student whose file does not run copies the reference file of Part 2.

## Slide 5: The body is a ring of 256 entries

The body is stored in two arrays of 256 bytes, `body_x` and `body_y`, entry k holding the column and row of one segment. Nothing is ever shifted. Two numbers describe the worm: `head_i`, the index of the head, and `length`, the number of entries in use, so that the tail is entry `head_i - length + 1`. A step writes one new entry after the head and advances `head_i`; if the worm has eaten the tail stays, otherwise it advances too. After entry 255 comes entry 0, an AND with 255: the array is a *ring*, or circular buffer. Each step costs constant time, whatever the length of the worm.

## Slide 6: The world is a map of 960 bytes

To determine whether the new head touches the body, the program could compare it with every segment, up to 255 comparisons per step. It keeps instead a map of the world: one byte for each of the 960 cells, 1 if a segment occupies it and 0 otherwise. The cell in column c of row r is byte r × 40 + c. A step sets one byte and clears another, and the collision test becomes a single load. This is the classic trade of memory for time. Its price is an invariant that must be maintained: map and ring must always agree.

## Slide 7: The game is a machine with three states

The state diagram of the game, as in Lecture 13: TITLE passes to PLAY when A is pressed; PLAY passes to OVER when the worm bites itself; OVER returns to TITLE when A is pressed. The table adds the action associated with each transition. One detail determines whether the machine works: "A pressed" must mean down now and up one frame ago, an edge rather than a level. Otherwise holding A would traverse the states at one per frame, the defect anticipated in the warm-up of Lecture 13.

## Slide 8: Watch the ring turn

A breakpoint is placed on the first instruction of `step` and execution resumed: the program now halts once per step of the worm. The memory view is opened at the address of `body_x`: after the initial 03 04 05, a new byte appears at each step. Turning downwards, `body_x` repeats the same column while `body_y`, 256 bytes further on, counts the rows. After a meal, `head_i` and `length` are compared before and after: both have increased by one. The old bytes are never erased, so the ring records the history of the last 256 steps.

## Slide 9: Catch the edge of button A

The edge of button A, frame by frame. While A is up, everything is zero. In the frame in which A goes down, `s0` is 0x10 and `prev_btn` is still 0: the AND with the negation yields 0x10, and the transition occurs. In subsequent frames A remains down, but `prev_btn` is now 0x10 as well, and the result is zero. One edge, one transition, however long the button is held: the edge detector of Lecture 13, with a word of memory as the flip-flop and the frame as the clock.

## Slide 10: Three questions for the debugger

Three questions to be answered with the debugger. Where is `state`, and what does it contain during play and after losing? Is the map consistent with the ring, that is, does the byte at row × 40 + column of the head contain 1? What did the fatal step observe: at the `lbu` after the second `mul` in `step`, `t1` is 1 exactly once, at the bite. The last line states a principle that generalises well beyond this game: a program is correct when its memory is correct, and its invariants are what make memory checkable.

## Slide 11: Check your understanding: head_i = 1 and length = 4. Which entries of the ring hold the worm? / Which byte of grid describes the cell in column 7 of row 3?

For the first question the tail is computed first: `head_i - length + 1` is 1 - 4 + 1 = -2, which masked with 255 becomes 254. From there four entries are counted forwards, wrapping after 255.

For the second, the formula of the map applies: row × 40 + column. The two must not be interchanged; the option with 283 is 7 × 40 + 3.

## Slide 12: Check your understanding: The player holds A down for two seconds on the title screen. What happens? / Why is the tail's byte cleared before the head's byte is tested?

For the first question one reasons in terms of edges. A is down for many frames, but only in the first of them is it "down now and up one frame ago".

For the second: in one step the tail vacates a cell and the head enters one. If they are the same cell, the question is which of the two operations must come first for the move to be legal.

## Slide 13: Where we are, and what comes next

The current position. Verm1 is now a game, with an objective, a risk, a beginning and an end, and every line of it can be explained. It is sequential logic and memory expressed as a program: a machine with three states, a ring of bytes, a map. Three aspects remain rough: the whole screen is redrawn at every frame, the score is a row of marks, and the speed never changes. The next four lectures open the machine that executes the code, and Part 4 completes the game.
