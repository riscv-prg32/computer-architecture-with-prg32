# Lecture 00: Course Introduction

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the program-first method; the rules of the course. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: the pieces of PRG32 (Lecture 01); RISC and an open ISA (Lecture 03); the Verm1 project (Lecture 07). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Course Introduction

This opening lecture introduces no technical topic. Its purpose is to set out the terms of the course: the method by which it proceeds, the machine on which its ideas are tested, the project that runs through it, and the rules by which learning is assessed. The epigraph from *The Matrix* states the underlying conviction: a computer is a system, and a system whose parts can be opened, named and reasoned about ceases to be opaque. The subtitle, *program first, formalise later*, is the methodological thesis of the whole course, and the remaining slides should be read as its consequences.

## Slide 2: Today

The lecture is organised in five parts: the people and the hours, the approach, the machine, the project, and the rules. The order is deliberate. A set of rules can be judged only once one knows what the course demands, and what it demands follows from its method; hence the method precedes the regulations. Students who wish to go straight to the examination will find it treated completely in the last part. The list may be used as a map during the lecture and, later, as an index when consulting the slides.

## Slide 3: The course at a glance

The course carries 12 ECTS credits, corresponding to 96 hours, divided equally between lectures (Prof. Montella) and laboratory (Prof. Staffa): two instructors, one course, one final mark. There are no formal prerequisites, and the statement is meant literally: no prior programming experience is assumed. What is required is a sustained curiosity about how a computer actually works. Office hours and the Teams code should be noted at once; questions raised in the first weeks are the least costly to resolve.

## Slide 4: Program first. Formalise later.

The method in one sentence. *Program first* means that, from the first week, students write RISC-V instructions that a physical processor executes. *Formalise later* means that definitions and theorems enter as answers: each explains a phenomenon that the student's own program has already exhibited. The ordering rests on a well-established observation in learning: a question one has encountered personally gives the subsequent answer a place to attach to. Nothing is removed from the theory; it is presented in full and it is examined. It simply arrives second.

## Slide 5: The learning spiral, repeated for every topic

Every topic traverses the same four phases. *Play*: a few instructions are written and executed. *Observe*: the machine produces an effect that was not fully anticipated, for instance a counter that, decremented past zero, displays 0xFFFFFFFF. *Formalise*: the lecture supplies the rule that accounts for the effect, here two's complement representation. *Return*: one goes back to the machine and predicts the outcome before running the program. The fourth phase is the criterion of understanding. A correct prediction shows that the rule has been grasped; an incorrect one is refuted immediately by the machine, at no cost.

## Slide 6: What the course aims at

These are the aims stated in the official syllabus, and they form a chain. First, the fundamental aspects of computer architecture; then the low-level languages, machine language and assembly, through which a machine is programmed; then the formal tools from which a processor is constructed, namely Boolean algebra and binary arithmetic; then the organisation of processor, memory and input/output; and finally assembly code, in which all these layers become visible at once. The illustration is Pong running on PRG32: a program of a few hundred instructions, every one of which the student will be able to read by the end of the course.

## Slide 7: PRG32: a retro console you program in assembly

PRG32 is a small game console programmed in assembly or in C. Three properties are essential. First, the student's code is genuine machine code for a 32-bit RISC-V processor implementing the RV32IMAC instruction set: it is executed, not interpreted or imitated. Second, the interface between a program and the machine is a contract of three functions written by the student: `init`, executed once, and `update` and `draw`, executed once per frame. Third, a finished program is a *cartridge*, a single small file with the extension `.prg32`. The display measures 320 by 200 pixels, small enough for every pixel to be the object of reasoning.

## Slide 8: PRG32-QT: the debugger of the course

PRG32-QT is PRG32 as a desktop application: it executes the same cartridges without any hardware. In debug mode it exposes the state of the machine while the game runs: execution can be paused, advanced one instruction at a time, stopped at a breakpoint; the 32 registers and any window of 128 bytes of memory can be inspected; and the program can be slowed to one hundredth of its speed. The final line of the slide deserves to be taken as an operational definition: a program is understood when one can state the content of each register before pressing Step.

## Slide 9: Why RISC-V?

Four arguments motivate the choice of RISC-V. It is *open*: the instruction set architecture is a public standard that anyone may implement without licence fees. It is *small*: roughly forty base instructions and thirty-two general-purpose registers, a body of knowledge that a single semester can cover exhaustively. It is *real*: these instructions are executed by billions of commercial devices, so nothing learned here is a pedagogical artefact. And it is *strategic*: European initiatives build their own processors upon it. The second argument has the most direct consequence for the student, who will master the complete base instruction set rather than a selection of it.

## Slide 10: The map: you meet every topic twice

This table is the course on a single page. The left column lists the formal topics; the right column identifies where each is first encountered experimentally, on the machine. Two's complement appears as a position that moves left past zero; Boolean algebra as the test of a button; sequential networks as a counter that persists from one frame to the next. Every topic is thus met twice, first as a phenomenon and then as a theory. The table is worth revisiting at the start of each block, because it states which experience the forthcoming theory will explain, and it serves as a checklist for revision.

## Slide 11: Verm1: your game, from an empty file

The course project is Verm1, pronounced "vermone", the big worm: a tribute to Snake, in which a worm moves on a grid, eats, grows, and must not collide with itself. The rules fit in one sentence, yet the implementation draws on nearly every topic of the course: numerical representation for positions, Boolean logic for the controls, memory organisation for the body, procedure calls and division for the score. Every line is written by the student; there is no game engine, only the handful of PRG32 calls that draw a rectangle, read the buttons or play a note. The finished game bears its author's name.

## Slide 12: Four parts and a publication

The project unfolds in four parts and a publication, each part following the block of lectures whose content it applies. Part 1 (Lecture 07) applies numerical representation: a grid and a head that moves. Part 2 (Lecture 12) applies logic: steering, food and a score. Part 3 (Lecture 17) applies state and memory: a body, collisions and three screens. Part 4 (Lecture 22) applies the organisation of the machine: decimal digits, levels and efficient drawing. Lecture 23 packages the game for the Cartridge Store. The caption states the invariant that matters most: every part ends with a game that runs.

## Slide 13: The course in blocks

The calendar of the course, organised in blocks. After the three opening lectures come four blocks of four lectures: *Information* (what a bit means), *Logic* (how bits are combined), *State and memory* (how bits are retained) and *The machine* (the processor and its devices). Each block is followed by a part of Verm1; Lecture 23 publishes the game and Lecture 24 looks beyond the single core. The lecture numbers on this slide are those used throughout the material, so that a reference such as "Lecture 13" can always be located here.

## Slide 14: Timetable: September to December 2026

The course meets four times a week from September to December, always in Aula 1: Monday afternoon and Wednesday morning with Prof. Montella, Tuesday and Friday morning with Prof. Staffa. Lectures and laboratory sessions do not alternate rigidly; an internal calendar, shared with the class, gives the actual distribution week by week. That calendar, rather than this table alone, should be consulted when deciding what to prepare for a given day.

## Slide 15: One midterm test

There is a single midterm test, consisting of ten multiple-choice questions and two exercises, taken on paper in about 45 minutes. Students must bring an identity document and a pen, and know their institutional e-mail address and student number. The test serves two purposes at once: it measures each student's progress and it measures the progress of the course. Preparation is built into the lectures, each of which closes with questions of exactly this type. Answering them week by week costs a few minutes; deferring them all to the night before is ineffective.

## Slide 16: No tech. No GPT.

The rule for the midterm and the final examination is brief: no devices and no assistance of any kind, human or artificial, including ChatGPT, other large language models and all forms of generative AI. Copying annuls the test immediately. The rule does not express hostility towards technology, which the course uses daily; it follows from the purpose of an assessment. An examination measures what the candidate knows; an answer produced by another agent measures nothing and benefits nobody, least of all the candidate.

## Slide 17: Assessment

The examination has two components, both of which must be passed: a theory component, an oral examination on the whole syllabus in which some answers require a diagram or a calculation at the board; and a practical component, the laboratory examination with Prof. Staffa. Each contributes one half, and the final mark is their mean. The oral examination may also lower the mark obtained in the midterm: the midterm is a genuine result, not a guarantee. The way in which the midterm enters the theory mark is explained in class.

## Slide 18: Exam sessions and finalisation

The final mark is recorded only when both components have been passed, and recording takes place exclusively during a theory session; the laboratory examination normally precedes it by about a week. Both must be booked on Esse3. The two most frequent questions share an answer: the theory component may be taken before the practical one, and its result is retained for the academic year, but nothing is recorded until both are passed. It is therefore advisable to plan the two examinations together.

## Slide 19: Teaching material

The material comes from four sources. The slides are kept in a shared Google Drive folder and periodically published on the e-learning portal. PRG32 and its textbook, *Playing with RISC-V*, are free and open source on GitHub. The reference textbooks are Patterson and Hennessy, *Computer Organization and Design*, RISC-V edition, and Tanenbaum and Austin, *Structured Computer Organization*; both are available in Italian. The authoritative documentation of the architecture is published at riscv.org. Nothing need be purchased on the first day: the slides and the PRG32 material suffice until the formal topics begin, at which point one textbook should be chosen.

## Slide 20: First contact: who are you?

Six groups of questions open the conversation: hardware, software, culture, concepts, RISC-V and the students themselves. There are no right answers and nothing is assessed. The purpose is diagnostic: the answers indicate how much may be taken for granted in the first weeks. Students who have never assembled a computer or read a line of assembly are in the majority and exactly where the course expects them to be; those who have will find occasions to help their neighbours, which is itself one of the most effective ways of learning.
