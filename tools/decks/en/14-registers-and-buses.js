// Lecture 14 - Elementary machines for the architecture: word gates, registers, buses, three-state buffers, shift registers.
// Source: 13-Architettura_dei_Calcolatori-Macchine_elementari_per_architettura.pptx (translated, figures redrawn, RISC-V / PRG32 links added).
const box9 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

// A row of n flip-flop cells for shift-register drawings.
function cells9(s, h, x, y, n, labels, col) {
  const w = 0.95, g = 0.35;
  for (let i = 0; i < n; i++) {
    box9(s, h, labels[i], x + i * (w + g), y, w, 0.75, col || P.teal, 15);
    if (i < n - 1) h.arrow(s, x + i * (w + g) + w + 0.03, y + 0.375, x + (i + 1) * (w + g) - 0.03, y + 0.375, P.mute, 2);
  }
  return { w, g, end: x + n * (w + g) - g };
}

Deck({
  n: "14", file: "14-Computer_Architecture-Registers_and_Buses",
  title: "Elementary Machines: Registers and Buses", short: "Registers and buses",
  sub: "Word gates, registers, buses, three-state buffers, serial and parallel transfers",
  quote: ["Roads? Where we're going, we don't need roads.", "Dr. Emmett Brown, Back to the Future, Robert Zemeckis, 1985"],
  cover: "menu_main.png",
  notes: "Spiral: the display of the PRG32 kit receives every pixel one bit at a time; the warm-up sends a byte serially in assembly, and the lecture builds the machines that do it in hardware.",
  slides: [
    O("What you will be able to do by the end", [
      "Describe a register as a set of flip-flops with a common clock, and explain its load signal",
      "Explain what a bus is, and compare dedicated buses with a common bus",
      "Say why a common bus needs three-state buffers, and what high impedance means",
      "Describe a shift register and its four combinations of serial and parallel input and output",
      "Convert a datum from parallel to serial and back, in hardware and in RISC-V assembly",
    ]),

    H("Warm-up on the machine", "One wire, eight bits."),
    K("Send a byte one bit at a time", `# a0 = the byte to send, most significant bit first

    li   t0, 8               # eight bits to go
1:  srli t1, a0, 7           # bring bit 7 down to bit 0
    andi t1, t1, 1           # t1 = the bit to put on the wire
    ...                      # drive the data line with t1,
    ...                      # then pulse the clock line
    slli a0, a0, 1           # shift left: the next bit moves up
    addi t0, t0, -1
    bnez t0, 1b`, [
      "The display and the sound chip of the kit are connected by a few wires, not by thirty-two",
      "A word must therefore travel one bit after another: a serial transfer",
      "The loop is a shift register in software: shift, take one bit, repeat",
      "The ESP32-C6 has hardware that does exactly this, millions of times per second",
    ], "Written for this lecture. On the kit the display uses SPI and the amplifier I2S: both are serial buses driven by shift registers inside the chip. The two elided lines would write to memory-mapped GPIO registers (Lecture 15)."),

    H("Word gates and registers", "From one bit to a whole word."),
    T("Word gates", [
      "A word is a vector V of n bits: V = (v0, v1, ..., v(n-1))",
      "A word gate acts on all the bits of a word at once",
      ["With a control signal a, the word gate computes a AND v(i) for every i", ["a = 1: the word passes unchanged; a = 0: every bit is forced to 0"]],
      "It is n identical gates sharing one control input",
      "The bitwise instructions and, or, xor of RISC-V are word gates thirty-two bits wide",
    ], "Porte di parola. The multiplexer on words of Lecture 11 is built from word gates.", { big: "n gates", label: "one gate per bit, one control signal for all: the building block of every datapath" }),
    T("The register", [
      "A register is a device able to store a group of bits",
      "In its simplest form: a group of flip-flops and a common synchronisation signal, a clock or an enable",
      ["Example: the 74273, an 8-bit register in one chip", ["eight D flip-flops; one clock and one clear; inputs D0 to D7, outputs Q0 to Q7"]],
      "Loading a register: the datum on its inputs is stored when the load signal is active, typically in step with the clock",
      "In RISC-V each of the registers x1 to x31 is thirty-two such flip-flops",
    ], "Datasheet: ti.com/lit/ds/symlink/sn74ls273.pdf. The 7474 holds two D flip-flops with preset and clear. See Lecture 13 for the flip-flop itself.", { img: "chip_74273.jpg", cap: "SN74LS273: eight D flip-flops with a common clock" }),

    H("Buses", "How data travel between registers."),
    DEF("Data transfers and the bus", "Bus", "A communication channel that lets the components of an electronic system exchange data by transmitting and receiving signals: the set of lines that carries a datum.", [
      "The transfer from a register X to a register Y is the fundamental operation of a computer's architecture",
      "The name is a contraction of the Latin omnibus: for all",
      "A bus of n lines carries a word of n bits in one step",
    ], "Almost every instruction of Lecture 02 is, at bottom, a sequence of register transfers."),
    V("Two technical solutions",
      ["Dedicated buses", ["One set of lines for each possible transfer", "Several transfers can happen at the same time", "Efficient but expensive: the wires grow with the square of the number of registers"]],
      ["Common bus", ["A single path collects many potential transfers", "Each time, one source and one destination are chosen", "A transfer takes two steps: source to bus, bus to destination", "Cheap and widespread; less efficient, because transfers cannot be simultaneous"]],
      "Intermediate solutions exist: several buses, each shared by a group of registers. Real processors use them."),
    T("Parallel, serial and mixed transfers", [
      "Parallel: the n bits of the word travel together on n lines, in one step",
      "Serial: the bits travel one after another on a single line, in n steps",
      "Mixed: for example, serial on the byte: eight lines carry one byte at a time",
      "Accessing a bus means reading from it or writing to it; buses come in very different physical sizes",
      "Inside a chip buses are parallel; between chips and between machines they are today almost always serial",
    ], "USB, SATA, PCI Express, HDMI and Ethernet are all serial: at very high speeds it is easier to keep one fast line clean than to keep thirty-two lines in step.", { img: "pcb.jpg", cap: "Bus lines on a printed circuit board" }),
    D("From bus to register, and from register to bus", (s, h) => {
      const y = h.TOP + 0.5;
      h.line(s, h.MX + 0.3, y, 6.3, y, P.amber, 6); h.tx(s, "bus A", { x: h.MX + 0.3, y: y - 0.45, w: 2, h: 0.3, fontSize: 15, bold: true, color: P.amber });
      box9(s, h, "register R", 2.3, y + 1.3, 2.4, 0.9, P.teal, 16);
      h.arrow(s, 3.5, y + 0.05, 3.5, y + 1.27, P.mute, 2.5); h.arrow(s, 1.2, y + 1.75, 2.27, y + 1.75, P.red, 2.25); h.tx(s, "load c", { x: h.MX, y: y + 1.35, w: 1.3, h: 0.3, fontSize: 14, bold: true, color: P.red });
      h.tx(s, "From bus to register: the datum is loaded into R when the load signal c is active (a strobe, usually in step with the clock).", { x: h.MX, y: y + 2.6, w: 5.8, h: 1.2, fontSize: 15.5 });
      const x2 = 7.0;
      h.line(s, x2, y, h.W - h.MX, y, P.amber, 6); h.tx(s, "bus A", { x: x2, y: y - 0.45, w: 2, h: 0.3, fontSize: 15, bold: true, color: P.amber });
      box9(s, h, "register R", x2 + 1.6, y + 1.9, 2.4, 0.9, P.teal, 16);
      box9(s, h, "buffer", x2 + 2.2, y + 0.75, 1.2, 0.55, P.violet, 13);
      h.arrow(s, x2 + 2.8, y + 1.87, x2 + 2.8, y + 1.33, P.mute, 2.5); h.arrow(s, x2 + 2.8, y + 0.72, x2 + 2.8, y + 0.05, P.mute, 2.5);
      h.arrow(s, x2 + 0.7, y + 1.02, x2 + 2.17, y + 1.02, P.red, 2.25); h.tx(s, "enable c", { x: x2 - 0.1, y: y + 0.62, w: 1.6, h: 0.3, fontSize: 14, bold: true, color: P.red });
      h.tx(s, "From register to bus: the outputs of R reach the bus only while the enable signal c is active. What happens to the bus when it is not?", { x: x2, y: y + 3.1, w: h.W - h.MX - x2, h: 1.2, fontSize: 15.5 });
    }, "Trasferimento dati su bus unico: caricamento di un registro (da bus a registro) and trasferimento da registro a bus."),

    H("Three-state buffers", "Sharing one wire without short circuits."),
    D("The three-state gate", (s, h) => {
      h.rows(s, [
        "If two registers drove the same wire, one with 0 and one with 1, the result would be a short circuit",
        "A three-state output has a third condition besides 0 and 1: high impedance, written z",
        "In high impedance the output is electrically disconnected: it neither drives nor loads the wire",
        "An enable signal a decides: a = 1 the gate works normally, a = 0 the output is z",
        "It is the most widespread technique for connecting several source registers to a common bus",
      ], h.MX, h.TOP, 7.0, h.BOT - h.TOP);
      h.table(s, 8.2, h.TOP, [1.0, 1.0, 1.0, 1.5], ["a", "x", "y", "output"], [["1", "0", "0", "0"], ["1", "0", "1", "0"], ["1", "1", "0", "0"], ["1", "1", "1", "1"], ["0", "any", "any", "z"]],
        { fs: 16, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.46, hi: { 4: P.amberSoft } });
      h.tx(s, "A three-state AND with an active-high enable: with a = 1 it is an ordinary AND; with a = 0 its output floats.", { x: 8.2, y: h.TOP + 3.0, w: 4.5, h: 1.2, fontSize: 14, italic: true, color: P.mute });
    }, "AND tristate; segnale di abilitazione in logica 1-attiva. Electrically, both output transistors are switched off."),
    T("Enabling a bus", [
      "A three-state word gate between an enable signal a and a bus X gives a bus Y",
      "Y reproduces X if a is active; otherwise all its lines are at high impedance: Y takes the neutral value",
      "We say that Y is sustained by a three-state buffer",
      "The GPIO pins of the ESP32-C6 work this way: each pin can be an output, or be released and used as an input",
    ], "Tristate di parola. On the kit, the joystick pins are configured as inputs (their output buffers in high impedance) and the display pins as outputs.", { big: "0, 1, z", label: "three states: low, high and disconnected" }),
    D("Connecting buses: the bus OR", (s, h) => {
      const y = h.TOP + 0.2, names = ["register A", "register B", "register X"], en = ["enable α", "enable β", "enable ξ"];
      names.forEach((n, i) => {
        const x = h.MX + 0.2 + i * 2.2;
        box9(s, h, n, x, y, 1.8, 0.8, P.teal, 14); box9(s, h, "3-state", x + 0.35, y + 1.25, 1.1, 0.5, P.violet, 12.5);
        h.arrow(s, x + 0.9, y + 0.83, x + 0.9, y + 1.22, P.mute, 2); h.arrow(s, x + 0.9, y + 1.78, x + 0.9, y + 2.55, P.mute, 2);
        h.tx(s, en[i], { x: x - 0.25, y: y + 1.85, w: 1.1, h: 0.3, fontSize: 12, bold: true, color: P.red });
      });
      h.line(s, h.MX, y + 2.6, 7.0, y + 2.6, P.amber, 6); h.tx(s, "common bus Y", { x: 4.9, y: y + 2.7, w: 2.2, h: 0.3, fontSize: 14, bold: true, color: P.amber });
      box9(s, h, "destination\nregisters", 2.4, y + 3.5, 2.2, 0.9, P.steel, 14); h.arrow(s, 3.5, y + 2.65, 3.5, y + 3.47, P.mute, 2);
      h.rows(s, [
        "Several source registers are connected to one bus simply by joining their outputs, each through a three-state buffer",
        "The condition: of the n sources that flow into the bus, at most one is enabled at a time. One active signal, the other n - 1 neutral",
        "On the destination side, every register is connected to the bus and only the one whose load signal is active takes the datum",
        "Choosing the source and the destination is the job of decoders, driven by the control unit",
      ], 7.5, h.TOP, h.W - h.MX - 7.5, h.BOT - h.TOP);
    }, "Collegamento di bus: OR di bus; trasferimento verso registri-destinazione. Inside modern chips long shared lines are usually replaced by multiplexers, which do the same selection without high-impedance states; between chips, three-state buses are still the rule."),

    H("Shift registers", "Registers that move their bits."),
    DEF("Shift registers", "Definition", "A chain of one-bit memory cells connected to each other: at every clock pulse each bit moves from one cell to the adjacent one.", [
      "The shift can go in one fixed direction, or in a direction chosen by a control line (bidirectional registers)",
      "They make reading and writing data in a system easier: they turn parallel data into serial data and back",
      "Each cell is a D flip-flop whose input is the output of its neighbour",
    ], "Registri a scorrimento. Edge-triggered flip-flops are essential here: with transparent latches a bit would run through the whole chain in one clock pulse (Lecture 13)."),
    D("Four kinds of shift register", (s, h) => {
      const L = ["F1", "F2", "...", "FN"], y = h.TOP + 0.25;
      h.tx(s, "Serial in, serial out", { x: h.MX, y: y - 0.3, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      let c = cells9(s, h, h.MX + 0.8, y + 0.15, 4, L); h.arrow(s, h.MX, y + 0.52, h.MX + 0.77, y + 0.52, P.mute, 2); h.arrow(s, c.end + 0.03, y + 0.52, c.end + 0.7, y + 0.52, P.mute, 2);
      h.tx(s, "Serial in, parallel out", { x: 6.9, y: y - 0.3, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      c = cells9(s, h, 7.7, y + 0.15, 4, L, P.amber); h.arrow(s, 6.9, y + 0.52, 7.67, y + 0.52, P.mute, 2); for (let i = 0; i < 4; i++) h.arrow(s, 7.7 + i * 1.3 + 0.47, y + 0.93, 7.7 + i * 1.3 + 0.47, y + 1.4, P.mute, 2);
      const y2 = y + 2.35;
      h.tx(s, "Parallel in, serial out", { x: h.MX, y: y2 - 0.75, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      c = cells9(s, h, h.MX + 0.8, y2 + 0.15, 4, L, P.violet); for (let i = 0; i < 4; i++) h.arrow(s, h.MX + 0.8 + i * 1.3 + 0.47, y2 - 0.35, h.MX + 0.8 + i * 1.3 + 0.47, y2 + 0.12, P.mute, 2); h.arrow(s, c.end + 0.03, y2 + 0.52, c.end + 0.7, y2 + 0.52, P.mute, 2);
      h.tx(s, "Parallel in, parallel out", { x: 6.9, y: y2 - 0.75, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      cells9(s, h, 7.7, y2 + 0.15, 4, L, P.green); for (let i = 0; i < 4; i++) { h.arrow(s, 7.7 + i * 1.3 + 0.47, y2 - 0.35, 7.7 + i * 1.3 + 0.47, y2 + 0.12, P.mute, 2); h.arrow(s, 7.7 + i * 1.3 + 0.47, y2 + 0.93, 7.7 + i * 1.3 + 0.47, y2 + 1.4, P.mute, 2); }
      h.tx(s, "The same chain of flip-flops, with a common clock c; what changes is where the data enter and where they leave. Parallel in and parallel out with no shifting is the ordinary register.", { x: h.MX, y: 5.95, w: h.CW, h: 0.8, fontSize: 15, valign: "middle" });
    }, "SISO, SIPO, PISO and PIPO. The clock line is not drawn."),
    T("Transfers between registers", [
      ["Serial transfer: the serial output of one shift register feeds the serial input of another", ["n clock pulses move a word of n bits; one wire is enough"]],
      ["Parallel transfer: the parallel outputs of one register feed the parallel inputs of another", ["one clock pulse moves the whole word; n wires are needed"]],
      "Time against wires: the same trade-off as dedicated against common buses",
    ], "Trasferimento seriale (serial input, serial output) and trasferimento parallelo (parallel input, parallel output).", { big: "n pulses or n wires", label: "moving a word of n bits costs either time or copper" }),
    F("Serial to parallel and back", [
      "Load|the datum of n bits is placed in parallel in the register R",
      "Shift out|R is a shift register: the n bits leave one after another, in n successive steps",
      "Travel|a single line carries them to the equipment downstream",
      "Shift in|another register is loaded serially in n steps, rebuilding the datum bit by bit",
      "Use|the rebuilt datum is passed on in parallel",
    ], "This is the hardware of the warm-up. The display of the kit receives each pixel this way over SPI; the keyboard of Lecture 21 sends each key code this way.",
      "Trasformazione serie-parallelo di un dato. UART, SPI, I2C, I2S and USB all rest on a pair of shift registers, one at each end."),
    D("Registers with an address: a first memory", (s, h) => {
      const y = h.TOP + 0.1;
      box9(s, h, "decoder\n2-to-4", h.MX + 1.1, y + 0.9, 1.5, 2.3, P.amber, 14);
      for (let i = 0; i < 4; i++) { box9(s, h, `register ${i}  (3 bits)`, 3.6, y + 0.55 + i * 0.78, 3.0, 0.6, P.teal, 13.5); h.arrow(s, h.MX + 2.63, y + 0.85 + i * 0.78, 3.57, y + 0.85 + i * 0.78, P.amber, 1.75); }
      h.arrow(s, h.MX + 0.1, y + 2.05, h.MX + 1.07, y + 2.05, P.mute, 2); h.tx(s, "A1 A0", { x: h.MX, y: y + 1.65, w: 1.1, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO });
      h.arrow(s, 5.1, y - 0.05, 5.1, y + 0.52, P.mute, 2); h.tx(s, "I2 I1 I0", { x: 5.3, y: y - 0.05, w: 1.6, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO });
      h.arrow(s, 5.1, y + 3.52, 5.1, y + 4.1, P.mute, 2); h.tx(s, "O2 O1 O0", { x: 5.3, y: y + 3.75, w: 1.6, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO });
      h.tx(s, "control: CS, RD, OE", { x: h.MX, y: y + 3.75, w: 3.2, h: 0.3, fontSize: 13.5, bold: true, color: P.red });
      h.rows(s, [
        "Four registers of three bits: a memory of 4 words by 3 bits",
        "Two address lines, A1 and A0, go to a decoder that selects one register",
        "Three data inputs and three data outputs, shared by all the registers",
        ["Three control lines", ["CS, chip select: the memory responds only when selected", "RD, read or write", "OE, output enable: three-state outputs, so that several memories can share one bus"]],
        "Everything in it comes from Lectures 11, 13 and this one",
      ], 7.3, h.TOP, h.W - h.MX - 7.3, h.BOT - h.TOP);
    }, "Memoria 4 (registri) x 3 (bit): eight inputs (I0-I2, A0-A1, CS, RD, OE) and three outputs. The next lecture scales this up to the main memory."),

    H("Back to the machine", "Registers and buses on the kit."),
    G("Buses on the PRG32 kit", ["Connection", "Kind", "Lines", "What travels on it"], [
      ["inside the ESP32-C6", "parallel", "32 data lines, address and control", "instructions, data and register transfers"],
      ["display (ILI9341)", "serial, SPI", "clock, data out, chip select, data/command", "every pixel of every frame, bit by bit"],
      ["sound amplifier", "serial, I2S", "bit clock, word select, data", "audio samples, 22,050 per second"],
      ["joystick and buttons", "one wire per button", "one input pin each", "a decoded representation: one line per button"],
      ["USB to the laptop", "serial, differential pair", "two data wires", "the firmware and the debug console"],
    ], "From the hardware description of the PRG32 repository (docs/hardware). Chip select is the CS of the small memory on the previous slide: several devices can share the same serial bus because only the selected one listens.", { widths: [2.8, 2.3, 3.6, 3.5] }),
    T("Shifts in RISC-V: a shift register in one instruction", [
      "slli and srli move all the bits of a register by a given number of positions, filling with zeros",
      "srai fills with copies of the sign bit (Lecture 05)",
      "sll, srl and sra take the amount from a second register",
      "In hardware a shift by any amount in one step is done by a barrel shifter: layers of multiplexers, not a chain of flip-flops",
      "The shifter is one of the units of the ALU of Lecture 11",
    ], "A true shift register needs n clock pulses for n positions; the barrel shifter of the ALU is combinational and does it within one clock period.", { code: "# parallel to serial, LSB first\nandi t1, a0, 1     # take bit 0\nsrli a0, a0, 1     # next bit\n\n# serial to parallel, MSB first\nslli a1, a1, 1     # make room\nor   a1, a1, t1    # insert bit", wide: true, h: 3.4 }),

    Q("Why does a common bus need three-state buffers?", ["To make transfers faster", "So that only the enabled source drives the lines", "To store the datum on the bus", "To convert serial data to parallel"], 1, "Several sources share the same lines; all but one must be electrically disconnected (high impedance), otherwise two outputs would fight over the wire."),
    Q("How many clock pulses does a serial transfer of a 32-bit word need?", ["1", "5", "32", "64"], 2, "One bit per pulse: n pulses for n bits. A parallel transfer needs one pulse and n wires."),
    Q("A memory has 10 address lines and 8 data lines. How many bits does it store?", ["80", "1,024", "8,192", "10,240"], 2, "2^10 = 1,024 words of 8 bits: 8,192 bits, that is 1 KiB."),
    X("Exercises: paper first, then PRG32", [
      "Draw a 4-bit serial-in, parallel-out shift register with D flip-flops, and fill in its contents over four clock pulses for the input 1, 0, 1, 1",
      "Three registers share a common bus: write the enable and load signals needed to copy register B into register A",
      "Complete the warm-up: write the loop that receives eight bits from a line and rebuilds the byte",
      "On PRG32, show a byte as eight lamps and shift it left by one position every half second",
      "Make the bit that leaves on the left come back in on the right (a rotation): a ring counter",
    ], "On PRG32: a pattern of lamps that walks to the left and, in the last exercise, goes round for ever.",
      "Exercise 3: slli a1, a1, 1 then or with the received bit, eight times. Exercise 5: srli t1, a0, 7; andi t1, t1, 1; slli a0, a0, 1; or a0, a0, t1; andi a0, a0, 255."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["word gate", "porta di parola", "three-state (tri-state)", "a tre stati (tristate)"],
      ["register", "registro", "high impedance", "alta impedenza"],
      ["bus", "bus", "shift register", "registro a scorrimento"],
      ["dedicated / common bus", "bus dedicato / comune", "serial / parallel transfer", "trasferimento seriale / parallelo"],
      ["load, strobe", "caricamento, strobe", "chip select", "selezione del chip"],
    ], null, { widths: [3.1, 3.1, 3.3, 3.3] }),
    T("Conclusions and reading", [
      "Registers are an evolved form of memory with an elementary way of working",
      "Reading and writing registers happens through buses of different kinds",
      "For a common bus to work, three-state circuits are needed: 0, 1, and disconnected",
      "Data can be transferred serially or in parallel; shift registers convert between the two",
      "A decoder in front of a group of registers makes a memory: the subject of the next lecture",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, appendix A", "Bucci: Architettura dei calcolatori elettronici, chapters on registers and buses", "PRG32 repository: docs/hardware/hardware.md"]],
    ], "Next lecture: memory."),
  ],
});
