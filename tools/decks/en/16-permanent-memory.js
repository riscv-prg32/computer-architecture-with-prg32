// Lecture 16 - Permanent memory: non-volatile memories, the cache, magnetic, optical and solid-state storage.
// Source: 15-Architettura_dei_Calcolatori-Memoria-Permanente.pptx (translated, updated to solid-state storage, PRG32 links added).
const G11 = require("../../lib/gates");

function diskSvg() {
  const c = 190, R = [170, 140, 110, 80, 50];
  let o = `<circle cx="${c}" cy="${c}" r="178" fill="#2E4A62"/>`;
  R.forEach((r, i) => { o += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${i === 1 ? "#C7791B" : "#CFE3EA"}" stroke-width="${i === 1 ? 5 : 1.5}"/>`; });
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; o += `<line x1="${c + 50 * Math.cos(a)}" y1="${c + 50 * Math.sin(a)}" x2="${c + 170 * Math.cos(a)}" y2="${c + 170 * Math.sin(a)}" stroke="#CFE3EA" stroke-width="1.2"/>`; }
  const arc = (r1, r2, a1, a2, col) => { const p = (r, a) => `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`; return `<path d="M${p(r1, a1)} A${r1},${r1} 0 0 1 ${p(r1, a2)} L${p(r2, a2)} A${r2},${r2} 0 0 0 ${p(r2, a1)} Z" fill="${col}" opacity="0.85"/>`; };
  o += arc(170, 50, -Math.PI / 3, -Math.PI / 6, "#0E7C86") + arc(140, 110, Math.PI / 6, Math.PI / 3, "#B23A48");
  o += `<circle cx="${c}" cy="${c}" r="38" fill="#EEF2F4"/>`;
  o += G11.text(392, 60, "sector", { size: 17, fill: "#0E7C86" }) + G11.text(392, 150, "track", { size: 17, fill: "#C7791B" }) + G11.text(392, 290, "block", { size: 17, fill: "#B23A48" });
  o += `<line x1="388" y1="55" x2="300" y2="85" stroke="#0E7C86" stroke-width="1.5"/><line x1="388" y1="145" x2="328" y2="165" stroke="#C7791B" stroke-width="1.5"/><line x1="388" y1="285" x2="290" y2="262" stroke="#B23A48" stroke-width="1.5"/>`;
  return G11.doc(470, 380, o);
}

const box11 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "16", file: "16-Computer_Architecture-Permanent_Memory",
  title: "Permanent Memory", short: "Permanent memory",
  sub: "Non-volatile memories, the cache, and storage: magnetic, optical and solid-state",
  quote: ["...a datum does not exist unless it has been saved...", "Prof. Almerico Murli, 1990s"],
  cover: "game_platformer.png",
  notes: "Spiral: a cartridge keeps its title string across a power cycle but loses its high score; the lecture explains where each lives, then covers ROM and flash, the cache, and mass storage.",
  slides: [
    O("What you will be able to do by the end", [
      "Name the functional units of a computer and recognise them on a motherboard and on the PRG32 kit",
      "Distinguish ROM, PROM, EPROM, EEPROM and flash, and say what firmware is",
      "Explain why a cache makes a computer faster, and what a cache miss is",
      "Describe tracks, sectors and blocks of a magnetic disk and the components of its access time",
      "Explain how an optical disk stores bits, and how a compact disc is read",
      "Place flash, solid-state disks, hard disks and tapes in a multi-level storage system",
    ]),

    H("Warm-up on the machine", "What survives when the power goes."),
    K("Switch the kit off and on again", `.section .rodata            # part of the cartridge file
title: .asciz "HIGH SCORE"  # stored in flash: it survives

.section .data              # copied into RAM at start
best:  .word 0              # lives in RAM: it is lost

game_update:
    ...
    la   t0, best
    lw   t1, 0(t0)
    ble  a0, t1, 1f         # new score not better: skip
    sw   a0, 0(t0)          # remember the best score ... in RAM
1:  ...`, [
      "After a power cycle the title is still there, but the best score is 0 again",
      "The cartridge is a file in flash memory: non-volatile",
      "The variable lives in SRAM: volatile",
      "To keep a score for ever it must be written to a permanent memory: which ones exist?",
    ], "Written for this lecture. On PRG32 persistent scores are handled by the Cartridge Store service; the point here is where each section of a program lives."),

    H("The components of a computer", "Finding the units on real boards."),
    C("Functional units of a computer", [
      ["Processor", "Executes the instructions. On the kit: the RISC-V core of the ESP32-C6."],
      ["Main memory", "Holds running programs and their data. On the kit: 512 KB of SRAM inside the chip."],
      ["Secondary memory", "Keeps programs and data when the power is off. On the kit: the flash chip that holds firmware and cartridges."],
      ["Input/output devices", "Video card and monitor, keyboard, mouse, printer, storage. On the kit: display, joystick, amplifier."],
      ["Communication lines", "The buses: data and address lines shared by all the units."],
      ["One chip or many", "A PC spreads these units over a motherboard; a microcontroller puts almost all of them in one package."],
    ]),
    T("The motherboard", [
      "Sockets for one or more processors and slots for the memory modules, close to each other",
      "A chipset that connects processor, memory and peripherals",
      "Expansion buses: PCI Express slots for video cards and other boards",
      "Connections for storage (Serial ATA, M.2) and for the outside world (USB, Ethernet, audio)",
      "A flash chip with the firmware that starts the machine",
      "From an architectural point of view a board of 2002 and one of today have much in common",
    ], "Example in the original deck: the ASUS WS C621E SAGE dual-socket workstation board. The annotated pictures of a 2002 board (Italian labels) are not reused.", { img: "workstation_board.jpg", cap: "A dual-processor server motherboard", wide: true }),
    T("Firmware: the BIOS and its heirs", [
      "The BIOS is a program in a non-volatile chip specific to a given motherboard, used by the processor at power-on",
      ["Its instructions and data can be divided into", ["POST, power-on self test: checks that the devices work", "SETUP: configuration of the devices", "BOOT: starts the operating system", "DRIVERS: basic low-level functions for keyboard, disks and other devices"]],
      "Today's PCs use UEFI firmware, which does the same jobs",
      "On the ESP32-C6: a boot program in ROM starts a bootloader in flash, which starts the PRG32 firmware, which loads the cartridge you choose",
    ], "Each stage finds, checks and starts the next: a chain that ends with the first instruction of first_init.", { big: "boot", label: "from the first instruction after reset to your program, through layers of permanent memory" }),

    H("Non-volatile memories", "From ROM to flash."),
    G("From ROM to flash", ["Memory", "Written by", "Erased", "Typical use"], [
      ["ROM", "the manufacturer, once and for all", "never", "start-up code, old game cartridges"],
      ["PROM", "the user, once", "never", "small production runs"],
      ["EPROM", "the user, many times", "all at once, with ultraviolet light through a quartz window (about 15 minutes)", "development, BIOS of early PCs"],
      ["EEPROM", "the user, in place", "electrically, one byte at a time", "configuration data"],
      ["Flash", "the user, in place", "electrically, in blocks", "firmware, USB keys, memory cards, solid-state disks"],
    ], "Read-only memory; programmable ROM; erasable PROM; electrically erasable PROM. Access time of the order of nanoseconds for reading. EEPROM and flash are slower and, per bit, once dearer than RAM; flash is today the cheapest semiconductor memory.", { widths: [1.6, 3.1, 4.2, 3.3] }),
    T("Flash memory", [
      "The most recent kind of EEPROM: it can be reprogrammed in place, without removing it",
      "Erased by blocks of bytes, not one byte at a time: erasing sets all the bits of a block to 1, writing can only turn 1s into 0s",
      "Each block survives a limited number of erase cycles: the controller spreads the writes evenly",
      "Reading is fast; writing and above all erasing are slow",
      "The flash of the kit holds the firmware and your cartridges: uploading a cartridge erases and rewrites some of its blocks",
    ], "This is why the best score of the warm-up is not simply written back into the cartridge at every frame: flash is not a place for variables.", { img: "eprom.jpg", cap: "An EPROM: the quartz window lets ultraviolet light erase the chip" }),

    H("The cache", "A small fast memory in front of a large slow one."),
    T("Why a cache?", [
      "During the clock cycles needed to read or write the memory the processor waits",
      "The slower the memory, the more cycles are lost",
      ["Why not build memories as fast as the registers of the processor?", ["they would have to be on the same chip: a connection through a bus is slower", "they could not be very large, and the chip would grow in size and cost"]],
      "The compromise: a small, fast memory on the processor chip, and one or more larger, slower memories reached through the bus",
    ], "Perché non costruire memorie veloci quanto i registri della CPU?", { big: "wait", label: "what a processor does, for most of its time, when its memory is slower than it is" }),
    D("How a cache works", (s, h) => {
      h.rows(s, [
        "Cache, from the French cacher, to hide: a memory of small capacity but fast, placed between the processor and the RAM",
        "The processor looks in the cache first",
        "Hit: the content of the requested address is there, and arrives at once",
        ["Miss: it is not there, and must be copied from the RAM into the cache", ["a fixed number of neighbouring locations is copied with it, because programs tend to use nearby addresses next"]],
        "The more hits, the shorter the average access time",
      ], h.MX, h.TOP, 7.0, h.BOT - h.TOP);
      const x = 8.6, y = h.TOP + 0.3;
      box11(s, h, "processor", x, y, 3.2, 0.8, P.teal, 16); box11(s, h, "cache\nsmall, fast", x, y + 1.6, 3.2, 1.0, P.amber, 16); box11(s, h, "main memory\nlarge, slow", x, y + 3.4, 3.2, 1.2, P.violet, 16);
      h.arrow(s, x + 1.6, y + 0.83, x + 1.6, y + 1.57, P.mute, 2.5); h.arrow(s, x + 1.6, y + 2.63, x + 1.6, y + 3.37, P.mute, 2.5);
      h.tx(s, "every access", { x: x + 1.75, y: y + 1.0, w: 2, h: 0.3, fontSize: 12.5, italic: true, color: P.mute }); h.tx(s, "only on a miss", { x: x + 1.75, y: y + 2.8, w: 2, h: 0.3, fontSize: 12.5, italic: true, color: P.mute });
    }, "The principle of locality: a program that has just used an address will probably use it again soon (temporal locality) and will probably use its neighbours (spatial locality). Loops and arrays are the reason."),
    G("Cache levels and typical machines", ["", "PC of 2002", "PC of 2020", "ESP32-C6 (the kit)"], [
      ["Processor", "1 core", "4 cores", "1 RISC-V core, 160 MHz"],
      ["Cache L1", "64 KB", "64 KB per core", "none for the SRAM"],
      ["Cache L2", "512 KB", "512 KB per core", "none"],
      ["Cache L3", "none", "8 MB, shared by the cores", "none"],
      ["Main memory", "256 MB", "16 GB", "512 KB of SRAM"],
      ["Storage", "40 GB hard disk", "1 TB + 1 TB, mirrored", "a few MB of flash, read through a small cache"],
    ], "First level (internal): keeps a continuous flow inside the processor. Second level: limits the slowdown due to the main memory. Third level (8 to 32 MB and more): shared by the cores of the same processor. Caches are built with SRAM. On the ESP32-C6 the SRAM is already as fast as the core needs; only the external flash sits behind a cache.", { widths: [2.2, 3, 3.4, 3.6] }),

    H("Secondary memory", "Mass storage."),
    T("Characteristics of secondary memories", [
      "Non-volatile: the data are not lost when the computer is switched off",
      "Large capacity: several orders of magnitude more than the main memory",
      "Low cost per bit: several orders of magnitude less than the main memory",
      "Slower access: some orders of magnitude slower than the main memory",
      "Information is organised in blocks, usually of a kilobyte or more, not in single bytes",
      "Some media allow direct access to any block; others only sequential access",
    ], "The secondary memory stores and keeps all the programs and data of the computer; the main memory holds the programs being executed and the data they need.", { img: "hard_disk.jpg", cap: "An open hard disk: platter, arm and head" }),
    D("Magnetic disks: tracks, sectors, blocks", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.5, h.BOT - h.TOP);
      await h.svg(s, diskSvg(), h.MX + 0.15, h.TOP + 0.3, 5.2, h.BOT - h.TOP - 0.6);
      h.rows(s, [
        "Platters coated with a magnetisable material, kept spinning at constant speed; heads read and write the information",
        "The surface is divided into concentric tracks and into sectors, slices of the disk",
        "A sector cuts each track into blocks: the block is the smallest addressable unit, identified by track number and sector number",
        "Formatting: dividing the surface into tracks and sectors",
        "Direct access: the head can be positioned on any block without passing over all the previous ones",
      ], 6.6, h.TOP, h.W - h.MX - 6.6, h.BOT - h.TOP);
    }, "Dischi magnetici. Several sectors form a cluster; the tracks at the same radius on all the platters form a cylinder. The original picture had Italian labels and is redrawn."),
    T("Access time of a magnetic disk", [
      "To read or write a block the head must be brought to the right address; during the transfer the head is still and the disk moves",
      ["Seek time", ["the time to move the head radially to the right cylinder, and so to the right track"]],
      ["Latency", ["the time to wait for the desired sector to pass under the head"]],
      ["Transfer time", ["the time for the block to pass under the head"]],
      "Hard disks: sealed against dust, capacities of terabytes, access times of milliseconds",
    ], "A millisecond is a million nanoseconds: during one disk access a 160 MHz processor could execute more than a hundred thousand instructions.", { big: "ms", label: "milliseconds: the access time of a hard disk, a million times slower than RAM" }),
    V("Hard disks and solid-state disks",
      ["Hard disk drive (HDD)", ["Magnetic platters and moving heads", "Access time of milliseconds, dominated by mechanics", "The lowest cost per terabyte", "Still the choice for large archives and backups"]],
      ["Solid-state disk (SSD)", ["Flash memory and a controller: no moving parts", "Access time of tens of microseconds", "Connected through SATA or, faster, NVMe on PCI Express", "The standard storage of laptops and phones; the same technology as the flash chip of the kit"]],
      "New with respect to the original deck, which listed SSDs only among the storage levels. The parallel ATA bus of older PCs gave way to Serial ATA and then to NVMe."),

    H("Optical disks", "Bits read with light."),
    T("Optical disks", [
      "A rigid disk on which a laser beam of a few milliwatts is projected; the reflection changes between the pits and the surface, the land",
      ["0 and 1 are not pit and land", ["1 is a change, from pit to land or from land to pit", "0 is no change"]],
      "Usually written once, because the physical changes are irreversible: used to distribute programs and as archives that must not be modified",
      "CD-Recordable: recording burns points in a dye layer; rewritable disks use a material that can change back",
    ], "Encoding a 1 as a transition is a self-clocking idea used in many serial links as well.", { img: "pit_land.jpg", cap: "Pits and lands of a pressed CD-ROM, under an electron microscope" }),
    T("The compact disc", [
      "The information is stored on a single spiral track, with constant recording density",
      "The distance between two successive turns of the spiral, the track pitch, is 1.6 micrometres",
      ["CLV, constant linear velocity", ["the disk turns faster when reading near the centre: from 200 to 500 revolutions per minute"]],
      ["CAV, constant angular velocity", ["constant revolutions; the number of bits per sector is constant, so the outer surface is under-used"]],
      "The speed was set by the bit rate needed to play music",
    ], "1x = 1.2 m/s. CD-Recordable: two layers of polycarbonate enclose a thin reflective sheet covered by a translucent dye.", { img: "cdrom_drive.jpg", cap: "Inside a CD-ROM drive" }),
    G("DVD and CD compared", ["", "DVD", "CD"], [
      ["Disk diameter", "120 mm", "120 mm"],
      ["Disk thickness", "1.2 mm (0.6 mm x 2)", "1.2 mm"],
      ["Surfaces / layers", "1 or 2 / 1 or 2", "1 / 1"],
      ["Minimum pit size", "0.4 micrometres", "0.83 micrometres"],
      ["Track pitch", "0.74 micrometres", "1.6 micrometres"],
      ["Average transfer rate", "4.7 MB/s", "0.15 MB/s"],
      ["Capacity, 1 layer, 1 side", "about 5 GB", "about 0.68 GB"],
      ["Capacity, 2 layers, 2 sides", "17 GB", "-"],
    ], "DVD: digital versatile disk. Smaller pits and a tighter spiral, up to two layers and two sides. DVD-R can be written once; drives can work in CAV or CLV. The original table gave 3.058 micrometres as the CD 'track width'; the standard track pitch of 1.6 is used here, consistently with the previous slide.", { widths: [3.4, 4.4, 4.4] }),

    H("Storage on several levels"),
    F("A multi-level permanent memory", [
      "RAM disk|a piece of main memory used as a disk: fastest, volatile",
      "Solid-state disk|flash: fast, the working storage",
      "Hard disk|magnetic: large and cheap",
      "Disk library|many disks, some switched on only when needed",
      "Tape library|robots that mount tapes: the cheapest per byte, for archives",
    ], "A modern computing system has several levels of permanent memory, often managed automatically: data that are used often migrate towards the fast levels, the rest sinks towards the cheap ones.",
      "The same idea as the cache, applied to storage. The department's HPC storage works this way (visit at the end of the course)."),
    I("Storage at scale", [["storage_racks.jpg", "A tape library in a data centre"], ["ssd.jpg", "A solid-state disk: flash memory in the shape of a disk"], ["dvd_drive.jpg", "Inside a DVD drive"]],
      "Pictures from the original deck.", "From a chip of a few megabytes on the kit to rooms of petabytes: the same hierarchy, at every scale."),

    Q("Which memory can be erased electrically, in blocks, without removing it from the board?", ["ROM", "PROM", "EPROM", "Flash"], 3, "Flash is the block-erasable evolution of EEPROM. EPROM needs ultraviolet light; ROM and PROM cannot be erased."),
    Q("What happens on a cache miss?", ["The program stops with an error", "The datum is fetched from main memory and copied into the cache, with its neighbours", "The cache is erased", "The processor skips the instruction"], 1, "The access is simply slower: the block containing the address is loaded into the cache, betting that nearby addresses will be needed soon."),
    Q("Which component of the access time of a hard disk depends on the rotation speed?", ["Seek time", "Latency", "Formatting time", "Boot time"], 1, "Latency is the wait for the sector to arrive under the head; seek time depends on the movement of the arm."),
    Q("On an optical disk, a 1 is encoded as:", ["a pit", "a land", "a transition between pit and land", "a double pit"], 2, "A change of reflectivity, in either direction, is a 1; no change is a 0."),
    X("Exercises", [
      "A disk turns at 7,200 revolutions per minute: what is its average latency?",
      "A cache answers in 1 ns and the memory in 50 ns: what is the average access time with 95% of hits?",
      "List where each of these lives on the PRG32 kit: the boot code, the firmware, a cartridge, the variable counter, the register t0",
      "Find the specifications of the storage of your laptop or phone: technology, capacity, interface",
      "On PRG32, time two loops that sum a large array: one in order, one jumping by a large step. Is there a difference, and why might there not be on this chip?",
    ], "Latency: half a revolution, about 4.2 ms. Average access time: 0.95 x 1 + 0.05 x 51 = 3.5 ns.",
      "60 / 7200 = 8.33 ms per revolution. Exercise 3: ROM, flash, flash (or RAM once loaded), SRAM, a flip-flop register in the processor. Exercise 5: the SRAM of the ESP32-C6 has no cache in front of it, so the access pattern matters little; on a laptop the difference is large."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["motherboard", "scheda madre", "track / sector / block", "traccia / settore / blocco"],
      ["firmware", "firmware", "seek time", "tempo di posizionamento"],
      ["non-volatile", "non volatile", "latency", "tempo di latenza"],
      ["cache hit / miss", "successo / fallimento di cache", "solid-state disk", "disco a stato solido"],
      ["mass storage", "memoria di massa", "tape library", "libreria a nastri"],
    ], null, { widths: [3, 3.4, 3.2, 3.2] }),
    T("Conclusions and reading", [
      "Non-volatile memories usually hold the basic software of a machine: the firmware",
      "The cache improves performance by keeping a copy of part of the main memory close to the processor",
      "The same idea, a small fast level in front of a large slow one, is used again in storage systems",
      "Permanent memories can be semiconductor (flash), magnetic or optical",
      "A modern system has several levels of permanent memory, often managed automatically",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, sections 5.1-5.4", "Stallings: Computer Organization and Architecture, chapters on cache and external memory", "Tanenbaum, Austin: Structured Computer Organization, chapter 2"]],
    ], "Next: Verm1, part 3: a body, rules and states. Then the processor."),
  ],
});
