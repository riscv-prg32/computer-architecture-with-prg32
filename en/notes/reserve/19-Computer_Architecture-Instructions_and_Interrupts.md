# Lecture 19: Instructions and Interrupts

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Instructions of fixed or of variable length

Instructions can be of fixed or of variable length. With a *fixed* length every instruction has the same number of bits, the next one is always at the PC plus a constant, and fetching and decoding are simple: this is the RISC choice. With a *variable* length the processor discovers how long an instruction is only after decoding its first part: programs are more compact, decoding is harder; this is the CISC choice. RISC-V with the compressed extension mixes 16 and 32 bits, and the two lowest bits tell them apart.

## Who interrupted? Two solutions

With several devices, who interrupted? Two solutions. With *polling*, every device has a status register; the service routine interrogates the devices in order of priority and serves the first that has its bit set. It is simple, but it wastes time on devices that asked for nothing. With *vectored* interrupts the source supplies its identity together with the request, and the processor jumps directly to the corresponding routine. It is efficient, and the number of bits of the vector limits the number of sources.

## Priorities and nesting

Priorities, in two processors. When a request arrives while another is being served, a rule is needed: only requests of higher priority are accepted. The Motorola 68000 encodes the level of a request on three lines and compares it with a mask in the status register; level 7 cannot be masked. RISC-V delegates priorities to an interrupt controller with a threshold, and by default disables all interrupts during a handler. Serving one interrupt inside another is called *nesting*. The last rows compare how the source is identified and how one returns.
