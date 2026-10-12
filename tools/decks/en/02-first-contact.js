// Lecture 02 - First contact with RISC-V assembly on PRG32 (new in 2026/27).
// The listings are the verified steps of the textbook lab "05-asm-first-contact".
const SKELETON = `# Assembly Lab 1: the smallest program that runs
.option norelax

.section .text
.global first_init
.global first_update
.global first_draw

first_init:
    ret

first_update:
    ret

first_draw:
    ret`;

const BUILD = `# 1. build a portable cartridge from one assembly file
python3 -m prg32 cartridge build step1_skeleton.S --portable \\
    --entry-prefix first --name step1 --out build/step1.prg32

# 2a. run it in QEMU on your laptop
python3 -m prg32 qemu upload build/step1.prg32
python3 -m prg32 qemu run

# 2b. or send it to a board, or to PRG32-QT, over the network
python3 -m prg32 esp32c6 upload-and-run build/step1.prg32 \\
    --url http://192.168.4.1 --slot cart0`;

const HELLO = `first_draw:
    addi sp, sp, -16      # prologue: a 16-byte frame
    sw   ra, 12(sp)       # save the return address

    li   a0, BLACK
    call prg32_gfx_clear

    li   a0, 32           # x
    li   a1, 40           # y
    la   a2, title        # address of the string
    li   a3, WHITE        # foreground
    li   a4, BLACK        # background
    call prg32_gfx_text8

    lw   ra, 12(sp)       # epilogue: restore ra
    addi sp, sp, 16       # release the frame
    ret

.section .rodata
title:
    .asciz "HELLO PRG32"`;

const COUNTER = `first_update:
    # A leaf function: it calls nothing,
    # so it needs no stack frame.
    la   t0, counter      # t0 = ADDRESS of counter
    lw   t1, 0(t0)        # t1 = VALUE stored there   (load)
    addi t1, t1, 1        # one tick per frame        (modify)
    sw   t1, 0(t0)        # write it back             (store)
    ret

.section .data
counter: .word 0`;

const BAR = `    la   t0, counter
    lw   t1, 0(t0)
    andi a2, t1, 255      # width = counter modulo 256
    li   a0, 32           # x
    li   a1, 60           # y
    li   a3, 8            # height
    li   a4, GREEN        # .equ GREEN, 0x07e0
    call prg32_gfx_rect`;

Deck({
  n: "02", file: "02-Computer_Architecture-First_Contact_with_RISC-V_Assembly",
  title: "First Contact: RISC-V Assembly on PRG32", short: "First contact with RISC-V assembly",
  sub: "Registers, memory and the call: a running program before any theory",
  quote: ["Talk is cheap. Show me the code.", "Linus Torvalds, Linux kernel mailing list, 2000"],
  cover: "lab1_step4_bar.png",
  notes: "New lecture for 2026/27. It is the 'play' turn of the spiral for the whole first half of the course: every later lecture points back to something typed here. The four steps are the verified steps of the textbook lab 05-asm-first-contact; run them live (labs/run.sh 05-asm-first-contact/stepN_....S first).",
  slides: [
    O("What you will be able to do by the end", [
      "Build a cartridge from an assembly file and run it on PRG32",
      "Say what a register is, and name the ones you will use every day",
      "Call a framework function, passing arguments in registers",
      "Keep a value in memory from one frame to the next: load, modify, store",
      "Read one instruction as the 32-bit number it really is",
      "List the questions this program raises: the rest of the course answers them",
    ], "Tell the students explicitly that they are not expected to understand everything today. Today is for seeing; the next lectures are for explaining."),

    H("The machine", "Thirty-two registers and a small repertoire of instructions."),
    C("The machine you are programming", [
      ["32 registers", "Each register holds one 32-bit value. The processor can compute only on values that are in registers."],
      ["Compute", "An arithmetic or logic operation between registers: add, sub, and, or, xor, and their immediate forms such as addi."],
      ["Move", "A transfer between a register and memory: lw loads a word, sw stores a word. Nothing else touches memory."],
      ["Jump", "A change in which instruction runs next: branches such as beqz, calls and returns."],
    ], "That is very nearly the whole machine. The richness of computing comes not from a large instruction set but from combining a small one in long sequences."),
    G("The registers you will actually use", ["Register", "Name", "Role", "Preserved across a call?"], [
      ["a0 - a7", "arguments", "values passed into a call; a0 also carries the return value", "no"],
      ["t0 - t6", "temporaries", "scratch values", "no"],
      ["s0 - s11", "saved", "values a call promises to preserve", "yes"],
      ["ra", "return address", "where ret jumps back to", "no: save it yourself"],
      ["sp", "stack pointer", "top of the stack, kept 16-byte aligned", "yes"],
      ["zero", "zero", "always reads as 0; writes are ignored", "-"],
    ], "The roles are fixed not by the hardware but by an agreement: the calling convention, or ABI. Following it is what lets your assembly and the framework's C code call each other.", { widths: [1.6, 2.2, 5.6, 3], mono: [0], caption: "The roles come from an agreement, the calling convention (ABI), not from the hardware." }),
    F("The contract: three functions that you write", [
      "init|called once, when the cartridge starts: set up your state",
      "update|called once per frame: read input, change the state",
      "draw|called once per frame: turn the state into a picture",
    ], "The firmware finds the three functions by name: a prefix that you choose, followed by _init, _update and _draw. That is the whole contract between your game and the machine."),

    H("Your first cartridge", "Four small steps, each one a complete program that runs."),
    K("Step 1: the smallest program that runs", SKELETON, [
      ".option norelax keeps the layout of the cartridge predictable: every PRG32 example starts with it",
      ".section .text says that what follows is executable code",
      ".global makes a label visible to the firmware, which finds your functions by name",
      "ret returns to the caller: three functions that do nothing, correctly",
    ], "Source: labs/05-asm-first-contact/step1_skeleton.S. Expected result: a black screen. The achievement is that the framework found the three functions, called them, and survived."),
    K("Build it, run it", BUILD, null, "Source: labs/run.sh. With PRG32_HOME set, the whole sequence is: labs/run.sh 05-asm-first-contact/step1_skeleton.S first . The cartridge file is byte-for-byte the same for QEMU, the board and PRG32-QT.", "sh"),
    WK("Step 2: say hello", HELLO, "lab1_step2_hello.png",
      "The first argument goes in a0, the second in a1, and so on. li loads a number; la loads the address of a label.",
      "Source: labs/05-asm-first-contact/step2_hello.S. The .equ lines (BLACK 0x0000, WHITE 0xffff) are omitted on the slide."),
    D("Why save ra? The stack frame", (s, h) => {
      const x = 8.3, w = 3.2, ch = 0.62, y0 = h.TOP + 0.75;
      h.rows(s, [
        "call stores the address to come back to in ra",
        "The function you call will use ra for its own calls, overwriting yours",
        ["So a function that calls another one saves ra first", ["lower sp by 16 to make room", "store ra at 12(sp)"]],
        ["After the call, undo it in reverse order", ["load ra back, raise sp by 16, then ret"]],
        "Forgetting the pair is the classic first bug: the function returns to the wrong place",
      ], h.MX, h.TOP, 7.1, h.BOT - h.TOP);
      h.tx(s, "Stack memory after the prologue", { x, y: h.TOP, w: w + 1.4, h: 0.4, fontSize: 15, bold: true, color: P.steel });
      const cells = [["caller's data", "16(sp)", P.rule, P.ink], ["ra", "12(sp)", P.amber, P.white], ["free", " 8(sp)", P.panel, P.mute], ["free", " 4(sp)", P.panel, P.mute], ["free", " 0(sp)", P.panel, P.mute]];
      cells.forEach(([t, off, fill, col], i) => {
        s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.rect, x, y: y0 + i * ch, w, h: ch, fill: { color: fill }, line: { color: P.steel, width: 1 }, color: col, bold: true, fontFace: h.MONO, fontSize: 16, align: "center", valign: "middle", margin: 0 });
        h.tx(s, off, { x: x + w + 0.15, y: y0 + i * ch, w: 1.2, h: ch, fontSize: 14, fontFace: h.MONO, color: P.mute, valign: "middle" });
      });
      h.arrow(s, x - 0.9, y0 + 4.5 * ch, x - 0.05, y0 + 4.5 * ch, P.red, 2.25);
      h.tx(s, "sp", { x: x - 1.5, y: y0 + 4 * ch, w: 0.55, h: ch, fontSize: 18, bold: true, fontFace: h.MONO, color: P.red, valign: "middle", align: "right" });
      h.tx(s, "higher addresses", { x, y: y0 - 0.32, w, h: 0.28, fontSize: 11.5, color: P.mute, italic: true, align: "center" });
      h.tx(s, "The stack grows downward: subtract from sp to allocate, add to release.", { x: x - 0.6, y: y0 + 5 * ch + 0.2, w: w + 2, h: 0.7, fontSize: 14, color: P.ink });
    }, "The convention requires sp to stay 16-byte aligned across calls, which is why the frame is 16 bytes even though only 4 are used. The stack is treated formally in the lectures on memory and on subroutines."),
    K("Step 3: a value that survives between frames", COUNTER, [
      "counter is a label: it names a location in memory, in the .data section, holding one 32-bit word",
      "la puts the ADDRESS of that location in t0",
      "lw reads the VALUE at that address into t1; sw writes it back",
      "The processor computes only in registers: load, modify, store",
    ], "Source: labs/05-asm-first-contact/step3_counter.S. Nothing visible changes yet: the counter ticks but nobody draws it. Ask the class how they could prove that it is ticking (answer: the debugger of PRG32-QT, or the next step)."),
    D("Address or value? The crux of memory", (s, h) => {
      const y = h.TOP + 0.5;
      // registers
      h.tx(s, "Registers (inside the processor)", { x: h.MX, y: h.TOP, w: 5, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      [["t0", "address of counter", P.teal], ["t1", "41  then  42", P.amber]].forEach(([r, v, c], i) => {
        const yy = y + i * 1.25;
        h.tx(s, r, { x: h.MX, y: yy, w: 0.7, h: 0.75, fontSize: 22, bold: true, fontFace: h.MONO, valign: "middle" });
        s.addText(v, { isTextBox: true, shape: h.pres.ShapeType.rect, x: h.MX + 0.8, y: yy, w: 3.6, h: 0.75, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, bold: true, fontFace: h.MONO, fontSize: 17, align: "center", valign: "middle", margin: 0 });
      });
      // memory
      h.tx(s, "Memory (.data section)", { x: 8.2, y: h.TOP, w: 4.5, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      ["...", "counter:  41", "..."].forEach((t, i) => {
        s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.rect, x: 8.2, y: y + i * 0.75, w: 3.9, h: 0.75, fill: { color: i === 1 ? P.amberSoft : P.panel }, line: { color: P.steel, width: 1 }, color: P.ink, bold: i === 1, fontFace: h.MONO, fontSize: 17, align: "center", valign: "middle", margin: 0 });
      });
      h.arrow(s, h.MX + 4.45, y + 0.375, 8.15, y + 1.05, P.teal, 2.25);
      h.tx(s, "t0 points here", { x: 5.3, y: y + 0.15, w: 2.6, h: 0.3, fontSize: 13, italic: true, color: P.teal, align: "center" });
      h.arrow(s, 8.15, y + 1.25, h.MX + 4.45, y + 1.5, P.amber, 2.25);
      h.tx(s, "lw copies the contents", { x: 5.2, y: y + 1.55, w: 2.9, h: 0.3, fontSize: 13, italic: true, color: P.amber, align: "center" });
      h.codeBox(s, "la   t0, counter    # t0 = WHERE the value lives\nlw   t1, 0(t0)      # t1 = WHAT is stored there\naddi t1, t1, 1      # change the copy in the register\nsw   t1, 0(t0)      # memory still says 41 until this line", h.MX, 4.35, 8.0, 2.4, "asm", 15);
      h.card(s, 9.0, 4.35, h.W - h.MX - 9.0, 2.4, P.redSoft);
      h.tx(s, "Using an address where a value belongs, or the reverse, is one of the most common beginner errors. Comment every register: ADDRESS or VALUE.", { x: 9.2, y: 4.45, w: h.W - h.MX - 9.4, h: 2.2, fontSize: 15.5, valign: "middle" });
    }, "A label names a location. la gives the location, lw gives the contents. This is how every variable in every program ultimately works; we return to it formally with addressing modes."),
    WK("Step 4: make the counter visible", BAR, "lab1_step4_bar.png",
      "The bar grows from 0 to 255 pixels, then starts again. andi with 255 keeps only the low eight bits of the counter.",
      "Source: labs/05-asm-first-contact/step4_bar.S (the lines added to first_draw). Three future lectures hide in these eight lines: 255 = 0xFF (positional notation), andi as a bit mask (Boolean algebra), 0x07e0 as a colour (information encoding)."),

    H("Reading what you wrote", "The same program, seen as the processor sees it."),
    G("The instructions you have just used", ["Family", "Instruction", "What it does", "Example"], [
      ["Arithmetic", "add, sub", "combine two registers", "add t0, t1, t2"],
      ["Logic", "and, or, xor", "bitwise operation on two registers", "and t0, t1, t2"],
      ["Immediate", "addi, andi, ori, xori", "one register and one small constant", "addi t1, t1, 1"],
      ["Memory", "lw, sw", "load or store a 32-bit word", "lw t1, 0(t0)"],
      ["Control", "call, ret", "go to a function and come back", "call prg32_gfx_rect"],
    ], "The result goes in the first register. The base RISC-V integer instruction set (RV32I) has about forty instructions; you have already met a quarter of them.", { widths: [1.9, 3.2, 4.2, 3.3], mono: [1, 3] }),
    G("Pseudo-instructions: shortcuts the assembler expands", ["You write", "The assembler emits", "Meaning"], [
      ["li t0, 42", "addi t0, zero, 42", "load a constant"],
      ["mv t0, t1", "addi t0, t1, 0", "copy a register"],
      ["not t0, t1", "xori t0, t1, -1", "bitwise complement"],
      ["la t0, counter", "auipc t0, ... + addi t0, t0, ...", "load the address of a label"],
      ["ret", "jalr zero, 0(ra)", "jump to the address in ra"],
      ["beqz t0, skip", "beq t0, zero, skip", "branch if t0 is zero"],
    ], "A pseudo-instruction is not a separate hardware operation. The register zero is what makes many of them possible: a small instruction set, reused with care.", { widths: [3, 5, 4], mono: [0, 1] }),
    D("One instruction is one 32-bit number", (s, h) => {
      h.tx(s, "addi t1, t1, 1", { x: h.MX, y: h.TOP, w: h.CW, h: 0.6, fontSize: 28, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 0.4, h.TOP + 1.25, h.CW - 0.8, [
        { n: 12, label: "immediate\nthe constant 1", value: "000000000001", color: P.amber },
        { n: 5, label: "rs1\nt1 is x6", value: "00110", color: P.teal },
        { n: 3, label: "funct3\nadd", value: "000", color: P.violet },
        { n: 5, label: "rd\nt1 is x6", value: "00110", color: P.green },
        { n: 7, label: "opcode\nregister-immediate", value: "0010011", color: P.steel },
      ], { h: 0.8, minW: 1.3, fs: 17 });
      h.tx(s, "0x00130313", { x: h.MX, y: h.TOP + 3.05, w: h.CW, h: 0.7, fontSize: 34, bold: true, fontFace: h.MONO, color: P.ink, align: "center", valign: "middle" });
      h.card(s, h.MX, 5.55, h.CW, 1.2, P.tealSoft);
      h.tx(s, "Assembly is a readable spelling of machine code. The assembler translates each line into one 32-bit word; the processor reads the fields with logic circuits that we will design ourselves later in the course.", { x: h.MX + 0.3, y: 5.6, w: h.CW - 0.6, h: 1.1, fontSize: 17, valign: "middle" });
    }, "Check: 0000 0000 0001 | 00110 | 000 | 00110 | 0010011 = 0000 0000 0001 0011 0000 0011 0001 0011 = 0x00130313. Do not explain the formats now; the point is only that an instruction is data. Lecture 04 (digital information) and the lectures on the processor come back to this slide."),
    T("PRG32-QT: a microscope for registers", [
      "Runs the same cartridge on your desktop, one instruction at a time",
      "Stops between any two instructions and shows every register",
      "Step through first_update and watch t0 and t1 change",
      "Use the board when you want the truth about time, PRG32-QT when you want the truth about a register",
    ], "Demonstrate live: load step 3, break at first_update, single-step four times. Ask the students to predict each register before pressing the key.", { img: "prg32qt_debugger.png", cap: "The PRG32-QT debugger: source, registers, memory", wide: true }),
    G("Trace it by hand: three frames of first_update", ["Frame", "lw: t1 becomes", "addi: t1 becomes", "sw: counter becomes", "Bar width (andi 255)"], [
      ["1", "0", "1", "1", "1"],
      ["2", "1", "2", "2", "2"],
      ["256", "255", "256", "256", "0"],
      ["257", "256", "257", "257", "1"],
    ], "The by-hand trace is the most valuable debugging skill of the course. 256 = 1 0000 0000 in binary: the low eight bits are all zero, so the bar restarts.", { widths: [1.4, 2.6, 2.8, 3, 3], hi: { 2: P.amberSoft }, caption: "At frame 256 the counter keeps growing, but its low eight bits return to zero: the bar starts again." }),

    H("What comes next", "Every question raised here has a lecture that answers it."),
    G("Questions your program has already raised", ["You saw", "The question", "Answered in"], [
      ["0x07e0, 0xffff, 255", "Why do programmers write numbers in hexadecimal?", "Lectures 04 and 05"],
      ["a position below zero shown as 0xFFFFFFFF", "How does a register hold a negative number?", "Lecture 05"],
      ["a ball that moves less than a pixel per frame", "How do we represent fractions without an FPU?", "Lecture 06"],
      ["andi a2, t1, 255", "What does AND do to thirty-two bits at once?", "Lectures 08 and 09"],
      ["addi t1, t1, 1", "Which circuit actually adds two numbers?", "Lecture 09: the adders"],
      ["a pressed button is a 1", "What is a bit made of, physically?", "Lecture 10"],
      ["counter survives between frames", "How does a circuit remember a bit?", "Lectures 13 and 15"],
      ["0x00130313", "How does the processor decode and execute it?", "Lectures 18 and 19"],
      ["three functions and a rectangle", "Can I make a whole game out of this?", "Verm1: 07, 12, 17, 22"],
    ], "This is the forward map of the course. Keep a copy: each later deck opens by pointing at one of these rows. The last row is the project: Verm1 starts in Lecture 07 from exactly the skeleton of today.", { widths: [4.2, 5.2, 3], mono: [0] }),
    Q("After la t0, counter and lw t1, 0(t0), what does t0 hold?", ["The value of the counter", "The address of the counter", "Zero, because la clears the register", "The return address"], 1, "la loads the address of the label; lw then reads the value stored at that address into t1."),
    Q("A function that calls prg32_gfx_clear must save one register before the call. Which one?", ["a0, because it carries the argument", "sp, because the stack moves", "ra, because call overwrites it", "t0, because it is temporary"], 2, "call writes the return address in ra. The callee's own calls would overwrite it, so a non-leaf function saves ra on the stack and restores it before ret."),
    Q("t1 holds 300. What does andi a2, t1, 255 leave in a2?", ["300", "255", "45", "44"], 3, "300 = 256 + 44 = 1 0010 1100 in binary. AND with 1111 1111 keeps the low eight bits: 0010 1100 = 44."),
    X("Exercises on PRG32", [
      "Change the title string and its colour to yellow (0xffe0); run it again",
      "Make the bar grow twice as fast, then four times as fast, changing one instruction only",
      "Make the bar shrink instead of grow. What happens when the counter passes zero?",
      "In PRG32-QT, single-step first_update and write down t0 and t1 after each instruction",
      "Draw a second bar, in red, whose width is the counter modulo 64",
    ], "For exercise 3 the counter goes 0, then 0xFFFFFFFF: with andi 255 the bar jumps to 255 and shrinks. Keep the observation: Lecture 05 explains it.",
      "Hints: addi t1, t1, 2 or slli before andi for exercise 2; addi t1, t1, -1 for exercise 3; andi a2, t1, 63 for exercise 5. Each exercise is a seed for a later lecture."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["register", "registro", "stack", "pila (stack)"],
      ["load / store", "caricare / memorizzare", "stack pointer", "puntatore alla pila"],
      ["address", "indirizzo", "return address", "indirizzo di ritorno"],
      ["immediate", "immediato (costante)", "calling convention", "convenzione di chiamata"],
      ["branch", "salto condizionato", "machine code", "codice macchina"],
      ["label", "etichetta", "cartridge", "cartuccia"],
    ], "The course is taught in Italian; slides, notes and textbook exist in English and in Italian, and the technical documentation of PRG32 is in English. This table is repeated, topic by topic, in every deck.", { widths: [3, 3.2, 3, 3.2] }),
    T("Summary and reading", [
      "A RISC-V processor is thirty-two registers and a small set of instructions that compute, move and jump",
      "A PRG32 game is three functions; arguments travel in a0 to a7; a function that calls another saves ra",
      "Variables live in memory: la for the address, lw and sw for the value",
      "An instruction is a 32-bit number; assembly is its readable spelling",
      ["Reading", ["Playing with RISC-V, chapter 5: First Contact", "Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, chapter 2", "PRG32 repository: docs/learn/tutorial_ascii_game.md"]],
    ], "Next lecture: the history that led to this machine."),
  ],
});
