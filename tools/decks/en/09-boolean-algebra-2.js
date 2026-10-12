// Lecture 09 - Elements of Boolean algebra, part 2: functions, canonical forms, minimisation, adders.
// Source: 06-Architettura_dei_Calcolatori-Algebra_di_Boole.pptx (translated, figures redrawn, 4-variable map, don't-cares and RISC-V added).
const G6 = require("../../lib/gates");

function halfAdderSvg() {
  const x = G6.pins("xor", 200, 30), a = G6.pins("and", 200, 120);
  return G6.doc(340, 190,
    G6.wire([[40, 41], x.a]) + G6.wire([[40, 63], x.b]) +
    G6.wire([[130, 41], [130, 131], a.a], true) + G6.wire([[95, 63], [95, 153], a.b], true) +
    G6.wire([x.out, [300, 52]]) + G6.wire([a.out, [300, 142]]) +
    G6.gate("xor", 200, 30) + G6.gate("and", 200, 120) +
    G6.text(14, 46, "A", { size: 18 }) + G6.text(14, 68, "B", { size: 18 }) + G6.text(306, 58, "S", { size: 18 }) + G6.text(306, 148, "C", { size: 18 }));
}

function fullAdderSvg() {
  const x1 = G6.pins("xor", 150, 20), x2 = G6.pins("xor", 330, 31), a1 = G6.pins("and", 330, 130), a2 = G6.pins("and", 330, 220), o = G6.pins("or", 470, 175);
  return G6.doc(640, 290,
    G6.wire([[40, 31], x1.a]) + G6.wire([[40, 53], x1.b]) +
    G6.wire([[75, 31], [75, 231], a2.a], true) + G6.wire([[105, 53], [105, 253], a2.b], true) +
    G6.wire([x1.out, x2.a]) + G6.wire([[265, 42], [265, 141], a1.a], true) +
    G6.wire([[40, 100], [300, 100], [300, 64], x2.b]) + G6.wire([[300, 100], [300, 163], a1.b], true) +
    G6.wire([a1.out, [430, 152], [430, 186], o.a]) + G6.wire([a2.out, [430, 242], [430, 208], o.b]) +
    G6.wire([x2.out, [590, 53]]) + G6.wire([o.out, [590, 197]]) +
    G6.gate("xor", 150, 20) + G6.gate("xor", 330, 31) + G6.gate("and", 330, 130) + G6.gate("and", 330, 220) + G6.gate("or", 470, 175) +
    G6.text(14, 36, "A", { size: 18 }) + G6.text(14, 58, "B", { size: 18 }) + G6.text(4, 105, "Cin", { size: 17 }) +
    G6.text(596, 59, "S", { size: 18 }) + G6.text(592, 203, "Cout", { size: 17 }) +
    G6.text(222, 34, "A xor B", { size: 12, bold: false, fill: "#5B6B78" }));
}

Deck({
  n: "09", file: "09-Computer_Architecture-Boolean_Algebra_2",
  title: "Elements of Boolean Algebra", short: "Boolean algebra (2)",
  sub: "Part 2: Boolean functions, canonical forms, minimisation and the adder",
  quote: ["Oh dear! Oh dear! I shall be too late!", "Lewis Carroll, Alice's Adventures in Wonderland, 1865"],
  cover: "game_tetris.png",
  notes: "Spiral: the lecture opens with two instructions that add two bits, shows that they are a half adder, then develops the method (truth table, canonical form, minimisation) that produces such circuits, and closes on the 32-bit adder behind the add instruction.",
  slides: [
    O("What you will be able to do by the end", [
      "Define literal, clause, factor, minterm and maxterm",
      "Say how many Boolean functions of n variables exist, and name those of two variables",
      "Write a function in canonical sum-of-products and product-of-sums form from its truth table",
      "Minimise a function of up to four variables with a Karnaugh map",
      "Derive the half adder and the full adder, and explain how thirty-two of them execute add",
    ]),

    H("Warm-up on the machine", "Adding two bits with the instructions you already know."),
    K("One-bit addition without add", `# a0 and a1 hold one bit each: 0 or 1
# goal: compute a0 + a1, which needs two bits (0, 1 or 2)

    xor  t0, a0, a1      # low bit of the sum:  1 when the bits differ
    and  t1, a0, a1      # high bit, the carry: 1 when both are 1

#   a0 a1 | t1 t0
#    0  0 |  0  0        0 + 0 = 0
#    0  1 |  0  1        0 + 1 = 1
#    1  0 |  0  1        1 + 0 = 1
#    1  1 |  1  0        1 + 1 = 2  (binary 10)`, [
      "Two logic instructions add two bits: no arithmetic involved",
      "The comment is a truth table with two outputs",
      "This pair of gates is called a half adder",
      "How do you find the gates when the table is given? That is today's method",
    ], "Run it in PRG32-QT with the four input pairs. Lecture 05 said that an adder is all a processor needs for arithmetic; this is its first bit."),

    H("Boolean functions", "From expressions to tables and back."),
    T("Boolean expressions: the vocabulary", [
      ["Literal: a Boolean variable, or its complement, as it appears in an expression", ["a, b', x"]],
      ["Clause, or product term: the logical product of two or more literals", ["a . b' . x"]],
      ["Factor, or sum term: the logical sum of two or more literals", ["(a + x'), (b + c)"]],
      "Clauses and factors with more than one literal are functions of level 1: one layer of gates",
    ], "Letterale; clausola o termine elementare; fattore elementare. Each occurrence of a variable counts as a literal: the number of literals measures the cost of an expression."),
    T("How many functions of n variables?", [
      "A Boolean function maps every combination of n binary inputs to one binary output",
      "There are 2^n input combinations, and each can be mapped to 0 or to 1",
      ["So the distinct functions of n variables are 2^(2^n): a finite number", ["1 variable: 4 functions; 2 variables: 16; 3 variables: 256; 4 variables: 65,536"]],
      "Boolean functions are isomorphic to digital circuits: every circuit can be written as an expression, and every expression can be built as a circuit",
    ], "f: B^n -> B with B = {0, 1}. For n = 5 there are already more than four billion functions: 2^32.", { big: "2^(2^n)", label: "the number of distinct Boolean functions of n variables" }),
    D("The sixteen functions of two variables", (s, h) => {
      const names = ["constant 0", "AND: x . y", "x . y'", "x (identity)", "x' . y", "y (identity)", "XOR", "OR: x + y", "NOR", "XNOR (equivalence)", "NOT y", "x + y'", "NOT x", "x' + y", "NAND", "constant 1"];
      const hot = { 1: P.tealSoft, 6: P.tealSoft, 7: P.tealSoft, 8: P.amberSoft, 14: P.amberSoft, 9: P.tealSoft };
      const row = (k) => [`f${k}`, ...k.toString(2).padStart(4, "0").split(""), names[k]];
      const w = [0.75, 0.5, 0.5, 0.5, 0.5, 3.1], tw = 5.85, head = ["f", "00", "01", "10", "11", "name"];
      const hiOf = (base) => { const o = {}; for (let i = 0; i < 8; i++) if (hot[base + i]) o[i] = hot[base + i]; return o; };
      h.table(s, h.MX, h.TOP + 0.35, w, head, Array.from({ length: 8 }, (_, i) => row(i)), { fs: 15, mono: [0, 1, 2, 3, 4], align: "center", rowH: 0.42, hi: hiOf(0), bold0: false });
      h.table(s, h.W - h.MX - tw, h.TOP + 0.35, w, head, Array.from({ length: 8 }, (_, i) => row(i + 8)), { fs: 15, mono: [0, 1, 2, 3, 4], align: "center", rowH: 0.42, hi: hiOf(8), bold0: false });
      h.tx(s, "Columns 00, 01, 10, 11 give the output for each pair of inputs x y", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.35, fontSize: 14, italic: true, color: P.mute });
      h.tx(s, "The index of each function is its output column read as a binary number. Highlighted: the gates of Lecture 08. With one variable the four functions are: constant 0, x, NOT x, constant 1.", { x: h.MX, y: 5.95, w: h.CW, h: 0.8, fontSize: 15.5, valign: "middle" });
    }, "f0 and f15: constants. f3, f5: identity (buffer). f12, f10: NOT. f1 AND, f7 OR, f6 XOR, f9 equivalence, f14 NAND, f8 NOR. f13 is the implication x -> y, f11 is y -> x; f2 and f4 are the inhibitions."),
    T("Functionally complete sets", [
      "Any Boolean function can be realised using only AND, OR and NOT",
      ["Example: x XOR y = (x' AND y) OR (x AND y')"],
      "The set {AND, OR, NOT} is called functionally complete",
      "By De Morgan, AND can be built from OR and NOT, and OR from AND and NOT: {AND, NOT} and {OR, NOT} are complete too",
      "NAND alone is complete, and so is NOR alone: they are the universal gates",
    ].map((x) => (Array.isArray(x) ? x[0] : x)), "NOT x = x NAND x; x AND y = (x NAND y) NAND (x NAND y); x OR y = (x NAND x) NAND (y NAND y). Real chips are largely built from NAND and NOR because they need the fewest transistors.", { big: "NAND", label: "a single type of gate is enough to build any digital circuit, a whole processor included" }),
    D("Truth tables", (s, h) => {
      h.rows(s, [
        "A Boolean function can be defined by a table: its truth table",
        "The table gives the value of the dependent variable for every possible combination of the independent variables",
        "A function of n variables is defined on 2^n points, so its truth table has 2^n rows",
        "The rows are listed in counting order: 000, 001, 010, ...",
        "We will follow this function F through the whole lecture",
      ], h.MX, h.TOP, 7.3, h.BOT - h.TOP);
      const F = [0, 0, 0, 1, 1, 1, 1, 1];
      h.table(s, 8.9, h.TOP, [0.85, 0.85, 0.85, 1.05], ["A", "B", "C", "F"], F.map((f, i) => [...i.toString(2).padStart(3, "0").split(""), String(f)]),
        { fs: 17, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.5, hi: Object.fromEntries(F.map((f, i) => [i, f ? P.tealSoft : null]).filter(([, v]) => v)) });
    }, "F is 1 on rows 3, 4, 5, 6, 7. It is the example of the source deck, kept through canonical forms, algebraic minimisation and the Karnaugh map."),
    D("The half adder", async (s, h) => {
      h.rows(s, ["Adds two bits A and B and produces a sum bit S and a carry C",
        "In binary 1 + 1 gives sum 0 and carry 1",
        "From the table: S is 1 when the inputs differ, C is 1 when both are 1"], h.MX, h.TOP, 6.0, 2.3);
      h.tx(s, "S = A xor B        C = A . B", { x: h.MX, y: 4.05, w: 6.0, h: 0.5, fontSize: 21, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.table(s, h.MX + 0.9, 4.75, [0.9, 0.9, 1.1, 1.1], ["A", "B", "S", "C"], [["0", "0", "0", "0"], ["0", "1", "1", "0"], ["1", "0", "1", "0"], ["1", "1", "0", "1"]], { fs: 16, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.4 });
      h.card(s, 7.1, h.TOP, h.W - h.MX - 7.1, h.BOT - h.TOP);
      await h.svg(s, halfAdderSvg(), 7.3, h.TOP + 0.2, h.W - h.MX - 7.5, h.BOT - h.TOP - 0.4);
    }, "The circuit is exactly the two instructions of the warm-up. 'Half' because it has no carry input: it can only add the least significant bits."),
    D("The full adder", async (s, h) => {
      const F = [[0, 0, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 0, 1, 0], [0, 1, 1, 0, 1], [1, 0, 0, 1, 0], [1, 0, 1, 0, 1], [1, 1, 0, 0, 1], [1, 1, 1, 1, 1]];
      h.table(s, h.MX, h.TOP, [0.7, 0.7, 0.8, 0.8, 0.95], ["A", "B", "Cin", "S", "Cout"], F.map((r) => r.map(String)), { fs: 15, mono: [0, 1, 2, 3, 4], align: "center", bold0: false, rowH: 0.41 });
      h.tx(s, "S = A xor B xor Cin", { x: h.MX, y: 5.45, w: 4.4, h: 0.4, fontSize: 17, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "Cout = A . B + Cin . (A xor B)", { x: h.MX, y: 5.9, w: 4.6, h: 0.4, fontSize: 17, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "Adds two bits and a carry in; produces a sum bit and a carry out.", { x: h.MX, y: 6.35, w: 4.6, h: 0.4, fontSize: 13.5, italic: true, color: P.mute });
      h.card(s, 5.4, h.TOP, h.W - h.MX - 5.4, h.BOT - h.TOP);
      await h.svg(s, fullAdderSvg(), 5.55, h.TOP + 0.15, h.W - h.MX - 5.7, h.BOT - h.TOP - 0.3);
    }, "Two half adders and an OR. S is 1 when an odd number of inputs is 1; Cout is 1 when at least two inputs are 1. Wires that cross without a dot are not connected."),

    H("Canonical forms", "A systematic way from the table to an expression."),
    V("Elementary forms: functions of level 2",
      ["Type P: sum of products (SOP)", ["A logical sum of clauses", "y = a b' + a' d + b d' x", "y = a + b c' + a' c x", "Built as a layer of AND gates feeding one OR gate"]],
      ["Type S: product of sums (POS)", ["A logical product of factors", "y = (a + b') (a' + d) (b + d' + x)", "y = a (b + c') (a' + c + x)", "Built as a layer of OR gates feeding one AND gate"]],
      "Correction to the source slide, where the examples of the two types were swapped: type P (first type) is the sum of products, type S (second type) the product of sums."),
    T("Minterms and maxterms", [
      ["Minterm: a clause of order n, that is, a product containing a literal of every variable", ["n = 2: a b;  n = 3: a' b' c;  n = 6: a b c' d e' f"]],
      "A minterm is 1 for exactly one row of the truth table",
      ["Maxterm: a sum of n literals, one for every variable", ["n = 2: (a' + b');  n = 3: (a + b + c');  n = 6: (a' + b' + c + d' + e' + f')"]],
      "A maxterm is 0 for exactly one row of the truth table",
    ], "Mintermine (termine prodotto P); maxtermine (fattore somma S). Minterm i corresponds to row i: a variable appears complemented where the row has a 0."),
    D("From the truth table to the canonical forms", (s, h) => {
      const F = [0, 0, 0, 1, 1, 1, 1, 1], lit = (i, max) => ["A", "B", "C"].map((v, k) => { const bit = (i >> (2 - k)) & 1; return max ? v + (bit ? "'" : "") : v + (bit ? "" : "'"); });
      const body = F.map((f, i) => [...i.toString(2).padStart(3, "0").split(""), String(f), f ? `m${i} = ${lit(i).join(" ")}` : "", f ? "" : `M${i} = ${lit(i, true).join(" + ")}`]);
      h.table(s, h.MX, h.TOP, [0.6, 0.6, 0.6, 0.7, 2.6, 2.9], ["A", "B", "C", "F", "minterm (F = 1)", "maxterm (F = 0)"], body,
        { fs: 15, mono: [0, 1, 2, 3, 4, 5], align: "center", bold0: false, rowH: 0.42, hi: Object.fromEntries(F.map((f, i) => [i, f ? P.tealSoft : P.amberSoft])) });
      const x = 9.0, w = h.W - h.MX - x;
      h.card(s, x, h.TOP, w, 2.45, P.tealSoft);
      h.tx(s, "Canonical form P: sum of the minterms of the rows where F = 1", { x: x + 0.2, y: h.TOP + 0.1, w: w - 0.4, h: 0.75, fontSize: 14.5, bold: true, color: P.teal });
      h.tx(s, "F = A'BC + AB'C' + AB'C + ABC' + ABC", { x: x + 0.2, y: h.TOP + 0.9, w: w - 0.4, h: 0.9, fontSize: 15, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "F = sum of m(3, 4, 5, 6, 7)", { x: x + 0.2, y: h.TOP + 1.85, w: w - 0.4, h: 0.45, fontSize: 14, fontFace: h.MONO, color: P.mute });
      h.card(s, x, h.TOP + 2.65, w, 2.55, P.amberSoft);
      h.tx(s, "Canonical form S: product of the maxterms of the rows where F = 0", { x: x + 0.2, y: h.TOP + 2.75, w: w - 0.4, h: 0.75, fontSize: 14.5, bold: true, color: P.amber });
      h.tx(s, "F = (A+B+C) (A+B+C') (A+B'+C)", { x: x + 0.2, y: h.TOP + 3.55, w: w - 0.4, h: 0.9, fontSize: 15, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "F = product of M(0, 1, 2)", { x: x + 0.2, y: h.TOP + 4.55, w: w - 0.4, h: 0.45, fontSize: 14, fontFace: h.MONO, color: P.mute });
    }, "Every function has exactly one canonical form of each type (up to the order of the terms). This is synthesis by recipe: always possible, rarely economical."),
    G("Algebraic minimisation of F", ["Expression", "Law applied"], [
      ["A'BC + AB'C' + AB'C + ABC' + ABC", "canonical form P: 5 clauses, 15 literals"],
      ["= A'BC + A (B'C' + B'C + BC' + BC)", "distributive: collect A"],
      ["= A'BC + A (B' (C' + C) + B (C' + C))", "distributive, twice"],
      ["= A'BC + A (B' + B)", "complement: C' + C = 1"],
      ["= A'BC + A", "complement: B' + B = 1"],
      ["= A + BC", "simplification: x + x' y = x + y"],
    ], "From five AND gates with three inputs and a five-input OR, to one AND and one OR. The source deck called this an 'empirical' minimisation: it works, but which law to apply next is left to intuition. Karnaugh maps make it mechanical.", { widths: [6.6, 5.6], mono: [0], fs: 19, caption: "Fifteen literals become three. It works, but each step needs an idea: we want a method." }),
    T("The goal of minimisation", [
      "Find, among all the possible two-level forms of type P, a minimal elementary form",
      "Fewer and smaller gates mean lower cost, less power and a faster circuit",
      ["Karnaugh maps: graphical, by sub-cubes of maximum area", ["practical up to four or five variables"]],
      ["Quine's method: algebraic", ["systematic comparison of the terms"]],
      ["McCluskey's method: tabular", ["suited to a program; the basis of today's logic-synthesis tools"]],
    ], "Quine-McCluskey is exact but exponential; industrial tools use heuristics (Espresso and its descendants). The laboratory part of the course practises Karnaugh maps.", { big: "A + BC", label: "the minimal form of our F: two gates instead of six" }),

    H("Karnaugh maps", "Minimisation you can see."),
    D("Karnaugh maps: the idea", (s, h) => {
      h.rows(s, [
        "A graphical tool for simplifying Boolean functions",
        "A function of n variables is drawn on a grid of 2^n cells: one cell per row of the truth table",
        ["Cells are ordered so that neighbours differ in one variable only", ["hence the column order 00, 01, 11, 10"]],
        "Graphical adjacency is logical adjacency: two adjacent 1s merge into a clause with one literal less",
        "Group the 1s in rectangles of 1, 2, 4 or 8 cells, as large as possible, until every 1 is covered",
      ], h.MX, h.TOP, 6.9, h.BOT - h.TOP);
      h.card(s, 7.9, h.TOP, h.W - h.MX - 7.9, h.BOT - h.TOP);
      h.kmap(s, 8.35, h.TOP + 0.9, 0.9, { rowVar: "A", colVar: "B C", rowLabels: ["0", "1"], colLabels: ["00", "01", "11", "10"], vals: [["m0", "m1", "m3", "m2"], ["m4", "m5", "m7", "m6"]] });
      h.tx(s, "The cell of each minterm for three variables. Note that m3 comes before m2. The left and right edges are adjacent too: the map wraps around.", { x: 8.2, y: h.TOP + 3.7, w: h.W - h.MX - 8.5, h: 1.3, fontSize: 14, italic: true, color: P.mute });
    }, "The order 00, 01, 11, 10 is a Gray code. Maurice Karnaugh, 1953. An online tool was suggested in the source deck (edutecnica.it/apps/k/k.htm)."),
    D("A map of two variables", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.2, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.9, h.TOP + 0.7, 1.3, { rowVar: "A", colVar: "B", rowLabels: ["0", "1"], colLabels: ["0", "1"], vals: [[0, 1], [1, 1]], loops: [{ r: 1, c: 0, rs: 1, cs: 2, color: P.red }, { r: 0, c: 1, rs: 2, cs: 1, color: P.violet, inset: 0.05 }] });
      h.tx(s, "F = A + B", { x: h.MX, y: h.TOP + 4.25, w: 5.2, h: 0.6, fontSize: 26, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "Truth table: F = 1 for AB = 01, 10 and 11",
        "Canonical form: F = A'B + AB' + AB, six literals",
        ["Red group: the row A = 1", ["B changes inside the group, so B disappears: the clause is A"]],
        ["Violet group: the column B = 1", ["A changes inside the group, so A disappears: the clause is B"]],
        "A cell may belong to more than one group: here AB is used twice",
      ], 6.3, h.TOP, h.W - h.MX - 6.3, h.BOT - h.TOP);
    }, "Using a 1 twice is the idempotence law: x + x = x. The function is simply OR."),
    D("A map of three variables: our F", (s, h) => {
      h.card(s, h.MX, h.TOP, 6.0, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.55, h.TOP + 0.7, 1.1, { rowVar: "A", colVar: "B C", rowLabels: ["0", "1"], colLabels: ["00", "01", "11", "10"], vals: [[0, 0, 1, 0], [1, 1, 1, 1]], loops: [{ r: 1, c: 0, rs: 1, cs: 4, color: P.red }, { r: 0, c: 2, rs: 2, cs: 1, color: P.violet, inset: 0.05 }] });
      h.tx(s, "F = A + BC", { x: h.MX, y: h.TOP + 4.25, w: 6.0, h: 0.6, fontSize: 26, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "Write a 1 in the cells of minterms 3, 4, 5, 6 and 7",
        ["Red group of four: the whole row A = 1", ["B and C both change: the clause is A"]],
        ["Violet group of two: the column BC = 11", ["A changes: the clause is BC"]],
        "Every 1 is covered and no group can be made larger",
        "The same result as the algebra, found by eye in seconds",
      ], 7.0, h.TOP, h.W - h.MX - 7.0, h.BOT - h.TOP);
    }, "A group of 2^k cells eliminates k variables. Always take the largest groups first, then cover what is left."),
    D("A map of four variables", (s, h) => {
      const vals = [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];
      const cn = [{ r: 0, c: 0 }, { r: 0, c: 3 }, { r: 3, c: 0 }, { r: 3, c: 3 }].map((p) => ({ ...p, rs: 1, cs: 1, color: P.violet }));
      h.card(s, h.MX, h.TOP, 5.6, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.55, h.TOP + 0.15, 0.92, { rowVar: "A B", colVar: "C D", rowLabels: ["00", "01", "11", "10"], colLabels: ["00", "01", "11", "10"], vals, loops: [{ r: 1, c: 1, rs: 2, cs: 2, color: P.red }, ...cn] });
      h.tx(s, "F = BD + B'D'", { x: h.MX, y: h.TOP + 4.63, w: 5.6, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "F = sum of m(0, 2, 5, 7, 8, 10, 13, 15): eight minterms, thirty-two literals",
        ["Red group of four in the centre", ["B = 1 and D = 1 throughout: the clause is BD"]],
        ["Violet: the four corners are one group", ["the map wraps around horizontally and vertically: B = 0 and D = 0, the clause is B'D'"]],
        "Result: four literals, and you may recognise it: F is the XNOR of B and D",
      ], 6.6, h.TOP, h.W - h.MX - 6.6, h.BOT - h.TOP);
    }, "New slide. Think of the map as drawn on a torus: the top edge touches the bottom edge and the left edge touches the right edge."),
    T("Don't-care conditions", [
      "Sometimes an input combination can never occur, or the output does not matter when it does",
      ["Example: a digit in binary-coded decimal uses the patterns 0000 to 1001", ["the six patterns 1010 to 1111 never appear"]],
      "Those cells are marked with an x in the map: don't care",
      "An x may be treated as a 1 when it makes a group larger, and as a 0 otherwise",
      "More freedom means larger groups and a cheaper circuit",
    ], "New slide. Typical exam exercise: the seven-segment display decoder, where each segment is a function of four variables with six don't-cares.", { big: "x", label: "a cell whose value we are free to choose, 0 or 1, whichever simplifies the circuit" }),

    H("Back to the machine", "From one full adder to the add instruction."),
    D("Thirty-two full adders make an add", (s, h) => {
      const bw = 1.45, bh = 1.25, y = h.TOP + 1.0, xs = [10.6, 8.6, 6.6, 2.6], labs = ["0", "1", "2", "31"];
      xs.forEach((x, i) => {
        s.addText([{ text: "full adder", options: { fontSize: 14, bold: true, breakLine: true } }, { text: "bit " + labs[i], options: { fontSize: 13 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.08, x, y, w: bw, h: bh, fill: { color: i === 3 ? P.steel : P.teal }, line: { color: P.white, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 2 });
        h.arrow(s, x + 0.45, y - 0.65, x + 0.45, y - 0.03, P.mute, 1.75); h.arrow(s, x + 1.0, y - 0.65, x + 1.0, y - 0.03, P.mute, 1.75);
        h.tx(s, `A${labs[i]}`, { x: x + 0.1, y: y - 0.98, w: 0.7, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, align: "center" });
        h.tx(s, `B${labs[i]}`, { x: x + 0.65, y: y - 0.98, w: 0.7, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, align: "center" });
        h.arrow(s, x + bw / 2, y + bh + 0.03, x + bw / 2, y + bh + 0.6, P.mute, 1.75);
        h.tx(s, `S${labs[i]}`, { x: x + bw / 2 - 0.4, y: y + bh + 0.62, w: 0.8, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, align: "center" });
      });
      const cy = y + bh / 2;
      h.arrow(s, 12.65, cy, 12.08, cy, P.amber, 2.25); h.tx(s, "0", { x: 12.5, y: cy - 0.45, w: 0.35, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, color: P.amber });
      h.arrow(s, 10.57, cy, 10.08, cy, P.amber, 2.25); h.arrow(s, 8.57, cy, 8.08, cy, P.amber, 2.25);
      h.arrow(s, 6.57, cy, 5.75, cy, P.amber, 2.25); h.tx(s, ". . .", { x: 4.75, y: cy - 0.25, w: 0.95, h: 0.5, fontSize: 22, bold: true, color: P.amber, align: "center", valign: "middle" });
      h.arrow(s, 4.7, cy, 4.08, cy, P.amber, 2.25); h.arrow(s, 2.57, cy, 1.75, cy, P.amber, 2.25);
      h.tx(s, "carry\nout", { x: 0.75, y: cy - 0.35, w: 0.95, h: 0.7, fontSize: 13, bold: true, color: P.amber, align: "center", valign: "middle" });
      h.tx(s, "the carry ripples leftwards", { x: 4.15, y: cy + 0.3, w: 2.3, h: 0.3, fontSize: 12.5, italic: true, color: P.amber, align: "center" });
      h.rows(s, ["add t2, t0, t1 feeds the two registers into thirty-two full adders, one per bit position",
        "The carry out of each position is the carry in of the next: a ripple-carry adder",
        "sub uses the same adder: the second operand is complemented and the first carry in is 1 (Lecture 05)"], h.MX, 5.0, h.CW, 1.75);
    }, "The carry out of bit 31 is the unsigned overflow of Lecture 05, which RISC-V simply drops. Real processors use faster carry schemes (carry look-ahead), but the function computed is the same."),
    K("A full adder, one gate per instruction", `# a0 = A, a1 = B, a2 = Cin   (each 0 or 1)
# result: a3 = S, a4 = Cout

    xor  t0, a0, a1      # t0   = A xor B
    xor  a3, t0, a2      # S    = A xor B xor Cin
    and  t1, a0, a1      # t1   = A . B
    and  t2, t0, a2      # t2   = (A xor B) . Cin
    or   a4, t1, t2      # Cout = A . B + (A xor B) . Cin`, [
      "Five instructions, five gates: the program is the schematic, read from left to right",
      "Analysis: single-step it in PRG32-QT and fill in the truth table",
      "Synthesis: you derived these gates from the table with the method of this lecture",
      "With whole registers as inputs, the same lines work on all thirty-two bit positions at once",
    ], "Suggested laboratory activity: loop over the eight input combinations and draw the two output bits as lamps, as in lab 06."),

    Q("How many distinct Boolean functions of three variables are there?", ["8", "9", "64", "256"], 3, "2^(2^3) = 2^8 = 256."),
    Q("Which minterm of three variables A, B, C corresponds to row 5 of the truth table?", ["A'BC'", "AB'C", "A + B' + C", "ABC'"], 1, "Row 5 is 101: A = 1, B = 0, C = 1, so the minterm is A B' C."),
    Q("In a Karnaugh map, a rectangular group of four adjacent 1s eliminates:", ["one variable", "two variables", "three variables", "four variables"], 1, "A group of 2^k cells eliminates k variables: four cells, two variables."),
    Q("In a full adder, the carry out is 1 when:", ["exactly one input is 1", "an odd number of inputs is 1", "at least two inputs are 1", "all three inputs are 1 only"], 2, "Cout is the majority function: AB + Cin(A xor B) = AB + ACin + BCin. An odd number of 1s describes the sum bit S instead."),
    X("Exercises: paper first, then PRG32", [
      "Write the canonical forms P and S of the full adder outputs S and Cout",
      "Minimise Cout with a Karnaugh map of three variables. How many gates do you save?",
      "Minimise F = sum of m(0, 1, 2, 5, 8, 9, 10) with a map of four variables",
      "Build NOT, AND and OR using NAND only, and check each with a truth table",
      "Program the full adder on PRG32 and display S and Cout as lamps for the eight input combinations",
    ], "On paper: Cout = AB + ACin + BCin. On PRG32: eight pairs of lamps that reproduce the truth table of the full adder.",
      "Exercise 3: F = B'D' + B'C' + A'C'D (corners; top-left and bottom-left pairs with their neighbours; m1 with m5). Exercise 2: the canonical form of Cout has four minterms (3, 5, 6, 7); the map gives three clauses of two literals."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["literal", "letterale", "canonical form", "forma canonica"],
      ["clause, product term", "clausola, termine prodotto", "sum of products (SOP)", "somma di prodotti (tipo P)"],
      ["factor, sum term", "fattore, termine somma", "product of sums (POS)", "prodotto di somme (tipo S)"],
      ["minterm / maxterm", "mintermine / maxtermine", "Karnaugh map", "mappa di Karnaugh"],
      ["half adder / full adder", "semisommatore / sommatore completo", "don't care", "condizione di indifferenza"],
      ["carry in / carry out", "riporto entrante / uscente", "ripple-carry adder", "sommatore a propagazione del riporto"],
    ], null, { widths: [3, 3.4, 2.9, 3.6] }),
    T("Conclusions and reading", [
      "A Boolean function is a truth table; a truth table always gives a canonical expression",
      "Minimisation is the process that optimises a logic network to simplify its implementation",
      "Karnaugh maps turn the algebra into a picture: group the 1s, read the clauses",
      "The half adder and the full adder are the first real circuits of the course",
      "Thirty-two full adders in a row are what executes the add you typed in the first lecture",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, appendix A", "Bucci: Architettura dei calcolatori elettronici, chapters on combinational networks", "Charles Petzold: Code, chapters on logic gates and binary adding machines"]],
    ], "Next lecture: electronics, to see what these gates are made of; then combinational and sequential machines."),
  ],
});
