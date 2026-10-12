// Lecture 12 - Verm1, part 2: steering, food and a score.  Second of the project tutorials.
// Every listing is read from verm1/verm1_part2.S (tests/verm1_check.py); the checkpoint of step 2 is built by tests/verm1_steps.py.
const V11 = require("../../lib/verm1");

Deck({
  n: "12", file: "12-Computer_Architecture-Verm1_Part_2",
  title: "Verm1, Part 2: Steering, Food and a Score", short: "Verm1, part 2",
  sub: "The player enters the game: bits, masks, a rule in one XOR, a table that selects",
  quote: ["A game is a series of interesting choices.", "Sid Meier"],
  cover: "verm1_p2.png",
  credit: V11.CREDIT,
  notes: "Second project tutorial. It uses Lectures 08 to 11: Boolean operators and truth tables (08), XOR and equality, simplification (09), buttons as switches with pull-ups (10), comparators, multiplexers and ROM as a table (11). The students start from their working Part 1; the reference file is verm1/verm1_part2.S.",
  slides: [
    O("What you will have by the end", [
      "A worm's head that you steer with the joystick, in four directions",
      "A rule that forbids the U-turn, written as one XOR and one comparison",
      "Movement taken from two small tables instead of four branches",
      "Food that appears at a random cell, is eaten, and appears again",
      "A score, shown as marks in the title line, and a sound when the worm eats",
    ]),
    G("What Part 2 takes from the lectures", ["From", "Idea", "Where it appears today"], [
      ["Lecture 08", "AND as a mask: keep one bit, clear the others", "one button out of the word of buttons"],
      ["Lecture 08", "truth tables: a code for each case", "the four directions in two bits"],
      ["Lecture 09", "XOR is 1 where two bits differ", "the U-turn rule; the test for equality"],
      ["Lecture 10", "a button is a switch to ground with a pull-up", "why pressed arrives as 1 only after the runtime inverts it"],
      ["Lecture 11", "comparator, multiplexer, ROM as a table", "head on the food; dx and dy"],
    ], "Every row is something the students have seen as a circuit. Today the same ideas are instructions.", { widths: [1.6, 5.4, 5.2] }),
    T("Start from a Part 1 that runs", [
      "Open your verm1.S of Part 1, build it and run it: the head must cross the screen",
      "If it does not, copy the reference file verm1_part1.S and start from that",
      "Today you change the file in three steps, and you run it after the second and the third",
      "Slides marked CHANGED replace code you have; slides marked NEW add code",
      "Keep the debugger of PRG32-QT open: step 4 uses it to watch a decision being taken",
    ], "The reference files are in the verm1 folder of the course material. Keep a copy of each finished part: verm1_part1.S, verm1_part2.S and so on.", { img: "verm1_p2.png", cap: "Verm1 at the end of Part 2" }),
    K("The working loop, again", V11.BUILD, null, "The same two commands of Part 1. PRG32-QT must be running, with Run cartridges in RISC-V debug mode enabled in Settings if you want the debugger.", "sh"),

    H("Step 1: names for bits", "Buttons, directions, and the variables of today."),
    V11.slide(2, "constants", "CHANGED  Constants: buttons and directions", [
      "New colour: RED, for the food",
      "Each button is one bit of a word: a mask selects it",
      "A direction is a number from 0 to 3: two bits",
      "The codes are not arbitrary: see the next slide",
    ], "Add the lines from RED and from BTN_LEFT to DIR_UP to the constants of Part 1."),
    G("A code chosen with care: the four directions", ["Direction", "Code", "Bit 1", "Bit 0", "dx", "dy", "Opposite"], [
      ["RIGHT", "0", "0", "0", "+1", "0", "LEFT = 2"],
      ["DOWN", "1", "0", "1", "0", "+1", "UP = 3"],
      ["LEFT", "2", "1", "0", "-1", "0", "RIGHT = 0"],
      ["UP", "3", "1", "1", "0", "-1", "DOWN = 1"],
    ], "Bit 0 says vertical, bit 1 says backwards. A direction and its opposite differ in bit 1 and only there: code XOR opposite is always 10 in binary, 2. A good encoding turns a rule into one gate: the lesson of Lecture 09.", { widths: [2, 1.3, 1.3, 1.3, 1.3, 1.3, 3.7], caption: "On the screen y grows downwards: DOWN is +1, UP is -1." }),
    V11.slide(2, "data", "CHANGED  Data: two tables and five new variables", [
      "dx and dy: four words each, one per direction",
      "They are constants, so they live in .rodata",
      "dir is the direction of the last step, want the one asked for",
      "score, food_x, food_y: used in step 3",
    ], "Replace the data of Part 1 with this. The initial values are enough for step 2: init is completed in step 3."),

    H("Step 2: steering", "Read the buttons, refuse the U-turn, look the movement up in a table."),
    D("From finger to bit", async (s, h) => {
      const C = require("../../lib/circuit");
      let o = C.vdd(120, 40, "3.3 V") + C.resistor(120, 40, 110, { label: "pull-up" }) + C.wire([[120, 150], [120, 190]]) + C.dot(120, 170) + C.wire([[120, 170], [250, 170]]) + C.text(256, 175, "GPIO pin", { size: 14 }) +
        C.button(120, 190, 100, false, "UP") + C.wire([[120, 290], [120, 310]]) + C.ground(120, 310);
      await h.svg(s, C.doc(380, 350, o), h.MX, h.TOP + 0.1, 4.1, 3.8);
      h.table(s, 4.9, h.TOP + 0.1, [1.75, 1.75, 2.5, 1.3], ["Button", "Pin", "After the runtime", "Mask"], [["released", "1 (3.3 V)", "bit = 0", "-"], ["LEFT", "0", "bit 0 = 1", "0x01"], ["RIGHT", "0", "bit 1 = 1", "0x02"], ["UP", "0", "bit 2 = 1", "0x04"], ["DOWN", "0", "bit 3 = 1", "0x08"]], { fs: 14 });
      h.rows(s, [
        "The pin reads 0 when the button is pressed: active low (Lecture 10)",
        "prg32_input_read inverts and packs: one word, one bit per button, 1 = pressed",
        "UP and RIGHT together give 0x04 OR 0x02 = 0x06",
        "a0 AND 0x04 is zero if and only if UP is not pressed",
      ], 4.9, h.TOP + 3.0, h.W - h.MX - 4.9, h.BOT - h.TOP - 3.0);
    }, "The kit has internal pull-ups of about 45 kilohm; the switches go to ground. The cartridge never sees the electrical level: the runtime gives the same word on the board, on QEMU and on PRG32-QT."),
    V11.slide(2, "update-input", "CHANGED  update: from buttons to a wish", [
      "andi keeps one bit: zero means not pressed",
      "Each pressed button overwrites the wish in t2",
      "xor of wish and direction: 2 means opposite",
      "A U-turn is not stored: the old wish survives",
    ], "This replaces the beginning of verm1_update. update now calls a function, so it needs a stack frame. With two buttons pressed the last test wins: UP beats LEFT beats DOWN beats RIGHT. The player's wish is stored in want and becomes the direction only at the next step: so two quick presses cannot fold the worm onto itself."),
    G("The U-turn rule, as a truth table", ["dir", "want", "dir XOR want", "= 2 ?", "Decision"], [
      ["0 RIGHT", "0 RIGHT", "00", "no", "go on"],
      ["0 RIGHT", "1 DOWN", "01", "no", "turn"],
      ["0 RIGHT", "2 LEFT", "10", "yes", "refuse: U-turn"],
      ["0 RIGHT", "3 UP", "11", "no", "turn"],
      ["1 DOWN", "3 UP", "10", "yes", "refuse: U-turn"],
      ["3 UP", "2 LEFT", "01", "no", "turn"],
    ], "Sixteen rows in all: ask the students to complete the table and to count the refusals. There are four, one per direction. Without the careful encoding the rule would need four comparisons.", { widths: [2.2, 2.2, 2.6, 1.6, 3.6], caption: "Six of the sixteen rows. The rule is one XOR and one comparison with the constant 2." }),
    V11.slide(2, "update-timer", "CHANGED  update: the timer calls step", [
      "The fixed-point timer of Part 1, unchanged",
      "Moving is now a function of its own: step",
      "Labels 6 and 7: numbers 1 to 5 are used above",
    ], "This is the rest of verm1_update. The lines that moved head_x in Part 1 are gone: they become the function step."),
    V11.slide(2, "step-direction", "NEW  step: look the movement up", [
      "The wish becomes the direction, once per step",
      "A word is 4 bytes: offset = code shifted left by 2",
      "address of table + offset: the word to load",
      "No branch: the code selects, like a multiplexer",
    ], "A table in read-only memory addressed by a code is a ROM: Lecture 11. The alternative is four branches; the table is shorter, and changing the rules means changing data, not code."),
    V11.slide(2, "step-wrap", "NEW  step: move and wrap, both ways", [
      "Add dx: the column can now go below 0",
      "bgez tests the sign: negative means off the left",
      "The same for the row, with ROWS",
      "t4 and t6 keep the new cell for the next slide",
    ], "In Part 1 only the right edge existed. A negative column is a signed number: bgez and blt are the signed comparisons of Lecture 05."),
    V11.stubSlide("p2_step_end", "For now: close the function", [
      "Type these three lines after the wrap",
      "They restore ra and return: step is complete",
      "Step 3 puts the food test before them",
    ], "A temporary ending, so that the program can run now. This intermediate program is built and run by tests/verm1_steps.py."),
    X("Run it: you are driving", [
      "Build and run: the head still starts to the right, from column 5 of row 12",
      "Hold DOWN: the head turns at its next step and goes down, wrapping from row 23 to row 0",
      "While it goes right, hold LEFT: nothing happens. The U-turn is refused",
      "Hold DOWN and then LEFT: two turns, and now the head goes left",
    ], "Holding DOWN from the start for 64 frames brings the head to column 5, row 22: ten steps, all downwards.",
      "Checked on the PRG32-QT headless runner: DOWN held 64 frames gives (5, 22); LEFT held 64 frames gives (15, 12), as if nothing had been pressed."),

    H("Step 3: food, a score, a sound", "A random cell, a comparator, and a loop that draws."),
    V11.slide(2, "init", "CHANGED  init: a complete start", [
      "Every variable gets its starting value",
      "init now calls a function: it needs a stack frame",
      "The first food is placed here",
    ], "Replace verm1_init."),
    V11.slide(2, "food", "NEW  place_food: a random cell", [
      "prg32_random_number(min, max): both included",
      "Arguments in a0 and a1, result in a0",
      "A column from 0 to 39, a row from 0 to 23",
      "The food may fall on the head: Part 3 fixes it",
    ], "The random numbers come from the runtime: on the board from the hardware generator of the ESP32-C6. Two runs of the game are different."),
    V11.slide(2, "step-eat", "CHANGED  step: is the head on the food?", [
      "Replace the temporary ending with this",
      "xor is 0 when two numbers are equal",
      "or of the two results: 0 only if both are equal",
      "Eating: one more point, new food, a sound",
    ], "A comparator for equality is a row of XOR gates followed by an OR: Lecture 11. Here it is two xor and one or. The registers t4 and t6 still hold the new column and row; after the calls they are no longer needed, which is why it is safe to keep them in temporaries."),
    V11.slide(2, "sound", "NEW  eat_sound: one note", [
      "Five arguments, a0 to a4, then the call",
      "Note 72 is C5 in MIDI numbering",
      "Sound comes last: the game worked without it",
    ], "prg32_audio_note(channel, instrument, note, volume, milliseconds). On PRG32-QT the note is played by the computer; on the board by the amplifier and its speaker."),
    V11.slide(2, "draw", "CHANGED  draw: the score as marks", [
      "s0 counts the marks: it must survive the calls",
      "So s0 is saved in the frame, with ra",
      "One small rectangle per point, 4 pixels apart",
      "The loop ends when s0 reaches the score",
    ], "Replace the beginning of verm1_draw. A t register may be destroyed by any call; an s register is preserved, provided that we save and restore it ourselves: the convention, met in Lecture 02, is studied in Lecture 18. Digits arrive in Part 4, when division is available."),
    V11.slide(2, "draw-cells", "CHANGED  draw: food and head", [
      "The same three lines twice: column, row, colour",
      "draw_cell does the conversion to pixels",
      "The head is drawn last: it covers the food",
    ], "This is the rest of verm1_draw: it replaces the rectangle of Part 1."),
    V11.slide(2, "draw-cell", "NEW  draw_cell: from cells to pixels", [
      "The arithmetic of Part 1, written once",
      "The colour arrives in a2 and must leave in a4",
      "Move it first: a2 is about to be overwritten",
    ], "A function with a contract: a0 = column, a1 = row, a2 = colour. Writing the contract in a comment is part of the job."),
    I("Run it: Verm1, Part 2", [["verm1_p2.png", "The head, the food, and two marks after the title: two points"]],
      "Screenshot produced by tools/tests/verm1_check.py: a scripted player steers the head to the food twice.", "Expected: a red cell somewhere; steer the head onto it; a note sounds, a mark appears next to VERM1, the food moves."),

    H("Step 4: watch a decision", "PRG32-QT as a logic probe."),
    O("Catch the U-turn rule at work", [
      "Run the cartridge in debug mode and press Update: the listing shows verm1_update",
      "Look at the telemetry while you hold a button: the input mask shows 0x04 for UP, 0x01 for LEFT",
      "Find the instruction xor t3, t2, t1 and click in the gutter: a breakpoint",
      "Hold LEFT while the head goes right, and press Resume: the program stops on the xor",
      "Read the registers: t1 is 0, the direction; t2 is 2, the wish",
      "Press Step: t3 becomes 2. Step twice more: the branch is taken and the sw is skipped",
    ], "Lower the speed of the debugger to 0.25x if you need time to press. Resume ignores the current breakpoint once: each Resume runs one frame. Without a button pressed t2 is the old wish and t3 is 0."),
    G("What you read in the registers", ["You hold", "a0 (mask)", "t1 = dir", "t2 = want", "t3 = t2 XOR t1", "Stored?"], [
      ["nothing", "0x00", "0", "0", "0", "yes: 0"],
      ["DOWN", "0x08", "0", "1", "1", "yes: 1"],
      ["LEFT", "0x01", "0", "2", "2", "no: U-turn"],
      ["UP", "0x04", "0", "3", "3", "yes: 3"],
      ["UP + RIGHT", "0x06", "0", "3", "3", "yes: 3"],
    ], "All with the head going right. The last row shows the priority of the tests: UP is tested last and wins. a0 is overwritten later in the frame: read it at the first instruction after the call.", { widths: [2.2, 1.9, 1.6, 1.8, 2.6, 2.1], mono: [1] }),
    T("Read the variables in memory", [
      "After la t0, dir the register t0 holds the address of dir: type it in the Memory field",
      "The variables follow each other, 4 bytes each, in the order of the file",
      ["From the address of dir", ["+0 dir, +4 want, +8 step_q8", "+12 score, +16 food_x, +20 food_y"]],
      "Eat once, pause, and read score: 01 00 00 00",
      "Read food_x and food_y, and check them against the screen: column and row of the red cell",
    ], "head_x and head_y are the two words before dir. Little-endian: the lowest byte comes first.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listing, registers, memory", wide: true }),

    Q("The player holds DOWN and RIGHT together: prg32_input_read returns", ["0x02", "0x08", "0x0a", "0x10"], 2, "0x08 OR 0x02 = 0x0a: one bit per button."),
    Q("The worm goes UP (3). Which wish is refused?", ["RIGHT (0)", "DOWN (1)", "LEFT (2)", "UP (3)"], 1, "3 XOR 1 = 2: DOWN is the opposite of UP."),
    Q("Why slli t1, t1, 2 before adding to the address of dx?", ["to make the code positive", "each entry of the table is 4 bytes", "to clear bit 1", "tables start at address 4"], 1, "The entries are words: entry k is at offset 4k."),
    Q("xor t1, t1, t4 gives zero exactly when", ["t1 is zero", "t4 is zero", "t1 and t4 are equal", "t1 and t4 are opposite"], 2, "XOR is 1 where bits differ: no difference, all zeros."),
    X("Make it yours", [
      "Make button A a brake: while it is held, the timer does not advance",
      "Give two points for a piece of food eaten in the top row",
      "Draw the head in a different colour for each direction, using a third table of four colours",
      "Change the encoding so that RIGHT = 0, LEFT = 1, DOWN = 2, UP = 3: what does the U-turn rule become?",
    ], "Each change is a few lines. Keep a copy of the working Part 2 before you experiment: Part 3 starts from it.",
      "Brake: andi with BTN_A (0x10) at the start of the timer, branch to the exit. Colour table: four .word in .rodata, indexed like dx. New encoding: opposites differ in bit 0, so the test is XOR = 1."),
    T("Where we are, and what comes next", [
      "The player is in the game: a wish, a rule, a movement, a reward",
      "Bits and masks, XOR as a comparator, a table as a selector: logic turned into instructions",
      "Missing: the worm has no body, nothing can go wrong, and the game never ends",
      "Lectures 13 to 16 give the tools: state machines, registers, memory as an array, what survives power-off",
      "Part 3: a body that grows, collisions, a title screen and a game over",
    ], "Reference file for this part: verm1/verm1_part2.S (" + V11.lines(2) + " lines)."),
  ],
});
V11.done(2);
