# Lecture 14: Elementary Machines: Registers and Buses

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: shift registers; registers as flip-flops; buses and three-state gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: memory-mapped I/O (Lecture 15); memories and addresses (Lecture 15). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Elementary Machines: Registers and Buses

The previous lecture built a register out of flip-flops. This one asks how registers talk to each other: how a word goes from one to another, along which wires, and what happens when many registers share the same wires. The answers are the bus, the three-state buffer and the shift register. Doc Brown's line on the cover is ironic here: data do need roads, and a bus is exactly that. The warm-up starts from a fact about the kit: its display receives every pixel one bit at a time.

## Slide 2: What you will be able to do by the end

Five objectives. Describe a register as a set of flip-flops with a common clock and a load signal. Explain what a bus is and compare dedicated buses with a common bus. Say why a common bus needs three-state buffers and what high impedance means. Describe a shift register and its four combinations of serial and parallel input and output. And convert a datum from parallel to serial and back, in hardware and in assembly.

## Slide 3: Word gates

A *word* is a vector of n bits. A *word gate* is n identical gates that share one control input: with the control at 1 the word passes unchanged, with the control at 0 every bit is forced to 0. It is the natural extension of a gate from one bit to a word. The bitwise instructions of RISC-V are word gates thirty-two bits wide, and the multiplexer on words of Lecture 11 is built from them.

## Slide 4: The register

A *register* stores a group of bits: in its simplest form it is a group of flip-flops with a common clock. The classic example in one chip is the 74273, with eight D flip-flops, one clock and one clear. *Loading* a register means storing the datum present on its inputs, and it happens when the load signal is active, normally in step with the clock. Each of the registers x1 to x31 of RISC-V is thirty-two such flip-flops.

## Slide 5: Data transfers and the bus

A *bus* is the set of lines that carries a datum between the components of a system. The word comes from the Latin *omnibus*, "for all". A bus of n lines carries a word of n bits in one step. The transfer from a register X to a register Y is the elementary action from which everything else is built: almost every instruction you have written is, underneath, a short sequence of register transfers.

## Slide 6: Two technical solutions

Two ways of connecting registers. With *dedicated buses* each possible transfer has its own lines: several transfers can happen at once, but the wires grow with the square of the number of registers. With a *common bus* one path serves all the transfers: each time one source and one destination are chosen, and a transfer takes two steps, from the source to the bus and from the bus to the destination. It is cheap and widespread, at the price of doing one transfer at a time.

## Slide 7: Parallel, serial and mixed transfers

A transfer can be *parallel*, with the n bits travelling together on n lines in one step, or *serial*, with the bits travelling one after another on a single line in n steps, or a mixture, for example one byte at a time. Remember the last line: inside a chip buses are parallel; between chips and between machines they are today almost always serial, because at very high speed it is easier to keep one line clean than thirty-two lines in step.

## Slide 8: From bus to register, and from register to bus

The two halves of a transfer on a common bus. On the left, from the bus to a register: the datum on the bus is loaded into R when the load signal is active. On the right, from a register to the bus: the outputs of R reach the bus through a buffer, and only while the enable signal is active. The question at the bottom leads to the next section: when the enable is not active, what must the output of the buffer be, so as not to disturb the bus?

## Slide 9: The three-state gate

A *three-state* output has a third condition besides 0 and 1: *high impedance*, written z, in which the output is electrically disconnected from the wire. An enable input decides: when it is 1 the gate works normally, when it is 0 the output is z. The table shows it for an AND with enable: four rows of an ordinary AND, and a last row in which the output floats whatever the inputs. Electrically, both transistors of the output stage are switched off.

## Slide 10: Enabling a bus

Applied to a whole word, a three-state gate lets a bus through or disconnects it: when the enable is active the output bus reproduces the input bus; otherwise all its lines are at high impedance. The pins of the chip of the kit work in this way: each can be configured as an output, which drives the wire, or released and used as an input. The joystick pins are inputs; the display pins are outputs.

## Slide 11: Connecting buses: the bus OR

The complete scheme of a common bus. Each source register reaches the bus through a three-state buffer with its own enable. The rule is strict: at most one enable is active at a time, so that one source drives the bus and all the others are disconnected. On the other side every destination register is connected to the bus, and only the one whose load signal is active takes the datum. Choosing the source and the destination is the job of decoders driven by the control unit.

## Slide 12: Shift registers

A *shift register* is a chain of one-bit cells in which, at every clock pulse, each bit moves to the adjacent cell. Each cell is a D flip-flop whose input is the output of its neighbour. The edge-triggered behaviour of the flip-flop is essential: with transparent latches a bit would run through the whole chain during a single clock pulse. The shift can be in a fixed direction or in a direction chosen by a control line.

## Slide 13: Four kinds of shift register

The same chain of flip-flops gives four machines, according to where the data enter and leave. Serial in, serial out: a delay line. Serial in, parallel out: it collects bits arriving one at a time and presents the whole word. Parallel in, serial out: it takes a word and sends it out bit by bit. Parallel in, parallel out, with no shifting, is the ordinary register. The second and the third are the two ends of every serial connection.

## Slide 14: Transfers between registers

Two ways of moving a word between registers. In a serial transfer the serial output of one shift register feeds the serial input of another: n clock pulses, one wire. In a parallel transfer the outputs of one register feed the inputs of another: one clock pulse, n wires. The phrase on the right is the trade-off of the whole lecture: moving a word of n bits costs either time or copper.

## Slide 15: Serial to parallel and back

A complete serial connection in five steps: the datum is loaded in parallel into a shift register; it is shifted out, one bit per step; the bits travel on a single line; at the other end a second shift register collects them, one per step; and the rebuilt word is passed on in parallel. This is the hardware of the warm-up, and it is how the display of the kit receives every pixel. Every serial standard, from the old serial port to USB, rests on a pair of shift registers.

## Slide 16: Registers with an address: a first memory

Four registers of three bits and a decoder make a small memory. Two address lines choose, through the decoder, one of the four registers; three lines carry the data in and three carry them out. Three control lines complete it: *chip select*, so that the memory responds only when selected; a line that says read or write; and *output enable*, which controls three-state outputs so that several memories can share one bus. Nothing here is new: decoder, registers, three-state buffers. The next lecture scales it up.

## Slide 17: Check your understanding: Why does a common bus need three-state buffers? / How many clock pulses does a serial transfer of a 32-bit word need?

Think of two outputs connected to the same wire, one at 0 and one at 1. A three-state buffer has nothing to do with speed, with storing or with conversion: it disconnects the sources that are not chosen.

One bit per clock pulse. The alternative, a parallel transfer, would take one pulse and thirty-two wires.

## Slide 18: Check your understanding: A memory has 10 address lines and 8 data lines. How many bits does it store?

Ten address lines select one word among 2 to the 10; each word has 8 bits. Multiply the two numbers. The first option multiplies the lines instead of using the power.

## Slide 19: Glossary: English and Italian

Ten terms. *Three-state*, or tri-state, is *a tre stati*; *high impedance* is *alta impedenza*. A *shift register* is a *registro a scorrimento*. *Load* and *strobe* indicate the signal that makes a register take its input. *Chip select* is the line that chooses which device on a shared bus must respond.

## Slide 20: Conclusions and reading

Five conclusions. A register is a form of memory with an elementary way of working. Registers are read and written through buses. A common bus needs three-state circuits: 0, 1 and disconnected. Data travel serially or in parallel, and shift registers convert between the two. And a decoder in front of a group of registers makes a memory, which is the subject of the next lecture.
