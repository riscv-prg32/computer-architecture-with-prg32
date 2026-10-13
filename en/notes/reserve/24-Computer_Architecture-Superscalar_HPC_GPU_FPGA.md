# Lecture 24: Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Two pipelines side by side

Two pipelines side by side. Read the table by rows: each row is an instruction, each column a cycle. Instructions enter in pairs: `i1` and `i2` are fetched together, then `i3` and `i4`, then `i5` and `i6`. Six instructions finish in seven cycles; a single pipeline would need ten. This is the ideal case, in which the instructions do not depend on each other.

## RISC-V goes superscalar

RISC-V processors of this kind exist. The first row is the core of your kit: in order, one instruction per cycle. The others are out-of-order cores: BOOM from Berkeley and XiangShan from the Chinese Academy of Sciences, both open source; the C910, the P550, Veyron, from companies. Because the instruction set is open, anyone may build such a core, and some are published as source code that you could read.

## Flynn's taxonomy

Flynn's taxonomy classifies machines by two questions: one stream of instructions or many, one stream of data or many. SISD is the kit: one core, one datum at a time. SIMD is one instruction applied to many data at once: vector instructions and, roughly, GPUs. MISD is rare. MIMD is many processors each with its own data: multicore chips, clusters, supercomputers.

## Orders of magnitude

Orders of magnitude. The kit has no floating-point unit at all. A laptop performs about a hundred billion operations per second. Leonardo, in Bologna, about two hundred and forty million billion. Frontier, El Capitan and JUPITER exceed a billion billion, ten to the eighteenth: this is the *exascale*. Seven orders of magnitude separate a laptop from these machines, and they were obtained with parallelism, not with faster clocks.

## Amdahl's law in numbers

The law in numbers. Read the second row: a program that is 90% parallel goes 5.3 times faster with ten processors, 9.2 with a hundred, 9.9 with a thousand, and never more than 10. Now compare the rows: only when the parallel fraction approaches 1 do many processors pay off. Compute one cell yourselves, for example p = 0.9 and n = 100.

## RISC-V and European supercomputing

RISC-V and European supercomputing. The largest machines of today use x86 or Arm processors with GPUs. Europe is designing processors and accelerators of its own on RISC-V, with the European Processor Initiative and with DARE, the project named in the first lecture. Monte Cimone, in Bologna, is a complete cluster built on RISC-V processors. An open instruction set lets a continent build what it would otherwise have to buy. The page shown is that of the computing facilities of the Department.

## How a program uses a GPU

How a program uses a GPU, in four steps. The program on the CPU, the *host*, prepares its arrays in main memory. The data are copied to the memory of the GPU, which costs time. A small function, the *kernel*, is launched in thousands of threads, one per element. The results are copied back. The GPU is a device like those of Lecture 21: the processor sends it data and commands.

## When does a GPU pay off?

When does a GPU pay off? When the same operation applies to very many data independently: images, matrices, the grids of a simulation, neural networks. When the data can stay on the GPU for many steps instead of travelling each time. Not when the work is a chain of decisions, each depending on the previous one. And Amdahl applies again: what remains on the CPU sets the limit.

## From description to circuit

From description to circuit in five stages. Describe, in Verilog or VHDL. Simulate, observing waveforms like those of Lecture 13. Synthesise: the description becomes tables and flip-flops. Place and route: each element gets a position on the chip and the connections are drawn. Configure: the bitstream is loaded. Each attempt takes from minutes to hours: slower than building a cartridge, much faster than manufacturing a chip.

## A processor is a circuit too

A processor is a circuit too. A RISC-V core is a description in a hardware language, and it can be loaded on an FPGA: such *soft cores* are free to read and to use. A core of the class of your kit's fits in a small FPGA. Beside it you can place a circuit of your own, for the operation your program repeats most. Here the circle of the course closes: from the gates to a processor, and back.
