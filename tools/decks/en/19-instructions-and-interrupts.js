// Lecture 19 - Instructions and interrupts.
// Source: 19-Architettura_dei_Calcolatori-Istruzioni_e_Interruzioni.pptx (translated and reorganised; the RISC-V formats,
// processor cycle and trap mechanism replace the MC68000 examples).
const box15 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "19", file: "19-Computer_Architecture-Instructions_and_Interrupts",
  title: "Instructions and Interrupts", short: "Instructions and interrupts",
  sub: "Instruction formats, the processor cycle, and how RISC-V handles exceptional events",
  quote: ["Why does the CPU never get any work done? Because it gets interrupted constantly.", "Anonymous joke about computer architecture"],
  cover: "game_asteroids.png",
  notes: "The original deck used a 16-bit word machine for the fetch phase and the Motorola MC68000 for vectored interrupts and priorities. Both are replaced by RISC-V: the six instruction formats, the five classic stages, and the machine-mode trap mechanism (mtvec, mepc, mcause, mstatus, mret). A comparison slide keeps the 68000 as the historical counterpart.",
  slides: [
    O("What you will be able to do by the end", [
      "Describe an instruction as an operation code and its operands, and name the kinds of operand",
      "Decode a RISC-V instruction by hand, recognising its format and fields",
      "Follow an instruction through the processor cycle: fetch, decode, execute, memory, write back",
      "Explain what a pipeline is and why it makes a processor faster",
      "Define interrupts, exceptions and traps, and list their causes",
      "Describe what RISC-V does when a trap occurs and how the interrupted program resumes",
    ]),

    H("Warm-up on the machine", "What the processor actually reads."),
    K("Four words in memory", `address     machine code     what you wrote

0x000       0x0002A303       lw   t1, 0(t0)
0x004       0x00130313       addi t1, t1, 1
0x008       0x0062A023       sw   t1, 0(t0)
0x00C       0x00008067       ret`, [
      "This is first_update of Lecture 02 as it sits in memory: four numbers, four addresses apart",
      "How does the processor know that the first is a load and the second an addition?",
      "Which steps does it take for each of them?",
      "And while it runs them, how does it notice that a button was pressed or a timer expired?",
    ], "The la that precedes these instructions is omitted, and the encodings are the uncompressed 32-bit ones: with the C extension the assembler may choose 16-bit forms for some of them. Addresses are relative to the start of the function.", "txt"),

    H("Instructions", "An operation code and its operands."),
    T("What an instruction is made of", [
      ["Typical instructions of a processor", ["data transfers between memory and registers", "arithmetic and logic operations", "instructions for the control of flow", "data transfers to and from input/output"]],
      "An instruction is composed of an operation code, the opcode, and zero or more operands",
      ["Kinds of operand", ["a constant: an immediate, explicit or implicit", "a memory location", "a register, explicit or implicit (the accumulator)"]],
      "Instructions can have zero, one, two or three operands",
    ], "In RISC-V the fourth family does not exist as such: devices are memory (Lecture 15). add has three operands, all registers; ret has none visible."),
    D("The formats of RISC-V instructions", (s, h) => {
      const fm = [
        ["R: register to register (add, sub, and, sll, ...)", [[7, "funct7"], [5, "rs2"], [5, "rs1"], [3, "funct3"], [5, "rd"], [7, "opcode"]]],
        ["I: immediates and loads (addi, andi, lw, jalr, ...)", [[12, "immediate [11:0]"], [5, "rs1"], [3, "funct3"], [5, "rd"], [7, "opcode"]]],
        ["S: stores (sw, sh, sb); B: branches, with the same shape", [[7, "imm [11:5]"], [5, "rs2"], [5, "rs1"], [3, "funct3"], [5, "imm [4:0]"], [7, "opcode"]]],
        ["U: upper immediates (lui, auipc); J: jumps (jal), with the same shape", [[20, "immediate [31:12]"], [5, "rd"], [7, "opcode"]]],
      ], col = { opcode: P.steel, rd: P.green, rs1: P.teal, rs2: P.teal, funct3: P.violet, funct7: P.violet };
      fm.forEach(([name, fields], i) => {
        const y = h.TOP + 0.05 + i * 1.13;
        h.tx(s, name, { x: h.MX, y: y + (i ? 0.08 : -0.12), w: h.CW, h: 0.3, fontSize: 14, bold: true, color: P.steel });
        h.bits(s, h.MX, y + (i ? 0.45 : 0.5), h.CW, fields.map(([n, v]) => ({ n, value: v, color: col[v] || P.amber })), { h: 0.42, fs: 14, minW: 1.2, index: i === 0 });
      });
      h.tx(s, "Six formats, all of 32 bits. The opcode is always in the same seven bits, and the register numbers rd, rs1 and rs2 are always in the same places: the processor can read them before it even knows which instruction it is.", { x: h.MX, y: 6.1, w: h.CW, h: 0.65, fontSize: 14, valign: "middle" });
    }, "Bits 31 down to 0, left to right (indices shown on the first row). B and J differ from S and U only in how the bits of the immediate are arranged. This regularity is the heart of the RISC idea; the generic 0-, 1-, 2- and 3-operand formats of the original deck are its ancestors."),
    D("Decoding by hand", (s, h) => {
      h.tx(s, "0x006283B3", { x: h.MX, y: h.TOP - 0.1, w: 3.2, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.tx(s, "add t2, t0, t1", { x: 9.0, y: h.TOP - 0.1, w: h.W - h.MX - 9.0, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.green, align: "right", valign: "middle" });
      h.bits(s, h.MX, h.TOP + 0.85, h.CW, [{ n: 7, value: "0000000", label: "funct7\nadd, not sub", color: P.violet }, { n: 5, value: "00110", label: "rs2\nx6 = t1", color: P.teal }, { n: 5, value: "00101", label: "rs1\nx5 = t0", color: P.teal },
        { n: 3, value: "000", label: "funct3\nadd", color: P.violet }, { n: 5, value: "00111", label: "rd\nx7 = t2", color: P.green }, { n: 7, value: "0110011", label: "opcode\nregister-register", color: P.steel }], { h: 0.6, fs: 16, minW: 1.3, labelFs: 13 });
      h.tx(s, "0x0002A303", { x: h.MX, y: h.TOP + 2.6, w: 3.2, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.tx(s, "lw t1, 0(t0)", { x: 9.0, y: h.TOP + 2.6, w: h.W - h.MX - 9.0, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.green, align: "right", valign: "middle" });
      h.bits(s, h.MX, h.TOP + 3.55, h.CW, [{ n: 12, value: "000000000000", label: "immediate\noffset 0", color: P.amber }, { n: 5, value: "00101", label: "rs1\nx5 = t0", color: P.teal },
        { n: 3, value: "010", label: "funct3\na word", color: P.violet }, { n: 5, value: "00110", label: "rd\nx6 = t1", color: P.green }, { n: 7, value: "0000011", label: "opcode\nload", color: P.steel }], { h: 0.6, fs: 16, minW: 1.3, labelFs: 13 });
    }, "Method: write the eight hexadecimal digits in binary, cut off the last seven bits (the opcode), look up the format, then cut the fields. The decoders of Lecture 11 do the same thing in a fraction of a nanosecond."),
    V("Instructions of fixed or of variable length",
      ["Fixed length: word machines", ["All the instructions have the same length in bits", "The next instruction is always at PC plus a constant", "Simple fetch and decode", "RISC processors: RISC-V uses 32 bits", "With the compressed extension, 16 or 32, told apart by the two lowest bits"]],
      ["Variable length: byte machines", ["Instructions may have different lengths", "The length is known only after decoding the first part", "Compact programs, complex decoding", "CISC processors: the MC68000 uses one to five words of 16 bits, Intel x86 one to fifteen bytes"]],
      "Lunghezza fissa (calcolatore a voci) e variabile (calcolatore a byte). The length of the instruction decides by how much the PC advances."),
    G("Addressing modes: where an operand is found", ["Mode", "The operand is", "RISC-V example"], [
      ["immediate", "a constant inside the instruction", "addi t1, t1, 1"],
      ["register", "the content of a register", "add t2, t0, t1"],
      ["base plus displacement", "the memory word at register + constant", "lw t1, 8(sp)"],
      ["PC-relative", "an address at a distance from the instruction itself", "beq t0, t1, loop"],
      ["memory indirect", "the memory word whose address is in memory", "not available: two loads"],
    ], "RISC-V has only the first four. A CISC processor such as the MC68000 has a dozen, including memory-indirect and auto-increment modes. The example of the original deck, R3 := M[M[A]], becomes in RISC-V: lw t0, 0(t1) followed by lw t0, 0(t0). The 'operand assembly' phase of a CISC processor is the price of rich addressing modes.", { widths: [2.8, 5.4, 4], mono: [2] }),

    H("The processor cycle", "The fundamental algorithm of the processor."),
    F("The phases of the cycle", [
      "Fetch|the instruction at the address in the PC is read from memory; the PC advances",
      "Decode|the opcode is recognised; the registers named by the instruction are read",
      "Execute|the ALU computes: a result, an address or a comparison",
      "Memory|loads read the memory, stores write it; the others skip this phase",
      "Write back|the result is written into the destination register",
    ], "After a start-up phase, the bootstrap, the processor repeats this cycle for ever. In processors with rich addressing modes, a phase of operand assembly collects the operands before the execution.",
      "Algoritmo fondamentale del processore: inizializzazione, instruction fetch and decoding, operand assembly, execute. The five-phase version is the classic RISC formulation."),
    G("The fetch phase, transfer by transfer", ["Step", "Register transfer", "Meaning"], [
      ["1", "MA := PC", "the address of the instruction goes to the memory address register"],
      ["2", "read enable; MB := M[MA]", "the memory puts the instruction on the data bus; it is latched in the buffer"],
      ["3", "D := MB", "the instruction is copied into the decoding register"],
      ["4", "PC := PC + 4", "the PC now points to the next instruction"],
    ], "Fase fetch. PC, D, MA and MB are the registers of the reference model of Lecture 18; the transfers travel on the internal bus. In the original deck the machine had 16-bit words and the PC advanced by 2; in RV32 a word is four bytes, so the PC advances by 4 (by 2 after a compressed instruction).", { widths: [0.9, 3.6, 7.7], mono: [1], fs: 19 }),
    G("The rest of the cycle for two instructions", ["Phase", "add t2, t0, t1", "lw t1, 0(t0)"], [
      ["decode", "O1 := R[t0];  O2 := R[t1]", "O1 := R[t0];  O2 := 0  (the immediate)"],
      ["execute", "U := O1 + O2", "U := O1 + O2  (an address)"],
      ["memory", "-", "MA := U;  read enable;  MB := M[MA]"],
      ["write back", "R[t2] := U", "R[t1] := MB"],
    ], "O1, O2 and U are the registers of the ALU. The same adder computes a sum for add and an address for lw: only the control signals differ. A store ends at the memory phase; a branch ends at execute, by choosing the next PC.", { widths: [1.8, 4.8, 5.6], mono: [1, 2], fs: 18, caption: "The same ALU adds two registers for add and forms an address for lw. The control unit, by decoding the opcode, decides which transfers happen." }),
    D("The pipeline", (s, h) => {
      const st = ["IF", "ID", "EX", "MEM", "WB"], cc = [P.tealSoft, P.amberSoft, P.violetSoft, P.greenSoft, P.redSoft], hi = {}, body = [];
      for (let i = 0; i < 4; i++) { const r = [`instruction ${i + 1}`]; for (let c = 0; c < 8; c++) { const k = c - i; r.push(k >= 0 && k < 5 ? st[k] : ""); if (k >= 0 && k < 5) hi[`${i},${c + 1}`] = cc[k]; } body.push(r); }
      h.table(s, h.MX, h.TOP, [2.3, ...Array(8).fill((h.CW - 2.3) / 8)], ["clock cycle", "1", "2", "3", "4", "5", "6", "7", "8"], body, { fs: 15, mono: [1, 2, 3, 4, 5, 6, 7, 8], align: "center", rowH: 0.42, cellHi: hi });
      h.rows(s, [
        "Five phases, five pieces of hardware: while one instruction executes, the next is decoded and a third is fetched",
        "Each instruction still takes five cycles, but one completes at every clock cycle: five times the throughput",
        "Superscalar processors put two or more pipelines side by side: more than one instruction per cycle",
        "The main core of the ESP32-C6 has a four-stage pipeline",
      ], h.MX, 3.9, h.CW, 2.85);
    }, "Source slide: «Esempio di pipeline lineare a 5 stadi; superscalarità». IF instruction fetch, ID decode, EX execute, MEM memory, WB write back. Branches and dependences between neighbouring instructions complicate the picture (hazards): the subject of an advanced course."),

    H("Interrupts", "When the cycle must be broken."),
    T("The problem with the simple cycle", [
      "If the processor only ever did fetch, decode, execute, some problems would arise",
      "Interaction with the outside world through the I/O units would be inefficient: the program would have to keep asking",
      "There would be no way to forcibly remove an application that enters an infinite loop by mistake",
      "The operating system would have limited control over the system",
    ], "Source slide: «Ciclo del processore semplificato»: bootstrap, fetch, operand assembly, execute.", { big: "j loop", label: "a program stuck in an endless loop: who takes the processor away from it?" }),
    DEF("Interrupts", "Definition", "Exceptional events, usually asynchronous with respect to the execution of the program in progress, that require the attention of the processor.", [
      "RISC-V vocabulary: an interrupt comes from outside the program, at any moment: a timer, a device",
      "An exception is caused by the instruction being executed: an illegal opcode, a forbidden address",
      "A trap is the transfer of control to a handler that follows either of them",
    ], "Interrupt o interruzioni. Older processors and the original deck call 'traps' the synchronous events and use 'interrupt' for everything; the RISC-V specification uses the three words precisely."),
    D("The real processor cycle", (s, h) => {
      const y = h.TOP + 0.5, bw = 2.0, xs = [h.MX + 0.2, 3.4, 6.0];
      box15(s, h, "bootstrap", xs[0], y, bw, 0.8, P.steel, 15); box15(s, h, "fetch", xs[1], y, bw, 0.8, P.teal, 15); box15(s, h, "decode and\nexecute", xs[2], y, bw, 0.8, P.amber, 15);
      h.arrow(s, xs[0] + bw + 0.03, y + 0.4, xs[1] - 0.03, y + 0.4, P.mute, 2.5); h.arrow(s, xs[1] + bw + 0.03, y + 0.4, xs[2] - 0.03, y + 0.4, P.mute, 2.5);
      box15(s, h, "interrupt\npending?", xs[2], y + 1.8, bw, 0.9, P.red, 15); h.arrow(s, xs[2] + bw / 2, y + 0.83, xs[2] + bw / 2, y + 1.77, P.mute, 2.5);
      h.line(s, xs[2] - 0.03, y + 2.25, xs[1] + bw / 2, y + 2.25, P.mute, 2.5); h.arrow(s, xs[1] + bw / 2, y + 2.25, xs[1] + bw / 2, y + 0.83, P.mute, 2.5); h.tx(s, "no", { x: xs[1] + bw / 2 + 0.5, y: y + 1.9, w: 0.6, h: 0.3, fontSize: 14, bold: true, color: P.mute });
      box15(s, h, "trap: go to\nthe handler", xs[2], y + 3.6, bw, 0.9, P.violet, 15); h.arrow(s, xs[2] + bw / 2, y + 2.73, xs[2] + bw / 2, y + 3.57, P.red, 2.5); h.tx(s, "yes", { x: xs[2] + bw / 2 + 0.1, y: y + 2.95, w: 0.7, h: 0.3, fontSize: 14, bold: true, color: P.red });
      h.line(s, xs[2] - 0.03, y + 4.05, xs[0] + bw / 2 + 1.2, y + 4.05, P.mute, 2.5); h.line(s, xs[0] + bw / 2 + 1.2, y + 4.05, xs[0] + bw / 2 + 1.2, y + 1.3, P.mute, 2.5); h.line(s, xs[0] + bw / 2 + 1.2, y + 1.3, xs[1] + 0.5, y + 1.3, P.mute, 2.5); h.arrow(s, xs[1] + 0.5, y + 1.3, xs[1] + 0.5, y + 0.83, P.mute, 2.5);
      h.rows(s, [
        "At the end of each instruction the processor checks whether any interrupt signal has occurred",
        "If there is none, the processing returns to the fetch phase",
        "If there is one, the processor passes to the supervisor state and starts executing a routine of the system",
        "When the routine ends, the suspended program can resume as if nothing had happened",
      ], 8.6, h.TOP, h.W - h.MX - 8.6, h.BOT - h.TOP);
    }, "Ciclo del processore reale. In RISC-V 'supervisor state' is machine mode, and the first instruction fetched after the trap is the one at the address in mtvec."),
    C("Possible causes of interruption", [
      ["Periodic interrupt", "A timer, for example every 10 ms: to share the processor among programs and to measure the time each one uses."],
      ["I/O interrupt", "A peripheral reports its state, for example that it is ready to receive data, to synchronise with the processor."],
      ["Errors in the program", "An instruction that does not exist or is privileged, a forbidden address: synchronous events, called exceptions."],
      ["Faults", "Failures of the system detected by dedicated probes: power, temperature, memory errors."],
      ["Reset", "Brings the whole system back to a known state."],
      ["Software interrupt", "Generated by a program that needs a shared resource and asks the operating system to mediate: in RISC-V, the instruction ecall."],
    ], "The original deck lists arithmetic overflow among the program errors: in RISC-V integer overflow does not raise an exception (Lecture 05). ecall, environment call, is synchronous with the program that executes it."),
    O("Handling an interrupt", [
      "Save the context, hardware part: at least the address at which to resume",
      "Identify the cause of the interrupt",
      "Jump to the entry point of the interrupt service routine (ISR)",
      "Save the context, software part: the registers the routine is going to use",
      "Serve the interrupt",
      "If the interrupt allows it: restore the context, and resume the suspended program from the instruction that follows the last one executed",
    ], "Gestione delle interruzioni. The state to save and restore: PC, status, and the registers. Saving can be done partly or wholly in hardware or in software; RISC-V does the minimum in hardware. With several devices the processor must identify who interrupted and, for simultaneous requests, apply a priority."),
    V("Who interrupted? Two solutions",
      ["Status registers and polling", ["Each device has a status register", "A device that requests an interrupt sets a bit there and raises the common request line", "The service routine interrogates the devices in order of priority and serves the first one it finds with its bit high", "Simple to build, but it takes time: it also interrogates devices that asked for nothing"]],
      ["Vectored interrupts", ["At the moment of the request the identity of the source is supplied to the processor", "The processor jumps directly to the routine that corresponds to that identity", "A very efficient mechanism", "The number of bits used for the vector limits the number of different sources that can be recognised"]],
      "Interrogazione ciclica and interrupt vettorizzati. Interrupt latency: the delay between the instant the request line goes high and the instant the service routine starts doing useful work; it includes finishing the current instruction, the check, the switch."),

    H("The RISC-V solution", "Four registers and one instruction."),
    G("The registers of the trap mechanism", ["CSR", "Written by", "Content"], [
      ["mtvec", "the firmware, once, at start-up", "the address of the trap handler, and whether the vectored mode is used"],
      ["mstatus", "hardware and firmware", "MIE, the global interrupt enable, and MPIE, its previous value"],
      ["mie", "the firmware", "one enable bit for each source: software, timer, external"],
      ["mip", "the hardware", "one pending bit for each source"],
      ["mepc", "the hardware, at each trap", "the address of the interrupted instruction"],
      ["mcause", "the hardware, at each trap", "one bit that says interrupt or exception, and a code for the cause"],
    ], "Machine-mode control and status registers (Lecture 18). An interrupt is taken only if its bit is set in both mip and mie and MIE is 1.", { widths: [1.6, 4, 6.6], mono: [0] }),
    O("What the hardware does on a trap", [
      "mepc := the address of the interrupted instruction",
      "mcause := the cause: top bit 1 for an interrupt, 0 for an exception, plus a code",
      "mstatus: MPIE := MIE, then MIE := 0, so that further interrupts are disabled",
      "the processor passes to machine mode",
      "PC := the address in mtvec, or, in vectored mode and for interrupts, that address plus 4 times the cause",
      "mret, at the end of the handler, undoes it: MIE := MPIE and PC := mepc",
    ], "Nothing is pushed on a stack by the hardware: saving the general registers is left to the handler. This is the 'hardware context save' of the general scheme, reduced to two registers and one bit."),
    G("The cause of a trap: mcause", ["Kind", "Code", "Cause"], [
      ["interrupt", "3", "machine software interrupt"],
      ["interrupt", "7", "machine timer interrupt"],
      ["interrupt", "11", "machine external interrupt: a device, through the interrupt controller"],
      ["exception", "2", "illegal instruction"],
      ["exception", "3", "breakpoint (ebreak): how a debugger stops a program"],
      ["exception", "5, 7", "load or store access fault: a forbidden address"],
      ["exception", "8, 11", "environment call (ecall) from user mode, from machine mode"],
    ], "The standard codes of the privileged specification; chips add their own. The same code 3 means different things for interrupts and exceptions: the top bit of mcause distinguishes them. With mtvec in vectored mode, a timer interrupt enters at base + 4 x 7.", { widths: [2, 1.6, 8.6], hi: { 0: P.tealSoft, 1: P.tealSoft, 2: P.tealSoft } }),
    K("A trap handler, in outline", `trap_entry:
    addi sp, sp, -16
    sw   t0, 0(sp)            # software context: save what we use
    sw   t1, 4(sp)

    csrr t0, mcause           # why are we here?
    bgez t0, exception        # top bit 0: an exception
    ...                       # top bit 1: find the device, serve it

    lw   t0, 0(sp)            # restore the context
    lw   t1, 4(sp)
    addi sp, sp, 16
    mret                      # MIE := MPIE, PC := mepc`, [
      "The interrupted program must not notice: every register the handler touches is saved and restored",
      "mcause read as a signed number is negative for interrupts: bgez separates the two families",
      "mret is the only way back: it re-enables interrupts and reloads the PC in one step",
      "The firmware of the kit contains exactly such a routine; your cartridge is interrupted many times per frame",
    ], "An outline, not the PRG32 source: a real handler saves all the caller-saved registers, usually on a separate stack reached through mscratch. csrr t0, mcause is the pseudo-instruction for csrrs t0, mcause, zero."),
    G("Priorities and nesting", ["", "Motorola MC68000", "RISC-V"], [
      ["priority of a request", "three lines encode an interrupt priority level, 1 to 7", "the interrupt controller gives each source a priority"],
      ["priority of the processor", "three bits in the status register: the mask", "a threshold register in the interrupt controller"],
      ["a request is accepted if", "its level is higher than the mask", "its priority is higher than the threshold, and it is enabled"],
      ["while serving it", "the mask is raised to that level", "interrupts are disabled (MIE = 0) unless the handler re-enables them"],
      ["cannot be masked", "level 7", "a non-maskable interrupt, defined by each chip"],
      ["identity of the source", "an 8-bit vector number from the device: 256 vectors", "mcause, then the controller says which device"],
      ["return", "RTE, which pops PC and status from the stack", "mret, which uses mepc and mstatus"],
    ], "To handle nested interrupts a priority level is established: while a service routine runs, only requests from devices of higher priority are accepted; a request from a high-priority device, such as the clock, must be accepted even while a lower-priority one is being served. This slide replaces the three slides 'Gestione delle priorità nel 68000'. The RISC-V column describes the platform-level interrupt controller; on Espressif chips priorities go from 1 to 15.", { widths: [2.4, 4.6, 5.2], fs: 15 }),
    T("Interrupts on the PRG32 kit", [
      "A timer interrupts the processor a hundred times per second: the firmware uses it to keep time and to pace the frames",
      "The display and sound peripherals interrupt when a block of data has been sent and the next is wanted",
      "The Wi-Fi radio interrupts when a packet arrives: a cartridge can be uploaded while a game is running",
      "Your init, update and draw are ordinary functions called by the firmware between one interrupt and the next",
      "A cartridge stuck in a loop does not stop the interrupts: PRG32-QT ends the frame with an error; on the board a watchdog reports the stall, and you press reset",
    ], "The three problems of the simple cycle (inefficient I/O, runaway programs, limited control) and their solution, all visible on the kit. Checked against the firmware sources and configuration (not on a physical board): the cartridge runs natively inside the main task, in the same privilege mode as the firmware; FreeRTOS ticks at 100 Hz; the task watchdog (5 s, watching the idle task) only prints a warning on the serial port, because the panic option is off, so a stuck cartridge keeps the cartridge lock and the kit needs a reset. A cartridge that disabled interrupts would instead trip the interrupt watchdog (300 ms), which panics and restarts the chip. Run on PRG32-QT: an endless loop gives 'instruction budget exhausted', a write to mstatus gives 'unsupported CSR'. In PRG32-QT a breakpoint is the exception with code 3.", { img: "menu_main.png", cap: "The PRG32 firmware menu" }),

    Q("In which bits of a RISC-V instruction is the opcode?", ["the seven most significant", "the seven least significant", "bits 14 to 12", "it depends on the format"], 1, "Bits 6 to 0, in every format: the processor always knows where to look first."),
    Q("During the fetch of an RV32 instruction that is not compressed, the PC is increased by:", ["1", "2", "4", "32"], 2, "Addresses count bytes and an instruction is four bytes long."),
    Q("Which register holds the address at which an interrupted RISC-V program will resume?", ["ra", "mtvec", "mepc", "mcause"], 2, "mepc, written by the hardware at the trap and used by mret. mtvec holds the address of the handler."),
    Q("Which of these is an exception rather than an interrupt, in RISC-V terms?", ["a timer expires", "a key is pressed", "an illegal instruction is fetched", "a packet arrives from the network"], 2, "It is caused by the instruction being executed, synchronously; the others come from outside, at any moment."),
    X("Exercises: paper first, then PRG32", [
      "Decode 0x00A28293 and 0x40628333 by hand: format, fields, assembly",
      "Encode sub t0, t1, t2 and sw a0, 8(sp)",
      "Write the register transfers of the whole cycle for sw t1, 0(t0) and for beq t0, t1, target",
      "Draw the pipeline diagram for six instructions on a four-stage pipeline: when does the sixth complete?",
      "In PRG32-QT set a breakpoint in first_update, step, and compare the machine code shown with your decoding of the warm-up",
    ], "On paper: addi t0, t0, 10 and sub t1, t0, t1. On PRG32-QT: the four words of the warm-up, or their compressed equivalents.",
      "0x00A28293: imm 10, rs1 x5, funct3 000, rd x5, opcode 0010011. 0x40628333: funct7 0100000, rs2 x6, rs1 x5, funct3 000, rd x6, opcode 0110011. sub t0, t1, t2 = 0x407302B3. sw a0, 8(sp) = 0x00A12423. Six instructions on four stages complete at cycle 9."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["operation code (opcode)", "codice operativo", "interrupt", "interruzione"],
      ["operand", "operando", "exception / trap", "eccezione / trap"],
      ["addressing mode", "modo di indirizzamento", "interrupt service routine", "routine di servizio dell'interruzione"],
      ["fetch / decode / execute", "prelievo / decodifica / esecuzione", "interrupt latency", "latenza di interruzione"],
      ["pipeline stage", "stadio della pipeline", "to mask an interrupt", "mascherare un'interruzione"],
      ["context", "contesto", "nesting", "annidamento"],
    ], null, { widths: [3, 3.3, 3, 3.5] }),
    T("Conclusions and reading", [
      "An instruction is an operation code and zero, one or more operands; in RISC-V it is always 32 bits, in six regular formats",
      "The length of the instructions, fixed or variable, determines how the PC behaves",
      "The processor has a cycle: it fetches an instruction, decodes it, executes it, and writes the result",
      "Exceptional events break the cycle: the processor saves where it was, serves the event and resumes",
      "Interrupts can be enabled, masked and ordered by priority; RISC-V does it with a handful of registers and the instruction mret",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, sections 2.5, 4.1-4.6 and 4.10", "The RISC-V Instruction Set Manual, volume II: Privileged Architecture", "Playing with RISC-V, chapter 4: PRG32-QT and its debugger"]],
    ], "The original conclusions stated that 'the interrupt is a non-maskable signal': most interrupts can be masked; only a few cannot. Next lecture: buses and the video card."),
  ],
});
