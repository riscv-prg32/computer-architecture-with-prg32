# Lecture 19: Instructions and Interrupts

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: instruction formats; addressing modes; the processor cycle; interrupts and traps. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Instructions and Interrupts

The previous lecture described what a processor is made of. This one describes what it does. It has two halves. The first follows a single instruction: how it is encoded in 32 bits and which steps the processor takes to carry it out. The second explains what happens when something more urgent than the current program arrives, a timer, a device, an error, and the processor must leave what it is doing and come back later. The joke on the cover is nearly true, as you will see.

## Slide 2: What you will be able to do by the end

Six objectives. Describe an instruction as an operation code with operands. Decode a RISC-V instruction by hand. Follow an instruction through the five phases of the processor cycle. Explain what a pipeline is and why it speeds a processor up. Define interrupt, exception and trap, three words that RISC-V uses precisely. And describe what the hardware does at a trap and how the interrupted program resumes.

## Slide 3: What an instruction is made of

Every processor has four families of instructions: transfers between memory and registers, arithmetic and logic, control of flow, and input/output. An instruction is an *operation code*, the opcode, which says what to do, followed by zero or more *operands*, which say on what. An operand can be a constant written inside the instruction, an immediate; a memory location; or a register. Some operands are implicit: an accumulator machine does not name the accumulator. Instructions have from zero to three operands.

## Slide 4: The formats of RISC-V instructions

The formats of RISC-V. All instructions are 32 bits long, divided into fields. In the R format, for operations between registers, there are three register numbers of five bits, `rs1`, `rs2` and `rd`, and three fields that select the operation. In the I format the second source register is replaced by a 12-bit immediate. S and B, for stores and branches, split the immediate in two pieces. U and J carry a 20-bit immediate. Notice the regularity: the opcode is always in the lowest seven bits, and the registers are always in the same positions.

## Slide 5: Addressing modes: where an operand is found

An *addressing mode* is a way of finding an operand. RISC-V has four. *Immediate*: the operand is a constant inside the instruction. *Register*: it is the content of a register. *Base plus displacement*: it is the memory word at the address given by a register plus a constant, the only way to reach memory. *PC-relative*: an address at a certain distance from the instruction itself, used by branches. Memory-indirect addressing, where the address itself is in memory, does not exist: it takes two loads.

## Slide 6: The phases of the cycle

Five phases. *Fetch*: the instruction at the address in the PC is read from memory, and the PC advances. *Decode*: the opcode is recognised and the registers named in the instruction are read. *Execute*: the ALU computes a result, an address or a comparison. *Memory*: loads read the memory, stores write it, the other instructions do nothing here. *Write back*: the result is written in the destination register. After the initial bootstrap, the processor repeats this cycle for ever.

## Slide 7: The pipeline

If each phase has its own hardware, the phases of different instructions can overlap. In the table, each row is an instruction and each column a clock cycle: while the first instruction is in execution, the second is being decoded and the third fetched. Each instruction still takes five cycles, but one finishes at every cycle: this is the *pipeline*, the same idea as an assembly line. Superscalar processors put several pipelines side by side. The main core of the kit has a pipeline of four stages.

## Slide 8: The problem with the simple cycle

A processor that only fetched, decoded and executed would have three problems. Communication with devices would be inefficient: the program would have to keep asking each device whether it has something to say. A program that entered an endless loop by mistake, like the `j loop` on the slide, could never be removed. And the operating system would have little control over the machine. All three have the same solution: a way to take the processor away from the running program.

## Slide 9: Interrupts

The definition: *interrupts* are exceptional events, usually asynchronous with respect to the program in execution, that require the attention of the processor. RISC-V uses three distinct words. An *interrupt* comes from outside the program, at any moment: a timer, a device. An *exception* is caused by the instruction being executed: an illegal opcode, a forbidden address. A *trap* is the transfer of control to a handler, whatever caused it. Other processors use these words more loosely.

## Slide 10: The real processor cycle

The real cycle. After the bootstrap the processor fetches, decodes and executes; then, at the end of every instruction, it checks whether an interrupt is pending. If not, it goes back to fetch. If so, it takes the trap: it passes to the privileged state and starts executing a routine of the system, the handler. When the handler finishes, the suspended program resumes as if nothing had happened. Follow the two paths on the diagram: the short loop is the normal case.

## Slide 11: Possible causes of interruption

Six causes of interruption. A *periodic* interrupt from a timer, to share the processor among programs. An *I/O* interrupt, with which a peripheral reports that it is ready. *Errors in the program*, such as an instruction that does not exist: these are the exceptions. *Faults* of the system: power, temperature. *Reset*, which brings everything back to a known state. And the *software* interrupt, with which a program asks the operating system for a service: in RISC-V it is the instruction `ecall`.

## Slide 12: Handling an interrupt

The general procedure in six steps. Save the context, hardware part: at least the address at which to resume. Identify the cause. Jump to the entry point of the *interrupt service routine*. Save the context, software part: the registers the routine is going to use. Serve the interrupt. Finally restore the context and resume the suspended program at the instruction after the last one executed. The *context* is everything that the interrupted program needs to find unchanged.

## Slide 13: The registers of the trap mechanism

Six registers. `mtvec`, written once by the firmware, holds the address of the trap handler. `mstatus` contains MIE, the global interrupt enable, and MPIE, its previous value. `mie` has one enable bit for each source, `mip` one pending bit for each source. `mepc` receives, at each trap, the address of the interrupted instruction. `mcause` receives the cause. The middle column matters: some registers are written by the firmware to configure the mechanism, others by the hardware when a trap occurs.

## Slide 14: What the hardware does on a trap

What the hardware does at a trap, in order. It writes in `mepc` the address of the interrupted instruction. It writes the cause in `mcause`. It copies MIE into MPIE and clears MIE, so that further interrupts are disabled. It passes to machine mode. It loads the PC with the address in `mtvec`. Nothing is saved on a stack: the general registers are left to the handler. The instruction `mret`, at the end of the handler, undoes everything: MIE gets MPIE back and the PC gets `mepc`.

## Slide 15: The cause of a trap: mcause

The content of `mcause`. The top bit says whether it was an interrupt or an exception; the rest is a code. The three interrupts, highlighted: software, timer, and external, that is a device. Among the exceptions: illegal instruction, breakpoint, access fault on a load or a store, and `ecall`. The same number can appear in both families with different meanings, which is why the top bit is needed. The breakpoint row explains how a debugger such as that of PRG32-QT stops your program.

## Slide 16: Interrupts on the PRG32 kit

All of this happens on the kit. A timer interrupts the processor a hundred times per second, and the firmware uses it to keep time and pace the frames. The display and the audio interrupt when they want more data. The radio interrupts when a packet arrives, which is why you can upload a cartridge while a game runs. Your `init`, `update` and `draw` are ordinary functions that run between interrupts. And a cartridge stuck in a loop does not stop the interrupts: PRG32-QT reports an error; on the board a watchdog reports the stall.

## Slide 17: Check your understanding: In which bits of a RISC-V instruction is the opcode? / During the fetch of an RV32 instruction that is not compressed, the PC is increased by:

Look again at the slide of the formats: one field is in the same place in all four rows.

Addresses count bytes. How many bytes does a 32-bit instruction occupy?

## Slide 18: Check your understanding: Which register holds the address at which an interrupted RISC-V program will resume? / Which of these is an exception rather than an interrupt, in RISC-V terms?

Four registers are in play: one holds the address of the handler, one the cause, one the address at which to resume. `ra` belongs to function calls, not to traps.

Use the definition: an exception is caused by the instruction being executed, an interrupt comes from outside at an arbitrary moment. Three of the four events come from outside.

## Slide 19: Glossary: English and Italian

Twelve terms. The *operation code* is the *codice operativo*; an *addressing mode* is a *modo di indirizzamento*. *Fetch*, *decode* and *execute* are *prelievo*, *decodifica* and *esecuzione*. The *interrupt service routine* is the routine that serves an interrupt. *Interrupt latency* is the delay between the request and the start of useful work. *To mask* an interrupt is to prevent it temporarily from being accepted.

## Slide 20: Conclusions and reading

Five conclusions. An instruction is an operation code and its operands; in RISC-V always 32 bits in six regular formats. A fixed length keeps the fetch simple: the PC advances by a constant, 4 for an instruction that is not compressed. The processor has a cycle: fetch, decode, execute, write the result. Exceptional events break the cycle: the processor saves where it was, serves the event and resumes. Interrupts can be enabled, masked and ordered by priority, and RISC-V does it with a handful of registers and `mret`. The next lecture leaves the processor for the buses and the video card.
