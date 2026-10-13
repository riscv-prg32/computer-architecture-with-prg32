# Lecture 18: The Processor

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## How real processors differ from the model

Real processors differ from the model in several ways: more or fewer general registers, registers that are really memory locations, an input/output section that is missing and delegated to other chips, a simple arithmetic unit extended by dedicated chips. The right column says how RISC-V on the kit resolves each point: thirty-two registers in a bank, no I/O section, optional extensions instead of extra chips. The M extension adds multiplication and division; the floating-point extension is absent on the kit.

## Words or bytes: the length of machine words

How long is a machine word? In *word* processors all instructions have the same length, sized on the longest piece of information: RISC-V instructions are all 32 bits, or 16 in the compressed form. In *character* processors the length varies in multiples of a byte: x86 instructions go from 1 to 15 bytes. A fixed length wastes some space but makes decoding simple, which matters for speed.

## Kinds of registers

Registers can be specialised or general. Specialised registers need different instructions for the same operation on different banks; general registers give more flexibility. They can be organised as a small addressable memory, a bank in which register number i is selected, or as separate registers with their own names. RISC-V chooses a single bank of thirty-two registers, each selected by five bits inside the instruction. The names `t0`, `a0`, `sp` are only conventions.

## The arithmetic logic unit

The ALU carries out the arithmetic and logic operations between operands: it is the combinational machine of Lecture 11, with two inputs and one output. In simple architectures it is entirely inside the processor; in complex ones the most sophisticated operations are delegated to separate units. In RISC-V these units are the extensions: M for multiplication and division, F and D for floating point.
