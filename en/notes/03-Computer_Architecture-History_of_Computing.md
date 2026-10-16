# Lecture 03: History of Computing

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: what informatics is; the von Neumann architecture; RISC and an open ISA. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: Boolean algebra (Lecture 08). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: History of Computing

The previous lecture ran a RISC-V program; this one asks where that machine comes from. It is not a chronology to be memorised. The history is presented as a sequence of conceptual contributions, each adding one idea that is still embodied in the chip of the PRG32 kit: physical representation, mechanised procedure, the program as data, the reduced instruction set, the open standard. The epigraph is the canonical first program, from the book that introduced the C language: since then every programmer has begun by making a machine say hello, as the student did with HELLO PRG32.

## Slide 2: What you will be able to do by the end

Five learning outcomes. The first is conceptual: defining informatics and explaining why it is not the science of computers. The second and third are historical: placing the principal machines and people on a timeline, and naming the four units of the von Neumann architecture, which will be recognised in the machine already programmed. The fourth accounts for the name of the processor used in the course: what RISC means, and why RISC-V is open. The fifth situates the discipline among science, engineering and the economy.

## Slide 3: A definition

The definition has three components, each worth weighing. *Applied science*: informatics employs the results of the basic sciences to solve problems. *Treatment of information*: its object is information, not the machine. *Automated procedures*: the treatment is carried out by procedures that require no human judgement in their execution. The Italian word *informatica*, from the French *information automatique*, expresses this directly; the English *computer science* places the instrument in the name and invites a misunderstanding, which the remark attributed to Edsger Dijkstra corrects: computer science is no more about computers than astronomy is about telescopes.

## Slide 4: Two souls, one discipline

The discipline has two complementary dimensions. *Theoretical* informatics studies its foundations: what can be computed at all, at what cost, and by which algorithms, an algorithm being a finite set of operations that transforms an input A into an output B. *Applied* informatics builds the technologies and information systems that permeate the economy and society, and must manage their costs, among them the digital divide between those who have access and competence and those who do not. This course participates in both: Boolean algebra is theory, a cartridge is application, and the course is constructed so that each illuminates the other.

## Slide 5: Origins: the abacus and the Antikythera mechanism

Two ancient devices illustrate the first idea. In the abacus, Roman or Chinese, a number is a configuration of beads: the data are physically represented and the operations are movements of the hand. The Antikythera mechanism, built in Greece around the second or first century BC, goes further: a train of gears computes the positions of the Sun and the Moon and predicts eclipses. A number is the angle of a wheel, and the calculation is embodied in the ratios of the gears. The sentence beneath the pictures states the principle that the next lecture develops: representation precedes calculation.

## Slide 6: The medieval Islamic world (9th to 13th century)

Between the ninth and the thirteenth century the Islamic world contributes instruments, methods and vocabulary. Instruments: the astrolabe and the torquetum, for astronomy. Methods: al-Kindi devises frequency analysis, the first systematic technique of cryptanalysis. Machines: the automatic flute player of the Banu Musa brothers and the automata of al-Jazari are driven by interchangeable sequences, an early form of program. Vocabulary: *algorithm* derives from the name of al-Khwarizmi, and *algebra* from the title of his treatise.

## Slide 7: From 1600 to 1800: mechanical calculators and logic

Two lines of development run in parallel between 1600 and 1800. The first is mechanical calculation: Napier's logarithms, Pascal's machine that adds with automatic carry propagation, Leibniz's machine for the four operations. The second is logic: Leibniz describes binary arithmetic in 1703, and in 1854 Boole recasts logic as an algebra, the very algebra studied in Lectures 08 and 09. A third thread appears in 1804: Jacquard's loom weaves a pattern stored on punched cards. Changing the cards makes the same machine perform a different task, which is the essence of programmability.

## Slide 8: The 1800s: Charles Babbage and Ada Lovelace

Charles Babbage designs two machines. The Difference Engine computes mathematical tables automatically. The Analytical Engine is far more ambitious, and its components bear names that should already sound familiar: a *mill* that performs arithmetic, a control mechanism, a *store* that holds numbers, and an output device, with programs and data supplied on punched cards as in the loom. It was never completed. For it Ada Lovelace wrote a procedure to compute the Bernoulli numbers, published in 1843; on this ground she is regarded as the first programmer in history.

## Slide 9: Theory first: Turing, Shannon and Nakajima

The theory precedes the machines. In 1936 Alan Turing defines an abstract machine capable of carrying out any computation, and thereby gives a precise meaning to the notion of computability. In the 1930s Nakajima and Shannon show that Boolean algebra describes circuits built from switches; this is the bridge between logic and electronics on which all digital design rests, and the reason Boolean algebra occupies two lectures of this course. In 1941 Konrad Zuse completes the Z3, the first working program-controlled computer.

## Slide 10: John von Neumann: the stored-program computer

The central slide of the lecture. In 1945 von Neumann describes an architecture founded on one decisive idea: program and data reside in the same memory, so that a program is itself data. The diagram shows the four units: the memory; the control unit, which governs the sequence of operations; the arithmetic logic unit with its accumulator; and input and output. Lecture 02 can now be reread in these terms: the ALU executed `addi`, the memory held both `counter` and the instruction word 0x00130313, and the joystick and display are input and output. The chip of the kit remains, in its essentials, a von Neumann machine.

## Slide 11: Eight decades of computers

Eight decades in a single picture, from the machines of the Second World War to the computers embedded in everyday objects. Read from left to right, the captions trace a progressive change of scale: one machine for a nation, then for many users, then one per department, one per person, one in the pocket, and finally computers everywhere. Each decade made the computer smaller, cheaper and closer to its users. The sentence at the bottom draws the conclusion: none of these transitions altered the stored-program principle.

## Slide 12: Microprocessors: from CISC to RISC to an open standard

The table should be read as a debate between two philosophies of processor design. (Processors are built from *transistors*, tiny electronic switches; the next slide counts them.) The early microprocessors, and the x86 family introduced in 1978, follow the CISC approach: many instructions, some of considerable complexity. Around 1980 research groups at Berkeley and Stanford showed that a small number of simple, regular instructions yields faster machines; this is RISC, the reduced instruction set computer. ARM applied the approach to low-power design in 1985. In 2010 the fifth Berkeley design, RISC-V, took the further step of making the instruction set architecture an open standard, which Europe now regards as strategic.

## Slide 13: Moore's law in one number

A *transistor* is a tiny electronic switch, the building block of every chip (Lecture 10 shows how it works). In 1971 the Intel 4004, the first processor on a single chip, contained 2,300 of them; a contemporary laptop processor contains tens of billions, some ten million times as many. For five decades the number doubled approximately every two years. This is Moore's law, an empirical observation about an industry rather than a law of nature, and its physical limits are now close. When additional transistors no longer come without cost, performance must come from better architectures. This is why the subject of this course matters more today than it did twenty years ago.

## Slide 14: The home-computer spirit, on a modern open CPU

A comparison across forty years. The Commodore 64 had an 8-bit processor with three registers, a clock of about 1 MHz and 64 KB of memory; the ESP32-C6 has a 32-bit processor with thirty-two registers, a 160 MHz clock and a 4 GB address space. Yet the screen has the same resolution, 320 by 200 pixels, and the same spirit: a machine small enough to be understood entirely by one person. The difference most relevant to the student lies in the row of the instruction set: proprietary then, an open standard now.

## Slide 15: Where informatics sits

A storm followed from left to right illustrates the position of informatics. It is first a natural phenomenon. Physics and mathematics describe it by equations. Informatics turns the equations into algorithms and simulations. Engineering supplies the supercomputers, networks and sensors that execute them reliably. The economy receives forecasts and services of value to people. Informatics is the indispensable middle link: without it the equations remain on paper. The example is not hypothetical: the weather and sea forecasts of the Department are produced daily in exactly this way.

## Slide 16: High-performance computing at Parthenope

The pictures show the racks of the University's Research Computing Facilities, their daily product, the forecasts of meteo@uniparthenope, and the page listing the machines. A cluster is a collection of computers cooperating on a single problem. The concepts are those practised on the kit, namely registers, memory and instructions, at a vastly greater scale and with the additional problem of coordinating the parts. Lecture 24 returns to these machines, and the closing event of the course includes a visit to them.

## Slide 17: Check your understanding: Which idea is the heart of the von Neumann architecture? / What makes RISC-V different from x86 and ARM?

For the first question one should look for the defining idea rather than a detail. The number of registers and the duration of an instruction vary between processors, and input and output are one of the four units, not an option. What defines the architecture is that instructions reside in the same memory as data and are fetched and executed in sequence.

For the second, speed is a property of a particular chip, not of an instruction set, and RISC-V was not the first RISC design: Berkeley RISC, MIPS and ARM preceded it. Nor is it confined to microcontrollers. What is new is the licence: the instruction set is an open standard that anyone may implement.

## Slide 18: Check your understanding: Who is regarded as the first programmer in history?

All four names belong to the history, in different roles. Babbage designed the machine. Turing defined computation, a century later. Zuse built the first working programmable computer. The person who wrote a procedure for a machine, and published it in 1843, is Ada Lovelace.

## Slide 19: Glossary: English and Italian

Ten terms. Italian has two words for the machine, *calcolatore* and *elaboratore*, both older than the borrowed *computer*. *Stored program* names von Neumann's idea. The *control unit* and the *arithmetic logic unit*, ALU, are two of the four units, and reappear in the lectures on the processor. *High-performance computing*, HPC, is the field of the clusters just shown.

## Slide 20: Conclusions and reading

Four conclusions. Computing is older than electronics: representation and procedure came first. The stored-program computer of 1945 is the machine still programmed today. RISC made processors simple enough to be understood as a whole, and RISC-V made them open. And informatics is pervasive, because information belongs to every field. The readings develop the same history at greater length. The next lecture takes the first formal step: how information becomes bits.
