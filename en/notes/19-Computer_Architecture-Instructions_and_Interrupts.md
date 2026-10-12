# Lecture 19: Instructions and Interrupts

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Instructions and Interrupts

The previous lecture described what a processor is made of. This one describes what it does. It has two halves. The first follows a single instruction: how it is encoded in 32 bits and which steps the processor takes to carry it out. The second explains what happens when something more urgent than the current program arrives, a timer, a device, an error, and the processor must leave what it is doing and come back later. The joke on the cover is nearly true, as you will see.

## Slide 2: What you will be able to do by the end

Six objectives. Describe an instruction as an operation code with operands. Decode a RISC-V instruction by hand. Follow an instruction through the five phases of the processor cycle. Explain what a pipeline is and why it speeds a processor up. Define interrupt, exception and trap, three words that RISC-V uses precisely. And describe what the hardware does at a trap and how the interrupted program resumes.

## Slide 3: Warm-up on the machine

The warm-up shows a function you wrote in Lecture 02, as the processor sees it: no names, no mnemonics, only numbers in memory.

## Slide 4: Four words in memory

Four words of memory, four addresses apart: this is `first_update`, the function that increments a counter. On the left the addresses, in the middle the machine code, on the right what you wrote. The processor has only the middle column. Three questions organise the lecture. How does it know that the first word is a load and the second an addition? Which steps does it take for each? And while it executes them, how does it notice that a button was pressed or a timer expired?

## Slide 5: Instructions

The first part: what an instruction is, how RISC-V encodes it, and where operands can be found.

## Slide 6: What an instruction is made of

Every processor has four families of instructions: transfers between memory and registers, arithmetic and logic, control of flow, and input/output. An instruction is an *operation code*, the opcode, which says what to do, followed by zero or more *operands*, which say on what. An operand can be a constant written inside the instruction, an immediate; a memory location; or a register. Some operands are implicit: an accumulator machine does not name the accumulator. Instructions have from zero to three operands.

## Slide 7: The formats of RISC-V instructions

The formats of RISC-V. All instructions are 32 bits long, divided into fields. In the R format, for operations between registers, there are three register numbers of five bits, `rs1`, `rs2` and `rd`, and three fields that select the operation. In the I format the second source register is replaced by a 12-bit immediate. S and B, for stores and branches, split the immediate in two pieces. U and J carry a 20-bit immediate. Notice the regularity: the opcode is always in the lowest seven bits, and the registers are always in the same positions.

## Slide 8: Decoding by hand

Two instructions decoded by hand. Write the eight hexadecimal digits in binary; cut off the last seven bits, the opcode, which tells you the format; then cut the remaining fields. For 0x006283B3 the opcode says register to register, the fields give x7, x5 and x6, and `funct3` with `funct7` say addition: `add t2, t0, t1`. For 0x0002A303 the opcode says load, the immediate is 0, the base is x5, the destination x6: `lw t1, 0(t0)`. Do it once with pencil and paper.

## Slide 9: Instructions of fixed or of variable length

Instructions can be of fixed or of variable length. With a *fixed* length every instruction has the same number of bits, the next one is always at the PC plus a constant, and fetching and decoding are simple: this is the RISC choice. With a *variable* length the processor discovers how long an instruction is only after decoding its first part: programs are more compact, decoding is harder; this is the CISC choice. RISC-V with the compressed extension mixes 16 and 32 bits, and the two lowest bits tell them apart.

## Slide 10: Addressing modes: where an operand is found

An *addressing mode* is a way of finding an operand. RISC-V has four. *Immediate*: the operand is a constant inside the instruction. *Register*: it is the content of a register. *Base plus displacement*: it is the memory word at the address given by a register plus a constant, the only way to reach memory. *PC-relative*: an address at a certain distance from the instruction itself, used by branches. Memory-indirect addressing, where the address itself is in memory, does not exist: it takes two loads.

## Slide 11: The processor cycle

The second part: the cycle, the algorithm that the processor repeats for every instruction, from the moment it is switched on.

## Slide 12: The phases of the cycle

Five phases. *Fetch*: the instruction at the address in the PC is read from memory, and the PC advances. *Decode*: the opcode is recognised and the registers named in the instruction are read. *Execute*: the ALU computes a result, an address or a comparison. *Memory*: loads read the memory, stores write it, the other instructions do nothing here. *Write back*: the result is written in the destination register. After the initial bootstrap, the processor repeats this cycle for ever.

## Slide 13: The fetch phase, transfer by transfer

The fetch phase in four register transfers, using the registers of the model of Lecture 18. The content of the PC goes to MA, the memory address register. The memory is read and the word arrives in MB, the buffer. The word is copied into D, the decoding register. The PC is increased by 4, because an instruction occupies four bytes, so that it points to the next one. Each row is a transfer on the internal bus, commanded by the control unit.

## Slide 14: The rest of the cycle for two instructions

The other four phases, side by side for two instructions. For `add`, decoding reads the two registers into the operand registers of the ALU, execution adds them, the memory phase is skipped, and the sum is written in `t2`. For `lw`, the second operand is the immediate, the sum is an *address*, the memory phase reads the word at that address, and the word read is written in `t1`. The same adder serves both: only the commands of the control unit differ.

## Slide 15: The pipeline

If each phase has its own hardware, the phases of different instructions can overlap. In the table, each row is an instruction and each column a clock cycle: while the first instruction is in execution, the second is being decoded and the third fetched. Each instruction still takes five cycles, but one finishes at every cycle: this is the *pipeline*, the same idea as an assembly line. Superscalar processors put several pipelines side by side. The main core of the kit has a pipeline of four stages.

## Slide 16: Interrupts

The third part: the cycle described so far never looks at the outside world. Interrupts are the mechanism that makes it do so.

## Slide 17: The problem with the simple cycle

A processor that only fetched, decoded and executed would have three problems. Communication with devices would be inefficient: the program would have to keep asking each device whether it has something to say. A program that entered an endless loop by mistake, like the `j loop` on the slide, could never be removed. And the operating system would have little control over the machine. All three have the same solution: a way to take the processor away from the running program.

## Slide 18: Interrupts

The definition: *interrupts* are exceptional events, usually asynchronous with respect to the program in execution, that require the attention of the processor. RISC-V uses three distinct words. An *interrupt* comes from outside the program, at any moment: a timer, a device. An *exception* is caused by the instruction being executed: an illegal opcode, a forbidden address. A *trap* is the transfer of control to a handler, whatever caused it. Other processors use these words more loosely.

## Slide 19: The real processor cycle

The real cycle. After the bootstrap the processor fetches, decodes and executes; then, at the end of every instruction, it checks whether an interrupt is pending. If not, it goes back to fetch. If so, it takes the trap: it passes to the privileged state and starts executing a routine of the system, the handler. When the handler finishes, the suspended program resumes as if nothing had happened. Follow the two paths on the diagram: the short loop is the normal case.

## Slide 20: Possible causes of interruption

Six causes of interruption. A *periodic* interrupt from a timer, to share the processor among programs. An *I/O* interrupt, with which a peripheral reports that it is ready. *Errors in the program*, such as an instruction that does not exist: these are the exceptions. *Faults* of the system: power, temperature. *Reset*, which brings everything back to a known state. And the *software* interrupt, with which a program asks the operating system for a service: in RISC-V it is the instruction `ecall`.

## Slide 21: Handling an interrupt

The general procedure in six steps. Save the context, hardware part: at least the address at which to resume. Identify the cause. Jump to the entry point of the *interrupt service routine*. Save the context, software part: the registers the routine is going to use. Serve the interrupt. Finally restore the context and resume the suspended program at the instruction after the last one executed. The *context* is everything that the interrupted program needs to find unchanged.

## Slide 22: Who interrupted? Two solutions

With several devices, who interrupted? Two solutions. With *polling*, every device has a status register; the service routine interrogates the devices in order of priority and serves the first that has its bit set. It is simple, but it wastes time on devices that asked for nothing. With *vectored* interrupts the source supplies its identity together with the request, and the processor jumps directly to the corresponding routine. It is efficient, and the number of bits of the vector limits the number of sources.

## Slide 23: The RISC-V solution

Now the same ideas as RISC-V implements them: a few control and status registers and one instruction.

## Slide 24: The registers of the trap mechanism

Six registers. `mtvec`, written once by the firmware, holds the address of the trap handler. `mstatus` contains MIE, the global interrupt enable, and MPIE, its previous value. `mie` has one enable bit for each source, `mip` one pending bit for each source. `mepc` receives, at each trap, the address of the interrupted instruction. `mcause` receives the cause. The middle column matters: some registers are written by the firmware to configure the mechanism, others by the hardware when a trap occurs.

## Slide 25: What the hardware does on a trap

What the hardware does at a trap, in order. It writes in `mepc` the address of the interrupted instruction. It writes the cause in `mcause`. It copies MIE into MPIE and clears MIE, so that further interrupts are disabled. It passes to machine mode. It loads the PC with the address in `mtvec`. Nothing is saved on a stack: the general registers are left to the handler. The instruction `mret`, at the end of the handler, undoes everything: MIE gets MPIE back and the PC gets `mepc`.

## Slide 26: The cause of a trap: mcause

The content of `mcause`. The top bit says whether it was an interrupt or an exception; the rest is a code. The three interrupts, highlighted: software, timer, and external, that is a device. Among the exceptions: illegal instruction, breakpoint, access fault on a load or a store, and `ecall`. The same number can appear in both families with different meanings, which is why the top bit is needed. The breakpoint row explains how a debugger such as that of PRG32-QT stops your program.

## Slide 27: A trap handler, in outline

A handler in outline. It makes room on the stack and saves the registers it is going to use: the software part of the context. It reads `mcause` with `csrr` and tests its sign: the top bit is the sign bit, so `bgez` separates exceptions from interrupts with one instruction. After serving the event it restores the registers, releases the stack and executes `mret`. The interrupted program must not notice anything: one register left dirty here is a bug that appears at random, anywhere.

## Slide 28: Priorities and nesting

Priorities, in two processors. When a request arrives while another is being served, a rule is needed: only requests of higher priority are accepted. The Motorola 68000 encodes the level of a request on three lines and compares it with a mask in the status register; level 7 cannot be masked. RISC-V delegates priorities to an interrupt controller with a threshold, and by default disables all interrupts during a handler. Serving one interrupt inside another is called *nesting*. The last rows compare how the source is identified and how one returns.

## Slide 29: Interrupts on the PRG32 kit

All of this happens on the kit. A timer interrupts the processor a hundred times per second, and the firmware uses it to keep time and pace the frames. The display and the audio interrupt when they want more data. The radio interrupts when a packet arrives, which is why you can upload a cartridge while a game runs. Your `init`, `update` and `draw` are ordinary functions that run between interrupts. And a cartridge stuck in a loop does not stop the interrupts: PRG32-QT reports an error; on the board a watchdog reports the stall.

## Slide 30: Check your understanding: In which bits of a RISC-V instruction is the opcode?

Look again at the slide of the formats: one field is in the same place in all four rows.

## Slide 31: Check your understanding: During the fetch of an RV32 instruction that is not compressed, the PC is increased by:

Addresses count bytes. How many bytes does a 32-bit instruction occupy?

## Slide 32: Check your understanding: Which register holds the address at which an interrupted RISC-V program will resume?

Four registers are in play: one holds the address of the handler, one the cause, one the address at which to resume. `ra` belongs to function calls, not to traps.

## Slide 33: Check your understanding: Which of these is an exception rather than an interrupt, in RISC-V terms?

Use the definition: an exception is caused by the instruction being executed, an interrupt comes from outside at an arbitrary moment. Three of the four events come from outside.

## Slide 34: Exercises: paper first, then PRG32

Five exercises. Decode two words by hand, with format, fields and assembly. Encode `sub t0, t1, t2` and `sw a0, 8(sp)`: the inverse path. Write the register transfers of the whole cycle for a store and for a branch. Draw the pipeline diagram of six instructions on four stages and say when the sixth finishes. And in PRG32-QT stop in `first_update`, step, and compare the machine code shown with your decoding of the warm-up.

## Slide 35: Glossary: English and Italian

Twelve terms. The *operation code* is the *codice operativo*; an *addressing mode* is a *modo di indirizzamento*. *Fetch*, *decode* and *execute* are *prelievo*, *decodifica* and *esecuzione*. The *interrupt service routine* is the routine that serves an interrupt. *Interrupt latency* is the delay between the request and the start of useful work. *To mask* an interrupt is to prevent it temporarily from being accepted.

## Slide 36: Conclusions and reading

Five conclusions. An instruction is an operation code and its operands; in RISC-V always 32 bits in six regular formats. The length of the instructions determines how the PC moves. The processor has a cycle: fetch, decode, execute, write the result. Exceptional events break the cycle: the processor saves where it was, serves the event and resumes. Interrupts can be enabled, masked and ordered by priority, and RISC-V does it with a handful of registers and `mret`. The next lecture leaves the processor for the buses and the video card.
