// Lecture 10 - Introduction to electronics and digital electronics (new in 2026/27).
// No Italian source deck: written to bridge Boolean algebra (06, 07) and combinational machines (09).
// Electrical figures for the kit come from the ESP32-C6 datasheet v1.5 (table 5-4) and the PRG32 hardware docs.
const E8 = require("../../lib/circuit");

function ledCircuitSvg() {
  const W = E8.wire;
  return E8.doc(360, 300,
    W([[70, 40], [270, 40]]) + W([[70, 260], [270, 260]]) +
    E8.battery(70, 40, 220, "3.3 V") + E8.resistor(270, 40, 100, { label: "R" }) + E8.led(270, 140, 120) +
    `<path d="M150,28 h50" stroke="#C7791B" stroke-width="2.5" marker-end="url(#ar)"/><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C7791B"/></marker></defs>` +
    E8.text(175, 18, "I", { anchor: "middle", size: 16, fill: "#C7791B" }) + E8.text(296, 215, "about 2 V", { size: 13, bold: false, fill: "#5B6B78" }));
}

function dividerSvg() {
  const W = E8.wire;
  return E8.doc(300, 320,
    E8.vdd(120, 30, "Vdd") + W([[120, 30], [120, 50]]) + E8.resistor(120, 50, 90, { label: "R1" }) + E8.resistor(120, 170, 90, { label: "R2" }) +
    W([[120, 140], [120, 170]]) + E8.dot(120, 155) + W([[120, 155], [215, 155]]) + E8.text(222, 160, "Vout", { size: 16 }) +
    W([[120, 260], [120, 280]]) + E8.ground(120, 280));
}

function pullupSvg(pressed) {
  const W = E8.wire, x = 95;
  return E8.doc(250, 330,
    `<rect x="8" y="10" width="234" height="162" rx="10" fill="#fff" stroke="#C9D2D8" stroke-width="2" stroke-dasharray="6 5"/>` + E8.text(18, 30, "inside the chip", { size: 13, bold: false, fill: "#5B6B78" }) +
    E8.vdd(x, 58) + W([[x, 58], [x, 66]]) + E8.resistor(x, 66, 84, { label: "45 kΩ" }) +
    W([[x, 150], [x, 196]]) + E8.dot(x, 160) + W([[x, 160], [150, 160]]) +
    `<polygon points="150,146 150,174 176,160" fill="#D8ECEE" stroke="#1B2530" stroke-width="2.2"/>` + W([[176, 160], [200, 160]]) +
    E8.text(208, 168, pressed ? "0" : "1", { size: 24, fill: pressed ? "#B23A48" : "#2F7D4F" }) +
    `<circle cx="${x}" cy="196" r="6" fill="#fff" stroke="#1B2530" stroke-width="2.2"/>` + E8.text(x + 14, 201, "pin", { size: 14, bold: false, fill: "#5B6B78" }) +
    E8.button(x, 202, 86, pressed, pressed ? "pressed" : "released") + E8.ground(x, 288) +
    E8.text(x - 14, 201, pressed ? "0 V" : "3.3 V", { anchor: "end", size: 17, fill: pressed ? "#B23A48" : "#2F7D4F" }));
}

function inverterSvg() {
  const W = E8.wire;
  return E8.doc(300, 310,
    E8.vdd(156, 34) + W([[156, 34], [156, 74]]) + E8.mos("p", 120, 100, { label: "pMOS" }) + E8.mos("n", 120, 220, { label: "nMOS" }) +
    W([[156, 126], [156, 194]]) + E8.dot(156, 160) + W([[156, 160], [245, 160]]) + E8.text(252, 166, "Y", { size: 18 }) +
    W([[156, 246], [156, 276]]) + E8.ground(156, 276) +
    W([[50, 160], [90, 160]]) + E8.dot(90, 160) + W([[90, 160], [90, 100], [120, 100]]) + W([[90, 160], [90, 220], [120, 220]]) + E8.text(30, 166, "A", { size: 18 }));
}

function nandSvg() {
  const W = E8.wire, lab = (x, y, t) => E8.text(x - 8, y + 6, t, { anchor: "end", size: 17 });
  return E8.doc(390, 370,
    E8.vdd(206, 34) + W([[146, 34], [266, 34]]) + W([[146, 34], [146, 74]]) + W([[266, 34], [266, 74]]) +
    E8.mos("p", 110, 100) + E8.mos("p", 230, 100) + lab(110, 100, "A") + lab(230, 100, "B") +
    W([[146, 126], [146, 152], [266, 152], [266, 126]]) + E8.dot(206, 152) + W([[206, 152], [206, 174]]) +
    E8.mos("n", 170, 200) + E8.mos("n", 170, 270) + lab(170, 200, "A") + lab(170, 270, "B") + W([[206, 226], [206, 244]]) +
    W([[206, 296], [206, 330]]) + E8.ground(206, 330) +
    E8.dot(266, 152) + W([[266, 152], [330, 152]]) + E8.text(337, 158, "Y", { size: 18 }));
}

function norSvg() {
  const W = E8.wire, lab = (x, y, t) => E8.text(x - 8, y + 6, t, { anchor: "end", size: 17 });
  return E8.doc(390, 370,
    E8.vdd(206, 30) + W([[206, 30], [206, 54]]) + E8.mos("p", 170, 80) + E8.mos("p", 170, 150) + lab(170, 80, "A") + lab(170, 150, "B") + W([[206, 106], [206, 124]]) +
    W([[206, 176], [206, 214]]) + E8.dot(206, 214) + W([[146, 240], [146, 214], [266, 214], [266, 240]]) +
    E8.mos("n", 110, 266) + E8.mos("n", 230, 266) + lab(110, 266, "A") + lab(230, 266, "B") +
    W([[146, 292], [146, 316], [266, 316], [266, 292]]) + E8.dot(206, 316) + W([[206, 316], [206, 336]]) + E8.ground(206, 336) +
    E8.dot(266, 214) + W([[266, 214], [330, 214]]) + E8.text(337, 220, "Y", { size: 18 }));
}

function levelsSvg() {
  const top = 30, H = 260, y = (v) => top + H - (v / 3.3) * H, band = (x, v1, v2, col, label) =>
    `<rect x="${x}" y="${y(v2)}" width="130" height="${y(v1) - y(v2)}" fill="${col}"/>` + E8.text(x + 65, (y(v1) + y(v2)) / 2 + 5, label, { anchor: "middle", size: 14, fill: "#fff" });
  const tick = (x, v, anchor) => `<line x1="${x - 6}" y1="${y(v)}" x2="${x + 6}" y2="${y(v)}" stroke="#1B2530" stroke-width="1.5"/>` + E8.text(anchor === "end" ? x - 10 : x + 10, y(v) + 5, String(v) + " V", { anchor, size: 13, bold: false });
  let o = E8.text(145, 18, "output", { anchor: "middle", size: 15 }) + E8.text(375, 18, "input", { anchor: "middle", size: 15 });
  o += `<rect x="80" y="${top}" width="130" height="${H}" fill="#EEF2F4"/><rect x="310" y="${top}" width="130" height="${H}" fill="#EEF2F4"/>`;
  o += band(80, 2.64, 3.3, "#2F7D4F", "1") + band(80, 0, 0.33, "#2E4A62", "0");
  o += band(310, 2.475, 3.3, "#2F7D4F", "read as 1") + band(310, 0, 0.825, "#2E4A62", "read as 0") + band(310, 0.825, 2.475, "#C7791B", "undefined");
  o += tick(80, 3.3, "end") + tick(80, 2.64, "end") + tick(80, 0.33, "end") + tick(80, 0, "end") + tick(440, 2.475, "start") + tick(440, 0.825, "start");
  o += `<line x1="210" y1="${y(2.64)}" x2="310" y2="${y(2.475)}" stroke="#5B6B78" stroke-dasharray="4 4"/><line x1="210" y1="${y(0.33)}" x2="310" y2="${y(0.825)}" stroke="#5B6B78" stroke-dasharray="4 4"/>`;
  o += E8.text(260, y(2.56) - 8, "margin", { anchor: "middle", size: 12, bold: false, fill: "#5B6B78" }) + E8.text(260, y(0.58) + 16, "margin", { anchor: "middle", size: 12, bold: false, fill: "#5B6B78" });
  return E8.doc(520, 310, o);
}

Deck({
  n: "10", file: "10-Computer_Architecture-Electronics",
  title: "Introduction to Electronics and Digital Electronics", short: "Electronics and digital electronics",
  sub: "From volts and transistors to logic gates: what a 0 and a 1 are made of",
  quote: ["Any sufficiently advanced technology is indistinguishable from magic.", "Arthur C. Clarke, Profiles of the Future, 1973"],
  cover: "kit_breadboard.png",
  notes: "New lecture for 2026/27, placed between Boolean algebra and combinational machines. It gives the gates of Lectures 08 and 09 a physical body before Lecture 11 composes them into machines. Spiral: the button of the kit, read since the first labs, is followed from the finger to the bit. No previous knowledge of physics is assumed; numbers for the kit are from the ESP32-C6 datasheet (table 5-4) and from the PRG32 hardware documentation.",
  slides: [
    O("What you will be able to do by the end", [
      "Use voltage, current, resistance and power, and apply Ohm's law to a simple circuit",
      "Size the resistor of an LED and compute a voltage divider",
      "Explain what a transistor is and how a MOS transistor works as a switch",
      "Say how voltages become logic values, and what a noise margin is",
      "Draw the CMOS inverter, NAND and NOR, and count their transistors",
      "Explain pull-up resistors, floating inputs and why a gate takes time and energy to switch",
    ]),

    H("Warm-up on the machine", "From the finger to the bit."),
    K("One button, one bit", `    call prg32_input_read    # a0 = one bit per button
    andi t3, a0, 0x01        # bit 0: LEFT
    beqz t3, 1f              # 0: not pressed
    ...                      # 1: pressed
1:

# on the kit:
#   LEFT is a switch between pin GPIO18 and ground
#   pressed  -> the pin is at 0 volts
#   released -> the pin is at 3.3 volts`, [
      "Since the first labs a pressed button has been a 1 in a register",
      "On the board the button is a piece of metal that joins a pin of the chip to ground",
      "Pressed means 0 volts on the pin, and yet the program reads 1",
      "What is a volt, why is the released pin at 3.3 V, and who decides that 0 V is a bit?",
    ], "Wiring from the PRG32 hardware documentation: every button is a switch to GND, and the firmware enables the internal pull-up of each input. The runtime inverts the level when it builds the mask (prg32_controller.c): pressed pin low, bit high. The last section of the lecture answers the four callouts."),

    H("Electricity in four quantities", "Voltage, current, resistance, power."),
    G("Four quantities", ["Quantity", "Symbol, unit", "Water analogy", "On the kit"], [
      ["voltage", "V, volt (V)", "the pressure that pushes the water", "3.3 V between the supply rail and ground"],
      ["current", "I, ampere (A)", "the flow: litres per second", "about 10 mA through a lit LED"],
      ["resistance", "R, ohm (Ω)", "a narrow pipe that hinders the flow", "45 kΩ: the pull-up inside each input pin"],
      ["power", "P, watt (W)", "the work the flow can do each second", "at most 2.5 W from a USB 2.0 port (5 V, 0.5 A)"],
    ], "Electric charge is carried by electrons; current is charge per second. A voltage is always between two points: when we say 'the pin is at 3.3 V' we mean with respect to ground, the common reference of the whole circuit. Prefixes: milli (m) 10^-3, micro (µ) 10^-6, kilo (k) 10^3, mega (M) 10^6.", { widths: [1.8, 2.2, 4, 4.2], caption: "A voltage is always measured between two points. Ground (GND) is the common reference: 0 V by definition." }),
    D("Ohm's law, and the resistor of an LED", async (s, h) => {
      h.card(s, h.MX, h.TOP, 4.6, h.BOT - h.TOP);
      await h.svg(s, ledCircuitSvg(), h.MX + 0.2, h.TOP + 0.2, 4.2, h.BOT - h.TOP - 0.4);
      h.tx(s, "V = R x I", { x: 5.6, y: h.TOP, w: h.W - h.MX - 5.6, h: 0.7, fontSize: 32, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.rows(s, [
        "The current through a resistor is proportional to the voltage across it",
        "A circuit is a closed loop: the current leaves the source, crosses the components and returns",
        "An LED lights when current flows through it, and drops about 2 V; without a resistor the current would be far too large",
        ["The resistor takes what is left: 3.3 - 2 = 1.3 V", ["for 10 mA: R = 1.3 / 0.010 = 130 Ω; the nearest common value is 150 Ω"]],
      ], 5.6, h.TOP + 0.9, h.W - h.MX - 5.6, h.BOT - h.TOP - 0.9);
    }, "Georg Ohm, 1827. The forward voltage of an LED depends on its colour: about 1.8-2.2 V for red, about 3 V for blue and white. With 150 Ω the current is 1.3 / 150 = 8.7 mA."),
    D("Series, parallel and the voltage divider", async (s, h) => {
      h.rows(s, [
        ["Series: the same current crosses both resistors", ["the resistances add: R = R1 + R2"]],
        ["Parallel: the same voltage is across both", ["the current splits; the total resistance is smaller than either"]],
        ["Two resistors in series divide the voltage", ["Vout = Vdd x R2 / (R1 + R2)"]],
        "Equal resistors give half the supply; a much smaller R2 pulls Vout close to ground",
        "Kirchhoff's rules: the currents entering a node add up to those leaving; the voltages around a loop add up to zero",
      ], h.MX, h.TOP, 7.4, h.BOT - h.TOP);
      h.card(s, 8.5, h.TOP, h.W - h.MX - 8.5, h.BOT - h.TOP);
      await h.svg(s, dividerSvg(), 8.7, h.TOP + 0.2, h.W - h.MX - 8.9, h.BOT - h.TOP - 0.4);
    }, "The divider is the key to the pull-up circuit at the end of the lecture: a button is a resistor that is either infinite (open) or nearly zero (closed). Parallel: 1/R = 1/R1 + 1/R2."),
    T("Power and energy", [
      "Power is voltage times current: P = V x I, in watts",
      "In a resistor it becomes heat: P = R x I^2",
      "Energy is power times time, in joules; a battery stores energy",
      "The LED of the previous slide: 3.3 V x 8.7 mA = 29 mW, of which 11 mW heat the resistor",
      "Every transistor that switches inside a processor dissipates a little energy: with billions of them, heat is the limit of modern chips",
    ], "A phone battery of 15 Wh holds 54,000 J. A laptop processor dissipates tens of watts in a few square centimetres.", { big: "P = V x I", label: "what a circuit consumes, and what it must get rid of as heat" }),
    T("The capacitor: why signals take time", [
      "A capacitor stores electric charge, as a tank stores water; capacitance is measured in farads (F)",
      "Its voltage cannot jump: it must be filled, or emptied, through a resistance",
      ["The time it takes is of the order of R x C", ["45 kΩ x 2 pF = 90 ns: the time an input pin of the kit needs to rise through its pull-up"]],
      "Every wire and every transistor input is a small capacitor: this is where the propagation delay of a gate comes from",
      "A charged or empty capacitor is also a way to store a bit: the DRAM cell of Lecture 15",
    ], "RC is the time constant: after RC the voltage has covered about 63% of the way. Pin capacitance of the ESP32-C6: 2 pF typical (datasheet). Wiring and the button add more, so the real figure is larger.", { big: "R x C", label: "resistance times capacitance is a time: the reason nothing in a circuit is instantaneous" }),

    H("Semiconductors", "The material that can be a conductor or an insulator on command."),
    T("Conductors, insulators, semiconductors", [
      "Conductors, such as copper, let charge flow freely; insulators, such as glass, do not",
      "Semiconductors, above all silicon, lie in between, and their conduction can be controlled",
      ["Doping: adding a few atoms of another element", ["n-type silicon has extra electrons, negative carriers", "p-type silicon has missing electrons, called holes, that behave as positive carriers"]],
      "Where a p region meets an n region there is a junction: the building block of every device",
      "A chip is a slice of silicon with billions of doped regions, connected by layers of metal",
    ], "Silicon is the second most abundant element in the Earth's crust: sand. The whole industry rests on purifying it and doping it with extreme precision.", { big: "Si", label: "silicon: element 14, a semiconductor, the raw material of almost every chip" }),
    T("The diode and the LED", [
      "A single junction makes a diode: a one-way valve for current",
      "Forward, from p to n, it conducts once the voltage exceeds a threshold: about 0.7 V for silicon",
      "Reverse, it blocks",
      "A light-emitting diode gives off light when it conducts; the colour depends on the material, and so does the threshold",
      "LEDs are everywhere in a computer: indicators, the backlight of the display of Lecture 21, optical links",
    ], "Diodes turn alternating current into direct current in every power supply. The laser of the optical disks of Lecture 16 is a diode too.", { big: "one way", label: "a diode lets current through in one direction only" }),
    G("The transistor: a switch with no moving parts", ["Year", "Who", "What"], [
      ["1947", "Bardeen, Brattain and Shockley, Bell Labs", "the first transistor: it replaces the vacuum tube"],
      ["1958-59", "Jack Kilby; Robert Noyce", "the integrated circuit: several transistors on one piece of semiconductor"],
      ["1959-60", "Atalla and Kahng, Bell Labs", "the MOS transistor: small, simple to build, almost no control current"],
      ["1963", "Wanlass and Sah, Fairchild", "CMOS: pairs of complementary MOS transistors that draw power only when switching"],
      ["1971", "Intel 4004", "2,300 MOS transistors: a processor on a chip"],
      ["today", "the whole industry", "tens of billions of CMOS transistors on a chip"],
    ], "A transistor is a device with three terminals in which a small signal on one controls the current between the other two. Used as an amplifier it made the radio portable; used as a switch it made the computer. Vacuum tubes and relays did the same job in the first computers of Lecture 03, a million times larger and slower.", { widths: [1.4, 4.6, 6.2] }),
    D("The MOS transistor as a switch", async (s, h) => {
      const W = E8.wire, sym = (type) => E8.doc(150, 120, E8.mos(type, 30, 60) + W([[66, 34], [66, 12]]) + W([[66, 86], [66, 108]]) + E8.text(20, 66, "G", { anchor: "end", size: 15 }));
      h.card(s, h.MX, h.TOP, 3.3, 2.5); h.card(s, h.MX, h.TOP + 2.7, 3.3, 2.5);
      await h.svg(s, sym("n"), h.MX + 0.2, h.TOP + 0.45, 2.9, 1.9); await h.svg(s, sym("p"), h.MX + 0.2, h.TOP + 3.15, 2.9, 1.9);
      h.tx(s, "nMOS", { x: h.MX + 0.2, y: h.TOP + 0.08, w: 2, h: 0.35, fontSize: 16, bold: true, color: P.teal }); h.tx(s, "pMOS", { x: h.MX + 0.2, y: h.TOP + 2.78, w: 2, h: 0.35, fontSize: 16, bold: true, color: P.amber });
      h.table(s, 4.4, h.TOP, [2.2, 3.1, 3.03], ["Gate voltage", "nMOS", "pMOS"], [["high (1)", "conducts: switch closed", "blocks: switch open"], ["low (0)", "blocks: switch open", "conducts: switch closed"]], { fs: 16, rowH: 0.55, cellHi: { "0,1": P.greenSoft, "1,2": P.greenSoft } });
      h.rows(s, [
        "Three terminals: the gate controls whether current can pass between the other two, source and drain",
        "The gate is insulated: it draws practically no current, only the tiny charge of its capacitance",
        "The two types are complementary: what closes one opens the other",
        "nMOS passes a good 0 (it connects to ground); pMOS passes a good 1 (it connects to the supply)",
      ], 4.4, h.TOP + 1.9, h.W - h.MX - 4.4, h.BOT - h.TOP - 1.9);
    }, "MOS: metal, oxide, semiconductor, the three layers of the gate. The small circle on the pMOS gate means, as on logic symbols, 'active when low'. Input current of an ESP32-C6 pin: at most 50 nA (datasheet)."),

    H("From volts to bits", "Digital electronics."),
    D("Logic levels: when is a voltage a 1?", async (s, h) => {
      h.card(s, h.MX, h.TOP, 6.3, h.BOT - h.TOP);
      await h.svg(s, levelsSvg(), h.MX + 0.15, h.TOP + 0.3, 6.0, h.BOT - h.TOP - 0.6);
      h.rows(s, [
        "A digital circuit uses two ranges of voltage: low is 0, high is 1",
        ["An output guarantees clean levels", ["on the kit: above 2.64 V for a 1, below 0.33 V for a 0"]],
        ["An input accepts wider ranges", ["above 2.475 V it reads 1, below 0.825 V it reads 0"]],
        "The difference is the noise margin: a disturbance smaller than that cannot change the bit",
        "In between, the value is undefined: signals must cross that band quickly and never stay there",
      ], 7.4, h.TOP, h.W - h.MX - 7.4, h.BOT - h.TOP);
    }, "ESP32-C6 datasheet, table 5-4, with VDD = 3.3 V: VOH min 0.8 VDD, VOL max 0.1 VDD, VIH min 0.75 VDD, VIL max 0.25 VDD. Noise margins: 2.64 - 2.475 = 0.165 V high, 0.825 - 0.33 = 0.495 V low. This is the threshold 'half of the supply voltage' of Lecture 13, made precise."),
    V("Why digital?",
      ["Analog circuits", ["The exact value of the voltage is the information", "Every stage adds a little noise and distortion, and they accumulate", "Copies get worse at every generation", "Still indispensable at the edges: sensors, radio, sound"]],
      ["Digital circuits", ["Only the range matters: high or low", "Every gate restores the levels: noise does not accumulate", "Copies are perfect, and errors can be detected and corrected (Lecture 11)", "Two levels are easy to tell apart with fast, tiny, cheap transistors"]],
      "The analog-to-digital story of Lecture 04, seen from the wire. The audio amplifier and the radio of the kit are the analog edges of an otherwise digital system."),
    D("The CMOS inverter: a NOT gate from two transistors", async (s, h) => {
      h.card(s, h.MX, h.TOP, 4.9, h.BOT - h.TOP);
      await h.svg(s, inverterSvg(), h.MX + 0.2, h.TOP + 0.15, 4.5, h.BOT - h.TOP - 0.3);
      h.table(s, 6.0, h.TOP, [0.8, 1.5, 1.5, 2.93], ["A", "pMOS", "nMOS", "Y"], [["0", "on", "off", "1: joined to 3.3 V"], ["1", "off", "on", "0: joined to ground"]], { fs: 15, mono: [0], align: "center", rowH: 0.5, cellHi: { "0,1": P.greenSoft, "1,2": P.greenSoft } });
      h.rows(s, [
        "One pMOS towards the supply, one nMOS towards ground, driven by the same input",
        "Exactly one of the two conducts: the output is always connected to one rail, never to both",
        "With the input still, no current flows from supply to ground: CMOS consumes almost nothing at rest",
        "The output is a fresh, clean level whatever the quality of the input: the gate regenerates the signal",
      ], 6.0, h.TOP + 1.8, h.W - h.MX - 6.0, h.BOT - h.TOP - 1.8);
    }, "CMOS: complementary MOS. Y = A'. The pull-up network (pMOS) and the pull-down network (nMOS) are each other's dual, as in the duality principle of Lecture 08."),
    D("NAND and NOR in CMOS", async (s, h) => {
      const w = (h.CW - 0.4) / 2;
      h.card(s, h.MX, h.TOP, w, 4.25); h.card(s, h.MX + w + 0.4, h.TOP, w, 4.25);
      h.tx(s, "NAND:  Y = (A . B)'", { x: h.MX + 0.25, y: h.TOP + 0.1, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: h.MONO, color: P.teal });
      h.tx(s, "NOR:  Y = (A + B)'", { x: h.MX + w + 0.65, y: h.TOP + 0.1, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: h.MONO, color: P.amber });
      await h.svg(s, nandSvg(), h.MX + 0.2, h.TOP + 0.5, w - 0.4, 3.7); await h.svg(s, norSvg(), h.MX + w + 0.6, h.TOP + 0.5, w - 0.4, 3.7);
      h.rows(s, ["NAND: two nMOS in series reach ground only if A AND B are 1; two pMOS in parallel reach the supply if either is 0",
        "NOR: the dual. Parallel becomes series and series becomes parallel, as De Morgan's laws exchange AND and OR"], h.MX, 5.95, h.CW, 0.8);
    }, "Series is AND, parallel is OR: the switching-circuit idea of Nakajima and Shannon (Lecture 03). Four transistors each. Ask the class to check the four input combinations on the drawing."),
    G("What gates cost, in transistors", ["Circuit", "Transistors", "Remark"], [
      ["NOT", "2", "the CMOS inverter"],
      ["NAND, NOR (2 inputs)", "4", "the natural gates of CMOS"],
      ["AND, OR (2 inputs)", "6", "a NAND or a NOR followed by an inverter"],
      ["XOR (2 inputs)", "about 8 to 12", "depending on the design"],
      ["full adder", "about 28", "the classic static CMOS adder"],
      ["SRAM cell, one bit", "6", "two inverters in a loop and two access transistors"],
      ["D flip-flop", "about 20", "two latches, master and slave"],
    ], "This is why NAND is the universal gate of Lecture 09 in practice as well as in theory: an AND costs more than a NAND. Counts are for conventional static CMOS and vary with the design style. Thirty-two full adders: about 900 transistors for the adder behind the add instruction.", { widths: [3.4, 2.4, 6.4], caption: "AND costs more than NAND: in CMOS the inverting gates come first. Minimising a function means saving transistors, area, energy and time." }),
    T("Switching takes time and energy", [
      "The output of a gate drives the inputs of the next gates, which are small capacitors",
      "To change level, the output must charge or discharge them through the resistance of its transistors: this is the propagation delay",
      ["Every change of level costs energy", ["the power spent in switching is about C x V^2 x f"]],
      "Lowering the supply voltage saves the most: the reason chips moved from 5 V to 3.3 V to about 1 V inside",
      "Raising the clock frequency raises the consumption in proportion: speed is paid for in heat",
    ], "C the switched capacitance, V the supply, f the switching frequency. The propagation delay returns in Lecture 11 as the critical path, and in Lecture 13 as the reason for the clock. The ESP32-C6 has a 3.3 V supply for its pins and a lower internal voltage for its logic.", { big: "C x V^2 x f", label: "dynamic power: capacitance, the square of the voltage, and how often you switch" }),
    G("Scales of integration", ["Scale", "Transistors per chip", "Examples"], [
      ["SSI, small", "up to about 100", "a few gates: the 74 series, such as four NANDs in one package"],
      ["MSI, medium", "hundreds", "decoders, multiplexers, counters, registers: the machines of Lectures 11 to 14"],
      ["LSI, large", "thousands", "the first microprocessors and memories: Intel 4004"],
      ["VLSI, very large", "hundreds of thousands and up", "the processors of the 1980s and 1990s"],
      ["today", "tens of billions", "systems on a chip: processor, memory, radio and peripherals together"],
    ], "The ESP32-C6 of the kit is a system on a chip in a package of a few millimetres. The 74 series chips (7400 NAND, 74139 decoder, 74273 register) reappear in the next lectures as the historical form of each building block.", { widths: [2.2, 3.6, 6.4] }),

    H("Back to the machine", "The button, explained."),
    D("Pull-up: an input that is never left floating", async (s, h) => {
      const w = 3.0;
      h.card(s, h.MX, h.TOP, w, h.BOT - h.TOP); h.card(s, h.MX + w + 0.25, h.TOP, w, h.BOT - h.TOP);
      await h.svg(s, pullupSvg(false), h.MX + 0.1, h.TOP + 0.15, w - 0.2, h.BOT - h.TOP - 0.3); await h.svg(s, pullupSvg(true), h.MX + w + 0.35, h.TOP + 0.15, w - 0.2, h.BOT - h.TOP - 0.3);
      h.rows(s, [
        "An input connected to nothing is floating: it picks up noise and reads 0 or 1 at random",
        "A pull-up resistor ties the pin to 3.3 V: released, no current flows, and the pin reads a clean 1",
        ["Pressed, the switch joins the pin to ground: 0 V, a clean 0", ["a current of 3.3 V / 45 kΩ = 73 µA flows, too small to matter"]],
        "It is a voltage divider whose lower resistor is either infinite or zero",
        "The firmware inverts the bit, so that in your program pressed is 1",
      ], h.MX + 2 * w + 0.6, h.TOP, h.W - 2 * h.MX - 2 * w - 0.6, h.BOT - h.TOP);
    }, "Internal weak pull-up of the ESP32-C6: 45 kΩ typical (datasheet). The firmware enables it on every button pin (prg32_input.c) and reads the pins inverted (prg32_controller.c). The triangle is the input buffer of the pin. This is called active-low logic."),
    G("From the finger to the bit", ["Step", "What happens", "Where it is explained"], [
      ["1", "the finger closes the switch between GPIO18 and ground", "this lecture: the circuit"],
      ["2", "the pin falls from 3.3 V to 0 V, in well under a microsecond", "this lecture: R x C"],
      ["3", "the input buffer sees a voltage below 0.825 V: a logic 0", "this lecture: logic levels"],
      ["4", "the level is sampled into a flip-flop of the input register", "Lecture 13: sequential machines"],
      ["5", "the firmware reads that register with a load instruction", "Lecture 15: memory-mapped input/output"],
      ["6", "it inverts the bit and packs it with the others into a0", "Lecture 08: masks; Lecture 21: input devices"],
      ["7", "your program tests it: andi t3, a0, 0x01", "Lecture 02: first contact"],
    ], "The contacts of a real switch bounce for a few milliseconds when they close: reading the buttons once per frame, every few tens of milliseconds, hides the bounce (Lecture 21).", { widths: [0.9, 7.1, 4.2] }),
    T("The kit as a circuit", [
      "A breadboard: holes joined in rows underneath, so that components connect without soldering",
      "Two long buses carry the supply: 3.3 V and ground; a separate bus carries 5 V for the audio amplifiers",
      "Every part shares the same ground: without a common reference, the voltages of two parts mean nothing to each other",
      "The buttons go from a pin to ground; the display and the amplifiers receive digital signals from other pins",
      "An output pin can light an LED through a resistor; an input pin only listens",
    ], "Diagram from the PRG32 repository (docs/hardware/images). A pin of the ESP32-C6 can source some tens of milliamperes: an LED needs its series resistor, as computed earlier. Never join a pin driven high directly to ground.", { img: "kit_breadboard.png", cap: "The PRG32 kit on a breadboard (PRG32 hardware documentation)", wide: true }),

    Q("An LED drops 2 V and must carry 5 mA from a 3.3 V pin. Which resistor is needed?", ["26 Ω", "260 Ω", "400 Ω", "660 Ω"], 1, "R = (3.3 - 2) / 0.005 = 260 Ω."),
    Q("In a CMOS inverter with the input at 0:", ["both transistors conduct", "the pMOS conducts and the output is 1", "the nMOS conducts and the output is 0", "neither conducts and the output floats"], 1, "A low gate closes the pMOS, which joins the output to the supply; the nMOS is open."),
    Q("How many transistors does a two-input AND need in static CMOS?", ["2", "4", "6", "8"], 2, "A NAND (4) followed by an inverter (2)."),
    Q("Why does the button input of the kit need a pull-up resistor?", ["To limit the current of the LED", "To make the pin read a defined 1 when the button is released", "To make the button faster", "To protect the chip from 5 V"], 1, "Without it the released pin would float; the pull-up ties it to 3.3 V, and the pressed switch overrides it to ground."),
    X("Exercises: paper first, then the kit", [
      "A blue LED drops 3.0 V: which resistor gives 2 mA from 3.3 V? What power does the resistor dissipate?",
      "A divider with R1 = 10 kΩ and R2 = 20 kΩ on 3.3 V: compute Vout. Is it read as 0, as 1, or undefined by an input of the kit?",
      "Draw a three-input NAND in CMOS and count its transistors",
      "Check the NOR drawing for the four input combinations, marking which transistors conduct",
      "On PRG32, run the lamps cartridge and bridge a button pin to ground with a wire: explain what you see, and what would happen with the pull-up disabled",
    ], "On paper: 150 Ω and 0.6 mW; Vout = 2.2 V, in the undefined band. On the kit: the lamp lights exactly as if the button were pressed.",
      "Exercise 1: (3.3 - 3.0) / 0.002 = 150 Ω; P = 0.3 x 0.002 = 0.6 mW. Exercise 2: 3.3 x 20 / 30 = 2.2 V, between 0.825 and 2.475. Exercise 3: three pMOS in parallel, three nMOS in series: six transistors. The lamps cartridge is step 1 of textbook lab 06."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["voltage", "tensione", "logic level", "livello logico"],
      ["current", "corrente", "noise margin", "margine di rumore"],
      ["resistor / resistance", "resistore / resistenza", "pull-up resistor", "resistenza di pull-up"],
      ["capacitor", "condensatore", "floating input", "ingresso flottante"],
      ["ground", "massa", "propagation delay", "ritardo di propagazione"],
      ["semiconductor, doping", "semiconduttore, drogaggio", "integrated circuit", "circuito integrato"],
      ["gate, source, drain", "gate, source, drain", "breadboard", "basetta sperimentale (breadboard)"],
    ], null, { widths: [3, 3.2, 3, 3.6] }),
    T("Conclusions and reading", [
      "Voltage pushes, current flows, resistance hinders: V = R x I describes most of what a digital designer needs",
      "A MOS transistor is a switch controlled by a voltage; nMOS and pMOS are complementary",
      "A bit is a range of voltages; noise margins and regeneration are what make digital circuits reliable",
      "CMOS gates are pairs of switch networks; the inverting gates NAND and NOR are the cheapest",
      "Switching costs time (R x C) and energy (C x V^2 x f): the physical limits behind every clock",
      ["Reading", ["Charles Petzold: Code, the chapters from the flashlight to logic gates", "Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, sections 1.5, 1.7 and appendix A", "PRG32 repository: docs/hardware/hardware.md"]],
    ], "Next lecture: combinational machines, built from these gates."),
  ],
});
