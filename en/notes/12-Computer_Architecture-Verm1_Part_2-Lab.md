# Lecture 12: Verm1, Part 2: Steering, Food and a Score: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; codes; arrays in memory; pull-up inputs; Boolean algebra; fixed point; multiplexers; signed or unsigned instructions; comparators and parity; arguments in a0 to a7. USE NOW: the calling convention (Lecture 18) and, used without being studied in this course, the PRG32 tools, the PRG32 runtime calls, the PRG32-QT debugger. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) read the buttons with masks and refuse a U-turn with one XOR; (2) compare positions with XOR and OR to detect food; (3) keep and show a score. Builds on: bit masks (Lecture 08); codes (Lecture 11); arrays in memory (Lecture 04); pull-up inputs (Lecture 10); Boolean algebra (Lecture 08). Next: Lecture 13, Sequential Machines.

Bridge. In Lecture 07 a function that calls another saved ra in a frame of 16 bytes. Today the functions of Verm1 call each other more deeply: each saves ra once, on entry, and restores it before ret. Lecture 18 states the rules: which registers a call may change and which it must preserve. Recall: A function calls two other functions. How many times must it save ra, and where?

Closing thread: Every rule of the game became a few logic instructions: a mask, an XOR, a comparison. Next: circuits that remember, and the states of a game.

## Slide 1: Verm1, Part 2: Steering, Food and a Score: the code

This is the code deck of Lecture 12. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The reference program is ~/arc12/verm1/verm1_part2.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.

## Slide 3: The working loop, again

The same two commands as in Part 1: build the cartridge, then upload it to PRG32-QT and run it. PRG32-QT should remain open throughout the session, with debug mode enabled so that the debugger is at hand; step 4 relies on it.

## Slide 4: CHANGED Constants: buttons and directions

These lines are added to the constants of Part 1. `RED` is the colour of the food. The four `BTN_` constants are masks, each with a single bit set, the bit of that button in the word returned by the runtime. The four `DIR_` constants are the codes of the directions, numbers from 0 to 3, hence two bits. The comments state the meaning of each of the two bits, and the lecture deck, in the slide "A code chosen with care", justifies the choice of codes.

## Slide 5: CHANGED Data: two tables and five new variables

These lines replace the data of Part 1. The `.rodata` section holds two tables of four words, `dx` and `dy`: for each direction code, the change of column and the change of row. Being constant, they reside with the other read-only data; they are in effect a small ROM, in the sense of Lecture 11. The `.data` section holds five new variables: `dir`, the direction of the last step; `want`, the direction requested by the player; and `score`, `food_x` and `food_y`, used in step 3.

## Slide 6: CHANGED update: from buttons to a wish

This replaces the beginning of `verm1_update`. After the call to `prg32_input_read`, `t1` receives the current direction and `t2` the current request. Four identical blocks follow: `andi` isolates one button; if the result is zero the next instruction is skipped; otherwise the request in `t2` is overwritten with that direction. Finally the rule: the XOR of request and direction is compared with 2, and if they are equal the request is a U-turn and the `sw` is skipped, so the previous request survives. Since `update` now makes a call, it requires a stack frame.

## Slide 7: CHANGED update: the timer calls step

The remainder of `verm1_update` is the fixed-point timer of Part 1, unchanged: the speed is added, and when a whole cell has accumulated 256 is subtracted. The only difference is what happens next: instead of updating `head_x` directly, the code calls a new function, `step`. Separating "when to move" from "how to move" is a first exercise in decomposition. The local labels here are 6 and 7 because 1 to 5 are already in use in the first half of the function.

## Slide 8: NEW step: look the movement up

The first half of `step`. The request becomes the direction once per step rather than once per frame, so that two rapid presses cannot fold the worm back on itself. Then the lookup: the direction code is shifted left by 2, because each table entry is a four-byte word, and added to the address of `dx`; the word loaded is the change of column, -1, 0 or +1. The same offset serves for `dy`. No branch is involved: the code *selects* the value, exactly as a multiplexer does, and changing the rules of movement means changing data rather than code.

## Slide 9: NEW step: move and wrap, both ways

The second half moves the head and handles the edges in both directions. Column plus `dx` may now be -1: `bgez` tests the sign, and a negative column is replaced by the last one; if instead it has reached `COLS`, it becomes 0. The row is treated likewise with `ROWS`. Both tests interpret the value as signed, as Lecture 05 requires. The last callout notes that `t4` and `t6` still hold the new column and row, which the next fragment uses.

## Slide 10: For now: close the function

Three provisional lines restore `ra`, release the frame and return, completing `step` so that the program can be run immediately. This is a recurring practice of the tutorials: a function to be finished later is closed provisionally, and what exists is tested. In step 3 the test for the food is inserted before these lines.

## Slide 11: Run it: you are driving

Run it: the student now steers. The head starts moving right as before. Holding DOWN makes it turn at its next step. While it moves right, holding LEFT has no effect, because the U-turn is refused; reaching the left requires two turns, DOWN and then LEFT. The green box gives a precise acceptance test: holding DOWN from the start for 64 frames brings the head to column 5 of row 22, ten steps down. A quantitative prediction verified against the machine is the standard of correctness throughout the course.

## Slide 12: CHANGED init: a complete start

`verm1_init` is replaced by a complete version in which every variable receives its initial value, the direction, the request and the score included, and the first food is placed by calling `place_food`. Since it now makes a call, `init` too requires a stack frame that saves `ra`.

## Slide 13: NEW place_food: a random cell

`place_food` requests two random numbers from the runtime. The contract of `prg32_random_number` is: minimum in `a0`, maximum in `a1`, both inclusive, result in `a0`. The first call yields a column from 0 to 39, the second a row from 0 to 23, and each is stored in its variable. One defect is left deliberately: the food may fall on the head. Part 3, once the worm has a body, corrects it. Acknowledging a known limitation explicitly is part of sound engineering practice.

## Slide 14: CHANGED step: is the head on the food?

This replaces the provisional ending of `step`. It is a comparator built from instructions: the `xor` of the food's column and the head's column is 0 when they are equal; likewise for the rows; the `or` of the two results is 0 only if both pairs are equal. If the result is non-zero, the function returns. Otherwise the worm has eaten: the score is incremented, new food is placed, and a sound is played. It is the AND of XNORs of Lecture 11, written as two `xor` and one `or`, with the logic inverted by De Morgan.

## Slide 15: NEW eat_sound: one note

`eat_sound` plays a single note. `prg32_audio_note` takes five arguments in `a0` to `a4`: channel, instrument, note, volume and duration in milliseconds. Note 72 is C in the fifth octave of MIDI numbering. The last callout restates a principle of PRG32 development: sound comes last. The game functioned without it, and it is added only once everything else is sound.

## Slide 16: CHANGED draw: the score as marks

The beginning of the new `verm1_draw`: after the title, a loop draws one small rectangle per point of the score, 4 pixels apart. The loop counter is held in `s0` rather than in a `t` register, because it must survive the calls to `prg32_gfx_rect`: a callee may destroy the temporaries but must preserve the `s` registers. In return, the function must itself save `s0` in its frame and restore it on exit. The convention is used here as a rule and studied formally in Lecture 18.

## Slide 17: CHANGED draw: food and head

The remainder of `verm1_draw`: the same three lines twice, first for the food and then for the head, loading the column, the row and the colour, and calling `draw_cell`. The order is significant: the head is drawn last, so that it covers the food when both occupy the same cell. `s0` and `ra` are then restored and the function returns.

## Slide 18: NEW draw_cell: from cells to pixels

`draw_cell` gathers into one function the arithmetic that Part 1 placed inside `draw`: column times 8, row times 8 plus `TOP`. Its contract is written in the comment on its first line: column in `a0`, row in `a1`, colour in `a2`. One subtlety deserves attention: `prg32_gfx_rect` expects the colour in `a4`, and `a2` is about to be overwritten with the width, so the colour must be moved first. Documenting the contract of a function in a comment is an integral part of writing it.

## Slide 19: Run it: Verm1, Part 2

Run it. A red cell appears somewhere on the grid. When the head is steered onto it, a note sounds, a mark appears beside the title, and the food moves to another cell. The screenshot shows the game after two bites, with two marks; it was produced by the automatic test, in which a scripted player steers the head to the food twice.

## Slide 20: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 21: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 22: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 23: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 24: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 25: Make it yours

Four modifications of the student's own devising. Make button A a brake that suspends the timer while held. Award two points for food eaten in the top row. Draw the head in a different colour for each direction, using a third table indexed like `dx`. And change the encoding of the directions: with RIGHT 0, LEFT 1, DOWN 2 and UP 3, what does the U-turn rule become? The last question tests whether the role of the encoding has been understood. A copy of the working Part 2 should be kept before experimenting.
