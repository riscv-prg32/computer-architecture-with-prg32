// Lecture 05 - Number representation, part 1: bases, naturals, signed integers, overflow.
// Source: 03-Architettura_dei_Calcolatori-Rappresentazione_Numeri.pptx (translated, figures redrawn, RISC-V section added).
const G3 = require("../../lib/gates");

function wheelSvg() {
  const S = 500, c = S / 2, r1 = 140, r2 = 198, r0 = 92;
  let out = `<circle cx="${c}" cy="${c}" r="${r1 + 28}" fill="#EEF2F4"/><circle cx="${c}" cy="${c}" r="${r1 - 30}" fill="#fff"/>`;
  for (let k = 0; k < 16; k++) {
    const a = (k * 22.5 - 90) * Math.PI / 180, neg = k >= 8, v = neg ? k - 16 : k;
    const bx = c + r1 * Math.cos(a), by = c + r1 * Math.sin(a), vx = c + r2 * Math.cos(a), vy = c + r2 * Math.sin(a), ux = c + r0 * Math.cos(a), uy = c + r0 * Math.sin(a);
    out += G3.text(bx, by + 5, k.toString(2).padStart(4, "0"), { anchor: "middle", size: 17, fill: "#1B2530" });
    out += `<circle cx="${vx}" cy="${vy}" r="22" fill="${neg ? "#C7791B" : "#0E7C86"}"/>` + G3.text(vx, vy + 6, (v > 0 ? "+" : "") + v, { anchor: "middle", size: 18, fill: "#fff" });
    out += G3.text(ux, uy + 4, String(k), { anchor: "middle", size: 12, fill: "#5B6B78", bold: false });
  }
  const sep = (deg, col) => { const a = (deg - 90) * Math.PI / 180; return `<line x1="${c + 60 * Math.cos(a)}" y1="${c + 60 * Math.sin(a)}" x2="${c + 232 * Math.cos(a)}" y2="${c + 232 * Math.sin(a)}" stroke="${col}" stroke-width="3" stroke-dasharray="7 5"/>`; };
  out += sep(168.75, "#B23A48") + sep(-11.25, "#6B4FA0");
  out += G3.text(c, c - 8, "+1", { anchor: "middle", size: 22, fill: "#2E4A62" }) + G3.text(c, c + 16, "clockwise", { anchor: "middle", size: 13, fill: "#5B6B78", bold: false });
  out += G3.text(c - 6, S - 8, "signed overflow", { anchor: "end", size: 13, fill: "#B23A48" }) + G3.text(c - 12, 16, "unsigned carry", { anchor: "end", size: 13, fill: "#6B4FA0" });
  return G3.doc(S, S, out);
}

// A worked calculation: decimal on the left, binary on the right.
function calc(s, h, x, y, w, title, dec, bin, note, col) {
  const hh = 2.25;
  h.card(s, x, y, w, hh);
  h.tx(s, title, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.35, fontSize: 14, bold: true, color: col || P.steel });
  h.tx(s, dec.join("\n"), { x: x + 0.2, y: y + 0.5, w: w * 0.34, h: 1.2, fontSize: 16, fontFace: h.MONO, align: "right", color: P.mute });
  h.tx(s, bin.join("\n"), { x: x + w * 0.4, y: y + 0.5, w: w * 0.6 - 0.25, h: 1.2, fontSize: 16, fontFace: h.MONO, bold: true, align: "right" });
  if (note) h.tx(s, note, { x: x + 0.2, y: y + hh - 0.52, w: w - 0.4, h: 0.45, fontSize: 12.5, italic: true, color: col || P.mute, valign: "middle" });
}

Deck({
  n: "05", file: "05-Computer_Architecture-Number_Representation_Integers",
  title: "Number Representation: Integers", short: "Number representation (integers)",
  sub: "Bases, natural numbers, two's complement and overflow",
  quote: ["I may count for little, it's true, said the One to the Zero, but what are you worth? Nothing: nothing at all.", "Trilussa, Nummeri, 1944"],
  cover: "lab2_step2_move.png",
  notes: "Original quotation (Romanesco): «Conterò poco, è vero: - diceva l'Uno ar Zero - ma tu che vali? Gnente: propio gnente.» Spiral: the lecture opens with the marker of textbook lab 06 moving left past zero, and closes by explaining it.",
  slides: [
    O("What you will be able to do by the end", [
      "Convert integers and fractions between bases 2, 8, 10 and 16",
      "Say which natural numbers fit in n bits and recognise an overflow",
      "Encode and decode signed integers in sign and magnitude and in two's complement",
      "Add, subtract and negate in two's complement, and detect overflow",
      "Explain why 0 - 1 shows as 0xFFFFFFFF in a RISC-V register",
      "Choose the right RISC-V instruction for signed and for unsigned data",
    ]),

    H("Warm-up on the machine", "A marker that walks off the left edge of the number line."),
    K("Hold LEFT and watch the number", `steer_update:
    ...
    call prg32_input_read      # a0 = button mask
    mv   t0, a0

    la   t1, marker_x
    lw   t2, 0(t1)             # t2 = marker_x, starts at 2
    andi t3, t0, BTN_LEFT      # is LEFT pressed?
    beqz t3, 1f
    addi t2, t2, -1            # one step to the left
1:  sw   t2, 0(t1)
    ...
# draw prints marker_x with prg32_console_hex32`, [
      "Hold LEFT: the value shown goes 00000002, 00000001, 00000000 ...",
      "... and then FFFFFFFF. Is it a bug?",
      "Is 0xFFFFFFFF the number 4,294,967,295 or the number -1?",
      "Both. It depends on how you read the bits: this lecture gives the rules",
    ], "Adapted from textbook lab 06-asm-state-and-input (step2_move.S) with SPEED 1 and a console print. Where to look: on the board and in QEMU the console is drawn on the screen, as 0x00000002 ... 0xffffffff; PRG32-QT does not draw the console, it collects it in its log, as 00000002 ... FFFFFFFF. Run it live before any theory, and write the students' guesses on the board."),

    H("Bases and conversions"),
    G("Positional systems: base 2, 8, 10 and 16", ["Base b", "Digits", "Name", "Thirteen is written"], [
      ["2", "0, 1", "binary", "1101"],
      ["8", "0, 1, ..., 7", "octal", "15"],
      ["10", "0, 1, ..., 9", "decimal", "13"],
      ["16", "0, ..., 9, A, ..., F", "hexadecimal", "D"],
    ], "A number N is a string of digits d(n-1) ... d(1) d(0), each smaller than the base b. The value is the sum of each digit times the power of the base of its position.", { widths: [1.6, 3.6, 3, 3.4], mono: [1, 3], fs: 22, caption: "N = d(n-1) x b^(n-1) + ... + d(1) x b + d(0), with every digit between 0 and b - 1." }),
    D("Bases that are powers of two share the same bits", (s, h) => {
      const x = 4.7, y = h.TOP + 0.35;
      h.tx(s, "127 in base 10", { x: h.MX, y: y - 0.05, w: x - h.MX - 0.3, h: 0.7, fontSize: 18, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, y, 0.62, [..."01111111"].map((b) => ({ val: b })), { h: 0.7, fs: 22 });
      h.tx(s, "groups of 4: hexadecimal", { x: h.MX, y: y + 1.3, w: x - h.MX - 0.3, h: 0.7, fontSize: 18, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, y + 1.3, 2.48, [{ val: "0111 = 7", color: P.teal }, { val: "1111 = F", color: P.amber }], { h: 0.7, fs: 20 });
      h.tx(s, "= 0x7F", { x: x + 5.1, y: y + 1.3, w: 2.2, h: 0.7, fontSize: 24, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "groups of 3: octal", { x: h.MX, y: y + 2.6, w: x - h.MX - 0.3, h: 0.7, fontSize: 18, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, y + 2.6, 1.24, [{ val: "01 = 1", color: P.violet }], { h: 0.7, fs: 18 });
      h.mem(s, x + 1.24, y + 2.6, 1.86, [{ val: "111 = 7", color: P.green }, { val: "111 = 7", color: P.red }], { h: 0.7, fs: 20 });
      h.tx(s, "= 177 octal", { x: x + 5.1, y: y + 2.6, w: 3, h: 0.7, fontSize: 24, bold: true, fontFace: h.MONO, valign: "middle" });
      h.card(s, h.MX, 5.6, h.CW, 1.15, P.tealSoft);
      h.tx(s, "If each digit is written in pure binary, the bits of a number are the same in every base b = 2^k: group them from the right, k at a time. Example: 13 = 1101 in binary = 15 in octal = D in hexadecimal.", { x: h.MX + 0.3, y: 5.65, w: h.CW - 0.6, h: 1.05, fontSize: 16.5, valign: "middle" });
    }, "Group from the right (the least significant end) and pad with zeros on the left."),
    D("Converting an integer: repeated division", (s, h) => {
      h.tx(s, "Divide N by the base r; the remainder is the next digit, starting from the least significant. Repeat on the quotient until it is zero.", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.7, fontSize: 17, valign: "middle" });
      const y = h.TOP + 1.05, t = (x, title, head, rowsv, res, w) => {
        h.tx(s, title, { x, y: y - 0.38, w: w * 3, h: 0.34, fontSize: 15, bold: true, color: P.steel });
        h.table(s, x, y, [w, w, w], head, rowsv, { fs: 16, mono: [0, 1, 2], align: "center", bold0: false });
        h.tx(s, res, { x, y: y + 0.36 * (rowsv.length + 1) + 0.12, w: w * 3 + 0.6, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      };
      t(h.MX, "r = 8", ["N", "N / 8", "N mod 8"], [["127", "15", "7"], ["15", "1", "7"], ["1", "0", "1"]], "127 = 177 octal", 1.1);
      t(h.MX + 4.2, "r = 16", ["N", "N / 16", "N mod 16"], [["127", "7", "15 = F"], ["7", "0", "7"]], "127 = 0x7F", 1.15);
      t(h.MX + 8.45, "r = 2", ["N", "N / 2", "N mod 2"], [["127", "63", "1"], ["63", "31", "1"], ["31", "15", "1"], ["15", "7", "1"], ["7", "3", "1"], ["3", "1", "1"], ["1", "0", "1"]], "127 = 1111111", 1.1);
      h.card(s, h.MX, 5.3, 7.9, 1.45, P.amberSoft);
      h.tx(s, "Read the remainders from the bottom up: the last remainder is the most significant digit. The method follows from N = Q x r + R, applied again and again to the quotient.", { x: h.MX + 0.25, y: 5.35, w: 7.4, h: 1.35, fontSize: 16, valign: "middle" });
    }, "N = Q(n) r^(n+1) + R(n) r^n + ... + R(1) r + R(0). In C the two operations are / and %; in RISC-V (M extension) they are divu and remu."),
    D("Converting a fraction: repeated multiplication", (s, h) => {
      h.tx(s, "For 0 <= N < 1, multiply by the base r: the integer part of the product is the next digit, starting from the most significant. Repeat on the fractional part.", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.7, fontSize: 17, valign: "middle" });
      const y = h.TOP + 1.1, w = [2.1, 1.7, 1.7];
      h.tx(s, "0.875 in base 2: exact", { x: h.MX, y: y - 0.38, w: 5.5, h: 0.34, fontSize: 15, bold: true, color: P.steel });
      h.table(s, h.MX, y, w, ["Multiply", "Fraction", "Digit"], [["0.875 x 2", "0.75", "1"], ["0.75 x 2", "0.5", "1"], ["0.5 x 2", "0", "1"]], { fs: 16, mono: [0, 1, 2], align: "center", bold0: false });
      h.tx(s, "0.875 = 0.111 in binary", { x: h.MX, y: y + 1.65, w: 5.5, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      const x2 = h.MX + 6.6;
      h.tx(s, "0.8 in base 2: periodic", { x: x2, y: y - 0.38, w: 5.5, h: 0.34, fontSize: 15, bold: true, color: P.steel });
      h.table(s, x2, y, w, ["Multiply", "Fraction", "Digit"], [["0.8 x 2", "0.6", "1"], ["0.6 x 2", "0.2", "1"], ["0.2 x 2", "0.4", "0"], ["0.4 x 2", "0.8", "0"], ["0.8 x 2", "0.6", "1 ..."]], { fs: 16, mono: [0, 1, 2], align: "center", bold0: false, hi: { 4: P.amberSoft } });
      h.tx(s, "0.8 = 0.1100 1100 1100 ...", { x: x2, y: y + 2.38, w: 5.5, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      h.card(s, h.MX, 5.55, h.CW, 1.2, P.redSoft);
      h.tx(s, "A fraction that is finite in base 10 can be periodic in base 2. With a finite number of bits it must be cut: this is where the approximation errors of real numbers come from (Lecture 06).", { x: h.MX + 0.3, y: 5.6, w: h.CW - 0.6, h: 1.1, fontSize: 16.5, valign: "middle" });
    }, "N = R(1) r^-1 + R(2) r^-2 + ... The source slides linked two online converters (fermimn.edu.it and fauser.edu); any modern calculator in programmer mode does the same."),

    H("Natural numbers and overflow"),
    T("Encoding strategies", [
      "A representation is a law X = R(x) that associates a number x with a string of bits X",
      "The number of bits depends on how many numbers we want to represent: usually a multiple of 8, typically 16, 32 or 64",
      "R is chosen according to the kind of numbers: naturals, signed integers, rationals",
      "A good R makes arithmetic operations and comparisons simple to build as circuits",
    ], null, { big: "X = R(x)", label: "x is the number we mean; X is the pattern of bits stored in the register" }),
    D("Natural numbers on n bits", (s, h) => {
      h.rows(s, ["With n bits there are 2^n patterns: the naturals from 0 to 2^n - 1",
        "Each number is associated with the string of bits that represents it in the binary positional system"], h.MX, h.TOP, h.CW, 1.35);
      const cw = h.CW / 16, y = 3.85;
      h.tx(s, "Example: n = 4, range [0, 15]", { x: h.MX, y: y - 0.75, w: h.CW, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      h.mem(s, h.MX, y, cw, Array.from({ length: 16 }, (_, i) => ({ val: i.toString(2).padStart(4, "0"), label: String(i) })), { h: 0.7, fs: 13.5, labelFs: 16 });
      h.table(s, h.MX, 5.2, [3, 3, 3, 3.133], ["Bits", "Range", "RISC-V", "Maximum"], [["8", "0 ... 2^8 - 1", "byte (lbu)", "255"], ["16", "0 ... 2^16 - 1", "halfword (lhu)", "65,535"], ["32", "0 ... 2^32 - 1", "word, register", "4,294,967,295"]], { fs: 15, mono: [1] });
    }, "4,294,967,295 is the unsigned reading of 0xFFFFFFFF: the first half of the answer to the warm-up."),
    T("Properties of binary strings", [
      ["Extension on the left with zeros does not change the value", ["5 = 101 = 00101"]],
      ["Multiplying by 2^k is a shift left by k positions", ["00101 x 2 = 01010: five becomes ten"]],
      ["Integer division by 2^k is a shift right by k positions", ["00101 / 2 = 00010: five becomes two, the remainder is lost"]],
      "Shifts are much cheaper than multiplications: compilers use them whenever they can",
    ], "You used slli t1, t1, 2 in Lecture 04 to multiply an array index by four. Shifts are also the basis of fixed-point arithmetic (Lecture 06).", { code: "# multiply by 4\nslli t0, t0, 2\n\n# divide by 2 (unsigned)\nsrli t0, t0, 1\n\n# x * 10 = x*8 + x*2\nslli t1, t0, 3\nslli t2, t0, 1\nadd  t0, t1, t2", wide: true, h: 3.9 }),
    DEF("Overflow", "Definition", "An overflow occurs when the result of an operation is not contained in the finite subset of numbers that the available bits can represent.", [
      "Registers have a finite size and there is a finite number of them",
      "Number sets are infinite: only a finite subset can be represented",
      "Arithmetic operators are closed on the whole set, not on the finite subset",
      "With 7 bits we encode [0, 127]: 100 and 38 are representable, their sum 138 is not",
    ]),
    D("Arithmetic on four bits", (s, h) => {
      const w = (h.CW - 0.9) / 4, y = h.TOP + 0.05;
      calc(s, h, h.MX, y, w, "Sum", ["6 +", "8 =", "14"], ["0110 +", "1000 =", "1110"], "fits in four bits");
      calc(s, h, h.MX + (w + 0.3), y, w, "Sum with overflow", ["14 +", "3 =", "17"], ["1110 +", "0011 =", "1 0001"], "a fifth bit is needed", P.red);
      calc(s, h, h.MX + 2 * (w + 0.3), y, w, "Difference", ["11 -", "5 =", "6"], ["1011 -", "0101 =", "0110"], "borrow as in decimal");
      calc(s, h, h.MX + 3 * (w + 0.3), y, w, "Product", ["5 x", "3 =", "15"], ["0101 x", "0011 =", "000 1111"], "n x n bits give up to 2n bits");
      h.rows(s, ["Binary arithmetic follows the same column-by-column rules as decimal arithmetic: 1 + 1 = 0 with a carry of 1",
        "A processor signals a lost carry in different ways: many have a carry flag, RISC-V lets you compute it with a comparison",
        "A product needs twice the bits: on RV32 mul gives the low 32 bits and mulhu the high 32"], h.MX, 4.15, h.CW, 2.6);
    }, "The source slide said the overflow 'can be detected through the overflow bit': true of processors with a flags register, not of RISC-V. See the last section."),

    H("Signed integers", "Three ways to write a minus sign with bits."),
    T("Sign and magnitude", [
      "The most significant bit is the sign (1 = negative); the other n - 1 bits are the magnitude",
      "Range: from -(2^(n-1) - 1) to +(2^(n-1) - 1)",
      "Zero has two representations, +0 and -0: only 2^n - 1 numbers are represented",
      ["Arithmetic must work separately on sign and magnitude", ["to add two numbers of opposite sign, find the larger magnitude and subtract the smaller from it", "the result takes the sign of the operand with the larger magnitude"]],
    ], "Simple for people, awkward for circuits. It survives in the mantissa of IEEE 754 floating-point numbers (Lecture 06).", { big: "X = |x| + 2^(n-1) s", label: "the encoding law, where s = 1 if x is negative and 0 otherwise. On four bits: X = |x| + 8 s" }),
    T("Two's complement", [
      "Non-negative numbers, 0 <= x < 2^(n-1), are represented by themselves: X = x",
      "Negative numbers, -2^(n-1) <= x < 0, are represented by X = 2^n - |x|",
      "Range: from -2^(n-1) to +2^(n-1) - 1; zero has a single representation",
      "The most significant bit is 1 if and only if the number is negative",
      "This is the representation every modern processor uses, RISC-V included",
    ], "Also called radix complement (complemento alla base). The asymmetry of the range (one more negative number) has a consequence: negating the most negative number overflows.", { big: "-2^31 ... 2^31 - 1", label: "the range of a 32-bit RISC-V register read as a signed integer: about minus two billion to plus two billion" }),
    D("Four bits, three readings", (s, h) => {
      const rd = (k) => { const b = k.toString(2).padStart(4, "0"), sm = (k >= 8 ? "-" : "+") + (k & 7), tc = k >= 8 ? String(k - 16) : k ? "+" + k : "0"; return [b, String(k), sm, tc]; };
      const w = [1.15, 1.25, 1.7, 1.7], tw = 5.8, head = ["Bits", "Unsigned", "Sign-magnitude", "Two's compl."];
      h.table(s, h.MX, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i)), { fs: 16, mono: [0], align: "center", rowH: 0.42 });
      h.table(s, h.W - h.MX - tw, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i + 8)), { fs: 16, mono: [0], align: "center", rowH: 0.42, hi: { 0: P.amberSoft, 7: P.tealSoft } });
      h.tx(s, "non-negative: the three readings agree", { x: h.MX, y: 5.5, w: tw, h: 0.35, fontSize: 14, italic: true, color: P.teal, align: "center" });
      h.tx(s, "most significant bit 1: the readings differ", { x: h.W - h.MX - tw, y: 5.5, w: tw, h: 0.35, fontSize: 14, italic: true, color: P.amber, align: "center" });
      h.card(s, h.MX, 6.0, h.CW, 0.75, P.tealSoft);
      h.tx(s, "The bits do not say which column is the right one. The program does, by choosing its instructions.", { x: h.MX + 0.3, y: 6.0, w: h.CW - 0.6, h: 0.75, fontSize: 17, valign: "middle" });
    }, "Highlighted: 1000 is minus zero in sign and magnitude but -8 in two's complement; 1111 is -7 or -1. One's complement and excess-8 are added to this table in Lecture 06."),
    D("The number wheel", async (s, h) => {
      await h.svg(s, wheelSvg(), h.MX - 0.15, h.TOP - 0.2, 5.75, h.BOT - h.TOP + 0.35);
      h.rows(s, [
        "With n bits arithmetic is modulo 2^n: the number line closes into a circle",
        "Adding 1 moves one step clockwise, whatever the reading",
        ["Unsigned reading: the wheel breaks between 1111 and 0000", ["crossing it is a carry: 15 + 1 = 0"]],
        ["Two's complement reading: the wheel breaks between 0111 and 1000", ["crossing it is a signed overflow: 7 + 1 = -8"]],
        "One step back from 0000 is 1111: that is why 0 - 1 gives all ones",
      ], 6.5, h.TOP, h.W - h.MX - 6.5, h.BOT - h.TOP);
    }, "Inner ring: unsigned value. Middle: bits. Outer discs: two's complement value. The same adder serves both readings: only the place where the wheel 'breaks' changes."),
    D("Two's complement arithmetic", (s, h) => {
      const w = (h.CW - 0.6) / 3, y = h.TOP + 0.05;
      calc(s, h, h.MX, y, w, "Opposite signs", ["2 +", "-6 =", "-4"], ["0010 +", "1010 =", "1100"], "just add the patterns");
      calc(s, h, h.MX + (w + 0.3), y, w, "Two negatives", ["-2 +", "-3 =", "-5"], ["1110 +", "1101 =", "1 1011"], "the carry out is ignored (sum modulo 16)");
      calc(s, h, h.MX + 2 * (w + 0.3), y, w, "Product", ["2 x", "-3 =", "-6"], ["0010 x", "1101 =", "001 1010"], "keep the low four bits: 1010 = -6");
      h.rows(s, ["Addition needs no knowledge of the signs: the adder for natural numbers already gives the right answer",
        "The carry out of the most significant bit is simply discarded",
        "The low n bits of a product are also correct, whatever the signs"], h.MX, 4.15, h.CW, 2.6);
    }, "Check of the product: 2 x 13 = 26 = 1 1010; the low four bits are 1010, which reads -6. This is why RISC-V has a single mul for signed and unsigned operands."),
    T("Negating a number", [
      "By definition -x is represented by 2^n - x",
      ["Method 1: complement every bit, then add 1", ["6 = 0110, complement 1001, plus one: 1010 = -6"]],
      ["Method 2: starting from the right, copy the bits up to and including the first 1, complement all the others", ["5 = 0101 gives 1011 = -5; 1 = 0001 gives 1111 = -1"]],
      "Negating twice returns the original number, with one exception: the most negative number has no positive partner",
    ], "Why method 1 works: the complement of x is (2^n - 1) - x, so adding 1 gives 2^n - x. The source slide described method 2 'from the left'; the rule scans from the right.", { code: "# neg t0, t1 is a pseudo-instruction:\nsub  t0, zero, t1\n\n# the same thing by hand:\nnot  t0, t1        # complement\naddi t0, t0, 1     # plus one", wide: true, h: 2.7 }),
    B("Subtraction is addition.", "y - x = y + (2^n - x), modulo 2^n. An adder and a complementer are the only components needed to build addition, subtraction, multiplication and division.",
      "This is the engineering reason for two's complement: one circuit, the adder of Lecture 09, does all the work. In the RISC-V datapath, sub is add with the second operand complemented and a carry-in of 1."),
    D("Detecting overflow", (s, h) => {
      const w = (h.CW - 0.4) / 2, y = h.TOP + 0.05;
      calc(s, h, h.MX, y, w, "Unsigned, 8 bits", ["128 +", "130 =", "258"], ["1000 0000 +", "1000 0010 =", "1 0000 0010"], "carry out: the register holds 2, the sum modulo 256", P.violet);
      calc(s, h, h.MX + w + 0.4, y, w, "Signed, 8 bits", ["127 +", "127 =", "254"], ["0111 1111 +", "0111 1111 =", "1111 1110"], "no carry out, but the result reads -2", P.red);
      h.rows(s, [
        "Unsigned overflow: there is a carry out of the most significant bit",
        ["Signed overflow in two's complement", ["two positive operands give a negative sum", "two negative operands give a positive sum"]],
        "Adding two numbers of opposite sign can never overflow",
        "The two conditions are independent: the same addition can trigger one, both or neither",
      ], h.MX, 4.15, h.CW, 2.6);
    }, "Equivalent circuit rule for signed overflow: the carry into the most significant bit differs from the carry out of it."),

    H("Back to the machine", "The same rules, as RISC-V implements them."),
    T("The warm-up, explained", [
      "marker_x held 0; addi t2, t2, -1 moved one step back on a wheel with 2^32 positions",
      "The register now holds thirty-two ones: 0xFFFFFFFF",
      ["Read as unsigned it is 4,294,967,295; read in two's complement it is -1", ["the adder did the same thing in both cases"]],
      "prg32_console_hex32 prints the pattern, not an interpretation: it is neither right nor wrong",
      "The marker disappears because prg32_gfx_rect is asked to draw at a huge x, or at -1: off the screen either way",
    ], "Not a bug in the processor: a missing decision in the program. The fix is on the next slides.", { img: "lab2_step2_move.png", cap: "Lab 06, step 2: seven lamps for the button bits and a marker" }),
    G("Signed or unsigned? You choose with the instruction", ["Operation", "Signed", "Unsigned", "Why they differ"], [
      ["add, subtract", "add, addi, sub", "the same", "two's complement: one adder for both"],
      ["multiply (low word)", "mul", "the same", "the low 32 bits do not depend on the sign"],
      ["compare", "slt, slti", "sltu, sltiu", "is 0xFFFFFFFF less than 0? yes if signed"],
      ["branch", "blt, bge", "bltu, bgeu", "the same question, as a jump"],
      ["shift right", "sra, srai", "srl, srli", "copy the sign bit, or insert zeros"],
      ["load a byte", "lb", "lbu", "sign extension or zero extension"],
      ["divide, remainder", "div, rem", "divu, remu", "magnitudes are read differently"],
    ], "RISC-V registers have no type. The same 32 bits are signed or unsigned only in the eye of the instruction that reads them.", { widths: [2.6, 2.4, 2.4, 4.8], mono: [1, 2] }),
    K("Keeping the marker on the screen", `    andi t3, t0, BTN_LEFT
    beqz t3, 1f
    addi t2, t2, -SPEED
1:  andi t3, t0, BTN_RIGHT
    beqz t3, 2f
    addi t2, t2, SPEED
2:
    bgez t2, 3f            # x < 0 ?  clamp to 0
    li   t2, 0
3:  li   t3, MAX_X         # .equ MAX_X, 304
    ble  t2, t3, 4f        # x > 304 ?  clamp to 304
    mv   t2, t3
4:
    sw   t2, 0(t1)         # one store, after all adjustments`, [
      "bgez reads t2 as a signed number: it tests the sign bit",
      "ble is a signed comparison too: -1 is less than 304. With bleu, 0xFFFFFFFF would be far greater",
      "A game does not detect overflow after the fact: it keeps values inside a range where overflow cannot happen",
      "-SPEED is an immediate: twelve bits in two's complement, from -2048 to +2047",
    ], "Source: textbook lab 06-asm-state-and-input, step3_clamp.S. Ask what happens with bgeu or bltu instead: an instructive bug to try."),
    K("Detecting overflow without flags", `# unsigned: did the sum wrap around?
    add  t2, t0, t1        # t2 = t0 + t1   (modulo 2^32)
    sltu t3, t2, t0        # t3 = 1 if the sum is smaller than
                           #        an operand: a carry was lost

# signed: did the sign come out wrong?
    add  t2, t0, t1
    slti t3, t1, 0         # t3 = 1 if t1 is negative
    slt  t4, t2, t0        # t4 = 1 if the sum is less than t0
    bne  t3, t4, overflow  # they must agree`, [
      "RISC-V has no carry flag and no overflow flag: fewer hidden states, a simpler processor",
      "Unsigned: a sum that wrapped is always smaller than either operand",
      "Signed: adding a negative number must make the sum smaller; adding a non-negative one must not",
    ], "Both idioms are the ones suggested in the RISC-V specification. Compare with the wheel: sltu detects crossing the top, the signed test detects crossing the bottom."),
    D("Sign extension: the same number on more bits", (s, h) => {
      const x = 4.6, row = (y, label, cells, res) => {
        h.tx(s, label, { x: h.MX, y, w: x - h.MX - 0.3, h: 0.62, fontSize: 16, bold: true, align: "right", valign: "middle" });
        h.mem(s, x, y, 0.95, cells, { h: 0.62, fs: 17 });
        h.tx(s, res, { x: x + cells.length * 0.95 + 0.25, y, w: 3, h: 0.62, fontSize: 18, bold: true, fontFace: h.MONO, valign: "middle" });
      };
      row(h.TOP + 0.15, "-1 on 4 bits", [{ val: "1111", color: P.amber }], "= -1");
      row(h.TOP + 1.0, "-1 on 8 bits", [{ val: "1111", color: P.red }, { val: "1111", color: P.amber }], "= -1");
      row(h.TOP + 1.85, "+5 on 4 bits", [{ val: "0101", color: P.teal }], "= +5");
      row(h.TOP + 2.7, "+5 on 8 bits", [{ val: "0000", color: P.steel }, { val: "0101", color: P.teal }], "= +5");
      h.rows(s, ["To widen a two's complement number, copy its sign bit into all the new positions on the left",
        "addi t2, t2, -1 stores -1 in twelve bits; the processor sign-extends it to thirty-two before adding",
        "lb sign-extends the byte it loads; lbu fills with zeros: choose according to what the byte means"], h.MX, 5.05, h.CW, 1.7);
    }, "Extending with zeros would turn 1111 (-1) into 0000 1111 (+15). Sign extension is the signed counterpart of the 'extension on the left' property seen for naturals."),

    Q("Which number does the 8-bit pattern 1111 1100 represent in two's complement?", ["252", "-4", "-3", "-124"], 1, "Complement and add one: 0000 0011 + 1 = 0000 0100 = 4, so the pattern is -4. (252 is its unsigned reading.)"),
    Q("On 8 bits, which addition produces a signed overflow?", ["100 + 27", "100 + 28", "-100 + 28", "-1 + 1"], 1, "The range is [-128, 127]. 100 + 27 = 127 fits; 100 + 28 = 128 does not: two positives give a negative pattern (1000 0000 = -128)."),
    Q("t0 holds 0xFFFFFFFF and t1 holds 1. After slt t2, t0, t1 and sltu t3, t0, t1:", ["t2 = 1, t3 = 1", "t2 = 0, t3 = 0", "t2 = 1, t3 = 0", "t2 = 0, t3 = 1"], 2, "Signed: -1 < 1 is true, so t2 = 1. Unsigned: 4,294,967,295 < 1 is false, so t3 = 0."),
    Q("How is 0.625 written in binary?", ["0.101", "0.110", "0.625", "0.011"], 0, "0.625 x 2 = 1.25 (1); 0.25 x 2 = 0.5 (0); 0.5 x 2 = 1.0 (1): 0.101 = 1/2 + 1/8."),
    X("Exercises: paper first, then PRG32", [
      "Convert 2026 to binary, octal and hexadecimal; convert 0.1 to binary up to eight fractional bits",
      "Write -100 on 8 bits in sign and magnitude and in two's complement",
      "Compute on 8 bits in two's complement: 90 + 60, -90 - 60, 90 - 60. Which overflow?",
      "In the clamp code replace bgez and ble with their unsigned versions, predict the behaviour, then run it",
      "Write an update that adds 0x10000000 to a counter each frame and lights a red rectangle when the signed sum overflows",
    ], "On paper: 2026 = 0x7EA = 111 1110 1010. On PRG32: the red rectangle flashes once every sixteen frames, when the counter passes from 0x7... to 0x8...",
      "2026 = 3752 octal. -100: sign and magnitude 1110 0100, two's complement 1001 1100. 90 + 60 = 150 overflows; -90 - 60 = -150 overflows; 90 - 60 = 30 does not. 0.1 = 0.00011001(1001...)."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["base (radix)", "base", "two's complement", "complemento a due (alla base)"],
      ["natural number", "numero naturale", "sign and magnitude", "segno e modulo"],
      ["signed integer", "numero relativo (intero con segno)", "overflow", "overflow (traboccamento)"],
      ["most significant bit", "bit più significativo", "carry / borrow", "riporto / prestito"],
      ["remainder", "resto", "sign extension", "estensione del segno"],
      ["shift", "scorrimento (shift)", "to clamp", "limitare a un intervallo"],
    ], null, { widths: [3.2, 3.4, 2.8, 3.4] }),
    T("Conclusions and reading", [
      "Every base has its advantages: base 2 for circuits, base 16 for people who read bits",
      "n bits represent 2^n numbers: which ones depends on the encoding law",
      "Two's complement turns subtraction into addition: one adder does everything",
      "Overflow is the price of finite registers: detect it, or design it away",
      "In RISC-V the bits have no type: the instruction chooses signed or unsigned",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, sections 2.4 and 3.1-3.2", "Playing with RISC-V, chapter 6: State and Input", "Stallings: Computer Organization and Architecture, chapters on number systems and computer arithmetic"]],
    ], "Next lecture: one's complement, excess-k, fixed point and IEEE 754 floating point."),
  ],
});
