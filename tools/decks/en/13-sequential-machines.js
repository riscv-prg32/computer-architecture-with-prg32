// Lecture 13 - Sequential machines: time, state, finite-state machines, latches, flip-flops, registers.
// Sources: 08 - Macchine sequenziali, 11 - Latch & flip-flop SR, 12 - Flip-flop JK & D, and the registers of
// 13 - Macchine elementari.  Figures redrawn; RISC-V is the reference processor.
const G8 = require("../../lib/gates");
const D8 = require("../../lib/draw");

function clockSvg() {
  const x0 = 60, y1 = 60, y0 = 150, hi = 110, lo = 90, per = hi + lo;
  let d = `M${x0 - 30},${y0}`;
  for (let k = 0; k < 3; k++) { const x = x0 + k * per; d += ` L${x},${y0} L${x},${y1} L${x + hi},${y1} L${x + hi},${y0}`; }
  d += ` L${x0 + 3 * per + 20},${y0}`;
  const dim = (xa, xb, y, label) => `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="#1B2530" stroke-width="1.5" marker-start="url(#a)" marker-end="url(#a)"/>` + G8.text((xa + xb) / 2, y - 7, label, { anchor: "middle", size: 15 });
  return G8.doc(700, 235, `<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1B2530"/></marker></defs>` +
    `<path d="${d}" fill="none" stroke="#0E7C86" stroke-width="3.5" stroke-linejoin="round"/>` +
    G8.text(22, y1 + 6, "1", { size: 16, fill: "#5B6B78" }) + G8.text(22, y0 + 6, "0", { size: 16, fill: "#5B6B78" }) +
    dim(x0, x0 + per, 30, "period T") + dim(x0 + per, x0 + per + hi, 30, "high time") + dim(x0 + per + hi, x0 + 2 * per, 30, "low time") +
    `<line x1="${x0 + 2 * per}" y1="${y0 + 8}" x2="${x0 + 2 * per}" y2="${y0 + 42}" stroke="#B23A48" stroke-width="2"/>` + G8.text(x0 + 2 * per, y0 + 62, "rising edge", { anchor: "middle", size: 15, fill: "#B23A48" }) +
    `<line x1="${x0 + 2 * per + hi}" y1="${y0 + 8}" x2="${x0 + 2 * per + hi}" y2="${y0 + 42}" stroke="#6B4FA0" stroke-width="2"/>` + G8.text(x0 + 2 * per + hi + 6, y0 + 62, "falling edge", { anchor: "middle", size: 15, fill: "#6B4FA0" }));
}

function latchSvg(gated) {
  const L = gated ? 220 : 120, g1 = G8.pins("nor", L, 20), g2 = G8.pins("nor", L, 120), X = L + 100, o = L + 160;
  let w = G8.wire([g1.out, [o, 42]]) + G8.wire([g2.out, [o, 142]]) +
    G8.wire([[X, 42], [X, 72], [L - 30, 102], [L - 30, 131], g2.a], true) + G8.wire([[X, 142], [X, 112], [L - 30, 82], [L - 30, 53], g1.b], true) +
    G8.gate("nor", L, 20) + G8.gate("nor", L, 120) + G8.text(o + 6, 48, "Q", { size: 18 }) + G8.text(o + 6, 148, "Q'", { size: 18 });
  if (gated) {
    const ar = G8.pins("and", 60, 9), as = G8.pins("and", 60, 131);
    w += G8.wire([[22, 20], ar.a]) + G8.wire([[22, 164], as.b]) + G8.wire([[14, 92], [35, 92], [35, 42], ar.b]) + G8.wire([[35, 92], [35, 142], as.a], true) +
      G8.wire([ar.out, g1.a]) + G8.wire([as.out, g2.b]) + G8.gate("and", 60, 9) + G8.gate("and", 60, 131) +
      G8.text(4, 25, "R", { size: 18 }) + G8.text(4, 170, "S", { size: 18 }) + G8.text(0, 82, "CK", { size: 15 });
  } else {
    w += G8.wire([[40, 31], g1.a]) + G8.wire([[40, 153], g2.b]) + G8.text(16, 37, "R", { size: 18 }) + G8.text(16, 159, "S", { size: 18 });
  }
  return G8.doc(o + 40, 190, w);
}

const MEALY = [["s0", "s1", "0/1"], ["s0", "s2", "1/1"], ["s1", "s3", "0/0"], ["s1", "s2", "1/1"], ["s2", "s1", "0/1"], ["s2", "s3", "1/0"], ["s3", "s3", "0/0"], ["s3", "s0", "1/0"]];
function machineSvg(moore) {
  const out = ["00", "01", "10", "11"], pos = { s0: [110, 95], s1: [410, 95], s2: [110, 300], s3: [410, 300] };
  const states = Object.entries(pos).map(([id, [x, y]], i) => ({ id, x, y, label: id, sub: moore ? out[i] : undefined }));
  const bend = { "s1>s2": 28, "s2>s1": 28, "s3>s0": -34 }, lt = { "s1>s2": 0.22, "s2>s1": 0.22, "s3>s0": 0.2 };
  const edges = MEALY.map(([f, t, l]) => ({ from: f, to: t, label: moore ? l[0] : l, bend: bend[`${f}>${t}`] || 0, lt: lt[`${f}>${t}`], loop: "right" }));
  return D8.fsm(states, edges, { w: 560, h: 390, r: 36 });
}

function gameSvg() {
  return D8.fsm([{ id: "T", x: 95, y: 150, label: "TITLE", color: "#2E4A62" }, { id: "P", x: 300, y: 150, label: "PLAY", color: "#0E7C86" }, { id: "O", x: 505, y: 150, label: "OVER", color: "#B23A48" }],
    [{ from: "T", to: "P", label: "A" }, { from: "P", to: "O", label: "lives = 0" }, { from: "O", to: "T", label: "A", bend: -95 },
      { from: "T", to: "T", label: "no A", loop: "top" }, { from: "P", to: "P", label: "lives > 0", loop: "top" }, { from: "O", to: "O", label: "no A", loop: "top" }],
    { w: 600, h: 300, r: 44, stateSize: 16 });
}

function latchQ(ck, d) { let q = 0; return [...ck].map((c, i) => { if (c === "1") q = Number(d[i]); return q; }).join(""); }
function ffQ(ck, d) { let q = 0; return [...ck].map((c, i) => { if (i > 0 && c === "1" && ck[i - 1] === "0") q = Number(d[i]); return q; }).join(""); }

const box8 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "13", file: "13-Computer_Architecture-Sequential_Machines",
  title: "Sequential Machines", short: "Sequential machines",
  sub: "Time, state and finite-state machines; latches, flip-flops and the registers of a RISC-V processor",
  quote: ["Steve, every car has a steering wheel, but nobody tries to claim the steering wheel was their invention.", "Bill Gates, in the film Pirates of Silicon Valley, 1999"],
  cover: "game_pacman.png",
  notes: "The quotation is translated back from the Italian version used in the original deck. Spiral: a game with a title screen is a finite-state machine written in assembly; the lecture then builds the theory (time, state, Mealy and Moore), the memory elements (latches and flip-flops), and returns to the registers and the program counter of RISC-V.",
  slides: [
    O("What you will be able to do by the end", [
      "Explain why a sequential circuit needs the concepts of time and of state",
      "Define a finite-state machine and distinguish Mealy machines from Moore machines",
      "Describe a machine with a state table and with a state diagram, and go from one to the other",
      "Explain how an SR latch remembers one bit, and why S = R = 1 is not allowed",
      "Distinguish latches from flip-flops, level triggering from edge triggering",
      "Recognise registers, counters and the program counter of RISC-V as sequential machines",
    ]),

    H("Warm-up on the machine", "The same button, three different effects."),
    K("A game is a state machine", `.equ TITLE, 0
.equ PLAY,  1
.equ OVER,  2

game_update:
    ...
    call prg32_input_read      # a0 = buttons: the INPUT
    la   t0, state
    lw   t1, 0(t0)             # t1 = the present STATE
    andi t2, a0, 0x10          # button A
    li   t3, TITLE
    bne  t1, t3, 1f
    beqz t2, done              # TITLE: stay until A is pressed
    li   t1, PLAY              # TITLE --A--> PLAY
    j    store
1:  li   t3, OVER
    bne  t1, t3, done          # PLAY is handled elsewhere
    beqz t2, done              # OVER: stay until A is pressed
    li   t1, TITLE             # OVER --A--> TITLE
store:
    sw   t1, 0(t0)             # the next state becomes the present state
done:
    ...`, [
      "Pressing A starts the game from the title screen and returns to it from the game-over screen: the effect depends on the state",
      "The state is one word in memory that survives from frame to frame",
      "update computes the next state from the present state and the input",
      "draw shows a different screen for each state: the output",
    ], "Written for this lecture; the textbook capstone game has the same structure. Bug to discuss: holding A on the OVER screen goes to TITLE and, one frame later, to PLAY. Fixing it requires remembering the previous value of the button: one more bit of state."),

    H("Time and state", "What a combinational machine does not have."),
    T("Sequential circuits", [
      "Combinational: the outputs at a given instant depend only on the inputs at that same instant",
      "Sequential: the outputs depend on the inputs at that instant and on the past history of the inputs",
      ["The definition of a sequential circuit implies two concepts", ["time: when do we look at the signals, and when do things change?", "state: what does the circuit remember of the past?"]],
      "Analysis and synthesis still apply: from the structure to the behaviour, and from a functional specification to a structure",
    ], "Tassonomia dei circuiti digitali: reti combinatorie and reti sequenziali. Lecture 11 treated the first kind.", { big: "memory", label: "a sequential circuit is a combinational one plus something that remembers" }),
    T("Time: from continuous to discrete", [
      "In any interval a physical signal passes through infinitely many instants, and a voltage through infinitely many values",
      ["A binary signal is read, or sampled, at a finite number of chosen instants", ["0 if the voltage is below half of the supply voltage, 1 if it is above"]],
      "Between two samples the signal may do anything: only the samples count",
      "In a digital system time is a sequence of discrete instants: t0, t1, t2, ...",
      "Who decides when the instants are? A dedicated periodic signal: the clock",
    ], "The same sampling and quantising of Lecture 04, applied to the wires of the circuit itself. The threshold Vdd/2 is an idealisation: real gates have a forbidden band around it.", { big: "t0, t1, t2 ...", label: "discrete time: the circuit is observed only at chosen instants" }),
    D("The clock", async (s, h) => {
      h.card(s, h.MX, h.TOP, 7.3, 3.3);
      await h.svg(s, clockSvg(), h.MX + 0.15, h.TOP + 0.1, 7.0, 3.1);
      h.rows(s, [
        "A periodic binary signal that marks the discrete instants",
        "During one period it is 1 for the high time and 0 for the low time",
        "Duty cycle: the ratio between the high time and the period",
        "Frequency: the number of periods per second, f = 1 / T",
      ], 8.2, h.TOP, h.W - h.MX - 8.2, 3.3);
      h.rows(s, ["Rising edge: the passage from 0 to 1. Falling edge: the passage from 1 to 0. Synchronous circuits change state on one of the two",
        "The ESP32-C6 runs at 160 MHz: one period lasts 6.25 nanoseconds, and every combinational network inside it must settle within that time"], h.MX, 5.1, h.CW, 1.65);
    }, "Fronte di salita, fronte di discesa, periodo TCK, TH and TL in the original slide. The link with Lecture 11: the period must exceed the critical path. In a PRG32 game the frame plays the role of a much slower clock."),
    T("The concept of state", [
      "The outputs of a sequential circuit depend on the inputs and on the state: a summary of the whole previous history of the inputs",
      "The state is held by a set of state variables",
      "A transition function computes the next state from the present state and the present inputs",
      ["The state is updated at every instant of discrete time, that is, at every clock cycle", ["the state at instant k depends on the inputs at instant k and on the state at instant k - 1"]],
      "To store the state we use memory elements called bistables: latches and flip-flops",
    ], "In the warm-up: one state variable (the word state), the transition function is game_update, the clock is the frame.", { big: "S(k) = f(S(k-1), I(k))", label: "the next state is a function of the present state and of the input" }),

    H("Finite-state machines", "The model of every sequential circuit."),
    DEF("The finite-state automaton", "Definition", "The number of states of a physically realisable sequential network is necessarily finite. The model that describes its behaviour is the finite-state automaton; a sequential machine implements one.", [
      "A sequential machine is a quintuple (I, U, S, Ω, w)",
      "I, the input alphabet, and U, the output alphabet: finite sets of symbols",
      "S: the finite, non-empty set of states",
      "Ω: the next-state function, from S x I to S. To each pair of state and input corresponds, if specified, one and only one next state",
      "w: the output function, which generates the output symbol",
    ], "Automa a stati finiti; macchina sequenziale. With k state variables there are at most 2^k states. The source slide wrote the functions with 'belongs to' signs: the correct arrows are used here."),
    V("Mealy machines and Moore machines",
      ["Mealy machine", ["The output depends on the state and on the input", "w: S x I -> U", "The output is written on the transitions", "It can react to an input in the same cycle", "Often needs fewer states"]],
      ["Moore machine", ["The output is associated with the state alone", "w: S -> U", "The output is written inside the states", "It changes only when the state changes: no glitches from the inputs", "The warm-up game is one: each state has its screen"]],
      "Every Mealy machine has an equivalent Moore machine and vice versa, possibly with a different number of states."),
    D("General architecture of a sequential machine", (s, h) => {
      const x = h.MX + 1.5, y = h.TOP + 0.1;
      box8(s, h, "combinational network\nnext-state function Ω\noutput function w", x, y, 3.6, 2.0, P.teal, 16);
      box8(s, h, "state register\nk flip-flops", x, y + 3.25, 3.6, 1.0, P.amber, 16);
      h.arrow(s, h.MX + 0.1, y + 0.6, x - 0.03, y + 0.6, P.mute, 2.25); h.tx(s, "inputs\nx1 ... xn", { x: h.MX - 0.1, y: y + 0.7, w: 1.5, h: 0.6, fontSize: 13, color: P.ink });
      h.arrow(s, x + 3.63, y + 0.6, x + 5.0, y + 0.6, P.mute, 2.25); h.tx(s, "outputs\nz1 ... zm", { x: x + 3.8, y: y + 0.7, w: 1.5, h: 0.6, fontSize: 13, color: P.ink });
      h.line(s, x + 3.0, y + 2.03, x + 3.0, y + 2.6, P.red, 2.25); h.arrow(s, x + 3.0, y + 2.6, x + 3.0, y + 3.22, P.red, 2.25);
      h.tx(s, "next state\nY1 ... Yk", { x: x + 3.15, y: y + 2.3, w: 1.6, h: 0.6, fontSize: 13, bold: true, color: P.red });
      h.arrow(s, x + 0.6, y + 3.22, x + 0.6, y + 2.03, P.violet, 2.25);
      h.tx(s, "present state\ny1 ... yk", { x: x - 1.15, y: y + 2.3, w: 1.65, h: 0.6, fontSize: 13, bold: true, color: P.violet, align: "right" });
      h.arrow(s, h.MX + 0.4, y + 3.75, x - 0.03, y + 3.75, P.steel, 2.25); h.tx(s, "clock", { x: h.MX + 0.1, y: y + 3.85, w: 1.2, h: 0.3, fontSize: 13, bold: true, color: P.steel });
      h.rows(s, [
        "A combinational network computes the next state and the outputs",
        "A register of flip-flops holds the present state",
        "At each clock edge the next state becomes the present state",
        "The loop is broken by the register: values go round once per cycle, never faster",
        "The whole of Lecture 11 lives in the upper box",
      ], 7.6, h.TOP, h.W - h.MX - 7.6, h.BOT - h.TOP);
    }, "Rete combinatoria and registri di stato. The warm-up has exactly this shape: game_update is the upper box, the word state is the register, the frame is the clock."),
    O("Synthesis of a sequential network", [
      "Define the sets I, U and S: inputs, outputs and states",
      "Define the next-state function Ω and the output function w, with a state table or a state diagram",
      "Assign a binary code to each state: k state variables for up to 2^k states",
      "Synthesise the two combinational networks that realise Ω and w, with the methods of Lectures 09 and 11",
      "Choose the memory elements: the next-state network depends on the type of bistable, the output network does not",
    ], "With D flip-flops the next-state network simply computes the code of the next state, which is why they are the usual choice today."),
    D("State table and state diagram: a Mealy machine", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.9, h.BOT - h.TOP);
      await h.svg(s, machineSvg(false), h.MX + 0.1, h.TOP + 0.1, 5.7, h.BOT - h.TOP - 0.2);
      h.table(s, 7.0, h.TOP, [1.5, 2.1, 2.1], ["Present state", "Input 0", "Input 1"], [["s0", "s1 / 1", "s2 / 1"], ["s1", "s3 / 0", "s2 / 1"], ["s2", "s1 / 1", "s3 / 0"], ["s3", "s3 / 0", "s0 / 0"]], { fs: 16, mono: [0, 1, 2], align: "center", rowH: 0.48 });
      h.rows(s, [
        "State table: one row per present state, one column per input symbol; each cell holds next state / output",
        "State diagram: a directed graph; one node per state, one arc per transition, labelled input / output",
        "The two descriptions are equivalent",
      ], 7.0, h.TOP + 2.65, h.W - h.MX - 7.0, h.BOT - h.TOP - 2.65);
    }, "Tabella degli stati and diagramma degli stati: G(V, E, L) with V the nodes (states), E the arcs (transitions) and L the labels. The example is the one of the original deck."),
    D("State table and state diagram: a Moore machine", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.9, h.BOT - h.TOP);
      await h.svg(s, machineSvg(true), h.MX + 0.1, h.TOP + 0.1, 5.7, h.BOT - h.TOP - 0.2);
      h.table(s, 7.0, h.TOP, [1.5, 1.4, 1.4, 1.4], ["Present state", "Input 0", "Input 1", "Output"], [["s0", "s1", "s2", "00"], ["s1", "s3", "s2", "01"], ["s2", "s1", "s3", "10"], ["s3", "s3", "s0", "11"]], { fs: 16, mono: [0, 1, 2, 3], align: "center", rowH: 0.48 });
      h.rows(s, [
        "The output is a property of the state: it has its own column in the table and is written inside each node of the diagram",
        "The arcs carry only the input symbol",
        "Here the output is simply the binary code of the state",
      ], 7.0, h.TOP + 2.65, h.W - h.MX - 7.0, h.BOT - h.TOP - 2.65);
    }, "Same transitions as the Mealy example, with a two-bit output attached to each state."),
    D("The warm-up as a state diagram", async (s, h) => {
      h.card(s, h.MX, h.TOP, h.CW, 3.3);
      await h.svg(s, gameSvg(), h.MX + 2.2, h.TOP + 0.05, h.CW - 4.4, 3.2);
      h.table(s, h.MX, 5.05, [2.2, 3.3, 3.3, 3.333], ["Present state", "Input that changes it", "Next state", "Output (draw)"], [["TITLE", "A pressed", "PLAY", "the title screen"], ["PLAY", "lives = 0", "OVER", "the playfield"], ["OVER", "A pressed", "TITLE", "the final score"]], { fs: 14.5, mono: [0, 2] });
    }, "A Moore machine with three states: two bits of state would be enough, the program uses a whole word. Drawing the diagram before writing the code is the single most useful design habit for a game."),

    H("Latches", "How a circuit remembers one bit."),
    T("Memory elements", [
      "Electronic circuits able to store a single bit are essentially of two kinds: latches and flip-flops",
      ["Both are bistable", ["two stable states, 0 and 1, kept as long as nothing changes them"]],
      "Both have two outputs, Q and Q', that are always the complement of each other",
      ["A little history", ["1918: Eccles and Jordan build the first electronic flip-flop, with two vacuum tubes", "1943: the same circuit is at the heart of Colossus", "then relays, transistors, and today logic gates on a chip"]],
    ], "Latch: 'a circuit that keeps whatever output state results from a momentary input signal until it is reset by another signal'. Flip-flop: a bistable multivibrator. The name comes from the sound of the electromechanical versions.", { big: "1 bit", label: "the smallest memory: a circuit with two stable states" }),
    D("The SR latch", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.4, 3.35);
      await h.svg(s, latchSvg(false), h.MX + 0.3, h.TOP + 0.15, 4.8, 3.05);
      h.table(s, h.MX + 0.65, 5.1, [0.8, 0.8, 2.5], ["S", "R", "next Q"], [["0", "0", "Q: hold"], ["0", "1", "0: reset"], ["1", "0", "1: set"], ["1", "1", "not allowed"]], { fs: 14, mono: [0, 1], align: "center", bold0: false, rowH: 0.33, hi: { 3: P.redSoft } });
      h.rows(s, [
        "Two NOR gates, each with its output connected to an input of the other: feedback",
        "S (set) brings Q to the stable state 1; R (reset) brings Q to the stable state 0",
        "With S = R = 0 the latch keeps the last value: it remembers which of the two inputs was 1 most recently",
        ["Because of the feedback Q depends on itself", ["Q = R' . (S + Q), where the Q on the right is the value one propagation delay earlier"]],
        "In a network with loops every variable is a waveform in time, not a single value",
      ], 6.5, h.TOP, h.W - h.MX - 6.5, h.BOT - h.TOP);
    }, "Q = (R + Q')' and Q' = (S + Q)'. Breaking the feedback wire turns the latch into a plain combinational network of two NORs: that is how the original deck analysed it, case by case. The same latch can be built with two NAND gates and active-low inputs."),
    D("The SR latch in time", async (s, h) => {
      h.card(s, h.MX, h.TOP, h.CW, 3.2);
      await h.svg(s, D8.wave([{ name: "S", v: "00011000000000" }, { name: "R", v: "00000000110000" }, { name: "Q", v: "00011111000000", delay: 16 }],
        { slot: 54, marks: [{ t: 3, label: "set" }, { t: 5, label: "S returns to 0" }, { t: 8, label: "reset" }, { t: 10, label: "R returns to 0" }] }), h.MX + 0.3, h.TOP + 0.1, h.CW - 0.6, 3.0);
      h.rows(s, [
        "Set: S goes to 1; after the delay of two gates Q becomes 1",
        "S returns to 0 and nothing changes: the feedback keeps Q at 1. The latch remembers",
        "Reset: R goes to 1 and, after the delay, Q becomes 0; when R returns to 0 it stays there",
      ], h.MX, 4.95, h.CW, 1.8);
    }, "Diagramma temporale. The original deck traced each of these four steps gate by gate over a dozen slides; replay them on the board with the circuit of the previous slide. The latch is a Moore automaton: its output is its state."),
    T("Why S = R = 1 is not allowed", [
      "With both inputs at 1 both NOR gates output 0: Q and Q' are no longer complementary",
      "If S and R then return to 0 together, the two gates race: the final state depends on which is faster",
      "The output is unpredictable, and the latch may even oscillate",
      "S and R are called excitation inputs; the designer must guarantee that they are never 1 together",
      "The JK and D elements exist to remove this problem",
    ], "The conclusions of the original deck swapped set and reset on one slide: set gives Q = 1, reset gives Q = 0.", { big: "S . R = 0", label: "the condition every circuit that drives an SR latch must respect" }),
    D("Synchronous latches: adding a clock", async (s, h) => {
      h.card(s, 7.1, h.TOP, h.W - h.MX - 7.1, h.BOT - h.TOP);
      await h.svg(s, latchSvg(true), 7.25, h.TOP + 0.3, h.W - h.MX - 7.4, h.BOT - h.TOP - 1.3);
      h.tx(s, "A clocked SR latch: the excitation inputs pass through two AND gates controlled by CK", { x: 7.25, y: h.BOT - 0.9, w: h.W - h.MX - 7.4, h: 0.7, fontSize: 13.5, italic: true, color: P.mute, align: "center", valign: "middle" });
      h.rows(s, [
        "Asynchronous systems: the outputs can change whenever an input changes",
        "Synchronous systems: the instant at which the outputs can change is decided by the clock",
        ["In a synchronous SR latch, S and R are ANDed with the clock", ["CK = 0: both AND gates output 0 and the latch cannot change state", "CK = 1: the latch is sensitive to S and R, exactly like the asynchronous one"]],
        "The clock decides when the inputs are listened to",
      ], h.MX, h.TOP, 6.2, h.BOT - h.TOP);
    }, "Latch sincroni e asincroni. A simulator is suggested in the original deck: de-iitr.vlabs.ac.in/exp/truth-tables-flip-flops."),
    G("The JK and D latches", ["Inputs", "JK latch", "Inputs", "D latch"], [
      ["J = 0, K = 0", "hold: Q unchanged", "D = 0", "Q becomes 0"],
      ["J = 0, K = 1", "reset: Q becomes 0", "D = 1", "Q becomes 1"],
      ["J = 1, K = 0", "set: Q becomes 1", "", ""],
      ["J = 1, K = 1", "toggle: Q is inverted", "", ""],
    ], "JK: the outputs are fed back to the input gates, S = J . Q' and R = K . Q; since Q and Q' are complementary, S and R can never both be 1. D: a single input goes to S and, through an inverter, to R, so only the cases S = 0, R = 1 and S = 1, R = 0 are possible.", { widths: [2.4, 4, 1.8, 4], mono: [0, 2], fs: 19, caption: "JK: S = J . Q' and R = K . Q are never 1 together. D (delay): S = D and R = D', so the output simply repeats the input while the clock is active." }),
    T("Level triggering and its problem", [
      "A latch is level-triggered: it is sensitive for the whole time the clock is at its active level",
      "While the clock is high a latch is transparent: every change of the inputs reaches the outputs",
      "During one clock cycle several changes of state are therefore possible",
      ["In a machine with feedback this is fatal", ["the new state travels round the loop and changes the state again, in the same cycle", "a JK latch with J = K = 1 keeps toggling as long as the clock stays high"]],
      "We need an element that changes at most once per cycle",
    ], "Look back at the general architecture: the state register must not let the next state through while it is still being computed.", { big: "once per cycle", label: "what a state register must guarantee, and a transparent latch cannot" }),

    H("Flip-flops", "One change per clock cycle."),
    D("The master-slave flip-flop", (s, h) => {
      const y = h.TOP + 0.5, bw = 2.2, bh = 1.6, x1 = h.MX + 0.9, x2 = x1 + bw + 1.1;
      box8(s, h, "MASTER\nD latch\nactive when CK = 0", x1, y, bw, bh, P.teal, 15);
      box8(s, h, "SLAVE\nD latch\nactive when CK = 1", x2, y, bw, bh, P.amber, 15);
      h.arrow(s, h.MX + 0.1, y + 0.5, x1 - 0.03, y + 0.5, P.mute, 2.25); h.tx(s, "D", { x: h.MX + 0.1, y: y + 0.1, w: 0.5, h: 0.3, fontSize: 17, bold: true, fontFace: h.MONO });
      h.arrow(s, x1 + bw + 0.03, y + 0.5, x2 - 0.03, y + 0.5, P.mute, 2.25); h.tx(s, "Qm", { x: x1 + bw + 0.2, y: y + 0.1, w: 0.7, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO });
      h.arrow(s, x2 + bw + 0.03, y + 0.5, x2 + bw + 0.75, y + 0.5, P.mute, 2.25); h.tx(s, "Q", { x: x2 + bw + 0.25, y: y + 0.1, w: 0.5, h: 0.3, fontSize: 17, bold: true, fontFace: h.MONO });
      h.line(s, h.MX + 0.3, y + 2.4, x2 + bw / 2, y + 2.4, P.red, 2.25); h.tx(s, "CK", { x: h.MX + 0.3, y: y + 2.45, w: 0.7, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, color: P.red });
      h.arrow(s, x1 + bw / 2, y + 2.4, x1 + bw / 2, y + bh + 0.03, P.red, 2.25); h.arrow(s, x2 + bw / 2, y + 2.4, x2 + bw / 2, y + bh + 0.03, P.red, 2.25);
      h.tx(s, "inverted", { x: x1 + bw / 2 + 0.1, y: y + bh + 0.2, w: 1.2, h: 0.3, fontSize: 12.5, italic: true, color: P.red });
      h.rows(s, [
        "Two latches in series, controlled by opposite levels of the clock",
        "The master receives the inputs; the slave produces the outputs",
        "They are never transparent at the same time: the input can never run straight through to the output",
        "The output changes only when the clock passes from 0 to 1: on the edge",
        "A flip-flop is edge-triggered: one operation per clock cycle, and no fluctuation of the output",
      ], 8.3, h.TOP, h.W - h.MX - 8.3, h.BOT - h.TOP);
      h.card(s, h.MX, 5.75, 7.3, 1.0, P.tealSoft);
      h.tx(s, "(level 0) followed by (level 1) = (rising edge)", { x: h.MX + 0.2, y: 5.75, w: 6.9, h: 1.0, fontSize: 18, bold: true, valign: "middle", align: "center", color: P.steel });
    }, "Flip-flop master-slave. The original deck showed the JK version, built from two clocked JK latches; the D version is the one used in the registers of a processor."),
    D("Latch or flip-flop? Watch the output", async (s, h) => {
      const ck = "001100110011001100110011", d = "000110011000011111100000";
      h.card(s, h.MX, h.TOP, h.CW, 3.55);
      await h.svg(s, D8.wave([{ name: "CK", v: ck, color: "#2E4A62" }, { name: "D", v: d, color: "#C7791B" }, { name: "latch Q", v: latchQ(ck, d), color: "#6B4FA0" }, { name: "flip-flop Q", v: ffQ(ck, d), color: "#0E7C86" }],
        { slot: 30, left: 130, slope: 3 }), h.MX + 0.2, h.TOP + 0.05, h.CW - 0.4, 3.45);
      h.rows(s, [
        "The D latch follows D for the whole time the clock is high, and holds the last value when the clock goes low",
        "The D flip-flop looks at D only on the rising edge: short pulses between two edges are ignored",
        "The flip-flop output is steady for a whole period: this is what a state register needs",
      ], h.MX, 5.25, h.CW, 1.5);
    }, "Level-triggered versus edge-triggered. The waveforms are computed, not drawn by hand: the latch output changes in the middle of a high phase, the flip-flop output only at rising edges."),
    G("Memory elements: a summary", ["Element", "Inputs", "Next state", "Changes when"], [
      ["SR latch (S R = 0)", "S, R", "Q+ = S + R' Q", "any time an input changes"],
      ["clocked SR latch", "S, R, CK", "as above", "while the clock is at the active level"],
      ["D latch", "D, CK", "Q+ = D", "while the clock is at the active level"],
      ["JK flip-flop", "J, K, CK", "Q+ = J Q' + K' Q", "on the clock edge"],
      ["D flip-flop", "D, CK", "Q+ = D", "on the clock edge"],
      ["T flip-flop", "T, CK", "Q+ = T xor Q", "on the clock edge"],
    ], "Q+ is the next state (tabella caratteristica). A T flip-flop is a JK with J = K = T. The D flip-flop is the standard memory element of today's processors.", { widths: [3.2, 1.9, 3.2, 4.2], mono: [1, 2] }),

    H("Back to the machine", "From one flip-flop to the registers of RISC-V."),
    D("A register is a row of flip-flops", (s, h) => {
      const n = 4, bw = 1.25, g = 0.45, x0 = h.MX + 0.9, y = h.TOP + 1.0;
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (bw + g), b = n - 1 - i;
        box8(s, h, "D flip-flop", x, y, bw, 1.0, P.teal, 13.5);
        h.arrow(s, x + bw / 2, y - 0.6, x + bw / 2, y - 0.03, P.mute, 2); h.tx(s, `D${b}`, { x, y: y - 0.95, w: bw, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, align: "center" });
        h.arrow(s, x + bw / 2, y + 1.03, x + bw / 2, y + 1.6, P.mute, 2); h.tx(s, `Q${b}`, { x, y: y + 1.62, w: bw, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, align: "center" });
        h.arrow(s, x + 0.2, y + 2.3, x + 0.2, y + 1.03, P.red, 1.75);
      }
      h.line(s, h.MX + 0.1, y + 2.3, x0 + (n - 1) * (bw + g) + 0.2, y + 2.3, P.red, 2.25); h.tx(s, "CK", { x: h.MX, y: y + 2.35, w: 0.8, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, color: P.red });
      h.tx(s, "a register of four bits", { x: x0, y: y + 2.75, w: n * (bw + g), h: 0.3, fontSize: 13, italic: true, color: P.mute, align: "center" });
      h.rows(s, [
        "A register is a device able to store a group of bits: one flip-flop per bit and a common clock",
        "With a load-enable signal the register takes the new value only when asked; otherwise it keeps the old one",
        ["RISC-V has thirty-two registers of thirty-two bits", ["1,024 flip-flops, minus those of x0, which is wired to zero"]],
        "The decoder of Lecture 11 drives the load enables: only the register named by rd changes at the clock edge",
        "The multiplexers of Lecture 11 select which registers are read",
      ], 8.1, h.TOP, h.W - h.MX - 8.1, h.BOT - h.TOP);
    }, "Registro. The original deck used the 74273 (eight D flip-flops, one clock and a clear) as its example. Registers, shift registers, buses and three-state buffers are the subject of the next lecture."),
    D("The program counter: a register in a loop", (s, h) => {
      const y = h.TOP + 0.4;
      box8(s, h, "PC\nregister, 32 bits", h.MX + 0.4, y + 1.0, 2.2, 1.2, P.amber, 15);
      box8(s, h, "adder\n+ 4", 4.5, y, 1.6, 1.0, P.violet, 15);
      box8(s, h, "MUX", 7.0, y + 0.7, 1.1, 1.9, P.teal, 16);
      box8(s, h, "branch target\nfrom the ALU", 4.3, y + 2.1, 2.0, 0.9, P.steel, 13.5);
      h.arrow(s, h.MX + 2.63, y + 1.3, 4.47, y + 0.5, P.mute, 2); h.arrow(s, 6.13, y + 0.5, 6.97, y + 1.1, P.mute, 2); h.arrow(s, 6.33, y + 2.55, 6.97, y + 2.2, P.mute, 2);
      h.line(s, 8.13, y + 1.65, 8.6, y + 1.65, P.red, 2.25); h.line(s, 8.6, y + 1.65, 8.6, y + 3.6, P.red, 2.25); h.line(s, 8.6, y + 3.6, h.MX + 1.5, y + 3.6, P.red, 2.25); h.arrow(s, h.MX + 1.5, y + 3.6, h.MX + 1.5, y + 2.23, P.red, 2.25);
      h.tx(s, "next PC", { x: 4.0, y: y + 3.65, w: 2.5, h: 0.3, fontSize: 13.5, bold: true, color: P.red, align: "center" });
      h.arrow(s, h.MX + 1.5, y + 0.3, h.MX + 1.5, y + 0.97, P.steel, 2); h.tx(s, "clock", { x: h.MX + 0.9, y: y - 0.05, w: 1.2, h: 0.3, fontSize: 13.5, bold: true, color: P.steel, align: "center" });
      h.arrow(s, 7.55, y + 3.2, 7.55, y + 2.63, P.mute, 2); h.tx(s, "branch taken?", { x: 6.6, y: y + 3.22, w: 1.9, h: 0.3, fontSize: 12.5, italic: true, color: P.mute, align: "center" });
      h.rows(s, [
        "The PC holds the address of the instruction being executed: it is the state that says where the program is",
        "Next state: PC + 4 for a normal instruction, or the branch target when a branch is taken",
        "Present state, combinational network, next state, clock: exactly the general architecture",
        "With only the + 4 path it is a counter: the simplest finite-state machine",
        "first_update of Lecture 02 was the same machine in software",
      ], 9.0, h.TOP, h.W - h.MX - 9.0, h.BOT - h.TOP);
    }, "The comparator of Lecture 11 produces 'branch taken?' for beq and bne. Instructions are 4 bytes apart; with the compressed extension the adder adds 2 for 16-bit instructions."),
    D("Synthesis example: a two-bit counter", (s, h) => {
      h.table(s, h.MX, h.TOP, [1.5, 1.5, 1.4, 1.4], ["Present Q1 Q0", "Next Q1 Q0", "D1", "D0"], [["0 0", "0 1", "0", "1"], ["0 1", "1 0", "1", "0"], ["1 0", "1 1", "1", "1"], ["1 1", "0 0", "0", "0"]], { fs: 16, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.48 });
      h.card(s, h.MX, h.TOP + 2.7, 5.8, 2.5, P.tealSoft);
      h.tx(s, "D0 = Q0'\nD1 = Q1 xor Q0", { x: h.MX + 0.3, y: h.TOP + 2.8, w: 5.2, h: 1.1, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.tx(s, "Two D flip-flops, one inverter and one XOR gate: a machine that counts 0, 1, 2, 3, 0, ... one step per clock edge.", { x: h.MX + 0.3, y: h.TOP + 3.95, w: 5.2, h: 1.15, fontSize: 15, valign: "middle" });
      h.rows(s, [
        "States: four, one per value of the count; no input; the output is the state itself (Moore)",
        "State code: two state variables Q1 Q0, the count in binary",
        "State table: write the next state beside each present state",
        "With D flip-flops the excitation is the next state: D1 D0 = next Q1 Q0",
        "Minimise each D as a function of Q1 and Q0, with a map of two variables",
        "The same five steps, with more states and more variables, give every counter and every control unit",
      ], 7.0, h.TOP, h.W - h.MX - 7.0, h.BOT - h.TOP, "num");
    }, "Worked on the board: D0 is 1 in rows 00 and 10, so D0 = Q0'; D1 is 1 in rows 01 and 10, so D1 = Q1'Q0 + Q1Q0' = Q1 xor Q0. Compare with the full adder: a counter is an adder that adds 1 to its own register."),
    F("The processor is a sequential machine", [
      "State|the program counter, the thirty-two registers, the memory",
      "Input|the instruction at the address in the PC, and the data it reads",
      "Next-state network|decoders, multiplexers and the ALU compute the new values",
      "Clock edge|the registers named by the instruction take their new values",
    ], "Executing a program is nothing but a long walk through the states of a very large finite-state machine, one clock edge at a time. Single-stepping in PRG32-QT shows that walk one state after another.",
      "This is the bridge to the lectures on the processor: datapath (the combinational part and the registers) and control (itself a finite-state machine in multi-cycle and microprogrammed designs)."),

    Q("In a Moore machine the output depends on:", ["the present input only", "the present state only", "the present state and the present input", "the next state and the input"], 1, "Moore: w maps S to U. In a Mealy machine the output depends on the state and on the input."),
    Q("An SR latch built with NOR gates has Q = 1. S and R are both 0. What happens?", ["Q becomes 0", "Q oscillates", "Q stays at 1", "the state is undefined"], 2, "S = R = 0 is the hold condition: the feedback keeps the stored value."),
    Q("What distinguishes a D flip-flop from a D latch?", ["The flip-flop has two inputs", "The flip-flop stores two bits", "The flip-flop changes only on a clock edge", "The flip-flop does not need a clock"], 2, "The latch is transparent for the whole active level of the clock; the flip-flop samples D only on the edge."),
    Q("How many flip-flops are needed for a finite-state machine with 10 states?", ["3", "4", "5", "10"], 1, "ceil(log2 10) = 4 state variables, with the minimum-length binary code of Lecture 11. Ten would be needed with a one-hot code."),
    X("Exercises: paper first, then PRG32", [
      "Draw the state diagram of a machine that outputs 1 when the last two inputs were both 1; write it as a Moore and as a Mealy machine",
      "Complete the timing diagram of an SR latch for a given sequence of S and R, marking where it holds",
      "Synthesise a counter modulo 3 (0, 1, 2, 0, ...) with two D flip-flops; what happens in the unused state?",
      "Add a PAUSE state to the warm-up game, entered and left with the SELECT button, and draw the new diagram first",
      "Fix the warm-up so that A must be released and pressed again: store the previous button state and react only to a 0 to 1 change",
    ], "On PRG32: four screens, and a held button that causes exactly one transition. The last exercise is edge detection in software: the program behaves like a flip-flop instead of a latch.",
      "Exercise 1: Moore needs three states (no 1 seen, one 1 seen, two or more), Mealy two. Exercise 3: D1 = Q0, D0 = Q1'Q0' with state 11 as a don't-care, or designed to return to 00. Exercise 5: keep prev in memory; pressed_now = buttons AND NOT prev; then store buttons in prev."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["sequential network", "rete sequenziale", "latch / flip-flop", "latch / flip-flop (bistabile)"],
      ["finite-state machine", "automa a stati finiti", "feedback", "retroazione"],
      ["state table / diagram", "tabella / diagramma degli stati", "rising / falling edge", "fronte di salita / di discesa"],
      ["next-state function", "funzione stato prossimo", "level- / edge-triggered", "sensibile al livello / al fronte"],
      ["present / next state", "stato presente / prossimo", "register", "registro"],
      ["clock period", "periodo di clock", "program counter", "contatore di programma"],
    ], null, { widths: [3, 3.3, 3.1, 3.3] }),
    T("Conclusions and reading", [
      "Digital circuits are combinational or sequential; for sequential ones time and state matter",
      "A sequential machine implements a finite-state automaton, described as a Mealy or a Moore machine",
      "Latches and flip-flops are the elementary memories: feedback makes a circuit remember",
      "The clock decides when: latches listen during a level, flip-flops only on an edge",
      "Registers, counters, the program counter and the processor itself are sequential machines built around combinational networks",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, appendix A (clocks, memory elements, finite-state machines)", "Bucci: Architettura dei calcolatori elettronici, chapters on sequential networks", "Playing with RISC-V, chapter 8: the assembly capstone game"]],
    ], "Next lecture: the elementary machines for the architecture: registers, shift registers, buses and three-state buffers."),
  ],
});
