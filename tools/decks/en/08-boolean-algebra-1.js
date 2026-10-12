// Lecture 08 - Elements of Boolean algebra, part 1: the computer model, operators, properties.
// Source: 05-Architettura_dei_Calcolatori-Algebra_di_Boole.pptx (translated, figures redrawn, bitwise RISC-V section added).
const G5 = require("../../lib/gates");

function gateFig(type, a, b, out) {
  const one = type === "not", p = G5.pins(type, 70, 13);
  let w = "";
  if (one) w += G5.wire([[20, p.a[1]], p.a]) + G5.text(4, p.a[1] + 5, a, { size: 16 });
  else w += G5.wire([[20, p.a[1]], p.a]) + G5.wire([[20, p.b[1]], p.b]) + G5.text(4, p.a[1] + 5, a, { size: 16 }) + G5.text(4, p.b[1] + 5, b, { size: 16 });
  w += G5.wire([p.out, [165, p.out[1]]]) + G5.text(170, p.out[1] + 5, out, { size: 16 });
  return G5.doc(250, 70, w + G5.gate(type, 70, 13));
}

// One operator panel: name, gate symbol, notation, truth table.
async function opPanel(s, h, x, w, name, type, notation, rowsv, col, two) {
  h.card(s, x, h.TOP, w, h.BOT - h.TOP);
  h.pill(s, name, x + 0.25, h.TOP + 0.2, w - 0.5, 0.5, col, 18);
  await h.svg(s, gateFig(type, "x", "y", "z"), x + 0.3, h.TOP + 0.85, w - 0.6, 1.0);
  h.tx(s, notation, { x: x + 0.2, y: h.TOP + 1.95, w: w - 0.4, h: 0.55, fontSize: 15, align: "center", valign: "middle", fontFace: h.MONO, bold: true });
  const cw = two ? 0.8 : 1.0, tw = two ? cw * 3 : cw * 2;
  h.table(s, x + (w - tw) / 2, h.TOP + 2.65, two ? [cw, cw, cw] : [cw, cw], two ? ["x", "y", "z"] : ["x", "z"], rowsv, { fs: 15, mono: [0, 1, 2], align: "center", bold0: false, rowH: 0.4, headColor: col });
}

Deck({
  n: "08", file: "08-Computer_Architecture-Boolean_Algebra_1",
  title: "Elements of Boolean Algebra", short: "Boolean algebra (1)",
  sub: "Part 1: the computer as a logic machine; operators and their properties",
  quote: ["Oh dear! Oh dear! I shall be too late!", "Lewis Carroll, Alice's Adventures in Wonderland, 1865"],
  cover: "lab2_step1_lamps.png",
  notes: "Spiral: the students have used andi to test a button since the first days. The lecture names what they did (a mask is an AND), then builds the algebra, then returns to the bitwise instructions.",
  slides: [
    O("What you will be able to do by the end", [
      "Describe a computer as processor, memory and input/output, connected by a bus",
      "Explain the difference between the analysis and the synthesis of a logic circuit",
      "Write the truth tables of AND, OR, NOT, XOR, NAND and NOR and recognise their symbols",
      "Apply the properties of Boolean algebra, De Morgan's laws included, to simplify an expression",
      "Use and, or, xor and not on RISC-V to test, set, clear and toggle single bits",
    ]),

    H("Warm-up on the machine", "You have been doing Boolean algebra since the first days."),
    K("Is LEFT pressed?", `    call prg32_input_read    # a0 = all the buttons, one bit each
    mv   t0, a0              # keep our own copy

    andi t3, t0, 0x01        # keep only bit 0: LEFT
    beqz t3, 1f              # zero: LEFT is not pressed
    addi t2, t2, -2          # move left
1:
    andi t3, t0, 0x02        # keep only bit 1: RIGHT
    beqz t3, 2f
    addi t2, t2, 2           # move right
2:`, [
      "prg32_input_read returns all the buttons at once: one bit per button",
      "andi with 0x01 keeps bit 0 and forces every other bit to zero",
      "The result is non-zero exactly when LEFT is pressed",
      "andi is thirty-two AND gates working side by side: what is an AND, exactly?",
    ], "From textbook chapter 6 (State and Input) and lab 06-asm-state-and-input. The constant used with andi is called a mask."),
    T("One bit per button", [
      "LEFT 0x01, RIGHT 0x02, UP 0x04, DOWN 0x08: bits 0 to 3",
      "A 0x10, B 0x20, START / SELECT 0x40: bits 4 to 6",
      "Holding RIGHT and A together gives 0x12 = 0001 0010",
      "Each lamp of the lab is one bit of the mask: lit when the bit is 1",
      "Every question about the joystick is a Boolean expression over these variables",
    ], "Button constants from prg32.h (PRG32_BTN_*). Player two uses the same layout in higher bits.", { img: "lab2_step1_lamps.png", cap: "Lab 06, step 1: seven lamps, one per button bit" }),

    H("The computer as a logic machine", "One level below the instructions."),
    D("The electronic computer: three subsystems and a bus", (s, h) => {
      const y = h.TOP + 0.1, g = 0.8, bw = (h.CW - 2 * g) / 3, bh = 2.3, x0 = h.MX;
      const box = (i, title, sub, col) => { const x = x0 + i * (bw + g);
        s.addText([{ text: title, options: { bold: true, fontSize: 20, breakLine: true } }, { text: sub, options: { fontSize: 14 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.08, x, y, w: bw, h: bh,
          fill: { color: col }, line: { color: col, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 8 });
        h.line(s, x + bw / 2 - 0.25, y + bh, x + bw / 2 - 0.25, y + bh + 0.55, P.steel, 3); h.line(s, x + bw / 2 + 0.25, y + bh, x + bw / 2 + 0.25, y + bh + 0.55, P.steel, 3); };
      box(0, "Processor (CPU)", "control unit, ALU, registers\nexecutes the instructions", P.teal);
      box(1, "Main memory", "holds the instructions\nand the data", P.steel);
      box(2, "Input / output", "joystick, display, sound,\nnetwork, storage", P.green);
      s.addText("Bus: address lines, data lines, control lines", { isTextBox: true, shape: h.pres.ShapeType.rect, x: x0, y: y + bh + 0.55, w: 3 * bw + 2 * g, h: 0.6, fill: { color: P.amber }, line: { color: P.amber, width: 0 }, color: P.white, bold: true, fontFace: h.BODY, fontSize: 17, align: "center", valign: "middle", margin: 0 });
      h.rows(s, ["The von Neumann model in today's terms: the units of 1945, connected by shared wires",
        "Everything that travels on the bus is a pattern of bits"], h.MX, 5.45, h.CW, 1.3);
    }, "Replaces the two pictures of the source deck (von Neumann model; architecture with bus). On the ESP32-C6 the three subsystems and the bus are all inside one chip."),
    T("The processor", [
      "The processing capability of the computer resides in the processor",
      "It can execute a set of elementary actions, more or less complex: the instructions",
      ["Instructions are explicit commands that", ["govern the transfer of information inside the computer and between the computer and the I/O devices", "specify the arithmetic and logic operations to perform"]],
      "Main memory holds the input and output data of the computation, and the sequence of instructions",
      "A sequence of instructions stored in main memory is a program",
    ], "RV32I: about forty instructions. You have used addi, lw, sw, andi, beqz, call and ret: transfer, arithmetic, logic and control are all there.", { big: "fetch, execute, repeat", label: "the processor takes the instructions from memory and executes them, one by one" }),
    C("What kind of system is an electronic computer?", [
      ["Numeric", "It is a digital system: all the information it handles is expressed as strings of bits."],
      ["Automatic", "Once started it proceeds by itself, instruction after instruction, with no human intervention."],
      ["Stored-program", "The program is recorded in memory and can be replaced: the same machine does different jobs."],
      ["Electronic", "It is built from electronic circuits that store bits and process them."],
    ]),
    T("Logic circuits", [
      "All the information handled by a numeric device is expressed by strings of bits",
      "The electronic circuits that store bits and process them are called switching circuits, or logic circuits",
      "A logic circuit forms a switching network; designing it is called logic design",
      "To describe the behaviour of logic circuits we use an algebra: a mathematical notation that simplifies the analysis and the synthesis of logic networks",
    ], "Switching circuits: circuiti di commutazione. The algebra is Boole's (1854), applied to switches by Nakajima and Shannon in the 1930s (Lecture 03).", { big: "0 and 1", label: "two voltage levels on a wire, two states of a switch, two values of a Boolean variable" }),
    V("Two problems, one algebra",
      ["Analysis", ["Given: the description of the STRUCTURE of a circuit (how it is made)", "Find: its BEHAVIOUR (what it does)", "Example: reading a schematic and deriving its truth table", "Example: reading andi t3, t0, 1 and saying what ends up in t3"]],
      ["Synthesis", ["Given: the description of the BEHAVIOUR (what it must do)", "Find: a STRUCTURE that realises it (how to build it)", "Example: from the truth table of a sum to an adder circuit", "Example: from 'move if LEFT or RIGHT is pressed' to a mask and a branch"]],
      "Synthesis usually has many solutions; choosing the cheapest is the minimisation problem of Lecture 09."),

    H("Boolean algebra", "Variables with two values, three basic operations."),
    DEF("Boolean algebra", "Definition", "The algebra used to analyse and to synthesise logic circuits: variables that can take only two values, 0 and 1, and three basic operations.", [
      "Variables are binary and are usually written with letters: A, B, ... or x, y, ...",
      "AND, the logical product: written x AND y, or x . y, or simply xy",
      "OR, the logical sum: written x OR y, or x + y",
      "NOT, the complement: written NOT x, or x', or x with a bar above it",
    ], "Conjunction, disjunction, negation: congiunzione, disgiunzione, negazione. In these slides the complement is written with a prime (x') so that it can be typed."),
    D("The three fundamental operations", async (s, h) => {
      const w = (h.CW - 0.6) / 3;
      await opPanel(s, h, h.MX, w, "AND (conjunction)", "and", "z = x . y", [["0", "0", "0"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]], P.teal, true);
      await opPanel(s, h, h.MX + w + 0.3, w, "OR (disjunction)", "or", "z = x + y", [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]], P.amber, true);
      await opPanel(s, h, h.MX + 2 * (w + 0.3), w, "NOT (negation)", "not", "z = x'", [["0", "1"], ["1", "0"]], P.violet, false);
    }, "AND is 1 only when both inputs are 1; OR is 0 only when both inputs are 0; NOT inverts. A truth table lists the output for every combination of the inputs."),
    D("Three more gates you will meet everywhere", async (s, h) => {
      const w = (h.CW - 0.6) / 3;
      await opPanel(s, h, h.MX, w, "XOR (exclusive or)", "xor", "z = x'y + xy'", [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]], P.green, true);
      await opPanel(s, h, h.MX + w + 0.3, w, "NAND (not and)", "nand", "z = (x . y)'", [["0", "0", "1"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]], P.red, true);
      await opPanel(s, h, h.MX + 2 * (w + 0.3), w, "NOR (not or)", "nor", "z = (x + y)'", [["0", "0", "1"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "0"]], P.steel, true);
    }, "New slide. XOR is 1 when the inputs differ: it is the sum bit of an addition, and RISC-V has it as an instruction. The small circle on a symbol means negation."),
    G("Properties of Boolean algebra (1)", ["Property", "AND form", "OR form"], [
      ["Commutative", "x . y = y . x", "x + y = y + x"],
      ["Associative", "(x . y) . z = x . (y . z)", "(x + y) + z = x + (y + z)"],
      ["Idempotence", "x . x = x", "x + x = x"],
      ["Absorption", "x . (x + y) = x", "x + (x . y) = x"],
    ], "Because of the associative property AND and OR can be defined on more than two operands: x . y . z. Every property comes in a pair: swap AND with OR.", { widths: [2.6, 4.8, 4.8], mono: [1, 2], fs: 21, caption: "By associativity AND and OR extend to any number of operands: x . y . z, x + y + z." }),
    G("Properties of Boolean algebra (2)", ["Property", "AND form", "OR form"], [
      ["Distributive", "x . (y + z) = x . y + x . z", "x + y . z = (x + y) . (x + z)"],
      ["Identity element", "x . 1 = x", "x + 0 = x"],
      ["Null element", "x . 0 = 0", "x + 1 = 1"],
      ["Complement", "x . x' = 0", "x + x' = 1"],
      ["Involution", "(x')' = x", ""],
    ], "The second distributive law has no counterpart in ordinary algebra. The source slide called involution 'convoluzione' and grouped identity and null element as 'minimum and maximum'; the complement laws are added here.", { widths: [2.3, 4.7, 5.2], mono: [1, 2], fs: 19, caption: "Careful: OR distributes over AND too. This is false for ordinary sum and product." }),
    D("De Morgan's laws", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.6, 1.15, P.tealSoft); h.card(s, h.MX, h.TOP + 1.35, 5.6, 1.15, P.amberSoft);
      h.tx(s, "(x . y)' = x' + y'", { x: h.MX, y: h.TOP, w: 5.6, h: 1.15, fontSize: 28, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.tx(s, "(x + y)' = x' . y'", { x: h.MX, y: h.TOP + 1.35, w: 5.6, h: 1.15, fontSize: 28, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.rows(s, ["The complement of a product is the sum of the complements, and vice versa",
        "Proof by perfect induction: check every row of the truth table",
        "A NAND is an OR of the negated inputs; a NOR is an AND of the negated inputs"], h.MX, h.TOP + 2.75, 5.6, h.BOT - h.TOP - 2.75);
      const cw = 1.03;
      h.table(s, 6.55, h.TOP, [0.7, 0.7, cw, cw, 0.75, 0.75, 1.2], ["x", "y", "x . y", "(x . y)'", "x'", "y'", "x' + y'"],
        [["0", "0", "0", "1", "1", "1", "1"], ["0", "1", "0", "1", "1", "0", "1"], ["1", "0", "0", "1", "0", "1", "1"], ["1", "1", "1", "0", "0", "0", "0"]],
        { fs: 16, mono: [0, 1, 2, 3, 4, 5, 6], align: "center", bold0: false, rowH: 0.5, cellHi: { "0,3": P.tealSoft, "1,3": P.tealSoft, "2,3": P.tealSoft, "3,3": P.tealSoft, "0,6": P.tealSoft, "1,6": P.tealSoft, "2,6": P.tealSoft, "3,6": P.tealSoft } });
      h.tx(s, "The two highlighted columns are identical: the first law holds. The second is proved the same way.", { x: 6.6, y: h.TOP + 2.75, w: 6.13, h: 0.9, fontSize: 15, italic: true, color: P.mute });
    }, "Augustus De Morgan, 1847. The laws generalise to any number of variables. The source deck showed the proof as a picture."),
    T("Duality and precedence", [
      ["Duality principle: every identity stays true if you swap AND with OR and 0 with 1", ["x . 1 = x becomes x + 0 = x; De Morgan's two laws are each other's dual"]],
      ["Precedence: NOT first, then AND, then OR, as with powers, products and sums", ["x + y . z' means x + (y . (z'))"]],
      "Parentheses change the order, exactly as in ordinary algebra",
      "Two expressions are equivalent if they have the same truth table",
    ], "Duality halves the work: prove one law of each pair and the other follows."),
    G("Simplifying with the algebra", ["Expression", "Law applied"], [
      ["x . y + x . y'", "the expression to simplify: three gates and an inverter"],
      ["= x . (y + y')", "distributive law, read from right to left"],
      ["= x . 1", "complement law: y + y' = 1"],
      ["= x", "identity element: only a wire is left"],
    ], "Two literals and three gates become a wire. The identity in the caption (sometimes called the simplification theorem) uses the distributive law of OR over AND; it is used again in Lecture 09.", { widths: [4.4, 7.8], mono: [0], fs: 22, caption: "In the same way: x + x' . y = (x + x') . (x + y) = 1 . (x + y) = x + y" }),

    H("Back to the machine", "Thirty-two gates per instruction."),
    G("Bitwise instructions: the algebra on a whole register", ["Instruction", "Operation", "a = 1100 1010, b = 0000 1111", "In C"], [
      ["and  t0, a, b", "bit by bit AND", "0000 1010", "a & b"],
      ["or   t0, a, b", "bit by bit OR", "1100 1111", "a | b"],
      ["xor  t0, a, b", "bit by bit XOR", "1100 0101", "a ^ b"],
      ["not  t0, a", "complement every bit", "0011 0101", "~a"],
    ], "Each instruction applies the same gate to all thirty-two pairs of bits at once (eight shown). The immediate forms andi, ori and xori take a 12-bit constant; not is the pseudo-instruction xori t0, a, -1, because -1 is all ones.", { widths: [3, 3, 4.2, 2], mono: [0, 2, 3], caption: "Each instruction applies one gate to every bit position at once. not is a pseudo-instruction: xori with -1, that is, with all ones." }),
    G("Four things to do with a mask", ["Goal", "Law used", "Instruction (bit 4 = button A)", "Effect on the other bits"], [
      ["Test a bit", "x . 1 = x,  x . 0 = 0", "andi t1, t0, 0x10", "forced to 0 in the result"],
      ["Set a bit to 1", "x + 1 = 1,  x + 0 = x", "ori  t0, t0, 0x10", "unchanged"],
      ["Clear a bit to 0", "x . 0 = 0,  x . 1 = x", "andi t0, t0, ~0x10", "unchanged"],
      ["Toggle a bit", "x xor 1 = x',  x xor 0 = x", "xori t0, t0, 0x10", "unchanged"],
    ], "The identity and null-element laws are exactly what makes a mask work: a 1 in the mask lets the bit through (AND) or forces it (OR); a 0 does the opposite. ~0x10 is 0xFFFFFFEF, which the assembler encodes as the immediate -17.", { widths: [2.4, 3.6, 3.8, 3], mono: [1, 2] }),
    K("De Morgan at the joystick", `# "idle" when NEITHER LEFT NOR RIGHT is pressed
    andi t3, t0, 0x03        # 0x03 = LEFT | RIGHT: keep both bits
    beqz t3, idle            # all zero: (LEFT + RIGHT)' is true

# the long way: test each button, the result is the same
    andi t3, t0, 0x01
    bnez t3, moving          # LEFT pressed: not idle
    andi t3, t0, 0x02
    bnez t3, moving          # RIGHT pressed: not idle
    j    idle                # LEFT' . RIGHT'`, [
      "A mask with two bits tests two buttons in one instruction",
      "The result is zero only if both bits are zero: NOT (LEFT OR RIGHT)",
      "By De Morgan this equals (NOT LEFT) AND (NOT RIGHT): the long way below",
      "The algebra tells you that the two programs are equivalent, and which is cheaper",
    ], "(x + y)' = x' . y'. Two instructions instead of five: minimisation is not only for hardware."),
    WK("One lamp per bit: shifting and masking", `    # s0 = bit number, 0 to 6
    la   t0, buttons
    lw   t1, 0(t0)           # t1 = the button mask
    srl  t1, t1, s0          # bring bit number s0 down to bit 0
    andi t1, t1, 1           # keep it, clear all the others
    li   a4, GREY            # lamp off
    beqz t1, 1f
    li   a4, YELLOW          # lamp on
1:  call prg32_gfx_rect`, "lab2_step1_lamps.png",
      "Shift, then mask with 1: the standard way to read bit number n of a word.",
      "Source: textbook lab 06-asm-state-and-input, step1_lamps.S (inside lamp_loop). srl is a logical shift right (Lecture 05)."),

    Q("For which inputs is x NAND y equal to 0?", ["x = 0, y = 0", "x = 0, y = 1", "x = 1, y = 1", "never"], 2, "NAND is the complement of AND: it is 0 only when both inputs are 1."),
    Q("By De Morgan, (a . b')' is equal to:", ["a' . b", "a' + b", "a + b'", "a' + b'"], 1, "(a . b')' = a' + (b')' = a' + b, using involution on the second term."),
    Q("t0 = 0x0000005A. What is in t1 after andi t1, t0, 0x0F?", ["0x0000005A", "0x00000050", "0x0000000A", "0x0000000F"], 2, "0x5A = 0101 1010; AND with 0000 1111 keeps the low nibble: 1010 = 0xA."),
    Q("Which instruction turns bit 5 of t0 to 1 and leaves every other bit unchanged?", ["andi t0, t0, 0x20", "ori t0, t0, 0x20", "xori t0, t0, 0x20", "addi t0, t0, 0x20"], 1, "OR with a mask: x + 1 = 1 on bit 5, x + 0 = x elsewhere. xori would toggle it; addi would carry into bit 6 if the bit was already 1."),
    X("Exercises: paper first, then PRG32", [
      "Prove the second De Morgan law, (x + y)' = x' . y', with a truth table",
      "Simplify with the algebra: x . y + x . y' . z + x' . y, naming the law used at each step",
      "Write the mask and the instruction that test whether A and B are pressed together",
      "Change the lamp program so that the lamps show the complement of the buttons (lit when released)",
      "Convert a letter from upper to lower case and back using one bitwise instruction (hint: ASCII, Lecture 04)",
    ], "On PRG32: all seven lamps lit at rest, each one going dark while its button is held. For the letter: xori with 0x20 toggles bit 5.",
      "Exercise 2: x y + x y' z + x' y = y (x + x') + x y' z = y + x y' z = y + x z. Exercise 3: andi t1, t0, 0x30 then compare with 0x30 (li t2, 0x30; beq t1, t2, both): testing for non-zero would mean A OR B."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["logic circuit", "circuito logico", "truth table", "tabella di verità"],
      ["switching network", "rete di commutazione", "logic gate", "porta logica"],
      ["analysis / synthesis", "analisi / sintesi", "complement", "complemento (negazione)"],
      ["logical product (AND)", "prodotto logico (congiunzione)", "duality", "dualità"],
      ["logical sum (OR)", "somma logica (disgiunzione)", "mask", "maschera"],
      ["involution", "involuzione", "to set / clear / toggle", "porre a 1 / azzerare / invertire"],
    ], null, { widths: [3.2, 3.4, 2.8, 3.2] }),
    T("Conclusions and reading", [
      "The von Neumann architecture represents a real machine in simplified form: processor, memory, input/output",
      "Boolean algebra represents logic functions that can be implemented with electronic circuits",
      "Three operations, a handful of properties and De Morgan's laws are enough to transform any expression",
      "A bitwise instruction is the algebra applied to thirty-two bits at once; a mask is the identity law at work",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, appendix A (The Basics of Logic Design)", "Playing with RISC-V, chapter 6: State and Input: Branches, Bitmasks, and Boundaries", "Bucci: Architettura dei calcolatori elettronici, chapters on Boolean algebra"]],
    ], "Next lecture: Boolean functions, canonical forms and minimisation."),
  ],
});
