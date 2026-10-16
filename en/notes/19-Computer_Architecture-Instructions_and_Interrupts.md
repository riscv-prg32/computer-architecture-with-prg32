# Lecture 19: Instructions and Interrupts

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: instruction formats; addressing modes; the processor cycle; interrupts and traps. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Instructions and Interrupts

The previous lecture described what a processor is made of; this one describes what it does. It has two halves. The first follows a single instruction: how it is encoded in 32 bits and which steps the processor takes to execute it. The second explains what happens when something more urgent than the current program arrives, a timer, a device or an error, so that the processor must suspend its work and resume it later. The two halves are connected: the interrupt is a modification of the very cycle the first half describes. The joke on the cover, as will become apparent, is nearly literally true.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Describing an instruction as an operation code with operands. Decoding a RISC-V instruction by hand. Following an instruction through the five phases of the processor cycle. Explaining what a pipeline is and why it increases throughput. Defining interrupt, exception and trap, three terms that RISC-V uses with precision. And describing what the hardware does at a trap and how the interrupted program resumes.

## Slide 3: What an instruction is made of

Every processor provides four families of instructions: transfers between memory and registers, arithmetic and logical operations, control of flow, and input/output. An instruction consists of an *operation code*, the opcode, specifying what to do, followed by zero or more *operands*, specifying on what. An operand may be a constant written within the instruction, an immediate; a memory location; or a register. Some operands are implicit, as the accumulator is in an accumulator machine. Instructions have from zero to three operands.

## Slide 4: The formats of RISC-V instructions

The instruction formats of RISC-V. Every instruction is 32 bits long and divided into fields. In the R format, for register-to-register operations, there are three five-bit register numbers, `rs1`, `rs2` and `rd`, and three fields that select the operation. In the I format the second source register is replaced by a 12-bit immediate. S and B, for stores and branches, split the immediate into two pieces. U and J carry a 20-bit immediate. The regularity is a design objective: the opcode always occupies the lowest seven bits and the register fields always the same positions, so decoding can begin before the format is known. The 16-bit compressed forms of the C extension are only named here; Appendix A of the textbook lists them.

## Slide 5: Addressing modes: where an operand is found

An *addressing mode* is a method of locating an operand. RISC-V provides four. *Immediate*: the operand is a constant within the instruction. *Register*: it is the content of a register. *Base plus displacement*: it is the memory word at the address formed by a register plus a constant, the only means of reaching memory. *PC-relative*: an address at a given distance from the instruction itself, used by branches. Memory-indirect addressing, in which the address itself resides in memory, does not exist: it requires two loads. This is the formal treatment promised in Lecture 02 when address and value were first distinguished.

## Slide 6: The phases of the cycle

Five phases. *Fetch*: the instruction at the address in the PC is read from memory and the PC advanced. *Decode*: the opcode is recognised and the registers named in the instruction are read. *Execute*: the ALU computes a result, an address or a comparison. *Memory*: loads read memory, stores write it, and other instructions do nothing in this phase. *Write back*: the result is written into the destination register. After the initial bootstrap the processor repeats this cycle indefinitely.

## Slide 7: The pipeline

If each phase has dedicated hardware, the phases of successive instructions can overlap. In the table each row is an instruction and each column a clock cycle: while the first instruction executes, the second is decoded and the third fetched. Each instruction still requires five cycles, but one completes every cycle: this is the *pipeline*, the principle of the assembly line, which increases throughput without reducing latency. Superscalar processors place several pipelines side by side, as Lecture 24 shows. The main core of the kit has a four-stage pipeline.

## Slide 8: The problem with the simple cycle

A processor that did nothing but fetch, decode and execute would face three problems. Communication with devices would be inefficient, since the program would have to interrogate each device repeatedly. A program trapped by mistake in an endless loop, such as the `j loop` on the slide, could never be removed. And the operating system would have little control over the machine. All three share one solution: a mechanism for taking the processor away from the running program.

## Slide 9: Interrupts

The definition: *interrupts* are exceptional events, usually asynchronous with respect to the executing program, that require the attention of the processor. RISC-V distinguishes three terms. An *interrupt* originates outside the program and may arrive at any moment: a timer, a device. An *exception* is caused by the instruction being executed: an illegal opcode, a forbidden address. A *trap* is the transfer of control to a handler, whatever its cause. Other architectures use these words less strictly, so the RISC-V usage is worth adopting for its clarity.

## Slide 10: The real processor cycle

The real cycle. After the bootstrap the processor fetches, decodes and executes; then, at the end of every instruction, it checks whether an interrupt is pending. If none is, it returns to fetch. If one is, it takes the trap: it enters the privileged state and begins executing a system routine, the handler. When the handler completes, the suspended program resumes as though nothing had occurred. The two paths on the diagram should be followed; the short loop is the common case.

## Slide 11: Possible causes of interruption

Six causes of interruption. A *periodic* interrupt from a timer, used to share the processor among programs. An *I/O* interrupt, by which a peripheral signals that it is ready. *Program errors*, such as an instruction that does not exist: these are the exceptions. *System faults*: power, temperature. *Reset*, which returns everything to a known state. And the *software* interrupt, by which a program requests a service from the operating system: in RISC-V, the instruction `ecall`.

## Slide 12: Handling an interrupt

The general procedure in six steps. Save the context, hardware part: at minimum the address at which to resume. Identify the cause. Jump to the entry point of the *interrupt service routine*. Save the context, software part: the registers the routine will use. Serve the interrupt. Finally, restore the context and resume the suspended program at the instruction following the last one executed. The *context* is everything the interrupted program requires to find unchanged, and its preservation is what makes the interruption invisible.

## Slide 13: The registers of the trap mechanism

Six registers. `mtvec`, written once by the firmware, holds the address of the trap handler. `mstatus` contains MIE, the global interrupt enable, and MPIE, its previous value. `mie` holds one enable bit per source, `mip` one pending bit per source. `mepc` receives, at each trap, the address of the interrupted instruction. `mcause` receives the cause. The middle column deserves attention: some registers are written by the firmware to configure the mechanism, others by the hardware when a trap occurs.

## Slide 14: What the hardware does on a trap

The actions of the hardware at a trap, in order. It writes into `mepc` the address of the interrupted instruction. It writes the cause into `mcause`. It copies MIE into MPIE and clears MIE, disabling further interrupts. It enters machine mode. It loads the PC with the address in `mtvec`. Nothing is saved on a stack: the general registers are left to the handler, consistently with the absence of hidden state noted in Lecture 18. The instruction `mret`, at the end of the handler, reverses everything: MIE recovers MPIE and the PC recovers `mepc`.

## Slide 15: The cause of a trap: mcause

The content of `mcause`. The top bit indicates whether the trap was an interrupt or an exception; the remaining bits are a code. The three interrupts, highlighted, are software, timer and external, that is, a device. Among the exceptions are illegal instruction, breakpoint, access fault on a load or store, and `ecall`. The same number may appear in both families with different meanings, which is why the top bit is needed. The breakpoint row explains how a debugger such as that of PRG32-QT halts a program.

## Slide 16: Interrupts on the PRG32 kit

All of this takes place on the kit. A timer interrupts the processor a hundred times per second, and the firmware uses it to keep time and pace the frames. The display and the audio interrupt when they require more data. The radio interrupts when a packet arrives, which is why a cartridge can be uploaded while a game runs. The functions `init`, `update` and `draw` are ordinary functions executed between interrupts. And a cartridge caught in a loop does not stop the interrupts: PRG32-QT reports an error, and on the board a watchdog reports the stall.

## Slide 17: Check your understanding: In which bits of a RISC-V instruction is the opcode? / During the fetch of an RV32 instruction that is not compressed, the PC is increased by:

For the first question one returns to the slide of the formats: one field occupies the same position in all four rows.

For the second: addresses count bytes, and the question is how many bytes a 32-bit instruction occupies.

## Slide 18: Check your understanding: Which register holds the address at which an interrupted RISC-V program will resume? / Which of these is an exception rather than an interrupt, in RISC-V terms?

For the first question, four registers are involved: one holds the address of the handler, one the cause, one the address at which to resume. `ra` belongs to procedure calls, not to traps.

For the second, the definition applies: an exception is caused by the instruction being executed, whereas an interrupt arrives from outside at an arbitrary moment. Three of the four events originate outside the program.

## Slide 19: Glossary: English and Italian

Twelve terms. The *operation code* is the *codice operativo*; an *addressing mode* is a *modo di indirizzamento*. *Fetch*, *decode* and *execute* are *prelievo*, *decodifica* and *esecuzione*. The *interrupt service routine* is the routine that serves an interrupt. *Interrupt latency* is the delay between the request and the start of useful work. *To mask* an interrupt is to prevent its acceptance temporarily.

## Slide 20: Conclusions and reading

Five conclusions. An instruction is an operation code with its operands; in RISC-V it is always 32 bits long, in six regular formats, unless compressed. A fixed length keeps the fetch simple: the PC advances by a constant, 4 for an uncompressed instruction. The processor executes a cycle: fetch, decode, execute, write the result. Exceptional events interrupt the cycle: the processor records where it was, serves the event and resumes. Interrupts can be enabled, masked and prioritised, and RISC-V achieves all of this with a handful of registers and `mret`. The next lecture leaves the processor for the buses and the video card.
