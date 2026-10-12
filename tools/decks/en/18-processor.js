// Lecture 18 - The processor.
// Source: 18-Architettura_dei_Calcolatori-Processore.pptx (translated and reorganised; RISC-V replaces the MC68000 as reference processor).
const box14 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "18", file: "18-Computer_Architecture-Processor",
  title: "The Processor", short: "The processor",
  sub: "Control unit, registers, stack and ALU: the general model, and RISC-V as the reference processor",
  quote: ["One Ring to rule them all...", "J. R. R. Tolkien, The Lord of the Rings, 1954-1955"],
  cover: "prg32qt_debugger.png",
  notes: "The original deck presented a general processor model and ended with the architecture of the Motorola MC68000. Here the general model is kept and RISC-V (RV32IMAC, as on the ESP32-C6 of the PRG32 kit) is the reference: the students have programmed it since the first days, so every abstract element has a name they already know.",
  slides: [
    O("What you will be able to do by the end", [
      "Name the components of a processor: control unit, ALU, registers, links to memory and to input/output",
      "Distinguish internal registers from machine registers, and general registers from special ones",
      "Explain how a stack works and how RISC-V implements push and pop",
      "Compare the accumulator, stack and general-register models on the same computation",
      "Describe RISC-V as a load-store, general-register processor, and read the name RV32IMAC",
      "Map every element of the general model onto the processor of the PRG32 kit",
    ]),

    H("Warm-up on the machine", "One line of a high-level language."),
    K("z = x + y", `    la   t0, x
    lw   t1, 0(t0)       # bring x into a register
    la   t0, y
    lw   t2, 0(t0)       # bring y into a register
    add  t3, t1, t2      # compute, between registers
    la   t0, z
    sw   t3, 0(t0)       # take the result back to memory

.section .data
x: .word 5
y: .word 7
z: .word 0`, [
      "Seven lines for one sum: memory is touched only by lw and sw",
      "The arithmetic happens only between registers",
      "Other processors do the same job with three instructions, or with one",
      "Why is RISC-V made this way? To answer we need a model of the processor",
    ], "The load-modify-store cycle of Lecture 02, now seen as a design choice. Keep the three addresses in mind: the same computation returns in the comparison of the processor models."),

    H("The processor", "What it is made of."),
    T("The computer and its processor", [
      "An electronic computer is a numeric, automatic, stored-program system built with electronic circuits",
      "Three subsystems: processor (CPU), main memory, input/output, connected by buses",
      "The processor can execute only a set of instructions, from some tens to a few hundred, more or less complex",
      "Machine language: the strings of bits that encode the instructions the circuits of a processor can execute",
      ["Instructions request", ["transfers of information, inside the computer and to or from the I/O devices", "arithmetic and logic operations"]],
      "Data and instructions of a program are stored in the main memory",
    ], "RV32I, the base of RISC-V, has about forty instructions; with the M, A and C extensions of the kit, about a hundred encodings. The Motorola 68000 had fifty-six instruction types with many variants each.", { big: "CPU", label: "central processing unit: the one ring that rules memory and input/output" }),
    D("The processor: a reference model", (s, h) => {
      const y = h.TOP + 0.05;
      h.card(s, h.MX, y, 7.3, 4.65); h.tx(s, "CPU", { x: h.MX + 0.15, y: y + 0.05, w: 1, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      box14(s, h, "control\nnetwork", h.MX + 0.3, y + 0.5, 1.7, 1.5, P.steel, 15);
      box14(s, h, "PC", h.MX + 0.3, y + 2.25, 0.8, 0.6, P.red, 15); box14(s, h, "D", h.MX + 1.2, y + 2.25, 0.8, 0.6, P.red, 15);
      ["R0", "R1", ". . .", "Rn-1"].forEach((r, i) => box14(s, h, r, h.MX + 2.5, y + 0.5 + i * 0.6, 1.6, 0.5, P.teal, 14));
      box14(s, h, "O1", h.MX + 4.7, y + 0.5, 1.0, 0.5, P.violet, 14); box14(s, h, "O2", h.MX + 5.9, y + 0.5, 1.0, 0.5, P.violet, 14);
      box14(s, h, "ALU", h.MX + 4.7, y + 1.15, 2.2, 0.9, P.violet, 18); box14(s, h, "U", h.MX + 5.3, y + 2.2, 1.0, 0.5, P.violet, 14);
      h.line(s, h.MX + 0.3, y + 3.15, h.MX + 7.0, y + 3.15, P.amber, 5); h.tx(s, "internal bus", { x: h.MX + 5.3, y: y + 2.8, w: 1.8, h: 0.3, fontSize: 12, bold: true, color: P.amber });
      box14(s, h, "MA", h.MX + 0.5, y + 3.6, 1.0, 0.6, P.green, 15); box14(s, h, "MB", h.MX + 1.7, y + 3.6, 1.0, 0.6, P.green, 15);
      box14(s, h, "RI", h.MX + 4.3, y + 3.6, 1.0, 0.6, P.green, 15); box14(s, h, "RU", h.MX + 5.5, y + 3.6, 1.0, 0.6, P.green, 15);
      h.tx(s, "link to memory", { x: h.MX + 0.4, y: y + 4.25, w: 2.4, h: 0.3, fontSize: 12, italic: true, color: P.mute, align: "center" });
      h.tx(s, "link to input/output", { x: h.MX + 4.1, y: y + 4.25, w: 2.6, h: 0.3, fontSize: 12, italic: true, color: P.mute, align: "center" });
      h.rows(s, [
        ["Control unit", ["program counter (PC): the next instruction", "decoding register (D): the instruction being executed", "the control network that issues the commands"]],
        ["Machine registers R0 ... Rn-1"],
        ["Arithmetic logic unit", ["two operand registers O1 and O2, a result register U"]],
        ["Link to memory", ["memory address (MA) and memory buffer (MB)"]],
        ["Link to input/output", ["I/O buffer registers RI and RU"]],
      ].map((x) => (x.length === 1 ? x[0] : x)), 8.4, h.TOP, h.W - h.MX - 8.4, h.BOT - h.TOP);
    }, "Modello di riferimento. Although based on the same logical scheme, and so made of rather similar components, the processors on the market can be very different from one another."),
    G("The model and RISC-V, side by side", ["Element of the model", "In RISC-V", "Seen by the programmer?"], [
      ["PC, program counter", "pc, 32 bits", "indirectly: branches, jumps and auipc use it"],
      ["D, decoding register", "the instruction register", "no"],
      ["R0 ... Rn-1, machine registers", "x0 ... x31, thirty-two registers of 32 bits", "yes: zero, ra, sp, t0, a0, s0, ..."],
      ["O1, O2, U, registers of the ALU", "the ALU inputs and output", "no"],
      ["MA, MB, link to memory", "the address and data of a load or store", "no"],
      ["RI, RU, link to input/output", "absent: devices are memory-mapped", "-"],
      ["status register with flags", "absent: no condition codes", "-"],
      ["special registers", "the control and status registers (CSR)", "only by privileged software"],
    ], "The two 'absent' rows are deliberate simplifications of RISC-V, explained later in this lecture and in Lecture 15. The MC68000 of the original deck had all the elements of the model: eight data and eight address registers, a status register with condition codes, and separate interrupt circuitry.", { widths: [3.6, 4.6, 4] }),
    T("Internal registers and machine registers", [
      ["Internal registers", ["not directly visible to the programmer, and necessary for the processor to work: PC, MA, MB, D, O1, O2, U, ..."]],
      ["Machine registers", ["they define the programming model; further divided into general registers and special registers"]],
      ["The processor handles three kinds of information: instructions, memory addresses and data", ["the size of MA and PC depends on the size of the addresses", "the size of the ALU registers depends on the size of the data"]],
      "In RV32 all three are 32 bits wide: one size for registers, addresses and instructions",
    ], "Tipi di dato del processore. The '32' of RV32 is the width of the registers; RV64 has 64-bit registers and addresses and the same 32-bit instructions.", { big: "RV32", label: "registers of 32 bits, addresses of 32 bits, instructions of 32 bits" }),
    V("How real processors differ from the model",
      ["In general", ["They may have a different, usually richer, set of general registers", "The machine registers may be specific memory locations", "The I/O section may be missing altogether, and be implemented by dedicated chips", "Very simple arithmetic units can be extended by dedicated chips that improve the ALU"]],
      ["RISC-V on the PRG32 kit", ["Thirty-two general registers, in a bank inside the processor", "No I/O section: peripheral controllers on the same chip, reached as memory", "Optional extensions instead of extra chips: M adds multiply and divide", "No F extension on the ESP32-C6: floating point would be done in software (Lecture 06)"]],
      "Il modello di processore. Historic example of a dedicated arithmetic chip: the 68881 floating-point coprocessor for the 68000 family, the 8087 for the 8086."),
    V("Words or bytes: the length of machine words",
      ["Word processors", ["All the machine words have the same length", "Sized on the longest piece of information", "Awkward with data of intrinsically variable nature", "RISC-V: every instruction is 32 bits (16 in the compressed form)"]],
      ["Character (byte) processors", ["The length of machine words is variable, a multiple of a byte", "Well suited to the treatment of strings", "Intel x86: instructions from 1 to 15 bytes", "MC68000: instructions of one to five 16-bit words"]],
      "Processore a voce o a caratteri. A characteristic parameter of a processor is the number of bits of its registers: the parallelism of internal transfers, 8, 16, 32 or 64 bits."),
    G("User state and supervisor state", ["State", "Who runs in it", "What it may do", "RISC-V name"], [
      ["supervisor", "the operating system", "every instruction of the instruction set", "machine mode (M); supervisor mode (S) where there is a full operating system"],
      ["user", "a user program", "everything except the privileged instructions", "user mode (U)"],
    ], "Stato utente o stato supervisore. RISC-V defines three privilege modes: M, the most privileged and the only mandatory one, runs firmware; S runs the kernel of an operating system such as Linux; U runs applications. The ESP32-C6 implements M and U. Changing mode happens through traps (Lecture 19).", { widths: [1.8, 2.6, 3.6, 4.2], fs: 17, caption: "The processor is in supervisor state when it executes the operating system, in user state when it executes a user program." }),

    H("Registers", "What they are for."),
    T("Kinds of registers", [
      ["A register can be specialised, or do several jobs", ["specialised registers need specialised operation codes for the same operation on different banks", "concentrating several functions gives more internal complexity and more flexibility of use"]],
      ["Machine registers, different in number and often grouped in banks, can be organised", ["as an addressable memory: a bank R, the register Ri", "as autonomous registers, each with its own name"]],
      "RISC-V: one bank of thirty-two registers, addressed by 5 bits inside the instruction; the names t0, a0, sp are only conventions",
    ], "Tipologia dei registri. Special registers are used exclusively by the operating system: addressing aids, interrupt registers, memory limits. General addressable registers were, in some processors, the first locations of memory: the 'page zero' of the 6502."),
    T("The functions of registers", [
      ["Transit of data", ["memory to register, register to register, register to memory: load, move, store"]],
      ["Accumulation of results", ["needed for arithmetic and logic: R := (op) R, or R := R (op) X"]],
      ["Addressing", ["finding the address of an operand: index registers, base registers"]],
      ["Stack pointers", ["managing a stack implemented in memory"]],
      ["Indicators, or flags", ["binary information about events: zero, sign, overflow, carry, illegal addresses or codes", "produced during the execution of an instruction, they can condition the following ones"]],
    ], "Funzione dei registri. In RISC-V the first four functions are all served by the general registers; the fifth does not exist as a register."),
    G("The thirty-two registers of RISC-V", ["Register", "Name", "Function, by convention", "Register", "Name", "Function, by convention"], [
      ["x0", "zero", "always 0", "x8 - x9", "s0 - s1", "saved"],
      ["x1", "ra", "return address", "x10 - x11", "a0 - a1", "arguments, results"],
      ["x2", "sp", "stack pointer", "x12 - x17", "a2 - a7", "arguments"],
      ["x3", "gp", "global pointer", "x18 - x27", "s2 - s11", "saved"],
      ["x4", "tp", "thread pointer", "x28 - x31", "t3 - t6", "temporaries"],
      ["x5 - x7", "t0 - t2", "temporaries", "pc", "-", "program counter (not in the bank)"],
    ], "The hardware treats x1 to x31 identically; only x0 is special. The roles come from the calling convention (Lecture 02). The MC68000 instead separated data registers D0-D7 from address registers A0-A7, with A7 as stack pointer.", { widths: [1.3, 1.3, 3.2, 1.5, 1.4, 3.5], mono: [0, 1, 3, 4], fs: 17 }),
    V("Flags: the status register, and its absence",
      ["Processors with a status register", ["Bit flags accessible from the program", "Z zero, N negative, V overflow, C carry, sometimes parity", "An instruction sets them; a later conditional branch tests them", "MC68000: the condition code register; x86: the flags register"]],
      ["RISC-V: no flags", ["A branch compares two registers and jumps, in one instruction: beq, bne, blt, bge, bltu, bgeu", "slt and sltu write the result of a comparison in a general register", "Carry and overflow are computed when needed (Lecture 05)", "Less hidden state: simpler pipelines, simpler interrupts"]],
      "Registro di stato. The original deck listed Z, N, P (positive), V, C and a parity bit."),
    G("Special registers of RISC-V: the CSRs", ["Register", "Name", "What it holds"], [
      ["mstatus", "machine status", "the global interrupt enable and the previous privilege mode"],
      ["mtvec", "trap vector", "the address of the routine that handles interrupts and exceptions"],
      ["mepc", "exception program counter", "the address of the instruction that was interrupted"],
      ["mcause", "trap cause", "a code that says why the trap happened"],
      ["mie, mip", "interrupt enable, interrupt pending", "one bit per source of interrupt"],
    ], "Control and status registers: a separate bank of up to 4,096 registers, read and written only with the instructions csrrw, csrrs and csrrc, and only by privileged code. They are the 'registers of the interrupts' of the general model, and the subject of Lecture 19.", { widths: [1.8, 3.6, 6.8], mono: [0] }),

    H("The stack", "Last in, first out."),
    T("The stack", [
      "An abstract data structure with two operations: push stores an element as the last of the pile, pop takes the last element away",
      "It works always and only on the top: there is no need to say where to store or to fetch",
      "It is used to set aside the contents of registers that must be freed to carry out a task, and to restore them afterwards: subprograms, interrupts",
      "Implemented with a pointer, in memory or in a dedicated register, that indicates the position of the last element at every instant",
      "Operations on the stack should check for overflow on a push and for an empty stack on a pop",
    ], "LIFO, last in, first out. You have used it since Lecture 02 to save ra.", { big: "LIFO", label: "the last value pushed is the first one popped" }),
    D("Push and pop in RISC-V", (s, h) => {
      const x = h.MX + 1.5, w = 2.4, ch = 0.58, y0 = h.TOP + 0.45, vals = ["(free)", "(free)", "-28", "-17", "739", "43"];
      h.tx(s, "memory", { x, y: h.TOP - 0.02, w, h: 0.3, fontSize: 13, bold: true, color: P.steel, align: "center" });
      h.tx(s, "low addresses", { x: x + w + 0.15, y: y0, w: 1.6, h: ch, fontSize: 11.5, italic: true, color: P.mute, valign: "middle" });
      vals.forEach((v, i) => s.addText(v, { isTextBox: true, shape: h.pres.ShapeType.rect, x, y: y0 + i * ch, w, h: ch, fill: { color: i === 2 ? P.amber : i < 2 ? P.panel : P.tealSoft }, line: { color: P.steel, width: 1 }, color: i === 2 ? P.white : i < 2 ? P.mute : P.ink, bold: true, fontFace: h.MONO, fontSize: 15, align: "center", valign: "middle", margin: 0 }));
      h.tx(s, "bottom of the stack", { x: x + w + 0.15, y: y0 + 5 * ch, w: 2, h: ch, fontSize: 11.5, italic: true, color: P.mute, valign: "middle" });
      h.arrow(s, x - 0.9, y0 + 2.5 * ch, x - 0.05, y0 + 2.5 * ch, P.red, 2.25); h.tx(s, "sp", { x: x - 1.5, y: y0 + 2 * ch, w: 0.55, h: ch, fontSize: 18, bold: true, fontFace: h.MONO, color: P.red, valign: "middle", align: "right" });
      h.tx(s, "sp points to the last occupied location; the stack grows towards low addresses.", { x: h.MX, y: y0 + 6 * ch + 0.15, w: 5.6, h: 0.7, fontSize: 14 });
      h.codeBox(s, "# push t0\naddi sp, sp, -4      # make room\nsw   t0, 0(sp)       # store on top\n\n# pop t0\nlw   t0, 0(sp)       # fetch the top\naddi sp, sp, 4       # release it", 6.6, h.TOP, h.W - h.MX - 6.6, 3.0, "asm", 16);
      h.table(s, 6.6, h.TOP + 3.25, [2.2, 3.93], ["Processor", "Push"], [["RISC-V", "addi sp, sp, -4 and sw: two instructions"], ["MC68000", "MOVE D0, -(SP): a pre-decrement addressing mode"], ["Intel x86", "PUSH: a dedicated instruction"]], { fs: 13.5, mono: [] });
    }, "The values are those drawn in the original deck. RISC-V has no push and pop: a stack frame is allocated once per function, sixteen bytes at a time, and filled with ordinary stores (Lecture 02). The 68000 form MOVE (SP)+, D0 pops with a post-increment."),

    H("Processor models", "Where the operands live."),
    C("Four architectures of the processor", [
      ["General registers", "The processor has a set of registers REG0, REG1, ..., REGN-1 that can be used interchangeably."],
      ["Accumulator", "All arithmetic, logic and comparison instructions have an implicit operand: one special register, the accumulator."],
      ["Stack", "There are neither accumulators nor general registers, only the stack pointer; instructions work on the data on top of the stack."],
      ["Orthogonal", "A single bank of general registers, some of which serve, when needed, as stack pointer or other special registers."],
    ], "Modello a registri generici, ad accumulatore, a stack; architetture ortogonali. The original definition of orthogonal mentions a status register too; RISC-V is orthogonal and has not even that."),
    G("z = x + y in four processors", ["Model", "Example", "Program", "Memory accesses"], [
      ["accumulator", "Motorola 6809, MOS 6502", "LDA x ;  ADD y ;  STA z", "3"],
      ["stack", "Java virtual machine, WebAssembly", "PUSH x ;  PUSH y ;  ADD ;  POP z", "3, plus the stack itself"],
      ["general registers, memory operands", "MC68000, Intel x86", "MOVE x, D0 ;  ADD y, D0 ;  MOVE D0, z", "3"],
      ["general registers, load-store", "RISC-V", "lw t1, x ;  lw t2, y ;  add t3, t1, t2 ;  sw t3, z", "3"],
    ], "The same three accesses to memory everywhere: what changes is how many instructions there are and how complex each one is. In the register-memory model an instruction such as ADD y, D0 reads memory and computes; in the load-store model every instruction does one thing. Stack machines with the stack in memory are generally slower than general-register machines. lw t1, x is a shorthand the assembler accepts for the la and lw pair of the warm-up.", { widths: [2.6, 2.6, 5.9, 1.3], mono: [2], fs: 15 }),
    T("RISC-V: a load-store, general-register processor", [
      "Instructions that work on registers are faster than those that work on memory locations: the most used data are kept in registers",
      "Only loads and stores touch memory; every other instruction works register to register",
      "Three operands: two sources and a destination, so that no value is destroyed unless you want it to be",
      "Each instruction does one simple thing and has a fixed size: easy to decode, easy to execute in a pipeline",
      "This is the meaning of RISC: reduced instruction set computer",
    ], "Register-to-register: [REGX] + [REGY] gives [REGZ]. The memory-to-register and register-to-memory forms of the original deck exist in CISC processors and are exactly what RISC gives up.", { big: "load, compute, store", label: "the rhythm of every RISC-V program, from the first counter to the last game" }),

    H("The ALU and the whole picture"),
    T("The arithmetic logic unit", [
      "It supervises the arithmetic and logic operations between operands",
      "Physically included in the processor in elementary architectures; an independent apparatus in more complex ones",
      "A widespread solution: a reduced arithmetic unit inside the processor, and independent apparatus for more sophisticated operations",
      "Scheme: two input registers O1 and O2 for the operands, an output register U for the result",
      ["The operations depend on the data types and on their representation", ["logical type, strings of characters, pointers, numbers in the various encodings of Lectures 05 and 06"]],
    ], "The ALU of Lecture 11, seen from the processor. In RISC-V the 'independent apparatus' are the extensions: M for multiplication and division, F and D for floating point."),
    D("The architecture of an RV32 processor", (s, h) => {
      const y = h.TOP + 0.9, st = [["PC", "address of the\ninstruction", P.red, 1.3], ["instruction\nmemory", "fetch", P.violet, 1.7], ["decoder and\ncontrol unit", "fields and\ncommands", P.steel, 1.9], ["register file", "x0 - x31\n32 x 32 bits", P.teal, 1.8], ["ALU", "compute, or\nform an address", P.amber, 1.5], ["data\nmemory", "load, store", P.violet, 1.5]];
      let x = h.MX; const g = (h.CW - st.reduce((a, b) => a + b[3], 0)) / 5;
      st.forEach(([t, d, c, w], i) => {
        s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 11.5 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: 1.6, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        if (i < 5) h.arrow(s, x + w + 0.04, y + 0.8, x + w + g - 0.04, y + 0.8, P.mute, 2.5);
        st[i].x = x; x += w + g; });
      const rx = st[3].x + 0.9, ex = st[5].x + 0.75;
      h.line(s, ex, y + 1.63, ex, y + 2.3, P.green, 2.5); h.line(s, ex, y + 2.3, rx, y + 2.3, P.green, 2.5); h.arrow(s, rx, y + 2.3, rx, y + 1.63, P.green, 2.5);
      h.tx(s, "write back: the result returns to the register named by rd", { x: rx, y: y + 2.35, w: ex - rx, h: 0.3, fontSize: 12.5, bold: true, color: P.green, align: "center" });
      const px = st[0].x + 0.65;
      h.arrow(s, px, y - 0.6, px, y - 0.03, P.red, 2.5); h.line(s, px, y - 0.6, st[4].x + 0.75, y - 0.6, P.red, 2.5); h.line(s, st[4].x + 0.75, y - 0.6, st[4].x + 0.75, y - 0.03, P.red, 2.5);
      h.tx(s, "next PC: PC + 4, or the branch target", { x: px + 0.2, y: y - 0.95, w: 6, h: 0.3, fontSize: 12.5, bold: true, color: P.red });
      h.tx(s, "Next to them, out of the main path: the bank of control and status registers, and the trap logic of Lecture 19. Compared with the MC68000 of the original deck there are no separate data and address registers, no condition code register and no effective-address register.", { x: h.MX, y: 5.6, w: h.CW, h: 1.15, fontSize: 14.5, valign: "middle" });
    }, "The classic single-cycle RISC-V datapath of Patterson and Hennessy, reduced to its blocks; instruction memory and data memory are the same address space, drawn twice for clarity. It replaces the slide 'Architettura del processore MC68000'."),
    G("The processor of the PRG32 kit", ["Feature", "ESP32-C6"], [
      ["Instruction set", "RV32IMAC: base integer set, multiply and divide, atomics, compressed instructions"],
      ["Main core", "one 32-bit RISC-V core, up to 160 MHz, four-stage pipeline"],
      ["Second core", "a low-power RISC-V core, up to 20 MHz, for tasks that run while the main core sleeps"],
      ["Privilege modes", "machine and user"],
      ["Floating point", "none: no F or D extension"],
      ["Memory", "512 KB of SRAM, 320 KB of ROM, external flash"],
      ["On the same chip", "Wi-Fi 6, Bluetooth, Thread and Zigbee radios; SPI, I2S, GPIO and timer peripherals"],
    ], "From the Espressif ESP32-C6 datasheet. A complete computer on a chip of a few square millimetres that costs about two euros: processor, memory and input/output are all there, as in the model of the first slides.", { widths: [2.8, 9.4] }),

    Q("Which register of the general model has no counterpart in RISC-V?", ["the program counter", "the status register with the flags", "the stack pointer", "the instruction register"], 1, "RISC-V has no condition codes: branches compare registers directly."),
    Q("In RISC-V, which instructions can read or write the main memory?", ["all of them", "add and sub", "only loads and stores", "only jumps"], 2, "It is a load-store architecture: lw, lh, lb, sw, sh, sb and their unsigned forms."),
    Q("After addi sp, sp, -4 and sw t0, 0(sp), what has happened?", ["t0 was popped from the stack", "t0 was pushed on the stack", "the stack was emptied", "sp was saved in t0"], 1, "The pointer moves down by one word and the value is stored on the new top: a push."),
    Q("In an accumulator machine, the instruction ADD y means:", ["y := y + accumulator", "accumulator := accumulator + [y]", "push y, then add", "y := accumulator"], 1, "The accumulator is the implicit operand and the destination."),
    X("Exercises: paper first, then PRG32", [
      "Write z = (a + b) - (c + d) for an accumulator machine, a stack machine and RISC-V; count instructions and memory accesses",
      "Write push and pop of two registers, t0 and t1, keeping sp a multiple of 16 as the calling convention requires",
      "For each register used in your last PRG32 program, say which function it serves: transit, accumulation, addressing, stack",
      "In PRG32-QT, single-step a call and its return: watch pc, ra and sp, and the word saved on the stack",
      "Find in the datasheet of the processor of your phone or laptop: instruction set, number of cores, clock, privilege levels",
    ], "On PRG32-QT: sp drops by 16 at the prologue and returns at the epilogue; ra holds the address after the call.",
      "Accumulator: LDA a; ADD b; STA tmp; LDA c; ADD d; STA tmp2; LDA tmp; SUB tmp2; STA z. Stack: PUSH a; PUSH b; ADD; PUSH c; PUSH d; ADD; SUB; POP z. RISC-V: four loads, two adds, one sub, one store."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["control unit", "unità di controllo", "accumulator", "accumulatore"],
      ["program counter", "contatore di programma", "stack pointer", "puntatore allo stack"],
      ["machine register", "registro di macchina", "status register, flags", "registro di stato, indicatori"],
      ["general / special register", "registro generico / speciale", "supervisor / user state", "stato supervisore / utente"],
      ["instruction set", "insieme (set) di istruzioni", "privileged instruction", "istruzione privilegiata"],
    ], null, { widths: [3, 3.2, 3.2, 3.4] }),
    T("Conclusions and reading", [
      "The processor commands and controls, relying on the memory and on the input/output systems",
      "Registers are storage locations that may be physically inside or outside the processor",
      "The kinds of registers and the way they are used determine the model of processor: accumulator, stack, general registers",
      "The ALU carries out the operations between operands",
      "RISC-V is a load-store, general-register processor with no flags and no I/O instructions: few elements, each one simple",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, chapters 2 and 4", "The RISC-V Instruction Set Manual, volume I: Unprivileged Architecture", "Stallings: Computer Organization and Architecture, chapters on processor structure and function"]],
    ], "Next lecture: instructions and interrupts."),
  ],
});
