// Lecture 15 - Memory.
// Source: 14-Architettura_dei_Calcolatori-Memoria.pptx (translated, figures redrawn; RISC-V replaces the MC68000 as reference).
const box10 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "15", file: "15-Computer_Architecture-Memory",
  title: "Memory", short: "Memory",
  sub: "From magnetic cores to RAM: words, addresses, byte order and the dialogue between processor and memory",
  quote: ["...computers and the programs will start thinking and the people will stop.", "Dr. Walter Gibbs, Tron, Steven Lisberger, 1982"],
  cover: "prg32qt_debugger.png",
  notes: "Spiral: lw and lbu on the same word show byte addresses and byte order on a real RISC-V machine; the lecture then explains what a memory is, how it is organised and how the processor talks to it. The original deck used the MC68000 (big-endian, no misaligned words) as its example: RISC-V takes its place.",
  slides: [
    O("What you will be able to do by the end", [
      "Classify memories: volatile or persistent, on-line or off-line, and place them in the memory hierarchy",
      "Describe how SRAM and DRAM store a bit, and why they are used for different jobs",
      "Explain what words, addresses and byte-addressable memory are",
      "Tell little-endian from big-endian order, and say which one RISC-V uses",
      "Describe step by step how the processor reads and writes a word",
      "Explain memory-mapped input/output and what DMA is for",
    ]),

    H("Warm-up on the machine", "One word, four addresses."),
    K("Read the same memory as a word and as bytes", `    la   t0, value
    lw   t1, 0(t0)       # the whole word        t1 = 0x12345678
    lbu  t2, 0(t0)       # the byte at address A     t2 = 0x78
    lbu  t3, 1(t0)       # the byte at address A+1   t3 = 0x56
    lbu  t4, 3(t0)       # the byte at address A+3   t4 = 0x12

.section .data
value: .word 0x12345678`, [
      "A word of thirty-two bits occupies four consecutive addresses: memory is addressed byte by byte",
      "The byte at the lowest address is 0x78, the least significant: little-endian order",
      "lw fetches four bytes in one operation; lbu fetches one",
      "What is a memory made of, and what happens between the processor and the memory when lw runs?",
    ], "Run it in PRG32-QT and open the memory view at the address in t0: the bytes appear as 78 56 34 12. The byte-order slide of Lecture 04 becomes an experiment."),

    H("What is a memory?"),
    DEF("Memory", "Definition", "The memory is the element of a computer, or of one of its subsystems, dedicated to the persistence of data and of the instructions of programs.", [
      "Memories are the components of a computer able to store information: data, programs and results",
      "Volatile: the information is kept only as long as the computer is powered",
      "Persistent: the information is kept even when the computer is switched off",
      "On-line: the data are always accessible. Off-line: the medium must be mounted before the data can be reached",
    ]),
    D("The memory hierarchy", (s, h) => {
      const lv = [["registers", "inside the processor", P.red], ["cache", "SRAM, on the processor chip", P.amber], ["main memory", "DRAM", P.teal], ["solid-state and magnetic disks", "persistent, on-line", P.steel], ["tapes and removable media", "persistent, off-line", P.violet]];
      const cx = 3.9, y0 = h.TOP + 0.05, bh = 0.86;
      lv.forEach(([n, d, c], i) => { const w = 2.2 + i * 1.05;
        s.addText([{ text: n, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x: cx - w / 2, y: y0 + i * (bh + 0.12), w, h: bh, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 2 }); });
      h.arrow(s, 7.3, y0 + 4.7, 7.3, y0 + 0.1, P.mute, 2.5); h.tx(s, "faster,\nmore expensive\nper bit", { x: 7.45, y: y0 + 0.05, w: 1.6, h: 0.9, fontSize: 12.5, italic: true, color: P.mute });
      h.tx(s, "larger,\ncheaper\nper bit", { x: 7.45, y: y0 + 3.9, w: 1.6, h: 0.9, fontSize: 12.5, italic: true, color: P.mute });
      h.rows(s, [
        "For the same size, cost decreases from top to bottom",
        "Performance increases from bottom to top",
        "The upper levels are volatile; the lower ones are persistent",
        "No single technology is fast, large and cheap at once: a computer combines several",
      ], 9.2, h.TOP, h.W - h.MX - 9.2, h.BOT - h.TOP);
    }, "Tipologie di memoria. Typical access times: registers and cache below a nanosecond to a few nanoseconds; DRAM tens of nanoseconds; SSD tens of microseconds; magnetic disks milliseconds; tape seconds to minutes."),

    H("A little history", "Rings of ferrite."),
    T("Magnetic-core memory", [
      "Small magnetic rings of ceramic store the digital information: a bit is the direction of the magnetic field of a ring",
      "A static memory: it keeps its contents without power",
      "Used in the first computers, before semiconductor memories became widespread",
      "First research by An Wang and Way-Dong Woo at Harvard, 1949",
      "Jay Forrester at MIT, early 1950s: the Whirlwind computer, a flight simulator",
    ], "Memorie a nuclei di ferrite. Wang's pulse transfer controlling device used a magnetic field to control an electromechanical system.", { img: "core_memory.jpg", cap: "Ferrite cores threaded by the X, Y and sense wires" }),
    V("Reading and writing a core",
      ["Reading is destructive", ["Two address lines, X and Y, select one core", "The selected bit is set to 0", "If it contained 1, a pulse appears on the sense line; otherwise nothing", "Wang's solution: every read is followed by a write that stores the datum again"]],
      ["Writing", ["All the bits start at 0", "X and Y select the core, which is set to 1", "If the bit must be 0, the inhibit line prevents the change", "Forrester's contribution: fewer connections to manage a large number of cores"]],
      "Sense and inhibit share one wire (S|I). Destructive read followed by rewrite returns today in DRAM."),

    H("Memory today"),
    V("SRAM and DRAM",
      ["SRAM: static RAM", ["Each bit is held by a bistable circuit, as in a D flip-flop", "The cells are arranged in a matrix and reached by row and column", "Keeps its contents as long as it is powered", "Fast and expensive: used for cache memories", "The main memory of a microcontroller such as the ESP32-C6 is SRAM"]],
      ["DRAM: dynamic RAM", ["Each bit is a charge in a tiny capacitor, behind one transistor", "The capacitor discharges: the contents must be refreshed periodically, by a circuit inside the memory", "Cheap and dense: used for the main memory of laptops, phones and servers", "SDRAM: synchronous DRAM, whose access is governed by a clock"]],
      "DDR4 and DDR5 are generations of SDRAM. The ESP32-C6 has 512 KB of SRAM and no DRAM at all."),
    T("Other memories", [
      "FeRAM, ferroelectric RAM: keeps its state without power",
      "Flash: persistent, erased in blocks; the memory of USB keys, phones and solid-state disks",
      "The program of a microcontroller lives in flash and its variables in SRAM",
      ["Memory modules through the years", ["SIMM, SDRAM PC100 and PC133, Rambus, DDR: tens to hundreds of megabytes each", "today: DDR5 modules of 16 to 64 GB"]],
    ], "The module pictures of the original deck (SIMM EDO, SDRAM PC100 32 MB, PC133 64 MB, Rambus PC800 128 MB, DDR PC2100, ECC registered 256 MB) are summarised here. Flash and solid-state disks are treated in the next lecture.", { img: "ram_modules.jpg", cap: "Memory modules of different generations" }),
    T("How to recognise the memory", [
      "On a desktop or server motherboard: rows of long slots next to the processor, holding the modules",
      "On a laptop or a phone: chips soldered close to the processor",
      "On the PRG32 kit: nothing to see. The SRAM is inside the ESP32-C6 itself, and the flash is a small chip beside it",
      ["Two characteristic parameters", ["size: the number of cells, today gigabytes on a PC and kilobytes on a microcontroller", "access time: the delay after which the datum is available, tens of nanoseconds for DRAM"]],
    ], "1 ns = 10^-9 s. At 160 MHz one clock period of the ESP32-C6 is 6.25 ns.", { img: "ram_on_board.jpg", cap: "Memory modules in their slots" }),

    H("The main memory", "An array of words with addresses."),
    T("Words and addresses", [
      "The main memory is an array of words; a word is a string of m bits",
      "The processor accesses the m bits of a word with a single read or write operation",
      "Each word is identified by an address: an integer between 0 and N - 1, represented on n bits, with N = 2^n",
      "Random access memory, RAM: the access time does not depend on the position of the datum",
      "Word processors access memory with a parallelism equal to the word length: 16, 32 or 64 bits",
    ], "Thirty-two address bits give 2^32 addresses: 4 GiB. The decoder of Lecture 11 and the small memory of Lecture 14, scaled up.", { big: "N = 2^n", label: "n address bits select one of N locations: the address is a code word, the memory decodes it" }),
    D("Byte-addressable memory", (s, h) => {
      const cw = 1.15, x = 3.4, y = h.TOP + 0.75;
      h.tx(s, "address", { x: h.MX, y: y - 0.3, w: x - h.MX - 0.2, h: 0.3, fontSize: 13, color: P.mute, align: "right" });
      h.mem(s, x, y, cw, ["78", "56", "34", "12", "48", "45", "4C", "..."].map((v, i) => ({ val: v, addr: i < 7 ? `A+${i}` : "", color: i < 4 ? P.teal : i < 7 ? P.amber : undefined })), { h: 0.8, fs: 22 });
      h.tx(s, "one word: .word 0x12345678", { x, y: y + 0.9, w: 4 * cw, h: 0.35, fontSize: 14, bold: true, color: P.teal, align: "center" });
      h.tx(s, 'three bytes: "HEL..."', { x: x + 4 * cw, y: y + 0.9, w: 3 * cw, h: 0.35, fontSize: 14, bold: true, color: P.amber, align: "center" });
      h.rows(s, [
        "In a byte-addressable memory the byte is the smallest unit that has an address",
        "A word of 32 bits occupies four consecutive addresses; its address is that of its first byte",
        "Consecutive words are 4 addresses apart: this is why the program counter advances by 4, and why an array index is multiplied by 4 (Lecture 04)",
        "RISC-V has separate instructions for each size: lb and sb for bytes, lh and sh for halfwords, lw and sw for words",
      ], h.MX, 4.0, h.CW, 2.75);
    }, "Each cell is one byte of eight bits, from the most significant (bit 7) to the least significant (bit 0)."),
    D("Big-endian and little-endian", (s, h) => {
      const cw = 1.4, x = 5.2, cols = [P.teal, P.amber, P.violet, P.green];
      h.tx(s, "the word 0x10A3E6FF stored at address 1000", { x: h.MX, y: h.TOP - 0.1, w: h.CW, h: 0.45, fontSize: 20, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.tx(s, "little-endian\nRISC-V, x86, ARM", { x: h.MX, y: h.TOP + 0.95, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 0.95, cw, ["FF", "E6", "A3", "10"].map((v, i) => ({ val: v, addr: 1000 + i, color: cols[3 - i] })), { h: 0.8, fs: 24 });
      h.tx(s, "big-endian\nMotorola 68000, network order", { x: h.MX, y: h.TOP + 2.4, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 2.4, cw, ["10", "A3", "E6", "FF"].map((v, i) => ({ val: v, addr: 1000 + i, color: cols[i] })), { h: 0.8, fs: 24 });
      h.rows(s, ["The two names indicate how the bytes of a word are arranged in memory",
        "Little-endian: the least significant byte at the lowest address. Big-endian: the most significant byte first",
        "RISC-V is little-endian, like almost every processor in use today; data that cross a network are still sent big-endian"], h.MX, 4.95, h.CW, 1.8);
    }, "The original deck contrasted the MC68000 (big-endian) with Intel x86 (little-endian); the example values are the same. Also called diretto (little) and inverso (big)."),
    T("Aligned and unaligned words", [
      "A word that starts at an address multiple of its size is aligned on the word boundary: multiples of 4 for 32-bit words",
      "An aligned word is fetched with a single memory access",
      "An unaligned word straddles two memory words: two accesses are needed",
      ["RISC-V: the assembler aligns .word data for you, and instructions must always be aligned", ["a load or store to a misaligned address is, depending on the processor, done more slowly or refused with an exception"]],
      "The directive .balign 4 forces alignment after a string or a byte",
    ], "The original deck: the MC68000 does not allow unaligned words, Intel x86 allows them at the cost of two accesses. The RISC-V specification leaves the choice to the implementation: correct programs keep their data aligned.", { code: ".section .data\nname:  .asciz \"PRG32\"   # 6 bytes\n       .balign 4          # skip 2\nscore: .word 0            # aligned", wide: true, h: 2.4 }),
    T("Parameters of a memory", [
      ["Capacity: the number N of registers and the length in bits of each", ["1 MB = 2^20 registers of 8 bits; 16 kW of 32 bits = 16 x 2^10 registers of 32 bits"]],
      ["Access time: the time to carry out a read or a write", ["the time to select the location, plus the time for the read or write itself"]],
      "The ESP32-C6: 512 KB of SRAM for data, 320 KB of ROM, and an external flash of some megabytes for programs",
      "The PRG32 menu shows what is left for you: about 98 KB of RAM and 509 KB of flash for cartridges",
    ], "Values from the ESP32-C6 datasheet and from the PRG32 setup screen (RAM 98K, CART FLASH 509K, CART RAM 32K). A Commodore 64 had 64 KB in all.", { big: "512 KB", label: "the main memory of the ESP32-C6: eight Commodore 64s, or one thirty-thousandth of a laptop" }),

    H("Processor and memory", "The dialogue behind lw and sw."),
    D("The interface between processor and memory", (s, h) => {
      const y = h.TOP + 0.3;
      h.card(s, h.MX, y - 0.2, 3.9, 4.3); h.tx(s, "Processor", { x: h.MX + 0.2, y: y - 0.1, w: 3, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      box10(s, h, "MA\nmemory address register", h.MX + 0.4, y + 0.5, 3.1, 0.9, P.teal, 14);
      box10(s, h, "MB\nmemory buffer register", h.MX + 0.4, y + 1.75, 3.1, 0.9, P.amber, 14);
      box10(s, h, "control unit", h.MX + 0.4, y + 3.0, 3.1, 0.75, P.steel, 14);
      box10(s, h, "Memory", 8.3, y + 0.3, 2.6, 3.6, P.violet, 20);
      h.arrow(s, h.MX + 3.53, y + 0.95, 8.27, y + 0.95, P.teal, 3); h.tx(s, "address bus", { x: 5.0, y: y + 0.55, w: 3, h: 0.3, fontSize: 14, bold: true, color: P.teal, align: "center" });
      h.arrow(s, h.MX + 3.53, y + 2.2, 8.27, y + 2.2, P.amber, 3); h.arrow(s, 8.27, y + 2.2, h.MX + 3.53, y + 2.2, P.amber, 3); h.tx(s, "data bus", { x: 5.0, y: y + 1.8, w: 3, h: 0.3, fontSize: 14, bold: true, color: P.amber, align: "center" });
      h.arrow(s, h.MX + 3.53, y + 3.25, 8.27, y + 3.25, P.red, 2); h.arrow(s, h.MX + 3.53, y + 3.55, 8.27, y + 3.55, P.red, 2);
      h.tx(s, "read enable (RE)\nwrite enable (WE)", { x: 5.0, y: y + 2.6, w: 3, h: 0.6, fontSize: 13, bold: true, color: P.red, align: "center" });
      h.tx(s, "The address travels one way; the data travel in both directions; the control lines say which operation is requested.", { x: h.MX, y: 6.0, w: 10.4, h: 0.7, fontSize: 15, valign: "middle" });
    }, "MA and MB are internal registers of the textbook processor model (Lecture 18): they are not among the thirty-two registers a RISC-V programmer sees."),
    G("Fetching a word: lw t1, 0(t0)", ["Step", "What happens", "Where"], [
      ["1", "the address, t0 + 0, is computed by the ALU and placed in MA", "processor"],
      ["2", "MA drives the address bus", "address bus"],
      ["3", "the control unit raises read enable", "control lines"],
      ["4", "the memory decodes the address and puts the four bytes of the word on the data bus", "memory, data bus"],
      ["5", "the datum on the data bus is latched in MB", "processor"],
      ["6", "MB is copied into the destination register t1", "processor"],
    ], "A store, sw t1, 0(t0), is symmetrical: address in MA, datum in MB, write enable raised, and the memory latches the datum. The access time is the time between step 2 and step 5.", { widths: [0.9, 8.2, 3.1], caption: "sw is symmetrical: the datum goes into MB, write enable is raised, and the memory stores what it finds on the data bus." }),
    V("Synchronising processor and memory",
      ["Asynchronous technique", ["The processor waits until the memory signals, with an acknowledge line, that the operation is complete", "The processor adapts to the speed of the memory", "More complex, but it makes the design of the memory independent of that of the processor"]],
      ["Synchronous technique", ["One of the control lines carries pulses from a clock of fixed frequency", "A read or a write completes within one clock cycle", "The clock cycle must be sized on the speed of the memory", "Simpler, and the rule inside a single chip such as a microcontroller"]],
      "The read/write operation itself can be coded in different ways, for example a single R/W line qualified by an enable."),

    H("Memory and input/output", "Devices that look like memory."),
    V("Connecting processor, memory and I/O",
      ["Single bus: memory-mapped I/O", ["Memory and I/O devices share the same bus and the same address space", "A device register is read and written like a memory location", "No special instructions are needed", "This is the RISC-V way: there are no input/output instructions at all"]],
      ["Separate buses: isolated I/O", ["Two physical buses, or two address spaces: one for memory, one for I/O", "Dedicated instructions reach the devices", "The Intel x86 family has both: in and out instructions besides memory-mapped devices"]],
      "The I/O subsystem lets the processor interact with input devices (keyboard, mouse), output devices (screen, printer) and input/output devices (mass storage, network cards, serial ports)."),
    G("Where things live on the ESP32-C6 (simplified)", ["Address range begins with", "What is there", "Reached by"], [
      ["0x4000...", "ROM: the code that starts the chip", "instruction fetch"],
      ["0x4080...", "SRAM: 512 KB for data, stack and cartridges loaded in RAM", "lw, sw, instruction fetch"],
      ["0x4200...", "external flash, seen through a cache: firmware and constants", "lw, instruction fetch"],
      ["0x6000...", "peripheral registers: GPIO, SPI, I2S, timers, Wi-Fi", "lw, sw"],
    ], "Simplified from the ESP32-C6 technical reference manual; check the manual before relying on an address. The point for the students: the same thirty-two address lines reach ROM, RAM, flash and every device, and the same lw and sw operate them.", { widths: [3, 6.2, 3], mono: [0], caption: "One address space for everything. Writing a word to a peripheral register with sw is how a RISC-V program lights a pixel or reads a button." }),
    T("The three component buses, and DMA", [
      ["The bus that connects processor, memory and I/O is made of three buses", ["data bus: carries the data", "address bus: carries the address, of memory or of I/O, from or to which the datum is directed", "control lines: read and write enable, acknowledge, ..."]],
      ["DMA, direct memory access", ["where I/O interfaces are physically connected to the memory, blocks of data can go directly between a device and the memory", "the processor starts the transfer and is told when it is over"]],
      "The display of the kit receives each frame this way: the processor does not copy the pixels one by one",
    ], "If several units share the bus and can access the memory directly, a DMA controller arbitrates. On the ESP32-C6 the SPI and I2S peripherals use DMA to stream the frame buffer and the audio samples."),

    Q("A memory has 16 address lines and is byte-addressable. How large is it?", ["16 bytes", "32 KiB", "64 KiB", "16 MiB"], 2, "2^16 = 65,536 locations of one byte: 64 KiB, the address space of a Commodore 64."),
    Q("On RISC-V, value: .word 0xCAFE0001 is at address A. What does lbu t0, 0(t0) read if t0 = A?", ["0xCA", "0xFE", "0x00", "0x01"], 3, "Little-endian: the least significant byte, 0x01, is at the lowest address."),
    Q("Why must DRAM be refreshed?", ["Because its capacitors lose their charge", "Because reading is slow", "Because it is not random access", "Because the clock is too fast"], 0, "Each bit is a charge in a capacitor that leaks away; a circuit inside the memory rewrites every cell periodically."),
    Q("How does a RISC-V program write to an output device?", ["With the out instruction", "With sw to the address of a device register", "With a special register x32", "It cannot: only the firmware can"], 1, "RISC-V has no I/O instructions: devices are memory-mapped and reached with ordinary loads and stores."),
    X("Exercises: paper first, then PRG32", [
      "A memory of 4 KiB words of 16 bits: how many address lines, how many data lines, how many bits in all?",
      "Write the bytes stored, in order of address, by .word 0xDEADBEEF and by .asciz \"Ciao\" on a little-endian machine",
      "List the steps of sw t1, 8(t0) on the processor-memory interface",
      "In PRG32-QT, find your counter variable in the memory view and watch its four bytes change frame by frame",
      "Store a word with sw and read it back with four lbu instructions; rebuild it with shifts and ors and check that it matches",
    ], "On paper: 12 address lines, 16 data lines, 65,536 bits. On PRG32: the lowest byte of the counter changes every frame, the next one every 256 frames.",
      "0xDEADBEEF: EF BE AD DE. \"Ciao\": 43 69 61 6F 00. Exercise 5: slli by 8, 16 and 24, then or."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["main memory", "memoria centrale", "access time", "tempo di accesso"],
      ["volatile / persistent", "volatile / persistente", "aligned word", "parola allineata"],
      ["magnetic core", "nucleo magnetico (di ferrite)", "address / data bus", "bus indirizzi / bus dati"],
      ["refresh", "rinfresco (refresh)", "read / write enable", "abilitazione lettura / scrittura"],
      ["byte order", "ordinamento dei byte", "memory-mapped I/O", "I/O mappato in memoria"],
    ], null, { widths: [3, 3.3, 3.1, 3.4] }),
    T("Conclusions and reading", [
      "Memory is a fundamental component of a computer: a device able to keep the state of data",
      "Different kinds of memory serve different purposes: no technology is fast, large and cheap together",
      "Data are stored as words of bits, each with an address; RISC-V addresses bytes and orders them little-endian",
      "Access happens through selection (address bus), reading or writing (data bus) and control lines",
      "In RISC-V input/output devices are reached exactly like memory",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, sections 2.3 and 5.1-5.2", "Stallings: Computer Organization and Architecture, chapter on internal memory", "ESP32-C6 Technical Reference Manual: system and memory"]],
    ], "Next lecture: permanent memory and the cache."),
  ],
});
