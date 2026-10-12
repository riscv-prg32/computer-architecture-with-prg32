// Lecture 17 - Verm1, part 3: a body, rules and states.  Third of the project tutorials.
// Listings: verm1/verm1_part3.S (tests/verm1_check.py); the checkpoints of steps 2 and 3 are built by tests/verm1_steps.py.
const V16 = require("../../lib/verm1");
const D16 = require("../../lib/draw");

// The ring buffer: 16 of the 256 entries, with head and tail.
function ring16(headI, len, title) {
  const c = 44, L = 20, T = 56, n = 12, W = n * c + 2 * L + 60, H = 170;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="Arial" font-size="${o.size || 14}" font-weight="${o.bold === false ? "normal" : "bold"}" fill="${o.fill || "#1B2530"}" text-anchor="${o.anchor || "middle"}">${s}</text>`;
  let o = t(L, 20, title, { anchor: "start", size: 15 });
  const first = headI - len - 1;                       // index shown in the leftmost box
  for (let j = 0; j < n; j++) {
    const idx = ((first + j) % 256 + 256) % 256, d = (headI - idx + 256) % 256, used = d < len;
    o += `<rect x="${L + j * c}" y="${T}" width="${c}" height="${c}" fill="${d === 0 ? "#00C000" : used ? "#0B7A0B" : "#EEF2F5"}" stroke="#2E4A62" stroke-width="1.5"/>`;
    o += t(L + j * c + c / 2, T + c + 18, String(idx), { bold: false, size: 13, fill: "#5B6B78" });
    if (d === 0) o += t(L + j * c + c / 2, T - 10, "head_i", { fill: "#0E7C86" });
    if (d === len - 1) o += t(L + j * c + c / 2, T - 10, "tail", { fill: "#B23A48" });
  }
  o += t(L + n * c + 8, T + 28, "...", { anchor: "start", size: 20 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o}</svg>`;
}
const fsm16 = () => D16.fsm([{ id: "T", x: 95, y: 150, label: "TITLE", color: "#2E4A62" }, { id: "P", x: 300, y: 150, label: "PLAY", color: "#0E7C86" }, { id: "O", x: 505, y: 150, label: "OVER", color: "#B23A48" }],
  [{ from: "T", to: "P", label: "A pressed", bend: -40 }, { from: "P", to: "O", label: "bites itself", bend: -40 }, { from: "O", to: "T", label: "A pressed", bend: -110 }, { from: "P", to: "P", label: "every frame", loop: "top" }], { w: 600, h: 330, r: 44 });

Deck({
  n: "17", file: "17-Computer_Architecture-Verm1_Part_3",
  title: "Verm1, Part 3: A Body, Rules and States", short: "Verm1, part 3",
  sub: "Memory enters the game: a ring of bytes, a map of the world, a machine with three states",
  quote: ["Show me your tables, and I won't usually need your flowcharts; they'll be obvious.", "Fred Brooks, The Mythical Man-Month"],
  cover: "verm1_p3_play.png",
  credit: V16.CREDIT,
  notes: "Third project tutorial. It uses Lectures 13 to 16: finite state machines and edge detection (13), registers that hold the previous value (14), memory as an array of bytes, addresses and indices (15), what is kept in the cartridge file and what is lost at power-off (16). The reference file is verm1/verm1_part3.S. The quotation is the second half of Brooks's remark on flowcharts and tables: with 'data structures' for 'tables' it is the motto of this part.",
  slides: [
    O("What you will have by the end", [
      "A worm with a body that follows the head and grows by one cell at every meal",
      "A game that can be lost: the worm must not bite itself",
      "Three screens: a title, the game, a game over, linked by button A",
      "Food that never appears on the worm",
      "A best score, kept as long as the cartridge stays in memory",
    ]),
    G("What Part 3 takes from the lectures", ["From", "Idea", "Where it appears today"], [
      ["Lecture 13", "a finite state machine: states, inputs, transitions", "TITLE, PLAY, OVER"],
      ["Lecture 13", "an edge is a change, not a level", "A pressed now and not one frame ago"],
      ["Lecture 14", "a register keeps a value for the next clock", "prev_btn: the buttons of the last frame"],
      ["Lecture 15", "memory is an array of bytes: address = base + index", "the body, the map of the world"],
      ["Lecture 16", "what stays in the file and what lives in RAM", ".rodata and .data; the best score"],
    ], "The frame is the clock of our machine: update computes the next state from the present state and the inputs, exactly as in Lecture 13.", { widths: [1.6, 5.6, 5.0] }),
    I("Where you are going", [["verm1_p3_title.png", "TITLE"], ["verm1_p3_play.png", "PLAY: seven cells after four meals"], ["verm1_p3_over.png", "OVER"]],
      "Screenshots produced by tools/tests/verm1_check.py with a scripted player.", "Three screens, one program. Start from a Part 2 that runs; if yours does not, copy verm1_part2.S."),
    K("The working loop, again", V16.BUILD, null, "The same two commands. Today the file changes a lot: build after every slide that says Run it, not only at the end.", "sh"),

    H("The design, before the code", "Two data structures and one diagram."),
    D("The body is a ring of 256 entries", async (s, h) => {
      await h.svg(s, ring16(2, 3, "A new game: three cells, the head in entry 2"), h.MX, h.TOP, 6.3, 1.72);
      await h.svg(s, ring16(3, 3, "One step: write the new head in entry 3; the tail is now entry 1"), h.MX, h.TOP + 1.8, 6.3, 1.72);
      await h.svg(s, ring16(4, 4, "One step with a meal: the head advances, the tail stays"), h.MX, h.TOP + 3.6, 6.3, 1.72);
      h.rows(s, [
        "Two arrays of bytes, body_x and body_y: entry k holds the cell of one segment",
        "Nothing is ever shifted: a step writes one new entry and moves an index",
        ["Two numbers describe the worm", ["head_i: the entry of the head", "length: how many entries are in use"]],
        "The tail is entry head_i - length + 1",
        "After entry 255 comes entry 0: index AND 255. A ring",
      ], 7.1, h.TOP, h.W - h.MX - 7.1, h.BOT - h.TOP);
    }, "A circular buffer, the structure behind every FIFO (first in, first out) queue; the address arithmetic is that of Lecture 15. Moving a worm of 200 cells costs the same as moving one of 3. The size 256 is chosen so that the wrap is one AND: a power of two."),
    T("The world is a map of 960 bytes", [
      "Does the new head touch the body? Looking at every segment costs up to 255 comparisons",
      "Instead keep a map: one byte per cell, 1 if a segment is there, 0 if not",
      ["The cell in column c of row r is byte number", ["r x 40 + c, from 0 to 959", "its address is grid + r x 40 + c"]],
      "A step sets one byte, the new head, and clears one, the old tail",
      "The collision test is a single load, whatever the length of the worm",
    ], "Memory for time: the classic exchange. The map and the ring say the same thing in two ways, and the program must keep them consistent: every write to one is paired with a write to the other.", { big: "r x 40 + c", label: "A two-dimensional world in a one-dimensional memory: the address computation of Lecture 15" }),
    D("The game is a machine with three states", async (s, h) => {
      await h.svg(s, fsm16(), h.MX, h.TOP, 6.3, 3.45);
      h.rows(s, [
        "The state is one word in memory",
        "update looks at the state first, then at the inputs",
        "A pressed means: down now, up one frame ago",
        "Holding A must not skip the title: an edge, not a level",
      ], 7.4, h.TOP, h.W - h.MX - 7.4, 3.45);
      h.table(s, h.MX, h.TOP + 3.65, [2.2, 3.4, 2.6, 4.0], ["Present state", "Input", "Next state", "Action"], [["TITLE", "A pressed", "PLAY", "new_game"], ["PLAY", "new head on the body", "OVER", "update the best score"], ["OVER", "A pressed", "TITLE", "-"]], { fs: 14 });
    }, "The diagram and the table of Lecture 13, for our game. In every other case the state does not change. Draw it on the board before showing the code: the code is a transcription."),

    H("Step 1: the memory of the game", "Names, constants in the file, variables in RAM."),
    V16.slide(3, "constants", "CHANGED  Constants: a button, a colour, three states", [
      "BODY: a darker green, 0x03e0",
      "BTN_A is bit 4 of the word of buttons",
      "The states are numbers: 0, 1, 2",
      "The .section and .global lines move to the next slide",
    ], "Replace the constants of Part 2."),
    V16.slide(3, "data", "CHANGED  .rodata: what stays in the file", [
      "Three strings and the two tables of Part 2",
      "Read-only: the program never writes here",
      "On the board this could stay in flash",
    ], "Replace the .rodata of Part 2."),
    V16.slide(3, "data-ram", "CHANGED  .data: what lives in RAM", [
      "head_x and head_y are gone: the head is in the ring",
      ".space reserves bytes without naming each one",
      "256 + 256 + 960 bytes: the worm and its world",
      "best survives a game, not a power-off",
    ], "Replace the .data of Part 2. Everything here is lost when the cartridge is unloaded: Lecture 16. A best score that survives needs permanent memory, which a portable cartridge does not have: an honest limit."),

    H("Step 2: three states", "The machine first, with functions that do nothing yet."),
    V16.slide(3, "init", "CHANGED  init: start on the title", [
      "init only chooses the first state",
      "The game itself is prepared by new_game",
      "A leaf again: no frame",
    ], "Replace verm1_init. Delete from your file verm1_update, step and verm1_draw of Part 2: the next slides replace them. Keep place_food, eat_sound and draw_cell."),
    V16.slide(3, "update", "CHANGED  update: buttons, and their edges", [
      "s0 = buttons now; prev_btn = buttons one frame ago",
      "prev_btn is a register: it delays by one frame",
      "now AND NOT before: 1 only where a press began",
      "s0 and s1 must survive the calls: saved in the frame",
    ], "The edge detector of Lecture 13: a flip-flop and an AND gate with one inverted input. Here the flip-flop is a word of memory and the clock is the frame."),
    V16.slide(3, "update-states", "CHANGED  update: one branch per state", [
      "The state is read first: it decides who looks at the inputs",
      "TITLE and OVER react only to a new press of A",
      "PLAY passes the held buttons to play_update",
      "Named labels: u_play, u_start, u_done",
    ], "This is the rest of verm1_update: the transition table, line by line. OVER to TITLE only stores the new state; TITLE to PLAY calls new_game, which stores PLAY itself."),
    V16.slide(3, "draw", "CHANGED  draw: what to show in each state", [
      "The title line is always drawn",
      "TITLE: only the invitation, PRESS A",
      "PLAY and OVER: score, worm, food",
      "x = 132 centres 7 characters of 8 pixels",
    ], "Replace verm1_draw. The output depends only on the state and on the memory: draw changes nothing."),
    V16.slide(3, "draw-over", "CHANGED  draw: game over, and draw_text", [
      "OVER adds two words on top of the scene",
      "draw_text: white on black, written once",
      "It fills a3 and a4 and passes a0 to a2 through",
    ], "The end of verm1_draw, and a small helper that removes two lines from every text call."),
    V16.stubSlide("p3_stubs_a", "For now: four functions that do nothing", [
      "Stubs: the names exist, so the program builds",
      "new_game only changes the state",
      "Steps 3 and 4 replace them one at a time",
    ], "Start with returns that do nothing, then add one thing at a time: the method of the first lecture. This intermediate program is built and run by tests/verm1_steps.py."),
    X("Run it: a machine with nothing inside", [
      "Build and run: the title line and PRESS A in the middle of the screen",
      "Press A: the invitation disappears. A red cell is in the top-left corner: the food, at column 0 of row 0",
      "Nothing moves and the game cannot end: PLAY has no rules yet",
      "In the debugger, find the variable state and watch it change from 0 to 1 when you press A",
    ], "Title screen, then an empty field with one red cell at the top left.",
      "The food is at (0, 0) because food_x and food_y start at zero and the stub of new_game does not call place_food."),

    H("Step 3: a worm in memory", "Fill the ring and the map, and draw them."),
    V16.slide(3, "new-game-memory", "NEW  new_game: empty the map, lay the worm", [
      "Replace the stub of new_game with this",
      "960 bytes set to zero, one sb at a time",
      "Three segments: columns 3, 4, 5 of row 12",
      "Each one is written twice: in the ring and in the map",
    ], "grid+12*COLS is computed by the assembler: the address of the first byte of row 12. sb stores one byte; the index is added to the base address, with no shift because each entry is one byte."),
    V16.slide(3, "new-game-state", "NEW  new_game: the variables, the food, PLAY", [
      "head_i = 2 and length = 3 describe the worm",
      "Direction, timer and score start from zero",
      "The last thing: the state becomes PLAY",
    ], "The second half of new_game. The transition TITLE to PLAY is complete only when everything is ready: the state is stored last."),
    V16.slide(3, "draw-worm", "NEW  draw_worm: walk the ring backwards", [
      "Replace the stub of draw_worm with this",
      "Segment i is entry head_i - i, AND 255",
      "lbu loads one byte as an unsigned number",
      "Segment 0 is the head: a brighter green",
    ], "lbu and not lb: a column is a number from 0 to 39, never negative. With lb a byte of 200 or more would become negative: Lecture 05. Here both would work; lbu says what we mean."),
    V16.slide(3, "draw-score", "NEW  draw_score: the marks of Part 2", [
      "Replace the stub of draw_score with this",
      "The loop of Part 2, now a function",
      "It uses s0, so it saves and restores it",
    ], "The same loop that was inside verm1_draw in Part 2."),
    V16.stubSlide("p3_stubs_b", "One stub is left", [
      "play_update still does nothing",
      "The worm exists, and stands still",
    ], "Only this stub remains from the previous four."),
    X("Run it: a worm that stands still", [
      "Build and run, press A: a worm of three cells in row 12, columns 3 to 5, the head on the right",
      "The food is now at a random cell: new_game calls place_food",
      "In the debugger type the address of body_x in the Memory field: the first bytes are 03 04 05",
      "Find grid + 12 x 40 + 3: three bytes at 01 in a sea of zeros",
    ], "Three green cells, the rightmost brighter; one red cell somewhere; nothing moves.",
      "To find the address of body_x: break at the start of draw_worm and step until la t0, body_x has run; t0 holds it. grid is 512 bytes after body_x; row 12 starts 480 bytes after grid."),

    H("Step 4: rules", "One step of the worm: decide, look, write."),
    V16.slide(3, "play-input", "CHANGED  play_update: your update of Part 2", [
      "Replace the last stub with this and the next slide",
      "The steering of Part 2, under a new name",
      "The buttons arrive in a0: no call to read them",
    ], "Take the body of the old verm1_update: remove the call to prg32_input_read and rename the function."),
    V16.slide(3, "play-timer", "CHANGED  play_update: the timer", [
      "Exactly the timer of Part 2",
      "One whole cell accumulated: call step",
    ], "The end of play_update."),
    V16.slide(3, "step-direction", "CHANGED  step: three registers to keep", [
      "s0, s1: the cell of the new head",
      "s2: zero when the worm eats",
      "They must survive place_food: s registers",
      "The table lookup is that of Part 2",
    ], "The frame has room for four words: ra and three saved registers."),
    V16.slide(3, "step-head", "CHANGED  step: where will the head be?", [
      "The present head is entry head_i of the ring",
      "One byte each for column and row: lbu",
      "Add dx and dy, wrap as in Part 2",
      "Nothing is written yet: first we must look",
    ], "The new cell is only computed, in s0 and s1. Writing it comes after the collision test."),
    V16.slide(3, "step-tail", "CHANGED  step: eat, or move the tail", [
      "The comparator of Part 2 leaves its result in s2",
      "Eating: length + 1, the tail stays where it is",
      "Not eating: find the tail, entry head_i - length + 1",
      "At 255 cells the worm stops growing",
    ], "Growing and not moving the tail are the same thing: this is the whole trick of Snake. t3 and t4 receive the column and row of the tail."),
    V16.slide(3, "step-collide", "NEW  step: free the tail, test the head", [
      "Byte number = row x 40 + column: mul and add",
      "Clear the tail's byte first, then test the head's",
      "So the head may enter the cell the tail just left",
      "Occupied: the state becomes OVER, best is updated",
    ], "The order matters: freeing the tail before the test allows the worm to chase its own tail, as in the original game. mul needs the M extension of RISC-V, which the ESP32-C6 has."),
    V16.slide(3, "step-insert", "NEW  step: write the new head", [
      "Mark the cell in the map: t0 still points to it",
      "head_i + 1, AND 255: the ring closes",
      "Write column and row in the new entry",
      "If s2 is zero: a point, new food, a sound",
    ], "The end of step. After a collision the function jumps straight to label 9: nothing is written, and the screen shows the worm as it was before the fatal step."),
    V16.slide(3, "food", "CHANGED  place_food: not on the worm", [
      "Draw a cell at random, then look at the map",
      "Occupied: draw again, until a free cell comes",
      "The column waits in s0 during the second call",
    ], "Replace place_food of Part 2. The loop ends quickly as long as the worm is short: with 255 cells out of 960 the average is fewer than two attempts."),
    I("Run it: Verm1, Part 3", [["verm1_p3_play.png", "After four meals: seven cells and four marks"], ["verm1_p3_over.png", "The worm has bitten itself"]],
      "Screenshots produced by tools/tests/verm1_check.py.", "Expected: the worm follows the head and grows; turning into the body ends the game; A returns to the title, A again starts a new game."),

    H("Step 5: look at memory move", "PRG32-QT shows the ring and the machine."),
    O("Watch the ring turn", [
      "Run in debug mode, press A to start a game, then pause",
      "Press Update and put a breakpoint on the first instruction of step",
      "Resume: the program stops once per step of the worm, not once per frame",
      "Type the address of body_x in the Memory field: the bytes 03 04 05 of the start, then 06, 07 ... one new byte per step",
      "Go down for a few steps: body_x repeats the same column, and body_y, 256 bytes further, counts the rows",
      "Eat, and compare head_i and length before and after: both grow by one",
    ], "The bytes of the old positions are never erased: the ring keeps the whole history of the last 256 steps, and length says how much of it is still worm. After 256 steps the writing starts again from the first byte."),
    G("Catch the edge of button A", ["Frame", "A is", "s0 (now)", "prev_btn", "NOT prev", "s1 = s0 AND NOT prev", "Effect"], [
      ["n", "up", "0x00", "0x00", "0xff...ff", "0x00", "-"],
      ["n + 1", "down", "0x10", "0x00", "0xff...ff", "0x10", "transition"],
      ["n + 2", "down", "0x10", "0x10", "0xff...ef", "0x00", "-"],
      ["n + 3", "up", "0x00", "0x10", "0xff...ef", "0x00", "-"],
    ], "Put a breakpoint on and s1, s0, t1 in verm1_update, hold A and press Resume three times: s1 is 0x10 in one frame only. The test of the reference file holds A for 28 frames and checks that exactly one transition happens.", { widths: [1.2, 1.2, 1.6, 1.7, 1.8, 3.2, 1.8], mono: [2, 3, 4, 5], fs: 15, caption: "s1 is 0x10 in one frame only: the frame in which the button goes down." }),
    T("Three questions for the debugger", [
      "Where is state? After la t0, state in verm1_update, t0 holds its address. Watch 00, 01, 02 as you play and lose",
      "Is the map consistent with the ring? Pause, read the head from body_x and body_y, compute row x 40 + column, and look at that byte of grid",
      "What did the fatal step see? Break on the lbu that follows the second mul in step: t1 is 1 exactly once, at the bite",
      "A program is right when its memory is right: learn to read it",
    ], "The third question is the most instructive: s0 and s1 hold the cell the head wanted to enter, and the screen shows that it is part of the body.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listing, registers, memory", wide: true }),

    Q("head_i = 1 and length = 4. Which entries of the ring hold the worm?", ["1, 2, 3, 4", "0, 1, 2, 3", "254, 255, 0, 1", "253, 254, 255, 0"], 2, "From the tail, head_i - length + 1 = -2, that is 254 after AND 255, up to the head: 254, 255, 0, 1."),
    Q("Which byte of grid describes the cell in column 7 of row 3?", ["byte 37", "byte 127", "byte 283", "byte 307"], 1, "3 x 40 + 7 = 127."),
    Q("The player holds A down for two seconds on the title screen. What happens?", ["the game starts and ends at once", "the game starts once", "nothing, until A is released", "the states cycle at every frame"], 1, "Only the frame in which A goes down gives s1 = 0x10: one edge, one transition."),
    Q("Why is the tail's byte cleared before the head's byte is tested?", ["to save an instruction", "so that the head can enter the cell the tail leaves", "because sb is faster than lbu", "the order does not matter"], 1, "In the same step the tail moves away: that cell is free for the head."),
    X("Make it yours", [
      "Walls: the worm dies when it leaves the screen instead of wrapping",
      "Start with a worm of five cells; then let the length at the start depend on the best score",
      "Poison: a second, blue cell that makes the worm one cell shorter",
      "On the game-over screen show the best score as marks on the second line",
    ], "Each change touches one or two functions. Keep a copy of the working Part 3: Part 4 starts from it.",
      "Walls: in step-head, replace each wrap with a jump to the code that stores OVER. Poison: move the tail twice in one step, clearing both bytes of the map, and never go below length 1."),
    T("Appendix: two functions that did not change", [
      "eat_sound and draw_cell are those of Part 2: keep them as they are",
      "They are on the next two slides, so that this deck contains the whole program",
      "The complete file is the sum of the slides marked NEW and CHANGED, plus these two",
    ], "Reference file for this part: verm1/verm1_part3.S (" + V16.lines(3) + " lines)."),
    V16.slide(3, "sound", "UNCHANGED  eat_sound", ["One note of 60 milliseconds, as in Part 2"]),
    V16.slide(3, "draw-cell", "UNCHANGED  draw_cell", ["Column, row and colour in; one rectangle out"]),
    T("Where we are, and what comes next", [
      "Verm1 is a game: it has a goal, a risk, a beginning and an end",
      "A machine with three states, a ring of bytes, a map: sequential logic and memory, written as a program",
      "Missing: it redraws the whole screen at every frame, the score is a row of marks, the speed never changes",
      "Lectures 18 to 21 give the tools: how the processor executes, calls and division, how the video and the sound work",
      "Part 4: the finished game",
    ], "The students now have about 450 lines of assembly that they wrote and can explain. The next four lectures open the machine that runs them."),
  ],
});
V16.done(3);
