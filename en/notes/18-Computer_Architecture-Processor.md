# Lecture 18: The Processor

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: accumulator, stack, registers; the processor model; the registers of RISC-V; the calling convention; the stack; the RV32 processor. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: interrupts and traps (Lecture 19). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: The Processor

The final block of the course opens the machine that has been executing every program written so far. This lecture presents the processor twice: first as a general reference model, valid for any processor, with its control unit, registers, stack and arithmetic unit; then as RISC-V, the processor programmed since the first weeks. Every abstract element of the model already has, for the student, a familiar name, and the lecture's method is to make that correspondence explicit. The ring of the epigraph is the processor itself: the one component that commands all the others.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Naming the components of a processor. Distinguishing internal registers from machine registers, and general-purpose from special registers. Explaining how a stack works and how RISC-V implements push and pop. Comparing three processor models, accumulator, stack and general registers, on the same computation. Describing RISC-V as a load-store, general-register architecture and reading the name RV32IMAC. And mapping every element of the model onto the processor of the kit.

## Slide 3: The computer and its processor

A reminder and a definition. A computer comprises three subsystems, processor, main memory and input/output, connected by buses. The processor can execute only a fixed set of instructions, from a few tens to a few hundred, and *machine language* is the set of bit strings that encode them. Instructions request two kinds of action: transfers of information, and arithmetic or logical operations. Programs and data both reside in main memory, as the von Neumann model of Lecture 03 prescribes.

## Slide 4: The processor: a reference model

The reference model. The *control unit* contains the program counter, which holds the address of the next instruction; a decoding register, which holds the instruction being executed; and the network that issues the control signals. The *machine registers* R0 to Rn-1 are those used by the programmer. The *arithmetic logic unit* has two operand registers and a result register. Two pairs of registers link the processor to the outside world: MA and MB towards memory, RI and RU towards input and output. An internal bus connects them all, in the manner of the common bus of Lecture 14.

## Slide 5: The model and RISC-V, side by side

Each element of the model, and its counterpart in RISC-V. The program counter is `pc`. The machine registers are x0 to x31, with their familiar names. The ALU registers and the memory interface registers exist in the hardware but are invisible to the programmer. Two rows read "absent", and both are deliberate design choices: there are no registers for input and output, because devices are memory-mapped, and there is no status register with flags. The special registers are the CSRs, reserved for privileged software and treated in Lecture 19.

## Slide 6: Internal registers and machine registers

Two classes of registers. *Internal* registers are necessary for the operation of the processor but invisible to the programmer: the program counter, the memory interface registers, those of the ALU. *Machine* registers define the programming model, being those named in instructions. The processor handles three kinds of information, instructions, addresses and data, each of which could in principle have its own width. In RV32 all three are 32 bits wide, which gives the machine a marked regularity.

## Slide 7: User state and supervisor state

A processor has at least two states of operation. In *supervisor* state it runs the operating system and may execute every instruction. In *user* state it runs an ordinary program and may execute everything except the *privileged* instructions, those whose misuse could compromise the system. RISC-V calls these states modes: machine mode, the most privileged and the only mandatory one, supervisor mode and user mode. The chip of the kit implements machine and user modes. Transitions between them occur through the traps of the next lecture.

## Slide 8: The functions of registers

Five functions of registers. *Transit*: carrying data between memory and registers. *Accumulation*: holding the operands and results of arithmetic. *Addressing*: holding an address or part of one, as base and index registers do. *Stack pointer*: indicating the top of a stack in memory. *Flags*: single bits recording events such as zero, sign, overflow and carry, which condition subsequent instructions. In RISC-V the general registers serve the first four functions; the fifth does not exist as a register at all.

## Slide 9: The thirty-two registers of RISC-V

The complete table of the RISC-V registers, with numbers, names and roles. Most have been in use for weeks: `zero`, `ra`, `sp`, the temporaries `t0` to `t6`, the arguments `a0` to `a7`, the saved registers `s0` to `s11`; `gp` and `tp` are new, used by compilers and operating systems. The hardware treats x1 to x31 identically and only x0 is special; the roles derive from the calling convention, met in Lecture 02 and stated here as a rule. A call may overwrite `ra` and the `t` and `a` registers, which are *caller-saved*: a caller that still needs one saves it before the call. A call must return the `s` registers and `sp` unchanged, which are *callee-saved*: a function that uses one saves it in its frame and restores it before `ret`. The program counter is not part of the register bank.

## Slide 10: Flags: the status register, and its absence

Many processors have a status register whose bits, the *flags*, record the outcome of the last operation: zero, negative, overflow, carry. One instruction sets them and a later conditional branch tests them. RISC-V has none. A branch compares two registers and jumps, in a single instruction; `slt` writes the result of a comparison into an ordinary register; carry and overflow are computed when required, as in Lecture 05. Less hidden state means a simpler processor, simpler pipelining (overlapping the steps of successive instructions, as on an assembly line) and simpler interrupt handling, since there is no implicit state to save.

## Slide 11: Special registers of RISC-V: the CSRs

The special registers of RISC-V are the *control and status registers*, CSRs: a separate bank, read and written only by privileged code through dedicated instructions. Five are worth knowing by name: `mstatus`, holding the global interrupt enable; `mtvec`, the address of the trap-handling routine; `mepc`, the address of the interrupted instruction; `mcause`, the reason for the trap; and the pair `mie` and `mip`, with one bit per interrupt source. The next lecture uses every one of them.

## Slide 12: The stack

A *stack* supports two operations: *push* places an element on top, *pop* removes the topmost element. It always operates at the top, so no location need be specified: last in, first out. It serves to set aside the contents of registers that must be freed for a task and to restore them afterwards, in subroutine calls and in interrupts alike. It is implemented by a pointer indicating the last element stored. Careful programs check for overflow on a push and for an empty stack on a pop. The stack frame of Lecture 02 is now seen in its general form.

## Slide 13: Four architectures of the processor

Four processor architectures. With *general registers* the processor has a set of interchangeable registers. With an *accumulator*, arithmetic instructions have an implicit operand, one special register. In a *stack* machine there is neither, only a stack pointer, and instructions operate on the top of the stack. An *orthogonal* architecture has a single bank of general registers, some of which may also serve as stack pointer or in other special roles. RISC-V belongs to this last class.

## Slide 14: RISC-V: a load-store, general-register processor

RISC-V is a *load-store* processor with general registers. Only loads and stores access memory; every other instruction operates from register to register, which is faster. Instructions have three operands, two sources and a destination, so that no value is destroyed unless the programmer so chooses. Each instruction performs one simple operation and has a fixed size, which makes it easy to decode and to execute in a pipeline. This is what RISC means. The seven lines of the warm-up are the price of the design, and the simplicity of each line is its return.

## Slide 15: The architecture of an RV32 processor

The block diagram of an RV32 processor, read from left to right. The PC supplies the address of the instruction, which is fetched from memory. The decoder separates its fields and the control unit issues the corresponding signals. The register file provides the operands. The ALU computes a result or forms an address. The data memory is read or written by loads and stores. Two paths return: the result goes back to the register named by `rd`, and the next PC is either PC + 4 or the branch target. Every instruction written in the course travels along this path, and the machines of Lectures 11, 13 and 14 can all be located on it.

## Slide 16: The processor of the PRG32 kit

The processor of the kit, in figures: instruction set RV32IMAC; one main core at up to 160 MHz with a four-stage pipeline, and a second low-power core; machine and user modes; no floating point; 512 KB of SRAM, 320 KB of ROM and an external flash; radios and peripherals on the same die. A complete computer in a few square millimetres, at a cost of about two euros, in which processor, memory and input/output are all present exactly as in the model.

## Slide 17: Check your understanding: Which register of the general model has no counterpart in RISC-V? / In RISC-V, which instructions can read or write the main memory?

For the first question one returns to the table placing the model beside RISC-V and looks for the rows marked "absent"; one of them is among the options.

For the second, one recalls the warm-up: which instructions accessed memory, and which only registers? The answer is the definition of a load-store architecture.

## Slide 18: Check your understanding: After addi sp, sp, -4 and sw t0, 0(sp), what has happened? / In an accumulator machine, the instruction ADD y means:

For the first question the two instructions are followed in turn: the pointer moves down by one word, and a value is then stored at the address it now holds. A value has been pushed onto the stack.

For the second: in an accumulator machine the accumulator is the implicit operand, serving as one of the two addends and receiving the result, while the operand written in the instruction is only read.

## Slide 19: Glossary: English and Italian

Ten terms. The *control unit* is the *unità di controllo*. A *machine register* is one visible to the programmer. *Flags* are also called *indicatori* in Italian. *Supervisor* and *user state* are the two privilege levels. A *privileged instruction* may be executed only in supervisor state.

## Slide 20: Conclusions and reading

Five conclusions. The processor commands and controls, relying on memory and on input/output. Registers are storage locations, internal or visible to the programmer. The kinds of registers and their use determine the processor model: accumulator, stack or general registers. The ALU performs the operations. And RISC-V is a load-store processor with general registers, no flags and no I/O instructions: few elements, each of them simple. The next lecture follows an instruction through its entire life.
