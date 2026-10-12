// Lecture 07 - Verm1, part 1: a head that crosses the world.  First of the project tutorials.
// Every listing is read from verm1/verm1_part1.S, which tools/tests/verm1_check.py builds and runs.
const V6 = require("../../lib/verm1");

Deck({
  n: "07", file: "07-Computer_Architecture-Verm1_Part_1",
  title: "Verm1, Part 1: A Head That Crosses the World", short: "Verm1, part 1",
  sub: "The course project begins: a grid, a cell, a speed in fixed point",
  quote: ["The journey of a thousand miles begins with a single step.", "Laozi, Tao Te Ching"],
  cover: "verm1_p1.png",
  credit: V6.CREDIT,
  notes: "First project tutorial. It uses only Lectures 02 to 06: registers, load and store, calls (02), strings and colours (04), integers, comparisons and wrap-around (05), fixed point (06), and a little history (03). The students type the program themselves; the reference file is verm1/verm1_part1.S. Everything on the code slides is read from that file, which is built and run automatically.",
  slides: [
    O("What you will have by the end", [
      "A cartridge of your own, verm1.prg32, built from one assembly file that you typed",
      "A title, a grid of 40 by 24 cells, and the head of the worm drawn in one of them",
      "The head moving by itself, one cell at a time, at a speed you control in fixed point",
      "A world with no edges: past the last column the head comes back from the first",
      "The habit of the working loop: edit, build, run, look, and stop the program in the debugger",
    ]),

    H("The project", "One game, built in four sittings and published at the end."),
    T("Verm1: a tribute to Snake", [
      "Verm1, read \"vermone\", the big worm: a worm that moves on a grid, eats, grows, and must not bite itself",
      ["A game with a long history", ["Blockade, an arcade machine by Gremlin, 1976", "Snake on the Nokia 6110, 1997: one of the most played games ever"]],
      "Small enough to write from scratch in assembly, rich enough to need every topic of the course",
      "You write every line: no engine, no library beyond the PRG32 calls",
      "This is where you are going: the picture on the right is the game of Part 4",
    ], "Snake for the Nokia 6110 was written by Taneli Armanto. Verm1 is a tribute, not a copy: the name, the rules of detail and the look are ours. The reference implementation that the tutorials follow was contributed by Giuseppe Coviello.", { img: "verm1_p4_play.png", cap: "Verm1 at the end of the course (Part 4)" }),
    G("The plan: four parts and a publication", ["Deck", "You add", "It uses Lectures"], [
      ["07  Part 1", "a grid, a head, automatic movement, wrap-around", "03 to 06: information and numbers"],
      ["12  Part 2", "steering with the joystick, food, a score", "08 to 11: logic and circuits"],
      ["17  Part 3", "a body that grows, collisions, title and game-over screens", "13 to 16: state and memory"],
      ["22  Part 4", "fast drawing, a score in digits, levels, sound: the finished game", "18 to 21: the machine"],
      ["23  The Store", "a bundle with manifest, icon and credits, ready for review", "all of them"],
    ], "Each part ends with a program that runs. Never start a part with a program that does not: if yours is broken, start from the reference file of the previous part.", { widths: [1.8, 6.2, 4.2] }),
    G("What Part 1 takes from the lectures", ["From", "Idea", "Where it appears today"], [
      ["Lecture 02", "registers, la / lw / sw, call and the stack frame", "everywhere"],
      ["Lecture 03", "retro games as specimens", "the choice of the game"],
      ["Lecture 04", "colours as RGB565 numbers; strings ending with zero", "GREEN, the title"],
      ["Lecture 05", "shifts as multiplications; comparisons; wrap-around", "cell to pixel; the edge of the world"],
      ["Lecture 06", "fixed point: a fraction as a scaled integer", "the speed of the worm"],
    ], null, { widths: [1.8, 5.6, 4.8] }),

    H("Step 0: the working loop", "Edit, build, run, look."),
    K("Build and run", V6.BUILD, null, "Make a folder ~/verm1 and keep one file in it, verm1.S, that grows from part to part. PRG32-QT listens on port 8080 and shows its address on the Setup screen: use that address if localhost does not answer. The same cartridge runs on QEMU (python3 -m prg32 qemu upload, then qemu run) and on the board (--url http://192.168.4.1).", "sh"),
    K("Step 1: three functions that return", `# verm1.S - my Verm1
.option norelax

.section .text
.global verm1_init
.global verm1_update
.global verm1_draw

verm1_init:
    ret

verm1_update:
    ret

verm1_draw:
    ret`, [
      "Type it, build it, run it: a black screen is the right answer",
      "The prefix verm1 is the name you pass to --entry-prefix",
      "init runs once; update and draw run once per frame",
      "From now on: add one thing, run, look. Never two things at once",
    ], "The skeleton of Lecture 02. If the build fails here the problem is the installation, not the program: solve it before going on."),

    H("Step 2: a grid and a head", "Constants, variables, and one rectangle."),
    V6.slide(1, "constants", "Constants: colours and the grid", [
      "Colours are RGB565 numbers: 0x07e0 is pure green",
      "320 pixels across, 8 per cell: 40 columns",
      "The top 8 pixels hold the title; 192 are left: 24 rows",
      ".equ gives a name to a number: no memory is used",
    ], "Replace the skeleton's first lines with these. SPEED_Q8 is used in step 3."),
    D("The world of Verm1", async (s, h) => {
      await h.svg(s, V6.gridSvg(5, 12), h.MX, h.TOP, 7.6, h.BOT - h.TOP);
      h.rows(s, [
        "The worm does not live in pixels: it lives in cells",
        "A position is a column, 0 to 39, and a row, 0 to 23",
        ["To draw a cell, turn it into pixels", ["x = column x 8: a shift left by 3", "y = row x 8 + 8: the title line comes first"]],
        "The head starts in column 5 of row 12",
        "Thinking in cells makes every later rule simple: moving is adding 1",
      ], 8.5, h.TOP, h.W - h.MX - 8.5, h.BOT - h.TOP);
    }, "Draw the grid on the board and ask for the pixel coordinates of a few cells: (0,0) is at (0,8); (39,23) is at (312,192)."),
    V6.slide(1, "data", "Variables and a string", [
      ".rodata holds constants: the title ends with a zero byte",
      ".data holds variables: one 32-bit word each",
      "The initial values are only a start: init will set them again",
    ], "Put this at the end of the file. step_q8 is used in step 3."),
    V6.slide(1, "init", "init: put the head in its place", [
      "la takes an ADDRESS, sw stores a VALUE there",
      "init sets the start explicitly: never trust what memory contained",
      "zero is the register that always reads 0",
      "A leaf function: no calls, so no stack frame",
    ]),
    V6.slide(1, "draw", "draw: title and head", [
      "Clear, write the title, draw one rectangle: three calls",
      "Arguments travel in a0 to a4, in order",
      "slli by 3 multiplies by 8: cell to pixel",
      "draw makes calls, so it saves ra in a stack frame",
    ], "prg32_gfx_text8(x, y, string, foreground, background); prg32_gfx_rect(x, y, width, height, colour)."),
    I("Run it: a head on the grid", [["verm1_p1.png", "The title and the head. After step 3 the head will be moving: this picture was taken 64 frames into the finished Part 1"]],
      "Screenshot produced by tools/tests/verm1_check.py from verm1/verm1_part1.S.", "Expected now: the word VERM1 at the top left and a green square standing still in column 5, row 12."),

    H("Step 3: movement", "A speed that is less than one cell per frame."),
    T("How fast should a worm go?", [
      "update runs about thirty times per second",
      "One cell per frame would cross the screen in little more than a second: unplayable",
      "We want a fraction of a cell per frame, and the processor of the kit has only integers",
      "Fixed point, Q24.8: keep the fraction in 1/256 of a cell, and take a step each time a whole cell has accumulated",
      "SPEED_Q8 = 40 means 40/256 = 0.156 cells per frame: about one step every 6 frames",
    ], "This is the ball of Lecture 06, turned into a timer. The remainder is kept, so the average speed is exact: 256 frames give exactly 40 steps.", { big: "40 / 256", label: "of a cell per frame: a step when the sum passes 256, and the remainder is not thrown away" }),
    V6.slide(1, "update", "update: accumulate, step, wrap", [
      "Add the speed to the fraction; below 256, wait",
      "At 256: subtract it, keep the rest, move one cell",
      "Column 40 does not exist: back to column 0",
      "Two exits: each stores what it changed",
    ], "blt compares signed numbers, which is right here: every value is small and positive. Local labels 1: and 2: are referred to as 1f and 2f, 'the next 1 or 2 forward'."),
    G("Trace it by hand", ["Frame", "step_q8 before", "+ 40", "Whole cell?", "step_q8 after", "head_x"], [
      ["1", "0", "40", "no", "40", "5"],
      ["2", "40", "80", "no", "80", "5"],
      ["6", "200", "240", "no", "240", "5"],
      ["7", "240", "280", "yes: 280 - 256", "24", "6"],
      ["13", "224", "264", "yes: 264 - 256", "8", "7"],
      ["64", "-", "-", "-", "0", "15"],
    ], "After 64 frames the sum is 64 x 40 = 2560 = 10 x 256: ten steps, head in column 15, exactly what the screenshot shows. Ask the students to fill in frames 8 to 12.", { widths: [1.3, 2.3, 1.5, 3, 2.2, 1.9], caption: "The steps come every 6 or 7 frames: the remainder carries the difference, as in a leap year." }),
    X("Run it: the head crosses the world", [
      "Build and run: the head moves to the right, about five cells per second",
      "Wait for the right edge: the head leaves at column 39 and returns at column 0",
      "Change SPEED_Q8 to 8, then to 128, then to 256: predict the speed before you run",
      "Change the starting row in init and the colour of the head",
    ], "The head crosses the forty columns in 256 frames, about eight and a half seconds at thirty frames per second, for ever.",
      "With SPEED_Q8 = 256 the head moves one cell per frame; larger values still give one step per frame, because update takes at most one step: a limit worth discovering."),

    H("Step 4: look inside with PRG32-QT", "The debugger is part of the method, not an emergency tool."),
    O("Stop the program and read the machine", [
      "In PRG32-QT open Settings and enable: Run cartridges in RISC-V debug mode",
      "Run your cartridge: the game is on the left, the debugger on the right",
      "Press Update: the listing jumps to verm1_update. Click in the gutter to put a breakpoint on its first instruction",
      "The program stops there at the next frame. Press Step and watch the registers change, one instruction at a time",
      "After the two instructions of la, t0 holds an address: type it in the Memory field to see step_q8 in memory",
      "Resume, and watch the bytes of step_q8 grow by 40 (0x28) at every stop",
    ], "From the PRG32-QT debugging guide: pause, resume, step; Init / Update / Draw / PC views; gutter breakpoints; a 128-byte memory view. Resume ignores the current breakpoint once, so each press of Resume runs one whole frame."),
    K("What the listing shows: your code, as the assembler left it", `verm1_update:
  auipc   t0, 0x0          # la t0, step_q8   is two instructions:
  addi    t0, t0, ...      #   t0 = address of step_q8
  lw      t1, 0(t0)
  addi    t1, t1, 40       # SPEED_Q8 is gone: only the number is left
  addi    t2, zero, 256    # li t2, 256
  blt     t1, t2, ...
  sub     t1, t1, t2
  sw      t1, 0(t0)
  ...
  c.addi  t3, 1            # addi t3, t3, 1 in a 16-bit form
  ...
  c.jr    ra               # ret`, [
      "Names are gone: labels became addresses, constants became numbers",
      "Pseudo-instructions are expanded: la is auipc plus addi, li is addi from zero, ret is a jump to ra",
      "Some instructions start with c.: the compressed 16-bit forms of the same instructions",
      "The cartridge is loaded at address 0x40800000: every address you see starts there",
    ], "Disassembly of verm1_update from verm1/verm1_part1.S (objdump, rv32imac), abridged; the exact offsets depend on the build. Instruction formats and compressed instructions are the subject of Lecture 19.", "txt"),
    T("Reading memory: little-endian, live", [
      "The Memory view shows 128 bytes from the address you typed, in hexadecimal",
      "step_q8 is a word of .data: its four bytes come lowest byte first",
      "With step_q8 = 240 you read F0 00 00 00",
      "head_x and head_y are the two words just before it in the file, and just before it in memory",
      "Change nothing here: the debugger only observes. To change the program, edit, build, run",
    ], "Byte order: Lecture 04. In the file the order is head_x, head_y, step_q8, each four bytes: if step_q8 is at address A, head_x is at A - 8.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listing, registers, memory", wide: true }),

    Q("With SPEED_Q8 = 64, how many frames pass between two steps of the head?", ["2", "4", "64", "256"], 1, "64/256 = 1/4 of a cell per frame: a whole cell every 4 frames."),
    Q("Which pixel is the top-left corner of the cell in column 10, row 3?", ["(10, 3)", "(80, 24)", "(80, 32)", "(88, 32)"], 2, "x = 10 x 8 = 80; y = 3 x 8 + 8 = 32."),
    Q("Why does verm1_draw save ra and verm1_update does not?", ["draw is longer", "draw calls other functions, which overwrite ra", "update uses no registers", "ra is saved automatically in update"], 1, "A call writes the return address in ra. A function that makes calls must keep its own ra safe on the stack; a leaf function need not."),
    X("Make it yours", [
      "Make the head move to the left: which instruction changes, and which comparison detects the edge?",
      "Make it move downwards instead, wrapping from row 23 to row 0",
      "Draw a second cell, in a darker green, one column behind the head: a first hint of a body",
      "Write your own name next to the title, in a colour you computed by hand in RGB565",
    ], "Each change is a few lines. Keep a copy of the working Part 1 before you experiment: Part 2 starts from it.",
      "Moving left: addi t3, t3, -1, then bgez t3 to skip the wrap, else li t3, COLS-1. The comparison is on the sign: Lecture 05. Darker green: 0x03e0."),
    T("Where we are, and what comes next", [
      "You have a cartridge that runs, built from a file you typed and understand line by line",
      "State in memory, a rule that changes it at every frame, a function that draws it: the shape of every game",
      "Missing: the player. The head goes where it wants",
      "Lectures 08 to 11 give the tools: bits and masks to read the joystick, Boolean rules, tables that select",
      "Part 2: steering, food and a score",
    ], "Reference file for this part: verm1/verm1_part1.S (" + V6.lines(1) + " lines). If a student's program does not work at the start of Part 2, they start from this file."),
  ],
});
V6.done(1);
