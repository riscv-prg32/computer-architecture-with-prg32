// Lecture 06 - Number representation, part 2: one's complement, excess-k, fixed point, IEEE 754.
// Source: 04-Architettura_dei_Calcolatori-Rappresentazione_Numeri.pptx (translated, figures redrawn, fixed point and RISC-V added).
const G4 = require("../../lib/gates");

function lineSvg() {
  const W = 1000, H = 230, y = 110, seg = (x1, x2, col) => `<rect x="${x1}" y="${y - 16}" width="${x2 - x1}" height="32" fill="${col}"/>`;
  const tick = (x, top, bot) => `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y + 26}" stroke="#1B2530" stroke-width="2"/>` +
    G4.text(x, y - 36, top, { anchor: "middle", size: 15 }) + (bot ? G4.text(x, y + 48, bot, { anchor: "middle", size: 13, bold: false, fill: "#5B6B78" }) : "");
  return G4.doc(W, H, seg(20, 150, "#B23A48") + seg(150, 380, "#0E7C86") + seg(380, 620, "#C7791B") + seg(620, 850, "#0E7C86") + seg(850, 980, "#B23A48") +
    tick(150, "-9.999 x 10^99") + tick(380, "-1.000 x 10^-99") + tick(500, "0") + tick(620, "+1.000 x 10^-99") + tick(850, "+9.999 x 10^99") +
    G4.text(85, y + 6, "overflow", { anchor: "middle", size: 15, fill: "#fff" }) + G4.text(915, y + 6, "overflow", { anchor: "middle", size: 15, fill: "#fff" }) +
    G4.text(265, y + 6, "representable", { anchor: "middle", size: 15, fill: "#fff" }) + G4.text(735, y + 6, "representable", { anchor: "middle", size: 15, fill: "#fff" }) +
    G4.text(500, y + 70, "underflow: too close to zero", { anchor: "middle", size: 15, fill: "#C7791B" }) +
    `<polygon points="10,${y} 22,${y - 8} 22,${y + 8}" fill="#B23A48"/><polygon points="990,${y} 978,${y - 8} 978,${y + 8}" fill="#B23A48"/>`);
}

function calc4(s, h, x, y, w, title, dec, bin, note, col) {
  const hh = 2.45;
  h.card(s, x, y, w, hh);
  h.tx(s, title, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.35, fontSize: 14, bold: true, color: col || P.steel });
  h.tx(s, dec.join("\n"), { x: x + 0.2, y: y + 0.5, w: w * 0.3, h: 1.4, fontSize: 15, fontFace: h.MONO, align: "right", color: P.mute });
  h.tx(s, bin.join("\n"), { x: x + w * 0.36, y: y + 0.5, w: w * 0.64 - 0.25, h: 1.4, fontSize: 15, fontFace: h.MONO, bold: true, align: "right" });
  if (note) h.tx(s, note, { x: x + 0.2, y: y + hh - 0.5, w: w - 0.4, h: 0.45, fontSize: 12.5, italic: true, color: col || P.mute, valign: "middle" });
}

Deck({
  n: "06", file: "06-Computer_Architecture-Number_Representation_Reals",
  title: "Number Representation: Real Numbers", short: "Number representation (reals)",
  sub: "One's complement, excess-k, fixed point and IEEE 754 floating point",
  quote: ["I may count for little, it's true, said the One to the Zero, but what are you worth? Nothing: nothing at all.", "Trilussa, Nummeri, 1944"],
  cover: "game_raycaster.png",
  notes: "Spiral: the lecture opens with a ball that must move less than one pixel per frame on a processor with no floating-point unit. Fixed point solves it; floating point is then presented as the general answer, with IEEE 754.",
  slides: [
    O("What you will be able to do by the end", [
      "Encode signed integers in one's complement and in excess-k, and say what each is good for",
      "Represent a fractional quantity in fixed point and compute with it using integer instructions",
      "Explain mantissa, exponent and normalisation in floating point",
      "Encode and decode a number in IEEE 754 single precision",
      "Recognise zero, denormalised numbers, infinity and NaN",
      "Say why the ESP32-C6 has no floating-point instructions and what PRG32 games do instead",
    ]),

    H("Warm-up on the machine", "A ball that moves less than one pixel per frame."),
    K("Three-eighths of a pixel, with integers only", `.equ SPEED_Q8, 96            # 96 / 256 = 0.375 pixel per frame

ball_update:
    la   t0, ball_x_q8
    lw   t1, 0(t0)           # position, in 1/256 of a pixel
    addi t1, t1, SPEED_Q8    # add a fraction of a pixel
    sw   t1, 0(t0)
    ret

ball_draw:
    ...
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    srai a0, t1, 8           # x in whole pixels: drop 8 bits
    ...
    call prg32_gfx_rect`, [
      "One pixel per frame is too fast, zero is too slow: the ball needs 0.375",
      "The processor of the kit is RV32IMAC: integer instructions only, no floating point",
      "Trick: store the position multiplied by 256, and divide by 256 only to draw",
      "This is fixed point. Where does the trick come from, and when is it not enough?",
    ], "Written for this lecture in the style of the textbook examples; the same idea is behind prg32_playfield_parallax(layer, x_q8, y_q8) in the PRG32 API. Run it with SPEED_Q8 = 96, then 16, then 1."),

    H("More encodings for signed integers", "Two relatives of two's complement that floating point needs."),
    T("One's complement", [
      "Non-negative numbers, 0 <= x < 2^(n-1), are represented by themselves: X = x",
      "Negative numbers are represented by X = 2^n - 1 - |x|",
      "Range: from -(2^(n-1) - 1) to +(2^(n-1) - 1)",
      "Zero has two representations, 0000 and 1111: 2^n - 1 numbers are represented, as in sign and magnitude",
      ["Why use it? Negating is trivial: complement every bit", ["6 = 0110 and -6 = 1001; 5 = 0101 and -5 = 1010; 1 = 0001 and -1 = 1110"]],
    ], "Also called diminished radix complement (complemento alla base diminuita). The bitwise not of RISC-V computes exactly this.", { big: "-x = not x", label: "the one's complement of a number is obtained by inverting all its bits" }),
    D("Arithmetic in one's complement", (s, h) => {
      const w = (h.CW - 0.6) / 3, y = h.TOP + 0.05;
      calc4(s, h, h.MX, y, w, "No correction", ["3 +", "-4 =", "-1"], ["0011 +", "1011 =", "1110"], "no carry out: the result is right");
      calc4(s, h, h.MX + w + 0.3, y, w, "Two negatives", ["-2 +", "-3 =", "", "-5"], ["1101 +", "1100 =", "1 1001 + 1 =", "1010"], "carry out: add it back", P.red);
      calc4(s, h, h.MX + 2 * (w + 0.3), y, w, "Positive result", ["5 +", "-2 =", "", "3"], ["0101 +", "1101 =", "1 0010 + 1 =", "0011"], "carry out: add it back", P.red);
      h.rows(s, ["The adder works modulo 2^n - 1: whenever there is a carry out of the most significant bit, 1 must be added to the result (end-around carry)",
        "The correction is needed when both operands are negative, or when the operands have opposite signs and the sum is positive",
        "An adder and a complementer are still enough, but the extra step and the double zero made two's complement win"], h.MX, 4.3, h.CW, 2.45);
    }, "The source slides call the carry an 'overflow in the arithmetic of positive integers': it is the carry out of the natural-number adder, reinterpreted as the need for a correction."),
    T("Excess-k (biased) representation", [
      "Every number is shifted upward by a constant k: X = x + k, typically k = 2^(n-1)",
      "The order is preserved: if x1 > x2 then X1 > X2, so signed numbers compare as naturals",
      "A sum must be corrected by subtracting k; multiplication and division are much more awkward than with complements",
      "Preferred where only additions and comparisons are needed",
      "It is the encoding of the exponent in floating-point numbers",
    ], "Excess-8 on four bits: 0000 = -8, 1000 = 0, 1111 = +7. Compare with two's complement: the same range, with the most significant bit inverted.", { big: "X = x + k", label: "on four bits with k = 8: the pattern 0000 means -8, 1000 means 0, 1111 means +7" }),
    D("Four bits, five readings", (s, h) => {
      const rd = (k) => [k.toString(2).padStart(4, "0"), String(k), (k >= 8 ? "-" : "+") + (k & 7), k >= 8 ? "-" + (15 - k) : "+" + k, k >= 8 ? String(k - 16) : k ? "+" + k : "0", (k - 8 > 0 ? "+" : "") + (k - 8)];
      const w = [0.9, 0.95, 1.05, 0.95, 0.95, 1.05], tw = 5.85, head = ["Bits", "Unsig.", "Sign-m.", "1's c.", "2's c.", "Exc.-8"];
      h.table(s, h.MX, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i)), { fs: 15, mono: [0], align: "center", rowH: 0.42, cellHi: { "0,3": P.amberSoft, "0,2": P.amberSoft } });
      h.table(s, h.W - h.MX - tw, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i + 8)), { fs: 15, mono: [0], align: "center", rowH: 0.42, cellHi: { "0,2": P.amberSoft, "7,3": P.amberSoft, "0,5": P.tealSoft } });
      h.rows(s, ["Sign and magnitude and one's complement have two zeros (highlighted): 0000 and 1000, or 0000 and 1111",
        "Two's complement and excess-8 cover the same range, -8 to +7, with a single zero",
        "Only excess-k keeps the patterns in the same order as the numbers"], h.MX, 5.5, h.CW, 1.25);
    }, "This table replaces the comparison picture of the source deck ('Numeri relativi: complementi')."),

    H("Fixed point", "Fractions with integer hardware."),
    T("Numbers in fixed point", [
      "The integer part and the fractional part are stored side by side in one word",
      "The position of the point is fixed and implicit: it is not stored, the program knows it",
      "With f fractional bits the stored integer is X = x times 2^f, and the resolution is 2^-f",
      "Each part uses one of the representations already seen: usually the whole word is two's complement",
      "Notation Qm.f: m integer bits and f fractional bits, for example Q24.8",
    ], "Fixed point is how games, audio and control software handle fractions on processors without a floating-point unit. It is also how money should be stored: integer cents.", { big: "X = x 2^f", label: "store the number multiplied by a power of two; shift right by f bits to get back the integer part" }),
    D("The ball, bit by bit: Q24.8", (s, h) => {
      h.tx(s, "ball_x_q8 = 0x00002A60 = 10848", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 0.6, h.TOP + 1.0, h.CW - 1.2, [
        { n: 24, label: "integer part: 24 bits\n0x00002A = 42 pixels", value: "0000 0000 0000 0000 0010 1010", color: P.teal },
        { n: 8, label: "fraction: 8 bits\n0x60 = 96/256 = 0.375", value: "0110 0000", color: P.amber },
      ], { h: 0.8, fs: 18, labelFs: 15, minW: 3 });
      h.tx(s, "10848 / 256 = 42.375", { x: h.MX, y: h.TOP + 2.75, w: h.CW, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, align: "center" });
      h.table(s, h.MX, 5.05, [3.2, 4.4, 4.533], ["Operation", "In fixed point", "RISC-V"], [
        ["add, subtract", "as integers: the points are aligned", "add, sub, addi"],
        ["to whole pixels", "shift right by f, keeping the sign", "srai a0, t1, 8"],
        ["multiply", "multiply, then shift right by f", "mul, then srai"],
      ], { fs: 15, mono: [2] });
    }, "42 x 256 = 10752; 10752 + 96 = 10848 = 0x2A60. After one more frame the value is 0x2AC0 (42.75), then 0x2B20 (43.125): the ball crosses a pixel boundary every two or three frames."),
    T("Rational numbers: the approximation error", [
      "The reals are dense: even in a limited interval, not every number can be represented",
      ["Approximation: each number is associated with the nearest representable one", ["in Q24.8, 0.1 becomes 26/256 = 0.1015625: an error of about 1.6%"]],
      "The approximation error is at most half of the resolution: 1/512 for eight fractional bits",
      "Underflow: a number close to zero, but not zero, is represented by zero",
      "In fixed point the absolute error is the same everywhere on the number line",
    ], "0.1 x 256 = 25.6, rounded to 26. With SPEED_Q8 = 1 the ball moves 1/256 pixel per frame; a speed of 0.001 pixel per frame underflows to zero and the ball never moves.", { big: "1/256", label: "the resolution of eight fractional bits: nothing smaller can be told apart from zero" }),

    H("Floating point", "Trading range for precision."),
    T("Real numbers in floating point", [
      "A real number x is represented by a pair (m, e) such that x = m times b^e",
      ["m is the mantissa, e the exponent, b the base", ["the point floats: the exponent says where it is"]],
      ["Infinitely many pairs represent the same number", ["346.09801 = (346.09801, 0) = (346098.01, -3) = (0.034609801, 4)"]],
      ["Normalisation chooses a single representative", ["the point goes right after the first significant digit: (3.4609801, 2)"]],
    ], "Scientific notation, in other words. Fixed point spends its bits on a fixed range; floating point spends some bits to say where the range is.", { big: "x = m b^e", label: "mantissa, base and exponent: the scientific notation of the laboratory, in binary" }),
    D("Example: the range of a small decimal format", async (s, h) => {
      h.tx(s, "Base 10, four digits for the mantissa, two for the exponent", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.45, fontSize: 18, bold: true, color: P.steel });
      await h.svg(s, lineSvg(), h.MX, h.TOP + 0.5, h.CW, 2.75);
      h.rows(s, ["Representable: from -9.999 x 10^99 to -1.000 x 10^-99, zero, and from +1.000 x 10^-99 to +9.999 x 10^99",
        "Overflow: the magnitude is too large for the exponent",
        "Underflow: the magnitude is too small, and the number collapses to zero"], h.MX, 4.95, h.CW, 1.8);
    }, "The source deck showed this line twice (interval of representation; overflow and underflow): merged here."),
    T("Approximation: absolute and relative error", [
      "The absolute error is not constant: precision is very fine near zero and decreases as numbers grow",
      ["Near zero the maximum error is 0.001 x 10^-99", ["1.001 x 10^-99 minus 1.000 x 10^-99"]],
      ["Near the upper limit the maximum error is 0.001 x 10^99", ["9.999 x 10^99 minus 9.998 x 10^99"]],
      "Absolute error: small on small numbers, large on large numbers",
      "Relative error: constant along the whole axis",
    ], "This is the opposite of fixed point, where the absolute error is constant and the relative error explodes near zero.", { big: "4 digits", label: "the same number of significant digits everywhere: constant relative error, whatever the size of the number" }),
    D("IEEE 754 single precision: 32 bits", (s, h) => {
      h.bits(s, h.MX, h.TOP + 0.35, h.CW, [
        { n: 1, label: "sign\n1 = negative", value: "S", color: P.red },
        { n: 8, label: "exponent: 8 bits\nexcess-127", value: "E", color: P.amber },
        { n: 23, label: "fraction: 23 bits\nmagnitude, after the hidden 1", value: "F", color: P.teal },
      ], { h: 0.75, fs: 22, labelFs: 15, minW: 1.2 });
      h.tx(s, "value = (-1)^S  x  1.F  x  2^(E - 127)", { x: h.MX, y: h.TOP + 2.0, w: h.CW, h: 0.6, fontSize: 26, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.rows(s, [
        "The mantissa is in sign and magnitude: one sign bit and 23 bits of magnitude",
        "A normalised binary mantissa always starts with 1: that bit is hidden, not stored, and one bit of precision is gained",
        "The exponent is in excess-127, not 128: the true exponents go from -126 to +127",
        "The patterns E = 0 and E = 255 are reserved: zero and denormalised numbers, infinity and NaN",
      ], h.MX, 4.45, h.CW, 2.3);
    }, "IEEE 754 dates from 1985 (revised 2008 and 2019). Before it, every manufacturer had its own format and programs gave different results on different machines."),
    D("Worked example: -5.125 in IEEE 754", (s, h) => {
      h.rows(s, [
        "Convert the two parts: 5 = 101 and 0.125 = 1/8 = 0.001, so 5.125 = 101.001",
        "Normalise: 101.001 = 1.01001 x 2^2",
        "Sign S = 1; exponent E = 2 + 127 = 129 = 1000 0001",
        "Fraction F = 01001 followed by zeros: the leading 1 is hidden",
      ], h.MX, h.TOP, h.CW, 3.0, "num");
      h.bits(s, h.MX, 4.95, h.CW, [
        { n: 1, value: "1", color: P.red },
        { n: 8, value: "1000 0001", color: P.amber },
        { n: 23, value: "0100 1000 0000 0000 0000 000", color: P.teal },
      ], { h: 0.65, fs: 17, minW: 0.7 });
      h.tx(s, "1100 0000 1010 0100 0000 0000 0000 0000  =  0xC0A40000", { x: h.MX, y: 5.95, w: h.CW, h: 0.6, fontSize: 21, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
    }, "Check the regrouping in nibbles: 1100 = C, 0000 = 0, 1010 = A, 0100 = 4, then zeros. Three slides of the source deck are merged here."),
    G("IEEE 754 at a glance", ["", "Single precision", "Double precision"], [
      ["Total bits", "32", "64"],
      ["Sign bits", "1", "1"],
      ["Exponent bits", "8", "11"],
      ["Fraction bits", "23", "52"],
      ["Exponent encoding", "excess-127", "excess-1023"],
      ["Exponent range", "-126 ... +127", "-1022 ... +1023"],
      ["Smallest normalised", "2^-126, about 1.2 x 10^-38", "2^-1022, about 2.2 x 10^-308"],
      ["Largest", "about 2^128, 3.4 x 10^38", "about 2^1024, 1.8 x 10^308"],
      ["Smallest denormalised", "about 1.4 x 10^-45", "about 4.9 x 10^-324"],
      ["Decimal digits", "about 7", "about 16"],
    ], "Corrections to the source table: the double-precision exponent is in excess-1023 (not 1024), and the decimal ranges are about 10^38 and 10^308.", { widths: [3.2, 4.5, 4.5] }),
    G("IEEE 754: what the patterns mean", ["Kind", "Sign", "Exponent E", "Fraction F", "Value"], [
      ["Normalised", "0 or 1", "0 < E < max", "any pattern", "(-1)^S x 1.F x 2^(E-bias)"],
      ["Denormalised", "0 or 1", "all zeros", "not zero", "(-1)^S x 0.F x 2^(1-bias)"],
      ["Zero", "0 or 1", "all zeros", "all zeros", "+0 or -0"],
      ["Infinity", "0 or 1", "all ones", "all zeros", "+infinity or -infinity"],
      ["Not a Number", "0 or 1", "all ones", "not zero", "NaN: an invalid result"],
    ], "Denormalised (subnormal) numbers fill the underflow gap around zero with gradually decreasing precision. 1/0 gives infinity; 0/0 and the square root of -1 give NaN. NaN is not equal to anything, itself included.", { widths: [2.2, 1.2, 1.9, 1.9, 5.0], mono: [4], fs: 18 }),
    T("Floating point is not the real numbers", [
      "0.1 has no finite binary expansion: it is stored approximately, like 0.8 in Lecture 05",
      "Never test two floating-point results for equality: compare their difference with a tolerance",
      "Addition is not associative: (a + b) + c can differ from a + (b + c)",
      "Adding a very small number to a very large one can leave the large one unchanged",
      "For money and for game positions, scaled integers are often the right tool",
    ], "The double-precision sum 0.1 + 0.2 is 0.30000000000000004. Try it in any language.", { code: "double a = 0.1 + 0.2;\n\n// a == 0.3 ?   false\n// a = 0.30000000000000004\n\n// better:\n// fabs(a - 0.3) < 1e-9", lang: "c", wide: true, h: 3.4 }),
    C("Beyond single and double", [
      ["Half precision", "Sixteen bits: 1 sign, 5 exponent, 10 fraction. About three decimal digits, half the memory of single precision."],
      ["Why it matters", "Neural networks hold billions of numbers: halving each one halves memory, bandwidth and energy."],
      ["Quantisation", "Many models are stored as 8-bit integers with a scale factor: fixed point again, at industrial scale."],
      ["The same trade-off", "Bits are a budget. Range, precision and cost pull in different directions, on a GPU as on your Q24.8 ball."],
    ], "New slide. Half precision is binary16 in IEEE 754-2008. The point for first-year students: representation choices are an engineering decision that is still being made today."),

    H("Back to the machine", "Floating point and RISC-V."),
    V("Floating point on RISC-V, and on your kit",
      ["RISC-V with the F and D extensions", ["Thirty-two more registers, f0 to f31, for floating-point values", "Instructions such as fadd.s, fmul.s, flw and fsw work on IEEE 754 numbers", "fcvt.w.s converts to an integer, fcvt.s.w from an integer", "Found on RISC-V processors for laptops, servers and supercomputers"]],
      ["The ESP32-C6: RV32IMAC", ["No F and no D: there are no floating-point instructions at all", "A C program can still use float: the compiler calls software routines such as __addsf3", "Each call costs tens to hundreds of integer instructions", "PRG32 games use integers and fixed point: fast, exact enough, and visible in the debugger"]],
      "The software routines implement exactly the algorithm of this lecture with shifts, masks and integer additions: a good reading exercise for the end of the course."),
    G("Reading the name RV32IMAC", ["Letter", "Extension", "What it adds", "On the ESP32-C6"], [
      ["RV32I", "base integer set", "32-bit registers, add, logic, load and store, branches", "yes"],
      ["M", "multiply and divide", "mul, mulh, div, rem and their unsigned forms", "yes"],
      ["A", "atomic", "instructions for safe sharing between tasks", "yes"],
      ["C", "compressed", "16-bit encodings of the most common instructions", "yes"],
      ["F", "single precision", "f0 to f31 and IEEE 754 single-precision instructions", "no"],
      ["D", "double precision", "IEEE 754 double-precision instructions", "no"],
    ], "RISC-V is modular: a small mandatory base plus optional extensions. A microcontroller picks what it needs; this is one reason the same architecture scales from a two-euro chip to a supercomputer.", { widths: [1.4, 2.6, 6, 2.2], mono: [0] }),

    Q("Which signed encoding keeps the bit patterns in the same order as the numbers?", ["Sign and magnitude", "One's complement", "Two's complement", "Excess-k"], 3, "In excess-k, X = x + k: a larger number always has a larger pattern. This is why it encodes floating-point exponents, which must be compared quickly."),
    Q("In Q24.8 fixed point, which real number does the word 0x00000180 represent?", ["384", "1.5", "1.8", "0.375"], 1, "0x180 = 384; 384 / 256 = 1.5. Integer part 0x01, fraction 0x80 = 128/256 = 0.5."),
    Q("Which real number is the IEEE 754 single-precision pattern 0x40400000?", ["2.0", "3.0", "4.0", "0.75"], 1, "0100 0000 0100 0000 ...: S = 0, E = 1000 0000 = 128, F = 100...: 1.1 (binary) x 2^(128-127) = 1.5 x 2 = 3.0."),
    Q("In IEEE 754, an exponent field of all ones with a fraction of all zeros means:", ["zero", "a denormalised number", "infinity", "NaN"], 2, "All ones in the exponent: infinity if the fraction is zero, NaN otherwise."),
    X("Exercises: paper first, then PRG32", [
      "Write -6 on four bits in sign and magnitude, one's complement, two's complement and excess-8",
      "Encode 10.5 and 0.15625 in IEEE 754 single precision; give the result in hexadecimal",
      "Decode 0xBF800000",
      "Run the ball with SPEED_Q8 = 96, 16 and 1. After how many frames does it move by one pixel in each case?",
      "Give the ball a vertical speed too, and make it bounce: negate the speed with neg when it reaches an edge",
    ], "On paper: 0x41280000, 0x3E200000 and -1.0. On PRG32: the ball advances one pixel every 2.67, 16 and 256 frames; with the bounce it moves diagonally and stays on screen.",
      "-6: 1110, 1001, 1010, 0010. 10.5 = 1010.1 = 1.0101 x 2^3: E = 130. 0.15625 = 0.00101 = 1.01 x 2^-3: E = 124. 0xBF800000: S = 1, E = 127, F = 0."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["one's complement", "complemento a uno (alla base diminuita)", "mantissa / fraction", "mantissa"],
      ["excess-k (biased)", "eccesso-k", "exponent", "esponente"],
      ["fixed point", "virgola fissa", "normalisation", "normalizzazione"],
      ["floating point", "virgola mobile", "hidden bit", "bit nascosto"],
      ["single / double precision", "singola / doppia precisione", "denormalised", "denormalizzato"],
      ["rounding", "arrotondamento", "Not a Number (NaN)", "non un numero (NaN)"],
    ], null, { widths: [3.2, 3.6, 2.8, 2.6] }),
    T("Conclusions and reading", [
      "Integers have several representations: 8, 16, 32 or 64 bits, signed or unsigned, complements or excess",
      "Fixed point stores a fraction as a scaled integer: constant absolute error, integer speed",
      "Floating point stores mantissa and exponent: huge range, constant relative error",
      "IEEE 754 is the universal standard for floating point, with special patterns for zero, infinity and NaN",
      "On a processor without the F extension, fixed point is the natural choice",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, section 3.5", "David Goldberg: What Every Computer Scientist Should Know About Floating-Point Arithmetic", "Playing with RISC-V, appendix: The PRG32 Runtime Interface (playfields and parallax)"]],
    ], "Next: Verm1, part 1, where the first four lectures go to work in a real program. Then Boolean algebra."),
  ],
});
