// Lecture 22 - Verm1, part 4: the finished game.  Fourth of the project tutorials.
// Listings: verm1/verm1_part4.S (tests/verm1_check.py); the checkpoints of steps 1 to 3 are built by tests/verm1_steps.py.
const V21 = require("../../lib/verm1");

Deck({
  n: "22", file: "22-Computer_Architecture-Verm1_Part_4",
  title: "Verm1, Part 4: The Finished Game", short: "Verm1, part 4",
  sub: "The machine enters the game: division for the digits, levels, sound, and a screen drawn only where it changes",
  quote: ["Premature optimization is the root of all evil.", "Donald Knuth, 1974"],
  cover: "verm1_p4_play.png",
  credit: V21.CREDIT,
  notes: "Fourth project tutorial. It uses Lectures 18 to 21: the registers by convention, the stack, multiplication and division (18), the processor cycle and the cost of an instruction (19), the frame buffer and what drawing costs (20), input, sound and the runtime as the owner of the devices (21). The reference file is verm1/verm1_part4.S. Knuth's sentence is the right motto: the game was made to work in Part 3, and only now, with a measure in hand, do we make it fast.",
  slides: [
    O("What you will have by the end", [
      "The score and the best score written in digits, converted by your own division by ten",
      "A worm that goes faster as the score grows, up to a limit",
      "Two sounds: a short note for a meal, a long low one for the end",
      "A draw function that touches a handful of cells per step instead of the whole screen",
      "The finished Verm1, ready to be packaged in Lecture 23",
    ]),
    G("What Part 4 takes from the lectures", ["From", "Idea", "Where it appears today"], [
      ["Lecture 18", "the calling convention: a, t, s registers, ra, the stack", "small functions with contracts; leaf functions"],
      ["Lecture 18", "the M extension: divu and remu, quotient and remainder", "the digits of the score"],
      ["Lecture 19", "the processor cycle: every instruction costs time", "the measure before and after step 4"],
      ["Lecture 20", "the screen is memory: writing pixels is the cost", "draw only what changed"],
      ["Lecture 21", "devices belong to the runtime: we ask, it does", "prg32_audio_note, with a duration"],
    ], "Lecture 04 comes back too: a digit becomes a character by adding 48, the ASCII code of '0'.", { widths: [1.6, 5.8, 4.8] }),
    I("Where you are going", [["verm1_p4_title.png", "TITLE, with the best score"], ["verm1_p4_play.png", "PLAY: the score in digits"], ["verm1_p4_over.png", "OVER"]],
      "Screenshots produced by tools/tests/verm1_check.py with a scripted player.", "Start from a Part 3 that runs; if yours does not, copy verm1_part3.S. Today has four steps, and the program runs after each one."),
    K("The working loop, again", V21.BUILD, null, "The same two commands. Before you start, run Part 3 in debug mode and write down what the telemetry shows during a game: retired instructions, frames per second, late frames. You will need the numbers in step 5.", "sh"),

    H("Step 1: the score in digits", "From a number to three characters."),
    T("A number is not its digits", [
      "score holds a binary number: 137 is 0x89, one byte",
      "The screen wants three characters: '1', '3', '7', that is the bytes 0x31, 0x33, 0x37",
      ["Divide by ten, three times", ["137 / 10 = 13, remainder 7: the units", "13 / 10 = 1, remainder 3: the tens", "1 / 10 = 0, remainder 1: the hundreds"]],
      "The digits come out from the right: store them from the last character to the first",
      "A digit d becomes a character by adding 48: the ASCII code of '0'",
    ], "The conversion of Lecture 05, done by the program instead of by hand. remu gives the remainder, divu the quotient: two instructions of the M extension.", { big: "137", label: "0x89 in memory; 0x31 0x33 0x37 on the screen" }),
    V21.slide(4, "to-decimal", "NEW  to_decimal: divide by ten, three times", [
      "Contract: a0 = value, a1 = where the 3 characters go",
      "remu gives the digit, divu what is left",
      "sb stores a byte: offsets 2, 1, 0 from a1",
      "A leaf: only t registers, no frame at all",
    ], "Values above 999 would show only their last three digits: a limit that no player will meet soon. The division instructions are slow, tens of clock cycles each on a small processor, and ten per step of the worm are nothing."),
    V21.slide(4, "draw-score", "CHANGED  draw_score: two numbers, two texts", [
      "Replace draw_score of Part 3: the marks go",
      "The digits are written into a string in RAM",
      "best_txt+5: skip BEST and the space, five characters",
      "Then the string is drawn like any other",
    ], "score_txt and best_txt are strings in .data, not .rodata: the program writes into them. Text is drawn with its background colour, so new digits cover the old ones without clearing."),
    V21.slide(4, "data-ram", "CHANGED  .data: the variables of Part 4", [
      "Replace the .data of Part 3",
      "Two strings that the program fills in",
      "dirty, old and erase: used in steps 3 and 4",
    ], "Type all of it now. The six variables from dirty to erase_y are not used until step 3."),
    X("Run it: digits", [
      "Build and run, press A: the top line reads VERM1 000 and, on the right, BEST 000",
      "Play and eat: 001, 002, ...",
      "Lose: on the game-over screen BEST shows your score",
      "In the debugger find score_txt in memory and read its bytes: 30 30 33 00 after three meals",
    ], "The score and the best score in digits; everything else as in Part 3.",
      "This intermediate program, Part 3 with the new draw_score, to_decimal and .data, is built and run by tests/verm1_steps.py."),

    H("Step 2: levels", "The speed becomes a function of the score."),
    V21.slide(4, "constants", "CHANGED  Constants: two speeds instead of one", [
      "SPEED_Q8 is replaced by a minimum and a maximum",
      "32/256: one step every 8 frames at the start",
      "96/256: three steps every 8 frames at most",
    ], "Replace the constants of Part 3. Only the two SPEED lines differ."),
    V21.slide(4, "play-timer", "CHANGED  play_update: a speed that grows", [
      "speed = 32 + 4 x score: a shift and an add",
      "ble and mv: the smaller of speed and 96",
      "The rest is the timer you know",
      "The limit is reached at 16 points",
    ], "Replace the timer at the end of play_update. A saturation: the value follows a line and then stays at the limit, like the clamp of the first laboratory. With fixed point the speed changes by a sixty-fourth of a cell per frame at each meal: no integer speed could be so fine."),
    G("The levels, in numbers", ["Score", "Speed (1/256 cell per frame)", "Frames per step", "Cells per second at 30 fps"], [
      ["0", "32", "8", "3.75"],
      ["4", "48", "5.3", "5.6"],
      ["8", "64", "4", "7.5"],
      ["12", "80", "3.2", "9.4"],
      ["16 and more", "96", "2.7", "11.25"],
    ], "256 divided by the speed gives the frames per step; the frame rate times the speed divided by 256 gives the cells per second. Ask the students for the row of score 2.", { widths: [2.2, 4.2, 2.8, 4], caption: "Fractions of a frame are real: at 48/256 the steps come every 5 or 6 frames, 5.33 on average." }),
    X("Run it: faster and faster", [
      "Build and run: the worm starts slower than in Part 3, and gains speed at every meal",
      "Count the frames between two steps with the debugger at score 0: eight",
      "Reach 16 points: the speed no longer changes",
      "Try SPEED_MAX = 256, if you dare",
    ], "A slow start, one step every 8 frames, and a visible acceleration over the first meals.",
      "Checked by tests/verm1_steps.py: 8 steps in the first 64 frames of a game."),

    H("Step 3: step tells what it changed", "Sounds, and the notes that draw will need."),
    V21.slide(4, "sound", "CHANGED  play_note: one function, any note", [
      "Replace eat_sound with play_note",
      "The caller chooses note and duration: a2 and a4",
      "The function fills in the other three arguments",
    ], "The arguments stay in the registers where prg32_audio_note expects them: a2 is the note and a4 the duration in both functions. Designing a contract around the callee saves moves."),
    V21.slide(4, "step-head", "CHANGED  step: remember the old head", [
      "Replace the same part of step",
      "old_x, old_y: the cell the head is leaving",
      "draw will repaint it in the colour of the body",
    ], "Two stores are added to the code of Part 3: the lines that write old_x and old_y."),
    V21.slide(4, "step-tail", "CHANGED  step: is there a cell to erase?", [
      "Eating: the tail stays, nothing to erase",
      "erase_on = 0 says so to draw",
    ], "Two lines are added: the store of zero into erase_on."),
    V21.slide(4, "step-collide", "CHANGED  step: note the tail, call the end", [
      "The tail leaves a cell: remember which one",
      "erase_on = 1: draw must paint it black",
      "The collision is now one call: game_is_over",
    ], "The beginning is new, seven lines; the end is shorter than in Part 3, because the transition to OVER has become a function."),
    V21.slide(4, "step-insert", "CHANGED  step: write the new head", [
      "As in Part 3, up to the two sb",
      "The end of the function is on the next slide",
    ], "Unchanged lines, shown because the function continues."),
    V21.slide(4, "step-score", "NEW  step: something changed", [
      "dirty = 1: one step happened, draw has work",
      "A meal: a point, new food, a short high note",
      "li a2 and li a4, then call: arguments by contract",
    ], "This replaces the end of step. Note 72 for 60 milliseconds: the sound of Part 2, through the new function."),
    V21.slide(4, "game-over", "NEW  game_is_over: the transition, in one place", [
      "PLAY to OVER, and the best score, as in Part 3",
      "dirty = 2: a new screen must be drawn",
      "A long low note: 36, for 400 milliseconds",
    ], "A transition of the state machine deserves a function of its own: state, outputs and sound in one place."),
    X("Run it: the sound of defeat", [
      "Build and run: the game looks exactly as after step 2",
      "A meal sounds as before; biting yourself gives a long low note",
      "In the debugger watch erase_x and erase_y follow the tail, one step behind",
      "dirty stays at 1 or 2: nobody reads it yet",
    ], "No visible change: the screen is still drawn completely at every frame. The new variables are written and not yet used.",
      "This intermediate program is built and run by tests/verm1_steps.py: verm1_draw of Part 3 with step, play_note and game_is_over of Part 4."),

    H("Step 4: draw only what changed", "From a whole screen per frame to a few cells per step."),
    T("What does a frame cost?", [
      "Part 3 clears 64 000 pixels and redraws the title, the score, the whole worm and the food: thirty times per second",
      "Between two steps nothing on the screen changes, and a step changes very little",
      ["One step changes at most", ["the cell the tail left: black", "the old head: now body", "the new head, and perhaps the food and the score"]],
      "So: remember what changed, and draw only that",
      "The picture stays on the screen by itself: the frame buffer is memory",
    ], "Lecture 20: the screen is an array of pixels that keeps its content. A worm of 200 cells costs 200 rectangles per frame in Part 3 and three per step in Part 4. This is what the old home computers did, because they had no choice.", { big: "64 000", label: "pixels per frame in Part 3; a few hundred per step in Part 4" }),
    V21.slide(4, "draw", "CHANGED  draw: nothing, a little, or everything", [
      "dirty = 0: return at once, no frame, no call",
      "dirty = 1: a step happened, draw the changes",
      "dirty = 2: a new screen, draw it all",
      "The flag is cleared as soon as it is read",
    ], "Replace verm1_draw. The frame is created only if there is something to do: the common case, nothing changed, costs five machine instructions."),
    V21.slide(4, "draw-changes", "NEW  draw_changes: three cells and the score", [
      "The cell the tail left, if any: black",
      "The old head: body colour",
      "Then the new head, the food, the score",
      "The order matters: the head is drawn after the erase",
    ], "The head may enter the cell that the tail has just left: erasing first and drawing the head afterwards gives the right picture."),
    V21.slide(4, "draw-full", "NEW  draw_full: a whole screen", [
      "The body of the old verm1_draw",
      "The score is drawn on the title screen too",
      "TITLE: the invitation, and nothing else",
    ], "Called once for each change of state."),
    V21.slide(4, "draw-full-play", "NEW  draw_full: PLAY and OVER", [
      "The worm and the food, by their functions",
      "OVER adds the two words",
    ], "The second half of draw_full."),
    V21.slide(4, "draw-parts", "NEW  draw_head", [
      "The head is entry head_i of the ring",
      "One cell, bright green",
    ], "A small function used by draw_changes."),
    V21.slide(4, "draw-food", "NEW  draw_food", [
      "The three lines that were inside draw",
      "Now they have a name, and two callers",
    ]),
    V21.slide(4, "draw-text", "UNCHANGED  draw_text", [
      "The helper of Part 3, on a slide of its own",
    ], "Unchanged: it was shown together with the game-over text in Part 3."),
    V21.slide(4, "init", "CHANGED  init: ask for the first screen", [
      "dirty = 2: the title screen must be drawn once",
    ], "Replace verm1_init: three lines are added."),
    V21.slide(4, "update-states", "CHANGED  update: a new state is a new screen", [
      "OVER to TITLE: dirty = 2",
      "Three lines are added, after the store of the state",
    ], "Replace the same part of verm1_update."),
    V21.slide(4, "new-game-state", "CHANGED  new_game: and here too", [
      "TITLE to PLAY: dirty = 2",
      "Three lines are added, before the return",
    ], "Every transition of the machine asks for a full drawing; every step asks for a partial one. Forgetting one of them is the typical bug of this technique: the screen shows a state that is no longer true."),
    I("Run it: the finished Verm1", [["verm1_p4_play.png", "Score 004, seven cells"], ["verm1_p4_over.png", "The end of a game"]],
      "Screenshots produced by tools/tests/verm1_check.py.", "Expected: the same game as after step 3, pixel for pixel. If you see trails or holes, a change was not recorded: use the debugger."),

    H("Step 5: measure", "PRG32-QT as an instrument: count before you believe."),
    O("Before and after, with numbers", [
      "Run the finished game in debug mode and start a game",
      "Read the telemetry during ten seconds of play: retired instructions, frames per second, late frames",
      "Compare with the numbers you wrote down for Part 3 at the start of this lecture",
      "Let the worm grow to twenty cells in both versions and read again: one number grows with the worm, the other does not",
      "Put a breakpoint on the first instruction of draw_changes: it stops once per step, not once per frame",
      "Write the four numbers in your notes: they go in the description of the game in Lecture 23",
    ], "The telemetry counts the instructions of the cartridge, not those of the runtime that fills the rectangles, so the real saving on the board is larger than the count shows: there every pixel also travels over SPI to the display. Do not quote numbers to the students: let them measure."),
    T("Follow a call with the debugger", [
      "Break on call to_decimal inside draw_score and read a0, a1, ra and sp",
      "Step once: the PC jumps into to_decimal, and ra now holds the address of the instruction after the call",
      "Step through: only t registers and a0 change; sp never moves. A leaf function",
      "At ret the PC takes the value of ra: you are back in draw_score",
      "Now do the same with call draw_text: sp goes down by 16, ra is stored at 12(sp), and comes back",
    ], "The calling convention of Lecture 18, watched instruction by instruction. In the listing call appears as jal, or as auipc followed by jalr, and ret as c.jr ra.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listing, registers, memory", wide: true }),

    Q("to_decimal receives a0 = 205. Which bytes does it store, from offset 0 to 2?", ["02 00 05", "32 30 35", "35 30 32", "cd 00 00"], 1, "The characters '2', '0', '5': 0x32, 0x30, 0x35. The units are stored at offset 2."),
    Q("At which score does the worm take one step every 4 frames?", ["4", "8", "16", "32"], 1, "One step every 4 frames is 64/256: 32 + 4 x score = 64, so score = 8."),
    Q("dirty is 0 when verm1_draw is called. How many machine instructions does it execute?", ["1", "5", "about 50", "thousands"], 1, "la is two instructions, auipc and addi; then lw, beqz and ret."),
    Q("Why can to_decimal do without a stack frame?", ["it is short", "it calls no function and uses only a and t registers", "it has no arguments", "frames are optional"], 1, "A leaf function that touches only caller-saved registers has nothing to save."),
    X("Make it yours", [
      "A pause: button B stops the game and writes PAUSE; B again resumes. A fourth state",
      "A melody on the title screen: a table of notes in .rodata, one note every 15 frames",
      "Bonus food: every fifth piece is yellow, worth three points, and disappears after 100 frames",
      "Your own colours with prg32_palette_set, or your own rules: this is your game now",
    ], "The version you publish in Lecture 23 should have something that is yours. Change the title string, too.",
      "Pause: a state PAUSED with transitions on the edge of B (0x20), and dirty = 2 at both transitions. Melody: an index and a frame counter in .data; the table is read like dx."),
    T("Appendix: the functions that did not change", [
      "Eight parts of the file are those of Part 3: keep them as they are",
      "They are on the next slides, so that this deck contains the whole program",
      "update, new_game (first half), play_update (steering), step (lookup), place_food, draw_worm, draw_cell, .rodata",
    ], "Reference file for this part: verm1/verm1_part4.S (" + V21.lines(4) + " lines)."),
    V21.slide(4, "update", "UNCHANGED  update: buttons and edges", ["The edge detector of Part 3"]),
    V21.slide(4, "new-game-memory", "UNCHANGED  new_game: the map and the worm", ["The first half of new_game"]),
    V21.slide(4, "play-input", "UNCHANGED  play_update: steering", ["The masks and the U-turn rule of Part 2"]),
    V21.slide(4, "step-direction", "UNCHANGED  step: the table lookup", ["The frame and the tables dx, dy"]),
    V21.slide(4, "food", "UNCHANGED  place_food", ["A random free cell"]),
    V21.slide(4, "draw-worm", "UNCHANGED  draw_worm", ["Used by draw_full only, once per new screen"]),
    V21.slide(4, "draw-cell", "UNCHANGED  draw_cell", ["From cells to pixels, since Part 2"]),
    V21.slide(4, "data", "UNCHANGED  .rodata", ["Strings and tables"]),
    T("Where we are, and what comes next", [
      "Verm1 is finished: about six hundred lines of RISC-V assembly, all yours",
      "It began as three functions that return, and grew one runnable step at a time",
      "Every lecture of the course is in it: numbers, logic, state, memory, calls, pixels, devices",
      "A program that only its author can run is half finished",
      "Lecture 23: a name, an icon, credits, a bundle for two architectures, and the Cartridge Store",
    ], "Ask the students to bring their own variant to Lecture 23: the bundle they prepare should be of their game, not of the reference."),
  ],
});
V21.done(4);
