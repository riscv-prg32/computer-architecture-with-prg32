# Lecture 14: Elementary Machines: Registers and Buses

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: shift registers; registers as flip-flops; buses and three-state gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: memory-mapped I/O (Lecture 15); memories and addresses (Lecture 15). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) explain how registers share a bus through three-state buffers; (2) use a shift register for serial transfer. Builds on: registers as flip-flops (Lecture 13). Next: Lecture 15, Memory.

Closing thread: A bus is a road that only one register may drive at a time, and a shift register turns a word into a stream of bits: the display of the kit receives its pixels this way. Next: memory.

## Slide 1: Elementary Machines: Registers and Buses

The previous lecture built a register from flip-flops. This one asks how registers communicate: how a word passes from one to another, along which wires, and what happens when many registers share the same wires. The answers are the bus, the three-state buffer and the shift register, the elementary machines of every datapath. Doc Brown's line on the cover is ironic in this context: data most certainly need roads, and a bus is exactly that. The warm-up starts from a fact about the kit: its display receives every pixel one bit at a time.

## Slide 2: What you will be able to do by the end

Five learning outcomes. Describing a register as a set of flip-flops with a common clock and a load signal. Explaining what a bus is and comparing dedicated buses with a common bus. Stating why a common bus requires three-state buffers and what high impedance means. Describing a shift register and its four combinations of serial and parallel input and output. And converting a datum from parallel to serial form and back, both in hardware and in assembly.

## Slide 3: Word gates

A *word* is a vector of n bits. A *word gate* consists of n identical gates sharing one control input: with the control at 1 the word passes unchanged, with the control at 0 every bit is forced to 0. It is the natural generalisation of a gate from a bit to a word. The bitwise instructions of RISC-V are word gates thirty-two bits wide, and the word multiplexer of Lecture 11 is built from them.

## Slide 4: The register

A *register* stores a group of bits; in its simplest form it is a group of flip-flops with a common clock. The classic single-chip example is the 74273, with eight D flip-flops, one clock and one clear input. *Loading* a register means storing the datum present at its inputs, which occurs when the load signal is active, normally in synchrony with the clock. Each of the RISC-V registers x1 to x31 consists of thirty-two such flip-flops.

## Slide 5: Data transfers and the bus

A *bus* is the set of lines that carries a datum between the components of a system; the word derives from the Latin *omnibus*, "for all". A bus of n lines carries an n-bit word in one step. The transfer from a register X to a register Y is the elementary action from which all others are composed: almost every instruction written so far is, at the level of the hardware, a short sequence of register transfers, a description known as register-transfer level.

## Slide 6: Two technical solutions

Two ways of interconnecting registers. With *dedicated buses* each possible transfer has its own lines: several transfers may occur simultaneously, but the wiring grows with the square of the number of registers. With a *common bus* a single path serves every transfer: on each occasion one source and one destination are selected, and a transfer takes two steps, from the source onto the bus and from the bus into the destination. It is economical and widespread, at the price of performing one transfer at a time. The choice is an archetypal trade-off between cost and parallelism.

## Slide 7: Parallel, serial and mixed transfers

A transfer may be *parallel*, with the n bits travelling together on n lines in one step; *serial*, with the bits travelling in sequence on one line over n steps; or mixed, for example one byte at a time. The last line records a significant trend: within a chip buses are parallel, whereas between chips and between machines they are today almost invariably serial, because at very high speed it is easier to keep one line clean than to keep thirty-two lines synchronised.

## Slide 8: From bus to register, and from register to bus

The two halves of a transfer on a common bus. On the left, from the bus into a register: the datum on the bus is loaded into R when the load signal is active. On the right, from a register onto the bus: the outputs of R reach the bus through a buffer, and only while the enable signal is active. The question at the bottom introduces the next section: when the enable is inactive, what must the output of the buffer be in order not to disturb the bus?

## Slide 9: The three-state gate

A *three-state* output has a third condition besides 0 and 1: *high impedance*, written z, in which the output is electrically disconnected from the wire. An enable input decides: when it is 1 the gate operates normally, when it is 0 the output is z. The table shows this for an AND with enable: four rows of an ordinary AND, and a final row in which the output floats regardless of the inputs. Electrically, both transistors of the output stage are switched off.

## Slide 10: Enabling a bus

Applied to a whole word, a three-state gate either passes a bus through or disconnects it: when enabled, the output bus reproduces the input bus; otherwise all its lines are in high impedance. The pins of the chip of the kit operate in this way: each can be configured as an output, which drives its wire, or released and used as an input. The joystick pins are inputs; the display pins are outputs.

## Slide 11: Connecting buses: the bus OR

The complete scheme of a common bus. Each source register reaches the bus through a three-state buffer with its own enable. The rule is strict: at most one enable may be active at any time, so that exactly one source drives the bus while all others are disconnected; two active sources would contend for the wire. On the receiving side every destination register is connected to the bus, and only the one whose load signal is active captures the datum. Selecting source and destination is the task of decoders driven by the control unit, which Lecture 18 describes.

## Slide 12: Shift registers

A *shift register* is a chain of one-bit cells in which, at each clock pulse, every bit moves to the adjacent cell. Each cell is a D flip-flop whose input is the output of its neighbour. The edge-triggered behaviour of the flip-flop is essential: with transparent latches a bit would race through the entire chain during a single clock pulse. The shift may be in a fixed direction or in a direction selected by a control line.

## Slide 13: Four kinds of shift register

The same chain of flip-flops yields four machines, depending on where data enter and leave. Serial in, serial out: a delay line. Serial in, parallel out: it collects bits arriving one at a time and presents the complete word. Parallel in, serial out: it accepts a word and emits it bit by bit. Parallel in, parallel out, without shifting, is the ordinary register. The second and third are the two ends of every serial connection.

## Slide 14: Transfers between registers

Two ways of moving a word between registers. In a serial transfer the serial output of one shift register feeds the serial input of another: n clock pulses, one wire. In a parallel transfer the outputs of one register feed the inputs of another: one clock pulse, n wires. The phrase on the right states the trade-off of the whole lecture: moving an n-bit word costs either time or copper.

## Slide 15: Serial to parallel and back

A complete serial link in five steps: the datum is loaded in parallel into a shift register; it is shifted out, one bit per step; the bits travel on a single line; at the far end a second shift register collects them, one per step; and the reconstructed word is delivered in parallel. This is the hardware counterpart of the warm-up, and the means by which the display of the kit receives every pixel. Every serial standard, from the historic serial port to USB, rests on a pair of shift registers.

## Slide 16: Registers with an address: a first memory

Four three-bit registers and a decoder constitute a small memory. Two address lines select, through the decoder, one of the four registers; three lines carry data in and three carry data out. Three control lines complete the design: *chip select*, so that the memory responds only when selected; a read/write line; and *output enable*, which controls three-state outputs so that several memories can share one bus. Nothing here is new, only decoder, registers and three-state buffers; the next lecture scales the same structure up to main memory.

## Slide 17: Check your understanding: Why does a common bus need three-state buffers? / How many clock pulses does a serial transfer of a 32-bit word need?

For the first question one imagines two outputs connected to the same wire, one at 0 and the other at 1. A three-state buffer concerns neither speed, nor storage, nor conversion: it disconnects the sources that have not been selected.

For the second: one bit per clock pulse. The alternative, a parallel transfer, would take one pulse and thirty-two wires.

## Slide 18: Check your understanding: A memory has 10 address lines and 8 data lines. How many bits does it store?

Ten address lines select one word among 2^10, and each word has 8 bits; the two numbers are multiplied. The first option multiplies the numbers of lines instead of raising two to the power of the address lines, a frequent error.

## Slide 19: Glossary: English and Italian

Ten terms. *Three-state*, or tri-state, is *a tre stati*; *high impedance* is *alta impedenza*. A *shift register* is a *registro a scorrimento*. *Load* and *strobe* denote the signal that causes a register to capture its input. *Chip select* is the line that designates which device on a shared bus must respond.

## Slide 20: Conclusions and reading

Five conclusions. A register is a form of memory with an elementary mode of operation. Registers are read and written through buses. A common bus requires three-state circuits: 0, 1 and disconnected. Data travel serially or in parallel, and shift registers convert between the two forms. And a decoder placed in front of a group of registers constitutes a memory, which is the subject of the next lecture.
