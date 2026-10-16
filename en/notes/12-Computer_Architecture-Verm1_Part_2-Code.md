# Lecture 12: Verm1, Part 2: Steering, Food and a Score: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; codes; arrays in memory; pull-up inputs; Boolean algebra; fixed point; multiplexers; signed or unsigned instructions; comparators and parity; arguments in a0 to a7. USE NOW: the calling convention (Lecture 18) and, used without being studied in this course, the PRG32 tools, the PRG32 runtime calls, the PRG32-QT debugger. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 2: Steering, Food and a Score: the code

This is the code deck of Lecture 12. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The reference program is ~/arc12/verm1/verm1_part2.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: The working loop, again

The same two commands as in Part 1: build the cartridge, then upload it to PRG32-QT and run it. Keep PRG32-QT open for the whole session, with the debug mode enabled if you want the debugger at hand: step 4 uses it.

## Slide 4: CHANGED Constants: buttons and directions

Add these lines to the constants of Part 1. `RED` is the colour of the food. The four `BTN_` constants are masks: each has a single bit at 1, the bit of that button in the word returned by the runtime. The four `DIR_` constants are the codes of the directions, numbers from 0 to 3, that is two bits. The comments say what each of the two bits means, and the lecture deck, in the slide "A code chosen with care", explains why the codes were chosen in this way.

## Slide 5: CHANGED Data: two tables and five new variables

Replace the data of Part 1 with these. In `.rodata` there are two tables of four words, `dx` and `dy`: for each direction code, the change of column and the change of row. They never change, so they live with the constants. In `.data` there are five new variables: `dir`, the direction of the last step; `want`, the direction the player has asked for; and `score`, `food_x` and `food_y`, which are used in step 3.

## Slide 6: CHANGED update: from buttons to a wish

This replaces the beginning of `verm1_update`. After the call to `prg32_input_read`, `t1` receives the current direction and `t2` the current wish. Then four identical blocks: `andi` isolates one button; if the result is zero the next instruction is skipped; otherwise the wish in `t2` is overwritten with that direction. Finally the rule: the XOR of wish and direction is compared with 2; if they are equal the request is a U-turn and the `sw` is skipped, so the old wish survives. `update` now makes a call, so it has a stack frame.

## Slide 7: CHANGED update: the timer calls step

The rest of `verm1_update` is the fixed-point timer of Part 1, unchanged: add the speed, and when a whole cell has accumulated subtract 256. The only difference is what happens then: instead of moving `head_x` directly, the code calls a new function, `step`. The local labels here are 6 and 7 because the numbers from 1 to 5 are already used in the first half of the function.

## Slide 8: NEW step: look the movement up

The first half of `step`. The wish becomes the direction: this happens once per step, not once per frame, so two quick presses cannot fold the worm back on itself. Then the lookup: the code of the direction is shifted left by 2, because each entry of a table is a word of four bytes, and added to the address of `dx`; the word loaded is the change of column, minus 1, 0 or plus 1. The same offset serves for `dy`. There is no branch: the code selects the value, as a multiplexer would.

## Slide 9: NEW step: move and wrap, both ways

The second half moves the head and handles the edges, in both directions. The column plus `dx` can now become minus 1: `bgez` tests the sign, and a negative column is replaced by the last column. If instead it has reached `COLS`, it becomes 0. The same is done for the row with `ROWS`. Note the last callout: `t4` and `t6` still hold the new column and row, and the next piece of code will use them.

## Slide 10: For now: close the function

Three temporary lines that restore `ra`, release the frame and return, so that `step` is complete and the program can run now. This is a habit of the tutorials: when a function will be finished later, close it provisionally and test what you have. In step 3 you will insert the test for the food before these lines.

## Slide 11: Run it: you are driving

Run it: you are driving. The head starts to the right as before. Hold DOWN and it turns at its next step. While it goes right, hold LEFT: nothing happens, because the U-turn is refused. To go left you need two turns, DOWN and then LEFT. The green box gives a precise check: holding DOWN from the start for 64 frames brings the head to column 5 of row 22, ten steps down.

## Slide 12: CHANGED init: a complete start

`verm1_init` is replaced by a complete version: every variable receives its starting value, including the direction, the wish and the score, and the first food is placed by calling `place_food`. Because it now makes a call, `init` too has a stack frame that saves `ra`.

## Slide 13: NEW place_food: a random cell

`place_food` asks the runtime for two random numbers. The contract of `prg32_random_number` is: minimum in `a0`, maximum in `a1`, both included, result in `a0`. The first call gives a column from 0 to 39, the second a row from 0 to 23, and each is stored in its variable. One defect is left on purpose: the food may fall exactly on the head. Part 3, when the worm has a body, will correct it.

## Slide 14: CHANGED step: is the head on the food?

This replaces the temporary ending of `step`. It is a comparator built from instructions: `xor` of the food's column and the head's column is 0 when they are equal; the same for the rows; `or` of the two results is 0 only if both are equal. If the result is not zero, the function ends. Otherwise the worm has eaten: the score is increased by one, new food is placed, and a sound is played. It is the AND of XNORs of Lecture 11, written with two `xor` and one `or`.

## Slide 15: NEW eat_sound: one note

`eat_sound` plays one note. `prg32_audio_note` takes five arguments, in `a0` to `a4`: channel, instrument, note, volume and duration in milliseconds. Note 72 is the C of the fifth octave in MIDI numbering. The last callout repeats a principle of PRG32: sound comes last. The game worked without it, and it is added when everything else is solid.

## Slide 16: CHANGED draw: the score as marks

The beginning of the new `verm1_draw`: after the title, a loop draws one small rectangle for each point of the score, 4 pixels apart. The counter of the loop is in `s0`, not in a `t` register, because it must survive the calls to `prg32_gfx_rect`: a function may destroy the temporaries, but preserves the `s` registers. In exchange your own function must save `s0` in its frame and restore it at the end. This convention is studied in Lecture 18.

## Slide 17: CHANGED draw: food and head

The rest of `verm1_draw`: the same three lines twice, first for the food and then for the head: load the column, load the row, load the colour, and call `draw_cell`. The order matters: the head is drawn last, so that it covers the food if they are in the same cell. Then `s0` and `ra` are restored and the function returns.

## Slide 18: NEW draw_cell: from cells to pixels

`draw_cell` gathers in one function the arithmetic that Part 1 had inside `draw`: column times 8, row times 8 plus `TOP`. Its contract is written in the comment on its first line: column in `a0`, row in `a1`, colour in `a2`. One subtlety: `prg32_gfx_rect` wants the colour in `a4`, and `a2` is about to be overwritten with the width, so the colour must be moved first. Writing the contract of a function in a comment is part of the job.

## Slide 19: Run it: Verm1, Part 2

Run it. You should see a red cell somewhere. Steer the head onto it: a note sounds, a mark appears next to the title, and the food moves to another cell. The screenshot shows the game after two bites, with two marks. It was produced by the automatic test, in which a scripted player steers the head to the food twice.

## Slide 20: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 21: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 22: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 23: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 24: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 25: Make it yours

Four changes of your own. Make button A a brake that stops the timer while it is held. Give two points for food eaten in the top row. Draw the head in a different colour for each direction, with a third table indexed like `dx`. And change the encoding of the directions: with RIGHT 0, LEFT 1, DOWN 2 and UP 3, what does the U-turn rule become? Keep a copy of the working Part 2 before experimenting.
