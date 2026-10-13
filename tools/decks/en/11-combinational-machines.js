// Lecture 11 - Combinational machines.
// Sources: 09 and 10 - Macchine per il trattamento dei codici (codes, encoders, decoders, multiplexers,
// comparators, parity) and the taxonomy of 08 - Macchine sequenziali.  Figures redrawn; RISC-V is the reference processor.
const G7 = require("../../lib/gates");

function decoderSvg() {
  const ys = [40, 100, 160, 220], rail = { A: 60, An: 130, B: 170, Bn: 240 }, terms = [["An", "Bn"], ["A", "Bn"], ["An", "B"], ["A", "B"]];
  let w = G7.wire([[14, 40], [60, 40], [60, 231]]) + G7.wire([[60, 40], [70, 40]], true) + G7.wire([[116, 40], [130, 40], [130, 171]]) +
    G7.wire([[14, 290], [170, 290], [170, 193]]) + G7.wire([[170, 290], [180, 290]], true) + G7.wire([[226, 290], [240, 290], [240, 73]]) +
    G7.gate("not", 70, 18) + G7.gate("not", 180, 268);
  ys.forEach((y, i) => {
    const p = G7.pins("and", 300, y), [ta, tb] = terms[i];
    w += G7.wire([[rail[ta], p.a[1]], p.a], true) + G7.wire([[rail[tb], p.b[1]], p.b], true) + G7.wire([p.out, [392, p.out[1]]]) + G7.gate("and", 300, y) + G7.text(398, p.out[1] + 6, `U${i}`, { size: 17 });
  });
  return G7.doc(440, 315, w + G7.text(0, 34, "A", { size: 18 }) + G7.text(0, 284, "B", { size: 18 }) + G7.text(134, 30, "A'", { size: 12, bold: false, fill: "#5B6B78" }) + G7.text(244, 304, "B'", { size: 12, bold: false, fill: "#5B6B78" }));
}

function mux2Svg() {
  const a0 = G7.pins("and", 200, 40), a1 = G7.pins("and", 200, 140), o = G7.pins("or", 320, 85), n = G7.pins("not", 100, 7);
  return G7.doc(430, 215,
    G7.wire([[30, 73], a0.b]) + G7.wire([[30, 151], a1.a]) + G7.wire([[30, 173], a1.b]) +
    G7.wire([[70, 151], [70, 29], n.a], true) + G7.wire([n.out, [170, 29], [170, 51], a0.a]) +
    G7.wire([a0.out, [290, 62], [290, 96], o.a]) + G7.wire([a1.out, [290, 162], [290, 118], o.b]) + G7.wire([o.out, [400, 107]]) +
    G7.gate("not", 100, 7) + G7.gate("and", 200, 40) + G7.gate("and", 200, 140) + G7.gate("or", 320, 85) +
    G7.text(4, 79, "I0", { size: 17 }) + G7.text(8, 156, "S", { size: 17 }) + G7.text(4, 190, "I1", { size: 17 }) + G7.text(406, 113, "Y", { size: 17 }) +
    G7.text(150, 20, "S'", { size: 12, bold: false, fill: "#5B6B78" }));
}

function comparatorSvg() {
  const x0 = G7.pins("xnor", 120, 20), x1 = G7.pins("xnor", 120, 110), a = G7.pins("and", 260, 65);
  return G7.doc(400, 175,
    G7.wire([[40, 31], x0.a]) + G7.wire([[40, 53], x0.b]) + G7.wire([[40, 121], x1.a]) + G7.wire([[40, 143], x1.b]) +
    G7.wire([x0.out, [225, 42], [225, 76], a.a]) + G7.wire([x1.out, [225, 132], [225, 98], a.b]) + G7.wire([a.out, [350, 87]]) +
    G7.gate("xnor", 120, 20) + G7.gate("xnor", 120, 110) + G7.gate("and", 260, 65) +
    G7.text(8, 36, "A0", { size: 16 }) + G7.text(8, 58, "B0", { size: 16 }) + G7.text(8, 126, "A1", { size: 16 }) + G7.text(8, 148, "B1", { size: 16 }) + G7.text(356, 93, "EQ", { size: 16 }));
}

function sevenSegSvg(lit) {
  const on = "#B23A48", off = "#DDE3E7", seg = (id, x, y, w, h, lx, ly) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${lit.includes(id) ? on : off}"/>` + G7.text(lx, ly, id, { anchor: "middle", size: 15, fill: lit.includes(id) ? "#fff" : "#5B6B78" });
  return G7.doc(170, 270, `<rect width="170" height="270" rx="12" fill="#1B2530"/>` +
    seg("a", 40, 18, 90, 20, 85, 33) + seg("b", 132, 40, 20, 85, 142, 88) + seg("c", 132, 147, 20, 85, 142, 195) + seg("d", 40, 234, 90, 20, 85, 249) +
    seg("e", 18, 147, 20, 85, 28, 195) + seg("f", 18, 40, 20, 85, 28, 88) + seg("g", 40, 126, 90, 20, 85, 141));
}

const box7 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "11", file: "11-Computer_Architecture-Combinational_Machines",
  title: "Combinational Machines", short: "Combinational machines",
  sub: "Codes, decoders, multiplexers, comparators, parity: the circuits a RISC-V processor is assembled from",
  quote: ["...it's not my fault, the carrots touched the peas...", "Alan Turing as a boy, in the film The Imitation Game, 2014"],
  cover: "game_breakout.png",
  notes: "The quotation is translated back from the Italian version used in the original deck. Spiral: a table lookup in assembly is a multiplexer; the lecture then builds the standard combinational blocks and shows where each one sits inside a RISC-V processor (the old course used the Motorola 68000 as reference).",
  slides: [
    O("What you will be able to do by the end", [
      "Tell a combinational machine from a sequential one",
      "Compute how many bits a fixed-length code needs, and recognise incomplete and redundant codes",
      "Design a decoder and an encoder, and say what a transcoder does",
      "Explain what a multiplexer and a demultiplexer do, and build them from gates",
      "Build a comparator and a parity network, and say what a parity check can and cannot detect",
      "Point to each of these machines inside a RISC-V processor",
    ]),

    H("Warm-up on the machine", "A selection with no memory."),
    K("Choose one of four colours", `# a0 = selector, 0 to 3      result: a4 = the selected colour

    la   t0, palette         # four words: the data inputs
    slli t1, a0, 2           # selector * 4 bytes
    add  t0, t0, t1          # address of the selected word
    lw   a4, 0(t0)           # the selected input reaches the output

.section .rodata
# red, green, blue, yellow
palette: .word 0xf800, 0x07e0, 0x001f, 0xffe0`, [
      "The same selector always gives the same colour: the result depends only on the present inputs",
      "Nothing is remembered from one use to the next",
      "In hardware this is a multiplexer: four data inputs, two selection bits, one output",
      "A processor contains dozens of them. How are they built?",
    ], "The array access of Lecture 04, read as a circuit. In the processor the selection is done by gates in well under a nanosecond; here it takes four instructions."),

    H("Combinational machines", "Outputs that depend only on the present inputs."),
    V("A taxonomy of digital circuits",
      ["Combinational circuits", ["The value of the outputs at a given instant depends only on the value of the inputs at that same instant", "No memory, no feedback loops", "Completely described by a truth table", "Examples: adders, decoders, multiplexers, the ALU"]],
      ["Sequential circuits", ["The outputs depend on the present inputs and on the past history of the inputs", "They need the concepts of time and of state", "Described by a state table or a state diagram", "Examples: latches, flip-flops, registers, counters, the processor as a whole (Lecture 13)"]],
      "Reti combinatorie and reti sequenziali. The definition of a sequential circuit implies time and state: both are the subject of the next lecture."),
    F("Designing a combinational machine", [
      "Specification|what the machine must do, in words",
      "Truth table|one row per input combination, don't-cares included",
      "Minimisation|Karnaugh maps or algebra, one output at a time",
      "Network|gates, or standard blocks such as decoders and multiplexers",
    ], "Analysis runs the other way: from the schematic to the truth table. Both were introduced in Lecture 08; the method is that of Lecture 09.",
      "For more than four or five inputs nobody draws maps: designers compose standard blocks, which is why this lecture is a catalogue of them."),
    T("Real gates take time", [
      "A gate does not answer instantly: its output settles after a propagation delay",
      "The delay of a network is that of its slowest path from an input to an output: the critical path",
      "While the signals travel, the outputs can be temporarily wrong",
      "A combinational machine is correct only after it has settled: something must tell us when to look",
      "That something is the clock, and it is where sequential machines begin",
    ], "In a ripple-carry adder (Lecture 09) the critical path crosses all thirty-two full adders. The clock period of a processor must be longer than its longest critical path.", { big: "delay", label: "every gate adds a little time; the slowest path through the network sets the speed of the whole machine" }),

    H("Codes", "Before building machines that treat codes, what is a code?"),
    C("The concept of information", [
      ["Attribute", "The meaning associated with the information. Example: the mark of the Computer Architecture exam."],
      ["Type", "The set of elements among which the value is chosen. Example: the marks from 18 to 30, and 30 with honours."],
      ["Value", "The element actually taken. Example: 30. Giving information means choosing one element in a defined set."],
      ["Cardinality", "The number N of elements of the type. Here N = 14. A type with more elements carries more information."],
      ["Value and encoding", "The same value can be written in many ways: 3, III, three. A, B, C, D can stand for 30 with honours, 30, 29, 28."],
      ["Simple and structured", "Simple types are atomic: integers, characters. Structured types combine simple ones: a position is latitude and longitude."],
    ], "Informazione completa: the attribute takes a value of a certain type. '30 e lode' is not a number: it is a fourteenth element of the type, and how to write it is a problem of encoding."),
    T("Alphabets and strings", [
      ["An alphabet is a finite, non-empty set of symbols", ["binary {0, 1}; decimal {0, ..., 9}; the letters {a, ..., z}"]],
      "A string, or word, over an alphabet is a finite sequence of its symbols",
      ["The length of a string x is the number of its symbols, written |x|", ["01000010 is a binary string of length 8"]],
      "The string of length 0 is the empty string",
      "The set of all strings over an alphabet S, the empty one included, is written S*",
    ], "An infinite sequence 010101... is not a string and does not belong to {0,1}*. 'wingardium leviosa' is a string of length 18 over the letters and the space.", { big: "S*", label: "all the finite strings that can be written with the symbols of the alphabet S" }),
    DEF("Codes of fixed length", "Code", "A code maps every element of a source type T, of cardinality N, to a string of symbols of a code alphabet E with k symbols: the code word.", [
      "Fixed length: every code word has the same length m; there are k^m possible words",
      "To encode N elements we need k^m >= N, so the minimum length is m = ceil(log_k N)",
      "In binary: m = ceil(log2 N). The fourteen exam marks need 4 bits; the 32 RISC-V registers need exactly 5",
      "Incomplete code: N is not a power of k, and k^m - N words are left unassigned",
    ], "Codice a lunghezza fissa. The five bits of a register number are the fields rd, rs1 and rs2 of a RISC-V instruction (Lecture 02). Fourteen marks leave 16 - 14 = 2 unassigned words."),
    G("An incomplete code: binary-coded decimal", ["Digit", "BCD 8421", "Excess-3", "Digit", "BCD 8421", "Excess-3"], [
      ["0", "0000", "0011", "5", "0101", "1000"],
      ["1", "0001", "0100", "6", "0110", "1001"],
      ["2", "0010", "0101", "7", "0111", "1010"],
      ["3", "0011", "0110", "8", "1000", "1011"],
      ["4", "0100", "0111", "9", "1001", "1100"],
    ], "Ten digits need ceil(log2 10) = 4 bits; six of the sixteen words are never used: in BCD 8421 they are 1010 to 1111. Unused words become don't-care conditions when we design a circuit (Lecture 09).", { widths: [1.2, 2, 2, 1.2, 2, 2], mono: [1, 2, 4, 5], fs: 20, align: "center", caption: "Four bits for ten digits: six code words are not assigned. They will be the don't-cares of our circuits." }),
    D("Redundant codes", (s, h) => {
      h.rows(s, [
        "A redundant code uses more symbols than strictly necessary: its length is greater than the minimum m",
        "Only some of the possible words are legal; the others cannot be produced by the encoder",
        "If a word arrives that is not legal, something altered it on the way: the error is detected",
        "Redundancy is the price paid to detect, and sometimes to correct, errors",
      ], h.MX, h.TOP, 6.5, h.BOT - h.TOP);
      h.table(s, 7.6, h.TOP, [1.3, 1.8, 2.0], ["Element", "Code 1", "Code 2"], [["A", "00", "000"], ["B", "01", "011"], ["C", "10", "101"], ["D", "11", "110"]], { fs: 17, mono: [1, 2], align: "center", rowH: 0.48 });
      h.card(s, 7.6, h.TOP + 2.75, 5.1, 2.45, P.redSoft);
      h.tx(s, "Code 1 is not redundant: every 2-bit word is legal, so an altered bit turns one element into another without anyone noticing.\nCode 2 adds a third bit that makes the number of 1s even. The words 001, 010, 100 and 111 are not legal: a single altered bit is always detected.", { x: 7.8, y: h.TOP + 2.85, w: 4.7, h: 2.25, fontSize: 14, valign: "middle" });
    }, "The original slide showed the same idea with a picture and a different choice of illegal words. Code 2 is Code 1 plus an even-parity bit: the parity machines come later in this lecture."),
    T("Codes of variable length", [
      "The length of the code word depends on the element: frequent elements get short words",
      "Prefix property: no code word is the beginning of a longer one, so the reader always knows where a word ends",
      "It pays when the elements do not all have the same probability: less space in memory, less time in transmission",
      ["You have already met two", ["UTF-8: one to four bytes per character (Lecture 04)", "RISC-V instructions on the kit: 16 or 32 bits each, and the two lowest bits say which"]],
    ], "RV32IMAC: the C extension encodes the most common instructions in 16 bits. An instruction whose two least significant bits are 11 is 32 bits long; any other pattern marks a 16-bit instruction. Morse code and Huffman coding are the classic examples.", { big: "11", label: "the two lowest bits of every 32-bit RISC-V instruction: the length is written in the code word itself" }),

    H("Decoders and encoders", "From a code word to one line, and back."),
    T("The decoded representation", [
      "A code in which the length of the word equals the cardinality N of the set: m = N",
      "Every code word has exactly one bit at 1: one line per element",
      "Simple to use, because the active line directly selects something, but costly in wires",
      "Compact code inside a word, decoded representation where a choice must be acted upon",
    ], "Also called one-hot. The seven lamps of lab 06 are a decoded representation of the bit number; the 32 write-enable lines of the RISC-V registers are another.", { big: "0 0 1 0", label: "one of four: the third line is asserted, so the third element is the one chosen" }),
    D("The decoder", async (s, h) => {
      h.rows(s, [
        "Receives a code word of m bits and asserts the one output line, out of N = 2^m, that corresponds to it",
        "Each output is a minterm of the inputs: a decoder generates all of them",
        "With an enable input EN: when EN = 0 no output is asserted",
      ], h.MX, h.TOP, 5.6, 2.4);
      h.table(s, h.MX, 4.15, [0.55, 0.55, 0.7, 0.7, 0.7, 0.7], ["B", "A", "U0", "U1", "U2", "U3"], [["0", "0", "1", "0", "0", "0"], ["0", "1", "0", "1", "0", "0"], ["1", "0", "0", "0", "1", "0"], ["1", "1", "0", "0", "0", "1"]],
        { fs: 15, mono: [0, 1, 2, 3, 4, 5], align: "center", bold0: false, rowH: 0.4, cellHi: { "0,2": P.tealSoft, "1,3": P.tealSoft, "2,4": P.tealSoft, "3,5": P.tealSoft } });
      h.tx(s, "U0 = B'A'\nU1 = B'A\nU2 = B A'\nU3 = B A", { x: h.MX + 4.2, y: 4.15, w: 1.6, h: 2.0, fontSize: 15, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.card(s, 6.6, h.TOP, h.W - h.MX - 6.6, h.BOT - h.TOP);
      await h.svg(s, decoderSvg(), 6.8, h.TOP + 0.15, h.W - h.MX - 7.0, h.BOT - h.TOP - 0.3);
    }, "Synthesis of the 2-to-4 decoder (1 out of 4). A is the least significant bit. Decodificatore: the block symbol is a box marked 1/N."),
    D("Composing decoders: from 2-to-4 to 4-to-16", (s, h) => {
      const x1 = h.MX + 1.2, y0 = h.TOP + 0.05, x2 = 5.0, st = 1.07;
      box7(s, h, "decoder 2-to-4\nhigh bits D C", x1, y0 + 1.45, 2.2, 1.1, P.amber, 14);
      h.arrow(s, h.MX + 0.55, y0 + 2.0, x1 - 0.03, y0 + 2.0, P.mute, 2); h.tx(s, "D C", { x: h.MX, y: y0 + 1.82, w: 0.6, h: 0.3, fontSize: 15, fontFace: h.MONO, bold: true });
      for (let i = 0; i < 4; i++) {
        const y = y0 + i * st;
        box7(s, h, "decoder 2-to-4\nEN", x2, y, 2.2, 0.85, P.teal, 14);
        h.arrow(s, x1 + 2.23, y0 + 1.6 + i * 0.27, x2 - 0.03, y + 0.42, P.amber, 1.75);
        h.arrow(s, x2 + 2.23, y + 0.42, x2 + 3.1, y + 0.42, P.mute, 2);
        h.tx(s, `U${i * 4} ... U${i * 4 + 3}`, { x: x2 + 3.2, y: y + 0.22, w: 1.9, h: 0.4, fontSize: 15, fontFace: h.MONO, bold: true, valign: "middle" });
      }
      h.tx(s, "the low bits B A go to all four", { x: x2 - 0.8, y: y0 + 3 * st + 0.9, w: 3.8, h: 0.3, fontSize: 13, italic: true, color: P.mute, align: "center" });
      h.card(s, 10.2, h.TOP, h.W - h.MX - 10.2, 4.45, P.tealSoft);
      h.tx(s, "The first decoder enables one of the four others; the enabled one asserts one of its four lines. Five small decoders select one line of sixteen.", { x: 10.35, y: h.TOP + 0.1, w: h.W - h.MX - 10.5, h: 4.25, fontSize: 15, valign: "middle" });
      h.tx(s, "Standard parts existed for this: the SN74139 holds two 2-to-4 decoders with enable in one package. Today the same structure is described in a hardware language and placed on the chip automatically.", { x: h.MX, y: 6.15, w: h.CW, h: 0.6, fontSize: 14.5, valign: "middle" });
    }, "Modular composition (composizione modulare di decoder 4:16). In the real SN74139 the enable and the outputs are active low: a detail the original slide simplified, as this one does."),
    D("In the processor: which register is written?", (s, h) => {
      h.tx(s, "addi t1, t1, 1     =     0x00130313", { x: h.MX, y: h.TOP - 0.1, w: h.CW, h: 0.45, fontSize: 21, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 0.4, h.TOP + 0.85, h.CW - 0.8, [
        { n: 12, value: "000000000001", color: P.mute }, { n: 5, value: "00110", color: P.mute }, { n: 3, value: "000", color: P.mute },
        { n: 5, label: "rd = 6", value: "00110", color: P.green }, { n: 7, value: "0010011", color: P.mute },
      ], { h: 0.6, minW: 1.3, fs: 16 });
      box7(s, h, "decoder 5-to-32", 7.0, h.TOP + 2.1, 3.2, 0.55, P.green, 16);
      h.arrow(s, 8.6, h.TOP + 1.82, 8.6, h.TOP + 2.08, P.green, 2.25); h.arrow(s, 8.6, h.TOP + 2.67, 8.6, h.TOP + 3.18, P.green, 2.25);
      const cw = h.CW / 32;
      h.mem(s, h.MX, h.TOP + 3.2, cw, Array.from({ length: 32 }, (_, i) => ({ val: i === 6 ? "1" : "0", label: `x${i}`, color: i === 6 ? P.green : undefined })), { h: 0.5, fs: 12, labelFs: 9 });
      h.rows(s, ["The five bits of rd are a code word: thirty-two registers, ceil(log2 32) = 5",
        "A 5-to-32 decoder turns them into thirty-two write-enable lines: only x6, that is t1, receives the result",
        "Two more selections, on rs1 and rs2, choose which registers are read"], h.MX, 5.72, h.CW, 1.03);
    }, "The instruction of Lecture 02. Grey fields are not involved. The write enable of x0 is simply not connected: x0 always reads zero. Reading uses multiplexers, shown in a few slides."),
    T("The encoder", [
      "The inverse machine: it receives a decoded representation, N lines of which one is asserted, and outputs the corresponding code word of m = ceil(log2 N) bits",
      "Each output bit is the OR of the input lines whose number has a 1 in that position",
      ["If several lines can be asserted together a priority encoder is needed", ["it outputs the number of the asserted line with the highest priority"]],
      "Example: a keypad with one wire per key becomes a compact key number",
    ], "Codificatore. For N = 4: C0 = U1 + U3, C1 = U2 + U3. Priority encoders appear again with interrupts: several devices ask for attention, one number reaches the processor.", { big: "N to m", label: "from one line among N to a code word of m bits: m = ceil(log2 N)" }),
    D("Transcoders: the seven-segment display", async (s, h) => {
      await h.svg(s, sevenSegSvg(["a", "b", "g", "e", "d"]), h.MX, h.TOP, 2.6, h.BOT - h.TOP);
      const pat = ["1111110", "0110000", "1101101", "1111001", "0110011", "1011011", "1011111", "1110000", "1111111", "1111011"];
      h.table(s, 3.5, h.TOP, [0.75, 1.1, ...Array(7).fill(0.5)], ["Digit", "BCD", "a", "b", "c", "d", "e", "f", "g"], pat.map((p, i) => [String(i), i.toString(2).padStart(4, "0"), ...p.split("")]),
        { fs: 13.5, mono: [1, 2, 3, 4, 5, 6, 7, 8], align: "center", rowH: 0.385, hi: { 2: P.redSoft } });
      h.card(s, 9.75, h.TOP, h.W - h.MX - 9.75, h.BOT - h.TOP, P.tealSoft);
      h.tx(s, "A transcoder turns each word of a code C1 into the corresponding word of a code C2 defined on the same set.\n\nHere: from BCD to the seven lines that light the segments a to g. The digit 2 lights a, b, g, e and d.\n\nSeven outputs: seven functions of four variables to synthesise.", { x: 9.9, y: h.TOP + 0.15, w: h.W - h.MX - 10.05, h: h.BOT - h.TOP - 0.3, fontSize: 14.5, valign: "middle" });
    }, "Transcodificatore BCD - display a 7 segmenti. Each segment is an LED switched by a digital signal. The six unused BCD words are don't-cares for all seven functions."),
    D("Synthesising segment a", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.7, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.6, h.TOP + 0.15, 0.92, { rowVar: "A B", colVar: "C D", rowLabels: ["00", "01", "11", "10"], colLabels: ["00", "01", "11", "10"],
        vals: [[1, 0, 1, 1], [0, 1, 1, 1], ["x", "x", "x", "x"], [1, 1, "x", "x"]],
        loops: [{ r: 2, c: 0, rs: 2, cs: 4, color: P.red }, { r: 0, c: 2, rs: 4, cs: 2, color: P.violet, inset: 0.05 }, { r: 1, c: 1, rs: 2, cs: 2, color: P.green, inset: 0.1 },
          ...[[0, 0], [0, 3], [3, 0], [3, 3]].map(([r, c]) => ({ r, c, rs: 1, cs: 1, color: P.amber, inset: 0.14 }))] });
      h.tx(s, "a = A + C + BD + B'D'", { x: h.MX, y: h.TOP + 4.63, w: 5.7, h: 0.5, fontSize: 21, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "Inputs A B C D: the BCD digit, A most significant. Segment a is off only for the digits 1 and 4",
        "The words 1010 to 1111 never occur: six don't-cares, marked x",
        ["Using the x cells as 1s the groups become large", ["red: A; violet: C; green: BD; amber, the four corners: B'D'"]],
        "Without the don't-cares the groups would be smaller and the expression longer",
        "Six more maps give the segments b to g: a complete transcoder",
      ], 6.7, h.TOP, h.W - h.MX - 6.7, h.BOT - h.TOP);
    }, "Worked example joining Lecture 09 (maps, don't-cares) with this one. Good laboratory exercise: segments b to g. Check: digit 0 (0000) is covered by the corners, digit 9 (1001) by A."),

    H("Multiplexers and demultiplexers", "Selecting a source, selecting a destination."),
    D("The multiplexer", async (s, h) => {
      h.rows(s, [
        "A combinational circuit with 2^n data inputs, n selection lines and one output",
        "It selects one of the 2^n input signals and transfers it to the single output line",
        "Addressable: a decoder on the selection lines enables one AND gate; an OR collects the result. The datum is chosen by an address, not by a decoded line",
      ], h.MX, h.TOP, 6.0, 3.0);
      h.tx(s, "2 inputs:  Y = S' I0 + S I1", { x: h.MX, y: 4.75, w: 6.0, h: 0.4, fontSize: 16, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "4 inputs:  Y = S1'S0' I0 + S1'S0 I1\n             + S1 S0' I2 + S1 S0 I3", { x: h.MX, y: 5.25, w: 6.0, h: 0.8, fontSize: 16, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "Each data input is multiplied by one minterm of the selection lines.", { x: h.MX, y: 6.2, w: 6.0, h: 0.5, fontSize: 13.5, italic: true, color: P.mute });
      h.card(s, 7.0, h.TOP, h.W - h.MX - 7.0, h.BOT - h.TOP);
      await h.svg(s, mux2Svg(), 7.2, h.TOP + 0.3, h.W - h.MX - 7.4, h.BOT - h.TOP - 1.1);
      h.tx(s, "A multiplexer with two inputs: when S = 0 the output is I0, when S = 1 it is I1", { x: 7.2, y: h.BOT - 0.75, w: h.W - h.MX - 7.4, h: 0.6, fontSize: 13.5, italic: true, color: P.mute, align: "center", valign: "middle" });
    }, "Multiplexer indirizzabile: a MUXL (one enable line per input) plus a decoder. A multiplexer also implements any function of its selection variables: put the truth table on the data inputs."),
    D("The demultiplexer", (s, h) => {
      h.rows(s, [
        "The inverse machine: one data input D, n selection lines, 2^n outputs",
        "It routes the input to the output chosen by the selection lines; the other outputs stay at 0",
        "Addressable demultiplexer: the enable signals come from a decoder on the selection lines",
        "With D fixed at 1 a demultiplexer is exactly a decoder: D plays the role of the enable",
      ], h.MX, h.TOP, 6.6, h.BOT - h.TOP);
      h.table(s, 7.9, h.TOP, [0.7, 0.7, 0.85, 0.85, 0.85, 0.85], ["S1", "S0", "F0", "F1", "F2", "F3"], [["0", "0", "D", "0", "0", "0"], ["0", "1", "0", "D", "0", "0"], ["1", "0", "0", "0", "D", "0"], ["1", "1", "0", "0", "0", "D"]],
        { fs: 16, mono: [0, 1, 2, 3, 4, 5], align: "center", bold0: false, rowH: 0.48, cellHi: { "0,2": P.amberSoft, "1,3": P.amberSoft, "2,4": P.amberSoft, "3,5": P.amberSoft } });
      h.card(s, 7.9, h.TOP + 2.75, 4.8, 2.45, P.amberSoft);
      h.tx(s, "F0 = D S1'S0'      F1 = D S1'S0\nF2 = D S1 S0'      F3 = D S1 S0", { x: 8.0, y: h.TOP + 2.85, w: 4.6, h: 1.0, fontSize: 14.5, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "A multiplexer followed by a demultiplexer carries many signals over one wire, one at a time: the idea behind every shared line.", { x: 8.0, y: h.TOP + 3.95, w: 4.6, h: 1.15, fontSize: 14, valign: "middle" });
    }, "Demultiplexer indirizzabile: Fi = D . Ui, where Ui are the outputs of the decoder."),
    D("In the processor: register or constant?", (s, h) => {
      const y = h.TOP + 0.2;
      box7(s, h, "register file\nvalue of rs1", h.MX, y, 2.6, 0.9, P.steel, 15);
      box7(s, h, "register file\nvalue of rs2", h.MX, y + 1.5, 2.6, 0.9, P.steel, 15);
      box7(s, h, "immediate from the\ninstruction, sign-extended", h.MX, y + 2.75, 2.6, 0.9, P.amber, 13.5);
      box7(s, h, "MUX", 4.6, y + 1.55, 1.1, 2.05, P.teal, 17);
      box7(s, h, "ALU", 7.0, y + 0.1, 1.9, 3.0, P.violet, 22);
      h.arrow(s, h.MX + 2.63, y + 0.45, 6.97, y + 0.45, P.mute, 2.25); h.tx(s, "A", { x: 6.4, y: y + 0.08, w: 0.5, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO });
      h.arrow(s, h.MX + 2.63, y + 1.95, 4.57, y + 1.95, P.mute, 2.25); h.tx(s, "0", { x: 4.15, y: y + 1.58, w: 0.4, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO, color: P.teal });
      h.arrow(s, h.MX + 2.63, y + 3.2, 4.57, y + 3.2, P.mute, 2.25); h.tx(s, "1", { x: 4.15, y: y + 2.83, w: 0.4, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO, color: P.teal });
      h.arrow(s, 5.73, y + 2.55, 6.97, y + 2.55, P.mute, 2.25); h.tx(s, "B", { x: 6.4, y: y + 2.18, w: 0.5, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO });
      h.arrow(s, 5.15, y + 4.3, 5.15, y + 3.63, P.red, 2.25); h.tx(s, "selection: 0 for add, 1 for addi", { x: 3.3, y: y + 4.32, w: 3.8, h: 0.3, fontSize: 13.5, bold: true, color: P.red, align: "center" });
      h.arrow(s, 8.93, y + 1.6, 9.7, y + 1.6, P.mute, 2.25); h.tx(s, "result", { x: 9.0, y: y + 1.2, w: 0.8, h: 0.3, fontSize: 13, italic: true, color: P.mute });
      h.rows(s, [
        "add t2, t0, t1 and addi t2, t0, 5 use the same adder",
        "A multiplexer in front of the ALU chooses the second operand: a register or the constant",
        "It is a multiplexer on words: thirty-two one-bit multiplexers sharing one selection line",
        "Reading a register is a multiplexer too: 32 words in, 5 selection bits (rs1), one word out",
      ], 9.9, h.TOP, h.W - h.MX - 9.9, h.BOT - h.TOP);
    }, "In the textbook datapath of Patterson and Hennessy the selection signal is called ALUSrc. A gate applied to every bit of a word with a common control is a word gate (porta di parola)."),

    H("Comparing and checking", "Equal or different? Arrived intact or altered?"),
    D("The comparator", async (s, h) => {
      h.rows(s, [
        "Two data A and B in input, one Boolean output EQ that is 1 when A = B",
        "Two bits are equal when their XNOR is 1",
        "Two words are equal when all their pairs of bits are equal: an AND of XNORs",
        ["In the processor: beq and bne", ["the two registers are compared bit by bit, and the branch is taken or not according to EQ"]],
      ], h.MX, h.TOP, 6.6, h.BOT - h.TOP - 0.7);
      h.tx(s, "EQ = (A0 xnor B0) . (A1 xnor B1) . ...", { x: h.MX, y: h.BOT - 0.6, w: 6.6, h: 0.5, fontSize: 16.5, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.card(s, 7.6, h.TOP, h.W - h.MX - 7.6, h.BOT - h.TOP);
      await h.svg(s, comparatorSvg(), 7.8, h.TOP + 0.3, h.W - h.MX - 8.0, h.BOT - h.TOP - 1.1);
      h.tx(s, "A comparator for words of two bits", { x: 7.8, y: h.BOT - 0.7, w: h.W - h.MX - 8.0, h: 0.5, fontSize: 13.5, italic: true, color: P.mute, align: "center", valign: "middle" });
    }, "Comparatore. Many datapaths reuse the ALU instead: subtract and test whether the result is zero. Ordering comparisons (blt, slt) need the subtraction and the sign rules of Lecture 05."),
    T("Parity", [
      "When data travel from a source to a destination, redundant codes allow errors to be checked",
      "The simplest check is a single parity bit: legal code words have, for example, an even number of bits at 1",
      ["A parity network computes the parity of the n bits at its input: a chain of XORs", ["p = x0 xor x1 xor ... xor x(n-1) is 1 when the number of 1s is odd"]],
      ["It is needed twice", ["to compute the bit to add to a non-redundant code", "to verify the overall parity of the redundant code on arrival"]],
    ], "Rete di parità. XOR is addition modulo 2, which is why a chain of XORs counts the 1s modulo 2.", { big: "xor", label: "the parity of a word is the XOR of all its bits" }),
    F("Transmission with a parity check", [
      "Source|the non-redundant code C",
      "CALC|a parity network computes the parity bit, which is appended to C",
      "Channel|the redundant code travels, and may be altered",
      "VER|a parity network verifies the parity and raises an error signal",
      "Destination|the code C', probably equal to C if no error was signalled",
    ], "A single parity bit detects any odd number of altered bits. It cannot say which bit is wrong, so it cannot correct, and it misses an even number of errors: stronger codes add more check bits.",
      "Schema di trasmissione con controllo di parità. 'Probably': two errors cancel out. Hamming codes, with several parity bits over overlapping groups, locate and correct a single error."),
    K("A parity network in seven instructions", `# a0 = one byte        result: a0 = 1 if the number of 1 bits is odd

    srli t0, a0, 4
    xor  a0, a0, t0      # fold eight bits onto four
    srli t0, a0, 2
    xor  a0, a0, t0      # fold four bits onto two
    srli t0, a0, 1
    xor  a0, a0, t0      # fold two bits onto one
    andi a0, a0, 1       # keep the parity bit`, [
      "Each xor combines the upper half of the bits with the lower half",
      "Three levels for eight bits: the software version of a tree of XOR gates",
      "The same value appended to the byte makes its total parity even",
    ], "Written for this lecture. Trace it with 0x53 = 0101 0011 (four 1s, result 0) and with 0x13 = 0001 0011 (three 1s, result 1). In hardware the three levels are a tree of seven XOR gates."),

    H("The arithmetic logic unit", "All the blocks of this lecture, working together."),
    D("The ALU is a set of machines and a multiplexer", (s, h) => {
      const y0 = h.TOP + 0.05, units = ["adder / subtractor", "AND, one gate per bit", "OR, one gate per bit", "XOR, one gate per bit", "shifter"], ux = 3.3, uw = 3.2, uh = 0.6, st = 0.76;
      h.line(s, 2.0, y0 + 0.1, 2.0, y0 + 4 * st + 0.2, P.teal, 3); h.line(s, 2.6, y0 + 0.1, 2.6, y0 + 4 * st + 0.4, P.amber, 3);
      h.tx(s, "A", { x: 1.2, y: y0, w: 0.7, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.teal, align: "right" }); h.tx(s, "B", { x: 2.7, y: y0 - 0.32, w: 0.4, h: 0.3, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      h.tx(s, "32 bits\neach", { x: h.MX, y: y0 + 0.5, w: 1.2, h: 0.6, fontSize: 12.5, italic: true, color: P.mute });
      units.forEach((u, i) => {
        const y = y0 + i * st;
        box7(s, h, u, ux, y, uw, uh, i === 0 ? P.violet : P.steel, 14.5);
        h.arrow(s, 2.0, y + 0.2, ux - 0.03, y + 0.2, P.teal, 1.75); h.arrow(s, 2.6, y + 0.42, ux - 0.03, y + 0.42, P.amber, 1.75);
        h.arrow(s, ux + uw + 0.03, y + uh / 2, 7.67, y + uh / 2, P.mute, 1.75);
      });
      box7(s, h, "MUX", 7.7, y0, 1.1, 4 * st + uh, P.teal, 17);
      h.arrow(s, 8.83, y0 + 2 * st + 0.3, 9.9, y0 + 2 * st + 0.3, P.ink, 2.5); h.tx(s, "result", { x: 8.85, y: y0 + 2 * st - 0.08, w: 1.0, h: 0.3, fontSize: 13, italic: true, color: P.mute, align: "center" });
      h.arrow(s, 8.25, y0 + 4 * st + uh + 0.62, 8.25, y0 + 4 * st + uh + 0.03, P.red, 2.25);
      h.tx(s, "operation, decoded from the instruction", { x: 6.2, y: y0 + 4 * st + uh + 0.64, w: 4.2, h: 0.3, fontSize: 13.5, bold: true, color: P.red, align: "center" });
      h.card(s, 10.2, h.TOP, h.W - h.MX - 10.2, 3.7, P.tealSoft);
      h.tx(s, "All the units compute at the same time, on the same two operands. The multiplexer lets one result through.\n\nA decoder on the instruction bits drives the selection.", { x: 10.3, y: h.TOP + 0.1, w: h.W - h.MX - 10.4, h: 3.5, fontSize: 14, valign: "middle" });
      h.tx(s, "No memory anywhere: the ALU is one large combinational machine. Its slowest path, the carry chain of the adder, limits the clock of the processor.", { x: h.MX, y: 6.3, w: h.CW, h: 0.45, fontSize: 14, valign: "middle" });
    }, "Unità aritmetico-logica. The adder is the ripple-carry adder of Lecture 09, with the complement-and-carry trick of Lecture 05 for subtraction. Comparisons (slt) reuse the subtractor."),
    G("RISC-V instructions and the ALU", ["Instruction", "funct3", "ALU operation", "Unit that produces the result"], [
      ["add, sub", "000", "sum or difference", "adder / subtractor (one more bit, in funct7, chooses)"],
      ["sll", "001", "shift left", "shifter"],
      ["slt, sltu", "010, 011", "set if less than", "subtractor, then the sign rules"],
      ["xor", "100", "bitwise XOR", "XOR gates"],
      ["srl, sra", "101", "shift right", "shifter (funct7 chooses logical or arithmetic)"],
      ["or", "110", "bitwise OR", "OR gates"],
      ["and", "111", "bitwise AND", "AND gates"],
    ], "funct3 is the 3-bit field of the instruction seen in Lecture 02 (bits 14 to 12). Three bits, eight code words: a compact code that a small decoder turns into the selection lines of the ALU multiplexer.", { widths: [2, 1.6, 3, 5.6], mono: [0, 1], caption: "funct3 is a 3-bit code inside the instruction: the ALU multiplexer is driven by decoding it." }),

    Q("How many bits does a fixed-length binary code need for the 26 letters of the alphabet?", ["4", "5", "6", "26"], 1, "ceil(log2 26) = 5, since 2^4 = 16 < 26 <= 32 = 2^5. Six words remain unassigned: the code is incomplete."),
    Q("A decoder has 3 input lines and no enable. How many outputs does it have, and how many are 1 at any time?", ["3 outputs, one at 1", "6 outputs, two at 1", "8 outputs, one at 1", "8 outputs, three at 1"], 2, "2^3 = 8 outputs, and exactly one is asserted: the decoded (one-hot) representation of the input word."),
    Q("A multiplexer with 8 data inputs needs how many selection lines?", ["2", "3", "4", "8"], 1, "n selection lines choose among 2^n inputs: 3 lines for 8 inputs."),
    Q("A word with one even-parity bit is received with two bits altered. The parity check:", ["detects the error and corrects it", "detects the error but cannot correct it", "does not detect the error", "signals an error only if both bits were 1"], 2, "Two alterations leave the parity unchanged. A single parity bit detects only an odd number of errors."),
    X("Exercises: paper first, then PRG32", [
      "Synthesise segment g of the seven-segment transcoder with a Karnaugh map, using the don't-cares",
      "Build a 3-to-8 decoder from two 2-to-4 decoders with enable and one inverter",
      "Implement F = sum of m(1, 2, 4, 7) with one multiplexer of 8 inputs. Which function is it?",
      "Write a comparator in assembly: a0 = 1 if a0 and a1 are equal, using xor and sltiu only",
      "Draw a seven-segment digit on PRG32: a table of ten bytes, one per digit, and seven rectangles lit by testing its bits",
    ], "On PRG32: a large digit that counts from 0 to 9, one step per second, drawn from seven rectangles.",
      "Exercise 3: put 0, 1, 1, 0, 1, 0, 0, 1 on the data inputs: it is the three-input XOR, the sum bit of the full adder. Exercise 4: xor a0, a0, a1 then sltiu a0, a0, 1 (the pseudo-instruction seqz). Exercise 5 is a software transcoder followed by seven bit tests: the table is the truth table of this lecture, one row per byte."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["combinational network", "rete combinatoria", "decoder / encoder", "decodificatore / codificatore"],
      ["propagation delay", "ritardo di propagazione", "transcoder", "transcodificatore"],
      ["cardinality", "cardinalità", "multiplexer / demultiplexer", "multiplexer / demultiplexer"],
      ["code word", "parola codice", "enable", "abilitazione"],
      ["fixed / variable length", "lunghezza fissa / variabile", "comparator", "comparatore"],
      ["redundant code", "codice ridondante", "parity bit", "bit di parità"],
    ], null, { widths: [3, 3.2, 3.2, 3.4] }),
    T("Conclusions and reading", [
      "A code writes each element of a set as a string of symbols over an alphabet: its code word",
      "Fixed-length codes need ceil(log2 N) bits; redundant codes spend more to detect errors",
      "Encoding, decoding and transcoding are done by combinational machines",
      "Multiplexers select a source, demultiplexers a destination; comparators and parity networks check",
      "A RISC-V processor uses all of them: decoders on the instruction fields, multiplexers on the operands, and an ALU that is itself built from these blocks",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, appendix A and section 4.1", "Bucci: Architettura dei calcolatori elettronici, chapters on combinational networks", "Stallings: Computer Organization and Architecture, chapter on digital logic"]],
    ], "Next: Verm1, part 2: steering and food. Then sequential machines: what is missing here is memory."),
  ],
});
