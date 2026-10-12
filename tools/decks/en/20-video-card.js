// Lecture 20 - Buses and the video card.
// Source: 16-Architettura_dei_Calcolatori-Scheda-Video.pptx (translated, updated, with the PRG32 display path as the worked example).
const box12 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "20", file: "20-Computer_Architecture-Video_Card",
  title: "Buses and the Video Card", short: "The video card",
  sub: "From a byte in memory to a pixel on the screen; graphics processors and general-purpose computing on them",
  quote: ["...nothing is more serious than gaming...", "attributed to Jean Cocteau (1889-1963)"],
  cover: "game_raycaster.png",
  notes: "Spiral: one call draws one pixel on PRG32; the lecture follows that pixel from the frame buffer to the display, then generalises to buses, video cards, GPUs and GPGPU. The kit has no video card: its processor does everything, which makes every step visible.",
  slides: [
    O("What you will be able to do by the end", [
      "Explain what a peripheral controller is and why devices need synchronisation with the processor",
      "Characterise a bus by width, speed and transfer rate, and list its advantages and limits",
      "Describe the job of a video card: frame buffer, resolution, colour depth, output interface",
      "Compute the memory a frame needs and the time it takes to send it over a bus",
      "Explain what a GPU does and what general-purpose computing on GPUs is",
    ]),

    H("Warm-up on the machine", "The journey of one pixel."),
    K("One pixel, please", `    li   a0, 100             # x
    li   a1, 50              # y
    li   a2, 0xf800          # red, in RGB565
    call prg32_gfx_pixel     # ... where does it go?

# what the runtime does, in principle:
    li   t0, 320
    mul  t1, a1, t0          # y * 320
    add  t1, t1, a0          # + x  =  position in the frame
    la   t2, framebuffer
    add  t2, t2, t1          # ADDRESS of that pixel
    sb   t3, 0(t2)           # store its palette index (one byte)`, [
      "The screen is an array in memory, one element per pixel: the frame buffer",
      "Drawing a pixel is a store instruction at address base + y x 320 + x",
      "Nothing appears until the frame is sent to the display: prg32_gfx_present",
      "On a PC these two jobs, keeping the frame and sending it to the monitor, belong to the video card",
    ], "The second half is a sketch of the principle, not the source of the runtime: t3 stands for the palette index that the runtime derives from the RGB565 colour in a2. On the ESP32-C6 the PRG32 frame buffer is 320 x 200 bytes, one palette index per pixel (docs/hardware/ili9341.md)."),

    H("Peripherals and controllers"),
    T("Input/output devices", [
      "Peripherals are used for the interaction between the user and the system",
      "They have limited autonomy: they are controlled and coordinated by the processor",
      ["They work asynchronously with respect to the processor, so synchronisation mechanisms are needed", ["to know when an input datum will be available", "to know when an output device has finished producing its data"]],
      "The terminal, the most common instrument of interaction, is made of two independent devices: the keyboard and the video",
    ], "Keyboard and video are not directly connected: the processor reproduces on the video what arrives from the keyboard (Lecture 21)."),
    D("Controllers", (s, h) => {
      const y = h.TOP + 0.3;
      box12(s, h, "processor", h.MX + 0.2, y, 2.2, 0.9, P.teal, 16); box12(s, h, "memory", h.MX + 3.0, y, 2.2, 0.9, P.violet, 16);
      h.line(s, h.MX, y + 1.7, 7.3, y + 1.7, P.amber, 6); h.tx(s, "data bus, address bus, control", { x: h.MX, y: y + 1.8, w: 4, h: 0.3, fontSize: 13, bold: true, color: P.amber });
      h.line(s, h.MX + 1.3, y + 0.93, h.MX + 1.3, y + 1.65, P.mute, 2.5); h.line(s, h.MX + 4.1, y + 0.93, h.MX + 4.1, y + 1.65, P.mute, 2.5);
      ["video\ncontroller", "USB\ncontroller", "storage\ncontroller"].forEach((t, i) => { const x = h.MX + 0.2 + i * 2.3;
        box12(s, h, t, x, y + 2.6, 1.9, 0.9, P.steel, 14); h.line(s, x + 0.95, y + 1.75, x + 0.95, y + 2.57, P.mute, 2.5);
        box12(s, h, ["monitor", "keyboard,\nmouse", "disks"][i], x, y + 4.0, 1.9, 0.8, P.green, 14); h.line(s, x + 0.95, y + 3.53, x + 0.95, y + 3.97, P.mute, 2.5); });
      h.rows(s, [
        "Peripherals are interfaced to the processor through dedicated controllers",
        "The controller manages the communication between the device and all the other components, processor included",
        "It presents a few registers on the bus: the processor reads and writes them like memory",
        "Generally a controller signals the end of the operation in progress by raising a signal: an interrupt (Lecture 19)",
        "The video card is the controller of the monitor",
      ], 7.8, h.TOP, h.W - h.MX - 7.8, h.BOT - h.TOP);
    }, "On the ESP32-C6 the controllers (SPI, I2S, GPIO, USB) are on the same chip as the processor, and their registers are memory-mapped (Lecture 15)."),

    H("Buses", "Shared roads, and their traffic limits."),
    T("What characterises a bus", [
      "A bus is a communication channel shared by several units; its characteristics decisively influence the performance of the whole system",
      ["Width", ["the number of bits of the data bus"]],
      ["Speed", ["the working frequency of the bus; the number of bytes per clock cycle"]],
      ["Transfer rate", ["megabytes transmitted per second: a 32-bit bus at 66 MHz carries 264 MB/s"]],
      "A bus is a standard: signals, connectors and a protocol that all the units agree on",
    ], "The example is the PCI bus: 4 bytes x 66 million cycles per second = 264 MB/s. Interface: the hardware module that encodes the data electrically or optically. Protocol: the higher-level description of how the dialogue takes place.", { big: "264 MB/s", label: "32 bits at 66 MHz: width times frequency gives the transfer rate" }),
    V("Buses: advantages and disadvantages",
      ["Advantages", ["New devices can easily be added", "Peripherals can be moved from one computer to another that uses the same bus", "A single set of wires connects several peripherals", "Low cost per byte transmitted"]],
      ["Disadvantages", ["The bandwidth of the bus limits the transfer speed", "The maximum speed depends on the length of the bus", "and on the number of devices connected to it", "A shared resource: only one transfer at a time"]]),
    G("Buses through the years", ["Bus", "Kind", "Used for", "Today"], [
      ["ISA, EISA, VESA", "parallel, 16 to 32 bits", "expansion cards of early PCs", "disused"],
      ["PCI", "parallel, 32 or 64 bits", "expansion cards", "replaced by PCI Express"],
      ["AGP", "parallel, dedicated port", "the video card alone", "replaced by PCI Express"],
      ["PCI Express", "serial, 1 to 16 lanes", "video cards, fast storage", "current: each generation doubles the speed"],
      ["IDE (ATA), SCSI", "parallel", "disks", "replaced by Serial ATA and NVMe"],
      ["USB", "serial", "almost every external device", "current: from 12 Mbit/s to tens of Gbit/s"],
      ["SPI, I2C, I2S", "serial, a few wires", "chips on the same board", "current: the buses of the PRG32 kit"],
    ], "USB: universal serial bus. PCI: peripheral component interconnect. AGP: accelerated graphics port. IDE: integrated device electronics. ISA: industry standard architecture. SCSI: small computer system interface. PCMCIA and FireWire were in the original list. The move from parallel to serial is the lesson of Lecture 14.", { widths: [2.4, 2.8, 3.2, 3.8] }),

    H("The video card", "From a representation in memory to light."),
    T("What a video card does", [
      "Its function: to send to the monitor the information to display",
      "It translates the representation of the image produced by the processor into a format the monitor can show",
      "It contains memory of its own, the video memory, which holds the frame: the frame buffer",
      "Every time the screen must be redrawn, it reads the digital representation of the image and sends the monitor the signal for the colour of each pixel",
      "It has processing capability of its own",
    ], "DAC: digital-to-analogue converter, needed for analogue monitors. On PRG32 the 'video card' is a region of RAM plus the SPI peripheral: no separate hardware at all."),
    V("Analogue and digital monitors",
      ["CRT monitor, analogue input", ["The card converts the digital image into analogue signals", "The conversion is done by a component called RAMDAC", "VGA output (1987): designed for cathode-ray tubes", "Problems: electrical noise, distortion, errors in placing the pixels"]],
      ["LCD monitor, digital input", ["The card adapts colours and resolution of the image", "Provides local memory to use as a buffer", "Supports graphics acceleration, for example 3D", "DVI: each pixel of the output corresponds to one pixel of the screen, at its native resolution"]],
      "RAMDAC: random access memory digital-analog converter. DVI could also carry analogue VGA signals for compatibility."),
    G("Video outputs", ["Interface", "Year", "Signal", "Notes"], [
      ["VGA", "1987", "analogue", "for CRT monitors; kept for years for compatibility"],
      ["DVI", "1999", "digital (and analogue)", "introduced with LCD monitors"],
      ["HDMI", "2003", "digital", "replaces the earlier standards; carries audio too"],
      ["DisplayPort", "2006", "digital", "video, audio and other data; also over USB-C connectors"],
      ["SPI to a display controller", "-", "digital, serial", "the PRG32 kit: an ILI9341 panel of 320 by 240 pixels"],
    ], "High-Definition Multimedia Interface; Digital Visual Interface; Video Graphics Array. The ILI9341 is the chip on the display module: it has its own memory for the frame and drives the liquid crystals (Lecture 21).", { widths: [3.4, 1.2, 2.8, 4.8] }),
    G("Resolution: the size of the pixel grid", ["Resolution", "Pixels", "Aspect ratio", "Where"], [
      ["320 x 200", "64,000", "8:5", "Commodore 64, VGA games, the PRG32 viewport"],
      ["640 x 480", "307,200", "4:3", "VGA"],
      ["1024 x 768", "786,432", "4:3", "monitors of the 1990s"],
      ["1920 x 1080", "2,073,600", "16:9", "Full HD"],
      ["3840 x 2160", "8,294,400", "16:9", "4K"],
    ], "The table of the original deck also listed 800 x 600, 1280 x 1024 (5:4) and 1600 x 1200. The traditional 4:3 ratio has given way to the panoramic 16:9. The 4K row is new.", { widths: [2.4, 2.2, 2, 5.6], caption: "The resolution determines the definition of the image, and how many pixels must be stored and sent for every frame." }),
    G("Colour depth: bits per pixel", ["Depth", "Colours", "Bytes per pixel", "Name"], [
      ["4 bits", "16", "0.5", "standard VGA"],
      ["8 bits", "256", "1", "256-colour mode: each value is an index into a palette"],
      ["16 bits", "65,536", "2", "High Color: RGB565"],
      ["24 bits", "16,777,216", "3", "True Color: 256 shades of each of red, green and blue"],
    ], "In True Color every colour is obtained from 256 shades of each of the three additive primaries. PRG32 uses both middle rows: an 8-bit frame buffer of palette indices, and a palette of 256 RGB565 colours (Lecture 04).", { widths: [1.8, 2.4, 2.4, 5.6] }),
    D("Following the pixel on PRG32", (s, h) => {
      const y = h.TOP + 0.4, st = [["your code", "prg32_gfx_pixel", P.teal], ["frame buffer", "320 x 200 bytes\nin RAM", P.violet], ["palette", "256 entries\nof RGB565", P.amber], ["SPI bus", "27 MHz,\nserial, with DMA", P.red], ["display", "ILI9341,\n320 x 240", P.green]];
      const bw = 2.0, g = (h.CW - 5 * bw) / 4;
      st.forEach(([t, d, c], i) => { const x = h.MX + i * (bw + g);
        s.addText([{ text: t, options: { bold: true, fontSize: 16, breakLine: true } }, { text: d, options: { fontSize: 12.5 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w: bw, h: 1.4, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        if (i < 4) h.arrow(s, x + bw + 0.04, y + 0.7, x + bw + g - 0.04, y + 0.7, P.mute, 2.5); });
      h.table(s, h.MX, y + 1.9, [5.4, 6.733], ["Quantity", "Value"], [
        ["memory for one frame, one byte per pixel", "320 x 200 x 1 = 64,000 bytes"],
        ["the same frame at two bytes per pixel", "128,000 bytes: a quarter of all the RAM of the chip"],
        ["bits sent to the display for a whole frame", "64,000 pixels x 16 bits = 1,024,000 bits"],
        ["time on the bus at 27 MHz", "about 38 ms: at most some 26 full frames per second"],
      ], { fs: 14.5 });
      h.tx(s, "Two engineering answers: an indexed frame buffer halves the memory, and only the rows that changed are sent.", { x: h.MX, y: 6.25, w: h.CW, h: 0.5, fontSize: 15, italic: true, valign: "middle" });
    }, "Figures from the PRG32 repository (docs/hardware/ili9341.md): 64,000-byte 8-bit indexed frame buffer, 512-byte palette, default SPI clock of 27 MHz, DMA transfers and dirty-rectangle tracking. 1,024,000 / 27,000,000 = 37.9 ms. The FPS counter of the demo cartridges shows the result."),
    T("Memory and bandwidth: the pressure on video hardware", [
      "The memory and the processor time needed by ever more demanding graphics, 3D video games above all, imposed a rapid evolution on video cards",
      "As the definition of the images grows, so does the memory needed to represent a frame",
      "The flow of data from the memory to the video card risks saturating the capacity of the bus",
      ["Two lines of attack", ["more and more memory on the card itself: the video memory", "a wider or dedicated bus: AGP yesterday, PCI Express today"]],
      "Several cards could even be connected together to share the work",
    ], "With AGP the graphics processor used part of the main memory through direct access. PCI Express (2004) replaced it with more bandwidth and more power. SLI (NVIDIA) and CrossFire (AMD) linked up to four cards; today a single card, or many cards in a server, are the rule.", { big: "4K, 60 Hz", label: "8.3 million pixels x 3 bytes x 60 frames: about 1.5 GB of pixels every second" }),

    H("GPU and GPGPU", "A processor for pixels, then for everything."),
    T("The graphics processing unit", [
      "The share of processor time spent computing images grew with the use of graphical interfaces",
      "To relieve the CPU, video cards were given dedicated processors: GPUs",
      ["They accelerate", ["raster graphics: copying blocks of pixels (blitting), operations on textures", "3D graphics: transformations, texture mapping, lighting"]],
      "Programs use them through libraries: OpenGL, Direct3D, and today Vulkan and Metal",
      "A device driver adapts the software running on the CPU to the primitives offered by the GPU; what is not supported is emulated by the CPU, slowly",
    ], "On PRG32 there is no GPU: prg32_gfx_rect is a loop of store instructions executed by the RISC-V core. This is why the frame rate of a busy cartridge drops, and why the students can see the cost of every pixel.", { img: "game_tetris.png", cap: "No GPU on the kit: every pixel is a store instruction" }),
    T("General-purpose computing on GPUs", [
      "Modern GPUs execute the same operation in parallel on whole matrices of pixels",
      "GPGPU: using GPUs for applications of a general kind, not necessarily graphical",
      "A very large number of simple cores per GPU: hundreds, thousands",
      "Programming models: CUDA (NVIDIA) and OpenCL, an open standard",
      "Scientific simulation, data analysis and, above all today, the training and use of neural networks run on GPUs",
    ], "Compute Unified Device Architecture. The parallel sum of Lecture 04 is the simplest GPGPU example. The weather and marine models of the Department run on GPU clusters.", { img: "gpgpu_sum.png", cap: "The same operation on many data at once", wide: true }),

    Q("How much memory does a frame of 640 x 480 pixels need in True Color (24 bits)?", ["307,200 bytes", "614,400 bytes", "921,600 bytes", "7,372,800 bytes"], 2, "307,200 pixels x 3 bytes = 921,600 bytes."),
    Q("A 16-bit bus works at 50 MHz, one transfer per cycle. What is its transfer rate?", ["50 MB/s", "100 MB/s", "400 MB/s", "800 MB/s"], 1, "2 bytes x 50 million transfers per second = 100 MB/s."),
    Q("In an 8-bit indexed frame buffer, the byte of a pixel contains:", ["its red component", "its brightness", "the position of its colour in a palette", "its x coordinate"], 2, "The byte is an index; the actual colour is looked up in a table of 256 entries, the palette."),
    Q("What is GPGPU?", ["A faster video output", "Using graphics processors for non-graphical computation", "A bus for video cards", "A kind of video memory"], 1, "General-purpose computing on graphics processing units."),
    X("Exercises: paper first, then PRG32", [
      "Compute the memory for one 4K frame in True Color, and the bytes per second at 60 frames per second",
      "The PRG32 display bus runs at 27 MHz: how long does it take to send 20 rows of 320 pixels at 16 bits per pixel?",
      "Draw a diagonal line pixel by pixel with prg32_gfx_pixel in a loop",
      "Fill the screen once with prg32_gfx_clear and once with 64,000 calls to prg32_gfx_pixel: compare the frame rates",
      "Change one palette entry with prg32_palette_set every frame and watch every pixel that uses it change at once",
    ], "On paper: 24,883,200 bytes per frame, about 1.5 GB per second; 102,400 bits, about 3.8 ms. On PRG32: palette cycling animates the screen without redrawing a single pixel.",
      "The last exercise shows why indexed colour was loved by game programmers: one store changes thousands of pixels. API calls from the textbook appendix (prg32_palette_set, prg32_gfx_clear, prg32_gfx_pixel)."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["peripheral", "periferica", "resolution", "risoluzione"],
      ["controller", "controller (unità di controllo della periferica)", "colour depth", "profondità di colore"],
      ["bus width", "larghezza del bus", "palette", "tavolozza (palette)"],
      ["transfer rate", "velocità di trasferimento", "video memory", "memoria video"],
      ["video card", "scheda video", "device driver", "driver di periferica"],
    ], null, { widths: [2.6, 4.2, 2.8, 3.2] }),
    T("Conclusions and reading", [
      "Input/output devices are a fundamental component of computers",
      "Devices are managed by a controller that interfaces them to the bus",
      "A bus is characterised by width, speed and transfer rate; its bandwidth is a limit to design around",
      "Video cards make it possible to display graphics and text: a frame buffer, a resolution, a colour depth, an output",
      "Their processors, the GPUs, are also used for high-performance computing",
      ["Reading", ["Tanenbaum, Austin: Structured Computer Organization, chapters 2 and 3 (buses, displays)", "Playing with RISC-V, chapter 7: the graphics game", "PRG32 repository: docs/hardware/ili9341.md"]],
    ], "Next lecture: input and output devices."),
  ],
});
