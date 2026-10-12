// Lecture 04 - Introduction to the representation of digital information.
// Source: 02-...-Introduzione_alla_rappresentazione_dell_informazione_digitale.pptx (translated, figures redrawn, RISC-V examples added).
const G2 = require("../../lib/gates");

function signalSvg() {
  const W = 640, H = 300, x0 = 40, y0 = 150, A = 100, n = 16, span = W - 80;
  let wave = "", steps = "", dots = "";
  for (let i = 0; i <= 200; i++) { const t = i / 200; wave += `${i ? "L" : "M"}${(x0 + t * span).toFixed(1)},${(y0 - A * Math.sin(t * 2 * Math.PI)).toFixed(1)} `; }
  for (let k = 0; k < n; k++) {
    const t = (k + 0.5) / n, v = Math.round(Math.sin(t * 2 * Math.PI) * 7) / 7, y = y0 - A * v, xa = x0 + (k / n) * span, xb = x0 + ((k + 1) / n) * span;
    steps += `${k ? "L" : "M"}${xa.toFixed(1)},${y.toFixed(1)} L${xb.toFixed(1)},${y.toFixed(1)} `;
    dots += `<circle cx="${((xa + xb) / 2).toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#C7791B"/>`;
  }
  let grid = "";
  for (let l = -7; l <= 7; l++) grid += `<line x1="${x0}" y1="${y0 - A * l / 7}" x2="${x0 + span}" y2="${y0 - A * l / 7}" stroke="#C9D2D8" stroke-width="${l === 0 ? 1.6 : 0.6}"/>`;
  return G2.doc(W, H, `<rect width="${W}" height="${H}" fill="#EEF2F4" rx="10"/>${grid}
    <path d="${wave}" fill="none" stroke="#0E7C86" stroke-width="3.2"/>
    <path d="${steps}" fill="none" stroke="#C7791B" stroke-width="2.6"/>${dots}
    ${G2.text(x0 + 8, 28, "analog: continuous", { fill: "#0E7C86", size: 16 })}${G2.text(x0 + 8, H - 14, "digital: sampled in time, quantised in value", { fill: "#C7791B", size: 16 })}`);
}

Deck({
  n: "04", file: "04-Computer_Architecture-Digital_Information",
  title: "Representing Digital Information", short: "Digital information",
  sub: "Bits, numbers, text, structures: everything in the machine is a pattern of bits",
  quote: ['printf("Hello, world!");', "Brian Kernighan and Dennis Ritchie, The C Programming Language, 1978"], quoteMono: true,
  cover: "lab1_step2_hello.png",
  notes: "Spiral: the students have already seen 0x07e0, 255, .asciz and .word in Lecture 02. This lecture names what those were. The next two lectures (05, 06) treat numbers formally.",
  slides: [
    O("What you will be able to do by the end", [
      "Explain the difference between analog and digital information",
      "Read a pattern of bits as a natural number, in binary and in hexadecimal",
      "Decode a PRG32 colour such as 0x07E0 into its red, green and blue fields",
      "Say how characters and strings are stored in memory, in ASCII and in UTF-8",
      "Describe how an array lives in memory and how assembly reaches one element",
      "Tell a deterministic algorithm from a probabilistic one, and place machine learning among them",
    ]),

    H("Information", "From the world to a pattern of bits."),
    F("Fundamental concepts: the flow of data", [
      "Input|data enter from the world: a key, a sensor, a file",
      "Process|a program, the embodiment of an algorithm, transforms them",
      "Output|results leave: a picture, a sound, a number",
      "Knowledge|information that someone can act on",
    ], "Artificial intelligence is an intelligence of its own kind: powerful pattern recognition, without self-awareness and without subjective experience.",
      "On PRG32 the same four boxes are prg32_input_read, your update function, your draw function, and the player who reacts to the screen."),
    D("Analog and digital information", async (s, h) => {
      h.rows(s, [
        ["Analog", ["a quantity that varies continuously: a voltage, a sound pressure, the hands of a watch"]],
        ["Digital", ["a sequence of symbols from a finite alphabet: the digits of a display"]],
        "Digitising means sampling in time and quantising in value",
        "A finite number of levels can be counted, copied exactly and checked for errors",
        "With two levels the symbol is the bit: 0 or 1",
      ], h.MX, h.TOP, 5.9, h.BOT - h.TOP);
      await h.svg(s, signalSvg(), 6.9, h.TOP, h.W - h.MX - 6.9, h.BOT - h.TOP);
    }, "Two levels are easy to build reliably with transistors (off or on), which is why computers are binary. Boolean algebra (Lecture 08) is the mathematics of two levels."),
    G("Bit, byte, word", ["Unit", "Size", "Patterns", "Where you met it"], [
      ["bit", "1 binary digit", "2", "one button of the joystick"],
      ["nibble", "4 bits", "16", "one hexadecimal digit"],
      ["byte", "8 bits", "256", "one ASCII character; the width of the bar (andi 255)"],
      ["halfword", "16 bits", "65,536", "one RGB565 colour"],
      ["word", "32 bits", "4,294,967,296", "one RISC-V register; one instruction; .word"],
      ["KiB, MiB, GiB", "2^10, 2^20, 2^30 bytes", "-", "memory sizes: 1 KiB = 1024 bytes"],
    ], "n bits give 2^n distinct patterns. What a pattern means is not written in the bits: it is a convention between whoever writes them and whoever reads them. On RV32 a word is 32 bits by definition of the architecture.", { widths: [2, 3, 2.4, 5.4], caption: "n bits give 2^n patterns. The meaning of a pattern is a convention, not a property of the bits." }),
    G("Counting in base 2 and base 16", ["Dec", "Binary", "Hex", "Dec", "Binary", "Hex"], [
      ["0", "0000", "0", "8", "1000", "8"], ["1", "0001", "1", "9", "1001", "9"], ["2", "0010", "2", "10", "1010", "A"], ["3", "0011", "3", "11", "1011", "B"],
      ["4", "0100", "4", "12", "1100", "C"], ["5", "0101", "5", "13", "1101", "D"], ["6", "0110", "6", "14", "1110", "E"], ["7", "0111", "7", "15", "1111", "F"],
    ], "The columns of the binary number weigh 8, 4, 2, 1. Learn this table by heart: it is the multiplication table of this course.", { widths: [1, 1.6, 1, 1, 1.6, 1], mono: [1, 2, 4, 5], fs: 19 }),
    D("Positional notation: what 11011001 means", (s, h) => {
      const bitsv = [1, 1, 0, 1, 1, 0, 0, 1], cw = 1.2, x = (h.W - 8 * cw) / 2, y = h.TOP + 0.85;
      h.tx(s, "weight", { x: h.MX, y: y - 0.62, w: x - h.MX - 0.2, h: 0.3, fontSize: 13, color: P.mute, align: "right" });
      h.mem(s, x, y, cw, bitsv.map((b, i) => ({ val: b, addr: `2^${7 - i} = ${2 ** (7 - i)}`, label: b ? String(2 ** (7 - i)) : "0", color: b ? P.teal : undefined })), { h: 0.9, fs: 30, labelFs: 17 });
      h.tx(s, "contributes", { x: h.MX, y: y + 0.95, w: x - h.MX - 0.2, h: 0.3, fontSize: 13, color: P.mute, align: "right" });
      h.tx(s, "128 + 64 + 16 + 8 + 1 = 217", { x: h.MX, y: y + 1.75, w: h.CW, h: 0.7, fontSize: 32, bold: true, fontFace: h.MONO, color: P.ink, align: "center", valign: "middle" });
      h.card(s, h.MX, 5.25, h.CW, 1.5, P.tealSoft);
      h.tx(s, "In a positional system the value of a digit depends on its position: each position weighs a power of the base. Base 10 uses powers of ten, base 2 powers of two, base 16 powers of sixteen. The rule is the same; only the base changes.", { x: h.MX + 0.3, y: 5.3, w: h.CW - 0.6, h: 1.4, fontSize: 17, valign: "middle" });
    }, "Lecture 05 gives the general formula and the conversion algorithms. Here the aim is only to read a byte."),
    D("Why programmers write hexadecimal", (s, h) => {
      const groups = ["0000", "0111", "1110", "0000"], hex = ["0", "7", "E", "0"], cw = 2.2, x = (h.W - 4 * cw) / 2, y = h.TOP + 0.2;
      h.tx(s, "binary", { x: h.MX, y, w: x - h.MX - 0.2, h: 0.8, fontSize: 14, color: P.mute, align: "right", valign: "middle" });
      h.mem(s, x, y, cw, groups.map((g, i) => ({ val: g, color: h.TINTS[i] })), { h: 0.8, fs: 26 });
      for (let i = 0; i < 4; i++) h.arrow(s, x + i * cw + cw / 2, y + 0.85, x + i * cw + cw / 2, y + 1.35, P.mute, 2);
      h.tx(s, "hexadecimal", { x: h.MX, y: y + 1.4, w: x - h.MX - 0.2, h: 0.8, fontSize: 14, color: P.mute, align: "right", valign: "middle" });
      h.mem(s, x, y + 1.4, cw, hex.map((g) => ({ val: g })), { h: 0.8, fs: 30 });
      h.tx(s, "0x07E0  =  2016 in decimal", { x: h.MX, y: y + 2.4, w: h.CW, h: 0.6, fontSize: 24, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.rows(s, ["One hexadecimal digit is exactly four bits, because 16 = 2^4: conversion is a table lookup, digit by digit",
        "A 32-bit register is eight hexadecimal digits: 0x00130313 is readable, thirty-two zeros and ones are not",
        "The prefix 0x marks hexadecimal in assembly and in C; the debugger of PRG32-QT shows registers this way"], h.MX, 4.95, h.CW, 1.8);
    }, "0x07E0 = 7 x 256 + 14 x 16 = 1792 + 224 = 2016. The decimal value is useless here: the bit pattern is the point, as the next slide shows."),
    D("A colour is a number: RGB565", (s, h) => {
      h.tx(s, ".equ GREEN, 0x07e0", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 1.2, h.TOP + 1.0, h.CW - 2.4, [
        { n: 5, label: "red: 5 bits\n0 of 31", value: "00000", color: P.red },
        { n: 6, label: "green: 6 bits\n63 of 63", value: "111111", color: P.green },
        { n: 5, label: "blue: 5 bits\n0 of 31", value: "00000", color: "2B5DAA" },
      ], { h: 0.85, fs: 26, labelFs: 15 });
      const cols = [["BLACK", "0x0000", "000000"], ["RED", "0xF800", "F80000"], ["GREEN", "0x07E0", "00FC00"], ["BLUE", "0x001F", "0000F8"], ["YELLOW", "0xFFE0", "F8FC00"], ["CYAN", "0x07FF", "00FCF8"], ["MAGENTA", "0xF81F", "F800F8"], ["WHITE", "0xFFFF", "FFFFFF"]];
      const cw = h.CW / 8, y = 4.35;
      cols.forEach(([n, v, rgb], i) => {
        const x = h.MX + i * cw;
        h.rect(s, x + 0.12, y, cw - 0.24, 0.8, rgb, P.steel);
        h.tx(s, n, { x, y: y + 0.88, w: cw, h: 0.3, fontSize: 13, bold: true, align: "center" });
        h.tx(s, v, { x, y: y + 1.18, w: cw, h: 0.3, fontSize: 14, fontFace: h.MONO, color: P.mute, align: "center" });
      });
      h.tx(s, "Sixteen bits, three fields. The same sixteen bits could be a number, two characters or half an instruction: the meaning is in how the program uses them.", { x: h.MX, y: 6.05, w: h.CW, h: 0.7, fontSize: 16, italic: true, valign: "middle" });
    }, "The eye is most sensitive to green, which is why green gets the extra bit. Exercise: which colour is 0xF81F? (red and blue at maximum: magenta). The colour constants are those of prg32.h."),
    D("Numbers: naturals, integers, reals", (s, h) => {
      h.rows(s, [
        ["Natural numbers: the positional pattern itself", ["n bits cover 0 to 2^n - 1"]],
        ["Signed integers: two's complement", ["a 32-bit register covers about -2 billion to +2 billion"]],
        ["Real numbers: fixed point or IEEE 754 floating point", ["value = (-1)^sign x 1.fraction x 2^(exponent - bias)"]],
      ], h.MX, h.TOP, h.CW, 2.55);
      h.tx(s, "single precision, 32 bits: about 7 decimal digits, up to about 3.4 x 10^38", { x: h.MX, y: 4.2, w: h.CW, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      h.bits(s, h.MX, 4.82, h.CW, [{ n: 1, value: "s", color: P.red }, { n: 8, value: "exponent (8)", color: P.amber }, { n: 23, value: "fraction (23)", color: P.teal }], { h: 0.5, fs: 14, minW: 0.5 });
      h.tx(s, "double precision, 64 bits: about 16 decimal digits, up to about 1.8 x 10^308", { x: h.MX, y: 5.5, w: h.CW, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      h.bits(s, h.MX, 6.12, h.CW, [{ n: 1, value: "s", color: P.red }, { n: 11, value: "exponent (11)", color: P.amber }, { n: 52, value: "fraction (52)", color: P.teal }], { h: 0.5, fs: 14, minW: 0.5 });
    }, "Preview only. Lecture 05 covers naturals and signed integers; Lecture 06 covers fixed point and IEEE 754. The source slide wrote the value formula in a garbled form: the correct one is on the slide."),

    H("Text", "Characters are numbers too."),
    G("ASCII: one character, one byte", ["Character", "Decimal", "Hex", "Binary", "Note"], [
      ["A", "65", "0x41", "0100 0001", "capital letters start at 65"],
      ["a", "97", "0x61", "0110 0001", "same as A with one more bit: 97 - 65 = 32"],
      ["0", "48", "0x30", "0011 0000", "the character zero is not the number zero"],
      ["space", "32", "0x20", "0010 0000", "a character like any other"],
      ["newline", "10", "0x0A", "0000 1010", "a control character"],
      ["NUL", "0", "0x00", "0000 0000", "marks the end of a C string"],
    ], "ASCII (1963) uses 7 bits: 128 characters, English only. Upper and lower case differ only in bit 5: xori with 0x20 switches case, a first taste of Boolean algebra on text.", { widths: [1.8, 1.5, 1.4, 2.4, 5.1], mono: [0, 2, 3] }),
    D("Strings: a sequence of characters in memory", (s, h) => {
      const cw = 0.78, x = 3.2;
      const row = (y, label, cells, note) => {
        h.tx(s, label, { x: h.MX, y, w: x - h.MX - 0.2, h: 0.62, fontSize: 15, bold: true, color: P.steel, valign: "middle" });
        h.mem(s, x, y, cw, cells, { h: 0.62, fs: 17, labelFs: 12, labelMono: true });
        if (note) h.tx(s, note, { x: x + cells.length * cw + 0.25, y, w: h.W - h.MX - (x + cells.length * cw + 0.25), h: 0.62, fontSize: 13.5, color: P.mute, valign: "middle" });
      };
      row(h.TOP + 0.1, "C string", [..."CIAO"].map((c) => ({ val: c, label: c.charCodeAt(0).toString(16).toUpperCase() })).concat([{ val: "\\0", label: "00", color: P.red }]), "the end is marked by a zero byte");
      row(h.TOP + 1.35, "Pascal string", [{ val: "4", label: "04", color: P.amber }].concat([..."CIAO"].map((c) => ({ val: c, label: c.charCodeAt(0).toString(16).toUpperCase() }))), "the length comes first");
      const hello = [..."HELLO PRG32"].map((c) => ({ val: c === " " ? "␣" : c, label: c.charCodeAt(0).toString(16).toUpperCase() })).concat([{ val: "\\0", label: "00", color: P.red }]);
      row(h.TOP + 2.75, '.asciz "HELLO PRG32"', hello);
      h.card(s, h.MX, 5.3, h.CW, 1.45, P.tealSoft);
      h.tx(s, "The z of .asciz means zero-terminated: the assembler stores twelve bytes for eleven characters. prg32_gfx_text8 receives only the address of the first byte in a2, and reads until it finds the zero.", { x: h.MX + 0.3, y: 5.35, w: h.CW - 0.6, h: 1.35, fontSize: 17, valign: "middle" });
    }, "The numbers under the cells are the ASCII codes in hexadecimal. This is the string of Lecture 02, step 2. What happens if the zero is missing? The function keeps reading whatever follows in memory."),
    G("Unicode and UTF-8: every writing system", ["Character", "Code point", "UTF-8 bytes", "Length"], [
      ["A", "U+0041", "41", "1 byte: identical to ASCII"],
      ["è", "U+00E8", "C3 A8", "2 bytes"],
      ["€", "U+20AC", "E2 82 AC", "3 bytes"],
      ["日", "U+65E5", "E6 97 A5", "3 bytes"],
      ["😀", "U+1F600", "F0 9F 98 80", "4 bytes"],
    ], "Unicode assigns a number (code point) to every character of every script; UTF-8 encodes that number in one to four bytes and is compatible with ASCII. It is the encoding of the web and of your source files. Consequence: the length of a string in bytes is not its length in characters.", { widths: [2, 2.6, 3.4, 4.2], mono: [1, 2], caption: "Unicode gives every character a number; UTF-8 stores it in one to four bytes, and plain ASCII text is already valid UTF-8." }),
    D("Byte order: little-endian", (s, h) => {
      h.tx(s, "value: .word 0x12345678", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      const cw = 1.5, x = 4.6, cols = [P.teal, P.amber, P.violet, P.green];
      h.tx(s, "little-endian\n(RISC-V, x86, ARM)", { x: h.MX, y: h.TOP + 1.0, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, color: P.ink, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 1.0, cw, ["78", "56", "34", "12"].map((v, i) => ({ val: v, addr: `address A+${i}`, color: cols[3 - i] })), { h: 0.8, fs: 24 });
      h.tx(s, "big-endian\n(network protocols)", { x: h.MX, y: h.TOP + 2.5, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, color: P.ink, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 2.5, cw, ["12", "34", "56", "78"].map((v, i) => ({ val: v, addr: `address A+${i}`, color: cols[i] })), { h: 0.8, fs: 24 });
      h.rows(s, ["A word is four bytes, and memory is addressed byte by byte: in which order do they go?",
        "Little-endian: the least significant byte at the lowest address. This is what lw and sw do on RISC-V",
        "You notice it when you look at memory in a debugger, or exchange data with another machine"], h.MX, 5.0, h.CW, 1.75);
    }, "The names come from Gulliver's Travels: which end of the egg to break first. In PRG32-QT, open the memory view on a .word and read the bytes."),

    H("Data structures", "From single values to organised collections."),
    C("Five ways to organise data", [
      ["Array", "Elements of the same type, one after another, reached by index: 32, 11, 34, 22."],
      ["List", "Elements linked one to the next: cheap to insert and remove, slow to reach by position."],
      ["Stack", "Last in, first out: push adds on top, pop removes from the top."],
      ["Dictionary", "Pairs of key and value: NA gives NAPOLI, PA gives PALERMO, MI gives MILANO."],
      ["Tree", "A hierarchy: an animal walks or swims, has lungs or gills, two legs or four."],
      ["In the machine", "All of them are bytes in memory plus a rule for finding the next element."],
    ], "You have already used a stack: the frame that saved ra in Lecture 02. The examples are those drawn on the source slide."),
    K("An array in memory, an element in a register", `.section .data
scores: .word 32, 11, 34, 22     # four 32-bit words, 16 bytes

.section .text
    la   t0, scores      # t0 = ADDRESS of element 0
    li   t1, 2           # index i = 2
    slli t1, t1, 2       # offset = i * 4 bytes (shift left by 2)
    add  t0, t0, t1      # ADDRESS of element i
    lw   a0, 0(t0)       # a0 = VALUE of scores[2] = 34`, [
      "An array is a base address plus equal-sized elements",
      "Element i of a word array is at base + 4 x i, because a word is four bytes",
      "slli by 2 multiplies by four: a shift is a multiplication by a power of two",
      "The high-level expression scores[i] is exactly these four instructions",
    ], "The shift-as-multiplication property is proved in Lecture 05 (properties of binary strings). Ask: what does lw read if i = 4? Whatever follows the array in memory: the machine does not check bounds."),

    H("Data and algorithms", "From big data to machine learning."),
    DEF("Data, big data and data science", "Big data", "Data that exceed the limits of traditional database tools.", [
      "Structured and unstructured: economy, geolocation, time series, social networks",
      "Petabytes and zettabytes: billions of terabytes",
      "Technologies that extract knowledge and value from data: parallel computing and GPUs",
      "Data science: the analysis of large quantities of information",
    ]),
    C("Where the data come from", [
      ["Sensor data", "The environment, GPS positions, the Internet of Things: every device measures something."],
      ["Transactions", "Purchases at the supermarket, credit cards, online orders."],
      ["Public data", "Administrative records, territory, consumption: open data from institutions."],
      ["Social media", "Preferences, politics, sentiment: what people write and share."],
    ], "Pipeline on the source slide: generation and acquisition, extraction and cleaning, storage and integration (big data management); modelling, analysis and interpretation (big data analytics)."),
    T("GPGPU: general-purpose computing on graphics processors", [
      "A GPU has thousands of simple cores built to do the same operation on many data at once",
      "Summing N items needs only log2 N parallel steps instead of N sequential ones",
      "The same hardware that draws video games now trains neural networks",
      "Under every core there are still registers, instructions and bits",
    ], "Figure from the source deck: a parallel sum (reduction) on GPU cores.", { img: "gpgpu_sum.png", cap: "A parallel sum on GPU cores: log2 N steps", wide: true }),
    DEF("Data mining", "Data mining", "The set of techniques and methodologies for extracting information or knowledge from large quantities of data.", [
      "Decision trees and classification",
      "Rule learning and Bayesian methods",
      "Neural networks and pattern recognition",
    ]),
    T("Algorithms and computability", [
      "A problem is computable if it can be solved by an algorithm",
      ["The Turing machine", ["an ideal computer with a program, expressed mathematically through sets, relations and functions"]],
      ["The von Neumann machine", ["the computing architecture able to execute a program that realises an algorithm for the Turing machine"]],
      "A problem that no algorithm on a Turing machine can solve cannot be solved by any computer",
    ], "The last line is the Church-Turing thesis, stated informally. The halting problem is the classic example of a problem that is not computable.", { big: "?", label: "Not every problem has an algorithm: some questions no computer will ever answer" }),
    C("Five properties of an algorithm", [
      ["Atomic", "The steps are elementary: they cannot be broken down any further."],
      ["Unambiguous", "Each step is interpreted in one direct way by the executor, human or machine."],
      ["Finite", "A finite number of steps and a finite quantity of input data."],
      ["Terminating", "Execution ends after a finite time."],
      ["Effective", "Execution leads to a single, well-defined result."],
    ], "A RISC-V instruction is the model of an atomic, unambiguous step: its meaning is fixed by the specification, bit by bit."),
    V("Deterministic and non-deterministic algorithms",
      ["Deterministic", ["For every instruction there is, with the same input, exactly one next step", "The path of the algorithm exists and is unique: y = f(x)", "Example: converting a unit of measure", "Example: first_update, which always adds one"]],
      ["Non-deterministic", ["With the same input it can behave differently at each execution", "Probabilistic algorithms use a random number generator", "Concurrent algorithms can depend on timing (race conditions)", "Example: a game that places the enemy with prg32_random_number"]]),
    K("A probabilistic algorithm: is n prime?", `is_probably_prime(n):
    repeat 30 times:
        a = random(2, n - 2)
        if a^(n-1) mod n != 1:
            return COMPOSITE          # certain
    return PROBABLY PRIME             # almost certain

random_walk():
    while t < t_final:
        r = random(-1, 1)
        x = x + r * u                 # a different path every run
        y = y + r * v
        t = t + 1`, [
      "The first answer is always right; the second is right with overwhelming probability",
      "Trading a tiny chance of error for a huge gain in speed is how real cryptography tests primes",
      "A random walk gives a different result at every run: simulations average many of them",
    ], "The Fermat test shown here is the simplest; real libraries use Miller-Rabin, which closes its loopholes. Both examples are from the source slide.", "txt"),
    T("Machine learning", [
      "A method of data analysis that automates the construction of an analytical model",
      "The computer finds hidden patterns without being explicitly programmed where to look",
      ["Today's generative models are the same idea at an enormous scale", ["a large language model predicts the next piece of text from billions of learned numbers"]],
      "Those numbers are bits in memory, multiplied and added by processors: the subject of this course",
      "A model can be wrong with great confidence: you need the fundamentals to check it",
    ], "The last point connects to the #nogpt rule of the course: the exam checks that the fundamentals are in the student's head.", { big: "y = f(x)", label: "A classical program is written by a person. In machine learning, f is learned from examples." }),

    Q("How many different values can one byte represent?", ["8", "16", "255", "256"], 3, "A byte is 8 bits: 2^8 = 256 patterns, for example the naturals from 0 to 255."),
    Q("The PRG32 colour 0xF81F is:", ["red", "magenta", "cyan", "yellow"], 1, "0xF81F = 11111 000000 11111: red and blue at maximum, green at zero: magenta."),
    Q('How many bytes does .asciz "CIAO" occupy in memory?', ["3", "4", "5", "8"], 2, "Four characters plus the terminating zero byte."),
    Q("On RISC-V, .word 0x0000ABCD is stored at address A. Which byte is at address A?", ["0x00", "0xAB", "0xCD", "0xDC"], 2, "RISC-V is little-endian: the least significant byte, 0xCD, goes at the lowest address."),
    X("Exercises on PRG32", [
      "Change the bar of Lecture 02 to magenta, then to a dark grey of your choice: compute the RGB565 value by hand first",
      "Print your name with prg32_gfx_text8. How many bytes does the string occupy?",
      "Declare an array of four colours with .word and draw four bars, one per colour, reading each colour with lw",
      "In PRG32-QT open the memory view on your string and on your array: find the terminating zero and check the byte order",
    ], "Four bars in four colours; in the memory view the string ends with 00 and each .word shows its least significant byte first.",
      "Dark grey example: red 8 of 31, green 16 of 63, blue 8 of 31 = 01000 010000 01000 = 0x4208, the GREY of the textbook lab."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["bit / byte / word", "bit / byte / parola", "string", "stringa"],
      ["positional notation", "notazione posizionale", "array", "vettore (array)"],
      ["hexadecimal", "esadecimale", "linked list", "lista concatenata"],
      ["sampling", "campionamento", "stack", "pila"],
      ["quantisation", "quantizzazione", "tree", "albero"],
      ["byte order (endianness)", "ordinamento dei byte", "machine learning", "apprendimento automatico"],
    ], null, { widths: [3.4, 3, 3, 3.2] }),
    T("Conclusions and reading", [
      "Digital information is a pattern of bits plus a convention for reading it",
      "The same sixteen bits can be a number, a colour or two characters: the program decides",
      "Hexadecimal is a compact spelling of binary, four bits per digit",
      "Text is numbers (ASCII, UTF-8); structures are bytes plus a rule for finding the next element",
      "Data are the currency of this realm; algorithms turn data into information fit for decisions",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, sections 2.4 and 2.9", "Charles Petzold: Code, chapters on bits, bytes and text", "Sebastian Raschka: Machine Learning with Python (suggested in the original course)"]],
    ], "Next lecture: number representation, formally."),
  ],
});
