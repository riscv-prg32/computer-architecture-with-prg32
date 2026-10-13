# Lecture 12: Verm1, Part 2: Steering, Food and a Score

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Verm1, Part 2: Steering, Food and a Score

The second tutorial of the project. At the end of Part 1 the head crossed the screen by itself; today the player enters the game. You add steering with the joystick, food that appears at random, a score and a sound. Everything rests on the four lectures of the logic block: a button is one bit selected by a mask, the rule against the U-turn is a single XOR, the movement is read from a table as a multiplexer would select it. Sid Meier's sentence on the cover says what you are adding: choices.

## Slide 2: What you will have by the end

Five results: a head that you steer in four directions; a rule that forbids the U-turn, written with one XOR and one comparison; movement taken from two small tables instead of four branches; food that appears in a random cell, is eaten and appears again; and a score, drawn as small marks next to the title, with a sound at each bite. Notice that three of the five are ways of writing something well, not only of making it work.

## Slide 3: What Part 2 takes from the lectures

Each row links an idea of the logic lectures to a place in today's program. AND as a mask selects one button out of the word of buttons. A truth table becomes the code of the four directions. XOR, which is 1 where two bits differ, gives both the U-turn rule and the test for equality. The pull-up of Lecture 10 explains why a pressed button arrives as a 1. The comparator, the multiplexer and the ROM of Lecture 11 become the test "head on the food" and the tables `dx` and `dy`.

## Slide 4: Start from a Part 1 that runs

Start from a Part 1 that runs: open your file, build it and check that the head crosses the screen. If it does not, take the reference file of Part 1 instead. Today the file changes in three steps, and you run it after the second and after the third. Read the fourth line carefully, because it is the convention of all the tutorials from now on: a slide marked CHANGED replaces code that you already have; a slide marked NEW adds code.

## Slide 5: A code chosen with care: the four directions

The codes of the directions were chosen with care. Bit 0 says whether the movement is vertical; bit 1 says whether it is "backwards", towards smaller coordinates. As a consequence a direction and its opposite differ in bit 1 and only there: RIGHT is 00 and LEFT is 10, DOWN is 01 and UP is 11. So the XOR of two opposite directions is always 10, that is 2. A good encoding turns a rule into a single gate. Note also the caption: on the screen y grows downwards, so DOWN is plus 1.

## Slide 6: From finger to bit

The path of a button, from Lecture 10. The pin of the chip is held at 3.3 V by a pull-up resistor; pressing the button joins it to ground, so the pin reads 0 when pressed. The runtime inverts the levels and packs all the buttons into one word, with 1 meaning pressed. The table gives the mask of each direction button. Two facts to use at once: UP and RIGHT pressed together give 0x04 OR 0x02, that is 0x06; and `a0` AND 0x04 is zero exactly when UP is not pressed.

## Slide 7: The U-turn rule, as a truth table

The rule as a truth table: six of its sixteen rows. With the head going right, asking for RIGHT gives 00 and the head goes on; asking for DOWN or UP gives 01 or 11, and it turns; asking for LEFT gives 10, which is 2, and the request is refused. The same happens for DOWN and UP. Complete the table yourself and count the refusals: there are four, one for each direction. With codes chosen at random the same rule would need four separate comparisons.

## Slide 8: Catch the U-turn rule at work

Run the cartridge in debug mode and show `verm1_update`. First look at the telemetry while you hold a button: the input mask shows 0x04 for UP and 0x01 for LEFT. Then set a breakpoint on the instruction `xor t3, t2, t1`. Hold LEFT while the head goes right and resume: the program stops on the XOR. Read the registers: `t1` is 0, the direction, and `t2` is 2, the wish. Step once: `t3` becomes 2. Two more steps, and you see the branch taken and the `sw` skipped.

## Slide 9: What you read in the registers

What you should read, with the head going right. With nothing pressed, the wish is the old one and the XOR is 0. With DOWN it is 1 and with UP it is 3: both are stored. With LEFT it is 2, the U-turn, and nothing is stored. The last row shows the priority among the tests: with UP and RIGHT together UP wins, because it is tested last. Read `a0` at the first instruction after the call: later in the frame it is overwritten.

## Slide 10: Read the variables in memory

The variables can be read in memory as well. After `la t0, dir` the register `t0` holds the address of `dir`: type it in the *Memory* field. The variables follow each other in the order of the file, four bytes each: `dir`, `want`, `step_q8`, `score`, `food_x`, `food_y`. Eat once, pause and read the score: 01 00 00 00, least significant byte first. Then read the position of the food and check it against the red cell on the screen.

## Slide 11: Check your understanding: The player holds DOWN and RIGHT together: prg32_input_read returns / The worm goes UP (3). Which wish is refused?

One bit per button: DOWN is 0x08 and RIGHT is 0x02. Pressed together, the two bits are both 1: the OR of the two masks.

Apply the rule: the refused wish is the one whose XOR with the direction is 2. The direction is 3, that is 11 in binary; which code differs from it in bit 1 only?

## Slide 12: Check your understanding: Why slli t1, t1, 2 before adding to the address of dx? / xor t1, t1, t4 gives zero exactly when

The tables are made of words, and a word is four bytes. Entry number k is at k times 4 bytes from the beginning of the table, and a shift left by 2 multiplies by 4.

XOR gives 1 in each position where the two bits differ. A result of all zeros means that no position differs.

## Slide 13: Where we are, and what comes next

Where you are. The player is in the game: a wish, a rule, a movement, a reward. The logic of four lectures has become instructions: bits and masks, XOR as a comparator, a table as a selector. But the worm has no body, nothing can go wrong, and the game never ends. The next block, on state and memory, gives the tools, and Part 3 adds a body that grows, collisions, a title screen and a game over.
