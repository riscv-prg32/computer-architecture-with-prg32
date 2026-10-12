// Lecture 21 - Input and output devices: displays, keyboard, mouse, printers, and the joystick of the kit.
// Source: 17-Architettura_dei_Calcolatori-Input-Output-Video-Tastiera-Mouse-Stampante.pptx (translated, updated, PRG32 links added).
const box13 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "21", file: "21-Computer_Architecture-Input_Output",
  title: "Input and Output", short: "Input and output",
  sub: "Displays, keyboards, mice and printers: how the machine meets the world, and how a program reads a button",
  quote: ["Need input!", "Number 5, in the film Short Circuit, John Badham, 1986"],
  cover: "lab2_step1_lamps.png",
  notes: "Spiral: the students have read the joystick since the first labs; the lecture opens by asking what is behind prg32_input_read, then covers the classic devices and the three ways a processor can deal with them.",
  slides: [
    O("What you will be able to do by the end", [
      "Describe how a picture is formed on a CRT and on an LCD, and what a TFT active matrix adds",
      "Explain the path of a key press: matrix, encoder, shift register, serial interface",
      "Say what a mouse sends to the computer and how often",
      "Describe the stages of laser printing",
      "Explain how the PRG32 kit reads its joystick, and compare polling, interrupts and DMA",
    ]),

    H("Warm-up on the machine", "What is behind a button?"),
    K("Read the world, once per frame", `steer_update:
    addi sp, sp, -16
    sw   ra, 12(sp)

    sw   s0, 8(sp)

    call prg32_input_read      # a0 = one bit per button
    mv   s0, a0                # keep it in a saved register

    andi t0, s0, 0x10          # button A
    beqz t0, 1f
    li   a0, 0                 # channel
    li   a1, 0                 # instrument
    li   a2, 69                # note: A4, 440 Hz
    li   a3, 255               # volume
    li   a4, 120               # milliseconds
    call prg32_audio_note
1:  andi t0, s0, 0x01          # LEFT: s0 survived the call
    beqz t0, 2f
    ...                        # move left
2:  ...`, [
      "Each button is a switch on one input pin of the chip: pressed or released, one bit",
      "The runtime reads the pins and packs them into one word: a decoded representation (Lecture 11)",
      "Your game asks once per frame: this is polling",
      "A keyboard has a hundred keys, a mouse moves in two dimensions, a display has thousands of pixels: how do they talk to a processor?",
    ], "From textbook chapter 6, lab 06 and the sound example of the capstone chapter (examples/asm_capstone/audio_note_event.S). Built as a cartridge and run on the PRG32-QT headless runner (tools/tests): the marker moves with LEFT also while A plays the note, because the mask is kept in s0, a saved register; in t0 it would be lost at the call. The pins are memory-mapped GPIO registers (Lecture 15), configured as inputs, that is, with their output buffers in high impedance (Lecture 14)."),

    H("Displays", "From the cathode-ray tube to liquid crystals."),
    T("The video: an introduction", [
      "At first mostly character displays in black and white; today graphical and in colour",
      "A graphical display is a matrix of points, the pixels, each lit with a different intensity",
      "An image is composed by switching the pixels on and off",
      "A different density of pixels gives a different resolution; colours go from 256 (8 bits) to 16 million (24 bits) and beyond",
      "The size is measured in inches along the diagonal: a 14-inch display has a diagonal of 14 inches",
    ], "The display of the PRG32 kit: 2.8 inches, 320 by 240 pixels, 65,536 colours.", { img: "mac_classic.jpg", cap: "A compact Macintosh: a 9-inch black-and-white CRT" }),
    G("The cathode-ray tube: a short history", ["Year", "Who", "What"], [
      ["early 1870s", "William Crookes", "the Crookes tube: the first cathode-ray tube, a laboratory instrument"],
      ["1897", "Karl Ferdinand Braun", "the Braun tube and the first cathode-ray oscilloscope: the first practical application"],
      ["1907", "Boris Rosing", "a CRT displays simple geometric shapes from a received video signal: the root of television"],
      ["1934", "Telefunken", "the first television set with a CRT on the market, in Germany"],
      ["1970s-1990s", "the computer industry", "the CRT monitor: the display of every terminal and personal computer"],
    ], "The last row summarises the era the original deck illustrated with pictures of an oscilloscope and of the Asteroids arcade cabinet (a vector display driven by a 6502).", { widths: [1.8, 3, 7.4] }),
    T("How a CRT works", [
      "The cathode is a small metal element heated to incandescence, which emits electrons by the thermionic effect",
      "Inside the tube the electrons are directed into a beam by a high potential difference between cathode and anode",
      "Other electromagnetic fields focus the beam",
      ["The beam, the electron brush, is deflected", ["by magnetic fields (the Lorentz force), or by electric fields"]],
      "It strikes a point on the inner surface of the screen, coated with phosphor, which lights up",
      "Sweeping the beam line by line, many times per second, paints the picture",
    ], "The original schematic had Italian labels: grid, anode, deflection coil, heater, cathode, beam, focusing coil, fluorescent screen.", { img: "crt_scope.jpg", cap: "A cathode-ray oscilloscope used as a display" }),
    T("Liquid crystal displays", [
      "LCD monitors have almost completely replaced the cathode-ray tube",
      "Advantages: a better picture; less bulk, weight and power; less eye strain",
      "Liquid crystals are viscous organic molecules that flow like a liquid but have a spatial structure",
      "An electric field changes the orientation of the molecules, and with it the optical properties of the crystal: the angle of polarisation of the light that crosses it",
      "A crystal is a valve for light, opened and closed by a voltage",
    ], "LCD: liquid crystal display.", { img: "lcd_layers.jpg", cap: "The layers of a liquid crystal display" }),
    T("Inside an LCD panel", [
      "The screen is made of many cells, often one per pixel, in which the liquid crystals are trapped",
      "Each cell has electrical contacts, so that a field can be applied to the liquid it contains",
      "The cells lie between two polarising filters whose axes are perpendicular to each other, with a light behind the rear one",
      ["Polarisation decides whether light passes", ["crystals not driven: the light is rotated and crosses the front polariser", "crystals driven: the light is completely blocked"]],
      "In a colour screen each cell is divided into three sections with a red, a green and a blue filter",
    ], "Three sub-pixels per pixel: the R, G and B fields of the RGB565 colour of Lecture 04 end up here, as three voltages.", { img: "lcd_pixels.jpg", cap: "Red, green and blue sub-pixels under the magnifier" }),
    V("Driving the cells: from segments to the active matrix",
      ["Segments and passive matrix", ["Calculators and digital watches: one electrical contact per segment", "Impossible as the number of elements grows", "Passive matrix: one group of contacts per row and per column, not per pixel", "Only one pixel at a time is driven: the others must remember their state", "Problems: persistence (trails behind moving objects) and crosstalk"]],
      ["Active matrix: TFT", ["Used for high-resolution screens", "The panel contains a thin film of transistors, on a transparent semiconductor layer", "The field is applied exactly where needed by a transistor in each cell", "The transistor stores the electrical state of its pixel while the others are updated", "Each pixel is, in effect, a one-bit analogue memory cell"]],
      "TFT: thin-film transistor. The display of the kit is a TFT panel with an ILI9341 controller. New since the original deck: OLED displays, in which each pixel emits its own light and no backlight is needed."),

    H("Keyboard and mouse"),
    T("The keyboard", [
      "Derived from that of typewriters; the main character input device",
      ["Its keys are grouped", ["alphanumeric keys", "special keys: enter, backspace, ...", "arrow keys and function keys"]],
      "Keyboard and video are not directly connected to each other",
      "It is the processor that reproduces on the video the information typed on the keyboard",
      "Today's keyboards connect through USB, or wirelessly",
    ], "PS/2 was the standard connector before USB. The echo of a key on the screen is a program: read a code, draw a character."),
    D("The path of a key press", (s, h) => {
      const y = h.TOP + 0.2, keys = ["Q", "W", "E", "R", "T", "Y", "A", "S", "D", "F", "G", "H", "Z", "X", "C", "V", "B", "N"];
      keys.forEach((k, i) => s.addText(k, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.05, x: h.MX + (i % 6) * 0.62 + Math.floor(i / 6) * 0.2, y: y + Math.floor(i / 6) * 0.62, w: 0.54, h: 0.54,
        fill: { color: k === "D" ? P.amber : P.steel }, line: { color: P.white, width: 0 }, color: P.white, bold: true, fontFace: h.MONO, fontSize: 15, align: "center", valign: "middle", margin: 0 }));
      h.tx(s, "rows and columns of switches", { x: h.MX, y: y + 1.9, w: 4.2, h: 0.3, fontSize: 12.5, italic: true, color: P.mute });
      const bx = 5.0, bw = 2.35;
      [["encoder", "row and column\nto an n-bit code", P.teal], ["shift register", "n bits in parallel\nto n bits in series", P.violet], ["serial interface", "for example\na USB controller", P.green]].forEach(([t, d, c], i) => {
        const x = bx + i * (bw + 0.35);
        s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y: y + 0.2, w: bw, h: 1.3, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        h.arrow(s, x - 0.33, y + 0.85, x - 0.03, y + 0.85, P.mute, 2.5); });
      h.arrow(s, bx + 2 * (bw + 0.35) + bw / 2, y + 1.53, bx + 2 * (bw + 0.35) + bw / 2, y + 2.25, P.mute, 2.5);
      h.line(s, bx, y + 2.3, h.W - h.MX, y + 2.3, P.amber, 6); h.tx(s, "system bus", { x: bx, y: y + 2.4, w: 2, h: 0.3, fontSize: 13, bold: true, color: P.amber });
      h.rows(s, [
        "The keyboard is managed by a keyboard controller",
        "The encoder turns a combination of row and column into a code of n bits: the encoder of Lecture 11",
        "The shift register turns the n bits into a sequence, to be handled serially: the shift register of Lecture 14",
        "The serial interface sends the code to the system bus in the proper way, and raises an interrupt",
      ], h.MX, 4.7, h.CW, 2.05);
    }, "Every block of this slide is a machine the students have already designed: this is the pay-off of Lectures 11 to 14."),
    T("The mouse", [
      "Invented in the 1960s by Douglas Engelbart: the first pointing device in history",
      "A wooden box with two wheels underneath and a wire leaving from the back, like the tail of a mouse",
      "The two wheels detected the movements along the horizontal and the vertical axis; the electronics turned them into electrical signals",
      "Mechanical mouse: a ball turns two rollers, each driving a counter",
      "Optical mouse: a light source and a tiny camera measure the movement of the surface underneath",
    ], "The original deck dates the mouse to 1967, the year the patent was filed; the first prototype is of 1964 and the famous public demonstration of 1968. Counters: the sequential machines of Lecture 13."),
    D("What a mouse sends", (s, h) => {
      h.rows(s, [
        "Every time it moves by a minimum distance, about a hundredth of an inch, called a mickey, the mouse sends three bytes",
        "Byte 1: how many units it moved along x since the last report",
        "Byte 2: the movement along y",
        "Byte 3: the state of the buttons",
        "The control software, the device driver, supervises the communication with the processor",
      ], h.MX, h.TOP, 7.2, h.BOT - h.TOP);
      const x = 8.4, y = h.TOP + 0.5;
      [["two counters", "x and y movement", P.teal], ["shift register", "three bytes, in series", P.violet], ["serial interface", "USB controller", P.green]].forEach(([t, d, c], i) => {
        s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y: y + i * 1.4, w: 3.6, h: 1.0, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        if (i < 2) h.arrow(s, x + 1.8, y + i * 1.4 + 1.03, x + 1.8, y + (i + 1) * 1.4 - 0.03, P.mute, 2.5); });
      h.mem(s, x, y + 4.3, 1.2, [{ val: "dx", color: P.teal }, { val: "dy", color: P.teal }, { val: "buttons", color: P.amber }], { h: 0.6, fs: 14 });
    }, "The original deck says the first byte reports the movement 'in the last 100 milliseconds'; modern mice report up to a thousand times per second. The signed movement bytes are two's complement numbers (Lecture 05)."),

    H("Printers"),
    T("The printer", [
      "An output device that prints information on paper",
      "Printing speed: lines per minute, characters per second or pages per minute",
      "Resolution, the print quality: dots per inch",
      ["Kinds", ["daisy wheel and chain printers, now disused", "dot matrix: needles strike an inked ribbon", "ink jet: tiny drops of ink", "laser"]],
      "A printer is also a small computer: it has its own processor, memory and firmware",
    ], "Stampante a margherita, a catena, ad aghi, a getto di inchiostro, laser."),
    T("The laser printer", [
      "It derives from the photocopier",
      "A drum is charged electrically, to about 1,000 volts",
      "A laser beam, reflected by a rotating mirror, scans the length of the drum; the beam is modulated to produce a pattern of light and dark points",
      "The points struck by the beam lose their charge; after each line the drum turns a fraction of a degree",
      "The toner is attracted by the points that are still charged: an image of the line is formed",
      "The drum is pressed against the paper and transfers the toner; heated rollers fix it permanently; the drum is discharged and cleaned",
    ], "Three slides of the original are merged. The page is first built as a bitmap in the printer's memory: a frame buffer for paper.", { img: "laser_printer.jpg", cap: "The path of the paper in a laser printer" }),

    H("Back to the machine", "Input and output on the kit, and three ways to do them."),
    G("The devices of the PRG32 kit", ["Device", "Direction", "How it is connected", "How a cartridge uses it"], [
      ["joystick and buttons", "input", "one switch per input pin (GPIO)", "prg32_input_read: one bit per button"],
      ["display, 320 x 240 TFT", "output", "SPI serial bus, with DMA", "prg32_gfx_* calls draw into the frame buffer"],
      ["amplifier and speaker", "output", "I2S serial bus", "prg32_audio_* calls: notes, samples, music"],
      ["Wi-Fi radio", "input and output", "inside the chip", "cartridge upload, the Store, multiplayer"],
      ["USB serial port", "input and output", "USB", "flashing the firmware, debug messages"],
    ], "Hardware from the PRG32 README and docs/hardware. A switch bounces for a few milliseconds when pressed; sampling it once per frame, every few tens of milliseconds, hides the bounce.", { widths: [2.8, 1.8, 3.6, 4] }),
    C("Three ways to deal with a device", [
      ["Polling", "The program asks the device, again and again, whether it has something. Simple, and what a game does once per frame; wasteful when nothing happens."],
      ["Interrupts", "The device asks for attention when it needs it; the processor suspends what it is doing, serves the device and resumes. The subject of Lecture 19."],
      ["Direct memory access", "The device exchanges whole blocks of data with the memory by itself; the processor only starts the transfer and is told when it ends."],
    ], "Programmed I/O, interrupt-driven I/O and DMA. On the kit all three are at work: your game polls the joystick, the timer that paces the frames interrupts, the display and the sound are fed by DMA."),

    Q("What does the encoder of a keyboard controller do?", ["It lights the key that was pressed", "It turns a row and column combination into a key code", "It sends the code to the monitor", "It counts how long a key is held"], 1, "From a decoded position in the key matrix to a compact n-bit code, as the encoder of Lecture 11."),
    Q("In a colour LCD, a pixel is made of:", ["one cell that changes colour", "three cells with red, green and blue filters", "a phosphor dot hit by electrons", "a transistor that emits light"], 1, "Three sub-pixels, each a liquid crystal cell behind a colour filter; a TFT in each stores its state."),
    Q("Why does a passive-matrix LCD show trails behind moving objects?", ["Its backlight is too weak", "Its pixels are driven one at a time and must hold their state in between", "It has too few colours", "The video card is slow"], 1, "Persistence: without a transistor per pixel, the cells respond slowly and keep their state badly while the others are scanned."),
    Q("A PRG32 game reads the joystick once per frame. This technique is called:", ["direct memory access", "interrupt-driven input", "polling", "memory mapping"], 2, "The program asks the device periodically. With interrupts the device would call the program."),
    X("Exercises: paper first, then PRG32", [
      "A keyboard has 104 keys: how many bits does the key code need? How many rows and columns could the matrix have?",
      "A page of 8 by 11 inches at 600 dots per inch, one bit per dot: how much memory does the printer need for the bitmap?",
      "Move a pointer on the PRG32 screen with the joystick, as a mouse would: keep x and y, clamp them to the screen",
      "Make button A act only once per press (edge detection, Lecture 13)",
      "Draw a seven-segment score with rectangles, using the transcoder table of Lecture 11",
    ], "On paper: 7 bits, for example 8 by 13; about 4 MB. On PRG32: a pointer that stays on screen and a button that fires once per press.",
      "8 x 600 = 4,800 by 11 x 600 = 6,600 dots: 31,680,000 bits = 3.96 MB."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["cathode-ray tube", "tubo a raggi catodici", "pointing device", "periferica di puntamento"],
      ["liquid crystals", "cristalli liquidi", "dot-matrix / ink-jet printer", "stampante ad aghi / a getto d'inchiostro"],
      ["backlight", "retroilluminazione", "drum / toner", "tamburo / toner"],
      ["active matrix", "matrice attiva", "polling", "interrogazione ciclica"],
      ["keyboard / key", "tastiera / tasto", "device driver", "driver di periferica"],
    ], null, { widths: [2.8, 3, 3.2, 3.8] }),
    T("Conclusions and reading", [
      "Input/output devices are a fundamental component of computers",
      "Display technology has made enormous progress, from the electron beam to a transistor behind every pixel",
      "Keyboard, mouse and printer have changed little in form, and inside they are built from encoders, counters and shift registers",
      "A device reaches the processor through a controller and a bus, and is handled by polling, by interrupts or by DMA",
      "On the PRG32 kit the whole chain, from a switch to a pixel, can be followed instruction by instruction",
      ["Reading", ["Tanenbaum, Austin: Structured Computer Organization, section 2.4 (input/output)", "Stallings: Computer Organization and Architecture, chapter on input/output", "Playing with RISC-V, chapter 6: State and Input"]],
    ], "Next: Verm1, part 4: the finished game. Then its publication on the Cartridge Store."),
  ],
});
