# Lecture 24: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the performance equation; superscalar processors; vector instructions; HPC and Amdahl's law; GPU and FPGA accelerators. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) use the performance equation to say where time goes; (2) explain superscalar execution, vectors, GPUs and FPGAs as answers to it; (3) bound a parallel speed-up with Amdahl's law. Builds on: only what Lecture 01 set up. This is the last lecture of the course.

Closing thread: The loop that empties Verm1's map can be made faster in five ways, and each is a machine of its own. The question an engineer asks is not which machine is fastest, but which is sufficient.

## Slide 1: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

The final lecture looks beyond the kit. Everything learned so far was learned on a small processor that executes one instruction at a time. The machines that forecast the weather or train a neural network execute instructions of the same kind, in vast numbers at once. The lecture takes one small loop of Verm1 and follows it onto four classes of machine, so that the whole landscape of high-performance computing is seen through a single, familiar example. Seymour Cray's question about oxen and chickens will recur, and it has no single answer. This lecture is an outlook and is not part of the midterm test.

## Slide 2: What you will be able to do by the end

Five learning outcomes. Stating the performance equation and identifying which of its factors each technique addresses. Explaining how a superscalar, out-of-order processor executes several instructions per cycle. Reading a loop written with the RISC-V vector extension. Describing a supercomputer, computing a speed-up with Amdahl's law, and explaining why energy is the binding constraint. And stating what a GPU and an FPGA are suited for, and what each demands of the programmer.

## Slide 3: Time = instructions x cycles per instruction x clock period

The execution time of a program is the product of three quantities: the number of instructions executed, the average number of clock cycles each requires, and the duration of a cycle. Each factor can be reduced. Fewer instructions: better algorithms, richer instructions, vectors. Fewer cycles per instruction: pipelining and superscalar execution. A shorter cycle: faster transistors. And when one processor no longer suffices, more processors. This equation organises the lecture: every machine presented is a different answer to it.

## Slide 4: Why not simply a faster clock?

Why not simply raise the clock frequency? For three decades each generation of transistors was smaller and faster without dissipating more heat per unit area. Around 2005 this scaling ended: a faster clock now produces more heat than a chip can shed. Frequencies have remained at a few gigahertz, and the additional transistors have been spent differently: wider processors, more cores, vector units and accelerators. Performance now comes from parallelism, from doing many things at once, which is why the remainder of the lecture is about parallel machines.

## Slide 5: From one at a time to many at once

Four kinds of processor, in order of ambition. The multi-cycle processor completes one instruction before starting the next. The pipelined processor has several instructions in flight, each in a different stage, and completes at most one per cycle; this is the kit. The in-order superscalar processor has two or more pipelines side by side. The out-of-order superscalar processor starts each instruction as soon as its operands are ready and sustains four, six or eight instructions per cycle; it is the processor of laptops and phones.

## Slide 6: Out-of-order execution

Out-of-order execution in four stages. Instructions are fetched and decoded in program order, several per cycle, into a window of tens or hundreds. Each result is assigned a fresh physical register: renaming, which removes false dependences between unrelated uses of the same register name. Each instruction executes as soon as its operands are available, wherever it lies in the program. Finally results are committed in program order, so that from outside nothing appears to have overtaken anything. The sequential model of execution learned in the course is preserved exactly; only the timing differs.

## Slide 7: Guessing the future: branch prediction

A wide processor encounters a branch every few instructions and cannot wait to learn its outcome. It therefore *predicts*: it infers the likely direction from the history of that branch and continues speculatively along the prediction. If the prediction was correct nothing is lost; if not, the speculative work is discarded. The loop of the warm-up jumps backwards 959 times and falls through once, a pattern any predictor learns immediately. Modern predictors are correct far more than nine times in ten, and their accuracy is a principal determinant of performance.

## Slide 8: RISC-V goes superscalar

RISC-V processors of this class exist. The first row is the core of the kit: in order, one instruction per cycle. The others are out-of-order cores: BOOM from Berkeley and XiangShan from the Chinese Academy of Sciences, both open source; and the C910, the P550 and Veyron, from industry. Because the instruction set is open, anyone may build such a core, and some are published as source code that a student could read.

## Slide 9: One architecture, many microarchitectures

A distinction that organises the whole course. The *architecture* is the contract: the instructions, the registers, and the effect of each instruction. The *microarchitecture* is one particular way of honouring that contract: pipeline stages, width, predictors, caches. The `add` written for a microcontroller is the same `add` on a server core, and Verm1 would run unchanged on any core of the previous slide. This separation is why an instruction set, once learned, is durable knowledge, and why the course could teach architecture on a small machine without loss of generality.

## Slide 10: What is a supercomputer?

A supercomputer is not one enormous processor but thousands of ordinary computers, the *nodes*, working on the same problem. Each node has one or two processors with tens of cores, often several GPUs, and abundant memory. A very fast network connects the nodes, and a parallel file system serves them all. Performance is measured in floating-point operations per second on a standard benchmark, and the TOP500 list has ranked the fastest machines since 1993. The picture shows racks of nodes of the University's Research Computing Facilities, met in Lecture 03.

## Slide 11: Amdahl's law

Amdahl's law states how much parallelism can deliver. If a fraction p of the work can be parallelised and the remainder cannot, the speed-up with n processors is 1 / ((1 - p) + p / n). The serial part does not shrink however many processors are added, so the speed-up is bounded by 1 / (1 - p): with p = 0.9 it can never exceed 10. The practical lesson is to measure p before acquiring processors, and to recognise that reducing the serial fraction is often worth more than adding hardware.

## Slide 12: Two ways to share the work

Two models for sharing work. With *shared memory*, several cores of the same node see the same memory, and the program runs as threads that read and write common variables; it is easy to begin with, and its characteristic hazard is two threads writing the same variable. With *distributed memory* each node has its own memory, and the program runs as processes that exchange messages, under the MPI standard; it scales to a million cores, at the cost of greater effort from the programmer. Real applications combine both.

## Slide 13: The limit is energy

The binding constraint is energy. An exascale machine draws about twenty megawatts, the consumption of a small town, and the electricity used over its lifetime costs as much as the machine itself. The figure that matters is therefore operations per watt, which has its own ranking, the Green500. Specialised hardware leads it, because it accomplishes more with each joule. The same reasoning, at the opposite end of the scale, places a small RISC-V core in the kit.

## Slide 14: Two ways to spend transistors

Two ways of spending the same transistors. A CPU has a few large cores, each out of order, with predictors and large caches; it is designed to complete a single task as quickly as possible, and handles branches and irregular data well. A GPU has thousands of small, simple cores executing the same code on different data; it is designed to complete a very large number of tasks per second, and excels on regular arrays. Oxen and chickens: which is preferable depends on the field to be ploughed.

## Slide 15: A chip that becomes the circuit you describe

An FPGA, a field-programmable gate array, is a chip that becomes the circuit one describes. Internally it is a sea of small blocks: look-up tables, each able to implement any function of a few inputs, which is to say a truth table held in memory; a flip-flop beside each table; and wires with switches able to connect any block to any other. A configuration file, the *bitstream*, sets every table and switch. Loading another bitstream turns the same chip into a different circuit. It does not execute a program: it *is* a circuit, which unites the combinational and sequential machines of the course in one reconfigurable device.

## Slide 16: Four ways to compute

Four ways to compute, compared row by row. A CPU consists of a few complex cores, programmable in any language, competent at everything in moderation. A GPU consists of thousands of simple cores for regular data in bulk. An FPGA is a configurable circuit, suited to data streams and low latency. An ASIC is a circuit made for a single task. From left to right the work done per joule increases, and so does the design effort required. Generality is paid for in energy, efficiency in effort; this is the central trade-off of contemporary computer architecture.

## Slide 17: Check your understanding: A program is 80% parallel. What is the largest speed-up that any number of processors can give? / What does register renaming remove?

For the first question the last column of the table of Amdahl's law applies: with unlimited processors only the serial fraction remains.

For the second, one recalls the example with two halves that both used `t0`: what prevented them from executing together, and what renaming changed.

## Slide 18: Check your understanding: With 256-bit vector registers, how many turns does the vector loop need for the 960 bytes? / A two-input look-up table stores, for inputs 00, 01, 10, 11, the bits 0, 1, 1, 1. Which gate is it?

For the first question: 256 bits are 32 bytes, and the 960 bytes are divided by that number.

For the second, the four stored bits are written as a truth table with inputs a and b, and the function recognised.

## Slide 19: Glossary

Fourteen terms of this lecture. *Out-of-order execution* is *esecuzione fuori ordine*; *register renaming* is *ridenominazione dei registri*; *branch prediction* is *predizione dei salti*. *Shared memory* and *message passing* are the two models of parallel programming. Several terms, *kernel*, *bitstream*, *soft core*, are used in Italian unchanged.

## Slide 20: Conclusions and reading

Four conclusions. A single equation with three factors: every fast machine reduces one of them, or multiplies the processors. Out-of-order superscalar cores honour the contract of the instruction set while executing many instructions at once. Vectors, GPUs and clusters exploit data that can be processed independently, and Amdahl's law bounds how far that goes. FPGAs turn a description into a circuit. The course ends here: from a single bit to a supercomputer, with one instruction set throughout.
