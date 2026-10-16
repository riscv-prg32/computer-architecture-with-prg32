# Lecture 18: The Processor

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: accumulator, stack, registers; the processor model; the registers of RISC-V; the calling convention; the stack; the RV32 processor. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: interrupts and traps (Lecture 19). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: The Processor

The last block of the course opens the machine that has been running your programs. This lecture presents the processor twice: first as a general model, valid for every processor, with its control unit, registers, stack and arithmetic unit; then as RISC-V, the processor you have programmed since the first days. Each abstract element of the model already has, for you, a familiar name. The ring of the quotation is the processor itself: the one component that commands all the others.

## Slide 2: What you will be able to do by the end

Six objectives. Name the components of a processor. Distinguish internal registers from machine registers, and general registers from special ones. Explain how a stack works and how RISC-V implements push and pop. Compare three models of processor, accumulator, stack and general registers, on the same computation. Describe RISC-V as a load-store, general-register processor and read the name RV32IMAC. And map every element of the model onto the processor of the kit.

## Slide 3: The computer and its processor

A reminder and a definition. A computer has three subsystems, processor, main memory and input/output, connected by buses. The processor can execute only a fixed set of instructions, from a few tens to a few hundred, and *machine language* is the set of strings of bits that encode them. Instructions request two kinds of things: transfers of information and arithmetic or logic operations. Both programs and data are in the main memory.

## Slide 4: The processor: a reference model

The reference model. The *control unit* contains the program counter, which holds the address of the next instruction, a decoding register, which holds the instruction being executed, and the network that issues the commands. The *machine registers* R0 to Rn-1 are those the programmer uses. The *arithmetic logic unit* has two operand registers and a result register. Two pairs of registers link the processor to the outside: MA and MB towards memory, RI and RU towards input and output. An internal bus connects everything.

## Slide 5: The model and RISC-V, side by side

Each element of the model, and what it is in RISC-V. The program counter is `pc`. The machine registers are x0 to x31, with the names you know. The registers of the ALU and those towards memory exist in the hardware but are invisible to the programmer. Two rows say "absent", and they are deliberate choices: there are no registers for input and output, because devices are memory-mapped, and there is no status register with flags. The special registers are the CSRs, reserved for privileged software.

## Slide 6: Internal registers and machine registers

Two classes of registers. *Internal* registers are necessary for the processor to work but are not visible to the programmer: the program counter, the registers towards memory, those of the ALU. *Machine* registers define the programming model: they are the ones named in instructions. The processor handles three kinds of information, instructions, addresses and data, and each could have its own size. In RV32 all three are 32 bits wide, which makes the machine very regular.

## Slide 7: User state and supervisor state

A processor has at least two states of operation. In *supervisor* state it runs the operating system and may execute every instruction. In *user* state it runs an ordinary program and may execute everything except the *privileged* instructions, those that could compromise the system. RISC-V calls them modes: machine mode, the most privileged and the only mandatory one, supervisor mode and user mode. The chip of the kit has machine and user. Passing from one to the other happens through the traps of the next lecture.

## Slide 8: The functions of registers

Five functions of registers. *Transit*: carrying data between memory and registers. *Accumulation*: holding the operands and the results of arithmetic. *Addressing*: holding an address or part of one, as base and index registers do. *Stack pointer*: indicating the top of a stack in memory. *Flags*: single bits that record events such as zero, sign, overflow and carry, to condition later instructions. In RISC-V the general registers serve the first four functions; the fifth does not exist as a register.

## Slide 9: The thirty-two registers of RISC-V

The complete table of the registers of RISC-V, with numbers, names and roles. You have used most of them: `zero`, `ra`, `sp`, the temporaries `t0` to `t6`, the arguments `a0` to `a7`, the saved registers `s0` to `s11`. Two are new: `gp` and `tp`, used by compilers and operating systems. The hardware treats x1 to x31 identically; only x0 is special. The roles come from the calling convention. The program counter is not in the bank.

## Slide 10: Flags: the status register, and its absence

Many processors have a status register whose bits, the *flags*, record the outcome of the last operation: zero, negative, overflow, carry. An instruction sets them, and a later conditional branch tests them. RISC-V has none. A branch compares two registers and jumps, all in one instruction; `slt` writes the result of a comparison in an ordinary register; carry and overflow are computed when needed, as in Lecture 05. Less hidden state means a simpler processor and simpler interrupts.

## Slide 11: Special registers of RISC-V: the CSRs

The special registers of RISC-V are the *control and status registers*, CSRs: a separate bank, read and written only by privileged code with dedicated instructions. Five are worth knowing by name: `mstatus`, with the global interrupt enable; `mtvec`, the address of the routine that handles traps; `mepc`, the address of the interrupted instruction; `mcause`, the reason for the trap; and the pair `mie` and `mip`, with one bit per source of interrupt. The next lecture uses them all.

## Slide 12: The stack

A *stack* has two operations: *push* stores an element on top of the pile, *pop* removes the element on top. It always works on the top, so there is no need to say where: last in, first out. It is used to set aside the contents of registers that must be freed for a task and to restore them afterwards. It is implemented with a pointer that indicates the last element. Careful programs check for overflow on a push and for an empty stack on a pop.

## Slide 13: Four architectures of the processor

Four architectures. With *general registers* the processor has a set of interchangeable registers. With an *accumulator*, arithmetic instructions have an implicit operand, one special register. In a *stack* machine there are neither, only a stack pointer, and instructions work on the top of the stack. An *orthogonal* architecture has a single bank of general registers, some of which also serve as stack pointer or in other special roles. RISC-V is of this last kind.

## Slide 14: RISC-V: a load-store, general-register processor

RISC-V is a *load-store* processor with general registers. Only loads and stores touch memory; every other instruction works from register to register, which is faster. Instructions have three operands, two sources and a destination, so that no value is destroyed unless you want it to be. Each instruction does one simple thing and has a fixed size, which makes it easy to decode and to execute in a pipeline. This is what RISC means. The seven lines of the warm-up are the price, and the simplicity of each line is the gain.

## Slide 15: The architecture of an RV32 processor

The block diagram of an RV32 processor, from left to right. The PC gives the address of the instruction. The instruction is fetched from memory. The decoder separates its fields and the control unit issues the commands. The register file provides the operands. The ALU computes, or forms an address. The data memory is read or written by loads and stores. Two paths go back: the result returns to the register named by `rd`, and the next value of the PC is PC plus 4 or the target of a branch. Every instruction you write travels along this path.

## Slide 16: The processor of the PRG32 kit

The processor of the kit, in numbers: instruction set RV32IMAC; one main core at up to 160 MHz with a four-stage pipeline, and a second low-power core; machine and user modes; no floating point; 512 KB of SRAM, 320 KB of ROM and an external flash; radios and peripherals on the same chip. A complete computer in a few square millimetres, for about two euros: processor, memory and input/output are all there, as in the model.

## Slide 17: Check your understanding: Which register of the general model has no counterpart in RISC-V? / In RISC-V, which instructions can read or write the main memory?

Go back to the table that puts the model beside RISC-V and look for the rows marked "absent". One of them is among the options.

Remember the warm-up: which instructions touched memory, and which only registers? That is the definition of a load-store architecture.

## Slide 18: Check your understanding: After addi sp, sp, -4 and sw t0, 0(sp), what has happened? / In an accumulator machine, the instruction ADD y means:

Follow the two instructions: the pointer moves down by one word, then a value is stored at the address it now holds. A value has been added on top of the stack.

In an accumulator machine the accumulator is the implicit operand: it is one of the two addends and it receives the result. The operand written in the instruction is only read.

## Slide 19: Glossary: English and Italian

Ten terms. The *control unit* is the *unità di controllo*. A *machine register* is one visible to the programmer. *Flags* are also called *indicatori* in Italian. *Supervisor* and *user state* are the two levels of privilege. A *privileged instruction* can be executed only in supervisor state.

## Slide 20: Conclusions and reading

Five conclusions. The processor commands and controls, relying on memory and on input/output. Registers are storage locations, inside or outside the processor. The kinds of registers and their use determine the model: accumulator, stack, general registers. The ALU carries out the operations. And RISC-V is a load-store processor with general registers, no flags and no I/O instructions: few elements, each one simple. The next lecture follows an instruction through its whole life.
