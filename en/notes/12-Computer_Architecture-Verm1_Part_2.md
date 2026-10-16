# Lecture 12: Verm1, Part 2: Steering, Food and a Score

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; codes; arrays in memory; pull-up inputs; Boolean algebra; fixed point; multiplexers; signed or unsigned instructions; comparators and parity; arguments in a0 to a7. USE NOW: the calling convention (Lecture 18) and, used without being studied in this course, the PRG32 tools, the PRG32 runtime calls, the PRG32-QT debugger. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1, Part 2: Steering, Food and a Score

The second tutorial of the project. At the end of Part 1 the head crossed the screen autonomously; today the player enters the game. Steering with the joystick is added, together with food that appears at random, a score and a sound. Everything rests on the four lectures of the logic block: a button is a bit selected by a mask, the rule forbidding the U-turn is a single XOR, and the movement is read from a table as a multiplexer would select it. Sid Meier's sentence on the cover names what is being added: meaningful choices.

## Slide 2: What you will have by the end

Five outcomes: a head steered in four directions; a rule forbidding the U-turn, written with one XOR and one comparison; movement taken from two small tables instead of four branches; food that appears in a random cell, is eaten and reappears; and a score, drawn as small marks beside the title, with a sound at each bite. Three of the five concern writing the program well rather than merely making it work, and this emphasis on the quality of a solution is deliberate.

## Slide 3: What Part 2 takes from the lectures

Each row links an idea from the logic lectures to a location in today's program. AND as a mask selects one button from the word of buttons. A truth table becomes the code of the four directions. XOR, which is 1 wherever two bits differ, provides both the U-turn rule and the test for equality. The pull-up of Lecture 10 explains why a pressed button arrives as 1. The comparator, the multiplexer and the ROM of Lecture 11 become the test "head on the food" and the tables `dx` and `dy`. The tutorial is thus an application of the whole block, not of any single lecture.

## Slide 4: Start from a Part 1 that runs

The session begins from a Part 1 that runs: the file is opened and built, and the head is checked to cross the screen. If it does not, the reference file of Part 1 is used instead. Today the file changes in three steps, and is run after the second and after the third. The fourth line states the convention of every tutorial from now on: a slide marked CHANGED replaces code already present, and a slide marked NEW adds code.

## Slide 5: A code chosen with care: the four directions

The codes of the directions were chosen deliberately. Bit 0 records whether the movement is vertical; bit 1 whether it is "backwards", towards smaller coordinates. In consequence a direction and its opposite differ in bit 1 and only there: RIGHT is 00 and LEFT is 10, DOWN is 01 and UP is 11. The XOR of two opposite directions is therefore always 10, that is, 2. A well-chosen encoding reduces a rule to a single gate, a lesson of Lecture 11 applied directly. The caption recalls a convention of the screen: y increases downwards, so DOWN is +1.

## Slide 6: From finger to bit

The path of a button, recapitulated from Lecture 10. The pin is held at 3.3 V by a pull-up resistor; pressing the button connects it to ground, so the pin reads 0 when pressed. The runtime inverts the levels and packs all the buttons into one word, with 1 meaning pressed. The table gives the mask of each direction button. Two consequences are used immediately: UP and RIGHT pressed together give 0x04 OR 0x02, that is, 0x06; and `a0` AND 0x04 is zero exactly when UP is not pressed.

## Slide 7: The U-turn rule, as a truth table

The rule expressed as a truth table, of which six of the sixteen rows are shown. With the head moving right, a request for RIGHT gives 00 and the head continues; a request for DOWN or UP gives 01 or 11, and the head turns; a request for LEFT gives 10, that is, 2, and is refused. The same holds for DOWN and UP. Completing the table and counting the refusals yields four, one per direction. With arbitrarily chosen codes the same rule would require four separate comparisons: the encoding has absorbed the complexity.

## Slide 8: Catch the U-turn rule at work

The cartridge is run in debug mode with `verm1_update` displayed. First, the telemetry is observed while a button is held: the input mask reads 0x04 for UP and 0x01 for LEFT. A breakpoint is then set on `xor t3, t2, t1`. Holding LEFT while the head moves right and resuming, the program halts on the XOR. The registers read `t1` = 0, the direction, and `t2` = 2, the request. One step makes `t3` equal to 2; two further steps show the branch taken and the `sw` skipped. The rule is thus observed operating on actual values.

## Slide 9: What you read in the registers

The expected register contents, with the head moving right. With nothing pressed, the request is the previous one and the XOR is 0. With DOWN it is 1, with UP 3, and both are stored. With LEFT it is 2, the U-turn, and nothing is stored. The last row reveals the priority among the tests: with UP and RIGHT together UP prevails, because it is tested last. `a0` must be read at the first instruction after the call, since it is overwritten later in the frame, an instance of the caller-saved convention studied in Lecture 18.

## Slide 10: Read the variables in memory

The variables can also be read in memory. After `la t0, dir`, `t0` holds the address of `dir`, which is entered in the *Memory* field. The variables follow one another in the order of the file, four bytes each: `dir`, `want`, `step_q8`, `score`, `food_x`, `food_y`. After the worm has eaten once, the program is paused and the score read: 01 00 00 00, least significant byte first. The position of the food is then read and compared with the red cell on the screen, closing the loop between memory and display.

## Slide 11: Check your understanding: The player holds DOWN and RIGHT together: prg32_input_read returns / The worm goes UP (3). Which wish is refused?

For the first question: one bit per button, DOWN being 0x08 and RIGHT 0x02. Pressed together, both bits are 1, so the value is the OR of the two masks.

For the second, the rule is applied: the refused request is the one whose XOR with the current direction is 2. The direction is 3, 11 in binary; the question is which code differs from it in bit 1 alone.

## Slide 12: Check your understanding: Why slli t1, t1, 2 before adding to the address of dx? / xor t1, t1, t4 gives zero exactly when

For the first question: the tables consist of words, and a word is four bytes. Entry k lies at 4k bytes from the start of the table, and a left shift by 2 multiplies by 4.

For the second: XOR yields 1 in each position where the two bits differ, so a result of all zeros means that no position differs, which is to say the two values are equal.

## Slide 13: Where we are, and what comes next

The current position. The player is now in the game: a request, a rule, a movement, a reward. The logic of four lectures has become instructions: bits and masks, XOR as a comparator, a table as a selector. Yet the worm has no body, nothing can go wrong, and the game never ends. The next block, on state and memory, supplies the necessary concepts, and Part 3 adds a growing body, collisions, a title screen and a game-over screen.
