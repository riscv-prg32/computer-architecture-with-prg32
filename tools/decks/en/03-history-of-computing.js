// Lecture 03 - History of computing.
// Source: 01-Architettura_dei_Calcolatori-Storia_della_Computazione.pptx (translated, dates checked, RISC-V thread added).
Deck({
  n: "03", file: "03-Computer_Architecture-History_of_Computing",
  title: "History of Computing", short: "History of computing",
  sub: "From the abacus to an open processor you can program yourself",
  quote: ['printf("Hello, world!");', "Brian Kernighan and Dennis Ritchie, The C Programming Language, 1978"], quoteMono: true,
  cover: "game_spaceinvaders.png",
  notes: "The students have already run a RISC-V program (Lecture 02). This lecture tells them where that machine comes from: every stage of the story adds one idea that is still inside the ESP32-C6.",
  slides: [
    O("What you will be able to do by the end", [
      "Define informatics and say why it is not the science of computers",
      "Place the key machines and people on a timeline, from the abacus to the stored-program computer",
      "Name the four units of the von Neumann architecture and find them in the machine you programmed last time",
      "Explain what RISC means and why RISC-V is an open instruction set",
      "Describe where informatics sits between science, engineering and the economy",
    ]),

    H("What is informatics?"),
    DEF("A definition", "Informatics", "The applied science that deals with the treatment of information by means of automated procedures.", [
      "Italian informatica, from the French informatique: information automatique",
      "In English: computer science, and increasingly informatics",
      "The tool: elaboratore in Italian, ordinateur in French, computer in English",
    ], "« L'informatica non riguarda i computer più di quanto l'astronomia riguardi i telescopi. » The next slide carries the quotation."),
    B("Computer science is no more about computers than astronomy is about telescopes.", "Attributed to Edsger W. Dijkstra", "The machine is the instrument, not the subject. In this course we study the instrument closely precisely so that it stops being a mystery."),
    V("Two souls, one discipline",
      ["Theoretical informatics", ["The theoretical foundations of information", "Computation at the logical level: what can be computed, and at what cost", "Algorithms: a finite set of operations that describe the transformation from A to B"]],
      ["Applied informatics", ["Enabling technologies and information systems", "Pervasive: a driver of economic development and of the ICT sector", "A STEM discipline at the heart of an industrial revolution", "With a social cost to manage: the digital divide"]],
      "The word cloud of the original slide: design, analysis, languages, development, databases, networks, computing, multimedia, web, cloud, apps, IoT, AI, machine learning, mobile, algorithms, embedded, video games, graphics, programming."),

    H("Before electricity", "Three thousand years of machines that help people calculate."),
    I("Origins: the abacus and the Antikythera mechanism", [
      ["abacus_roman.jpg", "Roman hand abacus: a physical representation of data and operations"],
      ["abacus_chinese.jpg", "Chinese suanpan: Babylonians, Chinese, Greeks and Romans all used counting frames"],
      ["antikythera.jpg", "Antikythera mechanism, 2nd-1st century BC: the oldest known geared calculator"],
      ["antikythera_plate.jpg", "Its dials computed astronomical positions and eclipses"],
    ], "The dating of the Antikythera mechanism is debated: most estimates fall between about 205 and 60 BC.", "A number becomes a position of beads or the angle of a gear: representation comes before calculation."),
    T("The medieval Islamic world (9th to 13th century)", [
      ["Astronomical instruments", ["the mechanical astrolabe; the torquetum"]],
      ["A contribution to cryptography", ["cryptanalysis and frequency analysis (al-Kindi, 9th century)"]],
      ["Programmable machines", ["the automatic flute player of the Banu Musa brothers", "the weight-driven clocks and automata of al-Jazari (1206)"]],
      "The word algorithm comes from the name of al-Khwarizmi, as algebra comes from the title of his book",
    ], "The source slide dated the period to the 11th-12th century; the people named here span the 9th to the early 13th.", { img: "astrolabe.jpg", cap: "A brass astrolabe" }),
    T("From 1600 to 1800: mechanical calculators and logic", [
      ["The first mechanical calculators", ["logarithm tables (Napier, 1614)", "Blaise Pascal's Pascaline (1642): addition with carry", "Leibniz's stepped reckoner (1673): the four operations"]],
      ["Logic and formal mathematics", ["Leibniz describes binary arithmetic (1703)", "George Boole, The Laws of Thought (1854): logic becomes algebra"]],
      ["Programmable machines", ["Jacquard's loom (1804): the pattern is stored on punched cards"]],
    ], "Corrections to the source slide: Boole's Laws of Thought is 1854 (not 1864); Leibniz's paper on binary arithmetic was published in 1703.", { img: "pascaline.jpg", cap: "A Pascaline: each wheel is one decimal digit" }),
    I("The 1800s: Charles Babbage and Ada Lovelace", [
      ["difference_engine.jpg", "Difference Engine: automatic computation of mathematical tables"],
      ["analytical_engine.jpg", "Analytical Engine: a mill (arithmetic unit), a control unit, a store (memory) and an output device"],
      ["punched_cards.jpg", "Programs and data on punched cards, borrowed from the Jacquard loom"],
    ], "Ada Lovelace's notes on the Analytical Engine (1843) contain what is regarded as the first published program, for computing Bernoulli numbers.",
      "Ada Lovelace devised a method for programming the Analytical Engine: she is regarded as the first programmer in history."),

    H("The twentieth century", "The idea of a universal machine, and the machines that made it real."),
    T("Theory first: Turing, Shannon and Nakajima", [
      ["Alan Turing", ["1936: an abstract universal machine defines what can be computed", "at Bletchley Park he works on breaking the German Enigma cipher"]],
      ["Akira Nakajima and Claude Shannon", ["switching-circuit theory (1930s): Boolean algebra describes circuits of switches", "the principle on which all digital design rests"]],
      ["Konrad Zuse", ["Z3 (1941): the first working computer controlled by a program", "shown in 1998 to be Turing-complete", "Z4: one of the first computers to be sold commercially"]],
    ], "The Boolean algebra of Lectures 08 and 09 is exactly the Nakajima-Shannon bridge between logic and circuits.", { img: "enigma.jpg", cap: "An Enigma cipher machine" }),
    D("John von Neumann: the stored-program computer", (s, h) => {
      h.rows(s, [
        "A hardware architecture for programmable digital computers (EDVAC report, 1945)",
        "Program and data share the same memory: a program is data",
        ["Four essential units", ["control unit: governs the sequence of operations", "arithmetic logic unit (ALU), with its accumulator register", "memory", "input and output"]],
        "The ESP32-C6 you programmed is still a von Neumann machine",
      ], h.MX, h.TOP, 6.8, h.BOT - h.TOP);
      const x = 8.0, bw = 2.1, g = 0.35, w = 2 * bw + g, box = (t, bx, by, bw2, bh, col) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.08, x: bx, y: by, w: bw2, h: bh,
        fill: { color: col }, line: { color: col, width: 0 }, color: P.white, bold: true, fontFace: h.BODY, fontSize: 16, align: "center", valign: "middle", margin: 4 });
      h.card(s, x - 0.2, h.TOP, w + 0.4, h.BOT - h.TOP);
      box("Memory\nprogram and data", x, h.TOP + 0.3, w, 1.0, P.steel);
      box("Control\nunit", x, h.TOP + 2.0, bw, 1.5, P.teal);
      box("ALU\n(accumulator)", x + bw + g, h.TOP + 2.0, bw, 1.5, P.amber);
      box("Input", x, h.TOP + 4.1, bw, 0.8, P.green);
      box("Output", x + bw + g, h.TOP + 4.1, bw, 0.8, P.green);
      const c1 = x + bw / 2, c2 = x + bw + g + bw / 2;
      h.arrow(s, c1, h.TOP + 1.95, c1, h.TOP + 1.35, P.mute, 2); h.arrow(s, c2, h.TOP + 1.35, c2, h.TOP + 1.95, P.mute, 2);
      h.arrow(s, x + bw + 0.03, h.TOP + 2.75, x + bw + g - 0.03, h.TOP + 2.75, P.mute, 2);
      h.arrow(s, c1, h.TOP + 4.05, c1, h.TOP + 3.55, P.mute, 2); h.arrow(s, c2, h.TOP + 3.55, c2, h.TOP + 4.05, P.mute, 2);
    }, "Find the four units in Lecture 02: the registers and the ALU executed addi; memory held counter and the instructions themselves (0x00130313); the joystick and the display are input and output."),
    D("Eight decades of computers", (s, h) => {
      const dec = [["'40", "Wartime", "eniac.png", "ENIAC, Colossus"], ["'50", "Military and government", "edvac.jpg", "EDVAC, 1949"], ["'60", "Mainframe computing", "mainframe.jpg", "one machine, many users"],
        ["'70", "Minicomputers", "minicomputer.jpg", "a computer per department"], ["'80", "Personal computing", "c64.jpg", "a computer per person"], ["'90", "The Internet", "network.jpg", "computers connect"],
        ["'00", "Smartphones and tablets", "iphone.jpg", "a computer in the pocket"], ["'10", "Cloud computing", "datacenter.jpg", "computing as a service"], ["'20", "IoT and AI", "smart_speaker.jpg", "computers everywhere"]];
      const n = dec.length, g = 0.12, w = (h.CW - g * (n - 1)) / n;
      h.line(s, h.MX, 4.02, h.W - h.MX, 4.02, P.rule, 3);
      dec.forEach(([d, name, im, cap], i) => {
        const x = h.MX + i * (w + g);
        h.card(s, x, h.TOP, w, 1.9);
        h.img(s, im, x + 0.08, h.TOP + 0.08, w - 0.16, 1.74);
        h.pill(s, d, x + w / 2 - 0.42, 3.72, 0.84, 0.6, h.TINTS[i % 6], 19);
        h.tx(s, name, { x, y: 4.5, w, h: 0.85, fontSize: 14.5, bold: true, color: P.steel, align: "center", valign: "middle" });
        h.tx(s, cap, { x, y: 5.4, w, h: 0.8, fontSize: 12.5, color: P.mute, align: "center" });
      });
      h.tx(s, "Each decade made the computer smaller, cheaper and closer to people; none of them changed the stored-program idea.", { x: h.MX, y: 6.25, w: h.CW, h: 0.5, fontSize: 16, italic: true, valign: "middle" });
    }, "1943-45: ENIAC (USA) and Colossus (UK). 1949: EDVAC (USA). The source slide also showed the Macintosh, the Amiga, the IBM PC, the iPad and a self-driving car: the pictures are in tools/assets if you want to add them."),

    H("From home computers to RISC-V", "Why the processor in your kit is the way it is."),
    G("Microprocessors: from CISC to RISC to an open standard", ["Year", "Milestone", "Why it matters"], [
      ["1971", "Intel 4004", "the first commercial microprocessor: 2,300 transistors on one chip"],
      ["1975", "MOS 6502", "a cheap 8-bit CPU: Apple II, Commodore 64, the home-computer era"],
      ["1978", "Intel 8086", "the start of x86, a complex instruction set (CISC) still in today's PCs"],
      ["1980-82", "Berkeley RISC and Stanford MIPS", "few, simple, regular instructions run faster: the RISC idea"],
      ["1985", "ARM1", "RISC for low power: today in nearly every phone"],
      ["2010", "RISC-V starts at UC Berkeley", "the fifth Berkeley RISC design becomes an open instruction set"],
      ["2015-20", "RISC-V Foundation, then RISC-V International", "a shared specification, governed from Switzerland"],
      ["2023-25", "European Chips Act; the DARE project", "RISC-V as a strategy for European technological sovereignty"],
    ], "RISC = Reduced Instruction Set Computer; CISC = Complex Instruction Set Computer. Patterson and Hennessy received the 2017 Turing Award for the RISC approach. This slide is new with respect to the Italian deck.", { widths: [1.3, 4.2, 6.7] }),
    T("Moore's law in one number", [
      "1971: the Intel 4004 has 2,300 transistors",
      "Today a laptop processor has tens of billions",
      "For fifty years the number of transistors on a chip doubled about every two years",
      "The physical limits are now close: progress comes from better architectures, specialised accelerators and open designs",
      "This is why architecture, the subject of this course, matters more than ever",
    ], "Gordon Moore's observation dates from 1965 (revised in 1975). Do not present it as a law of nature.", { big: "x 10,000,000", label: "the growth in transistors per chip from the Intel 4004 (1971) to a current laptop processor" }),
    G("The home-computer spirit, on a modern open CPU", ["", "Commodore 64 (1982), MOS 6510", "PRG32 on ESP32-C6, RISC-V"], [
      ["Word size", "8 bits", "32 bits"],
      ["Registers", "A, X, Y (plus stack pointer, status, PC)", "32 general-purpose registers, x0 to x31"],
      ["Clock", "about 1 MHz", "160 MHz"],
      ["Address space", "64 KB", "4 GB"],
      ["Instruction set", "56 instructions, proprietary", "about 40 base instructions plus extensions, open standard"],
      ["Screen", "320 by 200 pixels, 16 colours", "320 by 200 viewport, 256-entry RGB565 palette"],
      ["You program it by", "typing on the machine itself", "building a cartridge and uploading it"],
    ], "The source deck ended with the easy6502 simulator (skilldrick.github.io/easy6502), still a pleasant visit. PRG32 keeps the same immediacy, 320 by 200 included, on the architecture the students will meet in industry.", { widths: [2.4, 4.6, 5.2], caption: "Same screen size, same immediacy: forty years apart. The 6502 is still fun to explore at skilldrick.github.io/easy6502" }),
    I("Retro games as specimens", [["game_pong.png", "Pong"], ["game_breakout.png", "Breakout"], ["game_tetris.png", "Tetris"], ["game_asteroids.png", "Asteroids"]],
      "All four are example cartridges in the PRG32 repository (examples/games).", "A retro game is small enough to hold in your head and rich enough to exercise state, input, arithmetic, decisions and a loop: the whole course."),

    H("Informatics as an applied science"),
    F("Where informatics sits", [
      "Natural phenomenon|a storm forms over the sea",
      "Basic sciences|physics and mathematics describe it with equations",
      "Applied sciences|informatics turns the equations into algorithms and simulations",
      "Engineering|supercomputers, networks and sensors run them reliably",
      "Economy|forecasts and services reach people and create value",
    ], "An example from this Department: the weather and marine forecasts of meteo.uniparthenope.it, computed every day on our own high-performance systems.",
      "The source slide showed portraits and pictures for each stage (equations, forecast maps, a hurricane, the mobile app)."),
    I("High-performance computing at Parthenope", [
      ["cluster_1.jpg", "A teaching cluster: mini PCs with GPUs on a 10 Gbit network"],
      ["cluster_2.jpg", "The same cluster running a parallel simulation"],
      ["rcf_page.png", "Research Computing Facilities: rcf.uniparthenope.it"],
    ], "The closing event of the course includes a visit to the supercomputing systems of the Department.", "The same ideas you practise on a 160 MHz microcontroller scale up to clusters: registers, memory, instructions, only many more of them."),

    Q("Which idea is the heart of the von Neumann architecture?", ["The processor has exactly four registers", "Program and data are stored in the same memory", "Every instruction takes one clock cycle", "Input and output are optional"], 1, "The stored-program concept: instructions are data in memory, fetched and executed one after another."),
    Q("What makes RISC-V different from x86 and ARM?", ["It is the fastest instruction set", "It was the first RISC architecture", "Its instruction set is an open standard, free to implement", "It works only on microcontrollers"], 2, "RISC-V is an open standard instruction set architecture; anyone may design and sell a RISC-V processor without an architecture licence. It was not the first RISC (Berkeley RISC, MIPS, ARM came earlier)."),
    Q("Who is regarded as the first programmer in history?", ["Charles Babbage", "Alan Turing", "Ada Lovelace", "Konrad Zuse"], 2, "Ada Lovelace, for her 1843 notes on the Analytical Engine."),
    X("Exercises: paper first, then PRG32", [
      "Draw the four units of the von Neumann architecture and write, inside each, one thing of the program of Lecture 02 that lives or happens there",
      "For each of these, say whether it is a new way of representing information or of prescribing operations: the abacus, the Jacquard loom, the Pascaline, Boole's algebra, the punched cards of the Analytical Engine, the stored program",
      "Download two of the four retro games from the Store, or build them from examples/games; with the counters of the debugger find how many instructions each executes per frame, and compare",
    ], "Registers and ALU: addi executed. Memory: counter and the instructions themselves. Control unit: the fetch of each instruction. Input/output: the bar on the screen.",
      "Representing: abacus, Pascaline (digits as wheel positions), Boole's algebra. Prescribing: the Jacquard loom, the cards of the Analytical Engine, the stored program, which unifies the two: a program is itself represented information. The third exercise has no fixed answer: the counters depend on the game and on the moment."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["computer science / informatics", "informatica", "stored program", "programma memorizzato"],
      ["computer", "calcolatore, elaboratore", "control unit", "unità di controllo"],
      ["punched card", "scheda perforata", "arithmetic logic unit", "unità aritmetico-logica"],
      ["loom", "telaio", "instruction set", "insieme (set) di istruzioni"],
      ["mainframe", "mainframe, grande elaboratore", "high-performance computing", "calcolo ad alte prestazioni"],
    ], null, { widths: [3.4, 3, 3.2, 3] }),
    T("Conclusions and reading", [
      "Computing is older than electronics: representation and procedure came first",
      "The stored-program computer of 1945 is still the machine we program today",
      "RISC made processors simple enough to understand whole; RISC-V made them open",
      "Informatics is pervasive: digital information belongs to every field, data are its currency, algorithms turn data into decisions",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, chapter 1", "Playing with RISC-V, chapter 1: Why a Game, Why RISC-V, Why Now", "Charles Petzold: Code. The Hidden Language of Computer Hardware and Software"]],
    ], "Next lecture: how information becomes bits."),
  ],
});
