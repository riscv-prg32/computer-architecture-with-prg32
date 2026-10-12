# Lecture 12: Verm1, Part 2: Steering, Food and a Score

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 2: Steering, Food and a Score

The second tutorial of the project. At the end of Part 1 the head crossed the screen by itself; today the player enters the game. You add steering with the joystick, food that appears at random, a score and a sound. Everything rests on the four lectures of the logic block: a button is one bit selected by a mask, the rule against the U-turn is a single XOR, the movement is read from a table as a multiplexer would select it. Sid Meier's sentence on the cover says what you are adding: choices.

## Slide 2: What you will have by the end

Five results: a head that you steer in four directions; a rule that forbids the U-turn, written with one XOR and one comparison; movement taken from two small tables instead of four branches; food that appears in a random cell, is eaten and appears again; and a score, drawn as small marks next to the title, with a sound at each bite. Notice that three of the five are ways of writing something well, not only of making it work.

## Slide 3: What Part 2 takes from the lectures

Each row links an idea of the logic lectures to a place in today's program. AND as a mask selects one button out of the word of buttons. A truth table becomes the code of the four directions. XOR, which is 1 where two bits differ, gives both the U-turn rule and the test for equality. The pull-up of Lecture 10 explains why a pressed button arrives as a 1. The comparator, the multiplexer and the ROM of Lecture 11 become the test "head on the food" and the tables `dx` and `dy`.

## Slide 4: Start from a Part 1 that runs

Start from a Part 1 that runs: open your file, build it and check that the head crosses the screen. If it does not, take the reference file of Part 1 instead. Today the file changes in three steps, and you run it after the second and after the third. Read the fourth line carefully, because it is the convention of all the tutorials from now on: a slide marked CHANGED replaces code that you already have; a slide marked NEW adds code.

## Slide 5: The working loop, again

The same two commands as in Part 1: build the cartridge, then upload it to PRG32-QT and run it. Keep PRG32-QT open for the whole session, with the debug mode enabled if you want the debugger at hand: step 4 uses it.

## Slide 6: Step 1: names for bits

Step 1 only prepares names: constants for the buttons and the directions, and the variables that the rest of the tutorial needs. Nothing new appears on the screen yet.

## Slide 7: CHANGED Constants: buttons and directions

Add these lines to the constants of Part 1. `RED` is the colour of the food. The four `BTN_` constants are masks: each has a single bit at 1, the bit of that button in the word returned by the runtime. The four `DIR_` constants are the codes of the directions, numbers from 0 to 3, that is two bits. The comments say what each of the two bits means, and the next slide explains why the codes were chosen in this way.

## Slide 8: A code chosen with care: the four directions

The codes of the directions were chosen with care. Bit 0 says whether the movement is vertical; bit 1 says whether it is "backwards", towards smaller coordinates. As a consequence a direction and its opposite differ in bit 1 and only there: RIGHT is 00 and LEFT is 10, DOWN is 01 and UP is 11. So the XOR of two opposite directions is always 10, that is 2. A good encoding turns a rule into a single gate. Note also the caption: on the screen y grows downwards, so DOWN is plus 1.

## Slide 9: CHANGED Data: two tables and five new variables

Replace the data of Part 1 with these. In `.rodata` there are two tables of four words, `dx` and `dy`: for each direction code, the change of column and the change of row. They never change, so they live with the constants. In `.data` there are five new variables: `dir`, the direction of the last step; `want`, the direction the player has asked for; and `score`, `food_x` and `food_y`, which are used in step 3.

## Slide 10: Step 2: steering

Step 2 is the heart of the tutorial: read the buttons, refuse the U-turn, and take the movement from the tables. At its end you are driving the head.

## Slide 11: From finger to bit

The path of a button, from Lecture 10. The pin of the chip is held at 3.3 V by a pull-up resistor; pressing the button joins it to ground, so the pin reads 0 when pressed. The runtime inverts the levels and packs all the buttons into one word, with 1 meaning pressed. The table gives the mask of each direction button. Two facts to use at once: UP and RIGHT pressed together give 0x04 OR 0x02, that is 0x06; and `a0` AND 0x04 is zero exactly when UP is not pressed.

## Slide 12: CHANGED update: from buttons to a wish

This replaces the beginning of `verm1_update`. After the call to `prg32_input_read`, `t1` receives the current direction and `t2` the current wish. Then four identical blocks: `andi` isolates one button; if the result is zero the next instruction is skipped; otherwise the wish in `t2` is overwritten with that direction. Finally the rule: the XOR of wish and direction is compared with 2; if they are equal the request is a U-turn and the `sw` is skipped, so the old wish survives. `update` now makes a call, so it has a stack frame.

## Slide 13: The U-turn rule, as a truth table

The rule as a truth table: six of its sixteen rows. With the head going right, asking for RIGHT gives 00 and the head goes on; asking for DOWN or UP gives 01 or 11, and it turns; asking for LEFT gives 10, which is 2, and the request is refused. The same happens for DOWN and UP. Complete the table yourself and count the refusals: there are four, one for each direction. With codes chosen at random the same rule would need four separate comparisons.

## Slide 14: CHANGED update: the timer calls step

The rest of `verm1_update` is the fixed-point timer of Part 1, unchanged: add the speed, and when a whole cell has accumulated subtract 256. The only difference is what happens then: instead of moving `head_x` directly, the code calls a new function, `step`. The local labels here are 6 and 7 because the numbers from 1 to 5 are already used in the first half of the function.

## Slide 15: NEW step: look the movement up

The first half of `step`. The wish becomes the direction: this happens once per step, not once per frame, so two quick presses cannot fold the worm back on itself. Then the lookup: the code of the direction is shifted left by 2, because each entry of a table is a word of four bytes, and added to the address of `dx`; the word loaded is the change of column, minus 1, 0 or plus 1. The same offset serves for `dy`. There is no branch: the code selects the value, as a multiplexer would.

## Slide 16: NEW step: move and wrap, both ways

The second half moves the head and handles the edges, in both directions. The column plus `dx` can now become minus 1: `bgez` tests the sign, and a negative column is replaced by the last column. If instead it has reached `COLS`, it becomes 0. The same is done for the row with `ROWS`. Note the last callout: `t4` and `t6` still hold the new column and row, and the next piece of code will use them.

## Slide 17: For now: close the function

Three temporary lines that restore `ra`, release the frame and return, so that `step` is complete and the program can run now. This is a habit of the tutorials: when a function will be finished later, close it provisionally and test what you have. In step 3 you will insert the test for the food before these lines.

## Slide 18: Run it: you are driving

Run it: you are driving. The head starts to the right as before. Hold DOWN and it turns at its next step. While it goes right, hold LEFT: nothing happens, because the U-turn is refused. To go left you need two turns, DOWN and then LEFT. The green box gives a precise check: holding DOWN from the start for 64 frames brings the head to column 5 of row 22, ten steps down.

## Slide 19: Step 3: food, a score, a sound

Step 3 gives the player a purpose: food to reach, a score that counts, a sound as a reward. In terms of circuits it uses a random source, a comparator and a loop.

## Slide 20: CHANGED init: a complete start

`verm1_init` is replaced by a complete version: every variable receives its starting value, including the direction, the wish and the score, and the first food is placed by calling `place_food`. Because it now makes a call, `init` too has a stack frame that saves `ra`.

## Slide 21: NEW place_food: a random cell

`place_food` asks the runtime for two random numbers. The contract of `prg32_random_number` is: minimum in `a0`, maximum in `a1`, both included, result in `a0`. The first call gives a column from 0 to 39, the second a row from 0 to 23, and each is stored in its variable. One defect is left on purpose: the food may fall exactly on the head. Part 3, when the worm has a body, will correct it.

## Slide 22: CHANGED step: is the head on the food?

This replaces the temporary ending of `step`. It is a comparator built from instructions: `xor` of the food's column and the head's column is 0 when they are equal; the same for the rows; `or` of the two results is 0 only if both are equal. If the result is not zero, the function ends. Otherwise the worm has eaten: the score is increased by one, new food is placed, and a sound is played. It is the AND of XNORs of Lecture 11, written with two `xor` and one `or`.

## Slide 23: NEW eat_sound: one note

`eat_sound` plays one note. `prg32_audio_note` takes five arguments, in `a0` to `a4`: channel, instrument, note, volume and duration in milliseconds. Note 72 is the C of the fifth octave in MIDI numbering. The last callout repeats a principle of PRG32: sound comes last. The game worked without it, and it is added when everything else is solid.

## Slide 24: CHANGED draw: the score as marks

The beginning of the new `verm1_draw`: after the title, a loop draws one small rectangle for each point of the score, 4 pixels apart. The counter of the loop is in `s0`, not in a `t` register, because it must survive the calls to `prg32_gfx_rect`: a function may destroy the temporaries, but preserves the `s` registers. In exchange your own function must save `s0` in its frame and restore it at the end. This convention is studied in Lecture 18.

## Slide 25: CHANGED draw: food and head

The rest of `verm1_draw`: the same three lines twice, first for the food and then for the head: load the column, load the row, load the colour, and call `draw_cell`. The order matters: the head is drawn last, so that it covers the food if they are in the same cell. Then `s0` and `ra` are restored and the function returns.

## Slide 26: NEW draw_cell: from cells to pixels

`draw_cell` gathers in one function the arithmetic that Part 1 had inside `draw`: column times 8, row times 8 plus `TOP`. Its contract is written in the comment on its first line: column in `a0`, row in `a1`, colour in `a2`. One subtlety: `prg32_gfx_rect` wants the colour in `a4`, and `a2` is about to be overwritten with the width, so the colour must be moved first. Writing the contract of a function in a comment is part of the job.

## Slide 27: Run it: Verm1, Part 2

Run it. You should see a red cell somewhere. Steer the head onto it: a note sounds, a mark appears next to the title, and the food moves to another cell. The screenshot shows the game after two bites, with two marks. It was produced by the automatic test, in which a scripted player steers the head to the food twice.

## Slide 28: Step 4: watch a decision

In step 4 you use PRG32-QT as a logic probe: you stop the program at the exact instruction that decides the U-turn, and read the decision in the registers.

## Slide 29: Catch the U-turn rule at work

Run the cartridge in debug mode and show `verm1_update`. First look at the telemetry while you hold a button: the input mask shows 0x04 for UP and 0x01 for LEFT. Then set a breakpoint on the instruction `xor t3, t2, t1`. Hold LEFT while the head goes right and resume: the program stops on the XOR. Read the registers: `t1` is 0, the direction, and `t2` is 2, the wish. Step once: `t3` becomes 2. Two more steps, and you see the branch taken and the `sw` skipped.

## Slide 30: What you read in the registers

What you should read, with the head going right. With nothing pressed, the wish is the old one and the XOR is 0. With DOWN it is 1 and with UP it is 3: both are stored. With LEFT it is 2, the U-turn, and nothing is stored. The last row shows the priority among the tests: with UP and RIGHT together UP wins, because it is tested last. Read `a0` at the first instruction after the call: later in the frame it is overwritten.

## Slide 31: Read the variables in memory

The variables can be read in memory as well. After `la t0, dir` the register `t0` holds the address of `dir`: type it in the *Memory* field. The variables follow each other in the order of the file, four bytes each: `dir`, `want`, `step_q8`, `score`, `food_x`, `food_y`. Eat once, pause and read the score: 01 00 00 00, least significant byte first. Then read the position of the food and check it against the red cell on the screen.

## Slide 32: Check your understanding: The player holds DOWN and RIGHT together: prg32_input_read returns

One bit per button: DOWN is 0x08 and RIGHT is 0x02. Pressed together, the two bits are both 1: the OR of the two masks.

## Slide 33: Check your understanding: The worm goes UP (3). Which wish is refused?

Apply the rule: the refused wish is the one whose XOR with the direction is 2. The direction is 3, that is 11 in binary; which code differs from it in bit 1 only?

## Slide 34: Check your understanding: Why slli t1, t1, 2 before adding to the address of dx?

The tables are made of words, and a word is four bytes. Entry number k is at k times 4 bytes from the beginning of the table, and a shift left by 2 multiplies by 4.

## Slide 35: Check your understanding: xor t1, t1, t4 gives zero exactly when

XOR gives 1 in each position where the two bits differ. A result of all zeros means that no position differs.

## Slide 36: Make it yours

Four changes of your own. Make button A a brake that stops the timer while it is held. Give two points for food eaten in the top row. Draw the head in a different colour for each direction, with a third table indexed like `dx`. And change the encoding of the directions: with RIGHT 0, LEFT 1, DOWN 2 and UP 3, what does the U-turn rule become? Keep a copy of the working Part 2 before experimenting.

## Slide 37: Where we are, and what comes next

Where you are. The player is in the game: a wish, a rule, a movement, a reward. The logic of four lectures has become instructions: bits and masks, XOR as a comparator, a table as a selector. But the worm has no body, nothing can go wrong, and the game never ends. The next block, on state and memory, gives the tools, and Part 3 adds a body that grows, collisions, a title screen and a game over.
