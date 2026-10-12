# Lecture 03: History of Computing

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: History of Computing

Last time you ran a RISC-V program. This lecture asks where that machine comes from. It is not a list of dates to memorise: each stage of the story adds one idea, and every one of those ideas is still inside the chip of the PRG32 kit. The quotation on the cover is the most famous first program, from the book that introduced the C language: every programmer since has started by making a machine say hello, as you did with HELLO PRG32.

## Slide 2: What you will be able to do by the end

Five objectives. The first is a definition: what informatics is, and why it is not the science of computers. The second and third are historical: placing the main machines and people on a timeline, and naming the four units of the von Neumann architecture, which you will find again in the machine you programmed. The fourth explains the name of our processor: what RISC means, and why RISC-V is open. The fifth places the discipline between science, engineering and the economy.

## Slide 3: What is informatics?

Before the history, the subject itself. What do we mean by informatics? Three slides give a definition, a famous warning about what it is not, and the two souls of the discipline.

## Slide 4: A definition

The definition has three parts worth weighing. *Applied science*: it uses the results of the basic sciences to solve problems. *Treatment of information*: the object is information, not the machine. *Automated procedures*: the treatment is done by procedures that can be carried out without human judgement. The Italian word *informatica* says it directly, from the French *information automatique*. English prefers *computer science*, which puts the instrument in the name and creates the misunderstanding that the next slide corrects.

## Slide 5: Computer science is no more about computers than astronomy is about telescopes.

The sentence attributed to Dijkstra compares the computer to the telescope: an astronomer studies the sky, not the instrument. In the same way informatics studies information and the procedures that transform it. So why does this course look so closely at the instrument? Because an instrument that you do not understand limits what you can do with it. We open the machine so that it stops being a mystery, and you can then use it with judgement.

## Slide 6: Two souls, one discipline

The discipline has two souls. *Theoretical* informatics studies the foundations: what can be computed at all, at what cost, and with which algorithms, where an algorithm is a finite set of operations that transforms A into B. *Applied* informatics builds the technologies and the information systems that run through the economy and society, with a cost to manage: the digital divide between those who have access and skills and those who do not. This course belongs to both: Boolean algebra is theory, a cartridge is application.

## Slide 7: Before electricity

The story begins long before electricity. For three thousand years people have built devices to help them calculate. Watch for two ideas that recur in the next slides: how a number is *represented* in a physical object, and how a sequence of operations is *prescribed* to a machine.

## Slide 8: Origins: the abacus and the Antikythera mechanism

Two ancient devices. In the abacus, Roman or Chinese, a number is a position of beads: the data are physically represented, and the operations are movements of the hand. The Antikythera mechanism, built in Greece around the second or first century BC, goes further: a train of gears computes the positions of the Sun and the Moon and predicts eclipses. A number is the angle of a wheel, and the calculation is built into the ratios of the gears. Keep the sentence under the pictures: representation comes before calculation.

## Slide 9: The medieval Islamic world (9th to 13th century)

Between the ninth and the thirteenth century the Islamic world contributes instruments, methods and words. Instruments: the astrolabe and the torquetum, for astronomy. Methods: al-Kindi invents frequency analysis, the first systematic technique for breaking a cipher. Machines: the automatic flute player of the Banu Musa brothers and the automata of al-Jazari are driven by sequences that can be changed, an early form of program. And words: *algorithm* comes from the name of al-Khwarizmi, *algebra* from the title of his book.

## Slide 10: From 1600 to 1800: mechanical calculators and logic

Two lines of development run in parallel from 1600 to 1800. The first is mechanical calculation: Napier's logarithms, Pascal's machine that adds with an automatic carry, Leibniz's machine for the four operations. The second is logic: Leibniz describes binary arithmetic in 1703, and in 1854 Boole turns logic into an algebra, the one you will study in Lectures 08 and 09. A third thread appears in 1804: Jacquard's loom weaves a pattern stored on punched cards. Change the cards and the same machine does something else.

## Slide 11: The 1800s: Charles Babbage and Ada Lovelace

Charles Babbage designs two machines. The Difference Engine computes mathematical tables automatically. The Analytical Engine is far more ambitious, and its parts have names that should already sound familiar: a *mill* that does the arithmetic, a control unit, a *store* that holds numbers, an output device; programs and data arrive on punched cards, as in the loom. It was never completed. Ada Lovelace wrote for it a method to compute Bernoulli numbers, published in 1843: for this she is regarded as the first programmer in history.

## Slide 12: The twentieth century

In the twentieth century the idea of a universal machine is first defined on paper and then built. Three slides: the theory, the architecture that carries von Neumann's name, and eight decades of machines.

## Slide 13: Theory first: Turing, Shannon and Nakajima

The theory comes before the machines. In 1936 Alan Turing defines an abstract machine that can carry out any computation, and with it the very notion of what is computable. In the 1930s Nakajima and Shannon show that Boolean algebra describes circuits made of switches: this is the bridge between logic and electronics on which all digital design rests, and it is the reason why you will study Boolean algebra. In 1941 Konrad Zuse completes the Z3, the first working computer controlled by a program.

## Slide 14: John von Neumann: the stored-program computer

The central slide of the lecture. In 1945 von Neumann describes an architecture with one decisive idea: program and data are kept in the same memory, so a program is itself data. The diagram shows the four units: the memory, the control unit that governs the sequence of operations, the arithmetic logic unit with its accumulator, and input and output. Now look back at Lecture 02: the ALU executed `addi`, the memory held both `counter` and the instruction 0x00130313, the joystick and the display are input and output. The chip of the kit is still a von Neumann machine.

## Slide 15: Eight decades of computers

Eight decades in one picture, from the machines of the war to the computers hidden in everyday objects. Read the captions from left to right: one machine for a whole country, then for many users, then one per department, one per person, one in the pocket, and finally computers everywhere. Each decade made the computer smaller, cheaper and closer to people. The sentence at the bottom is the point: none of these steps changed the idea of the stored program.

## Slide 16: From home computers to RISC-V

The last part of the story explains the processor of the kit. Why does it have a few simple instructions? Why is its instruction set open? And what does it have in common with the home computers of forty years ago?

## Slide 17: Microprocessors: from CISC to RISC to an open standard

Read the table as a debate between two ways of designing a processor. The first microprocessors, and the x86 family born in 1978, follow the CISC approach: many instructions, some very complex. Around 1980 Berkeley and Stanford show that few, simple, regular instructions make faster machines: this is RISC, a reduced instruction set. ARM applies it to low power in 1985. In 2010 the fifth Berkeley design, RISC-V, takes the further step of making the instruction set an open standard, which Europe now treats as strategic.

## Slide 18: Moore's law in one number

In 1971 the Intel 4004 had 2,300 transistors; a laptop processor today has tens of billions, ten million times as many. For fifty years the number doubled about every two years. This is Moore's law, which is an observation about an industry and not a law of nature, and its physical limits are now close. When more transistors no longer come for free, progress must come from better architectures. That is why the subject of this course matters more today than twenty years ago.

## Slide 19: The home-computer spirit, on a modern open CPU

A comparison across forty years. The Commodore 64 had an 8-bit processor with three registers, a clock of about 1 MHz and 64 KB of memory; the ESP32-C6 has 32 bits, thirty-two registers, 160 MHz and an address space of 4 GB. Yet the screen is the same size, 320 by 200 pixels, and so is the spirit: a machine small enough for one person to understand entirely. The difference that matters to you is in the row of the instruction set: proprietary then, an open standard now.

## Slide 20: Retro games as specimens

Pong, Breakout, Tetris and Asteroids are example cartridges of PRG32. They are used in this course as specimens, the way a biologist uses a simple organism: each is small enough to be read entirely, and yet contains everything that matters in a program: state, input, arithmetic, decisions and a loop. When you later study a topic, ask yourself where it appears in one of these games.

## Slide 21: Informatics as an applied science

The lecture closes by placing informatics among the other disciplines, with an example that comes from this Department.

## Slide 22: Where informatics sits

Follow a storm from left to right. It is first a natural phenomenon. Physics and mathematics describe it with equations. Informatics turns the equations into algorithms and simulations. Engineering provides the supercomputers, networks and sensors that run them reliably. The economy receives forecasts and services that have value for people. Informatics is the link in the middle: without it the equations stay on paper. The example is real: the weather and sea forecasts of the Department are computed every day in this way.

## Slide 23: High-performance computing at Parthenope

The pictures show a teaching cluster of the University and the page of its research computing facilities. A cluster is many computers that work together on one problem. The ideas are those you practise on the kit: registers, memory, instructions, only in far greater number and with the added problem of making the parts cooperate. The last lecture of the course returns to these machines, and the closing event includes a visit to them.

## Slide 24: Check your understanding: Which idea is the heart of the von Neumann architecture?

Look for the idea, not for a detail. The number of registers and the duration of an instruction vary from one processor to another, and input and output are one of the four units, not an option. What defines the architecture is that instructions are kept in the same memory as data, and are fetched and executed one after another.

## Slide 25: Check your understanding: What makes RISC-V different from x86 and ARM?

Speed is a property of a particular chip, not of an instruction set, and RISC-V was not the first RISC: Berkeley RISC, MIPS and ARM came before. Nor is it limited to microcontrollers. What is new is the licence: the instruction set is an open standard that anyone may implement.

## Slide 26: Check your understanding: Who is regarded as the first programmer in history?

All four names belong to the story, with different roles. Babbage designed the machine. Turing defined computation, a century later. Zuse built the first working programmable computer. The person who wrote a procedure for a machine, and published it in 1843, is Ada Lovelace.

## Slide 27: Exercises: paper first, then PRG32

Three exercises. The first asks you to draw the four units and to place in each something from the program of Lecture 02: it checks that the architecture is not an abstract diagram for you. The second asks you to classify six inventions as ways of *representing* information or of *prescribing* operations; the stored program is the interesting case, because it unifies the two. The third is on the machine: use the counters of the debugger to compare how many instructions two games execute per frame.

## Slide 28: Glossary: English and Italian

Ten terms. Note that Italian has two words for the machine, *calcolatore* and *elaboratore*, both older than the borrowed *computer*. *Stored program* is the idea of von Neumann. The *control unit* and the *arithmetic logic unit*, ALU, are two of the four units, and you will meet them again in the lectures on the processor. *High-performance computing*, HPC, is the field of the clusters you have just seen.

## Slide 29: Conclusions and reading

Four conclusions. Computing is older than electronics: representation and procedure came first. The stored-program computer of 1945 is the machine we still program. RISC made processors simple enough to be understood whole, and RISC-V made them open. And informatics is everywhere, because information belongs to every field. The readings give the same story at greater length. The next lecture takes the first formal step: how information becomes bits.
