# Lecture 00: Course Introduction

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the program-first method; the rules of the course. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: the pieces of PRG32 (Lecture 01); RISC and an open ISA (Lecture 03); the Verm1 project (Lecture 07). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Course Introduction

This first lecture teaches no technical topic. It sets out how the course works: its method, the machine on which every idea is tried, the project that runs through the semester, and the rules of the examination. The course assumes no previous experience: most students in the room have never written a *program*, a list of *instructions*, small and exact orders, that a computer carries out one after the other. The material is written for them. Every technical word is explained the first time it appears, in these notes or on the slide. The epigraph from *The Matrix* states the idea behind the course: a computer is a system, and a system whose parts one can open, name and reason about stops being a mystery. The subtitle, *program first, formalise later*, is the method of the whole course; the slides that follow are its consequences.

## Slide 2: Today

The lecture has five parts: the people and the hours, the approach, the machine, the project, and the rules. The order is deliberate. The rules make sense only once one knows what the course asks, and what it asks follows from its method, so the method comes first. One word on the slide may be new. A *debugger* is a tool that lets one watch a program while it runs, stop it, and look inside the machine; the course uses one every week. Students who want to know about the examination will find it in the last part.

## Slide 3: The course at a glance

The course carries 12 ECTS credits, that is, 96 hours, divided equally between lectures (Prof. Montella) and laboratory (Prof. Staffa): two instructors, one course, one final mark. There are no prerequisites, and this is meant literally. No previous programming and no knowledge of how a computer is built are assumed; everything needed is taught here, starting from the words themselves. What is required is curiosity about how a computer really works, and regular work: a little every week is far more effective than a lot at the end. Office hours and the Teams code should be noted at once; a question asked in the first weeks is the cheapest to answer.

## Slide 4: Program first. Formalise later.

The method in one sentence. A *processor* is the part of a computer that does the work: it executes *instructions*, small and exact orders such as "add these two numbers". *Assembly* is a way of writing those instructions as short words, one instruction per line, instead of as numbers. *Program first* means that from the first week students write RISC-V assembly, and a real processor executes it. *Formalise later* means that the theory, definitions, rules and methods, comes afterwards, as the answer to something the student has already seen happen. The reason is simple: an explanation sticks much better when it answers a question one has already asked. Nothing of the theory is left out, and all of it is examined. It just comes second.

## Slide 5: The learning spiral, repeated for every topic

Every topic goes round the same four steps. *Play*: write a few instructions and run them. *Observe*: the machine does something one did not quite expect. For instance, a counter that goes below zero shows 0xFFFFFFFF instead of -1. (A number starting with `0x` is written in *hexadecimal*, base sixteen; Lecture 02 shows how to read it.) Or a *bit*, a single *binary* digit that is either 0 or 1, lights a lamp on the screen. *Formalise*: the lecture gives the rule that explains it; here, *two's complement*, the way computers store negative numbers, taught in Lecture 05. *Return*: go back to the machine and predict the result before running it. The fourth step is the test of understanding. A correct prediction shows the rule is understood; a wrong one is caught at once by the machine, and costs nothing. A *cartridge*, mentioned on the slide, is a finished program packed in one file, like the cartridges of old game consoles.

## Slide 6: What the course aims at

These are the aims written in the official syllabus, and they follow one from the other. First, the basic ideas of how computers are organised. Then the *low-level languages*: *machine language*, the numbers that the processor actually reads, and *assembly*, the same instructions written as words. Then the mathematics a processor is built from: *Boolean algebra*, the algebra of true and false, and *binary* arithmetic, counting with only the digits 0 and 1. With these one designs *logic networks*, circuits that compute an answer from their inputs (*combinational*) or that also remember (*sequential*). Then the structure of the processor, of the *memory*, where programs and data are kept, and of input and output. Finally assembly code, where all these layers can be seen at once. The picture is Pong on PRG32: a few hundred instructions, every one of which students will be able to read by the end.

## Slide 7: PRG32: a retro console you program in assembly

PRG32 is a small game console that one programs in assembly or in C, another programming language. Some words on the slide need a gloss. *Open source* means that its *source code*, the text of the program as people write it, is public: anyone may read, use and improve it. The *firmware* is the program that the console runs from the moment it is switched on; the *runtime* is the part of it that stays on the machine and runs the student's game. *Machine code* is the program in the numeric form that the processor reads; RV32IMAC names the *instruction set*, the list of instructions that this particular processor understands. *Interpreted by a simulator* would mean that another program imitates the processor; on PRG32, instead, the code runs directly. The game is written as three *functions*, named pieces of program: `init` runs once, while `update` and `draw` run once per *frame*, that is, for every picture shown on the screen. A finished game is a *cartridge*, a small file ending in `.prg32`. The screen measures 320 by 200 *pixels*, the coloured dots that make up a picture: few enough to reason about every one of them.

## Slide 8: PRG32-QT: the debugger of the course

PRG32-QT is PRG32 as an application on one's own laptop. It runs the same cartridges, without the board and without a *compiler*, the program that translates source code into machine code. It is an *emulator*: a program that imitates the processor of the console in software, instruction by instruction. Its debug mode opens the machine. The program can be paused and resumed, or advanced one instruction at a time. A *breakpoint* is a mark on an instruction that stops the program when it gets there. A *register* is one of 32 small storage cells inside the processor, each holding a 32-bit number; the processor computes only on registers. *Memory* is a much larger row of cells, each holding one *byte*, eight bits, and each with a number, its *address*. PRG32-QT shows the registers and 128 bytes of memory at any address, and can slow a game down to a hundredth of its speed. The last line of the slide is the practical test of understanding used throughout the course: being able to say what each register will hold before pressing Step.

## Slide 9: Why RISC-V?

Four reasons explain the choice of RISC-V. It is *open*: the instruction set is a public standard, and anyone may build a RISC-V processor without paying a licence. It is *small*: about forty basic instructions and thirty-two registers, few enough to learn completely in one semester. It is *real*: the instructions on the slide, `addi`, `lw`, `sw`, `beqz`, are executed by billions of commercial devices, so nothing learned here is a toy. And it is *strategic*: European projects build their own processors on it. For a beginner the second reason matters most: by the end of the course students will know the whole basic instruction set, not a selection of it.

## Slide 10: The map: you meet every topic twice

This table is the whole course on one page. The left column lists the theory; the right column says where each topic is first met on the machine, as something one sees happen. Many words in the left column are new, and that is expected: each is the title of a lecture, and the table only shows where it will come. Two examples. Two's complement, how negative numbers are stored, first appears as a position that moves left past zero. Sequential networks, circuits that remember, first appear as a counter that keeps its value from one frame to the next. The *stack*, further down, is an area of memory where a function keeps its temporary values (Lecture 18). The table is worth looking at again at the start of each block, and it makes a good checklist for revision.

## Slide 11: Verm1: your game, from an empty file

The course project is Verm1, pronounced "vermone", the big worm: a tribute to Snake, in which a worm moves on a grid, eats, grows, and must not bite itself. The rules fit in one sentence, yet writing it uses nearly every topic of the course: numbers for the positions, logic for the controls, memory for the body, functions and division for the score. Students write every line themselves. There is no game engine, only a handful of PRG32 calls, ready-made functions that draw a rectangle, read the buttons or play a note. The finished game carries its author's name.

## Slide 12: Four parts and a publication

The project grows in four parts and a publication; each part comes right after the lectures it uses. Part 1 (Lecture 07) uses numbers: a grid and a head that moves. Part 2 (Lecture 12) uses logic: steering, food and a score. Part 3 (Lecture 17) uses state and memory: a body that grows, collisions, and three screens. Part 4 (Lecture 22) uses the organisation of the machine: digits on the screen, levels and fast drawing. Lecture 23 publishes the game on the Cartridge Store. The right column names the techniques; words such as *array*, a row of values of the same kind kept one after the other in memory, are explained in the lecture that uses them. The caption states the rule that matters most: every part ends with a game that runs.

## Slide 13: The course in blocks

The calendar of the course, in blocks. After the three opening lectures come four blocks of four lectures each. *Information*: what a bit means, and how numbers are written with bits. *Logic*: how bits are combined. *State and memory*: how bits are kept. *The machine*: the processor and its devices. Each block ends with a part of Verm1; Lecture 23 publishes the game and Lecture 24 looks at faster machines. Most lecture titles on the slide, from bus to interrupt to FPGA, are names of things not yet met: each is explained in its own lecture, and nothing here needs to be understood today. The lecture numbers on this slide are used everywhere in the material, so a reference such as "Lecture 13" can always be found here.

## Slide 14: Timetable: September to December 2026

The course meets four times a week from September to December, always in Aula 1: Monday afternoon and Wednesday morning with Prof. Montella, Tuesday and Friday morning with Prof. Staffa. Lectures and laboratory do not alternate in a fixed pattern. An internal calendar, shared with the class, gives the real plan week by week; that calendar, not this table alone, says what to prepare for a given day.

## Slide 15: One midterm test

There is one midterm test: ten multiple-choice questions and two exercises, on paper, in about 45 minutes. Bring an identity document and a pen, and know your institutional e-mail address and your student number. The test has two purposes: it measures each student's progress, and it tells the instructors how the course is going. Preparation is built into the lectures, each of which ends with questions of exactly this kind. Answering them week by week takes a few minutes; leaving them all to the night before does not work.

## Slide 16: No tech. No GPT.

The rule for the midterm and the final examination is short: no devices and no help of any kind, human or artificial. That includes ChatGPT, other large language models, and every other form of generative AI. Copying cancels the test at once. The rule is not hostility towards technology, which the course uses every day; it follows from what a test is for. A test measures what the candidate knows. An answer produced by someone or something else measures nothing and helps nobody, least of all the candidate.

## Slide 17: Assessment

The examination has two parts, and both must be passed. The theory part is an oral examination on the whole syllabus, where some answers need a diagram or a calculation at the board. The practical part is the laboratory examination with Prof. Staffa. Each counts for half, and the final mark is their average. The oral can also lower the mark of the midterm: the midterm is a real result, not a guarantee. How the midterm enters the theory mark is explained in class.

## Slide 18: Exam sessions and finalisation

The final mark is recorded only when both parts have been passed, and only during a theory session; the laboratory examination usually comes about a week before it. Both must be booked on Esse3, the university's online system. The two most frequent questions have the same answer: the theory part may be taken before the practical one, and its result is kept for the academic year, but nothing is recorded until both are passed. It is best to plan the two examinations together.

## Slide 19: Teaching material

The material comes from four places. The slides are in a shared Google Drive folder and are published from time to time on the e-learning portal. PRG32 and its textbook, *Playing with RISC-V*, are free and open source on GitHub, a website that hosts the source code of many projects. The reference textbooks are Patterson and Hennessy, *Computer Organization and Design*, RISC-V edition, and Tanenbaum and Austin, *Structured Computer Organization*; both exist in Italian. The official documentation of RISC-V is at riscv.org. Nothing has to be bought on the first day: the slides and the PRG32 material are enough until the theory begins, and at that point one textbook should be chosen.

## Slide 20: First contact: who are you?

Six groups of questions open the conversation: hardware, software, culture, concepts, RISC-V, and the students themselves. There are no right answers and nothing is assessed. The purpose is to find out where the class starts. Students who have never built a computer or read a line of assembly are the majority, and they are exactly where the course expects them to be: it starts from zero. Those who have will find chances to help their neighbours, which is itself one of the best ways to learn. *Hardware* means the physical parts of a computer; *software* means the programs that run on it.
