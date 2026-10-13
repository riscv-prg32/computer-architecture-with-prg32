// Lecture 00 - Course introduction.
// Source: 00-Architettura_dei_Calcolatori-Introduzione_al_corso.pptx (translated, reorganised, PRG32-first).
Deck({
  n: "00", file: "00-Computer_Architecture-Course_Introduction",
  title: "Course Introduction", short: "Course introduction",
  sub: "Computer Architecture and Laboratory (ARC12): program first, formalise later",
  quote: ["The Matrix is a system, Neo. That system is our enemy.", "The Matrix, Lana and Lilly Wachowski, 1999"],
  cover: "prg32_logo.png",
  notes: "Opening lecture. The administrative facts (timetable, assessment) are carried over from the Italian 2026/27 deck; from this year there is one midterm test, with ten questions and two exercises. Dates still marked TBD must be filled in before class.",
  slides: [
    O("Today", [
      "Who we are, and how the 96 hours of the course are organised",
      "The approach: you program first, and we formalise afterwards",
      "The machine: PRG32, RISC-V, and the debugger you will use every week; next time we install them together",
      "The project: Verm1, a game you write from an empty file and publish",
      "The rules: timetable, the midterm test, the exam, the material",
    ], "Five parts, about ten minutes each. The last part is the one students ask about: say at once that it comes at the end."),
    C("The course at a glance", [
      ["Name", "Computer Architecture and Computer Architecture Laboratory (ARC12). First year, first semester, Bachelor's Degree in Computer Science."],
      ["Lecturers", "Raffaele Montella: lectures, 6 ECTS.\nMariacarla Staffa: laboratory, 6 ECTS."],
      ["Credits", "12 ECTS, 96 hours.\nScientific area: INFO-01/A (Informatics)."],
      ["Office hours", "Room 420, Tuesday 14:00-16:00, by appointment. Also on Microsoft Teams (team code: c7rf33g)."],
      ["Extra credits", "Accenture SuperSkills! gives 2 ECTS as further knowledge: richiediaccesso.uniparthenope.it"],
      ["Prerequisites", "None. The only real prerequisite is a passion for computing and the technologies that enable it."],
    ], "Teams link from the original deck: https://teams.microsoft.com/l/channel/19%3Af4f24e8de71f424395ba903febdc4766%40thread.tacv2/General?groupId=09ae05f6-46f6-4441-ab7b-7522f88007d5 . The team code c7rf33g comes from the official syllabus and may change: announce any change in class. Accenture SuperSkills: https://richiediaccesso.uniparthenope.it/reservations?type=J"),
    V("How the 96 hours are organised",
      ["Lectures: 48 hours (Prof. Montella)", ["The ideas: information, numbers, Boolean algebra, logic networks, the processor, memory, input and output", "Every topic opens with a program you can run", "Then we formalise it with definitions, methods and proofs", "Each lecture closes with multiple-choice questions in the style of the midterm test", "Every four lectures a tutorial: the next part of Verm1, the game of the course"]],
      ["Laboratory: 48 hours (Prof. Staffa)", ["Number representation and conversion techniques", "Analysis, synthesis and minimisation of logic circuits", "RISC-V assembly programming on the PRG32 platform", "Your own project: a variant of Verm1, or a game of your invention"]]),

    H("A new approach", "You will write assembly from the first days. The theory comes after, to explain what you have already seen happen."),
    B("Program first. Formalise later.", "From day one you write RISC-V assembly that runs on a real processor. Each formal topic then answers a question that your own program has already raised."),
    F("The learning spiral, repeated for every topic", [
      "Play|Type a few instructions, build a cartridge, run it on PRG32",
      "Observe|Something happens: a number wraps, a bit lights a lamp, a rectangle moves",
      "Formalise|Definitions, theorems and methods explain exactly why",
      "Return|Back to the machine: predict the result before you run it",
    ], "A mark is an opinion; a paddle that leaves the screen is a fact. We will use facts, then explain them."),
    T("What the course aims at", [
      "Present the fundamental aspects of the architecture of modern computers",
      "Use, in the laboratory, the basic concepts for programming them efficiently in low-level languages: machine language and assembly",
      ["Treat rigorously the tools the processor is built from", ["Boolean algebra and the synthesis of combinational and sequential logic networks", "binary representation and binary arithmetic"]],
      "Describe in detail the functional and physical structure of the CPU, the memory and the input/output subsystem",
      "Develop assembly code that makes visible how a processor really works and how the basic units of a computer interact",
    ], null, { img: "game_pong.png", cap: "Pong running on PRG32: native RISC-V machine code" }),

    H("PRG32 and RISC-V", "The machine you will program, the ideas behind it, and why we chose it."),
    T("PRG32: a retro console you program in assembly", [
      "An open-source educational runtime for teaching RISC-V assembly and C, developed at Parthenope",
      "Your code runs natively as 32-bit RISC-V machine code (RV32IMAC): it is not interpreted by a simulator",
      ["A deliberately thin contract: three functions that you write", ["init runs once; update and draw run once per frame"]],
      "Games travel as small cartridges: files with the extension .prg32",
      "A 320 by 200 viewport, a joystick, sound: small enough to hold in your head, rich enough to exercise the whole course",
    ], "PRG32: https://github.com/riscv-prg32/PRG32 . Textbook: https://github.com/riscv-prg32/Playing-with-RISC-V_PRG32_textbook", { img: "menu_main.png", cap: "The PRG32 resident firmware menu" }),
    C("The philosophy behind PRG32", [
      ["Small enough to understand", "One processor, a screen of 320 by 200 pixels, a joystick, a small speaker. Nothing is hidden: you can hold the whole machine in your head."],
      ["Real, not simulated", "Your instructions are the ones the chip executes. What you learn here is true on every RISC-V processor, from a sensor to a supercomputer."],
      ["Limits make you creative", "A few kilobytes and three functions. The games of the 1980s were born from limits like these: a constraint is an invitation."],
      ["One thing at a time", "Start with functions that only return. Add one thing, run, look. Update changes the state, draw shows it. Sound comes last."],
      ["Look inside", "When something surprises you, stop the program and read registers and memory. The debugger is part of the method, not an emergency tool."],
      ["Make, then share", "A cartridge is a file you can give to a friend. The Cartridge Store is the shelf where finished work meets its players."],
    ], "The design principles are those of the PRG32 textbook: start with returns that do nothing; add one thing at a time; update changes state and draw renders it; sound comes last. The course follows them literally in the project."),
    V("One platform, two uses",
      ["A gymnasium: exercises", ["Every lecture opens with a short program that runs, and closes by going back to the machine", "An exercise has a prediction and a check: say what will happen, then run it", "The machine never flatters: a wrong mask lights the wrong lamp", "Small steps, immediate answers, no marks"]],
      ["A workshop: creativity", ["A blank cartridge and a screen: what you put on it is your choice", "Rules, colours, sounds and levels are design decisions, and they are yours", "The course project starts guided and ends free", "What you finish, you can publish"]],
      "PRG32 is not only the place where the exercises of the course run: it is a place to make things. Insist on the second column: first-year students rarely expect a course of architecture to ask them for an idea."),
    T("PRG32-QT: the debugger of the course", [
      "PRG32-QT is PRG32 on your laptop: it runs the same cartridges, with no board and no compiler",
      ["In debug mode it opens the machine", ["pause, resume, one instruction at a time", "breakpoints on any instruction of init, update or draw", "the 32 registers and 128 bytes of memory at any address", "speed from 0.01x to 4x, and counters: frames, instructions, late frames"]],
      "You will use it in every lecture: to check a prediction, to find a mistake, to measure",
      "A program is understood when you can say what each register will hold before you press Step",
    ], "Settings, Run cartridges in RISC-V debug mode. Lecture 01 installs it; the same cartridge also runs on the kit and on the QEMU emulator, and Lecture 01 compares the three. The debugger is used from Lecture 02 and systematically in the Verm1 tutorials: each one has a debugging section with a precise procedure.", { img: "prg32qt_debugger.png", cap: "PRG32-QT in debug mode: the game on the left, the machine on the right", wide: true }),
    C("Why RISC-V?", [
      ["Open", "RISC-V is an open standard instruction set: anyone may design, build and sell a RISC-V processor without paying a licence for the architecture."],
      ["Small", "The base integer instruction set has about forty instructions and thirty-two registers. You can learn all of it in one semester."],
      ["Real", "addi, lw, sw and beqz are not a teaching dialect. Industry ships billions of RISC-V cores that execute exactly these instructions."],
      ["European", "Europe treats RISC-V as a lever for technological sovereignty: the Chips Act and projects such as DARE build processors on it."],
    ], "DARE: Digital Autonomy with RISC-V in Europe, a EuroHPC Joint Undertaking project. See chapter 1 of the PRG32 textbook for the full argument and sources."),
    G("The map: you meet every topic twice", ["Formal topic", "You meet it first on PRG32 as..."], [
      ["Positional notation, hexadecimal", "the colour 0x07E0 and the value shown by the debugger"],
      ["Two's complement, overflow", "a position that moves left past zero and shows 0xFFFFFFFF"],
      ["Fixed and floating point", "a ball that moves 0.375 pixels per frame on a chip with no FPU"],
      ["Boolean algebra, bit masks", "andi t3, t0, 1 to test whether LEFT is pressed"],
      ["Electronics, logic gates", "the button that joins a pin of the chip to ground"],
      ["Combinational networks, adders", "what add actually does to thirty-two bits"],
      ["Sequential networks, registers", "the counter that survives from one frame to the next"],
      ["CPU, datapath, instruction cycle", "single-stepping one instruction in PRG32-QT"],
      ["Memory and input/output", "lw and sw, the stack, the joystick and the display"],
    ], "This table is the course in one slide. Come back to it at the start of each block.", { widths: [4.6, 7.6] }),

    H("The course project: Verm1", "One game, written from scratch in RISC-V assembly, that grows with the course."),
    T("Verm1: your game, from an empty file", [
      "Verm1, read \"vermone\", the big worm: a tribute to Snake, the game of Blockade (1976) and of the Nokia phones (1997)",
      "A worm moves on a grid, eats, grows, and must not bite itself",
      "You write every line, in RISC-V assembly: no engine, no library beyond the calls of PRG32",
      "Small enough for a first-year student, rich enough to need every topic of the course",
      "At the end it is ready for the Cartridge Store, with your name on it",
    ], "The project is the thread of the course: each part uses exactly what the four lectures before it have taught. The reference implementation of Verm1 was contributed by Giuseppe Coviello; its sources are in the verm1 folder of the course material and are built and played automatically by the tests.", { img: "verm1_p4_play.png", cap: "Verm1 at the end of the course" }),
    G("Four parts and a publication", ["Lecture", "After the block on", "Verm1 gains", "With"], [
      ["07  Part 1", "information and numbers", "a grid, a head that moves, a world without edges", "colours, shifts, fixed point"],
      ["12  Part 2", "logic and circuits", "steering, food, a score", "masks, XOR, tables"],
      ["17  Part 3", "state and memory", "a body that grows, collisions, three screens", "a state machine, arrays"],
      ["22  Part 4", "the machine", "digits, levels, sound, fast drawing", "calls, division, the frame buffer"],
      ["23  The Store", "the whole course", "a name, an icon, credits, a bundle", "the PRG32 tools"],
    ], "Every fifth deck is a tutorial. The numbers are those of the lectures: 07, 12, 17 and 22 for the four parts, 23 for the publication.", { widths: [1.9, 2.9, 5.0, 3.4], caption: "Each part ends with a game that runs. You never go home with a broken program." }),
    I("Verm1 grows with you", [["verm1_p1.png", "Part 1: a head"], ["verm1_p2.png", "Part 2: food and a score"], ["verm1_p3_play.png", "Part 3: a body"], ["verm1_p4_play.png", "Part 4: the finished game"]],
      "Screenshots taken from the reference programs by the automatic tests of the course material.", "The same file, four sittings. Each picture is a program that you will have written and run."),
    S("How a tutorial lecture works", [
      ["Self-contained", "The deck shows the whole program: every line is either new, changed, or reprinted unchanged"],
      ["Step by step", "A few lines at a time; after each step you build, run and compare with the expected result"],
      ["With the debugger", "Each tutorial has a session in PRG32-QT: a breakpoint, a register to watch, a region of memory to read"],
      ["Yours", "Each ends with changes to make by yourself: the game you publish should not be identical to ours"],
    ], "If a student's program does not work at the start of a tutorial, they start from the reference file of the previous part: nobody is left behind by a bug."),
    G("The course in blocks", ["Block", "Lectures", "Then"], [
      ["Start", "00 Introduction, 01 PRG32 and PRG32-QT: setting up, 02 First contact with RISC-V", ""],
      ["Information", "03 History, 04 Digital information, 05 Integers, 06 Reals", "07 Verm1, part 1"],
      ["Logic", "08 and 09 Boolean algebra, 10 Electronics, 11 Combinational machines", "12 Verm1, part 2"],
      ["State and memory", "13 Sequential machines, 14 Registers and buses, 15 Memory, 16 Permanent memory", "17 Verm1, part 3"],
      ["The machine", "18 Processor, 19 Instructions and interrupts, 20 Video card, 21 Input and output", "22 Verm1, part 4"],
      ["Publication", "", "23 Verm1 on the Cartridge Store"],
      ["Outlook", "24 Beyond one core: superscalar RISC-V, HPC, GPUs and FPGAs", "the visit to the computing systems"],
    ], "The order was chosen for learning: first what a bit means, then how bits are combined, then how they are remembered, then the machine that does all three; the processor comes before the devices it drives. After each block the project uses it. The last lecture is an outlook, before the visit to the Department's computing systems.", { widths: [2.4, 7.9, 2.9] }),

    H("Syllabus and learning outcomes", "What we study, and what you will be able to do at the end."),
    C("Syllabus", [
      ["Computer organisation", "Hardware and software; application and system software; the von Neumann model; operating principles of a computer."],
      ["Boolean algebra and logic", "Boolean functions, truth tables; combinational networks and minimisation; adders; finite-state machines; sequential networks; flip-flops, registers."],
      ["Data representation", "Encoding; redundant codes, error detection and correction; decoders, multiplexers; positional systems; naturals, integers, reals; arithmetic."],
      ["Structure of a computer", "CPU: control unit, ALU, registers; instruction cycle; datapath; main memory; I/O subsystem; microprogrammed architectures."],
      ["RISC-V assembly", "Instruction set; registers, addressing; arithmetic and logic; branches; subroutines, calling convention, stack; memory and I/O."],
      ["Project", "Verm1: a game in RISC-V assembly on PRG32, built in four guided parts, then varied, documented and packaged by the student or a small team."],
    ], "The detailed syllabus is in the Syllabus file available on U-GOV / Esse3 and on https://elearning.uniparthenope.it ."),
    C("Learning outcomes", [
      ["Knowledge and understanding", "A sound knowledge of the binary system, digital logic and the operating principles of computers. No previous computing background is assumed."],
      ["Applying knowledge", "Apply theory to exercises and to RISC-V assembly programs; recognise both the capabilities and the limits of computers on real problems."],
      ["Making judgements", "Write assembly programs that represent and process real problems in binary, choosing suitable data representations and control structures."],
      ["Communication skills", "Take an active part in teams that design, implement and document assembly applications, using correct technical terminology."],
      ["Learning skills", "Connect representation, logic networks and processors into one picture, and keep up to date independently from reliable technical sources."],
    ]),

    H("Organisation and assessment", "When we meet, how you are assessed, and the rules of the game."),
    G("Timetable: September to December 2026", ["Day", "Time", "Room", "Lecturer"], [
      ["Monday", "14:00 - 16:00", "Aula 1", "Montella"],
      ["Tuesday", "09:00 - 11:00", "Aula 1", "Staffa"],
      ["Wednesday", "09:00 - 11:00", "Aula 1", "Montella"],
      ["Friday", "09:00 - 11:00", "Aula 1", "Staffa"],
    ], "We will share an internal calendar with the actual distribution of lectures and laboratory sessions.", { widths: [3, 3, 3, 3], caption: "An internal calendar with the actual distribution of lectures and labs will be shared." }),
    T("One midterm test", [
      "Multiple choice, ten questions, plus two exercises: about 45 minutes, in person and on paper",
      ["Monday, date TBD, 14:00-16:00, Aula 1", ["Students may be split into groups and the test run in shifts"]],
      "Bring an identity document and a pen; know your institutional e-mail and your student number (transfer students without a number are excused)",
      "The test assesses both sides, you and us: we need it to know where we are going",
      "Every lecture ends with questions of the same kind: the best preparation is to answer them week by week",
    ], "One midterm from 2026/27 (there were two). The date is TBD: fill it in. The weight of the test is decided after evaluating the correct behaviour of the students in the room. Booking rules are not on the slide: say them in class if they apply.", { big: "10 + 2", label: "multiple-choice questions plus two exercises, on paper, in about 45 minutes" }),
    G("What the midterm covers", ["Block", "Lectures", "Topics"], [
      ["Information", "03 to 06", "history of computing; digital information; number representation: integers and reals"],
      ["Logic", "08 to 11", "Boolean algebra; electronics and logic gates; combinational machines"],
      ["State and memory", "13 to 16", "sequential machines: latches, flip-flops, state machines; registers and buses; memory and permanent storage"],
      ["Not in the midterm", "18 to 24", "the processor, instructions and interrupts, the video card, input and output, the outlook: part of the oral exam"],
    ], "From this year RISC-V instructions appear in the examples of the test: the first-contact material of Lecture 02 is assumed, and the code of Verm1, parts 1 to 3, is a natural source of questions. The midterm falls after the third block.", { widths: [2.7, 1.8, 8.5], hi: { 3: P.amberSoft }, caption: "The midterm closes the first three blocks. The machine, Lectures 18 to 21, is examined in the oral." }),
    B("No tech. No GPT.", "The midterm test and the exam are #nogpt. No technological or human help of any kind: no devices, no ChatGPT or other LLMs, no generative AI. Cheating cancels your test at once; more serious behaviour has more serious consequences.",
      "If more than two tests have to be cancelled for inadequate behaviour, the whole midterm is cancelled for everyone."),
    T("Assessment", [
      ["The exam has two parts and you must pass both", ["Theory (50%): oral, with impromptu questions on the whole syllabus; some answers need a diagram or a calculation on the board", "Practical (50%): the laboratory exam with Prof. Staffa"]],
      "The oral can also lower the mark obtained in the midterm test",
      "Final mark = mean of the theory mark and the practical mark",
    ], "Midterm and exam results are kept within the current academic year. The official syllabus describes the written part as exercises on the analysis and synthesis of logic networks and on RISC-V assembly development on PRG32. How the midterm enters the theory mark is said in class: the slide does not give a formula.", { big: "50 + 50", label: "theory and practice: two parts, and you must pass both" }),
    T("Exam sessions and finalisation", [
      "To finalise you need a positive mark in both theory and practice",
      "Finalisation happens only during a theory exam session",
      "The laboratory exam with Prof. Staffa is usually one week before the theory session",
      "Book both sessions on uniparthenope.esse3.cineca.it",
      ["Frequently asked", ["Can I take the theory exam before passing the practical one? Yes: the midterm result is kept for one academic year, but you finalise only after passing the practical part", "Can I book the theory session without the practical test? Yes, the case is the same"]],
    ], "Dates of the sessions were empty in the source deck: add them when published."),
    T("Midterm week and the closing event", [
      "During the midterm week, seminars on emerging computer architectures",
      "A student or a team that presents its game at the closing ceremony can earn bonus points for the exam: your variant of Verm1, or a game of your own",
      ["Closing of the course: date TBD, 09:00-13:00, Aula 1", ["09:00-11:00 the last lecture: beyond one core, from superscalar RISC-V to supercomputers", "11:00-13:00 visit to the supercomputing systems of the Department of Science and Technology"]],
      "Finished games can be published on the PRG32 Cartridge Store: Lecture 23 shows how",
    ], "The source deck still carried the 2025 dates (24-28 November, 19 December 2025) and spoke of an 8-bit architecture: both updated here, dates to be confirmed.", { img: "verm1_p4_play.png", cap: "Verm1: the game you can present, in your own variant" }),

    H("Material and first contact", "Where everything is, and a first look at who is in the room."),
    T("Teaching material", [
      ["Slides", ["always shared on Google Drive; periodically published on elearning.uniparthenope.it"]],
      ["PRG32 platform and textbook (free, open source)", ["github.com/riscv-prg32/PRG32", "Playing with RISC-V: Assembly, C, and Retro Games on the PRG32 Platform"]],
      ["Textbooks", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition", "Tanenbaum, Austin: Structured Computer Organization", "Also in the syllabus: Stallings, Computer Organization and Architecture; Bucci, Architettura dei calcolatori elettronici"]],
      "Official RISC-V documentation: riscv.org",
    ], "Drive folder: https://drive.google.com/drive/folders/15Kdu8XYbQQVP0ieuZA5OIEmoKqDjQ-eR?usp=sharing . E-learning: https://elearning.uniparthenope.it/course/view.php?id=107 . Italian editions: Tanenbaum, Austin, Architettura dei calcolatori. Un approccio strutturale (Pearson); Patterson, Hennessy, Struttura e progetto dei calcolatori: progettare con RISC-V (Zanichelli)."),
    T("Creative Commons and shared material", [
      "These slides and all the teaching material live in a Google Drive folder shared with the students, who can contribute",
      "Periodically the material is finalised and published on the Department e-learning portal",
      "To get access, send your Gmail address (or another address linked to the service) to raffaele.montella@uniparthenope.it",
      "All communication with the lecturer still goes through the institutional address @studenti.uniparthenope.it",
      "The slides are generated from source: corrections and new exercises are welcome as contributions",
    ], "The decks are built by tools/build.js from compact specifications in tools/decks, in English and in Italian; every slide has a tutorial note in the notes folder."),
    C("First contact: who are you?", [
      ["Hardware", "Who has assembled their own computer? Who has already played with an Arduino or an ESP32?"],
      ["Software", "How many programming languages do you know? Has anyone ever read a line of assembly?"],
      ["Culture", "What are retrocomputing and retrogaming? Have you ever visited a computer museum?"],
      ["Concepts", "Who can tell the difference between ROM, RAM and storage? What is cloud computing? And the Internet of Things?"],
      ["RISC-V", "Who has heard of RISC-V? Which processor is inside your phone, your laptop, your router?"],
      ["You", "Hobbies? Passions? Pastimes, besides studying?"],
    ], "Ice-breaker. Keep it quick; note the answers: they tell you how fast Lecture 02 can go."),
    D("The Sorting Hat (stage 1)", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.2, h.BOT - h.TOP, P.ink);
      h.img(s, "sorting_hat.png", h.MX + 0.15, h.TOP + 0.15, 4.9, h.BOT - h.TOP - 0.3);
      h.rows(s, ["A short questionnaire: what attracts you most in the future of computing and science?", "Scan the code or open the link from the shared folder", "Anonymous results are discussed in class and used to tune examples and projects"], 6.3, h.TOP, 6.4, 3.4);
      h.card(s, 6.3, 5.2, 6.4, 1.55, P.tealSoft);
      h.tx(s, "https://forms.office.com/Pages/ResponsePage.aspx\n?id=rhZ-ARX0jU-a8KIbV81EjtQ3ybGbf6pBqasTaUHJdQ1\nUQUFaVEdZMkZYWFI3S0dJWVlOMDVOSFBCTS4u", { x: 6.5, y: 5.3, w: 6.0, h: 1.35, fontSize: 12, fontFace: h.MONO, color: P.steel, valign: "middle" });
    }, "The picture carries the Italian prompt: 'Cosa ti attrae di più nel futuro dell'Informatica e della Scienza?'"),
    D("Cineforum: thirty films and series about computing", (s, h) => {
      const films = ["The Social Network (2010)", "Steve Jobs (2015)", "Pirates of Silicon Valley (1999)", "The Imitation Game (2014)", "Hackers (1995)", "Ex Machina (2014)", "Her (2013)", "Tron (1982)", "Tron: Legacy (2010)", "The Matrix (1999)",
        "WarGames (1983)", "Sneakers (1992)", "Jobs (2013)", "Antitrust (2001)", "Blackhat (2015)", "The Fifth Estate (2013)", "The Circle (2017)", "Silicon Valley (2014-2019)", "Source Code (2011)", "Chappie (2015)",
        "Mr. Robot (2015-2019)", "Ghost in the Shell (1995)", "Minority Report (2002)", "Transcendence (2014)", "Ready Player One (2018)", "A.I. Artificial Intelligence (2001)", "Revolt (2017)", "The Thirteenth Floor (1999)", "Eagle Eye (2008)", "Terminator 2: Judgment Day (1991)"];
      const cw = (h.CW - 0.6) / 3;
      for (let c = 0; c < 3; c++) {
        const x = h.MX + c * (cw + 0.3);
        h.card(s, x, h.TOP, cw, h.BOT - h.TOP);
        h.tx(s, films.slice(c * 10, c * 10 + 10).map((f, i) => ({ text: `${String(c * 10 + i + 1).padStart(2, " ")}.  ${f}`, options: { breakLine: i < 9 } })),
          { x: x + 0.3, y: h.TOP + 0.25, w: cw - 0.5, h: h.BOT - h.TOP - 0.5, fontSize: 16, paraSpaceAfter: 9, valign: "middle" });
      }
    }, "Ready Player One is also the cultural reference of the PRG32 textbook: fluency with the foundational layers is a literacy that keeps its value."),
    X("Before the next lecture: we install everything together", [
      "Bring your laptop, charged, with the right to install programs on it",
      "Download the PRG32-QT installer for your system: github.com/riscv-prg32/PRG32-QT, Releases",
      "At home, on a good connection, start the long download: ESP-IDF, following the README of github.com/riscv-prg32/PRG32 for your system",
      "If something fails, do not fight it alone: bring the error message, we solve it in class",
      "Send your address for the shared folder and fill in the Sorting Hat questionnaire",
    ], "You arrive at Lecture 01 with the downloads done. In two hours everyone leaves with PRG32-QT running and a cartridge built on their own laptop.",
      "Lecture 01 is the installation, step by step, for Windows, macOS and Linux. The only thing that cannot be done in class is the download of ESP-IDF: a few gigabytes per student."),
  ],
});
