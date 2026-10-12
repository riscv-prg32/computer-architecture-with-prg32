# Lecture 24: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

The last lecture looks beyond the kit. Everything you have learned was learned on a small processor that executes one instruction at a time. The machines that forecast the weather or train a neural network execute the same kind of instructions, in very large numbers at once. The lecture takes one small loop of Verm1 and follows it onto four kinds of machine. Cray's question about oxen and chickens will come back: it has no single answer. This lecture is an outlook, and is not part of the midterm test.

## Slide 2: What you will be able to do by the end

Five objectives. Write the performance equation and say which of its factors each technique attacks. Explain how a superscalar, out-of-order processor executes several instructions per cycle. Read a loop written with the RISC-V vector extension. Describe a supercomputer, compute a speed-up with Amdahl's law and say why energy is the limit. And say what a GPU and an FPGA are good at, and what each costs the programmer.

## Slide 3: Warm-up on the machine

The warm-up is a loop you already wrote, and a question: how fast could it go?

## Slide 4: The loop that empties the map

The loop that empties the map in `new_game`: 960 bytes set to zero. Four instructions per turn: a store of one byte, the increment of the address, the decrement of the counter, the branch back. In all 3,840 instructions, one byte at a time, one instruction at a time. On the kit it takes about 24 microseconds, and nobody needs it faster. It is chosen because it is small enough to be followed onto every machine of today. In how many ways can it be made faster?

## Slide 5: Time = instructions x cycles per instruction x clock period

The time a program takes is the product of three numbers: the instructions executed, the clock cycles each needs on average, and the duration of a cycle. Each factor can be attacked. Fewer instructions: better algorithms, richer instructions, vectors. Fewer cycles per instruction: pipelines and superscalar execution. A shorter cycle: faster transistors. And when one processor is not enough, more processors. Keep this equation in view: every machine of the lecture is a different answer to it.

## Slide 6: Why not simply a faster clock?

Why not simply raise the clock frequency? For thirty years each generation of transistors was smaller and faster without being hotter per unit of area. Around 2005 this stopped: a faster clock now means more heat than a chip can shed. Frequencies have stayed at a few gigahertz, and the additional transistors have been spent otherwise: wider processors, more cores, vector units, accelerators. Performance now comes from parallelism, from doing many things at once.

## Slide 7: Superscalar processors

The first answer acts on the second factor of the equation: more than one instruction per clock cycle, inside a single processor.

## Slide 8: From one at a time to many at once

Four kinds of processor, in order of ambition. The multi-cycle processor completes one instruction before starting the next. The pipelined one has several instructions in flight, each in a different stage, and completes at most one per cycle: this is your kit. The superscalar in-order processor has two or more pipelines side by side. The superscalar out-of-order processor starts each instruction as soon as its operands are ready, and reaches four, six, eight instructions per cycle: it is in your laptop and in your phone.

## Slide 9: Two pipelines side by side

Two pipelines side by side. Read the table by rows: each row is an instruction, each column a cycle. Instructions enter in pairs: `i1` and `i2` are fetched together, then `i3` and `i4`, then `i5` and `i6`. Six instructions finish in seven cycles; a single pipeline would need ten. This is the ideal case, in which the instructions do not depend on each other.

## Slide 10: What gets in the way: dependences

What gets in the way. The second instruction uses `t0`, which the first is still computing: it cannot run beside it. This is a *data dependence*. The third depends on nobody, and yet in an in-order processor it waits behind the second. The fourth is a branch: until it is resolved the processor does not know whether the fifth must be executed. This is a *control dependence*. Real programs are full of such chains, so width alone is not enough.

## Slide 11: Out-of-order execution

Out-of-order execution, in four stages. Instructions are fetched and decoded in order, several per cycle, into a window of tens or hundreds. Each result is given a fresh physical register: renaming. Each instruction executes as soon as its operands exist, wherever it is in the program. Finally the results are committed in program order, so that, seen from outside, nothing ever overtook. The model you learned, one instruction after another, is preserved exactly: only the timing changes.

## Slide 12: Register renaming: thirty-two names, many registers

Register renaming on an example. On the left the code as written: two halves, each loading a word, incrementing it and storing it back, and both using `t0`. The second half reuses the name, not the value: it is a false dependence. On the right, after renaming, each new value has its own physical register, and the two halves share nothing, so they can execute at the same time. The thirty-two registers you know are names; the chip has a few hundred registers.

## Slide 13: Guessing the future: branch prediction

A wide processor meets a branch every few instructions and cannot wait to know its outcome. So it *predicts*: it guesses the direction from the history of that branch and continues along the guess. If the guess was right, nothing is lost; if it was wrong, the speculative work is thrown away. The loop of the warm-up jumps back 959 times and falls through once: a predictor learns it at once. Modern predictors are right far more than nine times out of ten.

## Slide 14: RISC-V goes superscalar

RISC-V processors of this kind exist. The first row is the core of your kit: in order, one instruction per cycle. The others are out-of-order cores: BOOM from Berkeley and XiangShan from the Chinese Academy of Sciences, both open source; the C910, the P550, Veyron, from companies. Because the instruction set is open, anyone may build such a core, and some are published as source code that you could read.

## Slide 15: One architecture, many microarchitectures

A distinction that organises the whole course. The *architecture* is the contract: the instructions, the registers, what each instruction does. The *microarchitecture* is one way of honouring the contract: stages, width, predictors, caches. The `add` you wrote for a microcontroller is the same `add` on a server core. Verm1 would run unchanged on any core of the previous slide. This is why an instruction set, once learned, is knowledge that lasts.

## Slide 16: Vectors: one instruction, many data

The second answer acts on the first factor: fewer instructions, because each instruction works on many data.

## Slide 17: Flynn's taxonomy

Flynn's taxonomy classifies machines by two questions: one stream of instructions or many, one stream of data or many. SISD is the kit: one core, one datum at a time. SIMD is one instruction applied to many data at once: vector instructions and, roughly, GPUs. MISD is rare. MIMD is many processors each with its own data: multicore chips, clusters, supercomputers.

## Slide 18: The same loop, with vectors

The same loop with the vector extension. `v0` is a vector register, many bytes wide, filled with zeros. In each turn `vsetvli` asks: of the bytes still to do, how many fit in a register? The answer goes in `t2`. `vse8.v` stores that many bytes with a single instruction, and the address and the counter advance by `t2`. With 128-bit registers a turn handles 16 bytes: 60 turns instead of 960. The code never states the width of the registers, so the same program works with any width.

## Slide 19: A sum, lane by lane

A sum, lane by lane. A vector register holds several words, each in its own *lane*. `vle32.v` loads several words at once; `vadd.vv` adds two registers lane by lane, so that `v1` accumulates as many partial sums as there are lanes. At the end `vredsum` adds the lanes together into one number. With the sixteen numbers from 1 to 16 the result is 136. It is the parallel sum you saw as a picture in Lecture 04, now as instructions.

## Slide 20: High-performance computing

The third answer leaves the single processor: thousands of processors on one problem.

## Slide 21: What is a supercomputer?

A supercomputer is not one enormous processor: it is thousands of ordinary computers, the *nodes*, working on the same problem. Each node has one or two processors with tens of cores, often several GPUs, and much memory. A very fast network joins the nodes, and a parallel file system serves them all. Speed is measured in floating-point operations per second on a standard problem, and the TOP500 list has ranked the fastest machines since 1993. The picture is a small cluster with the same structure.

## Slide 22: Orders of magnitude

Orders of magnitude. The kit has no floating-point unit at all. A laptop performs about a hundred billion operations per second. Leonardo, in Bologna, about two hundred and forty million billion. Frontier, El Capitan and JUPITER exceed a billion billion, ten to the eighteenth: this is the *exascale*. Seven orders of magnitude separate a laptop from these machines, and they were obtained with parallelism, not with faster clocks.

## Slide 23: Amdahl's law

Amdahl's law says how much parallelism can give. If a fraction p of the work can be done in parallel and the rest cannot, with n processors the speed-up is 1 divided by the serial part plus the parallel part divided by n. The serial part does not shrink however many processors are added. With p equal to 0.9 the speed-up can never exceed 10. The practical lesson: before buying processors, measure p.

## Slide 24: Amdahl's law in numbers

The law in numbers. Read the second row: a program that is 90% parallel goes 5.3 times faster with ten processors, 9.2 with a hundred, 9.9 with a thousand, and never more than 10. Now compare the rows: only when the parallel fraction approaches 1 do many processors pay off. Compute one cell yourselves, for example p = 0.9 and n = 100.

## Slide 25: Two ways to share the work

Two ways to share the work. With *shared memory*, several cores of the same node see the same memory, and the program runs as threads that read and write the same variables; it is easy to start, and the danger is two threads writing the same variable. With *distributed memory* each node has its own memory, and the program runs as processes that exchange messages, with the MPI standard; it scales to a million cores, at the programmer's expense. Real applications use both.

## Slide 26: The limit is energy

The limit is energy. An exascale machine draws about twenty megawatts, the consumption of a small town, and the electricity of its lifetime costs as much as the machine. So the figure that matters is operations per watt, which has its own ranking, the Green500. Specialised hardware leads it, because it does more with each joule. The same reason, at the other end of the scale, puts a small RISC-V core in your kit.

## Slide 27: RISC-V and European supercomputing

RISC-V and European supercomputing. The largest machines of today use x86 or Arm processors with GPUs. Europe is designing processors and accelerators of its own on RISC-V, with the European Processor Initiative and with DARE, the project named in the first lecture. Monte Cimone, in Bologna, is a complete cluster built on RISC-V processors. An open instruction set lets a continent build what it would otherwise have to buy. The page shown is that of the computing facilities of the Department.

## Slide 28: GPU accelerators

The fourth answer: accelerators. First the GPU, thousands of small cores for work that repeats.

## Slide 29: Two ways to spend transistors

Two ways of spending the same transistors. A CPU has a few large cores, each out of order, with predictors and big caches: it is built to finish one task as soon as possible, and is at ease with branches and irregular data. A GPU has thousands of small simple cores that execute the same code on different data: it is built to finish a great many tasks per second, and is at ease with regular arrays. Oxen and chickens: the answer depends on the field.

## Slide 30: How a program uses a GPU

How a program uses a GPU, in four steps. The program on the CPU, the *host*, prepares its arrays in main memory. The data are copied to the memory of the GPU, which costs time. A small function, the *kernel*, is launched in thousands of threads, one per element. The results are copied back. The GPU is a device like those of Lecture 21: the processor sends it data and commands.

## Slide 31: The map of Verm1, one thread per cell

The map of Verm1 on a GPU. The function marked as kernel runs once in every thread. Each thread first computes who it is, its index `i`, from the number of its block and its position in the block; then, if the index is inside the map, it clears its own cell. There is no loop: there are 960 threads. The last line, on the host, launches four blocks of 256 threads. For 960 bytes the two copies cost far more than the work: this example shows the form, not a gain.

## Slide 32: When does a GPU pay off?

When does a GPU pay off? When the same operation applies to very many data independently: images, matrices, the grids of a simulation, neural networks. When the data can stay on the GPU for many steps instead of travelling each time. Not when the work is a chain of decisions, each depending on the previous one. And Amdahl applies again: what remains on the CPU sets the limit.

## Slide 33: FPGA accelerators

The last machine is the strangest: hardware that can be rewritten.

## Slide 34: A chip that becomes the circuit you describe

An FPGA, field-programmable gate array, is a chip that becomes the circuit you describe. Inside there is a sea of small blocks: look-up tables, each able to be any function of a few inputs; a flip-flop beside each table; and wires with switches that can connect any block to any other. A configuration file, the *bitstream*, sets every table and every switch. Load another bitstream and the same chip is a different circuit. It does not execute a program: it is a circuit.

## Slide 35: A look-up table is a truth table in memory

A look-up table is a truth table kept in memory. The inputs `a` and `b` are the address; the stored bits are the outputs. Read the three columns on the right: with the bits 0, 0, 0, 1 the table is an AND; with 0, 1, 1, 0 an XOR; with 1, 1, 0, 0 it is NOT a. Changing the stored bits changes the gate. It is the ROM that implements any function, from Lecture 11, in miniature.

## Slide 36: The U-turn rule of Verm1, as hardware

The rule of Verm1 that forbids the U-turn, written as hardware. Verilog is a language that describes circuits, not sequences of steps. The module has two inputs of two bits, the current direction and the one requested, and one output. The line with `assign` is a wire that is always true: the output is 1 when the XOR of the two directions equals binary 10. There is no before and after. On the kit the same rule took three instructions.

## Slide 37: From description to circuit

From description to circuit in five stages. Describe, in Verilog or VHDL. Simulate, observing waveforms like those of Lecture 13. Synthesise: the description becomes tables and flip-flops. Place and route: each element gets a position on the chip and the connections are drawn. Configure: the bitstream is loaded. Each attempt takes from minutes to hours: slower than building a cartridge, much faster than manufacturing a chip.

## Slide 38: A processor is a circuit too

A processor is a circuit too. A RISC-V core is a description in a hardware language, and it can be loaded on an FPGA: such *soft cores* are free to read and to use. A core of the class of your kit's fits in a small FPGA. Beside it you can place a circuit of your own, for the operation your program repeats most. Here the circle of the course closes: from the gates to a processor, and back.

## Slide 39: Four ways to compute

Four ways to compute, compared. Read the table by rows. A CPU is a few complex cores, programmed in any language, good at everything in moderation. A GPU is thousands of simple cores for regular data in bulk. An FPGA is a circuit you configure, for streams and low latency. An ASIC is a circuit made for one job. From left to right the work done per joule grows, and so does the effort required. Generality is paid in energy, efficiency in effort.

## Slide 40: Back to the machine

Back to the loop of the warm-up, now seen on five machines.

## Slide 41: Emptying the map of Verm1: 960 cells

Emptying the 960 cells of the map. On the kit: one byte per turn, 3,840 cycles. On an out-of-order RISC-V core: the same binary, in a fraction of those cycles. With 128-bit vectors: 60 turns. On a GPU: one launch of 960 threads, plus two copies. On an FPGA: 960 flip-flops with a common reset, one clock cycle. The work is the same; what changes is how much of it happens at the same time, and what it costs to obtain it. The engineer's question is not which is fastest, but which is enough.

## Slide 42: Check your understanding: A program is 80% parallel. What is the largest speed-up that any number of processors can give?

Use the last column of the table of Amdahl's law: with unlimited processors only the serial part remains.

## Slide 43: Check your understanding: What does register renaming remove?

Think of the example with the two halves that both used `t0`: what prevented them from running together, and what did renaming change?

## Slide 44: Check your understanding: With 256-bit vector registers, how many turns does the vector loop need for the 960 bytes?

How many bytes are 256 bits? Divide the 960 bytes by that number.

## Slide 45: Check your understanding: A two-input look-up table stores, for inputs 00, 01, 10, 11, the bits 0, 1, 1, 1. Which gate is it?

Write the four stored bits as a truth table with inputs a and b, and recognise the function.

## Slide 46: Exercises: paper first, then the machine

Five exercises. Fill in the Amdahl table for p = 0.95. Draw the pipeline diagram of a three-wide processor for nine independent instructions. Rename the registers of a fragment of Verm1 and say which instructions could run in the same cycle. Write the truth table of a four-input look-up table for the U-turn rule. And build the vector test and run it on QEMU with two different widths: why does the same binary work?

## Slide 47: Glossary

Fourteen terms of this lecture. *Out-of-order execution* is *esecuzione fuori ordine*; *register renaming* is *ridenominazione dei registri*; *branch prediction* is *predizione dei salti*. *Shared memory* and *message passing* are the two models of parallel programming. Several words, *kernel*, *bitstream*, *soft core*, are used in Italian as they are.

## Slide 48: Conclusions and reading

Four conclusions. One equation with three factors: every fast machine attacks one of them, or multiplies the processors. Superscalar out-of-order cores respect the contract of the instruction set and execute many instructions at once. Vectors, GPUs and clusters exploit data that can be processed independently, and Amdahl's law says how far that goes. FPGAs turn a description into a circuit. The course ends here: from a bit to a supercomputer, with a single instruction set.
