# Lecture 24: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

The last lecture looks beyond the kit. Everything you have learned was learned on a small processor that executes one instruction at a time. The machines that forecast the weather or train a neural network execute the same kind of instructions, in very large numbers at once. The lecture takes one small loop of Verm1 and follows it onto four kinds of machine. Cray's question about oxen and chickens will come back: it has no single answer. This lecture is an outlook, and is not part of the midterm test.

## Slide 2: What you will be able to do by the end

Five objectives. Write the performance equation and say which of its factors each technique attacks. Explain how a superscalar, out-of-order processor executes several instructions per cycle. Read a loop written with the RISC-V vector extension. Describe a supercomputer, compute a speed-up with Amdahl's law and say why energy is the limit. And say what a GPU and an FPGA are good at, and what each costs the programmer.

## Slide 3: Time = instructions x cycles per instruction x clock period

The time a program takes is the product of three numbers: the instructions executed, the clock cycles each needs on average, and the duration of a cycle. Each factor can be attacked. Fewer instructions: better algorithms, richer instructions, vectors. Fewer cycles per instruction: pipelines and superscalar execution. A shorter cycle: faster transistors. And when one processor is not enough, more processors. Keep this equation in view: every machine of the lecture is a different answer to it.

## Slide 4: Why not simply a faster clock?

Why not simply raise the clock frequency? For thirty years each generation of transistors was smaller and faster without being hotter per unit of area. Around 2005 this stopped: a faster clock now means more heat than a chip can shed. Frequencies have stayed at a few gigahertz, and the additional transistors have been spent otherwise: wider processors, more cores, vector units, accelerators. Performance now comes from parallelism, from doing many things at once.

## Slide 5: From one at a time to many at once

Four kinds of processor, in order of ambition. The multi-cycle processor completes one instruction before starting the next. The pipelined one has several instructions in flight, each in a different stage, and completes at most one per cycle: this is your kit. The superscalar in-order processor has two or more pipelines side by side. The superscalar out-of-order processor starts each instruction as soon as its operands are ready, and reaches four, six, eight instructions per cycle: it is in your laptop and in your phone.

## Slide 6: Out-of-order execution

Out-of-order execution, in four stages. Instructions are fetched and decoded in order, several per cycle, into a window of tens or hundreds. Each result is given a fresh physical register: renaming. Each instruction executes as soon as its operands exist, wherever it is in the program. Finally the results are committed in program order, so that, seen from outside, nothing ever overtook. The model you learned, one instruction after another, is preserved exactly: only the timing changes.

## Slide 7: Guessing the future: branch prediction

A wide processor meets a branch every few instructions and cannot wait to know its outcome. So it *predicts*: it guesses the direction from the history of that branch and continues along the guess. If the guess was right, nothing is lost; if it was wrong, the speculative work is thrown away. The loop of the warm-up jumps back 959 times and falls through once: a predictor learns it at once. Modern predictors are right far more than nine times out of ten.

## Slide 8: RISC-V goes superscalar

RISC-V processors of this kind exist. The first row is the core of your kit: in order, one instruction per cycle. The others are out-of-order cores: BOOM from Berkeley and XiangShan from the Chinese Academy of Sciences, both open source; the C910, the P550, Veyron, from companies. Because the instruction set is open, anyone may build such a core, and some are published as source code that you could read.

## Slide 9: One architecture, many microarchitectures

A distinction that organises the whole course. The *architecture* is the contract: the instructions, the registers, what each instruction does. The *microarchitecture* is one way of honouring the contract: stages, width, predictors, caches. The `add` you wrote for a microcontroller is the same `add` on a server core. Verm1 would run unchanged on any core of the previous slide. This is why an instruction set, once learned, is knowledge that lasts.

## Slide 10: What is a supercomputer?

A supercomputer is not one enormous processor: it is thousands of ordinary computers, the *nodes*, working on the same problem. Each node has one or two processors with tens of cores, often several GPUs, and much memory. A very fast network joins the nodes, and a parallel file system serves them all. Speed is measured in floating-point operations per second on a standard problem, and the TOP500 list has ranked the fastest machines since 1993. The picture shows racks of nodes of the Research Computing Facilities of the University.

## Slide 11: Amdahl's law

Amdahl's law says how much parallelism can give. If a fraction p of the work can be done in parallel and the rest cannot, with n processors the speed-up is 1 divided by the serial part plus the parallel part divided by n. The serial part does not shrink however many processors are added. With p equal to 0.9 the speed-up can never exceed 10. The practical lesson: before buying processors, measure p.

## Slide 12: Two ways to share the work

Two ways to share the work. With *shared memory*, several cores of the same node see the same memory, and the program runs as threads that read and write the same variables; it is easy to start, and the danger is two threads writing the same variable. With *distributed memory* each node has its own memory, and the program runs as processes that exchange messages, with the MPI standard; it scales to a million cores, at the programmer's expense. Real applications use both.

## Slide 13: The limit is energy

The limit is energy. An exascale machine draws about twenty megawatts, the consumption of a small town, and the electricity of its lifetime costs as much as the machine. So the figure that matters is operations per watt, which has its own ranking, the Green500. Specialised hardware leads it, because it does more with each joule. The same reason, at the other end of the scale, puts a small RISC-V core in your kit.

## Slide 14: Two ways to spend transistors

Two ways of spending the same transistors. A CPU has a few large cores, each out of order, with predictors and big caches: it is built to finish one task as soon as possible, and is at ease with branches and irregular data. A GPU has thousands of small simple cores that execute the same code on different data: it is built to finish a great many tasks per second, and is at ease with regular arrays. Oxen and chickens: the answer depends on the field.

## Slide 15: A chip that becomes the circuit you describe

An FPGA, field-programmable gate array, is a chip that becomes the circuit you describe. Inside there is a sea of small blocks: look-up tables, each able to be any function of a few inputs; a flip-flop beside each table; and wires with switches that can connect any block to any other. A configuration file, the *bitstream*, sets every table and every switch. Load another bitstream and the same chip is a different circuit. It does not execute a program: it is a circuit.

## Slide 16: Four ways to compute

Four ways to compute, compared. Read the table by rows. A CPU is a few complex cores, programmed in any language, good at everything in moderation. A GPU is thousands of simple cores for regular data in bulk. An FPGA is a circuit you configure, for streams and low latency. An ASIC is a circuit made for one job. From left to right the work done per joule grows, and so does the effort required. Generality is paid in energy, efficiency in effort.

## Slide 17: Check your understanding: A program is 80% parallel. What is the largest speed-up that any number of processors can give? / What does register renaming remove?

Use the last column of the table of Amdahl's law: with unlimited processors only the serial part remains.

Think of the example with the two halves that both used `t0`: what prevented them from running together, and what did renaming change?

## Slide 18: Check your understanding: With 256-bit vector registers, how many turns does the vector loop need for the 960 bytes? / A two-input look-up table stores, for inputs 00, 01, 10, 11, the bits 0, 1, 1, 1. Which gate is it?

How many bytes are 256 bits? Divide the 960 bytes by that number.

Write the four stored bits as a truth table with inputs a and b, and recognise the function.

## Slide 19: Glossary

Fourteen terms of this lecture. *Out-of-order execution* is *esecuzione fuori ordine*; *register renaming* is *ridenominazione dei registri*; *branch prediction* is *predizione dei salti*. *Shared memory* and *message passing* are the two models of parallel programming. Several words, *kernel*, *bitstream*, *soft core*, are used in Italian as they are.

## Slide 20: Conclusions and reading

Four conclusions. One equation with three factors: every fast machine attacks one of them, or multiplies the processors. Superscalar out-of-order cores respect the contract of the instruction set and execute many instructions at once. Vectors, GPUs and clusters exploit data that can be processed independently, and Amdahl's law says how far that goes. FPGAs turn a description into a circuit. The course ends here: from a bit to a supercomputer, with a single instruction set.
